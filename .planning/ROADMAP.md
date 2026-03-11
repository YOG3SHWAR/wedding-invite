# Roadmap: Yogi Wedding Invite

## Overview

This roadmap delivers a visually stunning Indian wedding website in 4 phases: first establishing the design system and performance foundation, then building all presentation sections (hero, events, gallery, story, video), then the critical RSVP system with Firebase backend, and finally a focused verification pass ensuring the site works flawlessly on real devices for 300+ guests arriving via WhatsApp.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3, 4): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [x] **Phase 1: Foundation + Design System** - Project scaffold, Tailwind theme, font strategy, animation wrappers, responsive foundation, and performance budgets (completed 2026-03-11)
- [ ] **Phase 2: Presentation Sections** - Hero, countdown, all 5 event details, Our Story timeline, photo gallery, video embed, and scroll animations
- [ ] **Phase 3: RSVP System** - Day-wise RSVP form, Firebase backend, confirmation screen, and registry/gifts section
- [ ] **Phase 4: Polish + Launch Verification** - Performance audit, real device testing, WhatsApp OG verification, and RSVP testing with non-tech-savvy users

## Phase Details

### Phase 1: Foundation + Design System
**Goal**: The project is scaffolded with a complete design system -- theme tokens, Hindi/English fonts, animation patterns, and performance budgets are locked in so all subsequent feature work is consistent and performant from day one
**Depends on**: Nothing (first phase)
**Requirements**: HERO-03, CONT-02, ANIM-02, PERF-01, PERF-02
**Success Criteria** (what must be TRUE):
  1. Next.js project builds and deploys to Vercel with a visible placeholder page
  2. Bold, vibrant color theme (gold, maroon, emerald) is applied and Hindi + English text renders correctly without flash of invisible text
  3. A reusable scroll animation wrapper (fade-in) works on a test element and respects prefers-reduced-motion
  4. Page loads under 3 seconds on throttled 4G in Chrome DevTools and layout is mobile-first responsive
  5. WhatsApp link preview shows correct OG meta tags (couple names, wedding date, preview image)
**Plans:** 2/2 plans complete

Plans:
- [x] 01-01-PLAN.md — Scaffold Next.js project with design system tokens, fonts, ScrollReveal animation, OG metadata, and unit tests
- [x] 01-02-PLAN.md — Build/test verification and visual checkpoint for design system approval

### Phase 2: Presentation Sections
**Goal**: Guests can scroll through the complete wedding story -- hero with countdown, all 5 event details with venues and maps, photo gallery, Our Story timeline, and pre-wedding video -- with smooth scroll-triggered animations throughout
**Depends on**: Phase 1
**Requirements**: HERO-01, HERO-02, EVNT-01, EVNT-02, EVNT-03, CONT-01, CONT-03, CONT-04, ANIM-01
**Success Criteria** (what must be TRUE):
  1. Hero section displays couple names in Hindi + English with wedding date and a live countdown timer that updates every second
  2. All 5 events (Tilak, Mehndi, Sangeet, Haldi, Shadi) show date, time, venue, dress code, and a working Google Maps link, each with a distinct color accent
  3. Photo gallery displays images in a grid/carousel with lightbox view and all images lazy-load
  4. Our Story timeline shows relationship milestones with photos and scroll-triggered animations
  5. Pre-wedding video section shows a thumbnail that loads the video player only on click (no eager iframe)
**Plans:** 1/4 plans executed

Plans:
- [ ] 02-00-PLAN.md — Wave 0 test stubs and shared test setup
- [ ] 02-01-PLAN.md — Data layer, shared utilities, hero section with countdown, and Our Story timeline
- [ ] 02-02-PLAN.md — Event timeline with color-coded cards, photo gallery with lightbox, and video section
- [ ] 02-03-PLAN.md — Build verification and visual checkpoint for all presentation sections

### Phase 3: RSVP System
**Goal**: Guests can RSVP by selecting which days they will attend, with their response stored in Firebase and confirmed on screen -- the form is dead-simple for non-tech-savvy family members on mobile
**Depends on**: Phase 2
**Requirements**: RSVP-01, RSVP-02, RSVP-03, RSVP-04
**Success Criteria** (what must be TRUE):
  1. Guest can submit an RSVP with name, phone number, and day-wise event selection (3 fields max, large touch targets)
  2. RSVP data appears in Firebase Firestore after submission, with security rules preventing client-side reads of other guests' data
  3. After submitting, guest sees a full-screen confirmation with a summary of which events they are attending
  4. Registry/gifts section is visible with links or a blessing note
**Plans**: TBD

Plans:
- [ ] 03-01: TBD
- [ ] 03-02: TBD

### Phase 4: Polish + Launch Verification
**Goal**: The site is verified to work flawlessly on real devices, real networks, and with real users before sharing the WhatsApp link with 300+ guests
**Depends on**: Phase 3
**Requirements**: (verification of all prior requirements -- no new requirements)
**Success Criteria** (what must be TRUE):
  1. Lighthouse mobile score is 80+ and page loads under 3 seconds on a throttled 4G connection
  2. Site looks correct and animations are smooth on a real Android phone (budget device preferred)
  3. A non-tech-savvy family member (age 40-70) can complete the RSVP form without assistance
  4. WhatsApp sharing produces a beautiful link preview with couple names, wedding date, and preview image
  5. Countdown timer displays correct time remaining in IST timezone
**Plans**: TBD

Plans:
- [ ] 04-01: TBD

## Progress

**Execution Order:**
Phases execute in numeric order: 1 -> 2 -> 3 -> 4

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation + Design System | 2/2 | Complete   | 2026-03-11 |
| 2. Presentation Sections | 1/4 | In Progress|  |
| 3. RSVP System | 0/2 | Not started | - |
| 4. Polish + Launch Verification | 0/1 | Not started | - |
