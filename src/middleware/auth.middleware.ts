import { NextRequest, NextResponse } from 'next/server';
import { verifyAccessToken, extractTokenFromHeader } from '../utils/auth.utils';
import { AuthService } from '../services/auth.service';
import { User } from '../types/auth.types';

export interface AuthenticatedRequest extends NextRequest {
  user?: User;
}

/**
 * Authentication middleware for API routes
 */
export async function authMiddleware(request: NextRequest): Promise<NextResponse | null> {
  try {
    const authHeader = request.headers.get('authorization');
    const token = extractTokenFromHeader(authHeader || undefined);

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'No token provided' },
        { status: 401 }
      );
    }

    const decoded = verifyAccessToken(token);
    if (!decoded) {
      return NextResponse.json(
        { success: false, error: 'Invalid token' },
        { status: 401 }
      );
    }

    const user = await AuthService.getUserById(decoded.userId);
    if (!user || !user.isActive) {
      return NextResponse.json(
        { success: false, error: 'Invalid token' },
        { status: 401 }
      );
    }

    // Add user to request context
    (request as AuthenticatedRequest).user = user;
    
    return null; // Continue to next middleware/handler
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Authentication failed' },
      { status: 401 }
    );
  }
}

/**
 * Optional authentication middleware (doesn't block if no token)
 */
export async function optionalAuthMiddleware(request: NextRequest): Promise<NextResponse | null> {
  try {
    const authHeader = request.headers.get('authorization');
    const token = extractTokenFromHeader(authHeader || undefined);

    if (!token) {
      return null; // Continue without authentication
    }

    const decoded = verifyAccessToken(token);
    if (!decoded) {
      return null; // Continue without authentication
    }

    const user = await AuthService.getUserById(decoded.userId);
    if (user && user.isActive) {
      (request as AuthenticatedRequest).user = user;
    }
    
    return null; // Continue to next middleware/handler
  } catch (error) {
    return null; // Continue without authentication
  }
}

/**
 * Helper function to get authenticated user from request
 */
export function getAuthenticatedUser(request: AuthenticatedRequest): User | null {
  return request.user || null;
}

/**
 * Helper function to check if request is authenticated
 */
export function isAuthenticated(request: AuthenticatedRequest): boolean {
  return !!request.user;
} 