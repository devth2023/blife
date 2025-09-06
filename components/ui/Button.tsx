
import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline';
  size?: 'default' | 'sm';
}

const baseClasses = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";

const variantClasses = {
  default: "bg-emerald-600 text-white hover:bg-emerald-700",
  outline: "border border-gray-200 bg-transparent hover:bg-gray-100 text-gray-800",
};

const sizeClasses = {
    default: "px-4 py-2",
    sm: "h-9 px-3 rounded-md",
}

export const Button: React.FC<ButtonProps> = ({ className, variant = 'default', size = 'default', ...props }) => {
  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className || ''}`}
      {...props}
    />
  );
};
