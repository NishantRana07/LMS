'use client'

import React from "react"

import { useState } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { useRouter } from 'next/navigation'
import { AdminSidebar } from '@/components/admin-sidebar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createMeeting, createNotification } from '@/lib/storage'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function CreateMeetingPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [participants, setParticipants] = useState(['user-emp-1'])
  const [submitting, setSubmitting] = useState(false)

  const handleToggleParticipant = (userId: string) => {
    setParticipants((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !date || !time) {
      alert('Please fill in all required fields')
      return
    }

    setSubmitting(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 500))

      const scheduledAt = `${date}T${time}`
      const meeting = createMeeting({
        title,
        description,
        scheduledAt,
        participants,
        createdBy: user!.id,
      })

      // Send notifications to participants
      participants.forEach((participantId) => {
        createNotification({
          userId: participantId,
          type: 'meeting_scheduled',
          title: 'Meeting Scheduled',
          message: `You've been invited to "${title}" on ${new Date(scheduledAt).toLocaleString()}`,
          read: false,
        })
      })

      router.push('/admin/meetings')
    } catch (error) {
      console.error('Error creating meeting:', error)
      alert('Failed to create meeting')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return null
  if (!user || user.role !== 'admin') return null

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />

      <main className="flex-1 ml-64">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="px-8 py-6 flex items-center gap-4">
            <Link href="/admin/meetings">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Schedule Meeting</h1>
              <p className="text-gray-600 text-sm mt-1">Create a new training meeting</p>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="p-8 max-w-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Meeting Details */}
            <Card>
              <CardHeader>
                <CardTitle>Meeting Details</CardTitle>
                <CardDescription>Basic information about your meeting</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title" className="font-medium">
                    Meeting Title
                  </Label>
                  <Input
                    id="title"
                    placeholder="e.g., Compliance Training Session"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="description" className="font-medium">
                    Description
                  </Label>
                  <textarea
                    id="description"
                    placeholder="Describe the meeting agenda..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="date" className="font-medium">
                      Date
                    </Label>
                    <Input
                      id="date"
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="time" className="font-medium">
                      Time
                    </Label>
                    <Input
                      id="time"
                      type="time"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      className="mt-2"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Participants */}
            <Card>
              <CardHeader>
                <CardTitle>Participants</CardTitle>
                <CardDescription>Select who should attend this meeting</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {[
                    { id: 'user-emp-1', name: 'John Smith', email: 'user@company.com' },
                  ].map((emp) => (
                    <label
                      key={emp.id}
                      className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={participants.includes(emp.id)}
                        onChange={() => handleToggleParticipant(emp.id)}
                        className="w-4 h-4 rounded border-gray-300"
                      />
                      <div>
                        <p className="font-medium text-gray-900">{emp.name}</p>
                        <p className="text-sm text-gray-600">{emp.email}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Submit */}
            <div className="flex gap-3">
              <Button
                type="submit"
                disabled={submitting || !title.trim() || !date || !time}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {submitting ? 'Scheduling...' : 'Schedule Meeting'}
              </Button>
              <Link href="/admin/meetings">
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </Link>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}
