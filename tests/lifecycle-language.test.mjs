import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import test from "node:test";
import { validateChatGptRepositorySetup, writeChatGptSkillSourceManifest } from "../scripts/chatgpt-skill-sources.mjs";
import { loadFrameCoreConfig } from "../scripts/config-validation.mjs";
import { copyRepoFixture, root, run } from "./helpers.mjs";

const read = (path) => readFileSync(join(root, path), "utf8");

test("fresh installation renders automatic language instructions rather than a literal auto language", (t) => {
  const target = mkdtempSync(join(tmpdir(), "framecore-language-auto-"));
  t.after(() => rmSync(target, { recursive: true, force: true }));
  run(["scripts/onboard.mjs", "--target", target, "--defaults"]);
  run(["scripts/install.mjs", "--mode", "project-local", "--target", target]);
  assert.equal(loadFrameCoreConfig({ target }).config.working_language, "auto");
  for (const name of readdirSync(join(target, ".codex/agents"))) {
    const content = readFileSync(join(target, ".codex/agents", name), "utf8");
    assert.match(content, /Use the user's resolved language for workflow artifacts/, name);
    assert.doesNotMatch(content, /Use auto for workflow artifacts/, name);
  }
  const policy = readFileSync(join(target, "AGENTS.md"), "utf8");
  assert.match(policy, /After verified installation/);
  assert.match(policy, /Copied English setup prompts and source files are not language preferences/);
  assert.match(policy, /Preserve exact supplied artwork copy/);
});

test("every independently installed skill carries the same language boundary", () => {
  for (const name of readdirSync(join(root, ".agents/skills"))) {
    const skill = read(`.agents/skills/${name}/SKILL.md`);
    assert.match(skill, /installation guidance stay in English/, name);
    assert.match(skill, /After verified installation/, name);
    assert.match(skill, /explicit user preference, then the user's own conversation/, name);
    assert.match(skill, /Copied English setup prompts and source files are not language preferences/, name);
    assert.match(skill, /explicit deliverable-language requests and exact supplied artwork copy/, name);
  }
});

test("README includes all six canonical installation, update and personal-extension prompts", () => {
  const readme = read("README.md");
  for (const path of ["CODEX_INSTALL.md", "CHATGPT_INSTALL.md", "CODEX_UPDATE.md", "CHATGPT_UPDATE.md", "docs/skill-customization.md"]) {
    const prompts = [...read(path).matchAll(/```text\n([\s\S]*?)\n```/g)];
    assert.ok(prompts.length > 0, path);
    const required = prompts.slice(0, path.endsWith("skill-customization.md") ? 2 : 1);
    for (const match of required) assert.ok(readme.includes(match[1]), `README prompt drift: ${path}`);
  }
});

test("README groups six readable copy-paste blocks before the technical overview", () => {
  const intro = read("README.md").split("## What This Repo Gives You")[0];
  const headings = [...intro.matchAll(/^#{2,3} (.+)$/gm)].map(match => match[1]);
  assert.deepEqual(headings, [
    "Install from this repository", "ChatGPT Work", "Codex",
    "Update an existing installation", "ChatGPT Work update", "Codex update",
    "Extend your own installed skills", "ChatGPT Work personal extension", "Codex personal extension"
  ]);
  const prompts = [...intro.matchAll(/```text\n([\s\S]*?)\n```/g)];
  assert.equal(prompts.length, 6);
  assert.doesNotMatch(intro, /^\|/m, "entry paths should not be hidden behind navigation tables");
  for (const [index, match] of prompts.entries()) {
    for (const line of match[1].split("\n")) {
      assert.ok(line.length <= 100, `prompt ${index + 1} has an overlong line`);
    }
  }
  const chatGptGuide = read("docs/chatgpt-skills-onboarding.md");
  assert.ok(chatGptGuide.includes(prompts[0][1]));
});

test("ChatGPT setup rejects pre-install language selection", (t) => {
  const fixture = copyRepoFixture("framecore-language-rules-");
  t.after(() => rmSync(fixture, { recursive: true, force: true }));
  const path = join(fixture, "config/chatgpt-skills.json");
  const config = JSON.parse(readFileSync(path, "utf8"));
  assert.equal(config.installation_rules.first_question_is_setup_language, false);
  assert.equal(config.installation_rules.installation_language, "en");
  assert.equal(config.installation_rules.user_language_detection, "after_verified_installation");
  config.installation_rules.first_question_is_setup_language = true;
  writeFileSync(path, JSON.stringify(config));
  assert.ok(validateChatGptRepositorySetup(fixture).some(error => error.message.includes("installation must stay English")));
});

test("skill source validation rejects a removed language guard even with refreshed hashes", (t) => {
  const fixture = copyRepoFixture("framecore-language-skill-");
  t.after(() => rmSync(fixture, { recursive: true, force: true }));
  const path = join(fixture, ".agents/skills/copy-voice/SKILL.md");
  writeFileSync(path, readFileSync(path, "utf8").replace("After verified installation", "Immediately"));
  writeChatGptSkillSourceManifest(fixture);
  assert.ok(validateChatGptRepositorySetup(fixture).some(error => error.message.includes("Skill language policy is missing")));
});

test("lifecycle documentation validation rejects an update guide without a source fetch", () => {
  const findings = [];
  return import("../scripts/validate/docs.mjs").then(({ run: validate }) => {
    validate({
      root,
      requiredRoles: [],
      helpers: {
        appearsInOrder: () => true,
        markdownSections: text => new Set([...text.matchAll(/^## (.+)$/gm)].map(match => match[1])),
        read: path => readFileSync(path, "utf8").replaceAll("git fetch origin main", "inspect existing checkout"),
        createFindings: () => ({ findings, addFinding: (code, message) => findings.push({ code, message }) })
      }
    });
    assert.ok(findings.some(finding => finding.code === "WEAK_LIFECYCLE_DOC" && finding.message.includes("git fetch origin main")));
  });
});
