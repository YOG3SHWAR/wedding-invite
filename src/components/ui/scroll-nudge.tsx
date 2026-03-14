'use client'

import { motion, useScroll, useMotionValueEvent, AnimatePresence } from 'motion/react'
import { useState, useCallback } from 'react'

/**
 * Prominent scroll-down nudge with pulsing gold glow, double chevrons,
 * and bilingual text. Auto-hides on scroll, reappears at top.
 */
export function ScrollNudge() {
  const [visible, setVisible] = useState(true)
  const { scrollY } = useScroll()

  useMotionValueEvent(scrollY, 'change', (latest) => {
    if (latest > 50) setVisible(false)
    else if (latest < 10) setVisible(true)
  })

  const handleClick = useCallback(() => {
    const target = document.getElementById('our-story')
    target?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10, transition: { duration: 0.4, ease: 'easeOut' } }}
          transition={{ type: 'spring', stiffness: 80, damping: 14, delay: 2.5 }}
        >
          <button
            onClick={handleClick}
            aria-label="Scroll down to Our Story section"
            className="flex flex-col items-center gap-2 group cursor-pointer bg-transparent border-none outline-none focus-visible:ring-2 focus-visible:ring-gold/60 focus-visible:ring-offset-2 focus-visible:ring-offset-maroon rounded-lg p-2"
          >
            {/* Double stacked chevrons */}
            <div className="flex flex-col items-center">
              {[0, 1].map((i) => (
                <motion.svg
                  key={i}
                  width="28"
                  height="28"
                  viewBox="0 0 28 28"
                  fill="none"
                  className="md:w-9 md:h-9 -my-1"
                  aria-hidden="true"
                  animate={{ y: [0, 8, 0] }}
                  transition={{
                    duration: 1.8,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: i * 0.2,
                  }}
                >
                  <path
                    d="M6 10L14 18L22 10"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-gold drop-shadow-[0_0_6px_rgba(212,175,55,0.5)]"
                  />
                </motion.svg>
              ))}
            </div>

            {/* Bilingual text */}
            <motion.div
              className="flex flex-col items-center gap-0.5"
              animate={{ opacity: [0.4, 0.8, 0.4] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            >
              <span className="font-hindi text-sm md:text-base text-gold/80 tracking-wide">
                नीचे स्क्रॉल करें
              </span>
              <span className="font-body text-[11px] md:text-xs text-cream/50 uppercase tracking-[0.2em]">
                Scroll Down
              </span>
            </motion.div>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
