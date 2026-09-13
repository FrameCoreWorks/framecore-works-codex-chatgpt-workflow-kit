import assert from "node:assert/strict";
import { cpSync, existsSync, lstatSync, mkdtempSync, readFileSync, readdirSync, rmSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import test from "node:test";
import { run as validateDocs } from "../scripts/validate/docs.mjs";
import { root, sha256 } from "./helpers.mjs";

const read = path => readFileSync(join(root, path), "utf8");
const firstPrompt = path => read(path).match(/\x60\x60\x60text\n([\s\S]*?)\n\x60\x60\x60/)[1];

function findingsWith(transform = text => text) {
  const findings = [];
  validateDocs({
    root,
    requiredRoles: [],
    helpers: {
      appearsInOrder: () => true,
      markdownSections: text => new Set([...text.matchAll(/^## (.+)$/gm)].map(match => match[1])),
      read: path => transform(readFileSync(path, "utf8"), path),
      createFindings: () => ({
        findings,
        addFinding: (code, message) => findings.push({ code, message })
      })
    }
  });
  return findings;
}

test("Codex primary prompt uses native installation without project CLI writes", () => {
  const prompt = firstPrompt("CODEX_INSTALL.md");
  assert.match(prompt, /^Use \$skill-installer/);
  assert.match(prompt, /--repo, the pinned --ref/);
  assert.match(prompt, /only the approved\n\.agents\/skills\/<skill-name>/);
  assert.match(prompt, /\$CODEX_HOME\/skills/);
  assert.match(prompt, /do not overwrite it or create a duplicate/);
  assert.match(prompt, /Do not clone this repository into my project/);
  assert.match(prompt, /do not treat a multi-Skill installation as atomic/i);
  assert.match(prompt, /available on my next turn/);
  assert.ok(read("README.md").includes(prompt));
  assert.ok(read("docs/getting-started-5-minutes.md").includes(prompt));
  assert.doesNotMatch(prompt, /npm run|--mode project-local|--force/);
});

test("native updates preserve existing identity and do not claim automatic merging", () => {
  const prompt = firstPrompt("CODEX_UPDATE.md");
  assert.match(prompt, /^Use \$skill-creator/);
  assert.match(prompt, /do not use \$skill-installer as an updater/);
  assert.match(prompt, /docs\/codex-project-update.md/);
  assert.match(prompt, /previous verified source when available/);
  assert.match(prompt, /wait for my approval before any saved change/);
  assert.match(prompt, /recheck the source and installed bytes for drift/);
  assert.match(prompt, /without another save/);
});

test("native route validation rejects removed collision, pinning and partial-state guards", () => {
  for (const phrase of [
    "$skill-installer", "--ref", "SHA-256", "not atomic",
    "do not overwrite it or create a duplicate", "verification_unavailable"
  ]) {
    const findings = findingsWith((text, path) => path.endsWith("CODEX_INSTALL.md")
      ? text.replaceAll(phrase, "REMOVED") : text);
    assert.ok(findings.some(item => item.code === "WEAK_LIFECYCLE_DOC" && item.message.includes(phrase)), phrase);
  }
});

test("README native-route validation inspects its Codex section, not unrelated mentions", () => {
  const findings = findingsWith((text, path) => path.endsWith("README.md")
    ? text.replace(/### Codex\n[\s\S]*?(?=## Update an existing installation)/,
      "### Codex\n\nUse the project-local installer.\n\n")
    : text);
  assert.ok(findings.some(item => item.code === "WEAK_README_CODEX_SKILLS"));
});

test("advanced project guides retain the CLI lifecycle as an explicit separate scope", () => {
  assert.match(firstPrompt("docs/codex-project-install.md"), /docs\/codex-project-install.md/);
  assert.match(firstPrompt("docs/codex-project-update.md"), /docs\/codex-project-update.md/);
  assert.match(read("docs/codex-project-install.md"), /--defaults --yes/);
  assert.match(read("docs/codex-project-update.md"), /git fetch origin main/);
  for (const path of ["docs/quickstart.md", "docs/codex-assisted-install.md"]) {
    assert.match(read(path), /default native \x60\$skill-installer\x60 route/);
    assert.match(read(path), /optional advanced project-local installer/);
  }
});

function inventory(path, prefix = "") {
  return readdirSync(path).flatMap(name => {
    const full = join(path, name);
    const relative = prefix + name;
    const stat = lstatSync(full);
    assert.equal(stat.isSymbolicLink(), false, relative);
    if (stat.isDirectory()) return inventory(full, relative + "/");
    assert.ok(stat.isFile(), relative);
    return [relative];
  }).sort();
}

test("native Skill payload simulation preserves all declared files without project tooling", t => {
  const temp = mkdtempSync(join(tmpdir(), "framecore-native-payload-"));
  t.after(() => rmSync(temp, { recursive: true, force: true }));
  const config = JSON.parse(read("config/chatgpt-skills.json"));
  const manifest = JSON.parse(read("config/chatgpt-skill-sources.json"));
  assert.equal(manifest.skills.length, 35);
  const sources = new Map(manifest.skills.map(skill => [skill.name, skill]));
  for (const [profileName, profile] of Object.entries(config.profiles)) {
    const destination = join(temp, profileName);
    assert.equal(new Set(profile.skills).size, profile.skills.length);
    for (const name of profile.skills) {
      const source = sources.get(name);
      assert.ok(source, name);
      assert.equal(source.source_dir, `.agents/skills/${name}`);
      const skillRoot = join(destination, name);
      // Offline payload check only: this does not exercise host discovery or the system installer.
      cpSync(join(root, source.source_dir), skillRoot, { recursive: true, errorOnExist: true, force: false });
      assert.deepEqual(inventory(skillRoot), source.files.map(file => file.path).sort(), name);
      for (const file of source.files) {
        assert.equal(sha256(join(skillRoot, file.path)), file.sha256, `${name}/${file.path}`);
      }
      assert.ok(existsSync(join(skillRoot, "SKILL.md")));
      assert.ok(existsSync(join(skillRoot, "agents/openai.yaml")));
    }
    assert.deepEqual(readdirSync(destination).sort(), [...profile.skills].sort());
    for (const absent of [".framecore", ".codex", ".agents", "AGENTS.md", "scripts", "framecore.config.json", "static-graphic-design-creator"]) {
      assert.equal(existsSync(join(destination, absent)), false, absent);
    }
    const onboarding = readFileSync(join(destination, "onboarding-preference-tuning/SKILL.md"), "utf8");
    assert.match(onboarding, /Native \x60\$skill-installer\x60 is the default Codex route/);
    assert.match(onboarding, /No project config/);
  }
});
