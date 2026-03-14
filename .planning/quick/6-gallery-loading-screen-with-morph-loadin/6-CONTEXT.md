# Quick Task 6: Gallery Loading Screen with Morph-Loading Component - Context

**Gathered:** 2026-03-14
**Status:** Ready for planning

<domain>
## Task Boundary

Loading photos in /gallery is taking time — add a morph-loading screen using the provided component and only reveal the gallery when all photos are loaded. Integrate the morph-loading React component into the codebase.

</domain>

<decisions>
## Implementation Decisions

### Loading Trigger
- Wait for ALL Three.js textures to finish loading before showing the 3D gallery
- No timeout fallback — ensure zero pop-in by waiting for complete load
- The StellarCardGallery (3D Three.js gallery) is the target component

### Loader Styling
- Replace default black/white squares with maroon (#800020) and gold (#D4AF37)
- Alternate colors across the 4 morphing squares to match wedding palette
- Remove dark mode variant (project has no dark mode)

### Loading UX
- Full-page overlay with cream background covering entire gallery page
- Loading animation centered on the overlay
- Clean reveal transition when all textures are loaded
- No additional text — just the morph animation

### Claude's Discretion
- Transition animation style when switching from loader to gallery
- Whether to create `cn()` utility (needed by morph-loading component) or inline the logic

</decisions>

<specifics>
## Specific Ideas

- Component provided: `morph-loading.tsx` with morph variant and sm/md/lg sizes
- CSS keyframes provided: morph-0 through morph-3 animations
- Must create `cn()` utility at `@/lib/utils` (doesn't exist yet) — install `clsx` + `tailwind-merge`
- Gallery page: `src/app/gallery/page.tsx` renders `StellarCardGallery`
- 3D gallery: `src/components/ui/3d-image-gallery.tsx` uses Three.js textures
- CSS file: `src/app/globals.css` (Tailwind 4)
- Components path: `src/components/ui/`

</specifics>
