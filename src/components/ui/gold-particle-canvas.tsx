'use client'

import { useEffect, useRef, useCallback } from 'react'

/**
 * GoldParticleCanvas
 *
 * Full-viewport HTML5 Canvas that renders a bold, always-on gold sparkle
 * particle system. Particles trail the cursor (desktop) or follow touch/tap
 * (mobile). Effects only appear on interaction.
 *
 * Renders behind all content via `position: fixed; z-index: 0; pointer-events: none`.
 * Respects `prefers-reduced-motion` -- animation loop never starts when set.
 */

// --- Particle types & constants -------------------------------------------------

type ParticleShape = 'circle' | 'diamond' | 'star'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  opacity: number
  initialOpacity: number
  life: number
  maxLife: number
  color: string
  shape: ParticleShape
}

const GOLD_COLORS = ['#D4AF37', '#E8CC6E', '#B8941F', '#FFF0C0']
const SHAPES: ParticleShape[] = ['circle', 'diamond', 'star']
const DESKTOP_CAP = 200
const MOBILE_CAP = 120
const GRAVITY = 0.01

// --- Helpers -------------------------------------------------------------------

function rand(min: number, max: number): number {
  return Math.random() * (max - min) + min
}

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function isMobileDevice(): boolean {
  if (typeof window === 'undefined') return false
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0
}

// --- Particle factory -----------------------------------------------------------

function createTrailParticle(x: number, y: number): Particle {
  const maxLife = Math.floor(rand(40, 80))
  const initialOpacity = rand(0.6, 1.0)
  return {
    x,
    y,
    vx: rand(-1.5, 1.5),
    vy: rand(-2.5, -0.3),
    size: rand(2, 6),
    opacity: initialOpacity,
    initialOpacity,
    life: 0,
    maxLife,
    color: pickRandom(GOLD_COLORS),
    shape: pickRandom(SHAPES),
  }
}

function createBurstParticle(x: number, y: number): Particle {
  const maxLife = Math.floor(rand(30, 60))
  const initialOpacity = rand(0.7, 1.0)
  return {
    x,
    y,
    vx: rand(-3.5, 3.5),
    vy: rand(-4, 1),
    size: rand(2.5, 7),
    opacity: initialOpacity,
    initialOpacity,
    life: 0,
    maxLife,
    color: pickRandom(GOLD_COLORS),
    shape: pickRandom(SHAPES),
  }
}

// --- Drawing helpers ------------------------------------------------------------

function drawCircle(ctx: CanvasRenderingContext2D, p: Particle) {
  ctx.beginPath()
  ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
  ctx.fill()
}

function drawDiamond(ctx: CanvasRenderingContext2D, p: Particle) {
  const s = p.size
  ctx.beginPath()
  ctx.moveTo(p.x, p.y - s)
  ctx.lineTo(p.x + s * 0.7, p.y)
  ctx.lineTo(p.x, p.y + s)
  ctx.lineTo(p.x - s * 0.7, p.y)
  ctx.closePath()
  ctx.fill()
}

function drawStar(ctx: CanvasRenderingContext2D, p: Particle) {
  const s = p.size
  const inner = s * 0.4
  ctx.beginPath()
  for (let i = 0; i < 4; i++) {
    const angle = (i * Math.PI) / 2 - Math.PI / 2
    const outerX = p.x + Math.cos(angle) * s
    const outerY = p.y + Math.sin(angle) * s
    const midAngle = angle + Math.PI / 4
    const innerX = p.x + Math.cos(midAngle) * inner
    const innerY = p.y + Math.sin(midAngle) * inner
    if (i === 0) {
      ctx.moveTo(outerX, outerY)
    } else {
      ctx.lineTo(outerX, outerY)
    }
    ctx.lineTo(innerX, innerY)
  }
  ctx.closePath()
  ctx.fill()
}

function drawParticle(ctx: CanvasRenderingContext2D, p: Particle) {
  ctx.globalAlpha = p.opacity
  ctx.fillStyle = p.color
  switch (p.shape) {
    case 'circle':
      drawCircle(ctx, p); break
    case 'diamond':
      drawDiamond(ctx, p); break
    case 'star':
      drawStar(ctx, p); break
  }
}

// --- Component ------------------------------------------------------------------

export function GoldParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const rafRef = useRef<number>(0)
  const isMobileRef = useRef(false)
  const reducedMotionRef = useRef(false)

  // Stable callback refs for pointer position (avoids re-renders)
  const pointerRef = useRef<{ x: number; y: number; active: boolean }>({
    x: 0, y: 0, active: false,
  })

  const sizeCanvas = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const dpr = window.devicePixelRatio || 1
    const w = window.innerWidth
    const h = window.innerHeight
    canvas.width = w * dpr
    canvas.height = h * dpr
    canvas.style.width = `${w}px`
    canvas.style.height = `${h}px`
    const ctx = canvas.getContext('2d')
    if (ctx) ctx.scale(dpr, dpr)
  }, [])

  useEffect(() => {
    // Reduced-motion check
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)')
    reducedMotionRef.current = mql.matches

    if (mql.matches) return // Don't start anything

    isMobileRef.current = isMobileDevice()
    const particleCap = isMobileRef.current ? MOBILE_CAP : DESKTOP_CAP

    sizeCanvas()

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const w = () => window.innerWidth
    const h = () => window.innerHeight

    // --- Event handlers -------------------------------------------------------

    const onMouseMove = (e: MouseEvent) => {
      pointerRef.current = { x: e.clientX, y: e.clientY, active: true }
    }

    const onMouseLeave = () => {
      pointerRef.current.active = false
    }

    const onTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0]
      if (touch) {
        pointerRef.current = { x: touch.clientX, y: touch.clientY, active: true }
      }
    }

    const onTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0]
      if (!touch) return
      // Burst effect on tap
      const count = Math.floor(rand(8, 12))
      const particles = particlesRef.current
      for (let i = 0; i < count && particles.length < particleCap; i++) {
        particles.push(createBurstParticle(touch.clientX, touch.clientY))
      }
      pointerRef.current = { x: touch.clientX, y: touch.clientY, active: true }
    }

    const onTouchEnd = () => {
      pointerRef.current.active = false
    }

    const onResize = () => sizeCanvas()

    window.addEventListener('mousemove', onMouseMove, { passive: true })
    document.addEventListener('mouseleave', onMouseLeave)
    window.addEventListener('touchmove', onTouchMove, { passive: true })
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchend', onTouchEnd, { passive: true })
    window.addEventListener('resize', onResize, { passive: true })

    // --- Animation loop -------------------------------------------------------

    let running = true

    const animate = () => {
      if (!running) return

      const particles = particlesRef.current

      // Spawn trail particles from pointer
      if (pointerRef.current.active) {
        const count = Math.floor(rand(3, 5))
        for (let i = 0; i < count && particles.length < particleCap; i++) {
          particles.push(
            createTrailParticle(pointerRef.current.x, pointerRef.current.y)
          )
        }
      }

      // Clear
      ctx.clearRect(0, 0, w(), h())

      // Update & draw
      let i = particles.length
      while (i--) {
        const p = particles[i]
        p.x += p.vx
        p.y += p.vy
        p.vy += GRAVITY
        p.life++
        p.opacity = (1 - p.life / p.maxLife) * p.initialOpacity

        if (p.life >= p.maxLife) {
          // Swap-remove for perf
          particles[i] = particles[particles.length - 1]
          particles.pop()
          continue
        }

        drawParticle(ctx, p)
      }

      // Reset globalAlpha
      ctx.globalAlpha = 1

      rafRef.current = requestAnimationFrame(animate)
    }

    rafRef.current = requestAnimationFrame(animate)

    // Listener for dynamic reduced-motion changes
    const onMotionChange = (e: MediaQueryListEvent) => {
      if (e.matches) {
        running = false
        cancelAnimationFrame(rafRef.current)
        ctx.clearRect(0, 0, w(), h())
        particlesRef.current = []
      } else {
        running = true
        rafRef.current = requestAnimationFrame(animate)
      }
    }
    mql.addEventListener('change', onMotionChange)

    // --- Cleanup --------------------------------------------------------------

    return () => {
      running = false
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseleave', onMouseLeave)
      window.removeEventListener('touchmove', onTouchMove)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchend', onTouchEnd)
      window.removeEventListener('resize', onResize)
      mql.removeEventListener('change', onMotionChange)
      particlesRef.current = []
    }
  }, [sizeCanvas])

  // If reduced motion, render nothing visible
  // (We still mount so the effect can listen for changes, but the canvas stays hidden)

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      data-testid="gold-particle-canvas"
      className="pointer-events-none fixed inset-0 z-0"
    />
  )
}
