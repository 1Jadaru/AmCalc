'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { amortizationInputsSchema } from '@/utils/validation';
import { AmortizationInputs } from '@/types/calculator.types';
import { AmortizationResults } from '@/types/calculator.types';

interface CalculatorFormProps {
  onCalculate: (results: AmortizationResults) => void;
  isLoading?: boolean;
  initialValues?: Partial<AmortizationInputs>;
}

export const CalculatorForm: React.FC<CalculatorFormProps> = ({
  onCalculate,
  isLoading = false,
  initialValues,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    setValue,
  } = useForm<AmortizationInputs>({
    resolver: zodResolver(amortizationInputsSchema),
    defaultValues: {
      principal: initialValues?.principal || 200000,
      interestRate: initialValues?.interestRate || 3.5,
      termYears: initialValues?.termYears || 30,
      paymentFrequency: initialValues?.paymentFrequency || 'monthly',
    },
    mode: 'onChange',
  });

  const watchedValues = watch();

  // Add state for formatted principal
  const [principalDisplay, setPrincipalDisplay] = useState(() =>
    (initialValues?.principal ?? 200000).toLocaleString()
  );

  // Handler for principal input change
  const handlePrincipalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9.]/g, '');
    setPrincipalDisplay(raw);
    setValue('principal', raw ? Number(raw) : 0, { shouldValidate: true });
  };

  // Format with commas on blur
  const handlePrincipalBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9.]/g, '');
    if (raw) {
      setPrincipalDisplay(Number(raw).toLocaleString());
    }
  };

  // Remove formatting on focus
  const handlePrincipalFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9.]/g, '');
    setPrincipalDisplay(raw);
  };

  // Client-side calculation functions
  const calculateMonthlyPayment = (inputs: AmortizationInputs): number => {
    const principal = inputs.principal;
    const monthlyRate = inputs.interestRate / 12 / 100;
    const numberOfPayments = inputs.termYears * 12;

    if (monthlyRate === 0) {
      return principal / numberOfPayments;
    }

    const numerator = monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments);
    const denominator = Math.pow(1 + monthlyRate, numberOfPayments) - 1;
    
    return principal * (numerator / denominator);
  };

  const generateAmortizationSchedule = (inputs: AmortizationInputs, monthlyPayment: number): any[] => {
    const schedule: any[] = [];
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
  };

  const calculateAmortization = async (inputs: AmortizationInputs): Promise<AmortizationResults> => {
    const monthlyPayment = calculateMonthlyPayment(inputs);
    const schedule = generateAmortizationSchedule(inputs, monthlyPayment);
    const totalPayments = monthlyPayment * schedule.length;
    const totalInterest = totalPayments - inputs.principal;

    return {
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
  };

  const onSubmit = async (data: AmortizationInputs) => {
    try {
      // Use client-side calculation for now
      const results = await calculateAmortization(data);
      onCalculate(results);
      
    } catch (error: any) {
      console.error('Calculation error:', error);
      // You might want to show a toast notification here
    }
  };

  const formatCurrency = (value: string) => {
    const numValue = parseFloat(value.replace(/[^0-9.]/g, ''));
    if (isNaN(numValue)) return '';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(numValue);
  };

  const formatPercentage = (value: string) => {
    const numValue = parseFloat(value.replace(/[^0-9.]/g, ''));
    if (isNaN(numValue)) return '';
    return `${numValue.toFixed(2)}%`;
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
        Loan Calculator
      </h2>
      
      {/* Info message about calculation method */}
      <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-800">
          💡 Guest mode: Calculations are performed locally
        </p>
      </div>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Principal Amount */}
        <div>
          <label htmlFor="principal" className="block text-sm font-medium text-gray-700 mb-2">
            Loan Amount
          </label>
          <div className="relative">
            <input
              type="text"
              id="principal"
              min="1000"
              max="10000000"
              placeholder="200000"
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                errors.principal ? 'border-red-500' : 'border-gray-300'
              }`}
              value={principalDisplay}
              onChange={handlePrincipalChange}
              onBlur={handlePrincipalBlur}
              onFocus={handlePrincipalFocus}
              inputMode="numeric"
              autoComplete="off"
            />
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <span className="text-gray-500 text-sm">$</span>
            </div>
          </div>
          {errors.principal && (
            <p className="mt-1 text-sm text-red-600">{errors.principal.message}</p>
          )}
        </div>

        {/* Interest Rate */}
        <div>
          <label htmlFor="interestRate" className="block text-sm font-medium text-gray-700 mb-2">
            Annual Interest Rate
          </label>
          <div className="relative">
            <input
              {...register('interestRate', {
                setValueAs: (value) => {
                  if (typeof value === 'string') {
                    return parseFloat(value.replace(/[^0-9.]/g, '')) || 0;
                  }
                  return parseFloat(String(value)) || 0;
                },
              })}
              type="number"
              id="interestRate"
              step="0.01"
              min="0.01"
              max="25"
              placeholder="3.5"
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                errors.interestRate ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <span className="text-gray-500 text-sm">%</span>
            </div>
          </div>
          {errors.interestRate && (
            <p className="mt-1 text-sm text-red-600">{errors.interestRate.message}</p>
          )}
        </div>

        {/* Loan Term */}
        <div>
          <label htmlFor="termYears" className="block text-sm font-medium text-gray-700 mb-2">
            Loan Term (Years)
          </label>
          <input
            {...register('termYears', { valueAsNumber: true })}
            type="number"
            id="termYears"
            min="1"
            max="50"
            placeholder="30"
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
              errors.termYears ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.termYears && (
            <p className="mt-1 text-sm text-red-600">{errors.termYears.message}</p>
          )}
        </div>

        {/* Payment Frequency */}
        <div>
          <label htmlFor="paymentFrequency" className="block text-sm font-medium text-gray-700 mb-2">
            Payment Frequency
          </label>
          <select
            {...register('paymentFrequency')}
            id="paymentFrequency"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          >
            <option value="monthly">Monthly</option>
            <option value="biweekly">Bi-weekly</option>
            <option value="weekly">Weekly</option>
          </select>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!isValid || isLoading}
          className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-colors ${
            isValid && !isLoading
              ? 'bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
              : 'bg-gray-400 cursor-not-allowed'
          }`}
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Calculating...
            </div>
          ) : (
            'Calculate Payment'
          )}
        </button>
      </form>

      {/* Real-time Preview */}
      {isValid && watchedValues.principal && watchedValues.interestRate && watchedValues.termYears && (
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="text-sm font-medium text-blue-900 mb-2">Quick Preview</h3>
          <div className="text-sm text-blue-800">
            <p>Loan Amount: ${watchedValues.principal.toLocaleString()}</p>
            <p>Interest Rate: {watchedValues.interestRate}%</p>
            <p>Term: {watchedValues.termYears} years</p>
          </div>
        </div>
      )}
    </div>
  );
}; 