'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { AdminSidebar } from '@/components/admin-sidebar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { getCourses, Course } from '@/lib/storage'
import { Plus, Edit2, Trash2, Users } from 'lucide-react'
import Link from 'next/link'

export default function CoursesPage() {
  const { user, loading } = useAuth()
  const [courses, setCourses] = useState<Course[]>([])
  const [deleteId, setDeleteId] = useState<string | null>(null)

  useEffect(() => {
    if (user?.role === 'admin') {
      setCourses(getCourses())
    }
  }, [user])

  const handleDelete = (id: string) => {
    const updated = courses.filter((c) => c.id !== id)
    setCourses(updated)
    localStorage.setItem('qedge_courses', JSON.stringify(updated))
    setDeleteId(null)
  }

  if (loading) return null
  if (!user || user.role !== 'admin') return null

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />

      <main className="flex-1 ml-64">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="px-8 py-6 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Courses</h1>
              <p className="text-gray-600 text-sm mt-1">Manage and create training courses</p>
            </div>
            <Link href="/admin/create-course">
              <Button className="gap-2 bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4" />
                Create Course
              </Button>
            </Link>
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
