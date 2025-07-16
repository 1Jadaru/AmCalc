# Technical Assumptions

## Repository Structure: Monorepo

**Rationale**: As a solo developer building a full-stack application, a monorepo approach will simplify development, testing, and deployment. This allows shared code, consistent tooling, and easier dependency management between frontend and backend components.

## Service Architecture

**CRITICAL DECISION**: The application will use a **Monolith** architecture with clear separation of concerns.

**Rationale**: 
- Solo developer efficiency and reduced complexity
- Easier deployment and monitoring on Render.com
- Faster development iteration for MVP
- Can be refactored to microservices later if needed
- PostgreSQL provides sufficient scalability for target user base

## Testing Requirements

**CRITICAL DECISION**: **Unit + Integration** testing approach with comprehensive coverage.

**Rationale**:
- Unit tests for calculation logic and business rules
- Integration tests for API endpoints and database operations
- End-to-end testing for critical user workflows
- Automated testing essential for solo developer confidence
- Focus on calculation accuracy and data integrity

## Additional Technical Assumptions and Requests

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