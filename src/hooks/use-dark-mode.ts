"use client"

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { useAuth } from '@clerk/nextjs'
import { updateUserDarkMode } from '@/lib/api'

export function useDarkMode() {
  const { theme, setTheme } = useTheme()
  const { userId } = useAuth()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const toggleTheme = async () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark'
    setTheme(newTheme)
    
    // Update user preference in database
    if (userId) {
      try {
        await updateUserDarkMode(newTheme === 'dark')
      } catch (error) {
        console.error('Failed to update dark mode preference:', error)
      }
    }
  }

  const setDarkMode = async (isDark: boolean) => {
    const newTheme = isDark ? 'dark' : 'light'
    setTheme(newTheme)
    
    // Update user preference in database
    if (userId) {
      try {
        await updateUserDarkMode(isDark)
      } catch (error) {
        console.error('Failed to update dark mode preference:', error)
      }
    }
  }

  return {
    theme,
    mounted,
    toggleTheme,
    setDarkMode,
    isDark: theme === 'dark',
  }
}
