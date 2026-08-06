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
- a revisioned Creative Prompt Contract when the work has strict locks, visible text, an edit delta, target adaptation, or execution-readiness needs
- expected observables
- QA checks and loopback guidance

## Process

1. Confirm brief, references, and direction are approved enough to prompt.
2. Preserve exact copy and hierarchy when visible text is required.
3. Resolve the target generator, task mode, field shape, and negative handling. If unresolved, mark generator-specific formatting as pending.
4. Convert direction into a compact image scene: subject, current state, setting, lighting, composition, and finish.
5. For visible text, lock exact copy, hierarchy, safe area, maximum text units, and a correction path before finalizing the prompt.
6. For an edit, record the source alias, bounded requested changes, preservation locks, excluded changes, and comparison observables.
7. For image sets, classify each request and bind strict continuity locks to references attached to that request.
8. Include expected observables that QA can check.
7. Keep execution separate from prompt authoring.

## Decision Rules

- If direction is missing, route to `static-direction`.
- If copy is required but not locked, route to `copy-voice` or label the prompt as provisional.
- For generated static raster graphics, require the native Codex/ChatGPT GPT Image 2 path by default when available.
- For raster graphics with visible text, require the native Codex/ChatGPT GPT Image 2 path in one pass when available.
- If copy is too long for clean generated text, recommend shortening before generation rather than later overlays.
- Do not output a separate negative-prompt field unless the verified target surface exposes one. Keep constraints integrated or minimal as its profile requires.
- If a separate image request lacks a required continuity carrier, label continuity approximate or route upstream for a reference sheet, keyframe, or source asset.
- If target-specific syntax is requested, require a current official-source check for the selected surface. Otherwise keep the contract portable.
- Use a new contract revision when locked prompt meaning changes. Do not rewrite a reviewed contract in place.

## Guardrails

- Do not execute generation, choose paid external tools, or publish outputs.
- Do not substitute Python-generated artwork, SVG, HTML/canvas, Sharp/composited PNG, or coded artwork unless the user explicitly asked for coded or vector artwork.
- Do not add text later with overlays for static raster graphics unless the user explicitly asked for coded or vector artwork.
- Do not invent claims, logos, product facts, or private references.
- Do not remove suppression rules from the reference pack.
- Do not imply that prose such as `same character` or a repeated seed creates strict continuity across separate requests.
- Do not treat a style reference as authority over product identity, exact copy, or edit preservation unless its control ownership says so.

## Handoff

Review gate: `promptability_fit`.

Hand off to `tool-routing-cost` or `qa-iteration` with:

- `prompt_pack`
- `asset_requirements`
- `copy_locks`
- `prompt_format_contract`
- `creative_prompt_contract`, revision, and content checksum when used
- `reference_roles`
- `attachment_plan`
- `continuity_status`
- `expected_observables`
- `acceptance_criteria`

## QA Checklist

- Prompt follows approved brief, references, and direction.
- Exact text is included when required.
- Constraint handling matches the resolved generator profile or is explicitly unresolved.
- Every strict cross-image lock has a continuity carrier attached to the relevant request.
- Visible text has exact copy, hierarchy, safe area, and correction path.
- An edit delta preserves named locks and has comparison observables.
- Expected observables are testable.
- Execution remains separate from prompt authoring.
