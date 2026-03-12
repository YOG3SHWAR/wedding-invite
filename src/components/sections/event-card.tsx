import { EVENT_COLORS } from '@/lib/constants'

type EventColorKey = keyof typeof EVENT_COLORS

interface EventCardProps {
  event: {
    name: string
    nameHindi: string
    date: string
    time: string
    venue: string
    mapUrl: string
    dressCode: string
    description: string
    colorKey: EventColorKey
  }
  position: 'left' | 'right'
}

export function EventCard({ event, position }: EventCardProps) {
  const accentColor = EVENT_COLORS[event.colorKey]

  return (
    <div
      className={`
        w-full md:w-[45%]
        ${position === 'left' ? 'md:mr-auto md:pr-8' : 'md:ml-auto md:pl-8'}
      `}
    >
      <div
        className="bg-cream-dark rounded-lg shadow-md border-l-4 p-5 md:p-6"
        style={{ borderLeftColor: accentColor }}
      >
        {/* Event name: English (primary) + Hindi (accent) */}
        <h3 className="font-heading text-2xl text-gold-accessible leading-tight">
          {event.name}
        </h3>
        <p className="font-hindi text-xl text-maroon-dark/60 mt-0.5">
          {event.nameHindi}
        </p>

        {/* Date and time */}
        <div className="flex items-center gap-2 mt-3 text-maroon-dark/90">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="flex-shrink-0 text-gold"
            aria-hidden="true"
          >
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          <span className="font-body text-sm">
            {event.date} &bull; {event.time}
          </span>
        </div>

        {/* Venue with map link */}
        <div className="flex items-start gap-2 mt-2 text-maroon-dark/90">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="flex-shrink-0 text-gold mt-0.5"
            aria-hidden="true"
          >
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          <a
            href={event.mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-body text-sm text-gold-accessible underline underline-offset-2 hover:text-gold-dark transition-colors"
          >
            {event.venue}
          </a>
        </div>

        {/* Dress code */}
        <div className="flex items-center gap-2 mt-2 text-maroon-dark/90">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="flex-shrink-0 text-gold"
            aria-hidden="true"
          >
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <path d="M16 10a4 4 0 0 1-8 0" />
          </svg>
          <span className="font-body text-sm">{event.dressCode}</span>
        </div>

        {/* Description */}
        <p className="font-body text-sm text-maroon-dark/80 mt-3 leading-relaxed">
          {event.description}
        </p>
      </div>
    </div>
  )
}
