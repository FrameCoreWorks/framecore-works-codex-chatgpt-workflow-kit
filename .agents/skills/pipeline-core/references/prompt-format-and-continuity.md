# Prompt Format And Continuity Contract

## Purpose

This contract keeps image and video prompt packs portable without pretending that
all generators accept the same fields or share context between requests. It applies
to prompt planning only. It does not select or activate a provider, authorize an
upload, approve cost, or execute generation.

## Resolve The Prompt Surface

Before finalizing a generator-specific prompt, record:

- `target_generator`: the named generator or `unresolved`
- `task_mode`: text-to-image, image-to-image, edit, text-to-video,
  image-to-video, extension, or native multishot
- `input_assets`: only the references, frames, clips, masks, or manifests attached
  to that exact request
- `prompt_field_shape`: main prompt plus any fields the selected surface actually
  exposes
- `negative_handling_mode`: `integrated_constraints`, `separate_field`,
  `minimal_exclusions`, or `unresolved`

If the target generator is unresolved, produce a portable prompt contract and mark
generator-specific formatting as pending. Do not invent a schema from memory.

Do not append a universal `Negative Prompt`, `negative_prompt`, or long generic
artifact list by default. Express desired evidence positively first. Use a separate
negative field only when the selected interface exposes one and the current
generator profile confirms it. Artifact-level `negative_constraints` remain a
suppression ledger; they are not automatically a separate provider field.

## Independent Generation Units

Classify every separately generated image, shot, or clip as one of:

- `independent_text_generation`
- `independent_reference_conditioned`
- `frame_chained_i2v`
- `native_extension`
- `native_multishot_single_job`

A separate generation request sees only its current prompt and the inputs attached
to that request. Phrases such as `same character`, `same location`, `as before`, or
`continue the previous shot` do not create strict continuity by themselves.

### Strict Continuity Carriers

Strict identity, product, location, wardrobe, prop, lighting, camera-side, action
state, or screen-direction continuity needs a carrier attached to every affected
request. Valid carriers are:

- an approved reference image, board, character sheet, or product sheet
- the exact chained frame required by an image-to-video route
- a bound source clip or source image
- verified native shared context in one multishot or extension job

Repeated prose and seeds can support approximate similarity, but they are not strict
continuity carriers. If a required carrier is missing, either route upstream to
create it or label continuity `approximate` with the expected drift risk.

## Standalone Prompt Rule

Every final prompt must be understandable as a standalone request. It may name only
asset aliases that are present in that request's asset manifest. Storyboard
inheritance, start state, end state, and transition notes remain planning metadata
until they are mapped to concrete per-request inputs.

## QA Observables

Review prompt packs for:

- a resolved or explicitly unresolved generator format
- a task mode that matches the requested operation
- no invented negative-prompt field
- one generation-unit classification per independent request
- a named continuity carrier for every strict lock
- approximate continuity clearly labeled when no strict carrier exists
- standalone wording and manifest-valid asset aliases
- no implied provider, upload, API, cost, or execution permission
