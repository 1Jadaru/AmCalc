import request from 'supertest';
import app from '@/test/setup';
import { AuthService } from '@/services/auth.service';
import { calculatorService } from '@/services/calculator.service';

describe('Calculator API', () => {
  let userToken: string;

  beforeAll(async () => {
    // Mock user and token
    const user = await AuthService.getUserById(1) || { id: 1, email: 'test@example.com', isActive: true };
    userToken = AuthService.generateTestToken(user); // Assume this helper exists for test
  });

  it('should require authentication', async () => {
    const response = await request(app)
      .post('/api/calculator/amortization')
      .send({ principal: 200000, interestRate: 3.5, termYears: 30 });
    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
  });

  it('should validate input and return error for invalid data', async () => {
    const response = await request(app)
      .post('/api/calculator/amortization')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ principal: -1000, interestRate: 3.5, termYears: 30 });
    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.error).toMatch(/Principal must be at least/);
  });

  it('should calculate amortization successfully', async () => {
    const response = await request(app)
      .post('/api/calculator/amortization')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ principal: 200000, interestRate: 3.5, termYears: 30 });
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.paymentAmount).toBeCloseTo(898.09, 2);
    expect(response.body.data.schedule.length).toBe(360);
  });
}); 