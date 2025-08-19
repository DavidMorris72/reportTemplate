"use client";
import { UserPlus, ArrowLeft, Save, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";

import Header from "../../../../components/Header";

interface CurrentUser {
  id: string;
  email: string;
  name: string;
  role: "USER" | "ADMIN" | "SUPER_ADMIN";
}

const NewUser = () => {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    email: "",
    name: "",
    password: "",
    confirmPassword: "",
    role: "USER" as "USER" | "ADMIN" | "SUPER_ADMIN",
  });

  useEffect(() => {
    // Check authentication
    const userData = localStorage.getItem("ai_toolkit_user");
    const token = localStorage.getItem("ai_toolkit_token");

    if (!token || !userData) {
      router.push("/");
      return;
    }

    try {
      const user = JSON.parse(userData);
      if (user.role === "ADMIN" || user.role === "SUPER_ADMIN") {
        setCurrentUser(user);
      } else {
        router.push("/");
        return;
      }
    } catch (error) {
      console.error("Error parsing user data:", error);
      router.push("/");
      return;
    }

    setIsLoading(false);
  }, [router]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (error) setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!formData.email || !formData.name || !formData.password) {
      setError("Please fill in all required fields");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    const token = localStorage.getItem("ai_toolkit_token");
    setIsSaving(true);

    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          email: formData.email,
          name: formData.name,
          password: formData.password,
          role: formData.role,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create user");
      }

      // Success! Redirect to users list
      router.push("/admin/users");
    } catch (error: any) {
      console.error("Error creating user:", error);
      setError(error.message || "Failed to create user");
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("ai_toolkit_token");
    localStorage.removeItem("ai_toolkit_user");
    router.push("/");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <Header
        onLogout={handleLogout}
        userRole={currentUser?.role === "ADMIN" ? "admin" : "super_admin"}
      />

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header Section */}
        <div className="flex items-center mb-8">
          <Link href="/admin/users">
            <button className="p-2 rounded-lg hover:bg-gray-200 transition-colors mr-4">
              <ArrowLeft size={24} />
            </button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <UserPlus className="mr-3" size={36} />
              Add New User
            </h1>
            <p className="text-gray-600 mt-2">Create a new user account</p>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Display */}
            {error && (
              <div className="flex items-center space-x-2 text-red-600 text-sm bg-red-50 p-4 rounded-xl border border-red-200">
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            {/* Name Field */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Full Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Enter full name"
              />
            </div>

            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email Address *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Enter email address"
              />
            </div>

            {/* Role Field */}
            <div>
              <label
                htmlFor="role"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Role *
              </label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-colors"
              >
                <option value="USER">User</option>
                <option
                  value="ADMIN"
                  disabled={currentUser?.role !== "SUPER_ADMIN"}
                >
                  Administrator{" "}
                  {currentUser?.role !== "SUPER_ADMIN"
                    ? "(Super Admin only)"
                    : ""}
                </option>
                <option
                  value="SUPER_ADMIN"
                  disabled={currentUser?.role !== "SUPER_ADMIN"}
                >
                  Super Administrator{" "}
                  {currentUser?.role !== "SUPER_ADMIN"
                    ? "(Super Admin only)"
                    : ""}
                </option>
              </select>
              {currentUser?.role !== "SUPER_ADMIN" && (
                <p className="text-sm text-gray-500 mt-1">
                  Only Super Administrators can create Admin users
                </p>
              )}
            </div>

            {/* Password Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Password *
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Enter password"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Minimum 6 characters
                </p>
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Confirm Password *
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Confirm password"
                />
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
              <Link href="/admin/users">
                <button
                  type="button"
                  className="px-6 py-3 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
              </Link>
              <button
                type="submit"
                disabled={isSaving}
                className="px-6 py-3 bg-brand-primary text-white rounded-lg hover:bg-red-700 disabled:opacity-70 disabled:cursor-not-allowed transition-colors flex items-center"
              >
                {isSaving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                    Creating...
                  </>
                ) : (
                  <>
                    <Save className="mr-2" size={20} />
                    Create User
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Help Text */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-blue-800 mb-2">
            Role Permissions
          </h3>
          <ul className="space-y-2 text-sm text-blue-700">
            <li>
              <strong>User:</strong> Access to main toolkit only
            </li>
            <li>
              <strong>Administrator:</strong> Can manage users but cannot create
              other administrators
            </li>
            <li>
              <strong>Super Administrator:</strong> Full access including
              creating administrators
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default NewUser;
