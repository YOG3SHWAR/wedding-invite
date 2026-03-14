"use client"

import React, {
  Suspense,
  useEffect,
  useMemo,
  useRef,
  useState,
  createContext,
  useContext,
} from "react"
import * as THREE from "three"
import { Canvas, useFrame } from "@react-three/fiber"
import {
  OrbitControls,
  Environment,
  Html,
  Sphere,
} from "@react-three/drei"
import { X, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { PLACEHOLDER_GALLERY } from "@/lib/placeholder-data"

/* =========================
   Card Context
   ========================= */

type Card = {
  id: string
  imageUrl: string
  thumbnail: string
  alt: string
  title: string
}

type CardContextType = {
  selectedCard: Card | null
  setSelectedCard: (card: Card | null) => void
  cards: Card[]
}

const CardContext = createContext<CardContextType | undefined>(undefined)

function useCard() {
  const ctx = useContext(CardContext)
  if (!ctx) throw new Error("useCard must be used within CardProvider")
  return ctx
}

function CardProvider({ children }: { children: React.ReactNode }) {
  const [selectedCard, setSelectedCard] = useState<Card | null>(null)

  const cards: Card[] = PLACEHOLDER_GALLERY.map((img) => ({
    id: img.id,
    imageUrl: img.src,
    thumbnail: img.thumbnail,
    alt: img.alt,
    title: img.alt,
  }))

  return (
    <CardContext.Provider value={{ selectedCard, setSelectedCard, cards }}>
      {children}
    </CardContext.Provider>
  )
}

/* =========================
   Starfield Background
   ========================= */

function StarfieldBackground() {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!mountRef.current) return

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      2000
    )
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0x0a0006, 1)
    mountRef.current.appendChild(renderer.domElement)

    // Gold-tinted stars
    const starsGeometry = new THREE.BufferGeometry()
    const starsCount = 2000
    const positions = new Float32Array(starsCount * 3)
    const colors = new Float32Array(starsCount * 3)

    for (let i = 0; i < starsCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 2000
      positions[i * 3 + 1] = (Math.random() - 0.5) * 2000
      positions[i * 3 + 2] = (Math.random() - 0.5) * 2000

      // Mix of gold, warm white, and faint maroon stars
      const r = Math.random()
      if (r < 0.4) {
        // Gold stars
        colors[i * 3] = 0.83
        colors[i * 3 + 1] = 0.69
        colors[i * 3 + 2] = 0.22
      } else if (r < 0.7) {
        // Warm white
        colors[i * 3] = 1.0
        colors[i * 3 + 1] = 0.95
        colors[i * 3 + 2] = 0.8
      } else {
        // Faint rose/maroon
        colors[i * 3] = 0.8
        colors[i * 3 + 1] = 0.3
        colors[i * 3 + 2] = 0.3
      }
    }
    starsGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3)
    )
    starsGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3))

    const starsMaterial = new THREE.PointsMaterial({
      size: 0.8,
      sizeAttenuation: true,
      vertexColors: true,
    })
    const stars = new THREE.Points(starsGeometry, starsMaterial)
    scene.add(stars)

    camera.position.z = 10

    let animationId = 0
    const animate = () => {
      animationId = requestAnimationFrame(animate)
      stars.rotation.y += 0.00008
      stars.rotation.x += 0.00004
      renderer.render(scene, camera)
    }
    animate()

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }
    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
      cancelAnimationFrame(animationId)
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement)
      }
      renderer.dispose()
      starsGeometry.dispose()
      starsMaterial.dispose()
    }
  }, [])

  return (
    <div
      ref={mountRef}
      className="fixed top-0 left-0 w-full h-full z-0"
      style={{ backgroundColor: "#0a0006" }}
    />
  )
}

/* =========================
   Floating Card
   ========================= */

function FloatingCard({
  card,
  position,
}: {
  card: Card
  position: {
    x: number
    y: number
    z: number
    rotationX: number
    rotationY: number
    rotationZ: number
  }
}) {
  const groupRef = useRef<THREE.Group>(null)
  const [hovered, setHovered] = useState(false)
  const { setSelectedCard } = useCard()

  useFrame(({ camera }) => {
    if (groupRef.current) {
      groupRef.current.lookAt(camera.position)
    }
  })

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation()
    setSelectedCard(card)
  }
  const handlePointerOver = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation()
    setHovered(true)
    document.body.style.cursor = "pointer"
  }
  const handlePointerOut = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation()
    setHovered(false)
    document.body.style.cursor = "auto"
  }

  return (
    <group ref={groupRef} position={[position.x, position.y, position.z]}>
      <Html
        transform
        distanceFactor={10}
        position={[0, 0, 0.01]}
        style={{
          transition: "all 0.3s ease",
          transform: hovered ? "scale(1.15)" : "scale(1)",
          pointerEvents: "auto",
        }}
      >
        <div
          className="w-40 h-52 rounded-lg overflow-hidden p-2.5 select-none"
          onClick={handleClick}
          onMouseOver={handlePointerOver}
          onMouseOut={handlePointerOut}
          style={{
            cursor: "pointer",
            background: hovered
              ? "linear-gradient(145deg, #1a0810, #2a1018)"
              : "linear-gradient(145deg, #140610, #1a0810)",
            boxShadow: hovered
              ? "0 25px 50px rgba(212, 175, 55, 0.4), 0 0 40px rgba(212, 175, 55, 0.2), inset 0 1px 0 rgba(212, 175, 55, 0.3)"
              : "0 15px 30px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(212, 175, 55, 0.1)",
            border: hovered
              ? "2px solid rgba(212, 175, 55, 0.6)"
              : "1px solid rgba(212, 175, 55, 0.15)",
          }}
        >
          <img
            src={card.thumbnail || card.imageUrl}
            alt={card.alt}
            className="w-full h-44 object-cover rounded-md"
            draggable={false}
          />
          <div className="mt-1 text-center">
            <p
              className="text-xs font-medium truncate"
              style={{ color: "#D4AF37" }}
            >
              {card.title}
            </p>
          </div>
        </div>
      </Html>
    </group>
  )
}

/* =========================
   Card Modal
   ========================= */

function CardModal() {
  const { selectedCard, setSelectedCard } = useCard()
  const cardRef = useRef<HTMLDivElement>(null)

  if (!selectedCard) return null

  const handleMouseMove: React.MouseEventHandler<HTMLDivElement> = (e) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    const rotateX = (y - centerY) / 20
    const rotateY = (centerX - x) / 20
    cardRef.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`
  }

  const handleMouseLeave = () => {
    if (cardRef.current) {
      cardRef.current.style.transition = "transform 0.5s ease-out"
      cardRef.current.style.transform =
        "perspective(1000px) rotateX(0deg) rotateY(0deg)"
    }
  }

  const handleClose = () => setSelectedCard(null)
  const handleBackdropClick: React.MouseEventHandler<HTMLDivElement> = (e) => {
    if (e.target === e.currentTarget) handleClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm"
      style={{ backgroundColor: "rgba(10, 0, 6, 0.85)" }}
      onClick={handleBackdropClick}
    >
      <div className="relative max-w-md w-full mx-4">
        <button
          onClick={handleClose}
          className="absolute -top-12 right-0 transition-colors z-10"
          style={{ color: "#D4AF37" }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.color = "#f0d060")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.color = "#D4AF37")
          }
        >
          <X className="w-8 h-8" />
        </button>

        <div style={{ perspective: "1000px" }} className="w-full">
          <div
            ref={cardRef}
            className="relative cursor-pointer rounded-2xl p-4 transition-all duration-500 ease-out w-full"
            style={{
              transformStyle: "preserve-3d",
              background: "linear-gradient(145deg, #1a0810, #2a1018)",
              boxShadow:
                "0 0 60px rgba(212, 175, 55, 0.15), 0 25px 50px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(212, 175, 55, 0.2)",
              border: "1px solid rgba(212, 175, 55, 0.3)",
            }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <div
              className="relative w-full mb-4"
              style={{ aspectRatio: "3 / 4" }}
            >
              <img
                loading="lazy"
                className="absolute inset-0 h-full w-full rounded-xl object-cover"
                alt={selectedCard.alt}
                src={selectedCard.imageUrl}
                style={{
                  boxShadow: "0 5px 20px rgba(0, 0, 0, 0.3)",
                }}
              />
            </div>

            <h3
              className="text-lg font-semibold mb-3 text-center font-heading"
              style={{ color: "#D4AF37" }}
            >
              {selectedCard.title}
            </h3>

            <div
              className="mx-auto w-16 h-px"
              style={{
                background:
                  "linear-gradient(to right, transparent, #D4AF37, transparent)",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

/* =========================
   Card Galaxy
   ========================= */

function CardGalaxy() {
  const { cards } = useCard()

  const cardPositions = useMemo(() => {
    const positions: {
      x: number
      y: number
      z: number
      rotationX: number
      rotationY: number
      rotationZ: number
    }[] = []
    const numCards = cards.length
    const goldenRatio = (1 + Math.sqrt(5)) / 2

    for (let i = 0; i < numCards; i++) {
      const y = 1 - (i / (numCards - 1)) * 2
      const radiusAtY = Math.sqrt(1 - y * y)
      const theta = (2 * Math.PI * i) / goldenRatio
      const x = Math.cos(theta) * radiusAtY
      const z = Math.sin(theta) * radiusAtY
      const layerRadius = 12 + (i % 3) * 4

      positions.push({
        x: x * layerRadius,
        y: y * layerRadius,
        z: z * layerRadius,
        rotationX: Math.atan2(z, Math.sqrt(x * x + y * y)),
        rotationY: Math.atan2(x, z),
        rotationZ: (Math.random() - 0.5) * 0.2,
      })
    }
    return positions
  }, [cards.length])

  return (
    <>
      {/* Inner decorative spheres with gold/maroon tones */}
      <Sphere args={[2, 32, 32]} position={[0, 0, 0]}>
        <meshStandardMaterial
          color="#800020"
          transparent
          opacity={0.08}
          wireframe
        />
      </Sphere>
      <Sphere args={[12, 32, 32]} position={[0, 0, 0]}>
        <meshStandardMaterial
          color="#D4AF37"
          transparent
          opacity={0.04}
          wireframe
        />
      </Sphere>
      <Sphere args={[16, 32, 32]} position={[0, 0, 0]}>
        <meshStandardMaterial
          color="#D4AF37"
          transparent
          opacity={0.025}
          wireframe
        />
      </Sphere>
      <Sphere args={[20, 32, 32]} position={[0, 0, 0]}>
        <meshStandardMaterial
          color="#800020"
          transparent
          opacity={0.015}
          wireframe
        />
      </Sphere>

      {cards.map((card, i) => (
        <FloatingCard key={card.id} card={card} position={cardPositions[i]} />
      ))}
    </>
  )
}

/* =========================
   Page Export
   ========================= */

/* =========================
   Image Preloader
   ========================= */

function ImagePreloader({ onReady }: { onReady?: () => void }) {
  const { cards } = useCard()

  useEffect(() => {
    if (cards.length === 0) {
      onReady?.()
      return
    }

    const promises = cards.map(
      (card) =>
        new Promise<void>((resolve) => {
          const img = new Image()
          img.onload = () => resolve()
          img.onerror = () => resolve() // resolve on error to prevent hanging
          img.src = card.imageUrl
        })
    )

    Promise.all(promises).then(() => {
      onReady?.()
    })
  }, [cards, onReady])

  return null
}

export default function StellarCardGallery({ onReady }: { onReady?: () => void }) {
  const [canvasReady, setCanvasReady] = useState(false)
  const [imagesReady, setImagesReady] = useState(false)

  useEffect(() => {
    if (canvasReady && imagesReady) {
      onReady?.()
    }
  }, [canvasReady, imagesReady, onReady])

  return (
    <CardProvider>
      <ImagePreloader onReady={() => setImagesReady(true)} />
      <div
        className="w-full h-screen relative overflow-hidden"
        style={{ backgroundColor: "#0a0006" }}
      >
        <StarfieldBackground />

        <Canvas
          camera={{ position: [0, 0, 15], fov: 60 }}
          className="absolute inset-0 z-10"
          onCreated={({ gl }) => {
            gl.domElement.style.pointerEvents = "auto"
            requestAnimationFrame(() => {
              setCanvasReady(true)
            })
          }}
        >
          <Suspense fallback={null}>
            <Environment preset="night" />
            <ambientLight intensity={0.4} />
            <pointLight
              position={[10, 10, 10]}
              intensity={0.6}
              color="#D4AF37"
            />
            <pointLight
              position={[-10, -10, -10]}
              intensity={0.3}
              color="#800020"
            />
            <CardGalaxy />
            <OrbitControls
              enablePan
              enableZoom
              enableRotate
              minDistance={5}
              maxDistance={40}
              autoRotate={false}
              rotateSpeed={0.5}
              zoomSpeed={1.2}
              panSpeed={0.8}
              target={[0, 0, 0]}
            />
          </Suspense>
        </Canvas>

        <CardModal />

        {/* Header overlay */}
        <div className="absolute top-0 left-0 right-0 z-20 pointer-events-none">
          <div className="flex items-start justify-between p-4 md:p-6">
            <div className="pointer-events-auto">
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 hover:scale-105"
                style={{
                  color: "#D4AF37",
                  background: "rgba(128, 0, 32, 0.4)",
                  border: "1px solid rgba(212, 175, 55, 0.3)",
                  backdropFilter: "blur(8px)",
                }}
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Invite
              </Link>
            </div>
            <div className="text-right">
              <h1
                className="text-xl md:text-2xl font-heading font-bold"
                style={{ color: "#D4AF37" }}
              >
                Our Moments Together
              </h1>
              <p className="text-xs md:text-sm mt-1 opacity-60 text-white">
                Drag to explore &bull; Scroll to zoom &bull; Click to view
              </p>
            </div>
          </div>
        </div>
      </div>
    </CardProvider>
  )
}
