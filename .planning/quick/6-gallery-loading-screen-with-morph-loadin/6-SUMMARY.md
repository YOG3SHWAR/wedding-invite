---
phase: quick-6
plan: 01
subsystem: gallery
tags: [loading, animation, ux, three-js]
dependency_graph:
  requires: [3d-image-gallery, placeholder-data]
  provides: [morph-loading-component, cn-utility, gallery-loading-screen]
  affects: [gallery-page, globals-css]
tech_stack:
  added: [clsx, tailwind-merge]
  patterns: [image-preloading, conditional-render-loading-state]
key_files:
  created:
    - src/lib/utils.ts
    - src/components/ui/morph-loading.tsx
    - src/app/gallery/layout.tsx
  modified:
    - src/app/globals.css
    - src/components/ui/3d-image-gallery.tsx
    - src/app/gallery/page.tsx
decisions:
  - Metadata moved to layout.tsx since client components cannot export metadata
  - ImagePreloader resolves on both onload and onerror to prevent hanging
  - Gallery mounted at opacity 0 during load so Three.js can initialize textures
metrics:
  duration: 2m 13s
  completed: 2026-03-14
---

# Quick Task 6: Gallery Loading Screen with Morph Loading Summary

Morph-loading animation overlay on /gallery page using maroon (#800020) and gold (#D4AF37) morphing squares on cream background, with image preloading and 0.6s fade-in reveal.

## What Was Done

### Task 1: Create cn() utility, MorphLoading component, and morph keyframes
**Commit:** cf76290

- Created `src/lib/utils.ts` with `cn()` utility combining clsx + tailwind-merge
- Created `src/components/ui/morph-loading.tsx` with 4 morphing squares in a 2x2 grid
  - Squares alternate maroon (#800020) and gold (#D4AF37)
  - Each square uses a unique morph keyframe (morph-0 through morph-3) with 1.6s infinite loop
  - Supports sm/md/lg sizes (24px, 48px, 64px)
- Added 4 morph keyframe animations to `src/app/globals.css`

### Task 2: Integrate loading screen into gallery page with image preloading
**Commit:** f589194

- Added `ImagePreloader` component inside `3d-image-gallery.tsx` that:
  - Gets cards from useCard() context
  - Creates Image objects for all card thumbnails
  - Uses Promise.all to wait for all images (resolves on error too)
  - Calls `onReady` callback when complete
- Added `onReady` prop to `StellarCardGallery` component
- Converted `src/app/gallery/page.tsx` to client component with loading state
  - Shows cream-background overlay with MorphLoading while images load
  - Gallery mounted but hidden (opacity: 0) so Three.js can initialize
  - Fades in over 0.6s when all thumbnails loaded
- Created `src/app/gallery/layout.tsx` as server component for metadata (title, OG)

## Deviations from Plan

None - plan executed exactly as written.

## Verification

- TypeScript: `npx tsc --noEmit` passes with zero errors
- Build: `npm run build` completes successfully, all routes generated
- Gallery page renders loading overlay on initial load
- Gallery fades in after all card thumbnail images are loaded

## Self-Check: PASSED

All 6 files verified present. Both commits (cf76290, f589194) confirmed in git log.
