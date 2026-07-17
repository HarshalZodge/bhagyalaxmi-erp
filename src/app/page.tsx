"use client";

import React from "react";
import Link from "next/link";
import { Users, ShieldCheck } from "lucide-react";

export default function Home() {
  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 bg-[#f9f6f0] overflow-hidden select-none">
      {/* Background Decorators */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[10%] left-[15%] w-[450px] h-[450px] rounded-full bg-purple-royal/8 opacity-20 blur-[130px] animate-float-slow" />
        <div className="absolute bottom-[10%] right-[10%] w-[550px] h-[550px] rounded-full bg-gold-luxury/8 opacity-15 blur-[140px] animate-float-reverse" />
        
        {/* Rotating Mandala vector watermark */}
        <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[850px] h-[850px] opacity-[0.025] text-gold-luxury pointer-events-none animate-spin-slow">
          <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="0.1" className="w-full h-full">
            <circle cx="50" cy="50" r="46" />
            <circle cx="50" cy="50" r="36" />
            <circle cx="50" cy="50" r="26" />
            {Array.from({ length: 24 }).map((_, i) => {
              const angle = (i * 360) / 24;
              return (
                <g key={i} transform={`rotate(${angle} 50 50)`}>
                  <path d="M 50 4 C 47 15 47 35 50 50 C 53 35 53 15 50 4 Z" />
                  <line x1="50" y1="4" x2="50" y2="96" />
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* Main Gateway Card */}
      <div className="relative z-10 glass-panel max-w-3xl w-full p-8 border-white/60 bg-white/40 shadow-2xl flex flex-col items-center text-center space-y-8">
        <div className="space-y-3">
          <div className="w-20 h-20 rounded-2xl overflow-hidden mx-auto shadow-lg shadow-purple-royal/20 border border-gold-luxury/30 bg-white">
            <img src="/logo.jpg" alt="Bhagyalaxmi Logo" className="w-full h-full object-cover" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-purple-royal tracking-tight uppercase">
              Bhagyalaxmi ERP
            </h1>
            <p className="text-xs font-bold text-gold-luxury tracking-widest uppercase mt-1">
              Bhagyalaxmi Lawns & Banquet Hall • Ahilyanagar
            </p>
          </div>
        </div>

        <p className="text-sm text-charcoal-dark/60 max-w-lg leading-relaxed">
          Welcome to the premier operating system for Bhagyalaxmi Lawns. Please select your gateway to authenticate and access your account.
        </p>

        {/* Portal Path Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full pt-4">
          {/* Path 1: Client Portal */}
          <Link
            href="/client"
            className="group p-6 rounded-2xl border border-white/65 bg-white/55 hover:border-gold-luxury/45 hover:shadow-lg transition-all duration-300 flex flex-col justify-between text-left h-52 hover:-translate-y-1"
          >
            <div className="space-y-3">
              <span className="p-3 bg-gold-luxury/10 rounded-xl text-gold-dark inline-block group-hover:bg-gold-luxury/20 transition-all">
                <Users size={20} />
              </span>
              <h3 className="font-extrabold text-md text-purple-royal leading-none">
                Client Portal
              </h3>
              <p className="text-xs text-charcoal-dark/50 leading-normal">
                Access your wedding details, pay deposits, request food menus, view timelines, and upload IDs.
              </p>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-gold-dark mt-4 flex items-center gap-1 group-hover:text-purple-royal transition-all">
              Go to Customer Login →
            </span>
          </Link>

          {/* Path 2: Admin ERP */}
          <Link
            href="/admin"
            className="group p-6 rounded-2xl border border-purple-royal/10 bg-purple-royal/[0.03] hover:border-gold-luxury/40 hover:shadow-lg transition-all duration-300 flex flex-col justify-between text-left h-52 hover:-translate-y-1"
          >
            <div className="space-y-3">
              <span className="p-3 bg-purple-royal/10 rounded-xl text-purple-royal inline-block group-hover:bg-purple-royal/20 transition-all">
                <ShieldCheck size={20} />
              </span>
              <h3 className="font-extrabold text-md text-purple-royal leading-none">
                Admin ERP Command
              </h3>
              <p className="text-xs text-charcoal-dark/50 leading-normal">
                For Owners, Site Managers, Staff, and Accountants to manage bookings, operations, and GST ledgers.
              </p>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-purple-royal mt-4 flex items-center gap-1 group-hover:text-gold-luxury transition-all">
              Go to Staff Login →
            </span>
          </Link>
        </div>

        {/* Footer address */}
        <div className="border-t border-purple-royal/10 pt-4 w-full flex justify-between text-[9px] font-bold text-charcoal-dark/40 uppercase tracking-widest">
          <span>Bhingar, Ahilyanagar, India</span>
          <span>Enterprise SaaS Edition v2.0</span>
        </div>
      </div>
    </div>
  );
}
