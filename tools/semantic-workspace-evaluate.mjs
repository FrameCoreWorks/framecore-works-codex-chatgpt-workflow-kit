#!/usr/bin/env node
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { hasHelpFlag, printHelpAndExit, relativePosix } from "../scripts/common.mjs";
import { memoryPath, parseArgs, requireOpenAiActivation, safeSemanticFiles, targetFromOptions, validateMemoryCache } from "./workflow-common.mjs";

if (hasHelpFlag()) {
  printHelpAndExit(`
Usage:
  node tools/semantic-workspace-evaluate.mjs --target <operational-folder> --activation "openai api active"

Purpose:
  Produce a local semantic-memory coverage report with explicit OpenAI API activation gating.

Options:
  --target <path>        Operational folder. Defaults to current directory.
  --activation <phrase>  Required exact phrase.
  --help, -h             Show this help output.
`);
}

try {
  const options = parseArgs();
  requireOpenAiActivation(options);
  const target = targetFromOptions(options);
  const findings = validateMemoryCache(target);
  if (findings.length > 0) {
    console.error("Memory Cache must be valid before semantic workspace evaluation.");
    for (const finding of findings) console.error(`[${finding.code}] ${finding.message}`);
    process.exit(1);
  }

  const indexPath = memoryPath(target, "semantic-index.local.json");
  const indexedFiles = existsSync(indexPath) ? JSON.parse(readFileSync(indexPath, "utf8")).files.length : 0;
  const safeFiles = safeSemanticFiles(target);
  const report = [
    "# Semantic Workspace Evaluation",
    "",
    "## Summary",
    "",
    `- generated_utc: ${new Date().toISOString()}`,
    "- api_execution: false",
    "- activation_phrase_received: true",
    `- safe_source_files: ${safeFiles.length}`,
    `- indexed_files: ${indexedFiles}`,
    "- Context excluded: yes",
    "- AppleDouble excluded: yes",
    "- oversized files excluded: yes",
    "",
    "## Next Action",
    "",
    indexedFiles > 0 ? "- Use `npm run semantic:query` for local recovery lookup." : "- Run `npm run semantic:index` before relying on semantic lookup.",
    "",
  ].join("\n");
  const output = memoryPath(target, "semantic-evaluation-report.md");
  writeFileSync(output, report);
  console.log(`semantic workspace evaluation written: ${relativePosix(target, output)} (no API call made)`);
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
