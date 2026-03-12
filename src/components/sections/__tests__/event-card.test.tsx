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

import { EventCard } from '../event-card'

const mockEvent = {
  name: 'Tilak',
  nameHindi: 'तिलक',
  date: '26 April 2026',
  time: '10:00 AM',
  venue: 'Grand Palace, Jaipur',
  mapUrl: 'https://maps.google.com/?q=Grand+Palace+Jaipur',
  dressCode: 'Traditional / Kurta Pajama',
  description: 'The groom is formally welcomed.',
  colorKey: 'tilak' as const,
}

describe('EventCard', () => {
  it('renders event name in Hindi and English', () => {
    render(<EventCard event={mockEvent} position="left" />)
    expect(screen.getByText('तिलक')).toBeDefined()
    expect(screen.getByText('Tilak')).toBeDefined()
  })

  it('renders date and time', () => {
    render(<EventCard event={mockEvent} position="left" />)
    expect(screen.getByText(/26 April 2026/)).toBeDefined()
    expect(screen.getByText(/10:00 AM/)).toBeDefined()
  })

  it('renders venue with Google Maps link', () => {
    render(<EventCard event={mockEvent} position="left" />)
    const link = screen.getByRole('link', { name: /Grand Palace, Jaipur/ })
    expect(link).toBeDefined()
    expect(link.getAttribute('href')).toBe('https://maps.google.com/?q=Grand+Palace+Jaipur')
    expect(link.getAttribute('target')).toBe('_blank')
  })

  it('renders dress code suggestion', () => {
    render(<EventCard event={mockEvent} position="left" />)
    expect(screen.getByText('Traditional / Kurta Pajama')).toBeDefined()
  })

  it('renders event description', () => {
    render(<EventCard event={mockEvent} position="left" />)
    expect(screen.getByText('The groom is formally welcomed.')).toBeDefined()
  })

  it('applies distinct accent color border from EVENT_COLORS', () => {
    const { container } = render(<EventCard event={mockEvent} position="left" />)
    const card = container.querySelector('.border-l-4')
    expect(card).toBeDefined()
    // jsdom converts hex to rgb
    expect((card as HTMLElement).style.borderLeftColor).toBe('rgb(196, 30, 58)')
  })
})
