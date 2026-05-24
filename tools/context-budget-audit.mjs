#!/usr/bin/env node
import { statSync } from "node:fs";
import { hasHelpFlag, printHelpAndExit } from "../scripts/common.mjs";
import { DEFAULT_MAX_TOTAL_BYTES, addFinding, memoryPath, parseArgs, printFindings, safeSemanticFiles, targetFromOptions, validateMemoryCache } from "./workflow-common.mjs";

if (hasHelpFlag()) {
  printHelpAndExit(`
Usage:
  node tools/context-budget-audit.mjs --target <operational-folder>

Purpose:
  Check that safe recovery context stays compact and excludes Context/ by default.

Options:
  --target <path>             Operational folder to audit. Defaults to current directory.
  --max-file-bytes <bytes>    Maximum allowed indexed file size.
  --max-total-bytes <bytes>   Maximum allowed total indexed bytes.
  --help, -h                  Show this help output.
`);
}

try {
  const options = parseArgs();
  const target = targetFromOptions(options);
  const findings = validateMemoryCache(target, { maxFileBytes: options["max-file-bytes"] });
  const maxTotalBytes = Number(options["max-total-bytes"] ?? DEFAULT_MAX_TOTAL_BYTES);
  const files = safeSemanticFiles(target, { maxFileBytes: options["max-file-bytes"] });
  const totalBytes = files.reduce((sum, file) => sum + statSync(file).size, 0);
  if (totalBytes > maxTotalBytes) {
    addFinding(findings, "CONTEXT_BUDGET_TOTAL", `Safe recovery context exceeds ${maxTotalBytes} bytes.`, target, [memoryPath(target)]);
  }
  const status = printFindings(findings, `context budget audit passed (${files.length} safe files, ${totalBytes} bytes)`);
  process.exit(status);
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
