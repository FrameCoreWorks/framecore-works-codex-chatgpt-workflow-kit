# Native ChatGPT Skills From The Repository

For upstream refreshes, use [ChatGPT update](../CHATGPT_UPDATE.md). To specialize
an installed Skill, use the [personal extension prompt](skill-customization.md#chatgpt-copy-paste-prompt).

## Purpose

This guide explains how a user can paste one instruction into ChatGPT and create native ChatGPT Skills directly from the public source files in this repository.

This is not the Codex project-local installer. ChatGPT does not clone the repository, run shell commands, create `AGENTS.md`, render `.codex/agents/*.toml`, initialize `Memory Cache/`, or write a local manifest. It reads the declared public skill sources and creates the selected native skills through ChatGPT Work with `@skill-creator`.

Use this path when native Skills and Work are available in the user's ChatGPT account. The recommended tested entry is **ChatGPT > Work**, followed by the README prompt whose first line says `Use @skill-creator`. The alternate product path is **Plugins > Skills > Create > Create with chat**, which opens the same creation surface. The `@skill-creator` text is a native Skill mention, not a `$skill-creator` command, shell command, MCP tool, or function tool. Availability remains controlled by the current ChatGPT product surface and workspace policy.

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
- a English installation and post-install language detection flow;
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
| [`config/chatgpt-skill-sources.json`](../config/chatgpt-skill-sources.json) | Exact source files, raw GitHub URLs, and SHA-256 hashes for all 35 skills. |

Every public skill keeps its canonical contract in `.agents/skills/<skill-name>/SKILL.md`. Its optional references, templates, scripts, fixtures, and `agents/openai.yaml` metadata are listed explicitly in the source manifest. ChatGPT must not infer a skill from an old local copy or a similarly named existing skill.

## Copy-Paste Prompt

Open ChatGPT, switch the top selector from **Chat** to **Work**, and paste the complete prompt below. Do not paste it into the regular Chat surface.

```text
Use @skill-creator to create and save selected native ChatGPT Skills from this public repository:
https://github.com/FrameCoreWorks/framecore-works-codex-chatgpt-workflow-kit

First read and follow CHATGPT_INSTALL.md, config/chatgpt-skills.json and
config/chatgpt-skill-sources.json. Follow the English onboarding, confirm my Workflow Profile and
the exact skill list, and let me choose guided or batch installation. Obtain the required
conversational approval before creation.

Read every declared source file for the selected skills. Use the actual native creation and save
workflow, keep each skill separate, and check the saved result. Do not create duplicates, substitute
a Codex installation, clone a workspace or run shell commands. If Skills, @skill-creator, source
access or saving are unavailable, stop and report the concrete blocker. A draft or approval is not a
completed installation.

Keep installation in English. Only after verified installation, resolve my working language from my
own conversation or explicit preference, not this copied English prompt. Explain how to use and
extend the installed skills. Do not activate providers, upload files or publish anything.
```

The GitHub link identifies the source. The `@skill-creator` mention selects the native creation skill, and the explicit instruction to read `CHATGPT_INSTALL.md` authorizes ChatGPT to use the repository's setup contract for this task.

Installation uses conversational approval. Do not wait for a separate install button or invent a hidden save action. Follow the actual creation workflow and report its result.

## Onboarding Flow

ChatGPT must not create or invoke workflow skills immediately. It keeps installation and onboarding in English, starts user-language detection only after verified installation, and gives a short beginner preflight explaining:

- that these are reusable ChatGPT Skills, which are small workflow helpers ChatGPT can use later in normal conversations;
- that the skills can help turn an idea into a brief, plan creative work, write image or video prompts, build storyboard or campaign plans, review work, and prepare simple notes or checklists for a client or team;
- that onboarding questions will be asked one at a time so the selected skill set fits the user's work;
- how the selected native skills will be created from repository sources;
- that the user can choose one approval for the whole selected list or a guided skill-by-skill explanation and approval;
- that Codex role-agent files become temporary task responsibilities in ChatGPT;
- which local, provider, credential, publishing, and background actions will not happen;
- that installed skills can be edited, expanded, or used as a starting point for new personal skills;
- how natural-language routing and explicit `@skill-name` invocation work;
- that setup is incomplete until every selected skill has a real creation result.

## Onboarding Context Choice

After the beginner preflight, ChatGPT asks the user to choose an onboarding context source:

- **Fresh onboarding:** answer every profile question from the beginning.
- **History-assisted onboarding:** explicitly approve using ChatGPT Memory and previous conversations that are actually available to the current surface.
- **Current profile:** provide a Workflow Profile in the current setup conversation.

History-assisted onboarding is opt-in. ChatGPT must not claim access it does not have, reproduce unrelated private conversation text, or silently convert inferred history into final answers. It presents concise, provisional work-pattern observations for confirmation or correction. Only confirmed observations can satisfy onboarding questions; unresolved questions are then asked one at a time. If history is unavailable or insufficient, setup falls back to fresh questions.

The resulting neutral Workflow Profile covers work type, use cases, outputs, workflow depth, QA depth, priorities, collaboration context, and forbidden actions. Existing skills are not setup answers or proof of completion. The user's workflow is not named after this repository unless the user asks for that name.

## Profile Selection

The profile order is defined in `config/chatgpt-skills.json`:

| Profile | Intended use |
| --- | --- |
| `core` | Onboarding, pipeline rules, orchestration, brief creation, evidence checks, copy, safe tool planning, QA, and delivery foundations. |
| `creative` | Core plus the main creative direction, prompting, storyboard, campaign, Humanizer, and asset skills. |
| `full` | All 35 public skills, including research evidence, copy and voice, ecommerce strategy, screenplay, creative video production, captions, OpenCut planning, Remotion production, safe tool-routing and cost planning, Producer AI packets, integrated HyperFrames, Hipson Adapter, and workflow self-improvement skills. |

ChatGPT recommends the smallest profile that covers the Workflow Profile. A smaller custom selection is valid for narrow use cases. Before creation begins, ChatGPT shows every selected skill name and a one-line reason, then asks for approval.

## Installation Modes

After the exact list is approved, ChatGPT offers:

- **Full batch installation:** one conversational approval covers the exact approved list. `@skill-creator` creates the selected skills in order without asking again between skills.
- **Guided installation:** ChatGPT explains the next skill in plain language, including its responsibility and typical use, asks for conversational approval, creates it, reports the result, and proceeds to the next skill.

For either mode, approval is typed or spoken in the conversation. Replies such as `yes`, `approve`, or `install` are valid when they clearly answer the current approval question. Silence and unrelated text are not approval. A changed skill list requires a new approval.

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
| `installation_mode_selected` | The user selected batch or guided installation. |
| `installation_approved` | Conversational approval was received for the batch or current skill. |
| `source_resolved` | The current skill's manifest files were read. |
| `creation_in_progress` | The active `@skill-creator` workflow is creating the skill. |
| `created` | `@skill-creator` created the native Skill. |
| `created_not_installed` | Only a draft or unsaved result exists. |
| `installed` | `@skill-creator` created and saved the skill, or it is visible in the Skills library. |
| `already_present_needs_review` | A similar existing skill needs review before reuse or replacement. |
| `blocked` | Source reading or native creation failed after a real attempt. |

Approval authorizes the chosen scope, but it is not proof of successful creation. The active `@skill-creator` workflow creates and saves the skills. It must not wait for a separate install button, function tool, MCP tool, native action, or host callback.

## Native Installation Flow

After source resolution, ChatGPT processes the approved skill list in declared order:

1. Create one skill through the already active `@skill-creator` workflow in ChatGPT Work.
2. Preserve the canonical name, description, resources, and UI metadata.
3. Keep that skill separate from other repository skills unless the user explicitly requests a redesign.
4. Do not search for or wait for a `$skill-creator` command, function tool, MCP tool, install button, native action, host callback, or assistant-side UI introspection.
5. In batch mode, continue after each result without requesting another approval.
6. In guided mode, explain and obtain conversational approval before creating each skill.
7. Mark `installed` only after `@skill-creator` reports that it created and saved the skill, or it is visible in the Skills library. Use `created_not_installed` for a draft or unsaved result.
8. Record `blocked` only after a real permission, source, or creation failure. Include the skill name, failed operation, returned error, and state.
9. Continue until every selected skill has an individual final status.

Reading a repository page, receiving approval, or producing draft text is not installation. ChatGPT must not report batch success until every selected skill has a real final result.

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

## Post-Install Use, Editing, And New Skills

After onboarding and native installation are complete, ChatGPT may route ordinary natural-language requests to skills whose `agents/openai.yaml` sets `allow_implicit_invocation: true`. The host product controls that selection, so implicit routing is useful but not perfectly deterministic.

Use the smallest sufficient route:

- "Create an image prompt for this product" should normally use `image-prompt-architect`, plus only the minimum upstream clarification needed.
- "Develop this campaign idea" may use `workflow-orchestrator`, brief or strategy skills, and the relevant production skills.
- "Run the complete project from idea to a QA-ready production pack" justifies a governed multi-stage route through `pipeline-core` and `workflow-orchestrator`.

For predictable explicit routing in ChatGPT Work, invoke `@workflow-orchestrator` to select and track the route, or `@pipeline-core` to run a justified multi-stage workflow with gates and QA. Codex uses `$workflow-orchestrator` and `$pipeline-core` instead. Neither invocation authorizes providers, uploads, publishing, API keys, shell commands, or local files that are unavailable in ChatGPT.

Three skills are explicit-only by policy: `onboarding-preference-tuning`, `hipson-adapter`, and `workflow-self-improvement`. They must not start from unrelated natural-language requests.

After installation, explain:

- normal requests may invoke eligible skills automatically;
- typing `@` and selecting a skill invokes it explicitly;
- an installed skill can be changed in Work by selecting `@skill-creator` and naming the skill plus the requested change;
- useful expansions include real examples, preferred formats, decision rules, references, and QA checks;
- a new skill starts with:

```text
Use @skill-creator to help me create a skill.
```

The final setup response should include one ordinary starter prompt, one explicit routing prompt, one editing prompt, and one new-skill prompt.

## Voice Mode

Voice setup is valid for decision steps. A spoken answer can answer onboarding, approve the Workflow Profile, approve the selected skill list, choose the installation mode, approve the batch, or approve the current guided skill.

Voice approval authorizes creation but does not prove success. The assistant must not claim it sees an install button or native panel, and it must not wait for one. Installation is complete only when `@skill-creator` reports that it created and saved the skill or the skill is visible in the Skills library.

## Provider Cost Preflight

The ChatGPT skill setup route is provider-neutral. Mentioning a provider, connector, or MCP is not consent to run it. Before any paid or external operation outside skill creation, require a separate current approval after showing provider, tool or operation, inputs and count, estimated cost or `Unknown`, billing unit, upload scope, privacy risks, limits, retry policy, possible additional costs, and verification plan.

Do not store API keys, private URLs, account data, or provider credentials in a created skill.

## Live E2E Test

Repository validation proves source completeness and contract consistency, but it cannot prove the behavior of a live ChatGPT account. Before broad promotion, test the current `main` commit in an account that exposes native Skills and Create with chat:

1. Switch a new ChatGPT conversation from Chat to Work and paste the README prompt with its leading `@skill-creator` mention.
2. Confirm that installation starts with an English beginner preflight and resolves user language only after verified installation.
3. Complete onboarding and approve a profile without allowing existing skills to skip setup.
4. Test batch mode with a small approved list and confirm that one conversational approval starts the complete run without additional approval questions.
5. Test guided mode and confirm that ChatGPT explains and requests conversational approval for each skill.
6. Confirm that no separate install button or host callback is expected, and every skill receives an individual final status.
7. Confirm that final guidance explains automatic use, `@skill-name`, editing, expansion, and new-skill creation.
8. Ask for one bounded artifact in natural language and confirm that ChatGPT uses a specialist route instead of the full pipeline.
9. Ask for an end-to-end multi-stage project and confirm that routing, temporary roles, gates, QA, and stop conditions become visible.
10. Invoke `@workflow-orchestrator` and `@pipeline-core` explicitly and confirm that their route depth matches the request.
11. Confirm that explicit-only skills do not run from unrelated requests.
12. Confirm that ChatGPT does not claim permanent agents, local files, shell checks, providers, uploads, or Memory Cache.

Record the tested commit, ChatGPT plan or workspace type, visible Skills availability, selected profile, pass/fail results, and sanitized notes. Do not store private conversations, account data, local paths, or client content in the repository.

## Maintainer Validation

Before publishing changes to ChatGPT-facing skill sources:

1. Run `npm run chatgpt:skills:sources:update` after any selected skill file changes.
2. Review the source manifest diff for unexpected files or URLs.
3. Run `npm run chatgpt:skills:check`.
4. Run `npm run check`.
5. Run `npm run release:check` before a release.
6. Test the README copy-paste prompt in ChatGPT Work with `@skill-creator` available.
7. Confirm that installation stays in English, language detection follows verified installation, conversational approvals control the chosen mode, and installation claims match real `@skill-creator` results.
8. Run the live E2E invocation checks for one bounded request, one multi-stage request, explicit routing, and explicit-only guards.

Do not commit user-specific Workflow Profiles, conversations, private context, local state, or generated ChatGPT account data.

## Stop Conditions

Stop and explain the boundary when:

- the account does not expose native Skills, Work, or `@skill-creator`;
- the user pasted the prompt into Chat instead of Work;
- ChatGPT cannot read the public raw GitHub sources;
- a repository source file is missing or differs from an available hash check;
- the user has not approved the proposed skill list;
- `@skill-creator` fails to create and save a skill after a real attempt;
- the user expects ChatGPT to create a local Codex workspace or permanent agent files;
- the task requires unavailable shell, provider, credential, publishing, or local file-system capabilities.

The absence of a separate install button, native action, host callback, or modal is not a stop condition.

Never replace a failed repository-source setup with a false success report.

## Related Docs

- [Included Agents And Skills](included-agents-and-skills.md)
- [Workflow Map](workflow-map.md)
- [Codex-Assisted Install](codex-assisted-install.md)
- [Bundle Readiness](bundle-readiness.md)
- [Provider-Neutral Boundary](provider-neutral-boundary.md)
