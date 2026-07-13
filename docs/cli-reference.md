# CLI Reference

## Purpose

This reference explains the local commands shipped with this Codex workflow skill kit. It is for users and maintainers who want to understand which commands only inspect the repo, which commands write to a target workspace, and which order is safest during install, update, repair, or release review.

Default recommendation: use the guided project-local installer unless you have a reason to run lower-level commands manually.

## Command Groups

| Command | Main use | Writes files |
| --- | --- | --- |
| `npm run agent:check` | deterministic agent-workflow compliance fixture | writes only to a temporary target |
| `npm run install:guided -- --target <path>` | beginner-safe project-local install | yes, after dry-run and confirmation |
| `npm run doctor -- --target <path>` | non-mutating preflight | no |
| `npm run onboard:defaults -- --target <path>` | default local config generation | yes |
| `node scripts/onboard.mjs --target <path>` | interactive local config generation | yes |
| `npm run install:dry-run -- --target <path>` | planned install preview | no |
| `node scripts/install.mjs --mode project-local --target <path>` | project-local install | yes |
| `node scripts/install.mjs --mode update --target <path>` | update an existing install | yes |
| `node scripts/install.mjs --mode repair --target <path>` | repair manifest-recorded files only | yes |
| `node scripts/install.mjs --mode uninstall --target <path>` | uninstall preview | no unless `--yes` is passed |
| `npm run audit:privacy` | privacy and banned-content audit | no |
| `npm run secret:scan` | dependency-free credential and private-cloud scan | no |
| `npm run syntax:check` | dependency-free JavaScript syntax check | no |
| `npm run validate` | workflow structure validation | no |
| `npm test` | automated tests | no repo writes expected |
| `npm run release:check` | full release gate | no repo writes expected |
| `npm run smoke:install` | temporary project-local install smoke test | writes only to a temporary target |
| `npm run package:list` | npm package dry-run preview | no |
| `npm run package:audit` | package contents gate | no |
| `npm run chatgpt:skills:check` | validate the ChatGPT bootstrap, profiles, UI metadata, source URLs, and checked-in hashes | no |
| `npm run chatgpt:skills:sources:update` | regenerate the checked-in ChatGPT source manifest after canonical skill changes | yes, `config/chatgpt-skill-sources.json` |
| `npm run cleanup:appledouble -- --apply` | remove AppleDouble sidecars | yes, only `._*` metadata files |
| `npm run memory:init -- --target <path>` | create Context/ and Memory Cache/ | yes |
| `npm run memory:validate -- --target <path>` | validate durable recovery state | no |
| `npm run workflow:appledouble:audit:all -- --target <path>` | fail when AppleDouble sidecars exist | no |
| `npm run workflow:appledouble:clean:all -- --target <path>` | remove AppleDouble sidecars from an operational folder | yes, only `._*` metadata files |
| `npm run workflow:context-budget -- --target <path>` | check safe recovery context size and exclusions | no |
| `npm run semantic:index -- --target <path>` | build local semantic index without API calls | yes, writes Memory Cache index |
| `npm run semantic:query -- --target <path> --query "..."` | query the local semantic index | no |
| `npm run semantic:embed -- --target <path> --activation "openai api active"` | prepare an activation-gated embedding manifest | yes, writes Memory Cache manifest |
| `npm run workspace:evaluate:semantic -- --target <path> --activation "openai api active"` | create local semantic coverage report | yes, writes Memory Cache report |
| `npm run self:audit -- --target <path>` | create a report-only self-improvement queue | yes, writes Memory Cache queue |
| `npm run self:improve:local -- --target <path>` | create a local proposal plan without patching source | yes, writes Memory Cache plan |

## Safe Install Order

Manual install should follow this order:

1. `npm run check`
2. `npm run doctor -- --target <path>`
3. `node scripts/onboard.mjs --target <path>`
4. `node scripts/install.mjs --mode dry-run --target <path>`
5. `node scripts/install.mjs --mode project-local --target <path>`

The guided installer runs this sequence for project-local install and stops on the first failed check.

## Non-Mutating Checks

Use these before editing or releasing:

- `npm run audit:privacy`
- `npm run secret:scan`
- `npm run syntax:check`
- `npm run validate`
- `npm run agent:check`
- `npm test`
- `npm run check`
- `npm run package:audit`
- `npm run chatgpt:skills:check`
- `npm run release:check`
- `npm run smoke:install`
- `npm run memory:validate -- --target <path>`
- `npm run workflow:appledouble:audit:all -- --target <path>`
- `npm run workflow:context-budget -- --target <path>`
- `npm run semantic:query -- --target <path> --query "..."`
- `node scripts/doctor.mjs --target <path>`
- `node scripts/install.mjs --mode dry-run --target <path>`

These commands should not write managed files into the target workspace. `doctor` and `dry-run` report planned behavior so the user can stop before install.

## Mutating Commands

These commands can write or delete files:

- `node scripts/onboard.mjs --target <path>`
- `node scripts/install.mjs --mode project-local --target <path>`
- `node scripts/install.mjs --mode update --target <path>`
- `node scripts/install.mjs --mode repair --target <path>`
- `node scripts/install.mjs --mode uninstall --target <path> --yes`
- `node scripts/render-agents.mjs --target <path>`
- `npm run cleanup:appledouble -- --apply`
- `npm run memory:init -- --target <path>`
- `npm run workflow:appledouble:clean:all -- --target <path>`
- `npm run semantic:index -- --target <path>`
- `npm run semantic:embed -- --target <path> --activation "openai api active"`
- `npm run workspace:evaluate:semantic -- --target <path> --activation "openai api active"`
- `npm run self:audit -- --target <path>`
- `npm run self:improve:local -- --target <path>`
- `npm run chatgpt:skills:sources:update`

Mutating commands should be run against a specific target path. Global install is advanced-only and requires `--confirm-global`.

## Install Modes

- `dry-run`: report planned writes without changing files.
- `project-local`: install into one target workspace.
- `global`: install into the current user's home workspace and requires `--confirm-global`.
- `update`: update an existing install and requires `.framecore/manifest.json`.
- `repair`: recreate only manifest-recorded files and requires `.framecore/manifest.json`.
- `uninstall`: preview manifest-recorded removals; pass `--yes` to apply.

Use `--force` only when you intentionally want the installer to back up and overwrite user-owned conflicts. It does not bypass config validation.

## Packaging And Release Checks

For release review, run:

```bash
npm run cleanup:appledouble -- --apply
npm run release:check
npm run package:list
```

`release:check` runs privacy audit, secret scan, syntax check, workflow validation, deterministic agent compliance, tests, install smoke test, package audit, and release readiness. `package:list` is a read-only npm package dry-run preview so maintainers can inspect exactly what would ship.

Native ChatGPT setup is source-driven and separate from the Codex installer. `chatgpt:skills:check` confirms that `CHATGPT_INSTALL.md`, all profiles, every `agents/openai.yaml`, and the checked-in raw URL and SHA-256 source inventory still match the canonical skill folders. Run `chatgpt:skills:sources:update` only after reviewing intentional skill-source changes.

`agent:check` does not call a model or external runtime. It installs the kit into a temporary target and verifies the minimum agent path: `AGENTS.md` first move, `intent-confirmation`, `workflow-orchestrator`, Task Confirmation, Project State, safety rules, and recovery prompt.

## Safety Rules

- Prefer project-local install.
- Do not use global install unless the user explicitly chooses it.
- Do not enable external execution providers during setup.
- Do not skip onboarding unless using `--defaults` intentionally.
- Do not apply uninstall without reviewing the preview.
- Do not commit generated local config, backups, caches, outputs, or AppleDouble files.
- Run `npm run cleanup:appledouble -- --apply` before release checks on macOS when files were copied through Finder, archives, or external drives.
- Keep `Context/` and `Memory Cache/` separate. `Context/` is user-supplied input; `Memory Cache/` is recovery state.
- Do not run local OpenAI API paths without the exact activation phrase `openai api active`.

## Related Docs

- [Quickstart](quickstart.md)
- [Codex-Assisted Install](codex-assisted-install.md)
- [Native ChatGPT Skills](chatgpt-skills-onboarding.md)
- [Troubleshooting](troubleshooting.md)
- [Compatibility](compatibility.md)
- [Release Guide](release.md)
- [Memory Cache](memory-cache.md)
- [Context Folder](context-folder.md)
- [Semantic Memory](semantic-memory.md)
- [OpenAI API Policy](openai-api-policy.md)
