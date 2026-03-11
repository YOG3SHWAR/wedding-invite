---
phase: 2
slug: presentation-sections
status: draft
nyquist_compliant: false
wave_0_complete: false
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

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 02-01-01 | 01 | 0 | HERO-01 | unit | `npx vitest run src/components/sections/__tests__/hero-section.test.tsx -t "renders couple names"` | ❌ W0 | ⬜ pending |
| 02-01-02 | 01 | 0 | HERO-02 | unit | `npx vitest run src/components/sections/__tests__/hero-countdown.test.tsx -t "displays countdown"` | ❌ W0 | ⬜ pending |
| 02-01-03 | 01 | 0 | EVNT-01 | unit | `npx vitest run src/components/sections/__tests__/event-timeline.test.tsx` | ❌ W0 | ⬜ pending |
| 02-01-04 | 01 | 0 | EVNT-02, EVNT-03 | unit | `npx vitest run src/components/sections/__tests__/event-card.test.tsx` | ❌ W0 | ⬜ pending |
| 02-01-05 | 01 | 0 | CONT-01 | unit | `npx vitest run src/components/sections/__tests__/photo-gallery.test.tsx` | ❌ W0 | ⬜ pending |
| 02-01-06 | 01 | 0 | CONT-03 | unit | `npx vitest run src/components/sections/__tests__/our-story-section.test.tsx` | ❌ W0 | ⬜ pending |
| 02-01-07 | 01 | 0 | CONT-04 | unit | `npx vitest run src/components/sections/__tests__/video-section.test.tsx -t "click to load"` | ❌ W0 | ⬜ pending |
| 02-01-08 | 01 | 0 | ANIM-01 | smoke | `npx vitest run src/components/ui/__tests__/scroll-reveal.test.tsx` | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `src/components/sections/__tests__/hero-section.test.tsx` — stubs for HERO-01
- [ ] `src/components/sections/__tests__/hero-countdown.test.tsx` — stubs for HERO-02
- [ ] `src/components/sections/__tests__/event-timeline.test.tsx` — stubs for EVNT-01
- [ ] `src/components/sections/__tests__/event-card.test.tsx` — stubs for EVNT-02, EVNT-03
- [ ] `src/components/sections/__tests__/photo-gallery.test.tsx` — stubs for CONT-01
- [ ] `src/components/sections/__tests__/our-story-section.test.tsx` — stubs for CONT-03
- [ ] `src/components/sections/__tests__/video-section.test.tsx` — stubs for CONT-04
- [ ] `src/components/ui/__tests__/scroll-reveal.test.tsx` — stubs for ANIM-01
- [ ] Test setup file for mocking `motion/react` and `next/image` — shared fixtures

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

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 15s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
