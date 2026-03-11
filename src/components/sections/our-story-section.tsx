import { STORY_MILESTONES } from '@/lib/constants'
import { PLACEHOLDER_STORY_PHOTOS } from '@/lib/placeholder-data'
import { ScrollReveal } from '@/components/ui/scroll-reveal'
import { StoryMilestone } from './story-milestone'

/**
 * Our Story timeline section.
 * Displays milestones in a vertical timeline with alternating layout.
 * Desktop: alternating left/right cards with a gold center line.
 * Mobile: single-column stacked layout.
 */
export function OurStorySection() {
  return (
    <section className="py-section-mobile md:py-section px-4">
      <div className="max-w-5xl mx-auto">
        {/* Section heading */}
        <div className="text-center mb-12 md:mb-16">
          <ScrollReveal>
            <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl text-maroon">
              Our Story
            </h2>
            <p className="font-hindi text-2xl md:text-3xl text-gold mt-2">
              हमारी कहानी
            </p>
            <div className="mx-auto mt-4 w-20 h-px bg-gradient-to-r from-transparent via-gold to-transparent" aria-hidden="true" />
          </ScrollReveal>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical gold center line (desktop only) */}
          <div
            className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gold/30 -translate-x-1/2"
            aria-hidden="true"
          />

          {/* Milestones */}
          <div className="space-y-10 md:space-y-16">
            {STORY_MILESTONES.map((milestone, index) => {
              const position = index % 2 === 0 ? 'left' : 'right'
              const variant = position === 'left' ? 'slideLeft' : 'slideRight'
              const imageSrc =
                PLACEHOLDER_STORY_PHOTOS[milestone.imageKey] ?? ''

              return (
                <ScrollReveal
                  key={milestone.id}
                  variant={variant}
                  delay={0.1}
                >
                  {/* Mobile: show image inline above card */}
                  <div className="md:hidden flex justify-center mb-4">
                    <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gold/40 shadow-md">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={imageSrc}
                        alt={milestone.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                  </div>

                  {/* Mobile: gold dot connector */}
                  <div className="md:hidden flex justify-center mb-3">
                    <div className="w-3 h-3 rounded-full bg-gold" />
                  </div>

                  <StoryMilestone
                    title={milestone.title}
                    titleHindi={milestone.titleHindi}
                    year={milestone.year}
                    description={milestone.description}
                    imageSrc={imageSrc}
                    position={position}
                  />
                </ScrollReveal>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
