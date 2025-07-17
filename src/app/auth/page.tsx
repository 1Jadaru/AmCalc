'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LoginForm } from '../../components/forms/auth/LoginForm';
import { RegisterForm } from '../../components/forms/auth/RegisterForm';
import { PasswordResetForm } from '../../components/forms/auth/PasswordResetForm';
import { OptionalAuthRoute } from '../../components/auth/ProtectedRoute';
import { useAuth } from '../../contexts/auth.context';

export default function AuthPage() {
  const [authMode, setAuthMode] = useState<'login' | 'register' | 'reset'>('login');
  const router = useRouter();
  const { clearError } = useAuth();

  const handleAuthSuccess = () => {
    router.push('/dashboard');
  };

  const handleSwitchToLogin = () => {
    clearError(); // Clear any existing errors
    setAuthMode('login');
  };

  const handleSwitchToRegister = () => {
    clearError(); // Clear any existing errors
    setAuthMode('register');
  };

  const handleForgotPassword = () => {
    clearError(); // Clear any existing errors
    setAuthMode('reset');
  };

  return (
    <OptionalAuthRoute
      authenticatedFallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-600">You are already logged in.</p>
            <button
              onClick={() => router.push('/dashboard')}
              className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      }
    >
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">AmCalc</h1>
            <p className="mt-2 text-sm text-gray-600">
              Professional Amortization Calculator
            </p>
          </div>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          {authMode === 'login' && (
            <LoginForm
              onSuccess={handleAuthSuccess}
              onSwitchToRegister={handleSwitchToRegister}
              onForgotPassword={handleForgotPassword}
            />
          )}
          {authMode === 'register' && (
            <RegisterForm
              onSuccess={handleAuthSuccess}
              onSwitchToLogin={handleSwitchToLogin}
            />
          )}
          {authMode === 'reset' && (
            <PasswordResetForm
              onSuccess={handleAuthSuccess}
              onBackToLogin={handleSwitchToLogin}
            />
          )}
        </div>

        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </OptionalAuthRoute>
  );
} 