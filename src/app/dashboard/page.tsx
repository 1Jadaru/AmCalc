'use client';

import React from 'react';
import { useAuth } from '../../contexts/auth.context';
import { ProtectedRoute } from '../../components/auth/ProtectedRoute';
import Link from 'next/link';

export default function DashboardPage() {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                >
                  Logout
                </button>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6">
                <h2 className="text-lg font-semibold text-blue-900 mb-2">
                  Welcome, {user?.firstName || user?.email}!
                </h2>
                <p className="text-blue-700">
                  You are successfully logged in to AmCalc.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Loan Calculator
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Calculate loan payments and view amortization schedules.
                  </p>
                  <Link href="/calculator">
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                      Start Calculating
                    </button>
                  </Link>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    My Projects
                  </h3>
                  <p className="text-gray-600 mb-4">
                    View and manage your saved loan projects.
                  </p>
                  <Link href="/projects">
                    <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2">
                      View Projects
                    </button>
                  </Link>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Account Settings
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Update your profile and account preferences.
                  </p>
                  <Link href="/settings">
                    <button className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2">
                      Settings
                    </button>
                  </Link>
                </div>
              </div>

              <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Account Information
                </h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <p><strong>Email:</strong> {user?.email}</p>
                  <p><strong>Name:</strong> {user?.firstName} {user?.lastName}</p>
                  <p><strong>Member since:</strong> {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</p>
                  <p><strong>Last login:</strong> {user?.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'N/A'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
} 