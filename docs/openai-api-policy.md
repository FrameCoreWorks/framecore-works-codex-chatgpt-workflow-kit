# OpenAI API Policy

## Purpose

OpenAI API access is inactive by default in this kit. The public workflow can plan, validate, write prompts, prepare manifests, define QA criteria, and manage local recovery state without making OpenAI API calls.

This policy is separate from Codex built-in capabilities. Native Codex or ChatGPT image generation, when available in the host product, is not treated as a local API-key workflow by this repo.

## Activation Phrase

Any local OpenAI API path requires the exact activation phrase:

```text
openai api active
```

The phrase must be present in the command option or current explicit user instruction. Near matches are not enough.

## API-Gated Capabilities

The activation phrase is required before using local `OPENAI_API_KEY` access for:

- SDK calls
- direct HTTP calls
- Responses
- Images
- Video
- Audio
- Realtime
- Embeddings
- Evals
- Batch
- Files
- vector stores
- model listing
- uploads

Without activation, the kit stays in planning, prompt writing, manifest, QA, documentation, and validation mode.

## Never Send

Do not send these to an API by default:

- `.env` files
- secrets, keys, credentials, or private tokens
- raw transcripts
- chain-of-thought
- signed or private URLs
- Google Drive credentials
- full `Context/`
- AppleDouble `._*` files
- base64 media
- oversized files

## Semantic Memory

Local semantic indexing does not require API activation.

Hosted embeddings are optional. `npm run semantic:embed` fails without `--activation "openai api active"` and still applies the safe source filter before preparing any API-capable work.

The public kit does not depend on Responses API for self-improvement or patch planning. If a local policy blocks Responses API, the self-improvement loop remains report-only and local.

## Text-Bearing Graphics

For static raster graphics with visible text, use the built-in Codex or ChatGPT image generator powered by GPT Image 2 when available. Generate the full graphic in one pass with exact final copy in the prompt. Do not create a text-free background and add text later unless the user explicitly asks for coded or vector artwork.

## Related Docs

- [Semantic Memory](semantic-memory.md)
- [Text Image Policy](text-image-policy.md)
- [Provider-Neutral Boundary](provider-neutral-boundary.md)
