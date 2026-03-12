---
phase: 04-polish-launch-verification
plan: 02
subsystem: performance, ui
tags: [firebase, lazy-loading, dynamic-import, opengraph, whatsapp, intersection-observer]

# Dependency graph
requires:
  - phase: 03-rsvp-system
    provides: "Firebase RSVP submission, firebase.ts, rsvp.ts"
  - phase: 04-polish-launch-verification
    plan: 01
    provides: "English-first bilingual text ordering, accessible gold token"
provides:
  - "Lazy-loaded Firebase SDK via dynamic import() -- not in initial JS bundle"
  - "OG image with real couple photo support and maroon fallback"
  - "WhatsApp share button at bottom of main page"
  - "IntersectionObserver-based Firebase preloading"
affects: []

# Tech tracking
tech-stack:
  added: []
  patterns: ["Lazy Firebase: dynamic import() in firebase-lazy.ts, preload via IntersectionObserver", "OG image photo fallback: try fetch photo, fall back to CSS-only design", "WhatsApp share: api.whatsapp.com/send with encoded text and window.location.origin"]

key-files:
  created:
    - src/lib/firebase-lazy.ts
    - src/components/sections/whatsapp-share.tsx
  modified:
    - src/lib/firebase.ts
    - src/lib/rsvp.ts
    - src/components/sections/rsvp-section.tsx
    - src/app/opengraph-image.tsx
    - src/app/page.tsx
    - src/test/setup.ts

key-decisions:
  - "Firebase lazy-loaded via raw import() not next/dynamic since it is a utility library not a component"
  - "submitRsvp dynamically imported in handleSubmit to keep Firebase out of initial bundle"
  - "preloadFirebase triggered by IntersectionObserver with 200px rootMargin for early warm-up"
  - "OG image uses fetch with try/catch fallback pattern for photo support"
  - "WhatsApp share button placed after RSVP section as standalone section with gold divider"

patterns-established:
  - "Lazy Firebase: use firebase-lazy.ts getDb() for async Firestore access, preloadFirebase() for warm-up"
  - "OG photo fallback: fetch photo from public/images/, fall back to CSS-only design on failure"
  - "WhatsApp share: client component using window.location.origin for URL"

requirements-completed: [HERO-02, HERO-03, PERF-02, RSVP-02, RSVP-03, RSVP-04, EVNT-01, EVNT-02, EVNT-03, CONT-01, CONT-03, CONT-04, ANIM-01]

# Metrics
duration: 4min
completed: 2026-03-12
---

# Phase 4 Plan 02: Firebase Lazy-Loading, OG Photo Support, and WhatsApp Share Button Summary

**Firebase SDK lazy-loaded via dynamic import() with IntersectionObserver preload, OG image upgraded with couple photo support and maroon fallback, WhatsApp share button added at page bottom**

## Performance

- **Duration:** 4 min
- **Started:** 2026-03-12T07:45:19Z
- **Completed:** 2026-03-12T07:49:19Z
- **Tasks:** 2
- **Files modified:** 8

## Accomplishments
- Firebase SDK removed from initial JS bundle via lazy-loading -- preloads when user scrolls near RSVP section
- OG image now supports a real couple photo with dark overlay and gold text, falling back to existing maroon design
- WhatsApp share button with green brand styling appears at bottom of main page with bilingual invitation text
- All 76 tests pass and Next.js build succeeds with no errors

## Task Commits

Each task was committed atomically:

1. **Task 1: Lazy-load Firebase and update RSVP submission** - `778f9be` (feat)
2. **Task 2: Upgrade OG image and add WhatsApp share button** - `fef5962` (feat)

## Files Created/Modified
- `src/lib/firebase-lazy.ts` - Lazy Firebase initialization with getDb() and preloadFirebase()
- `src/lib/firebase.ts` - Marked deprecated with comment pointing to firebase-lazy.ts
- `src/lib/rsvp.ts` - Updated submitRsvp to use dynamic Firebase imports via getDb()
- `src/components/sections/rsvp-section.tsx` - Removed static submitRsvp import, added IntersectionObserver preload
- `src/app/opengraph-image.tsx` - Added real photo support with dark overlay and gold text, maroon fallback preserved
- `src/app/page.tsx` - Added WhatsAppShare component after RsvpSection
- `src/components/sections/whatsapp-share.tsx` - Client component with green WhatsApp button, bilingual text, gold divider
- `src/test/setup.ts` - Added IntersectionObserver mock for jsdom test environment

## Decisions Made
- Used raw `import()` instead of `next/dynamic` for Firebase lazy-loading (utility library, not a component)
- submitRsvp dynamically imported in handleSubmit to ensure Firebase stays out of initial bundle
- IntersectionObserver rootMargin set to 200px for early Firebase warm-up before user reaches RSVP
- WhatsApp share created as separate client component file for clean separation from server page.tsx
- OG image fetch uses try/catch with full maroon design preserved as fallback

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Added IntersectionObserver mock to test setup**
- **Found during:** Task 2 (build verification)
- **Issue:** jsdom does not provide IntersectionObserver, causing all RSVP section tests to fail
- **Fix:** Added MockIntersectionObserver class to src/test/setup.ts
- **Files modified:** src/test/setup.ts
- **Verification:** All 76 tests pass
- **Committed in:** fef5962 (Task 2 commit)

---

**Total deviations:** 1 auto-fixed (1 blocking)
**Impact on plan:** Essential fix for test environment compatibility. No scope creep.

## Issues Encountered
None beyond the auto-fixed IntersectionObserver mock.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- This is the final plan (04-02) of the final phase (04)
- All core functionality complete: hero, events, gallery, video, RSVP, gifts, WhatsApp share
- Firebase lazy-loading reduces initial bundle for faster mobile load times
- OG image ready for real couple photo when provided (place at public/images/og-couple.jpg)
- Content checklist in constants.ts documents all placeholder items for launch

## Self-Check: PASSED

All 8 modified/created files exist. Both task commits (778f9be, fef5962) verified in git log. All must_have artifacts confirmed: getDb and preloadFirebase in firebase-lazy.ts, firebase-lazy import in rsvp.ts, og-couple in opengraph-image.tsx, whatsapp in page.tsx. Key links verified: preloadFirebase in rsvp-section.tsx, getDb in rsvp.ts.

---
*Phase: 04-polish-launch-verification*
*Completed: 2026-03-12*
