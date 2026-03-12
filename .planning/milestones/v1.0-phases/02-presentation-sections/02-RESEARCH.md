# Phase 2: Presentation Sections - Research

**Researched:** 2026-03-11
**Domain:** React component architecture, scroll animations, image gallery, countdown timer
**Confidence:** HIGH

## Summary

Phase 2 builds all visual content sections for the wedding site: hero with countdown, event timeline, Our Story, photo gallery, and pre-wedding video. The existing codebase already provides a solid foundation with `motion/react` for animations, `ScrollReveal` component, Tailwind v4 with design tokens, font classes, and event constants. The primary technical challenges are: (1) building a performant countdown timer as a client component, (2) implementing masonry-style photo gallery with lightbox, (3) creating staggered scroll-triggered animations that feel "Bollywood dramatic," and (4) lazy-loading a video embed on click.

No new heavy dependencies are needed. The masonry layout should use CSS columns (not the experimental CSS `grid-lanes` spec which lacks browser support). For lightbox, `yet-another-react-lightbox` is the standard choice at ~5KB. The countdown timer is a simple client component with `useEffect`/`setInterval`. All sections are server-rendered by default with client components only where interactivity is required (countdown, gallery lightbox, video embed).

**Primary recommendation:** Build each section as a standalone component using existing design tokens and ScrollReveal patterns. Keep client components minimal (countdown, lightbox, video player). Use CSS columns for masonry, yet-another-react-lightbox for gallery, and motion/react staggerChildren for dramatic reveal animations.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- Hero: Full-bleed couple photo background with dark overlay, Hindi + English names, Hindi blessing/shloka, placeholder gradient until real photo
- Countdown: Decorative gold-bordered boxes, large numbers with small labels, updates every second
- Event timeline: Vertical alternating left/right cards, gold timeline line, thick left border in event accent color, Hindi + English event names, scroll-triggered card reveals
- Photo gallery: Masonry grid (Pinterest-style), lightbox on click, scroll-triggered back-and-forth staggered animations, lazy loading, placeholder images
- Pre-wedding video: Cinematic thumbnail with gold play button, click-to-load YouTube/Vimeo player, placeholder thumbnail
- Our Story: Photo-driven milestones, alternating left/right, vertical timeline, 4-5 key moments, scroll-triggered reveals, placeholder content
- Page order: Hero > Our Story > Events > Gallery > Video > (RSVP placeholder for Phase 3)
- **MUST use `frontend-design` skill for ALL UI component execution** -- non-negotiable hard constraint

### Claude's Discretion
- Exact animation timing and easing for scroll reveals
- Lightbox implementation approach (library vs custom)
- Masonry grid column count at different breakpoints
- Hero dark overlay opacity and gradient style
- Mandala/paisley dividers between sections
- Gold particle/sparkle effects where appropriate
- Responsive breakpoints for timeline layout on mobile (likely single-column)

### Deferred Ideas (OUT OF SCOPE)
None -- discussion stayed within phase scope
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| HERO-01 | Hero section with couple names in Hindi + English and wedding date | Existing `COUPLE` constant has all data; hero is a server component with CSS overlay on background image |
| HERO-02 | Live countdown timer showing days/hours/minutes to wedding day | Client component with `useEffect`/`setInterval`, functional state updates, proper cleanup |
| EVNT-01 | Event details for all 5 events with date, time, venue, dress code, and Google Maps link | Existing `EVENTS` constant + `EVENT_COLORS`; extend constants with time, venue, dress code, map URL |
| EVNT-02 | Per-event visual identity with distinct color accents | Existing Tailwind color tokens (`bg-tilak`, `bg-mehndi`, etc.) already established in Phase 1 |
| EVNT-03 | Dress code visuals/suggestions per event | Static content in event cards; add `dressCode` field to events constant |
| CONT-01 | Photo gallery with grid/carousel layout, lightbox view, and lazy loading | CSS columns for masonry + `yet-another-react-lightbox` for lightbox + Next.js Image lazy loading |
| CONT-03 | Our Story relationship timeline with milestones and photos | Server component with ScrollReveal wrapping each milestone; alternating layout via CSS |
| CONT-04 | Embedded pre-wedding video (lazy-loaded) | Click-to-load pattern: show thumbnail, replace with iframe on click (client component) |
| ANIM-01 | Scroll-triggered animations (fade-in, parallax, slide effects) | Existing ScrollReveal + motion/react `whileInView` + `staggerChildren` for dramatic reveals |
</phase_requirements>

## Standard Stack

### Core (Already Installed)
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| motion/react | ^12.35.2 | Scroll-triggered animations, stagger effects | Already in project; `whileInView`, `staggerChildren`, `AnimatePresence` |
| next/image | 16.1.6 | Lazy loading, responsive images, blur placeholders | Built-in to Next.js; handles srcset, lazy loading, WebP |
| Tailwind CSS | v4 | Styling with design tokens | Already configured with `@theme` tokens for all colors, fonts, spacing |

### New Dependencies Needed
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| yet-another-react-lightbox | ^3.x | Gallery lightbox with swipe/keyboard nav | Gallery image click opens full-size view |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| yet-another-react-lightbox | Custom dialog with motion/react | Library handles swipe, keyboard, zoom, accessibility -- too much to hand-roll |
| CSS columns masonry | CSS `grid-lanes` | `grid-lanes` is experimental, not shipped in stable browsers; CSS columns work everywhere |
| CSS columns masonry | Masonry.js (desandro) | Heavyweight JS library; CSS columns achieve the visual effect with zero JS |

**Installation:**
```bash
npm install yet-another-react-lightbox
```

## Architecture Patterns

### Recommended Component Structure
```
src/
  components/
    sections/
      hero-section.tsx          # Server component wrapper
      hero-countdown.tsx        # Client component (timer logic)
      event-timeline.tsx        # Server component
      event-card.tsx            # Server component (per-event)
      our-story-section.tsx     # Server component
      story-milestone.tsx       # Server component (per-milestone)
      photo-gallery.tsx         # Client component (lightbox state)
      video-section.tsx         # Client component (click-to-load)
      section-divider.tsx       # Server component (mandala/paisley SVG)
    ui/
      scroll-reveal.tsx         # Already exists
      stagger-reveal.tsx        # New: parent container for staggerChildren
  lib/
    constants.ts                # Extend with event details, story milestones
    placeholder-data.ts         # Placeholder images, text, video thumbnail
  app/
    page.tsx                    # Compose all sections in order
```

### Pattern 1: Server Component with Client Island
**What:** Keep sections as server components; only wrap interactive pieces in `'use client'`
**When to use:** Every section except where state/effects are needed
**Example:**
```typescript
// hero-section.tsx (server component -- no 'use client')
import { COUPLE } from '@/lib/constants'
import { HeroCountdown } from './hero-countdown'

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background with overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-maroon-dark/80 to-maroon/60" />
      <div className="relative z-10 text-center px-4">
        <p className="font-hindi text-2xl md:text-3xl text-gold-light">शुभ विवाह</p>
        <h1 className="font-hindi text-6xl md:text-8xl lg:text-9xl text-gold">
          {COUPLE.nameHindi}
        </h1>
        <h2 className="mt-4 font-heading text-3xl md:text-5xl text-white">
          {COUPLE.nameEnglish}
        </h2>
        <p className="mt-4 font-body text-xl text-cream">{COUPLE.weddingDate}</p>
        <HeroCountdown targetDate="2026-04-28T00:00:00+05:30" />
      </div>
    </section>
  )
}
```

### Pattern 2: Countdown Timer (Client Component)
**What:** `useEffect` with `setInterval` for live countdown, functional state updates, proper cleanup
**When to use:** Hero countdown timer
**Example:**
```typescript
'use client'
import { useState, useEffect } from 'react'

function getTimeRemaining(target: string) {
  const diff = new Date(target).getTime() - Date.now()
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 }
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  }
}

export function HeroCountdown({ targetDate }: { targetDate: string }) {
  const [time, setTime] = useState(getTimeRemaining(targetDate))

  useEffect(() => {
    const id = setInterval(() => setTime(getTimeRemaining(targetDate)), 1000)
    return () => clearInterval(id)
  }, [targetDate])

  return (
    <div className="mt-8 flex gap-4 justify-center">
      {Object.entries(time).map(([label, value]) => (
        <div key={label} className="border-2 border-gold rounded-lg p-3 md:p-4 min-w-[70px]">
          <span className="font-heading text-3xl md:text-4xl text-gold block">{value}</span>
          <span className="font-body text-xs md:text-sm text-cream/80 uppercase">{label}</span>
        </div>
      ))}
    </div>
  )
}
```

### Pattern 3: Stagger Container for Dramatic Reveals
**What:** Parent motion.div with `staggerChildren` to reveal child elements sequentially
**When to use:** Event timeline cards, gallery images, story milestones
**Example:**
```typescript
'use client'
import { motion } from 'motion/react'
import { type ReactNode } from 'react'

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15, delayChildren: 0.1 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
}

export function StaggerReveal({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
      variants={containerVariants}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function StaggerItem({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div variants={itemVariants} className={className}>
      {children}
    </motion.div>
  )
}
```

### Pattern 4: CSS Columns Masonry
**What:** Use CSS `columns` property for Pinterest-style masonry without JS
**When to use:** Photo gallery
**Example:**
```typescript
// Masonry grid using CSS columns
<div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
  {images.map((img) => (
    <div key={img.id} className="break-inside-avoid">
      <Image
        src={img.src}
        alt={img.alt}
        width={img.width}
        height={img.height}
        className="rounded-lg w-full cursor-pointer"
        loading="lazy"
        onClick={() => openLightbox(img.index)}
      />
    </div>
  ))}
</div>
```

### Pattern 5: Click-to-Load Video Embed
**What:** Show thumbnail; replace with iframe only on user click
**When to use:** Pre-wedding video section
**Example:**
```typescript
'use client'
import { useState } from 'react'
import Image from 'next/image'

export function VideoSection({ thumbnailSrc, videoUrl }: { thumbnailSrc: string; videoUrl: string }) {
  const [playing, setPlaying] = useState(false)

  if (playing) {
    return (
      <div className="aspect-video w-full max-w-4xl mx-auto">
        <iframe
          src={`${videoUrl}?autoplay=1`}
          className="w-full h-full rounded-xl"
          allow="autoplay; fullscreen"
          allowFullScreen
        />
      </div>
    )
  }

  return (
    <button onClick={() => setPlaying(true)} className="relative w-full max-w-4xl mx-auto block group">
      <Image src={thumbnailSrc} alt="Pre-wedding video" width={1280} height={720} className="rounded-xl w-full" />
      <div className="absolute inset-0 flex items-center justify-center">
        {/* Gold play button */}
        <div className="w-20 h-20 rounded-full bg-gold/90 flex items-center justify-center group-hover:scale-110 transition-transform">
          <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
      </div>
    </button>
  )
}
```

### Anti-Patterns to Avoid
- **Making entire sections client components:** Only the countdown, lightbox state, and video click handler need `'use client'`. Keep wrapper sections as server components.
- **Using CSS `grid-lanes` / `masonry` for the gallery:** Not shipped in stable browsers as of March 2026. Use CSS `columns` which is universally supported.
- **Eager-loading the video iframe:** Wastes bandwidth. Always use click-to-load pattern.
- **Multiple `setInterval` instances:** Always clear the previous interval in the `useEffect` cleanup to prevent memory leaks and stacking.
- **Using `framer-motion` import path:** This project uses `motion/react` (the renamed package). Never import from `framer-motion`.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Image lightbox | Custom modal with swipe/zoom/keyboard | `yet-another-react-lightbox` (~5KB) | Handles touch gestures, keyboard nav, accessibility, pinch-to-zoom |
| Responsive images | Manual srcset/sizes attributes | `next/image` component | Automatic format negotiation, lazy loading, responsive sizing |
| Scroll-triggered animations | IntersectionObserver + manual CSS | `motion/react` `whileInView` | Already in project; handles threshold, once, reduced motion |
| Masonry layout | JavaScript-based positioning | CSS `columns` property | Zero JS; native browser layout; works on all browsers |

**Key insight:** The existing project already has the heavy lifting done (motion/react, ScrollReveal, design tokens). Phase 2 is about composing these into sections, not adding new infrastructure.

## Common Pitfalls

### Pitfall 1: Countdown Hydration Mismatch
**What goes wrong:** Server renders countdown with server time; client hydrates with different time, causing React hydration error
**Why it happens:** Server and client compute different values for `Date.now()`
**How to avoid:** Initialize countdown state with a static value or use `suppressHydrationWarning` on the countdown container. Alternatively, render countdown only after mount using a `useEffect`-based `isMounted` flag.
**Warning signs:** Console hydration mismatch warnings on page load

### Pitfall 2: Gallery Images Not Lazy Loading
**What goes wrong:** All gallery images load at once, causing slow page load
**Why it happens:** Forgetting `loading="lazy"` or placing images above the fold where lazy loading is ignored
**How to avoid:** Use `next/image` which defaults to `loading="lazy"`. The gallery section is well below the fold, so lazy loading will work naturally. In Next.js 16, use `preload` prop (not deprecated `priority`) only for the hero background.
**Warning signs:** Network tab shows all images loading on initial page load

### Pitfall 3: Timeline Layout Breaks on Mobile
**What goes wrong:** Alternating left/right timeline cards overflow on small screens
**Why it happens:** Desktop alternating layout doesn't adapt to narrow viewport
**How to avoid:** Use single-column layout on mobile (`md:` breakpoint switches to alternating). Mobile shows all cards stacked with consistent left alignment.
**Warning signs:** Horizontal scroll on mobile, cards clipped

### Pitfall 4: Stagger Animation Feels Wrong
**What goes wrong:** Stagger effect replays every time user scrolls up and back down, or feels laggy
**Why it happens:** Missing `viewport={{ once: true }}` or too many items staggering at once
**How to avoid:** Always set `once: true` on viewport. Keep stagger groups to 3-5 items. Use `margin: '-80px'` to trigger slightly before element is fully in view.
**Warning signs:** Animations replay on scroll, or long delay before all items appear

### Pitfall 5: Video Embed Autoplay Blocked
**What goes wrong:** Video doesn't autoplay after click-to-load
**Why it happens:** Missing `allow="autoplay"` attribute on iframe, or `?autoplay=1` not in URL
**How to avoid:** Always include both the `allow="autoplay"` iframe attribute AND the `?autoplay=1` URL parameter for YouTube/Vimeo embeds.
**Warning signs:** User clicks play, thumbnail disappears, but video is paused

## Code Examples

### Extending Events Constant
```typescript
// src/lib/constants.ts -- extend EVENTS with full details
export const EVENTS = [
  {
    name: 'Tilak',
    nameHindi: 'तिलक',
    date: '26 April 2026',
    time: '10:00 AM',
    venue: 'Venue Name, City',
    mapUrl: 'https://maps.google.com/?q=...',
    dressCode: 'Traditional / Kurta Pajama',
    description: 'The groom is welcomed and honored by the bride\'s family.',
    colorKey: 'tilak' as const,
  },
  // ... repeat for all 5 events
] as const
```

### Section Divider with Mandala
```typescript
// src/components/sections/section-divider.tsx
export function SectionDivider() {
  return (
    <div className="flex items-center justify-center gap-4 py-8">
      <div className="h-px flex-1 max-w-[100px] bg-gradient-to-r from-transparent to-gold" />
      {/* Mandala SVG or decorative element */}
      <div className="w-8 h-8 text-gold">
        {/* Inline SVG mandala/paisley */}
      </div>
      <div className="h-px flex-1 max-w-[100px] bg-gradient-to-l from-transparent to-gold" />
    </div>
  )
}
```

### Lightbox Integration with Gallery
```typescript
'use client'
import { useState } from 'react'
import Lightbox from 'yet-another-react-lightbox'
import 'yet-another-react-lightbox/styles.css'

export function PhotoGallery({ images }: { images: { src: string; alt: string }[] }) {
  const [open, setOpen] = useState(false)
  const [index, setIndex] = useState(0)

  return (
    <>
      {/* Masonry grid */}
      <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
        {images.map((img, i) => (
          <div key={i} className="break-inside-avoid cursor-pointer" onClick={() => { setIndex(i); setOpen(true) }}>
            {/* Image with scroll animation wrapper */}
          </div>
        ))}
      </div>

      <Lightbox
        open={open}
        close={() => setOpen(false)}
        index={index}
        slides={images.map((img) => ({ src: img.src }))}
      />
    </>
  )
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `framer-motion` package name | `motion/react` package name | 2024 | Import from `motion/react`, not `framer-motion` |
| `priority` prop on next/image | `preload` prop on next/image | Next.js 16 | Use `preload` for above-the-fold images |
| CSS `grid-template-rows: masonry` | CSS `display: grid-lanes` | 2025 spec rename | Still experimental; use CSS `columns` for production |
| JavaScript masonry libraries | CSS `columns` property | Stable for years | Zero-JS masonry that works everywhere |

**Deprecated/outdated:**
- `framer-motion` import path: Use `motion/react` instead
- `priority` prop on `next/image` in Next.js 16: Use `preload` instead
- Eager iframe video embeds: Use click-to-load pattern for performance

## Open Questions

1. **Placeholder images for gallery**
   - What we know: User will provide real photos later; need placeholders now
   - What's unclear: How many placeholder images to include, what aspect ratios
   - Recommendation: Use 8-10 placeholder images with varied aspect ratios (portrait, landscape, square) to showcase masonry layout. Can use gradient/pattern SVGs or low-res placeholder service.

2. **Google Maps link format**
   - What we know: Each event needs a working Google Maps link
   - What's unclear: Actual venue addresses not yet provided
   - Recommendation: Use placeholder URLs with `https://maps.google.com/?q=Venue+Name+City` format. Easy to replace later.

3. **Mandala/paisley divider design**
   - What we know: Phase 1 decided mandala patterns at section transitions only
   - What's unclear: Exact SVG design for dividers
   - Recommendation: Create a simple inline SVG paisley/lotus motif in gold. Keep it lightweight (< 2KB SVG).

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Vitest 4.x + @testing-library/react 16.x |
| Config file | `vitest.config.ts` (exists, configured with jsdom) |
| Quick run command | `npx vitest run --reporter=verbose` |
| Full suite command | `npx vitest run` |

### Phase Requirements to Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| HERO-01 | Hero renders couple names in Hindi + English and date | unit | `npx vitest run src/components/sections/__tests__/hero-section.test.tsx -t "renders couple names"` | No -- Wave 0 |
| HERO-02 | Countdown timer calculates and displays time remaining | unit | `npx vitest run src/components/sections/__tests__/hero-countdown.test.tsx -t "displays countdown"` | No -- Wave 0 |
| EVNT-01 | All 5 event cards render with date, time, venue, dress code, map link | unit | `npx vitest run src/components/sections/__tests__/event-timeline.test.tsx` | No -- Wave 0 |
| EVNT-02 | Each event card uses its distinct accent color | unit | `npx vitest run src/components/sections/__tests__/event-card.test.tsx -t "accent color"` | No -- Wave 0 |
| EVNT-03 | Dress code text appears on each event card | unit | `npx vitest run src/components/sections/__tests__/event-card.test.tsx -t "dress code"` | No -- Wave 0 |
| CONT-01 | Gallery renders images, opens lightbox on click | unit | `npx vitest run src/components/sections/__tests__/photo-gallery.test.tsx` | No -- Wave 0 |
| CONT-03 | Our Story renders milestones with photos | unit | `npx vitest run src/components/sections/__tests__/our-story-section.test.tsx` | No -- Wave 0 |
| CONT-04 | Video section shows thumbnail, loads iframe on click | unit | `npx vitest run src/components/sections/__tests__/video-section.test.tsx -t "click to load"` | No -- Wave 0 |
| ANIM-01 | Scroll reveal components render with motion variants | smoke | `npx vitest run src/components/ui/__tests__/scroll-reveal.test.tsx` | No -- Wave 0 |

### Sampling Rate
- **Per task commit:** `npx vitest run --reporter=verbose`
- **Per wave merge:** `npx vitest run && npx next build`
- **Phase gate:** Full suite green + successful `next build` before `/gsd:verify-work`

### Wave 0 Gaps
- [ ] `src/components/sections/__tests__/hero-section.test.tsx` -- covers HERO-01
- [ ] `src/components/sections/__tests__/hero-countdown.test.tsx` -- covers HERO-02
- [ ] `src/components/sections/__tests__/event-timeline.test.tsx` -- covers EVNT-01
- [ ] `src/components/sections/__tests__/event-card.test.tsx` -- covers EVNT-02, EVNT-03
- [ ] `src/components/sections/__tests__/photo-gallery.test.tsx` -- covers CONT-01
- [ ] `src/components/sections/__tests__/our-story-section.test.tsx` -- covers CONT-03
- [ ] `src/components/sections/__tests__/video-section.test.tsx` -- covers CONT-04
- [ ] Test setup file for mocking `motion/react` and `next/image` -- shared fixtures

## Sources

### Primary (HIGH confidence)
- Existing codebase: `src/components/ui/scroll-reveal.tsx`, `src/lib/constants.ts`, `package.json` -- verified current project patterns
- [Next.js Image Component docs](https://nextjs.org/docs/app/api-reference/components/image) -- lazy loading, preload prop, blur placeholder
- [Motion.dev scroll animations docs](https://motion.dev/docs/react-scroll-animations) -- whileInView, viewport options, stagger

### Secondary (MEDIUM confidence)
- [Yet Another React Lightbox](https://yet-another-react-lightbox.com/) -- lightweight gallery lightbox with plugin architecture
- [MDN CSS Masonry Layout](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Grid_layout/Masonry_layout) -- confirmed experimental status, CSS columns is the production alternative
- [CSS-Tricks on grid-lanes](https://css-tricks.com/masonry-layout-is-now-grid-lanes/) -- masonry spec renamed to grid-lanes, still not stable

### Tertiary (LOW confidence)
- [Chrome Developers masonry update](https://developer.chrome.com/blog/masonry-update) -- browser support timeline unclear

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- project already has motion/react, Next.js Image, Tailwind v4 tokens; only adding yet-another-react-lightbox
- Architecture: HIGH -- server/client component split pattern is well-established in Next.js App Router
- Pitfalls: HIGH -- hydration mismatch, lazy loading, and mobile timeline are well-documented issues
- Animations: MEDIUM -- exact "Bollywood dramatic" feel requires visual iteration during execution

**Research date:** 2026-03-11
**Valid until:** 2026-04-11 (30 days -- stable technologies, no fast-moving APIs)
