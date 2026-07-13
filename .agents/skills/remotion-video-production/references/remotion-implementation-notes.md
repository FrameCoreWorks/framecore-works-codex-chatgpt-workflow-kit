# Remotion Implementation Notes

Use these notes when implementing or reviewing Remotion code. Confirm project versions before relying on version-sensitive APIs.

## Composition Contract

- Register each deliverable as a composition with an explicit ID, component, width, height, FPS, duration, and defaults.
- Expose controlled input props for reusable variants instead of duplicating nearly identical compositions.
- Keep source-truth copy, product data, brand values, and delivery dimensions outside incidental scene logic.
- Use dynamic metadata only when duration, dimensions, or normalized props genuinely depend on task inputs or media inspection.

## Deterministic Timing

- Derive render-critical motion from `useCurrentFrame()` and `useVideoConfig()`.
- Use `interpolate()` for bounded property mapping and `spring()` when physics-based response is intentional.
- Clamp interpolation when values must not continue outside the designed range.
- Avoid CSS transitions and keyframe animations for render-critical motion because browser time is not the composition timeline.
- Avoid unseeded randomness, current timestamps, and environment-dependent branches that can change between frames or renders.

## Scene Structure

- Use named scene components and explicit frame ranges.
- Use `Sequence` to shift or limit child timelines; remember that sequence children receive a shifted local frame.
- Check nested sequence boundaries for accidental gaps, overlaps, remounts, and late media availability.
- Keep editorial structure visible enough that duration or order changes do not require searching through unrelated styling code.

## Assets, Media, And Captions

- Follow the existing project's asset convention. For public-folder assets, use the project's supported `staticFile()` route.
- Use the media components supported by the installed Remotion version and verify current imports before adding packages.
- Treat captions as timed data with explicit segmentation, line length, safe zones, and frame boundaries.
- Confirm font availability and loading behavior before render; do not assume a local system font exists in another environment.
- Record source provenance and rights uncertainty in the asset manifest or delivery notes.

## Verification

Use the smallest evidence set that covers the requested risk:

1. Typecheck or project test when available.
2. Studio preview for interaction and scene inspection.
3. Representative still frames for layout and transition boundaries.
4. Short or low-cost render for codec, media, and audio checks when appropriate.
5. Final render plus artifact inspection for delivery acceptance.

Do not treat a successful command exit as sufficient visual QA. Inspect the produced frame or video when the environment supports it.

## Official Sources

- Getting started and current product surface: https://www.remotion.dev/
- Animating properties and frame-driven animation: https://www.remotion.dev/docs/animating-properties
- Sequence timing: https://www.remotion.dev/docs/sequence
- Static assets: https://www.remotion.dev/docs/staticfile
- Rendering API: https://www.remotion.dev/docs/renderer/render-media
- License and compliance guidance: https://www.remotion.dev/docs/licensing

These links are source references, not permission to fetch remote private media, install packages, use hosted rendering, or bypass workspace approval rules.
