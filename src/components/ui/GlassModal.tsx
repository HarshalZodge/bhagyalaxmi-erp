import React, { useEffect } from "react";
import { X } from "lucide-react";
import { GlassCard } from "./GlassCard";

interface GlassModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  className?: string;
}

export const GlassModal: React.FC<GlassModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  className = "",
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-purple-dark/20 backdrop-blur-md transition-all duration-300">
      <div className="fixed inset-0 cursor-default" onClick={onClose} />
      <GlassCard
        className={`relative z-10 w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-white/70 shadow-2xl p-6 ${className}`}
      >
        <div className="flex items-center justify-between border-b border-purple-royal/10 pb-4 mb-4">
          <h3 className="text-xl font-bold text-purple-royal text-purple-gradient">{title}</h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-purple-royal/10 text-purple-royal/60 hover:text-purple-royal transition-all cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>
        <div>{children}</div>
      </GlassCard>
    </div>
  );
};

export default GlassModal;
