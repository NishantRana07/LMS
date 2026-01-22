'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { HRSidebar } from '@/components/hr-sidebar'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Settings,
  Database,
  Mail,
  Globe,
  Shield,
  Bell,
  Users,
  BookOpen,
  Calendar,
  Save,
  RotateCcw,
  TestTube,
  Key,
  Lock,
  Smartphone,
  CreditCard,
  Cloud,
  Server
} from 'lucide-react'
import { 
  getCurrentUser, 
  initializeStorage
} from '@/lib/storage'
import type { User } from '@/lib/storage'

export default function HRConfiguration() {
  const router = useRouter()
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('general')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    initializeStorage()
    const user = getCurrentUser()
    if (!user || user.role !== 'hr') {
      router.push('/login')
      return
    }
    setCurrentUser(user)
    setLoading(false)
  }, [router])

  const tabs = [
    { id: 'general', label: 'General', icon: Settings },
    { id: 'database', label: 'Database', icon: Database },
    { id: 'email', label: 'Email', icon: Mail },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'integrations', label: 'Integrations', icon: Globe },
    { id: 'notifications', label: 'Notifications', icon: Bell }
  ]

  const handleSave = async () => {
    setSaving(true)
    // Simulate save operation
    await new Promise(resolve => setTimeout(resolve, 1000))
    setSaving(false)
    alert('Configuration saved successfully!')
  }

  const handleTest = (type: string) => {
    alert(`Testing ${type} configuration...`)
  }

  if (loading) {
    return (
      <div className="flex h-screen bg-background">
        <HRSidebar userName={currentUser?.name || ''} />
        <main className="flex-1 p-8">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-1/4 mb-8"></div>
            <div className="h-96 bg-muted rounded"></div>
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
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">System Configuration</h1>
            <p className="text-muted-foreground mt-2">
              Configure system settings and integrations
            </p>
          </div>

          {/* Tabs */}
          <div className="flex space-x-1 mb-8 bg-muted p-1 rounded-lg w-fit">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-background text-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              )
            })}
          </div>

          {/* Tab Content */}
          <div className="max-w-4xl">
            {/* General Configuration */}
            {activeTab === 'general' && (
              <Card className="p-6 bg-card border border-border">
                <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  General Settings
                </h2>
                
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Platform Name
                      </label>
                      <Input defaultValue="QEdge Learning Platform" />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Platform URL
                      </label>
                      <Input defaultValue="https://qedge.example.com" />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Default Language
                      </label>
                      <select className="w-full px-3 py-2 border border-border rounded-md bg-background">
                        <option>English</option>
                        <option>Spanish</option>
                        <option>French</option>
                        <option>German</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Timezone
                      </label>
                      <select className="w-full px-3 py-2 border border-border rounded-md bg-background">
                        <option>UTC</option>
                        <option>Eastern Time</option>
                        <option>Pacific Time</option>
                        <option>Central European Time</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                      <div>
                        <h3 className="font-medium text-foreground">Maintenance Mode</h3>
                        <p className="text-sm text-muted-foreground">Temporarily disable access to the platform</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                      <div>
                        <h3 className="font-medium text-foreground">Debug Mode</h3>
                        <p className="text-sm text-muted-foreground">Enable detailed error logging</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {/* Database Configuration */}
            {activeTab === 'database' && (
              <Card className="p-6 bg-card border border-border">
                <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Database Settings
                </h2>
                
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Database Type
                      </label>
                      <select className="w-full px-3 py-2 border border-border rounded-md bg-background">
                        <option>PostgreSQL</option>
                        <option>MySQL</option>
                        <option>MongoDB</option>
                        <option>SQLite</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Connection Host
                      </label>
                      <Input defaultValue="localhost" />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Port
                      </label>
                      <Input defaultValue="5432" />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Database Name
                      </label>
                      <Input defaultValue="qedge_lms" />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                      <div>
                        <h3 className="font-medium text-foreground">Auto Backup</h3>
                        <p className="text-sm text-muted-foreground">Automatically backup database daily</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    
                    <div className="flex gap-4">
                      <Button variant="outline" className="gap-2">
                        <TestTube className="h-4 w-4" />
                        Test Connection
                      </Button>
                      <Button variant="outline" className="gap-2">
                        <Database className="h-4 w-4" />
                        Backup Now
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {/* Email Configuration */}
            {activeTab === 'email' && (
              <Card className="p-6 bg-card border border-border">
                <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Email Configuration
                </h2>
                
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Email Provider
                      </label>
                      <select className="w-full px-3 py-2 border border-border rounded-md bg-background">
                        <option>SMTP</option>
                        <option>SendGrid</option>
                        <option>Mailgun</option>
                        <option>AWS SES</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        SMTP Host
                      </label>
                      <Input defaultValue="smtp.gmail.com" />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        SMTP Port
                      </label>
                      <Input defaultValue="587" />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        From Email
                      </label>
                      <Input defaultValue="noreply@qedge.example.com" />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Username
                      </label>
                      <Input defaultValue="your-email@gmail.com" />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Password
                      </label>
                      <Input type="password" defaultValue="••••••••" />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                      <div>
                        <h3 className="font-medium text-foreground">Use TLS</h3>
                        <p className="text-sm text-muted-foreground">Enable TLS encryption for SMTP</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    
                    <div className="flex gap-4">
                      <Button variant="outline" className="gap-2" onClick={() => handleTest('email')}>
                        <TestTube className="h-4 w-4" />
                        Send Test Email
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {/* Security Configuration */}
            {activeTab === 'security' && (
              <Card className="p-6 bg-card border border-border">
                <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Security Settings
                </h2>
                
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                      <div>
                        <h3 className="font-medium text-foreground">Two-Factor Authentication</h3>
                        <p className="text-sm text-muted-foreground">Require 2FA for all admin accounts</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                      <div>
                        <h3 className="font-medium text-foreground">Session Timeout</h3>
                        <p className="text-sm text-muted-foreground">Automatically log out users after inactivity</p>
                      </div>
                      <select className="px-3 py-2 border border-border rounded-md bg-background">
                        <option>30 minutes</option>
                        <option>1 hour</option>
                        <option>2 hours</option>
                        <option>4 hours</option>
                      </select>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                      <div>
                        <h3 className="font-medium text-foreground">Password Requirements</h3>
                        <p className="text-sm text-muted-foreground">Minimum password length: 8 characters</p>
                      </div>
                      <Button variant="outline" size="sm">Configure</Button>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                      <div>
                        <h3 className="font-medium text-foreground">IP Whitelist</h3>
                        <p className="text-sm text-muted-foreground">Restrict access to specific IP addresses</p>
                      </div>
                      <Button variant="outline" size="sm">Manage IPs</Button>
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {/* Integrations Configuration */}
            {activeTab === 'integrations' && (
              <Card className="p-6 bg-card border border-border">
                <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Third-Party Integrations
                </h2>
                
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="p-4 bg-muted/30 border border-border">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <Smartphone className="h-5 w-5 text-blue-500" />
                          <h3 className="font-medium text-foreground">Slack</h3>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">Send notifications to Slack channels</p>
                      <Button variant="outline" size="sm" className="w-full">Configure</Button>
                    </Card>
                    
                    <Card className="p-4 bg-muted/30 border border-border">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <Users className="h-5 w-5 text-blue-600" />
                          <h3 className="font-medium text-foreground">Microsoft Teams</h3>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">Integrate with Microsoft Teams</p>
                      <Button variant="outline" size="sm" className="w-full">Configure</Button>
                    </Card>
                    
                    <Card className="p-4 bg-muted/30 border border-border">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-5 w-5 text-green-500" />
                          <h3 className="font-medium text-foreground">Google Calendar</h3>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" defaultChecked className="sr-only peer" />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">Sync events with Google Calendar</p>
                      <Button variant="outline" size="sm" className="w-full">Configure</Button>
                    </Card>
                    
                    <Card className="p-4 bg-muted/30 border border-border">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <Cloud className="h-5 w-5 text-orange-500" />
                          <h3 className="font-medium text-foreground">Zoom</h3>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" defaultChecked className="sr-only peer" />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">Host webinars via Zoom integration</p>
                      <Button variant="outline" size="sm" className="w-full">Configure</Button>
                    </Card>
                  </div>
                </div>
              </Card>
            )}

            {/* Notifications Configuration */}
            {activeTab === 'notifications' && (
              <Card className="p-6 bg-card border border-border">
                <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notification Settings
                </h2>
                
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                      <div>
                        <h3 className="font-medium text-foreground">Email Notifications</h3>
                        <p className="text-sm text-muted-foreground">Send notifications via email</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                      <div>
                        <h3 className="font-medium text-foreground">Push Notifications</h3>
                        <p className="text-sm text-muted-foreground">Browser push notifications</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                      <div>
                        <h3 className="font-medium text-foreground">SMS Notifications</h3>
                        <p className="text-sm text-muted-foreground">Send critical alerts via SMS</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                      <div>
                        <h3 className="font-medium text-foreground">Digest Frequency</h3>
                        <p className="text-sm text-muted-foreground">How often to send notification digests</p>
                      </div>
                      <select className="px-3 py-2 border border-border rounded-md bg-background">
                        <option>Daily</option>
                        <option>Weekly</option>
                        <option>Monthly</option>
                        <option>Never</option>
                      </select>
                    </div>
                  </div>
                </div>
              </Card>
            )}
          </div>

          {/* Save Button */}
          <div className="mt-8 flex gap-4">
            <Button onClick={handleSave} disabled={saving} className="gap-2">
              <Save className="h-4 w-4" />
              {saving ? 'Saving...' : 'Save Configuration'}
            </Button>
            <Button variant="outline" className="gap-2">
              <RotateCcw className="h-4 w-4" />
              Reset to Defaults
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
