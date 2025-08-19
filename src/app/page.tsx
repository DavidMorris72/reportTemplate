"use client";
import {
  Lock,
  Loader2,
  CheckCircle,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import Image from "next/image";
import React, { useState, useEffect, useCallback } from "react";

import Header from "../components/Header";
import ToolSection from "../components/ToolSection";

/**
 * AI Toolkit Landing Page
 *
 * The main landing page for the AI Toolkit, featuring a clean interface
 * with organized sections for various AI-powered tools.
 *
 * Features:
 * - Password-protected access to all tools
 * - Organized tool sections with different themes
 * - Professional branding and responsive design
 * - Role-based authentication (user/admin)
 */

const AIToolkit = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [currentUser, setCurrentUser] = useState<{
    id: string;
    email: string;
    name: string;
    role: "USER" | "ADMIN" | "SUPER_ADMIN";
  } | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  useEffect(() => {
    // Check if user is already authenticated (JWT token in localStorage)
    const checkAuth = () => {
      const token = localStorage.getItem("ai_toolkit_token");
      const userData = localStorage.getItem("ai_toolkit_user");

      if (token && userData) {
        try {
          const user = JSON.parse(userData);
          setIsAuthenticated(true);
          setCurrentUser(user);
        } catch (error) {
          console.error("Error parsing user data:", error);
          localStorage.removeItem("ai_toolkit_token");
          localStorage.removeItem("ai_toolkit_user");
          setIsAuthenticated(false);
        }
      } else {
        setIsAuthenticated(false);
      }
    };

    // Small delay to ensure DOM is ready
    setTimeout(checkAuth, 100);
  }, []);

  const handlePasswordSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setPasswordError("");
      setIsAuthenticating(true);

      try {
        const response = await fetch("/api/verify-password", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to verify credentials");
        }

        const { isValid, token, user } = await response.json();

        if (isValid && token && user) {
          setIsAuthenticated(true);
          setCurrentUser(user);
          localStorage.setItem("ai_toolkit_token", token);
          localStorage.setItem("ai_toolkit_user", JSON.stringify(user));
          setPasswordError("");
        } else {
          setPasswordError("Invalid credentials. Please try again.");
          setPassword("");
        }
      } catch (error: any) {
        console.error("Authentication error:", error);
        setPasswordError(
          error.message || "Error verifying credentials. Please try again.",
        );
        setPassword("");
      } finally {
        setIsAuthenticating(false);
      }
    },
    [email, password],
  );

  const handleLogout = useCallback(() => {
    console.log("Logging out...");
    setIsAuthenticated(false);
    setCurrentUser(null);
    localStorage.removeItem("ai_toolkit_token");
    localStorage.removeItem("ai_toolkit_user");
    setEmail("");
    setPassword("");
  }, []);

  // Tool definitions - customize these for your application
  const dataTools = [
    {
      title: "Data Analysis",
      description: "Analyze and visualize your data with AI-powered insights",
      href: "/data-analysis",
      comingSoon: false,
    },
    {
      title: "Data Import",
      description: "Import and process data from various sources",
      comingSoon: true,
    },
    {
      title: "Data Export",
      description: "Export processed data in multiple formats",
      comingSoon: true,
    },
  ];

  const generateTools = [
    {
      title: "Content Generator",
      description: "Generate content using AI language models",
      comingSoon: true,
    },
    {
      title: "Report Builder",
      description: "Create automated reports from your data",
      comingSoon: true,
    },
    {
      title: "Document Templates",
      description: "Generate documents from predefined templates",
      comingSoon: true,
    },
  ];

  const analyzeTools = [
    {
      title: "Text Analysis",
      description: "Analyze text for sentiment, topics, and insights",
      comingSoon: true,
    },
    {
      title: "Image Recognition",
      description: "Analyze and categorize images using AI",
      comingSoon: true,
    },
    {
      title: "Pattern Detection",
      description: "Detect patterns and anomalies in your data",
      comingSoon: true,
    },
  ];

  const automateTools = [
    {
      title: "Workflow Automation",
      description: "Automate repetitive tasks and workflows",
      comingSoon: true,
    },
    {
      title: "Email Processing",
      description: "Automatically process and categorize emails",
      comingSoon: true,
    },
    {
      title: "Scheduled Tasks",
      description: "Set up automated recurring tasks",
      comingSoon: true,
    },
  ];

  // Show enhanced loading while checking authentication
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-blue-600 mx-auto mb-6"></div>
            <Sparkles
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-blue-600"
              size={20}
            />
          </div>
          <p className="text-gray-600 font-medium">
            Initializing AI Toolkit...
          </p>
          <div className="mt-2 w-48 bg-gray-200 rounded-full h-1 mx-auto">
            <div
              className="bg-blue-600 h-1 rounded-full animate-pulse"
              style={{ width: "70%" }}
            ></div>
          </div>
        </div>
      </div>
    );
  }

  // Show enhanced password screen if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
          {/* Header with DMSI branding */}
          <div className="bg-gradient-to-r from-brand-primary to-brand-logo-red p-6 text-center">
            <div className="flex justify-center mb-4">
              <Image
                src="/dmsi-logo.svg"
                alt="DMSI Logo"
                width={150}
                height={40}
                className="h-10 w-auto filter brightness-0 invert"
                priority
              />
            </div>
            <h1 className="text-2xl font-bold text-white mb-1">AI Toolkit</h1>
            <p className="text-red-100 text-sm">Secure Access Portal</p>
          </div>

          <div className="p-8">
            <div className="text-center mb-6">
              <p className="text-gray-600 mb-4">
                Please authenticate to access the toolkit
              </p>
              <div className="flex justify-center space-x-2 mb-4">
                <div className="w-2 h-2 bg-brand-secondary-blue rounded-full animate-pulse"></div>
                <div
                  className="w-2 h-2 bg-brand-primary rounded-full animate-pulse"
                  style={{ animationDelay: "0.2s" }}
                ></div>
                <div
                  className="w-2 h-2 bg-brand-secondary-green rounded-full animate-pulse"
                  style={{ animationDelay: "0.4s" }}
                ></div>
              </div>
            </div>

            <form onSubmit={handlePasswordSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-secondary-blue focus:border-brand-secondary-blue transition-all duration-200 shadow-sm hover:shadow-md"
                  placeholder="Enter your email"
                  required
                  disabled={isAuthenticating}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-secondary-blue focus:border-brand-secondary-blue transition-all duration-200 shadow-sm hover:shadow-md"
                  placeholder="Enter your password"
                  required
                  disabled={isAuthenticating}
                />
              </div>

              {passwordError && (
                <div className="flex items-center space-x-2 text-red-600 text-sm bg-red-50 p-4 rounded-xl border border-red-200">
                  <AlertCircle size={16} />
                  <span>{passwordError}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isAuthenticating}
                className="w-full bg-gradient-to-r from-brand-primary to-brand-logo-red text-white py-4 px-4 rounded-xl hover:from-red-700 hover:to-red-600 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
              >
                {isAuthenticating ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    <span>Authenticating...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle size={20} />
                    <span>Access Toolkit</span>
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <div className="flex items-center justify-center space-x-2 text-xs text-gray-500">
                <Lock size={12} />
                <span>Secure authentication required</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <Header
        onLogout={handleLogout}
        userRole={
          currentUser?.role === "ADMIN"
            ? "admin"
            : currentUser?.role === "SUPER_ADMIN"
              ? "super_admin"
              : "user"
        }
      />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-brand-primary to-brand-logo-red text-white p-6 rounded-lg mb-8 shadow-lg">
          <div className="flex items-center">
            <div>
              <h1 className="text-3xl font-bold mb-2 flex items-center">
                <Sparkles className="mr-3" size={36} />
                AI Toolkit
              </h1>
              <p className="text-red-100">
                AI-powered tools for modern applications
              </p>
            </div>
          </div>
        </div>

        {/* Tool Sections */}
        <ToolSection title="Data Tools" theme="data" tools={dataTools} />

        <ToolSection title="Generate" theme="generate" tools={generateTools} />

        <ToolSection title="Analyze" theme="analyze" tools={analyzeTools} />

        <ToolSection title="Automate" theme="automate" tools={automateTools} />
      </div>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-gray-800 to-gray-900 text-white mt-20">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Brand Section */}
            <div className="text-center md:text-left">
              <h3 className="text-xl font-bold mb-3 flex items-center justify-center md:justify-start space-x-2">
                <Sparkles size={20} className="text-brand-secondary-blue" />
                <span>AI Toolkit</span>
              </h3>
              <p className="text-gray-300 text-sm">
                Empowering teams with intelligent automation and analysis tools.
              </p>
            </div>

            {/* Status */}
            <div className="text-center md:text-right">
              <h4 className="text-lg font-semibold mb-3">Platform Status</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-center md:justify-end space-x-2">
                  <div className="w-2 h-2 bg-brand-secondary-green rounded-full animate-pulse"></div>
                  <span className="text-gray-300">All Systems Operational</span>
                </div>
                <div className="flex items-center justify-center md:justify-end space-x-2">
                  <div className="w-2 h-2 bg-brand-secondary-blue rounded-full animate-pulse"></div>
                  <span className="text-gray-300">AI Services Active</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400 text-xs">
            <p>
              © 2025 AI Toolkit • Powered by Next.js, TypeScript, and Tailwind
              CSS
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AIToolkit;
