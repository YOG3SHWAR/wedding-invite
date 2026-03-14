---
phase: quick-6
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - src/lib/utils.ts
  - src/components/ui/morph-loading.tsx
  - src/app/globals.css
  - src/components/ui/3d-image-gallery.tsx
  - src/app/gallery/page.tsx
autonomous: true
requirements: [GALLERY-LOADER]

must_haves:
  truths:
    - "Gallery page shows morph-loading animation immediately on load"
    - "Gallery content is hidden until all Three.js card images are loaded"
    - "Morph squares use maroon (#800020) and gold (#D4AF37) colors"
    - "Loading overlay has cream background and fills the viewport"
    - "Gallery reveals smoothly once loading completes"
  artifacts:
    - path: "src/lib/utils.ts"
      provides: "cn() utility combining clsx + tailwind-merge"
      exports: ["cn"]
    - path: "src/components/ui/morph-loading.tsx"
      provides: "MorphLoading component with morph variant"
      exports: ["MorphLoading"]
    - path: "src/app/globals.css"
      provides: "morph-0 through morph-3 keyframe animations"
      contains: "@keyframes morph-0"
  key_links:
    - from: "src/components/ui/3d-image-gallery.tsx"
      to: "onAllImagesLoaded callback"
      via: "Image preloading with Promise.all before setting loaded state"
      pattern: "Promise\\.all.*Image.*onload"
    - from: "src/app/gallery/page.tsx"
      to: "src/components/ui/morph-loading.tsx"
      via: "Conditional render: show MorphLoading when not loaded, StellarCardGallery when loaded"
      pattern: "MorphLoading|isLoaded"
---

<objective>
Add a morph-loading animation screen to the /gallery page that displays while Three.js card images load, then reveals the gallery with a clean transition.

Purpose: The 3D gallery loads slowly due to many image textures. Users currently see a blank/partially loaded state. This gives them a polished loading experience with wedding-themed animated squares.
Output: MorphLoading component, cn() utility, gallery page with loading state management.
</objective>

<execution_context>
@./.claude/get-shit-done/workflows/execute-plan.md
@./.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/quick/6-gallery-loading-screen-with-morph-loadin/6-CONTEXT.md
@src/app/gallery/page.tsx
@src/components/ui/3d-image-gallery.tsx
@src/app/globals.css
@src/lib/placeholder-data.ts
</context>

<tasks>

<task type="auto">
  <name>Task 1: Create cn() utility, MorphLoading component, and morph keyframes</name>
  <files>src/lib/utils.ts, src/components/ui/morph-loading.tsx, src/app/globals.css</files>
  <action>
1. Install dependencies: `npm install clsx tailwind-merge`

2. Create `src/lib/utils.ts`:
```ts
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

3. Create `src/components/ui/morph-loading.tsx` — a "use client" component:
- Accept props: `variant` ("morph"), `size` ("sm" | "md" | "lg"), `className`
- Render 4 squares in a 2x2 grid using absolute positioning
- Each square uses a different morph keyframe (morph-0 through morph-3) with 1.6s duration, infinite loop
- CRITICAL COLOR CHANGE: Replace default black/white with alternating maroon (#800020) and gold (#D4AF37):
  - Square 0: maroon
  - Square 1: gold
  - Square 2: gold
  - Square 3: maroon
- Size mappings: sm=24px, md=48px, lg=64px (these are the container sizes; squares are half)
- Remove any dark mode variants (no dark: classes)
- Use cn() from "@/lib/utils"

4. Append morph keyframes to `src/app/globals.css` (AFTER existing content):
```css
/* Morph loading animation keyframes */
@keyframes morph-0 {
  0%, 100% { border-radius: 0; transform: translate(0, 0); }
  25% { border-radius: 50%; transform: translate(100%, 0); }
  50% { border-radius: 0; transform: translate(100%, 100%); }
  75% { border-radius: 50%; transform: translate(0, 100%); }
}
@keyframes morph-1 {
  0%, 100% { border-radius: 0; transform: translate(0, 0); }
  25% { border-radius: 50%; transform: translate(-100%, 0); }
  50% { border-radius: 0; transform: translate(-100%, -100%); }
  75% { border-radius: 50%; transform: translate(0, -100%); }
}
@keyframes morph-2 {
  0%, 100% { border-radius: 0; transform: translate(0, 0); }
  25% { border-radius: 50%; transform: translate(0, 100%); }
  50% { border-radius: 0; transform: translate(-100%, 100%); }
  75% { border-radius: 50%; transform: translate(-100%, 0); }
}
@keyframes morph-3 {
  0%, 100% { border-radius: 0; transform: translate(0, 0); }
  25% { border-radius: 50%; transform: translate(0, -100%); }
  50% { border-radius: 0; transform: translate(100%, -100%); }
  75% { border-radius: 50%; transform: translate(100%, 0); }
}
```
  </action>
  <verify>
    <automated>cd /Users/yogeshwarchaturvedi/Documents/yogi/wedding-invite && npx tsc --noEmit src/lib/utils.ts src/components/ui/morph-loading.tsx 2>&1 | head -20</automated>
  </verify>
  <done>cn() utility exists and exports correctly. MorphLoading component renders 4 morphing squares in maroon/gold. Morph keyframes added to globals.css.</done>
</task>

<task type="auto">
  <name>Task 2: Integrate loading screen into gallery page with image preloading</name>
  <files>src/components/ui/3d-image-gallery.tsx, src/app/gallery/page.tsx</files>
  <action>
1. Modify `src/components/ui/3d-image-gallery.tsx` — add an `onReady` callback prop to StellarCardGallery:
   - Add prop: `onReady?: () => void`
   - Inside the component (after CardProvider wraps everything), add a new internal component `ImagePreloader` that:
     a. Gets `cards` from useCard() context
     b. On mount, creates an array of `new Image()` objects for each card's thumbnail URL
     c. Uses `Promise.all` to wait for ALL images to resolve (each wrapped in a promise that resolves on img.onload and also resolves on img.onerror to prevent hanging)
     d. Once all resolved, calls `onReady?.()`
   - Place `<ImagePreloader />` inside the CardProvider so it has context access
   - The component itself renders null — it just triggers the callback

2. Modify `src/app/gallery/page.tsx` — convert to client component with loading state:
   - Add "use client" directive (metadata export must be removed since client components cannot export metadata — move metadata to a separate `layout.tsx` or just remove it since the parent layout handles OG)
   - Create a wrapper component `GalleryPageClient`:
     a. State: `const [isLoaded, setIsLoaded] = useState(false)`
     b. Render structure:
        ```
        <div className="relative w-full h-screen">
          {/* Loading overlay */}
          {!isLoaded && (
            <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: '#FFF8F0' }}>
              <MorphLoading variant="morph" size="lg" />
            </div>
          )}
          {/* Gallery always mounted (so Three.js can load textures) */}
          <div style={{ opacity: isLoaded ? 1 : 0, transition: 'opacity 0.6s ease-in-out' }}>
            <StellarCardGallery onReady={() => setIsLoaded(true)} />
          </div>
        </div>
        ```
     c. IMPORTANT: The gallery must be mounted even while loading (opacity: 0) so Three.js and images can load in the background. Only the visual display is hidden.
   - For metadata: Create `src/app/gallery/layout.tsx` as a server component that exports the metadata object (title, description, openGraph) that was previously in page.tsx.

3. Transition behavior: When isLoaded becomes true, the cream overlay unmounts (conditional render) and the gallery div transitions from opacity 0 to 1 over 0.6s. This gives a clean fade-in reveal.
  </action>
  <verify>
    <automated>cd /Users/yogeshwarchaturvedi/Documents/yogi/wedding-invite && npx tsc --noEmit 2>&1 | head -30 && npm run build 2>&1 | tail -20</automated>
  </verify>
  <done>Gallery page shows cream-background morph-loading animation on load. Gallery is hidden (opacity 0) but mounted so textures load. Once all card thumbnails are loaded, the loader disappears and gallery fades in over 0.6s. No timeout — waits for all images. Metadata preserved via layout.tsx.</done>
</task>

</tasks>

<verification>
1. `npm run build` completes without errors
2. Visit /gallery in browser — cream overlay with maroon/gold morphing squares appears immediately
3. Gallery appears with fade-in only after all images have loaded
4. No flash of unstyled/partially-loaded gallery content
</verification>

<success_criteria>
- Gallery page displays morph-loading animation with maroon and gold squares on cream background while loading
- Gallery content is invisible until all thumbnail images finish loading
- Clean 0.6s opacity fade-in transition reveals the gallery
- No loading timeout — waits for complete image load
- Page metadata (title, OG) still works via layout.tsx
- Build passes with zero errors
</success_criteria>

<output>
After completion, create `.planning/quick/6-gallery-loading-screen-with-morph-loadin/6-SUMMARY.md`
</output>
