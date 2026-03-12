---
phase: quick-1
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - src/components/ui/gold-particle-canvas.tsx
  - src/components/ui/parallax-background.tsx
  - src/app/layout.tsx
  - src/components/ui/__tests__/gold-particle-canvas.test.tsx
autonomous: false
requirements: [QUICK-1]

must_haves:
  truths:
    - "Moving the cursor on desktop produces a visible trail of gold sparkle particles that drift and fade"
    - "Tapping or dragging on mobile produces the same gold sparkle particle effect"
    - "Faint decorative background elements shift subtly based on cursor/device orientation creating depth"
    - "Effects are bold and always-on — a constant visual spectacle, not subtle or hidden"
    - "All effects are completely disabled when prefers-reduced-motion is set"
    - "Page remains smooth (no jank) on a mid-range mobile phone"
  artifacts:
    - path: "src/components/ui/gold-particle-canvas.tsx"
      provides: "Full-screen canvas particle system for gold sparkle trail"
      min_lines: 100
    - path: "src/components/ui/parallax-background.tsx"
      provides: "CSS parallax depth layer with faint decorative elements"
      min_lines: 40
    - path: "src/app/layout.tsx"
      provides: "Root layout now renders both background effect components"
      contains: "GoldParticleCanvas"
    - path: "src/components/ui/__tests__/gold-particle-canvas.test.tsx"
      provides: "Unit tests for particle canvas component"
      min_lines: 20
  key_links:
    - from: "src/app/layout.tsx"
      to: "src/components/ui/gold-particle-canvas.tsx"
      via: "import and render inside body, before AnimationProvider"
      pattern: "GoldParticleCanvas"
    - from: "src/app/layout.tsx"
      to: "src/components/ui/parallax-background.tsx"
      via: "import and render inside body, before AnimationProvider"
      pattern: "ParallaxBackground"
    - from: "src/components/ui/gold-particle-canvas.tsx"
      to: "prefers-reduced-motion"
      via: "matchMedia listener disables animation loop"
      pattern: "prefers-reduced-motion"
---

<objective>
Add dramatic, interactive background effects to the wedding invite: a bold gold sparkle particle trail that follows the cursor (desktop) or touch (mobile), plus a subtle parallax depth layer with faint decorative elements that shift on cursor/gyro input. These create a constant royal visual spectacle behind all content.

Purpose: Transform the flat cream background into a living, interactive canvas that reinforces the royal wedding aesthetic and delights guests.
Output: Two new components (GoldParticleCanvas, ParallaxBackground) wired into the root layout.
</objective>

<execution_context>
@./.claude/get-shit-done/workflows/execute-plan.md
@./.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/quick/1-add-dramatic-interactive-cursor-tap-base/1-CONTEXT.md
@src/app/layout.tsx
@src/app/globals.css
@src/components/providers/animation-provider.tsx
@src/components/ui/scroll-reveal.tsx

<interfaces>
<!-- Existing patterns the executor must follow -->

From src/app/layout.tsx:
```typescript
// Root layout wraps children in AnimationProvider
// New background components go INSIDE <body>, BEFORE <AnimationProvider>
// so they render behind all content
export default function RootLayout({ children }: { children: React.ReactNode })
```

From src/app/globals.css:
```css
/* Color tokens to use */
--color-gold: #D4AF37;
--color-gold-light: #E8CC6E;
--color-gold-dark: #B8941F;
--color-cream: #FFF8F0;
```

From src/components/providers/animation-provider.tsx:
```typescript
// Uses MotionConfig reducedMotion="user" — canvas component must
// independently check prefers-reduced-motion via matchMedia since
// canvas is not controlled by motion library
```
</interfaces>
</context>

<skill_requirement>
MUST use the `frontend-design` Claude skill during execution of UI tasks.
If the skill is not available in the executor's environment, the executor should
still apply its principles: semantic HTML, accessible markup, responsive design,
performance-first rendering, and Tailwind-native styling.
</skill_requirement>

<tasks>

<task type="auto">
  <name>Task 1: Create GoldParticleCanvas and ParallaxBackground components</name>
  <files>src/components/ui/gold-particle-canvas.tsx, src/components/ui/parallax-background.tsx, src/components/ui/__tests__/gold-particle-canvas.test.tsx</files>
  <action>
Create two client components that together produce the interactive background effects.

**GoldParticleCanvas (`src/components/ui/gold-particle-canvas.tsx`):**

A `'use client'` component that renders a fixed, full-viewport `<canvas>` element behind all content.

Particle system requirements:
- Maintain an array of particle objects. Each particle has: x, y, vx, vy, size, opacity, life, maxLife, color, shape (circle | diamond | star).
- On mousemove (desktop): spawn 3-5 particles at cursor position per frame, with randomized velocity (gentle drift: vx in [-1.5, 1.5], vy in [-2.5, -0.3] so they float upward), size (2-6px), maxLife (40-80 frames), and gold color variation (randomly pick from #D4AF37, #E8CC6E, #B8941F, #FFF0C0).
- On touchmove (mobile): same spawning logic using touch coordinates. On touchstart (tap): burst of 8-12 particles from tap point with wider velocity spread for a "pop" effect.
- Also spawn ambient particles: every 3-5 frames, spawn 1 particle at a random position along the edges of the viewport (to keep the background alive even without interaction). These ambient particles drift inward slowly with lower opacity (0.3-0.5 max).
- Each frame: update all particles (position += velocity, vy += 0.01 gravity, life++, opacity = (1 - life/maxLife) * initialOpacity). Remove dead particles (life >= maxLife).
- Draw each particle based on shape: circles use arc(), diamonds use rotated square path, stars use a 4-point star path. Apply globalAlpha = particle.opacity. Fill with particle.color.
- Canvas sizing: on mount and window resize, set canvas width/height to window.innerWidth/innerHeight with devicePixelRatio scaling for crisp rendering (ctx.scale(dpr, dpr), canvas style width/height = 100vw/100vh, canvas.width = window.innerWidth * dpr, canvas.height = window.innerHeight * dpr).
- Canvas CSS: `position: fixed; inset: 0; z-index: 0; pointer-events: none;` — lets clicks pass through to content.
- Animation loop: use requestAnimationFrame. Clear canvas each frame with clearRect.
- Performance: cap particle array at 200 particles max. On mobile (detect via `'ontouchstart' in window` or `navigator.maxTouchPoints > 0`), reduce cap to 120 and reduce ambient spawn rate. Use a single `requestAnimationFrame` loop; do NOT use setInterval.
- Reduced motion: on mount, check `window.matchMedia('(prefers-reduced-motion: reduce)')`. If matches, do NOT start the animation loop at all — render nothing. Add a listener for changes so it stops/starts dynamically.
- Cleanup: on unmount, cancel the animationFrame, remove event listeners, remove resize listener.

**ParallaxBackground (`src/components/ui/parallax-background.tsx`):**

A `'use client'` component that renders 4-6 faint decorative SVG elements (mandala outlines, paisley curves, lotus shapes — reuse/adapt the paisley motif from SectionDivider) positioned absolutely across the viewport. Each element has a different `data-depth` factor (0.02 to 0.06).

- On mousemove (desktop): calculate offset from viewport center, translate each element by `(offset * depth)` pixels using CSS transform for GPU acceleration. Use a ref + requestAnimationFrame to throttle updates.
- On mobile: use `window.DeviceOrientationEvent` (if available, with permission check on iOS 13+) to get beta/gamma tilt values, mapping them to the same translate offsets. Fall back to no parallax if orientation not available (elements stay static — still decorative).
- Elements: render as absolutely positioned divs with SVG children, scattered at fixed viewport percentages (e.g., top-left, bottom-right, center-left, etc.). Use Tailwind for positioning: `fixed`, percentage-based `top`/`left`, `opacity-[0.06]` to `opacity-[0.12]` (very faint), `text-gold` color. Add `pointer-events-none` and `aria-hidden="true"`.
- Reduced motion: check `prefers-reduced-motion` — if set, render the decorative elements statically (no transforms on move) but still visible.
- Sizing: elements should be large (150-300px) and feel like faint watermarks.
- z-index: 0, same layer as canvas, behind all content.

**Tests (`src/components/ui/__tests__/gold-particle-canvas.test.tsx`):**

Follow existing test pattern (see scroll-reveal.test.tsx). Use @testing-library/react:
- Test that GoldParticleCanvas renders a canvas element.
- Test that the canvas has pointer-events-none style.
- Test that component renders without crashing (basic smoke test).
- Mock `window.matchMedia` to return `{ matches: true }` for reduced-motion and verify no canvas is rendered (or canvas has no animation class).
  </action>
  <verify>
    <automated>cd /Users/yogeshwarchaturvedi/Documents/yogi/wedding-invite && npx jest --passWithNoTests src/components/ui/__tests__/gold-particle-canvas.test.tsx 2>&1 | tail -20</automated>
  </verify>
  <done>
- GoldParticleCanvas component exists, exports properly, renders a fixed full-viewport canvas
- ParallaxBackground component exists, exports properly, renders decorative SVG elements
- Both components are 'use client' and handle prefers-reduced-motion
- Tests pass for canvas component
  </done>
</task>

<task type="auto">
  <name>Task 2: Wire background effects into root layout</name>
  <files>src/app/layout.tsx</files>
  <action>
Edit `src/app/layout.tsx` to import and render both background components:

1. Add imports at top:
   ```typescript
   import { GoldParticleCanvas } from '@/components/ui/gold-particle-canvas'
   import { ParallaxBackground } from '@/components/ui/parallax-background'
   ```

2. Inside the `<body>` tag, BEFORE `<AnimationProvider>`, add:
   ```tsx
   <GoldParticleCanvas />
   <ParallaxBackground />
   ```

   This ensures the background effects render behind all page content. The fixed positioning and z-index: 0 on both components combined with the natural stacking of content above them means no z-index conflicts.

3. Ensure the `<main>` element in page.tsx implicitly stacks above (it does, since it's in normal flow with no explicit z-index, and fixed elements at z-0 render behind flow content). No changes needed to page.tsx.

Do NOT modify any other files. Do NOT change AnimationProvider or globals.css.
  </action>
  <verify>
    <automated>cd /Users/yogeshwarchaturvedi/Documents/yogi/wedding-invite && npx next build 2>&1 | tail -10</automated>
  </verify>
  <done>
- layout.tsx imports and renders GoldParticleCanvas and ParallaxBackground before AnimationProvider
- Build succeeds with no errors
- Both background components will render on every page behind all content
  </done>
</task>

<task type="checkpoint:human-verify" gate="blocking">
  <name>Task 3: Verify interactive background effects visually</name>
  <files>n/a</files>
  <action>
Human verifies the interactive gold particle trail and parallax depth background effects across the entire wedding invite.

Effects implemented:
1. Gold sparkle particles trail behind cursor (desktop) or follow touch/tap (mobile)
2. Tapping on mobile creates a burst of gold particles
3. Ambient gold particles drift from edges even without interaction
4. Faint mandala/paisley decorative elements shift with parallax on cursor/tilt
5. All effects disabled for prefers-reduced-motion users
  </action>
  <verify>
1. Run `npm run dev` and open http://localhost:3000
2. **Desktop cursor trail:** Move mouse around the page. You should see bold gold sparkles trailing behind the cursor, drifting upward and fading. Particles should be a mix of circles, diamonds, and tiny stars in gold variations.
3. **Ambient particles:** Stop moving the mouse. Faint gold particles should still occasionally spawn from the viewport edges, keeping the background alive.
4. **Parallax depth:** Move the mouse to the corners of the screen. Faint decorative mandala/paisley elements in the background should shift slightly, creating a 3D depth effect.
5. **Mobile test:** Open on phone (or use Chrome DevTools device toolbar). Drag finger across screen — gold particles should trail. Tap anywhere — burst of particles should appear.
6. **Performance:** Scroll through the full page. No jank or stutter should be visible. Content must remain crisp and readable above the effects.
7. **Reduced motion:** In Chrome DevTools, go to Rendering > Emulate CSS media feature `prefers-reduced-motion: reduce`. The particle canvas should stop entirely. Decorative elements should remain visible but static.
8. **Content readability:** All text, buttons, and images should remain fully readable and clickable. The effects are behind everything.
  </verify>
  <done>User confirms effects look dramatic and royal, performance is smooth, content is readable. Type "approved" or describe issues to fix.</done>
</task>

</tasks>

<verification>
- `npx jest --passWithNoTests src/components/ui/__tests__/gold-particle-canvas.test.tsx` passes
- `npx next build` succeeds with no errors
- Visual: gold particles trail cursor on desktop, touch on mobile
- Visual: faint parallax decorative elements shift with cursor/tilt
- Visual: all page content remains readable and interactive above effects
- Accessibility: effects fully disabled with prefers-reduced-motion
</verification>

<success_criteria>
- Canvas-based gold particle trail responds to cursor (desktop) and touch (mobile)
- Particles are bold, always-on, visually spectacular — gold dust / sparkle aesthetic
- Parallax decorative elements add depth to the background
- Zero impact on content interactivity (pointer-events: none)
- Smooth performance on mobile (capped particle count, single rAF loop)
- Respects prefers-reduced-motion system setting
- Build passes, tests pass
</success_criteria>

<output>
After completion, create `.planning/quick/1-add-dramatic-interactive-cursor-tap-base/1-SUMMARY.md`
</output>
