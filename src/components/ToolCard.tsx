import { ArrowRight, Clock } from "lucide-react";
import Link from "next/link";
import React from "react";

interface ToolCardProps {
  title: string;
  description?: string;
  href?: string;
  comingSoon?: boolean;
  isActive?: boolean;
  theme?: "blue" | "green" | "purple" | "orange";
}

const ToolCard: React.FC<ToolCardProps> = ({
  title,
  description,
  href,
  comingSoon = false,
  isActive = false,
  theme = "blue",
}) => {
  const themeColors = {
    blue: {
      bg: "from-blue-50 to-blue-100",
      border: "border-blue-200",
      text: "text-blue-900",
      button: "bg-blue-600 hover:bg-blue-700",
      accent: "text-blue-600",
    },
    green: {
      bg: "from-green-50 to-green-100",
      border: "border-green-200",
      text: "text-green-900",
      button: "bg-green-600 hover:bg-green-700",
      accent: "text-green-600",
    },
    purple: {
      bg: "from-purple-50 to-purple-100",
      border: "border-purple-200",
      text: "text-purple-900",
      button: "bg-purple-600 hover:bg-purple-700",
      accent: "text-purple-600",
    },
    orange: {
      bg: "from-orange-50 to-orange-100",
      border: "border-orange-200",
      text: "text-orange-900",
      button: "bg-orange-600 hover:bg-orange-700",
      accent: "text-orange-600",
    },
  };

  const colors = themeColors[theme];

  if (comingSoon) {
    return (
      <div
        className={`bg-gradient-to-br ${colors.bg} border ${colors.border} rounded-xl p-6 transition-all duration-200 opacity-75`}
      >
        <div className="flex items-center justify-between mb-3">
          <h3 className={`text-lg font-semibold ${colors.text}`}>{title}</h3>
          <div className="flex items-center space-x-1 text-gray-500 text-sm">
            <Clock size={16} />
            <span>Coming Soon</span>
          </div>
        </div>
        {description && (
          <p className="text-gray-600 text-sm mb-4">{description}</p>
        )}
        <div className="text-center">
          <div className="inline-flex items-center px-4 py-2 bg-gray-300 text-gray-500 rounded-lg cursor-not-allowed">
            <span>In Development</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Link
      href={href || "#"}
      className={`block bg-gradient-to-br ${colors.bg} border ${colors.border} rounded-xl p-6 transition-all duration-200 hover:shadow-lg hover:-translate-y-1 group`}
    >
      <div className="flex items-center justify-between mb-3">
        <h3
          className={`text-lg font-semibold ${colors.text} group-hover:${colors.accent}`}
        >
          {title}
        </h3>
        {isActive && (
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
        )}
      </div>
      {description && (
        <p className="text-gray-600 text-sm mb-4">{description}</p>
      )}
      <div className="flex items-center justify-between">
        <div className={`text-sm font-medium ${colors.accent}`}>
          Launch Tool
        </div>
        <ArrowRight
          size={16}
          className={`${colors.accent} transform group-hover:translate-x-1 transition-transform duration-200`}
        />
      </div>
    </Link>
  );
};

export default ToolCard;
