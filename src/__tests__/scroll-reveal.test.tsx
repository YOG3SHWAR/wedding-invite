import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import React from 'react'

// Mock motion/react to render plain divs that pass through props
vi.mock('motion/react', () => ({
  motion: {
    div: React.forwardRef(({ children, className, initial, whileInView, viewport, variants, transition, ...rest }: Record<string, unknown>, ref: React.Ref<HTMLDivElement>) => (
      React.createElement('div', {
        ref,
        className,
        'data-testid': 'motion-div',
        'data-initial': initial,
        'data-while-in-view': whileInView,
        ...rest,
      }, children as React.ReactNode)
    )),
  },
  MotionConfig: ({ children }: { children: React.ReactNode }) => children,
}))

import { ScrollReveal } from '@/components/ui/scroll-reveal'

describe('ScrollReveal', () => {
  it('renders children', () => {
    render(
      <ScrollReveal>
        <span>Test content</span>
      </ScrollReveal>
    )
    expect(screen.getByText('Test content')).toBeDefined()
  })

  it('applies motion props (initial and whileInView)', () => {
    render(
      <ScrollReveal>
        <span>Animated</span>
      </ScrollReveal>
    )
    const motionDiv = screen.getByTestId('motion-div')
    expect(motionDiv.getAttribute('data-initial')).toBe('hidden')
    expect(motionDiv.getAttribute('data-while-in-view')).toBe('visible')
  })

  it('accepts className prop', () => {
    render(
      <ScrollReveal className="test-class">
        <span>Styled</span>
      </ScrollReveal>
    )
    const motionDiv = screen.getByTestId('motion-div')
    expect(motionDiv.className).toContain('test-class')
  })

  it('accepts variant prop', () => {
    // Should render without error with different variants
    const { unmount } = render(
      <ScrollReveal variant="slideLeft">
        <span>Slide left</span>
      </ScrollReveal>
    )
    expect(screen.getByText('Slide left')).toBeDefined()
    unmount()

    render(
      <ScrollReveal variant="slideRight">
        <span>Slide right</span>
      </ScrollReveal>
    )
    expect(screen.getByText('Slide right')).toBeDefined()
  })
})
