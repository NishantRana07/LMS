'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { UnifiedSidebar } from '@/components/unified-sidebar'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Users, 
  BookOpen, 
  Calendar, 
  TrendingUp, 
  Mail, 
  Activity,
  Plus
} from 'lucide-react'
import { 
  getCurrentUser, 
  getAllUsers, 
  getCourses, 
  initializeStorage
} from '@/lib/storage'
import type { User, Course } from '@/lib/storage'

export default function AdminDashboard() {
  const router = useRouter()
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [users, setUsers] = useState<User[]>([])
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const user = getCurrentUser()
    if (!user) {
      router.push('/login')
      return
    }
    setCurrentUser(user)
    
    const allUsers = getAllUsers()
    const allCourses = getCourses()
    
    setUsers(allUsers)
    setCourses(allCourses)
    setLoading(false)
  }, [router])

  const stats = {
    totalUsers: users.length,
    totalCourses: courses.length,
  }

  if (loading) {
    return (
      <div className="flex h-screen bg-background">
        <UnifiedSidebar userRole="hr" userName="Admin" />
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            <div className="animate-pulse">
              <div className="h-8 bg-muted rounded mb-4 w-48"></div>
              <div className="h-4 bg-muted rounded mb-2 w-32"></div>
              <div className="h-4 bg-muted rounded mb-8 w-64"></div>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-background">
      <UnifiedSidebar userRole="hr" userName="Admin" />
      <main className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-foreground mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground">Welcome back! Here's what's happening with your LMS.</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                  <p className="text-2xl font-bold text-foreground">{stats.totalUsers}</p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </Card>
            
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Courses</p>
                  <p className="text-2xl font-bold text-foreground">{stats.totalCourses}</p>
                </div>
                <BookOpen className="h-8 w-8 text-purple-600" />
              </div>
            </Card>
            
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Users</p>
                  <p className="text-2xl font-bold text-foreground">{stats.totalUsers}</p>
                </div>
                <Activity className="h-8 w-8 text-green-600" />
              </div>
            </Card>
            
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Courses</p>
                  <p className="text-2xl font-bold text-foreground">{stats.totalCourses}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-orange-600" />
              </div>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-foreground mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button className="gap-2 h-20 flex-col">
                <Plus className="h-6 w-6" />
                <span>Create Course</span>
              </Button>
              <Button variant="outline" className="gap-2 h-20 flex-col">
                <Users className="h-6 w-6" />
                <span>Add User</span>
              </Button>
              <Button variant="outline" className="gap-2 h-20 flex-col">
                <Calendar className="h-6 w-6" />
                <span>Schedule Event</span>
              </Button>
              <Button variant="outline" className="gap-2 h-20 flex-col">
                <Mail className="h-6 w-6" />
                <span>Send Notice</span>
              </Button>
            </div>
          </Card>
        </div>
      </main>
    </div>
  )
}
