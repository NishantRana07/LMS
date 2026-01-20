'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Sidebar } from '@/components/sidebar'
import { Card } from '@/components/ui/card'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { getCurrentUser, getEmails, getMeetings, getEmailStats, initializeStorage } from '@/lib/storage'
import { Mail, Eye, ExternalLink, Calendar, Users } from 'lucide-react'

export default function AdminAnalytics() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [emailStats, setEmailStats] = useState<any>(null)
  const [chartData, setChartData] = useState<any[]>([])

  useEffect(() => {
    initializeStorage()
    const currentUser = getCurrentUser()
    
    if (!currentUser || currentUser.role !== 'admin') {
      router.push('/login')
      return
    }

    setUser(currentUser)

    const stats = getEmailStats(currentUser.id)
    setEmailStats(stats)

    // Generate demo data for charts
    const data = [
      { name: 'Week 1', sent: 24, opened: 12, clicked: 4 },
      { name: 'Week 2', sent: 32, opened: 18, clicked: 7 },
      { name: 'Week 3', sent: 28, opened: 16, clicked: 6 },
      { name: 'Week 4', sent: 35, opened: 21, clicked: 9 },
    ]
    setChartData(data)

    setLoading(false)
  }, [router])

  if (loading || !user || !emailStats) {
    return <div className="flex items-center justify-center h-screen bg-background">Loading...</div>
  }

  const pieData = [
    { name: 'Opened', value: emailStats.totalOpened },
    { name: 'Not Opened', value: Math.max(0, emailStats.totalSent - emailStats.totalOpened) },
  ]

  const COLORS = ['#7c3aed', '#e5e7eb']

  return (
    <div className="flex h-screen bg-background">
      <Sidebar userRole={user.role} userName={user.name} />

      <main className="flex-1 ml-64 overflow-auto">
        <div className="p-8">
          {/* Header */}
          <div>
            <h1 className="text-4xl font-bold text-foreground">Analytics</h1>
            <p className="text-muted-foreground mt-2">Email campaign performance and engagement metrics</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mt-8 mb-8">
            <Card className="p-6 bg-card border border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Sent</p>
                  <p className="text-3xl font-bold text-foreground mt-2">{emailStats.totalSent}</p>
                </div>
                <Mail className="h-8 w-8 text-primary/50" />
              </div>
            </Card>

            <Card className="p-6 bg-card border border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Opened</p>
                  <p className="text-3xl font-bold text-foreground mt-2">{emailStats.totalOpened}</p>
                  <p className="text-xs text-muted-foreground mt-1">{emailStats.openRate.toFixed(1)}% open rate</p>
                </div>
                <Eye className="h-8 w-8 text-primary/50" />
              </div>
            </Card>

            <Card className="p-6 bg-card border border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Clicks</p>
                  <p className="text-3xl font-bold text-foreground mt-2">{emailStats.totalClicks}</p>
                  <p className="text-xs text-muted-foreground mt-1">{emailStats.clickRate.toFixed(1)}% click rate</p>
                </div>
                <ExternalLink className="h-8 w-8 text-primary/50" />
              </div>
            </Card>

            <Card className="p-6 bg-card border border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Avg. Click per Email</p>
                  <p className="text-3xl font-bold text-foreground mt-2">
                    {emailStats.totalSent > 0 ? (emailStats.totalClicks / emailStats.totalSent).toFixed(2) : '0'}
                  </p>
                </div>
                <Users className="h-8 w-8 text-primary/50" />
              </div>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Email Campaign Performance */}
            <Card className="p-6 bg-card border border-border">
              <h2 className="text-lg font-semibold text-foreground mb-4">Campaign Performance</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis dataKey="name" stroke="var(--color-muted-foreground)" />
                  <YAxis stroke="var(--color-muted-foreground)" />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'var(--color-card)',
                      border: '1px solid var(--color-border)',
                      borderRadius: '8px',
                    }}
                    labelStyle={{ color: 'var(--color-foreground)' }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="sent" stroke="var(--color-primary)" strokeWidth={2} />
                  <Line type="monotone" dataKey="opened" stroke="var(--color-accent)" strokeWidth={2} />
                  <Line type="monotone" dataKey="clicked" stroke="#10b981" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </Card>

            {/* Open Rate Distribution */}
            <Card className="p-6 bg-card border border-border">
              <h2 className="text-lg font-semibold text-foreground mb-4">Open Rate Distribution</h2>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'var(--color-card)',
                      border: '1px solid var(--color-border)',
                      borderRadius: '8px',
                    }}
                    labelStyle={{ color: 'var(--color-foreground)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </Card>

            {/* Weekly Engagement */}
            <Card className="p-6 bg-card border border-border lg:col-span-2">
              <h2 className="text-lg font-semibold text-foreground mb-4">Weekly Engagement Metrics</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis dataKey="name" stroke="var(--color-muted-foreground)" />
                  <YAxis stroke="var(--color-muted-foreground)" />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'var(--color-card)',
                      border: '1px solid var(--color-border)',
                      borderRadius: '8px',
                    }}
                    labelStyle={{ color: 'var(--color-foreground)' }}
                  />
                  <Legend />
                  <Bar dataKey="sent" fill="var(--color-primary)" />
                  <Bar dataKey="opened" fill="var(--color-accent)" />
                  <Bar dataKey="clicked" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
