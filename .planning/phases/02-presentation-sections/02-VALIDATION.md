---
phase: 2
slug: presentation-sections
status: draft
nyquist_compliant: true
wave_0_complete: false
wave_0_plan: "02-00"
created: 2026-03-11
---

# Phase 2 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Vitest 4.x + @testing-library/react 16.x |
| **Config file** | `vitest.config.ts` (exists, configured with jsdom) |
| **Quick run command** | `npx vitest run --reporter=verbose` |
| **Full suite command** | `npx vitest run` |
| **Estimated runtime** | ~10 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npx vitest run --reporter=verbose`
- **After every plan wave:** Run `npx vitest run && npx next build`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 15 seconds

---

## Wave 0 Plan

Wave 0 test stubs are created by **02-00-PLAN.md** (Wave 0). This plan creates:
- Shared test setup (`src/test/setup.ts`) with mocks for `motion/react` and `next/image`
- All 8 test stub files with `it.todo()` placeholders
- Updated `vitest.config.ts` to reference the setup file

Test stubs are filled in with real assertions by Plans 02-01 (Wave 1) and 02-02 (Wave 2) as they implement the corresponding components.

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | Status |
|---------|------|------|-------------|-----------|-------------------|--------|
| 02-00-01 | 00 | 0 | ALL | setup | `npx vitest run --reporter=verbose` | ⬜ pending |
| 02-01-01 | 01 | 1 | HERO-01, CONT-03, ANIM-01 | unit | `npx vitest run src/components/sections/__tests__/hero-section.test.tsx src/components/ui/__tests__/scroll-reveal.test.tsx --reporter=verbose` | ⬜ pending |
| 02-01-02 | 01 | 1 | HERO-01, HERO-02, CONT-03 | unit | `npx vitest run src/components/sections/__tests__/hero-section.test.tsx src/components/sections/__tests__/hero-countdown.test.tsx src/components/sections/__tests__/our-story-section.test.tsx --reporter=verbose` | ⬜ pending |
| 02-02-01 | 02 | 2 | EVNT-01, EVNT-02, EVNT-03 | unit | `npx vitest run src/components/sections/__tests__/event-timeline.test.tsx src/components/sections/__tests__/event-card.test.tsx --reporter=verbose` | ⬜ pending |
| 02-02-02 | 02 | 2 | CONT-01, CONT-04 | unit | `npx vitest run src/components/sections/__tests__/photo-gallery.test.tsx src/components/sections/__tests__/video-section.test.tsx --reporter=verbose` | ⬜ pending |
| 02-03-01 | 03 | 3 | ALL | integration | `npx vitest run --reporter=verbose && npx next build` | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

Created by **02-00-PLAN.md**:

- [ ] `src/test/setup.ts` — shared mocks for motion/react, next/image, jest-dom matchers
- [ ] `vitest.config.ts` — updated setupFiles to reference setup.ts
- [ ] `src/components/sections/__tests__/hero-section.test.tsx` — stubs for HERO-01
- [ ] `src/components/sections/__tests__/hero-countdown.test.tsx` — stubs for HERO-02
- [ ] `src/components/sections/__tests__/event-timeline.test.tsx` — stubs for EVNT-01
- [ ] `src/components/sections/__tests__/event-card.test.tsx` — stubs for EVNT-02, EVNT-03
- [ ] `src/components/sections/__tests__/photo-gallery.test.tsx` — stubs for CONT-01
- [ ] `src/components/sections/__tests__/our-story-section.test.tsx` — stubs for CONT-03
- [ ] `src/components/sections/__tests__/video-section.test.tsx` — stubs for CONT-04
- [ ] `src/components/ui/__tests__/scroll-reveal.test.tsx` — stubs for ANIM-01

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Scroll animations feel "Bollywood dramatic" | ANIM-01 | Subjective visual quality | Scroll through all sections, verify animations are smooth, dramatic, and consistent |
| Gold particle/sparkle effects | ANIM-01 | Visual verification | Check hero and section dividers for decorative effects |
| Mobile responsive timeline | EVNT-01 | Layout verification | View on 375px viewport, verify single-column stacked layout |
| Lightbox swipe gestures | CONT-01 | Touch interaction | Test on mobile device or touch simulation |

---

## Validation Sign-Off

- [x] All tasks have `<automated>` verify with unit test commands
- [x] Sampling continuity: no 3 consecutive tasks without automated verify
- [x] Wave 0 covered by 02-00-PLAN.md
- [x] No watch-mode flags
- [x] Feedback latency < 15s (unit tests, not full builds, for per-task verify)
- [x] `nyquist_compliant: true` set in frontmatter

**Approval:** approved
