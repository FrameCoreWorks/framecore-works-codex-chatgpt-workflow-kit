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
  assert.equal(manifest.skills.length, 27);
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
