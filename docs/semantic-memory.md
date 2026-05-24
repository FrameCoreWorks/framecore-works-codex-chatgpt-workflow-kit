# Semantic Memory

## Purpose

Semantic memory is a local-first index that helps Codex find safe workflow context without depending on old chat history.

The default semantic index does not call any API. It builds a lightweight local index from safe workflow files and Memory Cache state.

## Indexed By Default

`npm run semantic:index -- --target <operational-folder>` indexes:

- `AGENTS.md`
- `PIPELINE_AGENTS.md`
- `.agents/skills`
- `.codex/agents`
- safe files under `Memory Cache/`

The index is written to `Memory Cache/semantic-index.local.json`.

## Excluded By Default

The semantic tools exclude:

- `Context/`
- `.env` and secret-bearing files
- AppleDouble `._*` files
- `.git`
- `.next`
- `node_modules`
- `output` and `outputs`
- `tmp` and `temp`
- oversized files

This keeps user-supplied references and private material out of the durable index unless the user designs a separate explicit workflow for them.

## Local Query

After indexing, query the local index with:

```bash
npm run semantic:query -- --target <operational-folder> --query "recovery prompt"
```

The query uses local token overlap only. It is meant for recovery and routing, not model-grade embedding search.

## Optional Embeddings

Embeddings are optional and require the exact activation phrase:

```bash
npm run semantic:embed -- --target <operational-folder> --activation "openai api active"
```

Without that exact activation phrase, the command fails before any API-capable path can proceed.

The public kit does not require Responses API, vector stores, uploads, or any hosted service for semantic memory. Hosted embeddings may be added by a user-controlled extension, but the safe source filter still excludes Context, secrets, AppleDouble files, oversized files, and private material.

## Workspace Evaluation

Use:

```bash
npm run workspace:evaluate:semantic -- --target <operational-folder> --activation "openai api active"
```

This command requires the same activation phrase. In the public kit it produces a local coverage report and does not depend on hosted patch planning.

## Related Docs

- [Memory Cache](memory-cache.md)
- [Context Folder](context-folder.md)
- [OpenAI API Policy](openai-api-policy.md)
- [CLI Reference](cli-reference.md)
