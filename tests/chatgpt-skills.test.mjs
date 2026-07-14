import assert from "node:assert/strict";
import { readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";
import {
  buildChatGptSkillSourceManifest,
  validateChatGptRepositorySetup,
  writeChatGptSkillSourceManifest,
} from "../scripts/chatgpt-skill-sources.mjs";
import { copyRepoFixture, root } from "./helpers.mjs";

test("ChatGPT repository installer, profiles, sources, and UI metadata validate", () => {
  assert.deepEqual(validateChatGptRepositorySetup(root), []);
});

test("ChatGPT source manifest covers every repository skill in declared install order", () => {
  const config = JSON.parse(readFileSync(join(root, "config/chatgpt-skills.json"), "utf8"));
  const manifest = buildChatGptSkillSourceManifest(root);
  assert.equal(manifest.skills.length, 34);
  assert.deepEqual(manifest.skills.map((skill) => skill.name), config.profiles.full.skills);
  for (const skill of manifest.skills) {
    assert.ok(skill.files.some((file) => file.path === "SKILL.md"));
    assert.ok(skill.files.some((file) => file.path === "agents/openai.yaml"));
    for (const file of skill.files) {
      assert.match(file.sha256, /^[a-f0-9]{64}$/);
      assert.match(file.raw_url, /^https:\/\/raw\.githubusercontent\.com\//);
      assert.ok(file.repository_path.startsWith(`${skill.source_dir}/`));
    }
  }
});

test("new portable production skills are included in creative and full profiles", () => {
  const config = JSON.parse(readFileSync(join(root, "config/chatgpt-skills.json"), "utf8"));
  const expected = [
    "caption-studio",
    "creative-video-producer",
    "ecommerce-campaign-strategy-director",
    "opencut-video-studio",
    "producer-ai-task-builder",
    "remotion-video-production",
    "screenplay-story-architect",
  ];
  for (const skill of expected) {
    assert.ok(config.profiles.creative.skills.includes(skill), `creative profile is missing ${skill}`);
    assert.ok(config.profiles.full.skills.includes(skill), `full profile is missing ${skill}`);
  }
});

test("ChatGPT post-install invocation policy matches every skill metadata file", () => {
  const config = JSON.parse(readFileSync(join(root, "config/chatgpt-skills.json"), "utf8"));
  const invocation = config.post_install_invocation;
  assert.equal(invocation.allow_implicit_routing_for_eligible_skills, true);
  assert.equal(invocation.prefer_smallest_sufficient_route, true);
  assert.equal(invocation.full_pipeline_requires_explicit_request_or_multistage_fit, true);
  assert.equal(invocation.explicit_route_skill, "workflow-orchestrator");
  assert.equal(invocation.explicit_pipeline_skill, "pipeline-core");
  assert.deepEqual(invocation.explicit_only_skills, [
    "onboarding-preference-tuning",
    "hipson-adapter",
    "workflow-self-improvement",
  ]);

  const explicitOnly = new Set(invocation.explicit_only_skills);
  for (const name of config.profiles.full.skills) {
    const metadata = readFileSync(join(root, `.agents/skills/${name}/agents/openai.yaml`), "utf8");
    assert.match(metadata, new RegExp(`allow_implicit_invocation: ${!explicitOnly.has(name)}`));
  }
});

test("ChatGPT setup validation rejects stale repository source hashes", () => {
  const fixture = copyRepoFixture("framecore-chatgpt-source-stale-");
  const skill = join(fixture, ".agents/skills/brief-architect/SKILL.md");
  writeFileSync(skill, `${readFileSync(skill, "utf8")}\nRepository source changed.\n`);
  const errors = validateChatGptRepositorySetup(fixture);
  assert.ok(errors.some((error) => /source manifest is stale/.test(error.message)));
});

test("ChatGPT setup validation rejects a weak bootstrap contract", () => {
  const fixture = copyRepoFixture("framecore-chatgpt-bootstrap-");
  const bootstrap = join(fixture, "CHATGPT_INSTALL.md");
  writeFileSync(bootstrap, readFileSync(bootstrap, "utf8").replace("## First Response", "## Start"));
  const errors = validateChatGptRepositorySetup(fixture);
  assert.ok(errors.some((error) => /missing section: First Response/.test(error.message)));
});

test("ChatGPT setup validation rejects invocation metadata drift", () => {
  const fixture = copyRepoFixture("framecore-chatgpt-invocation-drift-");
  try {
    const metadata = join(fixture, ".agents/skills/brief-architect/agents/openai.yaml");
    writeFileSync(metadata, readFileSync(metadata, "utf8").replace("allow_implicit_invocation: true", "allow_implicit_invocation: false"));
    const errors = validateChatGptRepositorySetup(fixture);
    assert.ok(errors.some((error) => /brief-architect requires allow_implicit_invocation: true/.test(error.message)));
  } finally {
    rmSync(fixture, { recursive: true, force: true });
  }
});

test("ChatGPT source manifest updater repairs a stale fixture", () => {
  const fixture = copyRepoFixture("framecore-chatgpt-source-update-");
  try {
    const skill = join(fixture, ".agents/skills/brief-architect/SKILL.md");
    writeFileSync(skill, `${readFileSync(skill, "utf8")}\nUpdated fixture source.\n`);
    assert.ok(validateChatGptRepositorySetup(fixture).some((error) => /source manifest is stale/.test(error.message)));
    writeChatGptSkillSourceManifest(fixture);
    assert.deepEqual(validateChatGptRepositorySetup(fixture), []);
  } finally {
    rmSync(fixture, { recursive: true, force: true });
  }
});
