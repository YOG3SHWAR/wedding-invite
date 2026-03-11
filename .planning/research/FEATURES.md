# Feature Research

**Domain:** Indian Wedding Invitation Website (multi-event, 300+ guests)
**Researched:** 2026-03-11
**Confidence:** HIGH

## Feature Landscape

### Table Stakes (Users Expect These)

Features guests and the couple assume exist. Missing these means the site feels broken or incomplete.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Hero section with couple names + wedding date | First thing anyone sees; establishes what the site IS | LOW | Large typography, background image/video, couple names in both Hindi and English |
| Countdown timer to wedding day | Every wedding site has one; creates anticipation | LOW | Use client-side JS; show days/hours/minutes/seconds; stop at zero gracefully |
| Event details for ALL events (Tilak, Mehndi, Sangeet, Haldi, Shadi) | Guests need to know where to be and when -- this is the core utility | MEDIUM | Each event: date, time, venue name, address, dress code suggestion, Google Maps link |
| Day-wise RSVP form | Guests must confirm attendance per day; the couple needs a headcount | MEDIUM | Name, phone, which days attending; submit to Firebase/Sheets; confirmation feedback on submit |
| Mobile-first responsive design | 80%+ of Indian guests will open via WhatsApp on their phone | MEDIUM | Must work on low-end Android devices (small screens, older browsers); touch-friendly tap targets |
| Photo gallery | Guests expect to see couple photos; humanizes the invitation | LOW | Grid layout with lightbox; lazy-load images; 10-20 photos max for performance |
| Venue location with map links | Guests need directions, especially for out-of-town venues | LOW | Google Maps embed or link-out; address text for copy-paste into navigation apps |
| WhatsApp-friendly sharing | The invite WILL be shared via WhatsApp -- OG meta tags are critical | LOW | Proper og:title, og:description, og:image meta tags so the link preview looks intentional, not generic |
| Fast load time (under 3 seconds on 4G) | Indian mobile networks vary; slow sites get abandoned | MEDIUM | Compress images (WebP), lazy load below-fold content, minimal JS bundle, no heavy frameworks |
| Bilingual content (Hindi + English) | Cultural expectation for an Indian wedding; headers/blessings in Hindi, details in English | LOW | Pre-mixed content, not a toggle; Hindi for emotional/ceremonial text, English for logistics |

### Differentiators (Competitive Advantage)

Features that elevate this from "functional invite" to "memorable experience." Not expected, but guests will remember them.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| Scroll-triggered animations (fade-in, parallax, slide) | Creates a cinematic, premium feel that matches the grandeur of an Indian wedding | MEDIUM | Use Intersection Observer API or Framer Motion; keep animations subtle on mobile to avoid jank; respect prefers-reduced-motion |
| "Our Story" relationship timeline | Personal touch that makes the site feel custom, not templated | LOW | Vertical timeline with dates, milestones, and small photos; scrolls naturally |
| Embedded video (pre-wedding shoot) | Video is the most engaging content format; creates emotional connection | LOW | Embed YouTube/Vimeo (free hosting); lazy-load iframe; do NOT self-host video files |
| Event-specific dress code visuals | Indian weddings have distinct dress expectations per event; visual cues help guests | LOW | Color palette swatches or example outfit images next to each event's details |
| Bold, vibrant visual design (rich colors, large type, dramatic layout) | Matches the maximalist, celebratory aesthetic of Indian weddings -- minimalism would feel wrong here | MEDIUM | Gold, maroon, deep red, emerald color palette; decorative borders; large serif/display fonts for Hindi headers |
| Registry/gifts section | Guides gift-giving gracefully; avoids awkward conversations | LOW | Simple links to external registries or a tasteful "your blessings are enough" note with optional gift suggestions |
| RSVP confirmation with event summary | After submitting RSVP, show a summary of which events they confirmed -- makes it tangible | LOW | Thank-you screen listing their selected events with dates; optionally shareable |
| Per-event visual identity | Each event (Mehndi, Sangeet, etc.) has its own color/mood, making the scroll feel like a journey | MEDIUM | Distinct color accents or background treatments per event section; ties into the vibrant aesthetic |

### Anti-Features (Commonly Requested, Often Problematic)

Features that seem appealing but create complexity without proportional value for this project.

| Feature | Why Requested | Why Problematic | Alternative |
|---------|---------------|-----------------|-------------|
| Guest login/authentication | "Personalized experience per guest" | Massive friction for 300+ guests opening a WhatsApp link; many won't bother logging in; adds auth complexity | Open RSVP form -- anyone with the link can RSVP; identify by name + phone |
| Language toggle (Hindi/English switcher) | "Let guests choose their language" | Doubles content maintenance; most Indian wedding audiences read mixed Hindi-English naturally; toggle adds UI complexity | Pre-mix Hindi and English in the layout -- Hindi for headers/blessings, English for dates/logistics |
| Admin dashboard for RSVP management | "Manage responses in a nice UI" | Significant dev effort for a one-time-use feature; Firebase console or Google Sheets already provides this | Use Firebase console or Google Sheets directly; export to CSV if needed |
| Email/SMS RSVP notifications | "Notify guests of updates" | Cost (SMS), deliverability (email), and added backend complexity | Share updates via WhatsApp group/broadcast -- that is how Indian families actually communicate |
| Live guest photo upload/sharing wall | "Let guests share photos during the wedding" | Needs moderation, storage costs, real-time sync complexity; dedicated apps (GuestCam, Samaro) do this better | Link to a shared Google Photos album or WhatsApp group for photo sharing |
| Background music autoplay | "Set the mood with music" | Browsers block autoplay; annoys users; accessibility nightmare; eats mobile data | Optional muted video background in hero section, or no audio at all |
| Complex per-event RSVP (individual event selection) | "Track exact attendance per ceremony" | Too granular for guests; confusing UI with 5 events; events on the same day are practically bundled | Day-wise RSVP -- if attending Day 2, assume attending all Day 2 events (Haldi + Shadi) |
| Custom domain from day one | "Professional URL" | Costs money; DNS setup delays launch; free Vercel/Netlify URLs work fine for WhatsApp sharing | Launch on free subdomain (e.g., yogiwedding.vercel.app); add custom domain later if desired |
| SEO optimization | "Rank on Google" | This is a private invitation site shared via direct link, not a public discovery site | Proper OG meta tags for WhatsApp/social previews are sufficient; no need for SEO |

## Feature Dependencies

```
[Mobile-first responsive design]
    +-- required by --> [All visual features]
    +-- required by --> [Fast load time]

[Event details (5 events)]
    +-- required by --> [Day-wise RSVP form]
    +-- required by --> [Venue maps]
    +-- enhanced by --> [Per-event visual identity]
    +-- enhanced by --> [Dress code visuals]

[Photo gallery]
    +-- enhanced by --> [Scroll animations]
    +-- requires --> [Image optimization / lazy loading]

[Hero section]
    +-- enhanced by --> [Countdown timer]
    +-- enhanced by --> [Embedded video]
    +-- enhanced by --> [Scroll animations]

[RSVP form]
    +-- requires --> [Firebase/Sheets backend setup]
    +-- enhanced by --> [RSVP confirmation summary]

[WhatsApp-friendly sharing]
    +-- requires --> [OG meta tags]
    +-- requires --> [Deployed URL]

[Bilingual content]
    +-- integrated into --> [All text sections]
```

### Dependency Notes

- **RSVP form requires Firebase/Sheets backend:** The form is useless without a data store; backend setup must come before RSVP UI.
- **Day-wise RSVP requires Event details:** The RSVP form references events grouped by day; event structure must be defined first.
- **All visual features require mobile-first design:** If the responsive foundation is wrong, every section breaks; this is the first thing to get right.
- **Scroll animations enhance but don't block:** Every animated section should work without animation (progressive enhancement); add animations after core layout is solid.
- **Image optimization is a prerequisite for gallery:** Without lazy loading and WebP compression, the photo gallery will tank performance on mobile.

## MVP Definition

### Launch With (v1)

Minimum viable wedding invite -- enough to send to guests and collect RSVPs.

- [ ] Hero section with couple names, date, countdown timer -- first impression, establishes the event
- [ ] Event details for all 5 events with dates, times, venues, dress codes, map links -- core utility
- [ ] Day-wise RSVP form with Firebase/Sheets backend -- the primary CTA, must work flawlessly
- [ ] Photo gallery (8-12 photos, lazy loaded) -- personal touch that makes it feel real
- [ ] Mobile-first responsive layout -- most guests access via phone
- [ ] Bilingual content (Hindi headers, English details) -- cultural expectation
- [ ] WhatsApp OG meta tags -- the link preview IS the first impression for most guests
- [ ] Fast load performance (< 3s on 4G) -- non-negotiable for the audience

### Add After Core Works (v1.1)

Features to layer in once the foundation is solid and tested on a few phones.

- [ ] Scroll-triggered animations (fade-in, parallax) -- elevates the experience but must not break mobile
- [ ] "Our Story" relationship timeline -- nice personal touch, easy to add
- [ ] Embedded pre-wedding video -- high engagement, but lazy-load the iframe
- [ ] Per-event visual identity (color accents per event) -- makes the journey feel richer
- [ ] RSVP confirmation with event summary -- polish on the RSVP flow
- [ ] Registry/gifts section -- low effort, adds utility

### Future Consideration (v2+)

Only if there is time and desire after launch.

- [ ] Event-specific dress code visuals (outfit example images) -- nice but not critical
- [ ] Guest-facing "Add to Calendar" buttons per event -- convenient but adds complexity
- [ ] Accommodation/travel info section -- useful for out-of-town guests
- [ ] Custom domain -- adds polish, costs money

## Feature Prioritization Matrix

| Feature | User Value | Implementation Cost | Priority |
|---------|------------|---------------------|----------|
| Hero + countdown | HIGH | LOW | P1 |
| Event details (all 5 events) | HIGH | MEDIUM | P1 |
| Day-wise RSVP + backend | HIGH | MEDIUM | P1 |
| Mobile-first responsive layout | HIGH | MEDIUM | P1 |
| Bilingual content | HIGH | LOW | P1 |
| WhatsApp OG meta tags | HIGH | LOW | P1 |
| Image optimization + fast load | HIGH | MEDIUM | P1 |
| Photo gallery | MEDIUM | LOW | P1 |
| Scroll-triggered animations | MEDIUM | MEDIUM | P2 |
| Our Story timeline | MEDIUM | LOW | P2 |
| Embedded video | MEDIUM | LOW | P2 |
| Per-event visual identity | MEDIUM | MEDIUM | P2 |
| RSVP confirmation summary | LOW | LOW | P2 |
| Registry/gifts section | LOW | LOW | P2 |
| Dress code visuals | LOW | LOW | P3 |
| Add to Calendar buttons | LOW | MEDIUM | P3 |
| Travel/accommodation info | LOW | LOW | P3 |

**Priority key:**
- P1: Must have for launch -- the site is incomplete without these
- P2: Should have, add once core is working -- elevates from functional to memorable
- P3: Nice to have -- only if time permits

## Competitor Feature Analysis

| Feature | WedMeGood | Joy | Zola | WeddingWire.in | Custom (This Project) |
|---------|-----------|-----|------|----------------|----------------------|
| Multi-event support | Template-based invites, not interactive | Limited to Western ceremony+reception | Similar to Joy | Basic event listing | Full 5-event structure with day grouping |
| RSVP | Not a website builder; invite-only | Strong RSVP manager | Integrated RSVP | Basic RSVP | Day-wise RSVP tailored to Indian multi-day format |
| Hindi/bilingual | Hindi templates available | Limited bilingual support | No Hindi support | Hindi templates | Natively mixed Hindi+English throughout |
| Indian aesthetic | Strong -- designed for Indian weddings | Generic, customizable | Generic | Moderate Indian templates | Bold, vibrant, maximalist -- built for Indian weddings from scratch |
| Performance on Indian mobile | App-based, variable | Good (hosted platform) | Good (hosted platform) | Variable | Optimized specifically for Indian 4G/mobile |
| Customization | Template-locked | Moderate (pick template, edit) | Moderate | Template-locked | Fully custom -- exactly what the couple wants |
| Cost | Free tier with branding | Free | Free tier | Free with branding | Free (Vercel/Netlify hosting, Firebase/Sheets backend) |
| WhatsApp sharing | Designed for WhatsApp | Basic link sharing | Basic link sharing | Basic link sharing | Optimized OG tags for WhatsApp previews |

**Our advantage:** A custom-built site avoids the template constraints of platforms. It can be tailored exactly to this wedding's 5-event structure, day-grouping logic, and bilingual aesthetic without compromise. No third-party branding, no feature limits, no subscription.

**Their advantage:** Platforms like Joy and WedMeGood handle hosting, RSVP management UI, and guest list tools out of the box. A custom build must implement these from scratch (though Firebase/Sheets keeps it simple).

## Sources

- [WedMeGood Wedding Invitations](https://www.wedmegood.com/wedding-invitations) -- Indian wedding invitation templates and features
- [Joy Wedding Website Builder](https://withjoy.com/wedding-website/) -- RSVP management and free wedding websites
- [PerfectlyWed Online RSVP Solutions](https://perfectlywed.in/online-rsvp-wedding-solutions/) -- Multi-event RSVP tracking for Indian weddings
- [Indian Wedding Toolkit - Technology](https://indianweddingtoolkit.com/technology-at-your-wedding/) -- Tech features for Indian weddings
- [Wedding Website Planning Guide for Indian Couples](https://www.marketingseo.in/post/wedding-website-planning-guide-for-indian-couples) -- Feature expectations
- [Weblium Wedding Website Examples](https://weblium.com/blog/15-wedding-websites-examples/) -- Design inspiration and standard features
- [SiteBuilderReport Wedding Examples](https://www.sitebuilderreport.com/inspiration/wedding-websites-examples) -- Template features and patterns
- [Cloudflare Mobile Performance Guide](https://www.cloudflare.com/learning/performance/how-to-make-a-site-mobile-friendly/) -- Mobile optimization best practices
- [Zola vs Joy vs The Knot Comparison](https://guesticon.com/blog/zola-vs-joy-vs-the-knot-wedding-website-comparison-2025) -- Platform feature comparison

---
*Feature research for: Indian Wedding Invitation Website*
*Researched: 2026-03-11*
