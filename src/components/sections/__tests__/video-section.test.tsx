import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
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

import { VideoSection } from '../video-section'

describe('VideoSection', () => {
  it('renders thumbnail with play button', () => {
    render(<VideoSection />)
    const playButton = screen.getByLabelText('Play video')
    expect(playButton).toBeDefined()
    // Check for the gold play button circle
    const img = screen.getByAltText('Pre-wedding video thumbnail')
    expect(img).toBeDefined()
  })

  it('does not render iframe initially', () => {
    const { container } = render(<VideoSection />)
    const iframe = container.querySelector('iframe')
    expect(iframe).toBeNull()
  })

  it('renders iframe with autoplay after click', () => {
    const { container } = render(<VideoSection />)
    const playButton = screen.getByLabelText('Play video')
    fireEvent.click(playButton)

    const iframe = container.querySelector('iframe')
    expect(iframe).toBeDefined()
    expect(iframe?.getAttribute('src')).toContain('autoplay=1')
    expect(iframe?.getAttribute('allow')).toContain('autoplay')
    expect(iframe?.getAttribute('allow')).toContain('fullscreen')
  })

  it('renders section heading "Our Film"', () => {
    render(<VideoSection />)
    expect(screen.getByText('Our Film')).toBeDefined()
    expect(screen.getByText('हमारी फिल्म')).toBeDefined()
  })
})
