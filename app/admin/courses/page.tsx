'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Sidebar } from '@/components/sidebar'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  BookOpen, 
  Search, 
  Filter, 
  Plus, 
  Edit, 
  Trash2, 
  Users, 
  TrendingUp,
  Award,
  Clock,
  Target,
  Star
} from 'lucide-react'
import { 
  getCurrentUser, 
  getCourses, 
  getAllUsers, 
  getBadges,
  initializeStorage,
  deleteCourse
} from '@/lib/storage'
import type { User, Course, Badge } from '@/lib/storage'

export default function CoursesManagement() {
  const router = useRouter()
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [courses, setCourses] = useState<Course[]>([])
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [badges, setBadges] = useState<Badge[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all')

  useEffect(() => {
    initializeStorage()
    const user = getCurrentUser()
    if (!user || user.role !== 'hr') {
      router.push('/login')
      return
    }
    setCurrentUser(user)
    loadCourses()
    loadUsers()
    loadBadges()
  }, [router])

  useEffect(() => {
    filterCourses()
  }, [courses, searchTerm, categoryFilter, difficultyFilter])

  const loadCourses = () => {
    const allCourses = getCourses()
    setCourses(allCourses)
  }

  const loadUsers = () => {
    const allUsers = getAllUsers()
    setUsers(allUsers)
  }

  const loadBadges = () => {
    const allBadges = getBadges()
    setBadges(allBadges)
  }

  const filterCourses = () => {
    let filtered = courses

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(course => 
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(course => course.category === categoryFilter)
    }

    // Difficulty filter
    if (difficultyFilter !== 'all') {
      filtered = filtered.filter(course => course.difficulty === difficultyFilter)
    }

    setFilteredCourses(filtered)
  }

  const handleDeleteCourse = async (courseId: string) => {
    if (confirm('Are you sure you want to delete this course? This action cannot be undone.')) {
      try {
        // In a real app, this would call a delete function
        const updatedCourses = courses.filter(c => c.id !== courseId)
        localStorage.setItem('qedge_courses', JSON.stringify(updatedCourses))
        setCourses(updatedCourses)
        alert('Course deleted successfully!')
      } catch (error) {
        console.error('Error deleting course:', error)
        alert('Failed to delete course')
      }
    }
  }

  const getCourseStats = () => {
    const total = courses.length
    const assigned = courses.reduce((sum, course) => sum + course.assignedTo.length, 0)
    const completed = users.filter(u => (u.progress || 0) >= 100).length
    const totalPoints = courses.reduce((sum, course) => sum + course.points, 0)
    
    return { total, assigned, completed, totalPoints }
  }

  const getBadgeInfo = (badgeId: string) => {
    return badges.find(badge => badge.id === badgeId)
  }

  const getEnrollmentStats = (course: Course) => {
    const enrolled = course.assignedTo.length
    const completed = users.filter(u => 
      course.assignedTo.includes(u.id) && (u.progress || 0) >= 100
    ).length
    const inProgress = enrolled - completed
    
    return { enrolled, completed, inProgress }
  }

  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-100 text-green-800'
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800'
      case 'advanced':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const stats = getCourseStats()

  if (loading) {
    return (
      <div className="flex h-screen bg-background">
        <Sidebar />
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
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Courses Management</h1>
              <p className="text-muted-foreground mt-2">Manage training courses and track progress</p>
            </div>
            <Button 
              onClick={() => router.push('/admin/dashboard')}
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              Create Course
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="p-6 bg-card border border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Courses</p>
                  <p className="text-2xl font-bold text-foreground mt-1">{stats.total}</p>
                </div>
                <BookOpen className="h-8 w-8 text-primary/50" />
              </div>
            </Card>

            <Card className="p-6 bg-card border border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Enrollments</p>
                  <p className="text-2xl font-bold text-foreground mt-1">{stats.assigned}</p>
                </div>
                <Users className="h-8 w-8 text-blue-500" />
              </div>
            </Card>

            <Card className="p-6 bg-card border border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Completed</p>
                  <p className="text-2xl font-bold text-foreground mt-1">{stats.completed}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-500" />
              </div>
            </Card>

            <Card className="p-6 bg-card border border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Points</p>
                  <p className="text-2xl font-bold text-foreground mt-1">{stats.totalPoints}</p>
                </div>
                <Award className="h-8 w-8 text-orange-500" />
              </div>
            </Card>
          </div>

          {/* Filters */}
          <Card className="p-6 bg-card border border-border mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search courses..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-3 py-2 border border-border rounded-md bg-background text-foreground"
              >
                <option value="all">All Categories</option>
                <option value="onboarding">Onboarding</option>
                <option value="technical">Technical</option>
                <option value="compliance">Compliance</option>
                <option value="leadership">Leadership</option>
              </select>

              <select
                value={difficultyFilter}
                onChange={(e) => setDifficultyFilter(e.target.value)}
                className="px-3 py-2 border border-border rounded-md bg-background text-foreground"
              >
                <option value="all">All Levels</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
          </Card>

          {/* Courses Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => {
              const enrollmentStats = getEnrollmentStats(course)
              const badgeInfo = course.badge ? getBadgeInfo(course.badge) : null
              
              return (
                <Card key={course.id} className="bg-card border border-border overflow-hidden hover:shadow-lg transition-shadow">
                  {/* Course Header */}
                  <div className="relative h-32 bg-gradient-to-r from-blue-500 to-purple-600 p-4">
                    <div className="absolute top-2 right-2">
                      {badgeInfo && (
                        <div className="bg-white/90 backdrop-blur-sm rounded-full p-2">
                          <span className="text-lg">{badgeInfo.icon}</span>
                        </div>
                      )}
                    </div>
                    <div className="absolute bottom-2 left-2 right-2">
                      <h3 className="text-white font-bold text-lg truncate">{course.title}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        {course.difficulty && (
                          <span className={`inline-flex px-2 py-0.5 text-xs font-semibold rounded-full ${getDifficultyColor(course.difficulty)}`}>
                            {course.difficulty}
                          </span>
                        )}
                        {course.category && (
                          <span className="inline-flex px-2 py-0.5 text-xs font-semibold rounded-full bg-white/20 text-white">
                            {course.category}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Course Content */}
                  <div className="p-4">
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {course.description}
                    </p>

                    {/* Course Stats */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground">Enrolled</p>
                          <p className="text-sm font-semibold">{enrollmentStats.enrolled}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Target className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground">Completed</p>
                          <p className="text-sm font-semibold">{enrollmentStats.completed}</p>
                        </div>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-muted-foreground">Completion Rate</span>
                        <span className="text-xs text-muted-foreground">
                          {enrollmentStats.enrolled > 0 
                            ? Math.round((enrollmentStats.completed / enrollmentStats.enrolled) * 100) 
                            : 0}%
                        </span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full transition-all duration-300" 
                          style={{ 
                            width: `${enrollmentStats.enrolled > 0 
                              ? (enrollmentStats.completed / enrollmentStats.enrolled) * 100 
                              : 0}%` 
                          }}
                        ></div>
                      </div>
                    </div>

                    {/* Course Details */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <Award className="h-4 w-4 text-yellow-500" />
                        <span className="text-sm font-medium">{course.points} points</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">{course.lessons.length} lessons</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => router.push(`/admin/courses/${course.id}/edit`)}
                        className="flex-1 gap-1"
                      >
                        <Edit className="h-3 w-3" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteCourse(course.id)}
                        className="gap-1 text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-3 w-3" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>

          {filteredCourses.length === 0 && (
            <div className="text-center py-12">
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No courses found</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
          </div>
        </header>

        {/* Content */}
        <div className="p-8">
          {courses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <Card key={course.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="line-clamp-2">{course.title}</CardTitle>
                        <CardDescription className="mt-1 line-clamp-2">
                          {course.description}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Course Stats */}
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1 text-gray-600">
                          <Users className="w-4 h-4" />
                          <span>{course.assignedTo.length} assigned</span>
                        </div>
                        <div className="text-gray-600">
                          <span>{course.lessons.length} lessons</span>
                        </div>
                      </div>

                      {/* Points Info */}
                      <div className="bg-blue-50 p-2 rounded text-sm">
                        <p className="text-gray-700">
                          <span className="font-semibold">{course.points}</span> points per completion
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <Link href={`/admin/courses/${course.id}`} className="flex-1">
                          <Button variant="outline" size="sm" className="w-full bg-transparent">
                            <Edit2 className="w-4 h-4" />
                            Edit
                          </Button>
                        </Link>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => setDeleteId(course.id)}
                          className="flex-1"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </Button>
                      </div>

                      {/* Delete Confirmation */}
                      {deleteId === course.id && (
                        <div className="bg-red-50 p-3 rounded border border-red-200">
                          <p className="text-sm text-red-900 mb-2">Confirm delete?</p>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDelete(course.id)}
                              className="flex-1"
                            >
                              Confirm
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setDeleteId(null)}
                              className="flex-1"
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="text-center py-12">
              <CardContent>
                <p className="text-gray-600 mb-4">No courses created yet</p>
                <Link href="/admin/create-course">
                  <Button className="gap-2 bg-blue-600 hover:bg-blue-700">
                    <Plus className="w-4 h-4" />
                    Create Your First Course
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}
