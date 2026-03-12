'use client'

import { useEffect, useRef } from 'react'
import { motion } from 'motion/react'
import confetti from 'canvas-confetti'
import { RSVP_DAYS, EVENTS, EVENT_COLORS } from '@/lib/constants'

interface RsvpConfirmationProps {
  selectedDays: number[]
  guestName: string
}

/** Lookup event details by name */
function getEventDetails(eventName: string) {
  return EVENTS.find((e) => e.name === eventName)
}

export function RsvpConfirmation({
  selectedDays,
  guestName,
}: RsvpConfirmationProps) {
  const confettiFired = useRef(false)

  useEffect(() => {
    if (confettiFired.current) return
    confettiFired.current = true

    // Single celebratory burst
    confetti({
      particleCount: 100,
      spread: 120,
      origin: { y: 0.5 },
      colors: ['#FB8B24', '#FCA84E', '#E36414', '#5F0F40', '#9A031E'],
      disableForReducedMotion: true,
    })
  }, [])

  const selectedDayData = RSVP_DAYS.filter((_, index) =>
    selectedDays.includes(index + 1)
  )

  const shareText = encodeURIComponent(
    'योगी & सुधा की शादी में आपका स्वागत है!\n\nRSVP: ' +
      (typeof window !== 'undefined' ? window.location.origin : '')
  )

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-16 bg-cream relative overflow-hidden">
      {/* ─── Thank You Header ─── */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 100, damping: 15 }}
        className="text-center mb-12"
      >
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 80 }}
          className="font-heading text-6xl md:text-8xl leading-tight text-maroon"
        >
          Thank You, {guestName}!
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="font-hindi text-2xl md:text-3xl text-maroon/70 mt-3"
        >
          धन्यवाद!
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="font-body text-maroon/70 mt-2"
        >
          Your RSVP has been recorded
          <span className="mx-2 text-gold/60">•</span>
          <span className="font-hindi">आपकी उपस्थिति दर्ज हो गई</span>
        </motion.p>
      </motion.div>

      {/* ─── Event Summary Cards ─── */}
      <div className="w-full max-w-lg space-y-5 mb-12">
        {selectedDayData.map((day, index) => {
          const accentColor = EVENT_COLORS[day.colorKey]

          return (
            <motion.div
              key={day.label}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{
                delay: 0.5 + index * 0.2,
                type: 'spring',
                stiffness: 100,
                damping: 14,
              }}
              className="relative bg-white/95 rounded-xl overflow-hidden shadow-sm"
              style={{
                boxShadow: `0 2px 12px rgba(0,0,0,0.08), 0 0 0 1px ${accentColor}30`,
              }}
            >
              {/* Accent bar */}
              <div
                className="h-1 w-full"
                style={{ backgroundColor: accentColor }}
              />

              <div className="p-5 md:p-6">
                {/* Day label */}
                <div className="flex items-center justify-between mb-3">
                  <span
                    className="font-body text-xs tracking-[0.2em] uppercase px-3 py-1 rounded-full border"
                    style={{
                      color: accentColor,
                      borderColor: `${accentColor}50`,
                      backgroundColor: `${accentColor}15`,
                    }}
                  >
                    {day.label} — {day.date}
                  </span>
                </div>

                {/* Events for this day */}
                <div className="space-y-3">
                  {day.events.map((eventName) => {
                    const event = getEventDetails(eventName)
                    if (!event) return null

                    return (
                      <div
                        key={eventName}
                        className="pl-4 border-l-2"
                        style={{ borderLeftColor: `${accentColor}60` }}
                      >
                        <p className="font-heading text-maroon font-semibold">
                          {event.name}
                          <span className="font-hindi text-maroon/65 ml-2 font-normal">
                            {event.nameHindi}
                          </span>
                        </p>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1">
                          <span className="font-body text-maroon/75 text-sm">
                            {event.time}
                          </span>
                          <span className="text-gold/60 text-xs">•</span>
                          <span className="font-body text-maroon/75 text-sm">
                            {event.venue}
                          </span>
                        </div>
                        <p className="font-body text-maroon/65 text-xs mt-1">
                          Dress: {event.dressCode}
                        </p>
                      </div>
                    )
                  })}
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* ─── Action Buttons ─── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0 }}
        className="w-full max-w-lg space-y-3"
      >
        {/* WhatsApp share */}
        <a
          href={`https://api.whatsapp.com/send?text=${shareText}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-3 w-full h-14 bg-[#25D366] text-white font-heading text-lg rounded-xl hover:bg-[#22c55e] active:scale-[0.98] transition-all shadow-sm"
        >
          <svg
            width="22"
            height="22"
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
          className="w-full h-12 border border-gold/30 text-maroon font-heading rounded-xl hover:bg-gold/5 hover:border-gold/50 transition-all"
        >
          ↑ Back to Invitation
        </button>
      </motion.div>
    </div>
  )
}
