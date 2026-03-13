import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const alt = 'Yogi & Sudha Wedding Invitation'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default async function Image() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

  let photoSrc: ArrayBuffer | null = null
  try {
    const res = await fetch(`${baseUrl}/images/og-couple.jpg`, {
      cache: 'force-cache',
    })
    if (res.ok) photoSrc = await res.arrayBuffer()
  } catch {
    /* fallback to maroon design */
  }

  // Photo-based OG image with dark overlay and gold text
  if (photoSrc) {
    return new ImageResponse(
      (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            position: 'relative',
          }}
        >
          {/* Background photo */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={photoSrc as unknown as string}
            alt=""
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              position: 'absolute',
              top: 0,
              left: 0,
            }}
          />

          {/* Dark overlay */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundColor: 'rgba(0,0,0,0.55)',
              display: 'flex',
            }}
          />

          {/* Gold text overlay */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'serif',
            }}
          >
            <div
              style={{
                fontSize: 72,
                color: '#FB8B24',
                fontWeight: 700,
                lineHeight: 1.2,
                textShadow: '0 2px 12px rgba(0,0,0,0.5)',
              }}
            >
              Yogi & Sudha
            </div>
            <div
              style={{
                fontSize: 28,
                color: '#FCA84E',
                marginTop: 16,
                letterSpacing: '0.1em',
                textShadow: '0 1px 6px rgba(0,0,0,0.4)',
              }}
            >
              28 April 2026
            </div>
            <div
              style={{
                width: 200,
                height: 2,
                backgroundColor: '#FB8B24',
                marginTop: 24,
                marginBottom: 24,
              }}
            />
            <div
              style={{
                fontSize: 22,
                color: '#F5E6D3',
                letterSpacing: '0.15em',
                textTransform: 'uppercase' as const,
                textShadow: '0 1px 6px rgba(0,0,0,0.4)',
              }}
            >
              Wedding Celebration
            </div>
          </div>
        </div>
      ),
      {
        ...size,
      }
    )
  }

  // Fallback: maroon background with gold border design (no photo available)
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#5F0F40',
          fontFamily: 'serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            border: '4px solid #FB8B24',
            borderRadius: '16px',
            padding: '48px 80px',
          }}
        >
          <div
            style={{
              fontSize: 72,
              color: '#FB8B24',
              fontWeight: 700,
              lineHeight: 1.2,
            }}
          >
            Yogi & Sudha
          </div>
          <div
            style={{
              fontSize: 28,
              color: '#FCA84E',
              marginTop: 16,
              letterSpacing: '0.1em',
            }}
          >
            28 April 2026
          </div>
          <div
            style={{
              width: 200,
              height: 2,
              backgroundColor: '#FB8B24',
              marginTop: 24,
              marginBottom: 24,
            }}
          />
          <div
            style={{
              fontSize: 22,
              color: '#F5E6D3',
              letterSpacing: '0.15em',
              textTransform: 'uppercase' as const,
            }}
          >
            Wedding Celebration
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
