# Update Existing Codex Skills

## Preserve the Installed Scope

This is the upstream update route for native personal Codex Skills installed
through `$skill-installer`. Use `$skill-creator` to inspect and update the existing
Skill content, not a fresh installer invocation. The system installer refuses
existing destinations and does not provide a merge-aware update command.

Locate the actual active Skill paths before doing anything else. Do not assume
the current project owns them. If `.framecore/manifest.json` owns project-local
files, follow the separate [project update guide](docs/codex-project-update.md).
A mixed installation requires an explicit scope decision, not duplicate copies.
Personal customization without a new upstream source uses
[Skill customization](docs/skill-customization.md).

## Copy-Paste Update Prompt

In Codex with the existing Skills and `$skill-creator` available, paste:

```text
Use $skill-creator to update my existing installed FrameCore Skills from:
https://github.com/FrameCoreWorks/framecore-works-codex-chatgpt-workflow-kit

First read CODEX_UPDATE.md. Confirm the actual Codex host, exact existing Skill paths and source
evidence. This updates the same Skills; do not use $skill-installer as an updater, create duplicates
or clone a repository into my project. If a project .framecore/manifest.json owns these files, use
docs/codex-project-update.md for that scope instead. Do not silently move between installation
scopes.

Resolve the latest main commit once and pin the guide, configuration, inventory and all source
reads to that same full commit. Verify source paths and SHA-256 hashes. Compare the actual installed
content, the previous verified source when available, and the new source. If the old baseline is
unknown, say so; do not invent a three-way comparison or infer provenance from a Skill name.

Prepare the complete proposal read-only: changed, new, retired and unchanged files, exact conflict
diffs, personal additions, preserved behavior, validation and rollback. An upstream update does not
authorize installing extra Skills. Preserve existing Skill identity and local extensions. If there
is no update to apply, report already_up_to_date or local_customizations_preserved without writing.

Show Delta and verification, then wait for my approval before any saved change. Unresolved conflicts
block the update. After approval, recheck the source and installed bytes for drift, preserve a
recoverable snapshot outside the bundles and apply only the approved changes to the same paths.

Read back the complete result, verify hashes and preserved resources, run relevant bundled checks
when available, and repeat comparison against the same source without another save. Record actual
source identity, local deviations and saved digests outside the bundles only after verification.
If saving or verification fails, inspect actual state before recovery; do not blindly retry or
roll back over later user edits.

Use my resolved working language because the Skills are already installed. Keep public sources in
English. Do not upload, publish, activate providers or change unrelated configuration.
```

## Read-Only Comparison

Resolve and verify the source as described in [CODEX_INSTALL.md](CODEX_INSTALL.md),
using one full commit for guide, profile and inventory reads. Update only the
selected existing Skills. A larger new profile does not authorize installing
additional Skills.

Compare the previous verified source, actual installed files and new source.
Keep source digests separate from actual saved digests and local deviations.
A directory name, visible Skill entry or package version does not establish a
baseline. With no reliable old source, report `baseline_unknown`, show the
two available states and propose reviewed resolutions rather than claiming a
three-way merge.

Show exact conflict diffs and the complete resulting proposal before approval.
Include supporting files, loading instructions, host metadata and personal
resources, not only `SKILL.md`. Classify changed, new, retired and unchanged
files within each selected bundle. Preserve local additions; never delete a
file merely because it is absent upstream when its ownership is unknown.
Reject unsafe paths and links before writes.

An exact repeat is `already_up_to_date`. A repeat whose only differences are
reviewed personal changes is `local_customizations_preserved`. Both are
read-only outcomes. Do not advance an installation receipt for a change that
has not been applied and verified.

## Approval, Save and Verification

1. Obtain approval of the complete concrete change. Unresolved conflicts block
   the transaction. Approval to compare is not approval to write.
2. Recheck installed bytes against the reviewed snapshot immediately before
   mutation. A concurrent edit invalidates the proposal; stop and compare again.
3. Keep a recoverable snapshot and proposed result outside the canonical bundles
   and outside active Skill discovery. Apply only approved paths to the same
   existing Skill identities. Do not edit unrelated settings or other scopes.
4. Read back the entire saved inventory. Verify all intended hashes and retained
   personal resources. Run relevant bundled validators/tests when available;
   do not claim a live host invocation from a source or filesystem check.
5. Repeat the comparison against the same pinned source without another save.
   Report `already_up_to_date` or `local_customizations_preserved` only when
   actual files support it. Store source identity, verified saved digests and
   local deviations in a private receipt outside the bundles after acceptance.

Neither `$skill-creator` nor this guide supplies an automatic atomic multi-Skill
transaction. If a save or verification fails, report partial state, inspect the
real files, and propose bounded recovery from the snapshot. Never roll back
over later user edits, delete Skill directories to bypass conflicts, or report
success when readback is unavailable. Use `verification_unavailable` explicitly.

Continue in the installed user's resolved language. Public repository prose
stays English. No background update, provider activation, upload or publication
is part of this procedure.
