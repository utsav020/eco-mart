"use client";

import React from "react";

interface LoaderProps {
  type?: "indeterminate" | "determinate";
  progress?: number; // 0-100 for determinate type
  size?: "sm" | "md" | "lg" | "xl";
  variant?: "spinner" | "ring" | "dots";
  text?: string;
  subText?: string;
  showPercentage?: boolean;
}

const Loader: React.FC<LoaderProps> = ({
  type = "indeterminate",
  progress = 0,
  size = "md",
  variant = "spinner",
  text,
  subText,
  showPercentage = false,
}) => {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
    xl: "w-20 h-20",
  };

  const renderIndeterminate = () => {
    switch (variant) {
      case "ring":
        return (
          <div className="relative">
            <div
              className={`
                ${sizeClasses[size]}
                border-4
                border-gray-200
                rounded-full
              `}
            />
            <div
              className={`
                ${sizeClasses[size]}
                border-4
                border-green-500
                border-t-transparent
                rounded-full
                animate-spin
                absolute
                top-0
                left-0
              `}
            />
          </div>
        );

      case "dots":
        return (
          <div className="flex space-x-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-2 h-2 bg-green-500 rounded-full animate-bounce"
                style={{ animationDelay: `${i * 0.1}s` }}
              />
            ))}
          </div>
        );

      default: // spinner
        return (
          <div
            className={`
              ${sizeClasses[size]}
              border-4
              border-green-500
              border-t-transparent
              rounded-full
              animate-spin
            `}
          />
        );
    }
  };

  const renderDeterminate = () => {
    const circumference = 2 * Math.PI * 40; // For SVG circle with r="40"
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    return (
      <div className="relative">
        <svg className={`${sizeClasses[size]} transform -rotate-90`} viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="40"
            stroke="#e5e7eb"
            strokeWidth="8"
            fill="none"
          />
          <circle
            cx="50"
            cy="50"
            r="40"
            stroke="#10b981"
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-300 ease-out"
          />
        </svg>
        {showPercentage && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs font-bold text-gray-700">{progress}%</span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4 p-6">
      <div className="flex items-center justify-center">
        {type === "determinate" ? renderDeterminate() : renderIndeterminate()}
      </div>
      
      {(text || subText) && (
        <div className="text-center space-y-1">
          {text && (
            <p className="text-gray-800 font-medium text-sm">{text}</p>
          )}
          {subText && (
            <p className="text-gray-500 text-xs">{subText}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Loader;