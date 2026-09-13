# Update an Existing Codex Installation

## Two Separate Updates

Updating the kit checkout and updating a project that uses the kit are separate
operations. The installed project's `update` command reads the checkout it is
run from; it does not fetch GitHub. Running it from an old checkout installs old
sources.

This guide updates the existing project-local installation. It does not create
a second Skill, replace a personal installation with a fresh one, or update a
different project. For personal edits rather than upstream updates, use
[Skill Customization](docs/skill-customization.md).

## Copy-Paste Update Prompt

Open the already configured destination project in Codex and paste:

```text
Update my existing project-local FrameCore workflow to the latest main commit from:
https://github.com/FrameCoreWorks/framecore-works-codex-chatgpt-workflow-kit

First read CODEX_UPDATE.md. Find my current project's .framecore/manifest.json and confirm the
actual host and destination. This is an update, not a fresh or global install.

Find the kit checkout outside my project. Verify its origin and Git status. Fetch origin/main and
use a clean checkout at that exact full commit; do not reset, discard, stash or overwrite anyone's
uncommitted work. If the checkout is dirty or diverged, stop or propose a separate clean source
checkout outside my project. Report the previous known source identity and the fetched target
commit; do not infer a precise source commit from package version alone.

Run release checks, doctor in update mode and install dry-run. Compare actual installed files with
manifest hashes and available old source evidence. Show changed, new, retired and unchanged files,
local modifications and any conflicts. Preserve personal additions. The built-in updater does not
perform a three-way merge: do not describe backups or --force as a conflict-safe merge.

Ask for approval of the concrete update. If local modifications conflict, prepare the exact proposed
resolution read-only and stop before writes until I approve it. Do not use --force just to make the
command succeed.

Apply the approved update to this same project. Verify doctor, managed hashes, preserved local files
and the final manifest, then repeat dry-run to check for remaining changes. Report the source
commit, changes, backup locations and verification. Use my resolved working language only because
this is an already installed environment. Do not upload, publish, activate providers or change
global installations.
```

## Refresh the Source Checkout

From the separate kit checkout, first inspect:

```bash
git status --short --branch
git remote get-url origin
```

Stop if it has uncommitted changes, an unexpected origin or unpublished commits.
Do not reset or force-pull it. A separate clean clone outside the destination is
an alternative after reviewing where it will be created.

For a clean checkout of this repository's main branch:

```bash
git fetch origin main
git switch main
git merge --ff-only origin/main
git rev-parse HEAD
git rev-parse origin/main
```

The two commit IDs must match. A fast-forward failure or a clean but locally
ahead branch needs review; do not continue with a different source. Record the
full target commit, not only the package version or the word `latest`.

## Preview, Approve and Apply

Run from the verified source checkout, replacing the target placeholder:

```bash
npm run release:check
node scripts/doctor.mjs --mode update --target /path/to/your/project
node scripts/install.mjs --mode dry-run --target /path/to/your/project
```

Review the output before applying:

```bash
node scripts/install.mjs --mode update --target /path/to/your/project
node scripts/doctor.mjs --mode update --target /path/to/your/project
node scripts/install.mjs --mode dry-run --target /path/to/your/project
```

A repeated dry-run should have no unexplained writes. `repair` does not fetch
upstream or add newly introduced managed paths. It rewrites recorded files
from the checkout being used, so a newer checkout can upgrade that subset.
Use the appropriate pinned source for a same-version repair.

## Local Changes and Recovery

The updater protects recorded local drift and user-owned conflicts. It creates
numbered backups before replacement and retires obsolete managed files with
backups. Modified or unhashed retired files require a reviewed decision.
`--force` overwrites after backup; it does not merge or prove correctness.

Keep private extensions and their loading instructions in the comparison.
Do not edit manifest hashes to hide local modifications or pretend an old
installation has verified provenance. If the previous source commit is unknown,
report that limitation and use the manifest only for the ownership evidence it
actually contains.

If an operation fails, inspect the incomplete manifest and real files before
retrying. Preserve backups and later user changes. Use
[the migration guide](docs/migration-guide.md) for repair and scoped manual
rollback; never delete installed directories to bypass a conflict.
