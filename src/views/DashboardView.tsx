"use client";

import React from "react";
import {
  TrendingUp,
  Users,
  CalendarCheck,
  Fuel,
  IndianRupee,
  Clock,
  ChevronRight,
  AlertCircle,
  FileCheck,
  Wind,
  Droplets,
  CloudLightning,
  Sun,
  Sunrise,
  Sunset,
  AlertTriangle,
  Sparkles,
} from "lucide-react";
import { useERP } from "@/context/ERPContext";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlassButton } from "@/components/ui/GlassButton";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from "recharts";

export const DashboardView: React.FC = () => {
  const {
    bookings,
    generatorFuelLevel,
    generatorRuntimeHours,
    setActiveView,
    weatherData,
    weatherLoading,
  } = useERP();

  const activeBookings = bookings.filter((b) => b.status !== "Cancelled");
  const totalRevenue = activeBookings.reduce((sum, b) => sum + b.amount, 0);
  const pendingPaymentsAmount = bookings
    .filter((b) => b.status === "Pending Payment")
    .reduce((sum, b) => sum + b.amount, 0);
  
  const confirmedCount = bookings.filter((b) => b.status === "Confirmed").length;
  
  const revenueChartData = [
    { name: "Apr", revenue: 800000 },
    { name: "May", revenue: 1400000 },
    { name: "Jun", revenue: 1100000 },
    { name: "Jul", revenue: 1850000 },
    { name: "Aug", revenue: 1200000 },
    { name: "Sep", revenue: 950000 },
    { name: "Oct", revenue: 1600000 },
    { name: "Nov", revenue: 2800000 },
    { name: "Dec", revenue: 3200000 },
  ];

  const occupancyChartData = [
    { name: "Apr", Weddings: 5, Corporate: 2 },
    { name: "May", Weddings: 12, Corporate: 3 },
    { name: "Jun", Weddings: 8, Corporate: 4 },
    { name: "Jul", Weddings: 14, Corporate: 1 },
    { name: "Aug", Weddings: 10, Corporate: 5 },
    { name: "Sep", Weddings: 6, Corporate: 3 },
  ];

  const formatINR = (val: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  // Weather Emoji Selector
  const getWeatherEmoji = (code: number) => {
    if (code === 0) return "☀️";
    if ([1, 2, 3].includes(code)) return "⛅";
    if ([45, 48].includes(code)) return "🌫️";
    if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code)) return "🌧️";
    if ([95, 96, 99].includes(code)) return "⛈️";
    return "☁️";
  };

  // Weather Intelligence Recommendation Engine
  const generateWeatherRecommendations = () => {
    if (!weatherData) return [];
    const recs = [];

    // Check if rain probability on current day or next days exceeds 60%
    const highRainDays = weatherData.forecast.filter((f) => f.rainProb >= 60);

    if (highRainDays.length > 0) {
      recs.push({
        title: "Prepare Waterproof Mandap Tents",
        desc: `High precipitation probability detected on dates: ${highRainDays
          .slice(0, 2)
          .map((f) => new Date(f.date).toLocaleDateString([], { day: "numeric", month: "short" }))
          .join(", ")}. Deploy roofing curtains on Royal Lawns immediately.`,
        priority: "High",
      });
      recs.push({
        title: "Standby 125 KVA backup generator",
        desc: "Severe weather raises power outage risk in Bhingar. Ensure generator diesel level remains > 80% with key operators stationed.",
        priority: "High",
      });
    }

    // Check if there are outdoor bookings on rainy days
    const outdoorBookingsOnRainDays = bookings.filter((b) => {
      if (b.status === "Cancelled" || b.venueName !== "Royal Lawns") return false;
      const forecastDay = weatherData.forecast.find((f) => f.date === b.bookingDate);
      return forecastDay && forecastDay.rainProb >= 60;
    });

    outdoorBookingsOnRainDays.forEach((booking) => {
      const clientName = booking.customerName.split("'s")[0];
      recs.push({
        title: `Notify ${clientName} & Shift Buffet`,
        desc: `Outdoor event "${booking.customerName}" on ${new Date(booking.bookingDate).toLocaleDateString([], {
          day: "numeric",
          month: "short",
        })} faces ${
          weatherData.forecast.find((f) => f.date === booking.bookingDate)?.rainProb
        }% rain risk. Propose shifting buffet counters to Maharaja AC Hall.`,
        priority: "Medium",
      });
      recs.push({
        title: "Recommend indoor hall upgrade",
        desc: `Send brochure update to ${clientName} offering Maharaja Grand AC Hall upgrade instead of open lawn to avoid rain interruption.`,
        priority: "Medium",
      });
    });

    if (recs.length === 0) {
      recs.push({
        title: "Standard Operational Modes",
        desc: "Clear sky predicted. Outdoor lawns can be decorated open-air without secondary waterproof shade grids.",
        priority: "Low",
      });
    }

    return recs;
  };

  const weatherRecommendations = generateWeatherRecommendations();

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Title */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-extrabold text-purple-royal leading-none">
            Command Center
          </h2>
          <p className="text-xs text-charcoal-dark/50 mt-1.5 font-medium uppercase tracking-wide">
            Bhagyalaxmi lawns & banquet hall operations
          </p>
        </div>
        <GlassButton variant="gold" onClick={() => setActiveView("booking-page")}>
          Book New Event <ChevronRight size={16} />
        </GlassButton>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <GlassCard variant="purple" className="flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-bold text-purple-royal/60 uppercase tracking-widest">
                Operating Revenue
              </p>
              <h3 className="text-xl font-extrabold text-purple-royal mt-1">
                {formatINR(totalRevenue)}
              </h3>
            </div>
            <span className="p-2 bg-purple-royal/10 rounded-xl text-purple-royal">
              <IndianRupee size={16} />
            </span>
          </div>
          <p className="text-[10px] font-semibold text-emerald-600 mt-4 flex items-center gap-1">
            <TrendingUp size={12} /> +18.4% from Q1
          </p>
        </GlassCard>

        <GlassCard variant="default" className="flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-bold text-charcoal-dark/50 uppercase tracking-widest">
                Active Bookings
              </p>
              <h3 className="text-xl font-extrabold text-charcoal-dark mt-1">
                {activeBookings.length} Events
              </h3>
            </div>
            <span className="p-2 bg-gold-luxury/10 rounded-xl text-gold-luxury">
              <CalendarCheck size={16} />
            </span>
          </div>
          <p className="text-[10px] font-semibold text-charcoal-dark/40 mt-4">
            {confirmedCount} Confirmed, {activeBookings.length - confirmedCount} Pending
          </p>
        </GlassCard>

        <GlassCard variant="gold" className="flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-bold text-gold-dark uppercase tracking-widest">
                Occupancy Rate
              </p>
              <h3 className="text-xl font-extrabold text-gold-dark mt-1">
                78%
              </h3>
            </div>
            <span className="p-2 bg-gold-luxury/15 rounded-xl text-gold-dark">
              <Users size={16} />
            </span>
          </div>
          <div className="w-full bg-gold-luxury/10 h-1.5 rounded-full mt-4 overflow-hidden">
            <div className="bg-gold-luxury h-full rounded-full" style={{ width: "78%" }} />
          </div>
        </GlassCard>

        <GlassCard variant="default" className="flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-bold text-charcoal-dark/50 uppercase tracking-widest">
                Outstanding Dues
              </p>
              <h3 className="text-xl font-extrabold text-rose-600 mt-1">
                {formatINR(pendingPaymentsAmount)}
              </h3>
            </div>
            <span className="p-2 bg-rose-500/10 rounded-xl text-rose-500">
              <FileCheck size={16} />
            </span>
          </div>
          <p className="text-[10px] font-semibold text-rose-500/80 mt-4">
            Action required on 3 invoices
          </p>
        </GlassCard>

        <GlassCard variant="default" className="flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-bold text-charcoal-dark/50 uppercase tracking-widest">
                Generator Fuel
              </p>
              <h3 className="text-xl font-extrabold text-charcoal-dark mt-1">
                {generatorFuelLevel}% Capacity
              </h3>
            </div>
            <span className="p-2 bg-purple-royal/10 rounded-xl text-purple-royal">
              <Fuel size={16} />
            </span>
          </div>
          <div className="mt-4 flex flex-col gap-1">
            <div className="w-full bg-purple-royal/10 h-1.5 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  generatorFuelLevel < 35 ? "bg-rose-500" : "bg-emerald-500"
                }`}
                style={{ width: `${generatorFuelLevel}%` }}
              />
            </div>
            <span className="text-[9px] font-bold text-charcoal-dark/40 text-right mt-1">
              Runtime: {generatorRuntimeHours} Hrs
            </span>
          </div>
        </GlassCard>
      </div>

      {/* WEATHER INTELLIGENCE MODULE ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        {/* Current Weather Card */}
        <GlassCard className="p-6 border-white/60 bg-white/40 flex flex-col justify-between">
          {weatherLoading ? (
            <div className="flex-1 flex items-center justify-center py-12">
              <div className="w-8 h-8 border-4 border-purple-royal/10 border-t-gold-luxury rounded-full animate-spin" />
            </div>
          ) : weatherData ? (
            <div className="space-y-4">
              <div className="flex justify-between items-start border-b border-purple-royal/10 pb-3">
                <div>
                  <h4 className="text-xs font-extrabold uppercase tracking-widest text-purple-royal leading-none">
                    Weather Intelligence
                  </h4>
                  <span className="text-[9px] font-semibold text-charcoal-dark/40 uppercase mt-1 block">
                    Bhagyalaxmi Lawns station
                  </span>
                </div>
                <span className="text-2xl select-none leading-none">
                  {getWeatherEmoji(weatherData.current.weatherCode)}
                </span>
              </div>

              {/* Main Temp display */}
              <div className="flex items-center gap-3">
                <span className="text-4xl font-extrabold text-purple-royal tracking-tighter">
                  {weatherData.current.temp}°C
                </span>
                <div>
                  <p className="text-xs font-extrabold text-gold-dark leading-none">
                    {weatherData.current.condition}
                  </p>
                  <p className="text-[9px] text-charcoal-dark/40 mt-1 font-semibold">
                    Rain risk: {weatherData.current.rainProb}%
                  </p>
                </div>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-purple-royal/5 text-[10px] text-charcoal-dark/60 font-semibold">
                <div className="flex flex-col">
                  <span className="text-[8px] font-bold text-charcoal-dark/35 uppercase">Humidity</span>
                  <span className="flex items-center gap-0.5 mt-0.5"><Droplets size={12} className="text-blue-500" /> {weatherData.current.humidity}%</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[8px] font-bold text-charcoal-dark/35 uppercase">Wind Speed</span>
                  <span className="flex items-center gap-0.5 mt-0.5"><Wind size={12} className="text-emerald-500" /> {weatherData.current.windSpeed} km/h</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[8px] font-bold text-charcoal-dark/35 uppercase">Clouds</span>
                  <span className="flex items-center gap-0.5 mt-0.5">☁️ {weatherData.current.cloudCover}%</span>
                </div>
                <div className="flex flex-col mt-2">
                  <span className="text-[8px] font-bold text-charcoal-dark/35 uppercase">UV Index</span>
                  <span className="flex items-center gap-0.5 mt-0.5"><Sun size={12} className="text-amber-500" /> {weatherData.current.uvIndex} Max</span>
                </div>
                <div className="flex flex-col mt-2">
                  <span className="text-[8px] font-bold text-charcoal-dark/35 uppercase">Sunrise</span>
                  <span className="flex items-center gap-0.5 mt-0.5"><Sunrise size={12} className="text-purple-royal/60" /> {weatherData.current.sunrise}</span>
                </div>
                <div className="flex flex-col mt-2">
                  <span className="text-[8px] font-bold text-charcoal-dark/35 uppercase">Sunset</span>
                  <span className="flex items-center gap-0.5 mt-0.5"><Sunset size={12} className="text-purple-royal/60" /> {weatherData.current.sunset}</span>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-xs text-charcoal-dark/40 py-12 text-center">Failed to load weather data.</p>
          )}
        </GlassCard>

        {/* 7-Day Forecast Card */}
        <GlassCard className="p-6 border-white/60 bg-white/40 flex flex-col justify-between">
          <div className="border-b border-purple-royal/10 pb-3">
            <h4 className="text-xs font-extrabold uppercase tracking-widest text-purple-royal leading-none">
              7-Day Operations Forecast
            </h4>
            <span className="text-[9px] font-semibold text-charcoal-dark/40 uppercase mt-1 block">
              Precipitation and temperatures
            </span>
          </div>

          {weatherLoading ? (
            <div className="flex-1 flex items-center justify-center py-12">
              <div className="w-8 h-8 border-4 border-purple-royal/10 border-t-gold-luxury rounded-full animate-spin" />
            </div>
          ) : weatherData ? (
            <div className="space-y-2 mt-4 flex-1 justify-between flex flex-col">
              {weatherData.forecast.slice(0, 7).map((f) => (
                <div
                  key={f.date}
                  className="flex justify-between items-center text-[10px] font-semibold text-charcoal-dark/70 border-b border-purple-royal/[0.03] pb-1.5"
                >
                  <span className="w-16">
                    {new Date(f.date).toLocaleDateString([], { weekday: "short", day: "numeric" })}
                  </span>
                  <span className="text-sm select-none w-6 text-center">
                    {getWeatherEmoji(f.weatherCode)}
                  </span>
                  <span className="w-12 text-right">
                    {f.tempMax}° / {f.tempMin}°
                  </span>
                  <span
                    className={`w-14 text-right font-bold ${
                      f.rainProb >= 60 ? "text-rose-500" : "text-charcoal-dark/40"
                    }`}
                  >
                    ☔ {f.rainProb}%
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-charcoal-dark/40 py-12 text-center">Unavailable.</p>
          )}
        </GlassCard>

        {/* Weather Intelligence Panel */}
        <GlassCard className="p-6 border-white/60 bg-[#d4af37]/5 hover:bg-[#d4af37]/8 border-[#d4af37]/25 flex flex-col justify-between">
          <div className="border-b border-[#d4af37]/20 pb-3 flex items-center gap-1.5 text-gold-dark">
            <AlertTriangle size={15} />
            <h4 className="text-xs font-bold uppercase tracking-wider">
              Weather Intelligence AI Panel
            </h4>
          </div>

          <div className="flex-1 mt-4 overflow-y-auto space-y-3 max-h-[190px] pr-1">
            {weatherLoading ? (
              <p className="text-[10px] text-charcoal-dark/40 text-center py-10">Analyzing metrics...</p>
            ) : (
              weatherRecommendations.map((rec, i) => (
                <div
                  key={i}
                  className={`p-2.5 rounded-xl border text-[10px] leading-relaxed ${
                    rec.priority === "High"
                      ? "bg-rose-500/10 border-rose-500/20 text-rose-800"
                      : rec.priority === "Medium"
                      ? "bg-amber-500/10 border-amber-500/20 text-amber-800"
                      : "bg-emerald-500/10 border-emerald-500/20 text-emerald-800"
                  }`}
                >
                  <p className="font-extrabold uppercase tracking-wider flex items-center gap-1 leading-none">
                    <Sparkles size={11} className="text-gold-luxury" /> {rec.title}
                  </p>
                  <p className="text-charcoal-dark/70 font-medium mt-1 leading-normal">{rec.desc}</p>
                </div>
              ))
            )}
          </div>
        </GlassCard>
      </div>

      {/* Main Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <GlassCard className="lg:col-span-2 flex flex-col justify-between">
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-purple-royal">
              Revenue Projections & Earnings
            </h4>
            <p className="text-[11px] text-charcoal-dark/50 font-medium">
              GST compliant gross wedding and corporate revenue logs
            </p>
          </div>
          <div className="h-64 w-full mt-6">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4c1d95" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#4c1d95" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(76, 29, 149, 0.05)" />
                <XAxis dataKey="name" stroke="rgba(0,0,0,0.4)" fontSize={10} tickLine={false} />
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
                  formatter={(value: any) => [formatINR(value), "Revenue"]}
                />
                <Area type="monotone" dataKey="revenue" stroke="#4c1d95" strokeWidth={2.5} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <GlassCard className="flex flex-col justify-between">
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-purple-royal">
              Monthly Bookings Occupancy
            </h4>
            <p className="text-[11px] text-charcoal-dark/50 font-medium">
              Event frequency distribution (Weddings vs Corporate)
            </p>
          </div>
          <div className="h-64 w-full mt-6">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={occupancyChartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(76, 29, 149, 0.05)" />
                <XAxis dataKey="name" stroke="rgba(0,0,0,0.4)" fontSize={10} tickLine={false} />
                <YAxis stroke="rgba(0,0,0,0.4)" fontSize={10} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    background: "rgba(255,255,255,0.85)",
                    backdropFilter: "blur(10px)",
                    borderColor: "rgba(76,29,149,0.2)",
                    borderRadius: "12px",
                    color: "#1f2937",
                    fontSize: "11px",
                  }}
                />
                <Legend iconSize={10} wrapperStyle={{ fontSize: "10px" }} />
                <Bar dataKey="Weddings" fill="#d4af37" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Corporate" fill="#4c1d95" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>

      {/* Timeline & Alerts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <GlassCard className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center border-b border-purple-royal/10 pb-3">
            <div className="flex items-center gap-2">
              <Clock className="text-gold-luxury w-4.5 h-4.5" />
              <h4 className="text-sm font-bold uppercase tracking-wider text-purple-royal">
                Today's Operations Timeline
              </h4>
            </div>
            <span className="text-[9px] font-bold text-gold-luxury uppercase bg-gold-luxury/10 px-2 py-0.5 rounded-full">
              July 16 (Peak Season)
            </span>
          </div>

          <div className="space-y-4 relative before:absolute before:left-3.5 before:top-2 before:bottom-2 before:w-[1.5px] before:bg-purple-royal/15">
            <div className="flex items-start gap-4 relative group">
              <div className="w-7 h-7 rounded-full bg-emerald-500/10 border border-emerald-500 text-emerald-600 flex items-center justify-center text-xs font-bold shrink-0 relative z-10 bg-white">
                ✓
              </div>
              <div className="flex-1 p-3 rounded-xl bg-purple-royal/5 border border-purple-royal/10">
                <p className="text-[11px] font-bold text-purple-royal leading-none">
                  09:00 AM - Cleaning & Prep
                </p>
                <p className="text-[10px] text-charcoal-dark/60 mt-1">
                  Royal Lawns complex washing and flower layout completed.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 relative group">
              <div className="w-7 h-7 rounded-full bg-purple-royal/10 border border-purple-royal text-purple-royal flex items-center justify-center text-[10px] font-extrabold shrink-0 relative z-10 bg-white animate-pulse">
                •
              </div>
              <div className="flex-1 p-3 rounded-xl bg-gold-luxury/5 border border-gold-luxury/20">
                <p className="text-[11px] font-bold text-gold-dark leading-none">
                  02:30 PM - Catering Quality Audit
                </p>
                <p className="text-[10px] text-charcoal-dark/60 mt-1">
                  Vegetable inspection & sweets base prep check in Maharaja AC Kitchen.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 relative group">
              <div className="w-7 h-7 rounded-full bg-charcoal-dark/10 border border-charcoal-dark/20 text-charcoal-dark/60 flex items-center justify-center text-[10px] font-bold shrink-0 relative z-10 bg-white">
                PM
              </div>
              <div className="flex-1 p-3 rounded-xl bg-white/40 border border-white/60">
                <p className="text-[11px] font-bold text-charcoal-dark/80 leading-none">
                  06:00 PM - Stage lighting & Audio Test
                </p>
                <p className="text-[10px] text-charcoal-dark/60 mt-1">
                  Check sound decibel calibration for Patil Sangeet event backdrop.
                </p>
              </div>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="space-y-4">
          <div className="border-b border-purple-royal/10 pb-3 flex items-center gap-2">
            <AlertCircle className="text-rose-500 w-4.5 h-4.5" />
            <h4 className="text-sm font-bold uppercase tracking-wider text-purple-royal">
              Live Facility Alerts
            </h4>
          </div>

          <div className="space-y-3">
            {generatorFuelLevel < 35 && (
              <div className="p-3 rounded-xl border border-rose-500/20 bg-rose-500/5 flex items-start gap-3">
                <AlertCircle className="text-rose-500 w-4 h-4 shrink-0 mt-0.5" />
                <div>
                  <p className="text-[11px] font-bold text-rose-700">Backup Generator fuel low</p>
                  <p className="text-[10px] text-rose-600/80 mt-0.5">
                    Refill diesel capacity immediately. Fuel shows {generatorFuelLevel}%.
                  </p>
                </div>
              </div>
            )}
            
            <div className="p-3 rounded-xl border border-amber-500/20 bg-amber-500/5 flex items-start gap-3">
              <AlertCircle className="text-amber-500 w-4 h-4 shrink-0 mt-0.5" />
              <div>
                <p className="text-[11px] font-bold text-amber-700">Outstanding Invoice due</p>
                <p className="text-[10px] text-amber-600/80 mt-0.5">
                  Vijay Patil has pending balance amount of ₹18,00,000 due.
                </p>
              </div>
            </div>

            <div className="p-3 rounded-xl border border-purple-royal/20 bg-purple-royal/5 flex items-start gap-3">
              <TrendingUp className="text-purple-royal w-4 h-4 shrink-0 mt-0.5" />
              <div>
                <p className="text-[11px] font-bold text-purple-royal">Database synced</p>
                <p className="text-[10px] text-charcoal-dark/60 mt-0.5">
                  Cloud backup secure. Sync completed 2 mins ago.
                </p>
              </div>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

export default DashboardView;
