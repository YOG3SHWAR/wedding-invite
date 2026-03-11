# Phase 1: Foundation + Design System - Context

**Gathered:** 2026-03-11
**Status:** Ready for planning

<domain>
## Phase Boundary

Scaffold the Next.js project with a complete design system — theme tokens (colors, spacing, typography), Hindi/English font strategy, reusable animation wrappers, responsive mobile-first foundation, performance budgets, and WhatsApp OG meta tags. No content sections are built — this phase establishes the patterns all subsequent phases build on.

</domain>

<decisions>
## Implementation Decisions

### Color & visual identity
- Royal & elegant mood — deep maroon (#800020), rich gold (#D4AF37), emerald (#046307), cream/off-white background
- Traditional Indian wedding card aesthetic — ornate borders, gold foil feel, heavy decoration
- Subtle mandala/paisley pattern at section transitions only (decorative dividers, not full-page watermark)
- Gold used for section headings and decorative dividers — elegant without overdoing it
- Prominent gold/maroon frames around major sections — like borders on a traditional Indian invitation card
- Distinct accent color per event (Tilak, Mehndi, Sangeet, Haldi, Shadi) within the royal palette
- Light theme only — no dark mode

### Typography & bilingual fonts
- Hindi headings: Decorative/calligraphic font (Yatra One, Modak, or Tiro Devanagari Hindi) — hand-lettered, traditional feel
- English headings: Elegant serif (Playfair Display) — luxury, timeless
- English body: Cormorant Garamond — refined serif for readability
- Bilingual mixing: Hindi for section headers and blessings, English for all logistics (dates, times, venues)
- Type scale: Large & dramatic — big bold headings that fill the screen, generous spacing, impact-first

### Animation approach
- Dramatic & cinematic scroll animations — bold fade-ins, elements slide in from sides, parallax depth
- Bollywood dramatic style — sparkles, gold particle effects, big swooping entrances, maximum celebration energy
- Decorative elements also animate — gold borders draw in, mandala dividers rotate/fade in ("opening a wedding card" experience)
- Entrance animation on page load: Claude's discretion (must stay within 3s 4G load budget)
- Must respect prefers-reduced-motion

### OG preview & sharing (WhatsApp)
- Preview image: Couple photo with names + wedding date overlaid in gold text (photo needed from user)
- Preview title: "Yogi & Sudha Wedding"
- Preview description: "Join us for our wedding celebration! 28 April 2026 | [City]"
- City/venue TBD — placeholder until confirmed

### Claude's Discretion
- Page-load entrance animation (if it fits within 3s 4G performance budget)
- Exact animation timing and easing curves
- Loading skeleton design
- Error state handling
- Specific mandala/paisley SVG patterns for dividers
- Exact gold shimmer/sparkle particle implementation approach
- Compression algorithm for font subsetting

### Execution requirement
- **MUST use `frontend-design` Claude skill** during UI execution work — this is a hard requirement from the user

</decisions>

<specifics>
## Specific Ideas

- "Like opening a physical Indian wedding card" — ornate borders, gold foil feel, heavy decoration
- "Bollywood dramatic" animations — sparkles, gold particles, big swooping entrances
- Couple names: **Yogi & Sudha**
- Wedding date: **28 April 2026**
- Event dates across 3 days:
  - 26 April: Tilak
  - 27 April: Mehndi, Sangeet
  - 28 April: Haldi, Shadi
- Day-wise RSVP grouping aligns with 3-day structure

</specifics>

<code_context>
## Existing Code Insights

### Reusable Assets
- None — greenfield project, no source code exists yet

### Established Patterns
- None — this phase establishes all patterns for subsequent phases

### Integration Points
- Vercel deployment target (free tier)
- Firebase project needed for Phase 3 (not this phase)
- WhatsApp OG tags must render correctly when link is shared in family groups

</code_context>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 01-foundation-design-system*
*Context gathered: 2026-03-11*
