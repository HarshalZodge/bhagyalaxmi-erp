"use client";

import React, { useState } from "react";
import { useERP } from "@/context/ERPContext";
import ClientSidebar from "@/components/ClientSidebar";
import Topbar from "@/components/Topbar";
import BookingPageView from "@/views/BookingPageView";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlassButton } from "@/components/ui/GlassButton";
import { GlassInput } from "@/components/ui/GlassInput";
import {
  Calendar,
  Users,
  IndianRupee,
  MapPin,
  ClipboardList,
  Sparkles,
  CreditCard,
  CloudUpload,
  Clock,
} from "lucide-react";
import confetti from "canvas-confetti";

export default function ClientDashboard() {
  const {
    activeView,
    setActiveView,
    user,
    bookings,
    invoices,
    updateBookingStatus,
    authLoading,
    bookingRequests,
    convertRequestToBooking,
  } = useERP();

  // Find request associated with this client email
  const clientRequest = bookingRequests.find(
    (r) => r.email.toLowerCase() === (user?.email || "").toLowerCase()
  ) || bookingRequests[0];

  // Find booking associated with this client email
  const clientBooking = bookings.find(
    (b) => b.email.toLowerCase() === (user?.email || "").toLowerCase()
  ) || (bookingRequests.length === 0 ? bookings[0] : undefined);

  // Find invoices associated with this client email
  const clientInvoices = invoices.filter(
    (inv) => inv.clientName.toLowerCase() === (user?.name || "").toLowerCase()
  );

  // Document uploader states
  const [docsList, setDocsList] = useState([
    { name: "Catering_Menu_Final.pdf", size: "1.4 MB", date: "2026-07-12" },
    { name: "Aadhaar_Card_Verify.pdf", size: "450 KB", date: "2026-07-10" },
  ]);
  const [newDocName, setNewDocName] = useState("");

  const handleUploadDoc = (e: React.FormEvent) => {
    e.preventDefault();
    if (newDocName.trim()) {
      setDocsList([
        {
          name: newDocName.endsWith(".pdf") ? newDocName : `${newDocName}.pdf`,
          size: `${(Math.random() * 2 + 0.5).toFixed(1)} MB`,
          date: new Date().toISOString().split("T")[0],
        },
        ...docsList,
      ]);
      setNewDocName("");
    }
  };

  const handlePayInvoice = (invId: string) => {
    const matchingBooking = bookings.find(
      (b) => b.customerName.toLowerCase().includes(user?.name.toLowerCase() || "")
    );
    if (matchingBooking) {
      updateBookingStatus(matchingBooking.id, "Confirmed");
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#d4af37", "#4c1d95"],
      });
    }
  };

  const formatINR = (val: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  // Loading Screen
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f9f6f0]">
        <div className="w-10 h-10 border-4 border-purple-royal/20 border-t-gold-luxury rounded-full animate-spin shadow-sm" />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen z-10 w-full bg-[#f9f6f0]">
      <ClientSidebar />
      <Topbar />

      <main className="ml-80 pt-32 pr-8 pb-12 min-h-screen relative z-10">
        <div className="space-y-6">
          {/* Welcome Header */}
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-3xl font-extrabold text-purple-royal leading-none">
                Hello, {user?.name || "Client"}
              </h2>
              <p className="text-xs text-charcoal-dark/50 mt-1.5 font-medium uppercase tracking-wide">
                Bhagyalaxmi lawns customer dashboard portal
              </p>
            </div>
            <span className="flex items-center gap-1.5 px-3 py-1.5 bg-gold-luxury/10 text-gold-dark border border-gold-luxury/20 rounded-xl text-xs font-bold uppercase tracking-wider">
              <Sparkles size={14} className="animate-pulse" /> Wedding Session
            </span>
          </div>

          {/* Temporary Debug Info */}
          <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl text-xs space-y-1">
            <p className="font-bold text-amber-800">Debug Info:</p>
            <p>Email: <strong className="font-bold">{user?.email}</strong></p>
            <p>Role: <strong className="font-bold">{user?.role}</strong></p>
            <p>Supabase URL: <strong className="font-bold">{process.env.NEXT_PUBLIC_SUPABASE_URL}</strong></p>
          </div>

          {/* VIEW: DASHBOARD */}
          {activeView === "dashboard" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
              {clientBooking ? (
                <GlassCard className="lg:col-span-2 p-6 border-white/60 bg-white/40 space-y-6">
                  <div className="flex gap-4 items-start border-b border-purple-royal/10 pb-4">
                    <div className="w-16 h-16 rounded-2xl overflow-hidden border border-purple-royal/10 shrink-0 bg-white">
                      <img
                        src={clientBooking.customerPhoto}
                        alt={clientBooking.customerName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-lg font-extrabold text-purple-royal leading-tight">
                        {clientBooking.customerName}
                      </h3>
                      <p className="text-xs text-charcoal-dark/45 font-semibold">
                        Package Choice: {clientBooking.packageSelected}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold text-charcoal-dark/70">
                    <div className="flex items-center gap-2">
                      <MapPin size={16} className="text-gold-luxury" />
                      <span>Venue Reserved: <strong className="font-bold text-purple-royal">{clientBooking.venueName}</strong></span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar size={16} className="text-gold-luxury" />
                      <span>Date Reserved: <strong className="font-bold text-purple-royal">{clientBooking.bookingDate}</strong></span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users size={16} className="text-gold-luxury" />
                      <span>Guest count: <strong className="font-bold text-purple-royal">{clientBooking.guestCount} Guests</strong></span>
                    </div>
                    <div className="flex items-center gap-2">
                      <IndianRupee size={16} className="text-gold-luxury" />
                      <span>Grand Total amount: <strong className="font-bold text-purple-royal">{formatINR(clientBooking.amount)}</strong></span>
                    </div>
                  </div>

                  <div className="space-y-1.5 pt-2 border-t border-purple-royal/5">
                    <div className="flex justify-between text-[10px] font-bold text-charcoal-dark/50 uppercase tracking-wider">
                      <span>Venue Wedding Preparation Status</span>
                      <span>{clientBooking.progress}% Completed</span>
                    </div>
                    <div className="w-full bg-purple-royal/5 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-purple-royal to-gold-luxury h-full rounded-full transition-all duration-500"
                        style={{ width: `${clientBooking.progress}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <GlassButton variant="gold" onClick={() => setActiveView("timeline")}>
                      View Detailed Timeline
                    </GlassButton>
                    <GlassButton variant="secondary" onClick={() => setActiveView("payments")}>
                      View Invoices & GST
                    </GlassButton>
                  </div>
                </GlassCard>
              ) : clientRequest ? (
                <GlassCard className="lg:col-span-2 p-6 border-white/60 bg-white/40 space-y-6">
                  {/* Active Booking Request */}
                  <div className="border-b border-purple-royal/10 pb-4">
                    <span className="flex items-center gap-1.5 w-max px-2.5 py-1 bg-purple-royal/10 text-purple-royal border border-purple-royal/20 rounded-lg text-[10px] font-bold uppercase tracking-wider mb-2">
                      Proposal Status: {clientRequest.status}
                    </span>
                    <h3 className="text-xl font-extrabold text-purple-royal tracking-tight">
                      {clientRequest.customerName}
                    </h3>
                    <p className="text-[10px] text-charcoal-dark/40 font-bold uppercase mt-1">
                      Venue Proposal Checklist & Approval Pipeline
                    </p>
                  </div>

                  {/* Status Pipeline Timeline */}
                  <div className="grid grid-cols-5 gap-2 text-center text-[9px] font-bold uppercase tracking-wider pt-2">
                    {[
                      { step: "Submitted", active: true },
                      { step: "Admin Audit", active: ["Reviewing", "Approved", "Needs Changes"].includes(clientRequest.status) },
                      { step: "Approved", active: clientRequest.status === "Approved" },
                      { step: "Token Deposit", active: false },
                      { step: "Confirmed", active: false }
                    ].map((step, idx) => (
                      <div key={idx} className="space-y-2">
                        <div className={`w-8 h-8 rounded-full border flex items-center justify-center mx-auto text-xs ${
                          step.active
                            ? "bg-purple-royal text-ivory-soft border-purple-royal"
                            : "bg-white/40 border-purple-royal/10 text-charcoal-dark/30"
                        }`}>
                          {idx + 1}
                        </div>
                        <span className={step.active ? "text-purple-royal" : "text-charcoal-dark/35"}>
                          {step.step}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-purple-royal/5 text-xs text-charcoal-dark/70 font-semibold">
                    <p>Venue: <strong className="font-bold text-purple-royal">{clientRequest.venue}</strong></p>
                    <p>Date: <strong className="font-bold text-purple-royal">{clientRequest.eventDate} ({clientRequest.eventSession} Session)</strong></p>
                    <p>Expected Attendance: <strong className="font-bold text-purple-royal">{clientRequest.guests} Guests</strong></p>
                    <p>Catering Option: <strong className="font-bold text-purple-royal">{clientRequest.packageSelected} Package</strong></p>
                  </div>

                  {/* Pay advance checkout block */}
                  {clientRequest.status === "Approved" ? (
                    <div className="p-5 bg-gold-luxury/10 border border-gold-luxury/20 rounded-2xl space-y-4">
                      <div>
                        <h4 className="text-sm font-extrabold text-gold-dark uppercase tracking-wider leading-none">
                          Proposal Approved by Administrator!
                        </h4>
                        <p className="text-[10px] text-charcoal-dark/65 mt-1 leading-relaxed">
                          Please verify your invoice details and deposit the 20% token advance to confirm your booking.
                        </p>
                      </div>
                      <div className="flex justify-between items-center bg-white/40 p-3.5 rounded-xl border border-gold-luxury/10">
                        <div>
                          <p className="text-[9px] uppercase font-bold text-charcoal-dark/50">20% Token Deposit Amount:</p>
                          <p className="text-lg font-black text-gold-dark">{formatINR(clientRequest.pricingBreakdown.advance)}</p>
                        </div>
                        <GlassButton
                          variant="gold"
                          className="py-2.5 px-6 font-bold text-xs uppercase"
                          onClick={() => {
                            convertRequestToBooking(clientRequest.id);
                            confetti({
                              particleCount: 150,
                              spread: 80,
                              colors: ["#d4af37", "#4c1d95"],
                            });
                          }}
                        >
                          Confirm & Pay Deposit
                        </GlassButton>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 bg-purple-royal/5 border border-purple-royal/10 rounded-2xl text-[10px] leading-relaxed text-charcoal-dark/65">
                      <p className="font-bold text-purple-royal uppercase">📋 Current Status: {clientRequest.status}</p>
                      <p className="mt-1">Your proposal is currently being reviewed by the Owners (Deepak Zodge, Kiran Zodge, Harshal Zodge). Our team will audit the requested vendor slots. We will notify you once approval is confirmed.</p>
                    </div>
                  )}
                </GlassCard>
              ) : (
                <GlassCard className="lg:col-span-2 text-center py-16">
                  <p className="text-sm text-charcoal-dark/50">No active bookings or requests found.</p>
                  <GlassButton variant="gold" onClick={() => setActiveView("booking-request")} className="mx-auto mt-4">
                    Create New Proposal
                  </GlassButton>
                </GlassCard>
              )}

              <GlassCard className="p-6 border-white/60 bg-white/40 space-y-4">
                <div className="border-b border-purple-royal/10 pb-3 flex items-center gap-2 text-purple-royal">
                  <ClipboardList size={16} className="text-gold-luxury" />
                  <h3 className="text-xs font-bold uppercase tracking-wider">
                    Ahilyanagar Ops Desk
                  </h3>
                </div>

                <div className="space-y-3 text-xs">
                  <p className="text-charcoal-dark/65 leading-relaxed">
                    Have questions about catering adjustments, decorations, or stage setups? Connect directly with our on-site team.
                  </p>
                  <div className="p-3 bg-purple-royal/5 rounded-xl border border-purple-royal/10 text-charcoal-dark/70 font-semibold space-y-1">
                    <p className="text-[10px] font-bold text-purple-royal uppercase">Site Supervisor</p>
                    <p>Sanjay Shinde</p>
                    <p className="text-xs font-bold text-gold-dark">+91 94220 54321</p>
                  </div>
                </div>
              </GlassCard>
            </div>
          )}

          {/* VIEW: REQUEST BOOKING */}
          {activeView === "booking-request" && <BookingPageView />}

          {/* VIEW: PAYMENTS */}
          {activeView === "payments" && (
            <div className="space-y-6">
              <h3 className="text-xs font-bold uppercase tracking-wider text-purple-royal px-1">
                Your GST Invoices & Billing
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {clientInvoices.length === 0 ? (
                  <GlassCard className="md:col-span-2 text-center py-12 text-xs text-charcoal-dark/40">
                    No active invoices. Complete booking request first.
                  </GlassCard>
                ) : (
                  clientInvoices.map((inv) => (
                    <GlassCard key={inv.id} className="p-6 border-white/60 bg-white/40 space-y-4">
                      <div className="flex justify-between items-center border-b border-purple-royal/10 pb-2">
                        <span className="font-extrabold text-sm text-purple-royal">{inv.invoiceNo}</span>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                            inv.status === "Paid"
                              ? "bg-emerald-500/10 text-emerald-700 border-emerald-500/20"
                              : "bg-amber-500/10 text-amber-700 border-amber-500/20"
                          }`}
                        >
                          {inv.status}
                        </span>
                      </div>

                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between">
                          <span className="text-charcoal-dark/50">Taxable Value:</span>
                          <span className="font-semibold">₹{inv.taxableAmount.toLocaleString("en-IN")}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-charcoal-dark/50">CGST (9%):</span>
                          <span>₹{inv.cgst.toLocaleString("en-IN")}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-charcoal-dark/50">SGST (9%):</span>
                          <span>₹{inv.sgst.toLocaleString("en-IN")}</span>
                        </div>
                        <div className="flex justify-between font-bold border-t border-purple-royal/5 pt-2 text-sm text-gold-dark">
                          <span>Grand Total (incl. GST):</span>
                          <span>₹{inv.totalAmount.toLocaleString("en-IN")}</span>
                        </div>
                      </div>

                      {inv.status !== "Paid" && (
                        <GlassButton
                          variant="gold"
                          className="w-full flex items-center justify-center gap-1.5 py-2 text-xs mt-2"
                          onClick={() => handlePayInvoice(inv.id)}
                        >
                          <CreditCard size={14} /> Pay Advance (₹{(inv.totalAmount * 0.2).toLocaleString("en-IN")})
                        </GlassButton>
                      )}
                    </GlassCard>
                  ))
                )}
              </div>
            </div>
          )}

          {/* VIEW: DOCUMENTS */}
          {activeView === "documents" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
              <GlassCard className="p-6 border-white/60 bg-white/40 space-y-4">
                <div className="border-b border-purple-royal/10 pb-3 flex items-center gap-2 text-purple-royal">
                  <CloudUpload className="text-gold-luxury w-4.5 h-4.5" />
                  <h3 className="text-xs font-bold uppercase tracking-wider">
                    Upload Documents
                  </h3>
                </div>

                <form onSubmit={handleUploadDoc} className="space-y-4 text-xs">
                  <GlassInput
                    label="Document Name"
                    placeholder="e.g. Groom_Pan_Card"
                    value={newDocName}
                    onChange={(e) => setNewDocName(e.target.value)}
                    required
                  />
                  <div className="border-2 border-dashed border-purple-royal/15 rounded-xl p-6 text-center bg-white/20 hover:border-gold-luxury/40 transition-all cursor-pointer">
                    <span className="text-[10px] font-bold text-charcoal-dark/50 uppercase">
                      Select Files to Upload
                    </span>
                  </div>
                  <GlassButton variant="gold" type="submit" className="w-full py-2.5">
                    Save Document
                  </GlassButton>
                </form>
              </GlassCard>

              <GlassCard className="lg:col-span-2 p-6 border-white/60 bg-white/40 space-y-4">
                <div>
                  <h4 className="text-sm font-bold uppercase tracking-wider text-purple-royal">
                    Groom & Bride Document Vault
                  </h4>
                  <p className="text-[10px] text-charcoal-dark/50">
                    Uploaded copies of ID verification files, layouts, and menus
                  </p>
                </div>

                <div className="space-y-3">
                  {docsList.map((doc, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl border border-purple-royal/5 bg-white/30 flex justify-between items-center text-xs"
                    >
                      <div className="space-y-0.5">
                        <p className="font-bold text-purple-royal">{doc.name}</p>
                        <span className="text-[9px] text-charcoal-dark/40 font-medium">
                          Uploaded on: {doc.date}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] text-charcoal-dark/45 font-semibold">
                          {doc.size}
                        </span>
                        <span className="text-emerald-600 font-bold text-[10px] uppercase bg-emerald-500/10 border border-emerald-500/15 px-2 py-0.5 rounded">
                          Verified
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </div>
          )}

          {/* VIEW: TIMELINE */}
          {activeView === "timeline" && (
            <GlassCard className="p-6 border-white/60 bg-white/40 space-y-6">
              <div>
                <h4 className="text-sm font-bold uppercase tracking-wider text-purple-royal">
                  Wedding Event Preparation Milestones
                </h4>
                <p className="text-[10px] text-charcoal-dark/50">
                  Track site activities in real-time leading to your grand ceremony date
                </p>
              </div>

              <div className="space-y-4 relative before:absolute before:left-3.5 before:top-2 before:bottom-2 before:w-[1px] before:bg-purple-royal/15 max-w-2xl">
                <div className="flex items-start gap-4 relative z-10">
                  <div className="w-7 h-7 rounded-full bg-emerald-500/10 border border-emerald-500 text-emerald-600 flex items-center justify-center text-xs font-bold bg-[#f9f6f0]">
                    ✓
                  </div>
                  <div>
                    <p className="text-xs font-bold text-purple-royal">Advance Deposit Secured</p>
                    <p className="text-[10px] text-charcoal-dark/50 mt-0.5">Completed on: 2026-07-10</p>
                    <p className="text-xs text-charcoal-dark/65 mt-1 leading-normal">
                      Token advance payment (20%) received via bank transfer. Booking slot locked.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 relative z-10">
                  <div className="w-7 h-7 rounded-full bg-emerald-500/10 border border-emerald-500 text-emerald-600 flex items-center justify-center text-xs font-bold bg-[#f9f6f0]">
                    ✓
                  </div>
                  <div>
                    <p className="text-xs font-bold text-purple-royal">Catering Menu Audit & Choice</p>
                    <p className="text-[10px] text-charcoal-dark/50 mt-0.5">Completed on: 2026-07-12</p>
                    <p className="text-xs text-charcoal-dark/65 mt-1 leading-normal">
                      Royal Emerald catering menu verified. Sweet items finalized (Amrakhand + Puran Poli).
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 relative z-10">
                  <div className="w-7 h-7 rounded-full bg-purple-royal/10 border border-purple-royal text-purple-royal flex items-center justify-center text-xs font-bold bg-[#f9f6f0] animate-pulse">
                    •
                  </div>
                  <div>
                    <p className="text-xs font-bold text-purple-royal">Stage Floral Entrance Layout Design</p>
                    <p className="text-[10px] text-charcoal-dark/50 mt-0.5">In Progress (Active)</p>
                    <p className="text-xs text-charcoal-dark/65 mt-1 leading-normal">
                      Ahilya Florists finalizing marigold arches and floral setups for the main mandap.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 relative z-10 opacity-50">
                  <div className="w-7 h-7 rounded-full bg-charcoal-dark/10 border border-charcoal-dark/20 text-charcoal-dark/60 flex items-center justify-center text-[10px] font-bold bg-[#f9f6f0]">
                    PM
                  </div>
                  <div>
                    <p className="text-xs font-bold text-charcoal-dark">Site Preparation Cleanup & Final Set</p>
                    <p className="text-[10px] text-charcoal-dark/50 mt-0.5">Scheduled (24 Hours prior)</p>
                    <p className="text-xs text-charcoal-dark/65 mt-1 leading-normal">
                      Deep cleanup washing of Maharaja Hall washrooms and parking slots.
                    </p>
                  </div>
                </div>
              </div>
            </GlassCard>
          )}
        </div>
      </main>

      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[8%] left-[18%] w-[480px] h-[480px] rounded-full bg-purple-royal/6 opacity-20 blur-[130px]" />
        <div className="absolute bottom-[10%] right-[8%] w-[550px] h-[550px] rounded-full bg-gold-luxury/6 opacity-15 blur-[140px]" />
      </div>
    </div>
  );
}
