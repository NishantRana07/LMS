'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Sidebar } from '@/components/sidebar'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, Mail, Eye, ExternalLink, Trash2 } from 'lucide-react'
import { getCurrentUser, getEmails, initializeStorage } from '@/lib/storage'
import Link from 'next/link'

interface EmailWithStats {
  id: string
  subject: string
  recipientEmail: string
  sentAt: string
  opened: boolean
  openedAt?: string
  clickCount: number
}

export default function AdminEmails() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [emails, setEmails] = useState<EmailWithStats[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    initializeStorage()
    const currentUser = getCurrentUser()
    
    if (!currentUser || currentUser.role !== 'admin') {
      router.push('/login')
      return
    }

    setUser(currentUser)

    const allEmails = getEmails(currentUser.id)
    const emailStats = allEmails.map((e) => ({
      id: e.id,
      subject: e.subject,
      recipientEmail: e.recipientEmail,
      sentAt: e.sentAt,
      opened: e.opened,
      openedAt: e.openedAt,
      clickCount: e.links.filter((l) => l.clicked).length,
    }))

    setEmails(emailStats)
    setLoading(false)
  }, [router])

  if (loading || !user) {
    return <div className="flex items-center justify-center h-screen bg-background">Loading...</div>
  }

  const openedCount = emails.filter((e) => e.opened).length
  const openRate = emails.length > 0 ? Math.round((openedCount / emails.length) * 100) : 0
  const totalClicks = emails.reduce((sum, e) => sum + e.clickCount, 0)

  return (
    <div className="flex h-screen bg-background">
      <Sidebar userRole={user.role} userName={user.name} />

      <main className="flex-1 ml-64 overflow-auto">
        <div className="p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold text-foreground">Email Campaigns</h1>
              <p className="text-muted-foreground mt-2">Manage your email campaigns and track engagement</p>
            </div>
            <Link href="/admin/emails/send">
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Send Email
              </Button>
            </Link>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <Card className="p-6 bg-card border border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Sent</p>
                  <p className="text-3xl font-bold text-foreground mt-2">{emails.length}</p>
                </div>
                <Mail className="h-8 w-8 text-primary/50" />
              </div>
            </Card>

            <Card className="p-6 bg-card border border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Opened</p>
                  <p className="text-3xl font-bold text-foreground mt-2">{openedCount}</p>
                  <p className="text-xs text-muted-foreground mt-1">{openRate}% open rate</p>
                </div>
                <Eye className="h-8 w-8 text-primary/50" />
              </div>
            </Card>

            <Card className="p-6 bg-card border border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Clicks</p>
                  <p className="text-3xl font-bold text-foreground mt-2">{totalClicks}</p>
                </div>
                <ExternalLink className="h-8 w-8 text-primary/50" />
              </div>
            </Card>
          </div>

          {/* Emails List */}
          <Card className="bg-card border border-border">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">Recent Campaigns</h2>
              
              {emails.length === 0 ? (
                <div className="text-center py-12">
                  <Mail className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                  <p className="text-muted-foreground">No emails sent yet</p>
                  <Link href="/admin/emails/send" className="mt-4 inline-block">
                    <Button>Send Your First Email</Button>
                  </Link>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-4 font-semibold text-foreground">Subject</th>
                        <th className="text-left py-3 px-4 font-semibold text-foreground">Recipient</th>
                        <th className="text-left py-3 px-4 font-semibold text-foreground">Sent</th>
                        <th className="text-left py-3 px-4 font-semibold text-foreground">Status</th>
                        <th className="text-left py-3 px-4 font-semibold text-foreground">Clicks</th>
                        <th className="text-left py-3 px-4 font-semibold text-foreground">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {emails.map((email) => (
                        <tr key={email.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                          <td className="py-3 px-4 text-foreground">{email.subject}</td>
                          <td className="py-3 px-4 text-foreground">{email.recipientEmail}</td>
                          <td className="py-3 px-4 text-sm text-muted-foreground">
                            {new Date(email.sentAt).toLocaleDateString()}
                          </td>
                          <td className="py-3 px-4">
                            {email.opened ? (
                              <span className="inline-block px-3 py-1 text-xs font-medium bg-accent/20 text-accent rounded-full">
                                Opened
                              </span>
                            ) : (
                              <span className="inline-block px-3 py-1 text-xs font-medium bg-muted text-muted-foreground rounded-full">
                                Not opened
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-foreground font-medium">{email.clickCount}</td>
                          <td className="py-3 px-4">
                            <div className="flex gap-2">
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-destructive">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </Card>
        </div>
      </main>
    </div>
  )
}
