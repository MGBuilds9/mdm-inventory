import { NextResponse } from 'next/server'
import { db } from '@/server/db'
import { invitations } from '@/server/db/schema'
import { eq, and, isNull } from 'drizzle-orm'
import { z } from 'zod'

const verifySchema = z.object({
  email: z.string().email(),
  inviteCode: z.string().min(1),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, inviteCode } = verifySchema.parse(body)
    
    // Find valid invitation
    const invitation = await db
      .select({
        id: invitations.id,
        org_id: invitations.org_id,
        role_key: invitations.role_key,
        email: invitations.email,
      })
      .from(invitations)
      .where(
        and(
          eq(invitations.invite_code, inviteCode),
          eq(invitations.email, email),
          isNull(invitations.used_at)
        )
      )
      .limit(1)
    
    if (invitation.length === 0) {
      return NextResponse.json(
        { error: 'Invalid or expired invitation' },
        { status: 400 }
      )
    }
    
    const invite = invitation[0]
    
    return NextResponse.json({
      ok: true,
      role_key: invite.role_key,
      org_id: invite.org_id,
    })
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data' },
        { status: 400 }
      )
    }
    
    console.error('Error verifying invitation:', error)
    return NextResponse.json(
      { error: 'Failed to verify invitation' },
      { status: 500 }
    )
  }
}
