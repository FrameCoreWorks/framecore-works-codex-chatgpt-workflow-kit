import assert from "node:assert/strict";
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import test from "node:test";
import { loadFrameCoreConfig, localConfigOverrides } from "../scripts/config-validation.mjs";
import { combinedOutput, failRun, run, runInteractiveOnboarding } from "./helpers.mjs";

function workspace(t) {
  const target = mkdtempSync(join(tmpdir(), "framecore-config-layers-"));
  t.after(() => rmSync(target, { recursive: true, force: true }));
  return target;
}

test("all config entrypoints reject non-object JSON layers before writes", (t) => {
  for (const layer of ["framecore.config.json", "framecore.config.shared.json"]) {
    for (const value of [null, [], "private-invalid-value", 42]) {
      const target = workspace(t);
      const path = join(target, layer);
      const original = JSON.stringify(value);
      writeFileSync(path, original);
      for (const args of [
        ["scripts/doctor.mjs"],
        ["scripts/install.mjs", "--mode", "project-local", "--force"],
        ["scripts/onboard.mjs", "--defaults"],
        ["scripts/render-agents.mjs"],
        ["scripts/guided-install.mjs", "--defaults", "--yes", "--skip-check"]
      ]) {
        const result = failRun([...args, "--target", target]);
        assert.notEqual(result.status, 0);
        assert.match(combinedOutput(result), /must be a JSON object/);
        assert.ok(combinedOutput(result).includes(layer));
        assert.doesNotMatch(combinedOutput(result), /private-invalid-value/);
        assert.equal(existsSync(join(target, ".framecore")), false);
        assert.equal(existsSync(join(target, ".agents")), false);
        assert.equal(existsSync(join(target, ".codex")), false);
        assert.equal(existsSync(path + ".bak"), false);
        assert.equal(readFileSync(path, "utf8"), original);
      }
    }
  }
});

test("guided onboarding preserves shared preferences and later shared changes", (t) => {
  const target = workspace(t);
  const shared = join(target, "framecore.config.shared.json");
  const local = join(target, "framecore.config.json");
  writeFileSync(shared, JSON.stringify({
    working_language: "pl", qa_strictness: "strict", output_dir: "artifacts/team",
    work_profile: { primary_work: "team production" }
  }));
  run(["scripts/guided-install.mjs", "--defaults", "--yes", "--skip-check", "--target", target]);
  assert.deepEqual(JSON.parse(readFileSync(local, "utf8")), {});
  const initial = loadFrameCoreConfig({ target }).config;
  assert.equal(initial.working_language, "pl");
  assert.equal(initial.qa_strictness, "strict");
  assert.equal(initial.output_dir, "artifacts/team");
  writeFileSync(local, JSON.stringify({ response_tone: "personal", work_profile: { workflow_style: "my style" } }));
  run(["scripts/onboard.mjs", "--defaults", "--target", target]);
  assert.deepEqual(JSON.parse(readFileSync(local, "utf8")), {
    response_tone: "personal", work_profile: { workflow_style: "my style" }
  });
  writeFileSync(shared, JSON.stringify({
    working_language: "de", output_dir: "artifacts/new-team", work_profile: { primary_work: "new team" }
  }));
  run(["scripts/install.mjs", "--mode", "update", "--target", target]);
  const current = loadFrameCoreConfig({ target }).config;
  assert.equal(current.working_language, "de");
  assert.equal(current.output_dir, "artifacts/new-team");
  assert.equal(current.work_profile.primary_work, "new team");
  assert.equal(current.work_profile.workflow_style, "my style");
  assert.equal(current.response_tone, "personal");
  assert.match(readFileSync(join(target, ".codex/agents/workflow-orchestrator.toml"), "utf8"), /Use de for workflow artifacts/);
});

test("interactive onboarding records only changed answers and retains nested overrides", async (t) => {
  const target = workspace(t);
  writeFileSync(join(target, "framecore.config.shared.json"), JSON.stringify({ working_language: "pl", output_dir: "artifacts/team" }));
  writeFileSync(join(target, "framecore.config.json"), JSON.stringify({ response_tone: "personal" }));
  const result = await runInteractiveOnboarding(target, ["", "", "", "", "", "", "artifacts/mine", "", "", "", "", "", "", "yes"]);
  assert.equal(result.status, 0, result.stderr);
  assert.deepEqual(JSON.parse(readFileSync(join(target, "framecore.config.json"), "utf8")), {
    response_tone: "personal", output_dir: "artifacts/mine"
  });
  assert.deepEqual(localConfigOverrides(
    { delivery: { auto_upload: false, delivery_requires_current_user_request: true } },
    { delivery: { auto_upload: false, delivery_requires_current_user_request: false } },
    { delivery: { auto_upload: false } }
  ), { delivery: { auto_upload: false, delivery_requires_current_user_request: false } });
});
