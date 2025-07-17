import { test, expect } from '@playwright/test';

test.describe('Calculator Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/calculator');
  });

  test('should display calculator form', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Amortization Calculator' })).toBeVisible();
    await expect(page.getByLabel('Loan Amount')).toBeVisible();
    await expect(page.getByLabel('Interest Rate (%)')).toBeVisible();
    await expect(page.getByLabel('Loan Term (Years)')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Calculate' })).toBeVisible();
  });

  test('should format loan amount with commas', async ({ page }) => {
    const loanAmountInput = page.getByLabel('Loan Amount');
    
    // Type a large number
    await loanAmountInput.fill('250000');
    
    // Should format with commas on blur
    await loanAmountInput.blur();
    await expect(loanAmountInput).toHaveValue('250,000');
  });

  test('should validate form inputs', async ({ page }) => {
    // Try to submit empty form
    await page.getByRole('button', { name: 'Calculate' }).click();
    
    // Should show validation errors
    await expect(page.getByText('Loan amount is required')).toBeVisible();
    await expect(page.getByText('Interest rate is required')).toBeVisible();
    await expect(page.getByText('Loan term is required')).toBeVisible();
  });

  test('should validate loan amount minimum', async ({ page }) => {
    await page.getByLabel('Loan Amount').fill('500');
    await page.getByLabel('Interest Rate (%)').fill('3.5');
    await page.getByLabel('Loan Term (Years)').fill('30');
    
    await page.getByRole('button', { name: 'Calculate' }).click();
    
    await expect(page.getByText('Principal must be at least $1,000')).toBeVisible();
  });

  test('should validate interest rate range', async ({ page }) => {
    await page.getByLabel('Loan Amount').fill('200000');
    await page.getByLabel('Interest Rate (%)').fill('30');
    await page.getByLabel('Loan Term (Years)').fill('30');
    
    await page.getByRole('button', { name: 'Calculate' }).click();
    
    await expect(page.getByText('Interest rate cannot exceed 25%')).toBeVisible();
  });

  test('should validate loan term range', async ({ page }) => {
    await page.getByLabel('Loan Amount').fill('200000');
    await page.getByLabel('Interest Rate (%)').fill('3.5');
    await page.getByLabel('Loan Term (Years)').fill('60');
    
    await page.getByRole('button', { name: 'Calculate' }).click();
    
    await expect(page.getByText('Term cannot exceed 50 years')).toBeVisible();
  });

  test('should perform successful calculation', async ({ page }) => {
    // Fill out form with valid data
    await page.getByLabel('Loan Amount').fill('200000');
    await page.getByLabel('Interest Rate (%)').fill('3.5');
    await page.getByLabel('Loan Term (Years)').fill('30');
    
    // Submit form
    await page.getByRole('button', { name: 'Calculate' }).click();
    
    // Should show results
    await expect(page.getByText('Monthly Payment')).toBeVisible();
    await expect(page.getByText('$898.09')).toBeVisible(); // Approximate monthly payment
    
    // Should show summary
    await expect(page.getByText('Total Interest')).toBeVisible();
    await expect(page.getByText('Total Payments')).toBeVisible();
    
    // Should show amortization table
    await expect(page.getByRole('table')).toBeVisible();
    await expect(page.getByText('Payment #')).toBeVisible();
    await expect(page.getByText('Payment Amount')).toBeVisible();
    await expect(page.getByText('Principal')).toBeVisible();
    await expect(page.getByText('Interest')).toBeVisible();
    await expect(page.getByText('Remaining Balance')).toBeVisible();
  });

  test('should display amortization table with pagination', async ({ page }) => {
    // Perform calculation
    await page.getByLabel('Loan Amount').fill('200000');
    await page.getByLabel('Interest Rate (%)').fill('3.5');
    await page.getByLabel('Loan Term (Years)').fill('30');
    await page.getByRole('button', { name: 'Calculate' }).click();
    
    // Should show pagination controls
    await expect(page.getByRole('button', { name: 'Previous' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Next' })).toBeVisible();
    
    // Should show page info
    await expect(page.getByText('Page 1 of')).toBeVisible();
  });

  test('should export amortization table', async ({ page }) => {
    // Perform calculation
    await page.getByLabel('Loan Amount').fill('200000');
    await page.getByLabel('Interest Rate (%)').fill('3.5');
    await page.getByLabel('Loan Term (Years)').fill('30');
    await page.getByRole('button', { name: 'Calculate' }).click();
    
    // Click export button
    const downloadPromise = page.waitForEvent('download');
    await page.getByRole('button', { name: 'Export CSV' }).click();
    
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toMatch(/amortization.*\.csv$/);
  });

  test('should handle interest rate input correctly', async ({ page }) => {
    const interestRateInput = page.getByLabel('Interest Rate (%)');
    
    // Type a decimal number
    await interestRateInput.fill('3.5');
    
    // Should maintain the value
    await expect(interestRateInput).toHaveValue('3.5');
  });

  test('should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Should still show all form elements
    await expect(page.getByLabel('Loan Amount')).toBeVisible();
    await expect(page.getByLabel('Interest Rate (%)')).toBeVisible();
    await expect(page.getByLabel('Loan Term (Years)')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Calculate' })).toBeVisible();
    
    // Perform calculation
    await page.getByLabel('Loan Amount').fill('200000');
    await page.getByLabel('Interest Rate (%)').fill('3.5');
    await page.getByLabel('Loan Term (Years)').fill('30');
    await page.getByRole('button', { name: 'Calculate' }).click();
    
    // Should show results on mobile
    await expect(page.getByText('Monthly Payment')).toBeVisible();
    await expect(page.getByRole('table')).toBeVisible();
  });

  test('should show guest mode message', async ({ page }) => {
    await expect(page.getByText('💡 Guest mode: Calculations are performed locally')).toBeVisible();
  });

  test('should allow multiple calculations', async ({ page }) => {
    // First calculation
    await page.getByLabel('Loan Amount').fill('200000');
    await page.getByLabel('Interest Rate (%)').fill('3.5');
    await page.getByLabel('Loan Term (Years)').fill('30');
    await page.getByRole('button', { name: 'Calculate' }).click();
    
    await expect(page.getByText('$898.09')).toBeVisible();
    
    // Change values and calculate again
    await page.getByLabel('Interest Rate (%)').fill('4.0');
    await page.getByRole('button', { name: 'Calculate' }).click();
    
    // Should show new results
    await expect(page.getByText('$954.83')).toBeVisible(); // Different monthly payment
  });
}); 