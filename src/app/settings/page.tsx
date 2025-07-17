'use client';

import React, { useState } from 'react';
import { useAuth } from '../../contexts/auth.context';
import { ProtectedRoute } from '../../components/auth/ProtectedRoute';
import { ProfileForm } from '../../components/forms/auth/ProfileForm';

export default function SettingsPage() {
  const { user, isAuthenticated, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'security'>('profile');

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
                <a href="/" className="text-3xl font-bold text-gray-900 hover:text-blue-600">
                  AmCalc
                </a>
                <span className="ml-2 text-sm text-gray-500">Professional Amortization Calculator</span>
              </div>
              <nav className="flex space-x-8">
                {isAuthenticated ? (
                  <>
                    <a
                      href="/dashboard"
                      className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                    >
                      Dashboard
                    </a>
                    <a
                      href="/projects"
                      className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                    >
                      Projects
                    </a>
                    <a
                      href="/calculator"
                      className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                    >
                      Calculator
                    </a>
                    <button
                      onClick={handleLogout}
                      className="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <a
                      href="/auth"
                      className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                    >
                      Sign In
                    </a>
                    <a
                      href="/auth"
                      className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
                    >
                      Get Started
                    </a>
                  </>
                )}
              </nav>
            </div>
          </div>
        </header>
        {/* Main Content */}
        <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="bg-white rounded-lg shadow">
              {/* Header */}
              <div className="px-6 py-4 border-b border-gray-200">
                <h1 className="text-2xl font-bold text-gray-900">Account Settings</h1>
                <p className="text-gray-600 mt-1">Manage your account preferences and security</p>
              </div>

              {/* Navigation Tabs */}
              <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8 px-6">
                  <button
                    onClick={() => setActiveTab('profile')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'profile'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Profile
                  </button>
                  <button
                    onClick={() => setActiveTab('security')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'security'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Security
                  </button>
                </nav>
              </div>

              {/* Content */}
              <div className="p-6">
                {activeTab === 'profile' && (
                  <div>
                    <div className="mb-6">
                      <h2 className="text-lg font-semibold text-gray-900 mb-2">Profile Information</h2>
                      <p className="text-gray-600">Update your personal information and account details.</p>
                    </div>
                    <ProfileForm />
                  </div>
                )}

                {activeTab === 'security' && (
                  <div>
                    <div className="mb-6">
                      <h2 className="text-lg font-semibold text-gray-900 mb-2">Security Settings</h2>
                      <p className="text-gray-600">Manage your account security and authentication.</p>
                    </div>

                    <div className="space-y-6">
                      {/* Account Information */}
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h3 className="text-md font-medium text-gray-900 mb-3">Account Information</h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Email:</span>
                            <span className="font-medium">{user?.email}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Member since:</span>
                            <span className="font-medium">
                              {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Last login:</span>
                            <span className="font-medium">
                              {user?.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'N/A'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Password Reset */}
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h3 className="text-md font-medium text-gray-900 mb-3">Password</h3>
                        <p className="text-sm text-gray-600 mb-3">
                          Update your password to keep your account secure.
                        </p>
                        <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                          Change Password
                        </button>
                      </div>

                      {/* Logout */}
                      <div className="bg-red-50 rounded-lg p-4">
                        <h3 className="text-md font-medium text-red-900 mb-3">Sign Out</h3>
                        <p className="text-sm text-red-700 mb-3">
                          Sign out of your account on this device.
                        </p>
                        <button
                          onClick={handleLogout}
                          className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                        >
                          Sign Out
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
} 