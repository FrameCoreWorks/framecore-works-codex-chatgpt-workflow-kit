---
name: commercial-visual-campaign-director
description: Create provider-neutral static direction for campaigns, posters, covers, flyers, menus, cards, labels and product visuals, with concept, copy hierarchy, typography constraints and asset variants. Use for direction, not final prompts or generation.
---

# Commercial Visual Campaign Director

Use this skill to create static campaign direction for ecommerce, launch, social, product, and promotional visuals before final image prompts or production boards are written.

## Language Policy

Public instructions and installation guidance stay in English. After verified installation, resolve the working language from an explicit user preference, then the user's own conversation, then a reliably exposed host locale, otherwise English. Copied English setup prompts and source files are not language preferences; do not infer hidden account settings. Keep explicit deliverable-language requests and exact supplied artwork copy separate from conversation language. Do not translate or rewrite public source files to localize a session.

## When To Use

Use this skill when:

- The user needs a visual campaign system rather than a single prompt.
- Product, offer, subject, or brand readability must be controlled across variants.
- Direction is needed for social graphics, ecommerce images, launch kits, or static boards.
- A single poster, cover, flyer, menu, card or label needs a concept or visual direction.

For these graphics, read [static graphic direction](references/static-design-direction.md)
and only the relevant atlas or deliverable profile it points to. Optional poster
codes are integrated reference data, not another skill or an installation step.

Do not use this skill to write final generator-ready prompts, execute tools, or approve delivery.

## Inputs

Required:

- `brief_contract`: goal, audience, deliverables, and constraints.
- `reference_pack`: canonical sources, visual references, suppression rules, and continuity anchors.
- `offer_or_subject`: what must be clear in the final visuals.

Optional:

- `copy_pack`: headlines, CTA, legal copy, or text hierarchy.
- `asset_inventory`: existing product images, brand assets, or source files.
- `rollout_needs`: formats, placements, aspect ratios, or variant count.

## Outputs

Produce a Static Direction Contract with:

- visual thesis and audience fit
- product or subject governance
- composition system and hierarchy rules
- asset matrix and rollout variants
- text-bearing graphic requirements when relevant
- selected Core Concept Lock, reading mode, type/image roles and production intent
- prompt handoff constraints for `image-prompting`

## Process

1. Define what the viewer must understand first.
2. Convert references into rules for composition, lighting, subject treatment, and variation.
3. Separate locked visual requirements from optional style cues.
4. Map the required asset variants and their differences.
5. Hand off only after direction can be evaluated against the brief.

For open concepts, develop paired visual/copy routes with `copy-voice` and
preserve the selected premise and permitted adaptations. Directed work skips
new alternatives. Advice, copy-only and prompt-only requests keep their scope.

## Decision Rules

- Optimize for clarity of product, offer, or subject before decorative style.
- Use variants to serve placement differences, not to explore unrelated directions.
- If visible text is required, preserve exact copy and hierarchy for downstream prompt work.
- If references conflict, keep canonical sources and document the suppressed cue.

## Guardrails

- Do not invent product facts, claims, logos, or private brand rules.
- Do not execute generation or choose external providers.
- Do not produce final prompts when `image-prompting` owns that output.
- Do not weaken text readability requirements for raster graphics.

## Handoff

Review gate: `direction_fit`.

Hand off to `image-prompting` or `copy-voice` with:

- `direction_contract`
- `prompt_constraints`
- `copy_requirements`
- `asset_matrix`
- `suppression_rules`

## QA Checklist

- Visual thesis fits objective, audience, and offer.
- Asset matrix matches requested formats.
- Product or subject governance is concrete.
- Text-bearing requirements are explicit when needed.
- The handoff does not contain final prompt execution steps.
