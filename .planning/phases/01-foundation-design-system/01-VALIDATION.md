---
phase: 1
slug: foundation-design-system
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-11
---

# Phase 1 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Vitest (lightweight, Vite-native, works with Next.js) |
| **Config file** | none — Wave 0 installs |
| **Quick run command** | `npx vitest run --reporter=verbose` |
| **Full suite command** | `npx vitest run` |
| **Estimated runtime** | ~5 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npm run build && npx vitest run`
- **After every plan wave:** Run `npm run build && npx vitest run`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 10 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 01-01-01 | 01 | 0 | PERF-02 | smoke | `npm run build` | ✅ | ⬜ pending |
| 01-01-02 | 01 | 0 | CONT-02 | unit | `npx vitest run src/__tests__/fonts.test.ts` | ❌ W0 | ⬜ pending |
| 01-01-03 | 01 | 0 | HERO-03 | unit | `npx vitest run src/__tests__/metadata.test.ts` | ❌ W0 | ⬜ pending |
| 01-01-04 | 01 | 0 | ANIM-02 | unit | `npx vitest run src/__tests__/scroll-reveal.test.tsx` | ❌ W0 | ⬜ pending |
| 01-02-01 | 02 | 1 | ANIM-02 | smoke | Manual — visual check | manual-only | ⬜ pending |
| 01-02-02 | 02 | 1 | PERF-01 | e2e | Manual — Chrome DevTools responsive | manual-only | ⬜ pending |
| 01-02-03 | 02 | 1 | PERF-02 | e2e | Manual — Chrome DevTools Lighthouse 4G | manual-only | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `vitest.config.ts` — Vitest configuration with React/JSX support
- [ ] `src/__tests__/metadata.test.ts` — stubs for HERO-03 (OG metadata)
- [ ] `src/__tests__/fonts.test.ts` — stubs for CONT-02 (font variables)
- [ ] `src/__tests__/scroll-reveal.test.tsx` — stubs for ANIM-02 (scroll reveal component)
- [ ] Framework install: `npm install -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom`

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Design tokens generate correct Tailwind classes | ANIM-02 | CSS token verification requires browser rendering | Inspect elements in DevTools, verify `bg-maroon`, `text-gold` etc. apply correct colors |
| Page is responsive at mobile breakpoints | PERF-01 | Visual layout verification | Chrome DevTools responsive mode at 375px, 768px, 1024px |
| Page loads under 3s on throttled 4G | PERF-02 | Requires browser Lighthouse audit | Chrome DevTools → Lighthouse → Performance → Simulated throttling → Mobile |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 10s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
