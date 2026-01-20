'use client'

import React from "react"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Sidebar } from '@/components/sidebar'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Send, Users } from 'lucide-react'
import { getCurrentUser, createEmail, initializeStorage, getAllUsers, getUsersByRole, getAllUserEmails, getUserEmailsByRole, type User } from '@/lib/storage'
import Link from 'next/link'

export default function SendEmail() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [formData, setFormData] = useState({
    recipientEmail: '',
    subject: '',
    htmlContent: '',
    recipientType: 'individual' as 'individual' | 'role' | 'all',
    selectedRole: 'employee' as User['role'],
    selectedRecipients: [] as string[]
  })
  const [success, setSuccess] = useState(false)
  const [allUsers, setAllUsers] = useState<User[]>([])

  useEffect(() => {
    initializeStorage()
    const currentUser = getCurrentUser()
    
    if (!currentUser || currentUser.role !== 'admin') {
      router.push('/login')
      return
    }

    setUser(currentUser)
    setAllUsers(getAllUsers())
    setLoading(false)
  }, [router])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleRecipientTypeChange = (type: 'individual' | 'role' | 'all') => {
    setFormData(prev => ({
      ...prev,
      recipientType: type,
      recipientEmail: type === 'individual' ? prev.recipientEmail : ''
    }))
  }

  const getRecipientEmails = (): string[] => {
    switch (formData.recipientType) {
      case 'all':
        return getAllUserEmails()
      case 'role':
        return getUserEmailsByRole(formData.selectedRole)
      case 'individual':
        return formData.recipientEmail ? [formData.recipientEmail] : []
      default:
        return []
    }
  }

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const recipientEmails = getRecipientEmails()
    
    if (recipientEmails.length === 0 || !formData.subject || !formData.htmlContent) {
      alert('Please fill in all fields and select valid recipients')
      return
    }

    setSending(true)

    try {
      // Send email via API with Nodemailer for each recipient
      const emailPromises = recipientEmails.map(async (recipientEmail) => {
        const response = await fetch('/api/emails/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: recipientEmail,
            subject: formData.subject,
            htmlContent: formData.htmlContent,
            senderId: user.id,
          }),
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || 'Failed to send email')
        }

        return response.json()
      })

      const results = await Promise.all(emailPromises)
      console.log('[v0] Emails sent successfully:', results)

      // Create email records in storage for tracking
      results.forEach((result, index) => {
        const emailData = {
          trackingId: result.trackingId,
          senderId: user.id,
          recipientEmail: recipientEmails[index],
          subject: formData.subject,
          htmlContent: formData.htmlContent,
          links: [
            {
              id: `link-${Date.now()}-${index}`,
              emailId: '',
              originalUrl: 'https://example.com',
              trackingUrl: result.pixelUrl,
              clicked: false,
              clickCount: 0,
            },
          ],
        }

        // Create email in storage for analytics
        createEmail(emailData)
      })

      setSuccess(true)
      setFormData({ 
        recipientEmail: '', 
        subject: '', 
        htmlContent: '',
        recipientType: 'individual',
        selectedRole: 'employee',
        selectedRecipients: []
      })
      
      setTimeout(() => {
        router.push('/admin/emails')
      }, 2000)
    } catch (error) {
      console.error('[v0] Error sending email:', error)
      alert(error instanceof Error ? error.message : 'Failed to send email')
    } finally {
      setSending(false)
    }
  }

  if (loading || !user) {
    return <div className="flex items-center justify-center h-screen bg-background">Loading...</div>
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar userRole={user.role} userName={user.name} />

      <main className="flex-1 ml-64 overflow-auto">
        <div className="p-8 max-w-2xl">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Link href="/admin/emails">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-4xl font-bold text-foreground">Send Email</h1>
              <p className="text-muted-foreground mt-2">Create and send an email campaign with tracking</p>
            </div>
          </div>

          {success && (
            <Card className="p-4 bg-accent/10 border border-accent mb-6">
              <p className="text-sm font-medium text-accent">Email sent successfully! Redirecting...</p>
            </Card>
          )}

          <Card className="p-8 bg-card border border-border">
            <form onSubmit={handleSendEmail} className="space-y-6">
              {/* Recipient Selection */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Recipient Type</label>
                <div className="flex gap-3 mb-4">
                  <Button
                    type="button"
                    variant={formData.recipientType === 'individual' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleRecipientTypeChange('individual')}
                  >
                    Individual
                  </Button>
                  <Button
                    type="button"
                    variant={formData.recipientType === 'role' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleRecipientTypeChange('role')}
                  >
                    By Role
                  </Button>
                  <Button
                    type="button"
                    variant={formData.recipientType === 'all' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleRecipientTypeChange('all')}
                  >
                    All Users
                  </Button>
                </div>

                {formData.recipientType === 'individual' && (
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Recipient Email</label>
                    <input
                      type="email"
                      name="recipientEmail"
                      value={formData.recipientEmail}
                      onChange={handleInputChange}
                      placeholder="recipient@example.com"
                      className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                    />
                  </div>
                )}

                {formData.recipientType === 'role' && (
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Select Role</label>
                    <select
                      name="selectedRole"
                      value={formData.selectedRole}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="admin">Admin</option>
                      <option value="employee">Employee</option>
                      <option value="technical_team">Technical Team</option>
                      <option value="developer">Developer</option>
                      <option value="content_team">Content Team</option>
                    </select>
                    <p className="text-xs text-muted-foreground mt-2">
                      This will send to {getUserEmailsByRole(formData.selectedRole).length} users
                    </p>
                  </div>
                )}

                {formData.recipientType === 'all' && (
                  <div>
                    <p className="text-sm text-muted-foreground">
                      This will send to <strong>{getAllUserEmails().length}</strong> users
                    </p>
                  </div>
                )}
              </div>

              {/* Subject */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Subject</label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  placeholder="Email subject"
                  className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>

              {/* Email Content */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Email Content (HTML)</label>
                <textarea
                  name="htmlContent"
                  value={formData.htmlContent}
                  onChange={handleInputChange}
                  placeholder="<h1>Hello!</h1><p>Your email content here...</p>"
                  rows={10}
                  className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary font-mono text-sm"
                  required
                />
                <p className="text-xs text-muted-foreground mt-2">
                  A tracking pixel will automatically be added to detect opens. Links will be tracked for clicks.
                </p>
              </div>

              {/* Tracking Info */}
              <Card className="p-4 bg-muted/30 border border-border">
                <p className="text-sm text-foreground">
                  <span className="font-semibold">📊 Email Tracking Enabled:</span>
                </p>
                <ul className="text-xs text-muted-foreground mt-2 space-y-1 ml-4">
                  <li>✓ Open tracking via pixel</li>
                  <li>✓ Click tracking on links</li>
                  <li>✓ Recipient engagement analytics</li>
                </ul>
              </Card>

              {/* Submit Button */}
              <div className="flex gap-3 pt-6 border-t border-border">
                <Button
                  type="submit"
                  disabled={sending || success}
                  className="gap-2"
                >
                  <Send className="h-4 w-4" />
                  {sending ? 'Sending...' : 'Send Email'}
                </Button>
                <Link href="/admin/emails">
                  <Button variant="outline">Cancel</Button>
                </Link>
              </div>
            </form>
          </Card>
        </div>
      </main>
    </div>
  )
}
