import React from 'react';

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'outline' | 'destructive';
}

export const Badge: React.FC<BadgeProps> = ({ className = '', variant = 'default', ...props }) => {
  const variants = {
    default: "border-transparent bg-indigo-600 text-white shadow hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600",
    secondary: "border-transparent bg-gray-100 text-gray-900 hover:bg-gray-200/80 dark:bg-gray-800/80 dark:text-gray-100 dark:hover:bg-gray-700/80",
    outline: "text-gray-950 border-gray-200 dark:text-gray-100 dark:border-gray-700/50",
    destructive: "border-transparent bg-red-500 text-white shadow hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700",
  };
  
  return (
    <div className={`inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${variants[variant]} ${className}`} {...props} />
  );
};