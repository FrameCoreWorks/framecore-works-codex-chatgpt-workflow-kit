# HyperFrames Workflow

## Purpose

HyperFrames is treated as a coded-video workflow path, not as a paid media-provider integration. In this kit, it is a planning and production route for HTML or code-driven motion work that Codex can reason about through briefs, scene structure, render QA, and delivery manifests.

Use this path when the expected output is a structured video composition rather than a generated media provider result.

## When To Use

Use the HyperFrames route for:

- HTML or code-driven video compositions
- motion graphics
- title sequences
- captioned clips
- product explainers
- ecommerce product motion
- brand or campaign cutdowns that need repeatable timing and layout

Do not use it as a replacement for static raster graphics with visible text. Those follow the text-bearing image policy.

## Workflow Route

Expected route:

1. Motion direction.
2. Storyboard or scene structure.
3. Copy and caption planning.
4. HyperFrames production brief.
5. Render QA.
6. Delivery manifest.

The route should preserve upstream decisions from the brief, references, copy, and storyboard. HyperFrames production should not rewrite the creative direction unless the workflow-orchestrator explicitly loops the task back.

## Production Brief Requirements

A HyperFrames production brief should define:

- aspect ratio and duration
- scene timing
- visual hierarchy
- layout rules
- motion intent
- GSAP animation notes when animation sequencing matters
- asset list and source files
- caption and overlay behavior
- expected render format
- QA checks

The brief should be specific enough that another Codex run can recreate or repair the composition without guessing the structure.

## Captions And Overlays

Captions, supers, lower thirds, and other overlays are allowed in this coded-video path when they are part of the final video composition. Keep text short, legible, and timed to the scene. Include exact copy, placement, safe margins, and reading duration in the brief.

This does not change the static text-bearing image rule. Static raster graphics with visible text still require GPT Image 2 one-pass generation through the built-in chat image path.

## Render QA

Render QA should check:

- nonblank frames
- correct aspect ratio
- no clipped text
- no overlapping UI or captions
- readable typography at target size
- scene timing and transitions
- source files included in the delivery manifest
- final video file and preview artifacts listed

If render output is missing, blank, or visually broken, the workflow should return to HyperFrames production or motion direction instead of shipping.

## Provider-Neutral Boundary

This repo does not bundle paid media-provider clients, provider credentials, endpoint catalogs, or external execution tools for HyperFrames work. HyperFrames is documented here as a coded-video workflow path inside Codex, with provider-neutral planning, QA, and delivery rules.

User-configured external tools can be added outside the public kit, but they are not enabled by this repository.

## Delivery

Delivery should include a manifest with the production brief, source files, render outputs, preview files, QA status, known limitations, and any repair notes. A finished HyperFrames task should be reproducible from the local artifacts without relying on private paths or hidden provider state.
