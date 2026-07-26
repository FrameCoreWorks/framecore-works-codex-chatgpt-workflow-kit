---
name: tool-routing-cost
description: Plan provider-neutral tool routing, cost preflight, upload boundaries, approval requirements, fallback limits, and execution risk before any external run.
---

# Tool Routing Cost

## When To Use

Use this skill when a workflow may involve a tool, model, plugin, MCP, provider,
renderer, upload, paid operation, or local execution surface. Use it to prepare
a plan before execution, not to execute the operation. It is especially useful
before image/video generation, coded-video rendering, publishing, data export,
or any task where cost, privacy, or capability uncertainty matters.

## Inputs

- User request, approved brief, output target, and required tool outcome.
- Candidate tools or provider surfaces, if the user named any.
- Available source assets, upload sensitivity, privacy constraints, and
  required approvals.
- Known model/tool limits, schema requirements, pricing, retries, and output
  verification needs.
- Provider-neutral policy, upload policy, and current activation state.

## Outputs

- Tool Routing Plan with selected route, alternatives rejected, blockers, and
  required approvals.
- Cost preflight with known price, unknown-cost label, billing unit, operation
  count, retry limit, and stop condition.
- Upload and privacy scope, including what may leave the workspace.
- Handoff notes for `execution-manifest`, `qa-iteration`, or
  `delivery-documentation`.

## Process

1. Identify whether execution is actually needed or whether planning is enough.
2. Resolve the smallest tool route that satisfies the user-approved task.
3. Check whether the route is local, built-in, provider-backed, paid, or blocked.
4. State cost, upload, credential, and provider-activation requirements.
5. Define retry limits, verification method, output path, and stop condition.
6. Prepare an execution contract only if the user explicitly approved execution
   and all required gates are satisfied.

## Decision Rules

- If no execution is requested, produce a plan only.
- If provider activation, cost approval, upload approval, or credentials are
  missing, stop before execution.
- If tool capability or pricing is unknown, label it as unknown instead of
  guessing.
- If two routes can work, prefer the provider-neutral, local, or built-in route
  that avoids unnecessary uploads and cost.
- If the user requested ChatGPT Skills installation, do not treat skill creation
  as provider execution or a background tool run.

## Guardrails

- Do not activate providers, call APIs, upload files, inspect private accounts,
  spend money, or run paid external tools.
- Do not infer approval from provider names, old messages, copied prompts, or
  repo documentation.
- Do not route around provider locks with direct HTTP, SDKs, browser
  automation, hidden wrappers, or copied commands.
- Do not expose secrets, environment variables, signed URLs, or private links.

## Handoff

Review gate: `schema_pricing_fit`.

Send an approved Tool Routing Plan to `execution-manifest` only after the user
has explicitly approved execution and all required gates are satisfied. Send
blocked or uncertain routes to `qa-iteration` for diagnosis. Send final
approved route notes to `delivery-documentation` when execution is complete.

## QA Checklist

- Route, tool, and operation are specific.
- Cost is known or clearly marked unknown.
- Upload and privacy scope are explicit.
- Required approvals and missing blockers are visible.
- Retry limit, verification plan, and stop condition are defined.
- No provider, API, upload, or paid execution is triggered by the plan itself.
