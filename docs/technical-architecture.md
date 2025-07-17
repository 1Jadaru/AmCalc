# AmCalc Technical Architecture

## System Overview

AmCalc is a modern, mobile-first SaaS application built with React/Next.js frontend and Node.js backend, designed to provide professional amortization calculation services with enterprise-level reliability and performance.

## Architecture Principles

### Core Principles
- **Mobile-First**: Responsive design optimized for mobile devices
- **Performance**: Fast loading and calculation speeds
- **Scalability**: Architecture that can grow with user base
- **Security**: Enterprise-level security and data protection
- **Reliability**: High availability and error handling
- **Cost-Effective**: Efficient resource utilization for solo developer
- **Quality**: Comprehensive automated testing and validation

### Design Patterns
- **Client-Server Architecture**: Separation of concerns between frontend and backend
- **RESTful API**: Standard HTTP-based communication
- **Component-Based UI**: Reusable React components
- **Database-First**: PostgreSQL for data persistence
- **Progressive Enhancement**: Core functionality works without JavaScript
- **Test-Driven Development**: Comprehensive testing at all levels

## Technology Stack

### Frontend
- **Framework**: React 18+ with Next.js 14+
- **Language**: TypeScript for type safety
- **Styling**: Tailwind CSS for responsive design
- **State Management**: React Context API / Zustand
- **Build Tool**: Next.js built-in bundler
- **Testing**: Jest + React Testing Library + Playwright

### Backend
- **Runtime**: Node.js 18+ LTS
- **Framework**: Express.js for API development
- **Language**: TypeScript for type safety
- **Authentication**: JWT tokens with secure sessions
- **Validation**: Joi or Zod for input validation
- **Testing**: Jest + Supertest

### Database
- **Primary Database**: PostgreSQL 15+
- **ORM**: Prisma for type-safe database access
- **Migrations**: Prisma migrations for schema management
- **Connection Pooling**: Built-in PostgreSQL connection pooling

### Infrastructure
- **Hosting**: Render.com (cost-effective option)
- **Database Hosting**: Render PostgreSQL service
- **CDN**: Vercel Edge Network (if using Vercel) or Cloudflare
- **Monitoring**: Built-in Render monitoring + custom logging

### Development Tools
- **IDE**: Cursor with AI assistance
- **Version Control**: GitHub
- **CI/CD**: GitHub Actions with comprehensive testing
- **Code Quality**: ESLint, Prettier, Husky
- **Documentation**: JSDoc, README files

### Testing Stack ✅ COMPLETE
- **Unit Testing**: Jest + React Testing Library
- **E2E Testing**: Playwright (Chrome, Firefox, Safari, Mobile)
- **Integration Testing**: Jest + Supertest
- **Performance Testing**: Lighthouse CI
- **Security Testing**: npm audit, audit-ci
- **Accessibility Testing**: Playwright accessibility features
- **CI/CD**: GitHub Actions with parallel test execution

## System Architecture

### High-Level Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Client (Web)  │    │   Client (Mobile)│    │   Client (Tablet)│
│   React/Next.js │    │   Responsive UI  │    │   Responsive UI  │
└─────────┬───────┘    └─────────┬───────┘    └─────────┬───────┘
          │                      │                      │
          └──────────────────────┼──────────────────────┘
                                 │
                    ┌─────────────▼─────────────┐
                    │      CDN/Edge Network     │
                    │    (Vercel/Render)        │
                    └─────────────┬─────────────┘
                                 │
                    ┌─────────────▼─────────────┐
                    │    Next.js API Routes     │
                    │    (Serverless Functions) │
                    └─────────────┬─────────────┘
                                 │
                    ┌─────────────▼─────────────┐
                    │    Express.js Backend     │
                    │    (API + Business Logic) │
                    └─────────────┬─────────────┘
                                 │
                    ┌─────────────▼─────────────┐
                    │      PostgreSQL DB        │
                    │    (Data Persistence)     │
                    └───────────────────────────┘
```

### Testing Architecture ✅ COMPLETE

```
┌─────────────────────────────────────────────────────────────────┐
│                    Testing Pyramid                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              E2E Tests (Playwright)                     │   │
│  │  • Authentication flows                                 │   │
│  │  • Calculator functionality                             │   │
│  │  • Navigation and layout                                │   │
│  │  • Cross-browser compatibility                          │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │           Integration Tests (Jest + Supertest)         │   │
│  │  • API endpoint testing                                 │   │
│  │  • Database integration                                 │   │
│  │  • Authentication flows                                 │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              Unit Tests (Jest + RTL)                   │   │
│  │  • Business logic (CalculatorService)                  │   │
│  │  • React components                                     │   │
│  │  • Utility functions                                    │   │
│  │  • Validation schemas                                   │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### CI/CD Pipeline Architecture ✅ COMPLETE

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Code Push     │───▶│  GitHub Actions │───▶│   Test Results  │
│   (Main/PR)     │    │                 │    │                 │
└─────────────────┘    └─────────┬───────┘    └─────────────────┘
                                 │
                    ┌─────────────▼─────────────┐
                    │    Parallel Test Jobs     │
                    │                           │
                    │  ┌─────────────────────┐  │
                    │  │   Unit Tests        │  │
                    │  │   (Jest + RTL)      │  │
                    │  └─────────────────────┘  │
                    │                           │
                    │  ┌─────────────────────┐  │
                    │  │   E2E Tests         │  │
                    │  │   (Playwright)      │  │
                    │  └─────────────────────┘  │
                    │                           │
                    │  ┌─────────────────────┐  │
                    │  │   Integration Tests │  │
                    │  │   (Jest + Supertest)│  │
                    │  └─────────────────────┘  │
                    │                           │
                    │  ┌─────────────────────┐  │
                    │  │   Performance Tests │  │
                    │  │   (Lighthouse CI)   │  │
                    │  └─────────────────────┘  │
                    │                           │
                    │  ┌─────────────────────┐  │
                    │  │   Security Tests    │  │
                    │  │   (npm audit)       │  │
                    │  └─────────────────────┘  │
                    └─────────────┬─────────────┘
                                 │
                    ┌─────────────▼─────────────┐
                    │    Quality Gates          │
                    │                           │
                    │  • 90%+ Unit Coverage     │
                    │  • 100% E2E Pass Rate     │
                    │  • No Security Issues     │
                    │  • Performance > 90       │
                    └─────────────┬─────────────┘
                                 │
                    ┌─────────────▼─────────────┐
                    │    Deployment             │
                    │    (Render.com)           │
                    └───────────────────────────┘
```

## Component Architecture

### Frontend Components ✅ COMPLETE
```
src/
├── components/
│   ├── ui/                    # Reusable UI components ✅
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Card.tsx
│   │   ├── Modal.tsx
│   │   └── SaveToProjectModal.tsx  # Project save modal ✅
│   ├── forms/                 # Form components ✅
│   │   ├── auth/              # Authentication forms ✅
│   │   │   ├── LoginForm.tsx
│   │   │   ├── RegisterForm.tsx
│   │   │   └── PasswordResetForm.tsx
│   │   └── calculator/        # Calculator forms ✅
│   │       └── CalculatorForm.tsx
│   ├── layout/                # Layout components ✅
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── Navigation.tsx
│   └── features/              # Feature-specific components ✅
│       ├── calculator/
│       │   ├── CalculatorForm.tsx
│       │   ├── AmortizationTable.tsx
│       │   └── ResultsDisplay.tsx
│       ├── projects/
│       └── scenarios/
├── app/                       # Next.js App Router ✅
│   ├── page.tsx               # Home page ✅
│   ├── calculator/            # Calculator page ✅
│   ├── auth/                  # Authentication pages ✅
│   ├── dashboard/             # User dashboard ✅
│   ├── projects/              # Projects page ✅
│   ├── projects/[id]/         # Project detail page ✅
│   └── api/                   # API routes ✅
├── hooks/                     # Custom React hooks ✅
├── utils/                     # Utility functions ✅
├── types/                     # TypeScript definitions ✅
├── services/                  # Business logic services ✅
├── contexts/                  # React contexts ✅
└── styles/                    # Global styles ✅
```

### Backend Structure ✅ COMPLETE
```
src/
├── app/api/                   # API routes ✅
│   ├── auth/                  # Authentication endpoints ✅
│   │   ├── register/          # User registration ✅
│   │   ├── login/             # User login ✅
│   │   ├── logout/            # User logout ✅
│   │   ├── me/                # Get current user ✅
│   │   └── reset-password/    # Password reset ✅
│   ├── projects/              # Project management ✅
│   │   ├── route.ts           # GET, POST projects ✅
│   │   └── [id]/              # Project CRUD operations ✅
│   │       ├── route.ts       # GET, PUT, DELETE project ✅
│   │       └── calculations/  # Save calculations ✅
│   │           └── route.ts   # POST calculations ✅
│   ├── scenarios/             # Scenario management ✅
│   │   └── [id]/              # Scenario operations ✅
│   │       └── route.ts       # DELETE scenarios ✅
│   └── calculator/            # Calculation endpoints ✅
│       └── amortization/      # Amortization calculation ✅
├── services/                  # Business logic ✅
│   ├── auth.service.ts        # Authentication service ✅
│   ├── calculator.service.ts  # Calculator service ✅
│   ├── project.service.ts     # Project service ✅
│   └── scenario.service.ts    # Scenario service ✅
├── middleware/                # Express middleware ✅
│   ├── auth.middleware.ts     # Authentication middleware ✅
│   └── validation.ts          # Input validation ✅
├── utils/                     # Utility functions ✅
├── types/                     # TypeScript types ✅
└── contexts/                  # React contexts ✅
```

### Testing Structure ✅ COMPLETE
```
tests/
├── e2e/                       # End-to-End Tests ✅
│   ├── auth.spec.ts           # Authentication flows ✅
│   ├── calculator.spec.ts     # Calculator functionality ✅
│   ├── navigation.spec.ts     # Navigation and layout ✅
│   └── utils/
│       └── test-helpers.ts    # E2E test utilities ✅
├── components/                # Component Tests ✅
│   ├── calculator.test.tsx    # Calculator component tests ✅
│   └── auth.test.tsx          # Auth component tests ✅
├── api/                       # API Integration Tests ✅
│   ├── auth.test.ts           # Auth API tests ✅
│   └── calculator.test.ts     # Calculator API tests ✅
└── setup.ts                   # Test configuration ✅

src/test/                      # Unit Tests ✅
├── calculator/
│   ├── calculator.service.test.ts # Calculator service tests ✅
│   └── components.test.tsx    # Component unit tests ✅
├── auth/
│   ├── auth.test.ts           # Auth service tests ✅
│   └── security.test.ts       # Security tests ✅
└── setup.ts                   # Unit test setup ✅
```

## API Architecture ✅ COMPLETE

### RESTful API Endpoints

#### **Authentication Endpoints**
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user
- `POST /api/auth/reset-password` - Password reset

#### **Project Management Endpoints**
- `GET /api/projects` - List user's projects
- `POST /api/projects` - Create new project
- `GET /api/projects/[id]` - Get project with scenarios
- `PUT /api/projects/[id]` - Update project details
- `DELETE /api/projects/[id]` - Delete project and all scenarios

#### **Scenario Management Endpoints**
- `POST /api/projects/[id]/calculations` - Save calculation to project
- `DELETE /api/scenarios/[id]` - Delete individual scenario

#### **Calculator Endpoints**
- `POST /api/calculator/amortization` - Calculate amortization schedule

### API Response Format
```typescript
// Success Response
{
  "success": true,
  "data": { ... },
  "message": "Operation completed successfully"
}

// Error Response
{
  "success": false,
  "error": "Error message",
  "details": "Additional error details"
}
```

### Authentication Flow
1. **Registration**: User creates account with email/password
2. **Login**: User authenticates and receives JWT token
3. **Authorization**: JWT token validated on protected routes
4. **Session Management**: Token refresh and logout handling

## Data Model

### Database Schema ✅ COMPLETE

#### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  is_active BOOLEAN DEFAULT true,
  email_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### User Sessions Table
```sql
CREATE TABLE user_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  token_hash VARCHAR(255) NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Projects Table
```sql
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Scenarios Table ✅ UPDATED
```sql
CREATE TABLE scenarios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  principal DECIMAL(15,2) NOT NULL,
  interest_rate DECIMAL(5,4) NOT NULL,
  term_years INTEGER NOT NULL,
  payment_frequency VARCHAR(50) NOT NULL DEFAULT 'monthly',
  payment_amount DECIMAL(15,2),
  total_interest DECIMAL(15,2),
  total_payments DECIMAL(15,2),
  amortization_schedule JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Data Relationships
- **User** → **Projects** (One-to-Many)
- **Project** → **Scenarios** (One-to-Many)
- **User** → **Scenarios** (One-to-Many through Projects)

### Data Validation ✅ COMPLETE
- **Interest Rate**: Stored as decimal (0.0525 for 5.25%)
- **Payment Frequency**: All supported frequencies (monthly, biweekly, weekly, quarterly, semiannually, annually)
- **Principal Amount**: Decimal precision for accurate calculations
- **Term Years**: Integer validation
- **Cascade Deletes**: Automatic cleanup of related data

## Testing Strategy ✅ COMPLETE

### Testing Levels

#### **1. Unit Tests (Jest + React Testing Library)**
- **Purpose**: Test individual functions and components in isolation
- **Coverage**: 90%+ for business logic
- **Location**: `src/test/` and `tests/components/`
- **Examples**:
  - Calculator service mathematical accuracy
  - React component rendering and interactions
  - Utility function validation
  - Type validation with Zod schemas

#### **2. Integration Tests (Jest + Supertest)**
- **Purpose**: Test API endpoints and database interactions
- **Location**: `tests/api/`
- **Examples**:
  - Authentication API endpoints
  - Calculator API functionality
  - Database CRUD operations
  - Error handling scenarios

#### **3. End-to-End Tests (Playwright)**
- **Purpose**: Test complete user workflows across browsers
- **Browsers**: Chrome, Firefox, Safari, Mobile Chrome, Mobile Safari
- **Location**: `tests/e2e/`
- **Examples**:
  - Complete user registration and login flow
  - Calculator form submission and results display
  - Navigation between pages
  - Responsive design validation

#### **4. Performance Tests (Lighthouse CI)**
- **Purpose**: Ensure fast loading and optimal performance
- **Tools**: Lighthouse CI, Playwright performance monitoring
- **Metrics**: Core Web Vitals, Page load times, Performance scores

#### **5. Security Tests**
- **Purpose**: Identify and prevent security vulnerabilities
- **Tools**: npm audit, audit-ci
- **Checks**: Dependency vulnerabilities, code security issues

#### **6. Accessibility Tests**
- **Purpose**: Ensure WCAG AA compliance
- **Tools**: Playwright accessibility features
- **Checks**: Screen reader compatibility, keyboard navigation, color contrast

### CI/CD Pipeline ✅ COMPLETE

#### **GitHub Actions Workflow**
```yaml
# .github/workflows/test.yml
name: Test Suite
on: [push, pull_request]
jobs:
  unit-tests:
    # Unit tests with coverage
  e2e-tests:
    # E2E tests across browsers
  integration-tests:
    # API integration tests
  performance-tests:
    # Lighthouse CI tests
  security-tests:
    # Security vulnerability scanning
```

#### **Quality Gates**
- **Unit Test Coverage**: 90%+
- **E2E Test Pass Rate**: 100%
- **Security Audit**: No high/critical vulnerabilities
- **Performance**: Lighthouse score > 90
- **Accessibility**: WCAG AA compliance

#### **Test Commands**
```bash
npm run test:all          # Run all tests
npm run test              # Unit tests only
npm run test:coverage     # Unit tests with coverage
npm run test:e2e          # E2E tests only
npm run test:e2e:ui       # Interactive E2E testing
npm run test:ci           # CI/CD pipeline
```

## Security Architecture

### Authentication & Authorization
- **JWT Tokens**: Secure session management
- **Password Hashing**: bcrypt with salt rounds
- **Input Validation**: Zod schemas for all inputs
- **Rate Limiting**: API endpoint protection
- **CORS**: Cross-origin request handling

### Data Protection
- **HTTPS**: Secure communication
- **Environment Variables**: Sensitive data protection
- **SQL Injection Prevention**: Parameterized queries with Prisma
- **XSS Prevention**: Input sanitization and output encoding

### Security Testing ✅ COMPLETE
- **Automated Scanning**: npm audit integration
- **Dependency Monitoring**: Regular security updates
- **Code Analysis**: Static analysis tools
- **Penetration Testing**: Automated security tests

## Performance Architecture

### Frontend Optimization
- **Code Splitting**: Dynamic imports for route-based splitting
- **Image Optimization**: Next.js built-in image optimization
- **Caching**: Browser and CDN caching strategies
- **Bundle Analysis**: Webpack bundle analyzer

### Backend Optimization
- **Database Indexing**: Optimized query performance
- **Connection Pooling**: Efficient database connections
- **Caching**: Redis for session and data caching
- **Compression**: Gzip compression for responses

### Performance Testing ✅ COMPLETE
- **Lighthouse CI**: Automated performance monitoring
- **Load Testing**: Simulated user load testing
- **Bundle Analysis**: Regular bundle size monitoring
- **Core Web Vitals**: Continuous performance tracking

## Deployment Architecture

### Development Environment
- **Local Setup**: Docker Compose for consistency
- **Database**: Local PostgreSQL instance
- **Hot Reloading**: Fast development iteration
- **Environment Variables**: Secure configuration

### Production Environment
- **Hosting**: Render.com deployment
- **Database**: Render PostgreSQL service
- **Domain**: Custom domain with SSL
- **Monitoring**: Application and error tracking

### CI/CD Pipeline ✅ COMPLETE
```
GitHub Push → GitHub Actions → Build & Test → Deploy to Render
```

## Monitoring & Observability

### Application Monitoring
- **Error Tracking**: Sentry integration
- **Performance Monitoring**: Real User Monitoring (RUM)
- **Logging**: Structured logging with Winston
- **Health Checks**: Application health endpoints

### Testing Monitoring ✅ COMPLETE
- **Test Results**: Automated test reporting
- **Coverage Reports**: Code coverage tracking
- **Performance Metrics**: Continuous performance testing
- **Security Alerts**: Automated security notifications

## Risk Management

### Technical Risks
- **Timeline Pressure**: Mitigated by flexible approach ✅
- **Complexity Overrun**: MVP focus with iterative enhancement ✅
- **Performance Issues**: Continuous monitoring and optimization ✅
- **Security Vulnerabilities**: Regular security audits ✅
- **Data Integrity**: Addressed with comprehensive validation ✅

### Mitigation Strategies
- **Scope Management**: Clear MVP definition and prioritization ✅
- **Quality Focus**: Comprehensive testing and validation ✅
- **Documentation**: Clear technical and process documentation ✅
- **Iterative Development**: Rapid feedback and improvement cycles ✅
- **Error Handling**: Robust validation and user feedback ✅

---

*This technical architecture document reflects the complete implementation including comprehensive testing infrastructure and full CRUD operations for project and scenario management.* 