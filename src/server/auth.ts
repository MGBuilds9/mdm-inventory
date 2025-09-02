import { auth } from '@clerk/nextjs/server'
import { db } from './db'
import { users, memberships, organizations } from './db/schema'
import { eq } from 'drizzle-orm'

export async function requireRole(roles: string[]) {
  const { userId } = await auth()
  
  if (!userId) {
    throw new Error('Unauthorized')
  }

  // Get user with organization and role
  const userWithRole = await db
    .select({
      user_id: users.id,
      org_id: organizations.id,
      role_key: memberships.role_key,
    })
    .from(users)
    .innerJoin(memberships, eq(users.id, memberships.user_id))
    .innerJoin(organizations, eq(memberships.org_id, organizations.id))
    .where(eq(users.clerk_user_id, userId))
    .limit(1)

  if (userWithRole.length === 0) {
    throw new Error('User not found or no organization access')
  }

  const userRole = userWithRole[0].role_key

  if (!roles.includes(userRole)) {
    throw new Error(`Access denied. Required roles: ${roles.join(', ')}`)
  }

  return {
    userId: userWithRole[0].user_id,
    orgId: userWithRole[0].org_id,
    role: userRole,
  }
}

export async function getCurrentUser() {
  const { userId } = await auth()
  
  if (!userId) {
    return null
  }

  const user = await db
    .select({
      id: users.id,
      email: users.email,
      display_name: users.display_name,
      dark_mode: users.dark_mode,
      org_id: organizations.id,
      org_name: organizations.name,
      role_key: memberships.role_key,
    })
    .from(users)
    .innerJoin(memberships, eq(users.id, memberships.user_id))
    .innerJoin(organizations, eq(memberships.org_id, organizations.id))
    .where(eq(users.clerk_user_id, userId))
    .limit(1)

  return user[0] || null
}
