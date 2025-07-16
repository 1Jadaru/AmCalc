# AmCalc Development Plan

## Project Overview

**Project Name**: AmCalc - Professional Amortization Calculator SaaS  
**Development Approach**: BMad-Method with Agile/Scrum  
**Timeline**: 1-week MVP target (flexible)  
**Team Size**: Solo developer  
**Methodology**: Vibe coding with BMad framework  

## Development Phases

### Phase 1: Foundation & Planning (Week 1)

#### Day 1-2: Project Setup & Architecture
- [ ] **Environment Setup**
  - Initialize Next.js project with TypeScript
  - Configure Tailwind CSS for responsive design
  - Set up ESLint, Prettier, and Husky
  - Configure GitHub repository and CI/CD

- [ ] **Database Design**
  - Design PostgreSQL schema
  - Set up Prisma ORM
  - Create initial migrations
  - Configure database connection

- [ ] **Project Structure**
  - Organize component architecture
  - Set up API route structure
  - Configure environment variables
  - Establish coding standards

#### Day 3-4: Core Development
- [ ] **Authentication System**
  - Implement user registration/login
  - Set up JWT token management
  - Create secure session handling
  - Add password validation

- [ ] **Basic Calculator**
  - Develop loan calculation engine
  - Create amortization table generator
  - Implement input validation
  - Add error handling

#### Day 5-7: MVP Features
- [ ] **User Interface**
  - Build responsive calculator form
  - Create project folder system
  - Implement scenario saving
  - Design mobile-first layout

- [ ] **Testing & Quality**
  - Write unit tests for calculations
  - Implement integration tests
  - Perform security testing
  - Conduct user experience testing

### Phase 2: Enhancement & Optimization (Week 2-3)

#### Week 2: Feature Enhancement
- [ ] **Advanced Features**
  - Implement scenario comparison
  - Add project organization
  - Create user dashboard
  - Build sharing functionality

- [ ] **Performance Optimization**
  - Optimize calculation speed
  - Implement caching strategies
  - Add offline capabilities
  - Optimize mobile performance

#### Week 3: Production Readiness
- [ ] **Deployment Preparation**
  - Configure production environment
  - Set up monitoring and logging
  - Implement error tracking
  - Prepare deployment scripts

- [ ] **Final Testing**
  - End-to-end testing
  - Performance testing
  - Security audit
  - User acceptance testing

## Technical Implementation

### Frontend Architecture

#### Component Structure
```
src/
├── components/
│   ├── ui/                    # Reusable UI components
│   │   ├── Button.tsx         # Custom button component
│   │   ├── Input.tsx          # Form input component
│   │   ├── Card.tsx           # Card layout component
│   │   └── Modal.tsx          # Modal dialog component
│   ├── forms/                 # Form components
│   │   ├── LoanCalculator.tsx # Main calculator form
│   │   ├── UserRegistration.tsx # Registration form
│   │   └── LoginForm.tsx      # Login form
│   ├── layout/                # Layout components
│   │   ├── Header.tsx         # Site header
│   │   ├── Footer.tsx         # Site footer
│   │   └── Navigation.tsx     # Navigation menu
│   └── features/              # Feature-specific components
│       ├── calculator/        # Calculator feature
│       │   ├── CalculatorForm.tsx
│       │   ├── AmortizationTable.tsx
│       │   └── ResultsDisplay.tsx
│       ├── projects/          # Project management
│       │   ├── ProjectList.tsx
│       │   ├── ProjectCard.tsx
│       │   └── ProjectForm.tsx
│       └── scenarios/         # Scenario management
│           ├── ScenarioList.tsx
│           ├── ScenarioCard.tsx
│           └── ScenarioForm.tsx
├── pages/                     # Next.js pages
│   ├── index.tsx              # Home page
│   ├── calculator.tsx         # Calculator page
│   ├── projects/              # Project pages
│   ├── auth/                  # Authentication pages
│   └── api/                   # API routes
├── hooks/                     # Custom React hooks
│   ├── useAuth.ts             # Authentication hook
│   ├── useCalculator.ts       # Calculator logic hook
│   └── useProjects.ts         # Project management hook
├── utils/                     # Utility functions
│   ├── calculations.ts        # Calculation utilities
│   ├── validation.ts          # Input validation
│   └── formatting.ts          # Data formatting
├── types/                     # TypeScript definitions
│   ├── user.ts                # User types
│   ├── project.ts             # Project types
│   └── scenario.ts            # Scenario types
└── styles/                    # Global styles
    └── globals.css            # Global CSS
```

#### Key Components Development

##### Calculator Form Component
```typescript
// components/forms/LoanCalculator.tsx
interface LoanCalculatorProps {
  onCalculate: (data: LoanData) => void;
  initialData?: Partial<LoanData>;
}

const LoanCalculator: React.FC<LoanCalculatorProps> = ({
  onCalculate,
  initialData
}) => {
  // Form state management
  // Input validation
  // Calculation triggering
  // Mobile-responsive design
};
```

##### Amortization Table Component
```typescript
// components/features/calculator/AmortizationTable.tsx
interface AmortizationTableProps {
  data: AmortizationRow[];
  onSave?: () => void;
}

const AmortizationTable: React.FC<AmortizationTableProps> = ({
  data,
  onSave
}) => {
  // Table rendering
  // Mobile optimization
  // Export functionality
  // Save scenario option
};
```

### Backend Architecture

#### API Structure
```
src/
├── api/                       # API routes
│   ├── auth/                  # Authentication endpoints
│   │   ├── register.ts        # User registration
│   │   ├── login.ts           # User login
│   │   ├── logout.ts          # User logout
│   │   └── me.ts              # Get current user
│   ├── calculator/            # Calculation endpoints
│   │   ├── amortization.ts    # Amortization calculation
│   │   ├── compare.ts         # Scenario comparison
│   │   └── validate.ts        # Input validation
│   ├── projects/              # Project management
│   │   ├── index.ts           # List/create projects
│   │   └── [id].ts            # Get/update/delete project
│   └── scenarios/             # Scenario management
│       ├── index.ts           # List/create scenarios
│       └── [id].ts            # Get/update/delete scenario
├── services/                  # Business logic
│   ├── authService.ts         # Authentication logic
│   ├── calculatorService.ts   # Calculation logic
│   ├── projectService.ts      # Project management
│   └── scenarioService.ts     # Scenario management
├── models/                    # Data models
│   ├── User.ts                # User model
│   ├── Project.ts             # Project model
│   └── Scenario.ts            # Scenario model
├── middleware/                # Express middleware
│   ├── auth.ts                # Authentication middleware
│   ├── validation.ts          # Input validation
│   └── errorHandler.ts        # Error handling
├── utils/                     # Utility functions
│   ├── database.ts            # Database utilities
│   ├── validation.ts          # Validation utilities
│   └── security.ts            # Security utilities
└── config/                    # Configuration
    ├── database.ts            # Database configuration
    ├── auth.ts                # Authentication config
    └── app.ts                 # Application config
```

#### Key Services Development

##### Calculator Service
```typescript
// services/calculatorService.ts
export class CalculatorService {
  // Calculate monthly payment
  static calculatePayment(principal: number, rate: number, term: number): number;
  
  // Generate amortization table
  static generateAmortizationTable(principal: number, rate: number, term: number): AmortizationRow[];
  
  // Calculate total interest
  static calculateTotalInterest(amortizationTable: AmortizationRow[]): number;
  
  // Compare scenarios
  static compareScenarios(scenarios: Scenario[]): ComparisonResult;
}
```

##### Project Service
```typescript
// services/projectService.ts
export class ProjectService {
  // Create new project
  static async createProject(userId: string, data: CreateProjectData): Promise<Project>;
  
  // Get user projects
  static async getUserProjects(userId: string): Promise<Project[]>;
  
  // Update project
  static async updateProject(projectId: string, data: UpdateProjectData): Promise<Project>;
  
  // Delete project
  static async deleteProject(projectId: string): Promise<void>;
}
```

### Database Schema

#### Core Tables
```sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Projects table
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Scenarios table
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

## Development Workflow

### BMad-Method Integration

#### Agent Workflow
1. **PM Agent**: Project planning and requirements
2. **Architect Agent**: Technical architecture and design
3. **Developer Agent**: Implementation and coding
4. **QA Agent**: Testing and quality assurance
5. **PO Agent**: Product validation and refinement

#### Document-Driven Development
- **Project Brief**: Foundation document
- **Technical Architecture**: System design
- **Business Model**: Revenue strategy
- **Development Plan**: Implementation roadmap
- **User Stories**: Feature specifications

### Agile/Scrum Process

#### Sprint Planning (1-week cycles)
- **Sprint Goal**: Clear objective for the week
- **User Stories**: Prioritized feature list
- **Acceptance Criteria**: Definition of done
- **Effort Estimation**: Time and complexity assessment

#### Daily Development
- **Morning Standup**: Progress review and blockers
- **Development Focus**: Feature implementation
- **Testing**: Continuous testing and validation
- **Documentation**: Code and process documentation

#### Sprint Review
- **Feature Demo**: Working functionality demonstration
- **Feedback Collection**: User and stakeholder feedback
- **Retrospective**: Process improvement discussion
- **Next Sprint Planning**: Upcoming work preparation

## Quality Assurance

### Testing Strategy

#### Unit Testing
- **Calculation Logic**: Mathematical accuracy testing
- **Component Testing**: React component validation
- **Service Testing**: Business logic verification
- **Utility Testing**: Helper function validation

#### Integration Testing
- **API Testing**: Endpoint functionality testing
- **Database Testing**: Data persistence validation
- **Authentication Testing**: User session management
- **Error Handling**: Exception and error scenarios

#### End-to-End Testing
- **User Workflows**: Complete user journey testing
- **Cross-Browser Testing**: Browser compatibility
- **Mobile Testing**: Responsive design validation
- **Performance Testing**: Load and stress testing

### Code Quality

#### Standards
- **TypeScript**: Strict type checking
- **ESLint**: Code style and quality rules
- **Prettier**: Code formatting consistency
- **Husky**: Pre-commit hooks

#### Documentation
- **JSDoc**: Function and component documentation
- **README**: Project setup and usage
- **API Documentation**: Endpoint specifications
- **Architecture Docs**: System design documentation

## Deployment Strategy

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

### CI/CD Pipeline
```
GitHub Push → GitHub Actions → Build & Test → Deploy to Render
```

## Risk Management

### Technical Risks
- **Timeline Pressure**: Flexible approach with realistic milestones
- **Complexity Overrun**: MVP focus with iterative enhancement
- **Performance Issues**: Continuous monitoring and optimization
- **Security Vulnerabilities**: Regular security audits

### Mitigation Strategies
- **Scope Management**: Clear MVP definition and prioritization
- **Quality Focus**: Comprehensive testing and validation
- **Documentation**: Clear technical and process documentation
- **Iterative Development**: Rapid feedback and improvement cycles

## Success Metrics

### Development Metrics
- **Code Quality**: Test coverage and linting compliance
- **Performance**: Page load times and calculation speed
- **Security**: Vulnerability assessment and remediation
- **User Experience**: Mobile responsiveness and accessibility

### Project Metrics
- **Timeline Adherence**: Sprint completion rates
- **Feature Delivery**: MVP feature completion
- **Bug Resolution**: Issue tracking and resolution
- **Documentation**: Comprehensive project documentation

## Next Steps

### Immediate Actions (This Week)
1. [ ] Complete project setup and environment configuration
2. [ ] Implement core calculation engine
3. [ ] Build basic user interface
4. [ ] Set up authentication system

### Short-term Goals (Next 2 Weeks)
1. [ ] Complete MVP development and testing
2. [ ] Deploy to production environment
3. [ ] Implement monitoring and analytics
4. [ ] Begin user feedback collection

### Long-term Vision (Next 3-6 Months)
1. [ ] Achieve 1,000+ monthly users
2. [ ] Launch premium features
3. [ ] Optimize revenue and user experience
4. [ ] Plan next phase of development

---

*This development plan provides the roadmap for AmCalc implementation and should be updated as the project progresses and requirements evolve.* 