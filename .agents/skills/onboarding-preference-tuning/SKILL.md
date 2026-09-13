---
name: onboarding-preference-tuning
description: Use this skill for first-run workflow setup in Codex or ChatGPT, including post-install language preferences, work type, use cases, outputs, workflow depth, QA strictness, priorities, collaboration context, and forbidden actions.
---

# Onboarding Preference Tuning

Use this skill to guide first-run setup and preference tuning. Detect whether the active surface is native personal Codex Skills, an advanced project-local Codex installation, or native ChatGPT Skills, explain that boundary in plain language, and personalize the workflow without renaming it after the source repo.

## Language Policy

Public instructions and installation guidance stay in English. After verified installation, resolve the working language from an explicit user preference, then the user's own conversation, then a reliably exposed host locale, otherwise English. Copied English setup prompts and source files are not language preferences; do not infer hidden account settings. Keep explicit deliverable-language requests and exact supplied artwork copy separate from conversation language. Do not translate or rewrite public source files to localize a session.

## When To Use

Use this skill when:

- A new user creates, installs, or tests a workflow skill for the first time.
- Language, tone, workflow depth, QA strictness, priorities, or delivery behavior need to be configured.
- The user needs a plain explanation of the workflow before answering setup questions.

Do not use this skill to rewrite public repo defaults, enable global install without consent, or connect optional external tools automatically.

## Inputs

Required:

- `surface`: `codex-local` or `chatgpt-native`.
- `user_preferences`: answers from onboarding prompts or defaults.

Optional:

- `install_scope`: for `codex-local`, personal Skills via `$skill-installer` by default, or an explicitly selected advanced project-local install; not applicable to ChatGPT.
- `workspace_target`: only for an approved advanced project-local install. Native personal Skills use the host's actual `$CODEX_HOME/skills` destination; ChatGPT has no local target.
- `agent_display_names`: local Codex names or current-conversation ChatGPT labels for neutral role IDs.
- `workflow_types`: common work such as graphics, video, ecommerce, storyboard, documents, or coded video.
- `hipson_interest`: whether the user wants only the adapter or later full Hipson expansion.
- `recurring_review_opt_in`: explicit choice for report-only workflow review.

## Outputs

Produce a Workflow Profile with:

- working language and response tone
- primary work, main use cases, and expected outputs
- workflow depth and QA strictness
- priorities such as speed, structure, creativity, evidence, or delivery readiness
- collaboration context and forbidden actions
- surface-appropriate role labels and output handling
- QA strictness and delivery behavior
- lightweight Hipson Adapter default
- optional recurring review recipe only when opted in

For native personal Codex Skills and `chatgpt-native`, keep the profile visible
in the conversation and provide a reusable starter prompt. No project config,
rendered agents or `.framecore/manifest.json` are required. Save private preferences
only through an approved host-supported mechanism. For an explicitly selected
advanced project-local Codex install, the profile may render config after the
normal CLI checks. Do not claim files or agents were created without evidence.

## Process

1. Determine whether this is installation preparation or preference tuning in an already verified installation. Keep installation guidance and work-profile questions in English; do not ask for a setup language or infer one from a pasted prompt. Resolve the working language only after verified installation.
2. Give a short beginner preflight before asking about work. Explain what the workflow is, what questions will follow, what will be created, and what the active surface cannot do. In an already installed environment, use the resolved user language for preference tuning.
3. Ask one question at a time about work type, main use cases, usual outputs, workflow depth, QA depth, priorities, collaboration context, and forbidden actions.
4. State that skills and roles are workflow contracts. Native Skill installation does not create permanent agents. In Codex, use registered agents only when actually available; otherwise keep responsibilities within the current task. ChatGPT roles remain temporary.
5. Default to standard workflow depth and standard QA when the user gives no strong preference.
6. For `codex-local`, confirm the actual scope. Native fresh installation uses `$skill-installer` for approved existing Skill directories; existing Skills require an update proposal, not overwrite or duplicate installation. Render local config only when the advanced project-local CLI was explicitly selected.
7. For native Codex Skills and `chatgpt-native`, produce a visible neutral Workflow Profile, compact operating guide, bounded role responsibilities, safety boundaries, and reusable starter prompt. Do not suggest CLI commands that native Skill installation did not supply.
8. Do not recommend invoking other skills until onboarding is complete.

## Decision Rules

- Use defaults when the user presses enter or gives no strong preference.
- Keep recurring workflow review disabled unless the user opts in.
- Keep full Hipson separate and optional.
- Distinguish native personal Skills from the advanced CLI's home-workspace global mode. Never silently switch installation scope. Check existing active Skill copies before proposing any installation.
- If the surface is ChatGPT, do not request a workspace path or output directory and do not run Codex install logic.

## Guardrails

- Do not collect secrets, API keys, private cloud credentials, or private project data.
- Do not overwrite existing user files without backup or confirmation.
- Do not enable upload, publishing, external execution, or recurring review silently.
- Do not commit local display names or user preference files into the public repo.
- Do not treat pre-existing skills as proof that onboarding is complete.
- In ChatGPT, do not claim cloning, shell commands, doctor checks, hash checks, repository validation, local files, Memory Cache repair, or permanent agent creation.

## Handoff

Review gate: `workflow_route`.

Hand off to installer or renderer with:

- `surface`
- `install_scope`
- `workspace_target`
- `agent_display_names`
- `working_language`
- `response_tone`
- `output_dir`
- `qa_strictness`
- `optional_features`

For native Codex Skills and ChatGPT, hand off to `workflow-orchestrator` only
when it is installed, using the visible Workflow Profile and starter prompt.
Do not require project installer fields, or install missing Skills without approval.

## QA Checklist

- User understands what is being installed.
- Installation remains in English; user-language detection starts only after verified installation.
- The beginner preflight accurately describes the active surface.
- Native `$skill-installer` is the default Codex route; advanced project-local is explicit. ChatGPT does not claim a local install.
- Personalization is local and not committed.
- Hipson Adapter is lightweight by default.
- Recurring review is opt-in and report-only.
- Existing files are protected by backup or refusal.
- ChatGPT onboarding ends with a visible profile and starter prompt before other skills are recommended.
