/**
 * Environment variable validation utility
 * Validates required environment variables and their formats
 */

export function validateEnvironment(): void {
  const required = ['DATABASE_URL', 'JWT_SECRET', 'JWT_REFRESH_SECRET'];
  
  for (const var_name of required) {
    if (!process.env[var_name]) {
      throw new Error(`Missing required environment variable: ${var_name}`);
    }
  }
  
  // Validate DATABASE_URL format
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl?.startsWith('postgresql://')) {
    throw new Error('DATABASE_URL must be a valid PostgreSQL connection string');
  }

  // Validate JWT secrets are not default values
  const jwtSecret = process.env.JWT_SECRET;
  const jwtRefreshSecret = process.env.JWT_REFRESH_SECRET;
  
  if (jwtSecret === 'your-super-secret-jwt-key-here' || 
      jwtRefreshSecret === 'your-super-secret-refresh-key-here') {
    throw new Error('JWT secrets must be changed from default values');
  }

  // Set Prisma-specific environment variables to prevent query engine panics
  if (!process.env.PRISMA_QUERY_ENGINE_TYPE) {
    process.env.PRISMA_QUERY_ENGINE_TYPE = 'binary';
  }
  if (!process.env.PRISMA_QUERY_ENGINE_BINARY) {
    process.env.PRISMA_QUERY_ENGINE_BINARY = 'query-engine';
  }
  if (!process.env.PRISMA_CLI_QUERY_ENGINE_TYPE) {
    process.env.PRISMA_CLI_QUERY_ENGINE_TYPE = 'binary';
  }
  if (!process.env.PRISMA_CLI_QUERY_ENGINE_BINARY) {
    process.env.PRISMA_CLI_QUERY_ENGINE_BINARY = 'query-engine';
  }

  console.log('✅ Environment validation passed');
}

/**
 * Validate environment for specific operations
 */
export function validateDatabaseEnvironment(): void {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL environment variable is required for database operations');
  }
  
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl.startsWith('postgresql://')) {
    throw new Error('DATABASE_URL must be a valid PostgreSQL connection string');
  }
}

export function validateAuthEnvironment(): void {
  if (!process.env.JWT_SECRET || !process.env.JWT_REFRESH_SECRET) {
    throw new Error('JWT_SECRET and JWT_REFRESH_SECRET environment variables are required');
  }
} 