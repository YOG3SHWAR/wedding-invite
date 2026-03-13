/**
 * Gallery images, story photos, and video data.
 * Images served from public/images/.
 */

/** Gallery images with real aspect ratios */
export const PLACEHOLDER_GALLERY = [
  { id: 'g1', src: '/images/gallery/photo-01.jpg', alt: 'Yogi & Sudha — outdoor selfie', width: 960, height: 1280 },
  { id: 'g2', src: '/images/gallery/photo-02.jpg', alt: 'Yogi & Sudha — sunset with mountains', width: 959, height: 1280 },
  { id: 'g3', src: '/images/gallery/photo-03.jpg', alt: 'Yogi & Sudha — matching tees at restaurant', width: 1280, height: 960 },
  { id: 'g4', src: '/images/gallery/photo-04.jpg', alt: 'Yogi & Sudha — fun selfie at hillstation', width: 1280, height: 960 },
  { id: 'g5', src: '/images/gallery/photo-05.jpg', alt: 'Yogi & Sudha — adventure at cave', width: 960, height: 1280 },
  { id: 'g6', src: '/images/gallery/photo-06.jpg', alt: 'Sudha at campus', width: 960, height: 1280 },
  { id: 'g7', src: '/images/gallery/photo-07.jpg', alt: 'Yogi & Sudha — couple selfie', width: 960, height: 1280 },
  { id: 'g8', src: '/images/gallery/photo-08.jpg', alt: 'Yogi & Sudha — dressed up evening', width: 1007, height: 1280 },
  { id: 'g9', src: '/images/gallery/photo-09.jpg', alt: 'Yogi & Sudha — water sports', width: 960, height: 1280 },
  { id: 'g10', src: '/images/gallery/photo-10.jpg', alt: 'Yogi & Sudha — family at car delivery', width: 1280, height: 960 },
  { id: 'g11', src: '/images/gallery/photo-11.jpg', alt: 'Yogi & Sudha — engagement portrait', width: 853, height: 1280 },
  { id: 'g12', src: '/images/gallery/photo-12.jpg', alt: 'Yogi & Sudha — ring ceremony', width: 1280, height: 853 },
] as const

/** Placeholder video thumbnail and embed URL */
export const PLACEHOLDER_VIDEO = {
  thumbnailSrc: '/images/gallery/photo-02.jpg',
  videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // placeholder — replace with real pre-wedding video
} as const

/** Story photos mapped by milestone imageKey */
export const PLACEHOLDER_STORY_PHOTOS: Record<string, string> = {
  'how-we-met': '/images/story/how-we-met.jpg',
  'first-adventure': '/images/story/first-adventure.jpg',
  'the-moment': '/images/story/the-moment.jpg',
  'the-proposal': '/images/story/the-proposal.jpg',
  'beginning-forever': '/images/story/beginning-forever.jpg',
}
