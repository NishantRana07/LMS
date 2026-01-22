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
  MessageSquare,
  Clock,
  CheckCircle,
  AlertCircle,
  User,
  Calendar,
  Send,
  Reply,
  Archive,
  Star,
  ExternalLink
} from 'lucide-react'
import { 
  getCurrentUser, 
  initializeStorage
} from '@/lib/storage'
import type { User } from '@/lib/storage'

interface SupportTicket {
  id: string
  subject: string
  description: string
  category: 'technical' | 'account' | 'billing' | 'content' | 'general'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  status: 'open' | 'in_progress' | 'resolved' | 'closed'
  userId: string
  userName: string
  userEmail: string
  createdAt: string
  updatedAt: string
  assignedTo?: string
  responses: SupportResponse[]
  tags: string[]
}

interface SupportResponse {
  id: string
  ticketId: string
  message: string
  senderId: string
  senderName: string
  senderRole: 'user' | 'hr' | 'admin'
  createdAt: string
  isInternal?: boolean
}

export default function HRSupport() {
  const router = useRouter()
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [tickets, setTickets] = useState<SupportTicket[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterPriority, setFilterPriority] = useState<string>('all')
  const [filterCategory, setFilterCategory] = useState<string>('all')

  useEffect(() => {
    initializeStorage()
    const user = getCurrentUser()
    if (!user || user.role !== 'hr') {
      router.push('/login')
      return
    }
    setCurrentUser(user)
    
    // Load demo support tickets
    const demoTickets: SupportTicket[] = [
      {
        id: 'ticket-1',
        subject: 'Unable to access course materials',
        description: 'I am unable to download the PDF materials for the Leadership course. The download button is not working.',
        category: 'technical',
        priority: 'high',
        status: 'open',
        userId: 'user-employee-1',
        userName: 'Vikram Yadav',
        userEmail: 'vikram@demo.com',
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        updatedAt: new Date(Date.now() - 86400000).toISOString(),
        assignedTo: 'user-hr-1',
        responses: [
          {
            id: 'resp-1',
            ticketId: 'ticket-1',
            message: 'Thank you for reporting this issue. I am looking into it now.',
            senderId: 'user-hr-1',
            senderName: 'HR Admin',
            senderRole: 'hr',
            createdAt: new Date(Date.now() - 43200000).toISOString()
          }
        ],
        tags: ['download', 'pdf', 'materials']
      },
      {
        id: 'ticket-2',
        subject: 'Request for new training module',
        description: 'We would like to request a new training module on advanced Excel skills for the finance team.',
        category: 'content',
        priority: 'medium',
        status: 'in_progress',
        userId: 'user-employee-5',
        userName: 'Sahil Khan',
        userEmail: 'sahil@demo.com',
        createdAt: new Date(Date.now() - 172800000).toISOString(),
        updatedAt: new Date(Date.now() - 86400000).toISOString(),
        assignedTo: 'user-hr-1',
        responses: [
          {
            id: 'resp-2',
            ticketId: 'ticket-2',
            message: 'This is a great suggestion! I will discuss this with our content team.',
            senderId: 'user-hr-1',
            senderName: 'HR Admin',
            senderRole: 'hr',
            createdAt: new Date(Date.now() - 86400000).toISOString()
          }
        ],
        tags: ['new-content', 'excel', 'finance']
      },
      {
        id: 'ticket-3',
        subject: 'Login issues on mobile app',
        description: 'I am having trouble logging into the mobile app. It keeps saying invalid credentials even though they work on the website.',
        category: 'technical',
        priority: 'urgent',
        status: 'resolved',
        userId: 'user-candidate-1',
        userName: 'Aarav Mehta',
        userEmail: 'aarav@demo.com',
        createdAt: new Date(Date.now() - 259200000).toISOString(),
        updatedAt: new Date(Date.now() - 86400000).toISOString(),
        responses: [
          {
            id: 'resp-3',
            ticketId: 'ticket-3',
            message: 'The issue has been resolved. Please try clearing your mobile app cache and logging in again.',
            senderId: 'user-hr-1',
            senderName: 'HR Admin',
            senderRole: 'hr',
            createdAt: new Date(Date.now() - 86400000).toISOString()
          }
        ],
        tags: ['mobile', 'login', 'credentials']
      },
      {
        id: 'ticket-4',
        subject: 'Question about certification process',
        description: 'How do I get a certificate after completing a course? I finished the onboarding course but didn\'t receive anything.',
        category: 'general',
        priority: 'low',
        status: 'closed',
        userId: 'user-employee-2',
        userName: 'Isha Malhotra',
        userEmail: 'isha@demo.com',
        createdAt: new Date(Date.now() - 345600000).toISOString(),
        updatedAt: new Date(Date.now() - 172800000).toISOString(),
        responses: [
          {
            id: 'resp-4',
            ticketId: 'ticket-4',
            message: 'Certificates are automatically generated and sent to your email within 24 hours of course completion.',
            senderId: 'user-hr-1',
            senderName: 'HR Admin',
            senderRole: 'hr',
            createdAt: new Date(Date.now() - 172800000).toISOString()
          }
        ],
        tags: ['certificate', 'completion', 'process']
      },
      {
        id: 'ticket-5',
        subject: 'Account access problem',
        description: 'My account seems to be locked. I tried to reset my password but didn\'t receive the email.',
        category: 'account',
        priority: 'high',
        status: 'open',
        userId: 'user-candidate-3',
        userName: 'Kabir Singh',
        userEmail: 'kabir@demo.com',
        createdAt: new Date(Date.now() - 43200000).toISOString(),
        updatedAt: new Date(Date.now() - 43200000).toISOString(),
        responses: [],
        tags: ['account', 'locked', 'password-reset']
      }
    ]
    
    setTickets(demoTickets)
    setLoading(false)
  }, [router])

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.userName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || ticket.status === filterStatus
    const matchesPriority = filterPriority === 'all' || ticket.priority === filterPriority
    const matchesCategory = filterCategory === 'all' || ticket.category === filterCategory
    return matchesSearch && matchesStatus && matchesPriority && matchesCategory
  })

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'open': return 'bg-red-100 text-red-800'
      case 'in_progress': return 'bg-blue-100 text-blue-800'
      case 'resolved': return 'bg-green-100 text-green-800'
      case 'closed': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case 'low': return 'bg-blue-100 text-blue-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'high': return 'bg-orange-100 text-orange-800'
      case 'urgent': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getCategoryIcon = (category: string) => {
    switch(category) {
      case 'technical': return '🔧'
      case 'account': return '👤'
      case 'billing': return '💳'
      case 'content': return '📚'
      case 'general': return '❓'
      default: return '📄'
    }
  }

  const getTimeAgo = (createdAt: string) => {
    const now = new Date()
    const created = new Date(createdAt)
    const diffTime = Math.abs(now.getTime() - created.getTime())
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
    return `${Math.floor(diffDays / 30)} months ago`
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
              {[1, 2, 3, 4, 5].map(i => (
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
              <h1 className="text-3xl font-bold text-foreground">Support Center</h1>
              <p className="text-muted-foreground mt-2">
                Manage user support tickets and help requests
              </p>
            </div>
            
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              New Ticket
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="p-6 bg-card border border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Tickets</p>
                  <p className="text-2xl font-bold text-foreground mt-1">{tickets.length}</p>
                </div>
                <MessageSquare className="h-8 w-8 text-blue-500" />
              </div>
            </Card>

            <Card className="p-6 bg-card border border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Open</p>
                  <p className="text-2xl font-bold text-foreground mt-1">
                    {tickets.filter(t => t.status === 'open').length}
                  </p>
                </div>
                <AlertCircle className="h-8 w-8 text-red-500" />
              </div>
            </Card>

            <Card className="p-6 bg-card border border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">In Progress</p>
                  <p className="text-2xl font-bold text-foreground mt-1">
                    {tickets.filter(t => t.status === 'in_progress').length}
                  </p>
                </div>
                <Clock className="h-8 w-8 text-blue-500" />
              </div>
            </Card>

            <Card className="p-6 bg-card border border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Resolved</p>
                  <p className="text-2xl font-bold text-foreground mt-1">
                    {tickets.filter(t => t.status === 'resolved' || t.status === 'closed').length}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </Card>
          </div>

          {/* Filters */}
          <div className="flex gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search tickets..."
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
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="px-3 py-2 border border-border rounded-md bg-background"
            >
              <option value="all">All Priorities</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-3 py-2 border border-border rounded-md bg-background"
            >
              <option value="all">All Categories</option>
              <option value="technical">Technical</option>
              <option value="account">Account</option>
              <option value="billing">Billing</option>
              <option value="content">Content</option>
              <option value="general">General</option>
            </select>
          </div>

          {/* Tickets List */}
          <div className="space-y-4">
            {filteredTickets.length > 0 ? (
              filteredTickets.map((ticket) => (
                <Card key={ticket.id} className="bg-card border border-border hover:shadow-lg transition-shadow">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-lg">
                            {getCategoryIcon(ticket.category)}
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-foreground">{ticket.subject}</h3>
                            <div className="flex items-center gap-2 mt-1">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
                                {ticket.status.replace('_', ' ')}
                              </span>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(ticket.priority)}`}>
                                {ticket.priority}
                              </span>
                              <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                {ticket.category}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <p className="text-muted-foreground mb-3 line-clamp-2">{ticket.description}</p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4" />
                              <span>{ticket.userName}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4" />
                              <span>{getTimeAgo(ticket.createdAt)}</span>
                            </div>
                            {ticket.responses.length > 0 && (
                              <div className="flex items-center gap-2">
                                <MessageSquare className="h-4 w-4" />
                                <span>{ticket.responses.length} responses</span>
                              </div>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" className="gap-2">
                              <Reply className="h-4 w-4" />
                              Reply
                            </Button>
                            <Button variant="outline" size="sm">
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                            {ticket.status !== 'closed' && (
                              <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                                <Archive className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Tags */}
                    {ticket.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-3 pt-3 border-t border-border">
                        {ticket.tags.map((tag, index) => (
                          <span key={index} className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-full">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </Card>
              ))
            ) : (
              <Card className="p-12 text-center">
                <MessageSquare className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No tickets found</h3>
                <p className="text-muted-foreground mb-4">
                  {searchTerm || filterStatus !== 'all' || filterPriority !== 'all' || filterCategory !== 'all' 
                    ? 'Try adjusting your filters' 
                    : 'No support tickets at the moment'}
                </p>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Create Ticket
                </Button>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
