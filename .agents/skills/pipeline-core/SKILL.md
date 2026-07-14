---
name: pipeline-core
description: Use this skill for portable Codex or ChatGPT workflow routing, bounded roles, gates, handoffs, visible state, artifact templates, reasoning routes, request diagnostics, QA loops, delivery discipline, and provider-neutral governance.
---

# Pipeline Core

Use this skill when a task needs the workflow system from this kit in Codex or as a native ChatGPT skill.

It is the contract layer for roles, gates, handoffs, artifacts, request diagnostics, reasoning routes, Loop Protocol, text-bearing image policy, Humanizer routing, HyperFrames routing, Hipson Adapter routing, and workflow governance.

## When To Use

Use this skill when:

- A request needs more than one workflow stage or role.
- The task involves brief, references, direction, prompting, QA, delivery, onboarding, or governance.
- The task needs checklist-driven evaluation, critique, repair, regression checks, or a loopback decision.
- The user asks how the kit routes work or what the installed roles do.

Do not use this skill to bypass specialist skills, run tools, upload files, or replace the user's local preferences.

## Surface Model

- In a project-local Codex install, role IDs may resolve to rendered `.codex/agents/*.toml`, and Project State may be stored in approved workspace files.
- In ChatGPT, role IDs are temporary responsibilities for the current task. Keep state visible in the conversation or in a user-provided artifact. Do not claim a local install, shell access, persistent agents, manifests, or Memory Cache.
- On either surface, use only capabilities that are actually available. A workflow route never grants provider, upload, API, file-system, or publishing permission.

## Inputs

Required:

- `user_request`: the current task, goal, and any explicit exclusions.
- `workspace_context`: installed config and current files in Codex, or visible conversation context and user-provided artifacts in ChatGPT.
- `mode`: analyze, plan, edit, generate, review, install, or deliver.

Optional:

- `existing_project_state`: prior gates, handoffs, artifacts, or decisions.
- `local_preferences`: language, tone, QA strictness, display names, and output path.
- `artifact_paths`: brief, reference pack, prompt pack, QA report, or manifests.

## Outputs

Produce one or more of:

- Task Confirmation
- Project State
- Workflow Request Diagnostic
- Loop State
- role route and gate sequence
- reasoning route and runtime route when useful
- handoff notes
- loopback decision
- delivery or governance recommendation

## Process

1. `intent-confirmation` locks goal, exclusions, work mode, expected output, and immediate next step.
2. `workflow-orchestrator` chooses blueprint, roles, gates, handoffs, reasoning route when useful, and next action.
3. For nontrivial iterative work, `workflow-orchestrator` activates `loop_control_fit`: brief, checklist, bounded execution, evaluation, critique, minimal repair, regression check, and stop decision.
4. Specialist roles produce contracts, not loose opinions. ChatGPT roles remain temporary and stop after their artifact or handoff is complete.
5. `qa-iteration` reviews produced outputs when assets exist or when evidence-backed critique is needed.
6. `delivery-documentation` packages final notes only after QA or explicit acceptance.

## References

Read only what is needed:

- `references/agent-roster.md` for role list and responsibilities.
- `references/workflow-operating-model.md` for stage order and review gates.
- `references/loop-protocol.md` for `brief -> checklist -> execute -> evaluate -> critique -> repair -> repeat -> stop`, loop state, repair boundaries, regression checks, and stop decisions.
- `references/workflow-blueprints.md` for common task routes and loopback boundaries.
- `references/handoff-matrix.md` for allowed handoffs and required fields.
- `references/gate-registry.md` for canonical gate names.
- `references/inference-reasoning-methods.md` for compact reasoning routes, runtime route boundaries, candidate limits, and raw trace prohibitions.
- `references/text-image-generation-policy.md` for visible text in raster graphics.
- `references/prompt-format-and-continuity.md` for generator-specific prompt fields, independent generation units, continuity carriers, and standalone prompt rules.
- `references/humanizer-routing.md` for copy polish routing.
- `references/hyperframes-workflow.md` for coded-video workflow.

## Decision Rules

- Prefer the smallest route that preserves gates and handoffs.
- A direct request for one prompt, brief, storyboard, caption plan, review, or other bounded artifact should route to the relevant specialist skill when its inputs are sufficient. Do not start the full pipeline merely because implicit invocation is available.
- Use a multi-stage route when the user explicitly asks for an end-to-end or full workflow, or when the task genuinely spans dependent stages that require shared state, gates, handoffs, or QA.
- An explicit `$pipeline-core` invocation requests governed multi-stage routing, but it does not require irrelevant stages and does not authorize unavailable tools or protected actions.
- Use `loop_control_fit` for nontrivial work that needs QA, correction, validation, delivery readiness, workflow changes, or evidence-backed iteration.
- Use a Workflow Request Diagnostic when the request could be mistaken for install help, a simple prompt, a full creative workflow, QA, delivery, provider execution planning, or workflow improvement.
- Record a compact `reasoning_route` when the task needs decomposition, verification, comparison, a tool loop, branching, or bounded search.
- Prefer public runtime tiers and reasoning effort levels over brittle exact model names when a `runtime_route` is useful.
- Start from a workflow blueprint when the request matches a known pattern, then shrink or expand it based on available artifacts.
- Use role IDs from the public kit. Use local display names only from Codex onboarding config, or user-selected labels in the current ChatGPT conversation.
- Do not skip upstream gates when later roles depend on their artifacts.
- Route text, VO, captions, and user-facing polish through `humanizer` when copy quality matters.
- Route deterministic React/TypeScript video composition through `remotion-video-production`.
- Route coded-video planning through HyperFrames skills when the requested runtime is specifically HyperFrames or HTML/GSAP composition.
- Route Hipson-style packets through `hipson-adapter` unless the user chooses full Hipson separately.
- Route unresolved product, offer, audience, channel, claim, asset-matrix, or creative-test strategy through `ecommerce-campaign-strategy-director`.
- Route screenplay, treatment, scene, dialogue, pitch, coverage, or narrative-rewrite work through `screenplay-story-architect` before storyboard production.
- Route end-to-end reel, short-form ad, product-video, UGC-video, explainer, cutdown, or mixed video-production work through `creative-video-producer`.
- Route detailed caption timing, styling, safe zones, render handoffs, or caption repair through `caption-studio`.
- Route footage-first or timeline-first OpenCut planning through `opencut-video-studio` when OpenCut is available or the user wants an OpenCut Edit Pack.
- Route text-only music, music-video, visible-singing, lip-sync triage, or named Producer AI planning packets through `producer-ai-task-builder` without implying provider execution.

## Guardrails

- Use role IDs and surface-appropriate display names from onboarding.
- Do not skip upstream gates.
- Generated static raster graphics should use the native Codex/ChatGPT image generator powered by GPT Image 2 by default when available.
- Static raster graphics with visible text must use the native Codex/ChatGPT image generator powered by GPT Image 2 in one pass with text included.
- Resolve generator prompt fields and negative handling before producing generator-specific prompts. Do not attach a universal negative-prompt block.
- Treat separately generated images and shots as independent units. Claim strict continuity only when each request has a concrete continuity carrier.
- Do not substitute Python-generated artwork, SVG, HTML/canvas, Sharp/composited PNG, or other coded artwork unless the user explicitly asks for coded, vector, template, or editable source output.
- Delivery follows QA when generated assets exist.
- Upload, publish, or external delivery requires an explicit current user request.
- Workflow self-improvement creates proposals, not automatic mutations; when implementation is requested, use the self-improvement sufficiency gate to choose `stop_sufficient`, `patch_one_gap`, or `ask_user`.
- Loop Protocol work must record an iteration budget, acceptance matrix, evidence, root cause, minimal repair or loopback target, regression check, and one stop decision: `stop_sufficient`, `patch_one_gap`, `ask_user`, or `blocked`.
- Do not continue a loop only because the result could be better in theory.
- Do not store raw chain-of-thought, raw reasoning traces, raw debate transcripts, private URLs, provider responses, secrets, `.env` files, or copied private project context.
- A runtime route or model recommendation is not permission to call an API, use an external provider, upload files, run destructive commands, or install routing infrastructure.
- Do not add private project context, secrets, local machine paths, or provider-specific execution dependencies.
- In ChatGPT, do not claim doctor checks, hash checks, repository validation, local file writes, or persistent agent creation unless those capabilities actually ran on an available surface.

## Handoff

Review gate: `workflow_route`.

Hand off with:

- `workflow_blueprint`
- `active_roles`
- `completed_or_existing_artifacts`
- `last_completed_gate`
- `required_handoffs`
- `review_gates`
- `request_diagnostic`
- `reasoning_route`
- `runtime_route`
- `loop_state`
- `loop_evidence_refs`
- `pending_decisions`
- `blocked_items`
- `files_touched`
- `risks`
- `next_role`
- `next_action`
- `recovery_prompt`

## QA Checklist

- First move confirms intent before specialist work.
- Selected roles match the task and available inputs.
- Required gates and handoffs are named.
- Reasoning routes are compact, bounded, and do not store raw reasoning traces.
- Runtime routes keep provider/API/upload permissions false unless the current user explicitly asks for the protected action.
- Loop state has checklist-before-execution, evidence-backed evaluation, root cause, minimal repair or loopback target, regression check, and stop decision.
- Missing artifacts trigger loopback instead of guesswork.
- The selected route is the smallest sufficient route; a full pipeline is used only when explicitly requested or justified by multi-stage dependencies.
- External delivery or execution is not implied without user instruction.
- Public-neutral boundaries remain intact.
