'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { RSVP_DAYS, EVENTS, EVENT_COLORS } from '@/lib/constants'
import { validatePhone } from '@/lib/rsvp'
import { preloadFirebase } from '@/lib/firebase-lazy'
import { ScrollReveal } from '@/components/ui/scroll-reveal'
import { InteractiveCard } from '@/components/ui/interactive-card'
import { RsvpConfirmation } from '@/components/sections/rsvp-confirmation'

type FormStatus = 'idle' | 'submitting' | 'success' | 'error'

/** Lookup Hindi name for an event */
function getEventHindi(eventName: string): string {
  const event = EVENTS.find((e) => e.name === eventName)
  return event?.nameHindi ?? eventName
}

/** Decorative mandala spinner for loading state */
function MandalaSpinner() {
  return (
    <motion.svg
      width="28"
      height="28"
      viewBox="0 0 28 28"
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
      className="text-gold"
    >
      <circle cx="14" cy="14" r="12" stroke="currentColor" strokeWidth="1.5" fill="none" strokeDasharray="16 8" />
      <circle cx="14" cy="14" r="8" stroke="currentColor" strokeWidth="1" fill="none" strokeDasharray="6 6" opacity="0.7" />
      <circle cx="14" cy="14" r="4" stroke="currentColor" strokeWidth="1" fill="none" strokeDasharray="4 4" opacity="0.5" />
      <circle cx="14" cy="14" r="2" fill="currentColor" opacity="0.8" />
    </motion.svg>
  )
}

export function RsvpSection() {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [guestCount, setGuestCount] = useState(1)
  const [selectedDays, setSelectedDays] = useState<Set<number>>(new Set())
  const [status, setStatus] = useState<FormStatus>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          preloadFirebase()
          observer.disconnect()
        }
      },
      { rootMargin: '200px' }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

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
      const { submitRsvp } = await import('@/lib/rsvp')
      await submitRsvp({
        name: name.trim(),
        phone,
        guestCount,
        days: Array.from(selectedDays).sort(),
      })
      setStatus('success')
    } catch {
      setStatus('error')
      setErrorMessage('Something went wrong / कुछ गलत हो गया')
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
      ref={sectionRef}
      id="rsvp"
      className="py-section-mobile md:py-section px-4 relative overflow-hidden"
      style={{
        backgroundImage:
          'radial-gradient(circle, rgba(251,139,36,0.03) 1px, transparent 1px)',
        backgroundSize: '32px 32px',
      }}
    >
      <div className="max-w-2xl mx-auto relative">
        {/* ─── Section Header ─── */}
        <ScrollReveal>
          <div className="text-center mb-12 md:mb-16">
            <p className="font-body text-maroon/70 text-sm tracking-[0.3em] uppercase mb-3">
              You are cordially invited
            </p>

            <h2
              className="font-heading text-5xl md:text-7xl leading-tight tracking-wide"
              style={{
                background: 'linear-gradient(135deg, #FB8B24 0%, #FCA84E 40%, #FB8B24 60%, #E36414 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              RSVP
            </h2>

            <p className="font-hindi text-xl md:text-2xl text-gold mt-2">
              आमंत्रण
            </p>

            <p className="font-body text-sm md:text-base text-maroon/75 mt-4">
              Please confirm your attendance
            </p>
            <p className="font-hindi text-sm text-maroon/60 mt-1">
              कृपया अपनी उपस्थिति दर्ज करें
            </p>
          </div>
        </ScrollReveal>

        <form onSubmit={handleSubmit}>
          {/* ─── Select All toggle ─── */}
          <ScrollReveal delay={0.1}>
            <InteractiveCard
              className="w-full mb-8 rounded-lg"
              tiltIntensity={6}
              liftAmount={5}
            >
              <motion.button
                type="button"
                onClick={toggleAll}
                whileTap={{ scale: 0.97 }}
                className="w-full relative overflow-hidden group"
              >
                <div
                  className={`py-4 px-6 rounded-lg border-2 transition-all duration-500 ${
                    allSelected
                      ? 'border-gold bg-gold/10 shadow-[0_0_20px_rgba(251,139,36,0.15)]'
                      : 'border-gold/30 hover:border-gold/60 hover:bg-gold/5'
                  }`}
                >
                  <span className="font-heading text-xl text-gold-accessible">All Days</span>
                  <span className="font-hindi text-gold-accessible/70 ml-2">/ सभी दिन</span>
                  <AnimatePresence>
                    {allSelected && (
                      <motion.span
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        className="inline-block ml-3 text-gold"
                      >
                        ✓
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
              </motion.button>
            </InteractiveCard>
          </ScrollReveal>

          {/* ─── Day Cards ─── */}
          <div className="space-y-5 mb-10">
            {RSVP_DAYS.map((day, index) => {
              const dayNumber = index + 1
              const isSelected = selectedDays.has(dayNumber)
              const accentColor = EVENT_COLORS[day.colorKey]
              const eventNames = day.events.map((e) => e).join(' & ')
              const eventHindiNames = day.events.map(getEventHindi).join(' & ')

              return (
                <ScrollReveal key={day.label} delay={0.15 + index * 0.1}>
                  <InteractiveCard
                    className="rounded-xl"
                    glowColor={`${accentColor}20`}
                    tiltIntensity={8}
                    liftAmount={6}
                  >
                  <motion.button
                    type="button"
                    whileTap={{ scale: 0.98 }}
                    onClick={() => toggleDay(dayNumber)}
                    className="relative w-full text-left group"
                    aria-pressed={isSelected}
                    aria-label={`${eventNames} - ${day.date} - ${day.events.join(' + ')}`}
                  >
                    <motion.div
                      animate={{
                        borderColor: isSelected ? accentColor : 'rgba(251,139,36,0.25)',
                        boxShadow: isSelected
                          ? `0 2px 12px ${accentColor}25`
                          : '0 2px 8px rgba(0,0,0,0.04)',
                      }}
                      transition={{ duration: 0.4 }}
                      className="relative overflow-hidden rounded-xl border-2 bg-white"
                    >
                      {/* Decorative accent bar at top */}
                      <motion.div
                        animate={{
                          height: isSelected ? '4px' : '3px',
                          opacity: isSelected ? 1 : 0.4,
                        }}
                        className="w-full"
                        style={{ backgroundColor: accentColor }}
                      />

                      <div className="relative p-5 md:p-6">
                        {/* Selection indicator */}
                        <div className="absolute top-4 right-4 md:top-5 md:right-5">
                          <motion.div
                            animate={{
                              scale: isSelected ? 1 : 0.8,
                              borderColor: isSelected ? accentColor : 'rgba(251,139,36,0.3)',
                              backgroundColor: isSelected ? accentColor : 'transparent',
                            }}
                            className="w-7 h-7 rounded-full border-2 flex items-center justify-center"
                          >
                            <AnimatePresence>
                              {isSelected && (
                                <motion.span
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  exit={{ scale: 0 }}
                                  className="text-white text-sm font-bold"
                                >
                                  ✓
                                </motion.span>
                              )}
                            </AnimatePresence>
                          </motion.div>
                        </div>

                        {/* Day label + date */}
                        <div className="flex items-center gap-3 mb-3">
                          <span
                            className="font-body text-xs tracking-[0.2em] uppercase px-3 py-1 rounded-full border"
                            style={{
                              color: accentColor,
                              borderColor: `${accentColor}40`,
                              backgroundColor: `${accentColor}15`,
                            }}
                          >
                            {day.label}
                          </span>
                          <span className="font-body text-sm text-maroon/70">
                            {day.date}
                          </span>
                        </div>

                        {/* Event names — English primary, Hindi accent */}
                        <h3
                          className="font-heading text-3xl md:text-4xl leading-tight mb-1 pr-10 tracking-wide"
                          style={{ color: accentColor }}
                        >
                          {eventNames}
                        </h3>
                        <p
                          className="font-hindi text-xl md:text-2xl pr-10"
                          style={{ color: accentColor, opacity: 0.85 }}
                        >
                          {eventHindiNames}
                        </p>
                      </div>
                    </motion.div>
                  </motion.button>
                  </InteractiveCard>
                </ScrollReveal>
              )
            })}
          </div>

          {/* ─── Form Fields ─── */}
          <div className="space-y-6 mb-10">
            {/* Name field */}
            <ScrollReveal delay={0.4}>
              <InteractiveCard
                className="rounded-lg"
                tiltIntensity={4}
                liftAmount={3}
                glowColor="rgba(251,139,36,0.12)"
              >
                <div className="p-1">
                  <label className="block mb-2">
                    <span className="font-body text-sm text-gold-accessible">Your Name</span>
                    <span className="font-hindi text-xs text-maroon/60 ml-2">/ आपका नाम</span>
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full h-14 px-5 rounded-lg bg-white font-body text-maroon text-lg border border-gold/40 outline-none transition-all duration-300 focus:border-gold focus:shadow-[0_0_0_3px_rgba(251,139,36,0.2)] placeholder:text-maroon/50 placeholder:font-body"
                    aria-label="Your Name"
                  />
                </div>
              </InteractiveCard>
            </ScrollReveal>

            {/* Phone field */}
            <ScrollReveal delay={0.5}>
              <InteractiveCard
                className="rounded-lg"
                tiltIntensity={4}
                liftAmount={3}
                glowColor="rgba(251,139,36,0.12)"
              >
                <div className="p-1">
                  <label className="block mb-2">
                    <span className="font-body text-sm text-gold-accessible">Phone Number</span>
                    <span className="font-hindi text-xs text-maroon/60 ml-2">/ फ़ोन नंबर</span>
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="10-digit mobile number"
                    className="w-full h-14 px-5 rounded-lg bg-white font-body text-maroon text-lg border border-gold/40 outline-none transition-all duration-300 focus:border-gold focus:shadow-[0_0_0_3px_rgba(251,139,36,0.2)] placeholder:text-maroon/50 placeholder:font-body"
                    aria-label="Phone Number"
                  />
                </div>
              </InteractiveCard>
            </ScrollReveal>

            {/* Guest Count */}
            <ScrollReveal delay={0.6}>
              <InteractiveCard
                className="rounded-lg"
                tiltIntensity={4}
                liftAmount={3}
                glowColor="rgba(251,139,36,0.12)"
              >
                <div className="p-1">
                  <label className="block mb-2">
                    <span className="font-body text-sm text-gold-accessible">Number of Guests</span>
                    <span className="font-hindi text-xs text-maroon/60 ml-2">/ मेहमानों की संख्या</span>
                  </label>
                  <div className="flex items-center border border-gold/35 rounded-lg overflow-hidden bg-white w-fit">
                    <motion.button
                      type="button"
                      onClick={() => setGuestCount((c) => Math.max(1, c - 1))}
                      whileTap={{ scale: 0.9 }}
                      className="w-14 h-14 flex items-center justify-center text-2xl font-heading text-gold hover:bg-gold/10 active:bg-gold/15 transition-colors"
                      aria-label="Decrease guest count"
                    >
                      −
                    </motion.button>
                    <div className="w-16 h-14 relative border-x border-gold/35 overflow-hidden">
                      <AnimatePresence mode="popLayout">
                        <motion.span
                          key={guestCount}
                          initial={{ scale: 1.4, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0.6, opacity: 0 }}
                          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                          className="absolute inset-0 flex items-center justify-center font-heading text-xl text-maroon"
                        >
                          {guestCount}
                        </motion.span>
                      </AnimatePresence>
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
                        className="w-full h-full text-center font-heading text-xl text-maroon bg-transparent outline-none opacity-0 absolute inset-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        aria-label="Guest count"
                      />
                    </div>
                    <motion.button
                      type="button"
                      onClick={() => setGuestCount((c) => Math.min(20, c + 1))}
                      whileTap={{ scale: 0.9 }}
                      className="w-14 h-14 flex items-center justify-center text-2xl font-heading text-gold hover:bg-gold/10 active:bg-gold/15 transition-colors"
                      aria-label="Increase guest count"
                    >
                      +
                    </motion.button>
                  </div>
                </div>
              </InteractiveCard>
            </ScrollReveal>
          </div>

          {/* ─── Submit Button ─── */}
          <ScrollReveal delay={0.5}>
            <InteractiveCard
              className="rounded-xl"
              tiltIntensity={6}
              liftAmount={5}
              glowColor="rgba(155,45,139,0.15)"
            >
              <motion.button
                type="submit"
                disabled={isDisabled}
                whileTap={!isDisabled ? { scale: 0.97 } : undefined}
                className="w-full h-16 relative rounded-xl overflow-hidden font-heading text-xl tracking-wider text-white transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed group"
                style={{
                  background: isDisabled
                    ? '#999'
                    : 'linear-gradient(135deg, #5F0F40 0%, #7A2358 50%, #5F0F40 100%)',
                  boxShadow: isDisabled
                    ? 'none'
                    : '0 4px 16px rgba(95,15,64,0.3), inset 0 1px 0 rgba(255,255,255,0.1)',
                }}
              >
                <span className="relative z-10">
                  {status === 'submitting' ? (
                    <span className="inline-flex items-center gap-3">
                      <MandalaSpinner />
                      <span className="text-white/80">Sending...</span>
                    </span>
                  ) : (
                    <>
                      <span>Send RSVP</span>
                      <span className="mx-3 text-gold/60">•</span>
                      <span className="font-hindi">RSVP भेजें</span>
                    </>
                  )}
                </span>
              </motion.button>
            </InteractiveCard>
          </ScrollReveal>

          {/* ─── Error Display ─── */}
          <AnimatePresence>
            {(errorMessage || status === 'error') && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-6 text-center"
              >
                <div className="inline-block px-6 py-3 rounded-lg bg-red-50 border border-red-200">
                  <p className="text-red-700 font-body">{errorMessage}</p>
                </div>
                {status === 'error' && (
                  <button
                    type="button"
                    onClick={() => {
                      setStatus('idle')
                      setErrorMessage('')
                    }}
                    className="mt-3 px-6 py-2 rounded-lg border-2 border-maroon text-maroon font-heading hover:bg-maroon/5 transition-colors"
                  >
                    Try Again / <span className="font-hindi">पुनः प्रयास करें</span>
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </form>

        {/* Gift section disabled for now */}
      </div>
    </section>
  )
}
