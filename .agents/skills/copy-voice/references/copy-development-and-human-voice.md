# Copy Development and Human Voice

Adapted for the existing Workflow Kit role. Source: FrameCore Works,
Static Graphic Design Creator, Apache-2.0, commit
`c3cbdf766411ca7e1131bc034bfa74ebad2efe71`. Ownership and links were
adapted; upstream standalone activation, installation and execution are not imported.

This is the static-graphic copy reference of the existing copy-voice skill. Develop the message, wording, rhythm and credible human voice together. Use the existing copy-voice ownership and Human Voice review. Complete naturalness edits before selection; humanizer must preserve all selected wording. Use it for missing wording, new headlines, support lines, CTAs, integrated graphic text, authorized refinement and copy critique. Preserve the scope of a copy-only question.

## Establish the thesis and truth

Resolve the communication objective, audience response, reading context and source-specific tension before writing. Identify the product/event truth, required phrases, prohibited claims, speaker, audience relationship and language. Use one material question when needed; otherwise work from known facts and mark gaps as Unknown. Do not invent benefits, prices, urgency, statistics, testimonials, personal experiences, affiliations, legal claims or historical details.

Separate copy authority from factual verification. A source-approved sentence is locked wording, not automatic evidence that its claim is true. For a disputed or unsupported material claim, preserve the supplied text for review, explain the issue and obtain a verified or approved bounded alternative before treating it as final. Do not silently rewrite it or label user assertions independently verified.

## Choose the route

| Route | Behavior |
| --- | --- |
| `no_copy` | Only when a graphic is deliberately text-free; selection is `not_required` and items are empty. Missing copy in a text-led brief triggers discovery instead. |
| `locked_copy` | Preserve all supplied final strings, including spelling and punctuation. Offer a correction only when useful; do not apply it silently. |
| `copy_discovery` | Develop distinct message routes from source truth and the concept. Present candidates and wait for selection before final prompt compilation or rendering. |
| `copy_refinement` | Preserve facts, required phrases, speaker and intended action. Show materially different revisions or the one narrow requested correction. Preserve the original until a replacement is chosen or explicitly supplied by the user. |

A specific instruction such as replacing one supplied word with another already authorizes that replacement; do not request it again. Broad permission to improve copy authorizes drafting, not selection of an unreviewed assistant-created slogan. Keep selection state (`draft`, `needs_selection`, `selected`, `locked`, `not_required`) separate from `feasibility.status` (`not_assessed`, `compact`, `at_risk`, `dtp_required`).

## Develop routes with the visual concept

Use concept development (the `static-direction` handoff) when the mechanism is also open. Prefer two to four paired directions, unless another count is requested, over independent copy/style menus. Each candidate should identify its message thesis, headline, only useful support/CTA, proposed hierarchy, relationship to the image and one reason it fits the audience and format.

Change the argument or communicative mechanism between routes: observation, consequence, useful contrast, invitation, demonstration or perspective. Synonyms and changes in enthusiasm do not create different routes. If the image already demonstrates something, the line should add a reason, interpretation or action instead of merely describing the picture. If the headline is the visual event, let form enact its meaning without adding redundant imagery.

## Anti-generic standard

Prefer a precise observation, concrete object, place, behavior, consequence or contrast grounded in this brief. Avoid empty praise, interchangeable superlatives, generic motivational promises, fake urgency, unsupported outcomes, forced intimacy and fashionable filler. A plain useful CTA can be correct; not every line needs a clever turn.

Before recommending a route, check:

1. **Substitution:** would the whole line/image combination fit an unrelated offer with only its name changed? Identify the source-specific anchor.
2. **Contribution:** does each support line add information or meaning? Remove paraphrases of the headline.
3. **Truth:** which claim does each factual phrase make, and what supports it? Unknown evidence is not a licence to imply a benefit.
4. **Voice:** could this speaker naturally say this to this audience? Avoid fake slang, bureaucratic padding, slogans written as press releases and artificial emotional closeness.
5. **Rhythm:** read it aloud mentally; remove unnecessary connectors, stacked abstractions and accidental repetition. Vary cadence only for a reason.
6. **Visual fit:** does the word count, line-break rhythm and tone work with the selected mechanism and attention order?
7. **Action:** is the CTA specific and proportionate, with no invented deadline or pressure?

These are editorial judgments, not a prohibited-word detector or a guarantee of conversion. Do not imitate a living writer's signature voice, insert mistakes to seem human, or optimize for evading AI detectors. Natural voice means accurate intent, credible distance, clear verbs and a rhythm suited to the medium.

## Polish and multilingual copy

Write naturally in the requested language; do not translate English slogan structures mechanically. Preserve Polish diacritics, case, inflection, decimal separators, units and user-locked punctuation. For multilingual work, record language per text item and keep translations separate until approved. A shorter translation is a new candidate if it changes meaning. Preserve names and product terms unless localization is explicitly authorized. Expressive lettering never justifies losing functional information.

## Selection and final lock

Perform the human-voice review before presenting the final candidates for selection. When the user selects or combines wording, show the exact resulting line if the combination requires fresh editing. Apply only explicit changes; a later editorial improvement that changes selected words returns that item to `needs_selection`. Do not quietly humanize an approved line during layout or prompt compilation.

Store selected content in the existing Copy Pack's exact-text inventory. The optional static-design preflight notes call this inventory `copy.items`; that notation does not replace the Copy Pack or create another schema. Each item has a stable ID, exact text, language, hierarchy role, required flag, authority, source and line-break/change permissions. Record claims separately with their supporting source and affected item IDs. A mix of user-locked date, source-locked legal wording and newly selected headline is normal; never replace it with one global authority label.

Draft alternatives belong in `copy.options`; they are not additional visible strings. Only selected/locked items enter a final prompt. Keep requiredness independent of hierarchy: metadata can be mandatory. Do not drop credits, price qualifiers, contacts or legal text to make a design fit. Route feasibility problems to DTP or request a specific approved scope change.

## Calibration: weak, useful and risky

Fictional book exchange with no fee:

| Candidate | Assessment | Next action |
| --- | --- | --- |
| 'Odkryj świat niezwykłych możliwości' | Abstract and interchangeable; no exchange-specific observation | Reject and return to the thesis |
| 'Twój regał zna już zakończenie.' | Reader observation; an outgoing book can carry the exchange mechanism | Offer with a plain explanatory support line |
| 'Przeczytane u Ciebie. Nowe dla kogoś.' | Perspective shift; image can connect two reading contexts | Offer as a distinct route |
| 'Oddaj jedną historię. Zabierz następną.' | Clear action with parallel rhythm; less indirect | Offer when immediate comprehension matters |
| 'Największa wymiana książek w mieście' | Unverified comparative claim | Do not use without evidence |

A refinement request for 'Profesjonalna jakość, której możesz zaufać' should uncover what the service actually does differently. If that evidence is absent, ask for one useful fact or write a concrete service/action line from the supplied facts; do not invent 'w 24 godziny'. A headline can be polished and still fail the brief. Explain the mismatch, not just which wording sounds better.

For a user-locked 'WSTĘP WOLNY', keep the string. Do not change it to 'Wejdź za darmo' to sound more conversational. For a factual event title plus date and venue, additional slogan-writing may be unnecessary.

## Stop conditions

Stop at critique or candidates when that is the requested deliverable. Stop before final prompting/rendering while assistant-written copy is unselected, a critical claim is unresolved or a locked string is in conflict. After selection, pass only the exact text and evidence to design. Recommend further copy iterations only for a specific remaining gap; do not generate more alternatives to fill an arbitrary quota.
