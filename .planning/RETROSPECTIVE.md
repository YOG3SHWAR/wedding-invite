# Project Retrospective

*A living document updated after each milestone. Lessons feed forward into future planning.*

## Milestone: v1.0 — Yogi Wedding Invite

**Shipped:** 2026-03-12
**Phases:** 4 | **Plans:** 11 | **Sessions:** ~8

### What Was Built
- Complete Indian wedding website with royal gold/maroon/emerald design system
- 5 presentation sections: hero with countdown, event timeline, photo gallery, Our Story, video
- Day-wise RSVP with Firebase Firestore, confetti confirmation, WhatsApp share
- Standalone gifts route with royal aesthetic
- Firebase lazy-loading and OG image with photo support

### What Worked
- Coarse 4-phase granularity kept overhead minimal for a single-page site
- Wave 0 test stubs (it.todo) before feature code provided clear behavior specs
- Inline SVG data URIs for placeholders eliminated external dependencies during development
- Phone number as Firestore doc ID gave natural upsert behavior
- Frontend-design skill produced high-quality royal aesthetic (RSVP redesign)
- Entire v1.0 completed in under 1 hour of execution time

### What Was Inefficient
- Content placeholders accumulated across all phases — a single content-population pass at the end would have been cleaner to plan for upfront
- firebase.ts (eager init) was created in Phase 3, then replaced by firebase-lazy.ts in Phase 4 — could have been lazy from the start if Phase 4 research happened earlier
- Nyquist validation was only fully compliant for 1/4 phases — validation deferred too aggressively
- layout.tsx dead openGraph.images entry accumulated without cleanup

### Patterns Established
- English-first bilingual pattern: English gets primary h-tag, Hindi as decorative accent
- Click-to-load iframe for third-party embeds (YouTube, etc.)
- IntersectionObserver rootMargin preloading for lazy SDK init
- CSS columns masonry (no JS library needed for simple gallery layouts)
- Write-only Firestore rules for guest-facing forms (no reads, no deletes)

### Key Lessons
1. Plan for content placeholders explicitly — create a content checklist early so it's not tech debt at the end
2. Performance optimizations (lazy loading) should be default architecture, not a polish-phase retrofit
3. For wedding/event sites, day-wise grouping is simpler than per-event — matches how Indian families think about attendance
4. Royal/ornate aesthetic requires `frontend-design` skill — standard code generation produces generic results

### Cost Observations
- Model mix: ~70% sonnet (execution), ~20% opus (planning/verification), ~10% haiku (research)
- Sessions: ~8 across 2 days
- Notable: Total execution time was 0.9 hours for 11 plans — very high velocity due to coarse phase granularity

---

## Cross-Milestone Trends

### Process Evolution

| Milestone | Sessions | Phases | Key Change |
|-----------|----------|--------|------------|
| v1.0 | ~8 | 4 | Initial build — coarse phases, fast execution |

### Cumulative Quality

| Milestone | Tests | Nyquist | Tech Debt Items |
|-----------|-------|---------|-----------------|
| v1.0 | Multiple suites | 1/4 compliant | 13 (0 blockers) |

### Top Lessons (Verified Across Milestones)

1. Coarse phase granularity (4 phases for MVP) keeps overhead minimal and velocity high
2. Content placeholders should be explicitly tracked from Phase 1, not discovered at the end
