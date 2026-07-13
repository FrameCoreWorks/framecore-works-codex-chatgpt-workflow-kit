---
name: creative-video-producer
description: Use this skill to coordinate an end-to-end creative video package for reels, Shorts, TikTok, paid social, product films, UGC-style videos, explainers, music-video routes, cutdowns, and local editing, while preserving provider-neutral planning, QA, and delivery gates.
---

# Creative Video Producer

Use this skill to turn a rough video request and available source material into a production-ready package. It coordinates existing roles and specialist skills; it does not become a permanent agent, media provider, or editing runtime.

## When To Use

Use this skill when:

- The request spans brief, direction, script, storyboard, keyframes, prompts, audio, captions, editing, QA, and delivery.
- The user wants a complete reel, short-form ad, product video, UGC-style video, explainer, music-video route, or cutdown plan.
- Several creative specialists need one shared production state and acceptance criteria.

Use a narrower skill when the user only needs one prompt, one script, caption repair, or a simple delivery note.

## Inputs

Required:

- `video_goal`: audience effect, business purpose, or story objective.
- `format`: duration, aspect ratio, platform, and required variants.
- `source_truth`: approved product, brand, story, claim, character, and copy locks.

Optional:

- brief, references, footage, images, storyboard, script, VO, music/SFX direction, logo files, edit constraints, delivery targets, and existing QA evidence.

## Outputs

Produce a Creative Video Production Pack containing:

- producer preflight and route decision
- source asset roles and missing decisions
- direction, script, beat map, and shot plan
- keyframe and video-prompt handoffs
- VO, dialogue, supers, captions, music, and SFX plan
- local editing and cutdown plan
- per-shot acceptance criteria
- manifest fields, QA checklist, loopback targets, and delivery status

Use `templates/creative-video-production-pack.md` for nontrivial work.

## Process

1. Run a preflight: confirm goal, inputs, missing route-changing decisions, defaults, exclusions, and next artifact.
2. Establish brief and reference authority, including source roles, ownership uncertainty, product or story truth, claim locks, and continuity anchors.
3. Choose the primary route: commercial, ecommerce, narrative, UGC, music video, explainer, footage-first edit, or coded video.
4. Add `screenplay-story-architect` when narrative writing must be solved before storyboard and prompt work.
5. Build direction, beat map, shot cards, timing, first/last-frame logic, copy, audio, and caption requirements.
6. Prepare keyframe and video prompt handoffs with observable acceptance criteria, without executing external tools.
7. Select a local edit route and define asset bin, timeline events, protected windows, cutdowns, and export targets.
8. Run QA against brief, source truth, continuity, copy, product fidelity, audio, captions, platform constraints, and delivery requirements.
9. Route only the failed layer back for minimal repair, then regression-check dependent outputs.

## Decision Rules

- Use `ecommerce-campaign-strategy-director` before production when product, offer, channel, claim, or test strategy is unresolved.
- Use `screenplay-story-architect` before storyboard when story, treatment, dialogue, or scene logic is weak.
- Use `caption-studio` for detailed caption timing, styling, safe zones, and caption QA.
- Use `opencut-video-studio` for footage-first or timeline-first local edit planning.
- Use HyperFrames skills for coded-video composition and repeatable motion systems.
- Critical product, packaging, logo, face, character, claim, CTA, or visible-text shots require sequential QA before the route advances.
- A short cutdown is a re-authored variant, not merely a trim of the master.

## Guardrails

- Planning does not activate providers, APIs, uploads, publishing, global installs, or destructive cleanup.
- Never claim a provider run, local render, timeline edit, or file output unless it actually occurred on an available surface.
- Do not upload local or private source assets without explicit current approval and an available approved route.
- Do not invent licensing, claim approval, voice rights, music clearance, product facts, or source provenance.
- Keep generator-specific prompt formatting in the relevant prompt skill; do not attach a universal negative prompt.
- Preserve source files and accepted finals. Exclude superseded or failed outputs from delivery.

## Handoff

Review gate: `workflow_route`, then `post_execution_fit` when outputs exist.

Hand off with:

- `producer_preflight`
- `primary_route`
- `source_asset_roles`
- `truth_and_continuity_locks`
- `direction_and_story_state`
- `beat_and_shot_plan`
- `copy_audio_caption_plan`
- `keyframe_handoff`
- `video_prompt_handoff`
- `local_edit_plan`
- `cutdown_matrix`
- `shot_acceptance_criteria`
- `manifest_fields`
- `qa_status`
- `loopback_target`
- `next_role`

## QA Checklist

- The route is clear and uses the smallest necessary set of roles and skills.
- Missing decisions are explicit and limited to route-changing questions.
- Source assets, claims, product details, story locks, and continuity anchors are traceable.
- Script, storyboard, prompts, audio, captions, edit, and cutdowns agree on timing and intent.
- Critical shots have observable acceptance criteria.
- Failed outputs have a bounded correction target and do not enter delivery.
- Provider and upload boundaries remain explicit.
- The user can see what is ready, blocked, awaiting approval, or next.
