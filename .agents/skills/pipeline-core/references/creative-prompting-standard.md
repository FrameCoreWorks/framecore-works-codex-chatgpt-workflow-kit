# Creative Prompting Standard

## Purpose

This standard defines the portable contract used for image, edit, and video
prompt work in this kit. It turns creative intent into inspectable controls
without claiming that every target exposes the same interface or capability.

It applies to planning, review, and handoff. It does not select a provider,
authorize execution, upload files, or make a target capability available.

## Coverage Ledger

Every prompt-work decision must be classified before it is used.

| Area | Status | Public mechanism |
|---|---|---|
| Image scene specificity | stable | `image_scene` records subject, state, setting, light, composition, and finish. |
| Exact visible text and layout | stable | `text_layout_contract` locks exact copy, hierarchy, safe area, and correction path. |
| Image edit scope | stable | `edit_delta_contract` names the source, requested changes, and preservation locks. |
| Reference authority and control | stable | `reference_role` and `control_ownership` separate identity, source, style, motion, audio, and coverage use. |
| Per-request attachment ownership | stable | `attachment_plan` binds required references to the request that uses them. |
| Independent prompt wording | stable | each request is standalone and may use only attached or manifest-valid assets. |
| Video shot specification | stable | `shot_contract` records frame, subject, action, camera, setting, light, timing, and end state. |
| Cross-request continuity | stable | `continuity_carrier` records an actual, request-bound source for every strict lock. |
| Continuation from output | stable | `rewrite_forward` can use an accepted actual output, never only a planned frame. |
| Coverage and performance review | stable | the plan records the required coverage, observable action, and review criteria. |
| Prompt and output QA | stable | `execution_evidence` and the QA report separate accepted evidence from assumptions. |
| One primary action and camera move | heuristic | default for clarity; an exception needs a concrete rationale and observable evidence. |
| Hard cut between unrelated states | heuristic | default when no verified transition carrier exists; a different seam needs evidence. |
| Small recurring-character set | heuristic | default when continuity risk matters; exceed it only with a documented control plan. |
| Target fields, reference limits, edit modes, audio, and text support | target-dependent | require `official_source_check` before target-specific syntax or execution readiness. |
| Current rankings, prices, quotas, UI steps, and model-specific claims | excluded | do not store as workflow rules; verify current official information only when it materially affects a user-selected target. |

## Contract Classes

### Stable Controls

Use these controls whenever their subject exists:

- A final image prompt has a concrete subject, state, setting, lighting,
  composition, and visual finish. Avoid adjective piles that cannot be checked.
- Exact visible text is quoted and paired with hierarchy, safe area, and a
  correction route. A text requirement is not satisfied by a later overlay
  unless the user explicitly requests editable or coded output.
- An edit request states both what changes and what must remain unchanged. A
  source asset, mask, or reference role is attached to that exact request.
- A strict identity, product, location, wardrobe, prop, lighting, action-state,
  or screen-direction lock has an actual carrier attached to every affected
  request. Repeated wording, a seed, or a planned frame is not enough.
- A video shot describes what a viewer can observe: framing, subject, action,
  camera behavior, setting, light, timing, and end state when it affects the
  next shot.
- QA distinguishes prompt defects, source defects, target limitations, and
  execution defects before choosing a rerun or upstream loopback.

### Default Heuristics

Use the following defaults unless the contract records a non-empty rationale
and evidence for the exception:

- one primary action and one primary camera move per short generation unit;
- one speaker or visual priority per short timed beat;
- a hard cut when there is no verified bridge between distinct states;
- a limited recurring-character set when strict identity continuity is required;
- physical, observable behavior instead of abstract emotion labels alone;
- coverage that includes an establishing view, usable detail, and the action
  needed to prove the intended result.

An exception is a design decision, not a blank waiver. It must name the affected
rule, why the default would fail, and what QA can verify instead.

### Target-Dependent Policy

Do not infer a target's current field names, capabilities, limits, reference
handling, audio behavior, text rendering, edit behavior, or extension behavior
from memory. Before emitting target-specific syntax, record:

- `target_generator` or `unresolved`;
- `task_mode` and the actual prompt-field shape;
- the verified handling for exclusions or negative fields;
- `official_source_check` with a current official source and checked date;
- any limitation that changes the handoff, continuity plan, or QA criteria.

If the target is unresolved, produce a portable contract and leave
target-specific formatting pending. If official information is unavailable,
stay in planning mode rather than guessing.

## Reference And Attachment Rules

Each reference has one or more explicit roles:

- `identity`: subject, product, character, or recurring visual facts;
- `source`: edit source, chained frame, or source clip;
- `style`: bounded visual treatment only;
- `motion`: movement or transition authority;
- `performance`: pose, behavior, or delivery authority;
- `audio`: dialogue, voice, or sound authority;
- `coverage`: required view or proof of an observable result.

`control_ownership` states what the reference may control and what it must not
override. `attachment_plan` lists the aliases attached to the exact request.
No role tag grants continuity unless the attached asset is real and approved.

## Image, Edit, And Video Rules

### Image Scene

Use a compact scene specification:

```yaml
image_scene:
  subject: what must be visible
  state_or_action: what is happening now
  setting: place and usable context
  lighting: readable light behavior
  composition: framing and hierarchy
  finish: texture, medium, or visual treatment
```

### Text Layout

When visible text is required, use:

```yaml
text_layout_contract:
  exact_text: quoted final copy only
  hierarchy: primary, secondary, and supporting copy order
  safe_area: protected edges and subject clearance
  text_count_limit: maximum visible copy units
  correction_path: shorten, regenerate, or route to an explicitly requested editable output
```

For generated static raster graphics, follow the existing native image policy.

### Edit Delta

An edit contract must include:

```yaml
edit_delta_contract:
  source_alias: attached source asset
  requested_changes: bounded list of changes
  preserve_locks: facts that must not drift
  excluded_changes: changes that must not occur
  verification_observables: what QA will compare
```

### Video Shot

Use a compact, observable shot contract:

```yaml
shot_contract:
  duration_seconds: number
  frame: framing and placement
  subject: visible subject
  action: primary observable action
  camera_move: primary camera behavior
  setting: time and place context
  lighting: readable light behavior
  audio_or_dialogue: optional locked audio behavior
  video_text_mode: none | native | post_only_when_explicitly_requested
  end_state: only when needed for continuity
```

If a shot has multiple timed phases, record beats within its duration. Do not
use a planned ending as a later request's strict carrier.

## Continuity And Rewrite-Forward

Use `continuity_carrier` for every strict lock. A carrier can be an approved
reference, the exact source asset for an edit, a chained frame, a source clip,
or verified native shared context. It must be attached to the request and marked
as actual.

For a continuation from output, use `rewrite_forward` only after QA accepts the
actual prior output. Record the accepted output reference and its handoff state.
Otherwise label the next request approximate and describe the expected drift.

## Adapter Verification And Evidence

An `adapter_verification` record translates a portable contract into a chosen
target surface. Before execution readiness, record whether it preserved the
contract's required fields, attachments, locks, and expected observables. A
semantic omission or addition is a blocking defect until reviewed.

`execution_evidence` records what was actually attached, produced, inspected,
and accepted. It never stores hidden reasoning, secrets, private URLs, or raw
provider responses.

## Handoff And QA

Prompt roles hand off the contract revision, content checksum, reference roles,
attachment plan, continuity status, target verification status, and expected
observables. QA verifies:

- exact text and layout when applicable;
- preservation locks for edits;
- actual carriers for strict continuity;
- shot action, camera, timing, and end-state observables for video;
- adapter preservation before execution readiness;
- whether the smallest repair belongs in the prompt, reference pack, direction,
  storyboard, or target adapter.

Use `promptability_fit` for the reviewed contract and `post_execution_fit` for
produced output. Do not add a new gate solely for this standard.

## Stop Conditions

Stop and keep the work in planning mode when:

- required source assets or strict continuity carriers are missing;
- final visible text is not locked;
- an edit lacks preservation locks;
- a target-specific assumption lacks an official source check;
- adapter verification reports a semantic omission or addition;
- the needed execution permission has not been explicitly requested.
