import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/react'
import { yatraOne, playfairDisplay, cormorantGaramond } from '@/lib/fonts'
import { AnimationProvider } from '@/components/providers/animation-provider'
import { GoldParticleCanvas } from '@/components/ui/gold-particle-canvas'
import { MandalaBackground } from '@/components/ui/mandala-background'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: 'Yogi & Sudha Wedding',
  description: 'Join us for our wedding celebration! 28 April 2026',
  openGraph: {
    title: 'Yogi & Sudha Wedding',
    description: 'Join us for our wedding celebration! 28 April 2026',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Yogi & Sudha Wedding',
    description: 'Join us for our wedding celebration! 28 April 2026',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`${yatraOne.variable} ${playfairDisplay.variable} ${cormorantGaramond.variable}`}
    >
      <body className="bg-cream text-maroon-dark font-body antialiased">
        <MandalaBackground />
        <GoldParticleCanvas />
        <AnimationProvider>{children}</AnimationProvider>
        <Analytics />
      </body>
    </html>
  )
}
