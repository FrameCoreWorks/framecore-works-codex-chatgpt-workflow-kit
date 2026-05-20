# Text-Bearing Image Policy

Static raster graphics with visible text must use the built-in Codex/ChatGPT image generation capability powered by GPT Image 2 in one pass, with all visible text included directly in the generated image.

This is a native chat-window generation path. It is not an external provider integration, API key requirement, CLI, or paid media-provider workflow.

If the current Codex environment does not expose built-in image generation, stop and ask the user how to proceed. Do not silently replace this path with coded SVG, HTML/canvas, Sharp/composited PNG, or text overlays.

Forbidden:

- generating a text-free background first
- adding typography later through overlays
- compositing text after generation
- using coded artwork as a substitute for the final generated raster unless the user explicitly asks for a coded or vector artifact

Prompts must include exact copy, hierarchy, placement, typography direction, safe margins, and no-extra-words constraints.
