// Calculator Types and Interfaces for AmCalc

export interface AmortizationInputs {
  principal: number;        // Loan amount (e.g., 200000)
  interestRate: number;     // Annual interest rate (e.g., 3.5)
  termYears: number;        // Loan term in years (e.g., 30)
  paymentFrequency?: string; // Default: 'monthly'
  startDate?: Date;         // Optional loan start date
}

export interface AmortizationResults {
  paymentAmount: number;    // Monthly payment amount
  totalInterest: number;    // Total interest paid
  totalPayments: number;    // Total payments made
  schedule: PaymentRow[];   // Complete amortization table
  summary: {
    principal: number;
    interestRate: number;
    termYears: number;
    numberOfPayments: number;
  };
}

export interface PaymentRow {
  paymentNumber: number;
  paymentAmount: number;
  principalPayment: number;
  interestPayment: number;
  remainingBalance: number;
}

export interface CalculatorServiceInterface {
  calculateAmortization(inputs: AmortizationInputs): Promise<AmortizationResults>;
  calculateMonthlyPayment(inputs: AmortizationInputs): number;
  validateInputs(inputs: AmortizationInputs): CalculatorValidationResult;
}

export interface CalculatorFormProps {
  initialValues?: Partial<AmortizationInputs>;
  onCalculate: (results: AmortizationResults) => void;
  onSave?: (scenario: any) => void;
  isLoading?: boolean;
}

export interface ResultsDisplayProps {
  results: AmortizationResults | null;
  isLoading?: boolean;
  error?: string | null;
}

export interface AmortizationTableProps {
  schedule: PaymentRow[];
  isLoading?: boolean;
  currentPage?: number;
  itemsPerPage?: number;
  onPageChange?: (page: number) => void;
}

export interface CalculatorAPIResponse {
  success: boolean;
  data?: AmortizationResults;
  error?: string;
}

// Validation error types
export interface ValidationError {
  field: string;
  message: string;
}

export interface CalculatorValidationResult {
  isValid: boolean;
  errors: ValidationError[];
} 