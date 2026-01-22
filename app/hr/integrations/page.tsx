'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { HRSidebar } from '@/components/hr-sidebar'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Globe,
  Smartphone,
  Users,
  Calendar,
  Video,
  Mail,
  Cloud,
  Database,
  Key,
  CheckCircle,
  AlertCircle,
  Settings,
  ExternalLink,
  RefreshCw,
  Trash2,
  Plus,
  Search
} from 'lucide-react'
import { 
  getCurrentUser, 
  initializeStorage
} from '@/lib/storage'
import type { User } from '@/lib/storage'

interface Integration {
  id: string
  name: string
  description: string
  category: string
  icon: string
  status: 'connected' | 'disconnected' | 'error'
  lastSync?: string
  config?: Record<string, any>
  features: string[]
}

export default function HRIntegrations() {
  const router = useRouter()
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [integrations, setIntegrations] = useState<Integration[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState<string>('all')

  useEffect(() => {
    initializeStorage()
    const user = getCurrentUser()
    if (!user || user.role !== 'hr') {
      router.push('/login')
      return
    }
    setCurrentUser(user)
    
    // Load demo integrations
    const demoIntegrations: Integration[] = [
      {
        id: 'slack',
        name: 'Slack',
        description: 'Send notifications and updates to Slack channels',
        category: 'Communication',
        icon: '💬',
        status: 'connected',
        lastSync: new Date(Date.now() - 3600000).toISOString(),
        config: { webhookUrl: 'https://hooks.slack.com/...', channel: '#general' },
        features: ['Notifications', 'Course updates', 'User activity alerts']
      },
      {
        id: 'microsoft-teams',
        name: 'Microsoft Teams',
        description: 'Integrate with Microsoft Teams for seamless collaboration',
        category: 'Communication',
        icon: '👥',
        status: 'disconnected',
        features: ['Chat integration', 'Meeting scheduling', 'File sharing']
      },
      {
        id: 'google-calendar',
        name: 'Google Calendar',
        description: 'Sync training schedules and events with Google Calendar',
        category: 'Productivity',
        icon: '📅',
        status: 'connected',
        lastSync: new Date(Date.now() - 7200000).toISOString(),
        config: { calendarId: 'primary', syncEvents: true },
        features: ['Event synchronization', 'Meeting reminders', 'Schedule updates']
      },
      {
        id: 'zoom',
        name: 'Zoom',
        description: 'Host webinars and virtual meetings through Zoom',
        category: 'Video Conferencing',
        icon: '📹',
        status: 'connected',
        lastSync: new Date(Date.now() - 1800000).toISOString(),
        config: { apiKey: '••••••••', accountId: 'zoom-account-123' },
        features: ['Webinar hosting', 'Meeting scheduling', 'Recording management']
      },
      {
        id: 'salesforce',
        name: 'Salesforce',
        description: 'Connect with Salesforce for CRM integration',
        category: 'CRM',
        icon: '☁️',
        status: 'error',
        lastSync: new Date(Date.now() - 86400000).toISOString(),
        features: ['Lead tracking', 'Training records', 'Performance data']
      },
      {
        id: 'mailchimp',
        name: 'Mailchimp',
        description: 'Email marketing and campaign management',
        category: 'Marketing',
        icon: '📧',
        status: 'disconnected',
        features: ['Email campaigns', 'Newsletter management', 'Automation']
      },
      {
        id: 'zapier',
        name: 'Zapier',
        description: 'Connect with 3000+ apps through Zapier automation',
        category: 'Automation',
        icon: '⚡',
        status: 'connected',
        lastSync: new Date(Date.now() - 900000).toISOString(),
        features: ['Workflow automation', 'Custom integrations', 'Data sync']
      },
      {
        id: 'github',
        name: 'GitHub',
        description: 'Integrate with GitHub for developer training',
        category: 'Development',
        icon: '🐙',
        status: 'disconnected',
        features: ['Code repositories', 'Issue tracking', 'Project management']
      },
      {
        id: 'dropbox',
        name: 'Dropbox',
        description: 'Store and share training materials in Dropbox',
        category: 'Storage',
        icon: '📦',
        status: 'connected',
        lastSync: new Date(Date.now() - 5400000).toISOString(),
        features: ['File storage', 'Document sharing', 'Version control']
      }
    ]
    
    setIntegrations(demoIntegrations)
    setLoading(false)
  }, [router])

  const filteredIntegrations = integrations.filter(integration => {
    const matchesSearch = integration.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         integration.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = filterCategory === 'all' || integration.category === filterCategory
    return matchesSearch && matchesCategory
  })

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'connected': return 'bg-green-100 text-green-800'
      case 'disconnected': return 'bg-gray-100 text-gray-800'
      case 'error': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'connected': return <CheckCircle className="h-4 w-4" />
      case 'disconnected': return <AlertCircle className="h-4 w-4" />
      case 'error': return <AlertCircle className="h-4 w-4" />
      default: return <AlertCircle className="h-4 w-4" />
    }
  }

  const getCategoryIcon = (category: string) => {
    switch(category) {
      case 'Communication': return <Smartphone className="h-5 w-5" />
      case 'Productivity': return <Calendar className="h-5 w-5" />
      case 'Video Conferencing': return <Video className="h-5 w-5" />
      case 'CRM': return <Users className="h-5 w-5" />
      case 'Marketing': return <Mail className="h-5 w-5" />
      case 'Automation': return <Settings className="h-5 w-5" />
      case 'Development': return <Database className="h-5 w-5" />
      case 'Storage': return <Cloud className="h-5 w-5" />
      default: return <Globe className="h-5 w-5" />
    }
  }

  const getTimeAgo = (lastSync: string) => {
    const now = new Date()
    const sync = new Date(lastSync)
    const diffTime = Math.abs(now.getTime() - sync.getTime())
    const diffMinutes = Math.floor(diffTime / (1000 * 60))
    
    if (diffMinutes < 60) return `${diffMinutes} minutes ago`
    const diffHours = Math.floor(diffMinutes / 60)
    if (diffHours < 24) return `${diffHours} hours ago`
    const diffDays = Math.floor(diffHours / 24)
    return `${diffDays} days ago`
  }

  const handleConnect = (integrationId: string) => {
    alert(`Connecting to ${integrationId}...`)
  }

  const handleDisconnect = (integrationId: string) => {
    if (confirm('Are you sure you want to disconnect this integration?')) {
      alert(`Disconnected from ${integrationId}`)
    }
  }

  const handleSync = (integrationId: string) => {
    alert(`Syncing ${integrationId}...`)
  }

  const handleConfigure = (integrationId: string) => {
    alert(`Configure ${integrationId}`)
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

  const categories = ['all', ...Array.from(new Set(integrations.map(i => i.category)))]

  return (
    <div className="flex h-screen bg-background">
      <HRSidebar userName={currentUser?.name || ''} />
      
      <main className="flex-1 ml-64 overflow-auto">
        <div className="p-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Integrations</h1>
              <p className="text-muted-foreground mt-2">
                Connect with third-party services and applications
              </p>
            </div>
            
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Integration
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="p-6 bg-card border border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Integrations</p>
                  <p className="text-2xl font-bold text-foreground mt-1">{integrations.length}</p>
                </div>
                <Globe className="h-8 w-8 text-blue-500" />
              </div>
            </Card>

            <Card className="p-6 bg-card border border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Connected</p>
                  <p className="text-2xl font-bold text-foreground mt-1">
                    {integrations.filter(i => i.status === 'connected').length}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </Card>

            <Card className="p-6 bg-card border border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Disconnected</p>
                  <p className="text-2xl font-bold text-foreground mt-1">
                    {integrations.filter(i => i.status === 'disconnected').length}
                  </p>
                </div>
                <AlertCircle className="h-8 w-8 text-gray-500" />
              </div>
            </Card>

            <Card className="p-6 bg-card border border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Errors</p>
                  <p className="text-2xl font-bold text-foreground mt-1">
                    {integrations.filter(i => i.status === 'error').length}
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
                placeholder="Search integrations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-3 py-2 border border-border rounded-md bg-background"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category}
                </option>
              ))}
            </select>
          </div>

          {/* Integrations Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredIntegrations.length > 0 ? (
              filteredIntegrations.map((integration) => (
                <Card key={integration.id} className="bg-card border border-border hover:shadow-lg transition-shadow">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-2xl">
                          {integration.icon}
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-foreground">{integration.name}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            {getStatusIcon(integration.status)}
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(integration.status)}`}>
                              {integration.status}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        {getCategoryIcon(integration.category)}
                      </div>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{integration.description}</p>
                    
                    <div className="space-y-3 mb-4">
                      <div className="text-sm">
                        <span className="text-muted-foreground">Category: </span>
                        <span className="font-medium">{integration.category}</span>
                      </div>
                      
                      {integration.lastSync && (
                        <div className="text-sm">
                          <span className="text-muted-foreground">Last sync: </span>
                          <span className="font-medium">{getTimeAgo(integration.lastSync)}</span>
                        </div>
                      )}
                      
                      <div className="flex flex-wrap gap-1">
                        {integration.features.slice(0, 2).map((feature, index) => (
                          <span key={index} className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-full">
                            {feature}
                          </span>
                        ))}
                        {integration.features.length > 2 && (
                          <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-full">
                            +{integration.features.length - 2}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      {integration.status === 'connected' ? (
                        <>
                          <Button variant="outline" size="sm" className="flex-1 gap-2" onClick={() => handleSync(integration.id)}>
                            <RefreshCw className="h-4 w-4" />
                            Sync
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleConfigure(integration.id)}>
                            <Settings className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-red-600 hover:text-red-700"
                            onClick={() => handleDisconnect(integration.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </>
                      ) : (
                        <Button 
                          size="sm" 
                          className="flex-1 gap-2"
                          onClick={() => handleConnect(integration.id)}
                        >
                          <Key className="h-4 w-4" />
                          Connect
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <div className="col-span-full">
                <Card className="p-12 text-center">
                  <Globe className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">No integrations found</h3>
                  <p className="text-muted-foreground mb-4">
                    {searchTerm || filterCategory !== 'all' 
                      ? 'Try adjusting your filters' 
                      : 'Connect your first integration to extend functionality'}
                  </p>
                  <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add Integration
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
