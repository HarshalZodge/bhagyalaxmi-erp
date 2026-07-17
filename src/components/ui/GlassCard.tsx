import React from "react";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "purple" | "gold";
  onClick?: () => void;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className = "",
  variant = "default",
  onClick,
}) => {
  const variantClasses = {
    default: "glass-panel",
    purple: "glass-card-purple",
    gold: "glass-card-gold",
  };

  return (
    <div
      onClick={onClick}
      className={`${variantClasses[variant]} ${
        onClick ? "cursor-pointer hover:scale-[1.01]" : ""
      } p-6 ${className}`}
    >
      {children}
    </div>
  );
};
export default GlassCard;
