'use client'

import { motion } from 'motion/react'
import { COUPLE, WEDDING_TARGET_DATE } from '@/lib/constants'
import { InteractiveCard } from '@/components/ui/interactive-card'
import { ScrollNudge } from '@/components/ui/scroll-nudge'
import { HeroCountdown } from './hero-countdown'

/**
 * Full-viewport hero section with couple names, Hindi blessing,
 * wedding date, and live countdown timer.
 *
 * Staggered cinematic entrance — each element timed like a movie title sequence.
 */
export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background gradient — deeper maroon */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-[#2D0620] via-maroon to-[#2D0620]"
        aria-hidden="true"
      />

      {/* Vignette overlay */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.3) 100%)',
        }}
        aria-hidden="true"
      />

      {/* Subtle dot pattern for texture */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            'radial-gradient(circle, rgba(251,139,36,0.03) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
        aria-hidden="true"
      />

      {/* Content with gold ornamental frame */}
      <div className="relative z-10 px-4 py-20">
        <InteractiveCard
          className="relative border border-gold/25 px-10 py-14 md:px-20 md:py-20"
          style={{
            boxShadow:
              'inset 0 0 0 3px transparent, inset 0 0 0 4px rgba(251,139,36,0.12)',
          }}
          tiltIntensity={6}
          liftAmount={4}
          glowColor="rgba(251,139,36,0.1)"
        >
          {/* Corner accents — four gold right-angle lines */}
          <div className="absolute top-0 left-0 w-6 h-6 border-t border-l border-gold/50" />
          <div className="absolute top-0 right-0 w-6 h-6 border-t border-r border-gold/50" />
          <div className="absolute bottom-0 left-0 w-6 h-6 border-b border-l border-gold/50" />
          <div className="absolute bottom-0 right-0 w-6 h-6 border-b border-r border-gold/50" />

          <div className="text-center">
            {/* Hindi blessing fades in first */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="font-hindi text-xl md:text-2xl text-gold tracking-wide"
            >
              शुभ विवाह
            </motion.p>

            {/* Gold line expands — with glow */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mx-auto my-4 w-16 md:w-24 h-px bg-gradient-to-r from-transparent via-gold to-transparent"
              style={{ boxShadow: '0 0 8px rgba(251,139,36,0.4)' }}
              aria-hidden="true"
            />

            {/* Couple names scale up with spring */}
            <motion.h1
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', stiffness: 100, damping: 15, delay: 0.7 }}
              className="font-heading text-6xl md:text-8xl lg:text-9xl text-gold leading-tight"
              style={{ textShadow: '0 1px 3px rgba(0,0,0,0.3)' }}
            >
              {COUPLE.nameEnglish}
            </motion.h1>

            {/* Hindi names fade in */}
            <motion.h2
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.0 }}
              className="mt-4 font-hindi text-3xl md:text-5xl text-white tracking-wide"
            >
              {COUPLE.nameHindi}
            </motion.h2>

            {/* Date fades in */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1.2 }}
              className="mt-5 font-body text-xl md:text-2xl text-cream tracking-wider"
            >
              {COUPLE.weddingDate}
            </motion.p>

            {/* Countdown slides up */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.4 }}
            >
              <HeroCountdown targetDate={WEDDING_TARGET_DATE} />
            </motion.div>
          </div>
        </InteractiveCard>

      </div>

      {/* Scroll nudge — prominent, auto-hiding */}
      <ScrollNudge />
    </section>
  )
}
