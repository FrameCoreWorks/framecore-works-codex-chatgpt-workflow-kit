---
name: humanizer
description: Use this skill for specific, audience-aware text polish, copy revision, VO and dialogue cleanup, tone adaptation, and final naturalness review while preserving facts, approved wording, and author authority.
---

# Humanizer

Use this skill to make approved text sound natural, specific, and useful while
preserving facts, required wording, author authority, and workflow locks. It is
an editorial quality layer, not a detector-evasion method or a way to imitate a
living person's writing style.

## When To Use

Use this skill when:

- Draft copy, VO, dialogue, captions, summaries, or delivery notes feel generic, stiff, repetitive, or too AI-like.
- Approved facts must stay intact while rhythm, clarity, and audience fit improve.
- A final user-facing response needs polish without changing the substance.

Do not use this skill to invent claims, rewrite legal text beyond allowed style polish, or bypass copy approval.

## Inputs

Required:

- `source_text`: the draft to polish.
- `locked_facts`: claims, names, numbers, product details, or compliance wording that must remain unchanged.
- `tone_target`: the desired voice, audience, and level of formality.
- `author_context`: confirmed speaker authority, audience, channel, goal, and
  content type.

Optional:

- `exact_copy_locks`: phrases that must remain verbatim.
- `channel_context`: social post, VO, email, delivery summary, landing section, or script.
- `avoid_list`: banned words, cliches, claims, or style habits.
- `controlled_imperfection`: `off` by default; an explicit request or confirmed
  profile is required before a casual, lightly uneven voice is considered.

## Outputs

Produce polished text with:

- clearer rhythm and sentence variety
- concrete language and smoother transitions
- audience-fit tone
- unchanged locked facts and exact required copy
- a compact Human Voice review note when the result is ready to use
- short change notes when useful

## Process

1. Identify the speaker, audience, channel, goal, content type, concrete
   anchor, facts, claims, and wording that must not move.
2. Form a private author kernel only when it can be grounded in known facts;
   never invent a personal observation or stake to make copy sound lived-in.
3. Remove generic phrasing before adding style. Improve rhythm through sentence
   structure, specificity, and useful detail, not unsupported color.
4. Keep hooks, CTAs, headings, lists, emojis, hashtags, questions, and
   presentation-like structure only when the brief, channel, or reader need
   justifies them.
5. Review factual honesty, author/audience fit, copy locks, channel fit,
   controlled-imperfection status, and useful structure before returning a
   ready-to-use result.

## Decision Rules

- If copy is legally or brand locked, only improve surrounding wording.
- If a claim feels weak but unsupported, flag it instead of strengthening it.
- If the text is for a prompt, keep operational precision above literary polish.
- If the user asks for alternatives, keep each variant meaningfully distinct.
- If a missing author or audience fact would materially change the result, ask
  one concise question; otherwise use qualified, honest wording.
- Keep controlled imperfection off unless an explicit request or confirmed
  profile permits it. Never use it in exact copy, formal business email,
  contracts, reports, offers, specifications, safety, legal, medical,
  financial, or compliance text.

## Guardrails

- Do not add unsupported claims, fake testimonials, invented metrics, or new product promises.
- Do not remove compliance wording or exact copy locks.
- Do not change names, numbers, dates, or required terminology without explicit permission.
- Do not make the text sound casual when the user requested restraint.
- Do not fabricate first-hand experience, client conversations, testing,
  testimonials, quotes, metrics, outcomes, emotions, or sources.
- Do not add artificial errors, recurring hesitation, or stylistic mimicry to
  conceal AI involvement.

## Handoff

Review gate: `copy_fit`.

Hand off to `copy-voice`, `image-prompting`, `video-prompting`, or `delivery-documentation` with:

- `polished_text`
- `locked_facts_preserved`
- `tone_notes`
- `copy_locks`
- `open_questions`
- `human_voice_review`
- `controlled_imperfection_status`

## QA Checklist

- Meaning is unchanged unless a change is explicitly requested.
- Required copy and legal wording are preserved.
- Unsupported claims were not added.
- Tone matches the requested audience and channel.
- Unrequested marketing architecture was not added.
- Any controlled imperfection is explicitly allowed, sparse, and safe.
- A final text has an identified author context and does not imply unsupported experience.
- The revised text is complete, not a patch fragment, when used as final output.
