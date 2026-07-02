import React from "react";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {}

export function GlassCard({ className, children, ...props }: GlassCardProps) {
  return (
    <div
      className={`bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-xl ${className || ""}`}
      {...props}
    >
      {children}
    </div>
  );
}
