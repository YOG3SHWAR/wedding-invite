'use client'

import { useState } from 'react'
import { motion } from 'motion/react'
import { RSVP_DAYS, EVENT_COLORS } from '@/lib/constants'
import { validatePhone, submitRsvp } from '@/lib/rsvp'
import { ScrollReveal } from '@/components/ui/scroll-reveal'
import { RsvpConfirmation } from '@/components/sections/rsvp-confirmation'

type FormStatus = 'idle' | 'submitting' | 'success' | 'error'

export function RsvpSection() {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [guestCount, setGuestCount] = useState(1)
  const [selectedDays, setSelectedDays] = useState<Set<number>>(new Set())
  const [status, setStatus] = useState<FormStatus>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const allSelected = selectedDays.size === RSVP_DAYS.length

  const toggleDay = (dayIndex: number) => {
    setSelectedDays((prev) => {
      const next = new Set(prev)
      if (next.has(dayIndex)) {
        next.delete(dayIndex)
      } else {
        next.add(dayIndex)
      }
      return next
    })
  }

  const toggleAll = () => {
    if (allSelected) {
      setSelectedDays(new Set())
    } else {
      setSelectedDays(new Set(RSVP_DAYS.map((_, i) => i + 1)))
    }
  }

  const isDisabled =
    !name.trim() ||
    !phone.trim() ||
    selectedDays.size === 0 ||
    status === 'submitting'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage('')

    const { valid, error } = validatePhone(phone)
    if (!valid) {
      setErrorMessage(error ?? 'Invalid phone number')
      return
    }

    setStatus('submitting')

    try {
      await submitRsvp({
        name: name.trim(),
        phone,
        guestCount,
        days: Array.from(selectedDays).sort(),
      })
      setStatus('success')
    } catch {
      setStatus('error')
      setErrorMessage('कुछ गलत हो गया / Something went wrong')
    }
  }

  if (status === 'success') {
    return (
      <RsvpConfirmation
        selectedDays={Array.from(selectedDays).sort()}
        guestName={name.trim()}
      />
    )
  }

  return (
    <section
      id="rsvp"
      className="py-section-mobile md:py-section px-4"
    >
      <div className="max-w-2xl mx-auto">
        {/* Section heading */}
        <ScrollReveal>
          <div className="text-center mb-10">
            <h2 className="font-heading text-4xl md:text-5xl text-gold mb-2">
              RSVP
            </h2>
            <p className="font-hindi text-xl md:text-2xl text-maroon/70">
              कृपया अपनी उपस्थिति दर्ज करें
            </p>
          </div>
        </ScrollReveal>

        <form onSubmit={handleSubmit}>
          {/* Select All button */}
          <ScrollReveal delay={0.1}>
            <button
              type="button"
              onClick={toggleAll}
              className={`w-full mb-6 py-3 px-6 rounded-lg border-2 font-heading text-lg transition-all duration-300 ${
                allSelected
                  ? 'bg-gold/15 border-gold text-gold'
                  : 'border-gold/40 text-gold hover:border-gold hover:bg-gold/5'
              }`}
            >
              <span className="font-hindi">सभी दिन</span> / All Days
              {allSelected && (
                <span className="ml-2" aria-hidden="true">
                  ✓
                </span>
              )}
            </button>
          </ScrollReveal>

          {/* Day cards */}
          <ScrollReveal delay={0.2}>
            <div className="grid gap-4 mb-8">
              {RSVP_DAYS.map((day, index) => {
                const dayNumber = index + 1
                const isSelected = selectedDays.has(dayNumber)
                const accentColor =
                  EVENT_COLORS[day.colorKey]

                return (
                  <motion.button
                    key={day.label}
                    type="button"
                    whileTap={{ scale: 0.97 }}
                    onClick={() => toggleDay(dayNumber)}
                    className={`relative w-full min-h-[120px] rounded-xl p-5 text-left transition-all duration-300 ${
                      isSelected
                        ? 'border-3 shadow-lg'
                        : 'border-2'
                    }`}
                    style={{
                      borderColor: accentColor,
                      backgroundColor: isSelected
                        ? `${accentColor}15`
                        : 'rgba(255, 255, 255, 0.8)',
                      borderWidth: isSelected ? '3px' : '2px',
                    }}
                    aria-pressed={isSelected}
                    aria-label={`${day.label} - ${day.date} - ${day.events.join(' + ')}`}
                  >
                    {/* Checkmark */}
                    {isSelected && (
                      <span
                        className="absolute top-3 right-3 text-xl"
                        style={{ color: accentColor }}
                        aria-hidden="true"
                      >
                        ✓
                      </span>
                    )}

                    <p
                      className="font-hindi text-2xl md:text-3xl mb-1"
                      style={{ color: accentColor }}
                    >
                      {day.labelHindi}
                    </p>
                    <p className="font-body text-maroon font-semibold">
                      {day.label} &mdash; {day.date}
                    </p>
                    <p
                      className="font-body text-sm mt-1"
                      style={{ color: accentColor }}
                    >
                      {day.events.join(' + ')}
                    </p>
                  </motion.button>
                )
              })}
            </div>
          </ScrollReveal>

          {/* Form fields */}
          <ScrollReveal delay={0.3}>
            <div className="space-y-4 mb-8">
              {/* Name */}
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="आपका नाम / Your Name"
                className="w-full h-14 px-4 rounded-lg border border-gold/30 focus:border-gold focus:ring-2 focus:ring-gold/20 font-body text-maroon bg-white/80 outline-none transition-all placeholder:text-maroon/40"
                aria-label="Your Name"
              />

              {/* Phone */}
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="फ़ोन नंबर / Phone Number"
                className="w-full h-14 px-4 rounded-lg border border-gold/30 focus:border-gold focus:ring-2 focus:ring-gold/20 font-body text-maroon bg-white/80 outline-none transition-all placeholder:text-maroon/40"
                aria-label="Phone Number"
              />

              {/* Guest Count with stepper */}
              <div className="flex items-center gap-3">
                <label className="font-body text-maroon/70 text-sm whitespace-nowrap">
                  <span className="font-hindi">मेहमान</span> / Guests
                </label>
                <div className="flex items-center border border-gold/30 rounded-lg overflow-hidden">
                  <button
                    type="button"
                    onClick={() =>
                      setGuestCount((c) => Math.max(1, c - 1))
                    }
                    className="w-12 h-14 flex items-center justify-center text-xl font-heading text-gold hover:bg-gold/10 transition-colors"
                    aria-label="Decrease guest count"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={guestCount}
                    onChange={(e) => {
                      const val = parseInt(e.target.value, 10)
                      if (!isNaN(val) && val >= 1 && val <= 20) {
                        setGuestCount(val)
                      }
                    }}
                    min={1}
                    max={20}
                    className="w-16 h-14 text-center font-body text-maroon bg-white/80 outline-none border-x border-gold/30 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    aria-label="Guest count"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setGuestCount((c) => Math.min(20, c + 1))
                    }
                    className="w-12 h-14 flex items-center justify-center text-xl font-heading text-gold hover:bg-gold/10 transition-colors"
                    aria-label="Increase guest count"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Submit button */}
          <ScrollReveal delay={0.4}>
            <button
              type="submit"
              disabled={isDisabled}
              className="w-full h-14 bg-maroon text-white font-heading text-lg rounded-lg transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-maroon/90 active:scale-[0.98]"
            >
              {status === 'submitting' ? (
                <span className="inline-flex items-center gap-3">
                  {/* Decorative mandala spinner */}
                  <motion.svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    animate={{ rotate: 360 }}
                    transition={{
                      repeat: Infinity,
                      duration: 1.5,
                      ease: 'linear',
                    }}
                    className="text-gold"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="2"
                      fill="none"
                      strokeDasharray="20 10"
                    />
                    <circle
                      cx="12"
                      cy="12"
                      r="6"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      fill="none"
                      strokeDasharray="8 6"
                    />
                    <circle cx="12" cy="12" r="2" fill="currentColor" />
                  </motion.svg>
                  <span className="text-white/90">Sending...</span>
                </span>
              ) : (
                <>
                  <span className="font-hindi">RSVP भेजें</span> / Send RSVP
                </>
              )}
            </button>
          </ScrollReveal>

          {/* Error display */}
          {(errorMessage || status === 'error') && (
            <ScrollReveal>
              <div className="mt-4 text-center">
                <p className="text-red-600 font-body mb-3">
                  {errorMessage}
                </p>
                {status === 'error' && (
                  <button
                    type="button"
                    onClick={() => {
                      setStatus('idle')
                      setErrorMessage('')
                    }}
                    className="px-6 py-2 rounded-lg border-2 border-maroon text-maroon font-heading hover:bg-maroon/5 transition-colors"
                  >
                    <span className="font-hindi">पुनः प्रयास करें</span> / Try
                    Again
                  </button>
                )}
              </div>
            </ScrollReveal>
          )}
        </form>
      </div>
    </section>
  )
}
