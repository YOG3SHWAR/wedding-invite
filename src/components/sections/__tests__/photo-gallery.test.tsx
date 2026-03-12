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

// Mock lightbox to track open state
vi.mock('yet-another-react-lightbox', () => ({
  default: ({ open, close }: { open: boolean; close: () => void }) =>
    open
      ? React.createElement(
          'div',
          { 'data-testid': 'lightbox', onClick: close },
          'Lightbox open'
        )
      : null,
}))

vi.mock('yet-another-react-lightbox/styles.css', () => ({}))

import { PhotoGallery } from '../photo-gallery'

describe('PhotoGallery', () => {
  it('renders gallery images from placeholder data', () => {
    render(<PhotoGallery />)
    const images = screen.getAllByRole('img')
    expect(images.length).toBe(10)
  })

  it('opens lightbox when image is clicked', () => {
    render(<PhotoGallery />)
    // Initially no lightbox
    expect(screen.queryByTestId('lightbox')).toBeNull()

    // Click first image button
    const buttons = screen.getAllByRole('button')
    fireEvent.click(buttons[0])

    // Lightbox should be open
    expect(screen.getByTestId('lightbox')).toBeDefined()
  })

  it('closes lightbox when close is triggered', () => {
    render(<PhotoGallery />)
    // Open lightbox
    const buttons = screen.getAllByRole('button')
    fireEvent.click(buttons[0])
    expect(screen.getByTestId('lightbox')).toBeDefined()

    // Click lightbox to close (mocked close handler)
    fireEvent.click(screen.getByTestId('lightbox'))
    expect(screen.queryByTestId('lightbox')).toBeNull()
  })

  it('renders section heading "Gallery" and Hindi heading', () => {
    render(<PhotoGallery />)
    expect(screen.getByText('Gallery')).toBeDefined()
    expect(screen.getByText('तस्वीरें')).toBeDefined()
  })
})
