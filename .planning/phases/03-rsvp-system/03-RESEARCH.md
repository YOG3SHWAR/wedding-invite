# Phase 3: RSVP System - Research

**Researched:** 2026-03-12
**Domain:** Firebase Firestore integration, form handling, confetti animations, RSVP UX
**Confidence:** HIGH

## Summary

Phase 3 adds a day-wise RSVP form backed by Firebase Firestore, a celebration confirmation screen, and a gift wishlist section. The technical domain is well-understood: Firebase modular SDK (v10+) for client-side Firestore writes, phone-based document IDs for deduplication (upsert via `setDoc` with `merge`), write-only security rules, and lightweight confetti for the confirmation celebration.

The biggest implementation consideration is the phone-based deduplication pattern -- using the normalized 10-digit phone number as the Firestore document ID enables atomic upsert without needing to query first (which the write-only security rules would block anyway). The form must be extremely simple for non-tech-savvy family members on mobile: 3 fields max, large touch targets, no auth.

**Primary recommendation:** Use `firebase` modular SDK with `setDoc(doc(db, 'rsvps', normalizedPhone), data, { merge: true })` for atomic upsert. Use `canvas-confetti` (no React wrapper needed) for the celebration animation -- it is tiny, performant, and works with a single function call.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- 3 large tappable day cards -- one per day (Day 1: Tilak, Day 2: Mehndi+Sangeet, Day 3: Haldi+Shadi)
- Each day card uses the event's accent color from EVENT_COLORS constant
- "Sabhi Din / All Days" select-all button above day cards
- Form fields: Name (text), Phone (10-digit Indian), Guest count (number) + day card selection
- Full-screen celebration after submission -- gold confetti/sparkle animation, dramatic Bollywood reveal
- "Thank You!" in Hindi + English
- Compact summary cards for each selected day showing venue, time, and dress code
- "Share with family" WhatsApp button with pre-filled message
- Warm blessing message above gift list -- Hindi + English
- Gift wishlist as elegant cards with product image, name, price range, and "Buy" link
- Gift items hardcoded in constants file (no Firebase backend for gifts)
- Phone number: Indian 10-digit only, auto-strip +91 or 0 prefix
- Phone-based deduplication -- upsert on same phone number
- Firestore security rules: write-only from client, read blocked
- Friendly Hindi+English error messages with retry button
- Decorative gold spinner/mandala animation for loading state
- MUST use `frontend-design` skill for ALL UI component execution

### Claude's Discretion
- Exact confetti/sparkle animation implementation
- Day card layout and spacing details
- Gift card visual design within the royal aesthetic
- Mandala spinner design for loading state
- Form field styling (input borders, focus states)
- Section placement relative to existing sections
- Mobile responsive breakpoints for gift card grid

### Deferred Ideas (OUT OF SCOPE)
None -- discussion stayed within phase scope
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| RSVP-01 | Day-wise RSVP form (name, phone, which days attending) | Firebase modular SDK + setDoc upsert pattern; phone normalization; 3 day cards with accent colors from EVENTS constant |
| RSVP-02 | Firebase backend for RSVP data storage (free tier) | Firebase client SDK v10+; Firestore write-only security rules; phone number as document ID for deduplication |
| RSVP-03 | RSVP confirmation screen with event summary | canvas-confetti for celebration; motion/react for dramatic reveal; summary cards pulling data from EVENTS constant |
| RSVP-04 | Registry/gifts section with links or blessing note | Hardcoded GIFT_ITEMS constant; elegant card grid; blessing message in Hindi+English |
</phase_requirements>

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| firebase | ^10.x (latest 12.9.0) | Firestore client SDK | Official SDK; modular/tree-shakeable; only import `firebase/firestore` to minimize bundle |
| canvas-confetti | ^1.9 | Confetti celebration animation | 6KB gzipped; no React wrapper needed; single function call; supports gold colors and custom shapes |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| motion/react | (already installed) | Confirmation screen animations, form transitions | Dramatic Bollywood reveal, spinner animation |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| canvas-confetti | react-confetti-explosion | CSS-only (lighter) but less control over gold particle colors and shapes |
| canvas-confetti | react-canvas-confetti | Heavier React wrapper; unnecessary abstraction for a one-shot effect |
| firebase client SDK | Firebase REST API | Simpler but loses offline support and retry logic that SDK provides |

**Installation:**
```bash
npm install firebase canvas-confetti
npm install -D @types/canvas-confetti
```

## Architecture Patterns

### Recommended Project Structure
```
src/
  lib/
    constants.ts          # Add RSVP_DAYS, GIFT_ITEMS constants
    firebase.ts           # Firebase app init + Firestore instance (NEW)
    rsvp.ts               # submitRsvp() function (NEW)
  components/
    sections/
      rsvp-section.tsx    # RSVP form section (NEW, 'use client')
      rsvp-confirmation.tsx  # Full-screen confirmation (NEW, 'use client')
      gifts-section.tsx   # Gift wishlist section (NEW, can be server component)
```

### Pattern 1: Firebase Client Initialization (Singleton)
**What:** Single Firebase app instance shared across the app
**When to use:** Always -- Firebase warns if you initialize multiple apps
**Example:**
```typescript
// src/lib/firebase.ts
import { initializeApp, getApps } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]
export const db = getFirestore(app)
```

### Pattern 2: Phone-as-Document-ID Upsert
**What:** Use normalized phone number as Firestore document ID for atomic create-or-update
**When to use:** Phone-based deduplication without needing to query first
**Example:**
```typescript
// src/lib/rsvp.ts
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'
import { db } from './firebase'

function normalizePhone(raw: string): string {
  const digits = raw.replace(/\D/g, '')
  // Strip +91 (country code) or leading 0
  if (digits.length === 12 && digits.startsWith('91')) return digits.slice(2)
  if (digits.length === 11 && digits.startsWith('0')) return digits.slice(1)
  return digits // already 10 digits
}

export async function submitRsvp(data: {
  name: string
  phone: string
  guestCount: number
  days: number[] // [1, 2, 3]
}) {
  const phoneId = normalizePhone(data.phone)
  if (phoneId.length !== 10) throw new Error('Invalid phone number')

  await setDoc(doc(db, 'rsvps', phoneId), {
    name: data.name.trim(),
    phone: phoneId,
    guestCount: data.guestCount,
    days: data.days,
    updatedAt: serverTimestamp(),
  }, { merge: true })

  return phoneId
}
```

### Pattern 3: Write-Only Firestore Security Rules
**What:** Allow creates and updates but block all reads from client
**When to use:** RSVP data should not be readable by other guests
**Example:**
```
// firestore.rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /rsvps/{phoneId} {
      allow create, update: if true;
      allow read, delete: if false;
    }
    // Block everything else
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

### Pattern 4: Day Card Selection State
**What:** React state managing which days are selected with toggle behavior
**When to use:** Day card multi-select with "select all" option
**Example:**
```typescript
const [selectedDays, setSelectedDays] = useState<Set<number>>(new Set())

const toggleDay = (day: number) => {
  setSelectedDays(prev => {
    const next = new Set(prev)
    if (next.has(day)) next.delete(day)
    else next.add(day)
    return next
  })
}

const selectAll = () => {
  setSelectedDays(new Set([1, 2, 3]))
}
```

### Pattern 5: WhatsApp Share Link
**What:** Deep link to WhatsApp with pre-filled message
**When to use:** Share button on confirmation screen
**Example:**
```typescript
const shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
  `${COUPLE.nameHindi} ki shaadi mein aapka swagat hai! 💒\n\nRSVP: ${window.location.origin}`
)}`
```

### Anti-Patterns to Avoid
- **Querying before writing:** With write-only rules, you cannot read documents. Use phone-as-document-ID to avoid queries entirely.
- **Using `addDoc` instead of `setDoc`:** `addDoc` creates auto-generated IDs, making deduplication impossible. Always use `setDoc` with the phone number as the document ID.
- **Importing full firebase package:** Only import `firebase/firestore` -- do not import `firebase/auth` or other unused modules, which would bloat the bundle.
- **Dynamic Tailwind classes for accent colors:** Tailwind purges dynamic classes. Use inline `style={{ backgroundColor: color }}` as established in Phase 2.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Confetti animation | Custom canvas particle system | canvas-confetti | Handles cleanup, performance, particle physics; 6KB |
| Phone normalization | Regex-only validation | Dedicated normalizePhone function with test coverage | Indian numbers have +91, 0, and 10-digit formats |
| Firebase singleton | Multiple initializeApp calls | getApps().length check pattern | Firebase throws warnings on duplicate init |
| Form state management | Custom reducer | useState with Set for days, simple state for fields | Form is only 3-4 fields, no need for form libraries |
| Loading spinner | Complex CSS animation | motion/react animate with rotate transform | Already in the bundle; matches existing animation patterns |

**Key insight:** This phase's complexity is in UX polish (large targets, friendly errors, celebration feel), not in technical architecture. Keep the tech simple -- the hardest part is making it feel right for non-tech-savvy family members.

## Common Pitfalls

### Pitfall 1: Firebase Config Exposed in Client Bundle
**What goes wrong:** Developers worry about API keys in NEXT_PUBLIC_ env vars
**Why it happens:** Misunderstanding Firebase security model
**How to avoid:** Firebase client API keys are meant to be public. Security comes from Firestore Security Rules, not from hiding the config. The write-only rules prevent data exfiltration.
**Warning signs:** Trying to use server-side Firebase Admin SDK for simple writes

### Pitfall 2: Firestore Bundle Size
**What goes wrong:** Importing `firebase` adds 200KB+ to client bundle
**Why it happens:** Default import pulls in all Firebase services
**How to avoid:** Only import specific modules: `import { getFirestore, doc, setDoc } from 'firebase/firestore'`. Never `import firebase from 'firebase'`.
**Warning signs:** Bundle size jumps significantly after adding Firebase

### Pitfall 3: Phone Number Edge Cases
**What goes wrong:** Duplicate RSVPs because phone wasn't normalized consistently
**Why it happens:** Indian users enter phones as "9876543210", "+919876543210", "09876543210"
**How to avoid:** Strip all non-digits, remove leading "91" (if 12 digits) or "0" (if 11 digits), validate exactly 10 digits remain
**Warning signs:** Same guest appearing multiple times in Firestore

### Pitfall 4: Form Submission Without Feedback
**What goes wrong:** User taps submit, nothing visible happens for 1-2 seconds
**Why it happens:** Firestore write latency on mobile networks
**How to avoid:** Immediately show loading state (mandala spinner), disable submit button, handle errors with retry
**Warning signs:** Users tapping submit multiple times

### Pitfall 5: Hydration Mismatch with Canvas Confetti
**What goes wrong:** SSR error because canvas-confetti uses browser APIs
**Why it happens:** Next.js renders on server where `window` and `document` don't exist
**How to avoid:** Only call confetti in useEffect or event handlers (never at module scope). The component is 'use client' anyway, but confetti must be triggered post-mount.
**Warning signs:** "window is not defined" errors during build

### Pitfall 6: Missing .env.local in Development
**What goes wrong:** Firebase fails to initialize, cryptic errors
**Why it happens:** Firebase config env vars not set up locally
**How to avoid:** Create `.env.local` with all NEXT_PUBLIC_FIREBASE_* vars. Add `.env.local` to .gitignore. Provide `.env.example` as template.
**Warning signs:** "Firebase: No Firebase App" errors in console

## Code Examples

### RSVP Day Constants (maps 3 days to events)
```typescript
// Add to src/lib/constants.ts
export const RSVP_DAYS = [
  {
    day: 1,
    label: 'Day 1',
    labelHindi: 'पहला दिन',
    date: '26 April',
    events: ['Tilak'],
    colorKey: 'tilak' as const,
  },
  {
    day: 2,
    label: 'Day 2',
    labelHindi: 'दूसरा दिन',
    date: '27 April',
    events: ['Mehndi', 'Sangeet'],
    colorKey: 'mehndi' as const,
  },
  {
    day: 3,
    label: 'Day 3',
    labelHindi: 'तीसरा दिन',
    date: '28 April',
    events: ['Haldi', 'Shadi'],
    colorKey: 'haldi' as const,
  },
] as const
```

### Gift Items Constant
```typescript
// Add to src/lib/constants.ts
export const GIFT_ITEMS = [
  {
    id: 'gift-1',
    name: 'Placeholder Gift',
    nameHindi: 'उपहार',
    priceRange: '2,000 - 5,000',
    image: '/images/gifts/placeholder.webp',
    buyUrl: 'https://example.com',
  },
  // ... more items to be filled by user
] as const
```

### Confetti Celebration Trigger
```typescript
// In confirmation component
import confetti from 'canvas-confetti'

const celebrate = () => {
  // Gold confetti burst
  confetti({
    particleCount: 150,
    spread: 100,
    origin: { y: 0.6 },
    colors: ['#D4AF37', '#FFD700', '#B8860B', '#800020'],
    disableForReducedMotion: true,
  })
}

// Call in useEffect when confirmation screen mounts
useEffect(() => {
  celebrate()
  // Second burst after short delay for dramatic effect
  const timer = setTimeout(celebrate, 700)
  return () => clearTimeout(timer)
}, [])
```

### Indian Phone Validation
```typescript
function validatePhone(raw: string): { valid: boolean; normalized: string; error?: string } {
  const digits = raw.replace(/\D/g, '')
  let normalized = digits

  if (digits.length === 12 && digits.startsWith('91')) normalized = digits.slice(2)
  else if (digits.length === 11 && digits.startsWith('0')) normalized = digits.slice(1)

  if (normalized.length !== 10) {
    return { valid: false, normalized: '', error: 'कृपया 10 अंकों का फ़ोन नंबर दर्ज करें / Please enter a 10-digit phone number' }
  }

  return { valid: true, normalized }
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Firebase compat SDK (`firebase/app`) | Modular SDK (`firebase/firestore`) | v9 (2021) | 80% smaller bundle via tree-shaking |
| `firebase.firestore()` | `getFirestore(app)` | v9 | Functional API, better tree-shaking |
| framer-motion | motion/react | 2024 | Already using motion/react in this project |

**Deprecated/outdated:**
- Namespaced Firebase API (v8 style): Replaced by modular API. Do not use `firebase.firestore()`.
- `addDoc` for upsert: Does not support document ID -- use `setDoc` with explicit ID.

## Open Questions

1. **Firebase project setup**
   - What we know: Firebase project must be created and credentials configured (noted as blocker in STATE.md)
   - What's unclear: Whether the user has already created a Firebase project
   - Recommendation: Plan should include a setup task with `.env.example` template; actual Firebase project creation is a manual user step

2. **Gift items content**
   - What we know: User will update with real products and links later
   - What's unclear: How many items, what categories
   - Recommendation: Create 4-6 placeholder items in the constant; user replaces later

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Vitest 4.x + @testing-library/react 16.x |
| Config file | `vitest.config.ts` (exists) |
| Quick run command | `npx vitest run --reporter=verbose` |
| Full suite command | `npx vitest run --reporter=verbose` |

### Phase Requirements to Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| RSVP-01 | Day cards render with correct accent colors; form validates phone; select-all works | unit | `npx vitest run src/__tests__/rsvp-section.test.tsx -x` | No -- Wave 0 |
| RSVP-02 | submitRsvp normalizes phone and calls setDoc with correct args | unit | `npx vitest run src/__tests__/rsvp.test.ts -x` | No -- Wave 0 |
| RSVP-03 | Confirmation renders selected days with event details; confetti fires | unit | `npx vitest run src/__tests__/rsvp-confirmation.test.tsx -x` | No -- Wave 0 |
| RSVP-04 | Gift cards render from GIFT_ITEMS constant; buy links work | unit | `npx vitest run src/__tests__/gifts-section.test.tsx -x` | No -- Wave 0 |

### Sampling Rate
- **Per task commit:** `npx vitest run --reporter=verbose`
- **Per wave merge:** `npx vitest run --reporter=verbose`
- **Phase gate:** Full suite green before `/gsd:verify-work`

### Wave 0 Gaps
- [ ] `src/__tests__/rsvp-section.test.tsx` -- covers RSVP-01 (form rendering, validation, day selection)
- [ ] `src/__tests__/rsvp.test.ts` -- covers RSVP-02 (phone normalization, submitRsvp function with mocked Firestore)
- [ ] `src/__tests__/rsvp-confirmation.test.tsx` -- covers RSVP-03 (confirmation UI, event summary cards)
- [ ] `src/__tests__/gifts-section.test.tsx` -- covers RSVP-04 (gift cards rendering)
- [ ] Mock for `firebase/firestore` in test setup (vi.mock pattern for setDoc, doc, serverTimestamp)
- [ ] Mock for `canvas-confetti` in test setup

## Sources

### Primary (HIGH confidence)
- [Firebase official docs - Add data](https://firebase.google.com/docs/firestore/manage-data/add-data) - setDoc, merge, serverTimestamp
- [Firebase official docs - Security Rules](https://firebase.google.com/docs/firestore/security/get-started) - write-only rules pattern
- [Firebase official docs - Web setup](https://firebase.google.com/docs/web/setup) - modular SDK initialization
- [canvas-confetti npm](https://www.npmjs.com/package/canvas-confetti) - API, bundle size, options

### Secondary (MEDIUM confidence)
- [Firebase npm package](https://www.npmjs.com/package/firebase) - version 12.9.0 current
- [Google Cloud Firestore upsert sample](https://docs.google.com/firestore/docs/samples/firestore-data-set-doc-upsert) - merge pattern

### Tertiary (LOW confidence)
- None -- all findings verified with official sources

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Firebase and canvas-confetti are well-documented, stable libraries
- Architecture: HIGH - Phone-as-document-ID upsert is an established Firestore pattern
- Pitfalls: HIGH - Common Firebase/Next.js integration issues are well-documented
- Validation: HIGH - Vitest already configured in project; test patterns established

**Research date:** 2026-03-12
**Valid until:** 2026-04-12 (stable domain, 30-day validity)
