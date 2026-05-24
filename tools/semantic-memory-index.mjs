#!/usr/bin/env node
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";
import { hasHelpFlag, printHelpAndExit, relativePosix } from "../scripts/common.mjs";
import { memoryPath, parseArgs, requireOpenAiActivation, safeReadText, safeSemanticFiles, targetFromOptions, validateMemoryCache } from "./workflow-common.mjs";

if (hasHelpFlag()) {
  printHelpAndExit(`
Usage:
  node tools/semantic-memory-index.mjs --mode index --target <operational-folder>
  node tools/semantic-memory-index.mjs --mode query --target <operational-folder> --query "recovery prompt"
  node tools/semantic-memory-index.mjs --mode embed --target <operational-folder> --activation "openai api active"

Purpose:
  Build and query a local-first semantic memory index. Hosted embeddings are optional and activation-gated.

Options:
  --mode <index|query|embed>  Operation mode. Defaults to index.
  --target <path>            Operational folder. Defaults to current directory.
  --query <text>             Query text for query mode.
  --activation <phrase>      Required exact phrase for embed mode.
  --help, -h                 Show this help output.
`);
}

function tokenize(text) {
  return (text.toLowerCase().match(/[a-z0-9][a-z0-9_-]{1,}/g) ?? []).filter((token) => token.length <= 48);
}

function topTerms(tokens) {
  const counts = new Map();
  for (const token of tokens) counts.set(token, (counts.get(token) ?? 0) + 1);
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, 40)
    .map(([term, count]) => ({ term, count }));
}

function indexPath(target) {
  return memoryPath(target, "semantic-index.local.json");
}

function buildIndex(target) {
  const files = safeSemanticFiles(target);
  return {
    schema_version: 1,
    generated_at_utc: new Date().toISOString(),
    source_policy: {
      local_first: true,
      api_required: false,
      excludes_context: true,
      excludes_appledouble: true,
      excludes_secret_files: true,
    },
    files: files.map((file) => {
      const text = safeReadText(file);
      const tokens = tokenize(text);
      return {
        path: relativePosix(target, file),
        bytes: Buffer.byteLength(text),
        token_count: tokens.length,
        top_terms: topTerms(tokens),
      };
    }),
  };
}

function writeIndex(target, index) {
  const path = indexPath(target);
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, `${JSON.stringify(index, null, 2)}\n`);
  return path;
}

function scoreFile(queryTerms, file) {
  const weights = new Map(file.top_terms.map((entry) => [entry.term, entry.count]));
  return queryTerms.reduce((score, term) => score + (weights.get(term) ?? 0), 0);
}

try {
  const options = parseArgs();
  const target = targetFromOptions(options);
  const mode = String(options.mode ?? "index");
  const findings = validateMemoryCache(target);
  if (findings.length > 0) {
    console.error("Memory Cache must be valid before semantic memory operations.");
    for (const finding of findings) console.error(`[${finding.code}] ${finding.message}`);
    process.exit(1);
  }

  if (mode === "index") {
    const index = buildIndex(target);
    const path = writeIndex(target, index);
    console.log(`semantic index written: ${relativePosix(target, path)} (${index.files.length} files)`);
  } else if (mode === "query") {
    const query = String(options.query ?? "").trim();
    if (!query) throw new Error("query mode requires --query.");
    const path = indexPath(target);
    if (!existsSync(path)) throw new Error("semantic index is missing. Run semantic:index first.");
    const index = JSON.parse(readFileSync(path, "utf8"));
    const queryTerms = [...new Set(tokenize(query))];
    const matches = index.files
      .map((file) => ({ path: file.path, score: scoreFile(queryTerms, file) }))
      .filter((entry) => entry.score > 0)
      .sort((a, b) => b.score - a.score || a.path.localeCompare(b.path))
      .slice(0, 10);
    console.log(`semantic query: ${query}`);
    for (const match of matches) console.log(`${match.score}\t${match.path}`);
    if (matches.length === 0) console.log("no local matches");
  } else if (mode === "embed") {
    requireOpenAiActivation(options);
    const index = buildIndex(target);
    const manifest = {
      schema_version: 1,
      generated_at_utc: new Date().toISOString(),
      activation: "openai api active",
      api_execution: false,
      note: "Public kit prepared an embedding manifest only. No API call was made.",
      files: index.files.map((file) => ({ path: file.path, bytes: file.bytes, token_count: file.token_count })),
    };
    const path = memoryPath(target, "semantic-embedding-manifest.json");
    writeFileSync(path, `${JSON.stringify(manifest, null, 2)}\n`);
    console.log(`semantic embedding manifest written: ${relativePosix(target, path)} (no API call made)`);
  } else {
    throw new Error(`unknown mode: ${mode}`);
  }
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
