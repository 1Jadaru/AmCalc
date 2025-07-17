import { test, expect } from '@playwright/test';

test.describe('Navigation and Layout', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display landing page with navigation', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'AmCalc' })).toBeVisible();
    await expect(page.getByRole('navigation')).toBeVisible();
    
    // Should show main navigation links
    await expect(page.getByRole('link', { name: 'Calculator' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Sign In' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Create Account' })).toBeVisible();
  });

  test('should navigate to calculator page', async ({ page }) => {
    await page.getByRole('link', { name: 'Calculator' }).click();
    await expect(page).toHaveURL('/calculator');
    await expect(page.getByRole('heading', { name: 'Amortization Calculator' })).toBeVisible();
  });

  test('should navigate to auth page', async ({ page }) => {
    await page.getByRole('link', { name: 'Sign In' }).click();
    await expect(page).toHaveURL('/auth');
    await expect(page.getByRole('heading', { name: 'Sign In' })).toBeVisible();
  });

  test('should navigate to registration from landing page', async ({ page }) => {
    await page.getByRole('link', { name: 'Create Account' }).click();
    await expect(page).toHaveURL('/auth');
    await expect(page.getByRole('heading', { name: 'Create Account' })).toBeVisible();
  });

  test('should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Should still show navigation
    await expect(page.getByRole('navigation')).toBeVisible();
    await expect(page.getByRole('link', { name: 'Calculator' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Sign In' })).toBeVisible();
  });

  test('should redirect authenticated users from auth page', async ({ page }) => {
    // First login
    await page.goto('/auth');
    await page.getByLabel('Email Address').fill('test@example.com');
    await page.getByLabel('Password').fill('StrongPass123!');
    await page.getByRole('button', { name: 'Sign In' }).click();
    
    // Should redirect to dashboard
    await expect(page).toHaveURL('/dashboard');
    
    // Try to access auth page again
    await page.goto('/auth');
    
    // Should show "already logged in" message
    await expect(page.getByText('You are already logged in.')).toBeVisible();
  });

  test('should show authenticated navigation after login', async ({ page }) => {
    // Login
    await page.goto('/auth');
    await page.getByLabel('Email Address').fill('test@example.com');
    await page.getByLabel('Password').fill('StrongPass123!');
    await page.getByRole('button', { name: 'Sign In' }).click();
    
    // Should show authenticated navigation
    await expect(page.getByRole('link', { name: 'Dashboard' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Calculator' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Settings' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Sign Out' })).toBeVisible();
  });

  test('should logout successfully', async ({ page }) => {
    // Login first
    await page.goto('/auth');
    await page.getByLabel('Email Address').fill('test@example.com');
    await page.getByLabel('Password').fill('StrongPass123!');
    await page.getByRole('button', { name: 'Sign In' }).click();
    
    // Should be on dashboard
    await expect(page).toHaveURL('/dashboard');
    
    // Logout
    await page.getByRole('button', { name: 'Sign Out' }).click();
    
    // Should redirect to home page
    await expect(page).toHaveURL('/');
    
    // Should show unauthenticated navigation
    await expect(page.getByRole('link', { name: 'Sign In' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Create Account' })).toBeVisible();
  });

  test('should protect dashboard route', async ({ page }) => {
    // Try to access dashboard without authentication
    await page.goto('/dashboard');
    
    // Should redirect to auth page
    await expect(page).toHaveURL('/auth');
  });

  test('should protect settings route', async ({ page }) => {
    // Try to access settings without authentication
    await page.goto('/settings');
    
    // Should redirect to auth page
    await expect(page).toHaveURL('/auth');
  });

  test('should allow access to calculator without authentication', async ({ page }) => {
    // Calculator should be accessible without login
    await page.goto('/calculator');
    await expect(page).toHaveURL('/calculator');
    await expect(page.getByRole('heading', { name: 'Amortization Calculator' })).toBeVisible();
  });

  test('should show footer on all pages', async ({ page }) => {
    // Check landing page
    await expect(page.getByText('© 2024 AmCalc. All rights reserved.')).toBeVisible();
    
    // Check calculator page
    await page.goto('/calculator');
    await expect(page.getByText('© 2024 AmCalc. All rights reserved.')).toBeVisible();
    
    // Check auth page
    await page.goto('/auth');
    await expect(page.getByText('© 2024 AmCalc. All rights reserved.')).toBeVisible();
  });

  test('should handle 404 pages gracefully', async ({ page }) => {
    await page.goto('/nonexistent-page');
    
    // Should show 404 page
    await expect(page.getByRole('heading', { name: 'Page Not Found' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Go Home' })).toBeVisible();
  });

  test('should navigate back to home from 404', async ({ page }) => {
    await page.goto('/nonexistent-page');
    await page.getByRole('link', { name: 'Go Home' }).click();
    await expect(page).toHaveURL('/');
  });
}); 