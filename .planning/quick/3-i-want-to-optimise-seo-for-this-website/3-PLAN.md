---
phase: quick-3
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - src/app/layout.tsx
  - src/app/sitemap.ts
  - src/app/robots.ts
  - src/app/manifest.ts
  - src/components/seo/json-ld.tsx
  - src/app/page.tsx
  - src/app/gallery/page.tsx
  - src/app/gifts/page.tsx
  - src/app/guests/page.tsx
autonomous: true
requirements: [SEO-01]

must_haves:
  truths:
    - "Search engines can discover all pages via sitemap.xml"
    - "robots.txt allows crawling and points to sitemap"
    - "Rich results possible via JSON-LD structured data for wedding event"
    - "All pages have unique, descriptive metadata with OG tags"
    - "Web manifest enables Add to Home Screen on mobile"
  artifacts:
    - path: "src/app/sitemap.ts"
      provides: "Dynamic sitemap generation for all routes"
      exports: ["default"]
    - path: "src/app/robots.ts"
      provides: "Robots.txt configuration"
      exports: ["default"]
    - path: "src/app/manifest.ts"
      provides: "Web app manifest for PWA/mobile"
      exports: ["default"]
    - path: "src/components/seo/json-ld.tsx"
      provides: "JSON-LD structured data component for wedding events"
      exports: ["WeddingJsonLd"]
  key_links:
    - from: "src/app/sitemap.ts"
      to: "NEXT_PUBLIC_SITE_URL"
      via: "env variable for absolute URLs"
      pattern: "NEXT_PUBLIC_SITE_URL"
    - from: "src/components/seo/json-ld.tsx"
      to: "src/app/layout.tsx"
      via: "rendered in body for search engines"
      pattern: "WeddingJsonLd"
---

<objective>
Optimize SEO for the wedding invite website by adding sitemap, robots.txt, JSON-LD structured data, web manifest, and enhancing existing metadata across all pages.

Purpose: Improve discoverability on search engines and enable rich results for wedding event information. Also improve mobile experience with web manifest for home screen install.
Output: Complete SEO infrastructure — sitemap.ts, robots.ts, manifest.ts, JSON-LD component, and enhanced metadata on all pages.
</objective>

<execution_context>
@./.claude/get-shit-done/workflows/execute-plan.md
@./.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@src/app/layout.tsx
@src/app/page.tsx
@src/app/gallery/page.tsx
@src/app/gifts/page.tsx
@src/app/guests/page.tsx
</context>

<tasks>

<task type="auto">
  <name>Task 1: Add sitemap.ts, robots.ts, and manifest.ts</name>
  <files>src/app/sitemap.ts, src/app/robots.ts, src/app/manifest.ts</files>
  <action>
    Create `src/app/sitemap.ts` using Next.js Metadata API:
    - Export default function returning MetadataSitemap array
    - Include all 4 routes: `/`, `/gallery`, `/gifts`, `/guests`
    - Use `process.env.NEXT_PUBLIC_SITE_URL || 'https://yogiandsudha.com'` as base URL
    - Set lastModified to current date, changeFrequency to 'weekly', priority 1.0 for home, 0.8 for sub-pages

    Create `src/app/robots.ts` using Next.js Metadata API:
    - Export default function returning Robots object
    - Allow all user agents on all paths
    - Disallow `/guests` (private guest list page) and `/api/*`
    - Include sitemap URL pointing to `${SITE_URL}/sitemap.xml`

    Create `src/app/manifest.ts` using Next.js Metadata API:
    - Export default function returning MetadataManifest
    - name: "Yogi & Sudha's Wedding"
    - short_name: "Yogi Sudha Wedding"
    - description: "Wedding invitation for Yogi & Sudha — 28 April 2026"
    - start_url: "/"
    - display: "standalone"
    - background_color: "#FFF8F0" (cream)
    - theme_color: "#800020" (maroon)
    - icons: reference existing /icon-192.jpg and /icon-512.jpg with proper sizes
  </action>
  <verify>
    <automated>cd /Users/yogeshwarchaturvedi/Documents/yogi/wedding-invite && npx next build 2>&1 | tail -20</automated>
  </verify>
  <done>sitemap.xml, robots.txt, and manifest.json are generated at build time with correct content</done>
</task>

<task type="auto">
  <name>Task 2: Add JSON-LD structured data and enhance page metadata</name>
  <files>src/components/seo/json-ld.tsx, src/app/layout.tsx, src/app/page.tsx, src/app/gallery/page.tsx, src/app/gifts/page.tsx, src/app/guests/page.tsx</files>
  <action>
    Create `src/components/seo/json-ld.tsx`:
    - Export a `WeddingJsonLd` server component (no 'use client')
    - Render a `<script type="application/ld+json">` tag with JSON-LD
    - Include Event schema (schema.org/Event) with:
      - name: "Yogi & Sudha's Wedding Celebration"
      - startDate: "2026-04-26" (Tilak starts the events)
      - endDate: "2026-04-28" (Shadi day)
      - eventAttendanceMode: "OfflineEventAttendanceMode"
      - eventStatus: "EventScheduled"
      - description: "Join Yogi & Sudha for their wedding celebration. Events include Tilak (26 Apr), Mehndi & Sangeet (27 Apr), and Haldi & Shadi (28 Apr 2026)."
      - image: `${SITE_URL}/images/og-image.jpg`
      - organizer with name "Yogi & Sudha"
    - Use `JSON.stringify` with proper escaping

    Update `src/app/layout.tsx` metadata:
    - Add `keywords: ['wedding', 'Yogi and Sudha', 'wedding invitation', 'Indian wedding', 'April 2026']`
    - Add `alternates: { canonical: '/' }` (relative, metadataBase handles prefix)
    - Add `other: { 'theme-color': '#800020' }` for mobile browser chrome
    - Keep ALL existing metadata unchanged (title, description, openGraph, twitter, icons)
    - Import and render `<WeddingJsonLd />` inside `<body>` before AnimationProvider

    Update sub-page metadata in gallery, gifts, guests pages:
    - Add `openGraph` with page-specific title and description to each page
    - Gallery: OG image pointing to `/images/og-image.jpg`, type 'website'
    - Gifts: OG image pointing to `/images/og-image.jpg`, type 'website'
    - Guests: Add `robots: { index: false, follow: false }` to keep guest list private
  </action>
  <verify>
    <automated>cd /Users/yogeshwarchaturvedi/Documents/yogi/wedding-invite && npx next build 2>&1 | tail -20</automated>
  </verify>
  <done>JSON-LD renders in HTML source. All pages have rich OG metadata. Guests page is noindex. Build succeeds without errors.</done>
</task>

</tasks>

<verification>
- `npx next build` completes without errors
- After `npx next start`, verify:
  - `curl localhost:3000/sitemap.xml` returns valid XML with 4 URLs
  - `curl localhost:3000/robots.txt` returns valid robots with sitemap reference and /guests disallowed
  - `curl localhost:3000/manifest.json` returns valid JSON manifest
  - `curl localhost:3000 | grep 'application/ld+json'` finds JSON-LD script tag
  - `curl localhost:3000 | grep 'og:'` finds OpenGraph meta tags
  - `curl localhost:3000/guests | grep 'noindex'` finds robots noindex meta tag
</verification>

<success_criteria>
- All 4 SEO infrastructure files created and generating correct output
- JSON-LD structured data present in page HTML
- All pages have unique, descriptive OG metadata
- Guests page excluded from indexing
- Build passes cleanly
</success_criteria>

<output>
After completion, create `.planning/quick/3-i-want-to-optimise-seo-for-this-website/3-SUMMARY.md`
</output>
