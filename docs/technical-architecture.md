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

### Design Patterns
- **Client-Server Architecture**: Separation of concerns between frontend and backend
- **RESTful API**: Standard HTTP-based communication
- **Component-Based UI**: Reusable React components
- **Database-First**: PostgreSQL for data persistence
- **Progressive Enhancement**: Core functionality works without JavaScript

## Technology Stack

### Frontend
- **Framework**: React 18+ with Next.js 14+
- **Language**: TypeScript for type safety
- **Styling**: Tailwind CSS for responsive design
- **State Management**: React Context API / Zustand
- **Build Tool**: Next.js built-in bundler
- **Testing**: Jest + React Testing Library

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
- **CI/CD**: GitHub Actions
- **Code Quality**: ESLint, Prettier, Husky
- **Documentation**: JSDoc, README files

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

### Component Architecture

#### Frontend Components
```
src/
├── components/
│   ├── ui/                    # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Card.tsx
│   │   └── Modal.tsx
│   ├── forms/                 # Form components
│   │   ├── LoanCalculator.tsx
│   │   ├── UserRegistration.tsx
│   │   └── LoginForm.tsx
│   ├── layout/                # Layout components
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── Navigation.tsx
│   └── features/              # Feature-specific components
│       ├── calculator/
│       ├── projects/
│       └── scenarios/
├── pages/                     # Next.js pages
├── hooks/                     # Custom React hooks
├── utils/                     # Utility functions
├── types/                     # TypeScript type definitions
└── styles/                    # Global styles
```

#### Backend Structure
```
src/
├── api/                       # API routes
│   ├── auth/                  # Authentication endpoints
│   ├── calculator/            # Calculation endpoints
│   ├── projects/              # Project management
│   └── scenarios/             # Scenario management
├── services/                  # Business logic
│   ├── authService.ts
│   ├── calculatorService.ts
│   ├── projectService.ts
│   └── scenarioService.ts
├── models/                    # Data models
│   ├── User.ts
│   ├── Project.ts
│   └── Scenario.ts
├── middleware/                # Express middleware
│   ├── auth.ts
│   ├── validation.ts
│   └── errorHandler.ts
├── utils/                     # Utility functions
└── config/                    # Configuration files
```

## Data Model

### Database Schema

#### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
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

#### Scenarios Table
```sql
CREATE TABLE scenarios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  principal DECIMAL(15,2) NOT NULL,
  interest_rate DECIMAL(5,4) NOT NULL,
  term_years INTEGER NOT NULL,
  payment_amount DECIMAL(15,2),
  total_interest DECIMAL(15,2),
  total_payments DECIMAL(15,2),
  amortization_data JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Data Relationships
- **User** → **Projects** (One-to-Many)
- **Project** → **Scenarios** (One-to-Many)
- **User** → **Scenarios** (One-to-Many through Projects)

## API Design

### RESTful Endpoints

#### Authentication
```
POST   /api/auth/register     # User registration
POST   /api/auth/login        # User login
POST   /api/auth/logout       # User logout
GET    /api/auth/me           # Get current user
```

#### Projects
```
GET    /api/projects          # List user projects
POST   /api/projects          # Create new project
GET    /api/projects/:id      # Get project details
PUT    /api/projects/:id      # Update project
DELETE /api/projects/:id      # Delete project
```

#### Scenarios
```
GET    /api/projects/:id/scenarios     # List project scenarios
POST   /api/projects/:id/scenarios     # Create new scenario
GET    /api/scenarios/:id              # Get scenario details
PUT    /api/scenarios/:id              # Update scenario
DELETE /api/scenarios/:id              # Delete scenario
```

#### Calculator
```
POST   /api/calculator/amortization    # Calculate amortization
POST   /api/calculator/compare         # Compare scenarios
GET    /api/calculator/validate        # Validate inputs
```

### API Response Format
```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
```

## Security Architecture

### Authentication & Authorization
- **JWT Tokens**: Secure token-based authentication
- **Password Hashing**: bcrypt for password security
- **Session Management**: Secure session handling
- **CORS**: Configured for production domains
- **Rate Limiting**: API rate limiting to prevent abuse

### Data Protection
- **Input Validation**: Comprehensive input sanitization
- **SQL Injection Prevention**: Parameterized queries with Prisma
- **XSS Protection**: Content Security Policy headers
- **HTTPS**: SSL/TLS encryption for all communications
- **Data Encryption**: Encrypted data at rest and in transit

### Privacy Compliance
- **GDPR Compliance**: User data protection and rights
- **Data Minimization**: Only collect necessary data
- **User Consent**: Clear consent mechanisms
- **Data Portability**: Export user data capability

## Performance Optimization

### Frontend Performance
- **Code Splitting**: Dynamic imports for route-based splitting
- **Image Optimization**: Next.js automatic image optimization
- **Caching**: Browser caching and CDN caching
- **Bundle Optimization**: Tree shaking and minification
- **Lazy Loading**: Component and route lazy loading

### Backend Performance
- **Database Indexing**: Optimized database queries
- **Connection Pooling**: Efficient database connections
- **Caching**: Redis caching for frequently accessed data
- **Compression**: Gzip compression for API responses
- **Load Balancing**: Horizontal scaling capability

### Mobile Optimization
- **Responsive Design**: Mobile-first approach
- **Touch Optimization**: Touch-friendly interface elements
- **Offline Support**: Service workers for offline functionality
- **Progressive Web App**: PWA capabilities for mobile experience

## Deployment Architecture

### Development Environment
- **Local Development**: Docker Compose for local environment
- **Database**: Local PostgreSQL instance
- **Hot Reloading**: Fast development iteration
- **Environment Variables**: Secure configuration management

### Production Environment
- **Hosting**: Render.com for cost-effective deployment
- **Database**: Render PostgreSQL service
- **Environment**: Production-optimized configuration
- **Monitoring**: Application and error monitoring
- **Backup**: Automated database backups

### CI/CD Pipeline
```
GitHub Push → GitHub Actions → Build & Test → Deploy to Render
```

## Monitoring & Logging

### Application Monitoring
- **Error Tracking**: Comprehensive error logging
- **Performance Monitoring**: Response time and throughput
- **User Analytics**: Google Analytics integration
- **Health Checks**: Application health monitoring

### Logging Strategy
- **Structured Logging**: JSON format for easy parsing
- **Log Levels**: Debug, Info, Warn, Error
- **Log Aggregation**: Centralized log management
- **Audit Trail**: User action logging for compliance

## Scalability Considerations

### Horizontal Scaling
- **Stateless Design**: No server-side session storage
- **Load Balancing**: Multiple server instances
- **Database Scaling**: Read replicas and connection pooling
- **CDN**: Global content delivery

### Vertical Scaling
- **Resource Optimization**: Efficient memory and CPU usage
- **Database Optimization**: Query optimization and indexing
- **Caching Strategy**: Multi-layer caching approach
- **Code Optimization**: Performance-focused development

## Disaster Recovery

### Backup Strategy
- **Database Backups**: Automated daily backups
- **Code Backups**: GitHub repository backup
- **Configuration Backups**: Environment configuration backup
- **Recovery Testing**: Regular disaster recovery testing

### High Availability
- **Redundancy**: Multiple server instances
- **Failover**: Automatic failover mechanisms
- **Data Replication**: Database replication for reliability
- **Monitoring**: Proactive monitoring and alerting

## Development Workflow

### BMad-Method Integration
- **Agent Workflow**: Specialized agents for different phases
- **Documentation**: Comprehensive project documentation
- **Quality Assurance**: Automated testing and validation
- **Iterative Development**: Continuous improvement cycle

### Agile/Scrum Process
- **Sprint Planning**: 1-week development cycles
- **Daily Standups**: Progress tracking and blockers
- **Sprint Reviews**: Feature demonstration and feedback
- **Retrospectives**: Process improvement and learning

---

*This technical architecture document provides the foundation for AmCalc development and should be updated as the system evolves.* 