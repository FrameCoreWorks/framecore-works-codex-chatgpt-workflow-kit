# Human Voice And Copy Delivery

## Purpose

This guide explains how the kit creates and reviews ready-to-use copy without
inventing an author's experience or forcing every text into the same marketing
shape. It applies to Copy Packs, captions, subtitles, VO, dialogue, supers,
delivery summaries, emails, comments, and social writing when those outputs
need final editorial review.

The workflow does not try to conceal AI involvement or evade detectors. It
keeps the user responsible for the facts, voice preferences, and approval of
the final text.

## What The Workflow Does

Before writing, it identifies the speaker, audience, channel, purpose,
confirmed facts, exact wording, and one concrete point that can make the text
useful. It does not automatically add a hook, CTA, list, heading, emoji,
hashtag, or question.

`copy-voice` owns the Copy Pack. `humanizer` improves naturalness and rhythm
without changing facts. `research-evidence` checks claims when evidence
matters. `output-critic-iteration` diagnoses material failures. `pipeline-core`
uses the existing Loop Protocol to keep the final editorial pass bounded.

## Delivery Loop

Ready-to-use copy follows:

```text
draft -> deep review -> revision -> final QA -> delivery
```

At least one review-and-revision cycle is required. The default maximum is
three iterations. The loop stops with `stop_sufficient`, `patch_one_gap`,
`ask_user`, or `blocked`; it does not continue for speculative polish.

The final Copy Pack records author context, fact and copy locks, Human Voice
review, root cause when a repair was needed, a regression check, and the stop
decision. Drafts can remain drafts without this delivery record.

## Channel And Structure

Structure is a tool, not a default personality. A sales page, offer,
specification, safety instruction, or accessible email can need headings,
lists, a clear action, or exact wording. A comment or social post may work
better as ordinary paragraphs. The review asks whether each structural choice
helps the reader, channel, and goal.

For captions, subtitles, VO, dialogue, and supers, wording remains subject to
timing, speaker, exact-copy, screen-space, and accessibility constraints.
Changing the wording requires the same truth and copy-lock checks as any other
final text.

## Truth And Voice

The workflow never fabricates a testimonial, quote, metric, result, source,
personal observation, client conversation, test, or emotional reaction. When a
claim is unresolved, it is softened, labeled for approval, or routed to
evidence review.

Controlled imperfection is off by default. A short casual comment may use a
small amount of uneven rhythm or a self-correction only when the user requested
that voice or a confirmed profile supports it. It is never used to alter facts,
exact visible text, names, dates, amounts, legal wording, safety guidance, or
formal communication.

## Evidence Basis And Limits

The policy uses the sources below as supporting evidence, not as a universal
style prescription. Their contexts vary across languages, audiences, and
content types.

| ID | Domain | Source | Type | Supports | Limitation | Decision |
| --- | --- | --- | --- | --- | --- | --- |
| HV-01 | Author control | [Interaction-required co-writing](https://aclanthology.org/2025.in2writing-1.6/) | peer-reviewed workshop paper | human involvement and fine-grained control | small case study | require explicit author context and bounded review rather than hidden imitation |
| HV-02 | Personalization | [GhostWriter](https://arxiv.org/abs/2402.08855) | research preprint | personalization benefits from agency and editable signals | limited participant study | keep preferences user-controlled and provisional |
| HV-03 | Intent | [Intent-Guided Authoring Assistant](https://aclanthology.org/2021.emnlp-main.483/) | peer-reviewed paper | fine-grained author intent can guide revision | model-specific evaluation | record channel, goal, and constraints before drafting |
| HV-04 | Factual risk | [NIST Generative AI Profile](https://tsapps.nist.gov/publication/get_pdf.cfm?pub_id=958388) | government standard | plausible generated content can be false or inconsistent | risk guidance, not writing style guidance | retain fact, claim, and uncertainty review |
| HV-05 | English clarity | [GOV.UK clear language guidance](https://guidance.publishing.service.gov.uk/writing-to-gov-uk-standards/writing-guidelines/clear-language/) | official content standard | clarity and structure depend on readers and task | public-service context | make structure conditional, not forbidden |
| HV-06 | Polish clarity | [Polish plain-language guidance](https://www.gov.pl/web/cyfryzacja/prosty-jezyk) | official public guidance | accessible writing depends on audience and language | public-service context | preserve Polish-specific language and audience checks |
| HV-07 | Email | [GOV.UK email guidance](https://www.gov.uk/service-manual/design/sending-emails-and-text-messages) | official content standard | purpose, relevance, concise action, and trust matter | transactional-email context | require purpose and appropriate next step for email |
| HV-08 | Social context | [ONS social media guidance](https://service-manual.ons.gov.uk/content/content-types/social-media) | official style guide | tone and format vary by channel | institutional social-media context | do not auto-apply hooks, hashtags, or CTA |
| HV-09 | Captions | [W3C captions guidance](https://www.w3.org/WAI/media/av/captions/) | accessibility standard | captions need accurate synchronized audio information | web-media scope | preserve timing, wording, and speaker constraints |
| HV-10 | Media text | [W3C audio and video content guidance](https://www.w3.org/WAI/media/av/av-content/) | accessibility guidance | clear language and timing aid media comprehension | accessibility guidance, not copywriting formula | keep caption and VO constraints explicit |
| HV-11 | Local linting | [Vale](https://github.com/vale-cli/vale) | maintained open-source tool, MIT | style rules can be automated locally | primarily prose/document linting; language coverage varies | no dependency is bundled; optional tools cannot replace editorial judgment |

## Research Log

| Domain | Sources reviewed | Used | Rejected or not adopted | Reason |
| --- | --- | --- | --- | --- |
| Author voice and control | ACL, arXiv co-writing studies | HV-01 to HV-03 | named-style imitation systems | the kit must not imitate a living person or infer private identity |
| Factual accountability | NIST and writing-assistant studies | HV-04 | detector-evasion material | conflicts with truthful authorship and safety boundaries |
| English and Polish clarity | GOV.UK and Polish public-language guidance | HV-05 to HV-07 | numeric readability thresholds as global rules | language, audience, and channel vary |
| Social and formal communication | ONS and GOV.UK guidance | HV-07 to HV-08 | universal CTA or hook formulas | valid only for a confirmed channel and goal |
| Captions and screen text | W3C guidance | HV-09 to HV-10 | automatic rewrite of locked subtitles | timing, exact copy, and accessibility can constrain wording |
| Local tools | Vale and public rule sets | HV-11 | package integration | would add dependencies and cannot judge truth, authority, or channel context |

## Related Docs

- [Artifact Schemas](artifact-schemas.md)
- [Workflow Stages](workflow-stages.md)
- [Creative Prompting Workflow](creative-prompting-workflow.md)
- [Using The Kit](using-the-kit.md)
