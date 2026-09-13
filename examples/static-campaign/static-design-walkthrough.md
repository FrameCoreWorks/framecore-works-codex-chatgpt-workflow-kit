# Static Design Walkthrough

These are fictional, authored planning examples. No image was generated or
visually accepted. Use the smallest existing specialist route for each scope.

## Open concept with locked copy

Request: develop two concept directions for a neighborhood book exchange.
The only approved wording is `BOOK EXCHANGE`; do not generate images.

`static-direction` keeps those words and offers different mechanisms:

| Route | Mechanism | Type/image relation | Trade-off |
| --- | --- | --- | --- |
| Reader relay | One page edge connects a closed book to an opening book | The title names the exchange; page movement enacts it | The connection must read without implying a sequel |
| Shelf circulation | A gap in one shelf corresponds to one filled place in another | The title joins the two spaces | Can become decorative shelving unless the exchange is clear |

Stop at the requested options. Do not invent a date, venue, fee, headline or
claim of campaign effectiveness. Selection changes the concept lock, not facts.

## Directed one-word prompt

Request: one English prompt, exact Polish word `CISZA`, white field, no picture
or additional copy. The word-space relationship is already the supplied concept.

```text
Create one vertical typographic poster containing only the exact Polish word
"CISZA". Let abundant uninterrupted white space enact silence. Place the word
slightly below optical center in substantial black upright lettering with clear
spacing and intact margins. The word and surrounding space are the complete
composition. No pictorial subject, caption, logo, border, texture or extra text.
Generate the complete design and its text together in one output. Acceptance
requires exact spelling, immediately readable letterforms and the selected
quiet spatial relation. Inspect the actual result before claiming it passes.
```

Only `image-prompting` is needed. No code catalog, new concept selection or
rendering follows. Eight construction priorities are compressed into one prompt;
unused stages do not create extra elements. The optional
[preflight notes](../../.agents/skills/image-prompt-architect/templates/static-design-notes.json)
provide a machine-checkable version of this declared planning state.

## Narrow repair with a protected source

Hypothetical inspection shows the date `14 JUN` instead of the locked `14 JUNE`.
One wrong required string fails QA. The user explicitly requests that replacement.

```text
Use the attached current approved poster as the edit source. Change only the
date line "14 JUN" to "14 JUNE". Preserve every other exact string, concept,
crop, composition, type positions, product and logo geometry, colors, light,
texture and margins. Add no words, objects or restyling.
```

`qa-iteration` supplies the defect and regression check; `image-prompting`
prepares this delta. Actual editing needs the current image and a supported
native route. Recheck the repaired date and all protected properties afterward.
A `/rebuild` label or style suggestion never broadens this edit.

## Typography and production intent

A digital concept with three clearly spaced prices may pass preflight with
targeted exact-text QA. A forty-item menu in a fixed tiny format with mandatory
terms and editable print delivery requires `dtp_required`. The handoff preserves
all items, prices, qualifiers, logo and known layout specifications. Unknown
printer profiles/fonts stay unknown. Neither silent abbreviation nor a generated
blank background with later text is the ordinary raster fallback.

## Explicit component handoff

For a requested separate background and subject, `asset-manifest` records their
shared composition, full project copy, geometry and dependencies. A text-free
background does not erase lettering assigned elsewhere. Keep an approved
subject version selected while its replacement is a candidate. Inspect both
subject and contact shadow before changing selection; leave the approved
background unchanged. Deliver only the selected QA allowlist and assembly
notes. A component set is not an inspected assembled poster or print master.
