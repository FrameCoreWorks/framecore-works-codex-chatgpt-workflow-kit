# Self-Improvement Tools

## Purpose

The local self-improvement tools help maintainers inspect workflow friction and create a proposal queue. They do not patch repo files by themselves.

This is the tool-level companion to [Workflow Self-Improvement](workflow-self-improvement.md).

## Audit Command

Run:

```bash
npm run self:audit -- --target <operational-folder>
```

The audit reads safe workflow files, Memory Cache state, and public kit structure. It writes a proposal queue to `Memory Cache/self-improvement-queue.md` when a valid Memory Cache exists.

## Local Improvement Command

Run:

```bash
npm run self:improve:local -- --target <operational-folder>
```

This produces a local proposal queue and next-action checklist. It does not edit skills, agents, docs, tests, gates, handoffs, or source files.

## Adoption Rule

Self-improvement creates proposals. It does not adopt them.

Adoption requires:

- workflow-orchestrator review
- explicit user or maintainer approval
- a bounded patch
- updated docs, tests, examples, fixtures, or validation when behavior changes
- successful verification before release

## Safe Patch Bias

Prefer expansion over rebuild. Good self-improvement proposals usually target:

- examples
- fixtures
- `assets/README.md`
- manifest fields
- validators
- handoff clarity
- recovery templates

Avoid broad rewrites unless the current structure is broken.

## Forbidden Actions

The tools must not:

- edit repo source files
- upload anything
- Do not upload reports, queues, artifacts, or proposals from these tools.
- call external providers
- call APIs without explicit activation
- read or index full `Context/`
- run destructive commands
- store secrets or raw transcripts

## Related Docs

- [Workflow Self-Improvement](workflow-self-improvement.md)
- [Memory Cache](memory-cache.md)
- [OpenAI API Policy](openai-api-policy.md)
