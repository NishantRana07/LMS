'use client'

import React from "react"

import { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { AdminSidebar } from '@/components/admin-sidebar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { getCourses } from '@/lib/storage'
import { User } from '@/lib/storage'
import { Plus, Trash2 } from 'lucide-react'

export default function UsersPage() {
  const { user, loading } = useAuth()
  const [users, setUsers] = useState<User[]>([])
  const [newUserEmail, setNewUserEmail] = useState('')
  const [newUserPassword, setNewUserPassword] = useState('')
  const [newUserName, setNewUserName] = useState('')
  const [newUserRole, setNewUserRole] = useState<'admin' | 'employee'>('employee')
  const [submitting, setSubmitting] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [courses, setCourses] = useState<any[]>([])
  const [courseAssignments, setCourseAssignments] = useState<Map<string, string[]>>(new Map())

  useEffect(() => {
    if (user?.role === 'admin') {
      const allUsers = JSON.parse(localStorage.getItem('qedge_users') || '[]') as User[]
      setUsers(allUsers)

      const allCourses = getCourses()
      setCourses(allCourses)

      // Load course assignments
      const assignments = new Map<string, string[]>()
      allCourses.forEach((course) => {
        assignments.set(course.id, course.assignedTo)
      })
      setCourseAssignments(assignments)
    }
  }, [user])

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newUserEmail.trim() || !newUserName.trim()) {
      alert('Please fill in all fields')
      return
    }

    setSubmitting(true)
    try {
      const newUser: User = {
        id: `user-${Date.now()}`,
        email: newUserEmail,
        password: newUserPassword || 'password123',
        role: newUserRole,
        name: newUserName,
        createdAt: new Date().toISOString(),
      }

      const updated = [...users, newUser]
      setUsers(updated)
      localStorage.setItem('qedge_users', JSON.stringify(updated))

      setNewUserEmail('')
      setNewUserPassword('')
      setNewUserName('')
      setNewUserRole('employee')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteUser = (userId: string) => {
    const updated = users.filter((u) => u.id !== userId)
    setUsers(updated)
    localStorage.setItem('qedge_users', JSON.stringify(updated))
    setDeleteId(null)
  }

  const handleAssignCourse = (userId: string, courseId: string) => {
    const assignments = new Map(courseAssignments)
    const courseAssigned = assignments.get(courseId) || []

    let updated: string[]
    if (courseAssigned.includes(userId)) {
      updated = courseAssigned.filter((id) => id !== userId)
    } else {
      updated = [...courseAssigned, userId]
    }

    assignments.set(courseId, updated)
    setCourseAssignments(assignments)

    // Update courses in storage
    const allCourses = getCourses()
    const updatedCourses = allCourses.map((c) => ({
      ...c,
      assignedTo: assignments.get(c.id) || [],
    }))
    localStorage.setItem('qedge_courses', JSON.stringify(updatedCourses))
  }

  if (loading) return null
  if (!user || user.role !== 'admin') return null

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />

      <main className="flex-1 ml-64">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="px-8 py-6">
            <h1 className="text-3xl font-bold text-gray-900">Users</h1>
            <p className="text-gray-600 text-sm mt-1">Manage employees and assign courses</p>
          </div>
        </header>

        {/* Content */}
        <div className="p-8">
          {/* Create User Form */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Add New User</CardTitle>
              <CardDescription>Create a new employee or admin account</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateUser} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name" className="font-medium text-sm">
                      Name
                    </Label>
                    <Input
                      id="name"
                      placeholder="Full name"
                      value={newUserName}
                      onChange={(e) => setNewUserName(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email" className="font-medium text-sm">
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="user@company.com"
                      value={newUserEmail}
                      onChange={(e) => setNewUserEmail(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="password" className="font-medium text-sm">
                      Password (optional)
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Leave blank for default"
                      value={newUserPassword}
                      onChange={(e) => setNewUserPassword(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="role" className="font-medium text-sm">
                      Role
                    </Label>
                    <select
                      id="role"
                      value={newUserRole}
                      onChange={(e) => setNewUserRole(e.target.value as any)}
                      className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    >
                      <option value="employee">Employee</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                </div>
                <Button type="submit" disabled={submitting} className="gap-2 bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4" />
                  {submitting ? 'Adding...' : 'Add User'}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Users List */}
          <Card>
            <CardHeader>
              <CardTitle>All Users ({users.length})</CardTitle>
              <CardDescription>Manage user accounts and course assignments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {users.map((userItem) => (
                  <div key={userItem.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-gray-900">{userItem.name}</h3>
                        <p className="text-sm text-gray-600">{userItem.email}</p>
                        <span className="inline-block mt-2 px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded capitalize">
                          {userItem.role}
                        </span>
                      </div>
                      {userItem.id !== user.id && (
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => setDeleteId(userItem.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>

                    {/* Delete Confirmation */}
                    {deleteId === userItem.id && (
                      <div className="bg-red-50 p-3 rounded border border-red-200 mb-4">
                        <p className="text-sm text-red-900 mb-2">Confirm delete this user?</p>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDeleteUser(userItem.id)}
                          >
                            Confirm
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setDeleteId(null)}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* Course Assignments for Employees */}
                    {userItem.role === 'employee' && courses.length > 0 && (
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-2">Assign Courses:</p>
                        <div className="space-y-2">
                          {courses.map((course) => (
                            <label
                              key={course.id}
                              className="flex items-center gap-2 cursor-pointer text-sm"
                            >
                              <input
                                type="checkbox"
                                checked={(courseAssignments.get(course.id) || []).includes(userItem.id)}
                                onChange={() => handleAssignCourse(userItem.id, course.id)}
                                className="w-4 h-4 rounded border-gray-300"
                              />
                              <span className="text-gray-700">{course.title}</span>
                              <span className="text-xs text-gray-500">({course.points} pts)</span>
                            </label>
                          ))}
                          {courses.length === 0 && (
                            <p className="text-xs text-gray-500 italic">No courses available</p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
