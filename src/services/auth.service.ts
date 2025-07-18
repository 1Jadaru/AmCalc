import { hashPassword, verifyPassword, generateAccessToken, generateRefreshToken, hashToken, generateResetToken, verifyToken } from '../utils/auth.utils';
import { RegisterCredentials, LoginCredentials, User } from '../types/auth.types';
import { prisma } from '../utils/database';

// Use the existing database utility instead of creating a new Prisma client
const getPrisma = async () => {
  return await prisma();
};

// Dependency injection for testing
export function setPrismaClient(client: any) {
  // This function is no longer needed as we are using the global prisma
}

// Get current Prisma client (for testing)
export function getPrismaClient() {
  // This function is no longer needed as we are using the global prisma
  return prisma;
}

export class AuthService {
  /**
   * Register a new user
   */
  static async registerUser(credentials: RegisterCredentials): Promise<User> {
    const { email, password, firstName, lastName } = credentials;
    const prismaClient = await getPrisma();

    // Check if user already exists
    const existingUser = await prismaClient.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Create user
    const user = await prismaClient.user.create({
      data: {
        email,
        password_hash: passwordHash,
        first_name: firstName,
        last_name: lastName,
        is_active: true,
        email_verified: false
      }
    });

    return this.mapUserFromPrisma(user);
  }

  /**
   * Login user
   */
  static async loginUser(credentials: LoginCredentials): Promise<{ user: User; accessToken: string; refreshToken: string }> {
    const { email, password } = credentials;
    const prismaClient = await getPrisma();

    // Find user by email
    const user = await prismaClient.user.findUnique({
      where: { email }
    });

    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Verify password
    const isValidPassword = await verifyPassword(password, user.password_hash);
    if (!isValidPassword) {
      throw new Error('Invalid email or password');
    }

    // Check if user is active
    if (!user.is_active) {
      throw new Error('Account is deactivated');
    }

    // Update last login
    await prismaClient.user.update({
      where: { id: user.id },
      data: { last_login: new Date() }
    });

    // Generate tokens
    const mappedUser = this.mapUserFromPrisma(user);
    const accessToken = generateAccessToken(mappedUser);
    const refreshToken = generateRefreshToken(mappedUser);

    // Store refresh token hash in database
    const tokenHash = await hashToken(refreshToken);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    await prismaClient.userSession.create({
      data: {
        user_id: user.id,
        token_hash: tokenHash,
        expires_at: expiresAt
      }
    });

    return {
      user: mappedUser,
      accessToken,
      refreshToken
    };
  }

  /**
   * Logout user
   */
  static async logoutUser(userId: string, refreshToken: string): Promise<void> {
    const prismaClient = await getPrisma();
    
    // Find and delete the session
    const tokenHash = await hashToken(refreshToken);
    
    await prismaClient.userSession.deleteMany({
      where: {
        user_id: userId,
        token_hash: tokenHash
      }
    });
  }

  /**
   * Get user by ID
   */
  static async getUserById(userId: string): Promise<User | null> {
    const prismaClient = await getPrisma();
    
    const user = await prismaClient.user.findUnique({
      where: { id: userId }
    });

    return user ? this.mapUserFromPrisma(user) : null;
  }

  /**
   * Get user by email
   */
  static async getUserByEmail(email: string): Promise<User | null> {
    const prismaClient = await getPrisma();
    
    const user = await prismaClient.user.findUnique({
      where: { email }
    });

    return user ? this.mapUserFromPrisma(user) : null;
  }

  /**
   * Update user profile
   */
  static async updateUserProfile(userId: string, updates: { firstName?: string; lastName?: string }): Promise<User> {
    const prismaClient = await getPrisma();
    
    const user = await prismaClient.user.update({
      where: { id: userId },
      data: {
        first_name: updates.firstName,
        last_name: updates.lastName
      }
    });

    return this.mapUserFromPrisma(user);
  }

  /**
   * Change user password
   */
  static async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<void> {
    const prismaClient = await getPrisma();
    
    // Get user with current password
    const user = await prismaClient.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Verify current password
    const isValidPassword = await verifyPassword(currentPassword, user.password_hash);
    if (!isValidPassword) {
      throw new Error('Current password is incorrect');
    }

    // Hash new password
    const newPasswordHash = await hashPassword(newPassword);

    // Update password
    await prismaClient.user.update({
      where: { id: userId },
      data: { password_hash: newPasswordHash }
    });
  }

  /**
   * Request password reset
   */
  static async requestPasswordReset(email: string): Promise<void> {
    const prismaClient = await getPrisma();
    
    const user = await prismaClient.user.findUnique({
      where: { email }
    });

    if (!user) {
      // Don't reveal if user exists or not
      return;
    }

    // Generate reset token
    const resetToken = generateResetToken();
    const tokenHash = await hashToken(resetToken);
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    // Store reset token
    await prismaClient.passwordReset.create({
      data: {
        user_id: user.id,
        token_hash: tokenHash,
        expires_at: expiresAt
      }
    });

    // TODO: Send email with reset token
    console.log(`Password reset token for ${email}: ${resetToken}`);
  }

  /**
   * Reset password with token
   */
  static async resetPassword(token: string, newPassword: string): Promise<void> {
    const prismaClient = await getPrisma();
    
    const tokenHash = await hashToken(token);

    // Find valid reset token
    const resetRecord = await prismaClient.passwordReset.findFirst({
      where: {
        token_hash: tokenHash,
        expires_at: {
          gt: new Date()
        }
      },
      include: {
        user: true
      }
    });

    if (!resetRecord) {
      throw new Error('Invalid or expired reset token');
    }

    // Hash new password
    const newPasswordHash = await hashPassword(newPassword);

    // Update user password
    await prismaClient.user.update({
      where: { id: resetRecord.user_id },
      data: { password_hash: newPasswordHash }
    });

    // Delete used reset token
    await prismaClient.passwordReset.delete({
      where: { id: resetRecord.id }
    });
  }

  /**
   * Cleanup expired sessions
   */
  static async cleanupExpiredSessions(): Promise<void> {
    const prismaClient = await getPrisma();
    
    await prismaClient.userSession.deleteMany({
      where: {
        expires_at: {
          lt: new Date()
        }
      }
    });
  }

  /**
   * Map Prisma user to User type
   */
  private static mapUserFromPrisma(user: any): User {
    return {
      id: user.id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      isActive: user.is_active,
      emailVerified: user.email_verified,
      lastLogin: user.last_login,
      createdAt: user.created_at,
      updatedAt: user.updated_at
    };
  }
}