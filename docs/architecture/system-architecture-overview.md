# System Architecture Overview

## High-Level System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                             │
├─────────────────────────────────────────────────────────────────┤
│  Web Browser (React/Next.js)  │  Mobile Browser (Responsive)    │
│  Progressive Web App (PWA)    │  Offline Capabilities          │
└─────────────────────┬───────────────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────────────┐
│                      PRESENTATION LAYER                         │
├─────────────────────────────────────────────────────────────────┤
│  Next.js Pages & Components  │  API Routes (Serverless)        │
│  Tailwind CSS Styling        │  Static Generation (SSG)        │
└─────────────────────┬───────────────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────────────┐
│                      API GATEWAY LAYER                          │
├─────────────────────────────────────────────────────────────────┤
│  Express.js Server  │  Authentication Middleware               │
│  Rate Limiting      │  Request Validation                      │
│  CORS Configuration │  Error Handling                          │
└─────────────────────┬───────────────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────────────┐
│                      BUSINESS LOGIC LAYER                       │
├─────────────────────────────────────────────────────────────────┤
│  Calculator Service │  Project Management Service              │
│  User Service       │  Scenario Management Service            │
│  Validation Service │  Export/Import Service                   │
└─────────────────────┬───────────────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────────────┐
│                      DATA ACCESS LAYER                          │
├─────────────────────────────────────────────────────────────────┤
│  Prisma ORM         │  Database Migrations                     │
│  Connection Pooling │  Query Optimization                      │
│  Data Validation    │  Transaction Management                  │
└─────────────────────┬───────────────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────────────┐
│                      DATA STORAGE LAYER                         │
├─────────────────────────────────────────────────────────────────┤
│  PostgreSQL Database │  Automated Backups                      │
│  JSONB for Complex   │  Data Encryption                        │
│  Data Structures     │  Connection Pooling                     │
└─────────────────────────────────────────────────────────────────┘
```

## Component Architecture

### Frontend Component Hierarchy
```
App (Root)
├── Layout Components
│   ├── Header
│   │   ├── Navigation
│   │   ├── UserMenu
│   │   └── SearchBar
│   ├── Sidebar (Desktop)
│   │   ├── ProjectList
│   │   └── QuickActions
│   └── Footer
├── Page Components
│   ├── Dashboard
│   │   ├── RecentProjects
│   │   ├── QuickCalculator
│   │   └── Analytics
│   ├── Calculator
│   │   ├── InputForm
│   │   ├── ResultsDisplay
│   │   └── AmortizationTable
│   ├── Projects
│   │   ├── ProjectList
│   │   ├── ProjectDetail
│   │   └── ProjectForm
│   └── Scenarios
│       ├── ScenarioList
│       ├── ScenarioDetail
│       └── ScenarioComparison
└── Shared Components
    ├── UI Components
    │   ├── Button
    │   ├── Input
    │   ├── Modal
    │   └── Card
    ├── Forms
    │   ├── CalculatorForm
    │   ├── ProjectForm
    │   └── UserForm
    └── Utilities
        ├── LoadingSpinner
        ├── ErrorBoundary
        └── ToastNotifications
```

### Backend Service Architecture
```
src/
├── api/                          # API Routes & Controllers
│   ├── auth/
│   │   ├── register.ts
│   │   ├── login.ts
│   │   ├── logout.ts
│   │   └── me.ts
│   ├── calculator/
│   │   ├── amortization.ts
│   │   ├── compare.ts
│   │   └── validate.ts
│   ├── projects/
│   │   ├── index.ts
│   │   ├── [id].ts
│   │   └── [id]/scenarios.ts
│   └── scenarios/
│       ├── [id].ts
│       └── export.ts
├── services/                     # Business Logic Layer
│   ├── authService.ts
│   ├── calculatorService.ts
│   ├── projectService.ts
│   ├── scenarioService.ts
│   ├── exportService.ts
│   └── validationService.ts
├── models/                       # Data Models & Types
│   ├── User.ts
│   ├── Project.ts
│   ├── Scenario.ts
│   └── types.ts
├── middleware/                   # Express Middleware
│   ├── auth.ts
│   ├── validation.ts
│   ├── rateLimit.ts
│   ├── cors.ts
│   └── errorHandler.ts
├── utils/                        # Utility Functions
│   ├── database.ts
│   ├── logger.ts
│   ├── encryption.ts
│   └── helpers.ts
└── config/                       # Configuration
    ├── database.ts
    ├── auth.ts
    └── app.ts
``` 