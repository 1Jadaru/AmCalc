import { 
  AmortizationInputs, 
  AmortizationResults, 
  PaymentRow, 
  CalculatorServiceInterface,
  CalculatorValidationResult,
  ValidationError 
} from '../types/calculator.types';
import { amortizationInputsSchema } from '../utils/validation';

// Add mapping for payments per year
const paymentsPerYearMap: Record<string, number> = {
  annually: 1,
  semiannually: 2,
  quarterly: 4,
  semimonthly: 24,
  monthly: 12,
  biweekly: 26,
  weekly: 52,
};

export class CalculatorService implements CalculatorServiceInterface {
  private calculationCache = new Map<string, AmortizationResults>();

  /**
   * Calculate complete amortization schedule
   */
  async calculateAmortization(inputs: AmortizationInputs): Promise<AmortizationResults> {
    // Validate inputs
    const validation = this.validateInputs(inputs);
    if (!validation.isValid) {
      throw new Error(`Validation failed: ${validation.errors.map(e => e.message).join(', ')}`);
    }

    // Check cache for existing calculation
    const cacheKey = this.generateCacheKey(inputs);
    if (this.calculationCache.has(cacheKey)) {
      return this.calculationCache.get(cacheKey)!;
    }

    // Perform calculations
    const payment = this.calculatePayment(inputs);
    const schedule = this.generateAmortizationSchedule(inputs, payment);
    const totalPayments = payment * schedule.length;
    const totalInterest = totalPayments - inputs.principal;

    const results: AmortizationResults = {
      paymentAmount: payment,
      totalInterest,
      totalPayments,
      schedule,
      summary: {
        principal: inputs.principal,
        interestRate: inputs.interestRate,
        termYears: inputs.termYears,
        numberOfPayments: schedule.length,
        paymentFrequency: inputs.paymentFrequency || 'monthly',
      },
    };

    // Cache the results
    this.calculationCache.set(cacheKey, results);

    return results;
  }

  /**
   * Calculate payment using standard amortization formula for any frequency
   */
  calculatePayment(inputs: AmortizationInputs): number {
    const principal = inputs.principal;
    const paymentsPerYear = paymentsPerYearMap[inputs.paymentFrequency || 'monthly'];
    const periodRate = inputs.interestRate / paymentsPerYear / 100;
    const numberOfPayments = inputs.termYears * paymentsPerYear;

    if (periodRate === 0) {
      return principal / numberOfPayments;
    }

    const numerator = periodRate * Math.pow(1 + periodRate, numberOfPayments);
    const denominator = Math.pow(1 + periodRate, numberOfPayments) - 1;
    return principal * (numerator / denominator);
  }

  /**
   * For interface compatibility: calculate monthly payment (legacy)
   */
  calculateMonthlyPayment(inputs: AmortizationInputs): number {
    return this.calculatePayment({ ...inputs, paymentFrequency: 'monthly' });
  }

  /**
   * Validate calculator inputs using Zod schema
   */
  validateInputs(inputs: AmortizationInputs): CalculatorValidationResult {
    try {
      amortizationInputsSchema.parse(inputs);
      return { isValid: true, errors: [] };
    } catch (error: any) {
      const issues = error.issues || error.errors || [];
      const errors: ValidationError[] = issues.map((err: any) => ({
        field: err.path?.join('.') || '',
        message: err.message,
      }));
      return { isValid: false, errors };
    }
  }

  /**
   * Generate complete amortization schedule for any frequency
   */
  private generateAmortizationSchedule(inputs: AmortizationInputs, payment: number): PaymentRow[] {
    const schedule: PaymentRow[] = [];
    let remainingBalance = inputs.principal;
    const paymentsPerYear = paymentsPerYearMap[inputs.paymentFrequency || 'monthly'];
    const periodRate = inputs.interestRate / paymentsPerYear / 100;
    const numberOfPayments = inputs.termYears * paymentsPerYear;

    for (let paymentNumber = 1; paymentNumber <= numberOfPayments; paymentNumber++) {
      const interestPayment = remainingBalance * periodRate;
      const principalPayment = payment - interestPayment;
      remainingBalance = Math.max(0, remainingBalance - principalPayment);

      schedule.push({
        paymentNumber,
        paymentAmount: payment,
        principalPayment,
        interestPayment,
        remainingBalance,
      });
    }

    return schedule;
  }

  /**
   * Generate cache key for memoization
   */
  private generateCacheKey(inputs: AmortizationInputs): string {
    return `${inputs.principal}-${inputs.interestRate}-${inputs.termYears}-${inputs.paymentFrequency || 'monthly'}`;
  }

  /**
   * Clear calculation cache
   */
  clearCache(): void {
    this.calculationCache.clear();
  }

  /**
   * Get cache statistics
   */
  getCacheStats(): { size: number } {
    return { size: this.calculationCache.size };
  }
}

// Export singleton instance
export const calculatorService = new CalculatorService(); 