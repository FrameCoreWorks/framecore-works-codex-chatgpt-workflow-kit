#!/usr/bin/env node
import { rmSync } from "node:fs";
import { hasHelpFlag, isAppleDouble, printHelpAndExit, relativePosix, walkFiles } from "../scripts/common.mjs";
import { parseArgs, targetFromOptions } from "./workflow-common.mjs";

if (hasHelpFlag()) {
  printHelpAndExit(`
Usage:
  node tools/cleanup-appledouble.mjs --target <path> [--apply]

Purpose:
  Audit or remove AppleDouble metadata sidecars from an operational folder.

Options:
  --target <path>  Folder to scan. Defaults to current directory.
  --apply          Delete matching AppleDouble files. Without --apply, fail when found.
  --help, -h       Show this help output.
`);
}

try {
  const options = parseArgs();
  const target = targetFromOptions(options);
  const apply = Boolean(options.apply);
  const files = walkFiles(target, { excludes: [".git", "node_modules"] }).filter(isAppleDouble);
  for (const file of files) {
    console.log(`${apply ? "delete" : "found"} ${relativePosix(target, file)}`);
    if (apply) rmSync(file, { force: true });
  }
  if (files.length === 0) {
    console.log("no AppleDouble files found");
  } else if (!apply) {
    console.error("AppleDouble files found. Run with --apply to remove metadata sidecars.");
    process.exit(1);
  }
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
