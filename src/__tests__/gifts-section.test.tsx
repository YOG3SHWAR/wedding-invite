import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { GiftsSection } from '../components/sections/gifts-section'

describe('GiftsSection', () => {
  it('renders Hindi blessing message', () => {
    render(<GiftsSection />)
    expect(
      screen.getByText('आपका साथ ही हमारा सबसे बड़ा उपहार है')
    ).toBeInTheDocument()
  })

  it('renders English blessing message', () => {
    render(<GiftsSection />)
    expect(
      screen.getByText('Your presence is our greatest gift')
    ).toBeInTheDocument()
  })

  it('renders gift cards from GIFT_ITEMS constant', () => {
    render(<GiftsSection />)
    expect(screen.getByText('Silver Pooja Thali Set')).toBeInTheDocument()
    expect(screen.getByText('Brass Diya Set')).toBeInTheDocument()
    expect(screen.getByText('Silk Bedsheet Set')).toBeInTheDocument()
    expect(screen.getByText('Kitchen Appliance Set')).toBeInTheDocument()
  })

  it('gift cards have buy links with target="_blank"', () => {
    render(<GiftsSection />)
    const buyLinks = screen.getAllByRole('link', { name: 'Buy' })
    buyLinks.forEach((link) => {
      expect(link).toHaveAttribute('target', '_blank')
      expect(link).toHaveAttribute('rel', 'noopener noreferrer')
    })
  })

  it('renders correct number of gift cards (4)', () => {
    render(<GiftsSection />)
    const buyLinks = screen.getAllByRole('link', { name: 'Buy' })
    expect(buyLinks).toHaveLength(4)
  })
})
