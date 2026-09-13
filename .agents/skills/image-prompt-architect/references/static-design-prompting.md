# Static Graphic Prompting

Use this specialization inside the existing Image Prompt Pack and Creative
Prompt Contract. It prepares prompts; it does not execute generation or own
campaign strategy. Read [the unified construction reference](unified-static-prompt-contract.md)
and [typography feasibility](typography-and-text-feasibility.md) only as needed.

## Finalization

Preserve the supplied or selected concept and exact copy. If either is open,
route only that gap to `static-direction` or `copy-voice`. A prompt request
with complete instructions already supplies those decisions; do not require
another approval ceremony. Advice, concepts and copy-only tasks stop at their
requested output. Use the current conversation language for explanations,
the requested prompt language for instructions, and the locked language for
artwork text. Do not translate exact copy while translating a prompt.

For a new graphic, every required visible string must appear verbatim in the
prompt, with hierarchy, placement, line-break permission, contrast, safe area
and no-extra-text constraints. Alternatives remain outside the final prompt.
`no_copy` means a deliberately text-free graphic, not missing wording.
Unknown critical facts, unselected copy, unavailable required references and
equal-authority conflicts block finalization. Optional unknowns may remain
labelled; they do not force a complete intake form.

Carry upstream planning notation into existing artifacts:

| Design notation | Existing owner and destination |
| --- | --- |
| `strategy`, `concept.lock` | Static Direction Contract and prompt intent/locks |
| `copy.items`, `copy.options`, claims | Copy Pack; selected strings in copy locks/text layout; candidates excluded |
| `feasibility`, production intent | Prompt constraints, observables and QA plan |
| references and protected properties | Reference Pack and Creative Prompt Contract reference roles/attachment plan |
| narrow edit and preserve set | Creative Prompt Contract edit delta |
| review result and delivery eligibility | QA / Iteration Report and delivery allowlist |

The [notes template](../templates/static-design-notes.json) is an optional
preflight view of these decisions, not a replacement artifact schema or
executable workflow. The local read-only checker validates declared state and
literal prompt coverage. It cannot verify consent, facts, image attachments,
render quality or whether a model followed the prompt.

```sh
node scripts/static-design-preflight.mjs path/to/static-design-notes.json
```

## One integrated prompt

The eight construction priorities are: final output, background, layout,
dominant event/source assets, supporting graphics, typography, color/material
integration, finish and acceptance. They describe one finished graphic in one
generation. They are not eight renders, exported layers or later text overlays.
Compress irrelevant stages; a one-word design needs no invented picture or CTA.

Respect the kit's native Codex/ChatGPT GPT Image 2 default. Use only actually
exposed host settings. A requested model, API documentation or prompt phrase
does not prove native availability, exact dimensions, masks, seeds, fonts,
transparency or deterministic identity. Record unsupported/unobserved controls
as `Unknown` and keep prompt semantics separate from runtime parameters.

If execution is later requested and the native tool is unavailable, report that
limitation. A complete prompt is a prompt, not a generated or QA-approved file.
Do not silently use a paid API, provider, SVG, canvas or composited replacement.
Keep execution under the existing user-scoped route and current tool rules.

## Editing and source authority

For a narrow edit, identify the actual current image, lead with the permitted
change, and preserve every other locked property. Account for changed and
protected copy IDs without overlap. Quote changed strings exactly; unchanged
strings may be protected through the actual edit source without retranscribing
the entire image. A broad requested rebuild must preserve factual text and
source properties but may change only the explicitly allowed design decisions.
Catalog `/rebuild` syntax cannot broaden a background-only repair.

Identity, apparent age, garment construction, product silhouette, cap count,
label boundaries and logo geometry are property locks, not style adjectives.
A style reference controls only its assigned properties. No prose-only promise
replaces a required attachment or inspection of the actual resulting pixels.

## Production and handoff

Assess `concept_raster`, `digital_final` and `production_master` independently
of asset type. A small menu may be feasible; exact editable type, functional
codes, a dieline or a print master requires `dtp_required`. Hand off exact copy,
source roles, layout, known measurements and unresolved production details.
Do not shorten mandatory text or promise print compliance from a raster/PDF.

Explicit component work stays under `asset-manifest`: a shared composition,
copy assignments, selected versions and later assembly checks. Preparing that
handoff does not authorize generating or compositing separate layers. Ordinary
poster requests retain integrated text in a single raster generation.

Use `promptability_fit` before execution planning. QA must inspect exact text,
intended-size legibility, concept, source truth and actual delivery properties.
A correction packet records the observed defect, current source, permitted
delta, preserve set and regression check. Stop at the requested prompt or
handoff; repeat generation only under applicable user authorization.
