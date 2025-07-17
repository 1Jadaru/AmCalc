import { AuthService } from '../../services/auth.service';
import { hashPassword, verifyPassword } from '../../utils/auth.utils';

describe('Authentication System', () => {
  describe('Password Hashing', () => {
    it('should hash password correctly', async () => {
      const password = 'TestPassword123!';
      const hashedPassword = await hashPassword(password);
      
      expect(hashedPassword).not.toBe(password);
      expect(hashedPassword).toHaveLength(60); // bcrypt hash length
      expect(await verifyPassword(password, hashedPassword)).toBe(true);
    });

    it('should verify password correctly', async () => {
      const password = 'TestPassword123!';
      const hashedPassword = await hashPassword(password);
      
      expect(await verifyPassword(password, hashedPassword)).toBe(true);
      expect(await verifyPassword('WrongPassword', hashedPassword)).toBe(false);
    });
  });

  describe('Validation Schemas', () => {
    it('should validate email correctly', () => {
      const { emailSchema } = require('../../utils/validation');
      
      expect(emailSchema.safeParse('test@example.com').success).toBe(true);
      expect(emailSchema.safeParse('invalid-email').success).toBe(false);
      expect(emailSchema.safeParse('').success).toBe(false);
    });

    it('should validate password strength correctly', () => {
      const { passwordSchema } = require('../../utils/validation');
      
      // Valid password
      expect(passwordSchema.safeParse('TestPass123!').success).toBe(true);
      
      // Invalid passwords
      expect(passwordSchema.safeParse('short').success).toBe(false); // too short
      expect(passwordSchema.safeParse('nouppercase123!').success).toBe(false); // no uppercase
      expect(passwordSchema.safeParse('NOLOWERCASE123!').success).toBe(false); // no lowercase
      expect(passwordSchema.safeParse('NoNumbers!').success).toBe(false); // no numbers
      expect(passwordSchema.safeParse('NoSpecial123').success).toBe(false); // no special chars
    });
  });

  describe('AuthService', () => {
    it('should be defined', () => {
      expect(AuthService).toBeDefined();
      expect(typeof AuthService.registerUser).toBe('function');
      expect(typeof AuthService.loginUser).toBe('function');
      expect(typeof AuthService.logoutUser).toBe('function');
    });
  });
}); 