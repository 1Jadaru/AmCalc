'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/auth.context';
import { ProtectedRoute } from '../../components/auth/ProtectedRoute';
import Link from 'next/link';

interface Project {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  scenarioCount: number;
}

export default function ProjectsPage() {
  const { user, isAuthenticated, logout } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newProject, setNewProject] = useState({ name: '', description: '' });
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    const fetchProjects = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/projects', {
          credentials: 'include',
        });
        if (!res.ok) throw new Error('Failed to load projects');
        const data = await res.json();
        setProjects(data);
      } catch (err) {
        setError('Failed to load projects.');
      } finally {
        setIsLoading(false);
      }
    };
    if (user) fetchProjects();
  }, [user]);

  const handleCreateProject = () => {
    setShowCreateModal(true);
  };

  const handleCloseModal = () => {
    setShowCreateModal(false);
    setNewProject({ name: '', description: '' });
  };

  const handleSubmitProject = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newProject.name.trim()) {
      setError('Project name is required');
      return;
    }

    setIsCreating(true);
    setError(null);

    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ name: newProject.name, description: newProject.description }),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to create project');
      }
      const created = await res.json();
      setProjects(prev => [created, ...prev]);
      handleCloseModal();
    } catch (error: any) {
      setError(error?.message || 'Failed to create project. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (isLoading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </ProtectedRoute>
    );
  }

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
                      href="/dashboard"
                      className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                    >
                      Dashboard
                    </Link>
                    <Link
                      href="/calculator"
                      className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                    >
                      Calculator
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
                My Projects
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Manage your loan calculation projects and scenarios. Organize your calculations, 
                save different scenarios, and track your financial planning.
              </p>
            </div>

            {/* Projects Content */}
            <div className="px-4">
              {/* Projects Header */}
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    My Projects
                  </h2>
                  <p className="text-gray-600 mt-1">
                    {projects.length === 0 ? 'No projects yet' : `${projects.length} project${projects.length === 1 ? '' : 's'}`}
                  </p>
                </div>
                <button
                  onClick={handleCreateProject}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Create Project
                </button>
              </div>

              {/* Projects Grid */}
              {projects.length === 0 ? (
                <div className="bg-white rounded-lg shadow p-8 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No projects yet</h3>
                  <p className="text-gray-600 mb-6">
                    Create your first project to start organizing your loan calculations.
                  </p>
                  <div className="space-y-3">
                    <button
                      onClick={handleCreateProject}
                      className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                      Create Your First Project
                    </button>
                    <div>
                      <Link href="/calculator" className="text-blue-600 hover:text-blue-700 font-medium">
                        Or start with a quick calculation →
                      </Link>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {projects.map((project) => (
                    <div key={project.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">{project.name}</h3>
                        <button className="text-gray-400 hover:text-gray-600">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                          </svg>
                        </button>
                      </div>
                      <p className="text-gray-600 mb-4 line-clamp-2">{project.description}</p>
                      <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                        <span>{project.scenarioCount} scenarios</span>
                        <span>Updated {new Date(project.updatedAt).toLocaleDateString()}</span>
                      </div>
                      <div className="flex space-x-2">
                        <Link href={`/projects/${project.id}`} className="flex-1">
                          <button className="w-full bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-sm">
                            View Project
                          </button>
                        </Link>
                        <button className="px-3 py-2 text-gray-600 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 text-sm">
                          Edit
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Quick Actions */}
              <div className="mt-8 bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Link href="/calculator">
                    <button className="w-full bg-gray-100 text-gray-700 px-4 py-3 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 text-left">
                      <div className="flex items-center">
                        <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                        <div>
                          <div className="font-medium">New Calculation</div>
                          <div className="text-sm text-gray-500">Start a quick calculation</div>
                        </div>
                      </div>
                    </button>
                  </Link>
                  <Link href="/dashboard">
                    <button className="w-full bg-gray-100 text-gray-700 px-4 py-3 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 text-left">
                      <div className="flex items-center">
                        <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        <div>
                          <div className="font-medium">Back to Dashboard</div>
                          <div className="text-sm text-gray-500">Return to overview</div>
                        </div>
                      </div>
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Create Project Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-auto">
              <h2 className="text-xl font-bold text-gray-900">Create New Project</h2>
              <form onSubmit={handleSubmitProject}>
                <div className="mb-4">
                  <label htmlFor="projectName" className="block text-sm font-medium text-gray-700 mb-2">
                    Project Name *
                  </label>
                  <input
                    type="text"
                    id="projectName"
                    value={newProject.name}
                    onChange={(e) => setNewProject(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter project name"
                    required
                  />
                </div>
                <div className="mb-6">
                  <label htmlFor="projectDescription" className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    id="projectDescription"
                    value={newProject.description}
                    onChange={(e) => setNewProject(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter project description (optional)"
                    rows={3}
                  />
                </div>
                {error && (
                  <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                    {error}
                  </div>
                )}
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isCreating}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isCreating ? 'Creating...' : 'Create Project'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
} 