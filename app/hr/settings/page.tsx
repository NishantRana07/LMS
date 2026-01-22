'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { HRSidebar } from '@/components/hr-sidebar'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Settings,
  User,
  Bell,
  Shield,
  Database,
  Mail,
  Smartphone,
  Globe,
  Save,
  RotateCcw,
  Download,
  Upload,
  Key,
  Lock,
  Eye,
  EyeOff
} from 'lucide-react'
import { 
  getCurrentUser, 
  initializeStorage
} from '@/lib/storage'
import type { User as UserType } from '@/lib/storage'

export default function HRSettings() {
  const router = useRouter()
  const [currentUser, setCurrentUser] = useState<UserType | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('profile')
  const [showPassword, setShowPassword] = useState(false)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  
  // Form states
  const [profileForm, setProfileForm] = useState({
    name: '',
    email: '',
    department: '',
    phone: ''
  })
  
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    courseUpdates: true,
    systemAlerts: true,
    userActivity: false,
    weeklyReports: true
  })
  
  const [systemSettings, setSystemSettings] = useState({
    siteName: 'QEdge Learning Platform',
    siteUrl: 'https://qedge.example.com',
    defaultLanguage: 'english',
    timezone: 'UTC',
    maintenanceMode: false,
    allowRegistration: true,
    emailVerification: true
  })

  useEffect(() => {
    initializeStorage()
    const user = getCurrentUser()
    if (!user || user.role !== 'hr') {
      router.push('/login')
      return
    }
    setCurrentUser(user)
    
    // Initialize form data
    setProfileForm({
      name: user.name,
      email: user.email,
      department: user.department || '',
      phone: ''
    })
    
    setLoading(false)
  }, [router])

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle profile update logic
    alert('Profile updated successfully!')
  }

  const handlePasswordUpdate = (e: React.FormEvent) => {
    e.preventDefault()
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert('Passwords do not match!')
      return
    }
    // Handle password update logic
    alert('Password updated successfully!')
    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
  }

  const handleNotificationUpdate = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle notification settings update
    alert('Notification settings updated successfully!')
  }

  const handleSystemUpdate = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle system settings update
    alert('System settings updated successfully!')
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

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'system', label: 'System', icon: Settings },
    { id: 'data', label: 'Data Management', icon: Database }
  ]

  return (
    <div className="flex h-screen bg-background">
      <HRSidebar userName={currentUser?.name || ''} />
      
      <main className="flex-1 ml-64 overflow-auto">
        <div className="p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">Settings</h1>
            <p className="text-muted-foreground mt-2">
              Manage your account and system preferences
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
            {/* Profile Settings */}
            {activeTab === 'profile' && (
              <Card className="p-6 bg-card border border-border">
                <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Profile Settings
                </h2>
                
                <form onSubmit={handleProfileUpdate} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Full Name
                      </label>
                      <Input
                        value={profileForm.name}
                        onChange={(e) => setProfileForm({...profileForm, name: e.target.value})}
                        placeholder="Enter your full name"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Email Address
                      </label>
                      <Input
                        type="email"
                        value={profileForm.email}
                        onChange={(e) => setProfileForm({...profileForm, email: e.target.value})}
                        placeholder="Enter your email"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Department
                      </label>
                      <Input
                        value={profileForm.department}
                        onChange={(e) => setProfileForm({...profileForm, department: e.target.value})}
                        placeholder="Enter your department"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Phone Number
                      </label>
                      <Input
                        value={profileForm.phone}
                        onChange={(e) => setProfileForm({...profileForm, phone: e.target.value})}
                        placeholder="Enter your phone number"
                      />
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <Button type="submit" className="gap-2">
                      <Save className="h-4 w-4" />
                      Save Changes
                    </Button>
                    <Button type="button" variant="outline" className="gap-2">
                      <RotateCcw className="h-4 w-4" />
                      Reset
                    </Button>
                  </div>
                </form>
              </Card>
            )}

            {/* Notification Settings */}
            {activeTab === 'notifications' && (
              <Card className="p-6 bg-card border border-border">
                <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notification Preferences
                </h2>
                
                <form onSubmit={handleNotificationUpdate} className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-foreground">Email Notifications</h3>
                        <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notificationSettings.emailNotifications}
                          onChange={(e) => setNotificationSettings({...notificationSettings, emailNotifications: e.target.checked})}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-foreground">Push Notifications</h3>
                        <p className="text-sm text-muted-foreground">Receive browser push notifications</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notificationSettings.pushNotifications}
                          onChange={(e) => setNotificationSettings({...notificationSettings, pushNotifications: e.target.checked})}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-foreground">Course Updates</h3>
                        <p className="text-sm text-muted-foreground">Get notified about course changes</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notificationSettings.courseUpdates}
                          onChange={(e) => setNotificationSettings({...notificationSettings, courseUpdates: e.target.checked})}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-foreground">System Alerts</h3>
                        <p className="text-sm text-muted-foreground">Receive important system notifications</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notificationSettings.systemAlerts}
                          onChange={(e) => setNotificationSettings({...notificationSettings, systemAlerts: e.target.checked})}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-foreground">User Activity</h3>
                        <p className="text-sm text-muted-foreground">Get notified about user activities</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notificationSettings.userActivity}
                          onChange={(e) => setNotificationSettings({...notificationSettings, userActivity: e.target.checked})}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-foreground">Weekly Reports</h3>
                        <p className="text-sm text-muted-foreground">Receive weekly activity reports</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notificationSettings.weeklyReports}
                          onChange={(e) => setNotificationSettings({...notificationSettings, weeklyReports: e.target.checked})}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                  
                  <Button type="submit" className="gap-2">
                    <Save className="h-4 w-4" />
                    Save Notification Settings
                  </Button>
                </form>
              </Card>
            )}

            {/* Security Settings */}
            {activeTab === 'security' && (
              <div className="space-y-6">
                <Card className="p-6 bg-card border border-border">
                  <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
                    <Lock className="h-5 w-5" />
                    Change Password
                  </h2>
                  
                  <form onSubmit={handlePasswordUpdate} className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Current Password
                      </label>
                      <div className="relative">
                        <Input
                          type={showCurrentPassword ? 'text' : 'password'}
                          value={passwordForm.currentPassword}
                          onChange={(e) => setPasswordForm({...passwordForm, currentPassword: e.target.value})}
                          placeholder="Enter current password"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        New Password
                      </label>
                      <div className="relative">
                        <Input
                          type={showPassword ? 'text' : 'password'}
                          value={passwordForm.newPassword}
                          onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                          placeholder="Enter new password"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Confirm New Password
                      </label>
                      <Input
                        type="password"
                        value={passwordForm.confirmPassword}
                        onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                        placeholder="Confirm new password"
                        required
                      />
                    </div>
                    
                    <Button type="submit" className="gap-2">
                      <Key className="h-4 w-4" />
                      Update Password
                    </Button>
                  </form>
                </Card>

                <Card className="p-6 bg-card border border-border">
                  <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Two-Factor Authentication
                  </h2>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                      <div>
                        <h3 className="font-medium text-foreground">Enable 2FA</h3>
                        <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                      </div>
                      <Button variant="outline">Enable</Button>
                    </div>
                  </div>
                </Card>
              </div>
            )}

            {/* System Settings */}
            {activeTab === 'system' && (
              <Card className="p-6 bg-card border border-border">
                <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  System Configuration
                </h2>
                
                <form onSubmit={handleSystemUpdate} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Site Name
                      </label>
                      <Input
                        value={systemSettings.siteName}
                        onChange={(e) => setSystemSettings({...systemSettings, siteName: e.target.value})}
                        placeholder="Enter site name"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Site URL
                      </label>
                      <Input
                        value={systemSettings.siteUrl}
                        onChange={(e) => setSystemSettings({...systemSettings, siteUrl: e.target.value})}
                        placeholder="Enter site URL"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Default Language
                      </label>
                      <select
                        value={systemSettings.defaultLanguage}
                        onChange={(e) => setSystemSettings({...systemSettings, defaultLanguage: e.target.value})}
                        className="w-full px-3 py-2 border border-border rounded-md bg-background"
                      >
                        <option value="english">English</option>
                        <option value="spanish">Spanish</option>
                        <option value="french">French</option>
                        <option value="german">German</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Timezone
                      </label>
                      <select
                        value={systemSettings.timezone}
                        onChange={(e) => setSystemSettings({...systemSettings, timezone: e.target.value})}
                        className="w-full px-3 py-2 border border-border rounded-md bg-background"
                      >
                        <option value="UTC">UTC</option>
                        <option value="EST">Eastern Time</option>
                        <option value="PST">Pacific Time</option>
                        <option value="GMT">Greenwich Mean Time</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-foreground">Maintenance Mode</h3>
                        <p className="text-sm text-muted-foreground">Temporarily disable access to the platform</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={systemSettings.maintenanceMode}
                          onChange={(e) => setSystemSettings({...systemSettings, maintenanceMode: e.target.checked})}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-foreground">Allow Registration</h3>
                        <p className="text-sm text-muted-foreground">Enable new user registration</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={systemSettings.allowRegistration}
                          onChange={(e) => setSystemSettings({...systemSettings, allowRegistration: e.target.checked})}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-foreground">Email Verification</h3>
                        <p className="text-sm text-muted-foreground">Require email verification for new accounts</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={systemSettings.emailVerification}
                          onChange={(e) => setSystemSettings({...systemSettings, emailVerification: e.target.checked})}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                  
                  <Button type="submit" className="gap-2">
                    <Save className="h-4 w-4" />
                    Save System Settings
                  </Button>
                </form>
              </Card>
            )}

            {/* Data Management */}
            {activeTab === 'data' && (
              <Card className="p-6 bg-card border border-border">
                <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Data Management
                </h2>
                
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="p-4 bg-muted/30 border border-border">
                      <h3 className="font-medium text-foreground mb-2 flex items-center gap-2">
                        <Download className="h-4 w-4" />
                        Export Data
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Download all platform data for backup or analysis
                      </p>
                      <Button variant="outline" className="w-full gap-2">
                        <Download className="h-4 w-4" />
                        Export All Data
                      </Button>
                    </Card>
                    
                    <Card className="p-4 bg-muted/30 border border-border">
                      <h3 className="font-medium text-foreground mb-2 flex items-center gap-2">
                        <Upload className="h-4 w-4" />
                        Import Data
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Upload data from backup file
                      </p>
                      <Button variant="outline" className="w-full gap-2">
                        <Upload className="h-4 w-4" />
                        Import Data
                      </Button>
                    </Card>
                    
                    <Card className="p-4 bg-muted/30 border border-border">
                      <h3 className="font-medium text-foreground mb-2 flex items-center gap-2">
                        <RotateCcw className="h-4 w-4" />
                        Reset Data
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Reset all data to default state (cannot be undone)
                      </p>
                      <Button variant="outline" className="w-full gap-2 text-red-600 hover:text-red-700">
                        <RotateCcw className="h-4 w-4" />
                        Reset All Data
                      </Button>
                    </Card>
                    
                    <Card className="p-4 bg-muted/30 border border-border">
                      <h3 className="font-medium text-foreground mb-2 flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        Email Templates
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Manage email notification templates
                      </p>
                      <Button variant="outline" className="w-full gap-2">
                        <Mail className="h-4 w-4" />
                        Manage Templates
                      </Button>
                    </Card>
                  </div>
                  
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <h3 className="font-medium text-yellow-800 mb-2">Data Backup Recommendations</h3>
                    <ul className="text-sm text-yellow-700 space-y-1">
                      <li>• Export data weekly for regular backups</li>
                      <li>• Store backup files in secure location</li>
                      <li>• Test restore process periodically</li>
                      <li>• Keep multiple backup versions</li>
                    </ul>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
