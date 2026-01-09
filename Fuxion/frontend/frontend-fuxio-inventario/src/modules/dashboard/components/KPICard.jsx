// src/modules/dashboard/components/KPICard.jsx
import React from "react";

const KPICard = ({ title, value, icon: Icon, color = "blue", subtitle }) => {
  const colorClasses = {
    blue: "bg-blue-500",
    green: "bg-green-500",
    red: "bg-red-500",
    yellow: "bg-yellow-500",
    purple: "bg-purple-500",
    indigo: "bg-indigo-500",
  };

  return (
    <div className="card hover:shadow-lg transition-shadow duration-200">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">
            {title}
          </p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
          {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
        </div>
        <div
          className={`${colorClasses[color]} p-4 rounded-full text-white shadow-lg`}
        >
          <Icon className="w-8 h-8" />
        </div>
      </div>
    </div>
  );
};

export default KPICard;
