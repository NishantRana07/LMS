import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest, { params }: { params: { trackingId: string } }) {
  try {
    const { trackingId } = params
    const searchParams = request.nextUrl.searchParams
    const originalUrl = searchParams.get('url')
    const linkId = searchParams.get('linkId')
    const emailId = searchParams.get('emailId')

    console.log(`[Email Click Tracking] Click detected`)
    console.log(`[Email Tracking] Tracking ID: ${trackingId}`)
    console.log(`[Email Tracking] Link ID: ${linkId}`)
    console.log(`[Email Tracking] Original URL: ${originalUrl}`)

    // Record the click event in localStorage (client-side implementation)
    // This would be stored in a database in production

    // Redirect to the original URL
    if (originalUrl) {
      try {
        new URL(originalUrl) // Validate URL
        return NextResponse.redirect(originalUrl, { status: 302 })
      } catch (e) {
        console.error('Invalid URL provided:', originalUrl)
        return NextResponse.json({ error: 'Invalid URL' }, { status: 400 })
      }
    }

    return NextResponse.json({ error: 'No URL provided' }, { status: 400 })
  } catch (error) {
    console.error('Email click tracking error:', error)
    return NextResponse.json({ error: 'Tracking failed' }, { status: 500 })
  }
}
