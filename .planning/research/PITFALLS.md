# Pitfalls Research

**Domain:** Indian wedding invitation website (multi-event, 300+ guests, mobile-heavy audience)
**Researched:** 2026-03-11
**Confidence:** HIGH

## Critical Pitfalls

### Pitfall 1: Heavy Scroll Animations Destroying Mobile Performance

**What goes wrong:**
Scroll-triggered animations (parallax, fade-in, slide effects) that look stunning on a MacBook cause severe jank, stuttering, and battery drain on low-end Android phones -- which is exactly what most Indian wedding guests will use. The site feels broken instead of beautiful. Animations that trigger layout recalculations on every scroll frame (measuring scroll position, animating `width`, `height`, `top`, `left`) overwhelm budget devices with limited CPU/GPU.

**Why it happens:**
Developers test on their own high-end devices. Animations that run at 60fps on a MacBook Pro with M-series chip run at 10-15fps on a Redmi or Realme phone with 3GB RAM. The gap between development hardware and target audience hardware is enormous for Indian weddings.

**How to avoid:**
- Use only `transform` and `opacity` for animations -- these are GPU-composited and avoid layout thrashing.
- Use Motion (formerly Framer Motion) over GSAP for React: it uses Web Animations API and Intersection Observer instead of measuring scroll position every frame. It is also tree-shakable (smaller bundle).
- Implement a "reduced motion" path: detect `prefers-reduced-motion` media query AND detect low-end devices via `navigator.hardwareConcurrency <= 4` or `navigator.deviceMemory <= 4`. Disable parallax and complex animations for these users entirely.
- Cap animations at 5-8 per viewport. Never animate more than 3 elements simultaneously.
- Avoid animating anything during scroll that triggers layout (no animating `height`, `padding`, `margin`).

**Warning signs:**
- Lighthouse Performance score below 70 on mobile simulation.
- Any animation using properties other than `transform` or `opacity`.
- No device detection or reduced-motion support in codebase.
- Testing only on Chrome DevTools mobile simulation (which does NOT simulate CPU throttling by default).

**Phase to address:**
Phase 1 (Foundation) -- animation strategy and performance budget must be established before any visual work begins. Retrofitting performance into existing animations is painful.

---

### Pitfall 2: Unoptimized Images and Videos Killing Load Time on Slow Connections

**What goes wrong:**
Wedding photo galleries with 2-5MB JPEG images and self-hosted video files make the site take 15-30 seconds to load on Indian 4G connections (which frequently deliver 2-5 Mbps in practice, not the theoretical 50+ Mbps). The hero section alone can be 8MB+ if the couple's photo and any background video are unoptimized. Guests on Jio or Airtel prepaid plans with data caps will bounce immediately.

**Why it happens:**
Couple provides high-resolution photos from professional photographer (3000x4000px, 5-8MB each). Developer uses them directly or resizes carelessly. Video is self-hosted because "it's just one clip." Nobody tests on a throttled connection.

**How to avoid:**
- Use Next.js `<Image>` component which auto-generates WebP/AVIF, serves responsive sizes via `srcSet`, and lazy-loads by default. Set `priority` only on the hero image.
- Set a hard performance budget: no single image above 150KB after optimization. Total page weight under 2MB for initial load.
- NEVER self-host video. Use YouTube embeds with facade pattern (show static thumbnail, load iframe only on click). This alone saves 2-4 seconds on LCP.
- Compress all images through a pipeline before deployment (sharp, squoosh, or Next.js built-in optimization).
- Gallery images must lazy-load -- only load images as they scroll into viewport.
- Use blur-up placeholders (Next.js `placeholder="blur"`) so users see something immediately.

**Warning signs:**
- Any image file in the repo larger than 500KB.
- Self-hosted `.mp4` files in the project.
- LCP (Largest Contentful Paint) above 2.5 seconds on throttled connection test.
- Gallery loading all images on page mount.

**Phase to address:**
Phase 1 (Foundation) -- image optimization pipeline and video strategy must be decided upfront. Phase 2 (Content/Gallery) must enforce the budget. Testing on throttled connections should be part of every phase's verification.

---

### Pitfall 3: RSVP Form UX That Confuses Non-Tech-Savvy Guests

**What goes wrong:**
The RSVP form requires too many steps, has unclear labeling, uses web-developer UX patterns that aunties and uncles don't understand, or fails silently without confirmation. Guests don't know if their RSVP went through, submit multiple times, or give up entirely. The couple ends up calling 150 people to confirm attendance anyway, defeating the entire purpose of the website.

**Why it happens:**
Developers design forms for people who use forms all day. Indian wedding guests aged 40-70 may not be comfortable with multi-step forms, dropdowns, or checkbox grids. Cultural context matters: guests may be accessing the link from a WhatsApp forward on a phone where they're not sure which button to press.

**How to avoid:**
- Maximum 3 fields: Name, Phone Number, Which days attending (checkboxes, not dropdown).
- One single page, no multi-step wizard. Everything visible at once.
- Large touch targets (minimum 48px height for all interactive elements, preferably 56px).
- Giant, unmissable submit button with clear Hindi+English label like "RSVP Bhejein / Submit RSVP".
- Immediate visual confirmation after submission: a full-screen success message with a check mark, not a small toast notification. Include "Aapka RSVP mil gaya!" (Your RSVP received!).
- Pre-fill event names with dates so guests don't need to cross-reference the events section.
- No email field -- Indian guests respond via phone, not email.
- No password or login. No CAPTCHA. Friction kills completion.
- Phone number validation should accept Indian format (10 digits, optionally with +91).

**Warning signs:**
- Form has more than 4 fields.
- Submit button is below the fold on mobile.
- No confirmation screen/message after submission.
- Using dropdown menus for event selection instead of large checkboxes.
- Requiring email address.

**Phase to address:**
Phase 2 or 3 (RSVP Implementation) -- but UX wireframe must be validated in Phase 1. Test with a real non-tech-savvy family member before shipping.

---

### Pitfall 4: Firebase/Google Sheets Backend Failing Under Concurrent RSVP Load

**What goes wrong:**
When the wedding invite link is shared on a WhatsApp group with 200+ people, 50-100 guests may hit the site within 30 minutes. If using Google Sheets API directly from the client, the 300 requests/minute rate limit can be hit. If using Firebase Firestore with poorly structured security rules (or none), data can be overwritten, corrupted, or the free tier limits (50,000 reads/day, 20,000 writes/day) can be exhausted if the page reads RSVP data on every page load.

**Why it happens:**
Developers don't anticipate the "WhatsApp blast" pattern where a wedding invite gets forwarded to multiple family groups simultaneously. Also, client-side reads of all RSVP data (e.g., showing a guest count) on every page load burns through Firestore's free read quota fast.

**How to avoid:**
- Use Firebase Firestore (not Google Sheets) for RSVP writes -- it handles concurrent writes natively and has no per-minute rate limit for writes within the 20,000/day free cap.
- NEVER read all RSVP documents from the client. No "show who's attending" feature on the public site. Manage RSVPs via Firebase Console directly.
- Structure Firestore rules to allow write-only from client: guests can submit but not read other guests' data.
- Add client-side deduplication: store a flag in localStorage after successful RSVP to prevent accidental double-submissions.
- The 50,000 reads/day and 20,000 writes/day are more than sufficient for 300 guests if you are not reading RSVP data on every page load. 300 RSVP writes is 1.5% of the daily write quota.
- Keep RSVP submission as a single Firestore document write (not multiple sub-collection writes).

**Warning signs:**
- Client-side code that reads from the RSVP collection on page load.
- No Firestore security rules defined (default deny-all or default allow-all).
- Using Google Sheets API directly from client-side code (exposes API key).
- No deduplication mechanism.

**Phase to address:**
Phase 2 (Backend/RSVP) -- Firestore setup, security rules, and write-only client pattern must be established from the start.

---

### Pitfall 5: Devanagari (Hindi) Fonts Causing Render Blocking and Layout Shift

**What goes wrong:**
Hindi text renders in a fallback system font (or invisible FOIT -- Flash of Invisible Text) for 1-3 seconds before the Devanagari web font loads. This causes visible layout shift as the fallback font has different metrics than the intended decorative Hindi font. On slow connections, Hindi headers may be invisible for several seconds, making the site look broken.

**Why it happens:**
Devanagari font files are larger than Latin-only fonts due to the larger character set. Loading them from Google Fonts adds DNS lookup + connection + download latency. Developers often pick decorative Hindi fonts that are 200-400KB without subsetting.

**How to avoid:**
- Self-host Devanagari fonts (avoid Google Fonts' multi-request chain). Use `Hind` or `Noto Sans Devanagari` -- both are well-optimized, open-source families.
- Use WOFF2 format only (best compression, 98%+ browser support).
- Subset the font to only the Hindi characters actually used on the site (wedding-specific vocabulary is maybe 50-100 unique characters). Tools: `glyphhanger` or `pyftsubset`.
- Use `font-display: swap` to show fallback text immediately, then swap when the font loads.
- Preload the Hindi font file with `<link rel="preload" as="font" type="font/woff2" crossorigin>`.
- For decorative Hindi headers only (couple names, section titles), consider a maximum of 1 decorative font. Use a system-compatible font for Hindi body text.

**Warning signs:**
- Multiple Hindi font files in the project (keep to 1-2 weights maximum).
- Any font file larger than 100KB.
- No `font-display` property in `@font-face` declarations.
- FOIT visible when testing on throttled network.
- CLS (Cumulative Layout Shift) above 0.1 in Lighthouse.

**Phase to address:**
Phase 1 (Foundation/Typography) -- font strategy must be locked in early because it affects every page and every component.

---

### Pitfall 6: Vercel/Netlify Free Tier Bandwidth Exceeded on Wedding Week

**What goes wrong:**
Vercel Hobby plan includes 100GB bandwidth/month. When the invitation link goes viral across family WhatsApp groups in the week before the wedding, 300+ guests may visit the site multiple times (plus their families, plus forwards to extended circles). If the site is image-heavy and poorly optimized (say 5MB per page load), 300 guests x 3 visits x 5MB = 4.5GB -- which is fine. But if images are unoptimized (20MB page weight), you could hit 18GB+ easily, and adding video pushes it further. The real risk is if the invite gets shared beyond the intended audience (very common in Indian families).

**Why it happens:**
Indian weddings have large extended families. A link shared in one WhatsApp group gets forwarded to 5 others. "Forward karo sabko" (forward it to everyone) culture means the actual audience could be 2-3x the guest list.

**How to avoid:**
- Keep total page weight under 2MB (achievable with image optimization + video facades).
- At 2MB per visit, 100GB supports 50,000 page loads -- more than enough for even 1000 unique visitors with multiple visits.
- Use Netlify over Vercel if bandwidth is a concern: Netlify's free tier also includes 100GB but their terms are more lenient for personal projects.
- Serve images via a CDN with aggressive caching headers. Next.js on Vercel does this automatically.
- Monitor bandwidth usage in the Vercel dashboard during the week invites are sent out.

**Warning signs:**
- Page weight exceeding 3MB in network tab.
- No image optimization pipeline in place.
- Self-hosted video files being served from Vercel.
- Vercel dashboard showing rapid bandwidth consumption.

**Phase to address:**
Phase 1 (Foundation) for performance budget. Final phase (Pre-launch) for bandwidth audit and monitoring setup.

---

## Technical Debt Patterns

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|----------------|-----------------|
| Inline all Hindi text instead of using a translation file/object | Faster initial development | Impossible to update text without editing multiple components; typos in Hindi hard to find | Acceptable for this project -- it's a one-time-use site with pre-mixed content, not a toggle |
| Store RSVP data in Google Sheets via Apps Script | No Firebase setup needed | Rate limits under concurrent load, API key exposure if done client-side, no real-time validation | Only if using server-side API route to proxy writes; never expose Sheets API directly to client |
| Skip image optimization pipeline, manually resize | No build tooling needed | Every new photo requires manual work; easy to forget; inconsistent quality | Never -- use Next.js Image component which automates this |
| Use heavy animation library (GSAP full bundle) | More animation options | 40KB+ added to bundle; most features unused for simple fade/slide animations | Never for this project -- Motion is smaller and sufficient |
| No error handling on RSVP submission | Faster to ship | Guest thinks RSVP worked when it failed silently; couple misses attendees | Never -- this is the core function of the site |

## Integration Gotchas

| Integration | Common Mistake | Correct Approach |
|-------------|----------------|------------------|
| Firebase Firestore | No security rules, leaving database open to reads/writes from anyone | Set write-only rules: allow create but not read/update/delete from client. Manage via Console. |
| Firebase Firestore | Using the older Realtime Database instead of Firestore for a structured RSVP | Use Firestore -- better querying, offline support, and structured data model for RSVP records |
| Google Maps links | Embedding full Google Maps iframe for each venue (5 venues = 5 heavy iframes) | Use simple Google Maps URL links (`https://maps.google.com/?q=...`) that open in the guest's Maps app. Zero performance cost. |
| YouTube embeds | Loading YouTube iframe on page load (adds 1-2MB of YouTube player scripts) | Use facade/lite-youtube pattern: show thumbnail image, load iframe only when user clicks play |
| Google Fonts | Loading Devanagari font from Google Fonts CDN (multiple network requests, render blocking) | Self-host WOFF2 files with preload and font-display: swap |
| Vercel hosting | Deploying with `next.config.js` image optimization disabled or misconfigured | Ensure `images.unoptimized` is NOT set to true. Verify image domains are configured if using external sources. |

## Performance Traps

| Trap | Symptoms | Prevention | When It Breaks |
|------|----------|------------|----------------|
| Loading all gallery images eagerly | 10-second initial load, huge data transfer on mobile | Lazy load with Intersection Observer or Next.js Image; show first 4-6, load rest on scroll | Immediately -- even 10 photos at 200KB each = 2MB added to initial load |
| Parallax effect on every section | Janky scrolling on Android, high battery drain | Limit parallax to hero only; use CSS `transform: translateZ(0)` for GPU acceleration; disable on mobile entirely | On any device with < 4GB RAM or older Snapdragon/MediaTek SoC |
| Countdown timer re-rendering entire component tree | CPU spike, battery drain, smooth animations stutter | Isolate countdown in its own component with `React.memo`; update only the timer text, not parent | Noticeable on low-end devices within 30 seconds of page load |
| Loading all 5 event sections with maps on mount | Slow initial render, multiple heavy DOM operations | Use a single scrollable section with event cards; no iframes; use static map links | With 5 events, DOM complexity causes measurable render delay on budget phones |
| Bundle includes unused Framer Motion/GSAP features | 80KB+ JavaScript for simple animations | Tree-shake: import only `motion` and `useScroll` from Motion; avoid importing entire library | First load -- every KB matters on 3G/slow 4G |

## Security Mistakes

| Mistake | Risk | Prevention |
|---------|------|------------|
| Exposing Firebase config with open security rules | Anyone can write spam RSVP data, read guest phone numbers, or delete real RSVPs | Write-only Firestore rules. Never allow reads from client. Never allow deletes from client. Rate-limit writes per IP if possible via Cloud Functions (Blaze plan) or accept the risk on Spark. |
| Embedding Google Sheets API key in client-side JavaScript | Key can be extracted and abused for other Google API calls on your quota | If using Sheets, always proxy through a server-side API route (Next.js API route). Never expose the API key in browser-visible code. |
| No input validation on RSVP form | Injection of malicious data, XSS if data is ever displayed, garbage entries | Validate: name (string, max 100 chars), phone (10 digits), event selection (enum of valid events). Sanitize all inputs server-side. |
| Wedding venue addresses publicly accessible without any access control | Personal venue information indexed by search engines | Add `<meta name="robots" content="noindex, nofollow">` to prevent search engine indexing. This is a private event. |

## UX Pitfalls

| Pitfall | User Impact | Better Approach |
|---------|-------------|-----------------|
| Multi-step RSVP wizard | Older guests abandon halfway; don't understand "next" button flow | Single-page form: name, phone, day checkboxes, giant submit button. All visible at once. |
| Small checkbox targets for event selection | Fat-finger errors on mobile; frustrating for anyone over 40 | Use large card-style toggles (full-width, 56px+ height) with clear selected/unselected states |
| No RSVP confirmation feedback | Guest unsure if submission worked; submits 3 times; calls the couple to ask | Full-screen success overlay with clear Hindi+English message and a check mark animation |
| Countdown timer showing hours/minutes/seconds with rapid updates | Distracting; meaningless when wedding is 30+ days away; wastes battery | Show days only when > 7 days away. Add hours/minutes only in final 48 hours. |
| Requiring scroll to find RSVP | Guest received a WhatsApp message saying "RSVP karein" but can't find the button | Add a persistent floating "RSVP" button (fixed position) visible on all sections, or a prominent CTA in the hero section |
| Auto-playing background music or video | Startles guests; consumes mobile data without consent; blocked by most browsers anyway | Never auto-play. Always require user interaction to play media. |
| Decorative Hindi fonts that are hard to read on small screens | Guests can't read event details; misread dates or times | Use decorative Hindi only for large headings (couple names, section titles). Use clean, readable Devanagari (Hind, Noto Sans Devanagari) for all informational text. |

## "Looks Done But Isn't" Checklist

- [ ] **RSVP Form:** Often missing server-side validation -- verify that malformed data is rejected, not just client-side
- [ ] **RSVP Form:** Often missing duplicate submission prevention -- verify localStorage flag + Firestore dedup logic
- [ ] **Event Details:** Often missing map links for venues -- verify each event has a working Google Maps link
- [ ] **Event Details:** Often missing dress code for each event -- verify all 5 events have dress code specified
- [ ] **Mobile Testing:** Often tested only in Chrome DevTools -- verify on an actual Android phone (borrow a Redmi/Realme if needed)
- [ ] **Hindi Text:** Often has typos that developer can't catch -- verify all Hindi content with a native speaker
- [ ] **Image Optimization:** Often skipped for "just a few photos" -- verify no image over 200KB in production build
- [ ] **Video Embeds:** Often load eagerly -- verify YouTube iframe only loads after user clicks thumbnail
- [ ] **Countdown Timer:** Often shows wrong time due to timezone issues -- verify it counts down to IST (Asia/Kolkata), not the user's local time
- [ ] **RSVP Success:** Often shows a tiny toast -- verify the confirmation is unmissable (full-screen or near full-screen)
- [ ] **SEO Prevention:** Often forgotten -- verify `noindex, nofollow` meta tag is present (private event)
- [ ] **WhatsApp Sharing:** Often missing OG meta tags -- verify the link preview shows couple's names, wedding date, and a nice image when shared on WhatsApp
- [ ] **Offline/Error State:** Often missing -- verify what happens when Firestore write fails (show retry button, not silent failure)

## Recovery Strategies

| Pitfall | Recovery Cost | Recovery Steps |
|---------|---------------|----------------|
| Unoptimized images discovered post-launch | LOW | Run all images through squoosh/sharp; replace in repo; redeploy. 1-2 hours. |
| Animation jank on mobile | MEDIUM | Audit all animations; replace layout-triggering properties with transform/opacity; add reduced-motion path. 4-8 hours. |
| RSVP data corruption/duplicates | MEDIUM | Export Firestore data; deduplicate in spreadsheet by phone number; re-import. Add dedup logic. 2-4 hours. |
| Firebase free tier quota exceeded | HIGH | Must upgrade to Blaze plan (pay-as-you-go) immediately or switch backend. If discovered on wedding week, very stressful. Prevention is critical. |
| Vercel bandwidth exceeded | MEDIUM | Optimize images to reduce page weight; if already exceeded, wait for billing cycle reset or upgrade to Pro ($20/month). Can also quickly switch to Netlify. |
| Hindi font not rendering on some devices | LOW | Switch to well-supported font (Noto Sans Devanagari has near-universal support). Self-host WOFF2. 1-2 hours. |
| Guests unable to complete RSVP | HIGH | Must fix immediately and re-share link. Lost RSVPs cannot be recovered. Couple must manually call guests who attempted and failed. Prevention is critical. |

## Pitfall-to-Phase Mapping

| Pitfall | Prevention Phase | Verification |
|---------|------------------|--------------|
| Heavy animations on mobile | Phase 1: Foundation | Lighthouse mobile score > 80; test on real Android device; reduced-motion path exists |
| Unoptimized images/video | Phase 1: Foundation + Phase 2: Content | No image > 200KB in build; video uses facade pattern; total page weight < 2MB |
| RSVP UX confusion | Phase 1: Wireframe + Phase 2: RSVP build | Test with 2-3 non-tech family members; form completion rate > 90% in testing |
| Firebase quota/concurrency | Phase 2: Backend setup | Security rules deployed; write-only from client; no client-side reads of RSVP collection |
| Devanagari font performance | Phase 1: Foundation/Typography | Self-hosted WOFF2; font file < 80KB; font-display: swap; no FOIT on throttled network test |
| Bandwidth exceeded | Phase 1: Performance budget + Pre-launch audit | Page weight < 2MB verified; Vercel dashboard monitored post-invite-send |
| Missing WhatsApp OG preview | Pre-launch phase | Share link in WhatsApp; verify preview shows couple names, date, and image |
| Timezone bug in countdown | Phase 1 or 2: Countdown implementation | Verify countdown shows correct days when tested from different timezones; hardcode IST |
| No search engine indexing prevention | Pre-launch phase | Verify `noindex` meta tag in page source; check robots.txt |

## Sources

- [Firebase Firestore Pricing](https://firebase.google.com/docs/firestore/pricing) -- 50K reads/day, 20K writes/day, 1GB storage on Spark plan
- [Firebase Pricing Plans](https://firebase.google.com/docs/projects/billing/firebase-pricing-plans)
- [Google Sheets API Rate Limits](https://developers.google.com/workspace/sheets/api/limits) -- 300 requests/minute per project
- [Vercel Hobby Plan Limits](https://vercel.com/docs/plans/hobby) -- 100GB bandwidth/month
- [Motion (Framer Motion) vs GSAP Comparison](https://motion.dev/docs/gsap-vs-motion) -- Motion uses Web Animations API, smaller bundle
- [Next.js Image Optimization Docs](https://nextjs.org/docs/app/getting-started/images) -- auto WebP/AVIF, lazy loading, responsive sizing
- [GSAP ScrollTrigger Mobile Performance](https://gsap.com/community/forums/topic/45146-why-scroll-animation-is-sluggish-on-mobile-i-need-guidance/) -- community reports of mobile jank
- [Web Font Performance Best Practices](https://byteofdev.com/posts/speed-up-font-loading/) -- self-hosting, subsetting, WOFF2, font-display

---
*Pitfalls research for: Indian wedding invitation website*
*Researched: 2026-03-11*
