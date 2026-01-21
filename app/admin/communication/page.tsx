'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Sidebar } from '@/components/sidebar'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  Mail, 
  Send, 
  Search, 
  Filter, 
  Plus, 
  Reply, 
  Forward, 
  Trash2, 
  Star, 
  Archive,
  Users,
  Calendar,
  FileText,
  Bell,
  Check,
  Clock
} from 'lucide-react'
import { 
  getCurrentUser, 
  getAllUsers, 
  getMessages, 
  createMessage,
  initializeStorage,
  getUsersByRole
} from '@/lib/storage'
import type { User, Message } from '@/lib/storage'

export default function CommunicationHub() {
  const router = useRouter()
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [filteredMessages, setFilteredMessages] = useState<Message[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<'all' | 'sent' | 'received'>('all')
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null)
  const [showComposeModal, setShowComposeModal] = useState(false)
  const [messageForm, setMessageForm] = useState({
    subject: '',
    content: '',
    recipientType: 'all' as 'all' | 'role' | 'individual',
    recipients: [] as string[],
    role: 'candidate' as 'hr' | 'employee' | 'candidate',
    type: 'announcement' as 'announcement' | 'email' | 'meeting_invite' | 'system'
  })

  useEffect(() => {
    initializeStorage()
    const user = getCurrentUser()
    if (!user || user.role !== 'hr') {
      router.push('/login')
      return
    }
    setCurrentUser(user)
    loadMessages()
    loadUsers()
  }, [router])

  useEffect(() => {
    filterMessages()
  }, [messages, searchTerm, filterType])

  const loadMessages = () => {
    const allMessages = getMessages()
    setMessages(allMessages)
  }

  const loadUsers = () => {
    const allUsers = getAllUsers()
    setUsers(allUsers)
  }

  const filterMessages = () => {
    let filtered = messages

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(message => 
        message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        message.content.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Type filter
    if (filterType === 'sent') {
      filtered = filtered.filter(message => message.senderId === currentUser?.id)
    } else if (filterType === 'received') {
      filtered = filtered.filter(message => message.senderId !== currentUser?.id)
    }

    setFilteredMessages(filtered)
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      let recipients: string[] = []
      
      if (messageForm.recipientType === 'all') {
        recipients = users.map(u => u.id)
      } else if (messageForm.recipientType === 'role') {
        const roleUsers = getUsersByRole(messageForm.role)
        recipients = roleUsers.map(u => u.id)
      } else {
        recipients = messageForm.recipients
      }

      const newMessage = createMessage({
        senderId: currentUser!.id,
        recipientType: messageForm.recipientType,
        recipients: messageForm.recipientType === 'individual' ? messageForm.recipients : undefined,
        role: messageForm.recipientType === 'role' ? messageForm.role : undefined,
        subject: messageForm.subject,
        content: messageForm.content,
        type: messageForm.type
      })

      // Reset form
      setMessageForm({
        subject: '',
        content: '',
        recipientType: 'all',
        recipients: [],
        role: 'candidate',
        type: 'announcement'
      })
      setShowComposeModal(false)
      loadMessages()
      
      alert('Message sent successfully!')
    } catch (error) {
      console.error('Error sending message:', error)
      alert('Failed to send message')
    }
  }

  const markAsRead = (messageId: string) => {
    // In a real app, this would update the message status
    console.log('Mark as read:', messageId)
  }

  const getMessageIcon = (type: string) => {
    switch (type) {
      case 'announcement':
        return <Bell className="h-4 w-4 text-blue-500" />
      case 'email':
        return <Mail className="h-4 w-4 text-green-500" />
      case 'meeting_invite':
        return <Calendar className="h-4 w-4 text-purple-500" />
      case 'system':
        return <FileText className="h-4 w-4 text-gray-500" />
      default:
        return <Mail className="h-4 w-4" />
    }
  }

  const getMessageTypeColor = (type: string) => {
    switch (type) {
      case 'announcement':
        return 'bg-blue-100 text-blue-800'
      case 'email':
        return 'bg-green-100 text-green-800'
      case 'meeting_invite':
        return 'bg-purple-100 text-purple-800'
      case 'system':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(hours / 24)
    
    if (hours < 1) return 'Just now'
    if (hours < 24) return `${hours}h ago`
    if (days < 7) return `${days}d ago`
    return date.toLocaleDateString()
  }

  const getUnreadCount = () => {
    return filteredMessages.filter(m => 
      m.senderId !== currentUser?.id && !m.readBy?.includes(currentUser!.id)
    ).length
  }

  if (loading) {
    return (
      <div className="flex h-screen bg-background">
        <Sidebar />
        <main className="flex-1 p-8">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-32 bg-muted rounded"></div>
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
              <h1 className="text-3xl font-bold text-foreground">Communication Hub</h1>
              <p className="text-muted-foreground mt-2">
                Manage announcements, emails, and team communications
              </p>
            </div>
            <Button 
              onClick={() => setShowComposeModal(true)}
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              Compose
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="p-6 bg-card border border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Messages</p>
                  <p className="text-2xl font-bold text-foreground mt-1">{filteredMessages.length}</p>
                </div>
                <Mail className="h-8 w-8 text-primary/50" />
              </div>
            </Card>

            <Card className="p-6 bg-card border border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Unread</p>
                  <p className="text-2xl font-bold text-foreground mt-1">{getUnreadCount()}</p>
                </div>
                <Bell className="h-8 w-8 text-orange-500" />
              </div>
            </Card>

            <Card className="p-6 bg-card border border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Sent</p>
                  <p className="text-2xl font-bold text-foreground mt-1">
                    {filteredMessages.filter(m => m.senderId === currentUser?.id).length}
                  </p>
                </div>
                <Send className="h-8 w-8 text-green-500" />
              </div>
            </Card>

            <Card className="p-6 bg-card border border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Users</p>
                  <p className="text-2xl font-bold text-foreground mt-1">{users.filter(u => u.isActive).length}</p>
                </div>
                <Users className="h-8 w-8 text-blue-500" />
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
                    placeholder="Search messages..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as any)}
                className="px-3 py-2 border border-border rounded-md bg-background text-foreground"
              >
                <option value="all">All Messages</option>
                <option value="sent">Sent</option>
                <option value="received">Received</option>
              </select>
            </div>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Messages List */}
            <div className="lg:col-span-2">
              <Card className="bg-card border border-border">
                <div className="divide-y divide-border max-h-[600px] overflow-y-auto">
                  {filteredMessages.map((message) => {
                    const isUnread = message.senderId !== currentUser?.id && !message.readBy?.includes(currentUser!.id)
                    const isSent = message.senderId === currentUser?.id
                    
                    return (
                      <div
                        key={message.id}
                        onClick={() => {
                          setSelectedMessage(message)
                          if (isUnread) markAsRead(message.id)
                        }}
                        className={`p-4 cursor-pointer hover:bg-muted/30 transition-colors ${
                          isUnread ? 'bg-blue-50/50' : ''
                        } ${selectedMessage?.id === message.id ? 'bg-muted/50' : ''}`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 mt-1">
                            {getMessageIcon(message.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium text-foreground">
                                  {isSent ? 'You' : 'System'}
                                </span>
                                <span className={`inline-flex px-2 py-0.5 text-xs font-semibold rounded-full ${getMessageTypeColor(message.type)}`}>
                                  {message.type}
                                </span>
                                {isUnread && (
                                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                                )}
                              </div>
                              <span className="text-xs text-muted-foreground">
                                {formatDate(message.sentAt)}
                              </span>
                            </div>
                            <h3 className="text-sm font-medium text-foreground truncate mb-1">
                              {message.subject}
                            </h3>
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {message.content}
                            </p>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                  
                  {filteredMessages.length === 0 && (
                    <div className="text-center py-12">
                      <Mail className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No messages found</p>
                    </div>
                  )}
                </div>
              </Card>
            </div>

            {/* Message Detail */}
            <div className="lg:col-span-1">
              {selectedMessage ? (
                <Card className="bg-card border border-border p-6">
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {getMessageIcon(selectedMessage.type)}
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getMessageTypeColor(selectedMessage.type)}`}>
                          {selectedMessage.type}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="gap-1">
                          <Reply className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="outline" className="gap-1">
                          <Forward className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="outline" className="gap-1 text-red-600">
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <h2 className="text-lg font-semibold text-foreground mb-2">
                      {selectedMessage.subject}
                    </h2>
                    <div className="text-sm text-muted-foreground mb-4">
                      {selectedMessage.senderId === currentUser?.id ? 'You' : 'System'} • {formatDate(selectedMessage.sentAt)}
                    </div>
                  </div>
                  
                  <div className="prose prose-sm max-w-none">
                    <p className="text-foreground whitespace-pre-wrap">
                      {selectedMessage.content}
                    </p>
                  </div>
                  
                  {selectedMessage.recipients && selectedMessage.recipients.length > 0 && (
                    <div className="mt-6 pt-4 border-t border-border">
                      <p className="text-sm font-medium text-foreground mb-2">Recipients:</p>
                      <div className="flex flex-wrap gap-2">
                        {selectedMessage.recipients.map((userId) => {
                          const user = users.find(u => u.id === userId)
                          return user ? (
                            <span key={userId} className="inline-flex px-2 py-1 text-xs bg-muted rounded">
                              {user.name}
                            </span>
                          ) : null
                        })}
                      </div>
                    </div>
                  )}
                </Card>
              ) : (
                <Card className="bg-card border border-border p-6">
                  <div className="text-center py-8">
                    <Mail className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Select a message to view details</p>
                  </div>
                </Card>
              )}
            </div>
          </div>

          {/* Compose Modal */}
          {showComposeModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
              <Card className="w-full max-w-2xl p-6 bg-card border border-border">
                <h2 className="text-xl font-bold text-foreground mb-4">Compose Message</h2>
                <form onSubmit={handleSendMessage} className="space-y-4">
                  <div>
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      value={messageForm.subject}
                      onChange={(e) => setMessageForm({ ...messageForm, subject: e.target.value })}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="recipientType">Send To</Label>
                    <select
                      id="recipientType"
                      value={messageForm.recipientType}
                      onChange={(e) => setMessageForm({ ...messageForm, recipientType: e.target.value as any })}
                      className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                      required
                    >
                      <option value="all">All Users</option>
                      <option value="role">Specific Role</option>
                      <option value="individual">Individual Users</option>
                    </select>
                  </div>
                  
                  {messageForm.recipientType === 'role' && (
                    <div>
                      <Label htmlFor="role">Role</Label>
                      <select
                        id="role"
                        value={messageForm.role}
                        onChange={(e) => setMessageForm({ ...messageForm, role: e.target.value as any })}
                        className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                        required
                      >
                        <option value="candidate">Candidates</option>
                        <option value="employee">Employees</option>
                        <option value="hr">HR Staff</option>
                      </select>
                    </div>
                  )}
                  
                  {messageForm.recipientType === 'individual' && (
                    <div>
                      <Label htmlFor="recipients">Select Users</Label>
                      <select
                        id="recipients"
                        multiple
                        value={messageForm.recipients}
                        onChange={(e) => setMessageForm({ 
                          ...messageForm, 
                          recipients: Array.from(e.target.selectedOptions, option => option.value) 
                        })}
                        className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                        required
                      >
                        {users.filter(u => u.id !== currentUser?.id).map((user) => (
                          <option key={user.id} value={user.id}>
                            {user.name} ({user.email})
                          </option>
                        ))}
                      </select>
                      <p className="text-xs text-muted-foreground mt-1">
                        Hold Ctrl/Cmd to select multiple users
                      </p>
                    </div>
                  )}
                  
                  <div>
                    <Label htmlFor="type">Message Type</Label>
                    <select
                      id="type"
                      value={messageForm.type}
                      onChange={(e) => setMessageForm({ ...messageForm, type: e.target.value as any })}
                      className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                      required
                    >
                      <option value="announcement">Announcement</option>
                      <option value="email">Email</option>
                      <option value="meeting_invite">Meeting Invite</option>
                      <option value="system">System Notification</option>
                    </select>
                  </div>
                  
                  <div>
                    <Label htmlFor="content">Message</Label>
                    <textarea
                      id="content"
                      value={messageForm.content}
                      onChange={(e) => setMessageForm({ ...messageForm, content: e.target.value })}
                      rows={6}
                      className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground resize-none"
                      required
                    />
                  </div>
                  
                  <div className="flex gap-3 pt-4">
                    <Button type="submit" className="flex-1 gap-2">
                      <Send className="h-4 w-4" />
                      Send Message
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setShowComposeModal(false)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </Card>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
