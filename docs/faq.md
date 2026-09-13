# FAQ

## Purpose

This FAQ answers the questions a new user is most likely to ask before installing or using this workflow skill kit in Codex or native ChatGPT Skills. It is a short orientation layer; the detailed procedures live in Quickstart, Codex-Assisted Install, Native ChatGPT Skills, CLI Reference, and Troubleshooting.

## Install Questions

### Do I paste the GitHub link into Codex or run commands myself?

Paste the [native Codex prompt](../CODEX_INSTALL.md) with its leading
`$skill-installer` mention. It installs approved Skill bundles into the actual
personal Skills directory, not a project clone. Only users choosing optional
project agents and config need the [advanced CLI](codex-project-install.md).

### Should beginners install GitHub Desktop?

Not for native `$skill-installer` installation. GitHub Desktop is an optional
visual way to clone the repository for the advanced project-local CLI, which requires Node.js
and npm. It does not perform either installation by itself.

When cloning with GitHub Desktop, clone this repo into a temporary, tools, or GitHub folder outside the project where you want to install the kit.

### What is the safest install command?

For native Codex Skills, use `$skill-installer` and [CODEX_INSTALL.md](../CODEX_INSTALL.md).
For the optional advanced project mode, use the guided installer:

```bash
npm run install:guided -- --target /path/to/your/project
```

It runs checks, doctor/preflight, onboarding, dry-run, and project-local install in the expected order.

### Does setup require global install?

Native `$skill-installer` uses the personal `$CODEX_HOME/skills` directory by
default. That is not the project CLI's `--mode global`, which writes a home
workspace and requires `--confirm-global`. Do not confuse these scopes.

### Can I install into a missing folder?

Native installation manages its own personal Skills destination. The optional
project CLI expects the target workspace to already exist. Lower-level scripts can create a target only when `--create-target` is explicitly passed, but that should be intentional.

### Can I install these as native ChatGPT Skills?

Yes, when the ChatGPT account exposes native Skills and Work. Switch the top selector from Chat to Work, then paste the repository-source prompt from README with its leading `@skill-creator` mention. ChatGPT runs onboarding in English, recommends the smallest useful profile, reads each selected skill from the declared raw GitHub sources, and creates the native skills through Create with chat. The alternate path is Plugins > Skills > Create > Create with chat. See [Native ChatGPT Skills](chatgpt-skills-onboarding.md).

### Does one ChatGPT prompt install all 35 skills automatically?

The prompt starts and governs the complete setup, but each repository skill remains a separate native ChatGPT Skill. After onboarding and approval of the exact list, choose:

- **Full batch installation:** type one clear approval in the conversation. `@skill-creator` then creates all approved skills in order without asking again between skills.
- **Guided installation:** ChatGPT explains one skill at a time, asks for conversational approval, creates it, and then continues.

No separate install button or modal is required by this repository workflow. Reading the repository or receiving approval is not success by itself. Every skill still needs a real result from the active `@skill-creator` workflow.

### Can onboarding use my ChatGPT history?

Yes, when you explicitly choose history-assisted onboarding and the active ChatGPT surface actually exposes Memory or previous conversations. ChatGPT first shows a short list of provisional work-pattern observations. You confirm or correct them before they become onboarding answers, and ChatGPT asks only about the remaining gaps.

If history is unavailable, ChatGPT must say so and continue with fresh questions. It must not invent prior knowledge, reproduce unrelated private conversation text, or treat existing skills as proof that setup is complete.

### How do I use, change, or create skills after installation?

Describe a task normally and ChatGPT may select a suitable eligible skill automatically. For predictable selection, type `@` and choose the skill name.

To change an installed skill, open Work, select `@skill-creator`, name the skill, and explain what should change. You can add examples, preferred output formats, decision rules, references, or QA checks.

To create a new skill, start in Work with:

```text
Use @skill-creator to help me create a skill.
```

## Configuration Questions

### Where are my preferences stored?

Native Skill onboarding keeps a visible Workflow Profile; private persistence
requires approval and an available host mechanism. Advanced project onboarding
writes `framecore.config.json` in the target workspace. It stores local choices such as language, tone, output directory, QA strictness, delivery behavior, local display names, and optional workflow self-improvement preference.

### Can I rename the agents?

Public source uses neutral role IDs. Native Skills can use your chosen labels
in the visible Workflow Profile. Advanced project onboarding can render local
display names into the installed workspace. Those local display names should not be committed back to the public repo.

### What happens if my project already has `AGENTS.md`?

Native `$skill-installer` does not edit project instructions. The advanced
project installer preserves them and writes FrameCore instructions to `AGENTS.framecore.md`. The user or maintainer can then decide how to merge local project instructions.

## Workflow Questions

### What kind of work is this kit for?

The kit is built for creative workflow planning and production support: graphics, video, storyboards, ecommerce assets, prompt packs, coded-video briefs, QA reports, delivery manifests, and workflow retrospectives.

### Does it generate final media by itself?

No external media execution is enabled by default. The kit produces workflow artifacts, prompts, manifests, QA notes, and delivery documentation. Execution tools can be added separately by the user.

### What should I ask Codex after installation?

Start with a concrete workflow request, for example: "Plan a static ecommerce campaign for this product using the installed FrameCore workflow. Do not use external execution tools." See Using The Kit for starter prompts.

## Provider And Safety Questions

### What does provider-neutral mean?

Provider-neutral means this repo does not ship external paid media-provider clients, provider CLIs, endpoint catalogs, provider credentials, API-key setup flows, or paid execution routes.

### What about text-bearing graphics?

Static raster graphics with visible text use the built-in Codex/ChatGPT image generation capability powered by GPT Image 2 in one pass when that capability is available. Do not add text later with overlays unless the user explicitly asks for a coded or vector artifact.

### Does the repo include secrets or private project context?

It should not. The privacy audit rejects private names, local absolute paths, personal emails, secret-like values, private cloud links or IDs, excluded provider remnants, and AppleDouble metadata files.

## Hipson And HyperFrames

### Is full Hipson installed?

No. This kit includes a lightweight Hipson Adapter only. Full Hipson remains separate and optional, and setup does not clone, install, or activate full Hipson.

### What does the Hipson Adapter do?

It prepares research maps, internet mapping packets, bounded instruction packets, review packets, execution packets, and handoff support inside this workflow architecture.

### What is HyperFrames in this kit?

HyperFrames is treated as a coded-video workflow path, not as a paid media-provider integration. The kit includes planning guidance for scene structure, GSAP motion notes, captions, render QA, and delivery manifests.

## Updates And Uninstall

### How do updates work?

Native Codex Skills use [CODEX_UPDATE.md](../CODEX_UPDATE.md) and `$skill-creator`:
read-only comparison, exact proposal, approval, snapshot and verified saved bytes.
Never use `$skill-installer` to overwrite an existing Skill.

Advanced project installations use [project update](codex-project-update.md):
refresh the source checkout, run checks, doctor and dry-run, then approve the
concrete update. That CLI requires `.framecore/manifest.json` and updates managed
Skill bundles, rendered agents and project instructions, not the repository docs tree.

### How does repair differ from update?

These commands apply only to advanced project installations. Repair rewrites
manifest-recorded files from the current checkout; update can expand the managed
set. Neither is a native personal Skill updater.

### How do I uninstall?

For native personal Skills, locate the exact installed scope, preserve personal
resources and obtain approval for removing only the selected Skill. Do not run
project manifest commands against personal Skills.

For an advanced project installation, run uninstall first as a preview:

```bash
node scripts/install.mjs --mode uninstall --target /path/to/your/project
```

Apply removals only after reviewing the preview:

```bash
node scripts/install.mjs --mode uninstall --target /path/to/your/project --yes
```

## Troubleshooting

### What should I run before opening an issue?

Run:

```bash
npm run cleanup:appledouble -- --apply
npm run release:check
```

If install failed in a target workspace, also run doctor/preflight for that target and include sanitized finding codes in the report.

For non-technical tester reports, use [Tester Feedback Guide](tester-feedback.md). The most useful details are: whether this was Codex or ChatGPT, what exact prompt or command was used, where the flow stopped, whether shell commands worked, whether the Codex sandbox was configured, and a screenshot or exact error message if available.

### What should I not paste into an issue?

Do not paste secrets, tokens, provider keys, personal emails, private cloud folder IDs, local absolute paths, private client context, or generated outputs that contain private material.

## Related Docs

- [Quickstart](quickstart.md)
- [Codex-Assisted Install](codex-assisted-install.md)
- [Native ChatGPT Skills](chatgpt-skills-onboarding.md)
- [CLI Reference](cli-reference.md)
- [Using The Kit](using-the-kit.md)
- [Troubleshooting](troubleshooting.md)
- [Tester Feedback Guide](tester-feedback.md)
- [Provider-Neutral Boundary](provider-neutral-boundary.md)
- [Hipson Integration](hipson-integration.md)
- [HyperFrames](hyperframes.md)
