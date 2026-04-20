import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'ScaleMind — MicroSaaS, Automação e Renda Online'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OgImage() {
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
          background: 'linear-gradient(135deg, #0c4a6e 0%, #0ea5e9 50%, #7c3aed 100%)',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ fontSize: 80, fontWeight: 900, color: 'white', marginBottom: 24 }}>
          ScaleMind
        </div>
        <div style={{ fontSize: 32, color: 'rgba(255,255,255,0.85)', textAlign: 'center', maxWidth: 800 }}>
          MicroSaaS · Automação · Finanças · Renda Online
        </div>
      </div>
    ),
    { ...size }
  )
}
