# Phase 1: Foundation + Design System - Research

**Researched:** 2026-03-11
**Domain:** Next.js project scaffolding, design system tokens, bilingual fonts, animation foundation, performance budgets
**Confidence:** HIGH

## Summary

Phase 1 is a greenfield scaffold of a Next.js 15 project with Tailwind CSS v4, establishing the design system (colors, typography, spacing), bilingual font loading (Hindi/English via `next/font`), a reusable scroll animation wrapper using Motion (formerly Framer Motion), mobile-first responsive foundation, performance budgets, and WhatsApp-optimized OG meta tags.

The stack is well-established and all pieces interoperate cleanly. Next.js 15 with App Router + Tailwind v4 is the current standard for new projects. Motion (v12) is the dominant React animation library with built-in scroll-triggered animation support and accessibility (prefers-reduced-motion). Google Fonts for Devanagari (Yatra One) and English (Playfair Display, Cormorant Garamond) are available via `next/font/google` with automatic self-hosting and subset optimization.

**Primary recommendation:** Use `create-next-app` with TypeScript + Tailwind + App Router defaults, define all design tokens via Tailwind v4's `@theme` directive in CSS, load fonts via `next/font/google` with CSS variables, and create a single `<ScrollReveal>` wrapper component using Motion's `whileInView`.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- Royal & elegant mood — deep maroon (#800020), rich gold (#D4AF37), emerald (#046307), cream/off-white background
- Traditional Indian wedding card aesthetic — ornate borders, gold foil feel, heavy decoration
- Subtle mandala/paisley pattern at section transitions only (decorative dividers, not full-page watermark)
- Gold used for section headings and decorative dividers
- Prominent gold/maroon frames around major sections
- Distinct accent color per event (Tilak, Mehndi, Sangeet, Haldi, Shadi) within the royal palette
- Light theme only — no dark mode
- Hindi headings: Decorative/calligraphic font (Yatra One, Modak, or Tiro Devanagari Hindi)
- English headings: Elegant serif (Playfair Display)
- English body: Cormorant Garamond
- Hindi for section headers and blessings, English for all logistics
- Type scale: Large & dramatic — big bold headings, generous spacing
- Dramatic & cinematic scroll animations — bold fade-ins, slide-ins, parallax
- Bollywood dramatic style — sparkles, gold particle effects, big swooping entrances
- Decorative elements also animate — gold borders draw in, mandala dividers rotate/fade in
- Must respect prefers-reduced-motion
- WhatsApp OG preview: title "Yogi & Sudha Wedding", description with date, 1200x630 image
- **MUST use `frontend-design` Claude skill** during UI execution work

### Claude's Discretion
- Page-load entrance animation (if it fits within 3s 4G performance budget)
- Exact animation timing and easing curves
- Loading skeleton design
- Error state handling
- Specific mandala/paisley SVG patterns for dividers
- Exact gold shimmer/sparkle particle implementation approach
- Compression algorithm for font subsetting

### Deferred Ideas (OUT OF SCOPE)
None — discussion stayed within phase scope
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| HERO-03 | WhatsApp-optimized OG meta tags for beautiful link previews | Next.js App Router static metadata export with openGraph config; static `opengraph-image.jpg` file convention; 1200x630 image dimensions for WhatsApp |
| CONT-02 | Bilingual content — Hindi for headers/blessings, English for logistics | `next/font/google` with Yatra_One (devanagari subset) + Playfair_Display + Cormorant_Garamond; CSS variables for Tailwind integration |
| ANIM-02 | Bold, vibrant visual design — rich colors, large typography, dramatic layouts | Tailwind v4 @theme tokens for colors/spacing/typography; Motion whileInView for scroll reveals; dramatic type scale with clamp() |
| PERF-01 | Mobile-first responsive design (works on low-end Android) | Tailwind mobile-first breakpoints (default = mobile); next/font self-hosting eliminates external requests; Motion uses native ScrollTimeline for GPU acceleration |
| PERF-02 | Fast load time under 3 seconds on 4G | Font subsetting via next/font; Tailwind v4 CSS ~6-12KB gzipped (70% smaller than v3); minimal JS with server components; lazy-load animations below fold |
</phase_requirements>

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Next.js | 15 (latest) | React framework with App Router | Industry standard; built-in font optimization, metadata API, image optimization, Vercel deployment |
| Tailwind CSS | v4 | Utility-first CSS framework | CSS-first config via @theme; 70% smaller output than v3; auto-detects content; no JS config needed |
| Motion | 12.x | Animation library (formerly Framer Motion) | Dominant React animation library; native ScrollTimeline for GPU-accelerated scroll animations; built-in reduced-motion support |
| TypeScript | 5.x | Type safety | Bundled with create-next-app; catches errors at build time |
| React | 19 | UI library | Bundled with Next.js 15; server components reduce client JS |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `next/font/google` | (built-in) | Self-hosted Google Fonts | All font loading — Yatra One, Playfair Display, Cormorant Garamond |
| `@next/bundle-analyzer` | latest | Bundle size analysis | During performance auditing to check JS payload |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Motion | CSS-only animations | CSS is lighter but lacks spring physics, gesture support, and `whileInView` convenience |
| Tailwind v4 | Tailwind v3 | v3 works but v4 is better for new projects — smaller output, CSS-first config |
| canvas-confetti / tsParticles | Custom canvas particles | For gold sparkle/particle effects — evaluate in Phase 2 when building actual decorative animations; Phase 1 only needs the scroll reveal wrapper |

**Installation:**
```bash
npx create-next-app@latest wedding-invite --typescript --tailwind --eslint --app --src-dir
cd wedding-invite
npm install motion
```

## Architecture Patterns

### Recommended Project Structure
```
src/
├── app/
│   ├── layout.tsx           # Root layout: fonts, metadata, global styles
│   ├── page.tsx             # Landing page (placeholder for Phase 1)
│   ├── globals.css          # Tailwind imports + @theme tokens
│   └── opengraph-image.jpg  # Static OG image (1200x630)
├── components/
│   ├── ui/                  # Reusable UI primitives
│   │   └── scroll-reveal.tsx # Reusable scroll animation wrapper
│   └── decorative/          # Mandala dividers, ornate borders (placeholder)
├── lib/
│   ├── fonts.ts             # Font configuration exports
│   └── constants.ts         # Event colors, content strings
└── styles/                  # Additional CSS if needed
```

### Pattern 1: Font Loading with CSS Variables
**What:** Load all 3 Google Fonts via `next/font/google`, expose as CSS variables, map to Tailwind utilities via `@theme`
**When to use:** Always — this is the foundation for all typography
**Example:**
```typescript
// src/lib/fonts.ts
import { Yatra_One, Playfair_Display, Cormorant_Garamond } from 'next/font/google'

export const yatraOne = Yatra_One({
  weight: '400',
  subsets: ['devanagari', 'latin'],
  variable: '--font-hindi',
  display: 'swap',
})

export const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-heading',
  display: 'swap',
})

export const cormorantGaramond = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-body',
  display: 'swap',
})
```

```typescript
// src/app/layout.tsx
import { yatraOne, playfairDisplay, cormorantGaramond } from '@/lib/fonts'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${yatraOne.variable} ${playfairDisplay.variable} ${cormorantGaramond.variable}`}>
      <body>{children}</body>
    </html>
  )
}
```

```css
/* src/app/globals.css */
@import "tailwindcss";

@theme {
  --font-hindi: var(--font-hindi);
  --font-heading: var(--font-heading);
  --font-body: var(--font-body);

  --color-maroon: #800020;
  --color-gold: #D4AF37;
  --color-emerald: #046307;
  --color-cream: #FFF8F0;
  --color-cream-dark: #F5E6D3;

  /* Event accent colors */
  --color-tilak: #C41E3A;
  --color-mehndi: #228B22;
  --color-sangeet: #9B59B6;
  --color-haldi: #F4C430;
  --color-shadi: #800020;

  /* Spacing - generous for dramatic feel */
  --spacing-section: 6rem;
  --spacing-section-mobile: 3rem;
}
```

Usage in components: `font-hindi`, `font-heading`, `font-body`, `text-maroon`, `bg-cream`, `text-gold`, etc.

### Pattern 2: Reusable Scroll Reveal Wrapper
**What:** A `<ScrollReveal>` component using Motion's `whileInView` with built-in reduced-motion support
**When to use:** Wrap any element that should animate on scroll entry
**Example:**
```typescript
// src/components/ui/scroll-reveal.tsx
'use client'

import { motion, type Variants } from 'motion/react'
import { type ReactNode } from 'react'

const variants: Record<string, Variants> = {
  fadeUp: {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0 },
  },
  fadeIn: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
  slideLeft: {
    hidden: { opacity: 0, x: -60 },
    visible: { opacity: 1, x: 0 },
  },
  slideRight: {
    hidden: { opacity: 0, x: 60 },
    visible: { opacity: 1, x: 0 },
  },
}

interface ScrollRevealProps {
  children: ReactNode
  variant?: keyof typeof variants
  delay?: number
  duration?: number
  className?: string
}

export function ScrollReveal({
  children,
  variant = 'fadeUp',
  delay = 0,
  duration = 0.6,
  className,
}: ScrollRevealProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      variants={variants[variant]}
      transition={{ duration, delay, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
```

**Reduced motion:** Motion automatically respects `prefers-reduced-motion` when you wrap the app with `<MotionConfig reducedMotion="user">`. This disables transform animations but preserves opacity transitions.

```typescript
// In layout.tsx or a client wrapper:
import { MotionConfig } from 'motion/react'

function AnimationProvider({ children }: { children: React.ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      {children}
    </MotionConfig>
  )
}
```

### Pattern 3: Static OG Metadata for WhatsApp
**What:** Export metadata object in layout.tsx with openGraph config + static image file
**When to use:** Root layout — sets WhatsApp/social preview globally
**Example:**
```typescript
// src/app/layout.tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Yogi & Sudha Wedding',
  description: 'Join us for our wedding celebration! 28 April 2026',
  openGraph: {
    title: 'Yogi & Sudha Wedding',
    description: 'Join us for our wedding celebration! 28 April 2026',
    type: 'website',
    images: [
      {
        url: '/opengraph-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Yogi & Sudha Wedding Invitation',
      },
    ],
  },
}
```

**WhatsApp-specific notes:**
- Image MUST be 1200x630 pixels for reliable rendering
- Place `opengraph-image.jpg` in `src/app/` — Next.js auto-detects this file convention
- WhatsApp caches OG data aggressively; use Facebook Sharing Debugger to force re-fetch
- `NEXT_PUBLIC_SITE_URL` env var needed in Vercel for absolute image URL resolution

### Anti-Patterns to Avoid
- **Loading fonts via `<link>` tags:** Use `next/font/google` exclusively — it self-hosts fonts, eliminates external network requests, and prevents FOIT/FOUT
- **Using Tailwind v3 config.js for tokens:** In v4, define everything in `@theme` in CSS — no `tailwind.config.js` needed for custom values
- **Client components everywhere:** Keep layout.tsx and page.tsx as server components. Only mark animation components as `'use client'`
- **Importing full Motion bundle:** Import from `motion/react` (not `framer-motion`) for the current package name

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Font loading & optimization | Custom `@font-face` with manual subsetting | `next/font/google` | Automatic self-hosting, subset optimization, zero layout shift with `display: swap` |
| Scroll-triggered animations | IntersectionObserver + manual state | Motion `whileInView` | Pooled IntersectionObserver, GPU-accelerated via native ScrollTimeline, spring physics |
| Reduced motion support | Manual `matchMedia` listener | Motion `<MotionConfig reducedMotion="user">` | Automatically disables transforms/layout animations while preserving opacity |
| OG meta tags | Manual `<meta>` tags in `<head>` | Next.js `metadata` export | Type-safe, handles relative URLs, supports file conventions |
| Responsive design system | Custom media query mixins | Tailwind v4 mobile-first utilities | Battle-tested breakpoints, purged CSS, minimal output |
| CSS design tokens | Custom CSS custom properties system | Tailwind v4 `@theme` directive | Tokens automatically generate utility classes (`bg-maroon`, `text-gold`, etc.) |

**Key insight:** Every "foundation" piece in this phase has a built-in or standard library solution. The value is in configuring them correctly, not building custom abstractions.

## Common Pitfalls

### Pitfall 1: Font CSS Variable Name Collision
**What goes wrong:** `next/font` generates CSS variable names that collide with Tailwind's `@theme` variable names, causing fonts to not apply
**Why it happens:** Both systems use `--font-*` namespace. If you define `--font-heading` in both `next/font` (via `variable` prop) and `@theme`, they can overwrite each other
**How to avoid:** In `@theme`, reference the `next/font`-generated variable: `--font-heading: var(--font-heading);` — this tells Tailwind to use the value set by `next/font` on the html element. Alternatively, use distinct variable names like `--font-display-hindi` in `next/font` and map them in `@theme`
**Warning signs:** Font falls back to system font despite correct imports

### Pitfall 2: WhatsApp OG Image Not Showing
**What goes wrong:** Link shared in WhatsApp shows no preview image or wrong image
**Why it happens:** WhatsApp requires absolute URLs for OG images, but Next.js generates relative paths without `metadataBase`. Also, WhatsApp aggressively caches OG data
**How to avoid:** Set `metadataBase` in root layout metadata: `metadataBase: new URL('https://your-domain.vercel.app')`. Use the `opengraph-image.jpg` file convention in `src/app/` for automatic handling. After deployment, test with Facebook Sharing Debugger
**Warning signs:** Desktop preview works but WhatsApp shows blank

### Pitfall 3: Motion Bundle Size on Mobile
**What goes wrong:** Animation library adds significant JS weight, pushing past 3s load on 4G
**Why it happens:** Motion is ~30-40KB gzipped. If imported incorrectly or used in server components, it bloats the bundle
**How to avoid:** Only use Motion in `'use client'` components. Keep animation components small and focused. Use dynamic import (`next/dynamic`) for below-fold animation-heavy sections in later phases
**Warning signs:** Bundle analyzer shows `motion` in server bundle

### Pitfall 4: Tailwind v4 @theme Variable Scoping
**What goes wrong:** Custom colors/fonts defined in `@theme` don't generate utility classes
**Why it happens:** Using wrong namespace (e.g., `--my-color` instead of `--color-my-color`) or placing `@theme` before `@import "tailwindcss"`
**How to avoid:** Always use Tailwind's namespace convention: `--color-*` for colors, `--font-*` for fonts, `--spacing-*` for spacing. Place `@theme` after `@import "tailwindcss"`
**Warning signs:** `bg-maroon` class has no effect; no error shown

### Pitfall 5: Devanagari Font Subset Not Loading
**What goes wrong:** Hindi text renders in fallback font despite importing Yatra One
**Why it happens:** Missing `'devanagari'` in the `subsets` array — only `'latin'` was specified
**How to avoid:** Always include both `'devanagari'` and `'latin'` subsets for Hindi fonts: `subsets: ['devanagari', 'latin']`
**Warning signs:** English text in Yatra One works, Hindi characters fall back to system font

## Code Examples

### Complete globals.css with Design Tokens
```css
/* src/app/globals.css */
@import "tailwindcss";

@theme {
  /* Typography - mapped from next/font CSS variables */
  --font-hindi: var(--font-hindi);
  --font-heading: var(--font-heading);
  --font-body: var(--font-body);

  /* Primary palette */
  --color-maroon: #800020;
  --color-maroon-light: #A0334D;
  --color-maroon-dark: #600018;
  --color-gold: #D4AF37;
  --color-gold-light: #E8CC6E;
  --color-gold-dark: #B8941F;
  --color-emerald: #046307;
  --color-emerald-light: #0A8A0F;
  --color-cream: #FFF8F0;
  --color-cream-dark: #F5E6D3;

  /* Per-event accent colors */
  --color-tilak: #C41E3A;
  --color-mehndi: #228B22;
  --color-sangeet: #9B59B6;
  --color-haldi: #F4C430;
  --color-shadi: #800020;
}

/* Base styles */
body {
  font-family: var(--font-body), 'Georgia', serif;
  background-color: var(--color-cream);
  color: var(--color-maroon-dark);
}
```

### Complete Root Layout
```typescript
// src/app/layout.tsx
import type { Metadata } from 'next'
import { yatraOne, playfairDisplay, cormorantGaramond } from '@/lib/fonts'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: 'Yogi & Sudha Wedding',
  description: 'Join us for our wedding celebration! 28 April 2026',
  openGraph: {
    title: 'Yogi & Sudha Wedding',
    description: 'Join us for our wedding celebration! 28 April 2026',
    type: 'website',
    images: [
      {
        url: '/opengraph-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Yogi & Sudha Wedding Invitation',
      },
    ],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`${yatraOne.variable} ${playfairDisplay.variable} ${cormorantGaramond.variable}`}
    >
      <body className="bg-cream text-maroon-dark font-body antialiased">
        {children}
      </body>
    </html>
  )
}
```

### Placeholder Page with Scroll Reveal Test
```typescript
// src/app/page.tsx
import { ScrollReveal } from '@/components/ui/scroll-reveal'

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero placeholder */}
      <section className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
        <h1 className="font-hindi text-5xl text-gold md:text-7xl">
          योगी & सुधा
        </h1>
        <h2 className="mt-4 font-heading text-3xl text-maroon md:text-5xl">
          Yogi & Sudha
        </h2>
        <p className="mt-6 font-body text-lg text-maroon/80 md:text-xl">
          28 April 2026
        </p>
      </section>

      {/* Scroll animation test section */}
      <section className="px-4 py-section-mobile md:py-section">
        <ScrollReveal>
          <div className="mx-auto max-w-2xl rounded-lg border-2 border-gold bg-cream-dark p-8 text-center">
            <h3 className="font-heading text-2xl text-maroon">
              Scroll Animation Test
            </h3>
            <p className="mt-2 font-body text-maroon/70">
              This element fades in when scrolled into view.
            </p>
          </div>
        </ScrollReveal>
      </section>
    </main>
  )
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `framer-motion` package | `motion` package (import from `motion/react`) | 2024-2025 | Same API, new package name. Install `motion`, import from `motion/react` |
| Tailwind v3 `tailwind.config.js` | Tailwind v4 `@theme` in CSS | 2025 | No JS config file needed; 70% smaller CSS output |
| `@tailwind base/components/utilities` | `@import "tailwindcss"` | 2025 (Tailwind v4) | Single import replaces three directives |
| Manual `content` paths in Tailwind config | Auto-detection | 2025 (Tailwind v4) | No need to specify which files to scan |
| Manual `<meta>` OG tags | Next.js `metadata` export + file conventions | 2023+ (stable in Next.js 15) | Type-safe, automatic, supports `opengraph-image.jpg` file convention |

**Deprecated/outdated:**
- `framer-motion` npm package: Still works but rebranded to `motion`. Use `npm install motion` for new projects
- `tailwind.config.js`: Not needed in Tailwind v4 for new projects — use `@theme` in CSS
- `@tailwind` directives: Replaced by `@import "tailwindcss"` in v4

## Open Questions

1. **OG preview image source**
   - What we know: User wants couple photo with names + date overlaid in gold text
   - What's unclear: No couple photo has been provided yet
   - Recommendation: Create a placeholder OG image (1200x630) with text-only design (gold text on maroon background). Replace with actual photo when provided

2. **Event accent colors — exact values**
   - What we know: Each event needs a distinct accent within the royal palette
   - What's unclear: User hasn't specified exact hex values per event
   - Recommendation: Use the values defined in the code examples above (Tilak=#C41E3A, Mehndi=#228B22, Sangeet=#9B59B6, Haldi=#F4C430, Shadi=#800020). These can be refined in later phases

3. **Hindi font choice finalization**
   - What we know: User listed Yatra One, Modak, or Tiro Devanagari Hindi as options
   - What's unclear: Which one is preferred
   - Recommendation: Use **Yatra One** — it's the most established of the three, inspired by Mumbai railway signage (culturally resonant), and available in `next/font/google` with devanagari subset. Supports only weight 400 which is fine for display headings

4. **Vercel deployment URL for metadataBase**
   - What we know: Need absolute URL for OG images to work in WhatsApp
   - What's unclear: Final Vercel project URL not yet created
   - Recommendation: Use `process.env.NEXT_PUBLIC_SITE_URL` with localhost fallback. Set the env var in Vercel after first deploy

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Vitest (lightweight, Vite-native, works with Next.js) |
| Config file | none — see Wave 0 |
| Quick run command | `npx vitest run --reporter=verbose` |
| Full suite command | `npx vitest run` |

### Phase Requirements → Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| HERO-03 | OG metadata exports correct title, description, image | unit | `npx vitest run src/__tests__/metadata.test.ts -t "og metadata"` | ❌ Wave 0 |
| CONT-02 | Font CSS variables are defined and applied to html element | unit | `npx vitest run src/__tests__/fonts.test.ts -t "font variables"` | ❌ Wave 0 |
| ANIM-02 | Design tokens (colors, fonts) generate correct Tailwind classes | smoke | Manual — visual check that classes apply correctly | manual-only (CSS token verification) |
| ANIM-02 | ScrollReveal component renders and applies motion props | unit | `npx vitest run src/__tests__/scroll-reveal.test.tsx` | ❌ Wave 0 |
| PERF-01 | Page is responsive at mobile breakpoints | e2e | Manual — Chrome DevTools responsive mode | manual-only (visual layout) |
| PERF-02 | Page loads under 3s on throttled 4G | e2e | Manual — Chrome DevTools Lighthouse audit with 4G throttling | manual-only (requires browser) |
| PERF-02 | Build succeeds without errors | smoke | `npm run build` | ✅ (built-in) |

### Sampling Rate
- **Per task commit:** `npm run build && npx vitest run`
- **Per wave merge:** `npm run build && npx vitest run`
- **Phase gate:** Full suite green + manual Lighthouse audit before `/gsd:verify-work`

### Wave 0 Gaps
- [ ] `vitest.config.ts` — Vitest configuration with React/JSX support
- [ ] `src/__tests__/metadata.test.ts` — validates OG metadata exports
- [ ] `src/__tests__/fonts.test.ts` — validates font CSS variable configuration
- [ ] `src/__tests__/scroll-reveal.test.tsx` — validates ScrollReveal component renders with motion props
- [ ] Framework install: `npm install -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom`

## Sources

### Primary (HIGH confidence)
- [Next.js Installation Docs](https://nextjs.org/docs/app/getting-started/installation) — create-next-app setup, App Router defaults
- [Next.js Font Optimization](https://nextjs.org/docs/app/getting-started/fonts) — next/font/google API, CSS variables, subsets
- [Next.js Metadata & OG Images](https://nextjs.org/docs/app/getting-started/metadata-and-og-images) — metadata export, opengraph-image file convention
- [Tailwind CSS v4 Theme Variables](https://tailwindcss.com/docs/theme) — @theme directive, CSS-first configuration, namespaces
- [Tailwind CSS v4 Release](https://tailwindcss.com/blog/tailwindcss-v4) — v4 changes, @import syntax, auto-detection
- [Motion React Docs](https://motion.dev/docs/react) — installation, whileInView, MotionConfig
- [Motion Scroll Animations](https://motion.dev/docs/react-scroll-animations) — scroll-linked vs scroll-triggered, native ScrollTimeline
- [Motion Accessibility](https://motion.dev/docs/react-accessibility) — reducedMotion prop, useReducedMotion hook
- [Yatra One on Google Fonts](https://fonts.google.com/specimen/Yatra+One) — weight 400 only, devanagari + latin subsets
- [Playfair Display on Google Fonts](https://fonts.google.com/specimen/Playfair+Display) — variable weight, latin subset

### Secondary (MEDIUM confidence)
- [WhatsApp OG Preview with Next.js](https://medium.com/@eduardojs999/how-to-use-whatsapp-open-graph-preview-with-next-js-avoiding-common-pitfalls-88fea4b7c949) — WhatsApp-specific image requirements, caching behavior
- [Motion npm package](https://www.npmjs.com/package/motion) — v12.35.2 latest, installation command
- [Next.js Performance Optimization](https://dev.to/trlz/optimizing-nextjs-performance-a-practical-case-study-96-lighthouse-mobile-31da) — mobile Lighthouse strategies

### Tertiary (LOW confidence)
- Event accent color hex values — chosen by researcher based on palette harmony; user may want to adjust

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — Next.js 15 + Tailwind v4 + Motion is well-documented, widely used
- Architecture: HIGH — patterns verified against official docs for all three libraries
- Pitfalls: HIGH — documented from official docs and community reports
- Font setup: HIGH — Yatra One availability and next/font API verified against Google Fonts and Next.js docs
- Event accent colors: LOW — researcher-selected values, not user-specified

**Research date:** 2026-03-11
**Valid until:** 2026-04-11 (stable ecosystem, 30-day validity)
