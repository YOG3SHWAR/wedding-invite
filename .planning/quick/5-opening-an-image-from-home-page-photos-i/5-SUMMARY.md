---
phase: quick-5
plan: 01
subsystem: photo-gallery
tags: [bugfix, lightbox, gallery]
key-files:
  modified:
    - src/components/sections/photo-gallery.tsx
decisions: []
metrics:
  duration: "33s"
  completed: "2026-03-14"
  tasks_completed: 1
  tasks_total: 1
---

# Quick Task 5: Fix Broken Lightbox Images in Home Page Gallery

Use direct image paths instead of constructed /_next/image URLs for lightbox slides.

## What Changed

The lightbox in `photo-gallery.tsx` was constructing slide URLs as `/_next/image?url=...&w=1200&q=85`. This Next.js image optimization URL does not work as a direct image source for `yet-another-react-lightbox`. Changed to use `img.src` directly (e.g., `/images/gallery/photo-01.jpg`), which the lightbox can load natively.

## Tasks Completed

| # | Task | Commit | Files |
|---|------|--------|-------|
| 1 | Fix lightbox slide URLs to use direct image paths | e890cef | src/components/sections/photo-gallery.tsx |

## Deviations from Plan

None - plan executed exactly as written.

## Verification

- `grep -c '_next/image' src/components/sections/photo-gallery.tsx` returns 0 (confirmed)
- Existing test file has a pre-existing dependency issue (`@testing-library/dom` missing) unrelated to this change
- Manual verification: click any gallery thumbnail to confirm lightbox shows full-size image

## Self-Check: PASSED

- [x] src/components/sections/photo-gallery.tsx modified correctly
- [x] Commit e890cef exists
- [x] No `_next/image` references remain in the file
