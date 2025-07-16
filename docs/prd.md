# AmCalc Product Requirements Document (PRD)

## Goals and Background Context

### Goals

- **Goal 1**: Create a professional, mobile-first amortization calculator that serves individuals, small business owners, and real estate investors
- **Goal 2**: Provide intuitive loan modeling with project-based scenario organization and selective saving capabilities
- **Goal 3**: Achieve 1,000+ unique monthly users with ad revenue covering operational costs
- **Goal 4**: Establish a foundation for premium features and subscription revenue in v2
- **Goal 5**: Deliver a superior mobile experience compared to existing calculator tools

### Background Context

AmCalc addresses a significant gap in the financial calculator market. While numerous amortization calculators exist, most lack modern mobile-first design, scenario management capabilities, and professional presentation features. The target market includes individuals modeling loans for major purchases, small business owners analyzing financing options, and real estate investors comparing investment scenarios.

The current landscape is fragmented between simple web calculators, complex Excel templates, and bank-specific tools that lack portability. AmCalc will differentiate through its mobile-responsive design, project organization system, and focus on user experience that enables confident financial decision-making.

### Change Log

| Date | Version | Description | Author |
|------|---------|-------------|--------|
| [Current Date] | 1.0 | Initial PRD creation | PM Agent |

## Requirements

### Functional Requirements

**FR1**: The system shall provide basic loan calculations (principal, interest rate, term) to generate monthly payment amounts  
**FR2**: The system shall generate complete amortization tables showing principal/interest breakdown for each payment  
**FR3**: The system shall allow users to create and manage project folders for organizing different loan scenarios  
**FR4**: The system shall enable users to save specific scenarios within projects for later reference  
**FR5**: The system shall provide user registration and authentication with secure session management  
**FR6**: The system shall display calculation results in a mobile-responsive, touch-friendly interface  
**FR7**: The system shall support offline basic calculations without internet connectivity  
**FR8**: The system shall allow side-by-side comparison of multiple loan scenarios  
**FR9**: The system shall generate shareable links for loan scenarios  
**FR10**: The system shall integrate Google AdSense for revenue generation

### Non-Functional Requirements

**NFR1**: The application shall load within 3 seconds on mobile devices  
**NFR2**: The calculation engine shall respond within 1 second for basic loan calculations  
**NFR3**: The system shall support 1,000+ concurrent users without performance degradation  
**NFR4**: The application shall be accessible on all major browsers and mobile devices  
**NFR5**: User data shall be encrypted in transit and at rest  
**NFR6**: The system shall maintain 99.9% uptime for production availability  
**NFR7**: The application shall follow WCAG AA accessibility standards  
**NFR8**: The system shall be deployable on Render.com infrastructure within budget constraints

## User Interface Design Goals

### Overall UX Vision

AmCalc will provide a clean, intuitive interface that makes complex financial calculations feel simple and accessible. The design will prioritize mobile-first responsiveness while maintaining professional credibility for business users. The interface should guide users through loan modeling with clear visual feedback and logical information hierarchy.

### Key Interaction Paradigms

- **Progressive Disclosure**: Start with simple inputs, reveal detailed results on demand
- **Contextual Organization**: Group related calculations and scenarios within project folders
- **Visual Feedback**: Clear indication of calculation status and result accuracy
- **Touch Optimization**: Large, accessible input elements optimized for mobile interaction
- **Persistent Context**: Maintain user's current project and scenario context throughout the session

### Core Screens and Views

1. **Landing Page**: Clear value proposition and quick calculator access
2. **Calculator Form**: Main input interface with principal, rate, and term fields
3. **Results Display**: Amortization table and summary statistics
4. **Project Dashboard**: Overview of user's projects and scenarios
5. **Scenario Comparison**: Side-by-side view of multiple loan options
6. **User Account**: Registration, login, and profile management
7. **Project Management**: Create, edit, and organize project folders

### Accessibility: WCAG AA

The application will meet WCAG AA standards to ensure accessibility for users with disabilities, including proper contrast ratios, keyboard navigation, and screen reader compatibility.

### Branding

AmCalc will feature a professional, trustworthy design aesthetic appropriate for financial applications. The color scheme should convey reliability and precision while maintaining modern appeal. Typography will prioritize readability across all device sizes.

### Target Device and Platforms: Web Responsive

The application will be designed for web-responsive deployment, ensuring excellent experience across desktop, tablet, and mobile devices. The mobile experience will be prioritized for on-the-go financial decision-making.

## Technical Assumptions

### Repository Structure: Monorepo

**Rationale**: As a solo developer building a full-stack application, a monorepo approach will simplify development, testing, and deployment. This allows shared code, consistent tooling, and easier dependency management between frontend and backend components.

### Service Architecture

**CRITICAL DECISION**: The application will use a **Monolith** architecture with clear separation of concerns.

**Rationale**: 
- Solo developer efficiency and reduced complexity
- Easier deployment and monitoring on Render.com
- Faster development iteration for MVP
- Can be refactored to microservices later if needed
- PostgreSQL provides sufficient scalability for target user base

### Testing Requirements

**CRITICAL DECISION**: **Unit + Integration** testing approach with comprehensive coverage.

**Rationale**:
- Unit tests for calculation logic and business rules
- Integration tests for API endpoints and database operations
- End-to-end testing for critical user workflows
- Automated testing essential for solo developer confidence
- Focus on calculation accuracy and data integrity

### Additional Technical Assumptions and Requests

- **Frontend Framework**: React 18+ with Next.js 14+ for SSR and optimal performance
- **Backend Framework**: Node.js with Express for API development
- **Database**: PostgreSQL with Prisma ORM for type-safe database access
- **Styling**: Tailwind CSS for responsive design and rapid development
- **Authentication**: JWT tokens with secure session management
- **Hosting**: Render.com for cost-effective deployment and scaling
- **CI/CD**: GitHub Actions for automated testing and deployment
- **Monitoring**: Built-in Render monitoring plus custom logging
- **Mobile Optimization**: Progressive Web App capabilities for offline functionality
- **Security**: HTTPS enforcement, input validation, and data encryption

## Epic List

### Epic Structure Decision

**Epic 1: Core AmCalc MVP** - A single epic delivering the complete amortization calculator with user management, project organization, and mobile-responsive interface.

**Rationale for Single Epic**:
- MVP scope is well-defined and achievable in 1 week
- All features are tightly integrated and deliver value together
- Reduces complexity for solo developer
- Ensures complete user workflow from calculation to scenario saving
- Can be deployed as a cohesive unit for user feedback

### Epic 1: Core AmCalc MVP

**Goal**: Deliver a fully functional amortization calculator with user accounts, project organization, and mobile-responsive design that enables users to model loans, save scenarios, and make informed financial decisions.

This epic will establish the foundational infrastructure while delivering the complete core functionality that provides immediate value to users. Each story builds upon the previous one to create a cohesive, deployable application.

## Epic 1: Core AmCalc MVP

**Expanded Goal**: This epic will deliver a complete, deployable amortization calculator that enables users to perform loan calculations, organize scenarios within projects, and access their data across devices. The application will provide immediate value through accurate calculations while establishing the foundation for future premium features. Users will be able to register accounts, create projects for different loan types, save valuable scenarios, and compare options to make informed financial decisions.

### Story 1.1: Project Foundation and Setup

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

### Story 1.2: Database Schema and Connection

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

### Story 1.3: Authentication System

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

### Story 1.4: Core Calculator Engine

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

### Story 1.5: Results Display and Amortization Table

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

### Story 1.6: Project Management System

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

### Story 1.7: Scenario Saving and Management

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

### Story 1.8: Mobile-First Responsive Design

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

### Story 1.9: User Dashboard and Navigation

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

### Story 1.10: Testing and Quality Assurance

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

## Checklist Results Report

*[To be populated after running PM checklist]*

## Next Steps

### UX Expert Prompt

*[To be populated after checklist completion]*

### Architect Prompt

*[To be populated after checklist completion]*

---

*This PRD serves as the foundation for AmCalc development and should be updated as requirements evolve.* 