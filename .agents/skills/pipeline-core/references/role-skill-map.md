# Role To Skill Map

This file is the canonical map between public workflow role IDs and supporting
public skills.

Roles and skills are intentionally not a one-to-one inventory. A role owns a
workflow responsibility, artifact, review gate, handoff target, and stop
condition. A skill supplies reusable instructions, knowledge, templates, or
guardrails that can support one or more roles.

In a Codex project-local install, a role ID may resolve to a rendered
`.codex/agents/<role-id>.toml` file. In ChatGPT, the same role ID becomes a
temporary responsibility inside the current task. Some role IDs also have
same-named public skills; others are resolved through supporting skills.
A role ID does not mean ChatGPT must find or install a native skill with the
same name.

For example, a handoff to `static-direction` means "perform the static visual
direction responsibility." It does not require ChatGPT to invent an
`@static-direction` skill. ChatGPT should load the supporting skills listed
here, create a bounded temporary responsibility, produce the expected artifact,
then stop or hand off.

| Role ID | Codex implementation | ChatGPT implementation | Supporting skills |
| --- | --- | --- | --- |
| `intent-confirmation` | `.codex/agents/intent-confirmation.toml` | temporary responsibility | `pipeline-core`, `workflow-orchestrator` |
| `workflow-orchestrator` | `.codex/agents/workflow-orchestrator.toml` | temporary responsibility | `workflow-orchestrator`, `pipeline-core` |
| `brief-architect` | `.codex/agents/brief-architect.toml` | temporary responsibility | `brief-architect` |
| `reference-curator` | `.codex/agents/reference-curator.toml` | temporary responsibility | `reference-pack-curator`, `hipson-adapter` |
| `research-evidence` | `.codex/agents/research-evidence.toml` | temporary responsibility | `research-evidence`, `pipeline-core`, `instruction-packet-factory`, `reference-pack-curator` |
| `instruction-packet-factory` | `.codex/agents/instruction-packet-factory.toml` | temporary responsibility | `instruction-packet-factory`, `hipson-adapter` |
| `static-direction` | `.codex/agents/static-direction.toml` | temporary responsibility | `commercial-visual-campaign-director`, `ecommerce-campaign-strategy-director`, `marketing`, `character-design` |
| `motion-direction` | `.codex/agents/motion-direction.toml` | temporary responsibility | `commercial-video-campaign-director`, `creative-video-producer`, `cinematography`, `storytelling` |
| `music-video-direction` | `.codex/agents/music-video-direction.toml` | temporary responsibility | `creative-music-video-director`, `producer-ai-task-builder`, `cinematography`, `storytelling` |
| `storyboard-architect` | `.codex/agents/storyboard-architect.toml` | temporary responsibility | `storyboard-director`, `screenplay-story-architect`, `storytelling`, `cinematography` |
| `storyboard-board-architect` | `.codex/agents/storyboard-board-architect.toml` | temporary responsibility | `storyboard-board-architect`, `image-prompt-architect` |
| `copy-voice` | `.codex/agents/copy-voice.toml` | temporary responsibility | `copy-voice`, `humanizer`, `marketing`, `ugc`, `caption-studio` |
| `image-prompting` | `.codex/agents/image-prompting.toml` | temporary responsibility | `image-prompt-architect`, `pipeline-core` |
| `video-prompting` | `.codex/agents/video-prompting.toml` | temporary responsibility | `video-prompt-architect`, `creative-video-producer`, `producer-ai-task-builder` |
| `tool-routing-cost` | `.codex/agents/tool-routing-cost.toml` | temporary responsibility | `tool-routing-cost`, `pipeline-core` |
| `execution-manifest` | `.codex/agents/execution-manifest.toml` | temporary responsibility | `pipeline-core`, `asset-manifest`, `remotion-video-production`, `opencut-video-studio` |
| `asset-manifest` | `.codex/agents/asset-manifest.toml` | temporary responsibility | `asset-manifest` |
| `qa-iteration` | `.codex/agents/qa-iteration.toml` | temporary responsibility | `output-critic-iteration`, `pipeline-core` |
| `delivery-documentation` | `.codex/agents/delivery-documentation.toml` | temporary responsibility | `delivery-documentation`, `humanizer` |
| `hyperframes-producer` | `.codex/agents/hyperframes-producer.toml` | temporary responsibility | `hyperframes-workflow`, `hyperframes-prompting`, `hyperframes-gsap-guidance` |

## Non-One-To-One Contracts

Some role names deliberately do not match public skill names, and some roles
need supporting skills beyond their same-named contract:

- `copy-voice` owns the Copy Pack responsibility. `humanizer` is still a
  supporting skill for natural voice and polish; it does not replace copy
  strategy, hooks, supers, VO, dialogue, platform variants, or claim checks.
- `research-evidence` owns verification and Evidence Notes. It may use
  supporting packet and reference skills to organize the work, but it must not
  invent sources, fake browsing, or treat unverified claims as facts.
- `tool-routing-cost` owns provider-neutral execution planning. It can prepare
  a Tool Routing Plan, but it does not activate providers, upload files, call
  APIs, or approve costs.
- `execution-manifest` owns traceability for an approved run. It can be
  supported by `asset-manifest`, `remotion-video-production`, or
  `opencut-video-studio`, but only after the relevant execution boundary is
  explicit.
- `hyperframes-producer` coordinates three focused HyperFrames skills:
  workflow structure, implementation prompting, and GSAP motion guidance. They
  remain separate support skills because each can also be used independently.

## Handoff Resolution Rules

When a workflow mentions a role ID:

1. Resolve the role ID against this map.
2. In Codex, use the rendered role agent when available.
3. In ChatGPT, create only a temporary responsibility with clear scope,
   required inputs, expected output artifact, review gate, handoff target, and
   stop condition.
4. Load the smallest supporting skill set that covers the current task.
5. Use a same-named skill only when it exists and is the smallest useful source
   for the current responsibility.
6. Do not invent, install, or invoke a same-named skill just because a role ID
   appears in a handoff. Use one only when it exists and matches the current
   responsibility.
7. If supporting skills are unavailable, stop with the missing source instead
   of claiming the workflow is fully installed.

## Change Rule

When a public role, skill, handoff, gate, or ChatGPT installation profile
changes, keep these files synchronized:

- `.agents/skills/pipeline-core/references/role-skill-map.md`
- `.agents/skills/pipeline-core/references/agent-roster.md`
- `.agents/skills/pipeline-core/references/handoff-matrix.md`
- `docs/agent-roster.md`
- `docs/workflow-map.md`
- `docs/included-agents-and-skills.md`
- `config/chatgpt-skills.json`
- `config/chatgpt-skill-sources.json`
