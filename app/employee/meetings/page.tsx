'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { EmployeeSidebar } from '@/components/employee-sidebar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { getMeetings, Meeting } from '@/lib/storage'
import { Calendar, Users, Clock, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function MeetingsPage() {
  const { user, loading } = useAuth()
  const [upcomingMeetings, setUpcomingMeetings] = useState<Meeting[]>([])
  const [pastMeetings, setPastMeetings] = useState<Meeting[]>([])

  useEffect(() => {
    if (user?.role === 'employee') {
      const allMeetings = getMeetings()
      const myMeetings = allMeetings.filter((m) => m.participants.includes(user.id))

      const upcoming = myMeetings
        .filter((m) => new Date(m.scheduledAt) > new Date())
        .sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime())

      const past = myMeetings
        .filter((m) => new Date(m.scheduledAt) <= new Date())
        .sort((a, b) => new Date(b.scheduledAt).getTime() - new Date(a.scheduledAt).getTime())

      setUpcomingMeetings(upcoming)
      setPastMeetings(past)
    }
  }, [user])

  if (loading) return null
  if (!user || user.role !== 'employee') return null

  return (
    <div className="flex min-h-screen bg-gray-50">
      <EmployeeSidebar />

      <main className="flex-1 ml-64">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="px-8 py-6">
            <h1 className="text-3xl font-bold text-gray-900">My Meetings</h1>
            <p className="text-gray-600 text-sm mt-1">Join your scheduled training meetings</p>
          </div>
        </header>

        {/* Content */}
        <div className="p-8">
          {upcomingMeetings.length > 0 || pastMeetings.length > 0 ? (
            <div className="space-y-8">
              {/* Upcoming Meetings */}
              {upcomingMeetings.length > 0 && (
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Upcoming Meetings</h2>
                  <div className="space-y-4">
                    {upcomingMeetings.map((meeting) => {
                      const meetingTime = new Date(meeting.scheduledAt)
                      const now = new Date()
                      const timeUntil = meetingTime.getTime() - now.getTime()
                      const isStarting = timeUntil < 15 * 60 * 1000 && timeUntil > 0 // Less than 15 mins away

                      return (
                        <Card key={meeting.id} className="hover:shadow-md transition-shadow">
                          <CardContent className="pt-6">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <h3 className="font-semibold text-lg text-gray-900">{meeting.title}</h3>
                                  {isStarting && (
                                    <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full">
                                      Starting Soon
                                    </span>
                                  )}
                                </div>
                                <p className="text-gray-600 mb-3">{meeting.description}</p>
                                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                                  <div className="flex items-center gap-1">
                                    <Calendar className="w-4 h-4" />
                                    {meetingTime.toLocaleDateString()}
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Clock className="w-4 h-4" />
                                    {meetingTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Users className="w-4 h-4" />
                                    {meeting.participants.length} participants
                                  </div>
                                </div>
                              </div>
                              <Link href={`/meeting/${meeting.id}`} className="ml-4">
                                <Button className="gap-2 bg-blue-600 hover:bg-blue-700">
                                  Join Meeting
                                  <ArrowRight className="w-4 h-4" />
                                </Button>
                              </Link>
                            </div>
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Past Meetings */}
              {pastMeetings.length > 0 && (
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Past Meetings</h2>
                  <div className="space-y-3 opacity-75">
                    {pastMeetings.map((meeting) => (
                      <Card key={meeting.id}>
                        <CardContent className="pt-6">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-900">{meeting.title}</h3>
                              <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                                <div className="flex items-center gap-1">
                                  <Calendar className="w-4 h-4" />
                                  {new Date(meeting.scheduledAt).toLocaleDateString()}
                                </div>
                                <div className="flex items-center gap-1">
                                  <Users className="w-4 h-4" />
                                  {meeting.participants.length} participants
                                </div>
                              </div>
                            </div>
                            <span className="px-3 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full">
                              Completed
                            </span>
                          </div>
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
                <p className="text-gray-600 mb-4">No meetings scheduled</p>
                <p className="text-sm text-gray-500">Your HR admin will schedule meetings for you</p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}
