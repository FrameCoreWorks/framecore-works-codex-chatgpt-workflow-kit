import assert from "node:assert/strict";
import fs, { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, symlinkSync, writeFileSync } from "node:fs";
import { syncBuiltinESMExports } from "node:module";
import { dirname, join } from "node:path";
import { tmpdir } from "node:os";
import test from "node:test";
import { backupFile, readJson } from "../scripts/common.mjs";
import { combinedOutput, copyRepoFixture, failRun, run, sha256 } from "./helpers.mjs";

function workspace(t) {
  const parent = mkdtempSync(join(tmpdir(), "framecore-safety-"));
  t.after(() => rmSync(parent, { recursive: true, force: true }));
  const target = join(parent, "target");
  mkdirSync(target);
  return { parent, target };
}

function manifest(target, entries) {
  mkdirSync(join(target, ".framecore"), { recursive: true });
  writeFileSync(join(target, ".framecore/manifest.json"), JSON.stringify({
    schema_version: 1, managed_paths: entries
  }));
}

test("manifest aliases cannot cause retirement of an active managed file", (t) => {
  for (const alias of ["./AGENTS.md", "agents.md"]) {
    for (const keepCanonical of [true, false]) {
      const { target } = workspace(t);
      run(["scripts/install.mjs", "--mode", "project-local", "--target", target]);
      if (alias === "agents.md" && !existsSync(join(target, alias))) continue;
      const manifestPath = join(target, ".framecore/manifest.json");
      const data = readJson(manifestPath);
      if (!keepCanonical) {
        data.managed_paths = data.managed_paths.filter((entry) => entry !== "AGENTS.md");
        delete data.managed_hashes["AGENTS.md"];
      }
      data.managed_paths.push(alias);
      data.managed_hashes[alias] = sha256(join(target, "AGENTS.md"));
      writeFileSync(manifestPath, JSON.stringify(data));
      const before = readFileSync(manifestPath);
      const agentsBefore = readFileSync(join(target, "AGENTS.md"));
      const result = failRun(["scripts/install.mjs", "--mode", "update", "--target", target, "--force"]);
      assert.notEqual(result.status, 0);
      assert.deepEqual(readFileSync(manifestPath), before);
      assert.deepEqual(readFileSync(join(target, "AGENTS.md")), agentsBefore);
      assert.equal(existsSync(join(target, "AGENTS.md.bak")), false);
    }
  }
});

test("incomplete install retry does not overwrite an unhashed user file", (t) => {
  for (const entry of ["AGENTS.md", ".agents/skills/humanizer/SKILL.md", ".codex/agents/intent-confirmation.toml"]) {
    const { target } = workspace(t);
    const path = join(target, entry);
    mkdirSync(dirname(path), { recursive: true });
    writeFileSync(path, "new user file");
    manifest(target, [entry, ".framecore/manifest.json"]);
    const manifestPath = join(target, ".framecore/manifest.json");
    const data = readJson(manifestPath);
    data.incomplete = true;
    data.managed_hashes = {};
    writeFileSync(manifestPath, JSON.stringify(data));
    const before = readFileSync(manifestPath);
    const blocked = failRun(["scripts/install.mjs", "--mode", "repair", "--target", target]);
    assert.notEqual(blocked.status, 0);
    assert.match(combinedOutput(blocked), /managed file has local changes/);
    assert.equal(readFileSync(path, "utf8"), "new user file");
    assert.deepEqual(readFileSync(manifestPath), before);
    const uninstall = failRun(["scripts/install.mjs", "--mode", "uninstall", "--target", target, "--yes"]);
    assert.notEqual(uninstall.status, 0);
    assert.match(combinedOutput(uninstall), /cannot verify ownership/);
    assert.equal(readFileSync(path, "utf8"), "new user file");
    assert.deepEqual(readFileSync(manifestPath), before);
    run(["scripts/install.mjs", "--mode", "repair", "--target", target, "--force"]);
    assert.equal(readFileSync(path + ".bak", "utf8"), "new user file");
    assert.equal(readJson(manifestPath).incomplete, false);
  }
});

test("forced uninstall backs up unverified incomplete-install files", (t) => {
  const { target } = workspace(t);
  manifest(target, [".framecore/manifest.json", "AGENTS.md"]);
  const manifestPath = join(target, ".framecore/manifest.json");
  const data = readJson(manifestPath);
  data.incomplete = true;
  writeFileSync(manifestPath, JSON.stringify(data));
  writeFileSync(join(target, "AGENTS.md"), "new user file");
  const doctor = failRun(["scripts/doctor.mjs", "--mode", "uninstall", "--target", target]);
  assert.notEqual(doctor.status, 0);
  assert.match(combinedOutput(doctor), /cannot verify ownership/);
  run(["scripts/install.mjs", "--mode", "uninstall", "--target", target, "--yes", "--force"]);
  assert.equal(existsSync(join(target, "AGENTS.md")), false);
  assert.equal(readFileSync(join(target, "AGENTS.md.bak"), "utf8"), "new user file");
});

test("manifest operations reject parent and dangling links before any removals", (t) => {
  for (const dangling of [false, true]) {
    const { parent, target } = workspace(t);
    const outside = join(parent, "outside");
    if (!dangling) {
      mkdirSync(outside);
      writeFileSync(join(outside, "owned.md"), "outside original");
    }
    symlinkSync(outside, join(target, "linked"), "junction");
    writeFileSync(join(target, "first.md"), "first original");
    manifest(target, ["first.md", "linked/owned.md", ".framecore/manifest.json"]);
    const before = readFileSync(join(target, ".framecore/manifest.json"));
    for (const mode of ["uninstall", "repair", "update", "dry-run"]) {
      for (const script of ["scripts/install.mjs", "scripts/doctor.mjs"]) {
        const result = failRun([script, "--mode", mode, "--target", target, "--yes", "--force"]);
        assert.notEqual(result.status, 0);
        assert.match(combinedOutput(result), /symlink/);
        assert.equal(readFileSync(join(target, "first.md"), "utf8"), "first original");
        assert.deepEqual(readFileSync(join(target, ".framecore/manifest.json")), before);
      }
    }
    if (!dangling) assert.equal(readFileSync(join(outside, "owned.md"), "utf8"), "outside original");
    else assert.equal(existsSync(outside), false);
  }
});

test("manifest metadata links are rejected before reading outside JSON", (t) => {
  for (const dangling of [false, true]) {
    for (const parentLink of [false, true]) {
      const { parent, target } = workspace(t);
      const outside = join(parent, "outside");
      mkdirSync(outside);
      const external = join(outside, "manifest.json");
      if (!dangling) writeFileSync(external, "outside non-JSON sentinel");
      if (parentLink) symlinkSync(dangling ? join(parent, "missing") : outside, join(target, ".framecore"), "junction");
      else {
        mkdirSync(join(target, ".framecore"));
        symlinkSync(external, join(target, ".framecore/manifest.json"), "file");
      }
      for (const script of ["scripts/install.mjs", "scripts/doctor.mjs"]) {
        const result = failRun([script, "--mode", "uninstall", "--target", target, "--yes"]);
        assert.notEqual(result.status, 0);
        assert.match(combinedOutput(result), /symlink/);
        assert.doesNotMatch(combinedOutput(result), /outside non-JSON sentinel/);
      }
      if (!dangling) assert.equal(readFileSync(external, "utf8"), "outside non-JSON sentinel");
      assert.equal(existsSync(join(parent, "missing")), false);
    }
  }
});

test("exclusive backups skip occupied links and retry a newly occupied candidate", (t) => {
  const { parent, target } = workspace(t);
  const source = join(target, "data");
  const outside = join(parent, "outside");
  writeFileSync(source, Buffer.from([0, 255, 10, 13]));
  writeFileSync(outside, "outside original");
  symlinkSync(join(parent, "missing"), source + ".bak", "file");
  symlinkSync(outside, source + ".bak.1", "file");
  const originalWrite = fs.writeFileSync;
  let raced = false;
  t.mock.method(fs, "writeFileSync", (path, ...args) => {
    if (!raced && path === source + ".bak.2") {
      raced = true;
      originalWrite(path, "concurrent owner");
    }
    return originalWrite(path, ...args);
  });
  syncBuiltinESMExports();
  try {
    assert.equal(backupFile(source), source + ".bak.3");
  } finally {
    t.mock.restoreAll();
    syncBuiltinESMExports();
  }
  assert.equal(raced, true);
  assert.equal(readFileSync(source + ".bak.2", "utf8"), "concurrent owner");
  assert.deepEqual(readFileSync(source + ".bak.3"), readFileSync(source));
  assert.equal(readFileSync(outside, "utf8"), "outside original");
  assert.equal(existsSync(join(parent, "missing")), false);
});

test("onboarding, forced install and manifest rotation use safe backups", (t) => {
  for (const kind of ["onboard", "agents", "manifest"]) {
    const { parent, target } = workspace(t);
    if (kind === "manifest") run(["scripts/install.mjs", "--mode", "project-local", "--target", target]);
    const path = join(target, kind === "onboard" ? "framecore.config.json" : kind === "agents" ? "AGENTS.md" : ".framecore/manifest.json");
    if (kind === "onboard") writeFileSync(path, '{"response_tone":"custom"}\n');
    if (kind === "agents") writeFileSync(path, "user instructions\n");
    if (kind === "manifest") {
      const data = readJson(path);
      data.kit.version = "0.0.0";
      writeFileSync(path, JSON.stringify(data));
    }
    const before = readFileSync(path);
    const outside = join(parent, "outside");
    writeFileSync(outside, "outside original");
    symlinkSync(join(parent, "missing"), path + ".bak", "file");
    symlinkSync(outside, path + ".bak.1", "file");
    if (kind === "onboard") run(["scripts/onboard.mjs", "--defaults", "--target", target]);
    else run(["scripts/install.mjs", "--mode", kind === "manifest" ? "update" : "project-local", "--target", target, "--force"]);
    assert.deepEqual(readFileSync(path + ".bak.2"), before);
    assert.equal(readFileSync(outside, "utf8"), "outside original");
    assert.equal(existsSync(join(parent, "missing")), false);
  }
});

test("two-version update retires removed files with backups and accurate ownership", (t) => {
  const source = copyRepoFixture("framecore-retirement-source-");
  t.after(() => rmSync(dirname(source), { recursive: true, force: true }));
  const { target } = workspace(t);
  const oldRel = ".agents/skills/retired-test/SKILL.md";
  const newRel = ".agents/skills/renamed-test/SKILL.md";
  mkdirSync(dirname(join(source, oldRel)), { recursive: true });
  writeFileSync(join(source, oldRel), "old skill");
  run(["scripts/install.mjs", "--mode", "project-local", "--target", target], { cwd: source });
  mkdirSync(dirname(join(source, newRel)), { recursive: true });
  writeFileSync(join(source, newRel), "new skill");
  rmSync(join(source, oldRel));
  const manifestPath = join(target, ".framecore/manifest.json");
  const before = readFileSync(manifestPath);
  const preview = run(["scripts/install.mjs", "--mode", "dry-run", "--target", target], { cwd: source });
  assert.match(preview, /would retire with backup.*retired-test/);
  assert.equal(existsSync(join(target, oldRel) + ".bak"), false);
  assert.deepEqual(readFileSync(manifestPath), before);
  run(["scripts/install.mjs", "--mode", "update", "--target", target], { cwd: source });
  assert.equal(existsSync(join(target, oldRel)), false);
  assert.equal(readFileSync(join(target, oldRel) + ".bak", "utf8"), "old skill");
  const current = readJson(manifestPath);
  assert.equal(current.managed_paths.includes(oldRel), false);
  assert.equal(current.managed_paths.includes(newRel), true);
  run(["scripts/install.mjs", "--mode", "uninstall", "--target", target, "--yes"], { cwd: source });
  assert.equal(existsSync(join(target, newRel)), false);
  assert.equal(readFileSync(join(target, oldRel) + ".bak", "utf8"), "old skill");
});

test("modified or unhashed retired files block update until backed up with force", (t) => {
  for (const hashed of [false, true]) {
    const { target } = workspace(t);
    run(["scripts/install.mjs", "--mode", "project-local", "--target", target]);
    const oldRel = ".agents/skills/retired-test/SKILL.md";
    const oldPath = join(target, oldRel);
    mkdirSync(dirname(oldPath), { recursive: true });
    writeFileSync(oldPath, "original");
    const manifestPath = join(target, ".framecore/manifest.json");
    const data = readJson(manifestPath);
    data.managed_paths.push(oldRel);
    if (hashed) data.managed_hashes[oldRel] = sha256(oldPath);
    writeFileSync(manifestPath, JSON.stringify(data));
    writeFileSync(oldPath, "local customization");
    // Repair must not turn local drift in a retired file into a trusted hash.
    run(["scripts/install.mjs", "--mode", "repair", "--target", target]);
    const before = readFileSync(manifestPath);
    for (const mode of ["dry-run", "update"]) {
      const result = failRun(["scripts/install.mjs", "--mode", mode, "--target", target]);
      assert.notEqual(result.status, 0);
      assert.match(combinedOutput(result), /retired managed file/);
      assert.deepEqual(readFileSync(manifestPath), before);
      assert.equal(existsSync(oldPath + ".bak"), false);
    }
    run(["scripts/install.mjs", "--mode", "update", "--target", target, "--force"]);
    assert.equal(readFileSync(oldPath + ".bak", "utf8"), "local customization");
    assert.equal(existsSync(oldPath), false);
    assert.equal(readJson(manifestPath).managed_paths.includes(oldRel), false);
  }
});
