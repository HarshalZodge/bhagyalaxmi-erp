"use client";

import React, { useState, useEffect } from "react";
import { Search, Bell, RefreshCw } from "lucide-react";
import { useERP } from "@/context/ERPContext";

export const Topbar: React.FC = () => {
  const {
    searchQuery,
    setSearchQuery,
    dbSyncInProgress,
    lastSyncTime,
    syncDatabase,
    bookings,
    weatherData,
    weatherLoading,
  } = useERP();

  const [time, setTime] = useState("");
  const [dateStr, setDateStr] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        })
      );
      setDateStr(
        now.toLocaleDateString([], {
          weekday: "short",
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      );
    };
    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const pendingInvoices = bookings.filter((b) => b.status === "Pending Payment");

  // Helper weather icon selector
  const getWeatherEmoji = (code: number) => {
    if (code === 0) return "☀️";
    if ([1, 2, 3].includes(code)) return "⛅";
    if ([45, 48].includes(code)) return "🌫️";
    if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code)) return "🌧️";
    if ([95, 96, 99].includes(code)) return "⛈️";
    return "☁️";
  };

  return (
    <header className="fixed top-6 left-80 right-6 h-20 glass-panel bg-white/40 border-white/60 shadow-md flex items-center justify-between px-6 z-30 select-none">
      {/* Search Input */}
      <div className="relative w-80">
        <span className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none text-charcoal-dark/40">
          <Search size={18} />
        </span>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search bookings, CRM, invoices..."
          className="w-full glass-input pl-10 pr-4 py-2.5 rounded-xl text-sm placeholder:text-charcoal-dark/30 focus:ring-2 focus:ring-gold-luxury/20"
        />
      </div>

      {/* Meta Controls (Weather, Clock, Sync, Alerts) */}
      <div className="flex items-center gap-6">
        {/* Live Ahilyanagar Weather */}
        <div className="flex items-center gap-2 border-r border-purple-royal/10 pr-4 text-charcoal-dark/70">
          <span className="text-lg leading-none shrink-0 select-none">
            {weatherData ? getWeatherEmoji(weatherData.current.weatherCode) : "⛅"}
          </span>
          <div className="text-right">
            <p className="text-xs font-bold leading-none">
              {weatherLoading ? "..." : weatherData ? `${weatherData.current.temp}°C` : "28°C"}
            </p>
            <span className="text-[9px] font-bold text-charcoal-dark/40 uppercase block max-w-[85px] truncate">
              {weatherLoading ? "Loading" : weatherData ? weatherData.current.condition : "Bhingar, ANR"}
            </span>
          </div>
        </div>

        {/* Live Clock & Calendar Date */}
        <div className="flex flex-col text-right border-r border-purple-royal/10 pr-4">
          <span className="text-xs font-bold text-purple-royal tracking-wide leading-none">
            {time}
          </span>
          <span className="text-[9px] font-semibold text-charcoal-dark/40 mt-1 uppercase">
            {dateStr}
          </span>
        </div>

        {/* Database Sync Tool */}
        <button
          onClick={syncDatabase}
          disabled={dbSyncInProgress}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-purple-royal/10 hover:border-gold-luxury/40 bg-purple-royal/5 hover:bg-purple-royal/10 transition-all duration-300 text-purple-royal cursor-pointer disabled:opacity-50"
        >
          <RefreshCw
            size={14}
            className={`text-gold-luxury ${dbSyncInProgress ? "animate-spin" : ""}`}
          />
          <div className="text-left hidden md:block">
            <p className="text-[9px] font-bold leading-none uppercase">Sync Status</p>
            <span className="text-[8px] font-medium text-charcoal-dark/50 truncate max-w-[100px] block">
              {lastSyncTime}
            </span>
          </div>
        </button>

        {/* Notifications Icon & Panel */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2.5 rounded-xl border border-purple-royal/10 hover:border-gold-luxury/35 bg-purple-royal/5 text-purple-royal hover:text-gold-luxury transition-all duration-300 relative cursor-pointer"
          >
            <Bell size={18} />
            {pendingInvoices.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-gold-luxury text-white text-[9px] font-extrabold flex items-center justify-center animate-bounce shadow-md">
                {pendingInvoices.length}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-3 w-80 glass-panel bg-white/95 border border-white/60 shadow-2xl p-4 z-50 rounded-2xl animate-fade-in">
              <h4 className="text-xs font-bold uppercase tracking-wider text-purple-royal border-b border-purple-royal/10 pb-2 mb-2">
                Live System Notifications
              </h4>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {pendingInvoices.length === 0 ? (
                  <p className="text-[11px] text-charcoal-dark/50 text-center py-4">
                    All operations running smoothly.
                  </p>
                ) : (
                  pendingInvoices.map((inv) => (
                    <div
                      key={inv.id}
                      className="p-2 rounded-lg bg-purple-royal/5 border-l-4 border-gold-luxury text-[11px]"
                    >
                      <p className="font-bold text-purple-royal">
                        Payment Pending: {inv.customerName}
                      </p>
                      <p className="text-charcoal-dark/66 mt-0.5">
                        Amount: ₹{(inv.amount).toLocaleString("en-IN")}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Topbar;
