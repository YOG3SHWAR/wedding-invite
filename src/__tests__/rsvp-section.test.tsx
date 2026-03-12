import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { RsvpSection } from '../components/sections/rsvp-section'

// Mock RsvpConfirmation since it's a separate component
vi.mock('../components/sections/rsvp-confirmation', () => ({
  RsvpConfirmation: ({ guestName }: { guestName: string }) => (
    <div data-testid="rsvp-confirmation">Confirmation for {guestName}</div>
  ),
}))

describe('RsvpSection', () => {
  it('renders RSVP section heading', () => {
    render(<RsvpSection />)
    expect(screen.getByText('RSVP')).toBeInTheDocument()
  })

  it('renders Hindi subtitle', () => {
    render(<RsvpSection />)
    expect(
      screen.getByText('कृपया अपनी उपस्थिति दर्ज करें')
    ).toBeInTheDocument()
  })

  it('renders 3 day cards with correct labels', () => {
    render(<RsvpSection />)
    expect(screen.getByText('Day 1', { exact: false })).toBeInTheDocument()
    expect(screen.getByText('Day 2', { exact: false })).toBeInTheDocument()
    expect(screen.getByText('Day 3', { exact: false })).toBeInTheDocument()
  })

  it('renders day cards with Hindi labels', () => {
    render(<RsvpSection />)
    expect(screen.getByText('पहला दिन')).toBeInTheDocument()
    expect(screen.getByText('दूसरा दिन')).toBeInTheDocument()
    expect(screen.getByText('तीसरा दिन')).toBeInTheDocument()
  })

  it('renders name, phone, and guest count inputs', () => {
    render(<RsvpSection />)
    expect(screen.getByPlaceholderText('आपका नाम / Your Name')).toBeInTheDocument()
    expect(
      screen.getByPlaceholderText('फ़ोन नंबर / Phone Number')
    ).toBeInTheDocument()
    expect(screen.getByLabelText('Guest count')).toBeInTheDocument()
  })

  it('submit button is disabled when form is empty', () => {
    render(<RsvpSection />)
    const submitBtn = screen.getByRole('button', {
      name: /Send RSVP/i,
    })
    expect(submitBtn).toBeDisabled()
  })

  it('renders select all button', () => {
    render(<RsvpSection />)
    expect(screen.getByText(/All Days/)).toBeInTheDocument()
  })

  it.todo('select all button selects all days on click')
  it.todo('validates phone number on submit')
  it.todo('shows loading spinner during submission')
  it.todo('shows error message on failure')
})
