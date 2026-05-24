import assert from "node:assert/strict";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import test from "node:test";
import { combinedOutput, failRun, run } from "./helpers.mjs";

function tempTarget(prefix = "framecore-memory-") {
  return mkdtempSync(join(tmpdir(), prefix));
}

function initMemory(target) {
  return run(["tools/init-memory-cache.mjs", "--target", target]);
}

test("memory init creates valid Memory Cache while preserving Context", () => {
  const dir = tempTarget();
  mkdirSync(join(dir, "Context"), { recursive: true });
  writeFileSync(join(dir, "Context", "brief.md"), "user supplied brief\n");

  const output = initMemory(dir);
  assert.match(output, /memory cache initialized/);
  assert.match(output, /Context\/ was created or preserved/);
  assert.ok(existsSync(join(dir, "Memory Cache", "project-state.md")));
  assert.ok(existsSync(join(dir, "Memory Cache", "recovery-prompt.md")));
  assert.ok(existsSync(join(dir, "Memory Cache", "chat-compactions", ".gitkeep")));
  assert.equal(readFileSync(join(dir, "Context", "brief.md"), "utf8"), "user supplied brief\n");

  assert.match(run(["tools/validate-memory-cache.mjs", "--target", dir]), /memory cache validation passed/);
});

test("memory validator rejects missing project-state even when Context has one", () => {
  const dir = tempTarget();
  mkdirSync(join(dir, "Context"), { recursive: true });
  writeFileSync(join(dir, "Context", "project-state.md"), "checkpoint_id: context-only\ncheckpoint_status: active\n");

  const missingCache = failRun(["tools/validate-memory-cache.mjs", "--target", dir]);
  assert.notEqual(missingCache.status, 0);
  assert.match(combinedOutput(missingCache), /MISSING_MEMORY_CACHE/);

  initMemory(dir);
  rmSync(join(dir, "Memory Cache", "project-state.md"));
  const missingState = failRun(["tools/validate-memory-cache.mjs", "--target", dir]);
  assert.notEqual(missingState.status, 0);
  assert.match(combinedOutput(missingState), /MISSING_MEMORY_FILE/);
});

test("memory validator rejects stale checkpoints, AppleDouble files, and oversized files", () => {
  const stale = tempTarget("framecore-memory-stale-");
  initMemory(stale);
  const statePath = join(stale, "Memory Cache", "project-state.md");
  writeFileSync(statePath, readFileSync(statePath, "utf8").replace("checkpoint_status: active", "checkpoint_status: stale"));
  const staleResult = failRun(["tools/validate-memory-cache.mjs", "--target", stale]);
  assert.notEqual(staleResult.status, 0);
  assert.match(combinedOutput(staleResult), /STALE_PROJECT_STATE/);

  const apple = tempTarget("framecore-memory-apple-");
  initMemory(apple);
  writeFileSync(join(apple, "Memory Cache", "._project-state.md"), "");
  const appleResult = failRun(["tools/validate-memory-cache.mjs", "--target", apple]);
  assert.notEqual(appleResult.status, 0);
  assert.match(combinedOutput(appleResult), /MEMORY_APPLEDOUBLE/);

  const large = tempTarget("framecore-memory-large-");
  initMemory(large);
  writeFileSync(join(large, "Memory Cache", "history", "large.md"), "x".repeat(210_000));
  const largeResult = failRun(["tools/validate-memory-cache.mjs", "--target", large]);
  assert.notEqual(largeResult.status, 0);
  assert.match(combinedOutput(largeResult), /MEMORY_OVERSIZED_FILE/);
  const budgetResult = failRun(["tools/context-budget-audit.mjs", "--target", large]);
  assert.notEqual(budgetResult.status, 0);
  assert.match(combinedOutput(budgetResult), /MEMORY_OVERSIZED_FILE/);
});

test("AppleDouble audit fails when sidecars are present and clean removes only sidecars", () => {
  const dir = tempTarget("framecore-appledouble-");
  writeFileSync(join(dir, "asset.md"), "real asset\n");
  writeFileSync(join(dir, "._asset.md"), "");

  const audit = failRun(["tools/cleanup-appledouble.mjs", "--target", dir]);
  assert.notEqual(audit.status, 0);
  assert.match(combinedOutput(audit), /AppleDouble files found/);

  const clean = run(["tools/cleanup-appledouble.mjs", "--target", dir, "--apply"]);
  assert.match(clean, /delete \._asset\.md/);
  assert.equal(existsSync(join(dir, "._asset.md")), false);
  assert.equal(readFileSync(join(dir, "asset.md"), "utf8"), "real asset\n");
});

test("semantic memory indexes safe files locally and excludes Context", () => {
  const dir = tempTarget("framecore-semantic-");
  initMemory(dir);
  mkdirSync(join(dir, "Context"), { recursive: true });
  mkdirSync(join(dir, ".agents", "skills", "sample"), { recursive: true });
  writeFileSync(join(dir, "Context", "private.md"), "needlecontext should not be indexed\n");
  writeFileSync(join(dir, "Context", "._private.md"), "");
  writeFileSync(join(dir, ".agents", "skills", "sample", "SKILL.md"), "# Sample\n\nneedleskill recovery routing\n");

  const output = run(["tools/semantic-memory-index.mjs", "--mode", "index", "--target", dir]);
  assert.match(output, /semantic index written/);
  const index = JSON.parse(readFileSync(join(dir, "Memory Cache", "semantic-index.local.json"), "utf8"));
  assert.ok(index.files.some((file) => file.path === ".agents/skills/sample/SKILL.md"));
  assert.equal(index.files.some((file) => file.path.startsWith("Context/")), false);
  assert.equal(JSON.stringify(index).includes("needlecontext"), false);

  const query = run(["tools/semantic-memory-index.mjs", "--mode", "query", "--target", dir, "--query", "needleskill"]);
  assert.match(query, /\.agents\/skills\/sample\/SKILL\.md/);
});

test("OpenAI API gated semantic commands require exact activation", () => {
  const dir = tempTarget("framecore-openai-lock-");
  initMemory(dir);

  const embedBlocked = failRun(["tools/semantic-memory-index.mjs", "--mode", "embed", "--target", dir]);
  assert.notEqual(embedBlocked.status, 0);
  assert.match(combinedOutput(embedBlocked), /openai api active/);
  assert.equal(existsSync(join(dir, "Memory Cache", "semantic-embedding-manifest.json")), false);

  const evalBlocked = failRun(["tools/semantic-workspace-evaluate.mjs", "--target", dir, "--activation", "openai active"]);
  assert.notEqual(evalBlocked.status, 0);
  assert.match(combinedOutput(evalBlocked), /openai api active/);

  const embed = run(["tools/semantic-memory-index.mjs", "--mode", "embed", "--target", dir, "--activation", "openai api active"]);
  assert.match(embed, /no API call made/);
  assert.ok(existsSync(join(dir, "Memory Cache", "semantic-embedding-manifest.json")));
});

test("self audit writes a proposal queue without editing skill source", () => {
  const dir = tempTarget("framecore-self-audit-");
  initMemory(dir);
  const skillDir = join(dir, ".agents", "skills", "sample");
  mkdirSync(skillDir, { recursive: true });
  const skillPath = join(skillDir, "SKILL.md");
  const skillText = "# Sample\n\n## Use when\n\nUse when a local audit fixture needs a skill.\n";
  writeFileSync(skillPath, skillText);

  const output = run(["tools/skill-agent-auditor.mjs", "--mode", "audit", "--target", dir]);
  assert.match(output, /self-improvement audit written/);
  assert.equal(readFileSync(skillPath, "utf8"), skillText);
  const queue = readFileSync(join(dir, "Memory Cache", "self-improvement-queue.md"), "utf8");
  assert.match(queue, /source_mutation: false/);
  assert.match(queue, /missing references\/examples\.md/);
});
