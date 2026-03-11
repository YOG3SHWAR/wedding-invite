import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import React from 'react'

// Mock motion/react to render plain divs
vi.mock('motion/react', () => ({
  motion: {
    div: React.forwardRef(
      (
        {
          children,
          className,
          ...rest
        }: Record<string, unknown>,
        ref: React.Ref<HTMLDivElement>
      ) =>
        React.createElement(
          'div',
          { ref, className, ...rest },
          children as React.ReactNode
        )
    ),
  },
}))

// Mock HeroCountdown to avoid client component issues in test
vi.mock('../hero-countdown', () => ({
  HeroCountdown: ({ targetDate }: { targetDate: string }) =>
    React.createElement('div', { 'data-testid': 'hero-countdown', 'data-target': targetDate }, 'countdown'),
}))

import { HeroSection } from '../hero-section'

describe('HeroSection', () => {
  it('renders Hindi blessing text', () => {
    render(<HeroSection />)
    expect(screen.getByText('शुभ विवाह')).toBeDefined()
  })

  it('renders couple names in Hindi from COUPLE constant', () => {
    render(<HeroSection />)
    expect(screen.getByText('योगी & सुधा')).toBeDefined()
  })

  it('renders couple names in English from COUPLE constant', () => {
    render(<HeroSection />)
    expect(screen.getByText('Yogi & Sudha')).toBeDefined()
  })

  it('renders wedding date', () => {
    render(<HeroSection />)
    expect(screen.getByText('28 April 2026')).toBeDefined()
  })

  it('includes HeroCountdown component', () => {
    render(<HeroSection />)
    expect(screen.getByTestId('hero-countdown')).toBeDefined()
  })
})
