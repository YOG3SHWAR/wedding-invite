import { EVENTS } from '@/lib/constants'
import { EventCard } from './event-card'
import { ScrollReveal } from '@/components/ui/scroll-reveal'

export function EventTimeline() {
  return (
    <section className="py-section-mobile md:py-section px-4 bg-gradient-to-b from-maroon-dark via-maroon to-maroon-dark">
      <div className="max-w-4xl mx-auto">
        {/* Section heading */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="font-heading text-3xl md:text-4xl text-gold">
            Wedding Events
          </h2>
          <p className="font-hindi text-2xl text-gold-light mt-1">शुभ कार्यक्रम</p>
        </div>

        {/* Timeline container */}
        <div className="relative">
          {/* Gold center line - left-aligned on mobile, centered on desktop */}
          <div
            className="absolute top-0 bottom-0 left-4 md:left-1/2 md:-translate-x-1/2 w-0.5 bg-gold/60"
            aria-hidden="true"
          />

          {/* Event cards */}
          <div className="space-y-10 md:space-y-16">
            {EVENTS.map((event, index) => {
              const position = index % 2 === 0 ? 'left' : 'right'
              const variant = position === 'left' ? 'slideLeft' : 'slideRight'

              return (
                <div key={event.name} className="relative">
                  {/* Gold dot marker on timeline */}
                  <div
                    className="absolute left-4 md:left-1/2 -translate-x-1/2 top-6 w-4 h-4 rounded-full bg-gold border-2 border-maroon-dark z-10"
                    aria-hidden="true"
                  />

                  {/* Card with scroll reveal */}
                  <div className="pl-10 md:pl-0">
                    <ScrollReveal variant={variant} spring>
                      <EventCard event={event} position={position} dark />
                    </ScrollReveal>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
