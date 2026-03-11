import { HeroSection } from '@/components/sections/hero-section'
import { SectionDivider } from '@/components/sections/section-divider'
import { OurStorySection } from '@/components/sections/our-story-section'

export default function Home() {
  return (
    <main>
      <HeroSection />

      <SectionDivider />

      <OurStorySection />

      <SectionDivider />

      {/* Events timeline (Plan 02-02) */}

      {/* Photo gallery (Plan 02-02) */}

      {/* Pre-wedding video (Plan 02-02) */}

      {/* RSVP section (Phase 3) */}
      <section className="py-section-mobile md:py-section px-4">
        <div className="max-w-2xl mx-auto text-center">
          <p className="font-body text-lg text-maroon/40">RSVP section coming in Phase 3</p>
        </div>
      </section>
    </main>
  )
}
