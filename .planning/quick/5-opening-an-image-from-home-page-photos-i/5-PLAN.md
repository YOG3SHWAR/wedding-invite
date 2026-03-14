---
phase: quick-5
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - src/components/sections/photo-gallery.tsx
autonomous: true
must_haves:
  truths:
    - "Clicking a gallery thumbnail on the home page opens the lightbox with the correct full-size image visible (not broken)"
  artifacts:
    - path: "src/components/sections/photo-gallery.tsx"
      provides: "Lightbox slides with direct image paths"
  key_links:
    - from: "photo-gallery.tsx slides array"
      to: "yet-another-react-lightbox"
      via: "slides prop with src pointing to /images/gallery/*.jpg"
      pattern: "src: img\\.src"
---

<objective>
Fix broken lightbox images on the home page photo gallery.

Purpose: When a user taps a gallery thumbnail, the lightbox opens but shows a broken image because the slide `src` is constructed as `/_next/image?url=...&w=1200&q=85` -- a Next.js image optimization URL that doesn't work as a direct image source for the lightbox. The fix is to use the original `img.src` path directly (e.g., `/images/gallery/photo-01.jpg`).

Output: Working lightbox that displays full-size gallery images.
</objective>

<context>
@src/components/sections/photo-gallery.tsx
@src/components/sections/__tests__/photo-gallery.test.tsx
</context>

<tasks>

<task type="auto">
  <name>Task 1: Fix lightbox slide URLs to use direct image paths</name>
  <files>src/components/sections/photo-gallery.tsx</files>
  <action>
On line 21 of photo-gallery.tsx, change the slides mapping from:

```typescript
src: `/_next/image?url=${encodeURIComponent(img.src)}&w=1200&q=85`,
```

to:

```typescript
src: img.src,
```

This uses the direct image path (e.g., `/images/gallery/photo-01.jpg`) which the lightbox can load correctly, just like the thumbnail `<Image>` components already do.
  </action>
  <verify>
    <automated>cd /Users/yogeshwarchaturvedi/Documents/yogi/wedding-invite && npx vitest run src/components/sections/__tests__/photo-gallery.test.tsx</automated>
  </verify>
  <done>Lightbox slides use direct img.src paths instead of /_next/image constructed URLs. Existing tests pass.</done>
</task>

</tasks>

<verification>
- `grep -c '_next/image' src/components/sections/photo-gallery.tsx` returns 0 (no more constructed image URLs in this file)
- `npx vitest run src/components/sections/__tests__/photo-gallery.test.tsx` passes
- Manual: open home page, click any gallery photo, lightbox shows the actual image (not broken)
</verification>

<success_criteria>
Clicking any gallery thumbnail on the home page opens the lightbox with the full-size image displayed correctly.
</success_criteria>

<output>
After completion, create `.planning/quick/5-opening-an-image-from-home-page-photos-i/5-SUMMARY.md`
</output>
