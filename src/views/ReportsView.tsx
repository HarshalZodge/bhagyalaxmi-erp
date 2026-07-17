"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";
import { Sparkles, BarChart3, TrendingUp, CalendarRange } from "lucide-react";
import { useERP, BookingType } from "@/context/ERPContext";
import { GlassCard } from "@/components/ui/GlassCard";

export const ReportsView: React.FC = () => {
  const { bookings } = useERP();

  // 1. Calculate Booking Type Distribution for Pie Chart
  const typeCounts = bookings.reduce((acc, b) => {
    if (b.status !== "Cancelled") {
      acc[b.bookingType] = (acc[b.bookingType] || 0) + 1;
    }
    return acc;
  }, {} as Record<BookingType, number>);

  const pieData = Object.keys(typeCounts).map((key) => ({
    name: key,
    value: typeCounts[key as BookingType],
  }));

  // Theme colors for Pie Chart
  const COLORS = ["#d4af37", "#10b981", "#3b82f6", "#f97316", "#6b7280"];

  // 2. Monthly Profit Margin Mock Data
  const monthlyProfitData = [
    { month: "Jan", revenue: 500000, expenses: 180000, profit: 320000 },
    { month: "Feb", revenue: 800000, expenses: 220000, profit: 580000 },
    { month: "Mar", revenue: 650000, expenses: 200000, profit: 450000 },
    { month: "Apr", revenue: 1000000, expenses: 310000, profit: 690000 },
    { month: "May", revenue: 1600000, expenses: 450000, profit: 1150000 },
    { month: "Jun", revenue: 1200000, expenses: 380000, profit: 820000 },
  ];

  // 3. Occupancy Heatmap Grid Calculations for July 2026 (1 to 31)
  const isDateBooked = (day: number) => {
    const formattedDay = day < 10 ? `0${day}` : `${day}`;
    const dateStr = `2026-07-${formattedDay}`;
    return bookings.some((b) => b.bookingDate === dateStr && b.status !== "Cancelled");
  };

  const getHeatmapColor = (day: number) => {
    if (day === 16) return "bg-gold-luxury border-gold-luxury text-charcoal-dark shadow shadow-gold-luxury/20"; // Today
    if (isDateBooked(day)) return "bg-purple-royal/20 border-purple-royal/35 text-purple-royal font-bold"; // Booked
    return "bg-emerald-500/5 border-emerald-500/10 text-emerald-700/60"; // Free
  };

  const formatINR = (val: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in select-none">
      {/* Title */}
      <div>
        <h2 className="text-3xl font-extrabold text-purple-royal leading-none">
          Operational Analytics
        </h2>
        <p className="text-xs text-charcoal-dark/50 mt-1.5 font-medium uppercase tracking-wide">
          Interactive metrics, profits dashboards, and scheduling heatmaps
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Earnings / Performance */}
        <GlassCard className="lg:col-span-2 flex flex-col justify-between">
          <div className="flex items-center gap-2 border-b border-purple-royal/5 pb-3">
            <BarChart3 className="text-gold-luxury w-4.5 h-4.5" />
            <h4 className="text-sm font-bold uppercase tracking-wider text-purple-royal">
              Monthly Margins & Cost-Benefit
            </h4>
          </div>
          <div className="h-64 w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyProfitData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(76, 29, 149, 0.05)" />
                <XAxis dataKey="month" stroke="rgba(0,0,0,0.4)" fontSize={10} tickLine={false} />
                <YAxis stroke="rgba(0,0,0,0.4)" fontSize={10} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    background: "rgba(255,255,255,0.85)",
                    backdropFilter: "blur(10px)",
                    borderColor: "rgba(212,175,55,0.4)",
                    borderRadius: "12px",
                    color: "#1f2937",
                    fontSize: "11px",
                  }}
                  formatter={(val: any) => [formatINR(val)]}
                />
                <Legend iconSize={10} wrapperStyle={{ fontSize: "10px" }} />
                <Bar dataKey="revenue" fill="#4c1d95" name="Gross Earnings" radius={[3, 3, 0, 0]} />
                <Bar dataKey="expenses" fill="#f43f5e" name="Expenditures" radius={[3, 3, 0, 0]} />
                <Bar dataKey="profit" fill="#d4af37" name="Net Margin" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* Pie Chart: Booking type counts */}
        <GlassCard className="flex flex-col justify-between">
          <div className="flex items-center gap-2 border-b border-purple-royal/5 pb-3">
            <Sparkles className="text-gold-luxury w-4.5 h-4.5" />
            <h4 className="text-sm font-bold uppercase tracking-wider text-purple-royal">
              Event Category Share
            </h4>
          </div>
          <div className="h-60 w-full mt-2 relative flex items-center justify-center">
            {pieData.length === 0 ? (
              <p className="text-xs text-charcoal-dark/40">No data available</p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: "rgba(255,255,255,0.85)",
                      backdropFilter: "blur(10px)",
                      borderColor: "rgba(76,29,149,0.2)",
                      borderRadius: "12px",
                      fontSize: "11px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
          {/* Custom Pie Legend */}
          <div className="flex flex-wrap gap-x-4 gap-y-2 justify-center text-[10px] font-semibold text-charcoal-dark/60 mt-2">
            {pieData.map((d, idx) => (
              <div key={d.name} className="flex items-center gap-1">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                />
                <span>
                  {d.name} ({d.value})
                </span>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Heatmap Section */}
        <GlassCard className="lg:col-span-3">
          <div className="flex items-center gap-2 border-b border-purple-royal/5 pb-3 mb-6">
            <CalendarRange className="text-gold-luxury w-4.5 h-4.5" />
            <div>
              <h4 className="text-sm font-bold uppercase tracking-wider text-purple-royal">
                July 2026 Occupancy Heatmap
              </h4>
              <p className="text-[10px] text-charcoal-dark/50">
                Visual slot saturation grid (Gold = Today, Red/Purple = Booked, Green = Available)
              </p>
            </div>
          </div>

          {/* Grid of days */}
          <div className="grid grid-cols-7 gap-3 max-w-4xl mx-auto">
            {/* June spacer cells */}
            <div className="h-14 rounded-xl border border-dashed border-purple-royal/5 opacity-30 flex items-center justify-center text-xs font-semibold text-charcoal-dark/30">
              Jun 29
            </div>
            <div className="h-14 rounded-xl border border-dashed border-purple-royal/5 opacity-30 flex items-center justify-center text-xs font-semibold text-charcoal-dark/30">
              Jun 30
            </div>

            {/* July Days */}
            {Array.from({ length: 31 }).map((_, idx) => {
              const day = idx + 1;
              return (
                <div
                  key={`heat-${day}`}
                  className={`h-14 rounded-xl border flex flex-col justify-between p-2 text-xs font-bold transition-all duration-300 ${getHeatmapColor(
                    day
                  )}`}
                >
                  <span>{day}</span>
                  <span className="text-[7px] font-extrabold uppercase text-right tracking-wider">
                    {day === 16 ? "Today" : isDateBooked(day) ? "Full" : "Open"}
                  </span>
                </div>
              );
            })}

            {/* August spacer cells */}
            <div className="h-14 rounded-xl border border-dashed border-purple-royal/5 opacity-30 flex items-center justify-center text-xs font-semibold text-charcoal-dark/30">
              Aug 1
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

export default ReportsView;
