# Creative Prompting Workflow

## Purpose

This guide explains how the kit structures image, edit, and video prompt work
when a loose prompt is not enough. It is useful for work with exact text,
approved references, repeatable characters or products, multi-shot sequences,
bounded image edits, or a later handoff to a user-selected target surface.

The workflow produces planning and QA artifacts. It does not select a provider,
run generation, upload files, or approve cost on its own.

## The Contract

A Creative Prompt Contract describes one generation unit. It is revisioned so a
reviewed prompt is not silently changed in place. The core fields are:

- prompt text and an observable scene or shot specification;
- reference roles and what each reference is allowed to control;
- an attachment plan for the exact request;
- text layout requirements when visible copy is required;
- bounded edit changes and preservation locks for edits;
- continuity carriers for strict cross-request locks;
- QA observables, target verification status, and execution readiness.

Use the template at
`.agents/skills/pipeline-core/templates/creative-prompt-contract.md`. The
underlying policy is in
`.agents/skills/pipeline-core/references/creative-prompting-standard.md`.

## Image Work

Describe the subject, current state, setting, lighting, composition, and visual
finish. Prefer concrete visual evidence over a stack of generic style words.

For visible text, lock final copy before prompt delivery. Record exact text,
hierarchy, protected space around the subject, a maximum text count, and a
correction path. Static raster graphics follow the kit's native one-pass text
image policy when that policy applies.

## Edit Work

An edit is a delta, not a new image prompt. Name:

- the attached source alias;
- the specific changes requested;
- the facts that must remain unchanged;
- excluded changes;
- observable comparisons for QA.

If preservation locks are missing, return to the source or direction stage
instead of asking the target to infer what must stay unchanged.

## Video Work

Each independent shot is standalone. Record its duration, frame, subject,
primary action, primary camera move, setting, lighting, audio or dialogue when
needed, text mode, and end state when it affects the next shot.

One action and one camera move are the default for a short generation unit. A
more complex shot can be used when its rationale and observable QA evidence are
recorded. Timed beats must fit within the declared duration.

## Continuity

Repeated prose, a seed, or a storyboard note can support approximate similarity,
but they do not create strict continuity. For every strict identity, product,
location, wardrobe, prop, lighting, action-state, or screen-direction lock,
attach an actual carrier to the relevant request.

Valid carriers include an approved reference, an edit source, a chained frame,
a source clip, or verified shared context within one native job. When the
carrier is unavailable, label the risk as approximate and route upstream for
the required asset.

Use rewrite-forward only from an actual output that has been accepted by QA. A
planned end frame is not a valid replacement.

## Target Adaptation

Target-specific syntax remains pending until the selected surface has a current
official-source check. This includes field names, reference behavior, edit and
extension modes, audio, visible text, and negative-field handling. The contract
can remain portable while no target is selected.

Model rankings, prices, capacity limits, and UI click paths are intentionally
not stored as workflow rules because they can change without notice.

## QA And Handoffs

`image-prompting` and `video-prompting` hand off the prompt contract revision,
content checksum, reference roles, attachment plan, continuity status, target
verification status, and expected observables.

`qa-iteration` checks text layout, edit preservation, strict continuity,
shot-level observables, adapter preservation, and the actual evidence available.
It routes the smallest repair to the prompt, source reference, direction,
storyboard, or target-adaptation layer.

The contract uses existing `promptability_fit` and `post_execution_fit` gates.
It does not create a new permanent agent, gate, provider route, or execution
permission.

## Related Docs

- [Prompt Format And Continuity](../.agents/skills/pipeline-core/references/prompt-format-and-continuity.md)
- [Artifact Schemas](artifact-schemas.md)
- [Text Image Policy](text-image-policy.md)
- [Workflow Map](workflow-map.md)
