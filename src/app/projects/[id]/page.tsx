"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../../../contexts/auth.context";
import { ProtectedRoute } from "../../../components/auth/ProtectedRoute";

interface Scenario {
  id: string;
  name: string;
  principal: number | string;
  interest_rate: number | string;
  term_years: number;
  payment_frequency: string;
  payment_amount: number | string | null;
  total_interest: number | string | null;
  total_payments: number | string | null;
  amortization_schedule: any[];
  created_at: string;
  updated_at: string;
}

interface Project {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  scenarioCount: number;
  scenarios: Scenario[];
}

export default function ProjectDetailPage() {
  const params = useParams();
  const { user } = useAuth();
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingScenarioId, setDeletingScenarioId] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [scenarioToDelete, setScenarioToDelete] = useState<Scenario | null>(null);

  const projectId = params.id as string;

  useEffect(() => {
    const fetchProject = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/projects/${projectId}`, {
          credentials: "include",
        });
        if (!res.ok) {
          throw new Error("Failed to load project");
        }
        const data = await res.json();
        setProject(data);
      } catch (err: any) {
        setError(err.message || "Failed to load project.");
      } finally {
        setIsLoading(false);
      }
    };
    if (user && projectId) fetchProject();
  }, [user, projectId]);

  const handleDeleteClick = (scenario: Scenario) => {
    setScenarioToDelete(scenario);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!scenarioToDelete) return;

    setDeletingScenarioId(scenarioToDelete.id);
    try {
      const res = await fetch(`/api/scenarios/${scenarioToDelete.id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!res.ok) {
        throw new Error('Failed to delete calculation');
      }

      // Remove the scenario from the local state
      if (project) {
        setProject({
          ...project,
          scenarios: project.scenarios.filter(s => s.id !== scenarioToDelete.id),
          scenarioCount: project.scenarioCount - 1
        });
      }

      setShowDeleteModal(false);
      setScenarioToDelete(null);
    } catch (err: any) {
      console.error('Error deleting scenario:', err);
      setError(err.message || 'Failed to delete calculation');
    } finally {
      setDeletingScenarioId(null);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setScenarioToDelete(null);
  };

  const downloadCSV = (scenario: Scenario) => {
    if (!scenario.amortization_schedule || scenario.amortization_schedule.length === 0) {
      alert('No amortization schedule available for download');
      return;
    }

    // Create CSV with loan summary at the top
    const loanSummary = [
      `Loan Summary for: ${scenario.name}`,
      `Principal: ${formatCurrency(scenario.principal)}`,
      `Interest Rate: ${formatPercentage(scenario.interest_rate)}`,
      `Term: ${scenario.term_years} years`,
      `Payment Frequency: ${scenario.payment_frequency}`,
      `Monthly Payment: ${formatCurrency(scenario.payment_amount)}`,
      `Total Interest: ${formatCurrency(scenario.total_interest)}`,
      `Total Payments: ${formatCurrency(scenario.total_payments)}`,
      `Generated on: ${new Date().toLocaleDateString()}`,
      '', // Empty line for spacing
    ];

    const headers = ['Payment #', 'Payment Amount', 'Principal', 'Interest', 'Remaining Balance'];
    const csvContent = [
      ...loanSummary,
      headers.join(','),
      ...scenario.amortization_schedule.map((row: any) => [
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
    a.download = `${scenario.name.replace(/[^a-zA-Z0-9]/g, '_')}-amortization-schedule.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const formatCurrency = (amount: number | string | null) => {
    if (amount === null || amount === undefined) return '$0';
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    if (isNaN(numAmount)) return '$0';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(numAmount);
  };

  const formatPercentage = (rate: number | string | null) => {
    if (rate === null || rate === undefined) return '0.00%';
    let numRate = typeof rate === 'string' ? parseFloat(rate) : rate;
    if (isNaN(numRate)) return '0.00%';
    // If the value is > 1, assume it's already a percentage
    if (numRate > 1) return `${numRate.toFixed(2)}%`;
    // Otherwise, treat as decimal and convert
    return `${(numRate * 100).toFixed(2)}%`;
  };

  if (isLoading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </ProtectedRoute>
    );
  }

  if (error) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="bg-white p-8 rounded shadow text-center">
            <h2 className="text-xl font-bold mb-2 text-red-600">Error</h2>
            <p className="mb-4 text-gray-700">{error}</p>
            <Link href="/projects" className="text-blue-600 hover:underline">Back to Projects</Link>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (!project) return null;

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto py-8 px-4">
          <Link href="/projects" className="text-blue-600 hover:underline mb-6 inline-block">&larr; Back to Projects</Link>
          
          {/* Project Header */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{project.name}</h1>
            {project.description && (
              <p className="text-gray-700 mb-4">{project.description}</p>
            )}
            <div className="flex flex-wrap gap-4 text-sm text-gray-500">
              <span>Created: {new Date(project.createdAt).toLocaleDateString()}</span>
              <span>Updated: {new Date(project.updatedAt).toLocaleDateString()}</span>
              <span className="font-medium text-blue-600">{project.scenarioCount} calculation{project.scenarioCount !== 1 ? 's' : ''}</span>
            </div>
          </div>

          {/* Scenarios/Calculations */}
          {project.scenarios.length > 0 ? (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">Saved Calculations</h2>
              {project.scenarios.map((scenario) => (
                <div key={scenario.id} className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900">{scenario.name}</h3>
                      <span className="text-sm text-gray-500">
                        {new Date(scenario.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleDeleteClick(scenario)}
                        disabled={deletingScenarioId === scenario.id}
                        className="ml-4 px-3 py-1 text-sm bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white rounded-lg transition-colors duration-200 flex items-center gap-1"
                      >
                        {deletingScenarioId === scenario.id ? (
                          <>
                            <div className="animate-spin rounded-full h-3 w-3 border-b border-white"></div>
                            Deleting...
                          </>
                        ) : (
                          <>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Delete
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => downloadCSV(scenario)}
                        className="ml-2 px-3 py-1 text-sm bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200 flex items-center gap-1"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        CSV
                      </button>
                    </div>
                  </div>
                  
                  {/* Calculation Summary */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-sm text-gray-600">Principal</div>
                      <div className="text-lg font-semibold">{formatCurrency(scenario.principal)}</div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-sm text-gray-600">Interest Rate</div>
                      <div className="text-lg font-semibold">{formatPercentage(scenario.interest_rate)}</div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-sm text-gray-600">Term</div>
                      <div className="text-lg font-semibold">{scenario.term_years} years</div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-sm text-gray-600">Payment Frequency</div>
                      <div className="text-lg font-semibold capitalize">{scenario.payment_frequency}</div>
                    </div>
                  </div>

                  {/* Results Summary */}
                  {scenario.payment_amount && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <div className="text-sm text-blue-600">Monthly Payment</div>
                        <div className="text-lg font-semibold text-blue-900">{formatCurrency(scenario.payment_amount)}</div>
                      </div>
                      {scenario.total_interest && (
                        <div className="bg-green-50 p-4 rounded-lg">
                          <div className="text-sm text-green-600">Total Interest</div>
                          <div className="text-lg font-semibold text-green-900">{formatCurrency(scenario.total_interest)}</div>
                        </div>
                      )}
                      {scenario.total_payments && (
                        <div className="bg-purple-50 p-4 rounded-lg">
                          <div className="text-sm text-purple-600">Total Payments</div>
                          <div className="text-lg font-semibold text-purple-900">{formatCurrency(scenario.total_payments)}</div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Amortization Schedule Preview */}
                  {scenario.amortization_schedule && scenario.amortization_schedule.length > 0 && (
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-3">Amortization Schedule Preview</h4>
                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse border border-gray-200">
                          <thead>
                            <tr className="bg-gray-50">
                              <th className="border border-gray-200 px-3 py-2 text-left text-sm font-medium text-gray-700">Payment #</th>
                              <th className="border border-gray-200 px-3 py-2 text-left text-sm font-medium text-gray-700">Payment</th>
                              <th className="border border-gray-200 px-3 py-2 text-left text-sm font-medium text-gray-700">Principal</th>
                              <th className="border border-gray-200 px-3 py-2 text-left text-sm font-medium text-gray-700">Interest</th>
                              <th className="border border-gray-200 px-3 py-2 text-left text-sm font-medium text-gray-700">Balance</th>
                            </tr>
                          </thead>
                          <tbody>
                            {scenario.amortization_schedule.slice(0, 5).map((row: any, index: number) => (
                              <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                <td className="border border-gray-200 px-3 py-2 text-sm">{row.paymentNumber}</td>
                                <td className="border border-gray-200 px-3 py-2 text-sm font-medium">{formatCurrency(row.paymentAmount)}</td>
                                <td className="border border-gray-200 px-3 py-2 text-sm text-green-600">{formatCurrency(row.principalPayment)}</td>
                                <td className="border border-gray-200 px-3 py-2 text-sm text-red-600">{formatCurrency(row.interestPayment)}</td>
                                <td className="border border-gray-200 px-3 py-2 text-sm">{formatCurrency(row.remainingBalance)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        {scenario.amortization_schedule.length > 5 && (
                          <div className="text-center text-sm text-gray-500 mt-2">
                            Showing first 5 payments of {scenario.amortization_schedule.length} total payments
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <div className="text-gray-400 text-lg font-medium mb-2">No Calculations Yet</div>
              <p className="text-gray-500 mb-4">This project doesn't have any saved calculations yet.</p>
              <Link href="/calculator" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
                Create Your First Calculation
              </Link>
            </div>
          )}

          {/* Delete Confirmation Modal */}
          {showDeleteModal && scenarioToDelete && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg p-6 max-w-md w-full">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Delete Calculation</h3>
                <p className="text-gray-700 mb-6">
                  Are you sure you want to delete "{scenarioToDelete.name}"? This action cannot be undone.
                </p>
                <div className="flex gap-3 justify-end">
                  <button
                    onClick={handleDeleteCancel}
                    className="px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteConfirm}
                    disabled={deletingScenarioId === scenarioToDelete.id}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white rounded-lg transition-colors duration-200"
                  >
                    {deletingScenarioId === scenarioToDelete.id ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
} 