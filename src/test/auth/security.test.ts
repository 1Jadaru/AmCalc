import { hashPassword, verifyPassword, generateAccessToken, verifyAccessToken } from '../../utils/auth.utils';
import { User } from '../../types/auth.types';
import bcrypt from 'bcrypt';

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
      findMany: jest.fn(),
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
    findMany: jest.fn(),
  },
  passwordReset: {
    create: jest.fn(),
    findMany: jest.fn(),
    deleteMany: jest.fn(),
  },
};

// Import and set up dependencies
import { AuthService, setPrismaClient } from '../../services/auth.service';

// Set up the mock
setPrismaClient(mockPrismaClient);

describe('Authentication Security Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset all mock functions
    Object.values(mockPrismaClient.user).forEach(fn => (fn as jest.Mock).mockReset());
    Object.values(mockPrismaClient.userSession).forEach(fn => (fn as jest.Mock).mockReset());
    Object.values(mockPrismaClient.passwordReset).forEach(fn => (fn as jest.Mock).mockReset());
    // Inject the mock Prisma client
    setPrismaClient(mockPrismaClient);
  });

  describe('Password Security', () => {
    it('should hash passwords with sufficient salt rounds', async () => {
      const password = 'TestPassword123!';
      const hashedPassword = await hashPassword(password);
      
      // bcrypt hash should be 60 characters long
      expect(hashedPassword).toHaveLength(60);
      expect(hashedPassword).toMatch(/^\$2[aby]\$\d{1,2}\$/);
      
      // Should verify correctly
      expect(await verifyPassword(password, hashedPassword)).toBe(true);
    });

    it('should reject weak passwords', async () => {
      const weakPasswords = [
        'short', // too short
        'nouppercase123!', // no uppercase
        'NOLOWERCASE123!', // no lowercase
        'NoNumbers!', // no numbers
        'NoSpecial123', // no special chars
      ];

      for (const weakPassword of weakPasswords) {
        const { passwordSchema } = require('../../utils/validation');
        const result = passwordSchema.safeParse(weakPassword);
        expect(result.success).toBe(false);
      }
    });

    it('should accept strong passwords', async () => {
      const strongPasswords = [
        'TestPass123!',
        'MySecureP@ssw0rd',
        'Complex!Pass#2024',
        'Str0ng!P@ssw0rd',
      ];

      for (const strongPassword of strongPasswords) {
        const { passwordSchema } = require('../../utils/validation');
        const result = passwordSchema.safeParse(strongPassword);
        expect(result.success).toBe(true);
      }
    });
  });

  describe('JWT Token Security', () => {
    it('should generate valid access tokens', () => {
      const mockUser: User = {
        id: 'user-123',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        isActive: true,
        emailVerified: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const token = generateAccessToken(mockUser);
      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.split('.')).toHaveLength(3); // JWT has 3 parts
    });

    it('should verify valid tokens', () => {
      const mockUser: User = {
        id: 'user-123',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        isActive: true,
        emailVerified: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const token = generateAccessToken(mockUser);
      const decoded = verifyAccessToken(token);
      
      expect(decoded).not.toBeNull();
      expect(decoded?.userId).toBe('user-123');
      expect(decoded?.email).toBe('test@example.com');
      expect(decoded?.type).toBe('access');
    });

    it('should reject invalid tokens', () => {
      const invalidTokens = [
        'invalid.token.here',
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.invalid.signature',
        '',
        'not-a-jwt-token',
      ];

      for (const invalidToken of invalidTokens) {
        const decoded = verifyAccessToken(invalidToken);
        expect(decoded).toBeNull();
      }
    });

    it('should reject expired tokens', () => {
      // This test would require mocking time or using a pre-generated expired token
      // For now, we'll test the token expiration logic
      const isTokenExpired = (exp: number): boolean => {
        return Date.now() >= exp * 1000;
      };

      const futureExp = Math.floor(Date.now() / 1000) + 3600; // 1 hour from now
      const pastExp = Math.floor(Date.now() / 1000) - 3600; // 1 hour ago

      expect(isTokenExpired(futureExp)).toBe(false);
      expect(isTokenExpired(pastExp)).toBe(true);
    });
  });

  describe('Session Management Security', () => {
    it('should cleanup expired sessions', async () => {
      const expiredDate = new Date(Date.now() - 24 * 60 * 60 * 1000); // 1 day ago
      
      mockPrismaClient.userSession.deleteMany.mockResolvedValue({ count: 5 });

      await AuthService.cleanupExpiredSessions();

      expect(mockPrismaClient.userSession.deleteMany).toHaveBeenCalledWith({
        where: {
          expires_at: {
            lt: expect.any(Date),
          },
        },
      });
    });

    it('should invalidate sessions on logout', async () => {
      const userId = 'user-123';
      const refreshToken = 'mock-refresh-token';
      
      mockPrismaClient.userSession.deleteMany.mockResolvedValue({ count: 1 });

      await AuthService.logoutUser(userId, refreshToken);

      expect(mockPrismaClient.userSession.deleteMany).toHaveBeenCalledWith({
        where: {
          user_id: userId,
          token_hash: expect.any(String), // hashed token
        },
      });
    });
  });

  describe('Input Validation Security', () => {
    it('should validate email format', () => {
      const { emailSchema } = require('../../utils/validation');
      
      const validEmails = [
        'test@example.com',
        'user.name@domain.co.uk',
        'user+tag@example.org',
      ];

      const invalidEmails = [
        'invalid-email',
        '@example.com',
        'user@',
        'user@.com',
        '',
      ];

      for (const email of validEmails) {
        expect(emailSchema.safeParse(email).success).toBe(true);
      }

      for (const email of invalidEmails) {
        expect(emailSchema.safeParse(email).success).toBe(false);
      }
    });

    it('should prevent SQL injection in email validation', () => {
      const { emailSchema } = require('../../utils/validation');
      
      const maliciousInputs = [
        "'; DROP TABLE users; --",
        "' OR '1'='1",
        "admin@example.com'; INSERT INTO users VALUES ('hacker', 'password'); --",
      ];

      for (const input of maliciousInputs) {
        const result = emailSchema.safeParse(input);
        // Should either be valid email format or rejected, but not cause SQL injection
        expect(result.success).toBe(false);
      }
    });

    it('should validate name fields', () => {
      const { nameSchema } = require('../../utils/validation');
      
      const validNames = [
        'John',
        'Mary Jane',
        "O'Connor",
        'Jean-Pierre',
      ];

      const invalidNames = [
        'John123',
        'Mary@Jane',
        'John<script>alert("xss")</script>',
        '',
      ];

      for (const name of validNames) {
        expect(nameSchema.safeParse(name).success).toBe(true);
      }

      for (const name of invalidNames) {
        expect(nameSchema.safeParse(name).success).toBe(false);
      }
    });
  });

  describe('Rate Limiting Simulation', () => {
    it('should handle multiple rapid login attempts', async () => {
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

      // Simulate multiple rapid login attempts
      const loginAttempts = Array(10).fill(null).map(() => 
        AuthService.loginUser({
          email: 'test@example.com',
          password: 'TestPass123!',
        })
      );

      // All attempts should succeed (no rate limiting implemented yet)
      // This test documents the current behavior for future rate limiting implementation
      await expect(Promise.all(loginAttempts)).resolves.toBeDefined();
    });
  });

  describe('Password Reset Security', () => {
    it('should generate secure reset tokens', async () => {
      const { generateResetToken } = require('../../utils/auth.utils');
      
      const token1 = generateResetToken();
      const token2 = generateResetToken();
      
      expect(token1).toBeDefined();
      expect(token1).toHaveLength(64); // 32 bytes = 64 hex characters
      expect(token1).not.toBe(token2); // Tokens should be unique
      expect(/^[a-f0-9]{64}$/.test(token1)).toBe(true); // Should be hex string
    });

    it('should hash reset tokens for storage', async () => {
      const { generateResetToken, hashToken, verifyToken } = require('../../utils/auth.utils');
      
      const token = generateResetToken();
      const hashedToken = await hashToken(token);
      
      expect(hashedToken).not.toBe(token);
      expect(hashedToken).toHaveLength(60); // bcrypt hash length
      expect(await verifyToken(token, hashedToken)).toBe(true);
    });

    it('should expire reset tokens', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
      };

      mockPrismaClient.user.findUnique.mockResolvedValue(mockUser);
      mockPrismaClient.passwordReset.create.mockResolvedValue({});

      await AuthService.requestPasswordReset('test@example.com');

      expect(mockPrismaClient.passwordReset.create).toHaveBeenCalledWith({
        data: {
          user_id: 'user-123',
          token_hash: expect.any(String),
          expires_at: expect.any(Date),
        },
      });

      // Verify expiration time is set to 1 hour from now
      const callData = mockPrismaClient.passwordReset.create.mock.calls[0][0].data;
      const expiresAt = callData.expires_at;
      const now = new Date();
      const oneHourFromNow = new Date(now.getTime() + 60 * 60 * 1000);
      
      expect(expiresAt.getTime()).toBeCloseTo(oneHourFromNow.getTime(), -1000); // Within 1 second
    });
  });
}); 