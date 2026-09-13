# Optional Poster Code Catalog

The [catalog](event-poster-design-codes.json) retains 200 original code lines in
20 categories, their IDs and separate English design interpretations. Source
names and grouping are attributed to John Savage AI; interpretations are by
FrameCore Works. PDF page/checksum metadata is inherited from the source repo,
not newly verified against the original PDF. The original PDF is not bundled.

## Scope and visibility

Codes are optional aids inside an already relevant static-design request.
An ordinary brief works without selecting, knowing or seeing codes. Respect a
catalog opt-out. Advice, copy-only work, narrow fully specified edits and repo
maintenance do not need a catalog lookup.

For an open visual direction, choose a fitting entry internally only after
objective and concept are resolved. Expand it into composition, type/image and
material choices. Do not add its label or EP ID to a prompt unless the user
selected it or asked to see it. Honor a request to hide codes even after manual
selection. Preserve slash characters that belong to locked copy or URLs.

When the user asks for `/codes`, `/kody` or the full catalog in this design
context, return all categories and entries with descriptions. Localize prose
in the user's language; keep exact English code strings. These are lookup
requests, not global slash commands or authorization to render.

## Resolve before interpreting

The local read-only helper resolves exact EP ID, complete code line, slash
shorthand or name. Case and whitespace normalization are permitted; fuzzy
search returns candidates and never silently selects one. An unknown code is
not evidence of a generator preset. Read the JSON directly when Node is absent.

From this skill directory:

```sh
node scripts/poster-codes.mjs --code '/Two Ink Collision /rebuild'
node scripts/poster-codes.mjs --category 02
node scripts/poster-codes.mjs --query 'Bauhaus'
node scripts/poster-codes.mjs --list-categories
node scripts/poster-codes.mjs --command /codes
```

`/Name` can inform a new design; `/Name /rebuild` can inform an explicitly
requested broad redesign of an inspected source. Neither is an executable
command, native model parameter, artwork text or permission to expand an edit.
For a background-only change, retain that scope even if the selected entry
describes a full layout change. Do not invent an input poster for a new brief.

Preserve all required source text and per-property reference locks during a
rebuild. A category mentioning a performer, festival, protest or microphone
does not authorize adding those facts, people or objects. Source names contain
no verified fonts, palettes, seeds or guarantee of generation quality.

## Apply the useful meaning

For `/Two Ink Collision`, one interpretation is two declared simulated inks
on a separate paper substrate; a controlled overlap guides attention. Choose
colors from the approved brief. The darker overlap is not an unapproved third
ink. Translate other entries with their individual descriptions and the
[composition](poster-style-and-composition-atlas.md),
[style](poster-style-translation-catalog.md) and
[production](poster-movements-and-production-atlas.md) atlases.

The helper never renders, executes selected text, writes files or uses a
network. Catalog integrity tests verify names, grouping and descriptions;
they do not evaluate design quality or user approval.
