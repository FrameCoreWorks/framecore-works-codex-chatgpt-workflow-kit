import assert from "node:assert/strict";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import test from "node:test";
import { buildChatGptSkillSourceManifest } from "../scripts/chatgpt-skill-sources.mjs";
import { catalogMarkdown, entries, loadCatalog, resolveCode, search, validateCatalog } from "../.agents/skills/commercial-visual-campaign-director/scripts/poster-codes.mjs";
import { preflight } from "../.agents/skills/image-prompt-architect/scripts/static-design-preflight.mjs";
import { run as validateStaticDesign } from "../scripts/validate/static-design.mjs";
import { createFindings } from "../scripts/validate/context.mjs";
import { copyRepoFixture, root, run, failRun, sha256 } from "./helpers.mjs";

const direction = ".agents/skills/commercial-visual-campaign-director";
const prompting = ".agents/skills/image-prompt-architect";
const catalogScript = `${direction}/scripts/poster-codes.mjs`;
const preflightScript = `${prompting}/scripts/static-design-preflight.mjs`;
const baseline = () => JSON.parse(readFileSync(join(root, prompting, "templates/static-design-notes.json"), "utf8"));
const catalog = loadCatalog();

test("merged catalog retains all 200 source codes, categories, descriptions and attribution", () => {
  assert.equal(entries(catalog).length, 200);
  assert.equal(catalog.categories.length, 20);
  const provenance = JSON.parse(readFileSync(join(root, "docs/static-graphic-design-provenance.json"), "utf8"));
  const source = provenance.files.find((file) => file.treatment === "unchanged_data");
  assert.equal(sha256(join(root, source.target_path)), source.source_sha256);
  assert.equal(catalog.source.author, "John Savage AI");
  assert.equal(catalog.interpretation_provenance.author, "FrameCore Works");
  assert.equal(catalog.evidence_limits.native_generator_command_support, "Unknown");
  for (const [i, category] of catalog.categories.entries()) {
    assert.equal(category.number, i + 1);
    assert.equal(category.pdf_page, Math.floor(i / 4) + 2);
    assert.equal(category.codes.length, 10);
  }
});

test("poster lookup round trips exact aliases and never fuzzily selects a code", () => {
  for (const entry of entries(catalog)) {
    for (const alias of [entry.id, entry.code, entry.shorthand, entry.shorthand.slice(1)]) {
      assert.equal(resolveCode(`  ${alias.toLowerCase().replaceAll(" ", "   ")}  `, catalog)?.id, entry.id);
    }
  }
  assert.equal(resolveCode("Bauhaus", catalog), null);
  assert.ok(search("Bauhaus", catalog).length > 0);
  for (const value of ["", " ", "/rebuild", "/Two Ink Collision /rebuild now", "EP201", "../secret"]) {
    assert.equal(resolveCode(value, catalog), null);
  }
});

test("catalog rejects lost entries, reordered categories and changed original spelling", () => {
  for (const mutate of [
    (value) => value.categories.pop(),
    (value) => value.categories[0].codes.pop(),
    (value) => value.categories.reverse(),
    (value) => { value.categories[0].codes[0].code = "/Changed /rebuild"; },
    (value) => { value.categories[0].codes[0].interpretation.description_en = ""; },
    (value) => { value.source.author = "Unknown"; }
  ]) {
    const changed = structuredClone(catalog);
    mutate(changed);
    assert.throws(() => validateCatalog(changed));
  }
});

test("full catalog and CLI expose all entries with read-only lookup boundaries", () => {
  const markdown = catalogMarkdown(catalog);
  assert.equal(markdown.split("\n").filter((line) => line.startsWith("### ")).length, 20);
  for (const entry of entries(catalog)) assert.equal(markdown.split(`\`${entry.code}\``).length - 1, 1);
  assert.equal(run([catalogScript, "--command", "/kody"]), `${markdown}\n`);
  assert.equal(JSON.parse(run([catalogScript, "--code", "EP011"])).match.shorthand, "/Two Ink Collision");
  assert.equal(JSON.parse(run([catalogScript, "--category", "02"])).categories[0].number, 2);
  assert.equal(JSON.parse(run([catalogScript, "--query", "Bauhaus"])).selected, null);
  assert.equal(failRun([catalogScript, "--code", "not a code"]).status, 1);
  for (const args of [[], ["--code"], ["--query", ""], ["--run", "EP011"], ["--code", "EP011", "--query", "test"]]) {
    assert.equal(failRun([catalogScript, ...args]).status, 2);
  }
});

test("static preflight accepts complete supplied decisions without adding rendering authority", () => {
  const result = preflight(baseline());
  assert.equal(result.status, "ready_for_prompt_review");
  assert.deepEqual(result.blockers, []);
  assert.match(result.evidence_scope, /not consent, facts, pixels or execution/);
});

test("static preflight protects selected copy, required metadata, feasibility and source truth", async (t) => {
  const cases = [
    ["unselected copy", (value) => { value.copy.selection_status = "needs_selection"; }, /selected or locked/],
    ["unselected concept", (value) => { value.concept.status = "needs_selection"; }, /concept lock/],
    ["missing words", (value) => { value.prompt = value.prompt.replace("CISZA", "CISZ"); }, /exact copy title/],
    ["required metadata", (value) => { value.copy.items.push({ id: "date", text: "14 JUNE", role: "metadata", required: true, authority: "user" }); }, /exact copy date/],
    ["unassessed typography", (value) => { value.feasibility.status = "not_assessed"; }, /feasibility/],
    ["no review plan", (value) => { value.feasibility.review_plan = []; }, /review plan/],
    ["print master", (value) => { value.production_intent = "production_master"; }, /dtp_required/],
    ["required unavailable source", (value) => { value.references = [{ id: "product", roles: ["product"], required: true, status: "unavailable", source: "supplied-front.png" }]; }, /unresolved/],
    ["conflicting source", (value) => { value.references = [{ id: "product", roles: ["product"], required: true, status: "conflict", source: "supplied-front.png" }]; }, /unresolved/],
    ["render scope", (value) => { value.request_kind = "render"; }, /not render authorization/]
  ];
  for (const [name, mutate, expected] of cases) {
    await t.test(name, () => {
      const value = baseline();
      mutate(value);
      const result = preflight(value);
      assert.equal(result.status, "blocked");
      assert.match(result.blockers.join("\n"), expected);
    });
  }
});

test("missing wording differs from deliberately text-free work and small factual copy is not automatic DTP", () => {
  const noCopy = baseline();
  noCopy.copy = { route: "no_copy", selection_status: "not_required", items: [] };
  noCopy.prompt = "One text-free abstract concept. No lettering.";
  assert.equal(preflight(noCopy).status, "ready_for_prompt_review");
  noCopy.copy.route = "copy_discovery";
  assert.equal(preflight(noCopy).status, "blocked");
  const factual = baseline();
  factual.copy.items = [{ id: "price", text: "12.50 EUR", role: "metadata", required: true, authority: "supplied fictional example" }];
  factual.prompt = "One roomy concept price card with exactly 12.50 EUR and no other text.";
  factual.feasibility.status = "at_risk";
  assert.equal(preflight(factual).status, "ready_for_prompt_review");
});

test("scoped edits require a source and disjoint changed/protected text coverage", () => {
  const edit = baseline();
  edit.task_mode = "edit";
  edit.references = [{ id: "current", required: true, roles: ["edit_source"], source: "approved-current.png", status: "available" }];
  edit.edit_scope = { source_reference_id: "current", change: "background only", changed_copy_ids: [], protected_copy_ids: ["title"], protected_properties: ["exact text, layout, crop"] };
  edit.prompt = "Change only the background to white. Preserve all source text, layout and crop.";
  assert.equal(preflight(edit).status, "ready_for_prompt_review");
  edit.edit_scope.changed_copy_ids = ["title"];
  assert.equal(preflight(edit).status, "blocked");
  edit.edit_scope.protected_copy_ids = [];
  assert.match(preflight(edit).blockers.join("\n"), /exact copy title/);
  edit.prompt += " The changed text must be CISZA.";
  assert.equal(preflight(edit).status, "ready_for_prompt_review");
  edit.references[0].roles = ["style"];
  assert.equal(preflight(edit).status, "blocked");
  edit.references[0].roles = 42;
  assert.equal(preflight(edit).status, "blocked");
});

test("advice and copy-only work stay outside prompt production; malformed state fails closed", () => {
  for (const request_kind of ["advice", "concepts", "copy"]) {
    assert.equal(preflight({ request_kind, prompt: "" }).status, "not_applicable");
    assert.equal(preflight({ request_kind, prompt: "Unrequested final prompt" }).status, "blocked");
  }
  for (const value of [null, [], 42, "bad", {}, { request_kind: "prompt", references: [null], copy: { items: [null] } }]) {
    assert.equal(preflight(value).status, "blocked");
  }
});

test("existing ChatGPT skills own all new resources; no separate skill or install profile exists", () => {
  const config = JSON.parse(readFileSync(join(root, "config/chatgpt-skills.json"), "utf8"));
  const manifest = buildChatGptSkillSourceManifest(root);
  const files = new Map(manifest.skills.flatMap((skill) => skill.files.map((file) => [file.repository_path, file])));
  for (const path of [catalogScript, preflightScript, `${direction}/references/event-poster-design-codes.json`, `${prompting}/references/unified-static-prompt-contract.md`]) {
    assert.equal(files.get(path)?.sha256, sha256(join(root, path)), path);
  }
  assert.equal(manifest.skills.length, 35);
  assert.ok(!manifest.skills.some((skill) => skill.name === "static-graphic-design-creator"));
  for (const name of ["commercial-visual-campaign-director", "image-prompt-architect", "copy-voice", "reference-pack-curator", "output-critic-iteration", "asset-manifest"]) {
    assert.ok(config.profiles.creative.skills.includes(name));
    assert.ok(config.profiles.full.skills.includes(name));
  }
});

test("installed resources and read-only helpers work outside the source repo through update and uninstall", (t) => {
  const target = mkdtempSync(join(tmpdir(), "framecore-static-install-"));
  t.after(() => rmSync(target, { recursive: true, force: true }));
  run(["scripts/install.mjs", "--mode", "project-local", "--target", target]);
  const owners = new Set(["commercial-visual-campaign-director", "image-prompt-architect", "copy-voice", "reference-pack-curator", "output-critic-iteration", "asset-manifest"]);
  const paths = buildChatGptSkillSourceManifest(root).skills
    .filter((skill) => owners.has(skill.name)).flatMap((skill) => skill.files.map((file) => file.repository_path));
  for (const path of paths) assert.equal(sha256(join(target, path)), sha256(join(root, path)));
  const before = readdirSync(target).sort();
  const installedCatalog = JSON.parse(run([join(target, catalogScript), "--code", "EP200"], { cwd: target }));
  assert.equal(installedCatalog.match.id, "EP200");
  const preflightResult = JSON.parse(run([join(target, preflightScript), join(target, prompting, "templates/static-design-notes.json")], { cwd: target }));
  assert.equal(preflightResult.status, "ready_for_prompt_review");
  assert.deepEqual(readdirSync(target).sort(), before);
  run(["scripts/install.mjs", "--mode", "update", "--target", target]);
  for (const path of paths) assert.equal(sha256(join(target, path)), sha256(join(root, path)));
  const manifest = JSON.parse(readFileSync(join(target, ".framecore/manifest.json"), "utf8"));
  for (const path of paths) {
    assert.ok(manifest.managed_paths.includes(path), path);
    assert.equal(manifest.managed_hashes[path], sha256(join(target, path)));
  }
  assert.ok(!existsSync(join(target, ".agents/skills/static-graphic-design-creator")));
  run(["scripts/install.mjs", "--mode", "uninstall", "--target", target, "--yes"]);
  for (const path of paths) assert.ok(!existsSync(join(target, path)));
});

test("preflight CLI returns machine-readable blocked state without changing its input", (t) => {
  const target = mkdtempSync(join(tmpdir(), "framecore-static-check-"));
  t.after(() => rmSync(target, { recursive: true, force: true }));
  const value = baseline();
  value.copy.selection_status = "needs_selection";
  const file = join(target, "notes.json");
  writeFileSync(file, JSON.stringify(value));
  const before = sha256(file);
  const result = failRun([preflightScript, file]);
  assert.equal(result.status, 1);
  assert.equal(JSON.parse(result.stdout).status, "blocked");
  assert.equal(sha256(file), before);
});

test("repository validation rejects catalog drift, blocked example state and a duplicate standalone skill", (t) => {
  const target = copyRepoFixture("framecore-static-validation-");
  t.after(() => rmSync(target, { recursive: true, force: true }));
  const changedCatalog = structuredClone(catalog);
  changedCatalog.categories[0].codes[0].interpretation.description_en = "A changed description with unchanged original code spelling.";
  writeFileSync(join(target, direction, "references/event-poster-design-codes.json"), JSON.stringify(changedCatalog));
  const notes = baseline();
  notes.production_intent = "production_master";
  writeFileSync(join(target, prompting, "templates/static-design-notes.json"), JSON.stringify(notes));
  mkdirSync(join(target, ".agents/skills/static-graphic-design-creator"));
  const codes = validateStaticDesign({ root: target, helpers: { createFindings } }).findings.map((finding) => finding.code);
  assert.ok(codes.includes("STATIC_DESIGN_SOURCE_DRIFT"));
  assert.ok(codes.includes("INVALID_STATIC_DESIGN_EXAMPLE"));
  assert.ok(codes.includes("DUPLICATE_STATIC_DESIGN_SKILL"));
});
