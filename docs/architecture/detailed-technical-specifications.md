# Detailed Technical Specifications

## Frontend Architecture

### Technology Stack
- **Framework**: React 18+ with Next.js 14+
- **Language**: TypeScript 5.0+
- **Styling**: Tailwind CSS 3.0+
- **State Management**: Zustand (lightweight alternative to Redux)
- **Form Handling**: React Hook Form with Zod validation
- **Data Fetching**: SWR for client-side data fetching
- **Build Tool**: Next.js built-in bundler with Turbopack
- **Testing**: Jest + React Testing Library + Playwright

### Key Frontend Patterns

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

### Responsive Design Strategy
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

## Backend Architecture

### Technology Stack
- **Runtime**: Node.js 18+ LTS
- **Framework**: Express.js 4.18+
- **Language**: TypeScript 5.0+
- **Database**: PostgreSQL 15+ with Prisma ORM
- **Authentication**: JWT with refresh tokens
- **Validation**: Zod for runtime type validation
- **Testing**: Jest + Supertest
- **Logging**: Winston for structured logging

### API Design Patterns

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

### Database Schema Design

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