---
phase: quick-4
plan: 01
subsystem: rsvp
tags: [bugfix, rsvp, indexing]
dependency_graph:
  requires: []
  provides: [correct-rsvp-day-selection]
  affects: [rsvp-form, rsvp-confirmation]
tech_stack:
  added: []
  patterns: [0-based-array-indexing]
key_files:
  modified:
    - src/components/sections/rsvp-section.tsx
    - src/components/sections/rsvp-confirmation.tsx
decisions:
  - No data migration needed (pre-launch site)
metrics:
  duration_seconds: 38
  completed: "2026-03-14T13:56:02Z"
  tasks_completed: 1
  tasks_total: 1
---

# Quick Task 4: Fix RSVP Day Selection Bug Summary

Fixed off-by-one indexing bug where selecting all 3 wedding days only saved days 2 and 3 (Tilak/day 0 was lost due to 1-based indices mapping to a 0-based array).

## What Changed

Three lines changed across two files to convert from 1-based to 0-based day indexing:

1. **`rsvp-section.tsx` - toggleAll()**: `RSVP_DAYS.map((_, i) => i + 1)` changed to `RSVP_DAYS.map((_, i) => i)` so the Set becomes `{0, 1, 2}` instead of `{1, 2, 3}`.

2. **`rsvp-section.tsx` - Day card rendering**: `const dayNumber = index + 1` changed to `const dayNumber = index` so individual day toggle and selection check use 0-based indices.

3. **`rsvp-confirmation.tsx` - selectedDayData filter**: `selectedDays.includes(index + 1)` changed to `selectedDays.includes(index)` so the confirmation screen correctly maps selected indices to RSVP_DAYS array positions.

## Root Cause

The RSVP_DAYS array is 0-indexed (positions 0, 1, 2 for Tilak, Mehndi+Sangeet, Haldi+Shadi), but the selection logic was using 1-based indices (1, 2, 3). When "All Days" was selected, `RSVP_DAYS[3]` is undefined, so only indices 1 and 2 matched -- losing Tilak (index 0).

## Commits

| Task | Description | Commit | Files |
|------|-------------|--------|-------|
| 1 | Fix 1-based to 0-based index conversion | 75fdddf | rsvp-section.tsx, rsvp-confirmation.tsx |

## Verification

- Build completes without errors
- No remaining `index + 1` patterns in RSVP day selection logic
- No remaining `index + 1` patterns in RSVP confirmation day filtering
- Consistent with `guests-section.tsx` which already uses 0-based indexing

## Deviations from Plan

None - plan executed exactly as written.

## Self-Check: PASSED
