# Getting Started In 5 Minutes

## Purpose

Install selected FrameCore workflow Skills through Codex's built-in
`$skill-installer`. No project clone, Node.js setup or project agent installation
is required for this native route. Static graphic design is already integrated
into the existing Skills. Providers, uploads and API keys are not installed.

For ChatGPT Work, use the separate [native ChatGPT guide](chatgpt-skills-onboarding.md)
and its `@skill-creator` prompt. The two hosts do not share an installation mechanism.

## Before You Start

Open Codex with `$skill-installer` available. The host needs permission to fetch
the public source and write its personal Skills directory. Do not create a
project clone or install GitHub Desktop just to use this route.

## Copy-Paste Prompt

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

## What Should Happen

Codex reads [CODEX_INSTALL.md](../CODEX_INSTALL.md), pins one source commit,
recommends a profile and shows the exact Skill list and destination. After your
approval, the system installer copies only those bundles into
`$CODEX_HOME/skills/<skill-name>`. Each remains a separate Skill.

Existing Skills must not be overwritten or duplicated. Use
[CODEX_UPDATE.md](../CODEX_UPDATE.md) for updates with a read-only proposal and
approval. A partial failure requires inspection of real files before retrying.

## If Installation Is Blocked

A conversation, source read or approval alone is not installation. If the
installer, source access, permissions or complete readback is unavailable,
report the actual blocker and installed state. Do not silently switch to a
project install or claim that no files were written after a partial failure.

## After Install

After verified saved content, the workflow resolves your language from your own
conversation or explicit preference, not the copied English setup prompt. The
Skills will be available on your next turn. No `.framecore` manifest or project
agent files are required. If your approved profile includes the orchestrator:

```text
Use $workflow-orchestrator with my installed FrameCore Skills. Help me choose the smallest useful
workflow for my next task. Do not assume project agent files, a manifest or uninstalled Skills exist.
```

## When To Use The Full Docs

- [Codex installation](../CODEX_INSTALL.md): source integrity, native helper and readback.
- [Codex update](../CODEX_UPDATE.md): preserve existing Skills and personal edits.
- [Skill customization](skill-customization.md): guided personal extensions.
- [Using The Kit](using-the-kit.md): concrete starter requests.
- [Advanced project install](codex-project-install.md): optional agents, config and CLI lifecycle.
- [Included Agents And Skills](included-agents-and-skills.md): inventory and responsibilities.
