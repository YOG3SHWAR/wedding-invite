"use client"

import { cn } from "@/lib/utils"

const sizeMap = {
  sm: 24,
  md: 48,
  lg: 64,
} as const

type MorphLoadingProps = {
  variant?: "morph"
  size?: "sm" | "md" | "lg"
  className?: string
}

const squareColors = [
  "#800020", // maroon
  "#D4AF37", // gold
  "#D4AF37", // gold
  "#800020", // maroon
]

export function MorphLoading({
  variant = "morph",
  size = "md",
  className,
}: MorphLoadingProps) {
  const containerSize = sizeMap[size]
  const squareSize = containerSize / 2

  return (
    <div
      className={cn("relative", className)}
      style={{
        width: containerSize,
        height: containerSize,
      }}
    >
      {squareColors.map((color, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            width: squareSize,
            height: squareSize,
            top: i < 2 ? 0 : squareSize,
            left: i % 2 === 0 ? 0 : squareSize,
            backgroundColor: color,
            animation: `morph-${i} 1.6s ease-in-out infinite`,
          }}
        />
      ))}
    </div>
  )
}
