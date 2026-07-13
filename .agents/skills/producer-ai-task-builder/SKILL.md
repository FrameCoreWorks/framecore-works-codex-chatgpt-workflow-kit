---
name: producer-ai-task-builder
description: Use this skill to prepare copy-ready, text-only song, lyrics, instrumental, remix, music-video, Flow Music, Lyria, Flow, Veo, visible-singing, lip-sync triage, and repair task packets without executing providers, APIs, browser automation, or uploads.
---

# Producer AI Task Builder

Use this skill to turn a rough music or music-video request into a complete planning packet that a user can apply in their chosen compatible interface. It is a text-only preparation layer, not a provider integration.

## When To Use

Use this skill when:

- The user asks for an AI song brief, lyric strategy, instrumental direction, remix plan, stems/effects task, or music repair packet.
- A music video, lyric video, performance video, visible-singing plan, Flow/Veo prompt, or lip-sync triage is needed.
- A weak prior result needs diagnosis and a complete revised task packet.

Use `creative-music-video-director` when the request only needs high-level visual direction and not a copy-ready execution packet.

## Inputs

Required:

- `objective`: what music or video result is needed.
- `task_type`: song, lyrics, instrumental, remix, music video, visible singing, lip-sync triage, or repair.
- `source_truth`: approved lyrics, artist or character facts, references, rights notes, and non-negotiable constraints.

Optional:

- genre, mood, structure, tempo, instrumentation, vocal direction, duration, language, platform, visual treatment, existing media, failure evidence, and target interface.

## Outputs

Produce a Producer AI Task Packet containing:

- intent and task classification
- objective, source truth, assumptions, and rights notes
- song direction and lyric block or strategy
- tool-facing music prompt when applicable
- music-video treatment and video prompt when applicable
- visible-singing or lip-sync feasibility notes
- QA checklist
- repair plan and interface items that require current verification

Use `templates/producer-ai-task-packet.md` for standard packets.

## Process

1. Classify intent as explore, decide, build, repair, or finalize.
2. Classify the task and select only the packet sections needed for that route.
3. Separate user-approved material, references, assumptions, rights uncertainty, and facts that need current interface verification.
4. Build the music brief: structure, emotional progression, instrumentation, vocal behavior, lyrical role, and acceptance criteria.
5. Build the visual brief when needed: treatment, performance behavior, beat map, shot logic, continuity, and prompt-ready constraints.
6. For visible singing or lip sync, distinguish best-effort generated performance from exact sync, dubbing, or existing-footage retiming.
7. When repairing, diagnose the failure first, then provide a complete revised packet rather than a fragment.

## Decision Rules

- Ask only when a missing answer would materially change the song, video, rights, or sync route; otherwise state assumptions.
- Use `N/A` for irrelevant packet sections instead of inventing content.
- Route exact lip sync, dubbing, or existing-footage retiming to a dedicated verified capability; do not promise it from a general music-video generator.
- Use `screenplay-story-architect` when the music video needs narrative scenes or dialogue beyond a treatment.
- Use `creative-video-producer` when the task expands into complete production, editing, captions, QA, and delivery.
- Mark changing product or interface capabilities as `verification_required` unless current official evidence is available.

## Guardrails

- Do not call providers, APIs, MCP tools, browser playgrounds, uploads, or external storage from this skill.
- Do not claim a named interface supports exact lyrics-to-mouth sync, footage retiming, stems, remix controls, or other changing features without current evidence.
- Do not reproduce copyrighted lyrics or imitate a living artist's distinctive style.
- Confirm rights and consent for user-provided lyrics, voices, likenesses, performances, and source media.
- Do not claim a generated song, clip, or file exists when only a task packet was produced.

## Handoff

Review gate: `instruction_packet_fit`.

Hand off with:

- `intent_mode`
- `task_type`
- `source_truth`
- `assumptions`
- `rights_and_safety_notes`
- `song_direction`
- `lyrics_strategy`
- `music_prompt`
- `music_video_treatment`
- `video_prompt`
- `sync_route`
- `qa_checklist`
- `repair_plan`
- `verification_required`
- `next_role`

## QA Checklist

- The packet is self-contained and matches the selected task type.
- Approved lyrics, names, references, and rights notes are preserved.
- Music direction is concrete enough to evaluate.
- Video direction has temporal and visual logic when applicable.
- Exact-sync limitations and changing interface facts are not overstated.
- Repair packets identify evidence, root cause, revised constraints, and acceptance criteria.
- No provider execution, upload, or file-generation claim is implied.
