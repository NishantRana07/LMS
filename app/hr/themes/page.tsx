'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { HRSidebar } from '@/components/hr-sidebar'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Palette,
  Moon,
  Sun,
  Monitor,
  Download,
  Upload,
  Save,
  RotateCcw,
  Eye,
  Copy,
  Trash2,
  Plus,
  CheckCircle,
  Star
} from 'lucide-react'
import { 
  getCurrentUser, 
  initializeStorage
} from '@/lib/storage'
import type { User } from '@/lib/storage'

interface Theme {
  id: string
  name: string
  description: string
  isDefault: boolean
  isCustom: boolean
  colors: {
    primary: string
    secondary: string
    accent: string
    background: string
    surface: string
    text: string
    textSecondary: string
  }
  typography: {
    fontFamily: string
    fontSize: string
    headingFont: string
  }
  spacing: {
    small: string
    medium: string
    large: string
  }
  borderRadius: string
  shadows: string
}

export default function HRThemes() {
  const router = useRouter()
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [themes, setThemes] = useState<Theme[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTheme, setActiveTheme] = useState<string>('default')
  const [previewMode, setPreviewMode] = useState(false)
  const [editingTheme, setEditingTheme] = useState<Theme | null>(null)

  useEffect(() => {
    initializeStorage()
    const user = getCurrentUser()
    if (!user || user.role !== 'hr') {
      router.push('/login')
      return
    }
    setCurrentUser(user)
    
    // Load demo themes
    const demoThemes: Theme[] = [
      {
        id: 'default',
        name: 'Default Light',
        description: 'Clean and modern light theme',
        isDefault: true,
        isCustom: false,
        colors: {
          primary: '#3B82F6',
          secondary: '#8B5CF6',
          accent: '#10B981',
          background: '#FFFFFF',
          surface: '#F9FAFB',
          text: '#111827',
          textSecondary: '#6B7280'
        },
        typography: {
          fontFamily: 'Inter',
          fontSize: '16px',
          headingFont: 'Inter'
        },
        spacing: {
          small: '0.5rem',
          medium: '1rem',
          large: '2rem'
        },
        borderRadius: '0.5rem',
        shadows: '0 1px 3px rgba(0, 0, 0, 0.1)'
      },
      {
        id: 'dark',
        name: 'Dark Mode',
        description: 'Easy on the eyes dark theme',
        isDefault: false,
        isCustom: false,
        colors: {
          primary: '#60A5FA',
          secondary: '#A78BFA',
          accent: '#34D399',
          background: '#111827',
          surface: '#1F2937',
          text: '#F9FAFB',
          textSecondary: '#D1D5DB'
        },
        typography: {
          fontFamily: 'Inter',
          fontSize: '16px',
          headingFont: 'Inter'
        },
        spacing: {
          small: '0.5rem',
          medium: '1rem',
          large: '2rem'
        },
        borderRadius: '0.5rem',
        shadows: '0 1px 3px rgba(0, 0, 0, 0.3)'
      },
      {
        id: 'corporate',
        name: 'Corporate Blue',
        description: 'Professional blue theme for business',
        isDefault: false,
        isCustom: true,
        colors: {
          primary: '#1E40AF',
          secondary: '#3B82F6',
          accent: '#059669',
          background: '#F8FAFC',
          surface: '#F1F5F9',
          text: '#0F172A',
          textSecondary: '#475569'
        },
        typography: {
          fontFamily: 'Inter',
          fontSize: '16px',
          headingFont: 'Inter'
        },
        spacing: {
          small: '0.5rem',
          medium: '1rem',
          large: '2rem'
        },
        borderRadius: '0.375rem',
        shadows: '0 1px 2px rgba(0, 0, 0, 0.05)'
      },
      {
        id: 'nature',
        name: 'Nature Green',
        description: 'Calming green theme inspired by nature',
        isDefault: false,
        isCustom: true,
        colors: {
          primary: '#059669',
          secondary: '#10B981',
          accent: '#F59E0B',
          background: '#F0FDF4',
          surface: '#DCFCE7',
          text: '#064E3B',
          textSecondary: '#047857'
        },
        typography: {
          fontFamily: 'Inter',
          fontSize: '16px',
          headingFont: 'Inter'
        },
        spacing: {
          small: '0.5rem',
          medium: '1rem',
          large: '2rem'
        },
        borderRadius: '0.75rem',
        shadows: '0 2px 4px rgba(0, 0, 0, 0.1)'
      }
    ]
    
    setThemes(demoThemes)
    setLoading(false)
  }, [router])

  const handleThemeSelect = (themeId: string) => {
    setActiveTheme(themeId)
    const theme = themes.find(t => t.id === themeId)
    if (theme) {
      setEditingTheme({...theme})
    }
  }

  const handleSaveTheme = () => {
    alert('Theme saved successfully!')
  }

  const handleDuplicateTheme = (themeId: string) => {
    const theme = themes.find(t => t.id === themeId)
    if (theme) {
      const newTheme = {
        ...theme,
        id: `custom-${Date.now()}`,
        name: `${theme.name} (Copy)`,
        isCustom: true,
        isDefault: false
      }
      setThemes([...themes, newTheme])
      alert('Theme duplicated successfully!')
    }
  }

  const handleDeleteTheme = (themeId: string) => {
    if (confirm('Are you sure you want to delete this theme?')) {
      setThemes(themes.filter(t => t.id !== themeId))
      alert('Theme deleted successfully!')
    }
  }

  const handleExportTheme = (themeId: string) => {
    const theme = themes.find(t => t.id === themeId)
    if (theme) {
      const dataStr = JSON.stringify(theme, null, 2)
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
      const exportFileDefaultName = `${theme.name.replace(/\s+/g, '-').toLowerCase()}-theme.json`
      
      const linkElement = document.createElement('a')
      linkElement.setAttribute('href', dataUri)
      linkElement.setAttribute('download', exportFileDefaultName)
      linkElement.click()
    }
  }

  const handleCreateTheme = () => {
    const newTheme: Theme = {
      id: `custom-${Date.now()}`,
      name: 'New Custom Theme',
      description: 'A custom theme',
      isDefault: false,
      isCustom: true,
      colors: {
        primary: '#3B82F6',
        secondary: '#8B5CF6',
        accent: '#10B981',
        background: '#FFFFFF',
        surface: '#F9FAFB',
        text: '#111827',
        textSecondary: '#6B7280'
      },
      typography: {
        fontFamily: 'Inter',
        fontSize: '16px',
        headingFont: 'Inter'
      },
      spacing: {
        small: '0.5rem',
        medium: '1rem',
        large: '2rem'
      },
      borderRadius: '0.5rem',
      shadows: '0 1px 3px rgba(0, 0, 0, 0.1)'
    }
    setThemes([...themes, newTheme])
    setEditingTheme(newTheme)
    setActiveTheme(newTheme.id)
  }

  if (loading) {
    return (
      <div className="flex h-screen bg-background">
        <HRSidebar userName={currentUser?.name || ''} />
        <main className="flex-1 p-8">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-1/4 mb-8"></div>
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
              <h1 className="text-3xl font-bold text-foreground">Themes</h1>
              <p className="text-muted-foreground mt-2">
                Manage and customize platform themes
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
              <Button className="gap-2" onClick={handleCreateTheme}>
                <Plus className="h-4 w-4" />
                Create Theme
              </Button>
            </div>
          </div>

          {/* Theme Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {themes.map((theme) => (
              <Card 
                key={theme.id} 
                className={`bg-card border border-border hover:shadow-lg transition-shadow cursor-pointer ${
                  activeTheme === theme.id ? 'ring-2 ring-blue-500' : ''
                }`}
                onClick={() => handleThemeSelect(theme.id)}
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg" style={{ backgroundColor: theme.colors.primary }}></div>
                      <div>
                        <h3 className="font-semibold text-foreground">{theme.name}</h3>
                        {theme.isDefault && (
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Star className="h-3 w-3" />
                            Default
                          </span>
                        )}
                      </div>
                    </div>
                    {theme.isCustom && (
                      <div className="flex items-center gap-1">
                        <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); handleDuplicateTheme(theme.id) }}>
                          <Copy className="h-3 w-3" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-red-600 hover:text-red-700"
                          onClick={(e) => { e.stopPropagation(); handleDeleteTheme(theme.id) }}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-4">{theme.description}</p>
                  
                  {/* Color Palette Preview */}
                  <div className="grid grid-cols-4 gap-2 mb-4">
                    <div className="w-full h-8 rounded" style={{ backgroundColor: theme.colors.primary }}></div>
                    <div className="w-full h-8 rounded" style={{ backgroundColor: theme.colors.secondary }}></div>
                    <div className="w-full h-8 rounded" style={{ backgroundColor: theme.colors.accent }}></div>
                    <div className="w-full h-8 rounded border" style={{ backgroundColor: theme.colors.background }}></div>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{theme.isCustom ? 'Custom' : 'Built-in'}</span>
                    <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); handleExportTheme(theme.id) }}>
                      <Download className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Theme Editor */}
          {editingTheme && (
            <Card className="p-6 bg-card border border-border">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  Edit Theme: {editingTheme.name}
                </h2>
                <Button onClick={handleSaveTheme} className="gap-2">
                  <Save className="h-4 w-4" />
                  Save Theme
                </Button>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Color Settings */}
                <div>
                  <h3 className="text-lg font-medium text-foreground mb-4">Colors</h3>
                  <div className="space-y-4">
                    {Object.entries(editingTheme.colors).map(([key, value]) => (
                      <div key={key} className="flex items-center gap-3">
                        <label className="w-32 text-sm font-medium text-foreground capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </label>
                        <div className="w-8 h-8 rounded border" style={{ backgroundColor: value }}></div>
                        <Input 
                          value={value} 
                          onChange={(e) => {
                            setEditingTheme({
                              ...editingTheme,
                              colors: { ...editingTheme.colors, [key]: e.target.value }
                            })
                          }}
                          className="flex-1"
                        />
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Typography Settings */}
                <div>
                  <h3 className="text-lg font-medium text-foreground mb-4">Typography</h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <label className="w-32 text-sm font-medium text-foreground">Font Family</label>
                      <select 
                        value={editingTheme.typography.fontFamily}
                        onChange={(e) => {
                          setEditingTheme({
                            ...editingTheme,
                            typography: { ...editingTheme.typography, fontFamily: e.target.value }
                          })
                        }}
                        className="flex-1 px-3 py-2 border border-border rounded-md bg-background"
                      >
                        <option>Inter</option>
                        <option>Roboto</option>
                        <option>Open Sans</option>
                        <option>Lato</option>
                      </select>
                    </div>
                    <div className="flex items-center gap-3">
                      <label className="w-32 text-sm font-medium text-foreground">Font Size</label>
                      <select 
                        value={editingTheme.typography.fontSize}
                        onChange={(e) => {
                          setEditingTheme({
                            ...editingTheme,
                            typography: { ...editingTheme.typography, fontSize: e.target.value }
                          })
                        }}
                        className="flex-1 px-3 py-2 border border-border rounded-md bg-background"
                      >
                        <option>14px</option>
                        <option>16px</option>
                        <option>18px</option>
                        <option>20px</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Other Settings */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
                <div>
                  <h3 className="text-lg font-medium text-foreground mb-4">Border Radius</h3>
                  <select 
                    value={editingTheme.borderRadius}
                    onChange={(e) => {
                      setEditingTheme({
                        ...editingTheme,
                        borderRadius: e.target.value
                      })
                    }}
                    className="w-full px-3 py-2 border border-border rounded-md bg-background"
                  >
                    <option>0.25rem</option>
                    <option>0.375rem</option>
                    <option>0.5rem</option>
                    <option>0.75rem</option>
                    <option>1rem</option>
                  </select>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-foreground mb-4">Shadows</h3>
                  <select 
                    value={editingTheme.shadows}
                    onChange={(e) => {
                      setEditingTheme({
                        ...editingTheme,
                        shadows: e.target.value
                      })
                    }}
                    className="w-full px-3 py-2 border border-border rounded-md bg-background"
                  >
                    <option>none</option>
                    <option>0 1px 2px rgba(0, 0, 0, 0.05)</option>
                    <option>0 1px 3px rgba(0, 0, 0, 0.1)</option>
                    <option>0 4px 6px rgba(0, 0, 0, 0.1)</option>
                    <option>0 10px 15px rgba(0, 0, 0, 0.1)</option>
                  </select>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-foreground mb-4">Spacing</h3>
                  <div className="space-y-2">
                    {Object.entries(editingTheme.spacing).map(([key, value]) => (
                      <div key={key} className="flex items-center gap-2">
                        <label className="w-16 text-sm font-medium text-foreground capitalize">{key}</label>
                        <select 
                          value={value}
                          onChange={(e) => {
                            setEditingTheme({
                              ...editingTheme,
                              spacing: { ...editingTheme.spacing, [key]: e.target.value }
                            })
                          }}
                          className="flex-1 px-3 py-1 border border-border rounded-md bg-background"
                        >
                          <option>0.25rem</option>
                          <option>0.5rem</option>
                          <option>1rem</option>
                          <option>1.5rem</option>
                          <option>2rem</option>
                          <option>3rem</option>
                        </select>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}
