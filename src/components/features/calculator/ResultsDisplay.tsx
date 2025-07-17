'use client';

import React from 'react';
import { AmortizationResults } from '@/types/calculator.types';

interface ResultsDisplayProps {
  results: AmortizationResults | null;
  isLoading?: boolean;
  error?: string | null;
}

export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({
  results,
  isLoading = false,
  error = null,
}) => {
  if (isLoading) {
    return (
      <div className="w-full max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-3"></div>
          <span className="text-gray-600">Calculating...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
        <div className="text-center py-8">
          <div className="text-red-500 text-lg font-medium mb-2">Calculation Error</div>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!results) {
    return (
      <div className="w-full max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
        <div className="text-center py-8">
          <div className="text-gray-400 text-lg font-medium mb-2">No Results</div>
          <p className="text-gray-500">Enter loan details and click calculate to see results</p>
        </div>
      </div>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatPercentage = (rate: number) => {
    return `${rate.toFixed(2)}%`;
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
        Payment Summary
      </h2>

      {/* Monthly Payment - Prominent Display */}
      <div className="bg-blue-50 rounded-lg p-6 mb-6">
        <div className="text-center">
          <div className="text-sm text-blue-600 font-medium mb-1">Monthly Payment</div>
          <div className="text-3xl font-bold text-blue-900" data-testid="monthly-payment">
            {formatCurrency(results.paymentAmount)}
          </div>
        </div>
      </div>

      {/* Loan Summary */}
      <div className="space-y-4 mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Loan Summary</h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-sm text-gray-600 mb-1">Principal</div>
            <div className="text-lg font-semibold text-gray-900">
              {formatCurrency(results.summary.principal)}
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-sm text-gray-600 mb-1">Interest Rate</div>
            <div className="text-lg font-semibold text-gray-900">
              {formatPercentage(results.summary.interestRate)}
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-sm text-gray-600 mb-1">Term</div>
            <div className="text-lg font-semibold text-gray-900">
              {results.summary.termYears} years
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-sm text-gray-600 mb-1">Payments</div>
            <div className="text-lg font-semibold text-gray-900">
              {results.summary.numberOfPayments}
            </div>
          </div>
        </div>
      </div>

      {/* Total Costs */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Total Costs</h3>
        
        <div className="space-y-3">
          <div className="flex justify-between items-center py-3 border-b border-gray-200">
            <span className="text-gray-600">Total Interest</span>
            <span className="text-lg font-semibold text-red-600">
              {formatCurrency(results.totalInterest)}
            </span>
          </div>
          
          <div className="flex justify-between items-center py-3 border-b border-gray-200">
            <span className="text-gray-600">Total Payments</span>
            <span className="text-lg font-semibold text-green-600">
              {formatCurrency(results.totalPayments)}
            </span>
          </div>
          
          <div className="flex justify-between items-center py-3">
            <span className="text-gray-600">Interest to Principal Ratio</span>
            <span className="text-lg font-semibold text-gray-900">
              {((results.totalInterest / results.summary.principal) * 100).toFixed(1)}%
            </span>
          </div>
        </div>
      </div>

      {/* Quick Insights */}
      <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
        <h4 className="text-sm font-medium text-yellow-900 mb-2">💡 Quick Insights</h4>
        <div className="text-sm text-yellow-800 space-y-1">
          <p>• You'll pay {formatCurrency(results.totalInterest)} in interest</p>
          <p>• That's {((results.totalInterest / results.summary.principal) * 100).toFixed(1)}% of your loan amount</p>
          <p>• Your first payment will be {formatCurrency(results.schedule[0]?.interestPayment || 0)} interest, {formatCurrency(results.schedule[0]?.principalPayment || 0)} principal</p>
        </div>
      </div>
    </div>
  );
}; 