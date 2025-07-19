import { NextRequest, NextResponse } from 'next/server';
import { validatePgConnection } from '../../../utils/database-pg';

export async function GET(request: NextRequest) {
  try {
    // Check database connection using PostgreSQL directly
    const dbHealthy = await validatePgConnection();
    
    // Check environment variables
    const envHealthy = process.env.DATABASE_URL && 
                      process.env.JWT_SECRET && 
                      process.env.JWT_REFRESH_SECRET;
    
    const isHealthy = dbHealthy && envHealthy;
    
    if (isHealthy) {
      return NextResponse.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        database: 'connected',
        environment: 'configured'
      }, { status: 200 });
    } else {
      return NextResponse.json({
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        database: dbHealthy ? 'connected' : 'disconnected',
        environment: envHealthy ? 'configured' : 'misconfigured'
      }, { status: 503 });
    }
  } catch (error) {
    console.error('Health check failed:', error);
    return NextResponse.json({
      status: 'error',
      timestamp: new Date().toISOString(),
      error: 'Health check failed'
    }, { status: 500 });
  }
} 