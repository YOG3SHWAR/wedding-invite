import { InteractiveCard } from '@/components/ui/interactive-card'

/**
 * Individual milestone in the Our Story timeline.
 * Renders a circular image placeholder, year badge, title, and description.
 * Alternates left/right on desktop, stacks on mobile.
 */

interface StoryMilestoneProps {
  title: string
  titleHindi: string
  year: string
  description: string
  imageSrc: string
  position: 'left' | 'right'
}

export function StoryMilestone({
  title,
  titleHindi,
  year,
  description,
  imageSrc,
  position,
}: StoryMilestoneProps) {
  const isLeft = position === 'left'

  return (
    <div
      className={`relative flex items-start gap-4 md:gap-8 w-full ${
        isLeft ? 'md:flex-row' : 'md:flex-row-reverse'
      }`}
    >
      {/* Content card */}
      <InteractiveCard
        className={`flex-1 bg-cream border border-gold/35 rounded-lg p-5 md:p-6 shadow-sm ${
          isLeft ? 'md:text-right' : 'md:text-left'
        }`}
      >
        {/* Year badge */}
        <span className="inline-block px-3 py-1 bg-gold/15 border border-gold/50 rounded-full font-body text-sm text-gold-dark font-semibold tracking-wider mb-3">
          {year}
        </span>

        {/* Title */}
        <h3 className="font-heading text-xl md:text-2xl text-maroon leading-snug">
          {title}
        </h3>

        {/* Hindi title */}
        <p className="font-hindi text-lg text-gold mt-1">{titleHindi}</p>

        {/* Description */}
        <p className="font-body text-base text-maroon-dark/90 mt-2 leading-relaxed">
          {description}
        </p>
      </InteractiveCard>

      {/* Timeline connector dot (visible on md+) */}
      <div className="hidden md:flex flex-col items-center flex-shrink-0 w-5">
        <div className="w-5 h-5 rounded-full bg-gold border-4 border-cream shadow-md" />
      </div>

      {/* Circular image placeholder */}
      <div className="hidden md:block flex-1">
        <div
          className={`w-28 h-28 lg:w-32 lg:h-32 rounded-full overflow-hidden border-3 border-gold/60 shadow-lg ${
            isLeft ? '' : 'md:ml-auto'
          }`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageSrc}
            alt={title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
      </div>
    </div>
  )
}
