'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { HRSidebar } from '@/components/hr-sidebar'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  BarChart3,
  TrendingUp,
  Users,
  BookOpen,
  Clock,
  Award,
  Calendar,
  Download,
  Filter,
  Target,
  Activity,
  PieChart
} from 'lucide-react'
import { 
  getCurrentUser, 
  getCourses,
  getAllUsers,
  getActivities,
  initializeStorage
} from '@/lib/storage'
import type { User, Course, Activity as ActivityType } from '@/lib/storage'

export default function HRAnalytics() {
  const router = useRouter()
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [courses, setCourses] = useState<Course[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [activities, setActivities] = useState<ActivityType[]>([])
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState<string>('30d')

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

  const getAnalyticsData = () => {
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

    const courseStats = {
      total: totalCourses,
      active: courses.filter(c => c.status === 'active').length,
      draft: courses.filter(c => c.status === 'draft').length,
      archived: courses.filter(c => c.status === 'archived').length
    }

    const engagementMetrics = {
      avgProgress: users.reduce((sum, u) => sum + (u.progress || 0), 0) / users.length,
      avgAttendance: users.reduce((sum, u) => sum + (u.attendance || 0), 0) / users.length,
      totalPoints: users.reduce((sum, u) => sum + (u.points || 0), 0),
      totalBadges: users.reduce((sum, u) => sum + (u.badges?.length || 0), 0)
    }

    const recentActivity = activities.slice(0, 10)

    return {
      users: { total: totalUsers, active: activeUsers, completed: completedCourses },
      courses: courseStats,
      enrollments: totalEnrollments,
      completionRate,
      roleDistribution,
      engagementMetrics,
      recentActivity
    }
  }

  const analytics = getAnalyticsData()

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
              {[1, 2, 3, 4].map(i => (
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
              <h1 className="text-3xl font-bold text-foreground">Analytics Dashboard</h1>
              <p className="text-muted-foreground mt-2">
                Deep insights into your learning ecosystem performance
              </p>
            </div>
            
            <div className="flex gap-2">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-3 py-2 border border-border rounded-md bg-background"
              >
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
                <option value="90d">Last 90 Days</option>
                <option value="1y">Last Year</option>
              </select>
              <Button variant="outline" className="gap-2">
                <Download className="h-4 w-4" />
                Export Report
              </Button>
            </div>
          </div>

          {/* Key Performance Indicators */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="p-6 bg-card border border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Users</p>
                  <p className="text-2xl font-bold text-foreground mt-1">{analytics.users.total}</p>
                  <p className="text-xs text-green-600 mt-1">
                    +{analytics.users.active} active ({Math.round((analytics.users.active / analytics.users.total) * 100)}%)
                  </p>
                </div>
                <Users className="h-8 w-8 text-blue-500" />
              </div>
            </Card>

            <Card className="p-6 bg-card border border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Completion Rate</p>
                  <p className="text-2xl font-bold text-foreground mt-1">{analytics.completionRate}%</p>
                  <p className="text-xs text-purple-600 mt-1">
                    {analytics.users.completed} users completed
                  </p>
                </div>
                <Target className="h-8 w-8 text-green-500" />
              </div>
            </Card>

            <Card className="p-6 bg-card border border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Avg. Progress</p>
                  <p className="text-2xl font-bold text-foreground mt-1">
                    {Math.round(analytics.engagementMetrics.avgProgress)}%
                  </p>
                  <p className="text-xs text-blue-600 mt-1">
                    Across all users
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-purple-500" />
              </div>
            </Card>

            <Card className="p-6 bg-card border border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Points</p>
                  <p className="text-2xl font-bold text-foreground mt-1">
                    {analytics.engagementMetrics.totalPoints}
                  </p>
                  <p className="text-xs text-orange-600 mt-1">
                    {Math.round(analytics.engagementMetrics.totalPoints / analytics.users.total)} per user
                  </p>
                </div>
                <Award className="h-8 w-8 text-orange-500" />
              </div>
            </Card>
          </div>

          {/* Analytics Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* User Role Distribution */}
            <Card className="bg-card border border-border">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  User Role Distribution
                </h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-foreground">HR Staff</span>
                      <span className="text-sm font-medium">{analytics.roleDistribution.hr}</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(analytics.roleDistribution.hr / analytics.users.total) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-foreground">Employees</span>
                      <span className="text-sm font-medium">{analytics.roleDistribution.employee}</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(analytics.roleDistribution.employee / analytics.users.total) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-foreground">Candidates</span>
                      <span className="text-sm font-medium">{analytics.roleDistribution.candidate}</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(analytics.roleDistribution.candidate / analytics.users.total) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Course Status Overview */}
            <Card className="bg-card border border-border">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Course Status Overview
                </h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-foreground">Active</span>
                      <span className="text-sm font-medium">{analytics.courses.active}</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(analytics.courses.active / analytics.courses.total) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-foreground">Draft</span>
                      <span className="text-sm font-medium">{analytics.courses.draft}</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-yellow-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(analytics.courses.draft / analytics.courses.total) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-foreground">Archived</span>
                      <span className="text-sm font-medium">{analytics.courses.archived}</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-gray-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(analytics.courses.archived / analytics.courses.total) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Engagement Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-card border border-border">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Attendance Rate
                </h3>
                <div className="text-center">
                  <p className="text-3xl font-bold text-foreground mb-2">
                    {Math.round(analytics.engagementMetrics.avgAttendance)}%
                  </p>
                  <p className="text-sm text-muted-foreground">Average across all users</p>
                </div>
              </div>
            </Card>

            <Card className="bg-card border border-border">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Badges Earned
                </h3>
                <div className="text-center">
                  <p className="text-3xl font-bold text-foreground mb-2">
                    {analytics.engagementMetrics.totalBadges}
                  </p>
                  <p className="text-sm text-muted-foreground">Total badges awarded</p>
                </div>
              </div>
            </Card>

            <Card className="bg-card border border-border">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Enrollments
                </h3>
                <div className="text-center">
                  <p className="text-3xl font-bold text-foreground mb-2">
                    {analytics.enrollments}
                  </p>
                  <p className="text-sm text-muted-foreground">Total course enrollments</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Recent Activity Timeline */}
          <Card className="bg-card border border-border">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Recent Activity Timeline
              </h3>
              <div className="space-y-3">
                {analytics.recentActivity.length > 0 ? (
                  analytics.recentActivity.map((activity) => (
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
        </div>
      </main>
    </div>
  )
}
