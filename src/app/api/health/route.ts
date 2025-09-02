import { NextResponse } from 'next/server'
import { checkDatabaseHealth } from '@/server/db'

export async function GET() {
  try {
    const dbHealth = await checkDatabaseHealth()
    
    const health = {
      status: dbHealth.status === 'healthy' ? 'healthy' : 'degraded',
      timestamp: new Date().toISOString(),
      services: {
        database: dbHealth,
        api: { status: 'healthy', timestamp: new Date().toISOString() }
      }
    }

    const statusCode = health.status === 'healthy' ? 200 : 503

    return NextResponse.json(health, { status: statusCode })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    
    return NextResponse.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: errorMessage,
        services: {
          database: { status: 'unhealthy', error: errorMessage },
          api: { status: 'unhealthy', error: errorMessage }
        }
      },
      { status: 500 }
    )
  }
}
