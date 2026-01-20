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
import { createCourse } from '@/lib/storage'
import { ArrowLeft, Plus, X } from 'lucide-react'
import Link from 'next/link'

interface Lesson {
  id: string
  title: string
  type: 'video' | 'document' | 'text'
  fileUrl?: string
  fileName?: string
}

export default function CreateCoursePage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [points, setPoints] = useState(50)
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [newLesson, setNewLesson] = useState({ title: '', type: 'text' as const })
  const [submitting, setSubmitting] = useState(false)

  const handleAddLesson = () => {
    if (newLesson.title.trim()) {
      const lesson: Lesson = {
        id: `lesson-${Date.now()}`,
        title: newLesson.title,
        type: newLesson.type,
        content: '',
        completed: false,
      }
      setLessons([...lessons, lesson])
      setNewLesson({ title: '', type: 'text' })
    }
  }

  const handleRemoveLesson = (id: string) => {
    setLessons(lessons.filter((l) => l.id !== id))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) {
      alert('Please enter a course title')
      return
    }

    setSubmitting(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 500))

      const course = createCourse({
        title,
        description,
        lessons: lessons.map((l) => ({
          ...l,
          content: '',
          courseId: `course-${Date.now()}`,
        })),
        assignedTo: [],
        points,
        createdBy: user!.id,
      })

      router.push('/admin/courses')
    } catch (error) {
      console.error('Error creating course:', error)
      alert('Failed to create course')
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
            <Link href="/admin/courses">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Create Course</h1>
              <p className="text-gray-600 text-sm mt-1">Add a new training course</p>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="p-8 max-w-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Course Details */}
            <Card>
              <CardHeader>
                <CardTitle>Course Details</CardTitle>
                <CardDescription>Basic information about your course</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title" className="font-medium">
                    Course Title
                  </Label>
                  <Input
                    id="title"
                    placeholder="e.g., Leadership Fundamentals"
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
                    placeholder="Describe what employees will learn..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    rows={4}
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
                    value={points}
                    onChange={(e) => setPoints(parseInt(e.target.value) || 50)}
                    className="mt-2"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Lessons */}
            <Card>
              <CardHeader>
                <CardTitle>Lessons</CardTitle>
                <CardDescription>Add lessons to your course</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Add Lesson Form */}
                <div className="border-b pb-4 space-y-3">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Lesson title"
                      value={newLesson.title}
                      onChange={(e) => setNewLesson({ ...newLesson, title: e.target.value })}
                      className="flex-1"
                    />
                    <select
                      value={newLesson.type}
                      onChange={(e) => setNewLesson({ ...newLesson, type: e.target.value as any })}
                      className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                    >
                      <option value="text">Text</option>
                      <option value="video">Video</option>
                      <option value="document">Document</option>
                    </select>
                    <Button
                      type="button"
                      onClick={handleAddLesson}
                      className="gap-2 bg-blue-600 hover:bg-blue-700"
                    >
                      <Plus className="w-4 h-4" />
                      Add
                    </Button>
                  </div>
                </div>

                {/* Lessons List */}
                {lessons.length > 0 ? (
                  <div className="space-y-2">
                    {lessons.map((lesson) => (
                      <div
                        key={lesson.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div>
                          <p className="font-medium text-gray-900">{lesson.title}</p>
                          <p className="text-xs text-gray-500 capitalize mt-1">{lesson.type}</p>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveLesson(lesson.id)}
                        >
                          <X className="w-4 h-4 text-gray-600" />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-gray-500 py-4">No lessons added yet</p>
                )}
              </CardContent>
            </Card>

            {/* Submit */}
            <div className="flex gap-3">
              <Button
                type="submit"
                disabled={submitting || !title.trim()}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {submitting ? 'Creating...' : 'Create Course'}
              </Button>
              <Link href="/admin/courses">
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
