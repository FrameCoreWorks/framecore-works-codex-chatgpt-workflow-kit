#!/usr/bin/env node
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import { repoRoot, readJson } from "./common.mjs";

function argValue(name, fallback) {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : fallback;
}

async function ask(rl, prompt, fallback) {
  const answer = await rl.question(`${prompt} (${fallback}): `);
  return answer.trim() || fallback;
}

export async function runOnboarding({ target = process.cwd(), defaults = false } = {}) {
  const defaultsConfig = readJson(join(repoRoot, "config/defaults.example.json"));
  const configPath = join(target, "framecore.config.json");
  const config = structuredClone(defaultsConfig);
  const roles = readJson(join(repoRoot, "config/agent-naming.schema.json")).roles;

  if (!defaults) {
    const rl = readline.createInterface({ input, output });
    config.working_language = await ask(rl, "Working language", defaultsConfig.working_language);
    config.response_tone = await ask(rl, "Response tone", defaultsConfig.response_tone);
    config.output_dir = await ask(rl, "Output directory", defaultsConfig.output_dir);
    config.qa_strictness = await ask(rl, "QA strictness: light, standard, or strict", defaultsConfig.qa_strictness);
    const recurring = await ask(rl, "Enable 24-hour workflow self-improvement review? yes/no", "no");
    config.workflow_self_improvement.recurring_review_enabled = /^y/i.test(recurring);
    const fullHipson = await ask(rl, "Connect full Hipson now? yes/no", "no");
    config.hipson.connect_full_repo = /^y/i.test(fullHipson);

    console.log("\nAgent display names are local only. Press enter to keep role IDs.");
    for (const role of roles) {
      const value = await ask(rl, role, role);
      if (value !== role) config.agent_display_names[role] = value;
    }
    rl.close();
  }

  if (existsSync(configPath)) {
    const backup = `${configPath}.bak`;
    writeFileSync(backup, readFileSync(configPath, "utf8"));
  }

  mkdirSync(dirname(configPath), { recursive: true });
  writeFileSync(configPath, `${JSON.stringify(config, null, 2)}\n`);

  if (config.workflow_self_improvement.recurring_review_enabled) {
    const recipeSource = join(repoRoot, "config/automation-recipes/workflow-self-improvement-review.example.json");
    const recipeTarget = join(target, ".framecore/automation-recipes/workflow-self-improvement-review.json");
    mkdirSync(dirname(recipeTarget), { recursive: true });
    writeFileSync(recipeTarget, readFileSync(recipeSource, "utf8"));
  }

  console.log(`wrote ${configPath}`);
  console.log("Hipson Adapter is enabled. Full Hipson remains optional: https://github.com/Hipson47/Hipson.git");
  return configPath;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  await runOnboarding({
    target: argValue("--target", process.cwd()),
    defaults: process.argv.includes("--defaults"),
  });
}
