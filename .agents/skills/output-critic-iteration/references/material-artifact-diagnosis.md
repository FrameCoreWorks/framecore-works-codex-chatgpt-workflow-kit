# Material Artifact Diagnosis

Adapted for the existing Workflow Kit role. Source: FrameCore Works,
Static Graphic Design Creator, Apache-2.0, commit
`c3cbdf766411ca7e1131bc034bfa74ebad2efe71`. Ownership and links were
adapted; upstream standalone activation, installation and execution are not imported.

Read for an observed texture/material defect or a requested artifact critique. Use [QA and repair](static-graphic-review.md) for acceptance and authorization. This is a visual diagnosis method, not a claim about hidden model architecture.

## Establish what is actually visible

Inspect the original returned file when available, then the affected region at native scale and the intended delivery size. Compare supplied references or the approved base. If only a screenshot, compressed preview or upscale is available, state that limitation; do not attribute its defects to the original generator without evidence. Enlarging an image can expose useful structure but also changes its appearance.

Name the location, material, visible pattern and consequence. Terms such as cellular, web-like, dotted, tiled or contour-like describe appearance. They do not establish a decoder defect, latent reuse, training-data cause, hidden seed or context contamination.

| Observation | Distinguish from legitimate intent | Bounded correction |
| --- | --- | --- |
| Repeated cells, webs or dots across unrelated surfaces | Bark, scales, lace, screenprint dots or an approved fantasy material | Correct the affected surface; retain its own texture and object boundaries |
| Regular lattice, grid or tiling | Gingham, a designed grid, halftone or intentional pixel art | Remove unwanted repetition only where it violates that material's role |
| Stacked contour bands or worm-like ridges | Deliberate contour drawing, wood grain or topographic graphics | Recover the specified surface transitions without flattening the whole image |
| Plastic skin or over-smoothed fabric | Intentional illustration or smooth manufactured material | Restore age cues, fibers or fine variation only where required |
| Material collapse or lost fine structure | Purposeful flat color or a distant low-detail area | Restore the specific structure while preserving silhouette, light and depth |
| Halo, sharpened edge or checkerboard fringe | Intended graphic outline or an opaque patterned background | Inspect original edges and alpha; correct contamination rather than adding blur everywhere |
| Increasing drift through successive edits | An explicitly approved change of style, age or construction | Return to the last acceptable base; do not treat cumulative damage as a new lock |

An intentional code-driven halftone or pixel grid is not a defect merely because it repeats. Conversely, a style name cannot excuse unwanted damage to faces, text, product labels or unrelated materials.

## Keep three judgments separate

Record whether the unwanted artifact remains, whether intended detail survives, and whether the creative intent is preserved. Use concise observed evidence rather than invented numerical scores. A repair that removes webbing by turning bark, leaves and cloth into smooth plastic fails when those materials were required. Also check protected copy, identity, geometry and layout; a successful texture change alone cannot pass QA.

For a prompt-only diagnosis, propose the correction without claiming inspection or repair success. For a visible result, distinguish an objection at actual use size from a pixel-level issue that does not affect the requested deliverable. Neither observation automatically authorizes another render.

## Compose the smallest repair

Lead with the affected region and one permitted change, then state the retained local detail and global preserve set. For example, after inspection and approval of a forest-poster repair:

```text
Edit the supplied approved poster only to remove the accidental repeated oval cells from the bark of the left foreground trunk. Restore irregular vertical bark fissures at the existing scale, keeping the trunk silhouette, moss patches, lighting and depth. Preserve all leaves, intentional distant halftone, exact poster text, type placement, crop and color relationships. Do not smooth unrelated materials or redesign the composition.
```

This is an authored example, not a tested image result. Confirm the actual source and scope before adapting it. If a targeted repair changes required detail or protected properties, reject it and keep the prior approved artifact. A broader reinterpretation requires a broader user brief; it is not the same as cleanup.

Use frequency, edge or similarity measurements only as supporting evidence when the actual task needs them. They can detect repetition or change but cannot decide whether a pattern is intended or whether a face, product or message is correct. Do not add automated image-analysis scripts to ordinary design work without a concrete need.
