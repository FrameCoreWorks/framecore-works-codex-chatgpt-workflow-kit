#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { hasHelpFlag, printHelpAndExit, repoRoot } from "./common.mjs";

function run(label, args) {
  const result = spawnSync(process.execPath, args, {
    cwd: repoRoot,
    encoding: "utf8",
  });
  if (result.status !== 0) {
    process.stderr.write(result.stdout);
    process.stderr.write(result.stderr);
    throw new Error(`${label} failed`);
  }
  return result.stdout;
}

function assertFile(path, label) {
  if (!existsSync(path)) throw new Error(`missing ${label}: ${path}`);
}

function main() {
  const target = mkdtempSync(join(tmpdir(), "framecore-smoke-install-"));
  try {
    run("guided install", ["scripts/guided-install.mjs", "--target", target, "--defaults", "--yes", "--skip-check"]);
    assertFile(join(target, "framecore.config.json"), "local config");
    assertFile(join(target, "AGENTS.md"), "project instructions");
    assertFile(join(target, ".framecore/manifest.json"), "manifest");
    assertFile(join(target, ".agents/skills/pipeline-core/SKILL.md"), "pipeline-core skill");
    assertFile(join(target, ".codex/agents/workflow-orchestrator.toml"), "workflow-orchestrator agent");

    const manifest = JSON.parse(readFileSync(join(target, ".framecore/manifest.json"), "utf8"));
    if (!manifest.managed_hashes || Object.keys(manifest.managed_hashes).length === 0) {
      throw new Error("manifest has no managed hashes");
    }

    run("doctor", ["scripts/doctor.mjs", "--target", target]);
    const uninstallPreview = run("uninstall preview", ["scripts/install.mjs", "--mode", "uninstall", "--target", target]);
    if (!uninstallPreview.includes("remove .framecore/manifest.json")) {
      throw new Error("uninstall preview did not list managed manifest removal");
    }
    assertFile(join(target, ".framecore/manifest.json"), "manifest after uninstall preview");
    console.log("smoke install passed");
  } finally {
    rmSync(target, { recursive: true, force: true });
  }
}

if (hasHelpFlag()) {
  printHelpAndExit(`
Usage:
  node scripts/smoke-install.mjs

Purpose:
  Run a deterministic project-local install smoke test against a temporary target.

Checks:
  Guided install with default onboarding, expected installed files, manifest hashes,
  doctor/preflight, and uninstall preview without applying removal.
`);
}

try {
  main();
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
