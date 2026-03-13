import type { Metadata } from 'next'
import { GuestsSection } from '@/components/sections/guests-section'

export const metadata: Metadata = {
  title: 'Guest List — Yogi & Sudha Wedding',
  description: 'See who\'s attending Yogi & Sudha\'s wedding celebration.',
}

export default function GuestsPage() {
  return (
    <main>
      <GuestsSection />
    </main>
  )
}
