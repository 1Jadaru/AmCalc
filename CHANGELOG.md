# Changelog

All notable changes to AmCalc will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- **Projects Page**: Created new `/projects` page with foundation for project management
  - Empty state with call-to-action for new users
  - Responsive grid layout for future project display
  - Quick actions section with navigation to calculator and dashboard
  - Protected route with authentication requirements
  - TypeScript interfaces for project data structure

### Fixed
- **Dashboard Navigation**: Fixed non-functional buttons on dashboard page
  - "Start Calculating" button now properly navigates to `/calculator`
  - "View Projects" button now properly navigates to `/projects`
  - Added Next.js Link components for proper client-side navigation
  - Maintained existing styling and hover effects

### Changed
- **User Experience**: Improved navigation flow between dashboard, calculator, and projects
- **Documentation**: Updated project status, development plan, and technical architecture docs

### Technical Details
- **Files Modified**:
  - `src/app/dashboard/page.tsx` - Added Link components for navigation
  - `src/app/projects/page.tsx` - New projects page implementation
- **Files Updated**:
  - `docs/project-status.md` - Updated completion status and recent updates
  - `docs/development-plan.md` - Added projects page to app structure
  - `docs/technical-architecture.md` - Updated frontend architecture

## [0.1.0] - 2024-01-XX

### Added
- Initial MVP release with core calculator functionality
- User authentication system with registration and login
- Responsive design with mobile-first approach
- Comprehensive testing suite (Unit, E2E, Integration, Performance, Security, Accessibility)
- Password requirements and validation
- Amortization calculation engine
- User dashboard with account information
- Settings page for user preferences

### Technical Stack
- **Frontend**: Next.js 14+ with TypeScript and Tailwind CSS
- **Backend**: Node.js with Express and Prisma ORM
- **Database**: PostgreSQL with connection pooling
- **Testing**: Jest, Playwright, and comprehensive CI/CD pipeline
- **Authentication**: JWT-based auth with refresh tokens
- **Deployment**: Ready for production deployment

---

*This changelog follows the [Keep a Changelog](https://keepachangelog.com/) format and includes all significant changes to the AmCalc project.* 