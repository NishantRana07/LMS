'use client'

import React from "react"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Sidebar } from '@/components/sidebar'
import { CalendarWidget } from '@/components/calendar-widget'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, Calendar, Users, Clock, Trash2 } from 'lucide-react'
import { getCurrentUser, getMeetings, createMeeting, initializeStorage } from '@/lib/storage'
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

export default function AdminCalendar() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [meetings, setMeetings] = useState<Meeting[]>([])
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    hour: '14',
    minute: '00',
  })

  useEffect(() => {
    initializeStorage()
    const currentUser = getCurrentUser()
    
    if (!currentUser || currentUser.role !== 'admin') {
      router.push('/login')
      return
    }

    setUser(currentUser)
    setMeetings(getMeetings())
    setLoading(false)
  }, [router])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleScheduleMeeting = (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedDate || !formData.title) {
      alert('Please select a date and enter a meeting title')
      return
    }

    const meetingDate = new Date(selectedDate)
    meetingDate.setHours(parseInt(formData.hour), parseInt(formData.minute), 0)

    const newMeeting = createMeeting({
      title: formData.title,
      description: formData.description,
      scheduledAt: meetingDate.toISOString(),
      participants: ['user-emp-1', user.id], // Demo: add employee and admin
      createdBy: user.id,
    })

    setMeetings([...meetings, newMeeting])
    setFormData({ title: '', description: '', hour: '14', minute: '00' })
    setSelectedDate(null)
    setShowForm(false)
  }

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

  if (loading || !user) {
    return <div className="flex items-center justify-center h-screen bg-background">Loading...</div>
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar userRole={user.role} userName={user.name} />

      <main className="flex-1 ml-64 overflow-auto">
        <div className="p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold text-foreground">Calendar</h1>
              <p className="text-muted-foreground mt-2">Schedule and manage meetings and events</p>
            </div>
            <Link href="/admin/create-meeting">
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Schedule Meeting
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Calendar */}
            <div className="lg:col-span-2">
              <CalendarWidget events={calendarEvents} onDateSelect={setSelectedDate} />
            </div>

            {/* Meeting List */}
            <Card className="p-6 bg-card border border-border h-fit">
              <h2 className="text-lg font-semibold text-foreground mb-4">
                {selectedDate ? selectedDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }) : 'Upcoming Events'}
              </h2>

              {selectedDateMeetings.length > 0 ? (
                <div className="space-y-3">
                  {selectedDateMeetings.map((meeting) => (
                    <div key={meeting.id} className="p-4 bg-muted/30 border border-border rounded-lg">
                      <p className="font-semibold text-foreground text-sm">{meeting.title}</p>
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
                      <Button variant="ghost" size="sm" className="w-full mt-3 text-xs">
                        View Details
                      </Button>
                    </div>
                  ))}
                </div>
              ) : selectedDate ? (
                <div className="text-center py-8">
                  <Calendar className="h-8 w-8 text-muted-foreground/30 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">No meetings scheduled for this date</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {meetings
                    .filter((m) => new Date(m.scheduledAt) > new Date())
                    .sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime())
                    .slice(0, 5)
                    .map((meeting) => (
                      <div key={meeting.id} className="p-4 bg-muted/30 border border-border rounded-lg">
                        <p className="font-semibold text-foreground text-sm">{meeting.title}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-2">
                          <Clock className="h-3 w-3" />
                          {new Date(meeting.scheduledAt).toLocaleDateString()} at{' '}
                          {new Date(meeting.scheduledAt).toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
