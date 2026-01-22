'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { HRSidebar } from '@/components/hr-sidebar'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Palette,
  Layout,
  Type,
  Image,
  Settings,
  Save,
  RotateCcw,
  Eye,
  Download,
  Upload,
  Grid3x3,
  Square,
  Circle,
  Triangle
} from 'lucide-react'
import { 
  getCurrentUser, 
  initializeStorage
} from '@/lib/storage'
import type { User } from '@/lib/storage'

export default function HRCustomize() {
  const router = useRouter()
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('layout')
  const [previewMode, setPreviewMode] = useState(false)

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
    { id: 'layout', label: 'Layout', icon: Layout },
    { id: 'colors', label: 'Colors', icon: Palette },
    { id: 'typography', label: 'Typography', icon: Type },
    { id: 'components', label: 'Components', icon: Grid3x3 }
  ]

  const handleSave = () => {
    alert('Customization saved successfully!')
  }

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all customizations to defaults?')) {
      alert('Customizations reset to defaults!')
    }
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
              <h1 className="text-3xl font-bold text-foreground">Customization</h1>
              <p className="text-muted-foreground mt-2">
                Personalize the look and feel of your platform
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
            {/* Layout Customization */}
            {activeTab === 'layout' && (
              <div className="space-y-6">
                <Card className="p-6 bg-card border border-border">
                  <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
                    <Layout className="h-5 w-5" />
                    Layout Settings
                  </h2>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium text-foreground mb-4">Dashboard Layout</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-4 border-2 border-blue-500 rounded-lg bg-blue-50">
                          <div className="aspect-video bg-muted rounded mb-2"></div>
                          <p className="text-sm font-medium text-foreground">Grid Layout</p>
                          <p className="text-xs text-muted-foreground">Default card-based layout</p>
                        </div>
                        <div className="p-4 border rounded-lg hover:border-blue-500 cursor-pointer">
                          <div className="aspect-video bg-muted rounded mb-2"></div>
                          <p className="text-sm font-medium text-foreground">List Layout</p>
                          <p className="text-xs text-muted-foreground">Compact list view</p>
                        </div>
                        <div className="p-4 border rounded-lg hover:border-blue-500 cursor-pointer">
                          <div className="aspect-video bg-muted rounded mb-2"></div>
                          <p className="text-sm font-medium text-foreground">Masonry Layout</p>
                          <p className="text-xs text-muted-foreground">Pinterest-style layout</p>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium text-foreground mb-4">Sidebar Position</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 border-2 border-blue-500 rounded-lg bg-blue-50">
                          <div className="flex h-20">
                            <div className="w-8 bg-muted rounded mr-2"></div>
                            <div className="flex-1 bg-muted rounded"></div>
                          </div>
                          <p className="text-sm font-medium text-foreground mt-2">Left Sidebar</p>
                        </div>
                        <div className="p-4 border rounded-lg hover:border-blue-500 cursor-pointer">
                          <div className="flex h-20">
                            <div className="flex-1 bg-muted rounded mr-2"></div>
                            <div className="w-8 bg-muted rounded"></div>
                          </div>
                          <p className="text-sm font-medium text-foreground mt-2">Right Sidebar</p>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium text-foreground mb-4">Header Options</h3>
                      <div className="space-y-3">
                        <label className="flex items-center gap-3">
                          <input type="checkbox" defaultChecked className="rounded" />
                          <span className="text-sm text-foreground">Show navigation menu</span>
                        </label>
                        <label className="flex items-center gap-3">
                          <input type="checkbox" defaultChecked className="rounded" />
                          <span className="text-sm text-foreground">Show user profile</span>
                        </label>
                        <label className="flex items-center gap-3">
                          <input type="checkbox" defaultChecked className="rounded" />
                          <span className="text-sm text-foreground">Show search bar</span>
                        </label>
                        <label className="flex items-center gap-3">
                          <input type="checkbox" className="rounded" />
                          <span className="text-sm text-foreground">Show breadcrumbs</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            )}

            {/* Colors Customization */}
            {activeTab === 'colors' && (
              <div className="space-y-6">
                <Card className="p-6 bg-card border border-border">
                  <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
                    <Palette className="h-5 w-5" />
                    Color Scheme
                  </h2>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium text-foreground mb-4">Primary Colors</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-2">
                            Primary Color
                          </label>
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-blue-500 rounded-lg border-2 border-blue-600"></div>
                            <Input defaultValue="#3B82F6" placeholder="#3B82F6" />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-2">
                            Secondary Color
                          </label>
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-purple-500 rounded-lg border-2 border-purple-600"></div>
                            <Input defaultValue="#8B5CF6" placeholder="#8B5CF6" />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-2">
                            Accent Color
                          </label>
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-green-500 rounded-lg border-2 border-green-600"></div>
                            <Input defaultValue="#10B981" placeholder="#10B981" />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-2">
                            Warning Color
                          </label>
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-orange-500 rounded-lg border-2 border-orange-600"></div>
                            <Input defaultValue="#F97316" placeholder="#F97316" />
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium text-foreground mb-4">Background Colors</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-2">
                            Background Primary
                          </label>
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-white rounded-lg border-2 border-gray-300"></div>
                            <Input defaultValue="#FFFFFF" placeholder="#FFFFFF" />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-2">
                            Background Secondary
                          </label>
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gray-50 rounded-lg border-2 border-gray-300"></div>
                            <Input defaultValue="#F9FAFB" placeholder="#F9FAFB" />
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium text-foreground mb-4">Text Colors</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-2">
                            Primary Text
                          </label>
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gray-900 rounded-lg border-2 border-gray-700"></div>
                            <Input defaultValue="#111827" placeholder="#111827" />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-2">
                            Secondary Text
                          </label>
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gray-600 rounded-lg border-2 border-gray-500"></div>
                            <Input defaultValue="#6B7280" placeholder="#6B7280" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            )}

            {/* Typography Customization */}
            {activeTab === 'typography' && (
              <div className="space-y-6">
                <Card className="p-6 bg-card border border-border">
                  <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
                    <Type className="h-5 w-5" />
                    Typography Settings
                  </h2>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium text-foreground mb-4">Font Family</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 border-2 border-blue-500 rounded-lg bg-blue-50">
                          <p className="text-lg font-sans">Inter (Default)</p>
                          <p className="text-sm text-muted-foreground">Clean, modern sans-serif</p>
                        </div>
                        <div className="p-4 border rounded-lg hover:border-blue-500 cursor-pointer">
                          <p className="text-lg font-serif">Roboto Serif</p>
                          <p className="text-sm text-muted-foreground">Elegant serif font</p>
                        </div>
                        <div className="p-4 border rounded-lg hover:border-blue-500 cursor-pointer">
                          <p className="text-lg font-mono">JetBrains Mono</p>
                          <p className="text-sm text-muted-foreground">Monospace for code</p>
                        </div>
                        <div className="p-4 border rounded-lg hover:border-blue-500 cursor-pointer">
                          <p className="text-lg" style={{fontFamily: 'Georgia, serif'}}>Georgia</p>
                          <p className="text-sm text-muted-foreground">Classic serif font</p>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium text-foreground mb-4">Font Sizes</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-2">
                            Base Font Size
                          </label>
                          <select className="w-full px-3 py-2 border border-border rounded-md bg-background">
                            <option>14px</option>
                            <option selected>16px</option>
                            <option>18px</option>
                            <option>20px</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-2">
                            Heading Scale
                          </label>
                          <select className="w-full px-3 py-2 border border-border rounded-md bg-background">
                            <option>Compact</option>
                            <option selected>Standard</option>
                            <option>Large</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium text-foreground mb-4">Font Weights</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-foreground">Regular Text</span>
                          <select className="px-3 py-1 border border-border rounded-md bg-background">
                            <option>400</option>
                            <option selected>500</option>
                            <option>600</option>
                          </select>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-foreground">Headings</span>
                          <select className="px-3 py-1 border border-border rounded-md bg-background">
                            <option>600</option>
                            <option selected>700</option>
                            <option>800</option>
                          </select>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-foreground">Bold Text</span>
                          <select className="px-3 py-1 border border-border rounded-md bg-background">
                            <option>700</option>
                            <option selected>800</option>
                            <option>900</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            )}

            {/* Components Customization */}
            {activeTab === 'components' && (
              <div className="space-y-6">
                <Card className="p-6 bg-card border border-border">
                  <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
                    <Grid3x3 className="h-5 w-5" />
                    Component Styles
                  </h2>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium text-foreground mb-4">Button Styles</h3>
                      <div className="space-y-4">
                        <div className="flex items-center gap-4">
                          <div className="w-20 h-10 bg-blue-500 rounded-lg flex items-center justify-center text-white text-sm">
                            Primary
                          </div>
                          <div className="flex-1">
                            <label className="block text-sm font-medium text-foreground mb-1">Border Radius</label>
                            <select className="w-full px-3 py-1 border border-border rounded-md bg-background">
                              <option>Square</option>
                              <option selected>Rounded</option>
                              <option>Pill</option>
                            </select>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="w-20 h-10 border border-gray-300 rounded-lg flex items-center justify-center text-gray-700 text-sm">
                            Secondary
                          </div>
                          <div className="flex-1">
                            <label className="block text-sm font-medium text-foreground mb-1">Shadow</label>
                            <select className="w-full px-3 py-1 border border-border rounded-md bg-background">
                              <option>None</option>
                              <option selected>Subtle</option>
                              <option>Medium</option>
                              <option>Strong</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium text-foreground mb-4">Card Styles</h3>
                      <div className="space-y-4">
                        <div className="flex items-center gap-4">
                          <div className="w-32 h-20 bg-white border border-gray-200 rounded-lg shadow-sm"></div>
                          <div className="flex-1">
                            <label className="block text-sm font-medium text-foreground mb-1">Border Radius</label>
                            <select className="w-full px-3 py-1 border border-border rounded-md bg-background">
                              <option>None</option>
                              <option selected>Small</option>
                              <option>Medium</option>
                              <option>Large</option>
                            </select>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="w-32 h-20 bg-gray-50 border border-gray-200 rounded-lg shadow-md"></div>
                          <div className="flex-1">
                            <label className="block text-sm font-medium text-foreground mb-1">Background</label>
                            <select className="w-full px-3 py-1 border border-border rounded-md bg-background">
                              <option selected>White</option>
                              <option>Light Gray</option>
                              <option>Dark</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium text-foreground mb-4">Form Elements</h3>
                      <div className="space-y-4">
                        <div className="flex items-center gap-4">
                          <div className="w-32 h-10 border border-gray-300 rounded px-2 py-1 text-sm">Input Field</div>
                          <div className="flex-1">
                            <label className="block text-sm font-medium text-foreground mb-1">Border Style</label>
                            <select className="w-full px-3 py-1 border border-border rounded-md bg-background">
                              <option selected>Solid</option>
                              <option>Dashed</option>
                              <option>Dotted</option>
                              <option>None</option>
                            </select>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="w-32 h-10 bg-gray-100 rounded-lg px-2 py-1 text-sm">Select Field</div>
                          <div className="flex-1">
                            <label className="block text-sm font-medium text-foreground mb-1">Focus Color</label>
                            <select className="w-full px-3 py-1 border border-border rounded-md bg-background">
                              <option>Blue</option>
                              <option selected>Primary</option>
                              <option>Green</option>
                              <option>Purple</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
