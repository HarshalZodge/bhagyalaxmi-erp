"use client";

import React, { useState, useEffect } from "react";
import {
  User,
  Phone,
  Mail,
  Calendar,
  Sparkles,
  Users,
  IndianRupee,
  FileText,
  CheckCircle,
  MapPin,
} from "lucide-react";
import { useERP, BookingType, BookingStatus } from "@/context/ERPContext";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlassButton } from "@/components/ui/GlassButton";
import { GlassInput } from "@/components/ui/GlassInput";
import { GlassSelect } from "@/components/ui/GlassSelect";
import confetti from "canvas-confetti";

export const ManualBookingView: React.FC = () => {
  const { addBooking, bookings, setActiveView } = useERP();

  // --- FORM STATES ---
  const [customerName, setCustomerName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [venueName, setVenueName] = useState("Maharaja Grand Hall");
  const [bookingType, setBookingType] = useState<BookingType>("Wedding");
  const [bookingDate, setBookingDate] = useState("");
  const [eventSession, setEventSession] = useState<"Day" | "Night">("Day");
  const [guestCount, setGuestCount] = useState(500);
  const [packageSelected, setPackageSelected] = useState("Gold");
  const [amount, setAmount] = useState(150000);
  const [status, setStatus] = useState<BookingStatus>("Confirmed");
  const [notes, setNotes] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [success, setSuccess] = useState(false);

  // Auto-fill price default when package/venue changes
  useEffect(() => {
    let base = 150000;
    if (venueName === "Maharaja Grand Hall + Royal Lawn") {
      base = 250000;
    }
    if (packageSelected === "Royal") base += 50000;
    if (packageSelected === "Platinum") base += 100000;
    setAmount(base);
  }, [venueName, packageSelected]);

  // Date conflict checker
  const isDateBooked = (dateStr: string) => {
    if (!dateStr) return false;
    return bookings.some(
      (b) => b.bookingDate === dateStr && b.status !== "Cancelled"
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError("");

    if (!customerName || !phoneNumber || !email || !bookingDate) {
      setSubmitError("Please fill out all mandatory customer and schedule fields.");
      return;
    }

    if (isDateBooked(bookingDate)) {
      setSubmitError("Warning: The selected date is already booked by another confirmed event.");
      return;
    }

    // Call addBooking in context
    addBooking({
      customerName,
      customerPhoto: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100", // placeholder
      venueName,
      bookingType,
      bookingDate,
      guestCount: Number(guestCount),
      amount: Number(amount),
      status,
      packageSelected,
      phoneNumber,
      email,
    });

    confetti({
      particleCount: 150,
      spread: 80,
      origin: { y: 0.6 },
      colors: ["#4c1d95", "#d4af37", "#f9f6f0"],
    });

    setSuccess(true);
    setTimeout(() => {
      setActiveView("bookings");
    }, 2000);
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in max-w-4xl">
      <div>
        <h2 className="text-3xl font-extrabold text-purple-royal leading-none">
          Offline Manual Booking
        </h2>
        <p className="text-xs text-charcoal-dark/50 mt-1.5 font-medium uppercase tracking-wide">
          Register walk-in client visits and issue invoices directly
        </p>
      </div>

      {success ? (
        <GlassCard className="p-8 text-center border-emerald-500/20 bg-emerald-500/5 space-y-4">
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 flex items-center justify-center mx-auto text-2xl animate-bounce">
            <CheckCircle size={32} />
          </div>
          <div>
            <h3 className="text-lg font-extrabold text-emerald-700 uppercase tracking-wide">
              Booking Created Successfully!
            </h3>
            <p className="text-xs text-emerald-600/80 mt-2">
              The booking for <strong>{customerName}</strong> on <strong>{bookingDate}</strong> has been saved.
            </p>
            <p className="text-[10px] text-charcoal-dark/40 mt-1 font-semibold">
              Redirecting to bookings list...
            </p>
          </div>
        </GlassCard>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {submitError && (
            <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-700 text-xs font-semibold">
              {submitError}
            </div>
          )}

          <GlassCard className="p-6 border-white/60 bg-white/40 space-y-6">
            <h3 className="text-sm font-extrabold text-purple-royal uppercase tracking-wider border-b border-purple-royal/10 pb-2">
              1. Customer Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <GlassInput
                label="Customer Name"
                placeholder="e.g. Sanjay Deshmukh"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                required
              />
              <GlassInput
                label="Phone Number"
                placeholder="e.g. 9890907454"
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
              />
              <GlassInput
                label="Email Address"
                placeholder="e.g. sanjay@gmail.com"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </GlassCard>

          <GlassCard className="p-6 border-white/60 bg-white/40 space-y-6">
            <h3 className="text-sm font-extrabold text-purple-royal uppercase tracking-wider border-b border-purple-royal/10 pb-2">
              2. Event Parameters & Schedule
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <GlassSelect
                label="Venue Option"
                options={[
                  { value: "Maharaja Grand Hall", label: "Wedding Hall (Maharaja Hall)" },
                  { value: "Maharaja Grand Hall + Royal Lawn", label: "Hall + Lawn Combined" },
                ]}
                value={venueName}
                onChange={(e) => setVenueName(e.target.value)}
              />

              <GlassSelect
                label="Event Type"
                options={[
                  { value: "Wedding", label: "Wedding" },
                  { value: "Reception", label: "Reception" },
                  { value: "Engagement", label: "Engagement" },
                  { value: "Haldi", label: "Haldi" },
                  { value: "Birthday", label: "Birthday" },
                  { value: "Corporate", label: "Corporate" },
                  { value: "Maintenance", label: "Maintenance / Other" },
                ]}
                value={bookingType}
                onChange={(e) => setBookingType(e.target.value as BookingType)}
              />

              <GlassInput
                label="Event Date"
                type="date"
                value={bookingDate}
                onChange={(e) => setBookingDate(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <GlassSelect
                label="Session"
                options={[
                  { value: "Day", label: "Day Session" },
                  { value: "Night", label: "Night Session" },
                ]}
                value={eventSession}
                onChange={(e) => setEventSession(e.target.value as "Day" | "Night")}
              />

              <GlassInput
                label="Estimated Guests"
                type="number"
                value={guestCount}
                onChange={(e) => setGuestCount(Number(e.target.value))}
              />

              <GlassSelect
                label="Package Choice"
                options={[
                  { value: "Gold", label: "Gold Package" },
                  { value: "Royal", label: "Royal Package" },
                  { value: "Platinum", label: "Platinum Package" },
                  { value: "Custom", label: "Custom Package" },
                ]}
                value={packageSelected}
                onChange={(e) => setPackageSelected(e.target.value)}
              />
            </div>
          </GlassCard>

          <GlassCard className="p-6 border-white/60 bg-white/40 space-y-6">
            <h3 className="text-sm font-extrabold text-purple-royal uppercase tracking-wider border-b border-purple-royal/10 pb-2">
              3. Pricing & Booking Status
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <GlassInput
                label="Custom Base Amount (₹)"
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
              />

              <GlassSelect
                label="Initial Payment Status"
                options={[
                  { value: "Confirmed", label: "Confirmed (Paid Advance)" },
                  { value: "Pending Payment", label: "Pending Payment / Draft" },
                ]}
                value={status}
                onChange={(e) => setStatus(e.target.value as BookingStatus)}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-purple-royal/80 tracking-wide uppercase px-1">
                Internal Notes & Remarks
              </label>
              <textarea
                placeholder="Walk-in booking, discussed stage setup and guest amenities..."
                rows={4}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full p-4 bg-white/60 border border-purple-royal/10 focus:border-gold-luxury/40 focus:ring-1 focus:ring-gold-luxury/20 rounded-xl text-sm outline-none transition-all placeholder:text-charcoal-dark/30 resize-none font-sans"
              />
            </div>
          </GlassCard>

          <div className="flex justify-end gap-4">
            <GlassButton
              type="button"
              onClick={() => setActiveView("bookings")}
              className="px-6 py-2.5 border-white/20 text-xs font-bold uppercase tracking-wider bg-white/10 text-charcoal-dark hover:bg-white/20"
            >
              Cancel
            </GlassButton>
            <GlassButton
              type="submit"
              variant="gold"
              className="px-8 py-2.5 text-xs font-extrabold uppercase tracking-widest shadow-xl hover:-translate-y-0.5 transition-all"
            >
              Confirm Booking
            </GlassButton>
          </div>
        </form>
      )}
    </div>
  );
};

export default ManualBookingView;
