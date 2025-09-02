import { NextResponse } from 'next/server'
import { db } from '@/server/db'
import { requireRole } from '@/server/auth'
import { sql } from 'drizzle-orm'

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Require any authenticated user
    await requireRole(['admin', 'buyer', 'approver', 'warehouse', 'manager', 'auditor'])
    
    const projectId = params.id
    
    // Query valuation by project view
    const result = await db.execute(sql`
      SELECT * FROM valuation_by_project WHERE project_id = ${projectId}
    `)
    
    if (result.length === 0) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(result[0])
  } catch (error) {
    console.error('Error fetching project valuation:', error)
    return NextResponse.json(
      { error: 'Failed to fetch project valuation' },
      { status: 500 }
    )
  }
}
