import React from "react";
import {
  LayoutDashboard,
  CalendarHeart,
  CreditCard,
  FileText,
  Clock,
  LogOut,
} from "lucide-react";
import { useERP } from "@/context/ERPContext";

interface ClientSidebarItem {
  id: string;
  name: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}

export const ClientSidebar: React.FC = () => {
  const { activeView, setActiveView, user, logout } = useERP();

  const menuItems: ClientSidebarItem[] = [
    { id: "dashboard", name: "Dashboard", icon: LayoutDashboard },
    { id: "booking-request", name: "Request Booking", icon: CalendarHeart },
    { id: "payments", name: "Payments & GST", icon: CreditCard },
    { id: "documents", name: "Documents", icon: FileText },
    { id: "timeline", name: "Booking Timeline", icon: Clock },
  ];

  return (
    <aside className="fixed left-6 top-6 bottom-6 w-64 glass-panel bg-gradient-to-b from-purple-royal/10 via-white/50 to-purple-royal/5 border-white/60 shadow-xl flex flex-col justify-between p-4 z-40 select-none">
      <div>
        {/* Brand Logo Header */}
        <div className="flex items-center gap-3 px-3 py-4 mb-6 border-b border-purple-royal/10">
          <div className="w-10 h-10 rounded-xl overflow-hidden shadow-lg shadow-purple-royal/20 shrink-0 border border-gold-luxury/20 bg-white">
            <img src="/logo.jpg" alt="Bhagyalaxmi Logo" className="w-full h-full object-cover" />
          </div>
          <div>
            <h1 className="font-extrabold text-sm text-purple-royal tracking-tight uppercase leading-none">
              Client Portal
            </h1>
            <span className="text-[9px] font-bold text-gold-luxury tracking-widest uppercase block mt-0.5">
              Bhagyalaxmi lawns
            </span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left text-sm font-semibold tracking-wide transition-all duration-300 relative group cursor-pointer ${
                  isActive
                    ? "text-purple-royal bg-purple-royal/10 border-l-4 border-gold-luxury pl-3 shadow-sm"
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
                  <div className="absolute right-3 w-1.5 h-1.5 rounded-full bg-gold-luxury" />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Profile Card Footer */}
      <div className="border-t border-purple-royal/10 pt-4 px-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 rounded-full border-2 border-gold-luxury overflow-hidden bg-white shadow-md shrink-0">
              <img
                src={user?.avatar || "https://images.unsplash.com/photo-1621574539437-4b7cb63120b8?auto=format&fit=crop&q=80&w=200"}
                alt="Client Profile"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-purple-royal leading-tight truncate">
                {user?.name || "Guest Client"}
              </p>
              <span className="text-[9px] font-bold text-gold-luxury tracking-widest uppercase block">
                {user?.role || "Client"}
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

export default ClientSidebar;
