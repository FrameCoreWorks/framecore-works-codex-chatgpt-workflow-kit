---
name: pipeline-core
description: Use this skill for FrameCore Works workflow routing, role-based agents, gates, handoffs, project state, artifact templates, QA allowlists, delivery discipline, text-bearing image policy, Humanizer routing, HyperFrames routing, Hipson Adapter routing, and governance rules.
---

# Pipeline Core

Use this skill when a task needs the FrameCore Works workflow system.

## First Move

1. `intent-confirmation` locks goal, exclusions, work mode, expected output, and immediate next step.
2. `workflow-orchestrator` chooses blueprint, roles, gates, handoffs, and next action.

## References

Read only what is needed:

- `references/agent-roster.md` for role list and responsibilities.
- `references/workflow-operating-model.md` for stage order and review gates.
- `references/handoff-matrix.md` for allowed handoffs and required fields.
- `references/gate-registry.md` for canonical gate names.
- `references/text-image-generation-policy.md` for visible text in raster graphics.
- `references/humanizer-routing.md` for copy polish routing.
- `references/hyperframes-workflow.md` for coded-video workflow.

## Hard Rules

- Use role IDs and local display names from onboarding.
- Do not skip upstream gates.
- Static raster graphics with visible text must use the native Codex/ChatGPT image generator powered by GPT Image 2 in one pass with text included.
- Delivery follows QA when generated assets exist.
- Upload, publish, or external delivery requires an explicit current user request.
- Workflow self-improvement creates proposals, not automatic mutations.
