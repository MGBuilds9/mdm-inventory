import { NextResponse } from 'next/server'
import { db } from '@/server/db'
import { users } from '@/server/db/schema'
import { requireRole } from '@/server/auth'
import { eq } from 'drizzle-orm'
import { z } from 'zod'

const updatePreferencesSchema = z.object({
  dark_mode: z.boolean(),
})

export async function PATCH(request: Request) {
  try {
    // Require any authenticated user
    const { userId } = await requireRole(['admin', 'buyer', 'approver', 'warehouse', 'manager', 'auditor'])
    
    const body = await request.json()
    const { dark_mode } = updatePreferencesSchema.parse(body)
    
    // Update user's dark mode preference
    await db
      .update(users)
      .set({ dark_mode })
      .where(eq(users.id, userId))
    
    return NextResponse.json({ success: true })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data' },
        { status: 400 }
      )
    }
    
    console.error('Error updating user preferences:', error)
    return NextResponse.json(
      { error: 'Failed to update preferences' },
      { status: 500 }
    )
  }
}
