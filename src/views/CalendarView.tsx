"use client";

import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Calendar, Info, Clock, User, AlertTriangle } from "lucide-react";
import { useERP, Booking, BookingType } from "@/context/ERPContext";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlassButton } from "@/components/ui/GlassButton";
import { GlassModal } from "@/components/ui/GlassModal";

export const CalendarView: React.FC = () => {
  const { bookings, updateBookingDate, weatherData, weatherLoading } = useERP();
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [rescheduleDate, setRescheduleDate] = useState("");
  const [isRescheduling, setIsRescheduling] = useState(false);

  const year = 2026;
  const month = 6; // July 2026

  const daysInJuly = 31;
  const startDayOfWeek = 3; // Wednesday

  const daysGrid: (number | null)[] = [];
  
  for (let i = 0; i < startDayOfWeek; i++) {
    daysGrid.push(null);
  }

  for (let d = 1; d <= daysInJuly; d++) {
    daysGrid.push(d);
  }

  const totalCellsNeeded = daysGrid.length <= 35 ? 35 : 42;
  while (daysGrid.length < totalCellsNeeded) {
    daysGrid.push(null);
  }

  const getBookingsForDay = (day: number) => {
    const formattedDay = day < 10 ? `0${day}` : `${day}`;
    const dateStr = `2026-07-${formattedDay}`;
    return bookings.filter((b) => b.bookingDate === dateStr && b.status !== "Cancelled");
  };

  const getBookingColor = (type: BookingType) => {
    switch (type) {
      case "Wedding":
        return "bg-amber-500/20 text-amber-900 border-amber-500/50 hover:bg-amber-500/35";
      case "Reception":
        return "bg-emerald-500/20 text-emerald-900 border-emerald-500/50 hover:bg-emerald-500/35";
      case "Corporate":
        return "bg-blue-500/20 text-blue-900 border-blue-500/50 hover:bg-blue-500/35";
      case "Birthday":
        return "bg-orange-500/20 text-orange-900 border-orange-500/50 hover:bg-orange-500/35";
      case "Maintenance":
        return "bg-gray-500/20 text-gray-800 border-gray-500/50 hover:bg-gray-500/35";
      default:
        return "bg-purple-royal/20 text-purple-royal border-purple-royal/50 hover:bg-purple-royal/35";
    }
  };

  const handleBookingClick = (booking: Booking, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedBooking(booking);
    setRescheduleDate(booking.bookingDate);
    setIsRescheduling(false);
  };

  const handleSaveReschedule = () => {
    if (selectedBooking && rescheduleDate) {
      updateBookingDate(selectedBooking.id, rescheduleDate);
      setSelectedBooking({
        ...selectedBooking,
        bookingDate: rescheduleDate,
      });
      setIsRescheduling(false);
    }
  };

  const getWeatherEmoji = (code: number) => {
    if (code === 0) return "☀️";
    if ([1, 2, 3].includes(code)) return "⛅";
    if ([45, 48].includes(code)) return "🌫️";
    if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code)) return "🌧️";
    if ([95, 96, 99].includes(code)) return "⛈️";
    return "☁️";
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in select-none">
      {/* Title */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-extrabold text-purple-royal leading-none">
            Event Calendar
          </h2>
          <p className="text-xs text-charcoal-dark/50 mt-1.5 font-medium uppercase tracking-wide">
            Peak wedding seasonal timeline calendar view
          </p>
        </div>

        <div className="flex items-center gap-3 bg-purple-royal/5 border border-purple-royal/10 rounded-2xl px-4 py-2 text-purple-royal font-bold text-sm">
          <Calendar size={16} className="text-gold-luxury" />
          <span>July 2026</span>
        </div>
      </div>

      {/* Calendar Grid Container */}
      <GlassCard className="p-4 border-white/60 bg-white/40 shadow-xl overflow-x-auto">
        <div className="min-w-[768px]">
          {/* Weekday Names */}
          <div className="grid grid-cols-7 text-center font-bold text-xs uppercase tracking-wider text-purple-royal border-b border-purple-royal/10 pb-3">
            <div>Sun</div>
            <div>Mon</div>
            <div>Tue</div>
            <div>Wed</div>
            <div>Thu</div>
            <div>Fri</div>
            <div>Sat</div>
          </div>

          {/* Calendar Cells Grid */}
          <div className="grid grid-cols-7 grid-rows-5 gap-2 mt-3">
            {daysGrid.map((day, idx) => {
              if (day === null) {
                return (
                  <div
                    key={`empty-${idx}`}
                    className="h-28 rounded-xl bg-purple-royal/[0.01] border border-dashed border-purple-royal/[0.04]"
                  />
                );
              }

              const dayBookings = getBookingsForDay(day);
              const isToday = day === 16;
              const formattedDay = day < 10 ? `0${day}` : `${day}`;
              const dateStr = `2026-07-${formattedDay}`;
              
              // Get live weather forecast day matching this cell
              const dayForecast = weatherData?.forecast.find((f) => f.date === dateStr);
              
              // Warning if rain prob exceeds 60% on outdoor lawn booking
              const hasRainLawnAlert = dayBookings.some(
                (b) => b.venueName === "Royal Lawns" && dayForecast && dayForecast.rainProb >= 60
              );

              return (
                <div
                  key={`day-${day}`}
                  className={`h-28 rounded-xl border p-2 flex flex-col justify-between transition-all duration-300 relative ${
                    hasRainLawnAlert
                      ? "border-rose-500 bg-rose-500/[0.03] shadow-md shadow-rose-500/10"
                      : isToday
                      ? "bg-gradient-to-tr from-gold-luxury/10 to-purple-royal/5 border-gold-luxury/80 shadow-md shadow-gold-luxury/15"
                      : "bg-white/45 border-purple-royal/5 hover:border-gold-luxury/20 hover:bg-white/60"
                  }`}
                >
                  {/* Day header */}
                  <div className="flex justify-between items-start">
                    <span
                      className={`text-xs font-bold ${
                        isToday
                          ? "w-6 h-6 rounded-full bg-gold-luxury text-charcoal-dark flex items-center justify-center shadow-sm"
                          : "text-charcoal-dark/70"
                      }`}
                    >
                      {day}
                    </span>

                    {/* Integrated Weather Forecast */}
                    {dayForecast && !weatherLoading && (
                      <span
                        className="text-[9px] font-bold text-charcoal-dark/50 flex items-center gap-0.5 select-none leading-none cursor-help"
                        title={`${dayForecast.condition} | Rain risk: ${dayForecast.rainProb}%`}
                      >
                        {getWeatherEmoji(dayForecast.weatherCode)}
                        <span className={dayForecast.rainProb >= 60 ? "text-rose-500" : ""}>
                          {dayForecast.rainProb}%
                        </span>
                      </span>
                    )}

                    {isToday && (
                      <span className="text-[7px] font-extrabold uppercase text-gold-dark tracking-wider">
                        Today
                      </span>
                    )}
                  </div>

                  {/* Warning Badge if rain is predicted on lawn booking */}
                  {hasRainLawnAlert && (
                    <div className="absolute top-8 left-2 right-2 bg-rose-500/10 border border-rose-500/25 rounded p-1 flex items-center gap-1 text-[8px] font-extrabold text-rose-700 uppercase tracking-wide animate-pulse">
                      <AlertTriangle size={10} className="shrink-0" /> Rain Lawn Alert
                    </div>
                  )}

                  {/* Day Bookings List inside Cell */}
                  <div className={`flex-1 mt-1.5 overflow-y-auto space-y-1 pr-0.5 ${hasRainLawnAlert ? "pt-4" : ""}`}>
                    {dayBookings.map((b) => (
                      <button
                        key={b.id}
                        onClick={(e) => handleBookingClick(b, e)}
                        className={`w-full text-left px-2 py-1 rounded-md text-[9px] font-bold border transition-all duration-200 truncate cursor-pointer ${getBookingColor(
                          b.bookingType
                        )}`}
                      >
                        {b.customerName.split(" & ")[0].split("'s")[0]}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </GlassCard>

      {/* Floating Glass Preview Modal */}
      <GlassModal
        isOpen={selectedBooking !== null}
        onClose={() => setSelectedBooking(null)}
        title="Event Details & Scheduling"
        className="max-w-md"
      >
        {selectedBooking && (
          <div className="space-y-4">
            <div className="flex items-center gap-4 border-b border-purple-royal/10 pb-4">
              <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-gold-luxury bg-white shrink-0">
                <img
                  src={selectedBooking.customerPhoto}
                  alt={selectedBooking.customerName}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h4 className="text-md font-bold text-purple-royal leading-tight">
                  {selectedBooking.customerName}
                </h4>
                <p className="text-xs text-gold-dark font-semibold mt-1">
                  Type: {selectedBooking.bookingType} | Package: {selectedBooking.packageSelected}
                </p>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2 text-charcoal-dark/70">
                <Calendar size={14} className="text-gold-luxury" />
                <span>
                  Date:{" "}
                  <strong className="font-bold">
                    {new Date(selectedBooking.bookingDate).toLocaleDateString("en-IN", {
                      weekday: "short",
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </strong>
                </span>
              </div>
              <div className="flex items-center gap-2 text-charcoal-dark/70">
                <Clock size={14} className="text-gold-luxury" />
                <span>Venue: <strong className="font-bold">{selectedBooking.venueName}</strong></span>
              </div>
              <div className="flex items-center gap-2 text-charcoal-dark/70">
                <User size={14} className="text-gold-luxury" />
                <span>Guests: <strong className="font-bold">{selectedBooking.guestCount}</strong></span>
              </div>

              {/* Weather forecast status in detail modal */}
              {weatherData && (
                <div className="flex items-center gap-2 text-charcoal-dark/70 pt-2 border-t border-purple-royal/5">
                  <span className="text-md select-none shrink-0 leading-none">
                    {getWeatherEmoji(
                      weatherData.forecast.find((f) => f.date === selectedBooking.bookingDate)?.weatherCode || 3
                    )}
                  </span>
                  <span>
                    Forecast:{" "}
                    <strong className="font-bold text-purple-royal">
                      {weatherData.forecast.find((f) => f.date === selectedBooking.bookingDate)?.condition || "Cloudy"}
                    </strong>{" "}
                    ({weatherData.forecast.find((f) => f.date === selectedBooking.bookingDate)?.rainProb || 20}% rain probability)
                  </span>
                </div>
              )}
            </div>

            {/* Rescheduling Panel */}
            <div className="border-t border-purple-royal/10 pt-4 mt-2">
              {!isRescheduling ? (
                <div className="flex gap-2">
                  <GlassButton
                    variant="gold"
                    className="flex-1 py-2 text-xs"
                    onClick={() => setIsRescheduling(true)}
                  >
                    Reschedule Date
                  </GlassButton>
                  <GlassButton
                    variant="secondary"
                    className="flex-1 py-2 text-xs"
                    onClick={() => setSelectedBooking(null)}
                  >
                    Close Preview
                  </GlassButton>
                </div>
              ) : (
                <div className="space-y-3">
                  <h5 className="text-xs font-bold uppercase tracking-wider text-purple-royal">
                    Choose New Reschedule Date
                  </h5>
                  <div className="flex items-center gap-3">
                    <input
                      type="date"
                      value={rescheduleDate}
                      onChange={(e) => setRescheduleDate(e.target.value)}
                      className="glass-input px-3 py-2 rounded-xl text-xs flex-1 bg-white/40 border border-purple-royal/10 focus:ring-2 focus:ring-gold-luxury/20 focus:outline-none"
                    />
                    <GlassButton
                      variant="gold"
                      className="px-4 py-2 text-xs"
                      onClick={handleSaveReschedule}
                    >
                      Save
                    </GlassButton>
                    <GlassButton
                      variant="secondary"
                      className="px-4 py-2 text-xs"
                      onClick={() => setIsRescheduling(false)}
                    >
                      Cancel
                    </GlassButton>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </GlassModal>
    </div>
  );
};

export default CalendarView;
