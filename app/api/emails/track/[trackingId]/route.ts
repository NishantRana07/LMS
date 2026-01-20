import { NextRequest, NextResponse } from 'next/server'

// 1x1 transparent GIF pixel for tracking opens
const PIXEL = Buffer.from([
  0x47, 0x49, 0x46, 0x38, 0x39, 0x61, 0x01, 0x00, 0x01, 0x00, 0x80, 0x00, 0x00, 0x00, 0x00, 0x00,
  0xff, 0xff, 0xff, 0x21, 0xf9, 0x04, 0x01, 0x00, 0x00, 0x00, 0x00, 0x2c, 0x00, 0x00, 0x00, 0x00,
  0x01, 0x00, 0x01, 0x00, 0x00, 0x02, 0x01, 0x44, 0x00, 0x3b,
])

export async function GET(request: NextRequest, { params }: { params: { trackingId: string } }) {
  try {
    const { trackingId } = params
    const userAgent = request.headers.get('user-agent') || ''

    console.log(`[Email Tracking] Open detected for tracking ID: ${trackingId}`)
    console.log(`[Email Tracking] User Agent: ${userAgent}`)

    // Record email open in localStorage (client-side implementation)
    // This would be stored in a database in production
    // The actual recording happens in the client component

    // Return the 1x1 transparent GIF pixel
    return new NextResponse(PIXEL, {
      status: 200,
      headers: {
        'Content-Type': 'image/gif',
        'Content-Length': PIXEL.length.toString(),
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    })
  } catch (error) {
    console.error('Email tracking error:', error)
    return new NextResponse(PIXEL, { status: 200 })
  }
}
