---
phase: quick-2
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - src/components/ui/3d-image-gallery.tsx
  - src/components/sections/photo-gallery.tsx
  - src/lib/placeholder-data.ts
  - next.config.ts
autonomous: false
requirements: [PERF-01, UX-01]

must_haves:
  truths:
    - "Gallery page loads in under 5 seconds on 4G (currently 20MB+ unoptimized images)"
    - "Tapping/clicking on a photo image in the 3D gallery opens the CardModal"
    - "Gallery preview on main page uses Next.js Image for automatic optimization"
    - "Images are served as WebP/AVIF with responsive srcSet via Next.js Image"
  artifacts:
    - path: "src/components/ui/3d-image-gallery.tsx"
      provides: "3D gallery with fixed tap interaction and optimized image loading"
    - path: "src/components/sections/photo-gallery.tsx"
      provides: "Gallery preview section using Next.js Image component"
    - path: "src/lib/placeholder-data.ts"
      provides: "Gallery data with thumbnail src fields for optimized 3D loading"
    - path: "next.config.ts"
      provides: "Next.js image optimization config for local images"
  key_links:
    - from: "src/components/ui/3d-image-gallery.tsx (FloatingCard Html)"
      to: "CardModal open"
      via: "onClick on the Html div itself (not invisible Plane)"
      pattern: "onClick.*setSelectedCard"
    - from: "src/components/sections/photo-gallery.tsx"
      to: "Next.js Image component"
      via: "import Image from next/image"
      pattern: "<Image"
---

<objective>
Fix two bugs on the gallery page: (1) images are unoptimized raw JPGs totaling 20MB+ causing extremely slow load, and (2) tapping on photo images in the 3D gallery does not open the modal because the Html overlay has pointerEvents disabled.

Purpose: Gallery page is unusable on mobile -- slow load over WhatsApp-shared links and broken tap interaction make it a dead feature for 300+ wedding guests.
Output: Fast-loading gallery with working tap-to-view interaction on both mobile and desktop.
</objective>

<execution_context>
@./.claude/get-shit-done/workflows/execute-plan.md
@./.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/STATE.md
@src/components/ui/3d-image-gallery.tsx
@src/components/sections/photo-gallery.tsx
@src/lib/placeholder-data.ts
@next.config.ts
@CLAUDE.md

Key analysis of current issues:

1. PERFORMANCE: 28 images in public/images/gallery/ total ~20MB. Photos 13-28 are 700KB-2.7MB each (full-res camera shots up to 4160x3120). All 28 load simultaneously as raw `<img>` tags in the 3D canvas. The StarfieldBackground creates a SECOND WebGL renderer on top of the R3F Canvas (two GPU contexts). Stars count is 8000.

2. TAP INTERACTION: In FloatingCard (line 230-272), the visible photo is rendered inside `<Html>` with `pointerEvents: "none"` (line 238). An invisible `<Plane>` mesh sits behind it to capture clicks via THREE.js raycasting. This is unreliable on touch devices because:
   - The Html div visually covers the Plane but doesn't pass through touch events
   - THREE.js raycasting for touch is inconsistent with Html overlays
   - Users tap the visible image but nothing happens; tapping the text (outside Html) triggers the Plane click

FIX APPROACH: Remove the invisible Plane hack. Set `pointerEvents: "auto"` on the Html wrapper and attach onClick directly to the visible div. This is the standard drei Html interaction pattern.
</context>

<tasks>

<task type="auto">
  <name>Task 1: Fix tap interaction and optimize 3D gallery images</name>
  <files>src/components/ui/3d-image-gallery.tsx, src/lib/placeholder-data.ts</files>
  <action>
TWO changes in this task:

**A) Fix tap/click interaction in FloatingCard (3d-image-gallery.tsx):**

The root cause is `pointerEvents: "none"` on the `<Html>` element (line 238) combined with an invisible `<Plane>` for click capture. The fix:

1. Remove the invisible `<Plane>` element entirely (lines 221-228) -- it is unreliable for touch events
2. Change the `<Html>` style from `pointerEvents: "none"` to `pointerEvents: "auto"`
3. Add `onClick={handleClick}` and `onPointerOver={handlePointerOver}` and `onPointerOut={handlePointerOut}` to the outer `<div>` inside Html (the `w-40 h-52` div, line 241)
4. Keep the existing handleClick, handlePointerOver, handlePointerOut functions but update their event type from `any` to `React.MouseEvent<HTMLDivElement>` since they now handle DOM events, not THREE.js events. The `e.stopPropagation()` calls still apply
5. Remove the eslint-disable comments for `@typescript-eslint/no-explicit-any` since we now use proper types

**B) Add thumbnail paths and reduce star count:**

1. In `placeholder-data.ts`, add a `thumbnail` field to each gallery entry pointing to Next.js Image API optimized URL: `/_next/image?url=${encodeURIComponent(src)}&w=384&q=75`. This lets the 3D gallery load 384px-wide WebP thumbnails instead of multi-MB originals. Keep the full `src` for the CardModal full-view.

2. In `3d-image-gallery.tsx` FloatingCard, use `card.thumbnail` (falling back to `card.imageUrl`) for the `<img>` inside `<Html>`. The CardModal should continue using `card.imageUrl` for the full-resolution view.

3. Update the Card type to include `thumbnail: string`.

4. Reduce StarfieldBackground star count from 8000 to 2000 -- the visual effect is nearly identical but GPU load drops 75%.

5. In CardModal, update the full-res `<img>` to also use Next.js Image API URL but at higher quality: `/_next/image?url=${encodeURIComponent(selectedCard.imageUrl)}&w=828&q=85` for the modal view. This gives good quality at reasonable size.
  </action>
  <verify>
    <automated>cd /Users/yogeshwarchaturvedi/Documents/yogi/wedding-invite && npx next build 2>&1 | tail -20</automated>
  </verify>
  <done>
- Tapping/clicking the photo image area in FloatingCard opens CardModal (pointerEvents: "auto" on Html, onClick on div)
- The invisible Plane element is removed
- 3D gallery thumbnails load via Next.js Image API at 384px width (~10-30KB each vs 700KB-2.7MB)
- CardModal shows higher-quality optimized image (828px)
- StarfieldBackground uses 2000 stars instead of 8000
- Build succeeds with no errors
  </done>
</task>

<task type="auto">
  <name>Task 2: Convert main-page gallery preview to Next.js Image</name>
  <files>src/components/sections/photo-gallery.tsx, next.config.ts</files>
  <action>
**A) Update next.config.ts for local image optimization:**

The Next.js Image component works with local images from `public/` out of the box, but ensure the config does not block it. The current config is empty -- no changes needed unless build fails.

**B) Convert photo-gallery.tsx to use Next.js Image:**

1. Add `import Image from 'next/image'` at top
2. Replace the `<img>` tag (line 57-64) with Next.js `<Image>` component:
   ```tsx
   <Image
     src={img.src}
     alt={img.alt}
     width={img.width}
     height={img.height}
     loading="lazy"
     sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
     quality={75}
     className="w-full h-auto"
   />
   ```
3. Remove the `{/* eslint-disable-next-line @next/next/no-img-element */}` comment (line 56) since we are now using the proper Image component
4. Also update the Lightbox slides data to use optimized URLs: map slide `src` through `/_next/image?url=${encodeURIComponent(img.src)}&w=1200&q=85` so the lightbox also loads optimized images instead of raw originals

**C) Update the photo-gallery test if it references `<img>` tags:**

Check `src/components/sections/__tests__/photo-gallery.test.tsx` -- if it queries for `img` elements, update to account for Next.js Image (which renders as `<img>` anyway, so likely no change needed, but verify).
  </action>
  <verify>
    <automated>cd /Users/yogeshwarchaturvedi/Documents/yogi/wedding-invite && npx next build 2>&1 | tail -20</automated>
  </verify>
  <done>
- Main page gallery preview uses Next.js Image with responsive sizes and quality=75
- Images are auto-served as WebP/AVIF with srcSet for different viewport widths
- Lightbox uses optimized image URLs instead of raw originals
- No eslint warnings about img elements in photo-gallery.tsx
- Build succeeds with no errors
  </done>
</task>

<task type="checkpoint:human-verify" gate="blocking">
  <name>Task 3: Verify gallery performance and tap interaction</name>
  <files>n/a</files>
  <action>
    Human verifies the gallery page loads fast and tapping photos opens the modal.
  </action>
  <verify>
    <automated>echo "Manual verification required"</automated>
  </verify>
  <done>User confirms gallery loads fast and photo taps work on both desktop and mobile.</done>
  <what-built>Fixed gallery page tap interaction and image optimization across both the 3D gallery page and the main page gallery preview</what-built>
  <how-to-verify>
    1. Run `npm run dev` and open http://localhost:3000
    2. Scroll to Gallery section on main page -- images should load faster (check Network tab: images should be WebP format, ~30-80KB each instead of 100-300KB+)
    3. Click "View All Photos" to open the 3D gallery page at /gallery
    4. Verify the 3D gallery loads noticeably faster (thumbnails ~10-30KB each)
    5. TAP/CLICK directly on a photo image -- the CardModal should open showing the photo in higher resolution
    6. Close the modal (X button or click backdrop) and try tapping several other photos
    7. Test on mobile (or Chrome DevTools mobile mode) -- tap on photo images should reliably open the modal
    8. Verify starfield background still shows animated stars (fewer but visually similar)
  </how-to-verify>
  <resume-signal>Type "approved" or describe any issues</resume-signal>
</task>

</tasks>

<verification>
- `npx next build` completes without errors
- Network tab shows WebP/AVIF images with responsive srcSet on main page
- 3D gallery loads thumbnails at 384px width instead of full-res originals
- Tapping photo images in 3D gallery opens the CardModal reliably on touch devices
- Total gallery page payload reduced from ~20MB to ~1-2MB for thumbnails
</verification>

<success_criteria>
1. Gallery page loads in under 5 seconds on simulated 4G (was 20MB+ raw images)
2. Tapping any photo in the 3D gallery opens the CardModal (was broken -- only text taps worked)
3. Main page gallery preview serves optimized WebP/AVIF images with responsive sizes
4. No visual regressions -- starfield, card styling, modal 3D perspective effect all preserved
</success_criteria>

<output>
After completion, create `.planning/quick/2-gallery-page-takes-a-lot-of-time-to-load/2-SUMMARY.md`
</output>
