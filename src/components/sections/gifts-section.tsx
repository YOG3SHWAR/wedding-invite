'use client'

import { GIFT_ITEMS } from '@/lib/constants'
import { ScrollReveal } from '@/components/ui/scroll-reveal'
import { InteractiveCard } from '@/components/ui/interactive-card'
import { motion } from 'motion/react'
import Link from 'next/link'

/** Decorative gift bow SVG */
function GiftIcon({ className }: { className?: string }) {
  return (
    <svg
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <rect x="8" y="22" width="32" height="22" rx="2" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <rect x="5" y="17" width="38" height="7" rx="2" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <line x1="24" y1="17" x2="24" y2="44" stroke="currentColor" strokeWidth="1.5" />
      <line x1="8" y1="33" x2="40" y2="33" stroke="currentColor" strokeWidth="1" opacity="0.4" />
      <path d="M24 17C24 17 18 10 14 8C10 6 12 14 16 16C20 18 24 17 24 17Z" stroke="currentColor" strokeWidth="1.2" fill="currentColor" opacity="0.2" />
      <path d="M24 17C24 17 30 10 34 8C38 6 36 14 32 16C28 18 24 17 24 17Z" stroke="currentColor" strokeWidth="1.2" fill="currentColor" opacity="0.2" />
    </svg>
  )
}

export function GiftsSection() {
  return (
    <div className="min-h-screen bg-cream relative overflow-hidden">
      {/* Subtle background pattern */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `radial-gradient(circle at 30% 30%, #FB8B24 1px, transparent 1px),
                           radial-gradient(circle at 70% 70%, #FB8B24 1px, transparent 1px)`,
          backgroundSize: '50px 50px',
        }}
        aria-hidden="true"
      />

      <div className="relative max-w-4xl mx-auto px-4 py-12 md:py-20">
        {/* Back link */}
        <ScrollReveal>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-maroon/50 font-body text-sm hover:text-maroon transition-colors mb-10 group"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              className="group-hover:-translate-x-1 transition-transform"
              aria-hidden="true"
            >
              <path d="M10 3l-5 5 5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Back to Invitation
          </Link>
        </ScrollReveal>

        {/* ─── Page Header ─── */}
        <ScrollReveal>
          <div className="text-center mb-14 md:mb-20">
            {/* Top ornamental line */}
            <div className="mx-auto mb-6 w-32 md:w-48 h-px bg-gradient-to-r from-transparent via-gold to-transparent" />

            <GiftIcon className="mx-auto text-gold/40 mb-4" />

            <h1
              className="font-heading text-4xl md:text-6xl leading-tight mb-2 tracking-wide"
              style={{
                background: 'linear-gradient(135deg, #FB8B24 0%, #E36414 40%, #FCA84E 60%, #FB8B24 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Gift Wishes
            </h1>
            <h2 className="font-hindi text-xl md:text-2xl text-maroon/60 tracking-wide mb-4">
              उपहार
            </h2>

            {/* Blessing */}
            <div className="max-w-md mx-auto">
              <p className="font-body text-lg md:text-xl text-gold-accessible/80 italic mb-1">
                Your presence is our greatest gift
              </p>
              <p className="font-hindi text-maroon/50">
                आपका साथ ही हमारा सबसे बड़ा उपहार है
              </p>
              <p className="font-body text-maroon/40 text-sm mt-3">
                If you&apos;d like to bless us further, here are some ideas:
              </p>
            </div>

            {/* Bottom ornamental line */}
            <div className="mx-auto mt-8 w-24 md:w-36 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
          </div>
        </ScrollReveal>

        {/* ─── Gift Cards Grid ─── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8 max-w-3xl mx-auto">
          {GIFT_ITEMS.map((gift, index) => (
            <ScrollReveal key={gift.id} delay={0.1 * index}>
              <InteractiveCard
                className="rounded-xl border border-gold/50 overflow-hidden bg-white shadow-md group"
                tiltIntensity={10}
                liftAmount={6}
              >
                {/* Image area with gold accent */}
                <div className="relative aspect-[4/3] bg-gradient-to-br from-cream to-cream-dark flex items-center justify-center overflow-hidden">
                  {/* Decorative background pattern */}
                  <div
                    className="absolute inset-0 opacity-[0.04]"
                    style={{
                      backgroundImage: `radial-gradient(circle, #FB8B24 1px, transparent 1px)`,
                      backgroundSize: '16px 16px',
                    }}
                  />
                  <svg
                    width="56"
                    height="56"
                    viewBox="0 0 48 48"
                    fill="none"
                    className="text-gold/30 group-hover:text-gold/50 transition-colors"
                  >
                    <rect x="8" y="22" width="32" height="22" rx="2" stroke="currentColor" strokeWidth="1.5" fill="none" />
                    <rect x="5" y="17" width="38" height="7" rx="2" stroke="currentColor" strokeWidth="1.5" fill="none" />
                    <line x1="24" y1="17" x2="24" y2="44" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M24 17C24 17 18 10 14 8C10 6 12 14 16 16C20 18 24 17 24 17Z" fill="currentColor" opacity="0.25" />
                    <path d="M24 17C24 17 30 10 34 8C38 6 36 14 32 16C28 18 24 17 24 17Z" fill="currentColor" opacity="0.25" />
                  </svg>

                  {/* Gold accent line at bottom of image */}
                  <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
                </div>

                {/* Card body */}
                <div className="p-5">
                  <h3 className="font-heading text-maroon text-lg leading-tight">
                    {gift.name}
                  </h3>
                  <p className="font-hindi text-maroon/50 text-sm mt-0.5">
                    {gift.nameHindi}
                  </p>

                  <div className="flex items-center justify-between mt-4">
                    <span className="font-body text-gold-accessible font-semibold text-sm">
                      {gift.priceRange}
                    </span>
                    <a
                      href={gift.buyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-5 py-2 rounded-lg font-heading text-sm tracking-wide transition-all duration-300 border border-maroon/80 text-maroon hover:bg-maroon hover:text-white active:scale-95"
                    >
                      Buy
                    </a>
                  </div>
                </div>
              </InteractiveCard>
            </ScrollReveal>
          ))}
        </div>

        {/* ─── Bottom note ─── */}
        <ScrollReveal delay={0.4}>
          <div className="text-center mt-14 md:mt-20">
            <div className="mx-auto mb-4 w-16 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
            <p className="font-body text-maroon/40 text-sm max-w-sm mx-auto">
              These are just suggestions — your blessings and good wishes mean the world to us.
            </p>

            <Link
              href="/#rsvp"
              className="inline-flex items-center gap-2 mt-6 px-8 py-3 rounded-xl text-white font-heading tracking-wide transition-all duration-300 active:scale-95"
              style={{
                background: 'linear-gradient(135deg, #5F0F40 0%, #7A2358 50%, #5F0F40 100%)',
                boxShadow: '0 4px 16px rgba(95,15,64,0.2)',
              }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                aria-hidden="true"
              >
                <path d="M10 3l-5 5 5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              RSVP Now
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </div>
  )
}
