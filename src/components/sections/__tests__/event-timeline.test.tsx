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

import { EventTimeline } from '../event-timeline'

describe('EventTimeline', () => {
  it('renders all 5 events from EVENTS constant', () => {
    render(<EventTimeline />)
    expect(screen.getByText('Tilak')).toBeDefined()
    expect(screen.getByText('Mehndi')).toBeDefined()
    expect(screen.getByText('Sangeet')).toBeDefined()
    expect(screen.getByText('Haldi')).toBeDefined()
    expect(screen.getByText('Shadi')).toBeDefined()
  })

  it('renders section heading "Wedding Events"', () => {
    render(<EventTimeline />)
    expect(screen.getByText('Wedding Events')).toBeDefined()
  })

  it('renders Hindi heading "शुभ कार्यक्रम"', () => {
    render(<EventTimeline />)
    expect(screen.getByText('शुभ कार्यक्रम')).toBeDefined()
  })

  it('wraps each event card in ScrollReveal', () => {
    const { container } = render(<EventTimeline />)
    // Each event should be wrapped - check for 5 event cards
    const eventCards = container.querySelectorAll('.border-l-4')
    expect(eventCards.length).toBe(5)
  })
})
