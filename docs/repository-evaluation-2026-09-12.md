# Repository Evaluation: 2026-09-12

Scope: current local Workflow Kit at base commit `0bab468`, including its
pre-existing changes to `scripts/common.mjs` and
`tests/install-onboarding.test.mjs`, plus the requested static-design
integration. Those two pre-existing changes were preserved, not authored by
this integration. No historical test result was used as current evidence.

## Assessment

### Remediation Update: 2026-09-13

The user subsequently approved implementation of all six confirmed findings,
followed by commit and push. All six are now addressed in the working change:

- Filesystem containment: shared manifest loading rejects metadata/ancestor
  symlinks before reads and all removal paths pass preflight.
- Backups: `lstatSync` occupancy checks and exclusive creation with collision
  retry are shared by onboarding and installer writes.
- Retirement: obsolete files receive backups before removal; changed/unhashed
  files block without force, and ownership remains in incomplete manifests.
- Configuration: onboarding starts with effective settings, persists only local
  overrides, and preserves future shared inheritance.
- Layer validation: non-object JSON and malformed JSON are rejected before
  merging, with layer-specific diagnostics that do not echo input contents.
- Distribution: explicit source/package validation scopes and real offline npm
  tarball tests cover every exported CLI and guided installation.

Independent review also identified alias-based retirement, unhashed files during
interrupted-install retry, and outdated direct-local-config instructions. These
were repaired within the same lifecycle/configuration scope. No new dependency,
provider route, standalone static-design skill or manifest schema was added.

Regression evidence is in `tests/install-safety.test.mjs`,
`tests/config-layers.test.mjs` and `tests/package-cli.test.mjs`. The findings and
line numbers below describe the original reviewed snapshot, not current code.
The broader product suggestions remain a roadmap, not claims of implemented
host-side ChatGPT behavior. Filesystem checks are not a transaction against a
concurrent hostile process replacing parent directories.

The core idea is coherent: portable skills and neutral responsibilities help
the user move through briefs, references, direction, prompts, evidence-based
QA and delivery. Codex adds a project-local lifecycle; ChatGPT consumes declared
skill sources. Provider runtimes and autonomous background work stay outside
the product. Preserve that division.

Strengths observed in source and tests:

- Explicit role ownership, gates, handoffs and artifact expectations.
- Standard-library Node tooling with no runtime dependency installation.
- Hash manifests, incomplete-install state, local-change protection and
  repeatable basic install/update/repair/uninstall tests.
- Privacy, secrets, path, instruction-injection, package and link checks.
- Creative prompt contracts distinguish reference attachment, continuity,
  exact text, edit preservation, target-specific evidence and observed output.
- Onboarding profiles, native metadata and source-file inventories are checked.

The main weakness is lifecycle edge-case coverage. A green baseline does not
prove containment of every filesystem operation or correct behavior for
malformed configs, removed assets or a packaged distribution. Some creative
checks also verify declared text/contracts rather than actual model behavior.

## Confirmed Findings

These are existing issues, reproduced in temporary fixtures during this review.
They were initially proposed separately from the domain merge and were later
implemented after explicit user approval; see the remediation update above.

### P1: Uninstall follows a parent-directory symlink outside the target

Evidence: [manifest validation](../scripts/manifest.mjs) around line 56 checks
only the final entry with `lstatSync`; [uninstall](../scripts/install.mjs) around
line 220 removes its resolved path without checking every parent component.

Trigger: a recorded `linked/owned.md` exists beneath a `linked` directory
symlink pointing outside the target. `validateManifest` returns no errors,
doctor accepts uninstall, and `uninstall --yes` removes the outside file.
This requires local target/manifest state; it is not evidence of remote access.

Smallest durable fix: preflight all manifest, metadata and managed-path
components against symlinks before reading/removing anything. Keep lexical
traversal checks but do not treat them as physical filesystem containment.
Recheck at mutation where feasible and document any remaining race assumptions.

Acceptance: existing/dangling parent symlinks, including `.framecore`, stop the
operation before its first mutation. An ordinary manifest uninstall still
works; all outside and unrelated files remain unchanged.

### P1: Backup follows a dangling symlink and writes outside the target

Evidence: [backup helper](../scripts/common.mjs) around lines 56 and 71 uses
`existsSync` to choose a free `.bak` name and then writes without exclusive
creation. [Onboarding](../scripts/onboard.mjs) duplicates the pattern around
lines 26 and 294.

Trigger: existing `AGENTS.md`, with `AGENTS.md.bak` a dangling symlink to a
nonexistent outside file; an explicitly forced install returns success and
creates the outside file containing the backup. The pre-existing managed-path
symlink fix does not protect this separate backup destination.

Smallest durable fix: select occupied names with `lstatSync`, create backups
with exclusive `wx` semantics, handle `EEXIST` safely, and use one shared backup
implementation for install/onboarding. Preserve the user's existing changes.

Acceptance: existing and dangling links at `.bak`, `.bak.1` and manifest-backup
destinations never receive writes. Concurrently occupied candidates do not get
overwritten; ordinary numbered backups preserve original bytes.

### P2: Update forgets ownership of retired files

Evidence: [manifest replacement during install/update](../scripts/install.mjs)
around line 293 lists only current generated paths.

Trigger: a prior release's skill file remains on disk and in the old manifest,
but is absent from the new source. Update leaves the file on disk while dropping
it from the new manifest. It survives later uninstall and may still be found
as an active skill by the host.

Smallest durable fix: explicitly calculate retired paths. Preserve ownership
until migration resolves them. Use previous hashes to distinguish unchanged
retired files from local modifications; show planned retirement in dry-run.
Choose removal/retention policy explicitly rather than deleting unknown work.

Acceptance: a two-version update fixture handles removed/renamed skills without
unmanaged leftovers or lost customizations. A later uninstall has complete,
accurate ownership information.

### P2: Guided onboarding overrides shared team settings with defaults

Evidence: [onboarding](../scripts/onboard.mjs) around line 252 clones built-in
defaults, and [guided install](../scripts/guided-install.mjs) around line 123
always invokes onboarding. A complete local config then outranks shared values.

Trigger: a shared config specifies `pl`, `strict` and `artifacts/team`.
Guided install with `--defaults --yes --skip-check` writes effective values
`en`, `standard` and `output/workflow` instead.

Smallest durable fix: initialize from the effective shared/current config and
persist actual local overrides, not an unconditional full copy of defaults.
This is a profile consistency issue, not demonstrated removal of safety gates.

Acceptance: guided setup preserves team values; a later team update propagates
to fields without a local override. Explicit local choices still win.

### P2: Malformed config types are silently accepted

Evidence: [configuration loading](../scripts/config-validation.mjs) around
lines 34 and 60 merges source layers before checking their top-level shape.

Trigger: local JSON is `null`, `[]`, `"bad"` or `42`. Doctor calls it valid and
installation succeeds with defaults, hiding a corrupt or wrong config file.

Smallest durable fix: require each read layer to be a JSON object before merge;
then validate the effective result. Report the offending layer/path without
printing private config contents.

Acceptance: all four values fail for both local and shared layers before any
managed-file writes. Valid partial objects still inherit defaults normally.

### P2: Exported CLI validation assumes files absent from the npm payload

Evidence: [package file list](../package.json) exports `framecore-validate` and
`framecore-guided-install` but omits `tests/` and `.github/`.
[Repo governance validation](../scripts/validate/repo-governance.mjs) requires
tests and repository governance files; guided install invokes source checks.

Trigger: reproduce the declared package payload and execute its validator.
It fails on missing test/CI files. This verifies the prepared distribution
contract, not publication of this version to npm.

Smallest durable fix: separate source-maintainer checks from installable-payload
validation and execute exported CLI smoke tests from an unpacked real tarball.
Do not ship all maintainer-only data merely to hide the validation mismatch.

Acceptance: source checks still enforce tests/CI; packed guided installation
and validation succeed offline on the declared Node support matrix.

## Improvement Order

1. Close the two containment defects with focused regression fixtures first.
2. Define retired-file migration and repair shared/local configuration layering.
3. Validate distribution behavior using the actual tarball, not only its list.
4. Strengthen ChatGPT installation evidence: an already visible entry is not
   sufficient proof of this attempt's complete save. Compare intended and
   saved inventory where the host supports it; report unavailable verification.
5. Assess immutable ChatGPT source snapshots to avoid mixing mutable `main`
   reads. Reuse the current source-map authority; do not add another installer.
6. Keep initial context small through on-demand references and representative
   behavior trials. Text-presence tests remain useful structural checks but are
   not substitutes for fresh instruction-following or native-host trials.

Items 4-6 are design improvements identified from contracts, not claimed live
host failures. Preserve normal native host discovery and the user's chosen
model. No provider or background execution is needed for these fixes.

## Implemented Integration

The requested source at commit
`c3cbdf766411ca7e1131bc034bfa74ebad2efe71` is assimilated into existing skills.
See [scope and ownership](static-graphic-design.md) and
[source hashes](static-graphic-design-provenance.json).

Included: objective-first concept development; paired concept/copy routes;
composition/style/movement/production atlases; complete 200-code catalog;
text feasibility and integrated eight-stage prompting; property-level source
locks; scoped repair/material QA; explicit component/version handoffs; local
read-only Node helpers; examples; installation and source-manifest regressions.

Adapted rather than duplicated: standalone activation, copy ownership, design
schema, native execution decisions and layer delivery. Existing kit contracts,
profiles, install/update tools, provider-neutral policy and gates govern them.
The source's standalone installer/updater, lifecycle scripts, model-specific
notes and Pillow-based runtime are outside the accepted integration scope.

The public skill/role inventory remains 35/20. No added dependency, submodule,
global install, new provider, generated media or upload is part of this change.
The original integration phase was local-only; commit and push were authorized
separately in the subsequent remediation request.

## Remediation Verification: 2026-09-13

- Final `npm run release:check` in the target repository passed: 197 tests,
  zero failures/skips, privacy and secret scans, syntax, workflow/agent checks,
  35-skill source integrity, install smoke, 321-file package audit and release
  readiness. The original 184-test integration suite remains covered.
- Real npm tarball creation, unpacking and all five exported CLI entrypoints
  passed, including guided install without maintainer files and a corrupt
  runtime-payload negative case. Packaging uses the existing staged-source
  helper, offline mode, disabled npm update notifications and bounded processes.
  An initial direct-root pack stalled locally; it was stopped and the shared
  packaging path was used before the final successful full run.
- Independent targeted rechecks confirmed alias protection, shared/local
  instructions, incomplete-install retry and forced/unforced uninstall safety.
- `git diff --check` passed. Original dangling-symlink safeguards and their
  regression test were retained while the related implementation was extended.
- Verification remains local macOS/Node 22; this is not a claim of remote CI,
  native ChatGPT installation or generated-image quality results.

## Original Integration Verification

- Fresh baseline: `npm run check` passed, including 161 tests (0 failed/skipped),
  privacy, secrets, syntax, workflow and agent compliance checks.
- Independent audit subset: 48 tests passed; these are a subset of baseline
  coverage, not 48 additional baseline tests.
- Six findings above reproduced in isolated temporary fixtures.
- Final verification in the actual target repo: `npm run release:check` passed
  with 184 tests (0 failed/skipped), privacy/secrets/syntax checks, workflow and
  agent validation, ChatGPT source checks, install smoke, package audit
  (321 files) and release readiness. This includes 23 static-design tests,
  including a corruption/duplicate-skill regression and byte/hash comparison
  of all resources in the six extended skills through install/update/uninstall.
- `git diff --check` passed. Byte comparisons confirmed both pre-existing
  changed files remained identical to the baseline. The integration was applied
  locally without staging, committing or pushing the target repository.
- Independent integration review verified all 10 recorded source hashes,
  helper-only `node:*` dependencies, and no missing/cross-skill local reference
  links. Its 22-test integration subset passed; 48 malformed-state probes did
  not produce unhandled exceptions. A self-link/ownership ambiguity in the copy
  reference was corrected afterward.
- A limited instruction replay read the image-prompt skill and its references
  and returned the existing one-word `CISZA` prompt. It preserved English prompt
  instructions, exact artwork wording, white space, no pictorial subject and
  no generation. This replay is not an independent creative benchmark or native
  invocation test. See the authored walkthrough for that example's content.

Passing the original release gates did not close the six findings: their missing
edge cases explain why the original green suite was insufficient. Remediation
adds targeted regressions instead of treating those old results as proof.

Limits: local macOS/Node 22 execution only; no Windows/Linux run in this review,
no native ChatGPT save/install or live generated-image evaluation. Read-only
preflight validates declared state, not actual user consent, source authenticity,
typographic quality or final file acceptance. The original catalog PDF was not
independently re-inspected; its upstream attribution and evidence limits remain.
