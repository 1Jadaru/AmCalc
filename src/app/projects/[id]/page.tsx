"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../../../contexts/auth.context";
import { ProtectedRoute } from "../../../components/auth/ProtectedRoute";

interface Project {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  scenarioCount: number;
}

export default function ProjectDetailPage() {
  const params = useParams();
  const { user } = useAuth();
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
        <div className="max-w-2xl mx-auto py-12 px-4">
          <Link href="/projects" className="text-blue-600 hover:underline mb-4 inline-block">&larr; Back to Projects</Link>
          <div className="bg-white rounded-lg shadow p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{project.name}</h1>
            <p className="text-gray-700 mb-4">{project.description}</p>
            <div className="text-sm text-gray-500 mb-2">Created: {new Date(project.createdAt).toLocaleDateString()}</div>
            <div className="text-sm text-gray-500 mb-2">Updated: {new Date(project.updatedAt).toLocaleDateString()}</div>
            <div className="text-sm text-gray-500">Scenarios: {project.scenarioCount}</div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
} 