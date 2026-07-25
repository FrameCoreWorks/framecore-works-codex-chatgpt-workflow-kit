# Native ChatGPT Skills From The Repository

## Purpose

This guide explains how a user can paste one instruction into ChatGPT and create native ChatGPT Skills directly from the public source files in this repository.

This is not the Codex project-local installer. ChatGPT does not clone the repository, run shell commands, create `AGENTS.md`, render `.codex/agents/*.toml`, initialize `Memory Cache/`, or write a local manifest. It reads the declared public skill sources and creates the selected native skills through ChatGPT's host-managed Create with chat workflow.

Use this path when native Skills and Create with chat are available in the user's ChatGPT account. Eligible accounts include `skill-creator`, but ChatGPT uses it automatically when asked to create or modify a Skill. The user should not need to type `$skill-creator`, and the assistant should not block setup only because no literal tool or command with that name is visible. Availability remains controlled by the current ChatGPT product surface and workspace policy.

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
| [`config/chatgpt-skill-sources.json`](../config/chatgpt-skill-sources.json) | Exact source files, raw GitHub URLs, and SHA-256 hashes for all 34 skills. |

Every public skill keeps its canonical contract in `.agents/skills/<skill-name>/SKILL.md`. Its optional references, templates, scripts, fixtures, and `agents/openai.yaml` metadata are listed explicitly in the source manifest. ChatGPT must not infer a skill from an old local copy or a similarly named existing skill.

## Copy-Paste Prompt

Paste the complete prompt below into a new ChatGPT conversation:

```text
Create native ChatGPT Skills directly from this repository using ChatGPT's built-in Create with chat workflow:

https://github.com/FrameCoreWorks/framecore-works-codex-chatgpt-workflow-kit

This is a ChatGPT repository-source setup, not a Codex project-local install.

First read and follow the canonical setup contract:
https://raw.githubusercontent.com/FrameCoreWorks/framecore-works-codex-chatgpt-workflow-kit/main/CHATGPT_INSTALL.md

Then read the setup configuration and exact skill source inventory referenced by that contract. Start with onboarding before creating or invoking any workflow skill. Your first response must ask only which language I want to use for setup.

Do not clone the repository, run shell commands, create AGENTS.md, create .codex/agents files, initialize Memory Cache, or use Codex skill-installer. ChatGPT may use its built-in skill-creator automatically, but do not require me to type $skill-creator and do not block just because no literal tool with that name is visible. Do not claim that a skill is installed until ChatGPT's native skill creation and host-reported installation flow has been completed and confirmed.

If you cannot read the public repository files, or if the ChatGPT host reports that native Skill creation is unavailable, stop and tell me which capability is unavailable. Do not substitute a Codex installation or pretend setup succeeded.
```

The GitHub link identifies the source. The explicit instruction to read `CHATGPT_INSTALL.md` authorizes ChatGPT to use the repository's setup contract for this task.

## Onboarding Flow

ChatGPT must not create or invoke workflow skills immediately. It first asks which language should be used for setup. After the user answers, it switches to that language and gives a short beginner preflight explaining:

- that these are reusable ChatGPT Skills, which are small workflow helpers ChatGPT can use later in normal conversations;
- that the skills can help turn an idea into a brief, plan creative work, write image or video prompts, build storyboard or campaign plans, review work, and prepare simple notes or checklists for a client or team;
- that onboarding questions will be asked one at a time so the selected skill set fits the user's work;
- how the selected native skills will be created from repository sources;
- that Codex role-agent files become temporary task responsibilities in ChatGPT;
- which local, provider, credential, publishing, and background actions will not happen;
- that the skills can be refined or expanded later as the user learns what they need;
- that setup is incomplete until the native installation results are visible and confirmed.

Treat each run as a fresh setup session. It then asks one question at a time about work type, use cases, outputs, workflow depth, QA depth, priorities, collaboration context, and forbidden actions. Ask every onboarding question from scratch. Do not use ChatGPT Memory, previous chats, existing skills, saved preferences, inferred user history, or answers from another setup run as onboarding answers unless the user explicitly provides a current Workflow Profile in this same setup conversation and asks to reuse it. The output is a neutral Workflow Profile. The user's workflow is not named after this repository unless the user asks for that name.

## Profile Selection

The profile order is defined in `config/chatgpt-skills.json`:

| Profile | Intended use |
| --- | --- |
| `core` | Onboarding, pipeline rules, orchestration, brief creation, QA, and delivery foundations. |
| `creative` | Core plus the main creative direction, prompting, storyboard, campaign, Humanizer, and asset skills. |
| `full` | All 34 public skills, including ecommerce strategy, screenplay, creative video production, captions, OpenCut planning, Remotion production, Producer AI packets, HyperFrames, Hipson Adapter, and workflow self-improvement skills. |

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

## State Model

The setup contract separates decision, creation, confirmation, and installation:

| State | Meaning |
| --- | --- |
| `onboarding_complete` | The user answered all onboarding questions. |
| `workflow_profile_approved` | The user approved the recommended profile. |
| `skill_list_approved` | The user approved the exact selected skill list. |
| `source_resolved` | The current skill's manifest files were read. |
| `creation_requested` | The current skill was submitted to the host-managed native creation flow. |
| `created` | The host created a draft or equivalent native creation result. |
| `needs_user_confirmation` | The host is waiting for user installation or review. |
| `installed` | The host reported completed native installation. |
| `already_present_needs_review` | A similar existing skill needs review before reuse or replacement. |
| `blocked` | A real required operation failed or the host reported native creation unavailable. |

Approval is not installation. A spoken or typed "yes" can approve the profile, list, or creation attempt, but it cannot mark a skill `installed` unless the host reports native installation success. Lack of a visible literal `skill-creator` tool is not a blocker.

## Native Installation Flow

After source resolution, ChatGPT processes the approved skill list in declared order:

1. Submit one skill to ChatGPT's host-managed native Create with chat workflow. The host may use `skill-creator` automatically.
2. Preserve the canonical name, description, resources, and UI metadata.
3. Keep that skill separate from other repository skills unless the user explicitly requests a redesign.
4. Do not require literal `$skill-creator` invocation, function-tool discovery, MCP-tool discovery, or assistant-side UI introspection.
5. If the host creates a draft or asks for installation, record `created` or `needs_user_confirmation` and ask the user to complete the native confirmation when required.
6. Mark `installed` only after the host reports completed native installation.
7. Record `blocked` only after a real host error, permission denial, source failure, or native creation unavailability. Include the skill name, file or operation, returned error, and state.
8. Continue until every selected skill has a visible status.

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

## Post-Install Invocation Behavior

After onboarding and native installation are complete, ChatGPT may route ordinary natural-language requests to skills whose `agents/openai.yaml` sets `allow_implicit_invocation: true`. The host product controls that selection, so implicit routing is useful but not perfectly deterministic.

Use the smallest sufficient route:

- "Create an image prompt for this product" should normally use `image-prompt-architect`, plus only the minimum upstream clarification needed.
- "Develop this campaign idea" may use `workflow-orchestrator`, brief or strategy skills, and the relevant production skills.
- "Run the complete project from idea to a QA-ready production pack" justifies a governed multi-stage route through `pipeline-core` and `workflow-orchestrator`.

For predictable explicit routing, invoke `$workflow-orchestrator` to select and track the route, or `$pipeline-core` to run a justified multi-stage workflow with gates and QA. Neither invocation authorizes providers, uploads, publishing, API keys, shell commands, or local files that are unavailable in ChatGPT.

Three skills are explicit-only by policy: `onboarding-preference-tuning`, `hipson-adapter`, and `workflow-self-improvement`. They must not start from unrelated natural-language requests.

## Voice Mode

Voice setup is valid for decision steps. A spoken answer can select the language, answer onboarding, approve the Workflow Profile, approve the selected skill list, and authorize creating the next skill.

Voice approval does not prove native installation. In short, voice approval does not prove native installation unless the host reports a completed native install result. The assistant must not claim it sees an install button or native panel unless the host exposes that state in the conversation. If the active voice surface cannot complete the native install action, the correct status is `created` or `needs_user_confirmation`; the user should complete the native action in the same ChatGPT session on web or desktop when available.

## Provider Cost Preflight

The ChatGPT skill setup route is provider-neutral. Mentioning a provider, connector, or MCP is not consent to run it. Before any paid or external operation outside skill creation, require a separate current approval after showing provider, tool or operation, inputs and count, estimated cost or `Unknown`, billing unit, upload scope, privacy risks, limits, retry policy, possible additional costs, and verification plan.

Do not store API keys, private URLs, account data, or provider credentials in a created skill.

## Live E2E Test

Repository validation proves source completeness and contract consistency, but it cannot prove the behavior of a live ChatGPT account. Before broad promotion, test the current `main` commit in an account that exposes native Skills and Create with chat:

1. Paste the README repository-source setup prompt into a new conversation.
2. Confirm that the first response asks only for the setup language.
3. Complete onboarding and approve a profile without allowing existing skills to skip setup.
4. Confirm that every selected skill receives an individual visible final status and that no bulk success is claimed early.
5. Ask for one bounded artifact in natural language and confirm that ChatGPT uses a specialist route instead of the full pipeline.
6. Ask for an end-to-end multi-stage project and confirm that routing, temporary roles, gates, QA, and stop conditions become visible.
7. Invoke `$workflow-orchestrator` and `$pipeline-core` explicitly and confirm that their route depth matches the request.
8. Confirm that explicit-only skills do not run from unrelated requests.
9. Confirm that ChatGPT does not claim permanent agents, local files, shell checks, providers, uploads, or Memory Cache.

Record the tested commit, ChatGPT plan or workspace type, visible Skills availability, selected profile, pass/fail results, and sanitized notes. Do not store private conversations, account data, local paths, or client content in the repository.

## Maintainer Validation

Before publishing changes to ChatGPT-facing skill sources:

1. Run `npm run chatgpt:skills:sources:update` after any selected skill file changes.
2. Review the source manifest diff for unexpected files or URLs.
3. Run `npm run chatgpt:skills:check`.
4. Run `npm run check`.
5. Run `npm run release:check` before a release.
6. Test the README copy-paste prompt in a ChatGPT account that exposes native Skills and Create with chat.
7. Confirm that the first response asks only for setup language and that installation claims match visible native results.
8. Run the live E2E invocation checks for one bounded request, one multi-stage request, explicit routing, and explicit-only guards.

Do not commit user-specific Workflow Profiles, conversations, private context, local state, or generated ChatGPT account data.

## Stop Conditions

Stop and explain the boundary when:

- the account does not expose native Skills or Create with chat;
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
