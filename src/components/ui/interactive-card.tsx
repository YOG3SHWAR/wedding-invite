'use client'

import {
  useRef,
  useCallback,
  useState,
  type ReactNode,
  type CSSProperties,
  type TouchEvent,
  type MouseEvent,
} from 'react'
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionStyle,
} from 'motion/react'

interface InteractiveCardProps {
  children: ReactNode
  className?: string
  style?: CSSProperties
  tiltIntensity?: number
  glowColor?: string
  liftAmount?: number
  shimmerOnEnter?: boolean
}

const SPRING_CONFIG = { stiffness: 300, damping: 25, mass: 0.5 }

export function InteractiveCard({
  children,
  className = '',
  style,
  tiltIntensity = 12,
  glowColor = 'rgba(251,139,36,0.15)',
  liftAmount = 8,
  shimmerOnEnter = true,
}: InteractiveCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)
  const [shimmerActive, setShimmerActive] = useState(false)

  // Raw motion values for cursor position (0–1 normalized)
  const mouseX = useMotionValue(0.5)
  const mouseY = useMotionValue(0.5)

  // Smoothed springs for tilt
  const springX = useSpring(mouseX, SPRING_CONFIG)
  const springY = useSpring(mouseY, SPRING_CONFIG)

  // 3D tilt transforms: map 0–1 → ±tiltIntensity degrees
  const rotateX = useTransform(springY, [0, 1], [tiltIntensity, -tiltIntensity])
  const rotateY = useTransform(springX, [0, 1], [-tiltIntensity, tiltIntensity])

  // Glow position as percentage strings
  const glowLeft = useTransform(springX, (v) => `${v * 100}%`)
  const glowTop = useTransform(springY, (v) => `${v * 100}%`)

  const updateCursorPosition = useCallback(
    (clientX: number, clientY: number) => {
      const el = cardRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const x = (clientX - rect.left) / rect.width
      const y = (clientY - rect.top) / rect.height
      mouseX.set(Math.max(0, Math.min(1, x)))
      mouseY.set(Math.max(0, Math.min(1, y)))
    },
    [mouseX, mouseY]
  )

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      updateCursorPosition(e.clientX, e.clientY)
    },
    [updateCursorPosition]
  )

  const handleMouseEnter = useCallback(
    (e: MouseEvent) => {
      setIsHovered(true)
      updateCursorPosition(e.clientX, e.clientY)
      if (shimmerOnEnter) {
        setShimmerActive(true)
        setTimeout(() => setShimmerActive(false), 600)
      }
    },
    [updateCursorPosition, shimmerOnEnter]
  )

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false)
    mouseX.set(0.5)
    mouseY.set(0.5)
  }, [mouseX, mouseY])

  // Mobile: tap triggers a brief tilt bounce + glow pulse + shimmer
  const handleTouchStart = useCallback(
    (e: TouchEvent) => {
      const touch = e.touches[0]
      if (!touch) return
      updateCursorPosition(touch.clientX, touch.clientY)
      setIsHovered(true)
      if (shimmerOnEnter) {
        setShimmerActive(true)
        setTimeout(() => setShimmerActive(false), 600)
      }
      // Spring back after brief hold
      setTimeout(() => {
        setIsHovered(false)
        mouseX.set(0.5)
        mouseY.set(0.5)
      }, 400)
    },
    [updateCursorPosition, shimmerOnEnter, mouseX, mouseY]
  )

  const motionStyle: MotionStyle = {
    perspective: 800,
    transformStyle: 'preserve-3d' as const,
    backfaceVisibility: 'hidden' as const,
    willChange: 'transform',
    rotateX,
    rotateY,
    ...style,
  }

  return (
    <motion.div
      ref={cardRef}
      className={`relative ${className}`}
      style={motionStyle}
      animate={{
        y: isHovered ? -liftAmount : 0,
        scale: isHovered ? 1.02 : 1,
        boxShadow: isHovered
          ? '0 20px 40px rgba(0,0,0,0.18), 0 8px 16px rgba(251,139,36,0.12)'
          : '0 4px 12px rgba(0,0,0,0.1)',
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
    >
      {/* Inner wrapper flattens 3D context so text stays crisp */}
      <div style={{ transform: 'translateZ(0)', backfaceVisibility: 'hidden' }}>
        {children}
      </div>

      {/* Cursor-following radial glow overlay */}
      <motion.div
        className="pointer-events-none absolute inset-0 z-10 rounded-[inherit] overflow-hidden"
        style={{ opacity: isHovered ? 1 : 0 }}
        aria-hidden="true"
      >
        <motion.div
          className="absolute w-[200%] h-[200%]"
          style={{
            left: glowLeft,
            top: glowTop,
            x: '-50%',
            y: '-50%',
            background: `radial-gradient(circle at center, ${glowColor} 0%, transparent 70%)`,
          }}
        />
      </motion.div>

      {/* Gold shimmer sweep */}
      {shimmerActive && (
        <div
          className="pointer-events-none absolute inset-0 z-20 rounded-[inherit] overflow-hidden"
          aria-hidden="true"
        >
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(105deg, transparent 35%, rgba(251,139,36,0.12) 45%, rgba(251,139,36,0.2) 50%, rgba(251,139,36,0.12) 55%, transparent 65%)',
              animation: 'interactive-card-shimmer 600ms ease-out forwards',
            }}
          />
        </div>
      )}
    </motion.div>
  )
}
