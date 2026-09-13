# Update Existing Native ChatGPT Skills

## Scope

Use the actual `@skill-creator` editing workflow for the existing native Skills
installed from this repository. ChatGPT must not run the Codex installer, clone
a workspace, create `.codex/agents`, or invent a local save mechanism. Availability
depends on the active host. An unsupported edit or readback capability is a
blocker, not permission to create duplicates.

## Copy-Paste Update Prompt

In ChatGPT Work where the installed Skills and creator are available, paste:

```text
Use @skill-creator to update my existing native ChatGPT Skills from:
https://github.com/FrameCoreWorks/framecore-works-codex-chatgpt-workflow-kit

First read CHATGPT_UPDATE.md. Identify the actual installed Skills, their source evidence and the
active host's supported editing and readback capabilities. Update the existing entries only; do not
create duplicate Skills or substitute a Codex installation.

Resolve the latest main commit once and pin all configuration, source inventory and source reads to
that same full commit. Compare the previous verified source when available, the new source and the
actual installed content. Report the target commit, changed/new/removed/already-current files,
personal edits, conflicts and verification limits. Do not infer exact upstream identity from names
or package version.

Prepare a complete conflict-safe proposal read-only. Preserve personal additions and unrelated
behavior. If there is no upstream change, report already_up_to_date or
local_customizations_preserved without saving. Otherwise show the exact Delta and obtain my approval
before editing any saved Skill.

After approval, use the actual native editing workflow for the same entries, then read back and
verify the intended content and preserved resources. Approval, a local draft or an already visible
library entry alone is not proof of a successful update. If a save response fails or is lost,
inspect actual saved state before considering another attempt; do not retry or roll back blindly.

Explain results in my resolved working language because the Skills are already installed, but keep
public source descriptions in English. Do not use shell commands, global installs, providers,
uploads, publishing or background updates.
```

## Source and Comparison

1. Use `main` only to discover a full commit ID. Read `CHATGPT_INSTALL.md`,
   `config/chatgpt-skills.json` and `config/chatgpt-skill-sources.json` at that
   same commit.
2. The current inventory contains discovery URLs using `main`. For this update,
   resolve each `repository_path` against the pinned commit rather than mixing
   moving URLs. Verify declared SHA-256 values when the host supports hashing;
   report unavailable hashing instead of claiming verification.
3. Compare each existing Skill's full inventory and bytes. Prefer an actual
   previous source receipt. A missing baseline means the comparison is limited;
   do not invent a source record or silently overwrite unknown personal changes.
4. Preserve local-only additions. Overlapping upstream and personal changes
   need a reviewed resolution. Do not advance source evidence alone, while
   leaving the associated source changes unapplied.
5. Validate the complete proposed result and snapshot the current saved state
   using an actually available private recovery mechanism before mutation.

## Save, Read Back and Stop

Use one approved edit of the existing entry. Verify identity, files, exact
changed content and preserved resources against the proposal. Record only the
source identity and save evidence actually observed.

After any failed or ambiguous attempt, read back first. Exact intended content
means success without another save. An unchanged baseline needs no rollback.
A confirmed transient failure with unchanged state permits at most one reviewed
retry within the existing approval and stricter host limits. Partial or different
content requires a recovery proposal that preserves later edits. Unavailable
readback means `verification_unavailable`, not `updated`.

No force-push, hidden save hook or replacement service is part of this guide.
For user-specific behavior rather than a new upstream version, follow
[Skill Customization](docs/skill-customization.md).
