# Text Image Generation Policy

Static raster graphics with visible text must use the built-in Codex/ChatGPT image generation capability powered by GPT Image 2 in one pass.

This is a native chat-window generation path, not an external provider integration, API key requirement, CLI, or paid media-provider workflow.

If the current Codex environment does not expose built-in image generation, stop and ask the user how to proceed. Do not silently replace this path with coded SVG, HTML/canvas, Sharp/composited PNG, or text overlays.

The prompt must include:

- exact visible copy
- layout hierarchy
- placement and safe margins
- typography direction
- no extra words and no duplicate text constraints

Do not generate a text-free background first and add text later.
