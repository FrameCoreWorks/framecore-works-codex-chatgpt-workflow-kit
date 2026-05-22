# Example Authoring

## Purpose

This guide explains how to add or update public workflow examples without weakening route validation, provider-neutral boundaries, or privacy guarantees.

Examples are part of the public contract. They teach new users how to choose routes, and they give maintainers machine-checked fixtures for workflow blueprints, role IDs, gates, artifacts, handoffs, and execution boundaries.

## When To Add An Example

Add an example when a workflow path is common enough that a new user should see it before inventing their own route.

Good candidates include:

- a new creative workflow path
- a new artifact sequence
- a common no-execution planning mode
- a common QA or delivery review mode
- a route that combines existing roles in a new validated way

Do not add an example for private project context, local preferences, generated outputs, provider setup, or one-off work that does not teach a reusable route.

## Required Files

Every example directory must contain:

- `README.md`
- `workflow.json`

Use a lowercase kebab-case folder name. The folder name must match `workflow.json` field `example_id`.

The root [Examples Index](../examples/README.md) and README documentation links should be updated when a new example becomes part of the public set.

## `workflow.json` Contract

Each `workflow.json` file must define:

- `schema_version`: currently `1`
- `example_id`: folder name
- `blueprint`: slug from [Workflow Blueprints](../.agents/skills/pipeline-core/references/workflow-blueprints.md)
- `route`: ordered neutral role IDs
- `gates`: gate IDs from [Gate Registry](../.agents/skills/pipeline-core/references/gate-registry.md)
- `artifacts`: artifact names from [Artifact Schemas](artifact-schemas.md)
- `handoffs`: explicit `from->to` pairs from [Handoff Matrix](../.agents/skills/pipeline-core/references/handoff-matrix.md)
- `execution_boundary`: a clear stopping rule

Keep `route` and `handoffs` aligned. Every adjacent route step must have a declared handoff and that handoff must exist in the handoff matrix.

## README Structure

Every example README must include these sections:

- Purpose
- Starting User Request
- Inputs And Assumptions
- Agent Route
- Gate Sequence
- Artifacts Produced
- Example Output Skeleton
- QA Checklist
- Failure Or Loopback Case
- Privacy And No-Private-Content Note
- Related Docs And Skills

The README is for humans. The `workflow.json` file is the machine-checked contract. Keep both in sync.

## Route And Handoff Rules

Use neutral role IDs only. Do not use local display names.

The route should be the smallest safe path that preserves required gates. Optional branches should be documented in prose instead of adding unnecessary role steps.

If an example needs a handoff that does not exist, update the handoff matrix and explain the required fields. Do not bypass handoff validation by removing route steps or using a vague execution boundary.

Do not route directly from prompting to delivery when generated or produced assets exist. Route through `asset-manifest` and `qa-iteration` when files or outputs need review.

## Privacy Requirements

Public examples must not include:

- private project names
- local absolute paths
- emails
- credentials or secret-like values
- private cloud links or IDs
- generated confidential outputs
- provider-specific activation or API-key setup
- user-specific agent display names

Use generic categories, fictional product descriptions, and portable artifact labels.

## Validation Steps

Before committing an example change, run:

```bash
npm run cleanup:appledouble -- --apply
npm run validate
npm test
npm run release:check
```

Validation checks README structure, required examples, blueprint coverage, known role IDs, known gates, known artifacts, handoff continuity, Markdown links, artifact fixture coverage, privacy boundaries, and package readiness.

## Review Checklist

Before merging an example change, confirm:

- the example teaches a reusable workflow route
- `example_id` matches the folder name
- the blueprint slug exists
- every route role uses a neutral role ID
- every required gate is present
- every artifact exists in artifact schemas
- every route transition is declared in `handoffs`
- the execution boundary stops before external tools unless the example is explicitly about approved planning
- the README and `workflow.json` describe the same route
- privacy audit and release check pass
