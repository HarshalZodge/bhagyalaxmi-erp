"use client";

import React, { useState } from "react";
import {
  Inbox,
  Users,
  Calendar,
  IndianRupee,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Edit2,
  Trash2,
  Phone,
  Mail,
  AlertTriangle,
  UserCheck,
  ChevronRight,
  TrendingUp,
  FileText,
} from "lucide-react";
import { useERP, BookingRequest, BookingRequestStatus, Vendor } from "@/context/ERPContext";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlassButton } from "@/components/ui/GlassButton";
import { GlassInput } from "@/components/ui/GlassInput";
import { GlassModal } from "@/components/ui/GlassModal";
import InvoicePrintView from "@/components/InvoicePrintView";
import confetti from "canvas-confetti";

export const BookingRequestsView: React.FC = () => {
  const {
    bookingRequests,
    updateBookingRequestStatus,
    updateBookingRequest,
    convertRequestToBooking,
    vendors,
  } = useERP();

  const [activeRequest, setActiveRequest] = useState<BookingRequest | null>(null);
  const [editingRequest, setEditingRequest] = useState<BookingRequest | null>(null);
  const [viewingInvoice, setViewingInvoice] = useState<BookingRequest | null>(null);

  // States for quote editing form
  const [editGuests, setEditGuests] = useState(0);
  const [editVenueCost, setEditVenueCost] = useState(0);
  const [editPackageCost, setEditPackageCost] = useState(0);
  const [editVendorsCost, setEditVendorsCost] = useState(0);
  const [editServicesCost, setEditServicesCost] = useState(0);
  const [editDiscount, setEditDiscount] = useState(0);

  const statuses: BookingRequestStatus[] = ["Pending", "Reviewing", "Needs Changes", "Approved", "Rejected"];

  const getRequestsByStatus = (status: BookingRequestStatus) => {
    return bookingRequests.filter((r) => r.status === status);
  };

  const getStatusColor = (status: BookingRequestStatus) => {
    const colors = {
      Pending: "border-blue-500/20 bg-blue-500/5 text-blue-700",
      Reviewing: "border-amber-500/20 bg-amber-500/5 text-amber-700",
      "Needs Changes": "border-orange-500/20 bg-orange-500/5 text-orange-700",
      Approved: "border-emerald-500/20 bg-emerald-500/5 text-emerald-700",
      Rejected: "border-rose-500/20 bg-rose-500/5 text-rose-700",
    };
    return colors[status];
  };

  const handleOpenEdit = (req: BookingRequest) => {
    setEditingRequest(req);
    setEditGuests(req.guests);
    setEditVenueCost(req.pricingBreakdown.venue);
    setEditPackageCost(req.pricingBreakdown.package / req.guests); // plate price
    setEditVendorsCost(req.pricingBreakdown.vendors);
    setEditServicesCost(req.pricingBreakdown.services);
    setEditDiscount(req.pricingBreakdown.discount);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRequest) return;

    const packageTotal = editPackageCost * editGuests;
    const subTotal = editVenueCost + packageTotal + editVendorsCost + editServicesCost;
    const taxableAmount = Math.max(0, subTotal - editDiscount);
    const gstAmount = Math.round(taxableAmount * 0.18);
    const grandTotal = taxableAmount + gstAmount;
    const advanceRequired = Math.round(grandTotal * 0.2);

    updateBookingRequest(editingRequest.id, {
      guests: editGuests,
      pricingBreakdown: {
        venue: editVenueCost,
        package: packageTotal,
        vendors: editVendorsCost,
        services: editServicesCost,
        generatorHours: editingRequest.pricingBreakdown.generatorHours,
        electricityUnits: editingRequest.pricingBreakdown.electricityUnits,
        discount: editDiscount,
        gst: gstAmount,
        grandTotal,
        advance: advanceRequired,
      },
    });

    setEditingRequest(null);
  };

  const handleApproveOwnVendor = (reqId: string, category: string) => {
    const req = bookingRequests.find((r) => r.id === reqId);
    if (!req) return;

    const updatedVendors = { ...req.vendors };
    if (updatedVendors[category]) {
      updatedVendors[category] = {
        ...updatedVendors[category],
        status: "Approved",
      };
    }

    updateBookingRequest(reqId, { vendors: updatedVendors });
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in select-none">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-extrabold text-purple-royal leading-none">
            Client Booking Requests
          </h2>
          <p className="text-xs text-charcoal-dark/50 mt-1.5 font-medium uppercase tracking-wide">
            Manage, customize, and audit booking proposals via Kanban Board
          </p>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 items-start overflow-x-auto pb-4">
        {statuses.map((status) => {
          const requests = getRequestsByStatus(status);
          return (
            <div
              key={status}
              className="glass-panel p-4 bg-white/30 border-purple-royal/10 rounded-2xl flex flex-col min-h-[500px] w-64 shrink-0"
            >
              <div className="flex justify-between items-center border-b border-purple-royal/5 pb-2 mb-3">
                <h3 className="font-extrabold text-[11px] uppercase tracking-wider text-purple-royal">
                  {status}
                </h3>
                <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${getStatusColor(status)}`}>
                  {requests.length}
                </span>
              </div>

              <div className="space-y-3 flex-1 overflow-y-auto max-h-[480px] pr-1">
                {requests.length === 0 ? (
                  <div className="text-center py-8 text-[10px] text-charcoal-dark/30 font-bold uppercase">
                    Empty Stage
                  </div>
                ) : (
                  requests.map((req) => (
                    <div
                      key={req.id}
                      className="p-3.5 rounded-xl border border-purple-royal/5 bg-white/60 hover:border-gold-luxury hover:shadow-md transition cursor-pointer space-y-3"
                      onClick={() => setActiveRequest(req)}
                    >
                      <div>
                        <h4 className="font-extrabold text-xs text-purple-royal truncate">{req.customerName}</h4>
                        <span className="text-[9px] font-bold text-gold-dark uppercase tracking-widest block mt-0.5">
                          {req.eventType}
                        </span>
                      </div>

                      <div className="space-y-1 text-[10px] text-charcoal-dark/60 font-semibold">
                        <div className="flex items-center gap-1.5">
                          <Calendar size={12} className="text-gold-luxury shrink-0" />
                          <span>{req.eventDate} ({req.eventSession})</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Users size={12} className="text-gold-luxury shrink-0" />
                          <span>{req.guests} Guests</span>
                        </div>
                        <div className="flex items-center justify-between border-t border-purple-royal/5 pt-2 mt-2">
                          <span className="text-[9px] uppercase text-charcoal-dark/40 font-bold">Total:</span>
                          <span className="font-extrabold text-purple-royal">
                            ₹{req.pricingBreakdown.grandTotal.toLocaleString("en-IN")}
                          </span>
                        </div>
                      </div>

                      {/* Quick stage controls */}
                      <div className="flex gap-1.5 pt-1.5 border-t border-purple-royal/5">
                        {status !== "Approved" && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              updateBookingRequestStatus(req.id, "Approved");
                            }}
                            title="Approve Proposal"
                            className="flex-1 py-1 rounded bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 text-[9px] font-bold uppercase border border-emerald-500/20 transition"
                          >
                            Approve
                          </button>
                        )}
                        {status === "Approved" && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              convertRequestToBooking(req.id);
                              confetti({ particleCount: 100 });
                            }}
                            className="flex-1 py-1 rounded bg-gold-luxury hover:bg-gold-luxury/80 text-charcoal-dark text-[9px] font-bold uppercase transition"
                          >
                            Convert
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* --- DETAIL PROPOSAL MODAL --- */}
      {activeRequest && (
        <GlassModal
          isOpen={!!activeRequest}
          onClose={() => setActiveRequest(null)}
          title="Booking Request Details"
        >
          <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-1 text-xs leading-relaxed">
            {/* Top overview */}
            <div className="flex justify-between items-start border-b border-purple-royal/10 pb-4">
              <div>
                <h3 className="font-extrabold text-purple-royal text-sm">{activeRequest.customerName}</h3>
                <div className="flex gap-2 items-center mt-1">
                  <span className="px-2 py-0.5 rounded text-[9px] font-extrabold bg-purple-royal/10 text-purple-royal border border-purple-royal/20">
                    {activeRequest.eventType}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold ${getStatusColor(activeRequest.status)}`}>
                    Status: {activeRequest.status}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-charcoal-dark/40 font-bold uppercase">Estimated Quote:</p>
                <p className="font-black text-gold-dark text-base">
                  ₹{activeRequest.pricingBreakdown.grandTotal.toLocaleString("en-IN")}
                </p>
              </div>
            </div>

            {/* Event Setup details */}
            <div className="grid grid-cols-2 gap-4 bg-white/40 p-4 rounded-xl border border-purple-royal/5">
              <div className="space-y-1">
                <h4 className="font-bold text-purple-royal uppercase text-[10px] tracking-wide">Event Setup</h4>
                <p>Venue: <strong className="font-bold text-purple-royal">{activeRequest.venue}</strong></p>
                <p>Date: <strong className="font-bold text-purple-royal">{activeRequest.eventDate}</strong></p>
                <p>Session: <strong className="font-bold text-purple-royal">{activeRequest.eventSession} Session</strong></p>
                <p>Estimated Guests: <strong className="font-bold text-purple-royal">{activeRequest.guests} Guests</strong></p>
                <p>Catering Option: <strong className="font-bold text-purple-royal">{activeRequest.packageSelected} Package (Veg)</strong></p>
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-purple-royal uppercase text-[10px] tracking-wide">Contact details</h4>
                <p className="flex items-center gap-1"><Phone size={12} className="text-gold-luxury" /> {activeRequest.phoneNumber}</p>
                <p className="flex items-center gap-1"><Mail size={12} className="text-gold-luxury truncate max-w-[150px]" /> {activeRequest.email}</p>
                <p>Created Date: {new Date(activeRequest.createdAt).toLocaleDateString("en-IN")}</p>
              </div>
            </div>

            {/* Selected Vendors & Approval Check */}
            <div className="space-y-3">
              <h4 className="font-extrabold text-purple-royal text-[10px] uppercase tracking-wider">
                Custom Selected Vendors
              </h4>
              <div className="grid grid-cols-1 gap-2.5">
                {Object.entries(activeRequest.vendors).map(([cat, val]) => (
                  <div
                    key={cat}
                    className="p-3.5 rounded-xl border border-purple-royal/5 bg-white/50 flex justify-between items-center"
                  >
                    <div>
                      <p className="text-[9px] uppercase font-bold text-charcoal-dark/40">{cat}</p>
                      <p className="font-bold text-purple-royal mt-0.5">{val.name}</p>
                      {val.type === "own" && (
                        <p className="text-[9px] text-amber-700/80 font-bold mt-0.5">
                          ⚠️ Custom Client Vendor (Phone: {val.phone})
                        </p>
                      )}
                    </div>

                    <div>
                      {val.type === "own" && val.status === "Pending Approval" ? (
                        <GlassButton
                          type="button"
                          variant="gold"
                          className="py-1 px-3 text-[9px] uppercase font-bold"
                          onClick={() => handleApproveOwnVendor(activeRequest.id, cat)}
                        >
                          Approve Vendor
                        </GlassButton>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded text-[9px] font-extrabold bg-emerald-500/10 text-emerald-700 border border-emerald-500/15 uppercase">
                          {val.status || "Approved"}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Custom pricing details */}
            <div className="space-y-3">
              <h4 className="font-extrabold text-purple-royal text-[10px] uppercase tracking-wider">
                Pricing Quote Breakdown
              </h4>
              <div className="space-y-2.5 bg-white/40 p-4 rounded-xl border border-purple-royal/5">
                <div className="flex justify-between">
                  <span>Venue Base Hire:</span>
                  <span className="font-bold">₹{activeRequest.pricingBreakdown.venue.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between">
                  <span>Catering Packages:</span>
                  <span className="font-bold">₹{activeRequest.pricingBreakdown.package.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between">
                  <span>Vendors Marketplace:</span>
                  <span className="font-bold">₹{activeRequest.pricingBreakdown.vendors.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between">
                  <span>Services & Generator Backup:</span>
                  <span className="font-bold">₹{activeRequest.pricingBreakdown.services.toLocaleString("en-IN")}</span>
                </div>
                {activeRequest.pricingBreakdown.discount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-bold">
                    <span>Discount:</span>
                    <span>- ₹{activeRequest.pricingBreakdown.discount.toLocaleString("en-IN")}</span>
                  </div>
                )}
                <div className="flex justify-between border-t border-dashed border-purple-royal/10 pt-2 font-bold text-purple-royal">
                  <span>Taxable Amount:</span>
                  <span>
                    ₹{(
                      activeRequest.pricingBreakdown.venue +
                      activeRequest.pricingBreakdown.package +
                      activeRequest.pricingBreakdown.vendors +
                      activeRequest.pricingBreakdown.services -
                      activeRequest.pricingBreakdown.discount
                    ).toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="flex justify-between text-charcoal-dark/50">
                  <span>GST Taxes (18%):</span>
                  <span>₹{activeRequest.pricingBreakdown.gst.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between border-t border-purple-royal/15 pt-2 text-sm font-extrabold text-gold-dark bg-gold-luxury/10 p-2.5 rounded-lg">
                  <span>Grand Total:</span>
                  <span>₹{activeRequest.pricingBreakdown.grandTotal.toLocaleString("en-IN")}</span>
                </div>
              </div>
            </div>

            {/* Footer action bar */}
            <div className="flex justify-between items-center border-t border-purple-royal/10 pt-4 mt-6">
              <div className="flex gap-2">
                <GlassButton
                  type="button"
                  variant="secondary"
                  className="py-2.5 text-[10px]"
                  onClick={() => {
                    handleOpenEdit(activeRequest);
                    setActiveRequest(null);
                  }}
                >
                  <Edit2 size={12} /> Edit Quote
                </GlassButton>
                <GlassButton
                  type="button"
                  variant="secondary"
                  className="py-2.5 text-[10px]"
                  onClick={() => {
                    setViewingInvoice(activeRequest);
                  }}
                >
                  <FileText size={12} /> View GST Invoice
                </GlassButton>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    updateBookingRequestStatus(activeRequest.id, "Rejected");
                    setActiveRequest(null);
                  }}
                  className="py-2 px-4 rounded-xl border border-rose-200 bg-rose-50/10 hover:bg-rose-50/20 text-rose-600 font-bold uppercase tracking-wider text-[10px] transition"
                >
                  Reject
                </button>
                <button
                  type="button"
                  onClick={() => {
                    updateBookingRequestStatus(activeRequest.id, "Reviewing");
                    setActiveRequest(null);
                  }}
                  className="py-2 px-4 rounded-xl border border-amber-200 bg-amber-50/10 hover:bg-amber-50/20 text-amber-700 font-bold uppercase tracking-wider text-[10px] transition"
                >
                  Move Reviewing
                </button>
                <GlassButton
                  variant="gold"
                  className="py-2 px-5 font-bold uppercase text-[10px]"
                  onClick={() => {
                    convertRequestToBooking(activeRequest.id);
                    setActiveRequest(null);
                    confetti({ particleCount: 150 });
                  }}
                >
                  Convert to Booking
                </GlassButton>
              </div>
            </div>
          </div>
        </GlassModal>
      )}

      {/* --- EDIT QUOTE MODAL --- */}
      {editingRequest && (
        <GlassModal
          isOpen={!!editingRequest}
          onClose={() => setEditingRequest(null)}
          title="Customize Proposal Quote"
        >
          <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <GlassInput
                label="Estimated Guests"
                type="number"
                value={editGuests}
                onChange={(e) => setEditGuests(Number(e.target.value))}
                required
              />
              <GlassInput
                label="Catering Price per Plate (₹)"
                type="number"
                value={editPackageCost}
                onChange={(e) => setEditPackageCost(Number(e.target.value))}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <GlassInput
                label="Venue Rental Cost (₹)"
                type="number"
                value={editVenueCost}
                onChange={(e) => setEditVenueCost(Number(e.target.value))}
                required
              />
              <GlassInput
                label="Total Vendors Cost (₹)"
                type="number"
                value={editVendorsCost}
                onChange={(e) => setEditVendorsCost(Number(e.target.value))}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <GlassInput
                label="Additional Services Total (₹)"
                type="number"
                value={editServicesCost}
                onChange={(e) => setEditServicesCost(Number(e.target.value))}
                required
              />
              <GlassInput
                label="Special Discount (₹)"
                type="number"
                value={editDiscount}
                onChange={(e) => setEditDiscount(Number(e.target.value))}
                required
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-purple-royal/5 mt-4">
              <GlassButton type="button" variant="secondary" onClick={() => setEditingRequest(null)}>
                Cancel
              </GlassButton>
              <GlassButton type="submit" variant="gold">
                Save Adjustments
              </GlassButton>
            </div>
          </form>
        </GlassModal>
      )}

      {/* --- LUXURY INVOICE OVERLAY --- */}
      {viewingInvoice && (
        <GlassModal
          isOpen={!!viewingInvoice}
          onClose={() => setViewingInvoice(null)}
          title="Draft luxury GST Invoice"
        >
          <div className="max-h-[75vh] overflow-y-auto pr-1">
            <InvoicePrintView request={viewingInvoice} />
          </div>
        </GlassModal>
      )}
    </div>
  );
};

export default BookingRequestsView;
