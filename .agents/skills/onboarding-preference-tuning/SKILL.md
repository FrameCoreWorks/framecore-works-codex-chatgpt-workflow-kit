---
name: onboarding-preference-tuning
description: Use this skill for first-run workflow setup in Codex or ChatGPT, including setup language, work type, use cases, outputs, workflow depth, QA strictness, priorities, collaboration context, and forbidden actions.
---

# Onboarding Preference Tuning

Use this skill to guide first-run setup and preference tuning. Detect whether the active surface is a project-local Codex workspace or native ChatGPT Skills, explain that boundary in plain language, and personalize the workflow without renaming it after the source repo.

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

- `install_scope`: Codex project-local by default; not applicable to ChatGPT.
- `workspace_target`: the Codex workspace where files will be installed; not applicable to ChatGPT.
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

For `codex-local`, the profile may render local config after the normal install checks. For `chatgpt-native`, keep the profile visible in the conversation and provide a reusable starter prompt. Do not claim local files were created.

## Process

1. Ask which language should be used for setup. Accept any language; use English when the user says `default`.
2. Switch to that language and give a short beginner preflight before asking about work. Explain what the workflow is, what questions will follow, what will be created, and what the active surface cannot do.
3. Ask one question at a time about work type, main use cases, usual outputs, workflow depth, QA depth, priorities, collaboration context, and forbidden actions.
4. State that skills and roles are workflow contracts. In ChatGPT, roles are temporary responsibilities inside the current task, not permanent custom agents.
5. Default to standard workflow depth and standard QA when the user gives no strong preference.
6. For `codex-local`, keep project-local installation as the default and render local config only through the approved installer path.
7. For `chatgpt-native`, produce a visible neutral Workflow Profile, compact operating guide, allowed temporary roles, safety boundaries, and reusable starter prompt.
8. Do not recommend invoking other skills until onboarding is complete.

## Decision Rules

- Use defaults when the user presses enter or gives no strong preference.
- Keep recurring workflow review disabled unless the user opts in.
- Keep full Hipson separate and optional.
- If the user asks for global install, explain scope before applying it.
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

On ChatGPT, hand off to `workflow-orchestrator` in the conversation with the visible Workflow Profile and reusable starter prompt instead of installer fields that do not apply.

## QA Checklist

- User understands what is being installed.
- Setup language is chosen before the work-profile questions.
- The beginner preflight accurately describes the active surface.
- Project-local is the default Codex scope; ChatGPT does not claim a local install.
- Personalization is local and not committed.
- Hipson Adapter is lightweight by default.
- Recurring review is opt-in and report-only.
- Existing files are protected by backup or refusal.
- ChatGPT onboarding ends with a visible profile and starter prompt before other skills are recommended.
