import assert from "node:assert/strict";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, symlinkSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { tmpdir } from "node:os";
import test from "node:test";
import { combinedOutput, copyRepoFixture, failRun, hidden, root, run, runInteractiveOnboarding, sha256 } from "./helpers.mjs";

test("validation rejects unknown handoff roles", () => {
  const dir = copyRepoFixture("framecore-validate-handoff-");
  const file = join(dir, ".agents/skills/pipeline-core/references/handoff-matrix.md");
  const text = readFileSync(file, "utf8");
  writeFileSync(file, `${text}\n| image-prompting | fake-role | prompt_pack |\n`);

  const result = failRun(["scripts/validate.mjs", dir]);
  assert.notEqual(result.status, 0);
  assert.match(`${result.stderr}${result.stdout}`, /UNKNOWN_HANDOFF_ROLE/);
});

test("validation rejects gate registry drift", () => {
  const dir = copyRepoFixture("framecore-validate-gate-");
  const file = join(dir, ".agents/skills/pipeline-core/references/gate-registry.md");
  const text = readFileSync(file, "utf8");
  writeFileSync(file, text.replace("`brief-architect` | Brief Contract", "`unknown-role` | Missing Artifact"));

  const result = failRun(["scripts/validate.mjs", dir]);
  assert.notEqual(result.status, 0);
  assert.match(`${result.stderr}${result.stdout}`, /UNKNOWN_GATE_OWNER_ROLE/);
  assert.match(`${result.stderr}${result.stdout}`, /MISSING_GATE_ARTIFACT_TEMPLATE/);
});

test("validation rejects duplicate gate and handoff rows", () => {
  const dir = copyRepoFixture("framecore-validate-duplicates-");
  const gateFile = join(dir, ".agents/skills/pipeline-core/references/gate-registry.md");
  const handoffFile = join(dir, ".agents/skills/pipeline-core/references/handoff-matrix.md");
  writeFileSync(gateFile, `${readFileSync(gateFile, "utf8")}\n| \`intent_lock\` | \`intent-confirmation\` | Task Confirmation |\n`);
  writeFileSync(handoffFile, `${readFileSync(handoffFile, "utf8")}\n| intent-confirmation | workflow-orchestrator | confirmed_goal |\n`);

  const result = failRun(["scripts/validate.mjs", dir]);
  assert.notEqual(result.status, 0);
  assert.match(`${result.stderr}${result.stdout}`, /DUPLICATE_GATE/);
  assert.match(`${result.stderr}${result.stdout}`, /DUPLICATE_HANDOFF/);
});

test("validation rejects weak workflow blueprints", () => {
  const dir = copyRepoFixture("framecore-validate-blueprints-");
  const file = join(dir, ".agents/skills/pipeline-core/references/workflow-blueprints.md");
  const text = readFileSync(file, "utf8");
  writeFileSync(file, text.replace("## HyperFrames Coded Video", "## Coded Video"));

  const result = failRun(["scripts/validate.mjs", dir]);
  assert.notEqual(result.status, 0);
  assert.match(`${result.stderr}${result.stdout}`, /WEAK_WORKFLOW_BLUEPRINTS/);
});

test("validation rejects weak inference reasoning policy", () => {
  const dir = copyRepoFixture("framecore-validate-inference-policy-");
  const file = join(dir, ".agents/skills/pipeline-core/references/inference-reasoning-methods.md");
  const text = readFileSync(file, "utf8");
  writeFileSync(file, text.replace("raw_trace_storage: forbidden", "raw_trace_storage: optional"));

  const result = failRun(["scripts/validate.mjs", dir]);
  assert.notEqual(result.status, 0);
  assert.match(`${result.stderr}${result.stdout}`, /WEAK_INFERENCE_REASONING_POLICY/);
});

test("validation rejects weak loop protocol", () => {
  const dir = copyRepoFixture("framecore-validate-loop-policy-");
  const file = join(dir, ".agents/skills/pipeline-core/references/loop-protocol.md");
  const text = readFileSync(file, "utf8");
  writeFileSync(file, text.replace("bounded_execution_packet", "execution_notes"));

  const result = failRun(["scripts/validate.mjs", dir]);
  assert.notEqual(result.status, 0);
  assert.match(`${result.stderr}${result.stdout}`, /WEAK_LOOP_PROTOCOL/);
});

test("validation rejects weak prompt format and continuity governance", () => {
  const dir = copyRepoFixture("framecore-validate-prompt-continuity-");
  const file = join(dir, ".agents/skills/pipeline-core/references/prompt-format-and-continuity.md");
  const text = readFileSync(file, "utf8");
  writeFileSync(file, text.replace("frame_chained_i2v", "linked_video"));

  const result = failRun(["scripts/validate.mjs", dir]);
  assert.notEqual(result.status, 0);
  assert.match(`${result.stderr}${result.stdout}`, /WEAK_PROMPT_FORMAT_CONTINUITY/);
});

test("validation rejects a creative prompt fixture that loses a strict continuity carrier", () => {
  const dir = copyRepoFixture("framecore-validate-creative-prompt-carrier-");
  const file = join(dir, "examples/contract-fixtures/creative-prompt-contracts.json");
  const fixtures = JSON.parse(readFileSync(file, "utf8"));
  const validVideo = fixtures.cases.find((entry) => entry.id === "valid-video-contract");
  validVideo.contract.continuity.continuity_carriers[0].state = "planned";
  writeFileSync(file, `${JSON.stringify(fixtures, null, 2)}\n`);

  const result = failRun(["scripts/validate.mjs", dir]);
  assert.notEqual(result.status, 0);
  assert.match(`${result.stderr}${result.stdout}`, /CREATIVE_PROMPT_FIXTURE_REJECTED/);
  assert.match(`${result.stderr}${result.stdout}`, /STRICT_CONTINUITY_CARRIER_REQUIRED/);
});

test("validation rejects creative prompt fixtures with an untested expected failure", () => {
  const dir = copyRepoFixture("framecore-validate-creative-prompt-fixture-");
  const file = join(dir, "examples/contract-fixtures/creative-prompt-contracts.json");
  const fixtures = JSON.parse(readFileSync(file, "utf8"));
  const invalidTarget = fixtures.cases.find((entry) => entry.id === "reject-target-without-source-check");
  invalidTarget.expected_code = "MISSING_EXPECTATION";
  writeFileSync(file, `${JSON.stringify(fixtures, null, 2)}\n`);

  const result = failRun(["scripts/validate.mjs", dir]);
  assert.notEqual(result.status, 0);
  assert.match(`${result.stderr}${result.stdout}`, /CREATIVE_PROMPT_FIXTURE_ACCEPTED/);
});

test("validation rejects a creative prompting guide without target-adaptation boundary", () => {
  const dir = copyRepoFixture("framecore-validate-creative-prompt-doc-");
  const file = join(dir, "docs/creative-prompting-workflow.md");
  writeFileSync(file, readFileSync(file, "utf8").replace("## Target Adaptation", "## Target Details"));

  const result = failRun(["scripts/validate.mjs", dir]);
  assert.notEqual(result.status, 0);
  assert.match(`${result.stderr}${result.stdout}`, /WEAK_CREATIVE_PROMPTING_DOC/);
});

test("validation rejects a ready Copy Pack fixture without bounded delivery-loop evidence", () => {
  const dir = copyRepoFixture("framecore-validate-copy-delivery-loop-");
  const file = join(dir, "examples/contract-fixtures/copy-delivery-contracts.json");
  const fixtures = JSON.parse(readFileSync(file, "utf8"));
  const validCopy = fixtures.cases.find((entry) => entry.id === "mandatory-delivery-loop-recorded");
  delete validCopy.record.copy_delivery_loop;
  writeFileSync(file, `${JSON.stringify(fixtures, null, 2)}\n`);

  const result = failRun(["scripts/validate.mjs", dir]);
  assert.notEqual(result.status, 0);
  const output = `${result.stderr}${result.stdout}`;
  assert.match(output, /COPY_DELIVERY_FIXTURE_REJECTED/);
  assert.match(output, /MISSING_COPY_DELIVERY_LOOP/);
});

test("validation rejects uncontrolled imperfection in a precision-critical Copy Pack", () => {
  const dir = copyRepoFixture("framecore-validate-copy-imperfection-");
  const file = join(dir, "examples/contract-fixtures/copy-delivery-contracts.json");
  const fixtures = JSON.parse(readFileSync(file, "utf8"));
  const validCopy = fixtures.cases.find((entry) => entry.id === "default-human-voice-has-no-artificial-errors");
  validCopy.record.human_voice_review.controlled_imperfection = {
    mode: "on",
    basis: "explicit_user_request",
    elements: ["ellipsis"],
    typo_count: 0
  };
  validCopy.record.author_context.channel = "business_email";
  writeFileSync(file, `${JSON.stringify(fixtures, null, 2)}\n`);

  const result = failRun(["scripts/validate.mjs", dir]);
  assert.notEqual(result.status, 0);
  const output = `${result.stderr}${result.stdout}`;
  assert.match(output, /COPY_DELIVERY_FIXTURE_REJECTED/);
  assert.match(output, /CONTROLLED_IMPERFECTION_PRECISION_CONFLICT/);
});

test("validation rejects a Human Voice guide without the bounded delivery loop", () => {
  const dir = copyRepoFixture("framecore-validate-human-voice-doc-");
  const file = join(dir, "docs/human-voice-and-copy-delivery.md");
  writeFileSync(file, readFileSync(file, "utf8").replace("## Delivery Loop", "## Editorial Review"));

  const result = failRun(["scripts/validate.mjs", dir]);
  assert.notEqual(result.status, 0);
  assert.match(`${result.stderr}${result.stdout}`, /WEAK_HUMAN_VOICE_DOC/);
});

test("validation requires every canonical gate including diagnostics and sufficiency", () => {
  const dir = copyRepoFixture("framecore-validate-required-gates-");
  const file = join(dir, ".agents/skills/pipeline-core/references/gate-registry.md");
  const text = readFileSync(file, "utf8");
  writeFileSync(file, text
    .replace(/^\| `request_diagnostic_fit`.*\n/m, "")
    .replace(/^\| `self_improvement_sufficiency_fit`.*\n/m, ""));

  const result = failRun(["scripts/validate.mjs", dir]);
  assert.notEqual(result.status, 0);
  const output = `${result.stderr}${result.stdout}`;
  assert.match(output, /MISSING_GATE.*request_diagnostic_fit/s);
  assert.match(output, /MISSING_GATE.*self_improvement_sufficiency_fit/s);
});

test("validation rejects skill-level gate and handoff drift", () => {
  const dir = copyRepoFixture("framecore-validate-skill-routing-");
  const gateFile = join(dir, ".agents/skills/image-prompt-architect/SKILL.md");
  const handoffFile = join(dir, ".agents/skills/humanizer/SKILL.md");
  writeFileSync(gateFile, readFileSync(gateFile, "utf8").replace("Review gate: `promptability_fit`.", "Review gate: `missing_prompt_gate`."));
  writeFileSync(handoffFile, readFileSync(handoffFile, "utf8").replace("Hand off to `copy-voice`", "Hand off to `missing-copy-role`"));

  const result = failRun(["scripts/validate.mjs", dir]);
  assert.notEqual(result.status, 0);
  const output = `${result.stderr}${result.stdout}`;
  assert.match(output, /UNKNOWN_SKILL_REVIEW_GATE/);
  assert.match(output, /UNKNOWN_SKILL_HANDOFF_TARGET/);
});

test("validation rejects role-to-skill map drift", () => {
  const dir = copyRepoFixture("framecore-validate-role-skill-map-");
  const file = join(dir, ".agents/skills/pipeline-core/references/role-skill-map.md");
  const text = readFileSync(file, "utf8");
  writeFileSync(file, text
    .replace("| `copy-voice` |", "| `missing-role` |")
    .replace("`hyperframes-workflow`", "`missing-hyperframes-skill`"));

  const result = failRun(["scripts/validate.mjs", dir]);
  assert.notEqual(result.status, 0);
  const output = `${result.stderr}${result.stdout}`;
  assert.match(output, /UNKNOWN_ROLE_SKILL_MAP_ROLE/);
  assert.match(output, /MISSING_ROLE_SKILL_MAP/);
  assert.match(output, /UNKNOWN_ROLE_SUPPORT_SKILL/);
});

test("validation rejects a skill handoff without a review gate", () => {
  const dir = copyRepoFixture("framecore-validate-skill-review-gate-");
  const file = join(dir, ".agents/skills/humanizer/SKILL.md");
  writeFileSync(file, readFileSync(file, "utf8").replace(/^Review gate:.*\n/m, ""));

  const result = failRun(["scripts/validate.mjs", dir]);
  assert.notEqual(result.status, 0);
  assert.match(`${result.stderr}${result.stdout}`, /MISSING_SKILL_REVIEW_GATE/);
});

test("validation rejects missing artifact schemas for gate-required artifacts", () => {
  const dir = copyRepoFixture("framecore-validate-artifact-schema-missing-");
  const schemaFile = join(dir, "config/artifact-schemas.json");
  const schema = JSON.parse(readFileSync(schemaFile, "utf8"));
  delete schema.artifacts["Brief Contract"];
  writeFileSync(schemaFile, JSON.stringify(schema, null, 2));

  const result = failRun(["scripts/validate.mjs", dir]);
  assert.notEqual(result.status, 0);
  assert.match(`${result.stderr}${result.stdout}`, /MISSING_ARTIFACT_SCHEMA/);
});

test("validation rejects artifact schema fields missing from templates", () => {
  const dir = copyRepoFixture("framecore-validate-artifact-schema-field-");
  const schemaFile = join(dir, "config/artifact-schemas.json");
  const schema = JSON.parse(readFileSync(schemaFile, "utf8"));
  schema.artifacts["Brief Contract"].required_fields.push("missing_field");
  writeFileSync(schemaFile, JSON.stringify(schema, null, 2));

  const result = failRun(["scripts/validate.mjs", dir]);
  assert.notEqual(result.status, 0);
  assert.match(`${result.stderr}${result.stdout}`, /ARTIFACT_SCHEMA_FIELD_MISSING_TEMPLATE/);
  assert.match(`${result.stderr}${result.stdout}`, /EXAMPLE_ARTIFACT_MISSING_FIELD/);
});

test("validation rejects artifact schemas without fixture coverage", () => {
  const dir = copyRepoFixture("framecore-validate-artifact-fixture-coverage-");
  const schemaFile = join(dir, "config/artifact-schemas.json");
  const schema = JSON.parse(readFileSync(schemaFile, "utf8"));
  delete schema.artifacts["Project State"].example_paths;
  writeFileSync(schemaFile, JSON.stringify(schema, null, 2));

  const result = failRun(["scripts/validate.mjs", dir]);
  assert.notEqual(result.status, 0);
  assert.match(`${result.stderr}${result.stdout}`, /MISSING_ARTIFACT_FIXTURE_COVERAGE/);
});

test("validation rejects registered artifact fixture paths that are missing", () => {
  const dir = copyRepoFixture("framecore-validate-artifact-fixture-missing-");
  rmSync(join(dir, "examples/contract-fixtures/artifacts/project-state.md"), { force: true });

  const result = failRun(["scripts/validate.mjs", dir]);
  assert.notEqual(result.status, 0);
  assert.match(`${result.stderr}${result.stdout}`, /MISSING_ARTIFACT_EXAMPLE/);
});

test("validation rejects artifact fixture paths outside public Markdown examples", () => {
  const dir = copyRepoFixture("framecore-validate-artifact-fixture-path-");
  const schemaFile = join(dir, "config/artifact-schemas.json");
  const schema = JSON.parse(readFileSync(schemaFile, "utf8"));
  schema.artifacts["Project State"].example_paths = [
    "docs/artifact-schemas.md",
    "examples/contract-fixtures/artifacts/._project-state.md"
  ];
  writeFileSync(schemaFile, JSON.stringify(schema, null, 2));

  const result = failRun(["scripts/validate.mjs", dir]);
  assert.notEqual(result.status, 0);
  assert.match(`${result.stderr}${result.stdout}`, /INVALID_ARTIFACT_FIXTURE_PATH/);
});

test("validation ignores AppleDouble markdown sidecars during link and example scans", () => {
  const dir = copyRepoFixture("framecore-validate-appledouble-ignore-");
  writeFileSync(join(dir, "._CHANGELOG.md"), "[broken](missing.md)\n");
  writeFileSync(join(dir, "examples/._README.md"), [
    "# Sidecar",
    "[broken](missing.md)"
  ].join("\n"));

  assert.match(run(["scripts/validate.mjs", dir]), /workflow validation passed/);
});

test("validation rejects example artifact fixtures missing required fields", () => {
  const dir = copyRepoFixture("framecore-validate-artifact-example-");
  const file = join(dir, "examples/end-to-end-creative-workflow/artifacts/brief-contract.md");
  const text = readFileSync(file, "utf8");
  writeFileSync(file, text.replace("- objective: Prepare", "- goal: Prepare"));

  const result = failRun(["scripts/validate.mjs", dir]);
  assert.notEqual(result.status, 0);
  assert.match(`${result.stderr}${result.stdout}`, /EXAMPLE_ARTIFACT_MISSING_FIELD/);
});

test("validation rejects weak text-bearing image prompt fixtures", () => {
  const dir = copyRepoFixture("framecore-validate-text-image-fixture-");
  const file = join(dir, "examples/contract-fixtures/artifacts/image-prompt-contract.md");
  const text = readFileSync(file, "utf8");
  writeFileSync(file, text.replace(" in one pass", ""));

  const result = failRun(["scripts/validate.mjs", dir]);
  assert.notEqual(result.status, 0);
  assert.match(`${result.stderr}${result.stdout}`, /WEAK_TEXT_IMAGE_ARTIFACT_FIXTURE/);
});

test("validation rejects missing example workflow manifests", () => {
  const dir = copyRepoFixture("framecore-validate-example-workflow-missing-");
  rmSync(join(dir, "examples/static-campaign/workflow.json"), { force: true });

  const result = failRun(["scripts/validate.mjs", dir]);
  assert.notEqual(result.status, 0);
  assert.match(`${result.stderr}${result.stdout}`, /MISSING_EXAMPLE_WORKFLOW/);
});

test("validation rejects missing required examples", () => {
  const dir = copyRepoFixture("framecore-validate-required-example-missing-");
  rmSync(join(dir, "examples/storyboard-board/README.md"), { force: true });

  const result = failRun(["scripts/validate.mjs", dir]);
  assert.notEqual(result.status, 0);
  assert.match(`${result.stderr}${result.stdout}`, /MISSING_REQUIRED_EXAMPLE/);
});

test("validation rejects unknown example workflow blueprints", () => {
  const dir = copyRepoFixture("framecore-validate-example-blueprint-");
  const file = join(dir, "examples/static-campaign/workflow.json");
  const workflow = JSON.parse(readFileSync(file, "utf8"));
  workflow.blueprint = "unregistered-blueprint";
  writeFileSync(file, `${JSON.stringify(workflow, null, 2)}\n`);

  const result = failRun(["scripts/validate.mjs", dir]);
  assert.notEqual(result.status, 0);
  assert.match(`${result.stderr}${result.stdout}`, /UNKNOWN_EXAMPLE_BLUEPRINT/);
});

test("validation rejects example workflows missing required blueprint coverage", () => {
  const dir = copyRepoFixture("framecore-validate-example-blueprint-coverage-");
  const file = join(dir, "examples/static-campaign/workflow.json");
  const workflow = JSON.parse(readFileSync(file, "utf8"));
  workflow.route = workflow.route.filter((role) => role !== "delivery-documentation");
  workflow.gates = workflow.gates.filter((gate) => gate !== "delivery_fit");
  writeFileSync(file, `${JSON.stringify(workflow, null, 2)}\n`);

  const result = failRun(["scripts/validate.mjs", dir]);
  const output = `${result.stderr}${result.stdout}`;
  assert.notEqual(result.status, 0);
  assert.match(output, /MISSING_EXAMPLE_BLUEPRINT_ROLE/);
  assert.match(output, /MISSING_EXAMPLE_BLUEPRINT_GATE/);
});

test("validation rejects example routes without declared handoff continuity", () => {
  const dir = copyRepoFixture("framecore-validate-example-route-continuity-");
  const file = join(dir, "examples/static-campaign/workflow.json");
  const workflow = JSON.parse(readFileSync(file, "utf8"));
  workflow.handoffs = workflow.handoffs.filter((pair) => pair !== "copy-voice->image-prompting");
  writeFileSync(file, `${JSON.stringify(workflow, null, 2)}\n`);

  const result = failRun(["scripts/validate.mjs", dir]);
  assert.notEqual(result.status, 0);
  assert.match(`${result.stderr}${result.stdout}`, /MISSING_EXAMPLE_ROUTE_HANDOFF/);
});

test("validation rejects example workflow route, gate, artifact, and handoff drift", () => {
  const dir = copyRepoFixture("framecore-validate-example-workflow-drift-");
  const file = join(dir, "examples/static-campaign/workflow.json");
  const workflow = JSON.parse(readFileSync(file, "utf8"));
  workflow.route.push("unknown-role");
  workflow.gates.push("unknown_gate");
  workflow.artifacts.push("Unknown Artifact");
  workflow.handoffs.push("static-direction->delivery-documentation");
  writeFileSync(file, JSON.stringify(workflow, null, 2));

  const result = failRun(["scripts/validate.mjs", dir]);
  const output = `${result.stderr}${result.stdout}`;
  assert.notEqual(result.status, 0);
  assert.match(output, /UNKNOWN_EXAMPLE_ROLE/);
  assert.match(output, /UNKNOWN_EXAMPLE_GATE/);
  assert.match(output, /UNKNOWN_EXAMPLE_ARTIFACT/);
  assert.match(output, /UNKNOWN_EXAMPLE_HANDOFF/);
});

test("validation rejects agent templates with unknown review gates", () => {
  const dir = copyRepoFixture("framecore-validate-agent-gate-");
  const file = join(dir, ".codex/agents/brief-architect.toml.template");
  const text = readFileSync(file, "utf8");
  writeFileSync(file, text.replace("Review gate: brief_completeness.", "Review gate: missing_gate."));

  const result = failRun(["scripts/validate.mjs", dir]);
  assert.notEqual(result.status, 0);
  assert.match(`${result.stderr}${result.stdout}`, /UNKNOWN_AGENT_REVIEW_GATE/);
});

test("validation rejects missing release readiness files", () => {
  const dir = copyRepoFixture("framecore-validate-release-");
  rmSync(join(dir, "docs/release.md"), { force: true });
  rmSync(join(dir, ".github/workflows/release-check.yml"), { force: true });
  rmSync(join(dir, ".github/ISSUE_TEMPLATE/install_support.yml"), { force: true });

  const result = failRun(["scripts/validate.mjs", dir]);
  assert.notEqual(result.status, 0);
  assert.match(`${result.stderr}${result.stdout}`, /MISSING_DOC/);
  assert.match(`${result.stderr}${result.stdout}`, /MISSING_REPO_FILE/);
});

test("validation rejects weak Dependabot config", () => {
  const dir = copyRepoFixture("framecore-validate-dependabot-");
  const file = join(dir, ".github/dependabot.yml");
  writeFileSync(file, [
    "version: 2",
    "updates:",
    "  - package-ecosystem: npm",
    "    directory: /",
  ].join("\n"));

  const result = failRun(["scripts/validate.mjs", dir]);
  assert.notEqual(result.status, 0);
  assert.match(`${result.stderr}${result.stdout}`, /WEAK_DEPENDABOT_CONFIG/);
});

test("validation rejects weak repository format config", () => {
  const dir = copyRepoFixture("framecore-validate-format-config-");
  const editorconfig = join(dir, ".editorconfig");
  const gitattributes = join(dir, ".gitattributes");

  writeFileSync(editorconfig, readFileSync(editorconfig, "utf8").replace("end_of_line = lf", "end_of_line = crlf"));
  writeFileSync(gitattributes, readFileSync(gitattributes, "utf8").replace("* text=auto eol=lf", "* text=auto"));

  const result = failRun(["scripts/validate.mjs", dir]);
  assert.notEqual(result.status, 0);
  assert.match(`${result.stderr}${result.stdout}`, /WEAK_REPO_FORMAT_CONFIG/);
});

test("validation rejects weak NOTICE file", () => {
  const dir = copyRepoFixture("framecore-validate-notice-");
  const notice = join(dir, "NOTICE");
  writeFileSync(notice, "FrameCore Works\n");

  const result = failRun(["scripts/validate.mjs", dir]);
  assert.notEqual(result.status, 0);
  assert.match(`${result.stderr}${result.stdout}`, /WEAK_NOTICE_FILE/);
});

test("validation rejects weak issue template hygiene", () => {
  const dir = copyRepoFixture("framecore-validate-issue-template-");
  const config = join(dir, ".github/ISSUE_TEMPLATE/config.yml");
  const documentationTemplate = join(dir, ".github/ISSUE_TEMPLATE/documentation.yml");

  writeFileSync(config, readFileSync(config, "utf8").replace("blank_issues_enabled: false", "blank_issues_enabled: true"));
  writeFileSync(documentationTemplate, readFileSync(documentationTemplate, "utf8").replace("Do not include secrets", "Include details"));

  const result = failRun(["scripts/validate.mjs", dir]);
  assert.notEqual(result.status, 0);
  assert.match(`${result.stderr}${result.stdout}`, /WEAK_ISSUE_TEMPLATE_HYGIENE/);
});
