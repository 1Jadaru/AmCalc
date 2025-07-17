# AmCalc Testing Strategy

This document outlines the comprehensive testing strategy for the AmCalc application, including unit tests, integration tests, end-to-end tests, and automated CI/CD testing.

## 🧪 Testing Overview

AmCalc uses a multi-layered testing approach to ensure code quality, functionality, and user experience:

### **1. Unit Tests (Jest + React Testing Library)**
- **Location**: `src/test/` and `tests/components/`
- **Purpose**: Test individual components, functions, and business logic
- **Coverage**: 90%+ target for business logic
- **Framework**: Jest with React Testing Library

### **2. End-to-End Tests (Playwright)**
- **Location**: `tests/e2e/`
- **Purpose**: Test complete user workflows and UI interactions
- **Browsers**: Chrome, Firefox, Safari, Mobile Chrome, Mobile Safari
- **Framework**: Playwright

### **3. Integration Tests**
- **Location**: `tests/api/`
- **Purpose**: Test API endpoints and database interactions
- **Framework**: Jest + Supertest

### **4. Performance Tests**
- **Purpose**: Monitor application performance and loading times
- **Tools**: Lighthouse CI, Playwright performance monitoring

### **5. Security Tests**
- **Purpose**: Vulnerability scanning and dependency audits
- **Tools**: npm audit, audit-ci

### **6. Accessibility Tests**
- **Purpose**: Ensure WCAG AA compliance
- **Tools**: Playwright with accessibility testing

## 🚀 Quick Start

### Prerequisites
```bash
# Install dependencies
npm install

# Install Playwright browsers
npx playwright install
```

### Running Tests

#### **All Tests**
```bash
npm run test:all
```

#### **Unit Tests Only**
```bash
# Run unit tests
npm run test

# Run with coverage
npm run test:coverage

# Watch mode
npm run test:watch
```

#### **End-to-End Tests Only**
```bash
# Run all E2E tests
npm run test:e2e

# Run with UI (interactive)
npm run test:e2e:ui

# Run in headed mode (see browser)
npm run test:e2e:headed

# Debug mode
npm run test:e2e:debug

# View test report
npm run test:e2e:report
```

#### **Specific Test Suites**
```bash
# Run only authentication tests
npx playwright test auth.spec.ts

# Run only calculator tests
npx playwright test calculator.spec.ts

# Run tests matching a pattern
npx playwright test --grep "login"

# Run tests in specific browser
npx playwright test --project=chromium
```

## 📁 Test Structure

```
tests/
├── e2e/                    # End-to-end tests
│   ├── auth.spec.ts       # Authentication flow tests
│   ├── calculator.spec.ts # Calculator functionality tests
│   └── navigation.spec.ts # Navigation and layout tests
├── components/            # Component unit tests
├── api/                   # API integration tests
├── utils/                 # Test utilities and helpers
│   └── test-helpers.ts   # Common test functions
└── README.md             # This file
```

## 🎯 Test Categories

### **Authentication Tests**
- User registration with validation
- Login/logout functionality
- Password reset flow
- Form validation and error handling
- Password strength requirements
- Session management

### **Calculator Tests**
- Form input validation
- Calculation accuracy
- Amortization table generation
- Export functionality
- Responsive design
- Input formatting (commas, decimals)

### **Navigation Tests**
- Route protection
- Responsive navigation
- 404 handling
- Authentication-based redirects
- Cross-browser compatibility

### **Performance Tests**
- Page load times
- Calculation performance
- Memory usage
- Lighthouse scores
- Core Web Vitals

## 🛠 Test Utilities

### **Common Test Functions**
```typescript
import { 
  createTestUser, 
  loginUser, 
  logoutUser, 
  performCalculation,
  expectToBeOnPage,
  expectValidationError 
} from '../utils/test-helpers';

// Example usage
test('should register new user', async ({ page }) => {
  await createTestUser(page, TEST_USERS.new);
  await expectToBeOnPage(page, '/dashboard');
});
```

### **Test Data**
```typescript
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
```

## 🔧 Configuration

### **Playwright Configuration**
- **File**: `playwright.config.ts`
- **Browsers**: Chrome, Firefox, Safari, Mobile Chrome, Mobile Safari
- **Base URL**: `http://localhost:3000`
- **Screenshots**: On failure
- **Videos**: On failure
- **Traces**: On retry

### **Jest Configuration**
- **File**: `jest.config.js`
- **Environment**: jsdom
- **Coverage**: HTML, JSON, LCOV
- **Setup**: `src/test/setup.ts`

### **CI/CD Configuration**
- **File**: `.github/workflows/test.yml`
- **Triggers**: Push to main/develop, Pull Requests
- **Jobs**: Unit tests, E2E tests, Security tests, Performance tests, Accessibility tests

## 📊 Test Reports

### **Coverage Reports**
- **Location**: `coverage/`
- **Format**: HTML, JSON, LCOV
- **Target**: 90%+ for business logic

### **Playwright Reports**
- **Location**: `playwright-report/`
- **Features**: Screenshots, videos, traces, test results
- **Access**: `npm run test:e2e:report`

### **CI Reports**
- **GitHub Actions**: Automatic test summaries
- **Artifacts**: Test results, screenshots, videos
- **Codecov**: Coverage tracking

## 🎨 Best Practices

### **Writing Tests**
1. **Use descriptive test names** that explain the expected behavior
2. **Follow AAA pattern**: Arrange, Act, Assert
3. **Test user behavior**, not implementation details
4. **Use data-testid attributes** for reliable element selection
5. **Keep tests independent** and isolated
6. **Use page object pattern** for complex workflows

### **Test Organization**
```typescript
test.describe('Feature Name', () => {
  test.beforeEach(async ({ page }) => {
    // Setup code
  });

  test('should do something specific', async ({ page }) => {
    // Test implementation
  });
});
```

### **Element Selection**
```typescript
// ✅ Good - Use semantic selectors
await page.getByRole('button', { name: 'Calculate' }).click();
await page.getByLabel('Email Address').fill('test@example.com');

// ❌ Avoid - Fragile selectors
await page.locator('.btn-calc').click();
await page.locator('#email').fill('test@example.com');
```

### **Assertions**
```typescript
// ✅ Good - Specific assertions
await expect(page.getByText('Monthly Payment')).toBeVisible();
await expect(page).toHaveURL('/dashboard');

// ❌ Avoid - Generic assertions
await expect(page.locator('body')).toContainText('success');
```

## 🚨 Troubleshooting

### **Common Issues**

#### **Tests Failing Intermittently**
- Add explicit waits for network requests
- Use `page.waitForLoadState('networkidle')`
- Increase timeout for slow operations

#### **Element Not Found**
- Check if element is in viewport
- Wait for element to be visible
- Use more specific selectors

#### **Database Issues**
- Ensure test database is properly seeded
- Use unique test data
- Clean up after tests

#### **Browser Issues**
- Update Playwright browsers: `npx playwright install`
- Check browser compatibility
- Use specific browser for debugging

### **Debug Mode**
```bash
# Run tests in debug mode
npm run test:e2e:debug

# Run specific test in debug mode
npx playwright test auth.spec.ts --debug
```

## 📈 Continuous Integration

### **GitHub Actions**
- **Automatic testing** on push and pull requests
- **Parallel execution** for faster feedback
- **Artifact storage** for test results
- **Status checks** for deployment gates

### **Test Environments**
- **Unit Tests**: Node.js with jsdom
- **E2E Tests**: Ubuntu with PostgreSQL
- **Performance Tests**: Lighthouse CI
- **Security Tests**: npm audit

### **Quality Gates**
- **Unit Test Coverage**: 90%+
- **E2E Test Pass Rate**: 100%
- **Security Audit**: No high/critical vulnerabilities
- **Performance**: Lighthouse score > 90

## 🔄 Maintenance

### **Regular Tasks**
1. **Update dependencies** and test frameworks
2. **Review test coverage** and add missing tests
3. **Refactor flaky tests** and improve reliability
4. **Update test data** for new features
5. **Monitor CI performance** and optimize

### **Adding New Tests**
1. **Identify test category** (unit, e2e, integration)
2. **Create test file** in appropriate directory
3. **Write test cases** following best practices
4. **Add to CI pipeline** if needed
5. **Update documentation** and examples

## 📚 Resources

- [Playwright Documentation](https://playwright.dev/)
- [Jest Documentation](https://jestjs.io/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

## 🤝 Contributing

When adding new features or fixing bugs:

1. **Write tests first** (TDD approach)
2. **Ensure all tests pass** locally
3. **Update test documentation** if needed
4. **Add new test utilities** for common patterns
5. **Review test coverage** and add missing cases

---

**Remember**: Good tests are an investment in code quality and developer productivity. They provide confidence in changes and help catch regressions early. 