import type { Metadata } from 'next'
import { GiftsSection } from '@/components/sections/gifts-section'

export const metadata: Metadata = {
  title: 'Gift Wishes — Yogi & Sudha Wedding',
  description: 'View our gift wish list for Yogi & Sudha\'s wedding celebration.',
}

export default function GiftsPage() {
  return (
    <main>
      <GiftsSection />
    </main>
  )
}
