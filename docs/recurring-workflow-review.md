# Recurring Workflow Review

## Purpose

The recurring workflow review is an optional governance helper for teams that want periodic reflection on how the workflow is being used. It is connected to the `workflow-self-improvement` skill and produces a report with proposed changes, not automatic edits.

Use it only when the user wants Codex to periodically inspect local workflow evidence and suggest improvements.

## Default State

Default: disabled.

Onboarding must ask before enabling any recurring workflow self-improvement review. If the user accepts the default answer, no automation recipe is installed or activated.

## Opt-In Recipe

If enabled, the recipe should be:

- cadence: every 24 hours
- mode: report-only
- mutation: disabled
- uploads: disabled
- external execution: disabled
- output: Workflow Improvement Alert and proposed next action

The recipe should be written as a local automation recipe or printed for the user when the current Codex environment cannot create automations directly.

## Report-Only Rules

The recurring review can inspect local workflow artifacts, QA notes, delivery manifests, error patterns, and previous change proposals. It can summarize risks and propose concrete next actions.

It does not edit workflow files, rewrite agent templates, change skills, upload files, run external providers, delete files, or apply patches. Any adoption step requires explicit user or maintainer approval in a normal Codex session.

## User-Facing Output

Each report should include:

- short summary
- evidence inspected
- observed workflow issue
- proposed change
- expected benefit
- risk or tradeoff
- affected files or roles
- recommended next action

The report should be useful even if the user chooses to do nothing.

## Forbidden Actions

The recurring review must not:

- mutate files
- install tools
- enable paid or external execution
- upload artifacts
- expose secrets
- create commits
- modify `AGENTS.md`, skills, agents, or config
- pretend an automation exists when the environment only printed a recipe

If a finding needs a patch, the review should produce a change proposal and stop.

## Disable Or Remove

Users can keep the workflow fully manual by leaving the automation disabled. If a recurring review becomes noisy, irrelevant, or no longer needed, remove or pause the automation and keep using `workflow-self-improvement` explicitly.

The public kit should always remain useful without this automation.

## Validation

The release gate checks that this document keeps Default: disabled, every 24 hours, report-only, mutation: disabled, uploads: disabled, external execution: disabled, Workflow Improvement Alert, does not edit workflow files, and explicit user or maintainer approval visible in the docs.
