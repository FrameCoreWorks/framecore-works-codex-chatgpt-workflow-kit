---
name: image-prompt-architect
description: Use this skill to create final provider-neutral image prompt packs from approved brief, references, direction, and copy.
---

# Image Prompt Architect

Use this skill to create final provider-neutral image prompt packs from approved brief, references, direction, and copy. It prepares prompts for review or user-selected execution, but it does not execute generation.

## When To Use

Use this skill when:

- Direction, references, and copy are ready to become generator-ready image instructions.
- A static campaign, ecommerce visual, product image, storyboard board, poster, banner, or social graphic needs a prompt pack.
- Visible text must be included in a raster graphic with exact copy and layout constraints.

Do not use this skill to invent missing strategy, approve outputs, or run generation.

## Inputs

Required:

- `brief_contract`: objective, audience, deliverables, and constraints.
- `reference_pack`: source authority, continuity anchors, and suppression rules.
- `direction_contract`: visual thesis, composition, subject governance, and variant needs.

Optional:

- `copy_pack`: exact copy, hierarchy, CTA, labels, or legal text.
- `asset_manifest`: approved source files or excluded assets.
- `qa_requirements`: expected observables and acceptance criteria.
- `target_generator_profile`: verified task modes, prompt fields, and negative handling for the selected surface.
- `reference_roles`: which attached image, mask, board, or source asset controls identity, composition, style, or edit scope.

## Outputs

Produce an Image Prompt Pack with:

- final prompt or variant prompts
- visual constraints and composition notes
- exact copy and text layout requirements when text appears
- generator format contract and task mode
- constraint and suppression ledger, formatted for the selected generator rather than emitted as a universal negative prompt
- reference roles and continuity status for multi-image sets
- expected observables
- QA checks and loopback guidance

## Process

1. Confirm brief, references, and direction are approved enough to prompt.
2. Preserve exact copy and hierarchy when visible text is required.
3. Resolve the target generator, task mode, field shape, and negative handling. If unresolved, mark generator-specific formatting as pending.
4. Convert direction into concrete subject, composition, lighting, style, and constraint language.
5. For image sets, classify each request and bind strict continuity locks to references attached to that request.
6. Include expected observables that QA can check.
7. Keep execution separate from prompt authoring.

## Decision Rules

- If direction is missing, route to `static-direction`.
- If copy is required but not locked, route to `copy-voice` or label the prompt as provisional.
- For generated static raster graphics, require the native Codex/ChatGPT GPT Image 2 path by default when available.
- For raster graphics with visible text, require the native Codex/ChatGPT GPT Image 2 path in one pass when available.
- If copy is too long for clean generated text, recommend shortening before generation rather than later overlays.
- Do not output a separate negative-prompt field unless the verified target surface exposes one. Keep constraints integrated or minimal as its profile requires.
- If a separate image request lacks a required continuity carrier, label continuity approximate or route upstream for a reference sheet, keyframe, or source asset.

## Guardrails

- Do not execute generation, choose paid external tools, or publish outputs.
- Do not substitute Python-generated artwork, SVG, HTML/canvas, Sharp/composited PNG, or coded artwork unless the user explicitly asked for coded or vector artwork.
- Do not add text later with overlays for static raster graphics unless the user explicitly asked for coded or vector artwork.
- Do not invent claims, logos, product facts, or private references.
- Do not remove suppression rules from the reference pack.
- Do not imply that prose such as `same character` or a repeated seed creates strict continuity across separate requests.

## Handoff

Review gate: `promptability_fit`.

Hand off to `tool-routing-cost` or `qa-iteration` with:

- `prompt_pack`
- `asset_requirements`
- `copy_locks`
- `prompt_format_contract`
- `reference_roles`
- `continuity_status`
- `expected_observables`
- `acceptance_criteria`

## QA Checklist

- Prompt follows approved brief, references, and direction.
- Exact text is included when required.
- Constraint handling matches the resolved generator profile or is explicitly unresolved.
- Every strict cross-image lock has a continuity carrier attached to the relevant request.
- Expected observables are testable.
- Execution remains separate from prompt authoring.
