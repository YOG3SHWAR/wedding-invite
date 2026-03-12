'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { RSVP_DAYS, EVENTS, EVENT_COLORS } from '@/lib/constants'
import { validatePhone } from '@/lib/rsvp'
import { preloadFirebase } from '@/lib/firebase-lazy'
import { ScrollReveal } from '@/components/ui/scroll-reveal'
import { RsvpConfirmation } from '@/components/sections/rsvp-confirmation'
import Link from 'next/link'

type FormStatus = 'idle' | 'submitting' | 'success' | 'error'

/** Lookup Hindi name for an event */
function getEventHindi(eventName: string): string {
  const event = EVENTS.find((e) => e.name === eventName)
  return event?.nameHindi ?? eventName
}

/** Ornate corner flourish SVG for cards and frames */
function CornerFlourish({ className }: { className?: string }) {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M2 30 C2 16, 4 8, 12 4 C8 8, 6 14, 6 22"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
        opacity="0.7"
      />
      <path
        d="M2 30 C10 28, 18 24, 22 16 C18 20, 12 24, 4 26"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
        opacity="0.5"
      />
      <circle cx="2" cy="30" r="2" fill="currentColor" opacity="0.8" />
      <circle cx="12" cy="4" r="1.5" fill="currentColor" opacity="0.5" />
      <circle cx="22" cy="16" r="1.5" fill="currentColor" opacity="0.5" />
    </svg>
  )
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
    >
      {/* Subtle background pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, #D4AF37 1px, transparent 1px),
                           radial-gradient(circle at 75% 75%, #D4AF37 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
        aria-hidden="true"
      />

      <div className="max-w-2xl mx-auto relative">
        {/* ─── Section Header with ornate framing ─── */}
        <ScrollReveal>
          <div className="text-center mb-12 md:mb-16 relative">
            {/* Corner flourishes */}
            <div className="absolute -top-4 -left-2 md:-left-8 text-gold">
              <CornerFlourish />
            </div>
            <div className="absolute -top-4 -right-2 md:-right-8 text-gold scale-x-[-1]">
              <CornerFlourish />
            </div>

            {/* Top decorative line */}
            <div className="mx-auto mb-6 w-32 md:w-48 h-px bg-gradient-to-r from-transparent via-gold to-transparent" />

            <p className="font-body text-maroon/50 text-sm tracking-[0.3em] uppercase mb-3">
              You are cordially invited
            </p>

            <h2
              className="font-heading text-5xl md:text-7xl leading-tight tracking-wide"
              style={{
                background: 'linear-gradient(135deg, #D4AF37 0%, #B8941F 40%, #E8CC6E 60%, #D4AF37 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                filter: 'drop-shadow(0 2px 4px rgba(212,175,55,0.3))',
              }}
            >
              RSVP
            </h2>

            <p
              className="font-hindi text-xl md:text-2xl text-maroon/60 mt-2"
              style={{
                background: 'linear-gradient(135deg, #D4AF37 0%, #B8941F 40%, #E8CC6E 60%, #D4AF37 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              आमंत्रण
            </p>

            {/* Bottom decorative line */}
            <div className="mx-auto mt-6 w-24 md:w-36 h-px bg-gradient-to-r from-transparent via-gold to-transparent" />

            <p className="font-body text-sm md:text-base text-maroon/60 mt-4">
              Please confirm your attendance
            </p>
            <p className="font-hindi text-sm text-maroon/45 mt-1">
              कृपया अपनी उपस्थिति दर्ज करें
            </p>
          </div>
        </ScrollReveal>

        <form onSubmit={handleSubmit}>
          {/* ─── Select All toggle ─── */}
          <ScrollReveal delay={0.1}>
            <motion.button
              type="button"
              onClick={toggleAll}
              whileTap={{ scale: 0.97 }}
              className="w-full mb-8 relative overflow-hidden group"
            >
              <div
                className={`py-4 px-6 rounded-lg border-2 transition-all duration-500 ${
                  allSelected
                    ? 'border-gold bg-gold/10 shadow-[0_0_20px_rgba(212,175,55,0.15)]'
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
                        borderColor: isSelected ? accentColor : 'rgba(212,175,55,0.25)',
                        boxShadow: isSelected
                          ? `0 4px 24px ${accentColor}20, 0 0 0 1px ${accentColor}30`
                          : '0 2px 8px rgba(0,0,0,0.04)',
                      }}
                      transition={{ duration: 0.4 }}
                      className="relative overflow-hidden rounded-xl border-2 bg-white/90"
                    >
                      {/* Decorative accent bar at top */}
                      <motion.div
                        animate={{
                          height: isSelected ? '4px' : '2px',
                          opacity: isSelected ? 1 : 0.4,
                        }}
                        className="w-full"
                        style={{ backgroundColor: accentColor }}
                      />

                      {/* Subtle paisley background when selected */}
                      <AnimatePresence>
                        {isSelected && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.04 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0"
                            style={{
                              backgroundImage: `radial-gradient(circle at 80% 80%, ${accentColor} 1px, transparent 1px)`,
                              backgroundSize: '20px 20px',
                            }}
                          />
                        )}
                      </AnimatePresence>

                      <div className="relative p-5 md:p-6">
                        {/* Corner flourishes on selected cards */}
                        <AnimatePresence>
                          {isSelected && (
                            <>
                              <motion.div
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.5 }}
                                className="absolute top-1 left-1"
                                style={{ color: accentColor }}
                              >
                                <CornerFlourish className="w-5 h-5 md:w-6 md:h-6" />
                              </motion.div>
                              <motion.div
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.5 }}
                                className="absolute top-1 right-1 scale-x-[-1]"
                                style={{ color: accentColor }}
                              >
                                <CornerFlourish className="w-5 h-5 md:w-6 md:h-6" />
                              </motion.div>
                            </>
                          )}
                        </AnimatePresence>

                        {/* Selection indicator */}
                        <div className="absolute top-4 right-4 md:top-5 md:right-5">
                          <motion.div
                            animate={{
                              scale: isSelected ? 1 : 0.8,
                              borderColor: isSelected ? accentColor : 'rgba(212,175,55,0.3)',
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
                              backgroundColor: `${accentColor}08`,
                            }}
                          >
                            {day.label}
                          </span>
                          <span className="font-body text-sm text-maroon/50">
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
                          style={{ color: accentColor, opacity: 0.7 }}
                        >
                          {eventHindiNames}
                        </p>

                        {/* Decorative divider inside card */}
                        <div
                          className="mt-3 w-16 h-px"
                          style={{
                            background: `linear-gradient(to right, ${accentColor}60, transparent)`,
                          }}
                        />
                      </div>
                    </motion.div>
                  </motion.button>
                </ScrollReveal>
              )
            })}
          </div>

          {/* ─── Form Fields ─── */}
          <ScrollReveal delay={0.4}>
            <div className="space-y-6 mb-10">
              {/* Name field */}
              <div className="relative">
                <label className="block mb-2">
                  <span className="font-body text-sm text-gold-accessible">Your Name</span>
                  <span className="font-hindi text-xs text-maroon/40 ml-2">/ आपका नाम</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full h-14 px-5 rounded-lg bg-white/80 font-body text-maroon text-lg border border-gold/20 outline-none transition-all duration-300 focus:border-gold focus:shadow-[0_0_0_3px_rgba(212,175,55,0.1)] placeholder:text-maroon/30 placeholder:font-body"
                  aria-label="Your Name"
                />
                <div className="absolute bottom-0 left-5 right-5 h-px bg-gradient-to-r from-gold/20 via-gold/40 to-gold/20" />
              </div>

              {/* Phone field */}
              <div className="relative">
                <label className="block mb-2">
                  <span className="font-body text-sm text-gold-accessible">Phone Number</span>
                  <span className="font-hindi text-xs text-maroon/40 ml-2">/ फ़ोन नंबर</span>
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="10-digit mobile number"
                  className="w-full h-14 px-5 rounded-lg bg-white/80 font-body text-maroon text-lg border border-gold/20 outline-none transition-all duration-300 focus:border-gold focus:shadow-[0_0_0_3px_rgba(212,175,55,0.1)] placeholder:text-maroon/30 placeholder:font-body"
                  aria-label="Phone Number"
                />
                <div className="absolute bottom-0 left-5 right-5 h-px bg-gradient-to-r from-gold/20 via-gold/40 to-gold/20" />
              </div>

              {/* Guest Count */}
              <div>
                <label className="block mb-2">
                  <span className="font-body text-sm text-gold-accessible">Number of Guests</span>
                  <span className="font-hindi text-xs text-maroon/40 ml-2">/ मेहमानों की संख्या</span>
                </label>
                <div className="flex items-center border border-gold/20 rounded-lg overflow-hidden bg-white/80 w-fit">
                  <button
                    type="button"
                    onClick={() => setGuestCount((c) => Math.max(1, c - 1))}
                    className="w-14 h-14 flex items-center justify-center text-2xl font-heading text-gold hover:bg-gold/10 active:bg-gold/15 transition-colors"
                    aria-label="Decrease guest count"
                  >
                    −
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
                    className="w-16 h-14 text-center font-heading text-xl text-maroon bg-transparent outline-none border-x border-gold/20 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    aria-label="Guest count"
                  />
                  <button
                    type="button"
                    onClick={() => setGuestCount((c) => Math.min(20, c + 1))}
                    className="w-14 h-14 flex items-center justify-center text-2xl font-heading text-gold hover:bg-gold/10 active:bg-gold/15 transition-colors"
                    aria-label="Increase guest count"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* ─── Submit Button ─── */}
          <ScrollReveal delay={0.5}>
            <motion.button
              type="submit"
              disabled={isDisabled}
              whileTap={!isDisabled ? { scale: 0.97 } : undefined}
              className="w-full h-16 relative rounded-xl overflow-hidden font-heading text-xl tracking-wider text-white transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed group"
              style={{
                background: isDisabled
                  ? '#999'
                  : 'linear-gradient(135deg, #800020 0%, #A0334D 50%, #800020 100%)',
                boxShadow: isDisabled
                  ? 'none'
                  : '0 4px 16px rgba(128,0,32,0.3), inset 0 1px 0 rgba(255,255,255,0.1)',
              }}
            >
              {/* Gold shimmer on hover */}
              {!isDisabled && (
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background: 'linear-gradient(135deg, rgba(212,175,55,0.15) 0%, transparent 50%, rgba(212,175,55,0.1) 100%)',
                  }}
                />
              )}

              {/* Top gold accent line */}
              <div className="absolute top-0 left-[10%] right-[10%] h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />

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

        {/* ─── Gift Registry Link ─── */}
        <ScrollReveal delay={0.6}>
          <div className="mt-16 text-center">
            <div className="mx-auto mb-4 w-20 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
            <p className="font-body text-base text-maroon/50 mb-1">
              Your presence is our greatest gift
            </p>
            <p className="font-hindi text-sm text-maroon/40 mb-4">
              आपका साथ ही हमारा सबसे बड़ा उपहार है
            </p>
            <Link
              href="/gifts"
              className="inline-flex items-center gap-2 px-8 py-3 rounded-lg border border-gold/30 text-gold-accessible font-heading tracking-wide hover:bg-gold/5 hover:border-gold/50 transition-all duration-300 group"
            >
              <span>View Gift Wishes</span>
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                className="group-hover:translate-x-1 transition-transform"
                aria-hidden="true"
              >
                <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
