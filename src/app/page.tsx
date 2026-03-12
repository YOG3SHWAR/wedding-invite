import { HeroSection } from '@/components/sections/hero-section'
import { SectionDivider } from '@/components/sections/section-divider'
import { OurStorySection } from '@/components/sections/our-story-section'
import { EventTimeline } from '@/components/sections/event-timeline'
import { PhotoGallery } from '@/components/sections/photo-gallery'
import { VideoSection } from '@/components/sections/video-section'

export default function Home() {
  return (
    <main>
      <HeroSection />

      <SectionDivider />

      <OurStorySection />

      <SectionDivider />

      <EventTimeline />

      <SectionDivider />

      <PhotoGallery />

      <SectionDivider />

      <VideoSection />

      <SectionDivider />

      {/* RSVP placeholder (Phase 3) */}
      <section className="py-section-mobile md:py-section px-4">
        <div className="max-w-2xl mx-auto text-center">
          <p className="font-heading text-2xl text-maroon">RSVP Coming Soon</p>
        </div>
      </section>
    </main>
  )
}
