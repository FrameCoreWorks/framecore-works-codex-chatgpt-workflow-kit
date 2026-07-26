---
name: research-evidence
description: Verify claims, source-backed facts, tool limits, assumptions, and evidence boundaries for workflow decisions without inventing citations or provider capabilities.
---

# Research Evidence

## When To Use

Use this skill when a workflow depends on public facts, source-backed claims,
tool or platform limits, technical capability checks, product evidence, market
context, competitor references, or uncertainty that could affect final output.
Use it before copy, prompt packs, tool routing, QA, or delivery when accuracy is
material.

## Inputs

- Brief, question, claim, assumption, or decision that needs verification.
- Available sources, user-provided references, repo files, screenshots, or
  public links.
- Freshness requirement, jurisdiction, market, platform, model, or tool scope.
- Required output format such as Evidence Note, claim ledger, or decision note.
- Current tool availability, including whether web browsing is actually
  available in the host environment.

## Outputs

- Evidence Note with verified facts, source boundaries, uncertainty, and next
  decisions.
- Claim ledger entries for approved, unsupported, conflicting, or blocked
  statements.
- Tool-limit notes for `tool-routing-cost`, prompt packs, or QA.
- Handoff notes for `brief-architect`, `reference-curator`, `copy-voice`,
  `instruction-packet-factory`, `qa-iteration`, or `delivery-documentation`.

## Process

1. State the exact claim, decision, or assumption being checked.
2. Identify source type: user-provided, local repo, official docs, public web,
   or unavailable.
3. Verify current or unstable facts from reliable sources when browsing is
   available.
4. Separate confirmed facts from inference, opinion, and missing evidence.
5. Record conflicts, stale sources, unavailable sources, and confidence limits.
6. Convert evidence into a compact decision note for the next workflow role.

## Decision Rules

- Prefer primary sources, official docs, repo files, and user-provided source
  truth over summaries.
- If browsing is unavailable, do not claim live verification; mark the evidence
  path as unavailable or user-provided only.
- If a fact is time-sensitive, high-stakes, legal, financial, medical, pricing,
  model-capability, or policy-related, require a freshness check before final
  use.
- If evidence conflicts, route to `qa-iteration` with the conflict and proposed
  resolution options.

## Guardrails

- Do not fabricate citations, links, quotes, benchmarks, capabilities, or
  release status.
- Do not use API keys, paid provider calls, hidden web automation, uploads, or
  private cloud links.
- Do not store raw private project context in public artifacts.
- Do not turn evidence notes into long research dumps; preserve only what the
  next role needs.

## Handoff

Review gate: `evidence_fit`.

Hand verified facts and unresolved risks to `brief-architect`, `copy-voice`,
`tool-routing-cost`, `instruction-packet-factory`, `qa-iteration`, or
`delivery-documentation`. When sources are missing, stop with a clear blocker
instead of allowing unsupported claims downstream.

## QA Checklist

- Checked item is explicit.
- Source type and freshness boundary are stated.
- Facts, inferences, and unknowns are separated.
- Unsupported claims are not promoted to final copy or prompts.
- Conflicts and missing evidence have a next action.
- Handoff includes only compact, usable evidence.
