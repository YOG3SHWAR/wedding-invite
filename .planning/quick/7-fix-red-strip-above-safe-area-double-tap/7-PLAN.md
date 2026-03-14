---
phase: quick-7
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - src/app/layout.tsx
  - src/app/manifest.ts
  - src/app/globals.css
  - src/components/sections/photo-gallery.tsx
  - src/app/gallery/page.tsx
  - src/components/ui/3d-image-gallery.tsx
autonomous: true
requirements: [FIX-IOS-SAFEZONE, FIX-GALLERY-DOUBLETAP, FIX-LOADING-PREMATURE]

must_haves:
  truths:
    - "No red/colored strip appears above safe area on iOS (notch area matches page background)"
    - "Tapping gallery photos on mobile opens the lightbox on first tap without needing a second tap"
    - "Gallery loading screen stays visible until Three.js canvas has actually rendered, no flash of unloaded content"
  artifacts:
    - path: "src/app/layout.tsx"
      provides: "viewport export with viewportFit cover and cream themeColor"
    - path: "src/app/manifest.ts"
      provides: "manifest with cream theme_color matching page background"
    - path: "src/app/globals.css"
      provides: "safe-area-inset padding on html/body"
    - path: "src/components/sections/photo-gallery.tsx"
      provides: "Gallery photo tap opens lightbox directly without InteractiveCard consuming first tap"
    - path: "src/app/gallery/page.tsx"
      provides: "Loading screen that waits for both images AND Three.js canvas ready"
    - path: "src/components/ui/3d-image-gallery.tsx"
      provides: "onReady callback fires only after Canvas has actually rendered a frame"
  key_links:
    - from: "src/app/layout.tsx"
      to: "iOS Safari safe area"
      via: "viewport export with viewportFit: 'cover' and themeColor: '#FFF8F0'"
      pattern: "export const viewport"
    - from: "src/components/ui/3d-image-gallery.tsx"
      to: "src/app/gallery/page.tsx"
      via: "onReady callback fires after Canvas frame render"
      pattern: "onReady"
---

<objective>
Fix three iOS/mobile UX bugs: (1) red strip above the safe area/notch caused by maroon theme-color, (2) gallery photos requiring double-tap to open on mobile due to InteractiveCard consuming the first touch, and (3) gallery loading screen dismissing prematurely before Three.js canvas has rendered.

Purpose: Critical mobile UX fixes for a wedding invite primarily shared via WhatsApp (mobile-first audience).
Output: Patched layout, manifest, gallery section, and 3D gallery components.
</objective>

<execution_context>
@./.claude/get-shit-done/workflows/execute-plan.md
@./.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@src/app/layout.tsx
@src/app/manifest.ts
@src/app/globals.css
@src/components/sections/photo-gallery.tsx
@src/app/gallery/page.tsx
@src/components/ui/3d-image-gallery.tsx
@src/components/ui/interactive-card.tsx
</context>

<tasks>

<task type="auto">
  <name>Task 1: Fix iOS safe area red strip via viewport and theme-color</name>
  <files>src/app/layout.tsx, src/app/manifest.ts, src/app/globals.css</files>
  <action>
Three changes to eliminate the red/colored strip above the notch on iOS:

1. **src/app/layout.tsx** — Add a Next.js `viewport` export (separate from `metadata`, required in Next.js 14+):
```typescript
import type { Viewport } from 'next'

export const viewport: Viewport = {
  themeColor: '#FFF8F0',       // cream — matches page background
  viewportFit: 'cover',        // extend into safe areas
}
```
This generates both `<meta name="theme-color">` and `<meta name="viewport" content="..., viewport-fit=cover">`.

2. **src/app/manifest.ts** — Change `theme_color` from `'#800020'` (maroon) to `'#FFF8F0'` (cream). The maroon theme_color is the root cause of the red strip when the site is added to home screen or viewed in Safari.

3. **src/app/globals.css** — Add safe-area padding to the body rule so content doesn't overlap the notch area:
```css
body {
  /* existing styles stay */
  padding-top: env(safe-area-inset-top);
  padding-left: env(safe-area-inset-left);
  padding-right: env(safe-area-inset-right);
  padding-bottom: env(safe-area-inset-bottom);
}
```
IMPORTANT: The gallery page uses `h-screen` and `fixed inset-0` for its full-screen layout. The safe-area padding on body should NOT break that. The gallery's `fixed inset-0` loading overlay and the Three.js canvas will naturally extend edge-to-edge since `fixed` positioning is relative to the viewport, not the padded body.
  </action>
  <verify>
    <automated>cd /Users/yogeshwarchaturvedi/Documents/yogi/wedding-invite && npx next build 2>&1 | tail -5</automated>
  </verify>
  <done>
    - layout.tsx exports a `viewport` const with themeColor '#FFF8F0' and viewportFit 'cover'
    - manifest.ts has theme_color '#FFF8F0'
    - globals.css body has safe-area-inset padding
    - Build succeeds with no errors
  </done>
</task>

<task type="auto">
  <name>Task 2: Fix double-tap on gallery photos and premature loading dismissal</name>
  <files>src/components/sections/photo-gallery.tsx, src/app/gallery/page.tsx, src/components/ui/3d-image-gallery.tsx</files>
  <action>
Two fixes in this task:

**Fix A: Double-tap gallery button (photo-gallery.tsx)**

The `InteractiveCard` component's `onTouchStart` handler intercepts the first tap for a 400ms tilt animation, preventing the inner `<button onClick>` from firing immediately. On mobile, users must tap twice to open a photo.

Solution: Remove the `InteractiveCard` wrapper from gallery photo items in `src/components/sections/photo-gallery.tsx`. Replace it with a simpler wrapper that preserves the visual card styling (rounded corners, border, shadow) but does NOT intercept touch events. Keep the `<button onClick>` handler intact.

Replace:
```tsx
<InteractiveCard
  className="block w-full rounded-lg overflow-hidden border border-gold/50 hover:border-gold/70 shadow-md cursor-pointer"
  tiltIntensity={8}
  liftAmount={6}
>
  <button ...>
    <Image ... />
  </button>
</InteractiveCard>
```

With a plain div:
```tsx
<div className="block w-full rounded-lg overflow-hidden border border-gold/50 hover:border-gold/70 shadow-md cursor-pointer transition-shadow duration-200 hover:shadow-lg">
  <button ...>
    <Image ... />
  </button>
</div>
```

Remove the `InteractiveCard` import if no longer used in this file.

**Fix B: Premature loading screen dismissal (3d-image-gallery.tsx + gallery/page.tsx)**

The `ImagePreloader` fires `onReady` after thumbnail images load, but the Three.js Canvas/WebGL scene may not be rendered yet. This causes a flash of black/unloaded content.

In `src/components/ui/3d-image-gallery.tsx`:
1. Add a ref-based callback in the `StellarCardGallery` component to track when the Canvas has rendered its first frame.
2. Use the Canvas `onCreated` callback (already exists) to set a "canvas ready" flag. Combine it with the image preload completion before calling the parent `onReady`.

Specifically:
- Add `const [canvasReady, setCanvasReady] = useState(false)` and `const [imagesReady, setImagesReady] = useState(false)` in `StellarCardGallery`.
- Change `ImagePreloader` to call a local `setImagesReady(true)` instead of the parent `onReady`.
- In the Canvas `onCreated` callback, add: `setTimeout(() => setCanvasReady(true), 100)` — the small delay ensures the first frame has actually painted.
- Add a `useEffect` that calls `onReady?.()` when BOTH `canvasReady && imagesReady` are true.

```tsx
export default function StellarCardGallery({ onReady }: { onReady?: () => void }) {
  const [canvasReady, setCanvasReady] = useState(false)
  const [imagesReady, setImagesReady] = useState(false)

  useEffect(() => {
    if (canvasReady && imagesReady) {
      onReady?.()
    }
  }, [canvasReady, imagesReady, onReady])

  return (
    <CardProvider>
      <ImagePreloader onReady={() => setImagesReady(true)} />
      <div ...>
        ...
        <Canvas
          ...
          onCreated={({ gl }) => {
            gl.domElement.style.pointerEvents = 'auto'
            // Wait one frame to ensure first render is painted
            requestAnimationFrame(() => {
              setCanvasReady(true)
            })
          }}
        >
          ...
        </Canvas>
        ...
      </div>
    </CardProvider>
  )
}
```

No changes needed to `src/app/gallery/page.tsx` — it already correctly uses `isLoaded` state tied to the `onReady` callback.
  </action>
  <verify>
    <automated>cd /Users/yogeshwarchaturvedi/Documents/yogi/wedding-invite && npx next build 2>&1 | tail -5</automated>
  </verify>
  <done>
    - Gallery photos in photo-gallery.tsx are no longer wrapped in InteractiveCard — single tap opens lightbox
    - StellarCardGallery fires onReady only after BOTH images are preloaded AND Canvas has rendered first frame
    - Build succeeds with no errors
  </done>
</task>

</tasks>

<verification>
1. `npx next build` completes without errors
2. Inspect rendered HTML for `<meta name="theme-color" content="#FFF8F0">` and `viewport-fit=cover` in viewport meta
3. manifest.json endpoint returns `theme_color: "#FFF8F0"`
4. On iOS Safari: no colored strip above the notch
5. On mobile: single tap on gallery photo opens lightbox immediately
6. Gallery page: loading screen stays until 3D scene is fully rendered, no flash
</verification>

<success_criteria>
- iOS safe area shows cream background (not red/maroon) around the notch
- Gallery photos on home page respond to single tap on mobile
- Gallery loading screen transitions smoothly to the 3D gallery with no flash of unrendered content
- Build passes cleanly
</success_criteria>

<output>
After completion, create `.planning/quick/7-fix-red-strip-above-safe-area-double-tap/7-SUMMARY.md`
</output>
