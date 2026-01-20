'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { LayoutDashboard, BookOpen, Calendar, Users, LogOut } from 'lucide-react'

const navItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/courses', label: 'Courses', icon: BookOpen },
  { href: '/admin/meetings', label: 'Meetings', icon: Calendar },
  { href: '/admin/users', label: 'Users', icon: Users },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const { user, logout } = useAuth()

  if (!user || user.role !== 'admin') return null

  return (
    <aside className="w-64 bg-gradient-to-b from-slate-900 to-slate-800 text-white min-h-screen flex flex-col fixed left-0 top-0">
      {/* Logo */}
      <div className="p-6 border-b border-slate-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center font-bold">
            QE
          </div>
          <div>
            <h1 className="font-bold text-lg">QEdge</h1>
            <p className="text-xs text-slate-400">HR Admin</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link key={item.href} href={item.href}>
              <Button
                variant="ghost"
                className={`w-full justify-start gap-3 ${
                  isActive ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'text-slate-300 hover:bg-slate-700'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Button>
            </Link>
          )
        })}
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-slate-700 space-y-3">
        <div className="px-3 py-2">
          <p className="text-xs text-slate-400">Signed in as</p>
          <p className="font-medium text-sm truncate">{user.name}</p>
          <p className="text-xs text-slate-400">{user.email}</p>
        </div>
        <Button
          onClick={logout}
          variant="destructive"
          className="w-full justify-start gap-2"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </Button>
      </div>
    </aside>
  )
}
