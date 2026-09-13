# Unified Static Prompt Contract

Adapted for the existing Workflow Kit role. Source: FrameCore Works,
Static Graphic Design Creator, Apache-2.0, commit
`c3cbdf766411ca7e1131bc034bfa74ebad2efe71`. Ownership and links were
adapted; upstream standalone activation, installation and execution are not imported.

Use this contract for posters, flyers, business cards, menus, labels, covers, key visuals, advertisements, and text-led social graphics. It produces one final integrated raster-design instruction. Explicit separate-assets requests use layered assets (the explicitly requested `asset-manifest` component handoff), including a shared plan and one asset at a time; they do not use this integrated-output restriction as a reason to refuse the requested separation.

## Non-negotiable construction rule

For the integrated-output mode, the eight stages are construction priority inside one generation. They must never request eight outputs, intermediate images, blank typography zones for later copy, separate layer files, or a manual compositing pass.

## Objective-first preflight

Before compiling any of the eight stages, resolve the poster strategy in this order: communication goal; required audience response; reading mode and copy burden; visual thesis; composition archetype and attention order; image/type roles and hierarchy; style family or original attributes; material treatment. Classify visible content as `must_read`, `should_read`, `metadata`, or `decoration`. Do not select a style first and retrofit a goal around it.

For open concepts, use the internal concept development asset (the `static-direction` handoff) and paired copy routes where needed. A selected or supplied concept is preserved through composition. Before final compilation, require the canonical selected/locked concept and copy states (or explicit no-copy), resolved references and feasible production intent in [workflow integration](static-design-prompting.md). Directed work does not require new alternatives. For a narrow scoped edit, put the permitted change first and preserve the approved composition; the eight stages are not mandatory headings for a repair.

## Prompt compactness

Apply the optional-code and visibility rules in code selection and rebuild. Ordinary briefs need no code selection from the user. For an internally chosen direction or a request to hide codes, compile its composition, type/image relationship and material choices in ordinary language, without code labels, names or EP IDs in either the delivered prompt or the submitted generation prompt. When the user explicitly selects a code and does not ask to hide it, or requests its inclusion, retain its slash label as instruction-only metadata and expand the same visible choices. Never rely on the identifier alone or print it as design copy. For a requested full rebuild, quote all required source strings and preserve factual/reference locks; for a narrower repair, retain that scope. An internally selected `/rebuild` suffix grants no redesign permission. A new brief needs no imaginary source poster. Respect an explicit opt-out from catalog use.

Resolve all eight stages, but do not force eight headings or eight long paragraphs. For a simple brief, compile the relevant decisions into one concise, readable prompt. For a complex text-led design, use short labelled segments or paragraphs in the same semantic order. Do not duplicate a constraint across stages unless it is a critical lock, such as exact visible copy, protected identity, product truth, or one permitted scoped edit.

## Stage order

1. **Final-output contract**
   - State asset type, one finished output, intended format, communication objective, reading mode, primary attention order, and relevant exclusions such as unrequested mockups or grids of alternate versions; a requested coherent collage is allowed. Do not use a style name as the communication objective.
   - Name one design thesis and one layout mechanism. Examples: a route carries information; type contains the image; a physical interruption enacts the message; repetition enacts motion.

2. **Background and spatial foundation**
   - Define the background field, colour structure, material treatment, protected reading zones, negative space, safe margins, and the spatial logic that permits the intended hierarchy.
   - Do not treat paper grain, collage, photocopy, a barcode, a single accent colour, or display type as universal defaults. Include each only when it has a specific communication role.

3. **Layout architecture and attention flow**
   - Declare the composition archetype, focal axis, relative scales, alignment logic, reading rhythm, and the relationship of large, medium, and functional information.
   - Specify only the required attention levels, usually one to three, and make them testable. Equal modules are valid for deliberate comparison; centering is valid when it serves the selected mechanism.

4. **Hero and protected source assets**
   - Define the dominant event: it may be type, a datum, negative space, a relation, or an actual person/product/scene. Do not invent a pictorial hero for a typographic design. State only relevant scale, placement, depth, light, material and protected properties.
   - When references are supplied, name their current-request aliases and governing properties. Specify useful topology (continuous label boundary, seam relation, count, enclosure, overlap) rather than relying on repeated fidelity adjectives. A style reference cannot silently replace product, logo, or identity truth.

5. **Supporting graphic elements**
   - Add only secondary elements that guide the eye, encode information, establish brand recognition, or reinforce the layout mechanism. State each element's position and job.
   - Remove decorative particles, arbitrary icons, unnecessary frames, meaningless geometric marks, and unrelated image fragments.

6. **Typography and functional information**
   - Quote every required visible string exactly. State its required status separately from `must_read`, `should_read`, `metadata`, or `decoration`, then state hierarchy, type role, placement, intentional line breaks, contrast, colour role, and allowed text count.
   - Describe a type category and visible behaviour instead of asserting that a raster generator has access to a named font file. Use [typography feasibility](typography-and-text-feasibility.md) for risk, Polish/multilingual handling and intended-size QA. Keep required functional copy legible without silently shortening it. If critical or dense information cannot survive raster QA, stop before generation and route to DTP rather than treating it as decorative pseudo-text.

7. **Colour, light, and material integration**
   - State how the selected style attributes, colour, light, contrast, surface, and depth bind the composition together. Use the selected compatible palette and motivated light; a deliberate hybrid must retain its assigned jobs. For a limited-ink simulation, name inks separately from substrate and overprint so new accent colours do not contradict the process. Treat lithography, screenprint, risograph, letterpress, collage, photomontage, offset, or halftone as visual material simulation unless a real production process is separately confirmed. Tie every process cue to a visible cause such as separation, overprint, register, relief, paper absorption, or dot structure; never use a generic vintage/damage filter.
   - Protect readable copy through contrast and layout, not by stacking unnecessary panels, glows, or effects behind every string.
   - Assign textures to their actual surfaces and useful scale. Preserve intentional halftone, cloth pattern, grain or pixel clusters; do not paste universal anti-texture exclusions into every prompt. A reported artifact needs a location-specific correction, not a claim about the renderer's hidden mechanism.

8. **Finish, exclusions, and acceptance checks**
   - Finish with optical alignment, calibrated spacing, restrained material evidence, safe margins, and high-priority legibility.
   - Exclude unwanted additions. State observable pass conditions and the required repair route if exact text, identity, product truth, or hierarchy fails.

## Design checks before delivery

- There is a declared focal/reading structure appropriate to the task, including a single-word or deliberate comparison layout.
- The visual mechanism supports the message rather than decorating it.
- Type and image have a defined relationship, or type/space deliberately carries the complete composition.
- Every major element has a reason to exist.
- Removing an element was considered.
- Every required item remains readable; metadata is not permission to omit or disguise it.
- No generic stock-like staging, collage clutter, arbitrary effects, or unsupported technical claim remains.
- The full words/form relationship is specific to the brief; do not remove a typographic title to test an image that was never meant to exist alone.
- A generic cityscape, decorative smoke, particle field, neon glow, pseudo-3D object, or arbitrary texture appears only when it performs a named communication job.
- Critical text is not used as filler, pseudo-glyphs, or decorative texture.
- Required factual/source authority is resolved; a visual movement does not establish a political position, cultural affiliation or factual claim.
