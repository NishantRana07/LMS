'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { AdminSidebar } from '@/components/admin-sidebar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { getMeetings, Meeting } from '@/lib/storage'
import { Plus, Calendar, Users, Trash2 } from 'lucide-react'
import Link from 'next/link'

export default function MeetingsPage() {
  const { user, loading } = useAuth()
  const [meetings, setMeetings] = useState<Meeting[]>([])
  const [deleteId, setDeleteId] = useState<string | null>(null)

  useEffect(() => {
    if (user?.role === 'admin') {
      setMeetings(getMeetings())
    }
  }, [user])

  const handleDelete = (id: string) => {
    const updated = meetings.filter((m) => m.id !== id)
    setMeetings(updated)
    localStorage.setItem('qedge_meetings', JSON.stringify(updated))
    setDeleteId(null)
  }

  const upcomingMeetings = meetings.filter((m) => new Date(m.scheduledAt) > new Date())
  const pastMeetings = meetings.filter((m) => new Date(m.scheduledAt) <= new Date())

  if (loading) return null
  if (!user || user.role !== 'admin') return null

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />

      <main className="flex-1 ml-64">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="px-8 py-6 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Meetings</h1>
              <p className="text-gray-600 text-sm mt-1">Schedule and manage training meetings</p>
            </div>
            <Link href="/admin/create-meeting">
              <Button className="gap-2 bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4" />
                Schedule Meeting
              </Button>
            </Link>
          </div>
        </header>

        {/* Content */}
        <div className="p-8">
          {meetings.length > 0 ? (
            <div className="space-y-8">
              {/* Upcoming Meetings */}
              {upcomingMeetings.length > 0 && (
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Upcoming Meetings</h2>
                  <div className="space-y-3">
                    {upcomingMeetings.map((meeting) => (
                      <Card key={meeting.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="pt-6">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="font-semibold text-lg text-gray-900">{meeting.title}</h3>
                              <div className="flex items-center gap-4 mt-3 text-sm text-gray-600">
                                <div className="flex items-center gap-1">
                                  <Calendar className="w-4 h-4" />
                                  {new Date(meeting.scheduledAt).toLocaleString()}
                                </div>
                                <div className="flex items-center gap-1">
                                  <Users className="w-4 h-4" />
                                  {meeting.participants.length} participants
                                </div>
                              </div>
                              <a
                                href={meeting.meetingLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-700 text-sm font-medium mt-3 inline-block"
                              >
                                View Meeting Link →
                              </a>
                            </div>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => setDeleteId(meeting.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>

                          {deleteId === meeting.id && (
                            <div className="mt-4 bg-red-50 p-3 rounded border border-red-200">
                              <p className="text-sm text-red-900 mb-2">Confirm delete this meeting?</p>
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => handleDelete(meeting.id)}
                                >
                                  Confirm
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => setDeleteId(null)}
                                >
                                  Cancel
                                </Button>
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Past Meetings */}
              {pastMeetings.length > 0 && (
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Past Meetings</h2>
                  <div className="space-y-3">
                    {pastMeetings.map((meeting) => (
                      <Card key={meeting.id} className="opacity-75">
                        <CardContent className="pt-6">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-900">{meeting.title}</h3>
                              <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                                <div className="flex items-center gap-1">
                                  <Calendar className="w-4 h-4" />
                                  {new Date(meeting.scheduledAt).toLocaleString()}
                                </div>
                                <div className="flex items-center gap-1">
                                  <Users className="w-4 h-4" />
                                  {meeting.participants.length} participants
                                </div>
                              </div>
                            </div>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => setDeleteId(meeting.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>

                          {deleteId === meeting.id && (
                            <div className="mt-4 bg-red-50 p-3 rounded border border-red-200">
                              <p className="text-sm text-red-900 mb-2">Confirm delete this meeting?</p>
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => handleDelete(meeting.id)}
                                >
                                  Confirm
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => setDeleteId(null)}
                                >
                                  Cancel
                                </Button>
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Card className="text-center py-12">
              <CardContent>
                <p className="text-gray-600 mb-4">No meetings scheduled yet</p>
                <Link href="/admin/create-meeting">
                  <Button className="gap-2 bg-blue-600 hover:bg-blue-700">
                    <Plus className="w-4 h-4" />
                    Schedule Your First Meeting
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}
