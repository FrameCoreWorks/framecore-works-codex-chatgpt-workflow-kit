#!/usr/bin/env node
// Read-only lookup semantics adapted from FrameCoreWorks/static-graphic-design-creator (Apache-2.0).
import { createHash } from "node:crypto";
import { readFileSync, realpathSync } from "node:fs";
import { fileURLToPath } from "node:url";

const catalogUrl = new URL("../references/event-poster-design-codes.json", import.meta.url);
const codeDigest = "da4fd222eb075f9188394434d3ea14753b77acf7d2b6fd93b4834dc1bacf4485";
const normalize = (value) => String(value).trim().replace(/\s+/g, " ").toLowerCase();

export function entries(catalog) {
  return catalog.categories.flatMap((category) => category.codes.map((entry) => ({
    ...entry,
    category_number: category.number,
    category_name: category.name,
    pdf_page: category.pdf_page
  })));
}

export function validateCatalog(catalog) {
  if (catalog?.schema_version !== 1 || !Array.isArray(catalog.categories) || catalog.categories.length !== 20) {
    throw new Error("Expected the 20-category source catalog.");
  }
  const ids = new Set();
  const descriptions = new Set();
  const categoryNames = new Set();
  for (const [categoryIndex, category] of catalog.categories.entries()) {
    if (category.number !== categoryIndex + 1 || typeof category.name !== "string" || !category.name.trim() ||
        categoryNames.has(category.name) || category.pdf_page !== Math.floor(categoryIndex / 4) + 2 ||
        !Array.isArray(category.codes) || category.codes.length !== 10) {
      throw new Error("Invalid category name, order, page or code count.");
    }
    categoryNames.add(category.name);
    for (const [codeIndex, entry] of category.codes.entries()) {
      const expectedId = `EP${String(categoryIndex * 10 + codeIndex + 1).padStart(3, "0")}`;
      const description = entry?.interpretation?.description_en;
      if (entry?.id !== expectedId || ids.has(entry.id) || !/^\/[^/\n]+ \/rebuild$/.test(entry.code) ||
          entry.shorthand + " /rebuild" !== entry.code || typeof description !== "string" ||
          !description.trim() || descriptions.has(description)) {
        throw new Error("Invalid code ID, spelling, shorthand or interpretation.");
      }
      ids.add(entry.id);
      descriptions.add(description);
    }
  }
  const digest = createHash("sha256").update(entries(catalog).map((entry) => entry.code).join("\n") + "\n").digest("hex");
  if (digest !== codeDigest || catalog.canonical_code_lines_sha256 !== codeDigest) {
    throw new Error("Source code lines differ from the pinned catalog.");
  }
  if (catalog.source?.author !== "John Savage AI" || catalog.interpretation_provenance?.author !== "FrameCore Works") {
    throw new Error("Catalog source attribution is missing.");
  }
  return catalog;
}

export function loadCatalog(path = catalogUrl) {
  return validateCatalog(JSON.parse(readFileSync(path, "utf8")));
}

export function resolveCode(value, catalog) {
  const key = normalize(value);
  if (!key) return null;
  const matches = entries(catalog).filter((entry) =>
    [entry.id, entry.code, entry.shorthand, entry.shorthand.slice(1)].some((alias) => normalize(alias) === key));
  return matches.length === 1 ? matches[0] : null;
}

export function search(value, catalog) {
  const key = normalize(value);
  if (!key) return [];
  return entries(catalog).filter((entry) => [entry.code, entry.category_name, entry.interpretation.description_en]
    .some((text) => normalize(text).includes(key)));
}

export function catalogMarkdown(catalog) {
  const lines = ["200 codes in 20 categories. Names: John Savage AI. Interpretations: FrameCore Works.", ""];
  for (const category of catalog.categories) {
    lines.push(`### ${String(category.number).padStart(2, "0")} ${category.name}`, "", "| Code | Style and use |", "| --- | --- |");
    for (const entry of category.codes) {
      lines.push(`| \`${entry.code}\` | ${entry.interpretation.description_en.replaceAll("|", "\\|")} |`);
    }
    lines.push("");
  }
  return lines.join("\n");
}

export function main(args = process.argv.slice(2)) {
  if (args.length === 1 && ["--help", "-h"].includes(args[0])) {
    console.log("Read-only poster catalog: --code <exact-name-or-ID> | --category <name-or-number> | --query <text> | --list-categories | --command /codes");
    return 0;
  }
  const [flag, value] = args;
  if (!(flag === "--list-categories" && args.length === 1) &&
      !(["--code", "--category", "--query", "--command"].includes(flag) && args.length === 2 && value.trim())) {
    console.error("Specify exactly one lookup mode and its nonempty value. Use --help.");
    return 2;
  }
  try {
    const catalog = loadCatalog();
    let result;
    if (flag === "--command") {
      if (!["/codes", "codes", "/kody", "kody"].includes(normalize(value))) throw new Error("Unknown catalog command.");
      console.log(catalogMarkdown(catalog));
      return 0;
    }
    if (flag === "--code") {
      const match = resolveCode(value, catalog);
      result = { status: match ? "matched" : "not_found", match };
    } else if (flag === "--query") {
      const matches = search(value, catalog);
      result = { status: matches.length ? "candidates" : "not_found", selected: null, matches };
    } else if (flag === "--category") {
      const categories = catalog.categories.filter((category) =>
        [String(category.number), String(category.number).padStart(2, "0"), category.name].some((alias) => normalize(alias) === normalize(value)));
      result = { status: categories.length ? "matched" : "not_found", categories };
    } else {
      result = { status: "listed", categories: catalog.categories.map(({ number, name, pdf_page, codes }) => ({ number, name, pdf_page, count: codes.length })) };
    }
    console.log(JSON.stringify(result, null, 2));
    return result.status === "not_found" ? 1 : 0;
  } catch (error) {
    console.error(`catalog error: ${error.message}`);
    return 2;
  }
}

if (process.argv[1] && realpathSync(process.argv[1]) === fileURLToPath(import.meta.url)) process.exitCode = main();
