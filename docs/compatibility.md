# Compatibility

## Purpose

This guide defines the supported runtime, operating system, Codex environment, native ChatGPT Skills surface, and install-mode assumptions for this workflow skill kit.

Use it before opening support issues, before changing installer behavior, and before preparing a public release.

## Runtime Requirements

The default Codex route needs the built-in `$skill-installer`, public source
access and permission to write the actual personal Skills directory. Follow its
active host instructions for the helper runtime. Native Skill installation does
not require this repository's Node CLI or a project clone. Optional bundled
Node checks need Node.js only when run.

The following requirements apply to repository maintenance and the optional
advanced project-local CLI:

- Node.js 20 or newer.
- npm available from the same shell that runs the scripts.
- A local clone or downloaded copy of this repository.
- An existing target Codex workspace folder for guided install.

The package metadata declares `node >=20`. CI checks Node 20 and 22 on the default Linux validation workflow.

## Operating Systems

The scripts use Node.js standard library path handling and avoid shell-only behavior where practical.

Supported maintenance targets:

- macOS
- Linux
- Windows

The default `validate` workflow runs on Ubuntu for fast push and pull-request feedback. The path-sensitive `cross-platform` workflow runs automatically for installer, test, config, package, and workflow changes, and can still be run manually before public version tags.

## Codex Environment

The default route installs selected native Skills in `$CODEX_HOME/skills`.
See [CODEX_INSTALL.md](../CODEX_INSTALL.md). Role IDs remain task responsibilities
unless the actual host exposes a corresponding agent.

The advanced project-local mode targets workspaces that can read `AGENTS.md`.

Project-local install writes rendered role files to `.codex/agents/*.toml`. A Codex environment that supports custom agents can use those role files for routed subagent work. If a local Codex environment does not expose custom-agent spawning, the installed skills, project instructions, templates, gates, and examples still provide the workflow contract, but agent spawning depends on that local environment.

If a target project already has `AGENTS.md`, project-local install writes `AGENTS.framecore.md`. Ask Codex to read both files before using the workflow.

## Install Modes

The following modes belong to the optional project CLI, not `$skill-installer`:

- `dry-run`, previews planned writes without creating managed workflow files.
- `project-local`, the recommended default for one workspace.
- `update`, refreshes the managed set from the current kit and can add new managed paths.
- `repair`, rewrites only paths already recorded in the manifest.
- `uninstall`, removes only exact file paths recorded in the manifest.
- `global`, advanced only and requires `--confirm-global`.

Guided install always uses the project-local path. It refuses missing targets and refuses installing into this kit repository itself.

## Native ChatGPT Skills

ChatGPT users do not run the Codex installer. They switch ChatGPT from Chat to Work, paste the repository setup prompt from README with its leading `@skill-creator` mention, complete onboarding in English, approve a skill profile, and let Create with chat build each selected skill from its declared public GitHub sources. The alternate path is Plugins > Skills > Create > Create with chat. The `@` mention is a native Skill invocation, not a `$skill-creator` command.

`CHATGPT_INSTALL.md`, `config/chatgpt-skills.json`, and `config/chatgpt-skill-sources.json` define the behavior, profile order, exact source files, raw URLs, and hashes. `.codex/agents`, `AGENTS.md`, local preferences, Context, Memory Cache, and private workspace state are excluded from the ChatGPT skill route.

Account eligibility, workspace permissions, public repository access, native Skill creation, and any cross-surface synchronization are controlled by the current ChatGPT product surface. The repository uses conversational approval in batch or guided mode, does not wait for a separate install modal, and requires a real `@skill-creator` creation result before reporting a skill as installed. See [Native ChatGPT Skills](chatgpt-skills-onboarding.md).

## Manifest Compatibility

New advanced project installs write `.framecore/manifest.json` with managed paths, file hashes, and an `incomplete` state flag.

`doctor` uses the manifest to warn about interrupted installs, missing or changed managed files, and incomplete hash coverage. `update`, `repair`, and `uninstall` require a manifest. Legacy manifests without hashes can still be inspected, but hash-based drift checks need a manifest written by a current install, update, or repair.

Before update or repair rewrites the manifest, the installer writes numbered backups such as `.framecore/manifest.json.bak`.

## External Tool Boundary

The public kit is provider-neutral. It ships workflow contracts, role files, skills, templates, gates, examples, validation, and privacy checks.

External paid execution tools, provider credentials, endpoint catalogs, private cloud delivery settings, and user-specific local configuration belong outside this public repo and outside the default install path.

The text-bearing image policy is the intentional built-in image-generation path: static raster graphics with visible text should use native Codex or ChatGPT image generation powered by GPT Image 2 in one pass when that capability is available.

For the full boundary, see [Provider-Neutral Boundary](provider-neutral-boundary.md).

## Support Baseline

When reporting compatibility issues, include only sanitized information:

- operating system name
- Node.js version when using the project CLI or bundled Node checks
- native personal Skills or advanced project CLI, including selected mode
- whether `.framecore/manifest.json` exists
- sanitized command output with private paths, URLs, emails, and project context removed

Do not post secrets, credentials, private URLs, local machine paths, emails, or private project context in public issues.
