'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { CalculatorForm } from '@/components/features/calculator/CalculatorForm';
import { ResultsDisplay } from '@/components/features/calculator/ResultsDisplay';
import { AmortizationTable } from '@/components/features/calculator/AmortizationTable';
import { AmortizationResults } from '@/types/calculator.types';
import { useAuth } from '@/contexts/auth.context';

export default function CalculatorPage() {
  const [results, setResults] = useState<AmortizationResults | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated, user, logout } = useAuth();

  const handleCalculate = (calculationResults: AmortizationResults) => {
    setResults(calculationResults);
    setError(null);
  };

  const handleFormSubmit = async () => {
    setIsLoading(true);
    setError(null);
  };

  const handleFormError = (errorMessage: string) => {
    setError(errorMessage);
    setIsLoading(false);
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Link href="/" className="text-3xl font-bold text-gray-900 hover:text-blue-600">
                AmCalc
              </Link>
              <span className="ml-2 text-sm text-gray-500">Professional Amortization Calculator</span>
            </div>
            <nav className="flex space-x-8">
              {isAuthenticated ? (
                <>
                  <Link
                    href="/dashboard"
                    className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/projects"
                    className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Projects
                  </Link>
                  <Link
                    href="/settings"
                    className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Settings
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/auth"
                    className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/auth"
                    className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </nav>
          </div>
        </div>
      </header>

      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Amortization Calculator
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Calculate your monthly mortgage payments and view a complete amortization schedule. 
              See how much interest you'll pay over the life of your loan.
            </p>
          </div>

          {/* Main Calculator Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Calculator Form */}
            <div className="order-1 lg:order-1">
              <CalculatorForm
                onCalculate={handleCalculate}
                isLoading={isLoading}
              />
            </div>

            {/* Results Display */}
            <div className="order-2 lg:order-2">
              <ResultsDisplay
                results={results}
                isLoading={isLoading}
                error={error}
              />
            </div>
          </div>

          {/* Amortization Table */}
          {results && (
            <div className="mt-8">
              <AmortizationTable
                schedule={results.schedule}
                results={results}
                isLoading={isLoading}
              />
            </div>
          )}

          {/* Information Section */}
          <div className="mt-12 bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              About This Calculator
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  How It Works
                </h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Enter your loan amount, interest rate, and term</li>
                  <li>• Get instant calculation of your monthly payment</li>
                  <li>• View complete amortization schedule</li>
                  <li>• See total interest and payment breakdown</li>
                  <li>• Export results to CSV for your records</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Understanding Your Results
                </h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• <strong>Principal:</strong> The amount you borrowed</li>
                  <li>• <strong>Interest:</strong> The cost of borrowing money</li>
                  <li>• <strong>Monthly Payment:</strong> Your fixed monthly amount</li>
                  <li>• <strong>Amortization:</strong> How payments are split between principal and interest</li>
                  <li>• <strong>Total Interest:</strong> Total cost of borrowing over the loan term</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Tips Section */}
          <div className="mt-8 bg-blue-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-3">
              💡 Tips for Better Loan Terms
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-blue-800">
              <div>
                <strong>Lower Interest Rates:</strong> Even a small rate reduction can save thousands over the loan term.
              </div>
              <div>
                <strong>Shorter Terms:</strong> 15-year loans typically have lower rates and less total interest.
              </div>
              <div>
                <strong>Extra Payments:</strong> Making additional principal payments can significantly reduce total interest.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 