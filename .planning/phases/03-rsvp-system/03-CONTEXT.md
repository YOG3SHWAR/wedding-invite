# Phase 3: RSVP System - Context

**Gathered:** 2026-03-12
**Status:** Ready for planning

<domain>
## Phase Boundary

Day-wise RSVP form (name, phone, guest count, day selection), Firebase Firestore backend with phone-based deduplication, full-screen confirmation with event details, and a gift wishlist section with product cards. No guest auth, no admin dashboard, no email/SMS notifications.

</domain>

<decisions>
## Implementation Decisions

### RSVP form design
- 3 large tappable day cards — one per day (Day 1: Tilak, Day 2: Mehndi+Sangeet, Day 3: Haldi+Shadi)
- Each day card uses the event's accent color (from EVENT_COLORS constant) — matches event timeline from Phase 2
- Selected state highlights/glows with the accent color
- "Sabhi Din / All Days" select-all button above day cards
- Form fields: Name (text), Phone (10-digit Indian), Guest count (number) + day card selection
- Big touch targets — optimized for mobile (non-tech-savvy family members)

### Confirmation screen
- Full-screen celebration after submission — gold confetti/sparkle animation, dramatic Bollywood reveal
- "Thank You!" in Hindi + English (धन्यवाद / Thank You)
- Compact summary cards for each selected day showing venue, time, and dress code (screenshottable)
- "Share with family" WhatsApp button — pre-filled message with site link
- "Back to top" button to revisit event details or gallery

### Registry / gifts section
- Warm blessing message above gift list — Hindi + English intro ("आपका साथ ही हमारा सबसे बड़ा उपहार है / Your presence is our greatest gift", then "If you'd like to bless us further:")
- Gift wishlist as elegant cards with product image, name, price range, and "Buy" link button
- Grid layout: 2-3 cards per row on desktop, 1-2 on mobile
- Gift items hardcoded in a constants file (like EVENTS) — no Firebase backend for gifts
- Placeholder items initially — user will update with real products and links

### Firebase & validation
- Phone number: Indian 10-digit only, auto-strip +91 or 0 prefix
- Phone-based deduplication — if same phone number submits again, load previous response and allow update (upsert)
- Firestore security rules: prevent client-side reads of other guests' data (write-only from client, read blocked)
- Error handling: friendly Hindi+English error message ("कुछ गलत हो गया / Something went wrong, please try again") with retry button — no technical jargon
- Submitting state: decorative gold spinner/mandala animation while Firebase write is in progress

### Claude's Discretion
- Exact confetti/sparkle animation implementation
- Day card layout and spacing details
- Gift card visual design within the royal aesthetic
- Mandala spinner design for loading state
- Form field styling (input borders, focus states)
- Section placement relative to existing sections (RSVP after Video, gifts before/after RSVP — Claude's call)
- Mobile responsive breakpoints for gift card grid

### Execution requirement — HARD CONSTRAINT
- **MUST use `frontend-design` skill for ALL UI component execution** — non-negotiable

</decisions>

<specifics>
## Specific Ideas

- Day cards should feel connected to the event timeline already built — same accent colors create visual continuity
- Confirmation screen should feel like a Bollywood celebration moment — dramatic, joyful, over-the-top
- WhatsApp share is key — this site spreads via WhatsApp in Indian family groups
- Gift section should feel graceful, not transactional — blessing message softens the ask
- Form must work for "uncle/aunty" demographic — large text, large buttons, obvious flow

</specifics>

<code_context>
## Existing Code Insights

### Reusable Assets
- `ScrollReveal` component (`src/components/ui/scroll-reveal.tsx`): fadeUp, fadeIn, slideLeft, slideRight — use for form section reveal
- `SectionDivider` component: mandala/paisley dividers between sections
- `EVENTS` constant (`src/lib/constants.ts`): all 5 events with dates, times, venues, dress codes, accent colors
- `EVENT_COLORS` constant (`src/lib/constants.ts`): hex values for all 5 event accent colors — use for day card colors
- `COUPLE` constant (`src/lib/constants.ts`): Hindi/English names and wedding date
- `AnimationProvider` wrapping motion/react

### Established Patterns
- Tailwind v4 CSS-first config with `@theme` tokens — color classes like `text-maroon`, `bg-gold`, `text-gold`
- Font classes: `font-hindi` (Yatra One), `font-heading` (Playfair Display), `font-body` (Cormorant Garamond)
- Section spacing: `py-section-mobile md:py-section` (3rem / 6rem)
- motion/react for animations (not framer-motion)
- Inline style for dynamic accent colors (Tailwind purges unused dynamic classes)
- Server-rendered with client components only where interactivity needed
- Click-to-load pattern for heavy embeds (used in video section)

### Integration Points
- `page.tsx` has RSVP placeholder after Video section — replace with real RSVP + gifts sections
- All sections on single page (no routing)
- Firebase SDK needs to be added as new dependency
- New constants needed: `GIFT_ITEMS` array in constants.ts, `RSVP_DAYS` grouping in constants.ts

</code_context>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 03-rsvp-system*
*Context gathered: 2026-03-12*
