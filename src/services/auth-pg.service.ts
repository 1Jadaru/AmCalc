import { hashPassword, verifyPassword, generateAccessToken, generateRefreshToken, hashToken, generateResetToken, verifyToken } from '../utils/auth.utils';
import { RegisterCredentials, LoginCredentials, User } from '../types/auth.types';
import { executeQuery, executeQuerySingle } from '../utils/database-pg';

export class AuthPgService {
  /**
   * Register a new user
   */
  static async registerUser(credentials: RegisterCredentials): Promise<{ user: User; accessToken: string; refreshToken: string }> {
    const { email, password, firstName, lastName } = credentials;

    console.log('🔍 Checking if user exists:', email);

    // Check if user already exists
    const existingUser = await executeQuerySingle(
      'SELECT id FROM "User" WHERE email = $1',
      [email]
    );

    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    console.log('🔐 Hashing password...');
    // Hash password
    const passwordHash = await hashPassword(password);

    console.log('👤 Creating user...');
    // Create user
    const user = await executeQuerySingle(
      `INSERT INTO "User" (id, email, password_hash, first_name, last_name, is_active, email_verified, created_at, updated_at)
       VALUES (gen_random_uuid(), $1, $2, $3, $4, true, false, NOW(), NOW())
       RETURNING id, email, first_name, last_name, is_active, email_verified, created_at, updated_at`,
      [email, passwordHash, firstName, lastName]
    );

    console.log('📊 User created:', user);

    if (!user) {
      throw new Error('Failed to create user - no user returned from database');
    }

    const mappedUser = this.mapUserFromDb(user);
    console.log('✅ User mapped successfully:', mappedUser);
    
    console.log('🎫 Generating tokens for new user...');
    // Generate tokens for the new user
    const accessToken = generateAccessToken(mappedUser);
    const refreshToken = generateRefreshToken(mappedUser);

    console.log('💾 Storing refresh token for new user...');
    // Store refresh token hash in database
    const tokenHash = await hashToken(refreshToken);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    await executeQuery(
      `INSERT INTO "UserSession" (id, user_id, token_hash, expires_at, created_at)
       VALUES (gen_random_uuid(), $1, $2, $3, NOW())`,
      [mappedUser.id, tokenHash, expiresAt]
    );

    console.log('✅ Registration successful with tokens for user:', mappedUser.id);
    
    return {
      user: mappedUser,
      accessToken,
      refreshToken
    };
  }

  /**
   * Login user
   */
  static async loginUser(credentials: LoginCredentials): Promise<{ user: User; accessToken: string; refreshToken: string }> {
    const { email, password } = credentials;

    console.log('🔍 Looking up user by email:', email);

    // Find user by email
    const user = await executeQuerySingle(
      'SELECT id, email, password_hash, first_name, last_name, is_active, email_verified FROM "User" WHERE email = $1',
      [email]
    );

    console.log('📊 User found:', user ? 'Yes' : 'No');

    if (!user) {
      throw new Error('Invalid email or password');
    }

    console.log('🔐 Verifying password...');
    // Verify password
    const isValidPassword = await verifyPassword(password, user.password_hash);
    console.log('🔑 Password valid:', isValidPassword);

    if (!isValidPassword) {
      throw new Error('Invalid email or password');
    }

    // Check if user is active
    if (!user.is_active) {
      throw new Error('Account is deactivated');
    }

    console.log('📝 Updating last login...');
    // Update last login
    await executeQuery(
      'UPDATE "User" SET last_login = NOW() WHERE id = $1',
      [user.id]
    );

    console.log('🎫 Generating tokens...');
    // Generate tokens
    const mappedUser = this.mapUserFromDb(user);
    const accessToken = generateAccessToken(mappedUser);
    const refreshToken = generateRefreshToken(mappedUser);

    console.log('💾 Storing refresh token...');
    // Store refresh token hash in database
    const tokenHash = await hashToken(refreshToken);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    await executeQuery(
      `INSERT INTO "UserSession" (id, user_id, token_hash, expires_at, created_at)
       VALUES (gen_random_uuid(), $1, $2, $3, NOW())`,
      [user.id, tokenHash, expiresAt]
    );

    console.log('✅ Login successful for user:', mappedUser.id);

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
    const tokenHash = await hashToken(refreshToken);
    
    await executeQuery(
      'DELETE FROM "UserSession" WHERE user_id = $1 AND token_hash = $2',
      [userId, tokenHash]
    );
  }

  /**
   * Get user by ID
   */
  static async getUserById(userId: string): Promise<User | null> {
    const user = await executeQuerySingle(
      'SELECT id, email, first_name, last_name, is_active, email_verified, created_at, updated_at FROM "User" WHERE id = $1',
      [userId]
    );

    return user ? this.mapUserFromDb(user) : null;
  }

  /**
   * Get user by email
   */
  static async getUserByEmail(email: string): Promise<User | null> {
    const user = await executeQuerySingle(
      'SELECT id, email, first_name, last_name, is_active, email_verified, created_at, updated_at FROM "User" WHERE email = $1',
      [email]
    );

    return user ? this.mapUserFromDb(user) : null;
  }

  /**
   * Update user profile
   */
  static async updateUserProfile(userId: string, updates: { firstName?: string; lastName?: string }): Promise<User> {
    const user = await executeQuerySingle(
      `UPDATE "User" 
       SET first_name = $2, last_name = $3, updated_at = NOW()
       WHERE id = $1
       RETURNING id, email, first_name, last_name, is_active, email_verified, created_at, updated_at`,
      [userId, updates.firstName, updates.lastName]
    );

    return this.mapUserFromDb(user);
  }

  /**
   * Change user password
   */
  static async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<void> {
    // Get user with current password
    const user = await executeQuerySingle(
      'SELECT password_hash FROM "User" WHERE id = $1',
      [userId]
    );

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
    await executeQuery(
      'UPDATE "User" SET password_hash = $2, updated_at = NOW() WHERE id = $1',
      [userId, newPasswordHash]
    );
  }

  /**
   * Request password reset
   */
  static async requestPasswordReset(email: string): Promise<void> {
    const user = await executeQuerySingle(
      'SELECT id FROM "User" WHERE email = $1 AND is_active = true',
      [email]
    );

    if (!user) {
      // Don't reveal if user exists or not
      return;
    }

    const resetToken = generateResetToken();
    const tokenHash = await hashToken(resetToken);
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    // Delete any existing reset tokens for this user
    await executeQuery(
      'DELETE FROM "PasswordReset" WHERE user_id = $1',
      [user.id]
    );

    // Create new reset token
    await executeQuery(
      `INSERT INTO "PasswordReset" (id, user_id, token_hash, expires_at, created_at)
       VALUES (gen_random_uuid(), $1, $2, $3, NOW())`,
      [user.id, tokenHash, expiresAt]
    );

    // In a real app, you would send an email here
    console.log('Password reset token:', resetToken);
  }

  /**
   * Reset password
   */
  static async resetPassword(token: string, newPassword: string): Promise<void> {
    const tokenHash = await hashToken(token);

    // Find valid reset token
    const resetRecord = await executeQuerySingle(
      'SELECT user_id FROM "PasswordReset" WHERE token_hash = $1 AND expires_at > NOW()',
      [tokenHash]
    );

    if (!resetRecord) {
      throw new Error('Invalid or expired reset token');
    }

    // Hash new password
    const newPasswordHash = await hashPassword(newPassword);

    // Update password
    await executeQuery(
      'UPDATE "User" SET password_hash = $2, updated_at = NOW() WHERE id = $1',
      [resetRecord.user_id, newPasswordHash]
    );

    // Delete used reset token
    await executeQuery(
      'DELETE FROM "PasswordReset" WHERE user_id = $1',
      [resetRecord.user_id]
    );
  }

  /**
   * Cleanup expired sessions
   */
  static async cleanupExpiredSessions(): Promise<void> {
    await executeQuery(
      'DELETE FROM "UserSession" WHERE expires_at < NOW()'
    );
  }

  /**
   * Map database user to User type
   */
  private static mapUserFromDb(user: any): User {
    return {
      id: user.id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      isActive: user.is_active,
      emailVerified: user.email_verified,
      createdAt: user.created_at,
      updatedAt: user.updated_at
    };
  }
} 