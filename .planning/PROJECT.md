# Yogi Wedding Invite

## What This Is

A bold, vibrant Indian wedding website that serves as a digital invitation, event hub, and RSVP platform for a multi-day wedding celebration. It features scroll-triggered animations, embedded videos, a photo gallery, and bilingual (Hindi + English) content — designed to be beautiful on both mobile and desktop.

## Core Value

Guests can easily view all wedding event details and RSVP by day — the site must be visually stunning, fast to load on mobile, and dead-simple for 300+ guests to navigate and respond.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] Hero section with couple's names, wedding date, and live countdown timer
- [ ] Our Story section with relationship timeline
- [ ] Event Details section covering all 5 events: Tilak, Mehndi, Sangeet, Haldi, Shadi
- [ ] Each event shows date, time, venue, dress code, and map link
- [ ] Photo gallery with couple's photos (grid/carousel layout)
- [ ] Embedded video clips (pre-wedding shoot or similar)
- [ ] Scroll-triggered animations (fade-in, parallax, slide effects)
- [ ] Day-wise RSVP system (guests select which day/events they attend)
- [ ] RSVP supports 300+ guests with name, phone, and event selection
- [ ] RSVP data stored in Firebase or Google Sheets (free tier)
- [ ] Registry/Gifts section with links
- [ ] Bilingual content — Hindi + English (headers in Hindi, details in English)
- [ ] Fully responsive — mobile-first design that works on desktop too
- [ ] Bold & vibrant visual aesthetic — rich colors, large typography, dramatic layouts

### Out of Scope

- Custom domain setup — starting with free hosting, domain later
- Guest login/authentication — RSVP is open via link
- Admin dashboard — manage RSVPs directly in Firebase/Sheets
- Email/SMS notifications — handle separately via WhatsApp
- Multi-language toggle — content is pre-mixed Hindi+English, not switchable

## Context

- This is a real Indian wedding with 5 events across multiple days
- Event grouping by day: some events share a day (e.g., Haldi + Shadi)
- 300+ guests expected, many will access from mobile phones
- User wants to use a `frontend-design` Claude skill for UI design during execution
- Hosting: Vercel or Netlify (free tier)
- Backend: Firebase free tier or Google Sheets API for RSVP storage

## Constraints

- **Budget**: Free tier only — no paid services for hosting or database
- **Audience**: Must work on low-end mobile devices and slow connections (Indian wedding guests)
- **Timeline**: Wedding date TBD — build as quickly as possible
- **Tech**: Modern web stack (React/Next.js recommended), responsive, performant

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Free hosting (Vercel/Netlify) | No budget for hosting, can add custom domain later | — Pending |
| Firebase/Google Sheets for RSVP | Simple, free, easy to manage for non-technical user | — Pending |
| Day-wise RSVP (not per-event) | Events are grouped by day, simpler for guests | — Pending |
| Bold & vibrant aesthetic | User preference — rich colors, dramatic, not minimal | — Pending |
| Hindi + English mixed content | Reflects cultural context, not a language toggle | — Pending |

---
*Last updated: 2026-03-11 after initialization*
