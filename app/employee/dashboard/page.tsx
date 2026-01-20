'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { EmployeeSidebar } from '@/components/employee-sidebar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { getCourses, getMeetings, getNotifications, getUserPoints } from '@/lib/storage'
import { BookOpen, Zap, Calendar, Bell, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function EmployeeDashboard() {
  const { user, loading } = useAuth()
  const [assignedCourses, setAssignedCourses] = useState<any[]>([])
  const [upcomingMeetings, setUpcomingMeetings] = useState<any[]>([])
  const [notifications, setNotifications] = useState<any[]>([])
  const [totalPoints, setTotalPoints] = useState(0)

  useEffect(() => {
    if (user?.role === 'employee') {
      // Get assigned courses
      const allCourses = getCourses()
      const assigned = allCourses.filter((c) => c.assignedTo.includes(user.id))
      setAssignedCourses(assigned.slice(0, 6))

      // Get upcoming meetings
      const allMeetings = getMeetings()
      const upcoming = allMeetings
        .filter((m) => m.participants.includes(user.id) && new Date(m.scheduledAt) > new Date())
        .sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime())
        .slice(0, 5)
      setUpcomingMeetings(upcoming)

      // Get notifications
      const userNotifications = getNotifications(user.id)
      setNotifications(userNotifications.filter((n) => !n.read).slice(0, 5))

      // Get total points
      const points = getUserPoints(user.id)
      setTotalPoints(points)
    }
  }, [user])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-600">Loading...</div>
      </div>
    )
  }

  if (!user || user.role !== 'employee') {
    return null
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <EmployeeSidebar />

      {/* Main Content */}
      <main className="flex-1 ml-64">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="px-8 py-6">
            <h1 className="text-3xl font-bold text-gray-900">Welcome, {user.name}</h1>
            <p className="text-gray-600 text-sm mt-1">Keep learning and growing with QEdge</p>
          </div>
        </header>

        {/* Content */}
        <div className="p-8">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {/* Assigned Courses */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Assigned Courses</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{assignedCourses.length}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Total Points */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Points Earned</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{totalPoints}</p>
                  </div>
                  <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <Zap className="w-6 h-6 text-yellow-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Meetings */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Upcoming Meetings</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{upcomingMeetings.length}</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* My Courses */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>My Courses</CardTitle>
                    <CardDescription>Your assigned training courses</CardDescription>
                  </div>
                  {assignedCourses.length > 0 && (
                    <Link href="/employee/courses">
                      <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                        View All
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </Link>
                  )}
                </CardHeader>
                <CardContent>
                  {assignedCourses.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {assignedCourses.map((course) => (
                        <Link key={course.id} href={`/employee/course/${course.id}`}>
                          <div className="p-4 border border-gray-200 rounded-lg hover:border-blue-400 hover:shadow-md transition-all cursor-pointer">
                            <h3 className="font-semibold text-gray-900 line-clamp-2">{course.title}</h3>
                            <p className="text-sm text-gray-600 mt-2 line-clamp-1">{course.description}</p>
                            <div className="flex items-center gap-2 mt-3 text-xs">
                              <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded">
                                {course.lessons.length} lessons
                              </span>
                              <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded">
                                {course.points} pts
                              </span>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-600 mb-4">No courses assigned yet</p>
                      <p className="text-sm text-gray-500">Check back soon for new learning opportunities</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              {/* Notifications */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="w-5 h-5" />
                    <span>Notifications</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {notifications.length > 0 ? (
                    <div className="space-y-3">
                      {notifications.map((notif) => (
                        <div key={notif.id} className="text-sm p-2 bg-blue-50 rounded border border-blue-200">
                          <p className="font-medium text-blue-900">{notif.title}</p>
                          <p className="text-blue-800 text-xs mt-1">{notif.message}</p>
                        </div>
                      ))}
                      <Link href="/employee/notifications">
                        <Button variant="outline" size="sm" className="w-full bg-transparent">
                          View All
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    <p className="text-center text-gray-500 py-4 text-sm">No new notifications</p>
                  )}
                </CardContent>
              </Card>

              {/* Quick Links */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Quick Links</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Link href="/employee/courses" className="block">
                    <Button variant="outline" className="w-full justify-start bg-transparent">
                      <BookOpen className="w-4 h-4 mr-2" />
                      Browse Courses
                    </Button>
                  </Link>
                  <Link href="/employee/meetings" className="block">
                    <Button variant="outline" className="w-full justify-start bg-transparent">
                      <Calendar className="w-4 h-4 mr-2" />
                      My Meetings
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
