# Phase 2: Presentation Sections - Context

**Gathered:** 2026-03-11
**Status:** Ready for planning

<domain>
## Phase Boundary

Build all visual content sections for the wedding site: hero with countdown timer, vertical event timeline for all 5 events, Our Story photo-driven timeline, masonry photo gallery with lightbox, and pre-wedding video embed — all with scroll-triggered animations. No RSVP or backend work.

</domain>

<decisions>
## Implementation Decisions

### Hero section
- Full-bleed couple photo as background with dark overlay
- Couple names in Hindi (योगी & सुधा) + English (Yogi & Sudha) in white/gold text on top
- Wedding date displayed prominently
- Hindi blessing/shloka (e.g., "शुभ विवाह") above the couple names — traditional cultural touch
- Placeholder gradient/pattern until real couple photo is provided
- Hero takes full viewport height

### Countdown timer
- Decorative boxes style — each unit (days, hours, minutes, seconds) in its own gold-bordered box
- Large numbers with small labels underneath
- Updates every second
- Positioned below the names/date in the hero section

### Event timeline layout
- Vertical timeline with alternating left/right cards — chronological from Tilak to Shadi
- Timeline line itself in gold
- Each card has a thick left border in the event's accent color (Tilak=red, Mehndi=green, Sangeet=purple, Haldi=yellow, Shadi=maroon)
- Each card shows: event name (Hindi + English), date & time, venue with Google Maps link, dress code suggestion, short event description (1-2 lines explaining the tradition)
- Scroll-triggered animations reveal each card as user scrolls
- Use placeholder venue names, times, and map links — user will update before launch

### Photo gallery
- Masonry grid layout (Pinterest-style, varying image heights)
- Click opens lightbox for full-size view
- **Scroll-triggered back-and-forth animations** — images animate in with alternating/staggered motion as user scrolls
- All images lazy-loaded
- Gallery handles any number of photos — user hasn't decided count yet
- Use placeholder images initially

### Pre-wedding video
- Cinematic thumbnail with centered dramatic gold play button
- Click loads YouTube/Vimeo player (no eager iframe — saves bandwidth)
- Use placeholder thumbnail until real video is available

### Our Story timeline
- Photo-driven milestones with alternating left/right layout
- Each milestone: photo + date/year + short description
- 4-5 key moments (e.g., how we met, first date, proposal, special moments)
- Vertical timeline with scroll-triggered reveal animations
- Use placeholder text and images — user will fill in real content later

### Page section order
- Hero → Our Story → Events → Gallery → Video → (RSVP placeholder for Phase 3)
- Natural narrative flow: who we are, what's happening, memories, then action

### Execution requirement — HARD CONSTRAINT
- **MUST use `frontend-design` skill for ALL UI component execution** — this is non-negotiable
- Previous phase did NOT use this skill and produced "AI slop" quality
- Every section (hero, events, gallery, story, video) MUST be built through the frontend-design skill
- This is the user's #1 concern — design quality over speed

### Claude's Discretion
- Exact animation timing and easing for scroll reveals
- Lightbox implementation approach (library vs custom)
- Masonry grid column count at different breakpoints
- Hero dark overlay opacity and gradient style
- Mandala/paisley dividers between sections (per Phase 1 decision)
- Gold particle/sparkle effects where appropriate
- Responsive breakpoints for timeline layout on mobile (likely single-column)

</decisions>

<specifics>
## Specific Ideas

- "Bollywood dramatic" animations remain the target — sparkles, gold particles, big swooping entrances
- Gallery should have "back and forth kind of animations on scrolls" — staggered, alternating motion
- "Like opening a physical Indian wedding card" aesthetic carries through from Phase 1
- Each event card should show time of events prominently
- All placeholder content should be clearly marked for easy replacement later

</specifics>

<code_context>
## Existing Code Insights

### Reusable Assets
- `ScrollReveal` component (`src/components/ui/scroll-reveal.tsx`): fadeUp, fadeIn, slideLeft, slideRight variants — use for all section reveals
- `AnimationProvider` (`src/components/providers/animation-provider.tsx`): wraps motion/react
- `EVENTS` constant (`src/lib/constants.ts`): all 5 events with Hindi names, dates, and color keys
- `COUPLE` constant (`src/lib/constants.ts`): Hindi/English names and wedding date
- `EVENT_COLORS` constant (`src/lib/constants.ts`): hex values for all 5 event accent colors

### Established Patterns
- Tailwind v4 CSS-first config with `@theme` tokens in `globals.css` — no tailwind.config.js
- Font classes: `font-hindi` (Yatra One), `font-heading` (Playfair Display), `font-body` (Cormorant Garamond)
- Color classes: `text-maroon`, `bg-gold`, `text-gold`, `bg-cream`, etc. + per-event: `bg-tilak`, `bg-mehndi`, etc.
- Section spacing: `py-section-mobile md:py-section` (3rem / 6rem)
- motion/react for animations (not framer-motion)

### Integration Points
- Current `page.tsx` has design system demo content — will be replaced with real sections
- All sections are on a single page (no routing needed)
- Sections are server-rendered with client components only where interactivity needed (countdown, gallery lightbox)

</code_context>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 02-presentation-sections*
*Context gathered: 2026-03-11*
