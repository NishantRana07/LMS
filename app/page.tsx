'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function RootPage() {
  const router = useRouter()

  useEffect(() => {
    // Simple redirect - let individual pages handle auth
    try {
      const userStr = localStorage.getItem('qedge_current_user')
      if (userStr) {
        const user = JSON.parse(userStr)
        // Redirect HR users to HR dashboard, others to unified dashboard
        router.push(user.role === 'hr' ? '/hr/dashboard' : '/dashboard')
      } else {
        router.push('/login')
      }
    } catch {
      router.push('/login')
    }
  }, [router])

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-lg mb-4">
          <span className="text-2xl font-bold text-primary-foreground">QE</span>
        </div>
        <h1 className="text-3xl font-bold text-foreground mb-2">QEdge</h1>
        <p className="text-muted-foreground">Unified HR Learning Platform</p>
        <p className="text-sm text-muted-foreground/60 mt-4">Initializing...</p>
      </div>
    </div>
  )
}
