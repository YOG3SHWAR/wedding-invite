# Quick Task 2: Gallery page slow load + tap interaction broken - Context

**Gathered:** 2026-03-14
**Status:** Ready for planning

<domain>
## Task Boundary

Gallery page takes a lot of time to load and tapping photos doesn't open them, tapping on text does

</domain>

<decisions>
## Implementation Decisions

### Image Optimization Strategy
- Use Next.js Image component for automatic WebP/AVIF conversion, responsive srcSet, and built-in lazy loading
- Replace plain `<img>` tags with Next.js `<Image>` in the gallery components
- This gives auto-optimization without manual compression or external CDN dependency

### Tap Target Behavior
- Keep the current CardModal behavior (3D perspective card that comes into focus)
- Fix the tap interaction so tapping the photo image itself triggers the modal open
- Currently the HTML overlay has `pointerEvents: "none"` which prevents direct taps on photos
- The invisible THREE.js Plane click handler works but doesn't reliably capture taps on the visible photo area

### Claude's Discretion
- 3D gallery structure: Keep the starfield 3D gallery as-is, only fix performance and interaction bugs
- Specific optimization levels for Next.js Image (quality, sizes breakpoints)

</decisions>

<specifics>
## Specific Ideas

- The `pointerEvents: "none"` on the `<Html>` wrapper in FloatingCard is the root cause of tap issues
- Images in `/public/images/gallery/` are 20MB total, some individual photos 2.5MB+
- 28 total images rendered in 3D canvas
- StarfieldBackground with 8000 stars adds GPU overhead

</specifics>
