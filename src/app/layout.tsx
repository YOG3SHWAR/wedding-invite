import type { Metadata, Viewport } from 'next'
import { Analytics } from '@vercel/analytics/react'
import { yatraOne, playfairDisplay, cormorantGaramond } from '@/lib/fonts'
import { AnimationProvider } from '@/components/providers/animation-provider'
import { GoldParticleCanvas } from '@/components/ui/gold-particle-canvas'
import { MandalaBackground } from '@/components/ui/mandala-background'
import { WeddingJsonLd } from '@/components/seo/json-ld'
import './globals.css'

export const viewport: Viewport = {
  themeColor: '#FFF8F0',
  viewportFit: 'cover',
}

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: "Yogi & Sudha's Wedding",
  description: 'Join us for our wedding celebration! 28 April 2026',
  keywords: ['wedding', 'Yogi and Sudha', 'wedding invitation', 'Indian wedding', 'April 2026'],
  alternates: {
    canonical: '/',
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-icon.jpg',
  },
  openGraph: {
    title: "Yogi & Sudha's Wedding",
    description: 'Join us for our wedding celebration! 28 April 2026',
    type: 'website',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: "Yogi & Sudha's Wedding Invitation",
        type: 'image/jpeg',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Yogi & Sudha's Wedding",
    description: 'Join us for our wedding celebration! 28 April 2026',
    images: ['/images/og-image.jpg'],
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
        <WeddingJsonLd />
        <MandalaBackground />
        <GoldParticleCanvas />
        <AnimationProvider>{children}</AnimationProvider>
        <Analytics />
      </body>
    </html>
  )
}
