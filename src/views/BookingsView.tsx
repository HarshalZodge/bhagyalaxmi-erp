"use client";

import React, { useState } from "react";
import {
  Users,
  Calendar,
  MapPin,
  IndianRupee,
  MessageSquare,
  CheckCircle,
  XCircle,
  Eye,
  SlidersHorizontal,
} from "lucide-react";
import { useERP, Booking, BookingStatus } from "@/context/ERPContext";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlassButton } from "@/components/ui/GlassButton";
import { GlassSelect } from "@/components/ui/GlassSelect";

export const BookingsView: React.FC = () => {
  const { bookings, searchQuery, updateBookingStatus, setActiveView } = useERP();
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Filter based on search query AND select filter
  const filteredBookings = bookings.filter((b) => {
    const matchesSearch =
      b.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.venueName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.bookingType.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || b.status.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: BookingStatus) => {
    const styles = {
      Confirmed: "bg-emerald-500/10 text-emerald-700 border-emerald-500/20",
      "Pending Payment": "bg-amber-500/10 text-amber-700 border-amber-500/20",
      Completed: "bg-purple-royal/10 text-purple-royal border-purple-royal/20",
      Cancelled: "bg-rose-500/10 text-rose-700 border-rose-500/20",
    };
    return (
      <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${styles[status]}`}>
        {status}
      </span>
    );
  };

  const getBookingTypeBadge = (type: string) => {
    const styles: Record<string, string> = {
      Wedding: "bg-amber-500/10 text-amber-700 border-amber-500/10",
      Reception: "bg-emerald-500/10 text-emerald-700 border-emerald-500/10",
      Corporate: "bg-blue-500/10 text-blue-700 border-blue-500/10",
      Birthday: "bg-orange-500/10 text-orange-700 border-orange-500/10",
      Maintenance: "bg-gray-500/10 text-gray-700 border-gray-500/10",
    };
    return (
      <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold border ${styles[type] || ""}`}>
        {type}
      </span>
    );
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Title */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-purple-royal leading-none">
            Luxury Booking Manager
          </h2>
          <p className="text-xs text-charcoal-dark/50 mt-1.5 font-medium uppercase tracking-wide">
            Filter, verify, and manage lawns and banquet schedule
          </p>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 self-end sm:self-auto">
          <span className="text-charcoal-dark/50 text-xs font-bold uppercase tracking-wider flex items-center gap-1">
            <SlidersHorizontal size={14} /> Filter:
          </span>
          <div className="w-44">
            <GlassSelect
              options={[
                { value: "all", label: "All Bookings" },
                { value: "confirmed", label: "Confirmed" },
                { value: "pending payment", label: "Pending Payment" },
                { value: "completed", label: "Completed" },
                { value: "cancelled", label: "Cancelled" },
              ]}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Grid List */}
      {filteredBookings.length === 0 ? (
        <GlassCard className="text-center py-16">
          <p className="text-sm font-semibold text-charcoal-dark/50">No bookings match the filter criteria.</p>
          <GlassButton
            variant="gold"
            onClick={() => setActiveView("booking-page")}
            className="mx-auto mt-4"
          >
            Create New Booking
          </GlassButton>
        </GlassCard>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBookings.map((booking) => (
            <GlassCard
              key={booking.id}
              className="flex flex-col justify-between h-[360px] relative border-white/60 bg-white/40 hover:border-gold-luxury/30"
            >
              {/* Header: Photo and Badges */}
              <div className="flex gap-4 items-start">
                <div className="w-16 h-16 rounded-2xl border border-purple-royal/10 overflow-hidden shrink-0 bg-white shadow-sm">
                  <img
                    src={booking.customerPhoto}
                    alt={booking.customerName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="space-y-1 overflow-hidden">
                  <div className="flex flex-wrap items-center gap-1.5">
                    {getBookingTypeBadge(booking.bookingType)}
                    {getStatusBadge(booking.status)}
                  </div>
                  <h3 className="font-extrabold text-sm text-purple-royal leading-tight truncate pr-2 mt-1">
                    {booking.customerName}
                  </h3>
                  <p className="text-[10px] text-charcoal-dark/40 font-medium">
                    Package: {booking.packageSelected}
                  </p>
                </div>
              </div>

              {/* Event details */}
              <div className="my-4 space-y-2 border-t border-b border-purple-royal/5 py-3 text-xs">
                <div className="flex items-center gap-2 text-charcoal-dark/70">
                  <MapPin size={14} className="text-gold-luxury" />
                  <span className="font-semibold">{booking.venueName}</span>
                </div>
                <div className="flex items-center gap-2 text-charcoal-dark/70">
                  <Calendar size={14} className="text-gold-luxury" />
                  <span className="font-semibold">
                    {new Date(booking.bookingDate).toLocaleDateString("en-IN", {
                      weekday: "short",
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <div className="flex items-center justify-between text-charcoal-dark/70">
                  <div className="flex items-center gap-2">
                    <Users size={14} className="text-gold-luxury" />
                    <span>Guests: <strong className="font-bold">{booking.guestCount}</strong></span>
                  </div>
                  <div className="flex items-center gap-1 font-bold text-purple-royal text-sm">
                    <IndianRupee size={12} className="text-gold-luxury" />
                    {booking.amount.toLocaleString("en-IN")}
                  </div>
                </div>
              </div>

              {/* Checklist Progress */}
              <div className="space-y-1 mb-4">
                <div className="flex justify-between text-[9px] font-bold text-charcoal-dark/50">
                  <span>OPERATIONAL PREPARATION</span>
                  <span>{booking.progress}%</span>
                </div>
                <div className="w-full bg-purple-royal/5 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-purple-royal to-gold-luxury h-full rounded-full transition-all duration-500"
                    style={{ width: `${booking.progress}%` }}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                {booking.status === "Pending Payment" && (
                  <GlassButton
                    variant="gold"
                    className="flex-1 py-2 text-xs"
                    onClick={() => updateBookingStatus(booking.id, "Confirmed")}
                  >
                    <CheckCircle size={14} /> Confirm Payment
                  </GlassButton>
                )}
                {booking.status === "Confirmed" && (
                  <GlassButton
                    variant="secondary"
                    className="flex-1 py-2 text-xs text-emerald-600 border-emerald-200 bg-emerald-50/10 hover:bg-emerald-50/20"
                    onClick={() => updateBookingStatus(booking.id, "Completed")}
                  >
                    <CheckCircle size={14} /> Mark Complete
                  </GlassButton>
                )}
                {booking.status !== "Cancelled" && booking.status !== "Completed" && (
                  <button
                    onClick={() => updateBookingStatus(booking.id, "Cancelled")}
                    title="Cancel Booking"
                    className="p-2 rounded-xl border border-rose-200 bg-rose-50/10 hover:bg-rose-50/30 text-rose-600 transition-all cursor-pointer"
                  >
                    <XCircle size={15} />
                  </button>
                )}
                <GlassButton
                  variant="secondary"
                  className="px-3.5 py-2 text-xs"
                  onClick={() => {
                    setActiveView("customers");
                  }}
                  title="View Customer CRM"
                >
                  <MessageSquare size={14} />
                </GlassButton>
              </div>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  );
};

export default BookingsView;
