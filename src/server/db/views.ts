import { sql } from 'drizzle-orm'
import { db } from './index'

// Valuation Summary View
export const valuationSummaryView = sql`
  CREATE OR REPLACE VIEW valuation_summary AS
  SELECT 
    SUM(qty * COALESCE(unit_cost, 0)) as total_value,
    COUNT(DISTINCT item_id) as unique_items,
    COUNT(*) as total_movements
  FROM movements
  WHERE qty > 0
`

// Valuation by Project View
export const valuationByProjectView = sql`
  CREATE OR REPLACE VIEW valuation_by_project AS
  SELECT 
    p.id as project_id,
    p.code,
    p.name,
    COALESCE(SUM(m.qty * COALESCE(m.unit_cost, 0)), 0) as project_value,
    COUNT(DISTINCT m.item_id) as item_count
  FROM projects p
  LEFT JOIN movements m ON p.id = m.project_id AND m.qty > 0
  GROUP BY p.id, p.code, p.name
`

// Create views function
export async function createViews() {
  try {
    await db.execute(valuationSummaryView)
    await db.execute(valuationByProjectView)
    console.log('Database views created successfully')
  } catch (error) {
    console.error('Error creating views:', error)
    throw error
  }
}
