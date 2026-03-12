---
phase: 4
slug: polish-launch-verification
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-12
---

# Phase 4 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Vitest 4.0.18 + @testing-library/react 16.3.2 |
| **Config file** | `vitest.config.ts` |
| **Quick run command** | `npx vitest run --reporter=verbose` |
| **Full suite command** | `npx vitest run --reporter=verbose` |
| **Estimated runtime** | ~15 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npx vitest run --reporter=verbose`
- **After every plan wave:** Run `npx vitest run --reporter=verbose` + `npx next build`
- **Before `/gsd:verify-work`:** Full suite must be green + Lighthouse mobile 80+ + successful `next build`
- **Max feedback latency:** 30 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 04-01-01 | 01 | 1 | CONT-02 | unit | `npx vitest run` | ✅ existing | ⬜ pending |
| 04-01-02 | 01 | 1 | PERF-02 | build | `npx next build` | ✅ existing | ⬜ pending |
| 04-01-03 | 01 | 1 | RSVP-01 | unit | `npx vitest run` | ✅ existing | ⬜ pending |
| 04-02-01 | 02 | 2 | HERO-03 | manual-only | Deploy + test in WhatsApp | N/A | ⬜ pending |
| 04-02-02 | 02 | 2 | HERO-03 | build | `npx next build` | ✅ existing | ⬜ pending |
| 04-02-03 | 02 | 2 | PERF-02 | manual-only | Lighthouse CLI audit | N/A | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

Existing infrastructure covers all phase requirements. Phase 4 is primarily a manual verification phase (Lighthouse audits, real device testing, family member usability testing). The key automated gates are: tests pass + build succeeds + no TypeScript errors.

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Lighthouse mobile 80+ | PERF-02 | Requires real browser/Lighthouse audit | Run Lighthouse in Chrome DevTools on deployed preview, mobile mode, 4G throttling |
| Real device rendering | PERF-01 | Requires physical Android phone | Open Vercel preview URL on budget Android device, check all sections render correctly |
| WhatsApp OG preview | HERO-03 | Requires WhatsApp app + deployed URL | Share Vercel preview link in WhatsApp, verify preview image shows couple names + date |
| Family usability test | RSVP-01 | Requires real human tester (age 40-70) | Share Vercel preview with family member, observe if they can complete RSVP without help |
| Countdown IST timezone | HERO-02 | Requires real-time observation | Open site and verify countdown matches time remaining to 28 April 2026 IST |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 30s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
