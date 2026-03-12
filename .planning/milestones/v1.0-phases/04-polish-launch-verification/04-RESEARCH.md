# Phase 4: Polish + Launch Verification - Research

**Researched:** 2026-03-12
**Domain:** Performance optimization, accessibility, WhatsApp sharing, bilingual text reordering, Firebase lazy-loading
**Confidence:** HIGH

## Summary

Phase 4 is a verification and polish phase with no new features. The site is functionally complete after Phases 1-3. The work centers on five areas: (1) reordering bilingual text to English-first across 8 components, (2) lazy-loading Firebase to reduce the critical JS bundle, (3) fixing gold-on-cream contrast failures for accessibility, (4) upgrading the OG image for WhatsApp sharing with real couple photo support, and (5) adding a WhatsApp share button at the page bottom. All UI changes MUST use the `frontend-design` skill.

The largest technical risk is the 448KB monolith JS chunk that bundles Firebase, motion, and lightbox together. Firebase lazy-loading via dynamic `import()` is the primary lever to bring initial load under the 3-second 4G target. The gold (#D4AF37) on cream (#FFF8F0) contrast ratio is 2.00:1 -- failing WCAG AA badly at every text size -- and must be fixed for the target 40-70 age demographic.

**Primary recommendation:** Split into two waves -- (1) text reordering + Firebase lazy-loading + accessibility fixes, (2) WhatsApp OG image upgrade + share button + final Lighthouse audit.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- Target Lighthouse mobile score: 80+
- Page must load under 3 seconds on throttled 4G
- Keep placeholder images (inline SVG) as-is -- user will swap in real photos before launch
- Lazy-load Firebase SDK -- only load when user scrolls to RSVP section or interacts with the form
- No navigation bar or footer -- pure single-scroll experience like a physical wedding card
- English first everywhere -- all headings, labels, event details show English as primary text
- Hindi appears as secondary/accent text (below or beside English)
- Event venues, times, and Google Maps links: user will provide real data during this phase
- All editable content stays in `src/lib/constants.ts` with clear comments marking what to update
- Add a content checklist comment at the top of constants.ts listing everything to update before launch
- Our Story milestones: keep placeholder, user will fill in later
- Hindi text strings: no separate review needed, user will check themselves
- OG preview image: upgrade to real couple photo with text overlay (full-bleed photo, semi-transparent dark overlay, "Yogi & Sudha" in gold + "28 April 2026")
- OG preview description: keep current "Join us for our wedding celebration! 28 April 2026"
- Add WhatsApp share button at the bottom of the main page
- User will test with real family members (40-70 age range) on Vercel preview link
- Accessibility polish: bump up form labels and button text sizes, ensure gold-on-cream passes contrast checks, big obvious tap targets
- Fresh form every time (no lookup of previous RSVP) -- Firebase upserts on same phone number
- Polish existing loading/error states to match royal aesthetic -- no offline handling addition
- **MUST use `frontend-design` skill for ALL UI changes** -- non-negotiable

### Claude's Discretion
- Specific Lighthouse optimization techniques (code splitting, image optimization, caching headers)
- Exact Firebase lazy-loading implementation approach
- WhatsApp share button design and placement at page bottom
- Contrast fix approach for gold-on-cream text
- How to restructure OG image component for real photo support
- Bundle analysis and optimization priorities

### Deferred Ideas (OUT OF SCOPE)
None -- discussion stayed within phase scope
</user_constraints>

<phase_requirements>
## Phase Requirements

This phase verifies all prior requirements -- no new requirement IDs. The following previously-completed requirements are validated:

| ID | Description | Research Support |
|----|-------------|-----------------|
| PERF-01 | Mobile-first responsive design (works on low-end Android) | Accessibility contrast fixes, font size increases, tap target sizing |
| PERF-02 | Fast load time under 3 seconds on 4G | Firebase lazy-loading, bundle analysis, Lighthouse audit techniques |
| HERO-01 | Hero section with couple names in Hindi + English | Bilingual text reordering (English-first) |
| HERO-02 | Live countdown timer | Countdown IST timezone verification |
| HERO-03 | WhatsApp-optimized OG meta tags | OG image upgrade with real photo, WhatsApp share button |
| CONT-02 | Bilingual content | Systematic English-first reordering across all 8 affected components |
| RSVP-01 | Day-wise RSVP form | Usability polish -- larger labels, better contrast, bigger tap targets |
| RSVP-03 | RSVP confirmation screen | WhatsApp share button already exists on confirmation |
</phase_requirements>

## Standard Stack

### Core (Already Installed)
| Library | Version | Purpose | Relevant to Phase 4 |
|---------|---------|---------|---------------------|
| next | 16.1.6 | Framework | Dynamic imports, `next/og` ImageResponse, metadata API |
| react | 19.2.3 | UI | No changes needed |
| firebase | ^12.10.0 | RSVP backend | Lazy-loading target -- currently eagerly loaded |
| motion | ^12.35.2 | Animations | Already configured, no changes |
| tailwindcss | ^4 | Styling | `@theme` tokens, contrast color adjustments |

### No New Dependencies
Phase 4 adds zero new packages. All work uses existing libraries and built-in Next.js features.

## Architecture Patterns

### Pattern 1: Firebase Lazy-Loading via Dynamic Import

**What:** Replace eager Firebase imports with a lazy-loading wrapper that only initializes Firebase when the RSVP form is needed.

**Why:** Firebase is in the 448KB monolith chunk loaded on every page visit. Most guests will scroll through the invitation before reaching RSVP. Lazy-loading defers ~120-180KB of Firebase JS until interaction.

**Current (eager):**
```typescript
// src/lib/firebase.ts -- loaded in initial bundle
import { initializeApp, getApps } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]
export const db = getFirestore(app)
```

**Recommended (lazy):**
```typescript
// src/lib/firebase-lazy.ts
let dbInstance: Firestore | null = null

export async function getDb(): Promise<Firestore> {
  if (dbInstance) return dbInstance

  const { initializeApp, getApps } = await import('firebase/app')
  const { getFirestore } = await import('firebase/firestore')

  const app = getApps().length === 0
    ? initializeApp(firebaseConfig)
    : getApps()[0]

  dbInstance = getFirestore(app)
  return dbInstance
}
```

**Then update `rsvp.ts`:**
```typescript
export async function submitRsvp(data: RsvpData): Promise<string> {
  const { doc, setDoc, serverTimestamp } = await import('firebase/firestore')
  const db = await getDb()
  // ... rest of submit logic
}
```

**Key insight:** The `submitRsvp` function is already async, so making `getDb()` async requires zero API changes to calling code. The RSVP section component already handles the Promise-based submission flow.

**Confidence:** HIGH -- Firebase modular SDK (v9+) is explicitly designed for this pattern per official Firebase docs.

### Pattern 2: Bilingual Text Reordering

**What:** Systematically swap Hindi/English ordering across 8 components so English appears as the primary (larger/first) text and Hindi as secondary/accent.

**Scope of changes (audited):**

| Component | Current State | Change Needed |
|-----------|---------------|---------------|
| `hero-section.tsx` | Hindi "शुभ विवाह" first, Hindi couple names as h1, English as h2 | English couple names as h1, Hindi as decorative accent below |
| `event-card.tsx` | Hindi `nameHindi` as h3, English `name` below | English `name` as h3, Hindi below |
| `rsvp-section.tsx` | Hindi "आमंत्रण" as big heading, "RSVP" secondary | "RSVP" as primary heading, Hindi as accent |
| `rsvp-section.tsx` | Form labels Hindi-first: "आपका नाम / Your Name" | English-first: "Your Name / आपका नाम" |
| `rsvp-section.tsx` | Submit: "RSVP भेजें" then "Send RSVP" | "Send RSVP" then "RSVP भेजें" |
| `rsvp-section.tsx` | Day cards: Hindi event names above English | English event names above Hindi |
| `rsvp-confirmation.tsx` | "धन्यवाद!" big, "Thank You" smaller | "Thank You" big, "धन्यवाद!" as accent |
| `gifts-section.tsx` | Hindi "उपहार" as h1, "Gift Wishes" as h2 | "Gift Wishes" as h1, "उपहार" as accent |

**Already correct (no changes):**
- `our-story-section.tsx`, `story-milestone.tsx`, `photo-gallery.tsx`, `video-section.tsx` -- these already show English first
- `event-timeline.tsx` -- English heading first, Hindi subheading (correct pattern)

**Confidence:** HIGH -- pure JSX reordering with font class adjustments, no logic changes.

### Pattern 3: OG Image with Real Photo Support

**What:** Modify `opengraph-image.tsx` to support a real couple photo as background with dark overlay and gold text.

**Current:** Pure CSS-styled maroon background with gold text (no photo).

**Approach:** Use `fetch()` to load the photo from the public directory as an ArrayBuffer, then use it as a background `<img>` in the ImageResponse JSX. The photo must be placed in `public/images/og-couple.jpg` by the user.

```typescript
// src/app/opengraph-image.tsx
import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Yogi & Sudha Wedding Invitation'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  // Fetch couple photo -- falls back to solid maroon if not found
  let photoSrc: ArrayBuffer | null = null
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
    const res = await fetch(`${baseUrl}/images/og-couple.jpg`)
    if (res.ok) photoSrc = await res.arrayBuffer()
  } catch { /* fallback to no-photo design */ }

  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', position: 'relative' }}>
        {/* Background photo or fallback gradient */}
        {photoSrc ? (
          // @ts-expect-error -- ImageResponse supports ArrayBuffer src
          <img src={photoSrc} style={{ position: 'absolute', width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <div style={{ position: 'absolute', inset: 0, background: '#800020' }} />
        )}
        {/* Dark overlay */}
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.55)' }} />
        {/* Text content */}
        <div style={{ /* centered flex layout with gold text */ }}>
          {/* "Yogi & Sudha" in gold, "28 April 2026" below */}
        </div>
      </div>
    ),
    { ...size }
  )
}
```

**Constraints:**
- ImageResponse has a 500KB bundle limit (fonts + images + code)
- The couple photo must be reasonably compressed (aim for <300KB JPEG)
- Edge runtime: `fetch()` must happen inside the default export function, not at module scope
- WhatsApp caches OG images aggressively -- once deployed, changing the image may take days to propagate

**Confidence:** HIGH -- Next.js official docs confirm this pattern for `opengraph-image.tsx` with edge runtime.

### Pattern 4: Accessibility Contrast Fix

**What:** Fix gold-on-cream text contrast from 2.00:1 to WCAG AA compliant.

**Measured contrast ratios:**

| Color Combo | Ratio | WCAG AA Normal (4.5:1) | WCAG AA Large (3:1) |
|-------------|-------|------------------------|---------------------|
| Gold #D4AF37 on cream #FFF8F0 | 2.00:1 | FAIL | FAIL |
| Gold-dark #B8941F on cream #FFF8F0 | 2.73:1 | FAIL | FAIL |
| Gold-light #E8CC6E on cream #FFF8F0 | 1.50:1 | FAIL | FAIL |
| Maroon #800020 on cream #FFF8F0 | 10.28:1 | PASS | PASS |
| **#8B6914 on cream #FFF8F0** | **4.83:1** | **PASS** | **PASS** |
| #7A5C10 on cream #FFF8F0 | 5.92:1 | PASS | PASS |
| Gold #D4AF37 on maroon #800020 | 5.15:1 | PASS | PASS |

**Recommended approach -- contextual gold shades:**

1. **Gold on dark backgrounds (hero, maroon sections):** Keep `#D4AF37` -- passes at 5.15:1
2. **Gold text on cream/white backgrounds:** Use darkened gold `--color-gold-accessible: #8B6914` -- passes AA normal at 4.83:1
3. **Decorative gold elements (borders, dividers, icons):** Keep `#D4AF37` -- decorative elements do not need contrast compliance
4. **Small gold text on cream (form labels, captions):** Either use maroon (10.28:1) or the accessible gold

**Implementation:** Add a `--color-gold-accessible` token in `globals.css` `@theme` block. Create a `text-gold-accessible` utility. Replace `text-gold` with `text-gold-accessible` on light backgrounds where text must be readable (labels, headings on cream sections).

**Confidence:** HIGH -- contrast ratios calculated from hex values using standard WCAG luminance formula.

### Pattern 5: WhatsApp Share Button at Page Bottom

**What:** Add a share button after the RSVP section in the main page, before the page ends.

**Placement:** After `<RsvpSection />` in `page.tsx`, add a new bottom section with a WhatsApp share button. This differs from the existing share button on `RsvpConfirmation` (shown only after successful RSVP submission).

**Design approach:** A floating-feel section with a gold divider, invitation blessing text, and a prominent green WhatsApp share button. Should use `frontend-design` skill for the UI treatment.

**WhatsApp share URL pattern:**
```typescript
const shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`
```

**Share text:** Include Hindi + English wedding invite text with the site URL.

**Confidence:** HIGH -- standard pattern, already implemented in `rsvp-confirmation.tsx`.

### Anti-Patterns to Avoid
- **Do NOT use `next/dynamic` for Firebase:** `next/dynamic` is for React components. Firebase is a utility library -- use raw `import()` directly.
- **Do NOT add offline/service-worker:** Out of scope per user decision. Polish existing loading states only.
- **Do NOT change existing animation behavior:** Scroll animations replay on every viewport entry (once:false) -- this is intentional Bollywood dramatic feel.
- **Do NOT add a footer or navigation:** User explicitly wants pure single-scroll card experience.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Contrast checking | Custom color math | Established WCAG formulas + darkened `--color-gold-accessible` token | One-time calculation, just apply the result |
| Firebase code splitting | Custom webpack config | Dynamic `import()` -- Next.js handles chunk splitting automatically | Framework-level optimization |
| OG image generation | Static JPEG file | `opengraph-image.tsx` with `ImageResponse` | Dynamic, can fetch real photo, auto-generates with build |
| WhatsApp API integration | Custom sharing SDK | Simple `https://api.whatsapp.com/send?text=` URL | WhatsApp's official URL scheme, works everywhere |

## Common Pitfalls

### Pitfall 1: Firebase Dynamic Import Creates Separate Chunks That Still Load Eagerly
**What goes wrong:** If any module at the top level imports from `firebase.ts`, the Firebase chunk gets pulled into the initial bundle regardless of dynamic imports elsewhere.
**Why it happens:** Webpack/Turbopack follows static import chains. One static `import { db } from '@/lib/firebase'` anywhere in the render tree brings in all of Firebase.
**How to avoid:** Ensure NO file that's part of the initial render path statically imports from `firebase.ts` or `rsvp.ts`. The `rsvp-section.tsx` is a client component that currently statically imports `submitRsvp` -- this must become a dynamic import too.
**Warning signs:** Build output still shows the same chunk sizes after "lazy-loading" changes.

### Pitfall 2: WhatsApp OG Image Caching
**What goes wrong:** After deploying a new OG image, WhatsApp still shows the old preview for days/weeks.
**Why it happens:** WhatsApp aggressively caches OG images with no official cache-busting mechanism.
**How to avoid:** Deploy the final OG image BEFORE sharing the link with guests. If the link has already been shared with the old image, there's no reliable way to force a refresh.
**Warning signs:** Testing preview locally shows correct image, but WhatsApp shows stale one.

### Pitfall 3: Gold-on-Cream Contrast Fix Breaks Design Aesthetic
**What goes wrong:** Darkening gold too much makes it look brown/muddy, losing the royal gold aesthetic.
**Why it happens:** WCAG-compliant gold on cream requires moving toward #8B6914 range which is darker/more amber.
**How to avoid:** Use contextual approach -- keep bright `#D4AF37` for decorative elements (borders, dividers, SVG icons) and only use darkened gold for actual text that must be read. The gradient-text technique (used on RSVP heading) bypasses this issue since it's decorative.
**Warning signs:** Entire page looks desaturated/brownish after contrast fixes.

### Pitfall 4: ImageResponse 500KB Bundle Limit
**What goes wrong:** The OG image generation fails silently or returns a broken image.
**Why it happens:** The couple photo + font data exceeds the 500KB limit for edge runtime ImageResponse.
**How to avoid:** Compress the couple photo to under 300KB JPEG. Don't embed custom fonts -- use the system serif fallback (current approach already does this).
**Warning signs:** OG image works locally but returns error on Vercel edge.

### Pitfall 5: Hydration Mismatch on Countdown Timer
**What goes wrong:** The countdown shows different time on server vs client, causing a flash.
**Why it happens:** Server renders at build time, client hydrates with current time.
**How to avoid:** Already handled -- the current `hero-countdown.tsx` uses `mounted` state flag and `suppressHydrationWarning`. Verify this continues to work after any text reordering in the hero section.
**Warning signs:** Console hydration warnings, countdown flash on page load.

### Pitfall 6: Lazy-Loading Firebase Causes Visible Delay on Form Submit
**What goes wrong:** User taps "Send RSVP" and waits 2-3 seconds while Firebase SDK downloads.
**Why it happens:** If Firebase is only loaded on form submit, the SDK download adds to submission latency.
**How to avoid:** Preload Firebase when user scrolls to the RSVP section (Intersection Observer) or when they interact with any form field. Don't wait for submit button click.
**Warning signs:** User testing reveals noticeable delay between tapping submit and seeing loading state.

## Code Examples

### Firebase Lazy-Load with Preload Trigger

```typescript
// src/lib/firebase-lazy.ts
import type { Firestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

let dbPromise: Promise<Firestore> | null = null

export function getDb(): Promise<Firestore> {
  if (!dbPromise) {
    dbPromise = (async () => {
      const { initializeApp, getApps } = await import('firebase/app')
      const { getFirestore } = await import('firebase/firestore')
      const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]
      return getFirestore(app)
    })()
  }
  return dbPromise
}

/** Call this when RSVP section enters viewport to preload Firebase */
export function preloadFirebase(): void {
  getDb()
}
```

### Preload Trigger in RSVP Section

```typescript
// In rsvp-section.tsx -- add useEffect with IntersectionObserver
import { preloadFirebase } from '@/lib/firebase-lazy'

// Inside the component:
const sectionRef = useRef<HTMLElement>(null)

useEffect(() => {
  const el = sectionRef.current
  if (!el) return
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        preloadFirebase()
        observer.disconnect()
      }
    },
    { rootMargin: '200px' } // Start loading 200px before section is visible
  )
  observer.observe(el)
  return () => observer.disconnect()
}, [])
```

### Updated submitRsvp with Lazy Imports

```typescript
// src/lib/rsvp.ts
import { getDb } from './firebase-lazy'

export async function submitRsvp(data: RsvpData): Promise<string> {
  const { valid, normalized, error } = validatePhone(data.phone)
  if (!valid) throw new Error(error)

  const { doc, setDoc, serverTimestamp } = await import('firebase/firestore')
  const db = await getDb()

  await setDoc(
    doc(db, 'rsvps', normalized),
    {
      name: data.name,
      phone: normalized,
      guestCount: data.guestCount,
      days: data.days,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  )
  return normalized
}
```

### Content Checklist for constants.ts

```typescript
/**
 * ─── CONTENT CHECKLIST ───
 * Update these items before sharing the invitation link:
 *
 * [ ] EVENTS[*].time — Real times for all 5 events
 * [ ] EVENTS[*].venue — Real venue names
 * [ ] EVENTS[*].mapUrl — Real Google Maps links
 * [ ] STORY_MILESTONES[*].description — Real relationship milestones
 * [ ] GIFT_ITEMS[*].buyUrl — Real purchase links (or remove section)
 * [ ] GIFT_ITEMS[*].image — Real gift images (or keep placeholders)
 * [ ] public/images/og-couple.jpg — Real couple photo for WhatsApp preview
 * [ ] Gallery photos — Replace placeholder SVGs with real photos
 * [ ] Video — Replace placeholder with real pre-wedding video URL
 */
```

### Accessible Gold Theme Token

```css
/* In globals.css @theme block */
@theme {
  /* ... existing tokens ... */
  --color-gold-accessible: #8B6914; /* 4.83:1 on cream -- WCAG AA pass */
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Firebase compat SDK (namespace) | Firebase modular SDK v9+ (tree-shakeable) | 2021 | Must use modular imports for tree-shaking to work |
| `@vercel/og` package | `next/og` (built into Next.js 14+) | 2023 | Already using correct approach via `next/og` |
| FID (First Input Delay) | INP (Interaction to Next Paint) | March 2024 | Lighthouse now measures INP -- heavy JS execution on interaction matters |
| Static OG images | Dynamic `opengraph-image.tsx` | Next.js 13+ | Already using dynamic approach -- just needs photo support |

## Bilingual Reordering: Complete File Audit

### Files That Need Changes (8 files)

1. **`src/components/sections/hero-section.tsx`** -- Swap h1/h2: English couple names as h1 (large), Hindi as decorative accent. Move "शुभ विवाह" below or make it smaller accent text.

2. **`src/components/sections/event-card.tsx`** -- Swap h3/p: English `event.name` as h3 heading, Hindi `event.nameHindi` as subtitle below.

3. **`src/components/sections/rsvp-section.tsx`** -- Multiple changes:
   - Section heading: Make "RSVP" the primary large heading, "आमंत्रण" as accent
   - Form labels: English first ("Your Name / आपका नाम")
   - Toggle button: "All Days / सभी दिन"
   - Day cards: English event names above Hindi
   - Submit button: "Send RSVP" then "RSVP भेजें"

4. **`src/components/sections/rsvp-confirmation.tsx`** -- "Thank You, {name}!" as primary heading, "धन्यवाद!" as accent.

5. **`src/components/sections/gifts-section.tsx`** -- "Gift Wishes" as h1, "उपहार" as accent. English blessing first.

6. **`src/lib/rsvp.ts`** -- Error message: English first, Hindi second (currently Hindi first: "कृपया 10 अंकों... / Please enter...").

7. **`src/lib/constants.ts`** -- Add content checklist comment at top.

8. **`src/app/page.tsx`** -- Add WhatsApp share button section after RsvpSection.

### Files That Are Already Correct (no changes needed)
- `our-story-section.tsx` -- English "Our Story" first
- `story-milestone.tsx` -- English title first
- `photo-gallery.tsx` -- English "Gallery" first
- `video-section.tsx` -- English "Our Film" first
- `event-timeline.tsx` -- English "Wedding Events" first

## Open Questions

1. **Couple photo for OG image**
   - What we know: User needs to provide `og-couple.jpg` for the WhatsApp preview
   - What's unclear: Whether the photo will be available during this phase's implementation or only at launch
   - Recommendation: Build the OG image component with fallback (current maroon design if no photo found). Document the photo requirements (aim for <300KB JPEG, landscape orientation, couple prominently centered).

2. **Real event data**
   - What we know: User will provide real venue names, times, Google Maps links during this phase
   - What's unclear: Timing of when this data arrives
   - Recommendation: Keep placeholders, add the content checklist comment, and make it trivially easy to update. All data is already centralized in `constants.ts`.

3. **Bundle size reduction magnitude**
   - What we know: Firebase is in the 448KB chunk. Lazy-loading should move Firebase to a separate deferred chunk.
   - What's unclear: Exact KB savings since the chunk also contains motion and lightbox code
   - Recommendation: Measure before/after with `next build`. Target is reducing the eagerly-loaded JS, not the total JS.

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Vitest 4.0.18 + @testing-library/react 16.3.2 |
| Config file | `vitest.config.ts` |
| Quick run command | `npx vitest run --reporter=verbose` |
| Full suite command | `npx vitest run --reporter=verbose` |

### Phase Requirements -> Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| PERF-02 | Page loads under 3s on 4G | manual-only | Lighthouse CLI or Chrome DevTools | N/A -- manual Lighthouse audit |
| PERF-01 | Works on low-end Android | manual-only | Real device testing | N/A -- manual device test |
| HERO-03 | WhatsApp OG preview works | manual-only | Deploy to Vercel preview, test in WhatsApp | N/A -- manual |
| CONT-02 | English-first bilingual | unit | `npx vitest run src/components/sections/__tests__/hero-section.test.tsx` | Exists (may need update) |
| RSVP-01 | RSVP usability for 40-70 age | manual-only | Real user testing on Vercel preview | N/A -- manual |

### Sampling Rate
- **Per task commit:** `npx vitest run --reporter=verbose`
- **Per wave merge:** `npx vitest run --reporter=verbose` + `npx next build`
- **Phase gate:** Full test suite green + Lighthouse mobile 80+ + successful `next build`

### Wave 0 Gaps
None -- existing test infrastructure covers unit testing needs. Phase 4 is primarily a manual verification phase (Lighthouse audits, real device testing, family member usability testing). The key automated gates are: tests pass + build succeeds + no TypeScript errors.

## Sources

### Primary (HIGH confidence)
- [Next.js Lazy Loading Guide](https://nextjs.org/docs/app/guides/lazy-loading) -- Dynamic import patterns for Next.js
- [Next.js opengraph-image API Reference](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/opengraph-image) -- OG image with edge runtime
- [Next.js ImageResponse Function](https://nextjs.org/docs/app/api-reference/functions/image-response) -- ImageResponse supports ArrayBuffer for images
- [Firebase Module Bundling Docs](https://firebase.google.com/docs/web/module-bundling) -- Tree-shaking and modular SDK guidance
- [WCAG 2.1 Contrast Requirements](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html) -- 4.5:1 normal, 3:1 large text

### Secondary (MEDIUM confidence)
- [WhatsApp OG Preview Guide](https://www.ogrilla.com/blog/whatsapp-link-preview-guide) -- 1200x630 dimensions, <300KB image size, single og:image tag
- [Next.js Lighthouse Optimization](https://www.wisp.blog/blog/mastering-mobile-performance-a-complete-guide-to-improving-nextjs-lighthouse-scores) -- INP, font optimization, lazy loading strategies
- [Firebase Lazy Import Pattern (GitHub Gist)](https://gist.github.com/dyaa/8f8d1f8964160630f2475fe26a2e6150) -- Community-validated Firebase lazy-load pattern

### Direct Measurement (HIGH confidence)
- Bundle analysis: 448KB monolith chunk contains Firebase + motion + lightbox
- Contrast calculation: Gold #D4AF37 on cream #FFF8F0 = 2.00:1 (FAIL), accessible gold #8B6914 = 4.83:1 (PASS)
- Build output: Total static JS ~1.25MB, ~375KB gzipped estimate

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- no new dependencies, all patterns use existing Next.js/Firebase features
- Architecture: HIGH -- Firebase lazy-loading is well-documented, text reordering is pure JSX
- Pitfalls: HIGH -- contrast ratios mathematically verified, Firebase chunking behavior confirmed by build analysis
- OG image: HIGH -- Next.js official docs confirm ArrayBuffer pattern for edge runtime

**Research date:** 2026-03-12
**Valid until:** 2026-04-12 (stable stack, no fast-moving dependencies)
