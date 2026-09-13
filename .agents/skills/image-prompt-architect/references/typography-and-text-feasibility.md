# Typography and Text Feasibility

Adapted for the existing Workflow Kit role. Source: FrameCore Works,
Static Graphic Design Creator, Apache-2.0, commit
`c3cbdf766411ca7e1131bc034bfa74ebad2efe71`. Ownership and links were
adapted; upstream standalone activation, installation and execution are not imported.

Read when visible text, a logo, a tight format, multilingual copy, exact data, or production requirements affect the result. This reference owns preflight feasibility; qa-iteration owns inspection and acceptance. The integrated copy asset (the `copy-voice` handoff) owns wording and selection; the [capability contract](static-design-prompting.md) owns supported controls. Do not ask the user to approve already locked wording again merely to assess fit.

## Establish the viewing task

Resolve intended use, format/orientation, likely display size, reading mode, mandatory content, source assets, and production intent. Ask for dimensions only when their absence changes the feasibility decision. Keep native export dimensions in verified host settings; describe aspect, scale and composition semantically in the prompt. If real display size is unknown, do not call the asset a verified digital final.

| Intent | Meaning | Acceptance boundary |
| --- | --- | --- |
| `concept_raster` | Directional composition or presentation concept | Still preserve locked strings; label unresolved type/source checks |
| `digital_final` | Raster intended for actual digital use | Inspect the delivered file at intended viewing size and full resolution; all required text and source checks pass |
| `production_master` | Editable typography/vector, specified font file, print-ready or prepress output | `dtp_required`; no raster substitute can establish these properties |

A readable raster is an observed quality, not an editable master. A print-looking image is a material simulation. Exporting a raster to PDF does not establish bleed, colour separations, font licensing, vectors, or a valid dieline.

Effective PPI is pixel count divided by physical length in inches for each axis. A DPI metadata label does not create missing pixels; upscaling does not recover verified source detail. A HEX color in a prompt is appearance intent until measured against the required profile and viewing conditions. A vector-like logo remains raster unless real paths are delivered. Required QR/barcodes need a suitable deterministic production and scan-validation route, not a claim that a generated pattern is functional.

For explicitly requested separate assets (the explicitly requested `asset-manifest` component handoff), a manual text/layout specification may use the DTP handoff while a separate background or subject remains a feasible raster task. Preserve all project copy in the layer plan, assign strings to their output element, and apply finalization gates to the current asset. Do not treat unfinished editor assembly as a finished poster or use this exception to split an ordinary integrated request.

## Per-string typography contract

Keep exact text in the Copy Pack's selected inventory, represented as `copy.items` in optional preflight notes, with stable ID, language, role, required flag, authority, source and allowed changes. Role is attention priority, not permission to omit. A required legal footer remains required even as `metadata`; an optional CTA does not become mandatory because it is typical for an ad.

For every visible item define position, relative size, contrast/background, type behavior, intended line breaks, and relation to the focal element. Use only the hierarchy levels needed: a one-word poster can have one. The prompt contains exactly the selected text inventory, never candidate alternatives or invented microtype.

Distinguish typographic character from a font-file claim. Describe width, weight, case, contrast, terminals, rhythm or optical role. A named font supplied by the user can be retained as a target reference, but exact font use/licensing is unverified without an appropriate typesetting workflow and asset evidence. Avoid fake guarantees of kerning, ligatures or embedded fonts from raster generation.

Line breaks may change under `layout_only` only if they preserve words, punctuation and permitted reading order. Store breaks as a layout instruction while retaining the unbroken exact string. Do not shrink required information invisibly, hide it in texture, abbreviate, translate, round prices or remove terms to make a design pass.

## Feasibility gate

Assess burden relative to available area and reading task, not an arbitrary word-count threshold. Consider string count/length, number of languages, long addresses, narrow columns, contrast, image competition, exact alignment and consequence of error.

| Status | Decision | Next action |
| --- | --- | --- |
| `not_assessed` | Size, mandatory content or delivery requirement is unresolved | Clarify the material uncertainty; no final prompt |
| `compact` | Selected text has credible reading space and a manageable hierarchy | Compile prompt; still inspect every string after rendering |
| `at_risk` | Plausible raster, but long strings, multiple scripts, tight fit or important details need targeted checks | Record a concrete review plan before finalization; never promise error-free text |
| `dtp_required` | Production master, exact editable/production type, or required content cannot remain readable under the fixed constraints | Explain the specific blocker and propose a suitable layout handoff |

A three-item menu with ample room may be compact or at risk. A forty-item menu squeezed into a small story with compulsory terms is a different feasibility problem. Dates, prices, phone numbers and addresses require exact QA; their mere presence does not force DTP. Do not reduce locked copy without permission. If simplifying the content or changing format could solve the problem, propose the exact change for user choice.

## Polish and multilingual checks

Preserve ą, ć, ę, ł, ń, ó, ś, ź, ż and their uppercase forms; inspect the actual glyphs rather than assuming visually similar letters are correct. Keep supplied punctuation, decimal separator, currency position, date notation, phone grouping, URLs and handles verbatim. Never silently “correct” a factual value from context.

Set distinct language items and explicit reading order for bilingual layouts. Avoid a visually subordinate required translation that is unreadable at use size. RTL direction, mixed scripts, shaping and transliteration need surface-specific evidence and output review; unsupported shaping routes to typesetting when exact output is required. Human voice and natural translation are assessed before selection; localization after selection is a wording change requiring authorization.

## Legibility and accessibility

Inspect at intended viewing size and at full resolution: glance recognition, line endings, letter differentiation, spacing, edge clipping, hierarchy and local contrast against the actual image. Colour alone must not distinguish required categories when shape, labels or alignment can carry the same information. Avoid textures through small counters and glare across required text. Expressive distortion may affect a selected title only within agreed tolerance; mandatory instructions and factual metadata retain reliable reading.

Do not claim measured contrast compliance, OCR accuracy or colour-accessibility certification without measurements and applicable criteria. OCR can assist transcription checking; it cannot replace visual inspection of every required item. A screenshot or compressed preview alone cannot certify the delivered file.

## DTP handoff and repair

Return the locked copy inventory, source assets/roles, concept and layout rules, exact known format, intended use, required editable/print properties, and unresolved printer/font/profile details as `Unknown`. Do not invent bleed, trim, dieline, output profile or barcode validity. Recommend the suitable production route; execute only if separately authorized and available.

A supported scoped image edit may repair one observed defect, using the actual image and protected properties. It still requires inspection afterward. A text-free background plus manual overlay is not the default workaround: use separated production only when explicitly requested. Failure to meet fixed exact-type requirements is a DTP decision, not permission for endless rerenders.
