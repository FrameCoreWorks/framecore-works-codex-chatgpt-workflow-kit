#!/usr/bin/env node
import { hasHelpFlag, printHelpAndExit, relativePosix } from "../scripts/common.mjs";
import { copyMemoryTemplates, parseArgs, targetFromOptions } from "./workflow-common.mjs";

if (hasHelpFlag()) {
  printHelpAndExit(`
Usage:
  node tools/init-memory-cache.mjs --target <operational-folder> [--create-target] [--force]

Purpose:
  Create Context/ and Memory Cache/ for one operational chat or project folder.

Options:
  --target <path>    Operational folder to initialize. Defaults to current directory.
  --create-target    Create the target folder when it does not exist.
  --force            Rewrite existing Memory Cache template files.
  --help, -h         Show this help output.
`);
}

try {
  const options = parseArgs();
  const target = targetFromOptions(options, { create: Boolean(options["create-target"]) });
  const result = copyMemoryTemplates(target, { force: Boolean(options.force) });
  console.log(`memory cache initialized: ${target}`);
  console.log(`written: ${result.written.length}`);
  console.log(`preserved: ${result.skipped.length}`);
  for (const file of result.written) console.log(`write ${relativePosix(target, file)}`);
  for (const file of result.skipped) console.log(`preserve ${relativePosix(target, file)}`);
  console.log("Context/ was created or preserved; no Context files were migrated.");
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
