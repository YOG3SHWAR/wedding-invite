'use client'

import { useState } from 'react'
import { PLACEHOLDER_VIDEO } from '@/lib/placeholder-data'
import { ScrollReveal } from '@/components/ui/scroll-reveal'
import { InteractiveCard } from '@/components/ui/interactive-card'

export function VideoSection() {
  const [playing, setPlaying] = useState(false)

  return (
    <section className="py-section-mobile md:py-section px-4 bg-cream-dark">
      <div className="max-w-4xl mx-auto">
        {/* Section heading */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="font-heading text-3xl md:text-4xl text-maroon">
            Our Film
          </h2>
          <p className="font-hindi text-2xl text-gold mt-1">हमारी फिल्म</p>
        </div>

        {/* Video container with gold frame */}
        <ScrollReveal variant="fadeUp">
          <InteractiveCard className="border border-gold/60 rounded-xl p-1" tiltIntensity={6} liftAmount={5}>
            <div className="aspect-video max-w-4xl mx-auto rounded-lg overflow-hidden shadow-lg">
              {!playing ? (
                <button
                  type="button"
                  onClick={() => setPlaying(true)}
                  className="relative w-full h-full group cursor-pointer"
                  aria-label="Play video"
                >
                  {/* Thumbnail */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={PLACEHOLDER_VIDEO.thumbnailSrc}
                    alt="Pre-wedding video thumbnail"
                    className="w-full h-full object-cover"
                  />

                  {/* Dark overlay */}
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors duration-300" />

                  {/* Gold play button */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-20 h-20 rounded-full bg-gold flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      <svg
                        width="32"
                        height="32"
                        viewBox="0 0 24 24"
                        fill="white"
                        className="ml-1"
                        aria-hidden="true"
                      >
                        <polygon points="5,3 19,12 5,21" />
                      </svg>
                    </div>
                  </div>
                </button>
              ) : (
                <iframe
                  src={`${PLACEHOLDER_VIDEO.videoUrl}?autoplay=1`}
                  title="Pre-wedding video"
                  allow="autoplay; fullscreen"
                  allowFullScreen
                  className="w-full h-full"
                />
              )}
            </div>
          </InteractiveCard>
        </ScrollReveal>
      </div>
    </section>
  )
}
