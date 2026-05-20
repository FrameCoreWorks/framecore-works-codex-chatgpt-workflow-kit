---
name: workflow-self-improvement
description: Use this explicit-only skill for post-task retrospectives, workflow audits, improvement notes, recurring process review prompts, and approval-gated change proposals. It must not mutate workflow files, upload, run external tools, or act as a hidden daemon.
---

# Workflow Self-Improvement

This skill turns completed work into auditable workflow improvements. It creates logs and proposals, not adopted rules.

Use only when explicitly requested or when an opted-in report-only recurring review asks for it.

## Boundaries

- no autonomous daemon
- no hidden learning
- no uploads
- no external execution
- no destructive operations
- no edits to instructions, skills, agents, gates, or handoffs without explicit approval
- workflow-orchestrator decides adoption
- qa-iteration validates only when routed

## Outputs

- Improvement Log
- Workflow Change Proposal
- Workflow Improvement Alert

Every proposal needs evidence labels, affected surface, proposed change, benefit, risk, acceptance test, rollback, owner, and status.
