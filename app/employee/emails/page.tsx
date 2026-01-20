'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Sidebar } from '@/components/sidebar'
import { Card } from '@/components/ui/card'
import { Mail, Eye, ExternalLink, Inbox } from 'lucide-react'
import { getCurrentUser, getEmails, initializeStorage } from '@/lib/storage'

interface ReceivedEmail {
  id: string
  subject: string
  senderEmail: string
  sentAt: string
  opened: boolean
  clickCount: number
}

export default function EmployeeEmails() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [emails, setEmails] = useState<ReceivedEmail[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    initializeStorage()
    const currentUser = getCurrentUser()
    
    if (!currentUser || currentUser.role !== 'employee') {
      router.push('/login')
      return
    }

    setUser(currentUser)

    // Get emails sent to this employee (demo: all emails)
    const allEmails = getEmails()
    const receivedEmails = allEmails
      .filter((e) => e.recipientEmail === currentUser.email || e.recipientId === currentUser.id)
      .map((e) => ({
        id: e.id,
        subject: e.subject,
        senderEmail: e.senderId, // In production, would get sender name
        sentAt: e.sentAt,
        opened: e.opened,
        clickCount: e.links.filter((l) => l.clicked).length,
      }))

    setEmails(receivedEmails)
    setLoading(false)
  }, [router])

  if (loading || !user) {
    return <div className="flex items-center justify-center h-screen bg-background">Loading...</div>
  }

  const openedCount = emails.filter((e) => e.opened).length
  const openRate = emails.length > 0 ? Math.round((openedCount / emails.length) * 100) : 0

  return (
    <div className="flex h-screen bg-background">
      <Sidebar userRole={user.role} userName={user.name} />

      <main className="flex-1 ml-64 overflow-auto">
        <div className="p-8">
          {/* Header */}
          <div>
            <h1 className="text-4xl font-bold text-foreground">Inbox</h1>
            <p className="text-muted-foreground mt-2">Your received emails and campaigns</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8 mb-8">
            <Card className="p-6 bg-card border border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Emails</p>
                  <p className="text-3xl font-bold text-foreground mt-2">{emails.length}</p>
                </div>
                <Inbox className="h-8 w-8 text-primary/50" />
              </div>
            </Card>

            <Card className="p-6 bg-card border border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Opened</p>
                  <p className="text-3xl font-bold text-foreground mt-2">{openedCount}</p>
                </div>
                <Eye className="h-8 w-8 text-primary/50" />
              </div>
            </Card>

            <Card className="p-6 bg-card border border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Click Rate</p>
                  <p className="text-3xl font-bold text-foreground mt-2">{openRate}%</p>
                </div>
                <ExternalLink className="h-8 w-8 text-primary/50" />
              </div>
            </Card>
          </div>

          {/* Emails List */}
          <Card className="bg-card border border-border">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">Messages</h2>
              
              {emails.length === 0 ? (
                <div className="text-center py-12">
                  <Mail className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                  <p className="text-muted-foreground">No emails received yet</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-4 font-semibold text-foreground">Subject</th>
                        <th className="text-left py-3 px-4 font-semibold text-foreground">From</th>
                        <th className="text-left py-3 px-4 font-semibold text-foreground">Date</th>
                        <th className="text-left py-3 px-4 font-semibold text-foreground">Status</th>
                        <th className="text-left py-3 px-4 font-semibold text-foreground">Interactions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {emails.map((email) => (
                        <tr key={email.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                          <td className="py-3 px-4 text-foreground font-medium">{email.subject}</td>
                          <td className="py-3 px-4 text-foreground text-sm">QEdge Admin</td>
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
                                Unread
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Eye className="h-4 w-4" />
                              {email.opened ? 'Viewed' : 'Not viewed'} · {email.clickCount} clicks
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
