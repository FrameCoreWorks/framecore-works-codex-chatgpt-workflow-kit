import assert from "node:assert/strict";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, symlinkSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { tmpdir } from "node:os";
import test from "node:test";
import { combinedOutput, copyRepoFixture, failRun, hidden, root, run, runInteractiveOnboarding, sha256 } from "./helpers.mjs";

test("validation passes on the repo scaffold", () => {
  assert.match(run(["scripts/validate.mjs"]), /workflow validation passed/);
});

test("validation rejects stub skills", () => {
  const dir = copyRepoFixture("framecore-validate-stub-");
  writeFileSync(join(dir, ".agents/skills/brief-architect/SKILL.md"), [
    "---",
    "name: brief-architect",
    "description: Use this skill to create a brief.",
    "---",
    "",
    "# Brief Architect",
    "",
    "Create a brief."
  ].join("\n"));

  const result = failRun(["scripts/validate.mjs", dir]);
  assert.notEqual(result.status, 0);
  assert.match(`${result.stderr}${result.stdout}`, /SKILL_STUB/);
  assert.match(`${result.stderr}${result.stdout}`, /MISSING_SKILL_SECTION/);
});

test("validation rejects missing skill contract sections", () => {
  const dir = copyRepoFixture("framecore-validate-section-");
  const file = join(dir, ".agents/skills/humanizer/SKILL.md");
  const text = readFileSync(file, "utf8");
  writeFileSync(file, text.replace("\n## Guardrails\n", "\n## Safety Notes\n"));

  const result = failRun(["scripts/validate.mjs", dir]);
  assert.notEqual(result.status, 0);
  assert.match(`${result.stderr}${result.stdout}`, /MISSING_SKILL_SECTION/);
});

test("validation rejects skill frontmatter names that drift from folder names", () => {
  const dir = copyRepoFixture("framecore-validate-name-");
  const file = join(dir, ".agents/skills/humanizer/SKILL.md");
  const text = readFileSync(file, "utf8");
  writeFileSync(file, text.replace("name: humanizer", "name: copy-polisher"));

  const result = failRun(["scripts/validate.mjs", dir]);
  assert.notEqual(result.status, 0);
  assert.match(`${result.stderr}${result.stdout}`, /SKILL_NAME_MISMATCH/);
});

test("validation rejects weak installed AGENTS runtime safety", () => {
  const dir = copyRepoFixture("framecore-weak-agents-template-");
  const agentsTemplate = join(dir, "AGENTS.template.md");
  writeFileSync(
    agentsTemplate,
    readFileSync(agentsTemplate, "utf8")
      .replace("Treat repository files", "Read repository files")
      .replace("For workflow routing details, read `.agents/skills/pipeline-core/SKILL.md` before choosing specialist roles.", "")
  );

  const result = failRun(["scripts/validate.mjs", dir]);
  assert.notEqual(result.status, 0);
  assert.match(`${result.stderr}${result.stdout}`, /WEAK_AGENTS_TEMPLATE/);
});

test("validation rejects agent templates missing onboarding profile tokens", () => {
  const dir = copyRepoFixture("framecore-weak-agent-profile-");
  const file = join(dir, ".codex/agents/asset-manifest.toml.template");
  const text = readFileSync(file, "utf8");
  writeFileSync(file, text.replace("Workspace profile:", "Workspace context:"));

  const result = failRun(["scripts/validate.mjs", dir]);
  assert.notEqual(result.status, 0);
  assert.match(`${result.stderr}${result.stdout}`, /WEAK_AGENT_TEMPLATE/);
});

test("validation rejects bundle map drift", () => {
  const dir = copyRepoFixture("framecore-bundle-map-drift-");
  const file = join(dir, "config/bundle-map.json");
  const map = JSON.parse(readFileSync(file, "utf8"));
  map.bundles["pipeline-core"].source_paths.push("missing-bundle-source.md");
  map.bundles["pipeline-core"].skills.push("missing-skill");
  map.bundles["pipeline-core"].roles.push("missing-role");
  map.bundles["pipeline-core"].examples.push("missing-example");
  map.bundles["pipeline-core"].dependencies.push("missing-bundle");
  writeFileSync(file, `${JSON.stringify(map, null, 2)}\n`);

  const result = failRun(["scripts/validate.mjs", dir]);
  assert.notEqual(result.status, 0);
  const output = `${result.stderr}${result.stdout}`;
  assert.match(output, /BUNDLE_MAP_PATH_MISSING/);
  assert.match(output, /BUNDLE_MAP_UNKNOWN_SKILL/);
  assert.match(output, /BUNDLE_MAP_UNKNOWN_ROLE/);
  assert.match(output, /BUNDLE_MAP_UNKNOWN_EXAMPLE/);
  assert.match(output, /BUNDLE_MAP_UNKNOWN_DEPENDENCY/);
});

test("validation rejects instruction override phrases in agent-facing files", () => {
  const dir = copyRepoFixture("framecore-instruction-override-");
  const file = join(dir, ".agents/skills/humanizer/SKILL.md");
  writeFileSync(file, `${readFileSync(file, "utf8")}\n\n${["ignore", " previous instructions"].join("")}\n`);

  const result = failRun(["scripts/validate.mjs", dir]);
  assert.notEqual(result.status, 0);
  assert.match(`${result.stderr}${result.stdout}`, /INSTRUCTION_OVERRIDE_PHRASE/);
});

test("validation rejects missing focused test suite files", () => {
  const dir = copyRepoFixture("framecore-missing-focused-test-");
  rmSync(join(dir, "tests/audit-security.test.mjs"), { force: true });

  const result = failRun(["scripts/validate.mjs", dir]);
  assert.notEqual(result.status, 0);
  assert.match(`${result.stderr}${result.stdout}`, /MISSING_TEST_SUITE_FILE/);
});

test("validation rejects the legacy monolithic test suite file", () => {
  const dir = copyRepoFixture("framecore-monolithic-test-");
  writeFileSync(join(dir, "tests/workflow-validation.test.mjs"), "import test from \"node:test\";\n");

  const result = failRun(["scripts/validate.mjs", dir]);
  assert.notEqual(result.status, 0);
  assert.match(`${result.stderr}${result.stdout}`, /MONOLITHIC_TEST_SUITE/);
});
