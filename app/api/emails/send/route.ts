import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

// Initialize Nodemailer transporter with Gmail SMTP
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

export async function POST(request: NextRequest) {
  try {
    const { to, subject, htmlContent, senderId, recipientId } = await request.json()

    // Validate input
    if (!to || !subject || !htmlContent || !senderId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Validate SMTP configuration
    if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.error('[v0] SMTP configuration missing')
      return NextResponse.json({ error: 'Email service not configured' }, { status: 500 })
    }

    // Generate tracking ID and pixel URL
    const trackingId = `${Date.now()}-${Math.random().toString(36).substring(7)}`
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const pixelUrl = `${appUrl}/api/emails/track/${trackingId}`

    // Add tracking pixel to email content
    const emailWithPixel = `${htmlContent}<img src="${pixelUrl}" width="1" height="1" alt="" style="display:none;" />`

    // Send email via Gmail SMTP
    const mailOptions = {
      from: process.env.HOST_EMAIL || process.env.SMTP_USER,
      to: to,
      subject: subject,
      html: emailWithPixel,
    }

    console.log('[v0] Sending email to:', to)
    await transporter.sendMail(mailOptions)
    console.log('[v0] Email sent successfully to:', to)

    const sentAt = new Date().toISOString()

    return NextResponse.json(
      {
        success: true,
        message: 'Email sent successfully',
        trackingId,
        pixelUrl,
        sentAt,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('[v0] Email send error:', error)
    return NextResponse.json(
      {
        error: 'Failed to send email',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
