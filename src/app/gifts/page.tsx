import type { Metadata } from 'next'
import { GiftsSection } from '@/components/sections/gifts-section'

export const metadata: Metadata = {
  title: "Gift Wishes — Yogi & Sudha's Wedding",
  description: 'View our gift wish list for Yogi & Sudha\'s wedding celebration.',
  openGraph: {
    title: "Gift Wishes — Yogi & Sudha's Wedding",
    description: "View our gift wish list for Yogi & Sudha's wedding celebration.",
    type: 'website',
    images: [{ url: '/images/og-image.jpg' }],
  },
}

export default function GiftsPage() {
  return (
    <main>
      <GiftsSection />
    </main>
  )
}
