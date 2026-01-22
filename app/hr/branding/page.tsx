'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { HRSidebar } from '@/components/hr-sidebar'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Image,
  Upload,
  Download,
  Save,
  RotateCcw,
  Eye,
  Trash2,
  Plus,
  Palette,
  Type,
  Settings,
  Globe,
  Mail,
  Smartphone
} from 'lucide-react'
import { 
  getCurrentUser, 
  initializeStorage
} from '@/lib/storage'
import type { User } from '@/lib/storage'

interface BrandingSettings {
  logo: {
    primary: string
    secondary: string
    favicon: string
  }
  colors: {
    primary: string
    secondary: string
    accent: string
    background: string
    text: string
  }
  typography: {
    headingFont: string
    bodyFont: string
    brandFont: string
  }
  company: {
    name: string
    tagline: string
    description: string
    website: string
    email: string
    phone: string
    address: string
  }
  social: {
    facebook: string
    twitter: string
    linkedin: string
    instagram: string
    youtube: string
  }
  customCSS: string
}

export default function HRBranding() {
  const router = useRouter()
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('logo')
  const [previewMode, setPreviewMode] = useState(false)
  const [branding, setBranding] = useState<BrandingSettings>({
    logo: {
      primary: '/placeholder-logo.png',
      secondary: '/placeholder-logo.svg',
      favicon: '/favicon.ico'
    },
    colors: {
      primary: '#3B82F6',
      secondary: '#8B5CF6',
      accent: '#10B981',
      background: '#FFFFFF',
      text: '#111827'
    },
    typography: {
      headingFont: 'Inter',
      bodyFont: 'Inter',
      brandFont: 'Inter'
    },
    company: {
      name: 'QEdge Learning',
      tagline: 'Empowering Learning Excellence',
      description: 'A comprehensive learning management system designed to transform education and training.',
      website: 'https://qedge.example.com',
      email: 'info@qedge.example.com',
      phone: '+1 (555) 123-4567',
      address: '123 Learning Street, Education City, EC 12345'
    },
    social: {
      facebook: 'https://facebook.com/qedge',
      twitter: 'https://twitter.com/qedge',
      linkedin: 'https://linkedin.com/company/qedge',
      instagram: 'https://instagram.com/qedge',
      youtube: 'https://youtube.com/qedge'
    },
    customCSS: ''
  })

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
    { id: 'logo', label: 'Logo & Images', icon: Image },
    { id: 'colors', label: 'Colors', icon: Palette },
    { id: 'typography', label: 'Typography', icon: Type },
    { id: 'company', label: 'Company Info', icon: Globe },
    { id: 'social', label: 'Social Media', icon: Smartphone },
    { id: 'advanced', label: 'Advanced', icon: Settings }
  ]

  const handleSave = () => {
    alert('Branding settings saved successfully!')
  }

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all branding settings to defaults?')) {
      alert('Branding settings reset to defaults!')
    }
  }

  const handleImageUpload = (type: string) => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        // In a real app, you would upload the file to a server
        // For demo purposes, we'll just show an alert
        alert(`Uploaded ${type}: ${file.name}`)
      }
    }
    input.click()
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
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Branding</h1>
              <p className="text-muted-foreground mt-2">
                Customize your platform's visual identity and branding
              </p>
            </div>
            
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                className="gap-2"
                onClick={() => setPreviewMode(!previewMode)}
              >
                <Eye className="h-4 w-4" />
                {previewMode ? 'Exit Preview' : 'Preview'}
              </Button>
              <Button variant="outline" className="gap-2" onClick={handleReset}>
                <RotateCcw className="h-4 w-4" />
                Reset
              </Button>
              <Button className="gap-2" onClick={handleSave}>
                <Save className="h-4 w-4" />
                Save Changes
              </Button>
            </div>
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
            {/* Logo & Images */}
            {activeTab === 'logo' && (
              <Card className="p-6 bg-card border border-border">
                <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
                  <Image className="h-5 w-5" />
                  Logo & Images
                </h2>
                
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Primary Logo
                      </label>
                      <div className="aspect-square bg-muted rounded-lg flex items-center justify-center border-2 border-dashed border-border">
                        <div className="text-center">
                          <Image className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                          <p className="text-sm text-muted-foreground mb-2">PNG, JPG up to 2MB</p>
                          <Button size="sm" onClick={() => handleImageUpload('primary-logo')}>
                            <Upload className="h-4 w-4 mr-1" />
                            Upload
                          </Button>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">Used in header and main branding</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Secondary Logo
                      </label>
                      <div className="aspect-square bg-muted rounded-lg flex items-center justify-center border-2 border-dashed border-border">
                        <div className="text-center">
                          <Image className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                          <p className="text-sm text-muted-foreground mb-2">SVG preferred</p>
                          <Button size="sm" onClick={() => handleImageUpload('secondary-logo')}>
                            <Upload className="h-4 w-4 mr-1" />
                            Upload
                          </Button>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">Used for light backgrounds</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Favicon
                      </label>
                      <div className="aspect-square bg-muted rounded-lg flex items-center justify-center border-2 border-dashed border-border">
                        <div className="text-center">
                          <Image className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                          <p className="text-sm text-muted-foreground mb-2">ICO, 32x32px</p>
                          <Button size="sm" onClick={() => handleImageUpload('favicon')}>
                            <Upload className="h-4 w-4 mr-1" />
                            Upload
                          </Button>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">Browser tab icon</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Login Background
                      </label>
                      <div className="aspect-video bg-muted rounded-lg flex items-center justify-center border-2 border-dashed border-border">
                        <div className="text-center">
                          <Image className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                          <p className="text-sm text-muted-foreground mb-2">1920x1080 recommended</p>
                          <Button size="sm" onClick={() => handleImageUpload('login-bg')}>
                            <Upload className="h-4 w-4 mr-1" />
                            Upload
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Email Header Image
                      </label>
                      <div className="aspect-video bg-muted rounded-lg flex items-center justify-center border-2 border-dashed border-border">
                        <div className="text-center">
                          <Mail className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                          <p className="text-sm text-muted-foreground mb-2">600x200 recommended</p>
                          <Button size="sm" onClick={() => handleImageUpload('email-header')}>
                            <Upload className="h-4 w-4 mr-1" />
                            Upload
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {/* Colors */}
            {activeTab === 'colors' && (
              <Card className="p-6 bg-card border border-border">
                <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  Brand Colors
                </h2>
                
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Primary Color
                      </label>
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg border-2 border-gray-300" style={{ backgroundColor: branding.colors.primary }}></div>
                        <Input value={branding.colors.primary} onChange={(e) => setBranding({...branding, colors: {...branding.colors, primary: e.target.value}})} />
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">Main brand color for buttons and links</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Secondary Color
                      </label>
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg border-2 border-gray-300" style={{ backgroundColor: branding.colors.secondary }}></div>
                        <Input value={branding.colors.secondary} onChange={(e) => setBranding({...branding, colors: {...branding.colors, secondary: e.target.value}})} />
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">Secondary accent color</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Accent Color
                      </label>
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg border-2 border-gray-300" style={{ backgroundColor: branding.colors.accent }}></div>
                        <Input value={branding.colors.accent} onChange={(e) => setBranding({...branding, colors: {...branding.colors, accent: e.target.value}})} />
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">Highlight and success states</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Background Color
                      </label>
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg border-2 border-gray-300" style={{ backgroundColor: branding.colors.background }}></div>
                        <Input value={branding.colors.background} onChange={(e) => setBranding({...branding, colors: {...branding.colors, background: e.target.value}})} />
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">Main background color</p>
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {/* Typography */}
            {activeTab === 'typography' && (
              <Card className="p-6 bg-card border border-border">
                <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
                  <Type className="h-5 w-5" />
                  Typography
                </h2>
                
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Heading Font
                      </label>
                      <select 
                        value={branding.typography.headingFont}
                        onChange={(e) => setBranding({...branding, typography: {...branding.typography, headingFont: e.target.value}})}
                        className="w-full px-3 py-2 border border-border rounded-md bg-background"
                      >
                        <option>Inter</option>
                        <option>Roboto</option>
                        <option>Open Sans</option>
                        <option>Lato</option>
                        <option>Montserrat</option>
                        <option>Playfair Display</option>
                        <option>Raleway</option>
                      </select>
                      <p className="text-xs text-muted-foreground mt-2">Used for H1-H6 headings</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Body Font
                      </label>
                      <select 
                        value={branding.typography.bodyFont}
                        onChange={(e) => setBranding({...branding, typography: {...branding.typography, bodyFont: e.target.value}})}
                        className="w-full px-3 py-2 border border-border rounded-md bg-background"
                      >
                        <option>Inter</option>
                        <option>Roboto</option>
                        <option>Open Sans</option>
                        <option>Lato</option>
                        <option>Source Sans Pro</option>
                        <option>Nunito</option>
                        <option>Poppins</option>
                      </select>
                      <p className="text-xs text-muted-foreground mt-2">Used for paragraph text</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Brand Font
                      </label>
                      <select 
                        value={branding.typography.brandFont}
                        onChange={(e) => setBranding({...branding, typography: {...branding.typography, brandFont: e.target.value}})}
                        className="w-full px-3 py-2 border border-border rounded-md bg-background"
                      >
                        <option>Inter</option>
                        <option>Roboto</option>
                        <option>Montserrat</option>
                        <option>Raleway</option>
                        <option>Bebas Neue</option>
                        <option>Oswald</option>
                        <option>Ubuntu</option>
                      </select>
                      <p className="text-xs text-muted-foreground mt-2">Used for brand name and logo</p>
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {/* Company Info */}
            {activeTab === 'company' && (
              <Card className="p-6 bg-card border border-border">
                <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Company Information
                </h2>
                
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Company Name
                      </label>
                      <Input 
                        value={branding.company.name}
                        onChange={(e) => setBranding({...branding, company: {...branding.company, name: e.target.value}})}
                        placeholder="Enter company name"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Tagline
                      </label>
                      <Input 
                        value={branding.company.tagline}
                        onChange={(e) => setBranding({...branding, company: {...branding.company, tagline: e.target.value}})}
                        placeholder="Enter company tagline"
                      />
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Description
                      </label>
                      <textarea 
                        value={branding.company.description}
                        onChange={(e) => setBranding({...branding, company: {...branding.company, description: e.target.value}})}
                        placeholder="Enter company description"
                        rows={3}
                        className="w-full px-3 py-2 border border-border rounded-md bg-background"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Website
                      </label>
                      <Input 
                        value={branding.company.website}
                        onChange={(e) => setBranding({...branding, company: {...branding.company, website: e.target.value}})}
                        placeholder="https://example.com"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Email
                      </label>
                      <Input 
                        value={branding.company.email}
                        onChange={(e) => setBranding({...branding, company: {...branding.company, email: e.target.value}})}
                        placeholder="info@example.com"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Phone
                      </label>
                      <Input 
                        value={branding.company.phone}
                        onChange={(e) => setBranding({...branding, company: {...branding.company, phone: e.target.value}})}
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Address
                      </label>
                      <Input 
                        value={branding.company.address}
                        onChange={(e) => setBranding({...branding, company: {...branding.company, address: e.target.value}})}
                        placeholder="123 Street, City, State 12345"
                      />
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {/* Social Media */}
            {activeTab === 'social' && (
              <Card className="p-6 bg-card border border-border">
                <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
                  <Smartphone className="h-5 w-5" />
                  Social Media Links
                </h2>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <label className="w-24 text-sm font-medium text-foreground">Facebook</label>
                    <Input 
                      value={branding.social.facebook}
                      onChange={(e) => setBranding({...branding, social: {...branding.social, facebook: e.target.value}})}
                      placeholder="https://facebook.com/yourcompany"
                      className="flex-1"
                    />
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <label className="w-24 text-sm font-medium text-foreground">Twitter</label>
                    <Input 
                      value={branding.social.twitter}
                      onChange={(e) => setBranding({...branding, social: {...branding.social, twitter: e.target.value}})}
                      placeholder="https://twitter.com/yourcompany"
                      className="flex-1"
                    />
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <label className="w-24 text-sm font-medium text-foreground">LinkedIn</label>
                    <Input 
                      value={branding.social.linkedin}
                      onChange={(e) => setBranding({...branding, social: {...branding.social, linkedin: e.target.value}})}
                      placeholder="https://linkedin.com/company/yourcompany"
                      className="flex-1"
                    />
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <label className="w-24 text-sm font-medium text-foreground">Instagram</label>
                    <Input 
                      value={branding.social.instagram}
                      onChange={(e) => setBranding({...branding, social: {...branding.social, instagram: e.target.value}})}
                      placeholder="https://instagram.com/yourcompany"
                      className="flex-1"
                    />
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <label className="w-24 text-sm font-medium text-foreground">YouTube</label>
                    <Input 
                      value={branding.social.youtube}
                      onChange={(e) => setBranding({...branding, social: {...branding.social, youtube: e.target.value}})}
                      placeholder="https://youtube.com/yourcompany"
                      className="flex-1"
                    />
                  </div>
                </div>
              </Card>
            )}

            {/* Advanced */}
            {activeTab === 'advanced' && (
              <Card className="p-6 bg-card border border-border">
                <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Advanced Settings
                </h2>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Custom CSS
                    </label>
                    <textarea 
                      value={branding.customCSS}
                      onChange={(e) => setBranding({...branding, customCSS: e.target.value})}
                      placeholder="/* Add your custom CSS here */"
                      rows={10}
                      className="w-full px-3 py-2 border border-border rounded-md bg-background font-mono text-sm"
                    />
                    <p className="text-xs text-muted-foreground mt-2">
                      Add custom CSS to override default styles. Use with caution.
                    </p>
                  </div>
                  
                  <div className="flex gap-4">
                    <Button variant="outline" className="gap-2">
                      <Download className="h-4 w-4" />
                      Export Branding
                    </Button>
                    <Button variant="outline" className="gap-2">
                      <Upload className="h-4 w-4" />
                      Import Branding
                    </Button>
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
