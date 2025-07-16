# AmCalc Architecture Document
*BMad-Method Technical Architecture Specification*

## Document Information
- **Document Type**: Technical Architecture
- **Version**: 1.0
- **Created**: 2024
- **Last Updated**: 2024
- **Status**: Draft
- **Owner**: Architect Agent
- **Stakeholders**: Developer, Product Manager, UX Expert

## Executive Summary

AmCalc is a professional enterprise-level amortization calculator SaaS built with a modern, scalable architecture. The system follows a microservices-inspired approach with clear separation of concerns, ensuring maintainability, performance, and security for a solo developer while supporting future growth.

### Key Architecture Decisions
- **Frontend**: React 18+ with Next.js 14+ for SSR/SSG capabilities
- **Backend**: Node.js with Express.js for API development
- **Database**: PostgreSQL with Prisma ORM for type safety
- **Hosting**: Render.com for cost-effective deployment
- **Architecture Pattern**: Monolithic with clear module boundaries

## System Architecture Overview

### High-Level System Architecture

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

### Component Architecture

#### Frontend Component Hierarchy
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

#### Backend Service Architecture
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

## Detailed Technical Specifications

### Frontend Architecture

#### Technology Stack
- **Framework**: React 18+ with Next.js 14+
- **Language**: TypeScript 5.0+
- **Styling**: Tailwind CSS 3.0+
- **State Management**: Zustand (lightweight alternative to Redux)
- **Form Handling**: React Hook Form with Zod validation
- **Data Fetching**: SWR for client-side data fetching
- **Build Tool**: Next.js built-in bundler with Turbopack
- **Testing**: Jest + React Testing Library + Playwright

#### Key Frontend Patterns

**Component Design Pattern**
```typescript
// Example: Calculator Component
interface CalculatorProps {
  initialValues?: CalculatorInputs;
  onCalculate: (results: AmortizationResults) => void;
  onSave?: (scenario: Scenario) => void;
}

const Calculator: React.FC<CalculatorProps> = ({
  initialValues,
  onCalculate,
  onSave
}) => {
  const [inputs, setInputs] = useState<CalculatorInputs>(initialValues || {});
  const [results, setResults] = useState<AmortizationResults | null>(null);
  
  // Component logic here
};
```

**State Management Pattern**
```typescript
// Zustand Store Example
interface AppState {
  user: User | null;
  projects: Project[];
  currentProject: Project | null;
  scenarios: Scenario[];
  
  // Actions
  setUser: (user: User | null) => void;
  setProjects: (projects: Project[]) => void;
  addProject: (project: Project) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
}

const useAppStore = create<AppState>((set) => ({
  user: null,
  projects: [],
  currentProject: null,
  scenarios: [],
  
  setUser: (user) => set({ user }),
  setProjects: (projects) => set({ projects }),
  addProject: (project) => set((state) => ({ 
    projects: [...state.projects, project] 
  })),
  // ... other actions
}));
```

#### Responsive Design Strategy
```css
/* Mobile-first approach with Tailwind CSS */
.calculator-container {
  @apply w-full max-w-md mx-auto p-4; /* Mobile */
  
  @apply sm:max-w-lg sm:p-6; /* Small screens */
  
  @apply md:max-w-2xl md:p-8; /* Medium screens */
  
  @apply lg:max-w-4xl lg:p-10; /* Large screens */
  
  @apply xl:max-w-6xl xl:p-12; /* Extra large screens */
}
```

### Backend Architecture

#### Technology Stack
- **Runtime**: Node.js 18+ LTS
- **Framework**: Express.js 4.18+
- **Language**: TypeScript 5.0+
- **Database**: PostgreSQL 15+ with Prisma ORM
- **Authentication**: JWT with refresh tokens
- **Validation**: Zod for runtime type validation
- **Testing**: Jest + Supertest
- **Logging**: Winston for structured logging

#### API Design Patterns

**RESTful Endpoint Structure**
```typescript
// Example: Projects API
router.get('/api/projects', authMiddleware, async (req, res) => {
  try {
    const projects = await projectService.getUserProjects(req.user.id);
    res.json({ success: true, data: projects });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/api/projects', authMiddleware, validateProject, async (req, res) => {
  try {
    const project = await projectService.createProject(req.user.id, req.body);
    res.status(201).json({ success: true, data: project });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});
```

**Service Layer Pattern**
```typescript
// Example: Calculator Service
class CalculatorService {
  async calculateAmortization(inputs: AmortizationInputs): Promise<AmortizationResults> {
    // Validate inputs
    const validatedInputs = this.validateInputs(inputs);
    
    // Perform calculations
    const results = this.performCalculations(validatedInputs);
    
    // Format results
    return this.formatResults(results);
  }
  
  private validateInputs(inputs: AmortizationInputs): ValidatedInputs {
    // Input validation logic
  }
  
  private performCalculations(inputs: ValidatedInputs): RawResults {
    // Calculation logic
  }
  
  private formatResults(results: RawResults): AmortizationResults {
    // Results formatting
  }
}
```

#### Database Schema Design

**Core Tables**
```sql
-- Users table with enhanced security
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  is_active BOOLEAN DEFAULT true,
  email_verified BOOLEAN DEFAULT false,
  last_login TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Projects table with soft delete
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  is_archived BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Scenarios table with comprehensive data
CREATE TABLE scenarios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  principal DECIMAL(15,2) NOT NULL,
  interest_rate DECIMAL(5,4) NOT NULL,
  term_years INTEGER NOT NULL,
  payment_frequency VARCHAR(20) DEFAULT 'monthly',
  start_date DATE,
  payment_amount DECIMAL(15,2),
  total_interest DECIMAL(15,2),
  total_payments DECIMAL(15,2),
  amortization_schedule JSONB,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User sessions for security
CREATE TABLE user_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  token_hash VARCHAR(255) NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Indexes for Performance**
```sql
-- Performance indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_projects_user_id ON projects(user_id);
CREATE INDEX idx_projects_archived ON projects(is_archived);
CREATE INDEX idx_scenarios_project_id ON scenarios(project_id);
CREATE INDEX idx_scenarios_created_at ON scenarios(created_at);
CREATE INDEX idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX idx_user_sessions_expires_at ON user_sessions(expires_at);
```

### Security Architecture

#### Authentication & Authorization
```typescript
// JWT Token Structure
interface JWTPayload {
  userId: string;
  email: string;
  iat: number;
  exp: number;
  type: 'access' | 'refresh';
}

// Authentication Middleware
const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload;
    const user = await userService.findById(decoded.userId);
    
    if (!user || !user.is_active) {
      return res.status(401).json({ error: 'Invalid token' });
    }
    
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};
```

#### Data Protection
```typescript
// Input Validation with Zod
const AmortizationInputSchema = z.object({
  principal: z.number().positive().max(1000000000),
  interestRate: z.number().min(0).max(100),
  termYears: z.number().int().min(1).max(50),
  paymentFrequency: z.enum(['monthly', 'bi-weekly', 'weekly']),
  startDate: z.date().optional()
});

// SQL Injection Prevention with Prisma
const getProjectScenarios = async (projectId: string, userId: string) => {
  return await prisma.scenario.findMany({
    where: {
      projectId,
      project: {
        userId // Ensures user owns the project
      }
    },
    orderBy: { createdAt: 'desc' }
  });
};
```

### Performance Architecture

#### Frontend Performance
```typescript
// Code Splitting Strategy
const Calculator = lazy(() => import('./components/Calculator'));
const ProjectDetail = lazy(() => import('./components/ProjectDetail'));

// Data Fetching with SWR
const useProjects = () => {
  return useSWR('/api/projects', fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    dedupingInterval: 60000
  });
};

// Image Optimization
import Image from 'next/image';

<Image
  src="/logo.png"
  alt="AmCalc Logo"
  width={200}
  height={100}
  priority
  placeholder="blur"
/>
```

#### Backend Performance
```typescript
// Database Connection Pooling
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  },
  log: ['query', 'info', 'warn', 'error']
});

// Caching Strategy
const cacheKey = `user:${userId}:projects`;
let projects = await redis.get(cacheKey);

if (!projects) {
  projects = await projectService.getUserProjects(userId);
  await redis.setex(cacheKey, 300, JSON.stringify(projects)); // 5 min cache
}
```

#### Mobile Optimization
```typescript
// PWA Configuration
const pwaConfig = {
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development'
};

// Offline Support
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js');
  });
}
```

## Deployment Architecture

### Environment Configuration
```typescript
// Environment Variables Structure
interface EnvironmentConfig {
  NODE_ENV: 'development' | 'production' | 'test';
  PORT: number;
  DATABASE_URL: string;
  JWT_SECRET: string;
  JWT_REFRESH_SECRET: string;
  REDIS_URL?: string;
  CORS_ORIGIN: string;
  RATE_LIMIT_WINDOW: number;
  RATE_LIMIT_MAX: number;
}

// Configuration Management
const config: EnvironmentConfig = {
  NODE_ENV: process.env.NODE_ENV as EnvironmentConfig['NODE_ENV'],
  PORT: parseInt(process.env.PORT || '3000'),
  DATABASE_URL: process.env.DATABASE_URL!,
  JWT_SECRET: process.env.JWT_SECRET!,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET!,
  REDIS_URL: process.env.REDIS_URL,
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:3000',
  RATE_LIMIT_WINDOW: parseInt(process.env.RATE_LIMIT_WINDOW || '900000'),
  RATE_LIMIT_MAX: parseInt(process.env.RATE_LIMIT_MAX || '100')
};
```

### CI/CD Pipeline
```yaml
# GitHub Actions Workflow
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run test
      - run: npm run build

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Render
        uses: johnbeynon/render-deploy-action@v0.0.3
        with:
          service-id: ${{ secrets.RENDER_SERVICE_ID }}
          api-key: ${{ secrets.RENDER_API_KEY }}
```

### Monitoring & Observability
```typescript
// Structured Logging
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

// Error Tracking
const errorHandler = (error: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error({
    message: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    userId: req.user?.id
  });
  
  res.status(500).json({ error: 'Internal server error' });
};
```

## Scalability Considerations

### Horizontal Scaling Strategy
```typescript
// Stateless Design
// No server-side session storage - all state in JWT tokens

// Load Balancer Ready
app.set('trust proxy', 1); // Trust first proxy

// Database Connection Pooling
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000
});
```

### Vertical Scaling Strategy
```typescript
// Memory Management
const calculateAmortization = (inputs: AmortizationInputs) => {
  // Use streaming for large datasets
  const results = [];
  for (let i = 0; i < inputs.termYears * 12; i++) {
    // Calculate payment for each period
    const payment = calculatePayment(inputs, i);
    results.push(payment);
    
    // Prevent memory leaks with large calculations
    if (i % 1000 === 0) {
      global.gc && global.gc();
    }
  }
  return results;
};
```

## Risk Mitigation

### Technical Risks
1. **Database Performance**: Implement proper indexing and query optimization
2. **Memory Leaks**: Regular garbage collection and memory monitoring
3. **Security Vulnerabilities**: Regular dependency updates and security audits
4. **Scalability Issues**: Design for horizontal scaling from the start

### Business Risks
1. **Data Loss**: Automated backups and disaster recovery procedures
2. **Service Outages**: Health checks and monitoring
3. **Performance Degradation**: Performance monitoring and alerting
4. **Security Breaches**: Comprehensive security measures and regular audits

## Implementation Guidelines

### Development Workflow
1. **Feature Development**: Create feature branch from main
2. **Code Review**: Self-review using BMad-Method checklist
3. **Testing**: Unit tests for all business logic
4. **Integration**: Merge to main after passing tests
5. **Deployment**: Automated deployment to staging/production

### Code Quality Standards
```typescript
// TypeScript Configuration
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "noImplicitReturns": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true
  }
}

// ESLint Configuration
{
  "extends": [
    "next/core-web-vitals",
    "@typescript-eslint/recommended"
  ],
  "rules": {
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/explicit-function-return-type": "warn"
  }
}
```

### Testing Strategy
```typescript
// Unit Test Example
describe('CalculatorService', () => {
  it('should calculate monthly payment correctly', () => {
    const inputs = {
      principal: 200000,
      interestRate: 3.5,
      termYears: 30
    };
    
    const result = calculatorService.calculateMonthlyPayment(inputs);
    expect(result).toBeCloseTo(898.09, 2);
  });
});

// Integration Test Example
describe('Projects API', () => {
  it('should create project for authenticated user', async () => {
    const response = await request(app)
      .post('/api/projects')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ name: 'Test Project' });
    
    expect(response.status).toBe(201);
    expect(response.body.data.name).toBe('Test Project');
  });
});
```

## Future Architecture Considerations

### Microservices Migration Path
1. **Phase 1**: Extract calculator service as separate module
2. **Phase 2**: Extract user management service
3. **Phase 3**: Extract project management service
4. **Phase 4**: Implement service mesh and API gateway

### Technology Evolution
1. **Database**: Consider read replicas for scaling
2. **Caching**: Implement Redis for session and data caching
3. **Search**: Add Elasticsearch for advanced search capabilities
4. **Real-time**: WebSocket support for collaborative features

---

## Document Approval

- [ ] **Architect Agent**: Technical review and approval
- [ ] **Developer**: Implementation feasibility review
- [ ] **Product Manager**: Business requirements alignment
- [ ] **UX Expert**: User experience considerations

---

*This architecture document serves as the technical foundation for AmCalc development and should be updated as the system evolves and new requirements emerge.* 