# Text Image Generation Policy

Static raster graphics with visible text must use `openai/gpt-image-2` in one pass.

The prompt must include:

- exact visible copy
- layout hierarchy
- placement and safe margins
- typography direction
- no extra words and no duplicate text constraints

Do not generate a text-free background first and add text later.
