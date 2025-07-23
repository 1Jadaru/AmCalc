'use client';

import React, { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { User, AuthState, LoginCredentials, RegisterCredentials } from '../types/auth.types';

interface AuthContextType extends AuthState {
  makeAuthenticatedRequest: (url: string, options?: RequestInit) => Promise<Response>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check authentication status on mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      // Get stored token as fallback
      const storedToken = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
      
      const headers: Record<string, string> = {};
      if (storedToken) {
        headers['Authorization'] = `Bearer ${storedToken}`;
      }
      
      const response = await fetch('/api/auth/me', {
        credentials: 'include',
        headers
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.data.user);
        setIsAuthenticated(true);
      } else if (response.status === 401) {
        // User is not authenticated - clear stored token
        if (typeof window !== 'undefined') {
          localStorage.removeItem('accessToken');
        }
        setUser(null);
        setIsAuthenticated(false);
      } else {
        // Other error status codes
        console.error('Auth check failed with status:', response.status);
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      // Network error or other issues - treat as not authenticated
      console.error('Auth check failed:', error);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (credentials: LoginCredentials) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
        credentials: 'include'
      });

      const data = await response.json();

      if (response.ok) {
        setUser(data.data.user);
        setIsAuthenticated(true);
        setError(null);
        
        // Store token locally as fallback for development
        if (data.data.token) {
          localStorage.setItem('accessToken', data.data.token);
        }
      } else {
        setError(data.error || 'Login failed');
        throw new Error(data.error || 'Login failed');
      }
    } catch (error: any) {
      setError(error.message || 'Login failed');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (credentials: RegisterCredentials) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
        credentials: 'include'
      });

      const data = await response.json();

      if (response.ok) {
        setUser(data.data.user);
        setIsAuthenticated(true);
        setError(null);
      } else {
        setError(data.error || 'Registration failed');
        throw new Error(data.error || 'Registration failed');
      }
    } catch (error: any) {
      setError(error.message || 'Registration failed');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);

      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      });

      // Clear stored token
      if (typeof window !== 'undefined') {
        localStorage.removeItem('accessToken');
      }

      setUser(null);
      setIsAuthenticated(false);
      setError(null);
    } catch (error) {
      console.error('Logout error:', error);
      // Even if logout fails, clear local state and stored token
      if (typeof window !== 'undefined') {
        localStorage.removeItem('accessToken');
      }
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to make authenticated API requests
  const makeAuthenticatedRequest = useCallback(async (url: string, options: RequestInit = {}) => {
    const storedToken = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
    
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    } as Record<string, string>;
    
    if (storedToken) {
      headers['Authorization'] = `Bearer ${storedToken}`;
    }
    
    return fetch(url, {
      ...options,
      credentials: 'include',
      headers,
    });
  }, []); // Empty dependency array since this function doesn't depend on any state

  const clearError = () => {
    setError(null);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    setUser,
    clearError,
    makeAuthenticatedRequest
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 