import React from "react";

interface GlassSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { value: string | number; label: string }[];
  className?: string;
}

export const GlassSelect = React.forwardRef<HTMLSelectElement, GlassSelectProps>(
  ({ label, options, className = "", ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label className="text-xs font-semibold text-purple-royal/80 tracking-wide uppercase px-1">
            {label}
          </label>
        )}
        <select
          ref={ref}
          className={`glass-input px-4 py-2.5 rounded-xl text-sm w-full bg-white/50 cursor-pointer ${className}`}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-[#f9f6f0] text-charcoal-dark">
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    );
  }
);

GlassSelect.displayName = "GlassSelect";
export default GlassSelect;
