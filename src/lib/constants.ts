// Application constants
export const APP_NAME = 'MDM Inventory Management System'
export const APP_DESCRIPTION = 'Enterprise inventory management with real-time tracking'

// User roles
export const USER_ROLES = {
  ADMIN: 'admin',
  BUYER: 'buyer',
  APPROVER: 'approver',
  WAREHOUSE: 'warehouse',
  MANAGER: 'manager',
  AUDITOR: 'auditor',
} as const

export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES]

// Role descriptions
export const ROLE_DESCRIPTIONS = {
  [USER_ROLES.ADMIN]: 'Full system access and user management',
  [USER_ROLES.BUYER]: 'Can create purchase orders and manage suppliers',
  [USER_ROLES.APPROVER]: 'Can approve purchase orders and financial decisions',
  [USER_ROLES.WAREHOUSE]: 'Can manage inventory, shipping, and warehouse operations',
  [USER_ROLES.MANAGER]: 'Operational oversight and reporting access',
  [USER_ROLES.AUDITOR]: 'Read-only access for compliance and auditing',
} as const

// Navigation items
export const NAVIGATION_ITEMS = [
  { name: 'Dashboard', href: '/', icon: 'HomeIcon' },
  { name: 'Purchase Orders', href: '/purchase-orders', icon: 'ClipboardDocumentListIcon' },
  { name: 'Inventory', href: '/inventory', icon: 'CubeIcon' },
  { name: 'Shipping', href: '/shipping', icon: 'TruckIcon' },
  { name: 'Reports', href: '/reports', icon: 'ChartBarIcon' },
  { name: 'Settings', href: '/settings', icon: 'Cog6ToothIcon' },
] as const

// API endpoints
export const API_ENDPOINTS = {
  HEALTH: '/api/health',
  USERS: '/api/users',
  INVENTORY: '/api/inventory',
  PURCHASE_ORDERS: '/api/purchase-orders',
  SHIPPING: '/api/shipping',
  REPORTS: '/api/reports',
} as const

// Database constants
export const DB_CONSTANTS = {
  MAX_CONNECTIONS: 10,
  IDLE_TIMEOUT: 20,
  CONNECT_TIMEOUT: 10,
} as const

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
} as const
