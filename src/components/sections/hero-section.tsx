import { COUPLE, WEDDING_TARGET_DATE } from '@/lib/constants'
import { HeroCountdown } from './hero-countdown'

/**
 * Full-viewport hero section with couple names, Hindi blessing,
 * wedding date, and live countdown timer.
 *
 * Server component -- only HeroCountdown is a client island.
 * Background uses a deep maroon gradient as placeholder for couple photo.
 */
export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background gradient (placeholder for couple photo with dark overlay) */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-maroon-dark via-maroon/80 to-maroon-dark"
        aria-hidden="true"
      />

      {/* Subtle radial glow behind content */}
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(212,175,55,0.08)_0%,_transparent_70%)]"
        aria-hidden="true"
      />

      {/* Content */}
      <div className="relative z-10 text-center px-4 py-20">
        {/* Ornate decorative frame */}
        <div className="relative inline-block px-8 py-12 md:px-16 md:py-16">
          {/* Corner decorations */}
          <div className="absolute top-0 left-0 w-12 h-12 md:w-16 md:h-16 border-t-2 border-l-2 border-gold/60 rounded-tl-sm" aria-hidden="true" />
          <div className="absolute top-0 right-0 w-12 h-12 md:w-16 md:h-16 border-t-2 border-r-2 border-gold/60 rounded-tr-sm" aria-hidden="true" />
          <div className="absolute bottom-0 left-0 w-12 h-12 md:w-16 md:h-16 border-b-2 border-l-2 border-gold/60 rounded-bl-sm" aria-hidden="true" />
          <div className="absolute bottom-0 right-0 w-12 h-12 md:w-16 md:h-16 border-b-2 border-r-2 border-gold/60 rounded-br-sm" aria-hidden="true" />

          {/* Hindi blessing */}
          <p
            className="font-hindi text-2xl md:text-3xl text-gold-light tracking-wide"
            style={{ textShadow: '0 2px 8px rgba(0,0,0,0.4)' }}
          >
            शुभ विवाह
          </p>

          {/* Decorative gold line */}
          <div className="mx-auto my-4 w-24 md:w-32 h-px bg-gradient-to-r from-transparent via-gold to-transparent" aria-hidden="true" />

          {/* Couple names in Hindi */}
          <h1
            className="font-hindi text-6xl md:text-8xl lg:text-9xl text-gold leading-tight"
            style={{ textShadow: '0 4px 16px rgba(0,0,0,0.5)' }}
          >
            {COUPLE.nameHindi}
          </h1>

          {/* Couple names in English */}
          <h2
            className="mt-4 font-heading text-3xl md:text-5xl text-white tracking-wide"
            style={{ textShadow: '0 2px 12px rgba(0,0,0,0.5)' }}
          >
            {COUPLE.nameEnglish}
          </h2>

          {/* Wedding date */}
          <p
            className="mt-5 font-body text-xl md:text-2xl text-cream tracking-wider"
            style={{ textShadow: '0 2px 8px rgba(0,0,0,0.4)' }}
          >
            {COUPLE.weddingDate}
          </p>

          {/* Decorative gold line */}
          <div className="mx-auto mt-5 w-16 md:w-24 h-px bg-gradient-to-r from-transparent via-gold to-transparent" aria-hidden="true" />

          {/* Countdown timer (client component) */}
          <HeroCountdown targetDate={WEDDING_TARGET_DATE} />
        </div>
      </div>
    </section>
  )
}
