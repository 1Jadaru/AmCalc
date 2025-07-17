import { CalculatorService } from '../../services/calculator.service';
import { AmortizationInputs } from '../../types/calculator.types';

describe('CalculatorService', () => {
  let calculatorService: CalculatorService;

  beforeEach(() => {
    calculatorService = new CalculatorService();
  });

  describe('calculateMonthlyPayment', () => {
    it('should calculate monthly payment correctly for standard loan', () => {
      const inputs: AmortizationInputs = {
        principal: 200000,
        interestRate: 3.5,
        termYears: 30,
      };

      const result = calculatorService.calculateMonthlyPayment(inputs);
      expect(result).toBeCloseTo(898.09, 2);
    });

    it('should calculate monthly payment correctly for 0% interest', () => {
      const inputs: AmortizationInputs = {
        principal: 100000,
        interestRate: 0,
        termYears: 30,
      };

      const result = calculatorService.calculateMonthlyPayment(inputs);
      expect(result).toBeCloseTo(277.78, 2); // 100000 / (30 * 12)
    });

    it('should calculate monthly payment correctly for high interest rate', () => {
      const inputs: AmortizationInputs = {
        principal: 100000,
        interestRate: 10,
        termYears: 15,
      };

      const result = calculatorService.calculateMonthlyPayment(inputs);
      expect(result).toBeCloseTo(1074.61, 2);
    });

    it('should calculate monthly payment correctly for short term loan', () => {
      const inputs: AmortizationInputs = {
        principal: 50000,
        interestRate: 5,
        termYears: 5,
      };

      const result = calculatorService.calculateMonthlyPayment(inputs);
      expect(result).toBeCloseTo(943.56, 2);
    });
  });

  describe('validateInputs', () => {
    it('should validate correct inputs', () => {
      const inputs: AmortizationInputs = {
        principal: 200000,
        interestRate: 3.5,
        termYears: 30,
      };

      const result = calculatorService.validateInputs(inputs);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject negative principal', () => {
      const inputs: AmortizationInputs = {
        principal: -1000,
        interestRate: 3.5,
        termYears: 30,
      };

      const result = calculatorService.validateInputs(inputs);
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should reject principal below minimum', () => {
      const inputs: AmortizationInputs = {
        principal: 500,
        interestRate: 3.5,
        termYears: 30,
      };

      const result = calculatorService.validateInputs(inputs);
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should reject principal above maximum', () => {
      const inputs: AmortizationInputs = {
        principal: 15000000,
        interestRate: 3.5,
        termYears: 30,
      };

      const result = calculatorService.validateInputs(inputs);
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should reject negative interest rate', () => {
      const inputs: AmortizationInputs = {
        principal: 200000,
        interestRate: -1,
        termYears: 30,
      };

      const result = calculatorService.validateInputs(inputs);
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should reject interest rate below minimum', () => {
      const inputs: AmortizationInputs = {
        principal: 200000,
        interestRate: 0.05,
        termYears: 30,
      };

      const result = calculatorService.validateInputs(inputs);
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should reject interest rate above maximum', () => {
      const inputs: AmortizationInputs = {
        principal: 200000,
        interestRate: 30,
        termYears: 30,
      };

      const result = calculatorService.validateInputs(inputs);
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should reject non-integer term years', () => {
      const inputs: AmortizationInputs = {
        principal: 200000,
        interestRate: 3.5,
        termYears: 15.5,
      };

      const result = calculatorService.validateInputs(inputs);
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should reject term years below minimum', () => {
      const inputs: AmortizationInputs = {
        principal: 200000,
        interestRate: 3.5,
        termYears: 0,
      };

      const result = calculatorService.validateInputs(inputs);
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should reject term years above maximum', () => {
      const inputs: AmortizationInputs = {
        principal: 200000,
        interestRate: 3.5,
        termYears: 60,
      };

      const result = calculatorService.validateInputs(inputs);
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });
  });

  describe('calculateAmortization', () => {
    it('should calculate complete amortization schedule', async () => {
      const inputs: AmortizationInputs = {
        principal: 100000,
        interestRate: 5,
        termYears: 10,
      };

      const result = await calculatorService.calculateAmortization(inputs);

      expect(result.paymentAmount).toBeCloseTo(1060.66, 2);
      expect(result.totalInterest).toBeCloseTo(27278.62, 2);
      expect(result.totalPayments).toBeCloseTo(127278.62, 2);
      expect(result.schedule).toHaveLength(120); // 10 years * 12 months
      expect(result.summary.principal).toBe(100000);
      expect(result.summary.interestRate).toBe(5);
      expect(result.summary.termYears).toBe(10);
      expect(result.summary.numberOfPayments).toBe(120);
    });

    it('should validate inputs before calculation', async () => {
      const inputs: AmortizationInputs = {
        principal: -1000,
        interestRate: 3.5,
        termYears: 30,
      };

      await expect(calculatorService.calculateAmortization(inputs))
        .rejects.toThrow('Validation failed');
    });

    it('should use cache for repeated calculations', async () => {
      const inputs: AmortizationInputs = {
        principal: 100000,
        interestRate: 5,
        termYears: 10,
      };

      const result1 = await calculatorService.calculateAmortization(inputs);
      const result2 = await calculatorService.calculateAmortization(inputs);

      expect(result1).toEqual(result2);
      expect(calculatorService.getCacheStats().size).toBe(1);
    });

    it('should calculate amortization schedule correctly', async () => {
      const inputs: AmortizationInputs = {
        principal: 100000,
        interestRate: 5,
        termYears: 1,
      };

      const result = await calculatorService.calculateAmortization(inputs);

      // Check first payment
      expect(result.schedule[0].paymentNumber).toBe(1);
      expect(result.schedule[0].paymentAmount).toBeCloseTo(8560.75, 2);
      expect(result.schedule[0].interestPayment).toBeCloseTo(416.67, 2);
      expect(result.schedule[0].principalPayment).toBeCloseTo(8144.08, 2);
      expect(result.schedule[0].remainingBalance).toBeCloseTo(91855.92, 2);

      // Check last payment
      const lastPayment = result.schedule[result.schedule.length - 1];
      expect(lastPayment.paymentNumber).toBe(12);
      expect(lastPayment.remainingBalance).toBeCloseTo(0, 2);
    });
  });

  describe('cache management', () => {
    it('should clear cache', () => {
      calculatorService.clearCache();
      expect(calculatorService.getCacheStats().size).toBe(0);
    });

    it('should track cache size', async () => {
      const inputs1: AmortizationInputs = {
        principal: 100000,
        interestRate: 5,
        termYears: 10,
      };

      const inputs2: AmortizationInputs = {
        principal: 200000,
        interestRate: 3.5,
        termYears: 30,
      };

      await calculatorService.calculateAmortization(inputs1);
      await calculatorService.calculateAmortization(inputs2);

      expect(calculatorService.getCacheStats().size).toBe(2);
    });
  });
}); 