---
name: caption-studio
description: Use this skill to plan, normalize, style, review, or repair captions and subtitles for Reels, TikTok, Shorts, ads, explainers, and other videos using provided transcripts, subtitle files, word timing, or available local tools.
---

# Caption Studio

Use this skill to convert transcript or timing data into a caption plan, style specification, render or edit handoff, and QA contract. It can guide local rendering when tools are available, but it does not assume hosted transcription, external providers, or a specific editor.

## When To Use

Use this skill when:

- A video needs burned-in captions, subtitle files, word highlights, karaoke timing, animated captions, or platform-safe text placement.
- Existing captions need timing, spelling, readability, style, or occlusion review.
- A broader video package needs a bounded caption layer before editing or delivery.

Use `copy-voice` first when the actual wording is not yet approved.

## Inputs

Required:

- `source_timing`: video duration plus transcript, SRT, VTT, ASS, segment timing, or word timing.
- `language_and_locks`: language, spelling, names, brand terms, legal copy, and words that must not be changed.
- `target`: aspect ratio, platform, output mode, and expected viewing size.

Optional:

- style reference, preset choice, face/product/UI safe areas, speaker labels, CTA timing, font constraints, color constraints, and existing caption failures.

## Outputs

Produce a Caption Task Pack containing:

- route and source-truth summary
- normalized caption data requirements
- segmentation and timing rules
- selected style and rationale
- layout and safe-zone rules
- render or edit handoff
- QA observations, blocked items, and delivery format

Use `templates/caption-task-pack.md` for nontrivial jobs.

## Process

1. Choose the route: plan only, provided transcript, local transcription planning, styled animation, deterministic subtitle burn-in, editor handoff, or QA/repair.
2. Lock language, spelling, brand terms, legal text, speaker identity, and transcript authority.
3. Normalize timing into monotonic segments; keep word timing within segment bounds when available.
4. If no style was selected, show a compact set of suitable options. Choose automatically only when the user explicitly allows it.
5. Set line count, words per beat, reading speed, emphasis behavior, position, safe zones, and collision priorities.
6. Define an available local route such as an editor timeline, coded-video captions, ASS/subtitle burn-in, or sidecar subtitle delivery.
7. Review dense frames, timing boundaries, spelling, speaker changes, occlusion, contrast, CTA conflicts, and final duration.

## Decision Rules

- Prefer word-level timing for karaoke, active-word highlight, bounce, or rapid short-form captions.
- Prefer segment-level subtitles for calm editorial work and deterministic sidecar delivery.
- Prefer a coded-video route when exact repeatable motion and layout are required.
- Prefer a timeline editor when captions are one layer inside a larger human-reviewed edit.
- Keep captions away from faces, products, UI controls, platform chrome, logos, lower thirds, and CTAs.
- Split or retime dense text instead of shrinking it until it becomes unreadable.

## Guardrails

- Do not change locked names, claims, legal copy, quoted wording, or product terms without approval.
- Do not call hosted transcription, provider APIs, uploads, or cloud rendering without explicit user instruction and an available approved route.
- Do not add project dependencies or claim a render succeeded without inspecting and running the actual project route.
- Keep private transcripts and source media out of public examples, logs, and reusable skill files.
- Do not silently choose a visual style when the choice materially affects the output.

## Handoff

Review gate: `copy_fit` for wording and `post_execution_fit` for rendered or edited outputs.

Hand off with:

- `transcript_authority`
- `language_and_locked_terms`
- `timing_model`
- `caption_segments`
- `style_preset`
- `layout_and_safe_zones`
- `emphasis_rules`
- `render_or_edit_route`
- `output_format`
- `qa_results`
- `blocked_items`
- `next_role`

## QA Checklist

- Timing is monotonic and stays within source duration.
- Captions match approved wording and preserve locked terms.
- Dense frames remain readable at target size.
- Line breaks, emphasis, and speaker changes are intentional.
- Text does not cover faces, products, UI, logos, CTAs, or platform controls.
- Style is consistent with content and accessible enough for the target use.
- Output status distinguishes a plan, edit pack, sidecar file, and verified render.
