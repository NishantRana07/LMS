'use client'

import { useMemo } from "react"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Sidebar } from '@/components/sidebar'
import { CalendarWidget } from '@/components/calendar-widget'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Plus, Users, BookOpen, Calendar, TrendingUp, Mail, Edit, X, Activity } from 'lucide-react'
import { getCurrentUser, getMeetings, getCourses, getEmails, initializeStorage, createCourse, getAllUsers, getActivities } from '@/lib/storage'
import type { User } from '@/lib/storage'
import Link from 'next/link'

interface DashboardStats {
  totalEmployees: number
  totalCandidates: number
  activeCourses: number
  upcomingMeetings: number
  completionRate: number
  emailsSent: number
  openRate: number
  recentActivities: number
}

interface Lesson {
  id: string
  title: string
  type: 'video' | 'document' | 'text'
  fileUrl?: string
  fileName?: string
  order?: number
  content?: string
  completed?: boolean
}

export default function AdminDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [stats, setStats] = useState<DashboardStats>({
    totalEmployees: 0,
    totalCandidates: 0,
    activeCourses: 0,
    upcomingMeetings: 0,
    completionRate: 0,
    emailsSent: 0,
    openRate: 0,
    recentActivities: 0,
  })
  const [recentActivities, setRecentActivities] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [showCourseForm, setShowCourseForm] = useState(false)
  const [courseForm, setCourseForm] = useState({
    title: '',
    description: '',
    points: 50,
    lessons: [] as Lesson[],
    newLesson: { title: '', type: 'text' as const }
  })
  const [submitting, setSubmitting] = useState(false)

  const calendarEvents = useMemo(() => {
    try {
      return getMeetings().map((m) => ({
        date: m.scheduledAt,
        title: m.title,
        color: 'bg-primary',
      }))
    } catch (e) {
      console.error('[v0] Error loading calendar events:', e)
      return []
    }
  }, [])

  useEffect(() => {
    try {
      initializeStorage()
      const currentUser = getCurrentUser()
      
      if (!currentUser || currentUser.role !== 'hr') {
        router.push('/login')
        return
      }

      setUser(currentUser)

      try {
        const users = getAllUsers()
        const employees = users.filter((u) => u.role === 'employee')
        const candidates = users.filter((u) => u.role === 'candidate')
        const courses = getCourses()
        const meetings = getMeetings()
        const emails = getEmails(currentUser.id)
        const activities = getActivities()
        
        const now = new Date()
        const upcomingMeetings = meetings.filter((m) => new Date(m.scheduledAt) > now).length
        const openedEmails = emails.filter((e) => e.opened).length
        const openRate = emails.length > 0 ? (openedEmails / emails.length) * 100 : 0
        const recentActivities = activities.slice(0, 5)
        
        // Calculate completion rate
        const totalUsers = users.length
        const completedUsers = users.filter((u) => (u.progress || 0) >= 100).length
        const completionRate = totalUsers > 0 ? (completedUsers / totalUsers) * 100 : 0

        setStats({
          totalEmployees: employees.length,
          totalCandidates: candidates.length,
          activeCourses: courses.length,
          upcomingMeetings,
          completionRate: Math.round(completionRate),
          emailsSent: emails.length,
          openRate: Math.round(openRate),
          recentActivities: recentActivities.length,
        })
        
        setRecentActivities(recentActivities)
      } catch (e) {
        console.error('[v0] Error loading stats:', e)
      }

      setLoading(false)
    } catch (e) {
      console.error('[v0] Error in admin dashboard:', e)
      router.push('/login')
    }
  }, [router])

  const handleAddLesson = () => {
    if (courseForm.newLesson.title.trim()) {
      const lesson: Lesson = {
        id: `lesson-${Date.now()}`,
        title: courseForm.newLesson.title,
        type: courseForm.newLesson.type,
        content: '',
        completed: false,
        order: courseForm.lessons.length + 1,
      }
      setCourseForm({
        ...courseForm,
        lessons: [...courseForm.lessons, lesson],
        newLesson: { title: '', type: 'text' }
      })
    }
  }

  const handleRemoveLesson = (id: string) => {
    setCourseForm({
      ...courseForm,
      lessons: courseForm.lessons.filter((l) => l.id !== id)
    })
  }

  const handleFileUpload = (lessonId: string, file: File) => {
    // Create a fallback URL for the uploaded file
    const fileUrl = URL.createObjectURL(file)
    
    // Update the lesson with file information
    const updatedLessons = courseForm.lessons.map(lesson => 
      lesson.id === lessonId 
        ? { 
            ...lesson, 
            fileUrl, 
            fileName: file.name,
            fileSize: file.size
          }
        : lesson
    )
    
    setCourseForm({
      ...courseForm,
      lessons: updatedLessons
    })
    
    alert(`File "${file.name}" uploaded successfully!`)
  }

  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!courseForm.title.trim()) {
      alert('Please enter a course title')
      return
    }

    setSubmitting(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 500))

      const course = createCourse({
        title: courseForm.title,
        description: courseForm.description,
        lessons: courseForm.lessons.map((l) => ({
          ...l,
          content: l.content || '',
          courseId: `course-${Date.now()}`,
          completed: false,
          order: l.order || 0,
        })),
        assignedTo: [],
        points: courseForm.points,
        createdBy: user!.id,
      })

      // Reset form
      setCourseForm({
        title: '',
        description: '',
        points: 50,
        lessons: [],
        newLesson: { title: '', type: 'text' }
      })
      setShowCourseForm(false)
      
      // Refresh stats
      const updatedCourses = getCourses()
      setStats(prev => ({ ...prev, activeCourses: updatedCourses.length }))
      
      alert('Course created successfully!')
    } catch (error) {
      console.error('Error creating course:', error)
      alert('Failed to create course')
    } finally {
      setSubmitting(false)
    }
  }

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
              <h1 className="text-4xl font-bold text-foreground">Dashboard</h1>
              <p className="text-muted-foreground mt-2">Welcome back, {user.name}!</p>
            </div>
            <div className="flex gap-3">
              <Button 
                onClick={() => setShowCourseForm(!showCourseForm)}
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                {showCourseForm ? 'Cancel' : 'New Course'}
              </Button>
              <Link href="/admin/create-meeting">
                <Button className="gap-2" variant="secondary">
                  <Calendar className="h-4 w-4" />
                  Schedule Meeting
                </Button>
              </Link>
            </div>
          </div>

          {/* Course Creation Form */}
          {showCourseForm && (
            <Card className="p-6 bg-card border border-border mb-8">
              <h2 className="text-xl font-semibold text-foreground mb-4">Create New Course</h2>
              <form onSubmit={handleCreateCourse} className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="title" className="font-medium">
                      Course Title
                    </Label>
                    <Input
                      id="title"
                      placeholder="e.g., Leadership Fundamentals"
                      value={courseForm.title}
                      onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })}
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="points" className="font-medium">
                      Points for Completion
                    </Label>
                    <Input
                      id="points"
                      type="number"
                      min="10"
                      max="1000"
                      value={courseForm.points}
                      onChange={(e) => setCourseForm({ ...courseForm, points: parseInt(e.target.value) || 50 })}
                      className="mt-2"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="description" className="font-medium">
                    Description
                  </Label>
                  <textarea
                    id="description"
                    placeholder="Describe what employees will learn..."
                    value={courseForm.description}
                    onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })}
                    className="mt-2 w-full px-3 py-2 border border-border rounded-lg text-sm"
                    rows={3}
                  />
                </div>

                <div>
                  <Label className="font-medium mb-3 block">Lessons</Label>
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Lesson title"
                        value={courseForm.newLesson.title}
                        onChange={(e) => setCourseForm({ 
                          ...courseForm, 
                          newLesson: { ...courseForm.newLesson, title: e.target.value }
                        })}
                        className="flex-1"
                      />
                      <select
                        value={courseForm.newLesson.type}
                        onChange={(e) => setCourseForm({ 
                          ...courseForm, 
                          newLesson: { ...courseForm.newLesson, type: e.target.value as any }
                        })}
                        className="px-3 py-2 border border-border rounded-lg text-sm"
                      >
                        <option value="text">Text</option>
                        <option value="video">Video</option>
                        <option value="document">Document</option>
                      </select>
                      <Button
                        type="button"
                        onClick={handleAddLesson}
                        className="gap-2"
                      >
                        <Plus className="w-4 h-4" />
                        Add
                      </Button>

                <div>
                  <Label htmlFor="points" className="font-medium">
                    Points for Completion
                  </Label>
                  <Input
                    id="points"
                    type="number"
                    min="10"
                    max="1000"
                    value={courseForm.points}
                    onChange={(e) => setCourseForm({ ...courseForm, points: parseInt(e.target.value) || 50 })}
                    className="mt-2"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description" className="font-medium">
                  Description
                </Label>
                <textarea
                  id="description"
                  placeholder="Describe what employees will learn..."
                  value={courseForm.description}
                  onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })}
                  className="mt-2 w-full px-3 py-2 border border-border rounded-lg text-sm"
                  rows={3}
                />
              </div>

              <div>
                <Label className="font-medium mb-3 block">Lessons</Label>
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Lesson title"
                      value={courseForm.newLesson.title}
                      onChange={(e) => setCourseForm({ 
                        ...courseForm, 
                        newLesson: { ...courseForm.newLesson, title: e.target.value }
                      })}
                      className="flex-1"
                    />
                    <select
                      value={courseForm.newLesson.type}
                      onChange={(e) => setCourseForm({ 
                        ...courseForm, 
                        newLesson: { ...courseForm.newLesson, type: e.target.value as any }
                      })}
                      className="px-3 py-2 border border-border rounded-lg text-sm"
                    >
                      <option value="text">Text</option>
                      <option value="video">Video</option>
                      <option value="document">Document</option>
                    </select>
                    <Button
                      type="button"
                      onClick={handleAddLesson}
                      className="gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Add
                    </Button>
                  </div>

                  {courseForm.lessons.length > 0 && (
                    <div className="space-y-2">
                      {courseForm.lessons.map((lesson) => (
                        <div
                          key={lesson.id}
                          className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
                        >
                          <div className="flex-1">
                            <p className="font-medium text-foreground">{lesson.title}</p>
                            <p className="text-xs text-muted-foreground capitalize mt-1">{lesson.type}</p>
                            {lesson.fileName && (
                              <p className="text-xs text-blue-600 mt-1">
                                📎 {lesson.fileName}
                              </p>
                            )}
                          </div>
                          <div className="flex gap-2">
                            {lesson.type === 'document' || lesson.type === 'video' && (
                              <input
                                type="file"
                                accept={lesson.type === 'video' ? 'video/*' : '.pdf,.doc,.docx,.txt'}
                                onChange={(e) => {
                                  const file = e.target.files?.[0]
                                  if (file) {
                                    handleFileUpload(lesson.id, file)
                                  }
                                }}
                                className="hidden"
                                id={`file-upload-${lesson.id}`}
                              />
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => document.getElementById(`file-upload-${lesson.id}`)?.click()}
                                className="gap-1"
                              >
                                📎 Upload
                              </Button>
                            )}
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveLesson(lesson.id)}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                  <Button
                    type="submit"
                    disabled={submitting || !courseForm.title.trim()}
                  >
                    {submitting ? 'Creating...' : 'Create Course'}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setShowCourseForm(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </Card>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
            <Card className="p-6 bg-card border border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Employees</p>
                  <p className="text-3xl font-bold text-foreground mt-2">{stats.totalEmployees}</p>
                </div>
                <Users className="h-8 w-8 text-primary/50" />
              </div>
            </Card>

            <Card className="p-6 bg-card border border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Candidates</p>
                  <p className="text-3xl font-bold text-foreground mt-2">{stats.totalCandidates}</p>
                </div>
                <Users className="h-8 w-8 text-primary/50" />
              </div>
            </Card>

            <Card className="p-6 bg-card border border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Courses</p>
                  <p className="text-3xl font-bold text-foreground mt-2">{stats.activeCourses}</p>
                </div>
                <BookOpen className="h-8 w-8 text-primary/50" />
              </div>
            </Card>

            <Card className="p-6 bg-card border border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Upcoming Meetings</p>
                  <p className="text-3xl font-bold text-foreground mt-2">{stats.upcomingMeetings}</p>
                </div>
                <Calendar className="h-8 w-8 text-primary/50" />
              </div>
            </Card>

            <Card className="p-6 bg-card border border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Completion Rate</p>
                  <p className="text-3xl font-bold text-foreground mt-2">{stats.completionRate}%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-primary/50" />
              </div>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <CalendarWidget events={calendarEvents} onDateSelect={setSelectedDate} />
            </div>

            <Card className="p-6 bg-card border border-border h-fit">
              <h2 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <Button 
                  onClick={() => setShowCourseForm(true)}
                  className="w-full justify-start gap-2"
                  variant="outline"
                >
                  <Plus className="h-4 w-4" />
                  Create Course
                </Button>
                <Link href="/admin/users" className="block">
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <Users className="h-4 w-4" />
                    Add User
                  </Button>
                </Link>
                <Link href="/admin/create-meeting" className="block">
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <Calendar className="h-4 w-4" />
                    Schedule Meeting
                  </Button>
                </Link>
                <Link href="/admin/emails/send" className="block">
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <Mail className="h-4 w-4" />
                    Send Announcement
                  </Button>
                </Link>
              </div>
            </Card>

            {/* Recent Activities */}
            {recentActivities.length > 0 && (
              <Card className="p-6 bg-card border border-border">
                <h2 className="text-lg font-semibold text-foreground mb-4">Recent Activities</h2>
                <div className="space-y-3">
                  {recentActivities.map((activity, index) => (
                    <div key={activity.id} className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                      <div className="flex-shrink-0">
                        {activity.type === 'course_completed' && <BookOpen className="h-4 w-4 text-green-600" />}
                        {activity.type === 'badge_earned' && <TrendingUp className="h-4 w-4 text-yellow-600" />}
                        {activity.type === 'user_joined' && <Users className="h-4 w-4 text-blue-600" />}
                        {activity.type === 'meeting_attended' && <Calendar className="h-4 w-4 text-purple-600" />}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground">{activity.description}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(activity.timestamp).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
