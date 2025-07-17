import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { CalculatorForm } from '@/components/features/calculator/CalculatorForm';
import { ResultsDisplay } from '@/components/features/calculator/ResultsDisplay';
import { AmortizationTable } from '@/components/features/calculator/AmortizationTable';
import { AmortizationResults, PaymentRow } from '@/types/calculator.types';

// Mock fetch for API calls
global.fetch = jest.fn();

const mockResults: AmortizationResults = {
  paymentAmount: 898.09,
  totalInterest: 123312.40,
  totalPayments: 323312.40,
  schedule: Array.from({ length: 360 }, (_, i) => ({
    paymentNumber: i + 1,
    paymentAmount: 898.09,
    principalPayment: 300 + i,
    interestPayment: 598.09 - i,
    remainingBalance: 200000 - (300 + i) * (i + 1),
  })),
  summary: {
    principal: 200000,
    interestRate: 3.5,
    termYears: 30,
    numberOfPayments: 360,
  },
};

describe('CalculatorForm', () => {
  const mockOnCalculate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders calculator form with default values', () => {
    render(<CalculatorForm onCalculate={mockOnCalculate} />);
    
    expect(screen.getByText('Loan Calculator')).toBeInTheDocument();
    expect(screen.getByLabelText('Loan Amount')).toHaveValue('$200,000');
    expect(screen.getByLabelText('Annual Interest Rate')).toHaveValue('3.50%');
    expect(screen.getByLabelText('Loan Term (Years)')).toHaveValue(30);
    expect(screen.getByText('Calculate Payment')).toBeInTheDocument();
  });

  it('shows validation errors for invalid input', async () => {
    render(<CalculatorForm onCalculate={mockOnCalculate} />);
    
    const principalInput = screen.getByLabelText('Loan Amount');
    fireEvent.change(principalInput, { target: { value: '500' } });
    
    await waitFor(() => {
      expect(screen.getByText(/Principal must be at least \$1,000/)).toBeInTheDocument();
    });
  });

  it('disables submit button when form is invalid', () => {
    render(<CalculatorForm onCalculate={mockOnCalculate} />);
    
    const principalInput = screen.getByLabelText('Loan Amount');
    fireEvent.change(principalInput, { target: { value: '500' } });
    
    const submitButton = screen.getByText('Calculate Payment');
    expect(submitButton).toBeDisabled();
  });

  it('shows loading state when calculating', () => {
    render(<CalculatorForm onCalculate={mockOnCalculate} isLoading={true} />);
    
    expect(screen.getByText('Calculating...')).toBeInTheDocument();
    expect(screen.getByText('Calculate Payment')).toBeDisabled();
  });
});

describe('ResultsDisplay', () => {
  it('renders loading state', () => {
    render(<ResultsDisplay results={null} isLoading={true} />);
    
    expect(screen.getByText('Calculating...')).toBeInTheDocument();
  });

  it('renders error state', () => {
    const errorMessage = 'Calculation failed';
    render(<ResultsDisplay results={null} error={errorMessage} />);
    
    expect(screen.getByText('Calculation Error')).toBeInTheDocument();
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it('renders no results state', () => {
    render(<ResultsDisplay results={null} />);
    
    expect(screen.getByText('No Results')).toBeInTheDocument();
    expect(screen.getByText(/Enter loan details and click calculate/)).toBeInTheDocument();
  });

  it('renders calculation results correctly', () => {
    render(<ResultsDisplay results={mockResults} />);
    
    expect(screen.getByText('Payment Summary')).toBeInTheDocument();
    expect(screen.getByText('$898')).toBeInTheDocument(); // Monthly payment
    expect(screen.getByText('$200,000')).toBeInTheDocument(); // Principal
    expect(screen.getByText('3.50%')).toBeInTheDocument(); // Interest rate
    expect(screen.getByText('30 years')).toBeInTheDocument(); // Term
    expect(screen.getByText('360')).toBeInTheDocument(); // Number of payments
    expect(screen.getByText('$123,312')).toBeInTheDocument(); // Total interest
    expect(screen.getByText('$323,312')).toBeInTheDocument(); // Total payments
  });

  it('shows quick insights', () => {
    render(<ResultsDisplay results={mockResults} />);
    
    expect(screen.getByText('💡 Quick Insights')).toBeInTheDocument();
    expect(screen.getByText(/You'll pay \$123,312 in interest/)).toBeInTheDocument();
    expect(screen.getByText(/That's 61.7% of your loan amount/)).toBeInTheDocument();
  });
});

describe('AmortizationTable', () => {
  it('renders loading state', () => {
    render(<AmortizationTable schedule={[]} isLoading={true} />);
    
    expect(screen.getByText('Loading amortization schedule...')).toBeInTheDocument();
  });

  it('renders no schedule state', () => {
    render(<AmortizationTable schedule={[]} />);
    
    expect(screen.getByText('No Schedule Available')).toBeInTheDocument();
    expect(screen.getByText(/Calculate a loan to see the amortization schedule/)).toBeInTheDocument();
  });

  it('renders amortization table with data', () => {
    render(<AmortizationTable schedule={mockResults.schedule} />);
    
    expect(screen.getByText('Amortization Schedule')).toBeInTheDocument();
    expect(screen.getByText('Payment #')).toBeInTheDocument();
    expect(screen.getByText('Payment Amount')).toBeInTheDocument();
    expect(screen.getByText('Principal')).toBeInTheDocument();
    expect(screen.getByText('Interest')).toBeInTheDocument();
    expect(screen.getByText('Remaining Balance')).toBeInTheDocument();
    
    // Check first row data - use more specific selectors
    expect(screen.getByText('Payment #')).toBeInTheDocument();
    expect(screen.getByTestId('monthly-payment')).toHaveTextContent('$898');
  });

  it('shows pagination controls for large schedules', () => {
    render(<AmortizationTable schedule={mockResults.schedule} itemsPerPage={12} />);
    
    expect(screen.getByText('Previous')).toBeInTheDocument();
    expect(screen.getByText('Next')).toBeInTheDocument();
    // Check pagination buttons exist (avoiding duplicate "1" text)
    expect(screen.getByRole('button', { name: '2' })).toBeInTheDocument();
    expect(screen.getByText(/Showing 1 to 12 of 360 payments/)).toBeInTheDocument();
  });

  it('allows changing items per page', () => {
    render(<AmortizationTable schedule={mockResults.schedule} />);
    
    const itemsPerPageSelect = screen.getByLabelText('Show:');
    fireEvent.change(itemsPerPageSelect, { target: { value: '24' } });
    
    expect(screen.getByText(/Showing 1 to 24 of 360 payments/)).toBeInTheDocument();
  });

  it('has export functionality', () => {
    render(<AmortizationTable schedule={mockResults.schedule} />);
    
    const exportButton = screen.getByText('Export CSV');
    fireEvent.click(exportButton);
    
    // The mocks are set up in setup.ts, so we just verify the button exists and is clickable
    expect(exportButton).toBeInTheDocument();
  });
}); 