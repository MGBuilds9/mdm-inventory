'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { LoadingSpinner } from './ui/LoadingSpinner'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRoles?: string[]
  fallback?: React.ReactNode
}

export default function ProtectedRoute({ 
  children, 
  requiredRoles = [], 
  fallback 
}: ProtectedRouteProps) {
  const { profile, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !profile) {
      router.push('/login')
    }
  }, [profile, loading, router])

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  // Redirect to login if not authenticated
  if (!profile) {
    return null
  }

  // Check role-based access if required
  if (requiredRoles.length > 0 && !requiredRoles.includes(profile.role)) {
    return (
      fallback || (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
            <p className="text-gray-600">
              You don't have permission to access this page.
            </p>
          </div>
        </div>
      )
    )
  }

  return <>{children}</>
}
