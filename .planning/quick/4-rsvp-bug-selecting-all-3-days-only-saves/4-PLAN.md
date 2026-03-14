---
phase: quick-4
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - src/components/sections/rsvp-section.tsx
  - src/components/sections/rsvp-confirmation.tsx
autonomous: true
requirements: [RSVP-BUG-01]
must_haves:
  truths:
    - "Selecting all 3 days saves all 3 days (indices 0, 1, 2)"
    - "Selecting individual days saves the correct day"
    - "Confirmation screen shows all selected days after submission"
  artifacts:
    - path: "src/components/sections/rsvp-section.tsx"
      provides: "0-based day selection logic"
    - path: "src/components/sections/rsvp-confirmation.tsx"
      provides: "0-based day filtering for confirmation display"
  key_links:
    - from: "rsvp-section.tsx toggleAll/toggleDay"
      to: "selectedDays Set"
      via: "0-based indices matching RSVP_DAYS array positions"
    - from: "rsvp-confirmation.tsx selectedDayData"
      to: "RSVP_DAYS array"
      via: "filter using selectedDays.includes(index) with 0-based index"
---

<objective>
Fix RSVP bug where selecting all 3 days only saves day 2 and 3 (day 1 is lost).

Purpose: The selection logic uses 1-based indices (1, 2, 3) but the display/storage code expects 0-based indices (0, 1, 2). When "All Days" is selected, the Set becomes {1, 2, 3} but RSVP_DAYS[3] is undefined, so only indices 1 and 2 match — losing day 0 (Tilak).

Output: Consistent 0-based indexing across RSVP selection and confirmation display.
</objective>

<execution_context>
@./.claude/get-shit-done/workflows/execute-plan.md
@./.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@src/components/sections/rsvp-section.tsx
@src/components/sections/rsvp-confirmation.tsx
@src/components/sections/guests-section.tsx (already uses 0-based — reference only)
</context>

<tasks>

<task type="auto">
  <name>Task 1: Fix 1-based to 0-based index conversion in RSVP selection and confirmation</name>
  <files>src/components/sections/rsvp-section.tsx, src/components/sections/rsvp-confirmation.tsx</files>
  <action>
In `src/components/sections/rsvp-section.tsx`:

1. Line 82 — `toggleAll()` function: Change `RSVP_DAYS.map((_, i) => i + 1)` to `RSVP_DAYS.map((_, i) => i)` so the Set becomes {0, 1, 2} instead of {1, 2, 3}.

2. Line 215 — Day card rendering: Change `const dayNumber = index + 1` to `const dayNumber = index`. This makes `toggleDay(dayNumber)` and `selectedDays.has(dayNumber)` use 0-based indices matching the array positions.

In `src/components/sections/rsvp-confirmation.tsx`:

3. Line 39-41 — `selectedDayData` filter: Change `selectedDays.includes(index + 1)` to `selectedDays.includes(index)` so the confirmation screen correctly maps selected indices to RSVP_DAYS array positions.

No other files need changes:
- `guests-section.tsx` already uses 0-based (`RSVP_DAYS[dayIndex]` and `g.days.includes(i)`)
- `rsvp.ts` passes raw array to Firestore unchanged

NOTE: This is a pre-launch site so no Firestore data migration is needed.
  </action>
  <verify>
    <automated>cd /Users/yogeshwarchaturvedi/Documents/yogi/wedding-invite && npx next build 2>&1 | tail -5</automated>
  </verify>
  <done>
    - toggleAll produces Set {0, 1, 2} (not {1, 2, 3})
    - Individual day toggle uses index directly (0, 1, or 2)
    - Confirmation screen filters RSVP_DAYS using 0-based indices
    - Build succeeds with no errors
  </done>
</task>

</tasks>

<verification>
- Build completes without errors
- Grep confirms no remaining `index + 1` patterns in rsvp-section.tsx day selection logic
- Grep confirms no remaining `index + 1` patterns in rsvp-confirmation.tsx day filtering
</verification>

<success_criteria>
Selecting "All Days" in RSVP form stores indices {0, 1, 2}, which correctly maps to all 3 RSVP_DAYS entries (Tilak, Mehndi+Sangeet, Haldi+Shadi). Confirmation screen displays all selected days.
</success_criteria>

<output>
After completion, create `.planning/quick/4-rsvp-bug-selecting-all-3-days-only-saves/4-SUMMARY.md`
</output>
