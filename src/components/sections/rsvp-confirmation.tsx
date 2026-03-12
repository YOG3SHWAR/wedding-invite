'use client'

import { useEffect, useRef } from 'react'
import { motion } from 'motion/react'
import confetti from 'canvas-confetti'
import { RSVP_DAYS, EVENTS, EVENT_COLORS } from '@/lib/constants'

interface RsvpConfirmationProps {
  selectedDays: number[]
  guestName: string
}

export function RsvpConfirmation({
  selectedDays,
  guestName,
}: RsvpConfirmationProps) {
  const confettiFired = useRef(false)

  useEffect(() => {
    if (confettiFired.current) return
    confettiFired.current = true

    // First burst -- immediate gold celebration
    confetti({
      particleCount: 150,
      spread: 100,
      origin: { y: 0.6 },
      colors: ['#D4AF37', '#FFD700', '#B8860B', '#800020'],
      disableForReducedMotion: true,
    })

    // Second burst -- delayed for dramatic Bollywood effect
    const timeout = setTimeout(() => {
      confetti({
        particleCount: 100,
        spread: 120,
        origin: { y: 0.5, x: 0.6 },
        colors: ['#D4AF37', '#FFD700', '#B8860B', '#800020'],
        disableForReducedMotion: true,
      })
    }, 700)

    return () => clearTimeout(timeout)
  }, [])

  // Get matching RSVP_DAYS entries for selected days
  const selectedDayData = RSVP_DAYS.filter((_, index) =>
    selectedDays.includes(index + 1)
  )

  // Look up event details from EVENTS constant
  const getEventDetails = (eventName: string) =>
    EVENTS.find((e) => e.name === eventName)

  const shareText = encodeURIComponent(
    'योगी & सुधा की शादी में आपका स्वागत है!\n\nRSVP: ' +
      (typeof window !== 'undefined' ? window.location.origin : '')
  )

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 bg-cream">
      {/* Thank you header */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-10"
      >
        <h2 className="font-hindi text-5xl md:text-7xl text-gold mb-3">
          धन्यवाद!
        </h2>
        <p className="font-heading text-2xl md:text-3xl text-maroon mb-2">
          Thank You, {guestName}!
        </p>
        <p className="font-body text-maroon/70 text-sm md:text-base">
          <span className="font-hindi">
            आपकी उपस्थिति दर्ज हो गई
          </span>{' '}
          / Your RSVP has been recorded
        </p>
      </motion.div>

      {/* Summary cards */}
      <div className="w-full max-w-lg space-y-4 mb-10">
        {selectedDayData.map((day, index) => {
          const accentColor = EVENT_COLORS[day.colorKey]

          return (
            <motion.div
              key={day.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.2 }}
              className="bg-white/90 rounded-xl p-5 shadow-sm"
              style={{ borderLeft: `4px solid ${accentColor}` }}
            >
              <div className="mb-3">
                <p
                  className="font-hindi text-xl"
                  style={{ color: accentColor }}
                >
                  {day.labelHindi}
                </p>
                <p className="font-body text-maroon font-semibold text-sm">
                  {day.label} &mdash; {day.date}
                </p>
              </div>

              {/* Event details */}
              <div className="space-y-3">
                {day.events.map((eventName) => {
                  const event = getEventDetails(eventName)
                  if (!event) return null

                  return (
                    <div
                      key={eventName}
                      className="pl-3 border-l-2 border-gold/20"
                    >
                      <p className="font-heading text-maroon text-sm font-semibold">
                        {event.name}{' '}
                        <span className="font-hindi text-maroon/60">
                          ({event.nameHindi})
                        </span>
                      </p>
                      <p className="font-body text-maroon/60 text-xs">
                        {event.time} &bull; {event.venue}
                      </p>
                      <p className="font-body text-maroon/50 text-xs">
                        Dress: {event.dressCode}
                      </p>
                    </div>
                  )
                })}
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Action buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="w-full max-w-lg space-y-3"
      >
        {/* WhatsApp share */}
        <a
          href={`https://api.whatsapp.com/send?text=${shareText}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full h-14 bg-[#25D366] text-white font-heading text-lg rounded-lg hover:bg-[#22c55e] transition-colors"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          Share with Family
        </a>

        {/* Back to top */}
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="w-full h-12 border-2 border-maroon text-maroon font-heading rounded-lg hover:bg-maroon/5 transition-colors"
        >
          Back to Top
        </button>
      </motion.div>
    </div>
  )
}
