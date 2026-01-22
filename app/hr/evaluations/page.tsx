'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { HRSidebar } from '@/components/hr-sidebar'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Search, 
  Filter, 
  Plus,
  Edit,
  Trash2,
  FileText,
  Calendar,
  Users,
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Award
} from 'lucide-react'
import { 
  getCurrentUser, 
  getEvaluations,
  initializeStorage
} from '@/lib/storage'
import type { User, Evaluation } from '@/lib/storage'

export default function HREvaluations() {
  const router = useRouter()
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [evaluations, setEvaluations] = useState<Evaluation[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterType, setFilterType] = useState<string>('all')

  useEffect(() => {
    initializeStorage()
    const user = getCurrentUser()
    if (!user || user.role !== 'hr') {
      router.push('/login')
      return
    }
    setCurrentUser(user)
    setEvaluations(getEvaluations())
    setLoading(false)
  }, [router])

  const filteredEvaluations = evaluations.filter(evaluation => {
    const matchesSearch = evaluation.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         evaluation.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || evaluation.status === filterStatus
    const matchesType = filterType === 'all' || evaluation.type === filterType
    return matchesSearch && matchesStatus && matchesType
  })

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'draft': return 'bg-gray-100 text-gray-800'
      case 'published': return 'bg-green-100 text-green-800'
      case 'closed': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeIcon = (type: string) => {
    switch(type) {
      case 'quiz': return '📝'
      case 'assignment': return '📋'
      case 'practical': return '🔧'
      case 'peer-review': return '👥'
      default: return '📄'
    }
  }

  const getTypeColor = (type: string) => {
    switch(type) {
      case 'quiz': return 'bg-blue-100 text-blue-800'
      case 'assignment': return 'bg-purple-100 text-purple-800'
      case 'practical': return 'bg-orange-100 text-orange-800'
      case 'peer-review': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getDaysRemaining = (dueDate: string) => {
    const now = new Date()
    const due = new Date(dueDate)
    const diffTime = due.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date()
  }

  if (loading) {
    return (
      <div className="flex h-screen bg-background">
        <HRSidebar userName={currentUser?.name || ''} />
        <main className="flex-1 p-8">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-32 bg-muted rounded"></div>
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="h-48 bg-muted rounded"></div>
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
              <h1 className="text-3xl font-bold text-foreground">Evaluations</h1>
              <p className="text-muted-foreground mt-2">
                Manage assessments, quizzes, and performance evaluations
              </p>
            </div>
            
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Create Evaluation
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="p-6 bg-card border border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Evaluations</p>
                  <p className="text-2xl font-bold text-foreground mt-1">{evaluations.length}</p>
                </div>
                <FileText className="h-8 w-8 text-blue-500" />
              </div>
            </Card>

            <Card className="p-6 bg-card border border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Published</p>
                  <p className="text-2xl font-bold text-foreground mt-1">
                    {evaluations.filter(e => e.status === 'published').length}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </Card>

            <Card className="p-6 bg-card border border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pending</p>
                  <p className="text-2xl font-bold text-foreground mt-1">
                    {evaluations.filter(e => e.status === 'published' && !isOverdue(e.dueDate)).length}
                  </p>
                </div>
                <Clock className="h-8 w-8 text-orange-500" />
              </div>
            </Card>

            <Card className="p-6 bg-card border border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Overdue</p>
                  <p className="text-2xl font-bold text-foreground mt-1">
                    {evaluations.filter(e => e.status === 'published' && isOverdue(e.dueDate)).length}
                  </p>
                </div>
                <AlertCircle className="h-8 w-8 text-red-500" />
              </div>
            </Card>
          </div>

          {/* Filters */}
          <div className="flex gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search evaluations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-border rounded-md bg-background"
            >
              <option value="all">All Status</option>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="closed">Closed</option>
            </select>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 border border-border rounded-md bg-background"
            >
              <option value="all">All Types</option>
              <option value="quiz">Quiz</option>
              <option value="assignment">Assignment</option>
              <option value="practical">Practical</option>
              <option value="peer-review">Peer Review</option>
            </select>
          </div>

          {/* Evaluations Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvaluations.length > 0 ? (
              filteredEvaluations.map((evaluation) => {
                const daysRemaining = getDaysRemaining(evaluation.dueDate)
                const overdue = isOverdue(evaluation.dueDate)
                const isActive = evaluation.status === 'published'
                
                return (
                  <Card key={evaluation.id} className="bg-card border border-border hover:shadow-lg transition-shadow">
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-2xl">
                          {getTypeIcon(evaluation.type)}
                        </div>
                        <div className="flex gap-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(evaluation.status)}`}>
                            {evaluation.status}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(evaluation.type)}`}>
                            {evaluation.type}
                          </span>
                        </div>
                      </div>
                      
                      <h3 className="text-lg font-semibold text-foreground mb-2">{evaluation.title}</h3>
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{evaluation.description}</p>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Participants</span>
                          <span className="font-medium">{evaluation.participantIds.length}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Max Score</span>
                          <span className="font-medium">{evaluation.maxScore}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Passing Score</span>
                          <span className="font-medium">{evaluation.passingScore}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Due Date</span>
                          <span className={`font-medium ${overdue ? 'text-red-600' : ''}`}>
                            {new Date(evaluation.dueDate).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      
                      {/* Status-specific info */}
                      {isActive && !overdue && (
                        <div className="flex items-center gap-2 mb-4 p-2 bg-blue-50 rounded-lg">
                          <Clock className="h-4 w-4 text-blue-600" />
                          <span className="text-sm text-blue-800">
                            {daysRemaining > 0 ? `${daysRemaining} days remaining` : 'Due today'}
                          </span>
                        </div>
                      )}
                      
                      {isActive && overdue && (
                        <div className="flex items-center gap-2 mb-4 p-2 bg-red-50 rounded-lg">
                          <AlertCircle className="h-4 w-4 text-red-600" />
                          <span className="text-sm text-red-800">
                            Overdue by {Math.abs(daysRemaining)} days
                          </span>
                        </div>
                      )}
                      
                      {evaluation.status === 'closed' && (
                        <div className="flex items-center gap-2 mb-4 p-2 bg-gray-50 rounded-lg">
                          <CheckCircle className="h-4 w-4 text-gray-600" />
                          <span className="text-sm text-gray-800">
                            Evaluation closed
                          </span>
                        </div>
                      )}
                      
                      <div className="flex gap-2">
                        {isActive && (
                          <Button variant="outline" size="sm" className="flex-1 gap-2">
                            <TrendingUp className="h-4 w-4" />
                            View Results
                          </Button>
                        )}
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                )
              })
            ) : (
              <div className="col-span-full">
                <Card className="p-12 text-center">
                  <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">No evaluations found</h3>
                  <p className="text-muted-foreground mb-4">
                    {searchTerm || filterStatus !== 'all' || filterType !== 'all' 
                      ? 'Try adjusting your filters' 
                      : 'Get started by creating your first evaluation'}
                  </p>
                  <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Create Evaluation
                  </Button>
                </Card>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
