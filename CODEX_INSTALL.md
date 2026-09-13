# Install the Workflow Kit in Codex

## Native Skill Installation

Use Codex's built-in `$skill-installer` for a fresh installation. Each selected
directory in `.agents/skills` becomes a separate personal Codex Skill in
`$CODEX_HOME/skills/<skill-name>` (normally `~/.codex/skills`).
Use the active host's actual default, not a guessed machine-specific path.

The 35 existing Skills already contain the integrated static-design knowledge.
Do not install a separate Static Graphic Design Creator Skill or a wrapper Skill.
This route does not clone the repository into the user's project, render
`.codex/agents`, create `AGENTS.md`, write `framecore.config.json`, or create
`.framecore/manifest.json`. It does not install the repository's CLI commands.

For those project-level components, deliberately choose the optional
[advanced project-local installer](docs/codex-project-install.md) instead.
Its home-workspace `--mode global` is not the native personal Skills route.

## Copy-Paste Install Prompt

Open Codex with its built-in `$skill-installer` available and paste:

```text
Use $skill-installer to install selected FrameCore workflow Skills from this public repository:
https://github.com/FrameCoreWorks/framecore-works-codex-chatgpt-workflow-kit

First read CODEX_INSTALL.md. Confirm that this is Codex and that the built-in $skill-installer is
available. Keep installation guidance in English; do not infer my language from this copied prompt.

Resolve the latest main commit once. Read the guide, profiles and source inventory at that same
full commit. Recommend the smallest useful core, creative or full profile, show the exact Skill
list and destination, and obtain my approval before installation.

Use the native $skill-installer helper with --repo, the pinned --ref and only the approved
.agents/skills/<skill-name> paths. Install into $CODEX_HOME/skills, using the host's actual default.
Do not clone this repository into my project, run the project-local installer or install agent
TOMLs, AGENTS files, project config or a .framecore manifest.

Preflight every selected destination and verify every declared source file and SHA-256 before
writes. If a Skill already exists in the destination or another active scope, stop and follow
CODEX_UPDATE.md for that existing installation; do not overwrite it or create a duplicate.
Do not treat a multi-Skill installation as atomic. After any failure, inspect actual saved state
and report which Skills succeeded, failed or were not attempted before proposing recovery.

After installation, verify the complete saved inventory and bytes against the pinned source.
Record source identity and verification outside the Skill bundles. Only then resolve my working
language from my explicit preference or own conversation, excluding copied setup prompts; use a
reliably exposed locale only as a fallback, otherwise English. Explain the installed Skills and
give one useful starter prompt. Tell me they will be available on my next turn without claiming
that host activation was observed. Do not use providers, upload files or publish anything.
```

## Select and Pin the Source

1. Resolve the current `main` to one full 40-character Git commit. Read this guide,
   `config/chatgpt-skills.json` and `config/chatgpt-skill-sources.json` at that
   same full commit. Stop if source identity or access cannot be verified.
2. Reuse only the `profiles` selection from the setup config and the `skills`
   source inventory. Despite the config filenames, these identify the same
   portable Skill directories used by Codex. The ChatGPT-specific creation,
   save, UI and approval instructions do not govern Codex installation.
3. Recommend `core`, `creative` or `full` based on the user's work. Show the exact
   list in profile order. Install only the approved selection; `full` is not
   implicit approval for every user. Resolve role IDs to supporting Skill names,
   not invented directories.
4. For each name, use its declared `source_dir`, exactly
   `.agents/skills/<skill-name>`. Require safe relative paths, one matching
   `SKILL.md` identity, no symlinks, duplicate paths, traversal or undeclared
   files. Preserve the complete relative bundle, including references,
   templates, scripts and `agents/openai.yaml` when declared.
5. Fetch every declared `repository_path` at the pinned commit and verify its
   SHA-256. The inventory currently publishes moving `main` raw URLs: derive
   immutable URLs from the verified repository, full commit and repository path.
   Do not keep following `main` during a transaction or invent an immutable
   release field that this kit does not declare. An integrity mismatch blocks
   installation until the source has been resolved and checked again.

## Preflight and Install

Read the active system Skill and use its actual helper location. Preflight every
selected destination before the first copy, including dangling links and
collisions with existing Skills in other active scopes. Do not shadow a
project-local Skill with a new personal copy. Existing Skills route to
[CODEX_UPDATE.md](CODEX_UPDATE.md); they are not fresh-install targets.

After approval, invoke the built-in helper using the selected source directories.
This is a command shape, not a ready-to-run full-profile command; resolve every
placeholder from the verified host and approved selection:

```bash
python3 "<skill-installer-dir>/scripts/install-skill-from-github.py" \
  --repo FrameCoreWorks/framecore-works-codex-chatgpt-workflow-kit \
  --ref "<full-commit-sha>" \
  --path ".agents/skills/<approved-skill-name>"
```

Multiple approved paths may follow `--path`. Do not use `--name` to bypass an
existing identity, `--dest` to silently change scope, or a manual copy as an
unannounced fallback. Follow the host's permission requirements for network
access and writes. If the built-in installer is unavailable, report the blocker;
a source read alone means nothing was installed.

The helper refuses an existing destination, but multi-Skill installation is
not atomic: earlier copies can remain if a later one fails. Preflight is not a
transaction lock. Inspect every actual destination after failure and report
installed, partial, failed and unattempted items. Do not blindly rerun the batch,
delete existing directories or claim a rollback that did not happen.

## Verify and Start

Verify every saved relative path and SHA-256 against the pinned inventory.
Check for missing or extra files and retain a private receipt outside the Skill
bundles with the source commit, approved list, destination, source hashes,
saved hashes and any exact host adaptation. Do not modify canonical hashes to
hide a deviation. If full readback is unavailable, report
`verification_unavailable`, not a verified installation.

Tell the user that the Skills will be available on their next turn. Filesystem
verification is not proof of host discovery, invocation or creative efficacy.
Do not require a restart unless the actual host reports that requirement.

Only after verified installation, resolve language from an explicit preference,
then user-authored conversation, then reliably exposed locale, otherwise English.
A copied English install prompt is not a language preference. Keep the Workflow
Profile visible or save it privately only with approval; no project config or
manifest is required for native Skills. On the next turn, if the approved profile
includes the orchestrator, use:

```text
Use $workflow-orchestrator with my installed FrameCore Skills. Help me choose the smallest useful
workflow for my next task. Do not assume project agent files, a manifest or uninstalled Skills exist.
```

See [updates](CODEX_UPDATE.md) and
[personal Skill extensions](docs/skill-customization.md).
