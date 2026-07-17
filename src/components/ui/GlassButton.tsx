import React from "react";

interface GlassButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "default" | "gold" | "secondary";
  className?: string;
}

export const GlassButton: React.FC<GlassButtonProps> = ({
  children,
  variant = "default",
  className = "",
  ...props
}) => {
  const variantClasses = {
    default: "glass-button",
    gold: "glass-button-gold",
    secondary: "glass-button-secondary",
  };

  return (
    <button
      className={`px-5 py-2.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 cursor-pointer transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
export default GlassButton;
