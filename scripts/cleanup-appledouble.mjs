#!/usr/bin/env node
import { rmSync } from "node:fs";
import { relative } from "node:path";
import { isAppleDouble, repoRoot, walkFiles } from "./common.mjs";

const apply = process.argv.includes("--apply");
const files = walkFiles(repoRoot, { excludes: [".git", "node_modules"] }).filter(isAppleDouble);

for (const file of files) {
  console.log(`${apply ? "delete" : "would delete"} ${relative(repoRoot, file)}`);
  if (apply) rmSync(file);
}

if (files.length === 0) {
  console.log("no AppleDouble files found");
}
