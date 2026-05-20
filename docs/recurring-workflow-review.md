# Recurring Workflow Review

Onboarding can optionally enable a recurring workflow self-improvement review.

Default: disabled.

If enabled, the recipe must be report-only:

- cadence: every 24 hours
- mutation: disabled
- uploads: disabled
- external execution: disabled
- output: Workflow Improvement Alert and proposed next action

If the local Codex environment cannot create automations, onboarding should print the recipe and prompt instead of pretending it was installed.
