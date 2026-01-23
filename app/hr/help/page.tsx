'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { HRSidebar } from '@/components/hr-sidebar'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Search, 
  BookOpen,
  Video,
  FileText,
  MessageSquare,
  Phone,
  Mail,
  ExternalLink,
  HelpCircle,
  Download,
  Clock,
  User as UserIcon,
  Settings,
  Shield,
  Database
} from 'lucide-react'
import { 
  getCurrentUser, 
  initializeStorage
} from '@/lib/storage'
import type { User } from '@/lib/storage'

interface HelpArticle {
  id: string
  title: string
  description: string
  category: string
  type: 'article' | 'video' | 'guide' | 'faq'
  content: string
  readTime: number
  lastUpdated: string
  views: number
  helpful: number
}

interface HelpCategory {
  id: string
  name: string
  description: string
  icon: string
  color: string
  articleCount: number
}

export default function HRHelp() {
  const router = useRouter()
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [articles, setArticles] = useState<HelpArticle[]>([])
  const [categories, setCategories] = useState<HelpCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedArticle, setSelectedArticle] = useState<HelpArticle | null>(null)

  useEffect(() => {
    initializeStorage()
    const user = getCurrentUser()
    if (!user || user.role !== 'hr') {
      router.push('/login')
      return
    }
    setCurrentUser(user)
    
    // Load demo help categories
    const demoCategories: HelpCategory[] = [
      {
        id: 'getting-started',
        name: 'Getting Started',
        description: 'Basic setup and onboarding',
        icon: '🚀',
        color: 'bg-blue-100 text-blue-800',
        articleCount: 8
      },
      {
        id: 'user-management',
        name: 'User Management',
        description: 'Managing users and permissions',
        icon: '👥',
        color: 'bg-green-100 text-green-800',
        articleCount: 12
      },
      {
        id: 'courses',
        name: 'Courses & Content',
        description: 'Creating and managing courses',
        icon: '📚',
        color: 'bg-purple-100 text-purple-800',
        articleCount: 15
      },
      {
        id: 'reports',
        name: 'Reports & Analytics',
        description: 'Understanding platform analytics',
        icon: '📊',
        color: 'bg-orange-100 text-orange-800',
        articleCount: 10
      },
      {
        id: 'settings',
        name: 'Settings & Configuration',
        description: 'Platform setup and customization',
        icon: '⚙️',
        color: 'bg-gray-100 text-gray-800',
        articleCount: 7
      },
      {
        id: 'troubleshooting',
        name: 'Troubleshooting',
        description: 'Common issues and solutions',
        icon: '🔧',
        color: 'bg-red-100 text-red-800',
        articleCount: 9
      }
    ]
    
    // Load demo help articles
    const demoArticles: HelpArticle[] = [
      {
        id: 'article-1',
        title: 'Getting Started with HR Dashboard',
        description: 'Learn how to navigate and use the HR dashboard effectively',
        category: 'getting-started',
        type: 'guide',
        content: 'The HR dashboard is your central hub for managing all learning activities...',
        readTime: 5,
        lastUpdated: new Date(Date.now() - 86400000).toISOString(),
        views: 245,
        helpful: 89
      },
      {
        id: 'article-2',
        title: 'Creating Your First Course',
        description: 'Step-by-step guide to creating and publishing your first course',
        category: 'courses',
        type: 'guide',
        content: 'Creating engaging courses is essential for effective learning...',
        readTime: 8,
        lastUpdated: new Date(Date.now() - 172800000).toISOString(),
        views: 189,
        helpful: 76
      },
      {
        id: 'article-3',
        title: 'Managing User Roles and Permissions',
        description: 'Understanding different user roles and how to assign permissions',
        category: 'user-management',
        type: 'article',
        content: 'User roles determine what actions users can perform in the system...',
        readTime: 6,
        lastUpdated: new Date(Date.now() - 259200000).toISOString(),
        views: 156,
        helpful: 92
      },
      {
        id: 'article-4',
        title: 'Understanding Analytics Reports',
        description: 'How to read and interpret platform analytics and reports',
        category: 'reports',
        type: 'video',
        content: 'Analytics provide valuable insights into your learning program...',
        readTime: 12,
        lastUpdated: new Date(Date.now() - 345600000).toISOString(),
        views: 203,
        helpful: 81
      },
      {
        id: 'article-5',
        title: 'Configuring Email Notifications',
        description: 'Set up email notifications for important events and updates',
        category: 'settings',
        type: 'article',
        content: 'Email notifications keep users informed about important activities...',
        readTime: 4,
        lastUpdated: new Date(Date.now() - 432000000).toISOString(),
        views: 134,
        helpful: 78
      },
      {
        id: 'article-6',
        title: 'Common Login Issues and Solutions',
        description: 'Troubleshoot and resolve common user login problems',
        category: 'troubleshooting',
        type: 'faq',
        content: 'Login issues can be frustrating for users and administrators...',
        readTime: 7,
        lastUpdated: new Date(Date.now() - 518400000).toISOString(),
        views: 267,
        helpful: 85
      }
    ]
    
    setCategories(demoCategories)
    setArticles(demoArticles)
    setLoading(false)
  }, [router])

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const getTypeIcon = (type: string) => {
    switch(type) {
      case 'article': return <FileText className="h-4 w-4" />
      case 'video': return <Video className="h-4 w-4" />
      case 'guide': return <BookOpen className="h-4 w-4" />
      case 'faq': return <HelpCircle className="h-4 w-4" />
      default: return <FileText className="h-4 w-4" />
    }
  }

  const getTypeColor = (type: string) => {
    switch(type) {
      case 'article': return 'bg-blue-100 text-blue-800'
      case 'video': return 'bg-red-100 text-red-800'
      case 'guide': return 'bg-green-100 text-green-800'
      case 'faq': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getCategoryIcon = (category: string) => {
    switch(category) {
      case 'getting-started': return <HelpCircle className="h-5 w-5" />
      case 'user-management': return <UserIcon className="h-5 w-5" />
      case 'courses': return <BookOpen className="h-5 w-5" />
      case 'reports': return <Database className="h-5 w-5" />
      case 'settings': return <Settings className="h-5 w-5" />
      case 'troubleshooting': return <Shield className="h-5 w-5" />
      default: return <HelpCircle className="h-5 w-5" />
    }
  }

  if (loading) {
    return (
      <div className="flex h-screen bg-background">
        <HRSidebar userName={currentUser?.name || ''} />
        <main className="flex-1 p-8">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-32 bg-muted rounded"></div>
              ))}
            </div>
            <div className="grid grid-cols-1 gap-4">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="h-24 bg-muted rounded"></div>
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
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">Help Center</h1>
            <p className="text-muted-foreground mt-2">
              Find answers to your questions and learn how to use the platform
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative mb-8">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search for help articles, guides, and videos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-12 text-lg"
            />
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card className="p-4 bg-card border border-border hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Video className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium text-foreground">Video Tutorials</h3>
                  <p className="text-sm text-muted-foreground">Watch and learn</p>
                </div>
              </div>
            </Card>
            
            <Card className="p-4 bg-card border border-border hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <BookOpen className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-medium text-foreground">User Guides</h3>
                  <p className="text-sm text-muted-foreground">Step-by-step help</p>
                </div>
              </div>
            </Card>
            
            <Card className="p-4 bg-card border border-border hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <MessageSquare className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-medium text-foreground">FAQs</h3>
                  <p className="text-sm text-muted-foreground">Quick answers</p>
                </div>
              </div>
            </Card>
            
            <Card className="p-4 bg-card border border-border hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Phone className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-medium text-foreground">Contact Support</h3>
                  <p className="text-sm text-muted-foreground">Get help from us</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Categories */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4">Browse by Category</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map((category) => (
                <Card 
                  key={category.id}
                  className="p-4 bg-card border border-border hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => setSelectedCategory(category.id)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center text-2xl">
                      {category.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-foreground">{category.name}</h3>
                      <p className="text-sm text-muted-foreground">{category.description}</p>
                      <p className="text-xs text-muted-foreground mt-1">{category.articleCount} articles</p>
                    </div>
                    {getCategoryIcon(category.id)}
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Articles List */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-foreground">
                {selectedCategory === 'all' ? 'All Articles' : categories.find(c => c.id === selectedCategory)?.name}
              </h2>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border border-border rounded-md bg-background"
              >
                <option value="all">All Categories</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </select>
            </div>
            
            <div className="space-y-4">
              {filteredArticles.length > 0 ? (
                filteredArticles.map((article) => (
                  <Card key={article.id} className="p-6 bg-card border border-border hover:shadow-lg transition-shadow cursor-pointer">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          {getTypeIcon(article.type)}
                          <h3 className="text-lg font-semibold text-foreground">{article.title}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(article.type)}`}>
                            {article.type}
                          </span>
                        </div>
                        
                        <p className="text-muted-foreground mb-3">{article.description}</p>
                        
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>{article.readTime} min read</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <UserIcon className="h-4 w-4" />
                            <span>{article.views} views</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <HelpCircle className="h-4 w-4" />
                            <span>{article.helpful}% helpful</span>
                          </div>
                          <span>Updated {new Date(article.lastUpdated).toLocaleDateString()}</span>
                        </div>
                      </div>
                      
                      <Button variant="outline" size="sm">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  </Card>
                ))
              ) : (
                <Card className="p-12 text-center">
                  <HelpCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">No articles found</h3>
                  <p className="text-muted-foreground">
                    {searchTerm || selectedCategory !== 'all' 
                      ? 'Try adjusting your search or filters' 
                      : 'Check back soon for new help articles'}
                  </p>
                </Card>
              )}
            </div>
          </div>

          {/* Contact Support Section */}
          <Card className="p-6 bg-card border border-border mt-8">
            <h2 className="text-xl font-semibold text-foreground mb-4">Still Need Help?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Mail className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-medium text-foreground mb-2">Email Support</h3>
                <p className="text-sm text-muted-foreground mb-2">Get help via email</p>
                <Button variant="outline" size="sm">support@qedge.com</Button>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Phone className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-medium text-foreground mb-2">Phone Support</h3>
                <p className="text-sm text-muted-foreground mb-2">Mon-Fri, 9AM-5PM EST</p>
                <Button variant="outline" size="sm">+1 (555) 123-4567</Button>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <MessageSquare className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="font-medium text-foreground mb-2">Live Chat</h3>
                <p className="text-sm text-muted-foreground mb-2">Chat with our team</p>
                <Button variant="outline" size="sm">Start Chat</Button>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  )
}
