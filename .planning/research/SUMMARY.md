# Project Research Summary

**Project:** Modern Indian Wedding Invitation Website (Yogeshwarchaturvedi)
**Domain:** Animated Indian Wedding Website — digital invitation + multi-event RSVP
**Researched:** 2026-03-11
**Confidence:** HIGH

## Executive Summary

A custom Indian wedding website for a 5-event celebration (Tilak, Mehndi, Sangeet, Haldi, Shadi) serving 300+ guests is best built as a single-page scrolling experience using Next.js (SSG) + Tailwind CSS + Motion (animations) + Firebase Firestore (RSVP backend), deployed on Vercel. The site is fundamentally a static, content-driven presentation with one interactive backend concern: day-wise RSVP collection. Because the audience will predominantly arrive via a WhatsApp link on low-end Android phones on Indian 4G networks, performance is a first-class constraint — not an afterthought. The single most important architectural decision is to treat this as a static site with one write-only API endpoint, not a dynamic web application.

The recommended approach separates concerns cleanly: all wedding content lives in typed TypeScript data files (no CMS), all animations are decoupled into reusable wrapper components, and the RSVP form sends a single document write to Firestore through a Next.js API route. This keeps the client bundle minimal, credentials server-side, and the content update workflow as simple as editing a `.ts` file and pushing to git. The bold, vibrant, maximalist aesthetic expected of an Indian wedding site is achieved through a deeply customized Tailwind theme — not a heavy component library — keeping the bundle well under 150KB gzipped.

The primary risks are performance-related: heavy scroll animations causing jank on budget Android devices, unoptimized images bloating page weight, and Hindi (Devanagari) fonts causing Flash of Invisible Text on slow connections. All three risks are addressable in Phase 1 by establishing firm budgets and patterns before any feature work begins. Secondary risk is RSVP UX — the form must be dead-simple (3 fields maximum, large touch targets, unmissable confirmation) because a significant portion of guests will be non-tech-savvy family members in their 40s-70s accessing via WhatsApp.

## Key Findings

### Recommended Stack

The stack is well-established and all versions are current stable (as of 2026-03-11). Next.js 16.1 with React 19.2 provides SSG for blazing-fast first loads and Turbopack for rapid development. Tailwind CSS 4.2 (5x faster builds than v3, zero runtime cost) handles the bold/vibrant custom theme. Motion 12.x (formerly Framer Motion) is the standard React animation library with native ScrollTimeline support for hardware-accelerated scroll effects. Firebase Firestore (Spark free plan) is purpose-fit for the RSVP use case: 50K reads/20K writes per day is 100x the volume needed for 300 guests, no server required, and real-time updates work out of the box.

**Core technologies:**
- **Next.js 16.1:** Full-stack React framework — SSG/SSR hybrid, image optimization, file-based routing, Vercel-native deployment
- **React 19.2:** UI library — Server Components, improved performance; ships bundled with Next.js
- **TypeScript 5.8:** Type safety — use 5.8 stable (NOT 6.0 RC); first-class Next.js support
- **Tailwind CSS 4.2:** Utility-first CSS — 5x faster builds, CSS-first config, perfect for mobile-first vibrant custom palettes
- **Motion 12.x:** Scroll and UI animations — import from `motion/react` (not deprecated `framer-motion`); `whileInView`, `useScroll`, `useTransform`
- **Firebase Firestore 12.x:** RSVP storage — free Spark plan covers 300+ RSVPs with headroom; client SDK used server-side only via API route
- **Vercel:** Hosting — native Next.js host, free Hobby tier (100GB bandwidth), automatic HTTPS, git-push deploy
- **Embla Carousel 8.6:** Photo gallery — lightweight, dependency-free, excellent mobile touch support
- **yet-another-react-lightbox 3.x:** Photo lightbox — full-screen viewer with zoom and swipe
- **pnpm:** Package manager — faster installs, stricter resolution than npm

### Expected Features

The research distinguishes sharply between what guests will assume exists (table stakes) versus features that create a memorable premium experience (differentiators). The key insight is that this audience's expectations are shaped by WhatsApp usage, not desktop web browsing — the OG meta tag preview is the first impression for most guests.

**Must have (table stakes — launch blockers):**
- Hero section with couple names + wedding date — first impression, establishes the event
- Countdown timer to wedding day — every wedding site has one; creates anticipation
- Event details for all 5 events (Tilak, Mehndi, Sangeet, Haldi, Shadi) — core utility; guests need date/time/venue/dress code/map link
- Day-wise RSVP form with backend — primary CTA; must work flawlessly; failure means the couple calls 150 people
- Mobile-first responsive design — 80%+ of guests arrive on phone via WhatsApp link
- Bilingual content (Hindi headers/blessings + English logistics) — cultural expectation, not optional
- WhatsApp OG meta tags (og:title, og:description, og:image) — the link preview IS the first impression
- Photo gallery (8-12 photos, lazy loaded) — humanizes the invitation
- Fast load time under 3 seconds on 4G — Indian mobile networks vary; slow sites get abandoned

**Should have (differentiators — add once core works):**
- Scroll-triggered animations (fade-in, parallax, slide) — cinematic, premium feel matching Indian wedding grandeur
- "Our Story" relationship timeline — makes it feel custom, not templated
- Embedded pre-wedding video (YouTube facade, not self-hosted) — most engaging format for emotional connection
- Per-event visual identity (distinct color accents per event) — makes the scroll feel like a journey
- RSVP confirmation with event summary — polish on the RSVP flow
- Bold, vibrant visual design (gold/maroon/emerald palette, display fonts) — maximalist aesthetic that matches Indian weddings
- Registry/gifts section — guides gift-giving gracefully

**Defer to v2+:**
- Dress code visuals (outfit example images) — nice but not critical
- Add to Calendar buttons per event — convenient but adds complexity
- Accommodation/travel info section — useful for out-of-town guests
- Custom domain — adds polish, costs money; free Vercel subdomain works fine for WhatsApp sharing

**Confirmed anti-features (do not build):**
- Guest login/authentication — kills completion rate for 300 guests arriving via WhatsApp
- Language toggle — doubles maintenance; Indian audiences read mixed Hindi-English naturally
- Admin dashboard — Firebase Console is sufficient for a one-time event
- Background music autoplay — browsers block it; accessibility nightmare
- Live guest photo upload wall — use shared Google Photos album instead

### Architecture Approach

The site follows a single-page section composition pattern: one `page.tsx` composes all scroll sections in order, each section is a standalone component in `components/sections/`, animation concerns are isolated in reusable `components/animation/` wrapper components, and all wedding-specific content lives in typed TypeScript files in a `content/` directory. The only server-side logic is a thin Next.js API route (`/api/rsvp`) that validates and writes to Firestore — Firebase Admin credentials never reach the browser bundle. The entire presentation layer is SSG-rendered at build time and served from Vercel's CDN, with Motion animations activating on hydration.

**Major components:**
1. **Hero + Countdown** — Couple names, wedding date, live countdown interval (isolated in `React.memo` to prevent re-render cascade), dramatic entrance animation
2. **Event Schedule** — 5-event card grid grouped by day; static data from `content/events.ts`; drives RSVP day groupings
3. **Photo Gallery + Lightbox** — Responsive grid with `next/image` optimization; lazy-loaded; lightbox modal for full-screen view
4. **RSVP Form** — Day-wise checkboxes (max 3 fields), client validation, POST to `/api/rsvp`, full-screen confirmation overlay
5. **Animation Wrappers** — `FadeInOnScroll`, `SlideIn`, `ParallaxWrapper`, `StaggerChildren` — generic wrappers decoupled from content
6. **Content Data Files** — `events.ts`, `story.ts`, `gallery.ts`, `site.ts` in `/content` — typed, editable without touching component logic
7. **Firebase Integration** — `lib/firebase.ts` (client init) + `lib/rsvp.ts` (submission logic); isolated so backend can swap without touching UI

**Key patterns:**
- Content-driven rendering: wedding data in TS files, never hardcoded in JSX
- Write-only Firestore client: guests can submit RSVPs but cannot read other guests' data
- Animation as progressive enhancement: every animated section must work without animation
- Static map links over embedded iframes: 5 Google Maps iframes would catastrophically hurt performance

### Critical Pitfalls

1. **Heavy scroll animations causing mobile jank** — Use only `transform` and `opacity` for animations (GPU-composited). Detect `prefers-reduced-motion` AND `navigator.hardwareConcurrency <= 4` to disable parallax on low-end devices. Cap animations at 5-8 per viewport. Test on a real Redmi/Realme, not Chrome DevTools simulation. This must be addressed in Phase 1 — retrofitting is painful.

2. **Unoptimized images/video destroying load time** — Every image through `next/image` for automatic WebP/AVIF and lazy loading. Hard budget: no single image above 150KB in production, total initial page weight under 2MB. Never self-host video — YouTube facade pattern (show thumbnail, load iframe on click) alone saves 2-4 seconds on LCP. Enforce in Phase 1 before any content is added.

3. **RSVP form UX alienating non-tech-savvy guests** — Maximum 3 fields (name, phone, day checkboxes). No multi-step wizard. No email field. No CAPTCHA. 56px minimum touch targets. Full-screen success confirmation with Hindi text ("Aapka RSVP mil gaya!"). Test with a real family member aged 40-70 before shipping. A failed RSVP forces the couple to call every guest manually — this is the highest-consequence feature.

4. **Devanagari font causing render-blocking FOIT** — Self-host WOFF2 (do not use Google Fonts CDN). Subset to wedding vocabulary (50-100 unique characters). `font-display: swap`. Preload the font file. Keep decorative Hindi fonts to 1-2 weights maximum, under 100KB each. Establish in Phase 1 with the typography system.

5. **Firebase Firestore security rules left open** — Firestore rules must be write-only from client (guests can `create` but not `read`, `update`, or `delete`). No client-side reads of the RSVP collection ever — manage via Firebase Console. Add localStorage deduplication flag to prevent accidental double-submissions. A breach here exposes guest phone numbers.

## Implications for Roadmap

Based on the combined research, the architecture's build order and pitfall-to-phase mapping both converge on 5 phases. Phase 1 is disproportionately important — most critical decisions (performance budget, animation strategy, font loading, Tailwind theme) must be locked in before feature work to avoid expensive retrofitting.

### Phase 1: Foundation and Design System

**Rationale:** All subsequent work depends on the Tailwind theme tokens, animation wrapper components, content data structure, and performance budgets. Starting with content or visuals without this foundation leads to inconsistent design, animation jank, and font loading problems that are expensive to fix later. The pitfall research is unusually emphatic: 4 of 6 critical pitfalls are addressed in Phase 1.

**Delivers:** Project scaffold with pnpm/Next.js/TypeScript/Tailwind; custom color theme (gold, maroon, emerald, deep red); Hindi/English font strategy (self-hosted Noto Sans Devanagari WOFF2 + one decorative display font); reusable animation wrappers (`FadeInOnScroll`, `SlideIn`, `ParallaxWrapper`, `StaggerChildren`) with reduced-motion support and device detection; typed content data files (`events.ts`, `story.ts`, `gallery.ts`, `site.ts`); image optimization pipeline (next/image configuration, performance budget enforcement); performance targets established (LCP < 2.5s, bundle < 150KB gzipped, images < 150KB each).

**Addresses:** Mobile-first responsive foundation, bilingual content scaffolding, WhatsApp OG meta tags setup

**Avoids:** Animation jank (establish GPU-only animation patterns), FOIT (font strategy from day one), inconsistent design (theme tokens before any feature work)

### Phase 2: Core Presentation Sections

**Rationale:** With the foundation in place, all presentation sections can be built in parallel. They are purely static (no backend dependency) and serve as the visual narrative of the invitation. This phase delivers a deployable, shareable URL with full visual fidelity — useful for couple review before any RSVP functionality exists.

**Delivers:** Hero section (couple names, date, entrance animation, countdown timer isolated in `React.memo`), Event Schedule (all 5 events with dates/venues/dress codes/map links, day grouping for RSVP, per-event color accents), Our Story timeline (scrollable milestones with `whileInView` animations), Photo Gallery (responsive grid, lightbox, lazy-loaded), sticky navigation with smooth scroll to section anchors.

**Uses:** Motion `whileInView` for scroll-triggered animations, Embla Carousel for gallery, yet-another-react-lightbox for lightbox, `next/image` for all images

**Implements:** Single-page section composition pattern, content-driven rendering from `content/*.ts` files, animation wrapper components

**Avoids:** Animating everything (per-section animations only, `viewport={{ once: true }}`), eager gallery image loading (lazy-load enforced), countdown timer re-render cascade (isolated component)

### Phase 3: RSVP Backend and Form

**Rationale:** The RSVP feature is the highest-consequence and highest-risk feature. It depends on the event day groupings defined in Phase 2's content data. Isolating it in its own phase ensures focused testing with real family members before launch. Backend is set up first so the form can be tested end-to-end immediately.

**Delivers:** Firebase Firestore setup (project, security rules: write-only from client, no client-side reads), `lib/firebase.ts` and `lib/rsvp.ts`, Next.js API route `/api/rsvp` (POST, server-side validation, Firestore write, error handling), RSVP form component (name + phone + day-wise checkboxes, 3 fields max, 56px touch targets, large bilingual submit button), full-screen success confirmation overlay (Hindi + English), localStorage deduplication flag, offline/error state with retry button, RSVP summary in confirmation screen.

**Avoids:** Client-side Firestore SDK in browser bundle, open security rules, silent form failure, multi-step RSVP wizard, email field requirement

### Phase 4: Enhancements and Polish

**Rationale:** Once the core site is functional and the RSVP is tested, differentiating features can be layered in without risk to the core experience. These are all progressive enhancements — the site remains fully functional without them.

**Delivers:** Embedded pre-wedding video section (YouTube facade with poster thumbnail, iframe loads only on user click), Registry/gifts section (static link cards), RSVP confirmation with event summary display, animation timing tuning across all sections, mobile responsiveness audit and fix pass, Hindi content review by native speaker, Vercel Analytics setup.

**Uses:** `react-player` or `lite-youtube-embed` for video facade, `@vercel/analytics` for traffic tracking

**Avoids:** Eager YouTube iframe loading (facade pattern mandatory), auto-play media

### Phase 5: Pre-Launch Verification

**Rationale:** A dedicated verification phase prevents the "looks done but isn't" failures that the pitfall research specifically calls out. The checklist includes items that are routinely skipped (countdown timezone, noindex meta tag, WhatsApp OG preview verification, real Android device testing) but have high visibility on launch day.

**Delivers:** Performance audit (Lighthouse mobile score > 80, LCP < 2.5s on throttled connection, image sizes verified, bundle size verified), real Android device test (Redmi/Realme preferred), RSVP form test with non-tech-savvy family member, Hindi content verification with native speaker, WhatsApp sharing test (OG preview shows couple names/date/image), countdown timer IST timezone verification, `noindex, nofollow` meta tag confirmed, Firestore security rules audit, bandwidth projection and Vercel dashboard monitoring setup, Vercel preview deployment link for couple approval.

### Phase Ordering Rationale

- Foundation (Phase 1) precedes all visual work because theme tokens, animation patterns, and font strategy affect every component. Retrofitting these is expensive.
- Core presentation (Phase 2) precedes RSVP (Phase 3) because the event data structure defined in Phase 2 content files is a hard dependency for the day-wise RSVP form. Also, a viewable site gives the couple something to review before the backend is live.
- RSVP (Phase 3) is isolated to ensure focused testing. This is the highest-consequence feature — it must not be rushed as an afterthought in a combined phase.
- Enhancements (Phase 4) come last among feature work because they are purely additive. Cutting Phase 4 scope does not affect launch viability.
- Pre-launch (Phase 5) is non-negotiable. The pitfall research explicitly identifies "looks done but isn't" failures that require deliberate verification checklists, not just developer judgment.

### Research Flags

Phases likely needing deeper research during planning:

- **Phase 3 (RSVP):** Firebase Firestore security rules syntax and write-only rule patterns should be validated against current Firebase documentation. The API route implementation pattern (Admin SDK vs client SDK server-side) needs confirmation with the specific Next.js 16 App Router setup.
- **Phase 1 (Hindi fonts):** Devanagari font subsetting with `glyphhanger` or `pyftsubset` may need tooling validation — these are specialized tools with version-specific behavior.

Phases with standard patterns (can skip research-phase):

- **Phase 2 (Presentation sections):** Next.js App Router + Tailwind + Motion scroll animations is an extremely well-documented pattern with extensive community resources. No novel integrations.
- **Phase 4 (Video/enhancements):** YouTube facade pattern is well-documented. `react-player` integration is standard. No novel integrations.
- **Phase 5 (Pre-launch):** Purely a verification checklist, not an implementation phase.

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | All package versions verified against official sources. Version compatibility table cross-checked. No experimental dependencies. |
| Features | HIGH | Feature landscape based on multiple real Indian wedding platforms, competitor analysis, and mobile performance requirements well-documented. |
| Architecture | HIGH | Single-page composition pattern is extremely well-established for wedding websites. Firebase Firestore data model is official-docs-verified. Build order dependency graph is logical and matches real-world implementations. |
| Pitfalls | HIGH | Pitfalls are grounded in specific technical constraints (Firebase rate limits, Vercel bandwidth limits, browser behavior for fonts/autoplay) with exact numbers cited from official sources. |

**Overall confidence:** HIGH

### Gaps to Address

- **Actual wedding event dates and venues:** Content files (`events.ts`) need real event data before the site goes live. This is a content gap, not a research gap — the couple must supply dates, venue names, addresses, and Google Maps links for all 5 events.
- **Photo assets:** The gallery needs 8-20 optimized couple photos. Compression and WebP pipeline is defined, but the source assets are unknown. Budget Jio/Airtel users are the constraint — each photo must be under 150KB post-optimization.
- **Hindi content verification:** Research confirms bilingual content is critical and the architectural approach is correct, but the actual Hindi strings (blessings, headers, event names in Devanagari) must be reviewed by a native Hindi speaker before launch. Developer-written Hindi has a high typo risk.
- **Firebase project setup credentials:** Environment variables for Firestore will need to be configured in Vercel — this is an operational step, not a design decision. The pattern is established; the execution requires a Firebase project to be created.
- **Countdown timer target date:** The IST timezone handling is architecturally defined; the actual wedding date needs to be hardcoded in `content/site.ts`.

## Sources

### Primary (HIGH confidence)
- [Next.js 16.1 Blog](https://nextjs.org/blog/next-16-1) — version features and Turbopack stable status
- [React 19.2 Blog](https://react.dev/blog/2025/10/01/react-19-2) — latest stable confirmed
- [Tailwind CSS v4.2 Release](https://tailwindcss.com/blog) — CSS-first config, build speed improvements
- [Motion (formerly Framer Motion) v12](https://motion.dev/) — import path `motion/react`, ScrollTimeline support
- [Firebase Pricing — Spark Plan](https://firebase.google.com/pricing) — 50K reads/20K writes/day, 1GB storage
- [Firebase Firestore Data Model](https://firebase.google.com/docs/firestore/data-model) — collection/document schema
- [Firebase Firestore Pricing](https://firebase.google.com/docs/firestore/pricing) — quota limits verified
- [Vercel Hobby Plan](https://vercel.com/docs/plans/hobby) — 100GB bandwidth/month
- [Next.js Image Optimization](https://nextjs.org/docs/app/getting-started/images) — WebP/AVIF, lazy load, responsive sizes
- [Next.js Static Site Generation](https://nextjs.org/docs/pages/building-your-application/rendering/static-site-generation) — SSG pattern
- [Framer Motion Scroll Animations](https://motion.dev/docs/react-scroll-animations) — whileInView, useScroll
- [Google Sheets API Rate Limits](https://developers.google.com/workspace/sheets/api/limits) — 300 req/min limit
- [TypeScript Releases](https://github.com/microsoft/typescript/releases) — 5.8 stable, 6.0 RC status
- [Embla Carousel](https://www.embla-carousel.com/) — v8.6, React 19 peer dependency

### Secondary (MEDIUM confidence)
- [WedMeGood](https://www.wedmegood.com/wedding-invitations) — Indian wedding invitation template features
- [Joy Wedding Website Builder](https://withjoy.com/wedding-website/) — RSVP management features
- [PerfectlyWed Online RSVP](https://perfectlywed.in/online-rsvp-wedding-solutions/) — multi-event RSVP tracking for Indian weddings
- [Zola vs Joy vs The Knot Comparison](https://guesticon.com/blog/zola-vs-joy-vs-the-knot-wedding-website-comparison-2025) — platform feature comparison
- [Web Font Performance Best Practices](https://byteofdev.com/posts/speed-up-font-loading/) — self-hosting, subsetting, WOFF2, font-display
- [Motion vs GSAP Comparison](https://motion.dev/docs/gsap-vs-motion) — bundle size and Web Animations API differences

### Tertiary (supporting context)
- [Wedding RSVP with React + Firebase](https://medium.com/swlh/how-i-created-a-wedding-rsvp-app-using-react-styled-components-and-firebase-5b545882b232) — real-world implementation reference
- [Indian Wedding Toolkit — Technology](https://indianweddingtoolkit.com/technology-at-your-wedding/) — tech features for Indian weddings
- [Cloudflare Mobile Performance Guide](https://www.cloudflare.com/learning/performance/how-to-make-a-site-mobile-friendly/) — mobile optimization best practices

---
*Research completed: 2026-03-11*
*Ready for roadmap: yes*
