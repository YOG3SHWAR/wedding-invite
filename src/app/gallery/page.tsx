"use client"

import { useState } from "react"
import StellarCardGallery from "@/components/ui/3d-image-gallery"
import { MorphLoading } from "@/components/ui/morph-loading"

export default function GalleryPage() {
  const [isLoaded, setIsLoaded] = useState(false)

  return (
    <div className="relative w-full h-screen">
      {/* Loading overlay */}
      {!isLoaded && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ backgroundColor: '#FFF8F0' }}
        >
          <MorphLoading variant="morph" size="lg" />
        </div>
      )}
      {/* Gallery always mounted (so Three.js can load textures) */}
      <div style={{ opacity: isLoaded ? 1 : 0, transition: 'opacity 0.6s ease-in-out' }}>
        <StellarCardGallery onReady={() => setIsLoaded(true)} />
      </div>
    </div>
  )
}
