import React from "react";
import ToolCard from "./ToolCard";

interface Tool {
  title: string;
  description?: string;
  href?: string;
  comingSoon?: boolean;
  isActive?: boolean;
}

interface ToolSectionProps {
  title: string;
  tools: Tool[];
  theme?: "data" | "generate" | "analyze" | "automate";
}

const ToolSection: React.FC<ToolSectionProps> = ({
  title,
  tools,
  theme = "data",
}) => {
  const themeConfig = {
    data: {
      gradient: "from-blue-600 to-blue-700",
      icon: "📊",
      cardTheme: "blue" as const,
    },
    generate: {
      gradient: "from-green-600 to-green-700",
      icon: "✨",
      cardTheme: "green" as const,
    },
    analyze: {
      gradient: "from-purple-600 to-purple-700",
      icon: "🔍",
      cardTheme: "purple" as const,
    },
    automate: {
      gradient: "from-orange-600 to-orange-700",
      icon: "🤖",
      cardTheme: "orange" as const,
    },
  };

  const config = themeConfig[theme];

  return (
    <div className="mb-12">
      <div
        className={`bg-gradient-to-r ${config.gradient} text-white p-4 rounded-t-lg`}
      >
        <h2 className="text-xl font-bold flex items-center">
          <span className="mr-3 text-2xl">{config.icon}</span>
          {title}
        </h2>
      </div>

      <div className="bg-white border-l border-r border-b border-gray-200 rounded-b-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool, index) => (
            <ToolCard
              key={index}
              title={tool.title}
              description={tool.description}
              href={tool.href}
              comingSoon={tool.comingSoon}
              isActive={tool.isActive}
              theme={config.cardTheme}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ToolSection;
