/**
 * Database utility using pg library directly to avoid Prisma query engine issues
 */
import { Client } from 'pg';

// Database client singleton
let pgClient: Client | null = null;

/**
 * Get PostgreSQL client
 */
export async function getPgClient(): Promise<Client> {
  if (!pgClient) {
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL environment variable is required');
    }
    
    pgClient = new Client({
      connectionString: process.env.DATABASE_URL,
    });
    
    await pgClient.connect();
    console.log('✅ PostgreSQL client connected');
  }
  
  return pgClient;
}

/**
 * Close database connection
 */
export async function closePgClient(): Promise<void> {
  if (pgClient) {
    await pgClient.end();
    pgClient = null;
    console.log('✅ PostgreSQL client disconnected');
  }
}

/**
 * Validate database connection
 */
export async function validatePgConnection(): Promise<boolean> {
  try {
    const client = await getPgClient();
    const result = await client.query('SELECT 1 as health_check');
    console.log('✅ PostgreSQL connection validation passed');
    return result.rows[0]?.health_check === 1;
  } catch (error) {
    console.error('❌ PostgreSQL connection validation failed:', error);
    return false;
  }
}

/**
 * Execute a query with parameters
 */
export async function executeQuery<T = any>(
  query: string, 
  params: any[] = []
): Promise<T[]> {
  const client = await getPgClient();
  const result = await client.query(query, params);
  return result.rows;
}

/**
 * Execute a single row query
 */
export async function executeQuerySingle<T = any>(
  query: string, 
  params: any[] = []
): Promise<T | null> {
  const rows = await executeQuery<T>(query, params);
  return rows[0] || null;
}

/**
 * Execute a transaction
 */
export async function executeTransaction(
  queries: Array<{ query: string; params?: any[] }>
): Promise<any[][]> {
  const client = await getPgClient();
  
  try {
    await client.query('BEGIN');
    
    const results: any[][] = [];
    for (const { query, params = [] } of queries) {
      const result = await client.query(query, params);
      results.push(result.rows);
    }
    
    await client.query('COMMIT');
    return results;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  }
} 