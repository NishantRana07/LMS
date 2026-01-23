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
  Calendar,
  Clock,
  Users,
  MapPin,
  Video,
  FileText
} from 'lucide-react'
import { 
  getCurrentUser, 
  initializeStorage
} from '@/lib/storage'
import type { User, ClassroomSession } from '@/lib/storage'

export default function HRClassroomSessions() {
  const router = useRouter()
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [sessions, setSessions] = useState<ClassroomSession[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')

  useEffect(() => {
    initializeStorage()
    const user = getCurrentUser()
    if (!user || user.role !== 'hr') {
      router.push('/login')
      return
    }
    setCurrentUser(user)
    
    // Load demo classroom sessions
    const demoSessions: ClassroomSession[] = [
      {
        id: 'session-1',
        title: 'Leadership Workshop',
        instructor: 'John Smith',
        location: 'Conference Room A',
        scheduledAt: new Date(Date.now() + 86400000).toISOString(),
        duration: 120,
        maxParticipants: 20,
        currentParticipants: ['user-employee-1', 'user-employee-2'],
        materials: ['presentation.pdf', 'handout.docx'],
        createdAt: new Date().toISOString()
      },
      {
        id: 'session-2',
        title: 'Team Building Activities',
        instructor: 'Sarah Johnson',
        location: 'Training Room B',
        scheduledAt: new Date(Date.now() + 172800000).toISOString(),
        duration: 90,
        maxParticipants: 15,
        currentParticipants: ['user-employee-3'],
        materials: ['activity-guide.pdf'],
        createdAt: new Date().toISOString()
      },
      {
        id: 'session-3',
        title: 'Communication Skills Training',
        instructor: 'Michael Brown',
        location: 'Virtual - Zoom',
        scheduledAt: new Date(Date.now() + 259200000).toISOString(),
        duration: 180,
        maxParticipants: 30,
        currentParticipants: ['user-employee-1', 'user-employee-4', 'user-employee-5'],
        materials: ['workbook.pdf', 'exercises.docx'],
        createdAt: new Date().toISOString()
      },
      {
        id: 'session-4',
        title: 'Project Management Fundamentals',
        instructor: 'Emily Davis',
        location: 'Conference Room C',
        scheduledAt: new Date(Date.now() - 86400000).toISOString(),
        duration: 240,
        maxParticipants: 25,
        currentParticipants: ['user-employee-2', 'user-employee-3', 'user-employee-4'],
        materials: ['pm-guide.pdf', 'templates.xlsx'],
        createdAt: new Date().toISOString()
      }
    ]
    
    setSessions(demoSessions)
    setLoading(false)
  }, [router])

  const filteredSessions = sessions.filter(session => {
    const matchesSearch = session.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         session.instructor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         session.location.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || 
      (filterStatus === 'upcoming' && new Date(session.scheduledAt) > new Date()) ||
      (filterStatus === 'past' && new Date(session.scheduledAt) <= new Date())
    return matchesSearch && matchesStatus
  })

  const getSessionStatus = (scheduledAt: string) => {
    const now = new Date()
    const sessionDate = new Date(scheduledAt)
    if (sessionDate > now) return 'upcoming'
    if (sessionDate.toDateString() === now.toDateString()) return 'today'
    return 'completed'
  }

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'upcoming': return 'bg-blue-100 text-blue-800'
      case 'today': return 'bg-orange-100 text-orange-800'
      case 'completed': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const isVirtual = (location: string) => {
    return location.toLowerCase().includes('zoom') || 
           location.toLowerCase().includes('virtual') || 
           location.toLowerCase().includes('online')
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
            <div className="grid grid-cols-1 gap-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-32 bg-muted rounded"></div>
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
              <h1 className="text-3xl font-bold text-foreground">Classroom Sessions</h1>
              <p className="text-muted-foreground mt-2">
                Manage in-person and virtual training sessions
              </p>
            </div>
            
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Schedule Session
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="p-6 bg-card border border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Sessions</p>
                  <p className="text-2xl font-bold text-foreground mt-1">{sessions.length}</p>
                </div>
                <Calendar className="h-8 w-8 text-blue-500" />
              </div>
            </Card>

            <Card className="p-6 bg-card border border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Upcoming</p>
                  <p className="text-2xl font-bold text-foreground mt-1">
                    {sessions.filter(s => new Date(s.scheduledAt) > new Date()).length}
                  </p>
                </div>
                <Clock className="h-8 w-8 text-green-500" />
              </div>
            </Card>

            <Card className="p-6 bg-card border border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Today</p>
                  <p className="text-2xl font-bold text-foreground mt-1">
                    {sessions.filter(s => new Date(s.scheduledAt).toDateString() === new Date().toDateString()).length}
                  </p>
                </div>
                <Users className="h-8 w-8 text-orange-500" />
              </div>
            </Card>

            <Card className="p-6 bg-card border border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Participants</p>
                  <p className="text-2xl font-bold text-foreground mt-1">
                    {sessions.reduce((sum, s) => sum + s.currentParticipants.length, 0)}
                  </p>
                </div>
                <Users className="h-8 w-8 text-purple-500" />
              </div>
            </Card>
          </div>

          {/* Filters */}
          <div className="flex gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search sessions..."
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
              <option value="all">All Sessions</option>
              <option value="upcoming">Upcoming</option>
              <option value="past">Past</option>
            </select>
          </div>

          {/* Sessions List */}
          <div className="space-y-4">
            {filteredSessions.length > 0 ? (
              filteredSessions.map((session) => {
                const status = getSessionStatus(session.scheduledAt)
                const isVirtualSession = isVirtual(session.location)
                const enrollmentRate = Math.round((session.currentParticipants.length / session.maxParticipants) * 100)
                
                return (
                  <Card key={session.id} className="bg-card border border-border hover:shadow-lg transition-shadow">
                    <div className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <h3 className="text-lg font-semibold text-foreground">{session.title}</h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
                              {status}
                            </span>
                            {isVirtualSession && (
                              <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                Virtual
                              </span>
                            )}
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div className="flex items-center gap-2 text-sm">
                              <Users className="h-4 w-4 text-muted-foreground" />
                              <span className="text-muted-foreground">Instructor:</span>
                              <span className="font-medium">{session.instructor}</span>
                            </div>
                            
                            <div className="flex items-center gap-2 text-sm">
                              {isVirtualSession ? (
                                <Video className="h-4 w-4 text-muted-foreground" />
                              ) : (
                                <MapPin className="h-4 w-4 text-muted-foreground" />
                              )}
                              <span className="text-muted-foreground">Location:</span>
                              <span className="font-medium">{session.location}</span>
                            </div>
                            
                            <div className="flex items-center gap-2 text-sm">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              <span className="text-muted-foreground">Duration:</span>
                              <span className="font-medium">{session.duration || 0} min</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="text-sm">
                                <span className="text-muted-foreground">Participants: </span>
                                <span className="font-medium">{session.currentParticipants.length}/{session.maxParticipants}</span>
                                <span className="text-muted-foreground ml-2">({enrollmentRate}% full)</span>
                              </div>
                              
                              <div className="text-sm">
                                <span className="text-muted-foreground">Date: </span>
                                <span className="font-medium">
                                  {new Date(session.scheduledAt).toLocaleDateString()} at {new Date(session.scheduledAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                </span>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              {session.materials.length > 0 && (
                                <Button variant="outline" size="sm" className="gap-2">
                                  <FileText className="h-4 w-4" />
                                  Materials ({session.materials.length})
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
                        </div>
                      </div>
                    </div>
                  </Card>
                )
              })
            ) : (
              <Card className="p-12 text-center">
                <Calendar className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No sessions found</h3>
                <p className="text-muted-foreground mb-4">
                  {searchTerm || filterStatus !== 'all' 
                    ? 'Try adjusting your filters' 
                    : 'Get started by scheduling your first session'}
                </p>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Schedule Session
                </Button>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
