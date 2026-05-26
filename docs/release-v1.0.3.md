# FrameCore Works v1.0.3

## Version

- Tag: `v1.0.3`
- Date: 2026-05-26
- Release type: patch

## Summary

FrameCore Works v1.0.3 improves the beginner install path after early tester feedback. It adds an explicit first-step guard that tells users not to run the install prompt in a regular ChatGPT chat window, because chat-only surfaces cannot clone the repo, access workspace files, or run local shell commands.

## Install And Update Notes

- New users should still start from the `Beginner Start` section in `README.md`.
- The beginner prompt now first confirms that the user is in a shell-capable Codex workspace.
- If the prompt is pasted into regular ChatGPT or another chat-only surface, the assistant should stop and explain that nothing can be installed there.
- Project-local install remains the default and recommended path.
- No migration is required for existing installs.

## Onboarding Notes

- The onboarding questions are unchanged.
- The beginner path now reduces confusion before onboarding starts by separating explanation-only chat surfaces from install-capable Codex workspaces.
- GitHub Desktop remains the recommended helper for users who are not comfortable cloning repositories from Terminal.

## Workflow Changes

- `README.md`, `docs/quickstart.md`, and `docs/codex-assisted-install.md` now explicitly mention regular ChatGPT/chat-only environments.
- Validation now preserves the ChatGPT-vs-Codex guard in the beginner install docs.
- No agent, skill, manifest, or installer behavior changed in this patch.

## Validation And Package Checks

Validated before release:

- `npm run release:check`
- `npm run validate`
- `npm test`
- `npm run release:readiness`

Latest local results:

- 115/115 tests passed.
- Smoke install passed.
- Package audit passed.
- Release readiness passed for `framecore-works-codex-workflow-kit@1.0.3`.

## Security And Privacy Review

- No secrets, credentials, private URLs, local machine paths, private cloud IDs, generated confidential outputs, or user-specific configs are included.
- No bundled external paid execution providers, provider CLIs, endpoint catalogs, credentials, or API-key setup flows are included.
- The change is documentation and validation only.
- The text-bearing image policy still uses native Codex/ChatGPT image generation powered by GPT Image 2.
- Full Hipson remains separate and optional; this kit ships only the lightweight adapter.

## Known Limitations

- A regular ChatGPT chat can explain the repository but cannot install it without access to a local workspace and shell commands.
- `.codex/agents/*.toml` requires a Codex environment that supports custom-agent role files.
- Chat-only environments can use the docs and prompts, but installation still needs a terminal-capable environment or technical helper.

## Links

- [README](../README.md)
- [Quickstart](quickstart.md)
- [Codex-Assisted Install](codex-assisted-install.md)
- [Troubleshooting](troubleshooting.md)
- [Compatibility](compatibility.md)
- [Release Process](release.md)
