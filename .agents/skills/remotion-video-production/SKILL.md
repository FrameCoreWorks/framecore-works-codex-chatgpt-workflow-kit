---
name: remotion-video-production
description: Use this skill to plan, implement, review, or repair deterministic code-driven videos built with Remotion, React, and TypeScript, including compositions, frame-based animation, sequences, reusable props, media, captions, local previews, renders, variants, and render QA.
---

# Remotion Video Production

Use this skill to turn an approved video brief, storyboard, or existing Remotion project into a testable code-driven composition. It supports planning-only work in ChatGPT and local implementation in a shell-capable Codex workspace without adding a permanent agent or activating an external media provider.

## When To Use

Use this skill when:

- The final video should be authored as React or TypeScript code and rendered deterministically.
- A project needs reusable compositions, parameterized variants, data-driven scenes, captions, or repeatable exports.
- Existing Remotion code needs timing, layout, media, render, or maintainability review.
- A storyboard or Creative Video Production Pack must become a Remotion implementation contract.

Use `opencut-video-studio` for footage-first timeline editing. Use HyperFrames skills when the requested runtime is specifically HyperFrames or the route is centered on HTML/GSAP composition.

## Inputs

Required:

- `video_contract`: objective, audience, duration, aspect ratio, FPS, and delivery format.
- `source_truth`: approved copy, claims, brand, product, character, and continuity locks.
- `scene_plan`: ordered beats or scenes with timing intent and observable acceptance criteria.

Optional:

- existing Remotion project, package versions, composition IDs, props schema, storyboard, media manifest, captions, audio plan, visual references, export matrix, and prior render evidence.

## Outputs

Produce one or more of:

- Remotion Production Brief
- composition and props architecture
- scene, sequence, and frame timing map
- implementation or repair plan
- React/TypeScript composition changes when a writable project is available
- preview, still, or render verification evidence when commands actually run
- render QA report, asset manifest updates, and delivery notes

Use `templates/remotion-production-brief.md` for nontrivial work. Read `references/remotion-implementation-notes.md` before implementing or reviewing Remotion code.

## Process

1. Confirm whether the task is planning-only, implementation, repair, review, or render verification.
2. Inspect the existing project, installed Remotion version, package manager, composition registry, scripts, asset layout, and repository instructions before changing code.
3. Lock the composition contract: ID, width, height, FPS, duration, input props, defaults, output codec or container, and required variants.
4. Convert the approved scene plan into named components and explicit frame ranges. Keep editorial timing separate from reusable visual components.
5. Drive animation from Remotion's frame and video configuration APIs. Use deterministic interpolation or spring behavior instead of browser-time CSS animation.
6. Route local assets through the project asset convention, validate media availability, and preserve approved copy, captions, logos, product details, and continuity anchors.
7. Implement the smallest coherent composition or patch. Preserve the project's versions and conventions instead of rewriting the scaffold.
8. Verify representative frames, scene boundaries, captions, audio sync, safe zones, and required variants. Run a full render only when the environment supports it and the user requested implementation or rendering.
9. Record commands actually run, output paths, failed checks, bounded repair targets, and final delivery status.

## Decision Rules

- Use Remotion when deterministic React/TypeScript composition, reusable props, data-driven variants, or code reviewability is a primary requirement.
- Use a storyboard or `creative-video-producer` first when story, shot order, timing intent, copy, or asset authority is unresolved.
- Use `caption-studio` when subtitle segmentation, timing, styling, safe zones, or caption QA needs dedicated work.
- Use `asset-manifest` before rendering when source files, versions, rights, or output naming are unclear.
- In an existing project, prefer its installed Remotion APIs and package versions. Check current official documentation before introducing an API that is absent from the project.
- In a chat-only environment, return the brief, architecture, code guidance, and QA plan; do not claim files, previews, or renders were created.
- A local preview is evidence for interaction and representative frames. A successful final render and inspected output are separate acceptance checks.

## Guardrails

- This skill does not activate external providers, hosted rendering, uploads, API keys, publishing, or global installs.
- Do not scaffold a new project, install dependencies, start a server, or render unless the active environment permits it and the task requires execution.
- Do not use unseeded randomness, wall-clock time, CSS transitions, or CSS keyframe animation for render-critical motion.
- Do not fetch private assets through remote URLs or expose tokens, signed URLs, cookies, credentials, or local absolute paths.
- Do not invent media rights, font licenses, music clearance, trademark approval, or Remotion license compliance. Record unresolved rights or licensing questions.
- Do not claim Studio, still, render, or media verification passed without command output or inspected artifacts.
- Keep the patch scoped to the requested composition and avoid unrelated framework upgrades.

## Handoff

Review gate: `execution_manifest_fit`, followed by `post_execution_fit` when preview or render outputs exist.

Hand off through existing workflow roles with:

- `task_mode`
- `composition_contract`
- `project_and_version_state`
- `scene_timing_map`
- `props_and_variant_schema`
- `asset_and_caption_plan`
- `implementation_scope`
- `commands_run`
- `preview_or_render_evidence`
- `qa_status`
- `loopback_target`
- `delivery_outputs`
- `known_limitations`

## QA Checklist

- Composition ID, dimensions, FPS, duration, props, and required variants are explicit.
- Scene boundaries and nested timing are frame-accurate and free of accidental gaps or overlaps.
- Motion is driven by frame state and remains deterministic across preview and render.
- Text, captions, logos, products, characters, and source-truth locks remain legible and consistent.
- Assets resolve through the project's declared asset path and missing media fails visibly.
- Representative first, middle, transition, caption, and final frames were checked when execution occurred.
- Audio, captions, transitions, and scene changes agree with the timing map.
- The report distinguishes planned work, implemented code, preview evidence, and completed renders.
- Failed checks have a minimal repair target and regression check before delivery.
