'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { useParams } from 'next/navigation'
import { EmployeeSidebar } from '@/components/employee-sidebar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { getCourseById, updateCourseStat, addPoints, getCourseStat, createNotification } from '@/lib/storage'
import { ArrowLeft, CheckCircle, Circle, Zap } from 'lucide-react'
import Link from 'next/link'

export default function CourseViewPage() {
  const { user, loading } = useAuth()
  const { id } = useParams()
  const courseId = Array.isArray(id) ? id[0] : id

  const [course, setCourse] = useState<any>(null)
  const [currentLesson, setCurrentLesson] = useState<number>(0)
  const [stat, setStat] = useState<any>(null)
  const [completingLesson, setCompletingLesson] = useState(false)

  useEffect(() => {
    if (user?.role === 'employee' && courseId) {
      const courseData = getCourseById(courseId)
      setCourse(courseData)

      const courseStat = getCourseStat(user.id, courseId)
      if (courseStat) {
        setStat(courseStat)
      } else {
        // Initialize stat if not exists
        const newStat = {
          userId: user.id,
          courseId,
          started: true,
          lessonsCompleted: 0,
          totalLessons: courseData?.lessons.length || 0,
          pointsEarned: 0,
        }
        updateCourseStat(user.id, courseId, newStat)
        setStat(newStat)
      }
    }
  }, [user, courseId])

  const handleCompleteLesson = async () => {
    if (!course || currentLesson >= course.lessons.length) return

    setCompletingLesson(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 800))

      const newStat = {
        started: true,
        lessonsCompleted: currentLesson + 1,
        totalLessons: course.lessons.length,
        pointsEarned: currentLesson + 1 === course.lessons.length ? course.points : 0,
      }

      const updated = updateCourseStat(user!.id, courseId as string, newStat)
      setStat(updated)

      // Award points if course is complete
      if (currentLesson + 1 === course.lessons.length) {
        addPoints(user!.id, courseId as string, course.points)
        createNotification({
          userId: user!.id,
          type: 'course_completed',
          title: 'Course Completed!',
          message: `Congratulations! You've earned ${course.points} points for completing "${course.title}"`,
          read: false,
        })
      }

      // Move to next lesson if available
      if (currentLesson + 1 < course.lessons.length) {
        setCurrentLesson(currentLesson + 1)
      }
    } finally {
      setCompletingLesson(false)
    }
  }

  if (loading) return null
  if (!user || user.role !== 'employee' || !course) return null

  const currentLessonData = course.lessons[currentLesson]
  const progress = (stat?.lessonsCompleted || 0) / course.lessons.length * 100
  const isCompleted = stat?.lessonsCompleted >= course.lessons.length

  return (
    <div className="flex min-h-screen bg-gray-50">
      <EmployeeSidebar />

      <main className="flex-1 ml-64">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="px-8 py-6">
            <div className="flex items-center gap-4 mb-4">
              <Link href="/employee/courses">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="w-4 h-4" />
                </Button>
              </Link>
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-gray-900">{course.title}</h1>
                <p className="text-gray-600 text-sm mt-1">{course.description}</p>
              </div>
            </div>

            {/* Progress Bar */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Course Progress</span>
                <span className="text-sm text-gray-600">{Math.round(progress)}%</span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-blue-600 transition-all" style={{ width: `${progress}%` }} />
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="p-8 max-w-5xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">{currentLessonData.title}</CardTitle>
                  <CardDescription>Lesson {currentLesson + 1} of {course.lessons.length}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Lesson Content */}
                  <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                    {currentLessonData.type === 'video' ? (
                      <div className="aspect-video bg-gray-800 rounded-lg flex items-center justify-center">
                        <div className="text-center">
                          <div className="w-20 h-20 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                            <div className="w-0 h-0 border-l-10 border-r-10 border-t-6 border-l-transparent border-r-transparent border-t-white ml-1" />
                          </div>
                          <p className="text-white text-sm">Video Content</p>
                          <p className="text-gray-400 text-xs mt-2">Demo video player</p>
                        </div>
                      </div>
                    ) : currentLessonData.type === 'document' ? (
                      <div className="space-y-4">
                        <div className="flex items-center gap-3 p-4 bg-white border border-gray-300 rounded">
                          <div className="w-10 h-10 bg-blue-100 rounded flex items-center justify-center">
                            <span className="text-sm font-bold text-blue-600">PDF</span>
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">{currentLessonData.fileName || 'Document'}</p>
                            <p className="text-sm text-gray-600">Click to view</p>
                          </div>
                        </div>
                        <p className="text-gray-600 text-sm italic">Document preview not available in demo</p>
                      </div>
                    ) : (
                      <div className="prose prose-sm max-w-none">
                        <p className="text-gray-700 leading-relaxed">
                          Welcome to this lesson! Here you would see the lesson content. This could include text, instructions, explanations, or any learning material relevant to the topic.
                        </p>
                        <p className="text-gray-700 leading-relaxed mt-4">
                          In a real implementation, this would display your actual learning content. For now, review the lesson material and complete it using the button below.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Complete Button */}
                  {!isCompleted && (
                    <Button
                      onClick={handleCompleteLesson}
                      disabled={completingLesson}
                      className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-base"
                    >
                      {completingLesson ? 'Marking complete...' : 'Mark Lesson Complete'}
                    </Button>
                  )}

                  {isCompleted && (
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-center">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <CheckCircle className="w-6 h-6 text-green-600" />
                        <p className="font-semibold text-green-900">Course Completed!</p>
                      </div>
                      <p className="text-green-800 text-sm">You've earned {course.points} points</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
              {/* Course Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Course Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Zap className="w-4 h-4 text-yellow-600" />
                    <span>{course.points} points</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-medium text-gray-900">{stat?.lessonsCompleted}/{course.lessons.length}</span>
                    <span className="text-gray-600">lessons completed</span>
                  </div>
                  {isCompleted && (
                    <div className="p-3 bg-green-50 border border-green-200 rounded text-sm text-green-900 font-medium">
                      ✓ Course Completed
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Lessons Navigation */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Lessons</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {course.lessons.map((lesson: any, idx: number) => (
                      <button
                        key={lesson.id}
                        onClick={() => !isCompleted && setCurrentLesson(idx)}
                        disabled={isCompleted}
                        className={`w-full text-left p-3 rounded-lg border transition-all flex items-center gap-3 ${
                          idx === currentLesson
                            ? 'bg-blue-50 border-blue-300 font-medium'
                            : idx < (stat?.lessonsCompleted || 0)
                            ? 'bg-green-50 border-green-200'
                            : 'bg-gray-50 border-gray-200 text-gray-600'
                        }`}
                      >
                        {idx < (stat?.lessonsCompleted || 0) ? (
                          <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                        ) : (
                          <Circle className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        )}
                        <span className="text-sm line-clamp-1">{lesson.title}</span>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
