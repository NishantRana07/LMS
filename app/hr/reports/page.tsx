'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { HRSidebar } from '@/components/hr-sidebar'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  PieChart, 
  BarChart3,
  TrendingUp,
  Users,
  BookOpen,
  Award,
  Calendar,
  Download,
  Filter,
  Activity
} from 'lucide-react'
import { 
  getCurrentUser, 
  getCourses, 
  getAllUsers,
  getActivities,
  initializeStorage
} from '@/lib/storage'
import type { User, Course, Activity as ActivityType } from '@/lib/storage'

export default function HRReports() {
  const router = useRouter()
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [courses, setCourses] = useState<Course[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [activities, setActivities] = useState<ActivityType[]>([])
  const [loading, setLoading] = useState(true)

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
    setActivities(getActivities())
    setLoading(false)
  }

  const getReportStats = () => {
    const totalUsers = users.length
    const activeUsers = users.filter(u => u.isActive).length
    const totalCourses = courses.length
    const totalEnrollments = courses.reduce((sum, course) => sum + course.assignedTo.length, 0)
    const completedCourses = users.filter(u => (u.progress || 0) >= 100).length
    const completionRate = totalUsers > 0 ? Math.round((completedCourses / totalUsers) * 100) : 0
    
    const roleDistribution = {
      hr: users.filter(u => u.role === 'hr').length,
      employee: users.filter(u => u.role === 'employee').length,
      candidate: users.filter(u => u.role === 'candidate').length
    }

    const courseStatus = {
      active: courses.filter(c => c.status === 'active').length,
      draft: courses.filter(c => c.status === 'draft').length,
      archived: courses.filter(c => c.status === 'archived').length
    }

    const recentActivities = activities.slice(0, 10)

    return {
      users: { total: totalUsers, active: activeUsers, completed: completedCourses },
      courses: { total: totalCourses, enrollments: totalEnrollments, completionRate },
      roleDistribution,
      courseStatus,
      recentActivities
    }
  }

  const stats = getReportStats()

  if (loading) {
    return (
      <div className="flex h-screen bg-background">
        <HRSidebar userName={currentUser?.name || ''} />
        <main className="flex-1 p-8">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-32 bg-muted rounded"></div>
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {[1, 2].map(i => (
                <div key={i} className="h-96 bg-muted rounded"></div>
              ))}
            </div>
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
              <h1 className="text-3xl font-bold text-foreground">Reports & Analytics</h1>
              <p className="text-muted-foreground mt-2">
                Comprehensive insights into your learning ecosystem
              </p>
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                Filter
              </Button>
              <Button className="gap-2">
                <Download className="h-4 w-4" />
                Export
              </Button>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="p-6 bg-card border border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Users</p>
                  <p className="text-2xl font-bold text-foreground mt-1">{stats.users.total}</p>
                  <p className="text-xs text-green-600 mt-1">{stats.users.active} active</p>
                </div>
                <Users className="h-8 w-8 text-blue-500" />
              </div>
            </Card>

            <Card className="p-6 bg-card border border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Courses</p>
                  <p className="text-2xl font-bold text-foreground mt-1">{stats.courses.total}</p>
                  <p className="text-xs text-blue-600 mt-1">{stats.courses.enrollments} enrollments</p>
                </div>
                <BookOpen className="h-8 w-8 text-green-500" />
              </div>
            </Card>

            <Card className="p-6 bg-card border border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Completion Rate</p>
                  <p className="text-2xl font-bold text-foreground mt-1">{stats.courses.completionRate}%</p>
                  <p className="text-xs text-purple-600 mt-1">{stats.users.completed} completed</p>
                </div>
                <Award className="h-8 w-8 text-purple-500" />
              </div>
            </Card>

            <Card className="p-6 bg-card border border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Activities</p>
                  <p className="text-2xl font-bold text-foreground mt-1">{activities.length}</p>
                  <p className="text-xs text-orange-600 mt-1">total tracked</p>
                </div>
                <Activity className="h-8 w-8 text-orange-500" />
              </div>
            </Card>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* User Role Distribution */}
            <Card className="bg-card border border-border">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  User Role Distribution
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                      <span className="text-sm text-foreground">HR Staff</span>
                    </div>
                    <span className="text-sm font-medium">{stats.roleDistribution.hr}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span className="text-sm text-foreground">Employees</span>
                    </div>
                    <span className="text-sm font-medium">{stats.roleDistribution.employee}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-foreground">Candidates</span>
                    </div>
                    <span className="text-sm font-medium">{stats.roleDistribution.candidate}</span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Course Status */}
            <Card className="bg-card border border-border">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Course Status Overview
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-foreground">Active</span>
                    </div>
                    <span className="text-sm font-medium">{stats.courseStatus.active}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <span className="text-sm text-foreground">Draft</span>
                    </div>
                    <span className="text-sm font-medium">{stats.courseStatus.draft}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                      <span className="text-sm text-foreground">Archived</span>
                    </div>
                    <span className="text-sm font-medium">{stats.courseStatus.archived}</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Recent Activities */}
          <Card className="bg-card border border-border">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Recent Activities
              </h3>
              <div className="space-y-3">
                {stats.recentActivities.length > 0 ? (
                  stats.recentActivities.map((activity) => (
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
                  <p className="text-center text-muted-foreground py-8">No recent activities</p>
                )}
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  )
}
