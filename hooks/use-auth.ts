'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { User, getCurrentUser, setCurrentUser } from '@/lib/storage'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const currentUser = getCurrentUser()
    setUser(currentUser)
    setLoading(false)

    // If no user and not on login page, redirect to login
    if (!currentUser && !window.location.pathname.includes('/login')) {
      router.push('/login')
    }
  }, [router])

  const logout = () => {
    setCurrentUser(null)
    setUser(null)
    router.push('/login')
  }

  return {
    user,
    loading,
    isAuthenticated: !!user,
    logout,
  }
}
