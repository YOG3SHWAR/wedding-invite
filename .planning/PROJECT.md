# Yogi Wedding Invite

## What This Is

A bold, vibrant Indian wedding website for Yogi & Sudha's multi-day celebration (28 April 2026). A digital invitation, event hub, and RSVP platform featuring scroll-triggered animations, photo gallery with lightbox, bilingual Hindi+English content, day-wise RSVP with Firebase, and WhatsApp-optimized sharing — designed mobile-first for 300+ guests.

## Core Value

Guests can easily view all wedding event details and RSVP by day — the site must be visually stunning, fast to load on mobile, and dead-simple for 300+ guests to navigate and respond.

## Requirements

### Validated

- ✓ Hero section with couple names in Hindi+English, wedding date, and live countdown timer — v1.0
- ✓ Our Story section with relationship timeline and scroll animations — v1.0
- ✓ Event Details for all 5 events (Tilak, Mehndi, Sangeet, Haldi, Shadi) with date, time, venue, dress code, Maps link — v1.0
- ✓ Per-event visual identity with distinct color accents — v1.0
- ✓ Dress code visuals per event — v1.0
- ✓ Photo gallery with masonry grid, lightbox view, and lazy loading — v1.0
- ✓ Embedded pre-wedding video with click-to-load iframe — v1.0
- ✓ Scroll-triggered animations (fade-in, stagger, slide effects) — v1.0
- ✓ Bold, vibrant visual design — gold/maroon/emerald theme, large typography — v1.0
- ✓ Day-wise RSVP form (name, phone, which days attending) — v1.0
- ✓ Firebase Firestore backend for RSVP storage (free tier, write-only rules) — v1.0
- ✓ RSVP confirmation screen with confetti and event summary — v1.0
- ✓ Registry/gifts section on standalone /gifts route — v1.0
- ✓ Bilingual content — Hindi headers/blessings, English logistics — v1.0
- ✓ Mobile-first responsive design — v1.0
- ✓ Fast load under 3s on 4G (Firebase lazy-loading, lazy images) — v1.0
- ✓ WhatsApp-optimized OG meta tags with photo support — v1.0
- ✓ WhatsApp share button — v1.0

### Active

- [ ] "Add to Calendar" buttons per event (ENHN-01)
- [ ] Accommodation/travel info section for out-of-town guests (ENHN-02)
- [ ] Custom domain setup (ENHN-03)

### Out of Scope

- Guest login/authentication — RSVP is open via link, massive friction for 300+ guests
- Admin dashboard — use Firebase console directly
- Email/SMS notifications — handle via WhatsApp groups (how Indian families communicate)
- Multi-language toggle — content is pre-mixed Hindi+English, not switchable
- Live photo upload/sharing wall — use shared Google Photos album
- Background music autoplay — browsers block it, annoys users, eats mobile data
- Per-event RSVP — day-wise is simpler and matches Indian wedding day grouping
- SEO optimization — private invitation shared via direct link

## Context

Shipped v1.0 with 3,774 LOC TypeScript across 248 files.
Tech stack: Next.js 15, Tailwind v4, Framer Motion, Firebase Firestore, Vitest.
Fonts: Yatra One (Hindi), Playfair Display (headings), Cormorant Garamond (body).
Design: Royal gold (#D4AF37) / maroon (#800020) / emerald (#046307) on cream background.
Content placeholders remain in `constants.ts` — venues, photos, video URL, gift links need real data before launch.
Wedding date: 28 April 2026. Events: Tilak (26 Apr), Mehndi+Sangeet (27 Apr), Haldi+Shadi (28 Apr).

## Constraints

- **Budget**: Free tier only — no paid services for hosting or database
- **Audience**: Must work on low-end mobile devices and slow connections (Indian wedding guests)
- **Timeline**: Wedding date 28 April 2026
- **Tech**: Next.js 15 + Tailwind v4 + Firebase Firestore

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Free hosting (Vercel) | No budget for hosting, can add custom domain later | ✓ Good |
| Firebase Firestore for RSVP | Simple, free, write-only rules for security | ✓ Good |
| Day-wise RSVP (not per-event) | Events grouped by day, simpler for guests | ✓ Good |
| Bold & vibrant aesthetic | User preference — royal gold/maroon/emerald theme | ✓ Good |
| Hindi + English mixed content | Reflects cultural context, not a language toggle | ✓ Good |
| Tailwind v4 CSS-first config | No tailwind.config.js needed, @theme in CSS | ✓ Good |
| Yatra One for Hindi font | Devanagari subset, culturally resonant calligraphic feel | ✓ Good |
| Next.js ImageResponse for OG | Dynamic OG image with photo support, no static JPEG needed | ✓ Good |
| Phone number as Firestore doc ID | Natural upsert via setDoc merge — guests can re-RSVP | ✓ Good |
| CSS columns for gallery masonry | Natural content-aware flow without JS library | ✓ Good |
| Click-to-load iframe for video | No YouTube script until user interaction | ✓ Good |
| Firebase lazy-loading via dynamic import | Keeps Firebase SDK out of initial JS bundle | ✓ Good |
| Gifts on standalone /gifts route | Keeps main page focused on RSVP | ✓ Good |
| English-first bilingual ordering | English gets primary h-tag, Hindi as accent below | ✓ Good |
| Scroll animations replay on every entry | Dramatic Bollywood feel, not just first intersection | ✓ Good |

---
*Last updated: 2026-03-12 after v1.0 milestone*
