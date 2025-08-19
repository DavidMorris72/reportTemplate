"use client";
import {
  Users,
  UserPlus,
  Settings,
  BarChart3,
  Shield,
  LogOut,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";

import Header from "../../components/Header";

interface User {
  id: string;
  email: string;
  name: string;
  role: "USER" | "ADMIN" | "SUPER_ADMIN";
}

const AdminDashboard = () => {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get user data from localStorage
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
          <p className="text-gray-600 font-medium">
            Loading Admin Dashboard...
          </p>
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
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-brand-primary to-brand-logo-red text-white p-8 rounded-2xl mb-8 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2 flex items-center">
                <Shield className="mr-3" size={36} />
                Admin Dashboard
              </h1>
              <p className="text-red-100 text-lg">
                Welcome back, {currentUser?.name}
              </p>
              <p className="text-red-200 text-sm mt-1">
                Role:{" "}
                {currentUser?.role === "SUPER_ADMIN"
                  ? "Super Administrator"
                  : "Administrator"}
              </p>
            </div>
            <div className="text-right">
              <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                <div className="text-2xl font-bold">{currentUser?.email}</div>
                <div className="text-red-200 text-sm">Current Session</div>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* User Management Card */}
          <Link href="/admin/users">
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer group">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-blue-100 p-3 rounded-lg group-hover:bg-blue-200 transition-colors">
                  <Users className="text-brand-secondary-blue" size={24} />
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-800">Manage</div>
                  <div className="text-gray-500 text-sm">Users</div>
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                User Management
              </h3>
              <p className="text-gray-600 text-sm">
                Add, edit, and manage user accounts and permissions
              </p>
            </div>
          </Link>

          {/* Add User Card */}
          <Link href="/admin/users/new">
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer group">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-green-100 p-3 rounded-lg group-hover:bg-green-200 transition-colors">
                  <UserPlus className="text-brand-secondary-green" size={24} />
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-800">Add</div>
                  <div className="text-gray-500 text-sm">New</div>
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Add User
              </h3>
              <p className="text-gray-600 text-sm">
                Create new user accounts with appropriate roles
              </p>
            </div>
          </Link>

          {/* System Stats Card */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-purple-100 p-3 rounded-lg">
                <BarChart3 className="text-brand-tertiary-purple" size={24} />
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-800">Stats</div>
                <div className="text-gray-500 text-sm">System</div>
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              System Overview
            </h3>
            <p className="text-gray-600 text-sm">
              View system statistics and user activity
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <Settings className="mr-3" size={24} />
            Quick Actions
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              href="/admin/users"
              className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
            >
              <Users
                className="mr-3 text-brand-secondary-blue group-hover:text-blue-700"
                size={20}
              />
              <div>
                <div className="font-semibold text-gray-800">
                  View All Users
                </div>
                <div className="text-gray-600 text-sm">
                  Manage existing user accounts
                </div>
              </div>
            </Link>

            <Link
              href="/admin/users/new"
              className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
            >
              <UserPlus
                className="mr-3 text-brand-secondary-green group-hover:text-green-700"
                size={20}
              />
              <div>
                <div className="font-semibold text-gray-800">
                  Create New User
                </div>
                <div className="text-gray-600 text-sm">
                  Add a new user to the system
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* Role Information */}
        {currentUser?.role === "SUPER_ADMIN" && (
          <div className="mt-8 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-amber-800 mb-2 flex items-center">
              <Shield className="mr-2" size={20} />
              Super Administrator Privileges
            </h3>
            <p className="text-amber-700 text-sm">
              As a Super Administrator, you have full access to all system
              features including the ability to create and manage other
              administrators.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
