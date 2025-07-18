import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { JWTPayload, User } from '../types/auth.types';

// JWT Configuration
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-here';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your-super-secret-refresh-key-here';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '15m';
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '7d';

// Ensure secrets are not undefined
if (!process.env.JWT_SECRET || !process.env.JWT_REFRESH_SECRET) {
  console.warn('JWT secrets not configured. Using default values for development only.');
}

// Password hashing configuration
const SALT_ROUNDS = 12;

/**
 * Hash a password using bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * Verify a password against a hash
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Generate JWT access token
 */
export function generateAccessToken(user: User): string {
  const payload = {
    userId: user.id,
    email: user.email,
    type: 'access' as const
  };
  
  return jwt.sign(payload, JWT_SECRET as jwt.Secret, { expiresIn: JWT_EXPIRES_IN });
}

/**
 * Generate JWT refresh token
 */
export function generateRefreshToken(user: User): string {
  const payload = {
    userId: user.id,
    email: user.email,
    type: 'refresh' as const
  };
  
  return jwt.sign(payload, JWT_REFRESH_SECRET as jwt.Secret, { expiresIn: JWT_REFRESH_EXPIRES_IN });
}

/**
 * Verify JWT access token
 */
export function verifyAccessToken(token: string): JWTPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
    if (decoded.type !== 'access') {
      return null;
    }
    return decoded;
  } catch (error) {
    return null;
  }
}

/**
 * Verify JWT refresh token
 */
export function verifyRefreshToken(token: string): JWTPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_REFRESH_SECRET) as JWTPayload;
    if (decoded.type !== 'refresh') {
      return null;
    }
    return decoded;
  } catch (error) {
    return null;
  }
}

/**
 * Extract token from Authorization header
 */
export function extractTokenFromHeader(authHeader: string | undefined): string | null {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.substring(7);
}

/**
 * Generate a secure random token for password reset
 */
export function generateResetToken(): string {
  return require('crypto').randomBytes(32).toString('hex');
}

/**
 * Hash a token for storage in database
 */
export async function hashToken(token: string): Promise<string> {
  return bcrypt.hash(token, 10);
}

/**
 * Verify a token against its hash
 */
export async function verifyToken(token: string, hash: string): Promise<boolean> {
  return bcrypt.compare(token, hash);
}

/**
 * Check if a token is expired
 */
export function isTokenExpired(exp: number): boolean {
  return Date.now() >= exp * 1000;
} 
