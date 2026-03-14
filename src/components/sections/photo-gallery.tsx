'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Lightbox from 'yet-another-react-lightbox'
import 'yet-another-react-lightbox/styles.css'
import { PLACEHOLDER_GALLERY } from '@/lib/placeholder-data'
import { StaggerReveal, StaggerItem } from '@/components/ui/stagger-reveal'
import { InteractiveCard } from '@/components/ui/interactive-card'

const GALLERY_PREVIEW_COUNT = 12

export function PhotoGallery() {
  const [open, setOpen] = useState(false)
  const [index, setIndex] = useState(0)

  const previewPhotos = PLACEHOLDER_GALLERY.slice(0, GALLERY_PREVIEW_COUNT)

  const slides = previewPhotos.map((img) => ({
    src: `/_next/image?url=${encodeURIComponent(img.src)}&w=1200&q=85`,
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
          {previewPhotos.map((img, i) => (
            <StaggerItem key={img.id} className="break-inside-avoid">
              <InteractiveCard
                className="block w-full rounded-lg overflow-hidden border border-gold/50 hover:border-gold/70 shadow-md cursor-pointer"
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
                  <Image
                    src={img.src}
                    alt={img.alt}
                    width={img.width}
                    height={img.height}
                    loading="lazy"
                    sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    quality={75}
                    className="w-full h-auto"
                  />
                </button>
              </InteractiveCard>
            </StaggerItem>
          ))}
        </StaggerReveal>

        {/* View All Photos button */}
        <div className="text-center mt-10 md:mt-14">
          <Link
            href="/gallery"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-full font-heading text-lg text-cream bg-maroon border-2 border-gold/60 shadow-lg transition-all duration-300 hover:bg-maroon-dark hover:border-gold hover:shadow-xl hover:scale-105 active:scale-[0.98]"
          >
            View All Photos
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>

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
