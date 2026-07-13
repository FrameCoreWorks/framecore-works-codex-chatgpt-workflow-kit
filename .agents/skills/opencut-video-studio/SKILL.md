---
name: opencut-video-studio
description: Use this skill to prepare, supervise, review, and document footage-first or timeline-first video editing in OpenCut or another user-controlled local timeline workflow, including asset bins, edit decisions, captions, audio, variants, QA, and delivery handoffs.
---

# OpenCut Video Studio

Use this skill as an optional planning bridge between the creative workflow and OpenCut as a local editing surface. OpenCut owns timeline assembly when it is available; the kit retains brief, source truth, creative direction, manifests, QA, and delivery governance.

## When To Use

Use this skill when:

- The user wants an OpenCut edit, rough cut, social cut, ad assembly, subtitle pass, VO sync, or reviewable local timeline plan.
- Several clips, images, audio files, captions, overlays, or variants need an explicit Edit Pack.
- The user needs exact instructions for manual or semi-manual timeline work.

Use HyperFrames or another coded-video route when deterministic code-driven composition is the primary requirement.

## Inputs

Required:

- `project_brief`: objective, audience, duration, aspect ratio, and delivery target.
- `asset_inventory`: available clips, images, audio, captions, logos, overlays, and their source roles.
- `edit_intent`: pacing, narrative or proof order, platform grammar, and must-preserve moments.

Optional:

- storyboard, script, VO, subtitle data, music/SFX notes, cutdown requirements, export specs, brand locks, and prior QA.

## Outputs

Produce an OpenCut Edit Pack containing:

- route decision and runtime assumptions
- asset bin and missing assets
- edit decision list and timeline map
- protected event windows
- VO, caption, music, SFX, overlay, and logo plan
- transition grammar
- variant and export matrix
- QA checklist, risks, rollback path, and delivery handoff

Use `templates/opencut-edit-pack.md` for the standard artifact.

## Process

1. Confirm whether OpenCut is actually available and whether the work is planning, manual editing guidance, assisted editing, review, or repair.
2. Complete upstream brief, source-truth, story, storyboard, copy, and prompt work that the edit depends on.
3. Build the asset bin with identity, source role, duration, dimensions, rights notes, quality status, and intended timeline use.
4. Create an event map and edit decision list with protected windows for hooks, product reads, dialogue, captions, overlays, proof, CTA, and audio cues.
5. Define pacing, transition grammar, audio behavior, caption route, overlay rules, variants, and export targets.
6. Give exact timeline instructions without claiming unsupported project import, API, MCP, or headless automation.
7. Review exported files for pacing, continuity, sync, caption safety, brand fidelity, platform framing, and technical delivery requirements.

## Decision Rules

- Prefer OpenCut for footage-first, timeline-first, human-reviewed edits with multiple media layers.
- Prefer a coded-video route for deterministic motion graphics, repeatable layouts, and programmable batch renders.
- Prefer a simple local media utility for trims, muxing, compression, or format conversion only.
- Use `caption-studio` when captions need detailed timing, style, safe-zone, or repair logic.
- Use `creative-video-producer` first when the edit is one stage in a larger video production package.
- Treat every short-form variant as a distinct edit decision, not an automatic crop or trim.

## Guardrails

- Do not treat OpenCut as the workflow orchestrator or a media provider.
- Do not assume OpenCut exposes a stable API, MCP server, headless mode, or portable project-file import/export.
- Do not install dependencies, start services, open GUI applications, upload files, or publish without explicit user instruction.
- Do not delete or overwrite source footage, client assets, references, manifests, or accepted finals.
- Do not mark third-party music, SFX, stock footage, fonts, or logos as cleared without source and rights evidence.
- Exclude failed, rejected, temporary, and superseded files from final delivery.

## Handoff

Review gate: `execution_manifest_fit` before editing and `post_execution_fit` after export.

Hand off with:

- `runtime_status`
- `asset_bin`
- `missing_assets`
- `edit_decision_list`
- `timeline_map`
- `protected_windows`
- `caption_audio_overlay_plan`
- `transition_grammar`
- `variant_matrix`
- `export_targets`
- `qa_results`
- `rollback_path`
- `delivery_status`
- `next_role`

## QA Checklist

- The edit pack distinguishes source assets, generated assets, derived files, and final exports.
- Timing, order, captions, VO, music, SFX, overlays, and CTA agree with the approved route.
- Protected windows preserve critical hooks, proof, dialogue, branding, and product visibility.
- Variants retain their intended message and platform-safe framing.
- Runtime assumptions are explicit and no unsupported automation is claimed.
- Export status and QA evidence are visible before delivery.
