---
name: copy-voice
description: Produce or refine campaign copy, voice, captions, supers, dialogue, and final text while preserving locked facts, claims, language, and delivery constraints.
---

# Copy Voice

## When To Use

Use this skill when the workflow needs written copy, voice, captions, supers,
dialogue, product text, campaign lines, CTA variants, or tone polish. Use it
after the brief, audience, claim boundaries, and output format are clear enough
to write without inventing missing facts.

## Inputs

- Brief, audience, platform, format, language, and desired tone.
- Locked facts, product claims, offer terms, disclaimers, and banned wording.
- Existing copy drafts, hooks, scripts, VO, captions, subtitles, or supers.
- Timing, placement, safe-zone, character-count, or variant requirements.
- Handoff target such as prompt pack, storyboard, campaign asset, captions, or
  delivery notes.

## Outputs

- A Copy Pack with final or draft copy grouped by use case.
- Optional variants by audience, platform, length, tone, or funnel stage.
- Claim ledger notes for factual statements that need evidence or approval.
- Handoff notes for `image-prompting`, `video-prompting`,
  `hyperframes-producer`, `caption-studio`, `qa-iteration`, or
  `delivery-documentation`.

## Process

1. Identify the exact output type and where the copy will appear.
2. Separate locked facts from creative phrasing before writing.
3. Write the smallest useful set of copy variants.
4. Keep platform, timing, and visual placement constraints visible.
5. Route factual uncertainty to `research-evidence` instead of inventing proof.
6. Use `humanizer` only when the draft needs naturalness or voice polish.
7. Prepare final handoff notes that preserve exact visible text where required.

## Decision Rules

- If copy contains public facts, statistics, certifications, pricing, or legal
  claims, require an evidence check before final delivery.
- If the user asks for many variants, make a compact matrix instead of a long
  unstructured list.
- If copy will be visible inside a generated image or video prompt, mark exact
  visible text and do not allow later silent rewriting.
- If the brand voice is unknown, ask for a short preference or infer cautiously
  from approved examples.

## Guardrails

- Do not invent product claims, offer terms, social proof, awards,
  certifications, medical/legal/financial claims, or customer quotes.
- Do not add provider execution, upload, API-key, or paid-tool instructions.
- Do not override source language unless the user asks for translation.
- Do not hide uncertainty; label copy that depends on missing evidence.
- Keep private names, links, and client details out of public examples.

## Handoff

Review gate: `copy_fit`.

Send the Copy Pack to `qa-iteration` for review when facts, exact visible text,
brand tone, or compliance matter. Hand off approved copy to
`image-prompting`, `video-prompting`, `storyboard-board-architect`,
`hyperframes-producer`, `caption-studio`, or `delivery-documentation`
depending on the next artifact.

## QA Checklist

- Copy matches the brief, audience, language, and platform.
- Locked facts and required wording are preserved.
- Claims are either sourced, user-provided, or clearly marked for approval.
- Exact visible text is isolated for image, storyboard, video, or caption use.
- Variants are meaningfully different and not redundant filler.
- Handoff target and next review gate are clear.
