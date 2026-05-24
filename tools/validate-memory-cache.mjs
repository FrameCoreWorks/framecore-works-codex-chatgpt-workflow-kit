#!/usr/bin/env node
import { hasHelpFlag, printHelpAndExit } from "../scripts/common.mjs";
import { parseArgs, printFindings, targetFromOptions, validateMemoryCache } from "./workflow-common.mjs";

if (hasHelpFlag()) {
  printHelpAndExit(`
Usage:
  node tools/validate-memory-cache.mjs --target <operational-folder>

Purpose:
  Validate Memory Cache/ recovery state without reading Context/ as recovery state.

Options:
  --target <path>           Operational folder to validate. Defaults to current directory.
  --max-file-bytes <bytes>  Maximum allowed Memory Cache file size.
  --help, -h                Show this help output.
`);
}

try {
  const options = parseArgs();
  const target = targetFromOptions(options);
  const findings = validateMemoryCache(target, { maxFileBytes: options["max-file-bytes"] });
  process.exit(printFindings(findings, "memory cache validation passed"));
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
