# Performance Architecture

## Frontend Performance
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

## Backend Performance
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

## Mobile Optimization
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