# Stack Research

**Domain:** Modern Indian Wedding Website (animated, RSVP, bilingual)
**Researched:** 2026-03-11
**Confidence:** HIGH

## Recommended Stack

### Core Technologies

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| Next.js | 16.1 | Full-stack React framework | SSG/SSR hybrid, image optimization, file-based routing, Vercel-native deployment. Turbopack stable for fast dev builds. The standard for production React sites in 2026. |
| React | 19.2 | UI library | Current stable. Server Components support, improved performance. Ships with Next.js 16. |
| TypeScript | 5.8 (stable) | Type safety | Use 5.8 stable, not 6.0 RC. Catches bugs early, improves DX with autocompletion. Next.js has first-class TS support. |
| Tailwind CSS | 4.2 | Utility-first CSS | 5x faster builds than v3, CSS-first config, responsive utilities baked in. Perfect for mobile-first design with bold/vibrant custom color palettes. No CSS-in-JS runtime cost. |
| Motion (formerly Framer Motion) | 12.x | Scroll & UI animations | The standard React animation library (18M+ monthly npm downloads). Native ScrollTimeline support for hardware-accelerated scroll animations. Covers all needs: fade-in, parallax, slide effects, viewport-triggered animations. |
| Firebase (Firestore) | 12.x | RSVP data storage | Free Spark plan: 50K reads/20K writes per day, 1GB storage. More than enough for 300+ RSVPs. Real-time updates, simple SDK, no server needed. |
| Vercel | -- | Hosting & deployment | Native Next.js host. Free Hobby tier: 100GB bandwidth, automatic HTTPS, preview deployments. Git push to deploy. |

### Supporting Libraries

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `motion/react` | 12.x | Scroll-triggered animations | Import from `motion/react` (not `framer-motion`). Use `whileInView`, `useScroll`, `useTransform` for all scroll effects. |
| `react-intersection-observer` | 10.x | Viewport detection | Lightweight alternative for simple "animate when visible" triggers. Use alongside Motion for performance-critical sections. |
| `embla-carousel-react` | 8.6 | Photo carousel/gallery | Lightweight (dependency-free), great touch/swipe support for mobile. Use for photo gallery carousel and event cards. |
| `yet-another-react-lightbox` | 3.x | Photo lightbox | Full-screen photo viewer with zoom, swipe, captions. Pairs with gallery grid for "tap to expand" UX. |
| `react-player` | 2.x | Video embedding | Wraps YouTube/Vimeo/direct video URLs. Lazy loads, responsive. Use for pre-wedding shoot videos. |
| `@vercel/analytics` | 1.x | Page analytics | Free with Vercel Hobby. Track RSVP page visits, mobile vs desktop split. Zero config. |
| `next-intl` | -- | Bilingual content (optional) | Only if you later want a Hindi/English toggle. For pre-mixed content (current plan), plain JSX with Hindi strings is simpler -- skip this. |

### Development Tools

| Tool | Purpose | Notes |
|------|---------|-------|
| `pnpm` | Package manager | Faster installs, stricter dependency resolution than npm. Next.js recommends it. |
| `eslint` + `@next/eslint-plugin-next` | Linting | Ships with `create-next-app`. Catches Next.js-specific issues (image optimization, metadata). |
| `prettier` + `prettier-plugin-tailwindcss` | Formatting | Auto-sorts Tailwind classes. Consistent code style. |
| `@tailwindcss/vite` | Tailwind integration | Tailwind v4 uses Vite-based build. Next.js 16 + Turbopack handles this natively. |
| VS Code + Tailwind CSS IntelliSense | Editor support | Autocomplete for Tailwind classes. Essential for productivity. |

## Installation

```bash
# Create project
pnpm create next-app@latest wedding-invite --typescript --tailwind --app --turbopack

# Core animation & UI
pnpm add motion react-intersection-observer embla-carousel-react embla-carousel-autoplay

# Gallery & media
pnpm add yet-another-react-lightbox react-player

# Firebase (RSVP backend)
pnpm add firebase

# Analytics (optional)
pnpm add @vercel/analytics

# Dev dependencies
pnpm add -D prettier prettier-plugin-tailwindcss
```

## Alternatives Considered

| Recommended | Alternative | When to Use Alternative |
|-------------|-------------|-------------------------|
| Next.js (SSG) | Astro | If you want even smaller JS bundles and don't need React interactivity. But Astro's React integration adds complexity, and Next.js image optimization is superior for photo-heavy sites. |
| Tailwind CSS | CSS Modules | If the team strongly prefers writing traditional CSS. But for a bold/vibrant design with many responsive breakpoints, Tailwind is dramatically faster to develop with. |
| Motion | GSAP + ScrollTrigger | If you need cinema-grade timeline animations (e.g., complex SVG morphing). But GSAP has licensing nuances for commercial use, and Motion covers 95% of wedding site animation needs with simpler React integration. |
| Firebase Firestore | Google Sheets API | If you want zero-cost and spreadsheet-based RSVP management. But Sheets API has rate limits (60 reads/min), no real-time updates, and requires a service account. Firebase is simpler and more reliable. |
| Firebase Firestore | Supabase | If you want SQL/Postgres. But Supabase free tier is more limited (500MB, 50K monthly active users) and adds unnecessary complexity for a simple RSVP form. |
| Embla Carousel | Swiper | If you need complex carousel features (3D effects, virtual slides). But Swiper is 5x heavier and Embla's lightweight touch handling is better for low-end mobile devices. |
| `yet-another-react-lightbox` | PhotoSwipe | If you need the absolute best pinch-to-zoom on mobile. But YARL has simpler React integration and covers wedding gallery needs. |

## What NOT to Use

| Avoid | Why | Use Instead |
|-------|-----|-------------|
| `framer-motion` (package name) | Deprecated package name. Still works but new features only in `motion`. | `motion` (import from `motion/react`) |
| Create React App (CRA) | Dead project, no SSG, no image optimization, no file routing | Next.js |
| Chakra UI / Material UI | Heavy component libraries add 100KB+ to bundle. Wedding site needs custom bold aesthetic, not generic component look. | Tailwind CSS + custom components |
| AOS (Animate On Scroll) | jQuery-era library, not React-native, poor tree-shaking | Motion `whileInView` |
| `react-slick` / Slick Carousel | jQuery dependency, heavy, poor mobile touch support | Embla Carousel |
| MongoDB Atlas / Planetscale | Overkill for 300 RSVPs. Requires server-side code or API routes. | Firebase Firestore (serverless, client SDK) |
| Contentful / Sanity CMS | Over-engineering. Content is static (event details, couple's story). Hardcode in components. | Static content in Next.js components/JSON |
| `styled-components` / Emotion | CSS-in-JS has runtime cost, poor server component support in Next.js 16 | Tailwind CSS (zero runtime) |
| Redux / Zustand | No complex client state to manage. RSVP form state is local. | React `useState` / `useActionState` |

## Stack Patterns by Variant

**If you want Google Sheets instead of Firebase (simpler for non-technical RSVP management):**
- Use Next.js API Route as a proxy to Google Sheets API
- Trade-off: No real-time updates, rate-limited, but RSVP data visible in Google Sheets UI
- Only consider if the wedding organizer refuses to learn Firebase console

**If you want even faster load times on slow Indian mobile networks:**
- Use Next.js Static Export (`output: 'export'`) for pure static site
- Trade-off: Lose API routes (must call Firebase directly from client), lose ISR
- Good trade-off since Firebase client SDK works fine from browser

**If you want to add a Hindi/English toggle later:**
- Add `next-intl` with JSON translation files
- Current plan (pre-mixed content) is simpler and correct for this use case

## Version Compatibility

| Package A | Compatible With | Notes |
|-----------|-----------------|-------|
| Next.js 16.1 | React 19.2 | Bundled together, versions must match |
| Next.js 16.1 | Tailwind CSS 4.2 | Native support via `@tailwindcss/postcss` |
| Motion 12.x | React 19.2 | Full support, including Server Components |
| Firebase 12.x | Next.js 16.1 | Client SDK only; use in client components (`"use client"`) |
| Embla Carousel 8.6 | React 19 | Peer dependency updated for React 19 |
| TypeScript 5.8 | Next.js 16.1 | Fully supported. Avoid TS 6.0 RC in production. |

## Performance Budget

For low-end mobile devices on Indian 4G networks:

| Metric | Target | How to Achieve |
|--------|--------|----------------|
| First Contentful Paint | < 1.5s | SSG, optimized images via `next/image`, Tailwind (no runtime CSS) |
| Largest Contentful Paint | < 2.5s | Priority loading for hero image, lazy load below-fold images |
| Total JS bundle | < 150KB gzipped | Tree-shake Motion, lazy load Firebase SDK, code-split routes |
| Image sizes | < 100KB each | WebP via `next/image`, responsive srcset, blur placeholders |
| Time to Interactive | < 3s | Defer animations, lazy load carousel/lightbox/video player |

## Sources

- [Next.js 16.1 Blog](https://nextjs.org/blog/next-16-1) -- version and features verified
- [Tailwind CSS v4.2 Release](https://tailwindcss.com/blog) -- version confirmed via GitHub releases
- [Motion (formerly Framer Motion)](https://motion.dev/) -- v12.x, import path verified
- [Firebase Pricing](https://firebase.google.com/pricing) -- Spark plan limits verified
- [Vercel Hobby Plan](https://vercel.com/docs/plans/hobby) -- free tier limits verified
- [Embla Carousel](https://www.embla-carousel.com/) -- v8.6, React 19 peer dep confirmed
- [react-intersection-observer npm](https://www.npmjs.com/package/react-intersection-observer) -- v10.x confirmed
- [Yet Another React Lightbox](https://yet-another-react-lightbox.com/) -- gallery/lightbox verified
- [React 19.2 Blog](https://react.dev/blog/2025/10/01/react-19-2) -- latest stable confirmed
- [TypeScript Releases](https://github.com/microsoft/typescript/releases) -- 5.8 stable, 6.0 RC status

---
*Stack research for: Modern Indian Wedding Website*
*Researched: 2026-03-11*
