'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Sidebar } from '@/components/sidebar'
import { CalendarWidget } from '@/components/calendar-widget'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calendar, Clock, Users, MapPin } from 'lucide-react'
import { getCurrentUser, getMeetings, initializeStorage } from '@/lib/storage'
import Link from 'next/link'

interface Meeting {
  id: string
  title: string
  description: string
  scheduledAt: string
  participants: string[]
  createdBy: string
  meetingLink: string
}

export default function EmployeeCalendar() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [meetings, setMeetings] = useState<Meeting[]>([])
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    initializeStorage()
    const currentUser = getCurrentUser()
    
    if (!currentUser || currentUser.role !== 'employee') {
      router.push('/login')
      return
    }

    setUser(currentUser)
    const allMeetings = getMeetings().filter((m) => m.participants.includes(currentUser.id))
    setMeetings(allMeetings)
    setLoading(false)
  }, [router])

  const calendarEvents = meetings.map((m) => ({
    date: m.scheduledAt,
    title: m.title,
    color: 'bg-primary',
  }))

  const selectedDateMeetings = selectedDate
    ? meetings.filter(
        (m) =>
          new Date(m.scheduledAt).toDateString() === selectedDate.toDateString()
      )
    : []

  const upcomingMeetings = meetings
    .filter((m) => new Date(m.scheduledAt) > new Date())
    .sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime())
    .slice(0, 5)

  if (loading || !user) {
    return <div className="flex items-center justify-center h-screen bg-background">Loading...</div>
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar userRole={user.role} userName={user.name} />

      <main className="flex-1 ml-64 overflow-auto">
        <div className="p-8">
          {/* Header */}
          <div>
            <h1 className="text-4xl font-bold text-foreground">Calendar</h1>
            <p className="text-muted-foreground mt-2">View your scheduled meetings and events</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
            {/* Calendar */}
            <div className="lg:col-span-2">
              <CalendarWidget events={calendarEvents} onDateSelect={setSelectedDate} />
            </div>

            {/* Meeting List */}
            <Card className="p-6 bg-card border border-border h-fit">
              <h2 className="text-lg font-semibold text-foreground mb-4">
                {selectedDate ? selectedDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }) : 'Upcoming Meetings'}
              </h2>

              {selectedDateMeetings.length > 0 ? (
                <div className="space-y-3">
                  {selectedDateMeetings.map((meeting) => (
                    <div key={meeting.id} className="p-4 bg-muted/30 border border-border rounded-lg">
                      <p className="font-semibold text-foreground text-sm">{meeting.title}</p>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{meeting.description}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mt-2">
                        <Clock className="h-3 w-3" />
                        {new Date(meeting.scheduledAt).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                        <Users className="h-3 w-3" />
                        {meeting.participants.length} participants
                      </div>
                      <Link href={`/meeting/${meeting.id}`} className="mt-3 block">
                        <Button size="sm" className="w-full">
                          Join Meeting
                        </Button>
                      </Link>
                    </div>
                  ))}
                </div>
              ) : selectedDate ? (
                <div className="text-center py-8">
                  <Calendar className="h-8 w-8 text-muted-foreground/30 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">No meetings scheduled for this date</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {upcomingMeetings.length > 0 ? (
                    upcomingMeetings.map((meeting) => (
                      <div key={meeting.id} className="p-4 bg-muted/30 border border-border rounded-lg">
                        <p className="font-semibold text-foreground text-sm">{meeting.title}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-2">
                          <Calendar className="h-3 w-3" />
                          {new Date(meeting.scheduledAt).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                          <Clock className="h-3 w-3" />
                          {new Date(meeting.scheduledAt).toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </div>
                        <Link href={`/meeting/${meeting.id}`} className="mt-3 block">
                          <Button size="sm" variant="secondary" className="w-full">
                            View Details
                          </Button>
                        </Link>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <Calendar className="h-8 w-8 text-muted-foreground/30 mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">No upcoming meetings</p>
                    </div>
                  )}
                </div>
              )}
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
