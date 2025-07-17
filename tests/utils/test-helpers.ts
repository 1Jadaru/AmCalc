import { Page, expect } from '@playwright/test';

export interface TestUser {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export const TEST_USERS = {
  valid: {
    email: 'test@example.com',
    password: 'StrongPass123!',
    firstName: 'Test',
    lastName: 'User'
  },
  new: {
    email: `test${Date.now()}@example.com`,
    password: 'StrongPass123!',
    firstName: 'New',
    lastName: 'User'
  }
};

export async function createTestUser(page: Page, user: TestUser) {
  await page.goto('/auth');
  await page.getByRole('link', { name: 'Create account' }).click();
  
  await page.getByLabel('Email Address').fill(user.email);
  if (user.firstName) {
    await page.getByLabel('First Name (Optional)').fill(user.firstName);
  }
  if (user.lastName) {
    await page.getByLabel('Last Name (Optional)').fill(user.lastName);
  }
  await page.getByLabel('Password').fill(user.password);
  await page.getByLabel('Confirm Password').fill(user.password);
  
  await page.getByRole('button', { name: 'Create Account' }).click();
  
  // Wait for redirect to dashboard
  await expect(page).toHaveURL('/dashboard');
}

export async function loginUser(page: Page, user: TestUser) {
  await page.goto('/auth');
  await page.getByLabel('Email Address').fill(user.email);
  await page.getByLabel('Password').fill(user.password);
  await page.getByRole('button', { name: 'Sign In' }).click();
  
  // Wait for redirect to dashboard
  await expect(page).toHaveURL('/dashboard');
}

export async function logoutUser(page: Page) {
  await page.getByRole('button', { name: 'Sign Out' }).click();
  await expect(page).toHaveURL('/');
}

export async function performCalculation(page: Page, loanAmount: number, interestRate: number, termYears: number) {
  await page.goto('/calculator');
  
  await page.getByLabel('Loan Amount').fill(loanAmount.toString());
  await page.getByLabel('Interest Rate (%)').fill(interestRate.toString());
  await page.getByLabel('Loan Term (Years)').fill(termYears.toString());
  
  await page.getByRole('button', { name: 'Calculate' }).click();
  
  // Wait for results to appear
  await expect(page.getByText('Monthly Payment')).toBeVisible();
}

export async function expectToBeOnPage(page: Page, path: string) {
  await expect(page).toHaveURL(path);
}

export async function expectElementToBeVisible(page: Page, selector: string) {
  await expect(page.locator(selector)).toBeVisible();
}

export async function expectElementToHaveText(page: Page, selector: string, text: string) {
  await expect(page.locator(selector)).toHaveText(text);
}

export async function fillFormField(page: Page, label: string, value: string) {
  await page.getByLabel(label).fill(value);
}

export async function clickButton(page: Page, name: string) {
  await page.getByRole('button', { name }).click();
}

export async function clickLink(page: Page, name: string) {
  await page.getByRole('link', { name }).click();
}

export async function setMobileViewport(page: Page) {
  await page.setViewportSize({ width: 375, height: 667 });
}

export async function setDesktopViewport(page: Page) {
  await page.setViewportSize({ width: 1280, height: 720 });
}

export async function waitForPageLoad(page: Page) {
  await page.waitForLoadState('networkidle');
}

export async function takeScreenshot(page: Page, name: string) {
  await page.screenshot({ path: `test-results/${name}.png` });
}

export async function expectValidationError(page: Page, errorText: string) {
  await expect(page.getByText(errorText)).toBeVisible();
}

export async function expectSuccessMessage(page: Page, message: string) {
  await expect(page.getByText(message)).toBeVisible();
}

export async function expectElementToBeDisabled(page: Page, selector: string) {
  await expect(page.locator(selector)).toBeDisabled();
}

export async function expectElementToBeEnabled(page: Page, selector: string) {
  await expect(page.locator(selector)).toBeEnabled();
}

export async function expectInputToHaveValue(page: Page, label: string, value: string) {
  await expect(page.getByLabel(label)).toHaveValue(value);
}

export async function expectTableToHaveRows(page: Page, expectedRows: number) {
  const rows = page.locator('table tbody tr');
  await expect(rows).toHaveCount(expectedRows);
}

export async function expectPaginationInfo(page: Page, currentPage: number, totalPages: number) {
  await expect(page.getByText(`Page ${currentPage} of ${totalPages}`)).toBeVisible();
}

export async function navigateToPage(page: Page, path: string) {
  await page.goto(path);
}

export async function expectPageTitle(page: Page, title: string) {
  await expect(page.getByRole('heading', { name: title })).toBeVisible();
}

export async function expectNavigationLink(page: Page, name: string) {
  await expect(page.getByRole('link', { name })).toBeVisible();
}

export async function expectButtonToBeVisible(page: Page, name: string) {
  await expect(page.getByRole('button', { name })).toBeVisible();
}

export async function expectFormFieldToBeVisible(page: Page, label: string) {
  await expect(page.getByLabel(label)).toBeVisible();
}

export async function clearFormField(page: Page, label: string) {
  await page.getByLabel(label).clear();
}

export async function typeInFormField(page: Page, label: string, value: string) {
  await page.getByLabel(label).type(value);
}

export async function expectElementToContainText(page: Page, selector: string, text: string) {
  await expect(page.locator(selector)).toContainText(text);
}

export async function expectElementNotToBeVisible(page: Page, selector: string) {
  await expect(page.locator(selector)).not.toBeVisible();
}

export async function expectElementNotToContainText(page: Page, selector: string, text: string) {
  await expect(page.locator(selector)).not.toContainText(text);
} 