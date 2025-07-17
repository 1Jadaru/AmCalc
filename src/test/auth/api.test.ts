// Mock the database connection first
jest.mock('../../generated/prisma', () => ({
  PrismaClient: jest.fn().mockImplementation(() => ({
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    userSession: {
      create: jest.fn(),
      deleteMany: jest.fn(),
    },
    passwordReset: {
      create: jest.fn(),
      findMany: jest.fn(),
      deleteMany: jest.fn(),
    },
  })),
}));

const mockPrismaClient = {
  user: {
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
  userSession: {
    create: jest.fn(),
    deleteMany: jest.fn(),
  },
  passwordReset: {
    create: jest.fn(),
    findMany: jest.fn(),
    deleteMany: jest.fn(),
  },
};

// Import and set up dependencies
import { NextRequest } from 'next/server';
import { AuthService, setPrismaClient } from '../../services/auth.service';
import bcrypt from 'bcrypt';

// Set up the mock before importing the API routes
setPrismaClient(mockPrismaClient);

// Import API routes after setting up the mock
import { POST as registerHandler } from '../../app/api/auth/register/route';
import { POST as loginHandler } from '../../app/api/auth/login/route';
import { POST as logoutHandler } from '../../app/api/auth/logout/route';
import { GET as meHandler } from '../../app/api/auth/me/route';

describe('Authentication API Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset all mock functions
    Object.values(mockPrismaClient.user).forEach(fn => (fn as jest.Mock).mockReset());
    Object.values(mockPrismaClient.userSession).forEach(fn => (fn as jest.Mock).mockReset());
    Object.values(mockPrismaClient.passwordReset).forEach(fn => (fn as jest.Mock).mockReset());
    setPrismaClient(mockPrismaClient);
    // Reset bcrypt compare
    jest.spyOn(bcrypt, 'compare').mockReset();
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        first_name: 'Test',
        last_name: 'User',
        is_active: true,
        email_verified: false,
        created_at: new Date(),
        updated_at: new Date(),
      };

      mockPrismaClient.user.findUnique.mockResolvedValue(null);
      mockPrismaClient.user.create.mockResolvedValue(mockUser);

      const request = new NextRequest('http://localhost:3000/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'TestPass123!',
          confirmPassword: 'TestPass123!',
          firstName: 'Test',
          lastName: 'User',
        }),
      });

      const response = await registerHandler(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.success).toBe(true);
      expect(data.data.user.email).toBe('test@example.com');
    });

    it('should reject registration with existing email', async () => {
      const existingUser = {
        id: 'user-123',
        email: 'test@example.com',
        first_name: 'Test',
        last_name: 'User',
        is_active: true,
        email_verified: false,
        created_at: new Date(),
        updated_at: new Date(),
      };

      mockPrismaClient.user.findUnique.mockResolvedValue(existingUser);

      const request = new NextRequest('http://localhost:3000/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'TestPass123!',
          confirmPassword: 'TestPass123!',
          firstName: 'Test',
          lastName: 'User',
        }),
      });

      const response = await registerHandler(request);
      const data = await response.json();

      expect(response.status).toBe(409);
      expect(data.success).toBe(false);
      expect(data.error).toBe('User with this email already exists');
    });

    it('should reject registration with invalid data', async () => {
      const request = new NextRequest('http://localhost:3000/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          email: 'invalid-email',
          password: 'weak',
          confirmPassword: 'weak',
        }),
      });

      const response = await registerHandler(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Validation failed');
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login user successfully', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        first_name: 'Test',
        last_name: 'User',
        is_active: true,
        email_verified: false,
        password_hash: '$2b$12$hashedpassword',
        created_at: new Date(),
        updated_at: new Date(),
      };
      mockPrismaClient.user.findUnique.mockResolvedValue(mockUser);
      mockPrismaClient.user.update.mockResolvedValue(mockUser);
      mockPrismaClient.userSession.create.mockResolvedValue({});
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);

      const request = new NextRequest('http://localhost:3000/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'TestPass123!',
        }),
      });

      const response = await loginHandler(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data.user.email).toBe('test@example.com');
      expect(data.data.token).toBeDefined();
      expect(data.data.refreshToken).toBeDefined();
    });

    it('should reject login with invalid credentials', async () => {
      mockPrismaClient.user.findUnique.mockResolvedValue(null);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);

      const request = new NextRequest('http://localhost:3000/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'wrongpassword',
        }),
      });

      const response = await loginHandler(request);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Invalid email or password');
    });

    it('should reject login with deactivated account', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        first_name: 'Test',
        last_name: 'User',
        is_active: false,
        email_verified: false,
        password_hash: '$2b$12$hashedpassword',
        created_at: new Date(),
        updated_at: new Date(),
      };
      mockPrismaClient.user.findUnique.mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);

      const request = new NextRequest('http://localhost:3000/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'TestPass123!',
        }),
      });

      const response = await loginHandler(request);
      const data = await response.json();

      expect(response.status).toBe(403);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Account is deactivated');
    });
  });

  describe('POST /api/auth/logout', () => {
    it('should logout user successfully', async () => {
      mockPrismaClient.userSession.deleteMany.mockResolvedValue({});
      // Simulate authenticated user
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        isActive: true,
        emailVerified: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      jest.mock('../../middleware/auth.middleware', () => ({
        authMiddleware: jest.fn().mockResolvedValue(null),
        getAuthenticatedUser: jest.fn().mockReturnValue(mockUser),
      }));

      const request = new NextRequest('http://localhost:3000/api/auth/logout', {
        method: 'POST',
        headers: {
          cookie: 'refreshToken=mock-refresh-token',
        },
      });

      const response = await logoutHandler(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.message).toBe('Logout successful');
    });
  });

  describe('GET /api/auth/me', () => {
    it('should return user profile when authenticated', async () => {
      // Simulate authenticated user
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        isActive: true,
        emailVerified: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      jest.mock('../../middleware/auth.middleware', () => ({
        authMiddleware: jest.fn().mockResolvedValue(null),
        getAuthenticatedUser: jest.fn().mockReturnValue(mockUser),
      }));

      const request = new NextRequest('http://localhost:3000/api/auth/me', {
        method: 'GET',
        headers: {
          authorization: 'Bearer mock-token',
        },
      });

      const response = await meHandler(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data.user.email).toBe('test@example.com');
    });

    it('should return 401 when not authenticated', async () => {
      // Mock the auth middleware to return error
      jest.doMock('../../middleware/auth.middleware', () => ({
        authMiddleware: jest.fn().mockResolvedValue({
          status: 401,
          json: () => ({ success: false, error: 'No token provided' }),
        }),
      }));

      const request = new NextRequest('http://localhost:3000/api/auth/me', {
        method: 'GET',
      });

      const response = await meHandler(request);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.success).toBe(false);
      expect(data.error).toBe('No token provided');
    });
  });
}); 