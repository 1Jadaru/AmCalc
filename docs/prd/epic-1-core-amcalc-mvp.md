# Epic 1: Core AmCalc MVP

**Expanded Goal**: This epic will deliver a complete, deployable amortization calculator that enables users to perform loan calculations, organize scenarios within projects, and access their data across devices. The application will provide immediate value through accurate calculations while establishing the foundation for future premium features. Users will be able to register accounts, create projects for different loan types, save valuable scenarios, and compare options to make informed financial decisions.

## Story 1.1: Project Foundation and Setup

**As a** developer,  
**I want** a properly configured Next.js project with TypeScript, Tailwind CSS, and essential tooling,  
**so that** I have a solid foundation for building the AmCalc application.

**Acceptance Criteria**:
1. Next.js 14+ project initialized with TypeScript configuration
2. Tailwind CSS configured for responsive design
3. ESLint and Prettier configured for code quality
4. GitHub repository with proper .gitignore and README
5. Basic project structure with components, pages, and utils folders
6. Environment variables configured for development
7. Hot reloading working for development iteration

## Story 1.2: Database Schema and Connection

**As a** developer,  
**I want** PostgreSQL database with Prisma ORM configured and core tables created,  
**so that** the application can persist user data and scenarios securely.

**Acceptance Criteria**:
1. PostgreSQL database configured and accessible
2. Prisma ORM installed and configured with TypeScript
3. User, Project, and Scenario tables created with proper relationships
4. Database migrations working and version controlled
5. Connection pooling configured for performance
6. Environment variables for database connection secured
7. Basic database seeding for development testing

## Story 1.3: Authentication System

**As a** user,  
**I want** to register an account and securely log in,  
**so that** I can save my loan scenarios and access them across devices.

**Acceptance Criteria**:
1. User registration form with email and password validation
2. Secure password hashing using bcrypt
3. JWT token generation and validation
4. Login form with error handling
5. Protected routes for authenticated users
6. Session management with secure cookie handling
7. Password reset functionality (basic implementation)
8. User profile management (basic fields)

## Story 1.4: Core Calculator Engine

**As a** user,  
**I want** to input loan details and receive accurate calculations,  
**so that** I can model different loan scenarios.

**Acceptance Criteria**:
1. Calculator form with principal, interest rate, and term inputs
2. Real-time calculation of monthly payment amount
3. Generation of complete amortization table
4. Calculation of total interest and total payments
5. Input validation with clear error messages
6. Mobile-responsive form design
7. Calculation accuracy verified against standard formulas
8. Performance optimization for fast calculations

## Story 1.5: Results Display and Amortization Table

**As a** user,  
**I want** to see detailed calculation results in a clear, organized format,  
**so that** I can understand the complete loan breakdown.

**Acceptance Criteria**:
1. Monthly payment amount prominently displayed
2. Complete amortization table with payment number, payment amount, principal, interest, and remaining balance
3. Summary statistics (total interest, total payments, loan term)
4. Mobile-responsive table design with horizontal scrolling
5. Export functionality (basic CSV download)
6. Print-friendly formatting
7. Clear visual hierarchy and typography
8. Loading states for calculation processing

## Story 1.6: Project Management System

**As a** user,  
**I want** to create and organize projects for different loan types,  
**so that** I can keep my scenarios organized by purpose.

**Acceptance Criteria**:
1. Create new project with name and description
2. List user's projects with creation dates
3. Edit project details (name, description)
4. Delete projects with confirmation
5. Project folder organization in UI
6. Mobile-responsive project management interface
7. Project sharing between scenarios
8. Project search and filtering (basic)

## Story 1.7: Scenario Saving and Management

**As a** user,  
**I want** to save specific loan scenarios within projects,  
**so that** I can reference and compare them later.

**Acceptance Criteria**:
1. Save current calculation as a scenario with custom name
2. List scenarios within each project
3. Load saved scenarios to calculator form
4. Edit scenario details (name, notes)
5. Delete scenarios with confirmation
6. Scenario metadata (creation date, last modified)
7. Mobile-responsive scenario management
8. Scenario search within projects

## Story 1.8: Mobile-First Responsive Design

**As a** user,  
**I want** to use AmCalc seamlessly on mobile devices,  
**so that** I can perform calculations on-the-go.

**Acceptance Criteria**:
1. Touch-friendly input elements and buttons
2. Responsive layout that works on all screen sizes
3. Optimized typography for mobile readability
4. Swipe gestures for table navigation
5. Mobile-optimized form validation
6. Fast loading times on mobile networks
7. Offline capability for basic calculations
8. Mobile browser compatibility testing

## Story 1.9: User Dashboard and Navigation

**As a** user,  
**I want** an intuitive dashboard to access all my projects and recent calculations,  
**so that** I can efficiently manage my loan scenarios.

**Acceptance Criteria**:
1. Dashboard showing recent projects and scenarios
2. Quick access to create new calculations
3. Navigation menu for all major features
4. User account information and settings
5. Search functionality across projects and scenarios
6. Mobile-responsive dashboard design
7. Clear visual hierarchy and user guidance
8. Loading states and error handling

## Story 1.10: Testing and Quality Assurance

**As a** developer,  
**I want** comprehensive testing to ensure application reliability,  
**so that** users can trust the calculation accuracy and system stability.

**Acceptance Criteria**:
1. Unit tests for calculation logic with 90%+ coverage
2. Integration tests for API endpoints
3. End-to-end tests for critical user workflows
4. Mobile responsiveness testing across devices
5. Performance testing for calculation speed
6. Security testing for authentication and data protection
7. Accessibility testing for WCAG AA compliance
8. Cross-browser compatibility testing 