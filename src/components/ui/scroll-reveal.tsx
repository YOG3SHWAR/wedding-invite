'use client'

import { motion, type Variants } from 'motion/react'
import { type ReactNode } from 'react'

const variants: Record<string, Variants> = {
  fadeUp: {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0 },
  },
  fadeIn: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
  scaleUp: {
    hidden: { opacity: 0, scale: 0.85 },
    visible: { opacity: 1, scale: 1 },
  },
  slideLeft: {
    hidden: { opacity: 0, x: -60 },
    visible: { opacity: 1, x: 0 },
  },
  slideRight: {
    hidden: { opacity: 0, x: 60 },
    visible: { opacity: 1, x: 0 },
  },
}

interface ScrollRevealProps {
  children: ReactNode
  variant?: keyof typeof variants
  delay?: number
  duration?: number
  spring?: boolean
  className?: string
}

export function ScrollReveal({
  children,
  variant = 'fadeUp',
  delay = 0,
  duration = 0.7,
  spring = false,
  className,
}: ScrollRevealProps) {
  const transition = spring
    ? { delay, type: 'spring' as const, stiffness: 100, damping: 15 }
    : { duration, delay, ease: 'easeOut' as const }

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, margin: '-50px' }}
      variants={variants[variant]}
      transition={transition}
      className={className}
    >
      {children}
    </motion.div>
  )
}
