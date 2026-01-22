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
  Video,
  Calendar,
  Clock,
  Users,
  Globe,
  Mic,
  MessageSquare,
  Settings
} from 'lucide-react'
import { 
  getCurrentUser, 
  initializeStorage
} from '@/lib/storage'
import type { User } from '@/lib/storage'

interface Webinar {
  id: string
  title: string
  description: string
  instructor: string
  scheduledAt: string
  duration: number
  maxParticipants: number
  currentParticipants: string[]
  platform: 'zoom' | 'teams' | 'meet' | 'webex'
  recordingAvailable: boolean
  materials: string[]
  status: 'scheduled' | 'live' | 'completed' | 'cancelled'
  createdAt: string
}

export default function HRWebinars() {
  const router = useRouter()
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [webinars, setWebinars] = useState<Webinar[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterPlatform, setFilterPlatform] = useState<string>('all')

  useEffect(() => {
    initializeStorage()
    const user = getCurrentUser()
    if (!user || user.role !== 'hr') {
      router.push('/login')
      return
    }
    setCurrentUser(user)
    
    // Load demo webinars
    const demoWebinars: Webinar[] = [
      {
        id: 'webinar-1',
        title: 'Advanced Leadership Strategies',
        description: 'Explore cutting-edge leadership techniques for modern organizations',
        instructor: 'Dr. Sarah Mitchell',
        scheduledAt: new Date(Date.now() + 86400000).toISOString(),
        duration: 90,
        maxParticipants: 100,
        currentParticipants: ['user-employee-1', 'user-employee-2', 'user-employee-3'],
        platform: 'zoom',
        recordingAvailable: false,
        materials: ['leadership-guide.pdf', 'self-assessment.docx'],
        status: 'scheduled',
        createdAt: new Date().toISOString()
      },
      {
        id: 'webinar-2',
        title: 'Digital Transformation in HR',
        description: 'Learn how to leverage technology for HR processes and employee engagement',
        instructor: 'Michael Chen',
        scheduledAt: new Date(Date.now() + 172800000).toISOString(),
        duration: 120,
        maxParticipants: 150,
        currentParticipants: ['user-employee-4', 'user-employee-5'],
        platform: 'teams',
        recordingAvailable: false,
        materials: ['digital-hr-playbook.pdf'],
        status: 'scheduled',
        createdAt: new Date().toISOString()
      },
      {
        id: 'webinar-3',
        title: 'Mental Health in the Workplace',
        description: 'Understanding and supporting employee mental health and wellbeing',
        instructor: 'Dr. Emily Rodriguez',
        scheduledAt: new Date(Date.now() - 86400000).toISOString(),
        duration: 60,
        maxParticipants: 200,
        currentParticipants: ['user-employee-1', 'user-employee-2', 'user-employee-3', 'user-employee-4', 'user-employee-5'],
        platform: 'meet',
        recordingAvailable: true,
        materials: ['mental-health-resources.pdf', 'wellness-tips.docx'],
        status: 'completed',
        createdAt: new Date().toISOString()
      },
      {
        id: 'webinar-4',
        title: 'Remote Team Management',
        description: 'Best practices for managing and engaging distributed teams',
        instructor: 'James Wilson',
        scheduledAt: new Date(Date.now() + 259200000).toISOString(),
        duration: 75,
        maxParticipants: 80,
        currentParticipants: [],
        platform: 'webex',
        recordingAvailable: false,
        materials: ['remote-management-guide.pdf'],
        status: 'scheduled',
        createdAt: new Date().toISOString()
      },
      {
        id: 'webinar-5',
        title: 'Data-Driven HR Analytics',
        description: 'Using data to make informed HR decisions and improve outcomes',
        instructor: 'Lisa Thompson',
        scheduledAt: new Date(Date.now() - 172800000).toISOString(),
        duration: 90,
        maxParticipants: 120,
        currentParticipants: ['user-employee-2', 'user-employee-3'],
        platform: 'zoom',
        recordingAvailable: true,
        materials: ['hr-analytics-dashboard.xlsx', 'metrics-guide.pdf'],
        status: 'completed',
        createdAt: new Date().toISOString()
      }
    ]
    
    setWebinars(demoWebinars)
    setLoading(false)
  }, [router])

  const filteredWebinars = webinars.filter(webinar => {
    const matchesSearch = webinar.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         webinar.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         webinar.instructor.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || webinar.status === filterStatus
    const matchesPlatform = filterPlatform === 'all' || webinar.platform === filterPlatform
    return matchesSearch && matchesStatus && matchesPlatform
  })

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800'
      case 'live': return 'bg-red-100 text-red-800'
      case 'completed': return 'bg-gray-100 text-gray-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPlatformIcon = (platform: string) => {
    switch(platform) {
      case 'zoom': return '🎥'
      case 'teams': return '💼'
      case 'meet': return '📹'
      case 'webex': return '📺'
      default: return '📹'
    }
  }

  const getPlatformColor = (platform: string) => {
    switch(platform) {
      case 'zoom': return 'bg-blue-100 text-blue-800'
      case 'teams': return 'bg-purple-100 text-purple-800'
      case 'meet': return 'bg-green-100 text-green-800'
      case 'webex': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
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
              <h1 className="text-3xl font-bold text-foreground">Webinars</h1>
              <p className="text-muted-foreground mt-2">
                Manage virtual training sessions and online events
              </p>
            </div>
            
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Schedule Webinar
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="p-6 bg-card border border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Webinars</p>
                  <p className="text-2xl font-bold text-foreground mt-1">{webinars.length}</p>
                </div>
                <Video className="h-8 w-8 text-blue-500" />
              </div>
            </Card>

            <Card className="p-6 bg-card border border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Scheduled</p>
                  <p className="text-2xl font-bold text-foreground mt-1">
                    {webinars.filter(w => w.status === 'scheduled').length}
                  </p>
                </div>
                <Calendar className="h-8 w-8 text-green-500" />
              </div>
            </Card>

            <Card className="p-6 bg-card border border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Completed</p>
                  <p className="text-2xl font-bold text-foreground mt-1">
                    {webinars.filter(w => w.status === 'completed').length}
                  </p>
                </div>
                <Clock className="h-8 w-8 text-purple-500" />
              </div>
            </Card>

            <Card className="p-6 bg-card border border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Attendees</p>
                  <p className="text-2xl font-bold text-foreground mt-1">
                    {webinars.reduce((sum, w) => sum + w.currentParticipants.length, 0)}
                  </p>
                </div>
                <Users className="h-8 w-8 text-orange-500" />
              </div>
            </Card>
          </div>

          {/* Filters */}
          <div className="flex gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search webinars..."
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
              <option value="scheduled">Scheduled</option>
              <option value="live">Live</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <select
              value={filterPlatform}
              onChange={(e) => setFilterPlatform(e.target.value)}
              className="px-3 py-2 border border-border rounded-md bg-background"
            >
              <option value="all">All Platforms</option>
              <option value="zoom">Zoom</option>
              <option value="teams">Microsoft Teams</option>
              <option value="meet">Google Meet</option>
              <option value="webex">Webex</option>
            </select>
          </div>

          {/* Webinars Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredWebinars.length > 0 ? (
              filteredWebinars.map((webinar) => {
                const enrollmentRate = Math.round((webinar.currentParticipants.length / webinar.maxParticipants) * 100)
                const isUpcoming = new Date(webinar.scheduledAt) > new Date()
                
                return (
                  <Card key={webinar.id} className="bg-card border border-border hover:shadow-lg transition-shadow">
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-2xl">
                          {getPlatformIcon(webinar.platform)}
                        </div>
                        <div className="flex gap-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(webinar.status)}`}>
                            {webinar.status}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPlatformColor(webinar.platform)}`}>
                            {webinar.platform}
                          </span>
                        </div>
                      </div>
                      
                      <h3 className="text-lg font-semibold text-foreground mb-2">{webinar.title}</h3>
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{webinar.description}</p>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Instructor</span>
                          <span className="font-medium">{webinar.instructor}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Duration</span>
                          <span className="font-medium">{webinar.duration} min</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Participants</span>
                          <span className="font-medium">{webinar.currentParticipants.length}/{webinar.maxParticipants}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Date</span>
                          <span className="font-medium">
                            {new Date(webinar.scheduledAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 mb-4">
                        {webinar.recordingAvailable && (
                          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                            Recording Available
                          </span>
                        )}
                        {webinar.materials.length > 0 && (
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                            {webinar.materials.length} Materials
                          </span>
                        )}
                      </div>
                      
                      <div className="flex gap-2">
                        {webinar.status === 'scheduled' && isUpcoming && (
                          <Button size="sm" className="flex-1 gap-2">
                            <Video className="h-4 w-4" />
                            Join
                          </Button>
                        )}
                        {webinar.recordingAvailable && (
                          <Button variant="outline" size="sm" className="flex-1 gap-2">
                            <Video className="h-4 w-4" />
                            Watch Recording
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
                  <Video className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">No webinars found</h3>
                  <p className="text-muted-foreground mb-4">
                    {searchTerm || filterStatus !== 'all' || filterPlatform !== 'all' 
                      ? 'Try adjusting your filters' 
                      : 'Get started by scheduling your first webinar'}
                  </p>
                  <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Schedule Webinar
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
