"use client";

import React, { useEffect } from "react";
import { useERP } from "@/context/ERPContext";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import DashboardView from "@/views/DashboardView";
import BookingsView from "@/views/BookingsView";
import CalendarView from "@/views/CalendarView";
import BookingPageView from "@/views/BookingPageView";
import CustomersView from "@/views/CustomersView";
import FinanceView from "@/views/FinanceView";
import OperationsView from "@/views/OperationsView";
import WhatsAppView from "@/views/WhatsAppView";
import OwnerPanelView from "@/views/OwnerPanelView";
import BookingRequestsView from "@/views/BookingRequestsView";
import VendorManagementView from "@/views/VendorManagementView";
import { ShieldAlert } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";

export default function AdminDashboard() {
  const { activeView, setActiveView, hasPermission, user, authLoading } = useERP();

  // Maps active views to their specific permission tags
  const viewPermissions: Record<string, string> = {
    dashboard: "view:dashboard",
    bookings: "view:bookings",
    calendar: "view:calendar",
    "booking-page": "view:new-booking",
    "booking-requests": "view:booking-requests",
    "vendor-management": "view:vendor-management",
    customers: "view:crm",
    finance: "view:finance",
    operations: "view:operations",
    whatsapp: "view:whatsapp",
    "owner-panel": "view:owner-panel",
  };

  const activePermission = viewPermissions[activeView] || "view:dashboard";
  const isAllowed = hasPermission(activePermission);

  // Auto-reset view to allowed view if current view is blocked by role selection change
  useEffect(() => {
    if (!authLoading && !isAllowed) {
      if (hasPermission("view:dashboard")) {
        setActiveView("dashboard");
      } else if (hasPermission("view:calendar")) {
        setActiveView("calendar");
      } else if (hasPermission("view:operations")) {
        setActiveView("operations");
      }
    }
  }, [user, isAllowed, authLoading]);

  // Loading Screen
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f9f6f0]">
        <div className="w-10 h-10 border-4 border-purple-royal/20 border-t-gold-luxury rounded-full animate-spin shadow-sm" />
      </div>
    );
  }

  const renderActiveView = () => {
    if (!isAllowed) {
      return (
        <GlassCard className="p-8 text-center border-rose-500/20 bg-rose-500/5 max-w-xl mx-auto space-y-4 animate-fade-in mt-12">
          <div className="w-12 h-12 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-600 flex items-center justify-center mx-auto text-xl">
            <ShieldAlert size={24} />
          </div>
          <div>
            <h3 className="text-md font-extrabold text-rose-700 uppercase tracking-wide">
              Access Restriction
            </h3>
            <p className="text-xs text-rose-600/80 mt-2 leading-relaxed">
              Your account role (<strong className="font-bold">{user?.role}</strong>) does not possess authorization key <code className="bg-rose-500/10 px-1 py-0.5 rounded font-mono text-[10px]">{activePermission}</code>. 
            </p>
            <p className="text-[10px] text-charcoal-dark/40 mt-1 font-semibold">
              Please contact Vikram Patil (Super Admin) or the Owners (Deepak Zodge, Kiran Zodge, Harshal Zodge) for privilege escalations.
            </p>
          </div>
        </GlassCard>
      );
    }

    switch (activeView) {
      case "dashboard":
        return <DashboardView />;
      case "bookings":
        return <BookingsView />;
      case "calendar":
        return <CalendarView />;
      case "booking-page":
        return <BookingPageView />;
      case "booking-requests":
        return <BookingRequestsView />;
      case "vendor-management":
        return <VendorManagementView />;
      case "customers":
        return <CustomersView />;
      case "finance":
        return <FinanceView />;
      case "operations":
        return <OperationsView />;
      case "whatsapp":
        return <WhatsAppView />;
      case "owner-panel":
        return <OwnerPanelView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="relative min-h-screen z-10 w-full bg-[#f9f6f0]">
      <Sidebar />
      <Topbar />

      <main className="ml-80 pt-32 pr-8 pb-12 min-h-screen relative z-10">
        {renderActiveView()}
      </main>

      {/* Background Decorators & Aesthetics */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[8%] left-[18%] w-[480px] h-[480px] rounded-full bg-purple-royal/6 opacity-20 blur-[130px]" />
        <div className="absolute bottom-[10%] right-[8%] w-[550px] h-[550px] rounded-full bg-gold-luxury/6 opacity-15 blur-[140px]" />

        {/* Rotating Mandala Watermark */}
        <div className="absolute top-[12%] right-[-18%] w-[850px] h-[850px] opacity-[0.035] text-gold-luxury/80 pointer-events-none z-0 select-none animate-spin-slow">
          <svg
            viewBox="0 0 100 100"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.12"
            className="w-full h-full"
          >
            <circle cx="50" cy="50" r="46" />
            <circle cx="50" cy="50" r="38" />
            <circle cx="50" cy="50" r="30" />
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
    </div>
  );
}
