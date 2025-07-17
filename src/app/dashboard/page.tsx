'use client';

import React from 'react';
import { useAuth } from '../../contexts/auth.context';
import { ProtectedRoute } from '../../components/auth/ProtectedRoute';
import Link from 'next/link';

export default function DashboardPage() {
  const { user, isAuthenticated, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <ProtectedRoute>
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
                      href="/projects"
                      className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                    >
                      Projects
                    </Link>
                    <Link
                      href="/calculator"
                      className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                    >
                      Calculator
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
        {/* Main Content */}
        <div className="py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Hero Section */}
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Dashboard
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Get a quick overview of your loan projects, calculations, and account information. Easily navigate to your tools and manage your financial planning all in one place.
              </p>
            </div>
            {/* Page Content */}
            <div className="px-4 py-6 sm:px-0">
              <div className="bg-white rounded-lg shadow p-6">
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
      </div>
    </ProtectedRoute>
  );
} 