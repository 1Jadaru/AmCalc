# Security Architecture

## Authentication & Authorization
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

## Data Protection
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