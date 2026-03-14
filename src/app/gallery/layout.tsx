import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Photo Gallery — Yogi & Sudha's Wedding",
  description: "Explore our moments together in an immersive 3D gallery",
  openGraph: {
    title: "Photo Gallery — Yogi & Sudha's Wedding",
    description: "Explore our moments together in an immersive 3D gallery",
    type: 'website',
    images: [{ url: '/images/og-image.jpg' }],
  },
}

export default function GalleryLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
