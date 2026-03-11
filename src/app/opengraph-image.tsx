import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const alt = 'Yogi & Sudha Wedding Invitation'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default async function Image() {
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
          backgroundColor: '#800020',
          fontFamily: 'serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            border: '4px solid #D4AF37',
            borderRadius: '16px',
            padding: '48px 80px',
          }}
        >
          <div
            style={{
              fontSize: 72,
              color: '#D4AF37',
              fontWeight: 700,
              lineHeight: 1.2,
            }}
          >
            Yogi & Sudha
          </div>
          <div
            style={{
              fontSize: 28,
              color: '#E8CC6E',
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
              backgroundColor: '#D4AF37',
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
