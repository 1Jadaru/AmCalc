import { z } from 'zod';

// Email validation schema
export const emailSchema = z
  .string()
  .min(1, 'Email is required')
  .email('Invalid email format')
  .max(255, 'Email must be less than 255 characters');

// Password validation schema with strength requirements
export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(128, 'Password must be less than 128 characters')
  .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one lowercase letter, one uppercase letter, and one number')
  .regex(/^(?=.*[!@#$%^&*(),.?":{}|<>])/, 'Password must contain at least one special character');

// Name validation schema
export const nameSchema = z
  .string()
  .max(100, 'Name must be less than 100 characters')
  .regex(/^[a-zA-Z\s'-]*$/, 'Name can only contain letters, spaces, hyphens, and apostrophes')
  .optional()
  .or(z.literal(''));

// Registration form schema (includes confirmPassword for form validation)
export const registerSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: z.string().min(1, 'Please confirm your password'),
  firstName: nameSchema,
  lastName: nameSchema,
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// API registration schema (doesn't include confirmPassword)
export const registerApiSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  firstName: nameSchema,
  lastName: nameSchema,
});

// Login form schema
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
});

// Password reset request schema
export const passwordResetRequestSchema = z.object({
  email: emailSchema,
});

// Password reset confirm schema
export const passwordResetConfirmSchema = z.object({
  token: z.string().min(1, 'Reset token is required'),
  password: passwordSchema,
  confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// User profile update schema
export const userProfileUpdateSchema = z.object({
  firstName: nameSchema.optional(),
  lastName: nameSchema.optional(),
});

// Calculator validation schemas
export const amortizationInputsSchema = z.object({
  principal: z.number(),
  interestRate: z.number(),
  termYears: z.number(),
  paymentFrequency: z.string().default('monthly'),
  startDate: z.date().optional(),
}).superRefine((data, ctx) => {
  if (data.principal < 1000) {
    ctx.addIssue({
      code: z.ZodIssueCode.too_small,
      minimum: 1000,
      type: 'number',
      inclusive: true,
      message: 'Principal must be at least $1,000',
      path: ['principal'],
      input: data.principal,
      origin: 'number',
    });
  }
  if (data.principal > 10000000) {
    ctx.addIssue({
      code: z.ZodIssueCode.too_big,
      maximum: 10000000,
      type: 'number',
      inclusive: true,
      message: 'Principal cannot exceed $10,000,000',
      path: ['principal'],
      input: data.principal,
      origin: 'number',
    });
  }
  if (data.principal <= 0) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Principal must be a positive number',
      path: ['principal'],
      input: data.principal,
      origin: 'number',
    });
  }
  if (data.interestRate < 0.1) {
    ctx.addIssue({
      code: z.ZodIssueCode.too_small,
      minimum: 0.1,
      type: 'number',
      inclusive: true,
      message: 'Interest rate must be at least 0.1%',
      path: ['interestRate'],
      input: data.interestRate,
      origin: 'number',
    });
  }
  if (data.interestRate > 25) {
    ctx.addIssue({
      code: z.ZodIssueCode.too_big,
      maximum: 25,
      type: 'number',
      inclusive: true,
      message: 'Interest rate cannot exceed 25%',
      path: ['interestRate'],
      input: data.interestRate,
      origin: 'number',
    });
  }
  if (data.interestRate <= 0) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Interest rate must be a positive number',
      path: ['interestRate'],
      input: data.interestRate,
      origin: 'number',
    });
  }
  if (!Number.isInteger(data.termYears)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Term must be a whole number',
      path: ['termYears'],
      input: data.termYears,
      origin: 'number',
    });
  }
  if (data.termYears < 1) {
    ctx.addIssue({
      code: z.ZodIssueCode.too_small,
      minimum: 1,
      type: 'number',
      inclusive: true,
      message: 'Term must be at least 1 year',
      path: ['termYears'],
      input: data.termYears,
      origin: 'number',
    });
  }
  if (data.termYears > 50) {
    ctx.addIssue({
      code: z.ZodIssueCode.too_big,
      maximum: 50,
      type: 'number',
      inclusive: true,
      message: 'Term cannot exceed 50 years',
      path: ['termYears'],
      input: data.termYears,
      origin: 'number',
    });
  }
  if (data.termYears <= 0) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Term must be a positive number',
      path: ['termYears'],
      input: data.termYears,
      origin: 'number',
    });
  }
});

// Type exports for form usage
export type RegisterFormData = z.infer<typeof registerSchema>;
export type RegisterApiData = z.infer<typeof registerApiSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
export type PasswordResetRequestFormData = z.infer<typeof passwordResetRequestSchema>;
export type PasswordResetConfirmFormData = z.infer<typeof passwordResetConfirmSchema>;
export type UserProfileUpdateFormData = z.infer<typeof userProfileUpdateSchema>;
export type AmortizationInputsFormData = z.infer<typeof amortizationInputsSchema>; 