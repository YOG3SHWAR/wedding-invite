'use client'

import { useState, useEffect } from 'react'

interface TimeRemaining {
  days: number
  hours: number
  minutes: number
  seconds: number
}

function getTimeRemaining(target: string): TimeRemaining {
  const diff = new Date(target).getTime() - Date.now()
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 }
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  }
}

const LABELS = ['Days', 'Hours', 'Minutes', 'Seconds'] as const

interface HeroCountdownProps {
  targetDate: string
}

export function HeroCountdown({ targetDate }: HeroCountdownProps) {
  const [time, setTime] = useState<TimeRemaining>(getTimeRemaining(targetDate))
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Immediately sync to current time on mount
    setTime(getTimeRemaining(targetDate))

    const id = setInterval(() => {
      setTime(getTimeRemaining(targetDate))
    }, 1000)

    return () => clearInterval(id)
  }, [targetDate])

  const values = [time.days, time.hours, time.minutes, time.seconds]

  return (
    <div className="mt-8 flex gap-3 md:gap-4 justify-center" suppressHydrationWarning>
      {values.map((value, i) => (
        <div
          key={LABELS[i]}
          className="border border-gold/60 rounded-md p-3 md:p-4 min-w-[70px] md:min-w-[80px] bg-white/10 backdrop-blur-sm"
        >
          <span
            className="font-heading text-3xl md:text-4xl text-gold block leading-none"
            style={{ textShadow: '0 0 10px rgba(212,175,55,0.3)' }}
          >
            {mounted ? String(value).padStart(2, '0') : '--'}
          </span>
          <span className="font-body text-xs md:text-sm text-cream uppercase tracking-wider mt-1 block">
            {LABELS[i]}
          </span>
        </div>
      ))}
    </div>
  )
}
