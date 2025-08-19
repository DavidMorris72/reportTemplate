"use client";
import { Home, Lock, ArrowLeft, Sparkles } from "lucide-react";
import Link from "next/link";
import React, { useState, useEffect } from "react";

/**
 * 404 Not Found Page
 *
 * Custom 404 page with conditional navigation based on authentication state.
 * Shows appropriate navigation options depending on whether user is logged in.
 */

const NotFoundPage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    // Check authentication status from localStorage
    const checkAuth = () => {
      const authenticated = localStorage.getItem("ba_authenticated") === "true";
      setIsAuthenticated(authenticated);
    };

    // Small delay to ensure DOM is ready
    setTimeout(checkAuth, 100);
  }, []);

  // Show loading while checking auth status
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-4 border-gray-200 border-t-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-gray-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center">
        {/* 404 Visual */}
        <div className="mb-8">
          <div className="relative inline-block">
            <h1 className="text-9xl font-bold text-gray-200 select-none">
              404
            </h1>
            <div className="absolute inset-0 flex items-center justify-center">
              <Sparkles className="text-red-600 animate-pulse" size={48} />
            </div>
          </div>
        </div>

        {/* Error Message */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Page Not Found
          </h2>
          <p className="text-lg text-gray-600 mb-2">
            The page you&apos;re looking for doesn&apos;t exist or has been
            moved.
          </p>
          <p className="text-sm text-gray-500">
            Don&apos;t worry, even the best AI systems sometimes take a wrong
            turn!
          </p>
        </div>

        {/* Navigation Options */}
        <div className="space-y-4">
          {isAuthenticated ? (
            // Authenticated user - show dashboard link
            <div className="space-y-4">
              <Link
                href="/"
                className="inline-flex items-center space-x-3 bg-gradient-to-r from-red-600 to-red-700 text-white px-8 py-4 rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <Home size={20} />
                <span>Return to Dashboard</span>
              </Link>

              <div className="text-center">
                <button
                  onClick={() => window.history.back()}
                  className="inline-flex items-center space-x-2 text-gray-600 hover:text-red-600 transition-colors duration-200"
                >
                  <ArrowLeft size={16} />
                  <span>Go Back</span>
                </button>
              </div>
            </div>
          ) : (
            // Unauthenticated user - show login link
            <div className="space-y-4">
              <Link
                href="/"
                className="inline-flex items-center space-x-3 bg-gradient-to-r from-red-600 to-red-700 text-white px-8 py-4 rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <Lock size={20} />
                <span>Go to Login</span>
              </Link>

              <div className="text-center">
                <button
                  onClick={() => window.history.back()}
                  className="inline-flex items-center space-x-2 text-gray-600 hover:text-red-600 transition-colors duration-200"
                >
                  <ArrowLeft size={16} />
                  <span>Go Back</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Helpful Links */}
        <div className="mt-12 p-6 bg-white rounded-2xl shadow-lg border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Popular Tools
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            {isAuthenticated ? (
              <>
                <Link
                  href="/requirements-refinement"
                  className="flex items-center space-x-2 text-gray-600 hover:text-red-600 transition-colors duration-200 p-2 rounded-lg hover:bg-red-50"
                >
                  <Sparkles size={16} />
                  <span>Requirements Refinement</span>
                </Link>
                <Link
                  href="/capacity-forecast"
                  className="flex items-center space-x-2 text-gray-600 hover:text-red-600 transition-colors duration-200 p-2 rounded-lg hover:bg-red-50"
                >
                  <Sparkles size={16} />
                  <span>Capacity Forecast</span>
                </Link>
              </>
            ) : (
              <div className="col-span-2 text-gray-500 text-center py-4">
                <Lock size={20} className="mx-auto mb-2" />
                <p>Please log in to access the AI Toolkit</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-xs text-gray-500">
          <p>
            © 2025 Frameworks AI Toolkit • Specialized for Building & Timber
            Industry ERP Development
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
