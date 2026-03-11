# Architecture Research

**Domain:** Animated Indian Wedding Website (digital invitation + RSVP)
**Researched:** 2026-03-11
**Confidence:** HIGH

## Standard Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                     Presentation Layer                           │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────────┐   │
│  │  Hero /   │ │  Event   │ │  Gallery │ │  RSVP Form       │   │
│  │ Countdown │ │ Schedule │ │ + Video  │ │  (Day-wise)      │   │
│  └────┬─────┘ └────┬─────┘ └────┬─────┘ └────────┬─────────┘   │
│       │             │            │                 │             │
├───────┴─────────────┴────────────┴─────────────────┴─────────────┤
│                     Animation Layer                               │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │  Framer Motion: scroll-triggered + scroll-linked anims      │ │
│  │  (whileInView, useScroll, parallax, fade-in, slide)         │ │
│  └─────────────────────────────────────────────────────────────┘ │
├──────────────────────────────────────────────────────────────────┤
│                     Shared Infrastructure                         │
│  ┌─────────┐  ┌──────────┐  ┌───────────┐  ┌────────────────┐  │
│  │ Content  │  │ i18n     │  │ Image     │  │ Theme /        │  │
│  │ Data     │  │ (Hi+En)  │  │ Optimize  │  │ Design Tokens  │  │
│  └─────────┘  └──────────┘  └───────────┘  └────────────────┘  │
├──────────────────────────────────────────────────────────────────┤
│                     Backend / Data Layer                          │
│  ┌────────────────────┐  ┌──────────────────────────────────┐   │
│  │ Firebase Firestore  │  │  Vercel / Netlify (Static CDN)  │   │
│  │ (RSVP collection)   │  │  (SSG pre-rendered pages)       │   │
│  └────────────────────┘  └──────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────────┘
```

### Component Responsibilities

| Component | Responsibility | Typical Implementation |
|-----------|----------------|------------------------|
| Hero / Countdown | Couple names, wedding date, live countdown timer, dramatic entry animation | Single page section with `useEffect` interval for countdown, Framer Motion entrance |
| Our Story Timeline | Relationship milestones in a scrollable timeline | Vertical timeline component with `whileInView` fade-in per milestone |
| Event Schedule | 5 events (Tilak, Mehndi, Sangeet, Haldi, Shadi) with date/time/venue/dress code/map | Card grid or accordion, grouped by day; static data from content file |
| Photo Gallery | Couple photos in grid/carousel layout | Responsive grid with lightbox modal; next/image for optimization |
| Video Embeds | Pre-wedding shoot or highlight clips | Lazy-loaded YouTube/Vimeo iframes or HTML5 video with poster images |
| RSVP Form | Day-wise guest RSVP (name, phone, event selection) | Multi-step or single form writing to Firestore; no auth required |
| Registry / Gifts | External links to gift registries | Simple link cards, static content |
| Content Data | All text, event details, bilingual strings | JSON/TS files in `/content` -- not a CMS, not a database |
| Animation Layer | All scroll-triggered and entrance animations | Framer Motion wrappers and reusable animation components |
| Theme / Design Tokens | Bold/vibrant color palette, typography, spacing | Tailwind CSS config with custom theme tokens |

## Recommended Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx          # Root layout (fonts, metadata, theme provider)
│   ├── page.tsx            # Single-page site: composes all sections
│   └── api/
│       └── rsvp/
│           └── route.ts    # API route: POST RSVP to Firestore
├── components/
│   ├── sections/           # Full page sections (one per scroll section)
│   │   ├── Hero.tsx
│   │   ├── OurStory.tsx
│   │   ├── EventSchedule.tsx
│   │   ├── Gallery.tsx
│   │   ├── VideoSection.tsx
│   │   ├── RsvpForm.tsx
│   │   └── Registry.tsx
│   ├── ui/                 # Reusable UI primitives
│   │   ├── CountdownTimer.tsx
│   │   ├── EventCard.tsx
│   │   ├── TimelineItem.tsx
│   │   ├── PhotoGrid.tsx
│   │   ├── Lightbox.tsx
│   │   └── Button.tsx
│   └── animation/          # Reusable animation wrappers
│       ├── FadeInOnScroll.tsx
│       ├── SlideIn.tsx
│       ├── ParallaxWrapper.tsx
│       └── StaggerChildren.tsx
├── content/                # Static content data (not a CMS)
│   ├── events.ts           # Event details: name, date, time, venue, map, dress code
│   ├── story.ts            # Our Story timeline milestones
│   ├── gallery.ts          # Photo paths and captions
│   └── site.ts             # Couple names, date, bilingual strings
├── lib/                    # Utilities and integrations
│   ├── firebase.ts         # Firebase client init (Firestore only)
│   └── rsvp.ts             # RSVP submission logic
├── styles/                 # Global styles
│   └── globals.css         # Tailwind directives, custom fonts, base styles
└── public/
    ├── images/             # Optimized wedding photos
    ├── fonts/              # Hindi-capable fonts (Noto Sans Devanagari, etc.)
    └── favicon.ico
```

### Structure Rationale

- **`components/sections/`:** Each section maps 1:1 to a scroll section on the page. This makes the single-page layout composable and each section independently testable.
- **`components/animation/`:** Animation wrappers are separated from business components. A `FadeInOnScroll` wrapper can be applied to any section without coupling animation logic to content.
- **`content/`:** All wedding-specific data lives in TypeScript files, not hardcoded in components. This makes it trivial to update event details, add photos, or change text without touching component logic. No CMS needed for a one-time event.
- **`lib/`:** Firebase initialization and RSVP logic are isolated. If you ever swap Firestore for Google Sheets, you change one file.
- **Single `page.tsx`:** This is a single-page scrolling site, not a multi-page app. One page composes all sections in order. No routing complexity.

## Architectural Patterns

### Pattern 1: Single-Page Section Composition

**What:** The entire site is a single scrolling page. Each visual section is a standalone component composed in order in `page.tsx`.
**When to use:** Always for this project. Wedding websites are single-page experiences -- guests scroll through, they do not navigate between pages.
**Trade-offs:** Simple routing (none needed), easy scroll animations, but the page can get heavy if images/videos are not lazy-loaded.

**Example:**
```typescript
// app/page.tsx
export default function WeddingPage() {
  return (
    <main>
      <Hero />
      <OurStory />
      <EventSchedule />
      <Gallery />
      <VideoSection />
      <RsvpForm />
      <Registry />
      <Footer />
    </main>
  );
}
```

### Pattern 2: Animation Wrapper Components

**What:** Reusable animation components that wrap content, separating animation concerns from business logic. Uses Framer Motion's `whileInView` for scroll-triggered animations and `useScroll` for scroll-linked effects.
**When to use:** Every section and content block that animates on scroll.
**Trade-offs:** Clean separation, reusable across sections. Slight overhead from wrapper divs, but negligible.

**Example:**
```typescript
// components/animation/FadeInOnScroll.tsx
"use client";
import { motion } from "framer-motion";

interface Props {
  children: React.ReactNode;
  delay?: number;
}

export function FadeInOnScroll({ children, delay = 0 }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, delay }}
    >
      {children}
    </motion.div>
  );
}
```

### Pattern 3: Content-Driven Rendering

**What:** All wedding-specific data (events, story, photos) lives in typed content files. Components read from these files and render dynamically. No hardcoded text in JSX.
**When to use:** Always. Separating content from presentation means updating wedding details is a data change, not a code change.
**Trade-offs:** Slight indirection, but massively easier to maintain and update.

**Example:**
```typescript
// content/events.ts
export interface WeddingEvent {
  name: string;
  nameHindi: string;
  date: string;
  time: string;
  venue: string;
  venueMapUrl: string;
  dressCode: string;
  day: number; // for day-wise RSVP grouping
}

export const events: WeddingEvent[] = [
  {
    name: "Tilak",
    nameHindi: "तिलक",
    date: "2026-XX-XX",
    time: "10:00 AM",
    venue: "Venue Name",
    venueMapUrl: "https://maps.google.com/...",
    dressCode: "Traditional",
    day: 1,
  },
  // ...more events
];
```

### Pattern 4: Server Route for RSVP Writes

**What:** RSVP submissions go through a Next.js API route (`/api/rsvp`) that writes to Firestore server-side. The client form posts to this route. Firebase Admin SDK runs server-side only -- no client-side Firebase credentials exposed.
**When to use:** For the RSVP form submission flow.
**Trade-offs:** Slightly more setup than client-side Firestore writes, but keeps Firebase credentials out of the browser bundle and allows server-side validation.

**Example:**
```typescript
// app/api/rsvp/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export async function POST(request: Request) {
  const body = await request.json();
  // Validate: name, phone, selectedDays
  const docRef = await addDoc(collection(db, "rsvps"), {
    ...body,
    submittedAt: serverTimestamp(),
  });
  return NextResponse.json({ id: docRef.id });
}
```

## Data Flow

### RSVP Submission Flow

```
[Guest fills RSVP form]
    |
    v
[RsvpForm.tsx] -- validates client-side (name, phone, at least 1 day selected)
    |
    v
[POST /api/rsvp] -- Next.js API route (server-side)
    |
    v
[Firebase Firestore] -- writes to "rsvps" collection
    |
    v
[Success response] --> [RsvpForm shows confirmation]
```

### Content Rendering Flow

```
[content/*.ts files] -- static TypeScript data
    |
    v (imported at build time)
[Section Components] -- Hero, EventSchedule, OurStory, Gallery
    |
    v (SSG pre-rendered)
[Static HTML + JS] -- served from Vercel CDN
    |
    v (hydrates in browser)
[Framer Motion animations] -- scroll-triggered effects activate
```

### Firestore Data Schema

```
Collection: "rsvps"
Document: {
  name: string,           // "Rajesh Kumar"
  phone: string,          // "+91 98765 43210"
  numberOfGuests: number, // 1-5
  selectedDays: number[], // [1, 3] -- day numbers they will attend
  message: string,        // optional well-wishes
  submittedAt: Timestamp  // server timestamp
}
```

No subcollections needed. A single flat collection handles 300+ guests easily within Firestore free tier (50K reads/day, 20K writes/day). Day-wise RSVP uses a `selectedDays` array rather than per-event booleans, matching the project requirement that events are grouped by day.

### Key Data Flows

1. **Static content to screen:** Content TS files -> imported by section components -> SSG-rendered at build time -> served from CDN -> hydrated with animations in browser.
2. **RSVP guest to database:** Form input -> client validation -> POST to API route -> server validation -> Firestore write -> confirmation UI.
3. **Photos to screen:** Images in `/public/images` -> next/image component handles responsive sizing, WebP conversion, lazy loading -> displayed in gallery grid.

## Scaling Considerations

| Scale | Architecture Adjustments |
|-------|--------------------------|
| 0-500 guests (this project) | Current architecture is perfect. Firestore free tier handles it. Static CDN handles any traffic spike from WhatsApp link sharing. |
| 500-5K guests | No changes needed. Firestore free tier still covers it. May want to add rate limiting on RSVP API route to prevent spam. |
| 5K+ guests | Unlikely for a wedding. If somehow needed: add Firestore indexes, consider batch reads, add CAPTCHA to RSVP form. |

### Scaling Priorities

1. **First bottleneck (real): Image loading on slow Indian mobile networks.** Fix: Aggressive image optimization with next/image (WebP, responsive sizes, blur placeholders), lazy-load below-fold images, compress photos before uploading. This is the most critical performance concern.
2. **Second bottleneck: Video embeds.** Fix: Never autoplay. Use poster images. Lazy-load iframes (load only when section scrolls into view). Consider hosting short clips as optimized MP4 rather than embedding YouTube.

## Anti-Patterns

### Anti-Pattern 1: Client-Side Firebase SDK in the Browser Bundle

**What people do:** Import Firebase client SDK directly in React components, exposing Firestore credentials in the browser, and writing directly from the client.
**Why it's wrong:** Bloats the client bundle (Firebase SDK is large), exposes write access to anyone who inspects the page, and makes validation harder.
**Do this instead:** Use a Next.js API route as a thin server layer. Firebase Admin SDK or client SDK runs server-side only. Client just POSTs JSON to `/api/rsvp`.

### Anti-Pattern 2: Animating Everything

**What people do:** Add scroll animations to every single element -- every paragraph, every image, every heading.
**Why it's wrong:** Causes jank on low-end mobile devices (the primary audience), increases JavaScript bundle, makes the site feel sluggish instead of elegant, and can trigger motion sickness.
**Do this instead:** Animate section entrances (fade-in per section), key focal elements (hero text, countdown), and decorative elements (parallax background). Use `viewport={{ once: true }}` so animations only play once. Use `prefers-reduced-motion` media query to disable animations for users who request it.

### Anti-Pattern 3: Using a CMS for One-Time Content

**What people do:** Set up Contentful, Sanity, or Strapi to manage wedding content that will be written once and barely edited.
**Why it's wrong:** Adds unnecessary complexity, an external dependency, API calls, and build triggers for content that is static by nature. A wedding website's content is written once and maybe tweaked 2-3 times.
**Do this instead:** Store content in TypeScript files in the repo. Edit directly, commit, deploy. Zero external dependencies.

### Anti-Pattern 4: Multi-Page Routing

**What people do:** Create separate pages for `/events`, `/gallery`, `/rsvp`, etc.
**Why it's wrong:** Breaks the single-page scroll experience that wedding websites are known for. Forces navigation decisions on guests. Fragments the visual flow and animation narrative.
**Do this instead:** Single scrolling page with anchor links in the nav. Smooth-scroll to sections. Navigation is a sticky header with section links, not page routes.

### Anti-Pattern 5: Skipping Image Optimization

**What people do:** Upload full-resolution DSLR photos (5-15MB each) directly and let the browser handle it.
**Why it's wrong:** Catastrophic on Indian mobile networks (3G/4G). A gallery with 20 unoptimized photos could mean 100MB+ page weight. Guests on Jio or Airtel will abandon the site.
**Do this instead:** Pre-compress photos before adding to repo (max 500KB each). Use next/image for automatic WebP conversion and responsive sizing. Lazy-load gallery images. Use blur placeholder (blurDataURL) for perceived performance.

## Integration Points

### External Services

| Service | Integration Pattern | Notes |
|---------|---------------------|-------|
| Firebase Firestore | Server-side via Next.js API route | Free tier: 1GB storage, 50K reads/day, 20K writes/day. More than enough for 300 RSVPs. Initialize once in `lib/firebase.ts`. |
| Google Maps | Static links (`maps.google.com/?q=...`) | Do NOT embed Google Maps iframes -- they are heavy and require API keys. Simple "Open in Maps" links are better for mobile UX. |
| Vercel | Automatic deployment from Git push | Free tier: 100GB bandwidth/month, serverless functions for API routes. Perfect fit. |
| YouTube/Vimeo | Lazy-loaded iframe embeds | Use `loading="lazy"` and only render iframe when section is in viewport. Use lite-youtube-embed for YouTube to avoid 600KB+ iframe overhead. |

### Internal Boundaries

| Boundary | Communication | Notes |
|----------|---------------|-------|
| Section Components <-> Content Data | Direct TS import | No API calls. Content is imported at build time. Type-safe. |
| RsvpForm <-> API Route | HTTP POST (fetch) | Client sends JSON, server validates and writes to Firestore. |
| API Route <-> Firestore | Firebase SDK | Server-side only. Credentials in environment variables. |
| Animation Wrappers <-> Section Components | React composition (children) | Animation wrappers are generic. They do not know about wedding content. |
| Navigation <-> Sections | Anchor IDs + smooth scroll | Nav links scroll to `#hero`, `#events`, `#gallery`, `#rsvp`. No router involvement. |

## Build Order (Dependencies)

The following build order respects component dependencies:

```
Phase 1: Foundation
  ├── Next.js project setup + Tailwind config + theme tokens
  ├── Content data files (events.ts, story.ts, site.ts)
  └── Reusable animation wrappers (FadeInOnScroll, SlideIn)
        |
Phase 2: Core Sections (can be built in parallel)
  ├── Hero + CountdownTimer (depends on: theme, animation wrappers, site content)
  ├── EventSchedule + EventCard (depends on: theme, animation wrappers, events content)
  ├── OurStory + TimelineItem (depends on: theme, animation wrappers, story content)
  └── Navigation (depends on: section anchor IDs)
        |
Phase 3: Media Sections (can be built in parallel)
  ├── Gallery + PhotoGrid + Lightbox (depends on: theme, animation wrappers, images)
  └── VideoSection (depends on: theme, animation wrappers)
        |
Phase 4: Interactive + Backend
  ├── Firebase setup + API route for RSVP
  ├── RsvpForm component (depends on: API route, events content for day grouping)
  └── Registry section (depends on: theme only)
        |
Phase 5: Polish
  ├── Performance optimization (image compression, lazy loading audit)
  ├── Mobile responsiveness pass
  ├── Animation tuning (timing, reduced-motion support)
  └── Hindi font loading optimization
```

**Key dependency insight:** The RSVP form depends on the events content data (to show day groupings) and the Firebase backend. Everything else is purely presentational and can be built with static content and animations first. This means the site can look complete and shareable before the backend is wired up.

## Sources

- [Firebase Firestore Data Model](https://firebase.google.com/docs/firestore/data-model) -- official Firestore documentation
- [Framer Motion Scroll Animations](https://motion.dev/docs/react-scroll-animations) -- official Motion docs for scroll-triggered and scroll-linked animations
- [Next.js Static Site Generation](https://nextjs.org/docs/pages/building-your-application/rendering/static-site-generation) -- official Next.js SSG docs
- [Next.js Static Exports](https://nextjs.org/docs/pages/building-your-application/deploying/static-exports) -- official Next.js export docs
- [Wedding RSVP with React + Firebase](https://medium.com/swlh/how-i-created-a-wedding-rsvp-app-using-react-styled-components-and-firebase-5b545882b232) -- real-world implementation reference
- [Firestore Data Structure Best Practices](https://firebase.google.com/docs/firestore/manage-data/structure-data) -- official structuring guide

---
*Architecture research for: Animated Indian Wedding Website*
*Researched: 2026-03-11*
