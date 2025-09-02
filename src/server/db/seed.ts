import { db } from './index'
import { appRoles } from './schema'

export async function seedAppRoles() {
  try {
    // Insert app roles
    await db.insert(appRoles).values([
      { key: 'admin', description: 'Full system access and user management' },
      { key: 'buyer', description: 'Can create purchase orders and manage suppliers' },
      { key: 'approver', description: 'Can approve purchase orders and financial decisions' },
      { key: 'warehouse', description: 'Can manage inventory, shipping, and warehouse operations' },
      { key: 'manager', description: 'Operational oversight and reporting access' },
      { key: 'auditor', description: 'Read-only access for compliance and auditing' },
    ])

    console.log('App roles seeded successfully')
  } catch (error) {
    console.error('Error seeding app roles:', error)
    throw error
  }
}

export async function seedInitialData() {
  try {
    // Seed app roles first
    await seedAppRoles()
    
    console.log('Initial data seeded successfully')
  } catch (error) {
    console.error('Error seeding initial data:', error)
    throw error
  }
}
