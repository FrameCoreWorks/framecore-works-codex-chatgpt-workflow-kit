---
name: workflow-orchestrator
description: Use this skill to route multi-stage work in Codex or ChatGPT, maintain visible workflow state, assign bounded roles, enforce gates, and decide loopbacks.
---

# Workflow Orchestrator

Use this skill to route the active workflow, maintain visible state, assign bounded roles, enforce gates, and decide loopbacks. It owns workflow state, not specialist deliverables.

In a project-local Codex install, roles may resolve to rendered `.codex/agents/*.toml`. In ChatGPT, treat the same role IDs as temporary responsibilities inside the current task. Do not claim that ChatGPT created permanent agents or local project files.

## When To Use

Use this skill when:

- A request needs routing across multiple roles, skills, artifacts, or gates.
- The workflow has missing inputs, competing next steps, or possible loopbacks.
- The user asks what should happen next in the kit.

Do not use this skill to write specialist deliverables when a specialist role owns them.

## Inputs

Required:

- `task_confirmation`: confirmed goal, excluded scope, work mode, expected output, and immediate next step.
- `available_artifacts`: brief, references, direction, prompts, QA, manifests, or docs already present.
- `user_request`: current instruction and any new constraints.

Optional:

- `local_preferences`: working language, tone, QA strictness, display names, output path.
- `repo_state`: changed files, test status, issue list, or validation results when a repository is actually available.
- `delivery_request`: only when explicit in the current user message.

## Outputs

Produce Project State with:

- workflow blueprint
- active roles and responsibilities
- completed or missing artifacts
- last completed gate
- required handoffs
- review gates
- pending decisions and blocked items
- files touched and visible risks
- loopback decisions
- next role and next action
- recovery prompt for context loss

## Process

1. Start from `intent-confirmation`.
2. Inspect which artifacts already exist and which gates are blocked.
3. Select the closest workflow blueprint when the task matches a common route.
4. Shrink or expand the route based on available artifacts and explicit user scope.
5. Assign specialist work without taking over specialist outputs. In ChatGPT, keep each assignment temporary and visible in the conversation.
6. Decide loopback or delivery only after gates are satisfied.

## Decision Rules

- If the goal is unclear, route back to `intent-confirmation`.
- If the brief is missing, route to `brief-architect`.
- If references are required but unresolved, route to `reference-curator`.
- If outputs exist, route to `qa-iteration` before delivery.
- Use `instruction-packet-factory` when delegation needs a bounded packet.
- Use `ecommerce-campaign-strategy-director` when product, offer, channel, claim, asset-matrix, or test strategy is unresolved.
- Use `screenplay-story-architect` before storyboard work when narrative structure, treatment, scenes, dialogue, pitch, or rewrite quality is the real blocker.
- Use `creative-video-producer` when a video request spans several production layers instead of one specialist output.
- Use `caption-studio` for detailed subtitle timing, styling, safe zones, or caption QA, and `opencut-video-studio` for footage-first timeline planning.
- Use `producer-ai-task-builder` for text-only music and music-video execution packets while keeping provider execution outside the route.
- Use workflow blueprints as defaults, not as rigid scripts.

## Guardrails

- Do not skip review gates for speed.
- Do not route directly from prompts to delivery when generated assets exist.
- Do not enable external execution, upload, or publishing without explicit user instruction.
- Do not import private workspace context into public artifacts.
- Do not mutate workflow rules without explicit approval.
- Do not claim local files, shell checks, persistent agents, or repository state on a ChatGPT-only surface.

## Handoff

Review gate: `workflow_route`.

Hand off with:

- `workflow_blueprint`
- `active_roles`
- `completed_or_existing_artifacts`
- `last_completed_gate`
- `required_handoffs`
- `review_gates`
- `pending_decisions`
- `blocked_items`
- `files_touched`
- `risks`
- `next_role`
- `next_action`
- `recovery_prompt`
- `loopback_reason`

## QA Checklist

- Route follows the current user request.
- Required artifacts and missing blockers are visible.
- Each active role has a clear output.
- Gates and handoffs match the pipeline references.
- Next action is concrete and safe.
