import { ScrollReveal } from '@/components/ui/scroll-reveal'
import { EVENT_COLORS } from '@/lib/constants'

const PRIMARY_COLORS = [
  { name: 'Maroon', className: 'bg-maroon' },
  { name: 'Gold', className: 'bg-gold' },
  { name: 'Emerald', className: 'bg-emerald' },
  { name: 'Cream', className: 'bg-cream border border-gold/30' },
]

const EVENT_SWATCHES = [
  { name: 'Tilak', className: 'bg-tilak' },
  { name: 'Mehndi', className: 'bg-mehndi' },
  { name: 'Sangeet', className: 'bg-sangeet' },
  { name: 'Haldi', className: 'bg-haldi' },
  { name: 'Shadi', className: 'bg-shadi' },
]

const ANIMATION_VARIANTS = ['fadeUp', 'fadeIn', 'slideLeft', 'slideRight'] as const

export default function Home() {
  return (
    <main>
      {/* Section 1 -- Hero placeholder */}
      <section className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
        <div className="border-2 border-gold rounded-lg p-8 md:p-16 lg:p-20">
          <h1 className="font-hindi text-6xl md:text-8xl lg:text-9xl text-gold leading-tight">
            योगी &amp; सुधा
          </h1>
          <h2 className="mt-4 font-heading text-3xl md:text-5xl lg:text-6xl text-maroon">
            Yogi &amp; Sudha
          </h2>
          <p className="mt-6 font-body text-lg md:text-xl text-maroon/80">
            28 April 2026
          </p>
          <div className="mt-8 mx-auto w-48 md:w-64 border-t-2 border-gold" />
        </div>
      </section>

      {/* Section 2 -- Design system color showcase */}
      <section className="px-4 py-section-mobile md:py-section">
        <ScrollReveal>
          <div className="mx-auto max-w-4xl">
            <h3 className="font-heading text-2xl md:text-3xl text-maroon text-center mb-8">
              Color Palette
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
              {PRIMARY_COLORS.map((color) => (
                <div key={color.name} className="flex flex-col items-center gap-2">
                  <div className={`w-20 h-20 rounded-lg ${color.className}`} />
                  <span className="font-body text-sm text-maroon-dark">{color.name}</span>
                </div>
              ))}
            </div>
            <h4 className="font-heading text-xl md:text-2xl text-maroon text-center mb-6">
              Event Accents
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {EVENT_SWATCHES.map((swatch) => (
                <div key={swatch.name} className="flex flex-col items-center gap-2">
                  <div className={`w-16 h-16 rounded-lg ${swatch.className}`} />
                  <span className="font-body text-sm text-maroon-dark">{swatch.name}</span>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* Section 3 -- Typography showcase */}
      <section className="px-4 py-section-mobile md:py-section">
        <ScrollReveal variant="slideLeft">
          <div className="mx-auto max-w-4xl">
            <h3 className="font-heading text-2xl md:text-3xl text-maroon text-center mb-8">
              Typography
            </h3>
            <div className="space-y-8">
              <div>
                <p className="font-body text-sm text-maroon/60 uppercase tracking-wider mb-2">Hindi -- Yatra One</p>
                <p className="font-hindi text-4xl md:text-6xl text-gold">
                  शुभ विवाह
                </p>
              </div>
              <div>
                <p className="font-body text-sm text-maroon/60 uppercase tracking-wider mb-2">Heading -- Playfair Display</p>
                <p className="font-heading text-3xl md:text-5xl text-maroon">
                  A Celebration of Love
                </p>
              </div>
              <div>
                <p className="font-body text-sm text-maroon/60 uppercase tracking-wider mb-2">Body -- Cormorant Garamond</p>
                <p className="font-body text-lg md:text-xl text-maroon-dark leading-relaxed">
                  We cordially invite you to join us in celebrating the union of two hearts and two families.
                  Your presence would make our special day even more memorable. Together with our families,
                  we request the honor of your company at our wedding celebration.
                </p>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* Section 4 -- Animation variants showcase */}
      <section className="px-4 py-section-mobile md:py-section">
        <div className="mx-auto max-w-4xl">
          <h3 className="font-heading text-2xl md:text-3xl text-maroon text-center mb-8">
            Animation Variants
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {ANIMATION_VARIANTS.map((variant, i) => (
              <ScrollReveal key={variant} variant={variant} delay={i * 0.1}>
                <div className="bg-cream-dark border border-gold rounded-lg p-6 text-center">
                  <p className="font-heading text-lg text-maroon">{variant}</p>
                  <p className="font-body text-sm text-maroon/60 mt-1">delay: {i * 0.1}s</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Section 5 -- Responsive test */}
      <section className="px-4 md:px-8 lg:px-16 py-section-mobile md:py-section">
        <ScrollReveal variant="fadeIn">
          <div className="mx-auto max-w-4xl bg-cream-dark border border-gold/30 rounded-lg p-6 md:p-10">
            <h3 className="font-heading text-xl md:text-2xl text-maroon mb-4">
              Responsive Layout
            </h3>
            <p className="font-body text-maroon-dark leading-relaxed">
              This section tests responsive layout. View at different screen widths.
              On mobile (375px), content fills the screen with compact padding.
              On tablet (768px), spacing increases for comfortable reading.
              On desktop (1024px+), generous padding creates an elegant, centered layout.
            </p>
          </div>
        </ScrollReveal>
      </section>
    </main>
  )
}
