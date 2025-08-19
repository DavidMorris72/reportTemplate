"use client";
import { BarChart3, Upload, Download } from "lucide-react";
import Link from "next/link";
import React, { useState, useEffect } from "react";

import Header from "../../components/Header";

/**
 * Data Analysis Tool - Example Implementation
 *
 * This is an example of how to create a new tool page in your AI Toolkit.
 * Replace this with your actual data analysis functionality.
 */

const DataAnalysis = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [userRole, setUserRole] = useState<"user" | "admin" | null>(null);

  useEffect(() => {
    // Check authentication status
    const checkAuth = () => {
      const authenticated =
        localStorage.getItem("ai_toolkit_authenticated") === "true";
      const storedRole = localStorage.getItem("ai_toolkit_user_role") as
        | "user"
        | "admin"
        | null;
      setIsAuthenticated(authenticated);
      setUserRole(storedRole);
    };

    checkAuth();
  }, []);

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserRole(null);
    localStorage.removeItem("ai_toolkit_authenticated");
    localStorage.removeItem("ai_toolkit_user_role");
  };

  // Redirect to login if not authenticated
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Authentication Required
          </h1>
          <p className="text-gray-600 mb-6">
            Please log in to access this tool.
          </p>
          <Link
            href="/"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onLogout={handleLogout} userRole={userRole || "user"} />

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Page Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-lg mb-8 shadow-lg">
          <div className="flex items-center">
            <BarChart3 className="mr-4" size={40} />
            <div>
              <h1 className="text-3xl font-bold mb-2">Data Analysis Tool</h1>
              <p className="text-blue-100">
                Analyze and visualize your data with AI-powered insights
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Upload className="mr-3 text-blue-600" size={24} />
              Upload Data
            </h2>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <Upload className="mx-auto text-gray-400 mb-4" size={48} />
              <p className="text-gray-600 mb-2">
                Drag and drop your files here
              </p>
              <p className="text-sm text-gray-500 mb-4">
                Supports CSV, JSON, Excel files
              </p>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Choose Files
              </button>
            </div>
          </div>

          {/* Analysis Options */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <BarChart3 className="mr-3 text-green-600" size={24} />
              Analysis Options
            </h2>
            <div className="space-y-4">
              <div className="flex items-center p-3 border border-gray-200 rounded-lg">
                <input type="checkbox" id="descriptive" className="mr-3" />
                <label htmlFor="descriptive" className="flex-1">
                  <div className="font-medium">Descriptive Statistics</div>
                  <div className="text-sm text-gray-600">
                    Mean, median, mode, standard deviation
                  </div>
                </label>
              </div>
              <div className="flex items-center p-3 border border-gray-200 rounded-lg">
                <input type="checkbox" id="correlation" className="mr-3" />
                <label htmlFor="correlation" className="flex-1">
                  <div className="font-medium">Correlation Analysis</div>
                  <div className="text-sm text-gray-600">
                    Relationship between variables
                  </div>
                </label>
              </div>
              <div className="flex items-center p-3 border border-gray-200 rounded-lg">
                <input type="checkbox" id="visualization" className="mr-3" />
                <label htmlFor="visualization" className="flex-1">
                  <div className="font-medium">Data Visualization</div>
                  <div className="text-sm text-gray-600">Charts and graphs</div>
                </label>
              </div>
            </div>
            <button className="w-full bg-green-600 text-white py-3 rounded-lg mt-6 hover:bg-green-700 transition-colors">
              Start Analysis
            </button>
          </div>
        </div>

        {/* Results Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mt-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <Download className="mr-3 text-purple-600" size={24} />
            Analysis Results
          </h2>
          <div className="text-center py-12 text-gray-500">
            <BarChart3 size={64} className="mx-auto text-gray-300 mb-4" />
            <p>Upload data and run analysis to see results here</p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <Link
            href="/"
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            ← Back to Toolkit
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DataAnalysis;
