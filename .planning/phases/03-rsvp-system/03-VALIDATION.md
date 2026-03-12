---
phase: 3
slug: rsvp-system
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-12
---

# Phase 3 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Vitest 4.x + @testing-library/react 16.x |
| **Config file** | `vitest.config.ts` (exists) |
| **Quick run command** | `npx vitest run --reporter=verbose` |
| **Full suite command** | `npx vitest run --reporter=verbose` |
| **Estimated runtime** | ~10 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npx vitest run --reporter=verbose`
- **After every plan wave:** Run `npx vitest run --reporter=verbose`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 10 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 03-01-01 | 01 | 0 | RSVP-01 | unit | `npx vitest run src/__tests__/rsvp-section.test.tsx -x` | ❌ W0 | ⬜ pending |
| 03-01-02 | 01 | 0 | RSVP-02 | unit | `npx vitest run src/__tests__/rsvp.test.ts -x` | ❌ W0 | ⬜ pending |
| 03-01-03 | 01 | 0 | RSVP-03 | unit | `npx vitest run src/__tests__/rsvp-confirmation.test.tsx -x` | ❌ W0 | ⬜ pending |
| 03-01-04 | 01 | 0 | RSVP-04 | unit | `npx vitest run src/__tests__/gifts-section.test.tsx -x` | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `src/__tests__/rsvp-section.test.tsx` — stubs for RSVP-01 (form rendering, validation, day selection)
- [ ] `src/__tests__/rsvp.test.ts` — stubs for RSVP-02 (phone normalization, submitRsvp with mocked Firestore)
- [ ] `src/__tests__/rsvp-confirmation.test.tsx` — stubs for RSVP-03 (confirmation UI, event summary cards)
- [ ] `src/__tests__/gifts-section.test.tsx` — stubs for RSVP-04 (gift cards rendering)
- [ ] Mock for `firebase/firestore` in test setup (`vi.mock` pattern for setDoc, doc, serverTimestamp)
- [ ] Mock for `canvas-confetti` in test setup

*Existing infrastructure covers framework installation (Vitest already configured).*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Gold confetti visual effect looks correct | RSVP-03 | Visual quality judgment | Submit RSVP, verify gold/maroon confetti fires with dramatic burst |
| Day cards use correct accent colors visually | RSVP-01 | Color perception | Open RSVP form, verify each day card matches event accent color |
| WhatsApp share link opens correctly | RSVP-03 | Requires WhatsApp app | Tap "Share with family" button on mobile with WhatsApp installed |
| Firebase write succeeds in production | RSVP-02 | Requires live Firebase project | Submit RSVP with real Firebase credentials, verify document in console |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 10s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
