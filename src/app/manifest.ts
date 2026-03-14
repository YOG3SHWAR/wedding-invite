import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Yogi & Sudha's Wedding",
    short_name: 'Yogi Sudha Wedding',
    description: "Wedding invitation for Yogi & Sudha -- 28 April 2026",
    start_url: '/',
    display: 'standalone',
    background_color: '#FFF8F0',
    theme_color: '#2D0620',
    icons: [
      {
        src: '/icon-192.jpg',
        sizes: '192x192',
        type: 'image/jpeg',
      },
      {
        src: '/icon-512.jpg',
        sizes: '512x512',
        type: 'image/jpeg',
      },
    ],
  }
}
