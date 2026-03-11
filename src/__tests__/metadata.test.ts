import { describe, it, expect, vi } from 'vitest'

// Mock next/font/google before importing layout
vi.mock('next/font/google', () => ({
  Yatra_One: () => ({
    variable: '--font-hindi',
    className: 'mock-yatra',
    style: { fontFamily: 'Yatra One' },
  }),
  Playfair_Display: () => ({
    variable: '--font-heading',
    className: 'mock-playfair',
    style: { fontFamily: 'Playfair Display' },
  }),
  Cormorant_Garamond: () => ({
    variable: '--font-body',
    className: 'mock-cormorant',
    style: { fontFamily: 'Cormorant Garamond' },
  }),
}))

// Mock motion/react
vi.mock('motion/react', () => ({
  MotionConfig: ({ children }: { children: React.ReactNode }) => children,
  motion: {
    div: 'div',
  },
}))

import { metadata } from '@/app/layout'

describe('OG metadata', () => {
  it('exports correct title', () => {
    expect(metadata.title).toBe('Yogi & Sudha Wedding')
  })

  it('exports correct description containing wedding date', () => {
    expect(metadata.description).toContain('28 April 2026')
  })

  it('exports openGraph title', () => {
    const og = metadata.openGraph as Record<string, unknown>
    expect(og.title).toBe('Yogi & Sudha Wedding')
  })

  it('exports openGraph images with correct dimensions', () => {
    const og = metadata.openGraph as Record<string, unknown>
    const images = og.images as Array<{ width: number; height: number }>
    expect(images).toBeDefined()
    expect(images[0].width).toBe(1200)
    expect(images[0].height).toBe(630)
  })
})
