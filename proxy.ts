import { NextRequest, NextResponse } from 'next/server'

export function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname

  // Check if user is authenticated via cookie (set during login)
  // For LocalStorage apps, we'll use a different approach - just check public pages
  
  // Public pages that don't require auth
  const publicPages = ['/login', '/']
  
  // Protected admin pages
  const adminPages = ['/admin']
  
  // Protected employee pages
  const employeePages = ['/employee', '/meeting']
  
  // If on login page, let them through
  if (publicPages.includes(path) || path.includes('/login')) {
    return NextResponse.next()
  }

  // For protected pages, we can't check auth in proxy with LocalStorage
  // So we redirect logic will happen in components instead
  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
