'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { RSVP_DAYS, EVENT_COLORS } from '@/lib/constants'
import type { RsvpData } from '@/lib/rsvp'
import { getDb } from '@/lib/firebase-lazy'
import { ScrollReveal } from '@/components/ui/scroll-reveal'
import { InteractiveCard } from '@/components/ui/interactive-card'
import { StaggerReveal, StaggerItem } from '@/components/ui/stagger-reveal'
import { motion } from 'motion/react'
import Link from 'next/link'

/* ── Types ── */
type GuestEntry = Omit<RsvpData, 'phone'>

type FetchState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'success'; guests: GuestEntry[] }

/* ── Animated counter hook ── */
function useAnimatedCount(target: number, duration = 1200) {
  const [value, setValue] = useState(0)
  const rafRef = useRef<number>(0)
  const startRef = useRef<number | null>(null)
  const triggered = useRef(false)

  const start = useCallback(() => {
    if (triggered.current) return
    triggered.current = true
    startRef.current = null

    const animate = (timestamp: number) => {
      if (!startRef.current) startRef.current = timestamp
      const elapsed = timestamp - startRef.current
      const progress = Math.min(elapsed / duration, 1)
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      setValue(Math.round(eased * target))
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate)
      }
    }
    rafRef.current = requestAnimationFrame(animate)
  }, [target, duration])

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  // Reset if target changes
  useEffect(() => {
    triggered.current = false
    setValue(0)
  }, [target])

  return { value, start }
}

/* ── Stat card with animated number ── */
function StatCard({
  label,
  labelHindi,
  value,
  accentColor,
  subtitle,
}: {
  label: string
  labelHindi?: string
  value: number
  accentColor: string
  subtitle?: string
}) {
  const { value: displayed, start } = useAnimatedCount(value)

  return (
    <InteractiveCard
      className="rounded-xl border border-gold/40 bg-white shadow-md overflow-hidden"
      tiltIntensity={8}
      liftAmount={5}
    >
      <motion.div
        className="p-5 text-center"
        onViewportEnter={start}
        viewport={{ once: true, margin: '-40px' }}
      >
        {/* Accent top border */}
        <div
          className="absolute top-0 left-0 right-0 h-1 rounded-t-xl"
          style={{ background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)` }}
        />
        <p className="font-body text-xs uppercase tracking-[0.2em] text-maroon/50 mb-1">
          {label}
        </p>
        {labelHindi && (
          <p className="font-hindi text-xs text-maroon/35 mb-2">{labelHindi}</p>
        )}
        <p
          className="font-heading text-3xl md:text-4xl leading-none mb-1"
          style={{
            background: `linear-gradient(135deg, ${accentColor}, ${accentColor}cc)`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          {displayed}
        </p>
        {subtitle && (
          <p className="font-body text-xs text-maroon/40 mt-1">{subtitle}</p>
        )}
      </motion.div>
    </InteractiveCard>
  )
}

/* ── Day stat card ── */
function DayStatCard({
  day,
  guestCount,
}: {
  day: (typeof RSVP_DAYS)[number]
  guestCount: number
}) {
  const color = EVENT_COLORS[day.colorKey]
  const { value: displayed, start } = useAnimatedCount(guestCount)

  return (
    <InteractiveCard
      className="rounded-xl border border-gold/30 bg-white shadow-sm overflow-hidden"
      tiltIntensity={6}
      liftAmount={4}
    >
      <motion.div
        className="p-4 relative"
        onViewportEnter={start}
        viewport={{ once: true, margin: '-40px' }}
      >
        {/* Accent left border */}
        <div
          className="absolute top-2 bottom-2 left-0 w-1 rounded-r-full"
          style={{ backgroundColor: color }}
        />
        <div className="pl-3">
          <div className="flex items-baseline justify-between mb-1">
            <p className="font-heading text-sm text-maroon">{day.label}</p>
            <p className="font-body text-xs text-maroon/40">{day.date}</p>
          </div>
          <p className="font-hindi text-xs text-maroon/40 mb-2">{day.labelHindi}</p>
          <div className="flex flex-wrap gap-1.5 mb-3">
            {day.events.map((event) => {
              const eventKey = event.toLowerCase() as keyof typeof EVENT_COLORS
              return (
                <span
                  key={event}
                  className="px-2 py-0.5 rounded-full text-[10px] font-body font-medium text-white"
                  style={{ backgroundColor: EVENT_COLORS[eventKey] }}
                >
                  {event}
                </span>
              )
            })}
          </div>
          <p
            className="font-heading text-2xl leading-none"
            style={{
              background: `linear-gradient(135deg, ${color}, ${color}cc)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            {displayed}
            <span className="text-xs font-body text-maroon/40 ml-1">guests</span>
          </p>
        </div>
      </motion.div>
    </InteractiveCard>
  )
}

/* ── Guest card ── */
function GuestCard({ guest, delay }: { guest: GuestEntry; delay: number }) {
  return (
    <ScrollReveal delay={delay}>
      <InteractiveCard
        className="rounded-xl border border-gold/25 bg-white shadow-sm overflow-hidden"
        tiltIntensity={5}
        liftAmount={3}
        glowColor="rgba(212,175,55,0.1)"
      >
        <div className="px-5 py-4 flex items-center gap-4">
          {/* Avatar circle with initial */}
          <div
            className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-heading text-white text-sm"
            style={{
              background: 'linear-gradient(135deg, #FB8B24, #E36414)',
            }}
          >
            {guest.name.charAt(0).toUpperCase()}
          </div>

          {/* Name + day pills */}
          <div className="flex-1 min-w-0">
            <p className="font-heading text-maroon text-base leading-tight truncate">
              {guest.name}
            </p>
            <div className="flex flex-wrap gap-1 mt-1.5">
              {guest.days.map((dayIndex) => {
                const day = RSVP_DAYS[dayIndex]
                if (!day) return null
                const color = EVENT_COLORS[day.colorKey]
                return (
                  <span
                    key={dayIndex}
                    className="px-2 py-0.5 rounded-full text-[10px] font-body font-medium"
                    style={{
                      backgroundColor: `${color}18`,
                      color,
                      border: `1px solid ${color}30`,
                    }}
                  >
                    {day.label}
                  </span>
                )
              })}
            </div>
          </div>

          {/* Guest count badge */}
          <div className="flex-shrink-0 text-center">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center font-heading text-sm border"
              style={{
                borderColor: 'rgba(212,175,55,0.4)',
                color: '#B8860B',
                backgroundColor: 'rgba(212,175,55,0.08)',
              }}
            >
              {guest.guestCount}
            </div>
            <p className="text-[9px] font-body text-maroon/35 mt-0.5">
              {guest.guestCount === 1 ? 'guest' : 'guests'}
            </p>
          </div>
        </div>
      </InteractiveCard>
    </ScrollReveal>
  )
}

/* ── Skeleton loader ── */
function SkeletonCards() {
  return (
    <div className="space-y-4">
      {/* Stat skeletons */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {[...Array(2)].map((_, i) => (
          <div
            key={i}
            className="rounded-xl border border-gold/20 bg-white p-5 animate-pulse"
          >
            <div className="h-3 w-16 mx-auto bg-gold/10 rounded mb-3" />
            <div className="h-8 w-12 mx-auto bg-gold/15 rounded" />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="rounded-xl border border-gold/20 bg-white p-4 animate-pulse"
          >
            <div className="h-3 w-20 bg-gold/10 rounded mb-3" />
            <div className="flex gap-1.5 mb-3">
              <div className="h-4 w-12 bg-gold/10 rounded-full" />
            </div>
            <div className="h-7 w-10 bg-gold/15 rounded" />
          </div>
        ))}
      </div>
      {/* Guest card skeletons */}
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="rounded-xl border border-gold/15 bg-white px-5 py-4 flex items-center gap-4 animate-pulse"
        >
          <div className="w-10 h-10 rounded-full bg-gold/10" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-32 bg-gold/10 rounded" />
            <div className="flex gap-1.5">
              <div className="h-4 w-10 bg-gold/8 rounded-full" />
              <div className="h-4 w-10 bg-gold/8 rounded-full" />
            </div>
          </div>
          <div className="w-9 h-9 rounded-full bg-gold/8" />
        </div>
      ))}
    </div>
  )
}

/* ── Decorative people icon ── */
function PeopleIcon({ className }: { className?: string }) {
  return (
    <svg
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <circle cx="24" cy="14" r="6" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <path
        d="M12 38c0-6.627 5.373-12 12-12s12 5.373 12 12"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
      />
      <circle cx="36" cy="16" r="4" stroke="currentColor" strokeWidth="1.2" fill="none" opacity="0.5" />
      <path
        d="M40 38c0-4.418-2.686-8-6-8"
        stroke="currentColor"
        strokeWidth="1.2"
        fill="none"
        opacity="0.5"
        strokeLinecap="round"
      />
      <circle cx="12" cy="16" r="4" stroke="currentColor" strokeWidth="1.2" fill="none" opacity="0.5" />
      <path
        d="M8 38c0-4.418 2.686-8 6-8"
        stroke="currentColor"
        strokeWidth="1.2"
        fill="none"
        opacity="0.5"
        strokeLinecap="round"
      />
    </svg>
  )
}

/* ── Main component ── */
export function GuestsSection() {
  const [state, setState] = useState<FetchState>({ status: 'loading' })

  useEffect(() => {
    let cancelled = false

    async function fetchGuests() {
      try {
        const db = await getDb()
        const { collection, getDocs } = await import('firebase/firestore')
        const snap = await getDocs(collection(db, 'rsvps'))

        if (cancelled) return

        const guests: GuestEntry[] = []
        snap.forEach((doc) => {
          const data = doc.data()
          guests.push({
            name: data.name ?? 'Guest',
            guestCount: data.guestCount ?? 1,
            days: data.days ?? [],
          })
        })

        // Sort alphabetically
        guests.sort((a, b) => a.name.localeCompare(b.name))

        setState({ status: 'success', guests })
      } catch (err) {
        if (cancelled) return
        setState({
          status: 'error',
          message:
            err instanceof Error ? err.message : 'Failed to load guest list',
        })
      }
    }

    fetchGuests()
    return () => {
      cancelled = true
    }
  }, [])

  /* ── Compute stats ── */
  const stats =
    state.status === 'success'
      ? {
          totalRsvps: state.guests.length,
          totalGuests: state.guests.reduce((sum, g) => sum + g.guestCount, 0),
          perDay: RSVP_DAYS.map((day, i) => ({
            day,
            count: state.guests
              .filter((g) => g.days.includes(i))
              .reduce((sum, g) => sum + g.guestCount, 0),
          })),
        }
      : null

  return (
    <div className="min-h-screen bg-cream relative overflow-hidden">
      {/* Subtle background pattern */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `radial-gradient(circle at 30% 30%, #FB8B24 1px, transparent 1px),
                           radial-gradient(circle at 70% 70%, #FB8B24 1px, transparent 1px)`,
          backgroundSize: '50px 50px',
        }}
        aria-hidden="true"
      />

      <div className="relative max-w-4xl mx-auto px-4 py-12 md:py-20">
        {/* Back link */}
        <ScrollReveal>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-maroon/50 font-body text-sm hover:text-maroon transition-colors mb-10 group"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              className="group-hover:-translate-x-1 transition-transform"
              aria-hidden="true"
            >
              <path
                d="M10 3l-5 5 5 5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Back to Invitation
          </Link>
        </ScrollReveal>

        {/* ─── Page Header ─── */}
        <ScrollReveal>
          <div className="text-center mb-14 md:mb-20">
            <div className="mx-auto mb-6 w-32 md:w-48 h-px bg-gradient-to-r from-transparent via-gold to-transparent" />

            <PeopleIcon className="mx-auto text-gold/40 mb-4" />

            <h1
              className="font-heading text-4xl md:text-6xl leading-tight mb-2 tracking-wide"
              style={{
                background:
                  'linear-gradient(135deg, #FB8B24 0%, #E36414 40%, #FCA84E 60%, #FB8B24 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Guest List
            </h1>
            <h2 className="font-hindi text-xl md:text-2xl text-maroon/60 tracking-wide mb-4">
              अतिथि सूची
            </h2>

            <div className="max-w-md mx-auto">
              <p className="font-body text-lg md:text-xl text-gold-accessible/80 italic mb-1">
                Every guest makes our celebration brighter
              </p>
              <p className="font-hindi text-maroon/50">
                हर मेहमान हमारे उत्सव को और रोशन करता है
              </p>
            </div>

            <div className="mx-auto mt-8 w-24 md:w-36 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
          </div>
        </ScrollReveal>

        {/* ─── Content ─── */}
        {state.status === 'loading' && <SkeletonCards />}

        {state.status === 'error' && (
          <ScrollReveal>
            <div className="text-center py-16">
              <div className="mx-auto w-16 h-16 rounded-full bg-maroon/5 flex items-center justify-center mb-4">
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="text-maroon/40"
                >
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M12 8v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  <circle cx="12" cy="16" r="1" fill="currentColor" />
                </svg>
              </div>
              <p className="font-heading text-maroon/70 text-lg mb-1">
                Unable to load guest list
              </p>
              <p className="font-hindi text-maroon/40 text-sm mb-2">
                अतिथि सूची लोड नहीं हो सकी
              </p>
              <p className="font-body text-maroon/35 text-xs max-w-xs mx-auto">
                {state.message}
              </p>
            </div>
          </ScrollReveal>
        )}

        {state.status === 'success' && state.guests.length === 0 && (
          <ScrollReveal>
            <div className="text-center py-16">
              <PeopleIcon className="mx-auto text-gold/25 mb-4" />
              <p className="font-heading text-maroon/60 text-lg mb-1">
                No RSVPs yet
              </p>
              <p className="font-hindi text-maroon/40">
                अभी तक कोई RSVP नहीं
              </p>
            </div>
          </ScrollReveal>
        )}

        {state.status === 'success' && state.guests.length > 0 && stats && (
          <>
            {/* ─── Summary Stats ─── */}
            <StaggerReveal className="grid grid-cols-2 gap-4 mb-6 max-w-lg mx-auto">
              <StaggerItem>
                <StatCard
                  label="Total RSVPs"
                  labelHindi="कुल RSVP"
                  value={stats.totalRsvps}
                  accentColor="#FB8B24"
                  subtitle="families"
                />
              </StaggerItem>
              <StaggerItem>
                <StatCard
                  label="Total Guests"
                  labelHindi="कुल मेहमान"
                  value={stats.totalGuests}
                  accentColor="#9A031E"
                  subtitle="people"
                />
              </StaggerItem>
            </StaggerReveal>

            {/* Per-day breakdown */}
            <StaggerReveal className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12 md:mb-16">
              {stats.perDay.map(({ day, count }) => (
                <StaggerItem key={day.label}>
                  <DayStatCard day={day} guestCount={count} />
                </StaggerItem>
              ))}
            </StaggerReveal>

            {/* ─── Divider ─── */}
            <ScrollReveal>
              <div className="mx-auto mb-10 w-20 md:w-32 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
            </ScrollReveal>

            {/* ─── Guest List ─── */}
            <div className="space-y-3 max-w-2xl mx-auto">
              {state.guests.map((guest, i) => (
                <GuestCard
                  key={`${guest.name}-${i}`}
                  guest={guest}
                  delay={Math.min(i * 0.05, 1.5)}
                />
              ))}
            </div>
          </>
        )}

        {/* ─── Bottom CTA ─── */}
        <ScrollReveal delay={0.4}>
          <div className="text-center mt-14 md:mt-20">
            <div className="mx-auto mb-4 w-16 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
            <p className="font-body text-maroon/40 text-sm max-w-sm mx-auto">
              Haven&apos;t RSVP&apos;d yet? Let us know you&apos;re coming!
            </p>

            <Link
              href="/#rsvp"
              className="inline-flex items-center gap-2 mt-6 px-8 py-3 rounded-xl text-white font-heading tracking-wide transition-all duration-300 active:scale-95"
              style={{
                background:
                  'linear-gradient(135deg, #5F0F40 0%, #7A2358 50%, #5F0F40 100%)',
                boxShadow: '0 4px 16px rgba(95,15,64,0.2)',
              }}
            >
              RSVP Now
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </div>
  )
}
