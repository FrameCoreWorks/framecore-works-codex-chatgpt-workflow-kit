import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, symlinkSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import test from "node:test";
import { runNpmPack } from "../scripts/package-common.mjs";
import { combinedOutput } from "./helpers.mjs";

test("actual npm tarball runs every exported CLI without maintainer files", (t) => {
  const dir = mkdtempSync(join(tmpdir(), "framecore-packed-cli-"));
  t.after(() => rmSync(dir, { recursive: true, force: true }));
  const packed = runNpmPack([
    "--json", "--ignore-scripts", "--offline", "--pack-destination", dir,
    "--cache", join(dir, "npm-cache")
  ]);
  assert.equal(packed.status, 0, combinedOutput(packed));
  const filename = JSON.parse(packed.stdout)[0].filename;
  execFileSync("tar", ["-xzf", join(dir, filename), "-C", dir], { timeout: 30_000 });
  const payload = join(dir, "package");
  assert.equal(existsSync(join(payload, ".github")), false);
  assert.equal(existsSync(join(payload, "tests")), false);
  for (const guide of ["CODEX_INSTALL.md", "CODEX_UPDATE.md", "CHATGPT_INSTALL.md", "CHATGPT_UPDATE.md", "docs/skill-customization.md", "docs/codex-project-install.md", "docs/codex-project-update.md"]) {
    assert.ok(existsSync(join(payload, guide)), `missing packaged lifecycle guide: ${guide}`);
  }
  const bins = JSON.parse(readFileSync(join(payload, "package.json"), "utf8")).bin;
  const invoke = (name, args = []) => spawnSync(process.execPath, [join(payload, bins[name]), ...args], { cwd: dir, encoding: "utf8", maxBuffer: 4 * 1024 * 1024, timeout: 30_000 });
  for (const name of Object.keys(bins)) {
    const help = invoke(name, ["--help"]);
    assert.equal(help.status, 0, combinedOutput(help));
    assert.match(help.stdout, /Usage:/, name);
  }
  const validation = invoke("framecore-validate");
  assert.equal(validation.status, 0, combinedOutput(validation));
  const source = invoke("framecore-validate", ["--scope", "source"]);
  assert.notEqual(source.status, 0);
  assert.match(combinedOutput(source), /MISSING_TEST_SUITE_FILE/);
  const target = join(dir, "workspace");
  mkdirSync(target);
  const guided = invoke("framecore-guided-install", ["--target", target, "--defaults", "--yes"]);
  assert.equal(guided.status, 0, combinedOutput(guided));
  assert.match(guided.stdout, /Package validation/);
  assert.ok(existsSync(join(target, ".framecore/manifest.json")));
  for (const [name, args] of [
    ["framecore-onboard", ["--defaults"]],
    ["framecore-doctor", ["--mode", "update"]],
    ["framecore-install", ["--mode", "update"]],
    ["framecore-install", ["--mode", "uninstall", "--yes"]]
  ]) {
    const result = invoke(name, [...args, "--target", target]);
    assert.equal(result.status, 0, combinedOutput(result));
  }
  assert.equal(existsSync(join(target, ".framecore/manifest.json")), false);
  // npm's POSIX bin links must execute the main-module guarded onboarding too.
  if (process.platform !== "win32") {
    const binLink = join(dir, "framecore-onboard");
    symlinkSync(join(payload, bins["framecore-onboard"]), binLink);
    const result = spawnSync(process.execPath, [binLink, "--help"], { cwd: dir, encoding: "utf8" });
    assert.equal(result.status, 0, combinedOutput(result));
    assert.match(result.stdout, /Usage:/);
  }
  rmSync(join(payload, "config/text-image-policy.json"));
  const corrupt = invoke("framecore-validate");
  assert.notEqual(corrupt.status, 0, "package validation must still reject missing runtime assets");
});
