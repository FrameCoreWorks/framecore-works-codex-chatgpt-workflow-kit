# Advanced Project-Local Codex Installation

For the default native `$skill-installer` route, use [CODEX_INSTALL.md](../CODEX_INSTALL.md).
This guide is an explicit alternative for project agents, config and lifecycle tooling.

## Choose the Right Target

This repository installs a project-local workflow: existing skills, rendered role
agents, project instructions and an ownership manifest. It is not the standalone
Static Graphic Design Creator installer. Static-design knowledge is already
merged into this kit's existing skills.

Use a shell-capable Codex workspace. Choose the project that should receive the
workflow, and keep the kit checkout in a separate tools or repository folder.
Do not install into the kit checkout or the user's home directory by default.
No global Skill installation, paid provider, upload or API key is required.

## Copy-Paste Install Prompt

Open the destination project in Codex and paste:

```text
Install FrameCore Works: Creative Workflow Skill Kit for Codex and ChatGPT into my current Codex
project:
https://github.com/FrameCoreWorks/framecore-works-codex-chatgpt-workflow-kit

First read docs/codex-project-install.md from that repository. Confirm the actual host, shell access
and destination project. Keep installation guidance in English. Do not infer my language from this
pasted prompt.

Use the repository's project-local installer, not a standalone Skill installer. Obtain a clean
current-main checkout outside my project, verify its origin, record its full commit ID, and read its
instructions. If this project already has .framecore/manifest.json, stop the fresh-install path and
follow docs/codex-project-update.md instead.

Run repository checks, doctor/preflight, English preference onboarding and dry-run. Show the
destination, managed files and conflicts, then obtain my approval before installation. Preserve my
existing AGENTS.md and unrelated files. Never use --force, global install, providers, API keys or
uploads without separate explicit approval.

After installation, verify the manifest and actual installed files. Only then resolve my working
language from an explicit preference or my own conversation text, excluding pasted setup prompts;
use a reliably exposed host locale only as a fallback, otherwise English. Explain the installed
workflow and give me one useful starter prompt in that language. If host activation requires
reopening the project or a new conversation, say so without claiming a reload you did not observe.
```

## Manual Installation

Prerequisites: Git, Node.js 20 or newer, npm and an existing destination project.
Run these commands from a tools directory outside the destination project:

```bash
git clone https://github.com/FrameCoreWorks/framecore-works-codex-chatgpt-workflow-kit.git
cd framecore-works-codex-chatgpt-workflow-kit
git remote get-url origin
git rev-parse HEAD
npm run release:check
npm run install:guided -- --target /path/to/your/project
```

The guided installer runs checks, doctor, onboarding, dry-run and an approval
before managed writes. The CLI setup text stays English. It does not have access
to the Codex conversation and does not pretend to detect the user's language.
The installed workflow resolves language after successful installation.

For non-interactive English setup using existing preferences or defaults:

```bash
npm run install:guided -- --target /path/to/your/project --defaults --yes
```

Here `--yes` explicitly applies installation after preflight. Use the interactive
path when the destination or planned writes are uncertain. Missing directories,
invalid configuration and file conflicts must be resolved, not bypassed.

## Verify and Start

```bash
node scripts/doctor.mjs --mode update --target /path/to/your/project
```

Check the actual `.framecore/manifest.json`, managed hashes and installed
`.agents/skills` and `.codex/agents` files. A successful clone is not installation.
Keep the full source commit in your local setup notes when a durable receipt is
needed; the manifest's package version alone does not identify every main commit.

Return to the destination project in Codex and ask it to read `AGENTS.md` and
`AGENTS.framecore.md` when both exist. Then paste:

```text
Use $workflow-orchestrator for this installed project. Resolve my working language from my own
conversation and any explicit preference, not the English setup prompt. Help me choose the smallest
useful workflow for my next task.
```

Personal preferences and conversations stay local. Do not translate the public
source files to localize runtime interaction. See
[updates](codex-project-update.md), [personal extensions](skill-customization.md)
and [manual troubleshooting](troubleshooting.md).
