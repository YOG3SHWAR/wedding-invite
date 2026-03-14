/**
 * Gallery images, story photos, and video data.
 * Images served from public/images/.
 */

/** Gallery images with real aspect ratios */
export const PLACEHOLDER_GALLERY = [
  { id: 'g1', src: '/images/gallery/photo-01.jpg', alt: 'Yogi & Sudha — outdoor selfie', width: 960, height: 1280 },
  { id: 'g3', src: '/images/gallery/photo-03.jpg', alt: 'Yogi & Sudha — matching tees at restaurant', width: 1280, height: 960 },
  { id: 'g4', src: '/images/gallery/photo-04.jpg', alt: 'Yogi & Sudha — fun selfie at hillstation', width: 1280, height: 960 },
  { id: 'g5', src: '/images/gallery/photo-05.jpg', alt: 'Yogi & Sudha — adventure at cave', width: 960, height: 1280 },
  { id: 'g6', src: '/images/gallery/photo-06.jpg', alt: 'Sudha at campus', width: 960, height: 1280 },
  { id: 'g8', src: '/images/gallery/photo-08.jpg', alt: 'Yogi & Sudha — dressed up evening', width: 1007, height: 1280 },
  { id: 'g9', src: '/images/gallery/photo-09.jpg', alt: 'Yogi & Sudha — water sports', width: 960, height: 1280 },
  { id: 'g10', src: '/images/gallery/photo-10.jpg', alt: 'Yogi & Sudha — family at car delivery', width: 1280, height: 960 },
  { id: 'g11', src: '/images/gallery/photo-11.jpg', alt: 'Yogi & Sudha — engagement portrait', width: 853, height: 1280 },
  { id: 'g12', src: '/images/gallery/photo-12.jpg', alt: 'Yogi & Sudha — ring ceremony', width: 1280, height: 853 },
  { id: 'g13', src: '/images/gallery/photo-13.jpg', alt: 'Yogi & Sudha — celebration portrait', width: 3024, height: 4032 },
  { id: 'g14', src: '/images/gallery/photo-14.jpg', alt: 'Yogi & Sudha — together outdoors', width: 4032, height: 3024 },
  { id: 'g15', src: '/images/gallery/photo-15.jpg', alt: 'Yogi & Sudha — candid laughter', width: 4032, height: 3024 },
  { id: 'g17', src: '/images/gallery/photo-17.jpg', alt: 'Yogi & Sudha — close portrait', width: 2774, height: 4160 },
  { id: 'g18', src: '/images/gallery/photo-18.jpg', alt: 'Yogi & Sudha — dressed for occasion', width: 3120, height: 4160 },
  { id: 'g19', src: '/images/gallery/photo-19.jpg', alt: 'Yogi & Sudha — scenic backdrop', width: 4032, height: 3024 },
  { id: 'g20', src: '/images/gallery/photo-20.jpg', alt: 'Yogi & Sudha — joyful together', width: 4160, height: 3120 },
  { id: 'g21', src: '/images/gallery/photo-21.jpg', alt: 'Yogi & Sudha — special day', width: 2316, height: 3088 },
  { id: 'g22', src: '/images/gallery/photo-22.jpg', alt: 'Yogi & Sudha — cherished memory', width: 1179, height: 2098 },
  { id: 'g23', src: '/images/gallery/photo-23.jpg', alt: 'Yogi & Sudha — gym mirror selfie', width: 3024, height: 4032 },
  { id: 'g24', src: '/images/gallery/photo-24.jpg', alt: 'Yogi & Sudha — mountain view selfie', width: 3024, height: 4032 },
  { id: 'g25', src: '/images/gallery/photo-25.jpg', alt: 'Yogi & Sudha — engagement candid', width: 2773, height: 4160 },
  { id: 'g26', src: '/images/gallery/photo-26.jpg', alt: 'Yogi & Sudha — evening garden party', width: 3120, height: 4160 },
  { id: 'g27', src: '/images/gallery/photo-27.jpg', alt: 'Yogi & Sudha — temple selfie', width: 3024, height: 4032 },
  { id: 'g28', src: '/images/gallery/photo-28.jpg', alt: 'Yogi & Sudha — cafe date', width: 2316, height: 3088 },
] as const

/** Video thumbnail and embed URL */
export const PLACEHOLDER_VIDEO = {
  thumbnailSrc: '/images/gallery/photo-03.jpg',
  videoUrl: 'https://www.youtube.com/embed/9VVbnddNxHc',
} as const

/** Story photos mapped by milestone imageKey */
export const PLACEHOLDER_STORY_PHOTOS: Record<string, string> = {
  'how-we-met': '/images/story/how-we-met.jpg',
  'first-adventure': '/images/story/first-adventure.jpg',
  'the-moment': '/images/story/the-moment.jpg',
  'the-proposal': '/images/story/the-proposal.jpg',
  'beginning-forever': '/images/story/beginning-forever.jpg',
}
