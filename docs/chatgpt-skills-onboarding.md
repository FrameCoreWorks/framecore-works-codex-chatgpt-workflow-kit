# Native ChatGPT Skills From The Repository

## Purpose

This guide explains how a user can paste one instruction into ChatGPT and create native ChatGPT Skills directly from the public source files in this repository.

This is not the Codex project-local installer. ChatGPT does not clone the repository, run shell commands, create `AGENTS.md`, render `.codex/agents/*.toml`, initialize `Memory Cache/`, or write a local manifest. It reads the declared public skill sources and uses ChatGPT's built-in `$skill-creator` to create the selected native skills.

Use this path when native Skills and `$skill-creator` are available in the user's ChatGPT account. Availability remains controlled by the current ChatGPT product surface and workspace policy.

Official product references:

- [Skills in ChatGPT](https://help.openai.com/en/articles/20001066)
- [Using skills](https://openai.com/academy/skills/)
- [Build skills](https://learn.chatgpt.com/docs/build-skills)

## Product Boundary

The Codex path remains the full local workflow:

- project-local instructions and files;
- rendered `.codex/agents/*.toml` role agents;
- doctor, onboarding, dry-run, install, update, repair, and uninstall;
- optional local `Context/` and `Memory Cache/`;
- manifest-backed file ownership and recovery.

The ChatGPT path provides:

- native skills created from public repository sources;
- a language-first onboarding flow;
- core, creative, full, or smaller custom skill selection;
- conversation-visible workflow state;
- temporary workflow roles instead of permanent Codex agents;
- only the ChatGPT-native capabilities actually available in the current conversation.

## Repository Contract

Three checked-in files make the setup self-describing:

| File | Responsibility |
| --- | --- |
| [`CHATGPT_INSTALL.md`](../CHATGPT_INSTALL.md) | Canonical behavior ChatGPT follows after the user explicitly requests repository skill setup. |
| [`config/chatgpt-skills.json`](../config/chatgpt-skills.json) | Public repository identity, bootstrap URLs, safety rules, profiles, and installation order. |
| [`config/chatgpt-skill-sources.json`](../config/chatgpt-skill-sources.json) | Exact source files, raw GitHub URLs, and SHA-256 hashes for all 33 skills. |

Every public skill keeps its canonical contract in `.agents/skills/<skill-name>/SKILL.md`. Its optional references, templates, scripts, fixtures, and `agents/openai.yaml` metadata are listed explicitly in the source manifest. ChatGPT must not infer a skill from an old local copy or a similarly named existing skill.

## Copy-Paste Prompt

Paste the complete prompt below into a new ChatGPT conversation:

```text
Use ChatGPT's built-in $skill-creator to install native ChatGPT Skills directly from this repository:

https://github.com/FrameCoreWorks/framecore-works-codex-workflow-kit

This is a ChatGPT repository-source setup, not a Codex project-local install.

First read and follow the canonical setup contract:
https://raw.githubusercontent.com/FrameCoreWorks/framecore-works-codex-workflow-kit/main/CHATGPT_INSTALL.md

Then read the setup configuration and exact skill source inventory referenced by that contract. Start with onboarding before creating or invoking any workflow skill. Your first response must ask only which language I want to use for setup.

Do not clone the repository, run shell commands, create AGENTS.md, create .codex/agents files, initialize Memory Cache, or use Codex skill-installer. Do not claim that a skill is installed until ChatGPT's native skill creation and visible installation flow has been completed and confirmed.

If you cannot read the public repository files or invoke $skill-creator, stop and tell me which capability is unavailable. Do not substitute a Codex installation or pretend setup succeeded.
```

The GitHub link identifies the source. The explicit instruction to read `CHATGPT_INSTALL.md` authorizes ChatGPT to use the repository's setup contract for this task.

## Onboarding Flow

ChatGPT must not create or invoke workflow skills immediately. It first asks which language should be used for setup. After the user answers, it switches to that language and gives a short beginner preflight explaining:

- what the workflow skills do;
- which onboarding questions will follow;
- how the selected native skills will be created from repository sources;
- that Codex role-agent files become temporary task responsibilities in ChatGPT;
- which local, provider, credential, publishing, and background actions will not happen;
- that setup is incomplete until the native installation results are visible and confirmed.

It then asks one question at a time about work type, use cases, outputs, workflow depth, QA depth, priorities, collaboration context, and forbidden actions. The output is a neutral Workflow Profile. The user's workflow is not named after this repository unless the user asks for that name.

## Profile Selection

The profile order is defined in `config/chatgpt-skills.json`:

| Profile | Intended use |
| --- | --- |
| `core` | Onboarding, pipeline rules, orchestration, brief creation, QA, and delivery foundations. |
| `creative` | Core plus the main creative direction, prompting, storyboard, campaign, Humanizer, and asset skills. |
| `full` | All 33 public skills, including ecommerce strategy, screenplay, creative video production, captions, OpenCut planning, Producer AI packets, HyperFrames, Hipson Adapter, and workflow self-improvement skills. |

ChatGPT recommends the smallest profile that covers the Workflow Profile. A smaller custom selection is valid for narrow use cases. Before creation begins, ChatGPT shows every selected skill name and a one-line reason, then asks for approval.

## Source Resolution

For each approved skill, ChatGPT:

1. Resolves the skill in `config/chatgpt-skill-sources.json`.
2. Reads every declared `raw_url` for that skill.
3. Preserves `SKILL.md`, `agents/openai.yaml`, and all listed supporting files.
4. Verifies SHA-256 when the active surface can perform that check.
5. States clearly when cryptographic verification is unavailable instead of claiming that it ran.

The checked-in manifest is regenerated after canonical skill changes with:

```bash
npm run chatgpt:skills:sources:update
```

Maintainers verify that it still matches the repository with:

```bash
npm run chatgpt:skills:check
```

## Native Installation Flow

After source resolution, ChatGPT processes the approved skill list in declared order:

1. Invoke `$skill-creator` for one skill.
2. Preserve the canonical name, description, resources, and UI metadata.
3. Keep that skill separate from other repository skills unless the user explicitly requests a redesign.
4. Present the native ChatGPT installation action.
5. Wait for any user confirmation required by the interface.
6. Record `created`, `installed`, `needs_user_confirmation`, `already_present_needs_review`, or `blocked`.
7. Continue until every selected skill has a visible status.

Reading a repository page is not installation. Creating a draft is not confirmed installation. ChatGPT must not report bulk success when individual native skill installation has not been completed.

## Existing Skill Guard

Some accounts may already contain local, private, older, or similarly named workflow skills. Their presence does not prove that this repository setup is complete or current.

- Run onboarding before relying on existing workflow skills.
- Compare matching skills with the declared repository source.
- Ask before replacing a user-owned skill.
- Do not claim doctor checks, package checks, repository checks, hash checks, manifest repair, or Memory Cache repair unless those actions actually ran on a capable surface.
- Do not invoke a newly created repository workflow skill before onboarding and its native installation are complete.

## Temporary Role Model

The `.codex/agents/*.toml.template` files remain Codex-specific and are not native ChatGPT agents.

In ChatGPT, the same responsibilities are temporary and task-bound:

| Codex concept | ChatGPT equivalent |
| --- | --- |
| rendered role agent | temporary responsibility selected by the active skill |
| handoff matrix | visible handoff note between workflow stages |
| Project State file | compact state summary in the conversation or a user-provided artifact |
| review gate | explicit checklist and decision before the next stage |
| `Memory Cache/` | not created; use a visible recovery summary when needed |

Each temporary role needs a bounded scope, required inputs, expected artifact, review gate, handoff target, and stop condition. It inherits provider-neutral safety, no API keys, no hidden background work, and no unverified claims about available tools.

## Maintainer Validation

Before publishing changes to ChatGPT-facing skill sources:

1. Run `npm run chatgpt:skills:sources:update` after any selected skill file changes.
2. Review the source manifest diff for unexpected files or URLs.
3. Run `npm run chatgpt:skills:check`.
4. Run `npm run check`.
5. Run `npm run release:check` before a release.
6. Test the README copy-paste prompt in a ChatGPT account that exposes native Skills and `$skill-creator`.
7. Confirm that the first response asks only for setup language and that installation claims match visible native results.

Do not commit user-specific Workflow Profiles, conversations, private context, local state, or generated ChatGPT account data.

## Stop Conditions

Stop and explain the boundary when:

- the account does not expose native Skills or `$skill-creator`;
- ChatGPT cannot read the public raw GitHub sources;
- a repository source file is missing or differs from an available hash check;
- the user has not approved the proposed skill list;
- the native installation action is unavailable or still awaiting confirmation;
- the user expects ChatGPT to create a local Codex workspace or permanent agent files;
- the task requires unavailable shell, provider, credential, publishing, or local file-system capabilities.

Never replace a failed repository-source setup with a false success report.

## Related Docs

- [Included Agents And Skills](included-agents-and-skills.md)
- [Workflow Map](workflow-map.md)
- [Codex-Assisted Install](codex-assisted-install.md)
- [Bundle Readiness](bundle-readiness.md)
- [Provider-Neutral Boundary](provider-neutral-boundary.md)
