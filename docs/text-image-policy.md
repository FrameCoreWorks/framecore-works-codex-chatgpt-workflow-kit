# Text-Bearing Image Policy

Static raster graphics with visible text must use `openai/gpt-image-2` in one pass with all visible text included directly in the generated image.

Forbidden:

- generating a text-free background first
- adding typography later through overlays
- compositing text after generation
- using coded artwork as a substitute for the final generated raster unless the user explicitly asks for a coded or vector artifact

Prompts must include exact copy, hierarchy, placement, typography direction, safe margins, and no-extra-words constraints.
