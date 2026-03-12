# Quick Task 1: Add dramatic interactive cursor/tap-based background effects - Context

**Gathered:** 2026-03-12
**Status:** Ready for planning

<domain>
## Task Boundary

The website background is currently a flat cream (#FFF8F0) and feels bland. Add dramatic, interactive background effects that respond to cursor movement (desktop) and touch/tap (mobile). Must use the frontend-design skill during execution.

</domain>

<decisions>
## Implementation Decisions

### Effect Types
- **Gold particle trail:** Cursor/finger leaves a trail of gold sparkles and particles that drift and fade — fits the royal wedding aesthetic
- **Subtle parallax depth:** Background decorative elements (mandalas, paisleys) shift slightly based on cursor position creating a 3D depth feel

### Intensity
- **Bold & always-on:** Large, prominent particles/effects visible at all times — a constant visual spectacle, not subtle

### Technology
- **HTML5 Canvas overlay:** Best for many particles, smooth 60fps, low memory. Handles complex effects well for the gold particle system

### Claude's Discretion
- Exact particle count, size range, and fade behavior
- How parallax depth layers are structured
- Mobile touch adaptation details (touch vs cursor differences)
- Performance optimization thresholds

</decisions>

<specifics>
## Specific Ideas

- Gold particles should use the existing gold (#D4AF37) color palette with variations
- Particles should feel "royal" — think gold dust, sparkles, not generic dots
- Parallax elements could be faint mandala/paisley outlines that shift on cursor move
- Must respect `prefers-reduced-motion` (existing AnimationProvider pattern)
- Canvas should be behind all content (z-index management)
- Must work smoothly on mobile (300+ guests sharing via WhatsApp, many on phones)
- Use `frontend-design` skill during UI execution — hard requirement from user

</specifics>
