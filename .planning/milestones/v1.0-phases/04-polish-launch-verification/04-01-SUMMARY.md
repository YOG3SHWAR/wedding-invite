---
phase: 04-polish-launch-verification
plan: 01
subsystem: ui
tags: [accessibility, wcag, bilingual, contrast, tailwind, gold-token]

# Dependency graph
requires:
  - phase: 01-foundation-design-system
    provides: "Theme tokens, font system, Tailwind v4 @theme"
  - phase: 02-presentation-sections
    provides: "Hero, event cards, gallery sections"
  - phase: 03-rsvp-system
    provides: "RSVP form, confirmation, gifts page"
provides:
  - "English-first bilingual text ordering across all sections"
  - "--color-gold-accessible WCAG AA token for cream backgrounds"
  - "Content checklist in constants.ts for launch readiness"
affects: [04-02-PLAN]

# Tech tracking
tech-stack:
  added: []
  patterns: ["English-first bilingual: English as primary h-tag, Hindi as accent below", "text-gold-accessible for gold text on cream/white backgrounds", "text-gold retained for gold text on dark/maroon backgrounds"]

key-files:
  created: []
  modified:
    - src/app/globals.css
    - src/lib/constants.ts
    - src/components/sections/hero-section.tsx
    - src/components/sections/event-card.tsx
    - src/components/sections/rsvp-section.tsx
    - src/components/sections/rsvp-confirmation.tsx
    - src/components/sections/gifts-section.tsx
    - src/lib/rsvp.ts

key-decisions:
  - "Gold accessible token #8B6914 chosen for 4.83:1 contrast ratio on cream (WCAG AA)"
  - "Bright gold #D4AF37 retained on dark/maroon backgrounds where it passes 5.15:1"
  - "Gold gradient text (decorative headings) left as-is since gradient-fill text is decorative"
  - "Hindi blessing text in hero made smaller (text-xl) as accent above English couple names"

patterns-established:
  - "English-first bilingual: English text gets the primary heading tag (h1/h2/h3), Hindi gets secondary element (p) with smaller sizing"
  - "Accessible gold: use text-gold-accessible on cream/white backgrounds, text-gold on dark backgrounds"
  - "Content checklist: constants.ts top comment lists all placeholder items needing real data before launch"

requirements-completed: [HERO-01, CONT-02, ANIM-02, PERF-01, RSVP-01]

# Metrics
duration: 6min
completed: 2026-03-12
---

# Phase 4 Plan 01: English-First Bilingual Reordering and Gold Accessibility Summary

**English-first text ordering across all sections with WCAG AA accessible gold token (#8B6914) for cream backgrounds and launch content checklist**

## Performance

- **Duration:** 6 min
- **Started:** 2026-03-12T07:34:13Z
- **Completed:** 2026-03-12T07:40:13Z
- **Tasks:** 2
- **Files modified:** 8

## Accomplishments
- All section headings, form labels, and buttons now show English as primary text with Hindi as decorative accent
- New --color-gold-accessible (#8B6914) theme token passes WCAG AA 4.83:1 on cream backgrounds
- Content checklist at top of constants.ts documents all placeholder items to update before launch
- All 76 tests pass and Next.js build succeeds with no errors

## Task Commits

Each task was committed atomically:

1. **Task 1: Add accessible gold token and content checklist** - `687f5b7` (feat)
2. **Task 2: Reorder bilingual text to English-first and fix contrast** - `5bbf2bd` (feat)

## Files Created/Modified
- `src/app/globals.css` - Added --color-gold-accessible: #8B6914 theme token
- `src/lib/constants.ts` - Added CONTENT CHECKLIST comment listing all placeholder items
- `src/components/sections/hero-section.tsx` - English couple names as h1, Hindi as h2 accent
- `src/components/sections/event-card.tsx` - English event name as h3, Hindi subtitle, accessible gold
- `src/components/sections/rsvp-section.tsx` - English-first headings, labels, buttons, error messages
- `src/components/sections/rsvp-confirmation.tsx` - English "Thank You" as h2, Hindi accent below
- `src/components/sections/gifts-section.tsx` - English "Gift Wishes" as h1, Hindi accent, accessible gold on prices
- `src/lib/rsvp.ts` - Phone validation error swapped to English-first

## Decisions Made
- Used #8B6914 as accessible gold (4.83:1 on cream) rather than darkening further to preserve regal aesthetic
- Kept bright #D4AF37 gold on dark/maroon backgrounds where contrast already passes 5.15:1
- Left gold gradient text (decorative headings like RSVP, Thank You) unchanged since gradient-fill is decorative
- Made hero Hindi blessing smaller (text-xl md:text-2xl) rather than removing it, to maintain cultural accent

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
None - all tests passed without requiring assertion updates despite text reordering.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- English-first bilingual pattern established for any future sections
- Accessible gold token available for any new UI additions
- Content checklist ready for user to fill in real data before launch
- Ready for 04-02 (performance audit, final verification)

## Self-Check: PASSED

All 8 modified files exist. Both task commits (687f5b7, 5bbf2bd) verified in git log. All must_have artifacts confirmed: gold-accessible token in globals.css, CONTENT CHECKLIST in constants.ts, COUPLE.nameEnglish in hero-section, text-gold-accessible in event-card, "Your Name" in rsvp-section, "Please enter.*phone" in rsvp.ts.

---
*Phase: 04-polish-launch-verification*
*Completed: 2026-03-12*
