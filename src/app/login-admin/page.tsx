"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Send, ChevronRight, Compass } from "lucide-react";
import { useERP } from "@/context/ERPContext";
import { isSupabaseConfigured } from "@/utils/supabase/client";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlassButton } from "@/components/ui/GlassButton";
import { GlassInput } from "@/components/ui/GlassInput";

export default function LoginAdmin() {
  const { loginWithGoogle, sendOTP, verifyOTP } = useERP();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sandboxCodeMsg, setSandboxCodeMsg] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const err = params.get("error");
      if (err === "unauthorized-email") {
        setErrorMessage("Access Denied: Your Google account is not authorized to access this ERP system.");
      } else if (err === "auth-callback-failed") {
        setErrorMessage("Authentication failed. Please try again.");
      }
    }
  }, []);

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setErrorMessage("");

    try {
      const res = await sendOTP(email, "admin");
      if (res.success) {
        setOtpSent(true);
        if (res.code) {
          setSandboxCodeMsg(`[SANDBOX KEY] Your OTP is: ${res.code}`);
        }
      } else {
        setErrorMessage(res.message || "Failed to send code.");
      }
    } catch {
      setErrorMessage("An error occurred.");
    }
    setLoading(false);
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code) return;
    setLoading(true);
    setErrorMessage("");

    try {
      const success = await verifyOTP(email, code, "admin");
      if (success) {
        window.location.href = "/admin";
      } else {
        setErrorMessage("Invalid OTP code. Please try again.");
      }
    } catch {
      setErrorMessage("Verification error.");
    }
    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      await loginWithGoogle("admin");
      if (!isSupabaseConfigured) {
        window.location.href = "/admin";
      }
    } catch {
      setErrorMessage("Google Sign-In failed.");
    }
    setLoading(false);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 bg-[#f9f6f0] overflow-hidden select-none">
      {/* Backdrop */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[8%] left-[12%] w-[480px] h-[480px] rounded-full bg-purple-royal/6 opacity-20 blur-[130px] animate-float-slow" />
        <div className="absolute bottom-[8%] right-[8%] w-[520px] h-[520px] rounded-full bg-gold-luxury/5 opacity-15 blur-[140px] animate-float-reverse" />
        
        {/* Mandala Watermark */}
        <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] opacity-[0.02] text-gold-luxury pointer-events-none animate-spin-slow">
          <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="0.15" className="w-full h-full">
            <circle cx="50" cy="50" r="46" />
            <circle cx="50" cy="50" r="32" />
            {Array.from({ length: 16 }).map((_, i) => {
              const angle = (i * 360) / 16;
              return <line key={i} x1="50" y1="4" x2="50" y2="96" transform={`rotate(${angle} 50 50)`} />;
            })}
          </svg>
        </div>
      </div>

      <GlassCard className="relative z-10 w-full max-w-md p-8 border-white/60 bg-white/40 shadow-2xl space-y-6">
        {/* Header logo */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-xl overflow-hidden mx-auto shadow-md border border-gold-luxury/20 bg-white">
            <img src="/logo.jpg" alt="Bhagyalaxmi Logo" className="w-full h-full object-cover" />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-purple-royal tracking-tight uppercase">
              Admin ERP Login
            </h2>
            <p className="text-[10px] font-bold text-gold-luxury tracking-widest uppercase mt-0.5">
              Bhagyalaxmi lawns staff command
            </p>
          </div>
        </div>

        {/* Sandbox Notice */}
        {!isSupabaseConfigured && (
          <div className="p-3 bg-purple-royal/5 border border-purple-royal/10 rounded-xl space-y-2 text-[10px] text-charcoal-dark/65 leading-relaxed">
            <p className="font-extrabold text-purple-royal uppercase tracking-wider flex items-center gap-1">
              <Compass size={12} /> Sandbox Credentials Guide
            </p>
            <p>Enter any of the following emails to test specific Role views:</p>
            <ul className="list-disc pl-4 space-y-1">
              <li><strong className="font-semibold text-purple-royal">owner@bhagyalaxmi.com</strong> (Owner permissions)</li>
              <li><strong className="font-semibold text-purple-royal">manager@bhagyalaxmi.com</strong> (Supervisor permissions)</li>
              <li><strong className="font-semibold text-purple-royal">accountant@bhagyalaxmi.com</strong> (Accountant permissions)</li>
              <li><strong className="font-semibold text-purple-royal">staff@bhagyalaxmi.com</strong> (Operations Staff permissions)</li>
            </ul>
          </div>
        )}

        {errorMessage && (
          <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-700 text-xs font-bold rounded-xl text-center">
            {errorMessage}
          </div>
        )}

        {/* Google Authentication Button */}
        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl border border-purple-royal/15 hover:border-gold-luxury/40 bg-white/50 hover:bg-white/80 transition-all duration-300 text-xs font-bold text-charcoal-dark cursor-pointer shadow-sm disabled:opacity-50"
        >
          <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
            <path
              fill="#EA4335"
              d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.137 4.114-3.483 0-6.312-2.83-6.312-6.314s2.83-6.313 6.312-6.313c1.636 0 3.12.63 4.256 1.656l3.19-3.19C19.24 2.27 15.938 1 12.24 1 6.033 1 1 6.033 1 12.24s5.033 11.24 11.24 11.24c5.897 0 10.866-4.256 10.866-11.24 0-.668-.073-1.363-.22-1.955H12.24z"
            />
          </svg>
          Sign in with Google
        </button>

        {/* Divider separator */}
        <div className="relative flex py-2 items-center">
          <div className="flex-grow border-t border-purple-royal/5"></div>
          <span className="flex-shrink mx-4 text-[9px] font-bold text-charcoal-dark/30 uppercase tracking-widest">
            or use Email OTP
          </span>
          <div className="flex-grow border-t border-purple-royal/5"></div>
        </div>

        {/* Email OTP Auth form */}
        {!otpSent ? (
          <form onSubmit={handleSendOTP} className="space-y-4">
            <div className="relative">
              <span className="absolute inset-y-0 left-3.5 flex items-center text-charcoal-dark/35">
                <Mail size={16} />
              </span>
              <GlassInput
                type="email"
                placeholder="Enter staff email address"
                className="pl-10"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <GlassButton variant="gold" type="submit" disabled={loading} className="w-full py-3">
              {loading ? "Sending..." : "Send Verification Code"} <Send size={14} />
            </GlassButton>
          </form>
        ) : (
          <form onSubmit={handleVerifyOTP} className="space-y-4">
            {sandboxCodeMsg && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/25 text-emerald-800 text-[10px] font-bold rounded-xl text-center">
                {sandboxCodeMsg}
              </div>
            )}
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-purple-royal uppercase tracking-wider px-1">
                Enter 6-Digit OTP Code
              </label>
              <GlassInput
                type="text"
                maxLength={6}
                placeholder="XXXXXX"
                className="text-center font-bold text-lg tracking-widest"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
              />
            </div>
            <GlassButton variant="gold" type="submit" disabled={loading} className="w-full py-3">
              {loading ? "Verifying..." : "Verify & Login"} <ChevronRight size={16} />
            </GlassButton>
            <button
              type="button"
              onClick={() => setOtpSent(false)}
              className="w-full text-center text-[10px] font-bold text-purple-royal hover:underline cursor-pointer uppercase tracking-wider"
            >
              Change Email
            </button>
          </form>
        )}
      </GlassCard>
    </div>
  );
}
