'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * MandalaBackground
 *
 * Three large, intricate mandala SVG patterns fixed behind all content.
 * Each mandala drifts at a different parallax rate on scroll.
 *
 * All SVG coordinates are pre-computed and rounded to avoid
 * server/client floating-point hydration mismatches.
 *
 * - Fixed z-0, pointer-events-none, aria-hidden
 * - rAF-throttled scroll listener
 * - Respects `prefers-reduced-motion` (renders static, no parallax)
 */

const S = '#FB8B24' // stroke color

/** Concentric rings with lotus petal tips — top-right */
function MandalaRings({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 800 800" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Outermost ring — 24 petals at r=370 */}
      <g opacity="0.9">
        <ellipse cx="770" cy="400" rx="28" ry="14" transform="rotate(0 770 400)" stroke={S} strokeWidth="1.2" />
        <ellipse cx="757.39" cy="495.76" rx="28" ry="14" transform="rotate(15 757.39 495.76)" stroke={S} strokeWidth="1.2" />
        <ellipse cx="720.43" cy="585" rx="28" ry="14" transform="rotate(30 720.43 585)" stroke={S} strokeWidth="1.2" />
        <ellipse cx="661.63" cy="661.63" rx="28" ry="14" transform="rotate(45 661.63 661.63)" stroke={S} strokeWidth="1.2" />
        <ellipse cx="585" cy="720.43" rx="28" ry="14" transform="rotate(60 585 720.43)" stroke={S} strokeWidth="1.2" />
        <ellipse cx="495.76" cy="757.39" rx="28" ry="14" transform="rotate(75 495.76 757.39)" stroke={S} strokeWidth="1.2" />
        <ellipse cx="400" cy="770" rx="28" ry="14" transform="rotate(90 400 770)" stroke={S} strokeWidth="1.2" />
        <ellipse cx="304.24" cy="757.39" rx="28" ry="14" transform="rotate(105 304.24 757.39)" stroke={S} strokeWidth="1.2" />
        <ellipse cx="215" cy="720.43" rx="28" ry="14" transform="rotate(120 215 720.43)" stroke={S} strokeWidth="1.2" />
        <ellipse cx="138.37" cy="661.63" rx="28" ry="14" transform="rotate(135 138.37 661.63)" stroke={S} strokeWidth="1.2" />
        <ellipse cx="79.57" cy="585" rx="28" ry="14" transform="rotate(150 79.57 585)" stroke={S} strokeWidth="1.2" />
        <ellipse cx="42.61" cy="495.76" rx="28" ry="14" transform="rotate(165 42.61 495.76)" stroke={S} strokeWidth="1.2" />
        <ellipse cx="30" cy="400" rx="28" ry="14" transform="rotate(180 30 400)" stroke={S} strokeWidth="1.2" />
        <ellipse cx="42.61" cy="304.24" rx="28" ry="14" transform="rotate(195 42.61 304.24)" stroke={S} strokeWidth="1.2" />
        <ellipse cx="79.57" cy="215" rx="28" ry="14" transform="rotate(210 79.57 215)" stroke={S} strokeWidth="1.2" />
        <ellipse cx="138.37" cy="138.37" rx="28" ry="14" transform="rotate(225 138.37 138.37)" stroke={S} strokeWidth="1.2" />
        <ellipse cx="215" cy="79.57" rx="28" ry="14" transform="rotate(240 215 79.57)" stroke={S} strokeWidth="1.2" />
        <ellipse cx="304.24" cy="42.61" rx="28" ry="14" transform="rotate(255 304.24 42.61)" stroke={S} strokeWidth="1.2" />
        <ellipse cx="400" cy="30" rx="28" ry="14" transform="rotate(270 400 30)" stroke={S} strokeWidth="1.2" />
        <ellipse cx="495.76" cy="42.61" rx="28" ry="14" transform="rotate(285 495.76 42.61)" stroke={S} strokeWidth="1.2" />
        <ellipse cx="585" cy="79.57" rx="28" ry="14" transform="rotate(300 585 79.57)" stroke={S} strokeWidth="1.2" />
        <ellipse cx="661.63" cy="138.37" rx="28" ry="14" transform="rotate(315 661.63 138.37)" stroke={S} strokeWidth="1.2" />
        <ellipse cx="720.43" cy="215" rx="28" ry="14" transform="rotate(330 720.43 215)" stroke={S} strokeWidth="1.2" />
        <ellipse cx="757.39" cy="304.24" rx="28" ry="14" transform="rotate(345 757.39 304.24)" stroke={S} strokeWidth="1.2" />
        <circle cx="400" cy="400" r="356" stroke={S} strokeWidth="1.8" />
      </g>

      {/* Second ring — 16 spokes */}
      <g opacity="0.8">
        <circle cx="400" cy="400" r="310" stroke={S} strokeWidth="1.4" />
        <circle cx="400" cy="400" r="295" stroke={S} strokeWidth="1.4" />
        <line x1="695" y1="400" x2="710" y2="400" stroke={S} strokeWidth="1.2" />
        <line x1="672.54" y1="512.89" x2="686.40" y2="518.63" stroke={S} strokeWidth="1.2" />
        <line x1="608.60" y1="608.60" x2="619.20" y2="619.20" stroke={S} strokeWidth="1.2" />
        <line x1="512.89" y1="672.54" x2="518.63" y2="686.40" stroke={S} strokeWidth="1.2" />
        <line x1="400" y1="695" x2="400" y2="710" stroke={S} strokeWidth="1.2" />
        <line x1="287.11" y1="672.54" x2="281.37" y2="686.40" stroke={S} strokeWidth="1.2" />
        <line x1="191.40" y1="608.60" x2="180.80" y2="619.20" stroke={S} strokeWidth="1.2" />
        <line x1="127.46" y1="512.89" x2="113.60" y2="518.63" stroke={S} strokeWidth="1.2" />
        <line x1="105" y1="400" x2="90" y2="400" stroke={S} strokeWidth="1.2" />
        <line x1="127.46" y1="287.11" x2="113.60" y2="281.37" stroke={S} strokeWidth="1.2" />
        <line x1="191.40" y1="191.40" x2="180.80" y2="180.80" stroke={S} strokeWidth="1.2" />
        <line x1="287.11" y1="127.46" x2="281.37" y2="113.60" stroke={S} strokeWidth="1.2" />
        <line x1="400" y1="105" x2="400" y2="90" stroke={S} strokeWidth="1.2" />
        <line x1="512.89" y1="127.46" x2="518.63" y2="113.60" stroke={S} strokeWidth="1.2" />
        <line x1="608.60" y1="191.40" x2="619.20" y2="180.80" stroke={S} strokeWidth="1.2" />
        <line x1="672.54" y1="287.11" x2="686.40" y2="281.37" stroke={S} strokeWidth="1.2" />
      </g>

      {/* Third ring — 12 lotus petals */}
      <g opacity="0.85">
        <circle cx="400" cy="400" r="260" stroke={S} strokeWidth="1.8" />
        <path d="M 627.76 367.99 Q 659.37 381.86 680 400 Q 659.37 418.14 627.76 432.01" stroke={S} strokeWidth="1.8" fill="none" />
        <path d="M 613.25 486.16 Q 633.69 513.98 642.49 540 Q 615.55 545.39 581.24 541.60" stroke={S} strokeWidth="1.8" fill="none" />
        <path d="M 541.60 581.24 Q 545.39 615.55 540 642.49 Q 513.98 633.69 486.16 613.25" stroke={S} strokeWidth="1.8" fill="none" />
        <path d="M 432.01 627.76 Q 418.14 659.37 400 680 Q 381.86 659.37 367.99 627.76" stroke={S} strokeWidth="1.8" fill="none" />
        <path d="M 313.84 613.25 Q 286.02 633.69 260 642.49 Q 254.61 615.55 258.40 581.24" stroke={S} strokeWidth="1.8" fill="none" />
        <path d="M 218.76 541.60 Q 184.45 545.39 157.51 540 Q 166.31 513.98 186.75 486.16" stroke={S} strokeWidth="1.8" fill="none" />
        <path d="M 172.24 432.01 Q 140.63 418.14 120 400 Q 140.63 381.86 172.24 367.99" stroke={S} strokeWidth="1.8" fill="none" />
        <path d="M 186.75 313.84 Q 166.31 286.02 157.51 260 Q 184.45 254.61 218.76 258.40" stroke={S} strokeWidth="1.8" fill="none" />
        <path d="M 258.40 218.76 Q 254.61 184.45 260 157.51 Q 286.02 166.31 313.84 186.75" stroke={S} strokeWidth="1.8" fill="none" />
        <path d="M 367.99 172.24 Q 381.86 140.63 400 120 Q 418.14 140.63 432.01 172.24" stroke={S} strokeWidth="1.8" fill="none" />
        <path d="M 486.16 186.75 Q 513.98 166.31 540 157.51 Q 545.39 184.45 541.60 218.76" stroke={S} strokeWidth="1.8" fill="none" />
        <path d="M 581.24 258.40 Q 615.55 254.61 642.49 260 Q 633.69 286.02 613.25 313.84" stroke={S} strokeWidth="1.8" fill="none" />
      </g>

      {/* Fourth ring — 36 dots at r=220 */}
      <g opacity="0.6">
        <circle cx="620" cy="400" r="4" fill={S} /><circle cx="616.66" cy="438.20" r="4" fill={S} />
        <circle cx="606.73" cy="475.24" r="4" fill={S} /><circle cx="590.53" cy="510" r="4" fill={S} />
        <circle cx="568.53" cy="541.41" r="4" fill={S} /><circle cx="541.41" cy="568.53" r="4" fill={S} />
        <circle cx="510" cy="590.53" r="4" fill={S} /><circle cx="475.24" cy="606.73" r="4" fill={S} />
        <circle cx="438.20" cy="616.66" r="4" fill={S} /><circle cx="400" cy="620" r="4" fill={S} />
        <circle cx="361.80" cy="616.66" r="4" fill={S} /><circle cx="324.76" cy="606.73" r="4" fill={S} />
        <circle cx="290" cy="590.53" r="4" fill={S} /><circle cx="258.59" cy="568.53" r="4" fill={S} />
        <circle cx="231.47" cy="541.41" r="4" fill={S} /><circle cx="209.47" cy="510" r="4" fill={S} />
        <circle cx="193.27" cy="475.24" r="4" fill={S} /><circle cx="183.34" cy="438.20" r="4" fill={S} />
        <circle cx="180" cy="400" r="4" fill={S} /><circle cx="183.34" cy="361.80" r="4" fill={S} />
        <circle cx="193.27" cy="324.76" r="4" fill={S} /><circle cx="209.47" cy="290" r="4" fill={S} />
        <circle cx="231.47" cy="258.59" r="4" fill={S} /><circle cx="258.59" cy="231.47" r="4" fill={S} />
        <circle cx="290" cy="209.47" r="4" fill={S} /><circle cx="324.76" cy="193.27" r="4" fill={S} />
        <circle cx="361.80" cy="183.34" r="4" fill={S} /><circle cx="400" cy="180" r="4" fill={S} />
        <circle cx="438.20" cy="183.34" r="4" fill={S} /><circle cx="475.24" cy="193.27" r="4" fill={S} />
        <circle cx="510" cy="209.47" r="4" fill={S} /><circle cx="541.41" cy="231.47" r="4" fill={S} />
        <circle cx="568.53" cy="258.59" r="4" fill={S} /><circle cx="590.53" cy="290" r="4" fill={S} />
        <circle cx="606.73" cy="324.76" r="4" fill={S} /><circle cx="616.66" cy="361.80" r="4" fill={S} />
      </g>

      {/* Fifth ring — 8 paisley curves (rotate-based, no trig needed) */}
      <g opacity="0.75">
        <circle cx="400" cy="400" r="185" stroke={S} strokeWidth="1.4" />
        <g transform="rotate(0 400 400)"><path d="M 555 400 Q 570 380 585 365 Q 595 382 585 400 Q 575 418 555 400" stroke={S} strokeWidth="1.5" fill="none" /></g>
        <g transform="rotate(45 400 400)"><path d="M 555 400 Q 570 380 585 365 Q 595 382 585 400 Q 575 418 555 400" stroke={S} strokeWidth="1.5" fill="none" /></g>
        <g transform="rotate(90 400 400)"><path d="M 555 400 Q 570 380 585 365 Q 595 382 585 400 Q 575 418 555 400" stroke={S} strokeWidth="1.5" fill="none" /></g>
        <g transform="rotate(135 400 400)"><path d="M 555 400 Q 570 380 585 365 Q 595 382 585 400 Q 575 418 555 400" stroke={S} strokeWidth="1.5" fill="none" /></g>
        <g transform="rotate(180 400 400)"><path d="M 555 400 Q 570 380 585 365 Q 595 382 585 400 Q 575 418 555 400" stroke={S} strokeWidth="1.5" fill="none" /></g>
        <g transform="rotate(225 400 400)"><path d="M 555 400 Q 570 380 585 365 Q 595 382 585 400 Q 575 418 555 400" stroke={S} strokeWidth="1.5" fill="none" /></g>
        <g transform="rotate(270 400 400)"><path d="M 555 400 Q 570 380 585 365 Q 595 382 585 400 Q 575 418 555 400" stroke={S} strokeWidth="1.5" fill="none" /></g>
        <g transform="rotate(315 400 400)"><path d="M 555 400 Q 570 380 585 365 Q 595 382 585 400 Q 575 418 555 400" stroke={S} strokeWidth="1.5" fill="none" /></g>
      </g>

      {/* Inner ring — 8 teardrops */}
      <g opacity="0.7">
        <circle cx="400" cy="400" r="140" stroke={S} strokeWidth="1.4" />
        <path d="M 512.49 376.09 Q 555 400 512.49 423.91" stroke={S} strokeWidth="1.5" fill="none" />
        <path d="M 496.45 462.63 Q 509.60 509.60 462.63 496.45" stroke={S} strokeWidth="1.5" fill="none" />
        <path d="M 423.91 512.49 Q 400 555 376.09 512.49" stroke={S} strokeWidth="1.5" fill="none" />
        <path d="M 337.37 496.45 Q 290.40 509.60 303.55 462.63" stroke={S} strokeWidth="1.5" fill="none" />
        <path d="M 287.51 423.91 Q 245 400 287.51 376.09" stroke={S} strokeWidth="1.5" fill="none" />
        <path d="M 303.55 337.37 Q 290.40 290.40 337.37 303.55" stroke={S} strokeWidth="1.5" fill="none" />
        <path d="M 376.09 287.51 Q 400 245 423.91 287.51" stroke={S} strokeWidth="1.5" fill="none" />
        <path d="M 462.63 303.55 Q 509.60 290.40 496.45 337.37" stroke={S} strokeWidth="1.5" fill="none" />
      </g>

      {/* Core — 16 dots + 6-petal flower */}
      <g opacity="0.8">
        <circle cx="490" cy="400" r="2" fill={S} /><circle cx="483.15" cy="434.44" r="2" fill={S} />
        <circle cx="463.64" cy="463.64" r="2" fill={S} /><circle cx="434.44" cy="483.15" r="2" fill={S} />
        <circle cx="400" cy="490" r="2" fill={S} /><circle cx="365.56" cy="483.15" r="2" fill={S} />
        <circle cx="336.36" cy="463.64" r="2" fill={S} /><circle cx="316.85" cy="434.44" r="2" fill={S} />
        <circle cx="310" cy="400" r="2" fill={S} /><circle cx="316.85" cy="365.56" r="2" fill={S} />
        <circle cx="336.36" cy="336.36" r="2" fill={S} /><circle cx="365.56" cy="316.85" r="2" fill={S} />
        <circle cx="400" cy="310" r="2" fill={S} /><circle cx="434.44" cy="316.85" r="2" fill={S} />
        <circle cx="463.64" cy="336.36" r="2" fill={S} /><circle cx="483.15" cy="365.56" r="2" fill={S} />
        <circle cx="400" cy="400" r="70" stroke={S} strokeWidth="1.4" />
        <ellipse cx="400" cy="362" rx="14" ry="32" transform="rotate(0 400 400)" stroke={S} strokeWidth="1.8" fill="none" />
        <ellipse cx="400" cy="362" rx="14" ry="32" transform="rotate(60 400 400)" stroke={S} strokeWidth="1.8" fill="none" />
        <ellipse cx="400" cy="362" rx="14" ry="32" transform="rotate(120 400 400)" stroke={S} strokeWidth="1.8" fill="none" />
        <ellipse cx="400" cy="362" rx="14" ry="32" transform="rotate(180 400 400)" stroke={S} strokeWidth="1.8" fill="none" />
        <ellipse cx="400" cy="362" rx="14" ry="32" transform="rotate(240 400 400)" stroke={S} strokeWidth="1.8" fill="none" />
        <ellipse cx="400" cy="362" rx="14" ry="32" transform="rotate(300 400 400)" stroke={S} strokeWidth="1.8" fill="none" />
        <circle cx="400" cy="400" r="12" stroke={S} strokeWidth="1" />
        <circle cx="400" cy="400" r="5" fill={S} opacity="0.5" />
      </g>
    </svg>
  )
}

/** Geometric star mandala — bottom-left */
function MandalaGeometric({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 700 700" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Outer octagonal frame */}
      <g opacity="0.85">
        <polygon points="645.64,227.54 645.64,472.46 472.46,645.64 227.54,645.64 54.36,472.46 54.36,227.54 227.54,54.36 472.46,54.36" stroke={S} strokeWidth="1.8" fill="none" />
      </g>

      {/* 8-pointed star — outer */}
      <g opacity="0.8">
        <path d="M 640 350 L 516.30 418.88 L 555.06 555.06" stroke={S} strokeWidth="1.5" fill="none" />
        <path d="M 555.06 555.06 L 418.88 516.30 L 350 640" stroke={S} strokeWidth="1.5" fill="none" />
        <path d="M 350 640 L 281.12 516.30 L 144.94 555.06" stroke={S} strokeWidth="1.5" fill="none" />
        <path d="M 144.94 555.06 L 183.70 418.88 L 60 350" stroke={S} strokeWidth="1.5" fill="none" />
        <path d="M 60 350 L 183.70 281.12 L 144.94 144.94" stroke={S} strokeWidth="1.5" fill="none" />
        <path d="M 144.94 144.94 L 281.12 183.70 L 350 60" stroke={S} strokeWidth="1.5" fill="none" />
        <path d="M 350 60 L 418.88 183.70 L 555.06 144.94" stroke={S} strokeWidth="1.5" fill="none" />
        <path d="M 555.06 144.94 L 516.30 281.12 L 640 350" stroke={S} strokeWidth="1.5" fill="none" />
      </g>

      {/* Concentric circles */}
      <g opacity="0.6">
        <circle cx="350" cy="350" r="250" stroke={S} strokeWidth="1.2" />
        <circle cx="350" cy="350" r="210" stroke={S} strokeWidth="1.2" />
        <circle cx="350" cy="350" r="170" stroke={S} strokeWidth="1.2" />
      </g>

      {/* Diamond lattice — 16 spokes */}
      <g opacity="0.55">
        <line x1="560" y1="350" x2="600" y2="350" stroke={S} strokeWidth="1" />
        <line x1="544.01" y1="430.36" x2="580.97" y2="445.67" stroke={S} strokeWidth="1" />
        <line x1="498.49" y1="498.49" x2="526.78" y2="526.78" stroke={S} strokeWidth="1" />
        <line x1="430.36" y1="544.01" x2="445.67" y2="580.97" stroke={S} strokeWidth="1" />
        <line x1="350" y1="560" x2="350" y2="600" stroke={S} strokeWidth="1" />
        <line x1="269.64" y1="544.01" x2="254.33" y2="580.97" stroke={S} strokeWidth="1" />
        <line x1="201.51" y1="498.49" x2="173.22" y2="526.78" stroke={S} strokeWidth="1" />
        <line x1="155.99" y1="430.36" x2="119.03" y2="445.67" stroke={S} strokeWidth="1" />
        <line x1="140" y1="350" x2="100" y2="350" stroke={S} strokeWidth="1" />
        <line x1="155.99" y1="269.64" x2="119.03" y2="254.33" stroke={S} strokeWidth="1" />
        <line x1="201.51" y1="201.51" x2="173.22" y2="173.22" stroke={S} strokeWidth="1" />
        <line x1="269.64" y1="155.99" x2="254.33" y2="119.03" stroke={S} strokeWidth="1" />
        <line x1="350" y1="140" x2="350" y2="100" stroke={S} strokeWidth="1" />
        <line x1="430.36" y1="155.99" x2="445.67" y2="119.03" stroke={S} strokeWidth="1" />
        <line x1="498.49" y1="201.51" x2="526.78" y2="173.22" stroke={S} strokeWidth="1" />
        <line x1="544.01" y1="269.64" x2="580.97" y2="254.33" stroke={S} strokeWidth="1" />
      </g>

      {/* Inner 8-pointed star — rotated 22.5° */}
      <g opacity="0.75">
        <path d="M 497.82 411.23 L 420.71 420.71 L 411.23 497.82" stroke={S} strokeWidth="1.4" fill="none" />
        <path d="M 411.23 497.82 L 350 450 L 288.77 497.82" stroke={S} strokeWidth="1.4" fill="none" />
        <path d="M 288.77 497.82 L 279.29 420.71 L 202.18 411.23" stroke={S} strokeWidth="1.4" fill="none" />
        <path d="M 202.18 411.23 L 250 350 L 202.18 288.77" stroke={S} strokeWidth="1.4" fill="none" />
        <path d="M 202.18 288.77 L 279.29 279.29 L 288.77 202.18" stroke={S} strokeWidth="1.4" fill="none" />
        <path d="M 288.77 202.18 L 350 250 L 411.23 202.18" stroke={S} strokeWidth="1.4" fill="none" />
        <path d="M 411.23 202.18 L 420.71 279.29 L 497.82 288.77" stroke={S} strokeWidth="1.4" fill="none" />
        <path d="M 497.82 288.77 L 450 350 L 497.82 411.23" stroke={S} strokeWidth="1.4" fill="none" />
      </g>

      {/* Dot ring — 24 at r=130 */}
      <g opacity="0.5">
        <circle cx="480" cy="350" r="2" fill={S} /><circle cx="475.57" cy="383.65" r="2" fill={S} />
        <circle cx="462.58" cy="415" r="2" fill={S} /><circle cx="441.92" cy="441.92" r="2" fill={S} />
        <circle cx="415" cy="462.58" r="2" fill={S} /><circle cx="383.65" cy="475.57" r="2" fill={S} />
        <circle cx="350" cy="480" r="2" fill={S} /><circle cx="316.35" cy="475.57" r="2" fill={S} />
        <circle cx="285" cy="462.58" r="2" fill={S} /><circle cx="258.08" cy="441.92" r="2" fill={S} />
        <circle cx="237.42" cy="415" r="2" fill={S} /><circle cx="224.43" cy="383.65" r="2" fill={S} />
        <circle cx="220" cy="350" r="2" fill={S} /><circle cx="224.43" cy="316.35" r="2" fill={S} />
        <circle cx="237.42" cy="285" r="2" fill={S} /><circle cx="258.08" cy="258.08" r="2" fill={S} />
        <circle cx="285" cy="237.42" r="2" fill={S} /><circle cx="316.35" cy="224.43" r="2" fill={S} />
        <circle cx="350" cy="220" r="2" fill={S} /><circle cx="383.65" cy="224.43" r="2" fill={S} />
        <circle cx="415" cy="237.42" r="2" fill={S} /><circle cx="441.92" cy="258.08" r="2" fill={S} />
        <circle cx="462.58" cy="285" r="2" fill={S} /><circle cx="475.57" cy="316.35" r="2" fill={S} />
      </g>

      {/* Core — nested squares */}
      <g opacity="0.7">
        <rect x="295" y="295" width="110" height="110" stroke={S} strokeWidth="1.4" fill="none" />
        <rect x="305" y="305" width="90" height="90" stroke={S} strokeWidth="1.4" fill="none" transform="rotate(45 350 350)" />
        <circle cx="350" cy="350" r="28" stroke={S} strokeWidth="1.4" />
        <circle cx="350" cy="350" r="8" fill={S} opacity="0.4" />
      </g>
    </svg>
  )
}

/** Lotus bloom mandala — center-right */
function MandalaLotus({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 600 600" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Outer ring — 16 arched petals */}
      <g opacity="0.8">
        <circle cx="300" cy="300" r="275" stroke={S} strokeWidth="1.4" />
        <path d="M 528.74 275.96 Q 570 300 528.74 324.04" stroke={S} strokeWidth="1.5" fill="none" />
        <path d="M 520.53 365.32 Q 549.45 403.32 502.13 409.75" stroke={S} strokeWidth="1.5" fill="none" />
        <path d="M 478.74 444.74 Q 490.92 490.92 444.74 478.74" stroke={S} strokeWidth="1.5" fill="none" />
        <path d="M 409.75 502.13 Q 403.32 549.45 365.32 520.53" stroke={S} strokeWidth="1.5" fill="none" />
        <path d="M 324.04 528.74 Q 300 570 275.96 528.74" stroke={S} strokeWidth="1.5" fill="none" />
        <path d="M 234.68 520.53 Q 196.68 549.45 190.25 502.13" stroke={S} strokeWidth="1.5" fill="none" />
        <path d="M 155.26 478.74 Q 109.08 490.92 121.26 444.74" stroke={S} strokeWidth="1.5" fill="none" />
        <path d="M 97.87 409.75 Q 50.55 403.32 79.47 365.32" stroke={S} strokeWidth="1.5" fill="none" />
        <path d="M 71.26 324.04 Q 30 300 71.26 275.96" stroke={S} strokeWidth="1.5" fill="none" />
        <path d="M 79.47 234.68 Q 50.55 196.68 97.87 190.25" stroke={S} strokeWidth="1.5" fill="none" />
        <path d="M 121.26 155.26 Q 109.08 109.08 155.26 121.26" stroke={S} strokeWidth="1.5" fill="none" />
        <path d="M 190.25 97.87 Q 196.68 50.55 234.68 79.47" stroke={S} strokeWidth="1.5" fill="none" />
        <path d="M 275.96 71.26 Q 300 30 324.04 71.26" stroke={S} strokeWidth="1.5" fill="none" />
        <path d="M 365.32 79.47 Q 403.32 50.55 409.75 97.87" stroke={S} strokeWidth="1.5" fill="none" />
        <path d="M 444.74 121.26 Q 490.92 109.08 478.74 155.26" stroke={S} strokeWidth="1.5" fill="none" />
        <path d="M 502.13 190.25 Q 549.45 196.68 520.53 234.68" stroke={S} strokeWidth="1.5" fill="none" />
      </g>

      {/* Wavy ring — 32 dots */}
      <g opacity="0.5">
        <circle cx="515" cy="300" r="3" fill={S} /><circle cx="518.72" cy="343.51" r="3" fill={S} />
        <circle cx="498.63" cy="382.28" r="3" fill={S} /><circle cx="472.11" cy="415" r="3" fill={S} />
        <circle cx="452.03" cy="452.03" r="3" fill={S} /><circle cx="423.89" cy="485.42" r="3" fill={S} />
        <circle cx="382.28" cy="498.63" r="3" fill={S} /><circle cx="340.38" cy="503.02" r="3" fill={S} />
        <circle cx="300" cy="515" r="3" fill={S} /><circle cx="256.49" cy="518.72" r="3" fill={S} />
        <circle cx="217.72" cy="498.63" r="3" fill={S} /><circle cx="185" cy="472.11" r="3" fill={S} />
        <circle cx="147.97" cy="452.03" r="3" fill={S} /><circle cx="114.58" cy="423.89" r="3" fill={S} />
        <circle cx="101.37" cy="382.28" r="3" fill={S} /><circle cx="96.98" cy="340.38" r="3" fill={S} />
        <circle cx="85" cy="300" r="3" fill={S} /><circle cx="81.28" cy="256.49" r="3" fill={S} />
        <circle cx="101.37" cy="217.72" r="3" fill={S} /><circle cx="127.89" cy="185" r="3" fill={S} />
        <circle cx="147.97" cy="147.97" r="3" fill={S} /><circle cx="176.11" cy="114.58" r="3" fill={S} />
        <circle cx="217.72" cy="101.37" r="3" fill={S} /><circle cx="259.62" cy="96.98" r="3" fill={S} />
        <circle cx="300" cy="85" r="3" fill={S} /><circle cx="343.51" cy="81.28" r="3" fill={S} />
        <circle cx="382.28" cy="101.37" r="3" fill={S} /><circle cx="415" cy="127.89" r="3" fill={S} />
        <circle cx="452.03" cy="147.97" r="3" fill={S} /><circle cx="485.42" cy="176.11" r="3" fill={S} />
        <circle cx="498.63" cy="217.72" r="3" fill={S} /><circle cx="503.02" cy="259.62" r="3" fill={S} />
      </g>

      {/* Mid lotus — 10 petals (rotate-based) */}
      <g opacity="0.75">
        <circle cx="300" cy="300" r="190" stroke={S} strokeWidth="1.2" />
        <ellipse cx="300" cy="145" rx="22" ry="50" transform="rotate(0 300 300)" stroke={S} strokeWidth="1.5" fill="none" />
        <ellipse cx="300" cy="145" rx="22" ry="50" transform="rotate(36 300 300)" stroke={S} strokeWidth="1.5" fill="none" />
        <ellipse cx="300" cy="145" rx="22" ry="50" transform="rotate(72 300 300)" stroke={S} strokeWidth="1.5" fill="none" />
        <ellipse cx="300" cy="145" rx="22" ry="50" transform="rotate(108 300 300)" stroke={S} strokeWidth="1.5" fill="none" />
        <ellipse cx="300" cy="145" rx="22" ry="50" transform="rotate(144 300 300)" stroke={S} strokeWidth="1.5" fill="none" />
        <ellipse cx="300" cy="145" rx="22" ry="50" transform="rotate(180 300 300)" stroke={S} strokeWidth="1.5" fill="none" />
        <ellipse cx="300" cy="145" rx="22" ry="50" transform="rotate(216 300 300)" stroke={S} strokeWidth="1.5" fill="none" />
        <ellipse cx="300" cy="145" rx="22" ry="50" transform="rotate(252 300 300)" stroke={S} strokeWidth="1.5" fill="none" />
        <ellipse cx="300" cy="145" rx="22" ry="50" transform="rotate(288 300 300)" stroke={S} strokeWidth="1.5" fill="none" />
        <ellipse cx="300" cy="145" rx="22" ry="50" transform="rotate(324 300 300)" stroke={S} strokeWidth="1.5" fill="none" />
      </g>

      {/* Chain ring — 20 circles at r=135 */}
      <g opacity="0.45">
        <circle cx="435" cy="300" r="10" stroke={S} strokeWidth="1" fill="none" />
        <circle cx="428.39" cy="341.72" r="10" stroke={S} strokeWidth="1" fill="none" />
        <circle cx="409.22" cy="379.35" r="10" stroke={S} strokeWidth="1" fill="none" />
        <circle cx="379.35" cy="409.22" r="10" stroke={S} strokeWidth="1" fill="none" />
        <circle cx="341.72" cy="428.39" r="10" stroke={S} strokeWidth="1" fill="none" />
        <circle cx="300" cy="435" r="10" stroke={S} strokeWidth="1" fill="none" />
        <circle cx="258.28" cy="428.39" r="10" stroke={S} strokeWidth="1" fill="none" />
        <circle cx="220.65" cy="409.22" r="10" stroke={S} strokeWidth="1" fill="none" />
        <circle cx="190.78" cy="379.35" r="10" stroke={S} strokeWidth="1" fill="none" />
        <circle cx="171.61" cy="341.72" r="10" stroke={S} strokeWidth="1" fill="none" />
        <circle cx="165" cy="300" r="10" stroke={S} strokeWidth="1" fill="none" />
        <circle cx="171.61" cy="258.28" r="10" stroke={S} strokeWidth="1" fill="none" />
        <circle cx="190.78" cy="220.65" r="10" stroke={S} strokeWidth="1" fill="none" />
        <circle cx="220.65" cy="190.78" r="10" stroke={S} strokeWidth="1" fill="none" />
        <circle cx="258.28" cy="171.61" r="10" stroke={S} strokeWidth="1" fill="none" />
        <circle cx="300" cy="165" r="10" stroke={S} strokeWidth="1" fill="none" />
        <circle cx="341.72" cy="171.61" r="10" stroke={S} strokeWidth="1" fill="none" />
        <circle cx="379.35" cy="190.78" r="10" stroke={S} strokeWidth="1" fill="none" />
        <circle cx="409.22" cy="220.65" r="10" stroke={S} strokeWidth="1" fill="none" />
        <circle cx="428.39" cy="258.28" r="10" stroke={S} strokeWidth="1" fill="none" />
      </g>

      {/* Inner bloom — 8 wide petals (rotate-based) */}
      <g opacity="0.7">
        <ellipse cx="300" cy="220" rx="18" ry="45" transform="rotate(0 300 300)" stroke={S} strokeWidth="1.5" fill="none" />
        <ellipse cx="300" cy="220" rx="18" ry="45" transform="rotate(45 300 300)" stroke={S} strokeWidth="1.5" fill="none" />
        <ellipse cx="300" cy="220" rx="18" ry="45" transform="rotate(90 300 300)" stroke={S} strokeWidth="1.5" fill="none" />
        <ellipse cx="300" cy="220" rx="18" ry="45" transform="rotate(135 300 300)" stroke={S} strokeWidth="1.5" fill="none" />
        <ellipse cx="300" cy="220" rx="18" ry="45" transform="rotate(180 300 300)" stroke={S} strokeWidth="1.5" fill="none" />
        <ellipse cx="300" cy="220" rx="18" ry="45" transform="rotate(225 300 300)" stroke={S} strokeWidth="1.5" fill="none" />
        <ellipse cx="300" cy="220" rx="18" ry="45" transform="rotate(270 300 300)" stroke={S} strokeWidth="1.5" fill="none" />
        <ellipse cx="300" cy="220" rx="18" ry="45" transform="rotate(315 300 300)" stroke={S} strokeWidth="1.5" fill="none" />
        <circle cx="300" cy="300" r="50" stroke={S} strokeWidth="1.2" />
      </g>

      {/* Core — 6-petal flower (rotate-based) */}
      <g opacity="0.65">
        <ellipse cx="300" cy="275" rx="10" ry="22" transform="rotate(0 300 300)" stroke={S} strokeWidth="1.4" fill="none" />
        <ellipse cx="300" cy="275" rx="10" ry="22" transform="rotate(60 300 300)" stroke={S} strokeWidth="1.4" fill="none" />
        <ellipse cx="300" cy="275" rx="10" ry="22" transform="rotate(120 300 300)" stroke={S} strokeWidth="1.4" fill="none" />
        <ellipse cx="300" cy="275" rx="10" ry="22" transform="rotate(180 300 300)" stroke={S} strokeWidth="1.4" fill="none" />
        <ellipse cx="300" cy="275" rx="10" ry="22" transform="rotate(240 300 300)" stroke={S} strokeWidth="1.4" fill="none" />
        <ellipse cx="300" cy="275" rx="10" ry="22" transform="rotate(300 300 300)" stroke={S} strokeWidth="1.4" fill="none" />
        <circle cx="300" cy="300" r="10" stroke={S} strokeWidth="1.5" />
        <circle cx="300" cy="300" r="4" fill={S} opacity="0.4" />
      </g>
    </svg>
  )
}

// --- Mandala placement config ---

interface MandalaConfig {
  id: string
  Component: React.FC<{ className?: string }>
  positionClass: string
  depthRate: number
  opacity: number
}

const MANDALAS: MandalaConfig[] = [
  {
    id: 'rings-top-right',
    Component: MandalaRings,
    positionClass: 'w-[600px] h-[600px] md:w-[800px] md:h-[800px] -top-20 -right-24 md:-top-32 md:-right-40',
    depthRate: -0.04,
    opacity: 0.35,
  },
  {
    id: 'geometric-bottom-left',
    Component: MandalaGeometric,
    positionClass: 'w-[500px] h-[500px] md:w-[700px] md:h-[700px] top-[30vh] -left-20 md:top-[25vh] md:-left-32',
    depthRate: -0.065,
    opacity: 0.3,
  },
  {
    id: 'lotus-bottom-right',
    Component: MandalaLotus,
    positionClass: 'w-[450px] h-[450px] md:w-[620px] md:h-[620px] -bottom-16 -right-16 md:-bottom-24 md:-right-28',
    depthRate: -0.08,
    opacity: 0.35,
  },
]

// --- Main component ---

export function MandalaBackground() {
  const [scrollY, setScrollY] = useState(0)
  const rafRef = useRef(0)
  const reducedMotionRef = useRef(false)

  useEffect(() => {
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)')
    reducedMotionRef.current = mql.matches

    if (mql.matches) return

    let ticking = false

    const onScroll = () => {
      if (ticking) return
      ticking = true
      rafRef.current = requestAnimationFrame(() => {
        setScrollY(window.scrollY)
        ticking = false
      })
    }

    window.addEventListener('scroll', onScroll, { passive: true })

    const onChange = (e: MediaQueryListEvent) => {
      reducedMotionRef.current = e.matches
      if (e.matches) {
        cancelAnimationFrame(rafRef.current)
        setScrollY(0)
      }
    }
    mql.addEventListener('change', onChange)

    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('scroll', onScroll)
      mql.removeEventListener('change', onChange)
    }
  }, [])

  return (
    <div
      className="fixed inset-0 z-[1] pointer-events-none overflow-hidden"
      aria-hidden="true"
    >
      {MANDALAS.map(({ id, Component, positionClass, depthRate, opacity }) => (
        <div
          key={id}
          className={`absolute ${positionClass}`}
          style={{
            opacity,
            transform: `translateY(${scrollY * depthRate}px)`,
            willChange: 'transform',
          }}
        >
          <Component className="w-full h-full" />
        </div>
      ))}
    </div>
  )
}
