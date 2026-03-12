/**
 * Placeholder data for development.
 * Replace with real content before launch.
 *
 * Uses inline SVG data URIs with wedding palette gradients
 * instead of external placeholder services.
 */

function gradientPlaceholder(
  w: number,
  h: number,
  from: string,
  to: string,
  label?: string
): string {
  const text = label
    ? `<text x="50%" y="50%" font-family="serif" font-size="14" fill="rgba(255,255,255,0.6)" text-anchor="middle" dy=".35em">${label}</text>`
    : ''
  return `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">` +
      `<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">` +
      `<stop offset="0%" stop-color="${from}"/>` +
      `<stop offset="100%" stop-color="${to}"/>` +
      `</linearGradient></defs>` +
      `<rect width="${w}" height="${h}" fill="url(#g)"/>` +
      text +
      `</svg>`
  )}`
}

/** Placeholder gallery images with varied aspect ratios */
export const PLACEHOLDER_GALLERY = [
  { id: 'g1', src: gradientPlaceholder(400, 600, '#5F0F40', '#FB8B24', 'Photo 1'), alt: 'Wedding photo 1', width: 400, height: 600 },
  { id: 'g2', src: gradientPlaceholder(600, 400, '#FB8B24', '#0F4C5C', 'Photo 2'), alt: 'Wedding photo 2', width: 600, height: 400 },
  { id: 'g3', src: gradientPlaceholder(500, 500, '#0F4C5C', '#5F0F40', 'Photo 3'), alt: 'Wedding photo 3', width: 500, height: 500 },
  { id: 'g4', src: gradientPlaceholder(400, 550, '#9A031E', '#FB8B24', 'Photo 4'), alt: 'Wedding photo 4', width: 400, height: 550 },
  { id: 'g5', src: gradientPlaceholder(600, 350, '#5F0F40', '#E36414', 'Photo 5'), alt: 'Wedding photo 5', width: 600, height: 350 },
  { id: 'g6', src: gradientPlaceholder(450, 600, '#9A031E', '#FB8B24', 'Photo 6'), alt: 'Wedding photo 6', width: 450, height: 600 },
  { id: 'g7', src: gradientPlaceholder(600, 450, '#FB8B24', '#5F0F40', 'Photo 7'), alt: 'Wedding photo 7', width: 600, height: 450 },
  { id: 'g8', src: gradientPlaceholder(500, 500, '#0F4C5C', '#FB8B24', 'Photo 8'), alt: 'Wedding photo 8', width: 500, height: 500 },
  { id: 'g9', src: gradientPlaceholder(400, 600, '#E36414', '#5F0F40', 'Photo 9'), alt: 'Wedding photo 9', width: 400, height: 600 },
  { id: 'g10', src: gradientPlaceholder(600, 400, '#5F0F40', '#9A031E', 'Photo 10'), alt: 'Wedding photo 10', width: 600, height: 400 },
] as const

/** Placeholder video thumbnail and embed URL */
export const PLACEHOLDER_VIDEO = {
  thumbnailSrc: gradientPlaceholder(1280, 720, '#5F0F40', '#FB8B24', 'Pre-Wedding Video'),
  videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // placeholder
} as const

/** Placeholder story photos mapped by milestone imageKey */
export const PLACEHOLDER_STORY_PHOTOS: Record<string, string> = {
  'how-we-met': gradientPlaceholder(400, 400, '#5F0F40', '#FB8B24', 'How We Met'),
  'first-adventure': gradientPlaceholder(400, 400, '#FB8B24', '#0F4C5C', 'First Adventure'),
  'the-moment': gradientPlaceholder(400, 400, '#0F4C5C', '#9A031E', 'The Moment'),
  'the-proposal': gradientPlaceholder(400, 400, '#9A031E', '#FB8B24', 'The Proposal'),
  'beginning-forever': gradientPlaceholder(400, 400, '#FB8B24', '#5F0F40', 'Beginning Forever'),
}
