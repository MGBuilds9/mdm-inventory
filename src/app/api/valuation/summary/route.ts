import { NextResponse } from 'next/server'
import { db } from '@/server/db'
import { requireRole } from '@/server/auth'
import { sql } from 'drizzle-orm'

export async function GET() {
  try {
    // Require any authenticated user
    await requireRole(['admin', 'buyer', 'approver', 'warehouse', 'manager', 'auditor'])
    
    // Query valuation summary view
    const result = await db.execute(sql`
      SELECT * FROM valuation_summary
    `)
    
    if (result.length === 0) {
      return NextResponse.json({
        total_value: 0,
        unique_items: 0,
        total_movements: 0
      })
    }
    
    return NextResponse.json(result[0])
  } catch (error) {
    console.error('Error fetching valuation summary:', error)
    return NextResponse.json(
      { error: 'Failed to fetch valuation summary' },
      { status: 500 }
    )
  }
}
