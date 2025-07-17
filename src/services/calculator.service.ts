import { 
  AmortizationInputs, 
  AmortizationResults, 
  PaymentRow, 
  CalculatorServiceInterface,
  CalculatorValidationResult,
  ValidationError 
} from '../types/calculator.types';
import { amortizationInputsSchema } from '../utils/validation';

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
    const monthlyPayment = this.calculateMonthlyPayment(inputs);
    const schedule = this.generateAmortizationSchedule(inputs, monthlyPayment);
    const totalPayments = monthlyPayment * schedule.length;
    const totalInterest = totalPayments - inputs.principal;

    const results: AmortizationResults = {
      paymentAmount: monthlyPayment,
      totalInterest,
      totalPayments,
      schedule,
      summary: {
        principal: inputs.principal,
        interestRate: inputs.interestRate,
        termYears: inputs.termYears,
        numberOfPayments: schedule.length,
      },
    };

    // Cache the results
    this.calculationCache.set(cacheKey, results);

    return results;
  }

  /**
   * Calculate monthly payment using standard amortization formula
   * P = L[c(1 + c)^n]/[(1 + c)^n - 1]
   */
  calculateMonthlyPayment(inputs: AmortizationInputs): number {
    const principal = inputs.principal;
    const monthlyRate = inputs.interestRate / 12 / 100;
    const numberOfPayments = inputs.termYears * 12;

    if (monthlyRate === 0) {
      return principal / numberOfPayments;
    }

    const numerator = monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments);
    const denominator = Math.pow(1 + monthlyRate, numberOfPayments) - 1;
    
    return principal * (numerator / denominator);
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
   * Generate complete amortization schedule
   */
  private generateAmortizationSchedule(inputs: AmortizationInputs, monthlyPayment: number): PaymentRow[] {
    const schedule: PaymentRow[] = [];
    let remainingBalance = inputs.principal;
    const monthlyRate = inputs.interestRate / 12 / 100;
    const numberOfPayments = inputs.termYears * 12;

    for (let paymentNumber = 1; paymentNumber <= numberOfPayments; paymentNumber++) {
      const interestPayment = remainingBalance * monthlyRate;
      const principalPayment = monthlyPayment - interestPayment;
      remainingBalance = Math.max(0, remainingBalance - principalPayment);

      schedule.push({
        paymentNumber,
        paymentAmount: monthlyPayment,
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