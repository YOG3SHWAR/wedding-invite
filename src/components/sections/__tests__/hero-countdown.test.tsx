import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import React from 'react'

// Mock motion/react
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

import { HeroCountdown } from '../hero-countdown'

describe('HeroCountdown', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    // Fix "now" to 2026-03-11T00:00:00Z
    vi.setSystemTime(new Date('2026-03-11T00:00:00Z'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('displays four countdown boxes (Days, Hours, Minutes, Seconds)', () => {
    render(<HeroCountdown targetDate="2026-04-28T00:00:00+05:30" />)
    expect(screen.getByText('Days')).toBeDefined()
    expect(screen.getByText('Hours')).toBeDefined()
    expect(screen.getByText('Minutes')).toBeDefined()
    expect(screen.getByText('Seconds')).toBeDefined()
  })

  it('shows correct time remaining for a future date', () => {
    render(<HeroCountdown targetDate="2026-04-28T00:00:00+05:30" />)

    // After mount, useEffect fires and sets mounted=true
    act(() => {
      vi.advanceTimersByTime(0)
    })

    // 2026-03-11T00:00:00Z to 2026-04-27T18:30:00Z (which is 2026-04-28T00:00:00+05:30) = 47 days, 18 hours, 30 minutes, 0 seconds
    expect(screen.getByText('47')).toBeDefined()
  })

  it('shows all zeros when target date has passed', () => {
    vi.setSystemTime(new Date('2027-01-01T00:00:00Z'))
    render(<HeroCountdown targetDate="2026-04-28T00:00:00+05:30" />)

    act(() => {
      vi.advanceTimersByTime(0)
    })

    // All should be "00"
    const zeros = screen.getAllByText('00')
    expect(zeros.length).toBe(4)
  })

  it('updates every second via setInterval', () => {
    render(<HeroCountdown targetDate="2026-04-28T00:00:00+05:30" />)

    act(() => {
      vi.advanceTimersByTime(0)
    })

    // Advance 1 second
    act(() => {
      vi.advanceTimersByTime(1000)
    })

    // Should still render valid numbers (not crash)
    expect(screen.getByText('Days')).toBeDefined()
  })

  it('cleans up interval on unmount', () => {
    const clearIntervalSpy = vi.spyOn(globalThis, 'clearInterval')
    const { unmount } = render(
      <HeroCountdown targetDate="2026-04-28T00:00:00+05:30" />
    )

    act(() => {
      vi.advanceTimersByTime(0)
    })

    unmount()
    expect(clearIntervalSpy).toHaveBeenCalled()
    clearIntervalSpy.mockRestore()
  })
})
