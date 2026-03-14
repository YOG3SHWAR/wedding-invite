---
phase: quick-3
plan: 01
subsystem: seo
tags: [next-metadata, sitemap, robots, json-ld, pwa, opengraph]

requires:
  - phase: none
    provides: n/a
provides:
  - sitemap.xml generation for all routes
  - robots.txt with crawl rules and sitemap reference
  - Web app manifest for PWA/home screen install
  - JSON-LD structured data for wedding event rich results
  - Enhanced OpenGraph metadata on all pages
affects: [deployment, seo]

tech-stack:
  added: []
  patterns: [Next.js Metadata API for sitemap/robots/manifest, JSON-LD server component]

key-files:
  created:
    - src/app/sitemap.ts
    - src/app/robots.ts
    - src/app/manifest.ts
    - src/components/seo/json-ld.tsx
  modified:
    - src/app/layout.tsx
    - src/app/gallery/page.tsx
    - src/app/gifts/page.tsx
    - src/app/guests/page.tsx

key-decisions:
  - "Used Next.js Metadata API functions (not static files) for sitemap, robots, and manifest"
  - "Guests page excluded from search indexing via noindex/nofollow for privacy"
  - "JSON-LD uses Event schema with multi-day date range (26-28 Apr)"

patterns-established:
  - "SEO metadata pattern: sub-pages add page-specific openGraph that merges with root layout metadata"
  - "JSON-LD as server component rendered in body before main content"

requirements-completed: [SEO-01]

duration: 2min
completed: 2026-03-14
---

# Quick Task 3: SEO Optimization Summary

**Sitemap, robots.txt, web manifest, JSON-LD structured data, and per-page OpenGraph metadata using Next.js Metadata API**

## Performance

- **Duration:** 2 min
- **Started:** 2026-03-14T11:30:59Z
- **Completed:** 2026-03-14T11:32:47Z
- **Tasks:** 2
- **Files modified:** 8

## Accomplishments
- Sitemap.xml with all 4 routes, weekly change frequency, and proper priority weighting
- Robots.txt allowing crawling everywhere except /guests (private) and /api/*
- Web app manifest enabling Add to Home Screen on mobile with maroon theme
- JSON-LD Event schema for rich search results showing wedding event details
- Per-page OpenGraph metadata on gallery and gifts pages
- Guests page marked noindex/nofollow for privacy

## Task Commits

Each task was committed atomically:

1. **Task 1: Add sitemap.ts, robots.ts, and manifest.ts** - `6336de8` (feat)
2. **Task 2: Add JSON-LD structured data and enhance page metadata** - `e69bf9c` (feat)

## Files Created/Modified
- `src/app/sitemap.ts` - Dynamic sitemap generation for all 4 routes
- `src/app/robots.ts` - Robots.txt with crawl rules and sitemap URL
- `src/app/manifest.ts` - PWA manifest with wedding theme colors and icons
- `src/components/seo/json-ld.tsx` - JSON-LD Event schema server component
- `src/app/layout.tsx` - Added keywords, canonical, theme-color, WeddingJsonLd
- `src/app/gallery/page.tsx` - Added OpenGraph metadata
- `src/app/gifts/page.tsx` - Added OpenGraph metadata
- `src/app/guests/page.tsx` - Added noindex/nofollow robots directive

## Decisions Made
- Used Next.js Metadata API functions rather than static files for sitemap, robots, and manifest -- allows dynamic base URL from environment variable
- Guests page excluded from indexing (noindex/nofollow) since it contains private guest list data
- JSON-LD uses schema.org/Event with date range covering all three days of celebrations (Tilak through Shadi)

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Steps
- Set `NEXT_PUBLIC_SITE_URL` environment variable to production URL before deployment
- Place a real OG image at `public/images/og-image.jpg` for social sharing previews

---
*Quick Task: 3-i-want-to-optimise-seo-for-this-website*
*Completed: 2026-03-14*
