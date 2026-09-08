import React from "react";
import {
  LayoutDashboard,
  CalendarDays,
  UserPlus,
  Users,
  IndianRupee,
  CheckSquare,
  MessageCircle,
  ShieldCheck,
  ClipboardList,
  Inbox,
  Store,
  LogOut,
} from "lucide-react";
import { useERP } from "@/context/ERPContext";

interface SidebarItem {
  id: string;
  name: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  permission: string;
}

export const Sidebar: React.FC = () => {
  const { activeView, setActiveView, user, logout, hasPermission } = useERP();

  const menuItems: SidebarItem[] = [
    { id: "dashboard", name: "Dashboard", icon: LayoutDashboard, permission: "view:dashboard" },
    { id: "booking-requests", name: "Booking Requests", icon: Inbox, permission: "view:booking-requests" },
    { id: "bookings", name: "Bookings", icon: ClipboardList, permission: "view:bookings" },
    { id: "calendar", name: "Calendar", icon: CalendarDays, permission: "view:calendar" },
    { id: "manual-booking", name: "Manual Booking", icon: UserPlus, permission: "view:new-booking" },
    { id: "vendor-management", name: "Vendor Partners", icon: Store, permission: "view:vendor-management" },
    { id: "customers", name: "CRM / Customers", icon: Users, permission: "view:crm" },
    { id: "finance", name: "Finance & GST", icon: IndianRupee, permission: "view:finance" },
    { id: "operations", name: "Operations", icon: CheckSquare, permission: "view:operations" },
    { id: "whatsapp", name: "WhatsApp Chat", icon: MessageCircle, permission: "view:whatsapp" },
    { id: "owner-panel", name: "Owner Panel", icon: ShieldCheck, permission: "view:owner-panel" },
  ];

  const visibleItems = menuItems.filter((item) => hasPermission(item.permission));

  return (
    <aside className="fixed left-6 top-6 bottom-6 w-64 glass-panel bg-gradient-to-b from-purple-royal/15 via-white/40 to-purple-royal/10 border-white/60 shadow-xl flex flex-col justify-between p-4 z-40 select-none">
      {/* Brand Logo Header */}
      <div>
        <div className="flex items-center gap-3 px-3 py-4 mb-6 border-b border-purple-royal/10">
          <div className="w-10 h-10 rounded-xl overflow-hidden shadow-lg shadow-purple-royal/25 shrink-0 border border-gold-luxury/20 bg-white">
            <img src="/logo.jpg" alt="Bhagyalaxmi Logo" className="w-full h-full object-cover" />
          </div>
          <div>
            <h1 className="font-extrabold text-sm text-purple-royal tracking-tight uppercase leading-none">
              Bhagyalaxmi
            </h1>
            <span className="text-[10px] font-bold text-gold-luxury tracking-widest uppercase">
              ERP System
            </span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1">
          {visibleItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left text-sm font-semibold tracking-wide transition-all duration-300 relative group cursor-pointer ${
                  isActive
                    ? "text-purple-royal bg-purple-royal/10 border-l-4 border-gold-luxury pl-3 shadow-sm shadow-purple-royal/5"
                    : "text-charcoal-dark/60 hover:text-purple-royal hover:bg-purple-royal/5 pl-4"
                }`}
              >
                <Icon
                  size={18}
                  className={`transition-colors duration-300 ${
                    isActive
                      ? "text-gold-luxury"
                      : "text-charcoal-dark/40 group-hover:text-gold-luxury"
                  }`}
                />
                <span>{item.name}</span>
                {isActive && (
                  <div className="absolute right-3 w-1.5 h-1.5 rounded-full bg-gold-luxury shadow-md shadow-gold-luxury" />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Profile Card & Logout Footer */}
      <div className="border-t border-purple-royal/10 pt-4 px-2 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 rounded-full border-2 border-gold-luxury overflow-hidden bg-white shadow-md shrink-0">
              <img
                src={user?.avatar || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200"}
                alt="Profile avatar"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-purple-royal leading-tight truncate">
                {user?.name || "Deepak Zodge"}
              </p>
              <span className="text-[9px] font-bold text-gold-luxury tracking-widest uppercase block truncate">
                {user?.role || "Owner"}
              </span>
            </div>
          </div>
          
          <button
            onClick={logout}
            title="Log Out Session"
            className="p-2 rounded-lg hover:bg-rose-500/10 text-charcoal-dark/40 hover:text-rose-500 transition-all cursor-pointer shrink-0"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
