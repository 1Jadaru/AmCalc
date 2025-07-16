# AmCalc - Professional Amortization Calculator SaaS

A modern, mobile-first amortization calculator built with Next.js, TypeScript, and Tailwind CSS. Designed for individuals, small business owners, and real estate investors to model loans, organize scenarios, and make informed financial decisions.

## 🚀 Features

- **Professional Loan Calculations**: Accurate amortization tables and payment calculations
- **Project Organization**: Create and manage projects for different loan types
- **Scenario Management**: Save and compare multiple loan scenarios
- **Mobile-First Design**: Responsive interface optimized for all devices
- **User Accounts**: Secure authentication and data persistence
- **Offline Capabilities**: Basic calculations work without internet connectivity

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
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

### 4. Run the development server

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
│   ├── layout/            # Layout components
│   └── features/          # Feature-specific components
│       ├── calculator/    # Calculator components
│       ├── projects/      # Project management
│       └── scenarios/     # Scenario management
├── hooks/                 # Custom React hooks
├── utils/                 # Utility functions
├── types/                 # TypeScript type definitions
└── styles/                # Global styles
```

## 🧪 Testing

```bash
# Run unit tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run end-to-end tests
npm run test:e2e
```

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

### Testing Standards
- Unit tests for all business logic
- 90%+ test coverage requirement
- Integration tests for API endpoints
- End-to-end tests for critical workflows

### Git Workflow
- Feature branches from main
- Conventional commit messages
- Code review before merging

## 📚 Documentation

- [Product Requirements Document](./docs/prd/)
- [Technical Architecture](./docs/architecture/)
- [Development Plan](./docs/development-plan.md)
- [Business Model](./docs/business-model.md)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support, email support@amcalc.com or create an issue in this repository.

---

**Built with ❤️ using Next.js, TypeScript, and Tailwind CSS**
