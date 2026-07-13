---
name: screenplay-story-architect
description: Use this skill for original film, short-form, advertising, product-video, music-video, and narrative campaign writing including loglines, pitches, treatments, sequence maps, beat sheets, scene cards, dialogue, coverage, rewrites, and production-ready storyboard handoffs.
---

# Screenplay Story Architect

Use this skill to build the story-writing layer before storyboard, prompt, generation, and editing. It turns a rough idea, brief, product truth, mood, or reference set into specific cinematic material with pressure, change, subtext, image logic, and a usable production handoff.

## When To Use

Use this skill when:

- The user asks for a screenplay, treatment, pitch, logline, beat sheet, sequence map, scene cards, dialogue, script coverage, or rewrite plan.
- An ad, reel, product film, short film, or music video needs a stronger narrative layer before storyboard work.
- Existing material feels generic, inert, over-explained, or difficult to translate into scenes.

Use `storyboard-director` directly when the story is already locked and the task only needs shot cards, timing, and continuity.

## Inputs

Required:

- `story_goal`: what the audience should understand, feel, remember, or do.
- `format_and_length`: feature, short film, ad, reel, product film, music video, scene, or review.
- `source_truth`: approved facts, characters, product details, world rules, and non-negotiable constraints.

Optional:

- audience, platform, protagonist, conflict, desired atmosphere, references, dialogue notes, production limits, existing script, and forbidden directions.

## Outputs

Produce the lightest complete Screenplay Development Pack:

- story route and assumptions
- logline and story thesis
- pitch or treatment
- sequence map or beat sheet
- scene cards
- dialogue, VO, or supers when needed
- atmosphere anchors
- coverage or rewrite notes when reviewing material
- technical and storyboard handoff
- QA and unresolved decisions

Use `templates/screenplay-development-pack.md` as the standard scaffold.

## Process

1. Lock format, duration, audience, source truth, exclusions, and required output depth.
2. Define the dramatic question, visible desire, hidden contradiction, resistance, stakes, tone contract, and final emotional residue.
3. Choose a neutral craft mode such as causal classical structure, character-led indie pressure, observational realism, moral ambiguity, restrained ritual, or commercial short-form.
4. Build a cause-and-effect sequence map before writing detailed scenes.
5. Give every scene a purpose, pressure source, visual action, turn, image or sound anchor, entrance state, and exit state.
6. Write dialogue through subtext, behavior, silence, interruption, and contradiction before exposition.
7. Convert accepted story material into timing, continuity locks, copy blocks, and production-facing handoff fields.

## Decision Rules

- For approval-stage concepts, produce a pitch or treatment before a full script.
- For production-bound short-form work, include a beat map and technical handoff even when a full screenplay is unnecessary.
- If a scene does not change pressure, reveal character, alter information, or create a cinematic event, cut or merge it.
- Dialogue should not explain what the image already communicates.
- Atmosphere must come from location, behavior, sound, objects, light, and rhythm, not adjective lists.
- For commercials, story craft must preserve product truth, proof needs, first-frame attention, memory, and CTA logic.

## Guardrails

- Create original material. Do not copy, continue, or imitate copyrighted scripts or a living creator's distinctive style.
- Translate references into neutral craft functions rather than reproducing scenes, dialogue, characters, or shot sequences.
- Do not invent factual, product, medical, legal, or performance claims.
- Do not treat this skill as a provider, generation, editing, or publishing route.
- Label assumptions and material that still needs user approval.

## Handoff

Review gate: `structure_fit`.

Hand off with:

- `format_duration`
- `story_thesis`
- `logline`
- `sequence_or_beat_map`
- `scene_cards`
- `dialogue_vo_supers`
- `atmosphere_anchors`
- `first_and_final_image`
- `continuity_locks`
- `product_or_fact_locks`
- `avoid_generic_notes`
- `qa_status`
- `next_role`

Common handoffs are `motion-direction`, `storyboard-architect`, `copy-voice`, `video-prompting`, and `creative-video-producer`.

## QA Checklist

- The premise is specific and produces pressure, choice, and change.
- The sequence has cause and effect rather than a list of moods.
- Every retained scene has a cinematic function and an exit-state change.
- Dialogue contains voice or subtext and avoids redundant explanation.
- Atmosphere is actionable for storyboard, camera, sound, and edit decisions.
- Facts, claims, characters, and continuity locks remain intact.
- The handoff can feed production without another structural rewrite.
