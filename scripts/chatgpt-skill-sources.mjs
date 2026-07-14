#!/usr/bin/env node
import { createHash } from "node:crypto";
import { existsSync, lstatSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join, relative } from "node:path";
import { isMainModule, repoRoot, toPosixPath } from "./common.mjs";

const CONFIG_PATH = "config/chatgpt-skills.json";
const MANIFEST_PATH = "config/chatgpt-skill-sources.json";
const SKILL_NAME = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const SHA256 = /^[a-f0-9]{64}$/;
const EXPLICIT_ONLY_SKILLS = [
  "onboarding-preference-tuning",
  "hipson-adapter",
  "workflow-self-improvement",
];
const REQUIRED_BOOTSTRAP_SECTIONS = [
  "Purpose",
  "Source Of Truth",
  "First Response",
  "Beginner Preflight",
  "Onboarding Questions",
  "Profile Selection",
  "Native Skill Creation",
  "Existing Skill Guard",
  "Temporary Roles",
  "Post-Install Invocation",
  "Safety Boundaries",
  "Completion Criteria",
  "Failure Handling",
];
const REQUIRED_BOOTSTRAP_PHRASES = [
  "$skill-creator",
  "config/chatgpt-skills.json",
  "config/chatgpt-skill-sources.json",
  "Which language should I use for setup?",
  "Ask these questions one at a time",
  "Do not use Codex `skill-installer`",
  "Do not claim bulk completion",
  "smallest sufficient route",
  "$workflow-orchestrator",
  "$pipeline-core",
  "explicit-only",
  ".codex/agents/",
];

function readJson(path) {
  return JSON.parse(readFileSync(path, "utf8"));
}

function sha256(buffer) {
  return createHash("sha256").update(buffer).digest("hex");
}

function parseSkillFrontmatter(text) {
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
  if (!match) return { error: "SKILL.md must begin with YAML frontmatter." };
  const fields = new Map();
  for (const line of match[1].split(/\r?\n/)) {
    if (!line.trim()) continue;
    const field = line.match(/^([a-zA-Z0-9_-]+):\s*(.+)$/);
    if (!field) return { error: `Unsupported frontmatter line: ${line}` };
    fields.set(field[1], field[2].replace(/^(\"|')(.*)\1$/, "$2").trim());
  }
  const extra = [...fields.keys()].filter((key) => !["name", "description"].includes(key));
  if (extra.length > 0) return { error: `Unsupported frontmatter fields: ${extra.join(", ")}` };
  return { name: fields.get("name"), description: fields.get("description") };
}

function parseQuotedYamlField(text, key) {
  const match = text.match(new RegExp(`^  ${key}:\\s*(\"(?:[^\"\\\\]|\\\\.)*\")\\s*$`, "m"));
  if (!match) return null;
  try {
    return JSON.parse(match[1]);
  } catch {
    return null;
  }
}

function parseOpenAiMetadata(text) {
  const implicit = text.match(/^  allow_implicit_invocation:\s*(true|false)\s*$/m);
  return {
    displayName: parseQuotedYamlField(text, "display_name"),
    shortDescription: parseQuotedYamlField(text, "short_description"),
    defaultPrompt: parseQuotedYamlField(text, "default_prompt"),
    allowImplicitInvocation: implicit ? implicit[1] === "true" : null,
  };
}

function sourceSkillNames(root, sourceRoot) {
  const absolute = join(root, sourceRoot);
  if (!existsSync(absolute)) return [];
  return readdirSync(absolute)
    .filter((name) => existsSync(join(absolute, name, "SKILL.md")))
    .sort();
}

function collectSkillFiles(root, config, skillName) {
  const skillDir = join(root, config.source_root, skillName);
  const files = [];
  const errors = [];

  if (!existsSync(skillDir) || !lstatSync(skillDir).isDirectory() || lstatSync(skillDir).isSymbolicLink()) {
    return { files, errors: [{ message: `Skill source must be a normal directory: ${skillName}`, file: skillDir }] };
  }

  function visit(directory) {
    for (const name of readdirSync(directory).sort()) {
      if (name === ".DS_Store" || name.startsWith("._")) continue;
      const absolute = join(directory, name);
      const stats = lstatSync(absolute);
      const repositoryPath = toPosixPath(relative(root, absolute));
      const skillPath = toPosixPath(relative(skillDir, absolute));
      if (!skillPath || skillPath.startsWith("../") || skillPath.includes("\\") || skillPath.split("/").some((segment) => !segment || segment === "." || segment === "..")) {
        errors.push({ message: `Unsafe ChatGPT skill source path: ${skillPath}`, file: absolute });
      } else if (stats.isSymbolicLink()) {
        errors.push({ message: `ChatGPT skill sources must not contain symlinks: ${repositoryPath}`, file: absolute });
      } else if (stats.isDirectory()) {
        visit(absolute);
      } else if (stats.isFile()) {
        const data = readFileSync(absolute);
        files.push({
          path: skillPath,
          repository_path: repositoryPath,
          raw_url: new URL(repositoryPath, config.raw_base_url).href,
          sha256: sha256(data),
        });
      }
    }
  }

  visit(skillDir);
  const sourceOrder = (path) => path === "SKILL.md" ? 0 : path === "agents/openai.yaml" ? 1 : 2;
  files.sort((left, right) => sourceOrder(left.path) - sourceOrder(right.path) || left.path.localeCompare(right.path));
  return { files, errors };
}

function readConfig(root) {
  const path = join(root, CONFIG_PATH);
  return { path, config: readJson(path) };
}

export function buildChatGptSkillSourceManifest(root = repoRoot) {
  const { config } = readConfig(root);
  const skills = [];
  const names = config.profiles?.full?.skills ?? sourceSkillNames(root, config.source_root);
  for (const name of names) {
    const { files, errors } = collectSkillFiles(root, config, name);
    if (errors.length > 0) throw new Error(errors.map((error) => error.message).join("\n"));
    skills.push({
      name,
      source_dir: `${config.source_root}/${name}`,
      files,
    });
  }
  return {
    schema_version: 1,
    repository: config.repository,
    ref: config.ref,
    raw_base_url: config.raw_base_url,
    bootstrap: {
      path: config.bootstrap_path,
      raw_url: config.bootstrap_url,
    },
    setup_config: {
      path: CONFIG_PATH,
      raw_url: new URL(CONFIG_PATH, config.raw_base_url).href,
    },
    source_root: config.source_root,
    skills,
  };
}

export function writeChatGptSkillSourceManifest(root = repoRoot) {
  const manifest = buildChatGptSkillSourceManifest(root);
  writeFileSync(join(root, MANIFEST_PATH), `${JSON.stringify(manifest, null, 2)}\n`);
  return manifest;
}

export function validateChatGptRepositorySetup(root = repoRoot) {
  const errors = [];
  let config;
  let configPath = join(root, CONFIG_PATH);
  try {
    ({ config, path: configPath } = readConfig(root));
  } catch (error) {
    return [{ message: `ChatGPT setup config is not readable JSON: ${error.message}`, file: configPath }];
  }

  const expectedConfig = {
    mode: "repository-source",
    surface: "native-chatgpt-skills",
    ref: "main",
    bootstrap_path: "CHATGPT_INSTALL.md",
    source_manifest_path: MANIFEST_PATH,
    source_root: ".agents/skills",
    native_creator: "$skill-creator",
  };
  if (config.schema_version !== 1) errors.push({ message: "ChatGPT setup schema_version must be 1.", file: configPath });
  for (const [key, value] of Object.entries(expectedConfig)) {
    if (config[key] !== value) errors.push({ message: `ChatGPT setup ${key} must be ${value}.`, file: configPath });
  }
  for (const key of ["repository", "raw_base_url", "bootstrap_url", "source_manifest_url"]) {
    if (typeof config[key] !== "string" || !config[key].startsWith("https://")) errors.push({ message: `ChatGPT setup ${key} must be a public HTTPS URL.`, file: configPath });
  }
  for (const removedKey of ["format", "default_output_dir", "archive", "mime_type"]) {
    if (removedKey in config) errors.push({ message: `ChatGPT repository setup must not define package field: ${removedKey}`, file: configPath });
  }
  const rules = config.installation_rules ?? {};
  for (const key of ["onboarding_before_creation", "first_question_is_setup_language", "create_each_skill_separately", "require_visible_install_confirmation", "codex_agent_files_are_sources"]) {
    if (typeof rules[key] !== "boolean") errors.push({ message: `ChatGPT installation rule must be boolean: ${key}`, file: configPath });
  }
  if (rules.codex_agent_files_are_sources !== false || rules.allow_unconfirmed_completion_claim !== false || rules.roles_are_temporary_in_chatgpt !== true) {
    errors.push({ message: "ChatGPT installation rules must keep Codex agent files out, roles temporary, and completion evidence-based.", file: configPath });
  }

  const invocation = config.post_install_invocation ?? {};
  for (const key of ["allow_implicit_routing_for_eligible_skills", "prefer_smallest_sufficient_route", "full_pipeline_requires_explicit_request_or_multistage_fit"]) {
    if (invocation[key] !== true) errors.push({ message: `ChatGPT post-install invocation rule must be true: ${key}`, file: configPath });
  }
  if (invocation.explicit_route_skill !== "workflow-orchestrator" || invocation.explicit_pipeline_skill !== "pipeline-core") {
    errors.push({ message: "ChatGPT post-install invocation must use workflow-orchestrator for explicit routing and pipeline-core for explicit multi-stage routing.", file: configPath });
  }
  const configuredExplicitOnly = Array.isArray(invocation.explicit_only_skills) ? invocation.explicit_only_skills : [];
  const explicitOnlySet = new Set(configuredExplicitOnly);
  if (configuredExplicitOnly.length !== explicitOnlySet.size || EXPLICIT_ONLY_SKILLS.some((name) => !explicitOnlySet.has(name)) || configuredExplicitOnly.some((name) => !EXPLICIT_ONLY_SKILLS.includes(name))) {
    errors.push({ message: `ChatGPT explicit-only skills must be exactly: ${EXPLICIT_ONLY_SKILLS.join(", ")}.`, file: configPath });
  }

  const sourceRootPath = join(root, config.source_root ?? ".agents/skills");
  const names = sourceSkillNames(root, config.source_root ?? ".agents/skills");
  const nameSet = new Set(names);
  if (!existsSync(sourceRootPath) || !lstatSync(sourceRootPath).isDirectory() || lstatSync(sourceRootPath).isSymbolicLink()) {
    errors.push({ message: "ChatGPT skill source_root must be a normal directory, not a symlink.", file: sourceRootPath });
  }

  const profiles = config.profiles;
  if (!profiles || typeof profiles !== "object" || Array.isArray(profiles)) {
    errors.push({ message: "ChatGPT setup must define install profiles.", file: configPath });
  } else {
    for (const required of ["core", "creative", "full"]) {
      if (!profiles[required]) errors.push({ message: `ChatGPT setup is missing profile: ${required}`, file: configPath });
    }
    for (const [profileName, profile] of Object.entries(profiles)) {
      if (!SKILL_NAME.test(profileName) || typeof profile.summary !== "string" || !Array.isArray(profile.skills)) {
        errors.push({ message: `Invalid ChatGPT install profile: ${profileName}`, file: configPath });
        continue;
      }
      const seen = new Set();
      for (const name of profile.skills) {
        if (!nameSet.has(name)) errors.push({ message: `Profile ${profileName} references unknown skill: ${name}`, file: configPath });
        if (seen.has(name)) errors.push({ message: `Profile ${profileName} contains duplicate skill: ${name}`, file: configPath });
        seen.add(name);
      }
    }
    const full = new Set(profiles.full?.skills ?? []);
    for (const name of names) if (!full.has(name)) errors.push({ message: `Full ChatGPT profile is missing skill: ${name}`, file: configPath });
    for (const name of full) if (!nameSet.has(name)) errors.push({ message: `Full ChatGPT profile has unknown skill: ${name}`, file: configPath });
  }

  for (const name of names) {
    const skillDir = join(sourceRootPath, name);
    const { files, errors: fileErrors } = collectSkillFiles(root, config, name);
    errors.push(...fileErrors);
    const skillPath = join(skillDir, "SKILL.md");
    const parsed = parseSkillFrontmatter(readFileSync(skillPath, "utf8"));
    if (parsed.error) errors.push({ message: parsed.error, file: skillPath });
    if (parsed.name !== name || !SKILL_NAME.test(parsed.name ?? "")) errors.push({ message: `Skill name must match its directory: ${name}`, file: skillPath });
    if (!parsed.description || parsed.description.length > 1024) errors.push({ message: `Skill description is missing or too long: ${name}`, file: skillPath });
    if (!files.some((file) => file.path === "SKILL.md")) errors.push({ message: `Source inventory would miss SKILL.md: ${name}`, file: skillPath });

    const metadataPath = join(skillDir, "agents/openai.yaml");
    if (!existsSync(metadataPath)) {
      errors.push({ message: `Native ChatGPT UI metadata is missing: ${name}`, file: metadataPath });
    } else {
      const metadata = parseOpenAiMetadata(readFileSync(metadataPath, "utf8"));
      if (!metadata.displayName) errors.push({ message: `display_name is missing: ${name}`, file: metadataPath });
      if (!metadata.shortDescription || metadata.shortDescription.length < 25 || metadata.shortDescription.length > 64) errors.push({ message: `short_description must contain 25-64 characters: ${name}`, file: metadataPath });
      if (!metadata.defaultPrompt?.includes(`$${name}`)) errors.push({ message: `default_prompt must mention $${name}`, file: metadataPath });
      if (typeof metadata.allowImplicitInvocation !== "boolean") errors.push({ message: `allow_implicit_invocation must be boolean: ${name}`, file: metadataPath });
      const expectedImplicit = !explicitOnlySet.has(name);
      if (typeof metadata.allowImplicitInvocation === "boolean" && metadata.allowImplicitInvocation !== expectedImplicit) {
        errors.push({ message: `Post-install invocation policy for ${name} requires allow_implicit_invocation: ${expectedImplicit}.`, file: metadataPath });
      }
    }
  }

  const bootstrapPath = join(root, config.bootstrap_path ?? "CHATGPT_INSTALL.md");
  if (!existsSync(bootstrapPath)) {
    errors.push({ message: "Canonical ChatGPT installer is missing.", file: bootstrapPath });
  } else {
    const bootstrap = readFileSync(bootstrapPath, "utf8");
    for (const section of REQUIRED_BOOTSTRAP_SECTIONS) {
      if (!bootstrap.includes(`## ${section}`)) errors.push({ message: `ChatGPT installer is missing section: ${section}`, file: bootstrapPath });
    }
    for (const phrase of REQUIRED_BOOTSTRAP_PHRASES) {
      if (!bootstrap.includes(phrase)) errors.push({ message: `ChatGPT installer is missing required phrase: ${phrase}`, file: bootstrapPath });
    }
  }

  const manifestPath = join(root, config.source_manifest_path ?? MANIFEST_PATH);
  if (!existsSync(manifestPath)) {
    errors.push({ message: "ChatGPT skill source manifest is missing. Run npm run chatgpt:skills:sources:update.", file: manifestPath });
  } else {
    try {
      const actual = readJson(manifestPath);
      const expected = buildChatGptSkillSourceManifest(root);
      if (JSON.stringify(actual) !== JSON.stringify(expected)) {
        errors.push({ message: "ChatGPT skill source manifest is stale. Run npm run chatgpt:skills:sources:update.", file: manifestPath });
      }
      for (const skill of actual.skills ?? []) {
        for (const file of skill.files ?? []) {
          if (!SHA256.test(file.sha256 ?? "") || typeof file.raw_url !== "string") errors.push({ message: `Invalid source entry for ${skill.name}: ${file.path}`, file: manifestPath });
        }
      }
    } catch (error) {
      errors.push({ message: `ChatGPT skill source manifest is invalid: ${error.message}`, file: manifestPath });
    }
  }

  return errors;
}

function help() {
  return `
Usage:
  node scripts/chatgpt-skill-sources.mjs
  node scripts/chatgpt-skill-sources.mjs --write

Options:
  --write     Regenerate config/chatgpt-skill-sources.json from repository skill sources.
  --check     Validate the checked-in setup and source manifest. This is the default.
  --help, -h  Show this help output.
`;
}

if (isMainModule(import.meta.url)) {
  try {
    const args = process.argv.slice(2);
    if (args.includes("--help") || args.includes("-h")) {
      console.log(help().trim());
      process.exit(0);
    }
    const unknown = args.filter((arg) => !["--write", "--check"].includes(arg));
    if (unknown.length > 0) throw new Error(`Unknown option: ${unknown[0]}`);
    if (args.includes("--write")) {
      const manifest = writeChatGptSkillSourceManifest();
      console.log(`updated ChatGPT repository source manifest (${manifest.skills.length} skills)`);
    }
    const errors = validateChatGptRepositorySetup();
    if (errors.length > 0) throw new Error(errors.map((error) => `${error.message} (${error.file})`).join("\n"));
    console.log(`ChatGPT repository skill setup passed (${sourceSkillNames(repoRoot, ".agents/skills").length} skills)`);
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
}
