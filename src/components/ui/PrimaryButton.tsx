import React from "react";

interface PrimaryButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export function PrimaryButton({ className, children, ...props }: PrimaryButtonProps) {
  return (
    <button
      className={`bg-gradient-to-r from-primary to-primary-to text-white font-semibold py-2 px-4 rounded-xl shadow-lg transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${className || ""}`}
      {...props}
    >
      {children}
    </button>
  );
}
