import assert from "node:assert/strict";
import { existsSync, mkdtempSync, readFileSync, readdirSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { buildChatGptSkillSourceManifest } from "../scripts/chatgpt-skill-sources.mjs";
import { root, run, runInteractiveOnboarding } from "./helpers.mjs";

function yesNo(value) {
  return value ? "yes" : "no";
}

function onboardingAnswers(profile) {
  return [
    profile.setupLanguage ?? "",
    "",
    profile.primaryWork,
    profile.primaryUseCases,
    profile.workflowStyle,
    profile.adaptationNotes,
    profile.responseTone,
    profile.outputDir,
    profile.qaStrictness,
    yesNo(profile.autoUpload),
    yesNo(profile.deliveryRequiresRequest),
    yesNo(profile.requireQaAllowlist),
    "no",
    "no",
    "yes",
  ];
}

async function simulateCodexProfile(profile) {
  const target = mkdtempSync(join(tmpdir(), `framecore-profile-${profile.id}-`));
  const onboarding = await runInteractiveOnboarding(target, onboardingAnswers(profile));
  assert.equal(onboarding.status, 0, `${profile.id} onboarding failed: ${onboarding.stderr}`);

  run(["scripts/install.mjs", "--mode", "dry-run", "--target", target]);
  run(["scripts/install.mjs", "--mode", "project-local", "--target", target]);
  const doctor = run(["scripts/doctor.mjs", "--target", target]);
  assert.match(doctor, /FrameCore config is valid/);

  const configPath = join(target, "framecore.config.json");
  const configText = readFileSync(configPath, "utf8");
  const config = JSON.parse(configText);
  const orchestrator = readFileSync(join(target, ".codex/agents/workflow-orchestrator.toml"), "utf8");
  const qa = readFileSync(join(target, ".codex/agents/qa-iteration.toml"), "utf8");
  const delivery = readFileSync(join(target, ".codex/agents/delivery-documentation.toml"), "utf8");
  const manifest = JSON.parse(readFileSync(join(target, ".framecore/manifest.json"), "utf8"));

  assert.equal(config.work_profile.primary_work, profile.primaryWork);
  assert.equal(config.work_profile.primary_use_cases, profile.primaryUseCases);
  assert.equal(config.work_profile.workflow_style, profile.workflowStyle);
  assert.equal(config.work_profile.adaptation_notes, profile.adaptationNotes);
  assert.equal(config.response_tone, profile.responseTone);
  assert.equal(config.output_dir, profile.outputDir);
  assert.equal(config.qa_strictness, profile.qaStrictness);
  assert.equal(config.delivery.auto_upload, profile.autoUpload);
  assert.equal(config.delivery.delivery_requires_current_user_request, profile.deliveryRequiresRequest);
  assert.equal(config.delivery.require_qa_allowlist_for_generated_assets, profile.requireQaAllowlist);

  const controls = `qa_strictness = ${profile.qaStrictness}`;
  assert.match(orchestrator, new RegExp(controls));
  assert.match(orchestrator, new RegExp(`delivery\\.auto_upload = ${profile.autoUpload}`));
  assert.match(orchestrator, new RegExp(`delivery_requires_current_user_request = ${profile.deliveryRequiresRequest}`));
  assert.match(orchestrator, new RegExp(`require_qa_allowlist_for_generated_assets = ${profile.requireQaAllowlist}`));
  assert.match(qa, new RegExp(controls));
  assert.match(delivery, new RegExp(`delivery\\.auto_upload = ${profile.autoUpload}`));
  assert.doesNotMatch(`${orchestrator}${qa}${delivery}`, /\{\{[a-z0-9_]+\}\}/);

  const installedSkills = readdirSync(join(target, ".agents/skills"), { withFileTypes: true }).filter((entry) => entry.isDirectory()).length;
  const installedAgents = readdirSync(join(target, ".codex/agents")).filter((name) => name.endsWith(".toml")).length;
  assert.equal(installedSkills, 34);
  assert.equal(installedAgents, 20);
  assert.equal(manifest.incomplete, false);
  assert.ok(manifest.managed_paths.includes(".agents/skills/pipeline-core/references/prompt-format-and-continuity.md"));

  return { target, configText };
}

const profiles = [
  {
    id: "beginner-solo-creative",
    primaryWork: "solo social graphics and short creative videos",
    primaryUseCases: "simple briefs, prompt packs, storyboards, and draft review",
    workflowStyle: "lightweight guidance with short checkpoints",
    adaptationNotes: "explain specialist terms before using them",
    responseTone: "plain, patient, concise",
    outputDir: "output/creative-drafts",
    qaStrictness: "light",
    autoUpload: false,
    deliveryRequiresRequest: true,
    requireQaAllowlist: true,
  },
  {
    id: "strict-client-team",
    primaryWork: "client campaign production with a small team",
    primaryUseCases: "approved briefs, claim control, asset traceability, QA, and delivery",
    workflowStyle: "structured approvals with explicit owners and evidence",
    adaptationNotes: "preserve client facts and stop on unresolved approval gaps",
    responseTone: "formal, direct, audit-friendly",
    outputDir: "output/client-delivery",
    qaStrictness: "strict",
    autoUpload: false,
    deliveryRequiresRequest: true,
    requireQaAllowlist: true,
  },
  {
    id: "noncreative-research",
    primaryWork: "research notes and internal document workflows",
    primaryUseCases: "evidence summaries, structured drafts, review, and local delivery notes",
    workflowStyle: "use the smallest document route and skip irrelevant creative stages",
    adaptationNotes: "treat media skills as optional support rather than the default route",
    responseTone: "neutral, analytical, compact",
    outputDir: "output/research-notes",
    qaStrictness: "standard",
    autoUpload: false,
    deliveryRequiresRequest: true,
    requireQaAllowlist: true,
  },
];

test("Codex sandbox installs preserve distinct beginner, team, and noncreative profiles", async () => {
  for (const profile of profiles) {
    const simulation = await simulateCodexProfile(profile);
    try {
      if (profile.id === "strict-client-team") {
        run(["scripts/install.mjs", "--mode", "update", "--target", simulation.target]);
        assert.equal(readFileSync(join(simulation.target, "framecore.config.json"), "utf8"), simulation.configText);
        assert.match(run(["scripts/doctor.mjs", "--mode", "update", "--target", simulation.target]), /FrameCore config is valid/);
      }
    } finally {
      rmSync(simulation.target, { recursive: true, force: true });
    }
  }
});

test("ChatGPT core, creative, and full profile simulations resolve only declared skill sources", () => {
  const config = JSON.parse(readFileSync(join(root, "config/chatgpt-skills.json"), "utf8"));
  const manifest = buildChatGptSkillSourceManifest(root);
  const sources = new Map(manifest.skills.map((skill) => [skill.name, skill]));

  for (const profileName of ["core", "creative", "full"]) {
    const selected = config.profiles[profileName].skills.map((name) => sources.get(name));
    assert.equal(selected.every(Boolean), true, `${profileName} contains an unresolved skill source`);
    for (const skill of selected) {
      assert.ok(skill.files.some((file) => file.path === "SKILL.md"));
      assert.ok(skill.files.some((file) => file.path === "agents/openai.yaml"));
      assert.equal(skill.files.some((file) => file.repository_path.startsWith(".codex/agents/")), false);
      for (const file of skill.files) assert.equal(existsSync(join(root, file.repository_path)), true);
    }
  }

  const core = new Set(config.profiles.core.skills);
  const creative = new Set(config.profiles.creative.skills);
  const full = new Set(config.profiles.full.skills);
  for (const skill of core) assert.equal(creative.has(skill), true, `creative profile is missing core skill ${skill}`);
  for (const skill of creative) assert.equal(full.has(skill), true, `full profile is missing creative skill ${skill}`);
});
