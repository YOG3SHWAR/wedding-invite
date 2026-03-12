import '@testing-library/jest-dom'
import { vi } from 'vitest'
import React from 'react'

// Mock IntersectionObserver (not available in jsdom)
class MockIntersectionObserver {
  readonly root: Element | null = null
  readonly rootMargin: string = ''
  readonly thresholds: ReadonlyArray<number> = []
  observe = vi.fn()
  unobserve = vi.fn()
  disconnect = vi.fn()
  takeRecords = vi.fn().mockReturnValue([])
  constructor(
    _callback: IntersectionObserverCallback,
    _options?: IntersectionObserverInit
  ) {}
}
Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  value: MockIntersectionObserver,
})

// Mock motion/react - replace animated components with plain HTML elements
vi.mock('motion/react', () => {
  const motionHandler: ProxyHandler<object> = {
    get(_target, prop: string) {
      // Return a component that renders the corresponding HTML element
      const Component = React.forwardRef(
        (props: Record<string, unknown>, ref: React.Ref<HTMLElement>) => {
          // Filter out animation-specific props
          const {
            initial: _initial,
            animate: _animate,
            exit: _exit,
            variants: _variants,
            whileInView: _whileInView,
            whileHover: _whileHover,
            whileTap: _whileTap,
            viewport: _viewport,
            transition: _transition,
            layout: _layout,
            layoutId: _layoutId,
            ...rest
          } = props
          return React.createElement(prop, { ...rest, ref })
        }
      )
      Component.displayName = `motion.${prop}`
      return Component
    },
  }

  const motion = new Proxy({}, motionHandler)

  const AnimatePresence = ({
    children,
  }: {
    children: React.ReactNode
  }) => React.createElement(React.Fragment, null, children)

  return {
    motion,
    AnimatePresence,
    useAnimation: () => ({
      start: vi.fn(),
      stop: vi.fn(),
      set: vi.fn(),
    }),
    useInView: () => true,
    useScroll: () => ({
      scrollY: { get: () => 0 },
      scrollYProgress: { get: () => 0 },
    }),
    useTransform: (value: unknown) => value,
  }
})

// Mock firebase/app
vi.mock('firebase/app', () => ({
  initializeApp: vi.fn(() => ({})),
  getApps: vi.fn(() => []),
}))

// Mock firebase/firestore
vi.mock('firebase/firestore', () => ({
  getFirestore: vi.fn(() => ({})),
  doc: vi.fn((_db: unknown, collection: string, id: string) => ({
    collection,
    id,
  })),
  setDoc: vi.fn(() => Promise.resolve()),
  serverTimestamp: vi.fn(() => ({ _type: 'serverTimestamp' })),
}))

// Mock canvas-confetti
vi.mock('canvas-confetti', () => ({ default: vi.fn() }))

// Mock next/image - replace with plain <img> element
vi.mock('next/image', () => ({
  default: (props: Record<string, unknown>) => {
    const { src, alt, width, height, className, loading, ...rest } = props
    // next/image src can be a string or an object with src property
    const imgSrc = typeof src === 'object' && src !== null ? (src as { src: string }).src : src
    return React.createElement('img', {
      src: imgSrc,
      alt,
      width,
      height,
      className,
      loading,
      ...rest,
    })
  },
}))
