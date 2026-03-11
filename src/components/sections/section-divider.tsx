/**
 * Decorative gold divider with a centered paisley/lotus motif.
 * Used between major page sections to create visual breathing room.
 * Pure server component -- no interactivity needed.
 */
export function SectionDivider() {
  return (
    <div className="flex items-center justify-center gap-3 py-8 px-4" aria-hidden="true">
      {/* Left gradient line */}
      <div className="h-px flex-1 max-w-[120px] md:max-w-[200px] bg-gradient-to-r from-transparent to-gold" />

      {/* Centered paisley/lotus SVG motif */}
      <svg
        width="40"
        height="40"
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-gold flex-shrink-0"
      >
        {/* Outer petals */}
        <path
          d="M20 4C20 4 24 10 24 16C24 10 30 8 30 8C30 8 24 14 24 20C30 20 36 16 36 16C36 16 30 22 24 24C30 24 32 30 32 30C32 30 26 26 20 24C20 30 24 36 24 36C24 36 20 30 16 24C10 26 8 32 8 32C8 32 12 24 16 24C10 22 4 16 4 16C4 16 10 20 16 20C16 14 10 8 10 8C10 8 16 10 16 16C16 10 20 4 20 4Z"
          fill="currentColor"
          opacity="0.3"
        />
        {/* Inner diamond */}
        <path
          d="M20 12L24 20L20 28L16 20Z"
          fill="currentColor"
          opacity="0.6"
        />
        {/* Center dot */}
        <circle cx="20" cy="20" r="2.5" fill="currentColor" />
      </svg>

      {/* Right gradient line */}
      <div className="h-px flex-1 max-w-[120px] md:max-w-[200px] bg-gradient-to-l from-transparent to-gold" />
    </div>
  )
}
