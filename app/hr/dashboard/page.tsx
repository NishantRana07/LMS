'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { HRSidebar } from '@/components/hr-sidebar'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  BookOpen, 
  Users, 
  Calendar, 
  Mail, 
  TrendingUp,
  Award,
  Activity,
  Clock,
  Target,
  Star,
  Plus,
  Search,
  Filter,
  Bell,
  BarChart3,
  Settings,
  FileText,
  MessageSquare,
  UserCheck,
  Briefcase,
  GraduationCap,
  Building,
  Video,
  Megaphone,
  PieChart,
  ChevronRight,
  Clipboard
} from 'lucide-react'
import { 
  getCurrentUser, 
  getCourses, 
  getAllUsers, 
  getMessages,
  getBadges,
  getActivities,
  initializeStorage,
  createMeeting,
  createAnnouncement
} from '@/lib/storage'
import type { User, Course, Message, Badge, Activity as ActivityType } from '@/lib/storage'

export default function HRDashboard() {
  const router = useRouter()
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [courses, setCourses] = useState<Course[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [badges, setBadges] = useState<Badge[]>([])
  const [activities, setActivities] = useState<ActivityType[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showQuickActions, setShowQuickActions] = useState(false)

  // Quick action forms
  const [meetingForm, setMeetingForm] = useState({
    title: '',
    date: '',
    time: '',
    participants: [] as string[]
  })

  const [announcementForm, setAnnouncementForm] = useState({
    title: '',
    content: '',
    priority: 'normal' as 'low' | 'normal' | 'high' | 'urgent',
    audience: 'all' as 'all' | 'hr' | 'employee' | 'candidate'
  })

  useEffect(() => {
    initializeStorage()
    const user = getCurrentUser()
    if (!user || user.role !== 'hr') {
      router.push('/login')
      return
    }
    setCurrentUser(user)
    loadData()
  }, [router])

  const loadData = () => {
    setCourses(getCourses())
    setUsers(getAllUsers())
    setMessages(getMessages())
    setBadges(getBadges())
    setActivities(getActivities())
    setLoading(false)
  }

  const getDashboardStats = () => {
    const totalUsers = users.length
    const hrUsers = users.filter(u => u.role === 'hr').length
    const employeeUsers = users.filter(u => u.role === 'employee').length
    const candidateUsers = users.filter(u => u.role === 'candidate').length
    const activeUsers = users.filter(u => u.isActive).length
    
    const totalCourses = courses.length
    const assignedCourses = courses.reduce((sum, course) => sum + course.assignedTo.length, 0)
    const completedCourses = users.filter(u => (u.progress || 0) >= 100).length
    const totalPoints = courses.reduce((sum, course) => sum + course.points, 0)
    
    const totalMessages = messages.length
    const unreadMessages = messages.filter(m => 
      m.senderId !== currentUser?.id && !m.readBy?.includes(currentUser!.id)
    ).length
    
    const recentActivities = activities.slice(0, 5)

    // Additional HR-specific stats
    const upcomingMeetings = activities.filter(a => 
      a.type === 'meeting_attended' && new Date(a.timestamp) > new Date()
    ).length
    
    const pendingEvaluations = users.filter(u => 
      u.role === 'candidate' && (u.progress || 0) < 50
    ).length

    return {
      users: { total: totalUsers, hr: hrUsers, employee: employeeUsers, candidate: candidateUsers, active: activeUsers },
      courses: { total: totalCourses, assigned: assignedCourses, completed: completedCourses, points: totalPoints },
      messages: { total: totalMessages, unread: unreadMessages },
      activities: recentActivities,
      meetings: { upcoming: upcomingMeetings },
      evaluations: { pending: pendingEvaluations }
    }
  }

  const handleCreateMeeting = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const meeting = createMeeting({
        title: meetingForm.title,
        description: `Scheduled meeting for ${meetingForm.date} at ${meetingForm.time}`,
        scheduledAt: `${meetingForm.date}T${meetingForm.time}`,
        participants: meetingForm.participants,
        createdBy: currentUser!.id
      })

      // Reset form
      setMeetingForm({
        title: '',
        date: '',
        time: '',
        participants: []
      })

      loadData()
      alert('Meeting scheduled successfully!')
    } catch (error) {
      console.error('Error creating meeting:', error)
      alert('Failed to schedule meeting')
    }
  }

  const handleCreateAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const announcement = createAnnouncement({
        title: announcementForm.title,
        content: announcementForm.content,
        priority: announcementForm.priority,
        audience: announcementForm.audience
      })

      // Reset form
      setAnnouncementForm({
        title: '',
        content: '',
        priority: 'normal',
        audience: 'all'
      })

      loadData()
      alert('Announcement created successfully!')
    } catch (error) {
      console.error('Error creating announcement:', error)
      alert('Failed to create announcement')
    }
  }

  const stats = getDashboardStats()

  if (loading) {
    return (
      <div className="flex h-screen bg-background">
        <HRSidebar userName={currentUser?.name || ''} />
        <main className="flex-1 p-8">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-24 bg-muted rounded"></div>
              ))}
            </div>
            <div className="h-96 bg-muted rounded"></div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-background">
      <HRSidebar userName={currentUser?.name || ''} />
      
      <main className="flex-1 ml-64 overflow-auto">
        <div className="p-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">HR Dashboard</h1>
              <p className="text-muted-foreground mt-2">
                Manage your entire learning ecosystem
              </p>
            </div>
            
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Button 
                onClick={() => setShowQuickActions(!showQuickActions)}
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                Quick Actions
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                <Bell className="h-4 w-4" />
                {stats.messages.unread > 0 && (
                  <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                )}
              </Button>
            </div>
          </div>

          {/* Quick Actions Panel */}
          {showQuickActions && (
            <Card className="p-6 bg-card border border-border mb-8">
              <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Schedule Meeting */}
                <div>
                  <h4 className="font-medium text-foreground mb-3 flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Schedule Meeting
                  </h4>
                  <form onSubmit={handleCreateMeeting} className="space-y-3">
                    <div>
                      <Label htmlFor="meeting-title">Title</Label>
                      <Input
                        id="meeting-title"
                        value={meetingForm.title}
                        onChange={(e) => setMeetingForm({...meetingForm, title: e.target.value})}
                        placeholder="Meeting title"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label htmlFor="meeting-date">Date</Label>
                        <Input
                          id="meeting-date"
                          type="date"
                          value={meetingForm.date}
                          onChange={(e) => setMeetingForm({...meetingForm, date: e.target.value})}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="meeting-time">Time</Label>
                        <Input
                          id="meeting-time"
                          type="time"
                          value={meetingForm.time}
                          onChange={(e) => setMeetingForm({...meetingForm, time: e.target.value})}
                          required
                        />
                      </div>
                    </div>
                    <Button type="submit" size="sm" className="w-full">
                      Schedule Meeting
                    </Button>
                  </form>
                </div>

                {/* Create Announcement */}
                <div>
                  <h4 className="font-medium text-foreground mb-3 flex items-center gap-2">
                    <Megaphone className="h-4 w-4" />
                    Create Announcement
                  </h4>
                  <form onSubmit={handleCreateAnnouncement} className="space-y-3">
                    <div>
                      <Label htmlFor="announcement-title">Title</Label>
                      <Input
                        id="announcement-title"
                        value={announcementForm.title}
                        onChange={(e) => setAnnouncementForm({...announcementForm, title: e.target.value})}
                        placeholder="Announcement title"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="announcement-content">Message</Label>
                      <textarea
                        id="announcement-content"
                        value={announcementForm.content}
                        onChange={(e) => setAnnouncementForm({...announcementForm, content: e.target.value})}
                        placeholder="Announcement content"
                        className="w-full px-3 py-2 border border-border rounded-md text-sm"
                        rows={3}
                        required
                      />
                    </div>
                    <Button type="submit" size="sm" className="w-full">
                      Send Announcement
                    </Button>
                  </form>
                </div>
              </div>
            </Card>
          )}

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="p-6 bg-card border border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Users</p>
                  <p className="text-2xl font-bold text-foreground mt-1">{stats.users.total}</p>
                  <p className="text-xs text-green-600 mt-1">+{stats.users.active} active</p>
                </div>
                <Users className="h-8 w-8 text-blue-500" />
              </div>
            </Card>

            <Card className="p-6 bg-card border border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Courses</p>
                  <p className="text-2xl font-bold text-foreground mt-1">{stats.courses.total}</p>
                  <p className="text-xs text-green-600 mt-1">{stats.courses.assigned} enrolled</p>
                </div>
                <BookOpen className="h-8 w-8 text-green-500" />
              </div>
            </Card>

            <Card className="p-6 bg-card border border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Meetings</p>
                  <p className="text-2xl font-bold text-foreground mt-1">{stats.meetings.upcoming}</p>
                  <p className="text-xs text-orange-600 mt-1">upcoming</p>
                </div>
                <Calendar className="h-8 w-8 text-orange-500" />
              </div>
            </Card>

            <Card className="p-6 bg-card border border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Evaluations</p>
                  <p className="text-2xl font-bold text-foreground mt-1">{stats.evaluations.pending}</p>
                  <p className="text-xs text-purple-600 mt-1">pending</p>
                </div>
                <Clipboard className="h-8 w-8 text-purple-500" />
              </div>
            </Card>
          </div>

          {/* Quick Access Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-card border border-border hover:shadow-lg transition-shadow cursor-pointer" onClick={() => router.push('/hr/courses')}>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <BookOpen className="h-8 w-8 text-blue-500" />
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">Courses</h3>
                <p className="text-sm text-muted-foreground mt-1">Manage training programs</p>
                <div className="mt-4 text-sm text-blue-600">{stats.courses.total} active courses</div>
              </div>
            </Card>

            <Card className="bg-card border border-border hover:shadow-lg transition-shadow cursor-pointer" onClick={() => router.push('/hr/users')}>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <Users className="h-8 w-8 text-green-500" />
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">Users</h3>
                <p className="text-sm text-muted-foreground mt-1">Manage learners and staff</p>
                <div className="mt-4 text-sm text-green-600">{stats.users.total} total users</div>
              </div>
            </Card>

            <Card className="bg-card border border-border hover:shadow-lg transition-shadow cursor-pointer" onClick={() => router.push('/hr/reports')}>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <PieChart className="h-8 w-8 text-purple-500" />
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">Reports</h3>
                <p className="text-sm text-muted-foreground mt-1">Analytics and insights</p>
                <div className="mt-4 text-sm text-purple-600">View detailed reports</div>
              </div>
            </Card>
          </div>

          {/* Recent Activity & Upcoming Events */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-card border border-border">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Recent Activity</h3>
                <div className="space-y-3">
                  {stats.activities.length > 0 ? (
                    stats.activities.map((activity) => (
                      <div key={activity.id} className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <Activity className="h-4 w-4 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-foreground">{activity.description}</p>
                          <p className="text-xs text-muted-foreground">{activity.type}</p>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {new Date(activity.timestamp).toLocaleDateString()}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-muted-foreground py-8">No recent activity</p>
                  )}
                </div>
              </div>
            </Card>

            <Card className="bg-card border border-border">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">System Overview</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Active Courses</span>
                    <span className="text-sm font-medium">{stats.courses.total}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Total Enrollments</span>
                    <span className="text-sm font-medium">{stats.courses.assigned}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Completion Rate</span>
                    <span className="text-sm font-medium text-green-600">
                      {stats.users.total > 0 ? Math.round((stats.courses.completed / stats.users.total) * 100) : 0}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Pending Evaluations</span>
                    <span className="text-sm font-medium text-orange-600">{stats.evaluations.pending}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Unread Messages</span>
                    <span className="text-sm font-medium text-blue-600">{stats.messages.unread}</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
