---
name: ecommerce-campaign-strategy-director
description: Use this skill to turn product, service, brand, store, PDP, marketplace, landing-page, paid-social, UGC, or launch briefs into an evidence-aware ecommerce campaign strategy before creative direction, prompting, generation, or delivery.
---

# Ecommerce Campaign Strategy Director

Use this skill to connect product and offer truth to a practical creative campaign plan. It owns strategy and downstream handoff fields, not prompt writing or media execution.

## When To Use

Use this skill when:

- A product, service, online store, PDP, marketplace listing, landing page, or launch needs a campaign route.
- The user needs audience framing, creative angles, an asset matrix, or a testing plan before production.
- Static, motion, UGC, copy, and prompt work need one shared source of truth.

Use a narrower prompting skill when the strategy, claims, audience, channel, and asset role are already locked.

## Inputs

Required:

- `product_or_service_truth`: what is being sold and which facts are confirmed.
- `objective`: launch, conversion, education, retargeting, listing clarity, or another measurable purpose.
- `audience`: known segment, job to be done, trigger, objection, or best available assumption.

Optional:

- offer, price, promotion, proof, approved claims, disclaimers, channels, formats, source assets, references, brand constraints, and prior performance evidence.

## Outputs

Produce an Ecommerce Campaign Strategy Pack containing:

- assumptions and missing evidence
- product and offer truth
- audience / JTBD snapshot
- campaign thesis and creative angles
- channel and asset matrix
- creative testing plan
- copy and claim ledger
- static, motion, UGC, storyboard, and prompt handoffs
- risks, approvals, QA gates, and next action

Use `templates/ecommerce-campaign-strategy-pack.md` for standard or full plans.

## Process

1. Separate confirmed product facts, offer facts, user claims, assumptions, and unknowns.
2. Define the audience trigger, desired progress, objection, anxiety, and proof need.
3. Write one campaign thesis, then derive three to five materially different creative angles.
4. Build a channel and asset matrix with one business role for every proposed asset.
5. Define the first test batch: hypothesis, fixed variables, tested variable, success signal, and failure meaning.
6. Build a claim ledger and remove unsupported proof, testimonials, certifications, or performance promises.
7. Prepare bounded handoffs for the roles and skills that will produce direction, copy, storyboards, prompts, QA, and delivery.

## Decision Rules

- Prefer one clear campaign thesis over a list of unrelated concepts.
- Vary one meaningful creative axis at a time in the first test batch.
- Use `commercial-visual-campaign-director` for static direction and `commercial-video-campaign-director` for motion direction.
- Use `ugc` and `humanizer` for creator scripts, proof framing, VO, supers, and CTAs.
- Use `image-prompt-architect` or `video-prompt-architect` only after product truth, claims, asset role, and acceptance criteria are stable.
- If a user asks for a single prompt and strategy is already complete, hand off instead of expanding the plan.

## Guardrails

- Planning is provider-neutral and does not activate generation, API calls, uploads, publishing, or external tools.
- Do not invent claims, reviews, certifications, test results, scarcity, endorsements, or customer evidence.
- Keep private sales data, customer data, credentials, and unpublished client context out of public artifacts.
- Preserve packaging, product count, logos, approved copy, and material details as explicit fidelity locks.
- Static raster work with visible text follows the kit's native one-pass text-image policy when generation is explicitly requested and available.

## Handoff

Review gate: `direction_fit` before creative production begins.

Hand off with:

- `product_offer_truth`
- `audience_jtbd`
- `campaign_thesis`
- `creative_angles`
- `channel_asset_matrix`
- `test_hypotheses`
- `claim_ledger`
- `source_asset_roles`
- `copy_requirements`
- `fidelity_locks`
- `qa_observables`
- `blocked_items`
- `next_role`

## QA Checklist

- Every asset has a channel, business role, message, proof need, and acceptance criterion.
- Product and offer facts are separated from assumptions.
- Claims are sourced, observable, user-approved, or removed.
- Creative angles are meaningfully different and testable.
- The first test batch does not change several strategic variables at once.
- Downstream roles can act without reconstructing the strategy.
- No provider execution or upload is implied.
