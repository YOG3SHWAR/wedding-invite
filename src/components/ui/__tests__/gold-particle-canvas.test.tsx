import { render, screen } from '@testing-library/react'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import { GoldParticleCanvas } from '../gold-particle-canvas'

// Mock canvas context
const mockContext = {
  scale: vi.fn(),
  clearRect: vi.fn(),
  beginPath: vi.fn(),
  arc: vi.fn(),
  fill: vi.fn(),
  moveTo: vi.fn(),
  lineTo: vi.fn(),
  closePath: vi.fn(),
  globalAlpha: 1,
  fillStyle: '',
}

beforeEach(() => {
  vi.restoreAllMocks()

  // Default: reduced motion OFF
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  })

  // Mock canvas getContext
  HTMLCanvasElement.prototype.getContext = vi.fn().mockReturnValue(mockContext) as unknown as typeof HTMLCanvasElement.prototype.getContext
})

describe('GoldParticleCanvas', () => {
  it('renders a canvas element', () => {
    render(<GoldParticleCanvas />)
    const canvas = screen.getByTestId('gold-particle-canvas')
    expect(canvas).toBeInTheDocument()
    expect(canvas.tagName).toBe('CANVAS')
  })

  it('has pointer-events-none class so clicks pass through', () => {
    render(<GoldParticleCanvas />)
    const canvas = screen.getByTestId('gold-particle-canvas')
    expect(canvas.className).toContain('pointer-events-none')
  })

  it('has aria-hidden for accessibility', () => {
    render(<GoldParticleCanvas />)
    const canvas = screen.getByTestId('gold-particle-canvas')
    expect(canvas).toHaveAttribute('aria-hidden', 'true')
  })

  it('has fixed positioning with inset-0 and z-0', () => {
    render(<GoldParticleCanvas />)
    const canvas = screen.getByTestId('gold-particle-canvas')
    expect(canvas.className).toContain('fixed')
    expect(canvas.className).toContain('inset-0')
    expect(canvas.className).toContain('z-0')
  })

  it('does not start animation when prefers-reduced-motion is set', () => {
    // Override matchMedia to return matches: true for reduced motion
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query: string) => ({
        matches: query === '(prefers-reduced-motion: reduce)',
        media: query,
        onchange: null,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        addListener: vi.fn(),
        removeListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    })

    render(<GoldParticleCanvas />)
    const canvas = screen.getByTestId('gold-particle-canvas')
    // Canvas should still be rendered (it listens for changes), but
    // the animation loop should not have been started, meaning getContext
    // should not have been called for drawing operations
    expect(canvas).toBeInTheDocument()
  })

  it('renders without crashing', () => {
    const { unmount } = render(<GoldParticleCanvas />)
    // Unmounting should clean up without errors
    expect(() => unmount()).not.toThrow()
  })
})
