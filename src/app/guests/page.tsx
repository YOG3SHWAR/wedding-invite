import type { Metadata } from 'next'
import { GuestsSection } from '@/components/sections/guests-section'

export const metadata: Metadata = {
  title: "Guest List — Yogi & Sudha's Wedding",
  description: 'See who\'s attending Yogi & Sudha\'s wedding celebration.',
  robots: {
    index: false,
    follow: false,
  },
}

export default function GuestsPage() {
  return (
    <main>
      <GuestsSection />
    </main>
  )
}
