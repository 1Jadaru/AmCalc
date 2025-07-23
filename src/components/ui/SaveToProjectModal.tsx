import React, { useEffect, useState } from 'react';
import { AmortizationResults } from '@/types/calculator.types';

type Project = { id: string; name: string };

interface SaveToProjectModalProps {
  open: boolean;
  onClose: () => void;
  schedule: any[]; // Adjust type as needed
  results?: AmortizationResults;
}

const SaveToProjectModal: React.FC<SaveToProjectModalProps> = ({
  open,
  onClose,
  schedule,
  results,
}) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState('');
  const [customName, setCustomName] = useState('');
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const formatPercentage = (rate: number) => {
    return `${rate.toFixed(2)}%`;
  };

  useEffect(() => {
    if (open) {
      fetch('/api/projects', {
        credentials: 'include',
      })
        .then((res) => res.json())
        .then((response) => {
          if (response.success && response.data && response.data.projects) {
            setProjects(response.data.projects);
          } else {
            console.error('Failed to load projects:', response.error);
            setProjects([]);
          }
        })
        .catch((error) => {
          console.error('Error fetching projects:', error);
          setProjects([]);
        });
      
      // Generate suggested name when modal opens
      if (results) {
        const suggestedName = `Loan: $${results.summary.principal.toLocaleString()} at ${formatPercentage(results.summary.interestRate)} for ${results.summary.termYears} years`;
        setCustomName(suggestedName);
      }
    }
  }, [open, results]);

  const handleSave = async () => {
    if (!selectedProject) return;
    setLoading(true);
    setFeedback(null);
    
    // Debug logging
    console.log('Saving calculation with results:', results);
    console.log('Payment frequency from results:', results?.summary.paymentFrequency);
    console.log('Full results summary:', results?.summary);
    
    // Determine payment frequency from the schedule if not available in results
    let paymentFrequency = results?.summary.paymentFrequency || 'monthly';
    
    // If we have a schedule, try to determine frequency from the number of payments
    if (schedule && schedule.length > 0 && results?.summary.termYears) {
      const paymentsPerYear = schedule.length / results.summary.termYears;
      console.log('Calculated payments per year:', paymentsPerYear);
      
      // Map payments per year to frequency
      if (paymentsPerYear === 1) paymentFrequency = 'annually';
      else if (paymentsPerYear === 2) paymentFrequency = 'semiannually';
      else if (paymentsPerYear === 4) paymentFrequency = 'quarterly';
      else if (paymentsPerYear === 12) paymentFrequency = 'monthly';
      else if (paymentsPerYear === 24) paymentFrequency = 'semimonthly';
      else if (paymentsPerYear === 26) paymentFrequency = 'biweekly';
      else if (paymentsPerYear === 52) paymentFrequency = 'weekly';
      
      console.log('Determined payment frequency:', paymentFrequency);
    }
    
    const calculationData = {
      schedule,
      name: customName || (results ? `Loan: $${results.summary.principal.toLocaleString()} at ${formatPercentage(results.summary.interestRate)} for ${results.summary.termYears} years` : 'Saved Calculation'),
      principal: results?.summary.principal || 0,
      interest_rate: results?.summary.interestRate ? results.summary.interestRate / 100 : 0, // Convert percentage to decimal for database storage
      term_years: results?.summary.termYears || 0,
      payment_frequency: paymentFrequency,
      payment_amount: results?.paymentAmount || null,
      total_interest: results?.totalInterest || null,
      total_payments: results?.totalPayments || null,
      metadata: {
        numberOfPayments: results?.summary.numberOfPayments || 0,
        originalInputs: results?.summary || {},
      },
    };

    console.log('Sending calculation data:', calculationData);

    const res = await fetch(`/api/projects/${selectedProject}/calculations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(calculationData),
    });
    
    console.log('Response status:', res.status);
    console.log('Response headers:', Object.fromEntries(res.headers.entries()));
    
    setLoading(false);
    
    if (res.ok) {
      const responseData = await res.json();
      console.log('Success response:', responseData);
      setFeedback('Calculation saved!');
      setTimeout(onClose, 1000);
    } else {
      const errorData = await res.text();
      console.error('Error response:', errorData);
      console.error('Response status:', res.status);
      setFeedback('Failed to save. Try again.');
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h2 className="text-lg font-bold mb-4">Save Calculation to Project</h2>
        
        {/* Custom Name Input */}
        <div className="mb-4">
          <label className="block mb-2 font-medium">Calculation Name</label>
          <input
            type="text"
            value={customName}
            onChange={(e) => setCustomName(e.target.value)}
            placeholder="Enter a name for this calculation"
            className="w-full border rounded px-3 py-2 text-sm"
          />
        </div>
        
        {/* Project Selection */}
        <div className="mb-4">
          <label className="block mb-2 font-medium">Select Project</label>
          <select
            className="w-full border rounded px-3 py-2"
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
          >
            <option value="">-- Select a project --</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
        
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg w-full"
          onClick={handleSave}
          disabled={!selectedProject || loading}
        >
          {loading ? 'Saving...' : 'Save'}
        </button>
        {feedback && (
          <div className="mt-2 text-center text-sm text-green-600">{feedback}</div>
        )}
        <button
          className="mt-4 text-sm text-gray-500 hover:underline w-full"
          onClick={onClose}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default SaveToProjectModal; 