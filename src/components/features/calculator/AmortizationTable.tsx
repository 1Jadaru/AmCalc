'use client';

import React, { useState } from 'react';
import { PaymentRow, AmortizationResults } from '@/types/calculator.types';
import SaveToProjectModal from '../../ui/SaveToProjectModal';

interface AmortizationTableProps {
  schedule: PaymentRow[];
  results?: AmortizationResults;
  isLoading?: boolean;
  currentPage?: number;
  itemsPerPage?: number;
  onPageChange?: (page: number) => void;
}

export const AmortizationTable: React.FC<AmortizationTableProps> = ({
  schedule,
  results,
  isLoading = false,
  currentPage = 1,
  itemsPerPage = 12,
  onPageChange,
}) => {
  const [page, setPage] = useState(currentPage);
  const [itemsPerPageState, setItemsPerPageState] = useState(itemsPerPage);
  const [showSaveModal, setShowSaveModal] = useState(false);

  const totalPages = Math.ceil(schedule.length / itemsPerPageState);
  const startIndex = (page - 1) * itemsPerPageState;
  const endIndex = startIndex + itemsPerPageState;
  const currentSchedule = schedule.slice(startIndex, endIndex);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    onPageChange?.(newPage);
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPageState(newItemsPerPage);
    setPage(1);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const exportToCSV = () => {
    const headers = ['Payment #,Payment Amount', 'Principal', 'Interest', 'Remaining Balance'];
    const csvContent = [
      headers.join(','),
      ...schedule.map(row => [
        row.paymentNumber,
        Math.round(row.paymentAmount * 100) / 100,
        Math.round(row.principalPayment * 100) / 100,
        Math.round(row.interestPayment * 100) / 100,
        Math.round(row.remainingBalance * 100) / 100,
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `amortization-schedule-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="w-full bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-3"></div>
          <span className="text-gray-600">Loading amortization schedule...</span>
        </div>
      </div>
    );
  }

  if (!schedule.length) {
    return (
      <div className="w-full bg-white rounded-lg shadow-lg p-6">
        <div className="text-center py-8">
          <div className="text-gray-400 text-lg font-medium mb-2">No Schedule Available</div>
          <p className="text-gray-500">Calculate a loan to see the amortization schedule</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white rounded-lg shadow-lg p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4 sm:mb-0">
          Amortization Schedule
        </h2>
        
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Items per page selector */}
          <div className="flex items-center space-x-2">
            <label htmlFor="itemsPerPage" className="text-sm text-gray-600">
              Show:
            </label>
            <select
              id="itemsPerPage"
              value={itemsPerPageState}
              onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
              className="border border-gray-300 rounded px-2 py-1 text-sm"
            >
              <option value={12}>12 payments</option>
              <option value={24}>24 payments</option>
              <option value={60}>60 payments</option>
              <option value={120}>120 payments</option>
            </select>
          </div>

          {/* Export button */}
          <button
            onClick={exportToCSV}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            Export CSV
          </button>
          {/* Save to Project button */}
          <button
            onClick={() => setShowSaveModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            Save to Project
          </button>
        </div>
      </div>

      {/* Table Container with Horizontal Scroll */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-full border-collapse">
          <thead>
            <tr className="bg-gray-50">
              <th className="border border-gray-200 px-4 py-3 text-left text-sm font-medium text-gray-700">
                Payment #
              </th>
              <th className="border border-gray-200 px-4 py-3 text-left text-sm font-medium text-gray-700">
                Payment Amount
              </th>
              <th className="border border-gray-200 px-4 py-3 text-left text-sm font-medium text-gray-700">
                Principal
              </th>
              <th className="border border-gray-200 px-4 py-3 text-left text-sm font-medium text-gray-700">
                Interest
              </th>
              <th className="border border-gray-200 px-4 py-3 text-left text-sm font-medium text-gray-700">
                Remaining Balance
              </th>
            </tr>
          </thead>
          <tbody>
            {currentSchedule.map((row, index) => (
              <tr
                key={row.paymentNumber}
                className={`${
                  index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                } hover:bg-blue-50 transition-colors`}
              >
                <td className="border border-gray-200 px-4 py-3 text-sm text-gray-900">
                  {row.paymentNumber}
                </td>
                <td className="border border-gray-200 px-4 py-3 text-sm font-medium text-gray-900">
                  {formatCurrency(row.paymentAmount)}
                </td>
                <td className="border border-gray-200 px-4 py-3 text-sm text-green-600">
                  {formatCurrency(row.principalPayment)}
                </td>
                <td className="border border-gray-200 px-4 py-3 text-sm text-red-600">
                  {formatCurrency(row.interestPayment)}
                </td>
                <td className="border border-gray-200 px-4 py-3 text-sm text-gray-900">
                  {formatCurrency(row.remainingBalance)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-6">
          <div className="text-sm text-gray-600 mb-4 sm:mb-0">
            Showing {startIndex + 1} to {Math.min(endIndex, schedule.length)} of {schedule.length} payments
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                page === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              Previous
            </button>
            
            <div className="flex items-center space-x-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNumber = i + 1;
                return (
                  <button
                    key={pageNumber}
                    onClick={() => handlePageChange(pageNumber)}
                    className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      page === pageNumber
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {pageNumber}
                  </button>
                );
              })}
            </div>
            
            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={page === totalPages}
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                page === totalPages
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              Next
            </button>
          </div>
        </div>
      )}
      <SaveToProjectModal
        open={showSaveModal}
        onClose={() => setShowSaveModal(false)}
        schedule={schedule}
        results={results}
      />
    </div>
  );
}; 