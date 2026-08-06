# Human Voice And Copy Delivery

## Purpose

This reference defines the public Human Voice policy for ready-to-use text in
this kit. It supports clear, specific, audience-aware writing while protecting
facts, exact copy, user authority, accessibility, and useful structure.

It is an editorial quality policy. It is not a detector-evasion method, a
claim of human authorship, a persona-imitation system, or permission to invent
experience, evidence, testimonials, quotes, outcomes, or user history.

## Scope And Ownership

- `copy-voice` owns Copy Pack decisions and ready-to-use text delivery.
- `humanizer` owns naturalness, specificity, rhythm, and final voice polish.
- `research-evidence` owns evidence boundaries, freshness, and uncertainty.
- `output-critic-iteration` owns evidence-backed critique and loopback.
- `pipeline-core` owns routing, the existing Loop Protocol, iteration budget,
  and stop decision.

No new permanent role or parallel loop is created by this policy.

## Situation Recognition

Before creating or substantially revising user-facing text, record:

- who is speaking and what authority they actually have;
- audience, channel, context, and content type;
- the real goal and the expected reader action, if any;
- confirmed facts, exact copy locks, claims, and uncertainty;
- one concrete observation, proof point, stake, limitation, question, or
  friction point that the text may honestly use.

Use a private working kernel when it helps:

```text
The author wants to tell [audience] [what they noticed, want, or disagree with]
because [specific reason or stake].
```

The kernel is not a claim and need not be returned. If it cannot be completed
without inventing a material fact, ask at most one route-changing question or
write an honest, qualified draft from known information.

## Format-Sensitive Rules

- **Social post:** use ordinary paragraphs by default. Do not assume a hook,
  question,
  isolated line, list, CTA, emoji, or hashtag needs a content or channel reason.
- **Comment:** respond to a specific point. Do not turn it into a mini-article,
  generic praise opener, or automatic CTA.
- **Email:** state the purpose, appropriate formality, and a next step when one
  is needed. Avoid corporate filler and fabricated casual familiarity.
- **Caption or description:** add context, a useful detail, or a point of view;
  do not merely repeat the visible image. Respect timing and safe-zone locks.
- **Dialogue, VO, subtitle, or super:** preserve speaker knowledge, motivation,
  timing, exact copy, and screen-space constraints. Do not rewrite locked text
  silently.
- **Offer, report, specification, documentation, legal text, safety
  instruction, or formal communication:** retain headings, lists, precision,
  and required phrasing when they improve usability or compliance.

## High-Risk Patterns

Patterns such as contrast formulas, generic conclusions, audience questions,
perfect triads, repeated short isolated lines, or a problem-to-solution CTA
sequence are not forbidden. Before using one, check whether it fits the author,
adds information, and improves this channel. More than one such pattern needs
a recorded channel or goal-based reason.

## Truth And Author Boundaries

Do not imply that an author spoke to clients, tested something, saw an event,
received messages, has years of experience, or felt a specific emotion unless
the user supplied that fact for this task. Use neutral phrasing or an explicitly
framed opinion when first-hand experience is unavailable.

Never add a source, testimonial, quote, metric, result, guarantee, or promise
that is not user-provided, verified, or clearly marked as unresolved.

## Controlled Imperfection

Default: `off`.

Enable it only when the user explicitly requests a raw, spontaneous, casual,
or less-polished voice, or a confirmed author profile supports it; the channel
permits it; and accuracy, respect, exact copy, safety, and compliance remain
intact.

Use zero to two appropriate elements in a short text: uneven sentence rhythm,
an ellipsis, a brief self-correction, a colloquial phrase consistent with the
confirmed voice, or mild hesitation. One harmless typo is allowed only when
the user explicitly asks for an unpolished draft.

Never enable controlled imperfection for contracts, offers, reports,
specifications, documentation, safety instructions, legal, medical, financial,
or compliance content, formal business email, exact visible text, product
facts, dates, amounts, names, prices, or claims. Never use it as a recurring
pattern or to deceive a reader.

## Mandatory Copy Delivery Loop

For ready-to-use text created or substantially revised by a covered writing
skill, apply the existing Loop Protocol with this bounded sequence:

```text
draft -> deep review -> revision -> final QA -> delivery
```

The Copy Pack records `author_context`, `fact_and_lock_ledger`,
`human_voice_review`, and `copy_delivery_loop`. A ready-to-use package needs
at least one review-and-revision cycle, evidence, root cause, repair target,
regression check, and one existing stop decision. Default maximum: three iterations.
Rerun only for a material diagnosed issue.

The internal review checks brief fit, author and audience fit, factual honesty,
claim and lock preservation, channel fit, unnecessary polish or marketing
architecture, controlled imperfection, and media text constraints. Do not show
internal loop traces in ordinary delivery unless the user asks for editorial
notes or QA evidence.

## Related References

- `humanizer-routing.md`
- `loop-protocol.md`
- `handoff-matrix.md`
- `creative-prompting-standard.md`
