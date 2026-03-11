import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import React from 'react'

// Mock motion/react to render plain divs
vi.mock('motion/react', () => ({
  motion: {
    div: React.forwardRef(
      (
        { children, className, ...rest }: Record<string, unknown>,
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

import { OurStorySection } from '../our-story-section'

describe('OurStorySection', () => {
  it('renders section heading "Our Story"', () => {
    render(<OurStorySection />)
    expect(screen.getByText('Our Story')).toBeDefined()
  })

  it('renders Hindi heading', () => {
    render(<OurStorySection />)
    expect(screen.getByText('हमारी कहानी')).toBeDefined()
  })

  it('renders all 5 story milestones', () => {
    render(<OurStorySection />)
    expect(screen.getByText('How We Met')).toBeDefined()
    expect(screen.getByText('First Adventure Together')).toBeDefined()
    expect(screen.getByText('The Moment We Knew')).toBeDefined()
    expect(screen.getByText('The Proposal')).toBeDefined()
    expect(screen.getByText('Beginning Forever')).toBeDefined()
  })

  it('renders milestone years', () => {
    render(<OurStorySection />)
    expect(screen.getByText('2020')).toBeDefined()
    expect(screen.getByText('2021')).toBeDefined()
    expect(screen.getByText('2022')).toBeDefined()
    expect(screen.getByText('2024')).toBeDefined()
    expect(screen.getByText('2026')).toBeDefined()
  })

  it('renders milestone descriptions', () => {
    render(<OurStorySection />)
    expect(
      screen.getByText(/Two paths crossed and the universe smiled/)
    ).toBeDefined()
  })
})
