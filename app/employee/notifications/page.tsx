'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { EmployeeSidebar } from '@/components/employee-sidebar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { getNotifications, Notification } from '@/lib/storage'
import { Bell, BookOpen, Calendar, Trophy, Trash2 } from 'lucide-react'

const notificationIcons = {
  course_assigned: BookOpen,
  meeting_scheduled: Calendar,
  course_completed: Trophy,
  reminder: Bell,
}

const notificationColors = {
  course_assigned: { bg: 'bg-blue-50', border: 'border-blue-200', icon: 'text-blue-600', text: 'text-blue-900' },
  meeting_scheduled: { bg: 'bg-purple-50', border: 'border-purple-200', icon: 'text-purple-600', text: 'text-purple-900' },
  course_completed: { bg: 'bg-green-50', border: 'border-green-200', icon: 'text-green-600', text: 'text-green-900' },
  reminder: { bg: 'bg-yellow-50', border: 'border-yellow-200', icon: 'text-yellow-600', text: 'text-yellow-900' },
}

export default function NotificationsPage() {
  const { user, loading } = useAuth()
  const [notifications, setNotifications] = useState<Notification[]>([])

  useEffect(() => {
    if (user?.role === 'employee') {
      const userNotifs = getNotifications(user.id)
      setNotifications(userNotifs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()))
    }
  }, [user])

  const handleDelete = (id: string) => {
    const all = JSON.parse(localStorage.getItem('qedge_notifications') || '[]') as Notification[]
    const updated = all.filter((n) => n.id !== id)
    localStorage.setItem('qedge_notifications', JSON.stringify(updated))
    setNotifications(notifications.filter((n) => n.id !== id))
  }

  if (loading) return null
  if (!user || user.role !== 'employee') return null

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <div className="flex min-h-screen bg-gray-50">
      <EmployeeSidebar />

      <main className="flex-1 ml-64">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="px-8 py-6">
            <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
            <p className="text-gray-600 text-sm mt-1">
              {unreadCount > 0 ? `You have ${unreadCount} new notification${unreadCount !== 1 ? 's' : ''}` : 'All caught up!'}
            </p>
          </div>
        </header>

        {/* Content */}
        <div className="p-8 max-w-3xl">
          {notifications.length > 0 ? (
            <div className="space-y-3">
              {notifications.map((notif) => {
                const IconComponent = notificationIcons[notif.type as keyof typeof notificationIcons] || Bell
                const colors = notificationColors[notif.type as keyof typeof notificationColors]

                return (
                  <Card
                    key={notif.id}
                    className={`border-l-4 ${colors.border} ${notif.read ? 'opacity-75' : ''}`}
                  >
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-4 flex-1">
                          <div className={`p-3 rounded-lg ${colors.bg} flex-shrink-0`}>
                            <IconComponent className={`w-5 h-5 ${colors.icon}`} />
                          </div>
                          <div className="flex-1">
                            <p className={`font-semibold ${colors.text}`}>{notif.title}</p>
                            <p className="text-gray-600 text-sm mt-1">{notif.message}</p>
                            <p className="text-gray-500 text-xs mt-2">
                              {new Date(notif.createdAt).toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(notif.id)}
                          className="text-gray-500 hover:text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          ) : (
            <Card>
              <CardContent className="pt-6 text-center py-12">
                <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 text-lg font-medium mb-2">No notifications yet</p>
                <p className="text-gray-500 text-sm">
                  You'll see notifications about course assignments, meetings, and course completions here
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}
