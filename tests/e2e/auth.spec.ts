import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/auth');
  });

  test('should display login form by default', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Sign In' })).toBeVisible();
    await expect(page.getByLabel('Email Address')).toBeVisible();
    await expect(page.getByLabel('Password')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Sign In' })).toBeVisible();
  });

  test('should switch to registration form', async ({ page }) => {
    await page.getByRole('link', { name: 'Create account' }).click();
    await expect(page.getByRole('heading', { name: 'Create Account' })).toBeVisible();
    await expect(page.getByLabel('Email Address')).toBeVisible();
    await expect(page.getByLabel('Password')).toBeVisible();
    await expect(page.getByLabel('Confirm Password')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Create Account' })).toBeVisible();
  });

  test('should switch to password reset form', async ({ page }) => {
    await page.getByRole('link', { name: 'Forgot your password?' }).click();
    await expect(page.getByRole('heading', { name: 'Reset Password' })).toBeVisible();
    await expect(page.getByLabel('Email Address')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Send Reset Link' })).toBeVisible();
  });

  test('should validate registration form', async ({ page }) => {
    await page.getByRole('link', { name: 'Create account' }).click();
    
    // Try to submit empty form
    await page.getByRole('button', { name: 'Create Account' }).click();
    
    // Should show validation errors
    await expect(page.getByText('Email is required')).toBeVisible();
    await expect(page.getByText('Password must be at least 8 characters')).toBeVisible();
    await expect(page.getByText('Please confirm your password')).toBeVisible();
  });

  test('should show password requirements', async ({ page }) => {
    await page.getByRole('link', { name: 'Create account' }).click();
    
    // Enter a weak password
    await page.getByLabel('Password').fill('weak');
    
    // Should show password strength indicator
    await expect(page.getByText('Weak password')).toBeVisible();
    await expect(page.getByText('At least 8 characters')).toBeVisible();
    await expect(page.getByText('At least one uppercase letter')).toBeVisible();
    await expect(page.getByText('At least one number')).toBeVisible();
    await expect(page.getByText('At least one special character')).toBeVisible();
  });

  test('should validate password confirmation', async ({ page }) => {
    await page.getByRole('link', { name: 'Create account' }).click();
    
    // Enter different passwords
    await page.getByLabel('Password').fill('StrongPass123!');
    await page.getByLabel('Confirm Password').fill('DifferentPass123!');
    
    // Try to submit
    await page.getByRole('button', { name: 'Create Account' }).click();
    
    // Should show password mismatch error
    await expect(page.getByText("Passwords don't match")).toBeVisible();
  });

  test('should successfully register a new user', async ({ page }) => {
    await page.getByRole('link', { name: 'Create account' }).click();
    
    const testEmail = `test${Date.now()}@example.com`;
    
    // Fill out registration form
    await page.getByLabel('Email Address').fill(testEmail);
    await page.getByLabel('First Name (Optional)').fill('Test');
    await page.getByLabel('Last Name (Optional)').fill('User');
    await page.getByLabel('Password').fill('StrongPass123!');
    await page.getByLabel('Confirm Password').fill('StrongPass123!');
    
    // Submit form
    await page.getByRole('button', { name: 'Create Account' }).click();
    
    // Should redirect to dashboard
    await expect(page).toHaveURL('/dashboard');
    await expect(page.getByText('Welcome to your Dashboard')).toBeVisible();
  });

  test('should handle registration with existing email', async ({ page }) => {
    await page.getByRole('link', { name: 'Create account' }).click();
    
    // Try to register with existing email
    await page.getByLabel('Email Address').fill('test@example.com');
    await page.getByLabel('Password').fill('StrongPass123!');
    await page.getByLabel('Confirm Password').fill('StrongPass123!');
    
    await page.getByRole('button', { name: 'Create Account' }).click();
    
    // Should show error
    await expect(page.getByText('User with this email already exists')).toBeVisible();
  });

  test('should successfully login existing user', async ({ page }) => {
    // Fill out login form
    await page.getByLabel('Email Address').fill('test@example.com');
    await page.getByLabel('Password').fill('StrongPass123!');
    
    // Submit form
    await page.getByRole('button', { name: 'Sign In' }).click();
    
    // Should redirect to dashboard
    await expect(page).toHaveURL('/dashboard');
    await expect(page.getByText('Welcome to your Dashboard')).toBeVisible();
  });

  test('should handle invalid login credentials', async ({ page }) => {
    // Fill out login form with invalid credentials
    await page.getByLabel('Email Address').fill('invalid@example.com');
    await page.getByLabel('Password').fill('wrongpassword');
    
    // Submit form
    await page.getByRole('button', { name: 'Sign In' }).click();
    
    // Should show error
    await expect(page.getByText('Invalid email or password')).toBeVisible();
  });

  test('should clear errors when switching between forms', async ({ page }) => {
    // First try invalid login
    await page.getByLabel('Email Address').fill('invalid@example.com');
    await page.getByLabel('Password').fill('wrongpassword');
    await page.getByRole('button', { name: 'Sign In' }).click();
    
    // Should show error
    await expect(page.getByText('Invalid email or password')).toBeVisible();
    
    // Switch to registration
    await page.getByRole('link', { name: 'Create account' }).click();
    
    // Error should be cleared
    await expect(page.getByText('Invalid email or password')).not.toBeVisible();
  });
}); 