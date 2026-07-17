import React from "react";

interface GlassInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  className?: string;
}

export const GlassInput = React.forwardRef<HTMLInputElement, GlassInputProps>(
  ({ label, className = "", ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label className="text-xs font-semibold text-purple-royal/80 tracking-wide uppercase px-1">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`glass-input px-4 py-2.5 rounded-xl text-sm w-full ${className}`}
          {...props}
        />
      </div>
    );
  }
);

GlassInput.displayName = "GlassInput";
export default GlassInput;
