#!/usr/bin/env node
import { basename, join, relative, resolve } from "node:path";
import { decodeBase64List, isAppleDouble, readJson, readText, repoRoot, reportFindings, walkFiles } from "./common.mjs";

const targetRoot = process.argv[2] ? resolve(process.argv[2]) : repoRoot;
const policy = readJson(join(repoRoot, "config/privacy-audit-policy.json"));
const bannedTerms = [
  ...decodeBase64List(policy.encoded_banned_terms_base64),
  ...decodeBase64List(policy.encoded_private_agent_names_base64),
];
const excludes = policy.scan_excludes ?? [];
const findings = [];

function addFinding(code, message, files) {
  findings.push({
    code,
    message,
    files: files.map((file) => relative(targetRoot, file)),
  });
}

const files = walkFiles(targetRoot, { excludes });
const appleDouble = files.filter(isAppleDouble);
if (appleDouble.length > 0) {
  addFinding("APPLEDOUBLE_FILE", "AppleDouble metadata files are not allowed.", appleDouble);
}

const textFiles = files.filter((file) => {
  const name = basename(file);
  return /\.(md|json|yaml|yml|toml|js|mjs|ts|tsx|txt|template)$/i.test(name) || name === "LICENSE" || name === ".gitignore";
});

const bannedHits = [];
const localPathHits = [];
const emailHits = [];
const secretHits = [];

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function containsTerm(text, term) {
  const boundary = "(^|[^A-Za-z0-9_-])";
  const pattern = new RegExp(`${boundary}${escapeRegExp(term)}(?=$|[^A-Za-z0-9_-])`, "i");
  return pattern.test(text);
}

for (const file of textFiles) {
  let text = "";
  try {
    text = readText(file);
  } catch {
    continue;
  }

  for (const term of bannedTerms) {
    if (term && containsTerm(text, term)) {
      bannedHits.push(file);
      break;
    }
  }

  if (/(^|[\s"'(])\/(?:Users|Volumes)\/[A-Za-z0-9._ -]+/.test(text)) {
    localPathHits.push(file);
  }

  if (/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i.test(text)) {
    emailHits.push(file);
  }

  if (/(?:api[_-]?key|secret|token|bearer)\s*[:=]\s*["']?[A-Za-z0-9_\-]{16,}/i.test(text)) {
    secretHits.push(file);
  }
}

if (bannedHits.length > 0) {
  addFinding("BANNED_TERM", "Private names or excluded provider/tool remnants were found.", [...new Set(bannedHits)]);
}
if (localPathHits.length > 0) {
  addFinding("LOCAL_ABSOLUTE_PATH", "Local absolute machine paths were found.", [...new Set(localPathHits)]);
}
if (emailHits.length > 0) {
  addFinding("EMAIL_ADDRESS", "Email addresses are not allowed in public repo source.", [...new Set(emailHits)]);
}
if (secretHits.length > 0) {
  addFinding("SECRET_LIKE_VALUE", "Secret-like values were found.", [...new Set(secretHits)]);
}

process.exit(reportFindings(findings, "privacy audit passed"));
