#!/usr/bin/env node
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { repoRoot, readJson } from "./common.mjs";

export function renderAgents({ target, configPath, dryRun = false }) {
  const sourceDir = join(repoRoot, ".codex/agents");
  const targetDir = join(target, ".codex/agents");
  const config = existsSync(configPath) ? readJson(configPath) : {};
  const names = config.agent_display_names ?? {};
  const language = config.working_language ?? "en";
  const tone = config.response_tone ?? "calm, direct, practical";
  const outputDir = config.output_dir ?? "output/framecore";
  const planned = [];

  for (const entry of readdirSync(sourceDir)) {
    if (!entry.endsWith(".toml.template")) continue;
    const roleId = entry.replace(/\.toml\.template$/, "");
    const displayName = names[roleId] ?? roleId;
    const rendered = readFileSync(join(sourceDir, entry), "utf8")
      .replaceAll("{{role_id}}", roleId)
      .replaceAll("{{display_name}}", displayName)
      .replaceAll("{{working_language}}", language)
      .replaceAll("{{response_tone}}", tone)
      .replaceAll("{{output_dir}}", outputDir);
    const destination = join(targetDir, `${roleId}.toml`);
    planned.push(destination);
    if (!dryRun) {
      mkdirSync(targetDir, { recursive: true });
      writeFileSync(destination, rendered);
    }
  }

  return planned;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const targetIndex = process.argv.indexOf("--target");
  const configIndex = process.argv.indexOf("--config");
  const target = targetIndex >= 0 ? process.argv[targetIndex + 1] : process.cwd();
  const configPath = configIndex >= 0 ? process.argv[configIndex + 1] : join(target, "framecore.config.json");
  const dryRun = process.argv.includes("--dry-run");
  const planned = renderAgents({ target, configPath, dryRun });
  for (const file of planned) console.log(`${dryRun ? "would render" : "rendered"} ${file}`);
}
