'use client'

import { GIFT_ITEMS } from '@/lib/constants'
import { ScrollReveal } from '@/components/ui/scroll-reveal'

export function GiftsSection() {
  return (
    <section id="gifts" className="py-section-mobile md:py-section px-4">
      <div className="max-w-4xl mx-auto">
        {/* Blessing message header */}
        <ScrollReveal>
          <div className="text-center mb-8">
            <p className="font-hindi text-gold text-2xl md:text-3xl mb-2">
              आपका साथ ही हमारा सबसे बड़ा उपहार है
            </p>
            <p className="font-heading text-maroon text-xl mb-3">
              Your presence is our greatest gift
            </p>
            <p className="font-body text-maroon/70 italic">
              If you&apos;d like to bless us further:
            </p>
            {/* Decorative gold divider */}
            <hr className="mt-6 mx-auto max-w-[200px] border-t border-gold/30" />
          </div>
        </ScrollReveal>

        {/* Gift card grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {GIFT_ITEMS.map((gift, index) => (
            <ScrollReveal key={gift.id} delay={0.1 * index}>
              <div className="rounded-xl border border-gold/20 overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow">
                {/* Placeholder image area */}
                <div className="aspect-square bg-cream/50 flex items-center justify-center">
                  <svg
                    width="64"
                    height="64"
                    viewBox="0 0 64 64"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-gold/40"
                  >
                    {/* Gift box base */}
                    <rect
                      x="10"
                      y="30"
                      width="44"
                      height="28"
                      rx="3"
                      stroke="currentColor"
                      strokeWidth="2"
                      fill="none"
                    />
                    {/* Gift box lid */}
                    <rect
                      x="7"
                      y="24"
                      width="50"
                      height="8"
                      rx="2"
                      stroke="currentColor"
                      strokeWidth="2"
                      fill="none"
                    />
                    {/* Vertical ribbon */}
                    <line
                      x1="32"
                      y1="24"
                      x2="32"
                      y2="58"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                    {/* Horizontal ribbon */}
                    <line
                      x1="10"
                      y1="44"
                      x2="54"
                      y2="44"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                    {/* Bow left */}
                    <path
                      d="M32 24C32 24 24 16 20 14C16 12 18 20 22 22C26 24 32 24 32 24Z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      fill="currentColor"
                      opacity="0.3"
                    />
                    {/* Bow right */}
                    <path
                      d="M32 24C32 24 40 16 44 14C48 12 46 20 42 22C38 24 32 24 32 24Z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      fill="currentColor"
                      opacity="0.3"
                    />
                  </svg>
                </div>

                {/* Card body */}
                <div className="p-4">
                  <h3 className="font-heading text-maroon text-lg">
                    {gift.name}
                  </h3>
                  <p className="font-hindi text-maroon/60 text-sm">
                    {gift.nameHindi}
                  </p>
                  <p className="font-body text-gold font-semibold mt-1">
                    {gift.priceRange}
                  </p>
                  <a
                    href={gift.buyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-3 bg-maroon text-white px-6 py-2 rounded-lg font-heading text-sm hover:bg-maroon/90 transition-colors"
                  >
                    Buy
                  </a>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
