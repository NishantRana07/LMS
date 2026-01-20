'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { LogOut, LayoutGrid, Users, BookOpen, Calendar, Mail, BarChart3 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { setCurrentUser } from '@/lib/storage'

interface SidebarProps {
  userRole: 'admin' | 'employee'
  userName: string
}

export function Sidebar({ userRole, userName }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()

  const adminLinks = [
    { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutGrid },
    { href: '/admin/calendar', label: 'Calendar', icon: Calendar },
    { href: '/admin/courses', label: 'Courses', icon: BookOpen },
    { href: '/admin/users', label: 'Users', icon: Users },
    { href: '/admin/emails', label: 'Emails', icon: Mail },
    { href: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
  ]

  const employeeLinks = [
    { href: '/employee/dashboard', label: 'Dashboard', icon: LayoutGrid },
    { href: '/employee/calendar', label: 'Calendar', icon: Calendar },
    { href: '/employee/courses', label: 'My Courses', icon: BookOpen },
    { href: '/employee/emails', label: 'Emails', icon: Mail },
  ]

  const links = userRole === 'admin' ? adminLinks : employeeLinks

  const isActive = (href: string) => pathname === href

  const handleLogout = () => {
    setCurrentUser(null)
    router.push('/login')
  }

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-sidebar border-r border-sidebar-border flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-sidebar-border">
        <h1 className="text-2xl font-bold text-sidebar-primary">QEdge</h1>
        <p className="text-xs text-sidebar-foreground/60 mt-1">HR Learning Platform</p>
      </div>

      {/* User Info */}
      <div className="px-6 py-4 border-b border-sidebar-border">
        <p className="text-sm font-semibold text-sidebar-foreground">{userName}</p>
        <p className="text-xs text-sidebar-foreground/60 capitalize mt-1">{userRole}</p>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto px-3 py-6">
        <div className="space-y-2">
          {links.map((link) => {
            const Icon = link.icon
            const active = isActive(link.href)

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-sm transition-all
                  ${
                    active
                      ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                      : 'text-sidebar-foreground hover:bg-sidebar-accent/20'
                  }
                `}
              >
                <Icon className="h-5 w-5" />
                {link.label}
              </Link>
            )
          })}
        </div>
      </nav>

      {/* Logout Button */}
      <div className="p-6 border-t border-sidebar-border">
        <Button
          onClick={handleLogout}
          variant="outline"
          className="w-full justify-start gap-2 border-sidebar-border text-sidebar-foreground hover:bg-sidebar-accent/20 bg-transparent"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
    </aside>
  )
}
