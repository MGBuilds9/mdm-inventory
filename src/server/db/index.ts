import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'
import { DB_CONSTANTS } from '@/lib/constants'
import { sql } from 'drizzle-orm'

// Validate required environment variables
if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is required')
}

if (!process.env.DIRECT_URL) {
  throw new Error('DIRECT_URL environment variable is required')
}

// Connection for edge functions (with connection pooling)
const connectionString = process.env.DATABASE_URL

// Connection for migrations (direct, no pooling)
const directConnectionString = process.env.DIRECT_URL

// Main database client (with pooling for edge functions)
const client = postgres(connectionString, {
  max: DB_CONSTANTS.MAX_CONNECTIONS,
  idle_timeout: DB_CONSTANTS.IDLE_TIMEOUT,
  connect_timeout: DB_CONSTANTS.CONNECT_TIMEOUT,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
})

export const db = drizzle(client, { schema })

// Direct connection for migrations
export const directDb = drizzle(
  postgres(directConnectionString, {
    max: 1,
    idle_timeout: DB_CONSTANTS.IDLE_TIMEOUT,
    connect_timeout: DB_CONSTANTS.CONNECT_TIMEOUT,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  }),
  { schema }
)

// Close connections (useful for testing)
export async function closeConnections() {
  try {
    await client.end()
    console.log('Database connections closed successfully')
  } catch (error) {
    console.error('Error closing database connections:', error)
  }
}

// Health check function
export async function checkDatabaseHealth() {
  try {
    await db.execute(sql`SELECT 1`)
    return { status: 'healthy', timestamp: new Date().toISOString() }
  } catch (error) {
    return { 
      status: 'unhealthy', 
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }
  }
}
