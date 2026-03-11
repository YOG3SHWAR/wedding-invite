import { describe, it, expect, vi } from 'vitest'

// Mock next/font/google to return objects with expected shape
vi.mock('next/font/google', () => ({
  Yatra_One: (config: Record<string, unknown>) => ({
    variable: config.variable,
    className: 'mock-yatra',
    style: { fontFamily: 'Yatra One' },
  }),
  Playfair_Display: (config: Record<string, unknown>) => ({
    variable: config.variable,
    className: 'mock-playfair',
    style: { fontFamily: 'Playfair Display' },
  }),
  Cormorant_Garamond: (config: Record<string, unknown>) => ({
    variable: config.variable,
    className: 'mock-cormorant',
    style: { fontFamily: 'Cormorant Garamond' },
  }),
}))

import { yatraOne, playfairDisplay, cormorantGaramond } from '@/lib/fonts'

describe('Font configuration', () => {
  it('yatraOne has correct CSS variable --font-hindi', () => {
    expect(yatraOne.variable).toBe('--font-hindi')
  })

  it('playfairDisplay has correct CSS variable --font-heading', () => {
    expect(playfairDisplay.variable).toBe('--font-heading')
  })

  it('cormorantGaramond has correct CSS variable --font-body', () => {
    expect(cormorantGaramond.variable).toBe('--font-body')
  })
})
