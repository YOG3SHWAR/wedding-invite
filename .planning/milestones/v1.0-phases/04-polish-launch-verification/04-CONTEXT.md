# Phase 4: Polish + Launch Verification - Context

**Gathered:** 2026-03-12
**Status:** Ready for planning

<domain>
## Phase Boundary

Verify the site works flawlessly on real devices, real networks, and with real users before sharing the WhatsApp link with 300+ guests. Performance audit (Lighthouse 80+), text reordering (English-first bilingual), WhatsApp OG image upgrade with real couple photo, accessibility polish for older family members, lazy-load Firebase for faster initial load, and a WhatsApp share button at the bottom of the page. No new features — this is verification and polish of everything built in Phases 1-3.

</domain>

<decisions>
## Implementation Decisions

### Performance tuning
- Target Lighthouse mobile score: 80+
- Page must load under 3 seconds on throttled 4G
- Keep placeholder images (inline SVG) as-is — user will swap in real photos before launch
- Lazy-load Firebase SDK — only load when user scrolls to RSVP section or interacts with the form
- No navigation bar or footer — pure single-scroll experience like a physical wedding card

### Bilingual text reordering
- English first everywhere — all headings, labels, event details show English as primary text
- Hindi appears as secondary/accent text (below or beside English)
- This is a change from current state where some sections lead with Hindi
- Applies to: hero section, event timeline cards, RSVP section headers, Our Story section, all section headings

### Real content updates
- Event venues, times, and Google Maps links: user will provide real data during this phase
- All editable content stays in `src/lib/constants.ts` with clear comments marking what to update
- Add a content checklist comment at the top of constants.ts listing everything to update before launch
- Our Story milestones: keep placeholder, user will fill in later
- Hindi text strings: no separate review needed, user will check themselves

### WhatsApp sharing experience
- OG preview image: upgrade to real couple photo with text overlay (full-bleed photo, semi-transparent dark overlay, "Yogi & Sudha" in gold + "28 April 2026")
- User needs to provide the couple photo for OG image
- OG preview description: keep current "Join us for our wedding celebration! 28 April 2026"
- Add WhatsApp share button at the bottom of the main page (in addition to existing one on RSVP confirmation)

### RSVP usability
- User will test with real family members (40-70 age range) on Vercel preview link
- Accessibility polish: bump up form labels and button text sizes, ensure gold-on-cream passes contrast checks, big obvious tap targets
- Fresh form every time (no lookup of previous RSVP) — Firebase upserts on same phone number
- Polish existing loading/error states to match royal aesthetic — no offline handling addition

### Execution requirement — HARD CONSTRAINT
- **MUST use `frontend-design` skill for ALL UI changes** — non-negotiable (text reordering, WhatsApp button, accessibility improvements)

### Claude's Discretion
- Specific Lighthouse optimization techniques (code splitting, image optimization, caching headers)
- Exact Firebase lazy-loading implementation approach
- WhatsApp share button design and placement at page bottom
- Contrast fix approach for gold-on-cream text
- How to restructure OG image component for real photo support
- Bundle analysis and optimization priorities

</decisions>

<specifics>
## Specific Ideas

- "English first, then Hindi" — user wants English as the primary language across the entire site, with Hindi as decorative/cultural accent
- WhatsApp OG image should use full-bleed couple photo with dark overlay and gold text — classic wedding invite feel
- WhatsApp share button at bottom of page allows guests to share without completing RSVP first
- Family testing is the real usability validation — the "uncle/aunty" demographic is the target audience
- User will provide real venue data and couple photo during this phase

</specifics>

<code_context>
## Existing Code Insights

### Reusable Assets
- `opengraph-image.tsx`: Edge runtime OG image generator — needs modification to support real photo
- `ScrollReveal` component: already handles all scroll animations
- `SectionDivider` component: mandala dividers between sections
- `constants.ts`: central location for all content data (events, couple info, gift items, RSVP days)
- `firebase.ts` + `rsvp.ts`: Firebase configuration and RSVP submission logic
- `RsvpSection` + `RsvpConfirmation`: existing RSVP flow with day cards and confirmation

### Established Patterns
- Tailwind v4 CSS-first with `@theme` tokens — color/spacing/font classes
- motion/react for animations (not framer-motion)
- Inline style for dynamic accent colors (Tailwind purges)
- Click-to-load pattern for heavy embeds (video section)
- Server-rendered with client components only for interactivity

### Integration Points
- `page.tsx`: main page with all sections — WhatsApp share button goes after RsvpSection
- `layout.tsx`: metadata for OG tags — may need updates
- `/gifts` route: separate page for gift wishlist
- Firebase SDK currently loaded eagerly — needs lazy-loading wrapper
- All Hindi/English text scattered across section components — needs systematic reordering

</code_context>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 04-polish-launch-verification*
*Context gathered: 2026-03-12*
