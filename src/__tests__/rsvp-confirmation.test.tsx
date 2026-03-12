import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { RsvpConfirmation } from '../components/sections/rsvp-confirmation'
import confetti from 'canvas-confetti'

describe('RsvpConfirmation', () => {
  it('renders thank you in Hindi', () => {
    render(<RsvpConfirmation selectedDays={[1, 3]} guestName="Rahul" />)
    expect(screen.getByText('धन्यवाद!')).toBeInTheDocument()
  })

  it('renders thank you with guest name in English', () => {
    render(<RsvpConfirmation selectedDays={[1]} guestName="Priya" />)
    expect(screen.getByText('Thank You, Priya!')).toBeInTheDocument()
  })

  it('renders summary cards for selected days', () => {
    render(<RsvpConfirmation selectedDays={[1, 3]} guestName="Rahul" />)
    // Day 1 = Tilak
    expect(screen.getByText('पहला दिन')).toBeInTheDocument()
    expect(screen.getByText('Tilak', { exact: false })).toBeInTheDocument()
    // Day 3 = Haldi + Shadi
    expect(screen.getByText('तीसरा दिन')).toBeInTheDocument()
    expect(screen.getByText('Haldi', { exact: false })).toBeInTheDocument()
    expect(screen.getByText('Shadi', { exact: false })).toBeInTheDocument()
  })

  it('displays venue and dress code on summary cards', () => {
    render(<RsvpConfirmation selectedDays={[1]} guestName="Rahul" />)
    expect(
      screen.getByText(/Traditional \/ Kurta Pajama/)
    ).toBeInTheDocument()
    expect(screen.getByText(/Venue TBD/)).toBeInTheDocument()
  })

  it('renders WhatsApp share button', () => {
    render(<RsvpConfirmation selectedDays={[1]} guestName="Rahul" />)
    expect(
      screen.getByText('Share with Family')
    ).toBeInTheDocument()
    const link = screen.getByText('Share with Family').closest('a')
    expect(link).toHaveAttribute(
      'href',
      expect.stringContaining('api.whatsapp.com')
    )
    expect(link).toHaveAttribute('target', '_blank')
  })

  it('renders back to top button', () => {
    render(<RsvpConfirmation selectedDays={[1]} guestName="Rahul" />)
    expect(screen.getByText('Back to Top')).toBeInTheDocument()
  })

  it('fires confetti on mount', () => {
    render(<RsvpConfirmation selectedDays={[1]} guestName="Rahul" />)
    expect(confetti).toHaveBeenCalled()
  })
})
