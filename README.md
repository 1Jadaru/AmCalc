# AmCalc - Professional Amortization Calculator SaaS

A modern, mobile-first amortization calculator built with Next.js, TypeScript, and Tailwind CSS. Designed for individuals, small business owners, and real estate investors to model loans, organize scenarios, and make informed financial decisions.

## 🚀 Features

- **Professional Loan Calculations**: Accurate amortization tables and payment calculations
- **Project Organization**: Create and manage projects for different loan types
- **Scenario Management**: Save and compare multiple loan scenarios
- **Mobile-First Design**: Responsive interface optimized for all devices
- **User Accounts**: Secure authentication and data persistence
- **Password Requirements**: Real-time password strength validation
- **Offline Capabilities**: Basic calculations work without internet connectivity
- **Comprehensive Testing**: Multi-layered automated testing suite

## 🛠️ Technology Stack

- **Frontend**: React 18+ with Next.js 15+
- **Language**: TypeScript 5.0+
- **Styling**: Tailwind CSS 4.0+
- **State Management**: Zustand
- **Form Handling**: React Hook Form with Zod validation
- **Data Fetching**: SWR
- **Build Tool**: Next.js with Turbopack
- **Testing**: Jest + React Testing Library + Playwright
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT tokens
- **Hosting**: Render.com
- **CI/CD**: GitHub Actions with comprehensive testing

## 📋 Prerequisites

- Node.js 18+ LTS
- npm or yarn
- Git

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd AmCalc
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env.local` file in the root directory:

```env
# JWT Configuration (REQUIRED for authentication)
JWT_SECRET="your-super-secret-jwt-key-here"
JWT_REFRESH_SECRET="your-super-secret-refresh-key-here"
JWT_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="7d"

# Database Configuration
DATABASE_URL="postgresql://postgres:password@localhost:5432/amcalc"
DATABASE_URL_TEST="postgresql://postgres:password@localhost:5432/amcalc_test"
DATABASE_POOL_SIZE="10"
DATABASE_CONNECTION_TIMEOUT="30000"

# Cookie Configuration
COOKIE_SECRET="your-cookie-secret-key"
COOKIE_DOMAIN="localhost"

# Environment
NODE_ENV="development"
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

### 4. Set up the database

```bash
# Run database migrations
npx prisma migrate dev

# Seed the database (optional)
npx prisma db seed
```

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
├── components/             # React components
│   ├── ui/                # Reusable UI components
│   ├── forms/             # Form components
│   │   ├── auth/          # Authentication forms
│   │   └── calculator/    # Calculator forms
│   ├── layout/            # Layout components
│   └── features/          # Feature-specific components
│       ├── calculator/    # Calculator components
│       ├── projects/      # Project management
│       └── scenarios/     # Scenario management
├── hooks/                 # Custom React hooks
├── utils/                 # Utility functions
├── types/                 # TypeScript type definitions
├── services/              # Business logic services
├── contexts/              # React contexts
└── styles/                # Global styles

tests/
├── e2e/                   # End-to-End Tests (Playwright)
├── components/            # Component Tests
├── api/                   # API Integration Tests
└── utils/                 # Test utilities

src/test/                  # Unit Tests (Jest + RTL)
├── calculator/            # Calculator service tests
├── auth/                  # Authentication tests
└── setup.ts               # Test configuration
```

## 🧪 Testing

AmCalc includes a comprehensive testing suite with multiple layers of testing to ensure code quality and reliability.

### Testing Strategy

#### **1. Unit Tests (Jest + React Testing Library)**
- **Purpose**: Test individual functions and components in isolation
- **Coverage**: 90%+ for business logic
- **Location**: `src/test/` and `tests/components/`

```bash
# Run unit tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

#### **2. End-to-End Tests (Playwright)**
- **Purpose**: Test complete user workflows across browsers
- **Browsers**: Chrome, Firefox, Safari, Mobile Chrome, Mobile Safari
- **Location**: `tests/e2e/`

```bash
# Run all E2E tests
npm run test:e2e

# Interactive testing
npm run test:e2e:ui

# Debug mode
npm run test:e2e:debug

# Run specific test file
npm run test:e2e -- tests/e2e/auth.spec.ts
```

#### **3. Integration Tests (Jest + Supertest)**
- **Purpose**: Test API endpoints and database interactions
- **Location**: `tests/api/`

```bash
# Run API integration tests
npm run test:api
```

#### **4. Performance Tests (Lighthouse CI)**
- **Purpose**: Ensure fast loading and optimal performance

```bash
# Run performance tests
npm run test:performance
```

#### **5. Security Tests**
- **Purpose**: Identify and prevent security vulnerabilities

```bash
# Security audit
npm audit

# Automated security checks
npm run test:security
```

#### **6. Accessibility Tests**
- **Purpose**: Ensure WCAG AA compliance

```bash
# Run accessibility tests
npm run test:e2e -- --grep "accessibility"
```

### Test Commands Summary

```bash
# Run all tests
npm run test:all

# CI/CD pipeline
npm run test:ci

# View test reports
npm run test:e2e:report

# Update Playwright browsers
npx playwright install
```

### Test Coverage

- **Unit Tests**: 90%+ coverage for business logic
- **E2E Tests**: Complete user workflow testing
- **Integration Tests**: API endpoint validation
- **Performance Tests**: Lighthouse CI integration
- **Security Tests**: Automated vulnerability scanning
- **Accessibility Tests**: WCAG AA compliance

### CI/CD Pipeline

The project includes a comprehensive GitHub Actions workflow that runs:

1. **Unit Tests**: Jest + React Testing Library
2. **E2E Tests**: Playwright across multiple browsers
3. **Integration Tests**: API endpoint testing
4. **Performance Tests**: Lighthouse CI
5. **Security Tests**: npm audit

Quality gates ensure:
- 90%+ unit test coverage
- 100% E2E test pass rate
- No security vulnerabilities
- Performance score > 90

## 📦 Build and Deployment

```bash
# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint

# Format code
npm run format
```

## 🎨 Development Guidelines

### Code Quality
- TypeScript strict mode enabled
- ESLint with Next.js and TypeScript rules
- Prettier for code formatting
- Mobile-first responsive design
- Comprehensive automated testing

### Testing Standards
- Unit tests for all business logic (90%+ coverage)
- Integration tests for API endpoints
- End-to-end tests for critical workflows
- Performance testing with Lighthouse CI
- Security testing with automated scanning
- Accessibility testing for WCAG AA compliance

### Git Workflow
- Feature branches from main
- Conventional commit messages
- Code review before merging
- Automated testing on all pull requests

## 📚 Documentation

- [Product Requirements Document](./docs/prd/)
- [Technical Architecture](./docs/architecture/)
- [Development Plan](./docs/development-plan.md)
- [Business Model](./docs/business-model.md)
- [Testing Documentation](./tests/README.md)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Write tests for your feature
4. Ensure all tests pass (`npm run test:all`)
5. Commit your changes (`git commit -m 'Add some amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

### Testing Requirements for Contributions

- All new features must include unit tests
- API changes must include integration tests
- UI changes must include E2E tests
- Performance changes must include performance tests
- All tests must pass before merging

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support, email support@amcalc.com or create an issue in this repository.

## 🚀 Current Status

- ✅ **MVP Development**: Complete
- ✅ **Authentication System**: Complete with password requirements
- ✅ **Calculator Engine**: Complete with validation and formatting
- ✅ **User Interface**: Complete with responsive design
- ✅ **Testing Suite**: Complete with comprehensive automation
- 🔄 **Production Deployment**: In Progress
- ⏳ **User Acquisition**: Planned

---

**Built with ❤️ using Next.js, TypeScript, and Tailwind CSS**

**Testing with 🧪 Jest, React Testing Library, and Playwright**
