# Extend Existing Installed Skills

## Personal Extension, Not an Upstream Update

Use this route to adapt an installed Skill to your own work with real examples,
formats, references, decision rules or QA checks. It edits the existing installed
Skill after approval. It does not create a second Skill, change this public
repository, fetch a new release or start creative production.

An upstream update is separate:
[Codex update](../CODEX_UPDATE.md) or [ChatGPT update](../CHATGPT_UPDATE.md).
Keep the upstream source identity unchanged when making personal edits.

## Codex Copy-Paste Prompt

Open the project where the kit is installed. Replace the Skill placeholder:

```text
Use $skill-creator to help me extend my existing installed FrameCore Skill: <skill-name>.

This is a guided personal extension, not a fresh install, upstream update or public repository edit.
Locate the exact existing Skill and confirm its installation scope. Do not create a duplicate or
clone another repository into my project. Resolve my working language from my explicit preference
and own conversation because this Skill is already installed.

First inspect its current instructions, relevant resources and managed-file status. Ask what I want
to add, change or specialize, and request only the real examples or constraints needed to define the
change.

Before writing, propose the objective, exact files, preserved behavior, expected benefit, conflicts,
acceptance test, rollback and stop condition. Prepare exact changes read-only and wait for my
approval.

Prefer supporting resources inside the existing Skill when appropriate. Do not assume that
local/SKILL_EXTENSIONS.md or any other filename is automatically loaded: include the smallest
explicit loading instruction in the approved change when needed. Explain that editing kit-managed
files is a personal override that can block a later upstream update.

After approval, preserve a recoverable snapshot, apply only the agreed changes, validate the
complete resulting Skill and read back the saved bytes. Preserve unrelated files and the upstream
source identity. Do not change manifest hashes merely to hide local drift. Report what changed, how
to test it and how to undo it. Do not publish, upload, use providers or modify global configuration.
```

## ChatGPT Copy-Paste Prompt

In ChatGPT Work, replace the Skill placeholder and paste:

```text
Use @skill-creator to help me extend my existing native FrameCore Skill: <skill-name>.

This is a guided personal extension, not a fresh install, upstream update or public repository edit.
Identify the existing native entry and use this host's actual edit/save workflow. Do not create a
duplicate or substitute a Codex filesystem installation. Resolve my working language from my
explicit preference and own conversation because this Skill is already installed.

Inspect the current Skill and its accessible resources. Ask what I want to add, change or
specialize, then request only the necessary examples and constraints. Prepare a read-only Change
Proposal: objective, exact scope, preserved behavior, expected benefit, conflicts, acceptance test,
rollback and stop condition. Wait for my approval before any saved change.

Preserve a recoverable baseline using a supported private mechanism. Apply only the approved
extension, keep the upstream source identity unchanged and preserve unrelated behavior. A supporting
file must be explicitly loaded by the Skill; do not invent automatic extension-folder support.

Verify the actual saved identity, complete intended content and preserved resources. A draft,
approval or existing library entry is not proof of persistence. If saving fails or the response is
lost, inspect actual saved state first. Do not blindly retry, roll back, force-push or switch save
services. Report preparation, persistence and verification separately, and stop if reliable readback
is unavailable. Do not publish personal files, upload assets, activate providers or run background
updates.
```

## What to Provide

A useful request names the existing Skill, one concrete problem, the desired
behavior, an example input/output and what must remain unchanged. For example:

```text
Extend my existing image-prompt-architect Skill so it asks for product-label facts before writing
packaging prompts. Preserve exact supplied label copy and the current provider-neutral rules. Add
two fictional regression examples and show me the proposal before changing the Skill.
```

The assistant must verify that the named creator/editor is actually available.
If not, it reports the missing capability and can prepare a proposal without
claiming that the extension was saved. An optional personal resource becomes
active only when the installed Skill explicitly loads it. No new persistent
extension registry or unsupported directory convention is introduced here.

## Verify and Maintain

Check one representative task, the preserved safety rules, internal links and
the actual saved resources. Keep private examples outside the public repository.
When an upstream update later touches the same files, compare old source, new
source and personal content where those baselines are available. Do not discard
a personal extension through `--force` just because backups exist.
