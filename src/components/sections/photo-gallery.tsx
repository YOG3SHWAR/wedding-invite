'use client'

import { useState } from 'react'
import Lightbox from 'yet-another-react-lightbox'
import 'yet-another-react-lightbox/styles.css'
import { PLACEHOLDER_GALLERY } from '@/lib/placeholder-data'
import { StaggerReveal, StaggerItem } from '@/components/ui/stagger-reveal'
import { InteractiveCard } from '@/components/ui/interactive-card'

export function PhotoGallery() {
  const [open, setOpen] = useState(false)
  const [index, setIndex] = useState(0)

  const slides = PLACEHOLDER_GALLERY.map((img) => ({
    src: img.src,
    alt: img.alt,
    width: img.width,
    height: img.height,
  }))

  return (
    <section className="py-section-mobile md:py-section px-4">
      <div className="max-w-6xl mx-auto">
        {/* Section heading */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="font-heading text-3xl md:text-4xl text-maroon">
            Gallery
          </h2>
          <p className="font-hindi text-2xl text-gold mt-1">तस्वीरें</p>
          <div className="mx-auto mt-4 w-20 h-px bg-gradient-to-r from-transparent via-gold to-transparent" aria-hidden="true" />
        </div>

        {/* Masonry grid */}
        <StaggerReveal className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
          {PLACEHOLDER_GALLERY.map((img, i) => (
            <StaggerItem key={img.id} className="break-inside-avoid">
              <InteractiveCard
                className="block w-full rounded-lg overflow-hidden border border-gold/15 hover:border-gold/35 shadow-md cursor-pointer"
                tiltIntensity={8}
                liftAmount={6}
              >
                <button
                  type="button"
                  onClick={() => {
                    setIndex(i)
                    setOpen(true)
                  }}
                  className="block w-full"
                  aria-label={`View ${img.alt}`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img.src}
                    alt={img.alt}
                    width={img.width}
                    height={img.height}
                    loading="lazy"
                    className="w-full h-auto"
                  />
                </button>
              </InteractiveCard>
            </StaggerItem>
          ))}
        </StaggerReveal>

        {/* Lightbox */}
        <Lightbox
          open={open}
          close={() => setOpen(false)}
          index={index}
          slides={slides}
        />
      </div>
    </section>
  )
}
