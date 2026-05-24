# Artifacts Index

## Purpose

Index durable artifacts produced or used by the workflow.

| Artifact | Path | Status | Gate | Notes |
| --- | --- | --- | --- | --- |
| project state | Memory Cache/project-state.md | active | recovery | durable state |

## Rules

- Index only files relevant to recovery or handoff.
- Do not index AppleDouble files.
- Do not index secrets, `.env`, raw transcripts, or private URLs.
- Keep Context references as pointers only when needed; do not copy Context material into Memory Cache.
