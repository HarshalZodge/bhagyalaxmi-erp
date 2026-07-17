"use client";

import React, { useState } from "react";
import {
  User,
  Phone,
  Mail,
  MapPin,
  Clock,
  Notebook,
  MessageSquare,
  FileText,
  Send,
  Plus,
  IndianRupee,
} from "lucide-react";
import { useERP, Customer } from "@/context/ERPContext";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlassButton } from "@/components/ui/GlassButton";
import { GlassInput } from "@/components/ui/GlassInput";

export const CustomersView: React.FC = () => {
  const { customers, invoices, sendWhatsAppMessage, addCustomerNote } = useERP();
  const [activeCustId, setActiveCustId] = useState<string>(customers[0]?.id || "");
  const [activeTab, setActiveTab] = useState<"timeline" | "whatsapp" | "invoices" | "notes">("timeline");
  
  // Note/Chat input forms
  const [newNoteText, setNewNoteText] = useState("");
  const [newMsgText, setNewMsgText] = useState("");

  const activeCustomer = customers.find((c) => c.id === activeCustId);

  // Filter invoices for active customer
  const clientInvoices = invoices.filter(
    (inv) => inv.clientName.toLowerCase() === activeCustomer?.name.toLowerCase()
  );

  const handleSendChat = () => {
    if (activeCustomer && newMsgText.trim()) {
      sendWhatsAppMessage(activeCustomer.id, newMsgText);
      setNewMsgText("");
    }
  };

  const handleAddNote = () => {
    if (activeCustomer && newNoteText.trim()) {
      addCustomerNote(activeCustomer.id, newNoteText);
      setNewNoteText("");
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in select-none">
      {/* Title */}
      <div>
        <h2 className="text-3xl font-extrabold text-purple-royal leading-none">
          CRM Client Database
        </h2>
        <p className="text-xs text-charcoal-dark/50 mt-1.5 font-medium uppercase tracking-wide">
          Manage relationship, logs, invoices, and direct WhatsApp threads
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Side: Customers list */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-purple-royal px-1">
            Accounts ({customers.length})
          </h3>
          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
            {customers.map((c) => {
              const isActive = c.id === activeCustId;
              return (
                <div
                  key={c.id}
                  onClick={() => setActiveCustId(c.id)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all duration-300 flex items-center gap-3 bg-white/40 ${
                    isActive
                      ? "border-gold-luxury bg-white/70 shadow-sm"
                      : "border-purple-royal/5 hover:border-gold-luxury/20"
                  }`}
                >
                  <div className="w-10 h-10 rounded-full overflow-hidden border border-purple-royal/10 shrink-0 bg-white">
                    <img src={c.photo} alt={c.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="overflow-hidden flex-1">
                    <h4 className="font-extrabold text-sm text-purple-royal leading-none truncate">
                      {c.name}
                    </h4>
                    <span className="text-[10px] text-charcoal-dark/45 mt-1 block">
                      Spent: ₹{c.totalSpent.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: Customer Detailed view */}
        <div className="lg:col-span-2">
          {activeCustomer ? (
            <GlassCard className="p-6 border-white/60 bg-white/40 space-y-6">
              {/* Detailed Header Card */}
              <div className="flex flex-col sm:flex-row gap-4 items-start border-b border-purple-royal/10 pb-6">
                <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-gold-luxury bg-white shadow-sm shrink-0">
                  <img
                    src={activeCustomer.photo}
                    alt={activeCustomer.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="space-y-2 overflow-hidden flex-1">
                  <h3 className="text-xl font-extrabold text-purple-royal leading-none text-purple-gradient">
                    {activeCustomer.name}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-charcoal-dark/60 font-semibold mt-2">
                    <div className="flex items-center gap-1.5">
                      <Phone size={13} className="text-gold-luxury" />
                      <span>{activeCustomer.phone}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Mail size={13} className="text-gold-luxury" />
                      <span className="truncate">{activeCustomer.email}</span>
                    </div>
                    <div className="flex items-center gap-1.5 sm:col-span-2">
                      <MapPin size={13} className="text-gold-luxury" />
                      <span>{activeCustomer.address}</span>
                    </div>
                  </div>
                </div>

                {/* Spent stats right column */}
                <div className="text-right sm:border-l border-purple-royal/10 sm:pl-6 self-stretch flex flex-col justify-center gap-1 min-w-[120px]">
                  <p className="text-[9px] font-bold text-charcoal-dark/40 uppercase tracking-widest leading-none">
                    Total Billings
                  </p>
                  <span className="text-md font-extrabold text-purple-royal leading-none">
                    ₹{activeCustomer.totalSpent.toLocaleString("en-IN")}
                  </span>
                  <span className="text-[9px] font-bold text-gold-dark mt-1">
                    {activeCustomer.bookingCount} Weddings Booked
                  </span>
                </div>
              </div>

              {/* Sub Navigation Tabs */}
              <div className="flex border-b border-purple-royal/5 pb-2 gap-4 text-xs font-bold uppercase tracking-wider text-charcoal-dark/50">
                <button
                  onClick={() => setActiveTab("timeline")}
                  className={`pb-1 border-b-2 cursor-pointer transition-all ${
                    activeTab === "timeline"
                      ? "text-purple-royal border-gold-luxury"
                      : "border-transparent hover:text-purple-royal"
                  }`}
                >
                  Activity
                </button>
                <button
                  onClick={() => setActiveTab("whatsapp")}
                  className={`pb-1 border-b-2 cursor-pointer transition-all ${
                    activeTab === "whatsapp"
                      ? "text-purple-royal border-gold-luxury"
                      : "border-transparent hover:text-purple-royal"
                  }`}
                >
                  WhatsApp
                </button>
                <button
                  onClick={() => setActiveTab("invoices")}
                  className={`pb-1 border-b-2 cursor-pointer transition-all ${
                    activeTab === "invoices"
                      ? "text-purple-royal border-gold-luxury"
                      : "border-transparent hover:text-purple-royal"
                  }`}
                >
                  Invoices ({clientInvoices.length})
                </button>
                <button
                  onClick={() => setActiveTab("notes")}
                  className={`pb-1 border-b-2 cursor-pointer transition-all ${
                    activeTab === "notes"
                      ? "text-purple-royal border-gold-luxury"
                      : "border-transparent hover:text-purple-royal"
                  }`}
                >
                  Notes
                </button>
              </div>

              {/* TAB CONTENT: TIMELINE */}
              {activeTab === "timeline" && (
                <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
                  <div className="relative before:absolute before:left-3.5 before:top-2 before:bottom-2 before:w-[1px] before:bg-purple-royal/10">
                    {activeCustomer.notes.map((n, idx) => (
                      <div key={idx} className="flex items-start gap-4 mb-4 relative z-10">
                        <div className="w-7 h-7 rounded-full bg-purple-royal/5 border border-purple-royal/10 flex items-center justify-center text-purple-royal shrink-0 bg-[#f9f6f0]">
                          <Notebook size={12} />
                        </div>
                        <div className="flex-1">
                          <p className="text-[10px] font-bold text-purple-royal">
                            Log Added on {n.date}
                          </p>
                          <p className="text-xs text-charcoal-dark/70 mt-1 leading-relaxed">
                            {n.text}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB CONTENT: WHATSAPP SIMULATOR */}
              {activeTab === "whatsapp" && (
                <div className="space-y-4">
                  {/* Message Stream */}
                  <div className="h-60 rounded-xl bg-purple-royal/[0.02] border border-purple-royal/5 p-4 overflow-y-auto space-y-3">
                    {activeCustomer.whatsappHistory.map((msg) => {
                      const isOwner = msg.sender === "owner";
                      return (
                        <div
                          key={msg.id}
                          className={`flex ${isOwner ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`p-3 rounded-2xl max-w-[80%] text-xs leading-relaxed ${
                              isOwner
                                ? "bg-gradient-to-tr from-purple-royal to-purple-dark text-white rounded-tr-none"
                                : "bg-white border border-purple-royal/10 text-charcoal-dark rounded-tl-none shadow-sm"
                            }`}
                          >
                            <p>{msg.text}</p>
                            <span
                              className={`text-[8px] mt-1 block text-right font-medium ${
                                isOwner ? "text-purple-light/20 text-white/50" : "text-charcoal-dark/40"
                              }`}
                            >
                              {new Date(msg.timestamp).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Input Form */}
                  <div className="flex items-center gap-2">
                    <GlassInput
                      placeholder="Type a message and click send..."
                      value={newMsgText}
                      onChange={(e) => setNewMsgText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleSendChat();
                      }}
                    />
                    <GlassButton variant="gold" onClick={handleSendChat} className="px-4 py-3 shrink-0">
                      <Send size={14} /> Send
                    </GlassButton>
                  </div>
                </div>
              )}

              {/* TAB CONTENT: INVOICES LIST */}
              {activeTab === "invoices" && (
                <div className="space-y-3 max-h-[300px] overflow-y-auto">
                  {clientInvoices.length === 0 ? (
                    <p className="text-xs text-charcoal-dark/40 text-center py-8">
                      No invoices found for this client.
                    </p>
                  ) : (
                    clientInvoices.map((inv) => (
                      <div
                        key={inv.id}
                        className="flex justify-between items-center p-3 rounded-xl border border-purple-royal/5 bg-white/30 text-xs"
                      >
                        <div className="space-y-1">
                          <p className="font-bold text-purple-royal">{inv.invoiceNo}</p>
                          <span className="text-[10px] text-charcoal-dark/40 font-medium">
                            Date: {inv.date} | Type: {inv.bookingType}
                          </span>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-charcoal-dark">
                            ₹{inv.totalAmount.toLocaleString("en-IN")}
                          </p>
                          <span
                            className={`text-[9px] font-bold px-2 py-0.5 rounded border inline-block mt-1 ${
                              inv.status === "Paid"
                                ? "bg-emerald-500/10 text-emerald-700 border-emerald-500/20"
                                : "bg-amber-500/10 text-amber-700 border-amber-500/20"
                            }`}
                          >
                            {inv.status}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* TAB CONTENT: NOTES LOGGER */}
              {activeTab === "notes" && (
                <div className="space-y-4">
                  {/* Notes Append Form */}
                  <div className="flex gap-2">
                    <GlassInput
                      placeholder="Add a private note about catering, decor, or discounts..."
                      value={newNoteText}
                      onChange={(e) => setNewNoteText(e.target.value)}
                    />
                    <GlassButton variant="gold" onClick={handleAddNote} className="px-4 py-3 shrink-0">
                      <Plus size={14} /> Add
                    </GlassButton>
                  </div>

                  {/* Notes List */}
                  <div className="space-y-3 max-h-[250px] overflow-y-auto">
                    {activeCustomer.notes.map((n) => (
                      <div key={n.id} className="p-3 rounded-xl border border-purple-royal/5 bg-white/30 text-xs leading-normal">
                        <div className="flex justify-between border-b border-purple-royal/5 pb-1 mb-1 text-[9px] font-bold text-charcoal-dark/40">
                          <span>SYSTEM LOG</span>
                          <span>{n.date}</span>
                        </div>
                        <p className="text-charcoal-dark/70">{n.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </GlassCard>
          ) : (
            <GlassCard className="text-center py-16">
              <p className="text-sm font-semibold text-charcoal-dark/50">No customer selected.</p>
            </GlassCard>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomersView;
