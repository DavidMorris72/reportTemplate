import { Settings } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import React from "react";

interface HeaderProps {
  showLogout?: boolean;
  onLogout?: () => void;
  userRole?: "user" | "admin" | "super_admin";
}

const Header: React.FC<HeaderProps> = ({
  showLogout = true,
  onLogout,
  userRole,
}) => {
  return (
    <div
      className="bg-gray-50 border-b border-gray-200"
      style={{ backgroundColor: "#f2f2f2" }}
    >
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            {/* DMSI Logo and Branding */}
            <Link
              href="/"
              className="flex items-center space-x-6 hover:opacity-80 transition-opacity"
            >
              <div className="h-12 flex items-center">
                <Image
                  src="/dmsi-logo.svg"
                  alt="DMSI Logo"
                  width={120}
                  height={32}
                  className="h-8 w-auto"
                  priority
                />
              </div>
              <div className="border-l border-gray-300 pl-6 h-12 flex items-center">
                <p className="text-2xl font-medium text-gray-700">AI Toolkit</p>
              </div>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {/* Admin/Super Admin Settings Icon */}
            {(userRole === "admin" || userRole === "super_admin") && (
              <Link
                href="/admin"
                className="p-2 rounded-lg hover:bg-gray-200 transition-colors duration-200 group"
                title="Admin Dashboard"
              >
                <Settings
                  size={20}
                  className="text-gray-600 group-hover:text-blue-600 transition-colors duration-200"
                />
              </Link>
            )}

            {showLogout && onLogout && (
              <button
                onClick={onLogout}
                className="text-white px-4 py-2 rounded-lg text-sm transition-colors bg-blue-600 hover:bg-blue-700"
              >
                {userRole === "admin"
                  ? "Admin Logout"
                  : userRole === "super_admin"
                    ? "Super Admin Logout"
                    : "Logout"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
