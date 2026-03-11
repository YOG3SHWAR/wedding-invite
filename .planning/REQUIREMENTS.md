# Requirements: Yogi Wedding Invite

**Defined:** 2026-03-11
**Core Value:** Guests can easily view all wedding event details and RSVP by day — visually stunning, fast on mobile, dead-simple for 300+ guests

## v1 Requirements

### Hero & Landing

- [ ] **HERO-01**: Hero section with couple names in Hindi + English and wedding date
- [ ] **HERO-02**: Live countdown timer showing days/hours/minutes to wedding day
- [ ] **HERO-03**: WhatsApp-optimized OG meta tags for beautiful link previews

### Event Details

- [ ] **EVNT-01**: Event details for all 5 events (Tilak, Mehndi, Sangeet, Haldi, Shadi) with date, time, venue, dress code, and Google Maps link
- [ ] **EVNT-02**: Per-event visual identity with distinct color accents per event section
- [ ] **EVNT-03**: Dress code visuals/suggestions per event

### Content & Media

- [ ] **CONT-01**: Photo gallery with grid/carousel layout, lightbox view, and lazy loading
- [ ] **CONT-02**: Bilingual content — Hindi for headers/blessings, English for logistics
- [ ] **CONT-03**: "Our Story" relationship timeline with milestones and photos
- [ ] **CONT-04**: Embedded pre-wedding video (YouTube/Vimeo, lazy-loaded)

### Animations & Design

- [ ] **ANIM-01**: Scroll-triggered animations (fade-in, parallax, slide effects)
- [ ] **ANIM-02**: Bold, vibrant visual design — rich colors, large typography, dramatic layouts

### RSVP

- [ ] **RSVP-01**: Day-wise RSVP form (name, phone, which days attending)
- [ ] **RSVP-02**: Firebase backend for RSVP data storage (free tier)
- [ ] **RSVP-03**: RSVP confirmation screen with event summary
- [ ] **RSVP-04**: Registry/gifts section with links or blessing note

### Performance

- [ ] **PERF-01**: Mobile-first responsive design (works on low-end Android)
- [ ] **PERF-02**: Fast load time under 3 seconds on 4G (WebP images, lazy loading, minimal JS)

## v2 Requirements

### Enhancements

- **ENHN-01**: "Add to Calendar" buttons per event
- **ENHN-02**: Accommodation/travel info section for out-of-town guests
- **ENHN-03**: Custom domain (e.g., yogiwedding.com)

## Out of Scope

| Feature | Reason |
|---------|--------|
| Guest login/authentication | Massive friction for 300+ guests; open RSVP via link |
| Language toggle (Hindi/English switcher) | Doubles content maintenance; pre-mixed content is natural |
| Admin dashboard for RSVP | Use Firebase console or Google Sheets directly |
| Email/SMS notifications | Handle via WhatsApp groups — how Indian families communicate |
| Live photo upload/sharing wall | Use shared Google Photos album; dedicated apps do this better |
| Background music autoplay | Browsers block it; annoys users; eats mobile data |
| Per-event RSVP (individual event selection) | Too granular; day-wise is simpler and matches Indian wedding grouping |
| SEO optimization | Private invitation shared via direct link, not public discovery |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| HERO-01 | Phase 2 | Pending |
| HERO-02 | Phase 2 | Pending |
| HERO-03 | Phase 1 | Pending |
| EVNT-01 | Phase 2 | Pending |
| EVNT-02 | Phase 2 | Pending |
| EVNT-03 | Phase 2 | Pending |
| CONT-01 | Phase 2 | Pending |
| CONT-02 | Phase 1 | Pending |
| CONT-03 | Phase 2 | Pending |
| CONT-04 | Phase 2 | Pending |
| ANIM-01 | Phase 2 | Pending |
| ANIM-02 | Phase 1 | Pending |
| RSVP-01 | Phase 3 | Pending |
| RSVP-02 | Phase 3 | Pending |
| RSVP-03 | Phase 3 | Pending |
| RSVP-04 | Phase 3 | Pending |
| PERF-01 | Phase 1 | Pending |
| PERF-02 | Phase 1 | Pending |

**Coverage:**
- v1 requirements: 18 total
- Mapped to phases: 18
- Unmapped: 0

---
*Requirements defined: 2026-03-11*
*Last updated: 2026-03-11 after roadmap creation*
