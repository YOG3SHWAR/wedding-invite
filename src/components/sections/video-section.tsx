'use client'

import { useState } from 'react'
import { PLACEHOLDER_VIDEO } from '@/lib/placeholder-data'
import { ScrollReveal } from '@/components/ui/scroll-reveal'

export function VideoSection() {
  const [playing, setPlaying] = useState(false)

  return (
    <section className="py-section-mobile md:py-section px-4">
      <div className="max-w-4xl mx-auto">
        {/* Section heading */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="font-heading text-3xl md:text-4xl text-maroon">
            Our Film
          </h2>
          <p className="font-hindi text-2xl text-gold mt-1">हमारी फिल्म</p>
        </div>

        {/* Video container */}
        <ScrollReveal variant="fadeUp">
          <div className="aspect-video max-w-4xl mx-auto rounded-xl overflow-hidden shadow-lg">
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

                {/* Film strip decorative elements */}
                <div className="absolute top-0 left-0 right-0 h-6 bg-black/50 flex items-center gap-1 px-2" aria-hidden="true">
                  {Array.from({ length: 20 }).map((_, i) => (
                    <div key={i} className="w-3 h-3 rounded-sm bg-white/20" />
                  ))}
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-6 bg-black/50 flex items-center gap-1 px-2" aria-hidden="true">
                  {Array.from({ length: 20 }).map((_, i) => (
                    <div key={i} className="w-3 h-3 rounded-sm bg-white/20" />
                  ))}
                </div>

                {/* Gold play button */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-20 h-20 rounded-full bg-gold/90 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
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
        </ScrollReveal>
      </div>
    </section>
  )
}
