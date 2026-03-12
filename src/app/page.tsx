import { HeroSection } from '@/components/sections/hero-section'
import { SectionDivider } from '@/components/sections/section-divider'
import { OurStorySection } from '@/components/sections/our-story-section'
import { EventTimeline } from '@/components/sections/event-timeline'
import { PhotoGallery } from '@/components/sections/photo-gallery'
import { VideoSection } from '@/components/sections/video-section'
import { RsvpSection } from '@/components/sections/rsvp-section'
import { WhatsAppShare } from '@/components/sections/whatsapp-share'

export default function Home() {
  return (
    <main>
      <HeroSection />

      <SectionDivider />

      <OurStorySection />

      <EventTimeline />

      <SectionDivider />

      <PhotoGallery />

      <VideoSection />

      <RsvpSection />

      <WhatsAppShare />
    </main>
  )
}
