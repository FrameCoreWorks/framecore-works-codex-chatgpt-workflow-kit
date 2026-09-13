# Integrated Static Graphic Design

Static Graphic Design Creator's domain knowledge is merged into the existing
Workflow Kit assets. The public inventory stays at 35 skills and 20 role
templates. There is no separate static-design skill, bundle, installer,
submodule, package dependency or second orchestrator.

## Ownership

| Existing skill / role | Integrated responsibility |
| --- | --- |
| `commercial-visual-campaign-director` / `static-direction` | Objective-first concepts, Core Concept Lock, deliverable profiles, composition/style/production atlases and the optional 200-code catalog |
| `copy-voice` | Paired concept/copy routes, exact item-level wording, selected versus draft copy, claims and Human Voice review |
| `reference-pack-curator` / `reference-curator` | Per-property authority for identity, apparent age, product, garment, packaging, logo and current edit source |
| `image-prompt-architect` / `image-prompting` | Eight construction priorities inside one prompt, typography feasibility, native-capability boundaries and narrow edit preservation |
| `output-critic-iteration` / `qa-iteration` | Actual-file review, exact-text and source checks, material artifact diagnosis, bounded repairs and DTP escalation |
| `asset-manifest` | Explicitly requested component inventories, selected versions, dependencies and assembly/delivery handoffs |

The same role-skill map, gates, Creative Prompt Contract, Copy Pack, reference
pack, QA report and delivery allowlist remain authoritative. Planning notation
in the adapted atlases maps into those artifacts; it is not another global
schema. Existing `pipeline-core` routing and the direction/prompt/QA agent
templates point to the integrated references.

## Use the smallest route

For a complete prompt brief, use `image-prompt-architect` directly. For open
concepts or direction, use `commercial-visual-campaign-director`; involve
`copy-voice` only where wording is open. Ask a question or request copy alone
without starting production. Existing approved decisions carry forward.

Examples:

```text
Develop three distinct visual mechanisms for a book-exchange poster.
Keep the supplied event wording unchanged. Stop at concepts.
```

```text
Write one poster prompt with only the exact word CISZA and abundant white
space. No pictorial subject, extra copy or image generation.
```

```text
Review this generated label against the supplied product image and copy.
Check the continuous label boundary and all required text. Propose only the
smallest correction needed.
```

`/codes` or `/kody` can request the full grouped catalog inside a static-design
context. Exact names and EP IDs are optional lookup aids, not native generator
commands. Ordinary briefs work without them. Automatic selection stays internal;
user-selected codes may appear as instruction labels unless the user hides them.
The catalog retains all 200 lines, 20 categories and individual interpretations.

## Installation and portable helpers

Normal project-local install/update copies the new resources inside the
existing skill directories. The ChatGPT source manifest includes each file and
its SHA-256 under its existing skill. Creative and full profiles already include
all six owners; the core profile is not expanded into a full design bundle.
Native ChatGPT hosts may read the references without Node or filesystem access.
No helper is mandatory for conversational use.

From the installed project root, optional read-only checks are:

```sh
node .agents/skills/commercial-visual-campaign-director/scripts/poster-codes.mjs --code EP011
node .agents/skills/commercial-visual-campaign-director/scripts/poster-codes.mjs --command /codes
node .agents/skills/image-prompt-architect/scripts/static-design-preflight.mjs .agents/skills/image-prompt-architect/templates/static-design-notes.json
```

The template is a fictional complete prompt case. Place real project notes in
the project, not inside the skill. Preflight checks declared concept/copy states,
feasibility, required reference status, literal text coverage and edit partition.
`ready_for_prompt_review` is not execution permission or proof of rendered
quality. It does not detect every semantic addition or verify actual sources.

See the [worked examples](../examples/static-campaign/static-design-walkthrough.md)
for concept, prompt, edit, typography and component handoff cases.

## Preserved boundaries

- The kit remains a portable human-in-the-loop workflow with existing roles.
- Prompt skills prepare instructions; actual generation remains separately
  requested and subject to the active native tool's instructions.
- Ordinary raster graphics use native Codex/ChatGPT GPT Image 2 when available;
  visible text is generated in the same pass. No paid/provider fallback is added.
- Exact editable typography, functional codes, dielines and print masters route
  to DTP. A raster or PDF wrapper cannot establish those properties.
- Separate components are an explicit handoff scope, not a new built-in image
  compositor, editor, archive tool or runtime. Existing execution and delivery
  authority still apply.
- No global install, provider activation, upload, hidden background work or
  automatic retry is introduced.

## Source and adaptation

Source: [Static Graphic Design Creator at the imported commit](https://github.com/FrameCoreWorks/static-graphic-design-creator/tree/c3cbdf766411ca7e1131bc034bfa74ebad2efe71),
Apache-2.0. The [provenance inventory](static-graphic-design-provenance.json)
records source paths/hashes and their destinations. Adapted references carry
change notices. Catalog names/grouping retain John Savage AI attribution;
individual English interpretations retain FrameCore Works attribution.

The original PDF is neither bundled nor newly re-inspected; its provenance is
inherited. Historical reference links are retained as research anchors rather
than claimed as a new live audit. No generated examples, benchmark results or
third-party fonts/images are imported.

The source's standalone entrypoint, first-use installer, updater, release
records, lifecycle helper and separate copy ownership were not adopted.
The 1,712-line standalone design schema is mapped into existing kit contracts
and optional compact preflight notes instead of creating a parallel schema.
The catalog helper is adapted to the kit's existing Node runtime. The Pillow
inspection/archive helper and provider/model-specific guidance are not bundled;
their useful QA and capability distinctions are incorporated in existing
handoffs. No image-model migration is implied by the source's newer model notes.
