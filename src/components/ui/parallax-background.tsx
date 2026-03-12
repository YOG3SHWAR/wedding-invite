'use client'

import { useEffect, useRef, useCallback, useState } from 'react'

/**
 * ParallaxBackground
 *
 * Renders faint decorative SVG elements (mandala outlines, paisley curves,
 * lotus shapes) positioned across the viewport. Each element shifts with a
 * subtle parallax effect based on cursor position (desktop) or device tilt
 * (mobile, via DeviceOrientationEvent).
 *
 * - Elements are very faint (opacity 0.06-0.12) watermarks.
 * - pointer-events: none + aria-hidden for full accessibility.
 * - Respects prefers-reduced-motion (renders static, no parallax movement).
 */

// --- Decorative element definitions -------------------------------------------

interface DecoElement {
  id: string
  /** Tailwind position classes */
  positionClasses: string
  /** Parallax depth factor */
  depth: number
  /** Opacity (0-1) */
  opacity: number
  /** Size in px */
  size: number
  /** Rotation in degrees */
  rotation: number
  /** SVG content */
  svg: React.ReactNode
}

// Paisley/lotus motif adapted from SectionDivider
function PaisleyMotif() {
  return (
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <path
        d="M20 4C20 4 24 10 24 16C24 10 30 8 30 8C30 8 24 14 24 20C30 20 36 16 36 16C36 16 30 22 24 24C30 24 32 30 32 30C32 30 26 26 20 24C20 30 24 36 24 36C24 36 20 30 16 24C10 26 8 32 8 32C8 32 12 24 16 24C10 22 4 16 4 16C4 16 10 20 16 20C16 14 10 8 10 8C10 8 16 10 16 16C16 10 20 4 20 4Z"
        fill="currentColor"
        opacity="0.4"
      />
      <path d="M20 12L24 20L20 28L16 20Z" fill="currentColor" opacity="0.6" />
      <circle cx="20" cy="20" r="2.5" fill="currentColor" />
    </svg>
  )
}

// Mandala ring outline
function MandalaMotif() {
  return (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="0.5" opacity="0.5" />
      <circle cx="50" cy="50" r="35" stroke="currentColor" strokeWidth="0.5" opacity="0.4" />
      <circle cx="50" cy="50" r="25" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
      {/* Radial petal outlines */}
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i * Math.PI) / 4
        const x1 = 50 + Math.cos(angle) * 25
        const y1 = 50 + Math.sin(angle) * 25
        const x2 = 50 + Math.cos(angle) * 45
        const y2 = 50 + Math.sin(angle) * 45
        return (
          <line
            key={i}
            x1={x1} y1={y1} x2={x2} y2={y2}
            stroke="currentColor" strokeWidth="0.3" opacity="0.3"
          />
        )
      })}
      {/* Small petal shapes at each axis */}
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i * Math.PI) / 4
        const cx = 50 + Math.cos(angle) * 40
        const cy = 50 + Math.sin(angle) * 40
        return (
          <circle key={`dot-${i}`} cx={cx} cy={cy} r="2" fill="currentColor" opacity="0.35" />
        )
      })}
    </svg>
  )
}

// Lotus outline
function LotusMotif() {
  return (
    <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {/* Central petal */}
      <path d="M40 10 Q50 30 40 55 Q30 30 40 10Z" fill="currentColor" opacity="0.3" />
      {/* Left petals */}
      <path d="M25 20 Q35 35 30 55 Q20 35 25 20Z" fill="currentColor" opacity="0.25" />
      <path d="M12 30 Q25 40 22 58 Q12 42 12 30Z" fill="currentColor" opacity="0.2" />
      {/* Right petals */}
      <path d="M55 20 Q45 35 50 55 Q60 35 55 20Z" fill="currentColor" opacity="0.25" />
      <path d="M68 30 Q55 40 58 58 Q68 42 68 30Z" fill="currentColor" opacity="0.2" />
      {/* Base curve */}
      <path d="M15 58 Q40 70 65 58" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.3" />
    </svg>
  )
}

// Paisley drop shape
function PaisleyDrop() {
  return (
    <svg viewBox="0 0 60 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <path
        d="M30 5 Q50 20 45 45 Q42 60 30 70 Q18 60 15 45 Q10 20 30 5Z"
        stroke="currentColor" strokeWidth="0.8" fill="none" opacity="0.35"
      />
      <path
        d="M30 15 Q42 25 38 42 Q36 52 30 58 Q24 52 22 42 Q18 25 30 15Z"
        stroke="currentColor" strokeWidth="0.5" fill="none" opacity="0.25"
      />
      <circle cx="30" cy="35" r="3" fill="currentColor" opacity="0.3" />
    </svg>
  )
}

const ELEMENTS: DecoElement[] = [
  {
    id: 'mandala-tl',
    positionClasses: 'top-[8%] left-[5%]',
    depth: 0.03,
    opacity: 0.07,
    size: 250,
    rotation: 0,
    svg: <MandalaMotif />,
  },
  {
    id: 'lotus-br',
    positionClasses: 'bottom-[10%] right-[3%]',
    depth: 0.05,
    opacity: 0.08,
    size: 200,
    rotation: 15,
    svg: <LotusMotif />,
  },
  {
    id: 'paisley-cl',
    positionClasses: 'top-[45%] left-[2%]',
    depth: 0.02,
    opacity: 0.06,
    size: 180,
    rotation: -20,
    svg: <PaisleyMotif />,
  },
  {
    id: 'drop-tr',
    positionClasses: 'top-[15%] right-[8%]',
    depth: 0.04,
    opacity: 0.09,
    size: 160,
    rotation: 25,
    svg: <PaisleyDrop />,
  },
  {
    id: 'mandala-bc',
    positionClasses: 'bottom-[25%] left-[35%]',
    depth: 0.06,
    opacity: 0.06,
    size: 280,
    rotation: 45,
    svg: <MandalaMotif />,
  },
  {
    id: 'lotus-mr',
    positionClasses: 'top-[65%] right-[12%]',
    depth: 0.035,
    opacity: 0.07,
    size: 170,
    rotation: -10,
    svg: <LotusMotif />,
  },
]

// --- Component ------------------------------------------------------------------

export function ParallaxBackground() {
  const containerRef = useRef<HTMLDivElement>(null)
  const rafRef = useRef<number>(0)
  const offsetRef = useRef({ x: 0, y: 0 })
  const [reducedMotion, setReducedMotion] = useState(false)

  // Throttled update of element transforms
  const applyTransforms = useCallback(() => {
    const container = containerRef.current
    if (!container) return
    const children = container.children
    for (let i = 0; i < children.length; i++) {
      const el = children[i] as HTMLElement
      const depth = parseFloat(el.dataset.depth || '0')
      const tx = offsetRef.current.x * depth
      const ty = offsetRef.current.y * depth
      el.style.transform = `translate3d(${tx}px, ${ty}px, 0) rotate(${el.dataset.rotation || 0}deg)`
    }
  }, [])

  useEffect(() => {
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mql.matches)

    const onChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches)
    mql.addEventListener('change', onChange)

    if (mql.matches) {
      return () => mql.removeEventListener('change', onChange)
    }

    // --- Desktop: mousemove-based parallax ----------------------------------

    let ticking = false

    const onMouseMove = (e: MouseEvent) => {
      const cx = window.innerWidth / 2
      const cy = window.innerHeight / 2
      offsetRef.current = {
        x: (e.clientX - cx),
        y: (e.clientY - cy),
      }
      if (!ticking) {
        ticking = true
        rafRef.current = requestAnimationFrame(() => {
          applyTransforms()
          ticking = false
        })
      }
    }

    window.addEventListener('mousemove', onMouseMove, { passive: true })

    // --- Mobile: DeviceOrientation-based parallax ---------------------------

    let orientationGranted = false

    const onOrientation = (e: DeviceOrientationEvent) => {
      if (!orientationGranted && !e.beta && !e.gamma) return
      const beta = (e.beta || 0) // -180..180 (front-back tilt)
      const gamma = (e.gamma || 0) // -90..90 (left-right tilt)
      // Map tilt to pixel offsets (similar magnitude to mouse offset)
      offsetRef.current = {
        x: gamma * 4, // +-360 px range
        y: (beta - 45) * 3, // center around ~45 deg (natural phone hold)
      }
      if (!ticking) {
        ticking = true
        rafRef.current = requestAnimationFrame(() => {
          applyTransforms()
          ticking = false
        })
      }
    }

    // Try requesting permission on iOS 13+
    const doe = DeviceOrientationEvent as unknown as {
      requestPermission?: () => Promise<string>
    }
    if (typeof doe.requestPermission === 'function') {
      // On iOS we cannot auto-request; the browser requires a user gesture.
      // We'll add a one-time touchstart listener that requests permission.
      const requestOnTouch = () => {
        doe.requestPermission!().then((state: string) => {
          if (state === 'granted') {
            orientationGranted = true
            window.addEventListener('deviceorientation', onOrientation, { passive: true })
          }
        }).catch(() => { /* permission denied -- fall back to no parallax */ })
        window.removeEventListener('touchstart', requestOnTouch)
      }
      window.addEventListener('touchstart', requestOnTouch, { once: true, passive: true })
    } else {
      // Android / other -- just listen
      orientationGranted = true
      window.addEventListener('deviceorientation', onOrientation, { passive: true })
    }

    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('deviceorientation', onOrientation)
      mql.removeEventListener('change', onChange)
    }
  }, [applyTransforms])

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      {ELEMENTS.map((el) => (
        <div
          key={el.id}
          data-depth={el.depth}
          data-rotation={el.rotation}
          className={`fixed ${el.positionClasses} text-gold`}
          style={{
            width: el.size,
            height: el.size,
            opacity: el.opacity,
            transform: `rotate(${el.rotation}deg)`,
            willChange: reducedMotion ? 'auto' : 'transform',
          }}
        >
          {el.svg}
        </div>
      ))}
    </div>
  )
}
