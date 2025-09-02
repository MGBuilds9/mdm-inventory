'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { useUser, useClerk } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { UserRole } from '@/lib/constants'

interface UserProfileData {
  id: string
  email: string
  full_name: string
  role: UserRole
  organization_id: string
  organization_name: string
  created_at: string
  updated_at: string
}

interface AuthContextType {
  user: any
  profile: UserProfileData | null
  loading: boolean
  error: string | null
  signOut: () => Promise<void>
  updateProfile: (updates: Partial<UserProfileData>) => Promise<void>
  refreshProfile: () => Promise<void>
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { user, isLoaded } = useUser()
  const { signOut: clerkSignOut } = useClerk()
  const router = useRouter()
  const [profile, setProfile] = useState<UserProfileData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isLoaded) {
      if (user) {
        fetchProfile()
      } else {
        setProfile(null)
        setLoading(false)
        setError(null)
      }
    }
  }, [user, isLoaded])

  const fetchProfile = async () => {
    try {
      setError(null)
      if (user) {
        // TODO: Replace with actual API call to fetch user profile
        const mockProfile: UserProfileData = {
          id: user.id,
          email: user.emailAddresses[0]?.emailAddress || '',
          full_name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'User',
          role: 'admin' as UserRole, // Default role, should be fetched from database
          organization_id: 'org-1', // Should be fetched from database
          organization_name: 'MDM Group Inc.', // Should be fetched from database
          created_at: user.createdAt ? new Date(user.createdAt).toISOString() : new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
        setProfile(mockProfile)
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch profile'
      setError(errorMessage)
      console.error('Error fetching profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    try {
      setError(null)
      await clerkSignOut()
      setProfile(null)
      router.push('/login')
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to sign out'
      setError(errorMessage)
      console.error('Failed to sign out:', error)
    }
  }

  const updateProfile = async (updates: Partial<UserProfileData>) => {
    if (!profile) return

    try {
      setError(null)
      // TODO: Replace with actual API call to update profile
      setProfile({ ...profile, ...updates, updated_at: new Date().toISOString() })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update profile'
      setError(errorMessage)
      console.error('Failed to update profile:', error)
      throw error
    }
  }

  const refreshProfile = async () => {
    await fetchProfile()
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        error,
        signOut,
        updateProfile,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
