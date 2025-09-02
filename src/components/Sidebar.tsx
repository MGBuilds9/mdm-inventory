'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { NAVIGATION_ITEMS, USER_ROLES } from '@/lib/constants'
import {
  HomeIcon,
  ClipboardDocumentListIcon,
  CubeIcon,
  TruckIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  UserIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'

// Icon mapping
const iconMap = {
  HomeIcon,
  ClipboardDocumentListIcon,
  CubeIcon,
  TruckIcon,
  ChartBarIcon,
  Cog6ToothIcon,
}

interface SidebarProps {
  open: boolean
  setOpen: (open: boolean) => void
}

export default function Sidebar({ open, setOpen }: SidebarProps) {
  const { profile, signOut } = useAuth()
  const pathname = usePathname()

  // Filter navigation items based on user role
  const getFilteredNavigation = () => {
    if (!profile) return []
    
    // Admin can see everything
    if (profile.role === USER_ROLES.ADMIN) return NAVIGATION_ITEMS
    
    // Filter based on role permissions
    const rolePermissions: Record<string, string[]> = {
      [USER_ROLES.BUYER]: ['Dashboard', 'Purchase Orders', 'Reports'],
      [USER_ROLES.APPROVER]: ['Dashboard', 'Purchase Orders', 'Reports'],
      [USER_ROLES.WAREHOUSE]: ['Dashboard', 'Inventory', 'Shipping', 'Reports'],
      [USER_ROLES.MANAGER]: ['Dashboard', 'Inventory', 'Purchase Orders', 'Shipping', 'Reports'],
      [USER_ROLES.AUDITOR]: ['Dashboard', 'Reports'],
    }
    
    const allowedItems = rolePermissions[profile.role] || []
    return NAVIGATION_ITEMS.filter(item => allowedItems.includes(item.name))
  }

  const filteredNavigation = getFilteredNavigation()

  return (
    <>
      {/* Mobile sidebar */}
      {open && (
        <div className="relative z-50 lg:hidden">
          <div className="fixed inset-0 bg-gray-900/80" />
          <div className="fixed inset-0 flex">
            <div className="relative mr-16 flex w-full max-w-xs flex-1">
              <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-4">
                <div className="flex h-16 shrink-0 items-center justify-between">
                  <h1 className="text-xl font-bold text-gray-900">MDM Inventory</h1>
                  <button
                    onClick={() => setOpen(false)}
                    className="rounded-md p-2 text-gray-400 hover:text-gray-500"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>
                <nav className="flex flex-1 flex-col">
                  <ul role="list" className="flex flex-1 flex-col gap-y-7">
                    <li>
                      <ul role="list" className="-mx-2 space-y-1">
                        {filteredNavigation.map((item) => {
                          const isActive = pathname === item.href
                          const IconComponent = iconMap[item.icon as keyof typeof iconMap]
                          return (
                            <li key={item.name}>
                              <Link
                                href={item.href}
                                className={`group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold ${
                                  isActive
                                    ? 'bg-gray-50 text-blue-600'
                                    : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                                }`}
                                onClick={() => setOpen(false)}
                              >
                                {IconComponent && <IconComponent className="h-6 w-6 shrink-0" aria-hidden="true" />}
                                {item.name}
                              </Link>
                            </li>
                          )
                        })}
                      </ul>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6 pb-4">
          <div className="flex h-16 shrink-0 items-center">
            <h1 className="text-xl font-bold text-gray-900">MDM Inventory</h1>
          </div>
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul role="list" className="-mx-2 space-y-1">
                  {filteredNavigation.map((item) => {
                    const isActive = pathname === item.href
                    const IconComponent = iconMap[item.icon as keyof typeof iconMap]
                    return (
                      <li key={item.name}>
                        <Link
                          href={item.href}
                          className={`group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold ${
                            isActive
                              ? 'bg-gray-50 text-blue-600'
                              : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                          }`}
                        >
                          {IconComponent && <IconComponent className="h-6 w-6 shrink-0" aria-hidden="true" />}
                          {item.name}
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              </li>
              <li className="mt-auto">
                <div className="flex items-center gap-x-4 px-6 py-3 text-sm font-semibold leading-6 text-gray-900">
                  <UserIcon className="h-8 w-8 rounded-full bg-gray-50" />
                  <span className="sr-only">Your profile</span>
                  <span aria-hidden="true">{profile?.full_name}</span>
                </div>
                <button
                  onClick={signOut}
                  className="w-full text-left px-6 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                >
                  Sign out
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </>
  )
}
