---
name: video-prompt-architect
description: Use this skill to create final provider-neutral video prompt packs from approved storyboard, motion direction, references, and copy.
---

# Video Prompt Architect

Use this skill to create final provider-neutral video prompt packs from approved storyboard, motion direction, references, and copy. It prepares prompt artifacts but does not execute video generation.

## When To Use

Use this skill when:

- Storyboard, motion direction, references, and copy are ready for video prompt authoring.
- Scene prompts need timing, camera language, motion language, continuity, and expected observables.
- A prompt pack must be reviewed before any user-selected execution path.

Do not use this skill to invent missing structure, choose paid providers, or execute tools.

## Inputs

Required:

- `storyboard_contract`: scenes, shot cards, timing, and transitions.
- `motion_direction`: pacing, visual system, and attention architecture.
- `reference_pack`: continuity anchors and suppression rules.

Optional:

- `copy_pack`: VO, dialogue, supers, captions, and CTA locks.
- `asset_manifest`: approved source files or excluded assets.
- `qa_requirements`: expected observables and acceptance criteria.
- `target_generator_profile`: verified task modes, prompt fields, extension behavior, and negative handling.
- `continuity_carriers`: per-shot references, source clips, chained frames, or verified native shared context.

## Outputs

Produce a Video Prompt Pack with:

- scene prompts and timing
- camera and motion language
- generation-unit classification and continuity-carrier map
- generator format contract and negative handling mode
- copy, VO, or text locks
- constraint and suppression ledger
- expected observables
- QA checks and loopback guidance

## Process

1. Confirm storyboard and direction are complete.
2. Resolve the target generator, task mode, field shape, and negative handling. If unresolved, keep the contract portable and mark formatting pending.
3. Classify every request as independent text generation, independent reference-conditioned, frame-chained image-to-video, native extension, or native multishot.
4. Map every strict identity, product, location, wardrobe, prop, lighting, camera-side, action-state, and screen-direction lock to a carrier attached to that exact request.
5. Convert each shot or scene into standalone prompt-ready language while preserving timing and copy locks.
6. Add observable criteria for QA.
7. Keep execution, cost planning, and tool choice separate.

## Decision Rules

- If storyboard is incomplete, route to `storyboard-architect`.
- If copy affects timing and is not locked, route to `copy-voice`.
- Use one standalone prompt per independent scene or shot. A separate request cannot rely on wording from a previous request.
- Keep provider-neutral language unless the user explicitly chooses a specific execution path later.
- Do not output a universal negative-prompt field. Use one only when the verified target interface exposes it.
- If strict continuity is requested without a carrier, route upstream to create the missing reference or label the result approximate with drift risk.

## Guardrails

- Do not run video generation, upload files, or publish outputs.
- Do not invent missing structure, claims, characters, or continuity anchors.
- Do not remove suppression rules.
- Do not hide prompt limitations from QA.
- Do not use `same character`, `same location`, `continue previous shot`, repeated prose, or a seed as a substitute for a per-request continuity carrier.

## Handoff

Review gate: `promptability_fit`.

Hand off to `tool-routing-cost` or `qa-iteration` with:

- `prompt_pack`
- `timing`
- `copy_locks`
- `generation_units`
- `continuity_carriers`
- `prompt_format_contract`
- `acceptance_criteria`

## QA Checklist

- Every prompt maps to a storyboard scene or shot.
- Timing is preserved and every strict continuity lock has a concrete carrier.
- Every independent prompt is standalone and uses only manifest-valid asset aliases.
- Constraint handling matches the resolved generator profile or is explicitly unresolved.
- Copy or VO locks are explicit.
- Expected observables are testable.
- No execution path is implied without user choice.
