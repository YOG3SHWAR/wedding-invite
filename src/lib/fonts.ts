import { Yatra_One, Playfair_Display, Cormorant_Garamond } from 'next/font/google'

export const yatraOne = Yatra_One({
  weight: '400',
  subsets: ['devanagari', 'latin'],
  variable: '--font-hindi',
  display: 'swap',
})

export const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-heading',
  display: 'swap',
})

export const cormorantGaramond = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-body',
  display: 'swap',
})
