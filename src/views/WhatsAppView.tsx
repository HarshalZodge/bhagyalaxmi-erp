"use client";

import React, { useState } from "react";
import {
  MessageCircle,
  Send,
  Phone,
  Video,
  Info,
  ChevronRight,
  ClipboardList,
  Sparkles,
} from "lucide-react";
import { useERP, Customer } from "@/context/ERPContext";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlassButton } from "@/components/ui/GlassButton";
import { GlassInput } from "@/components/ui/GlassInput";

export const WhatsAppView: React.FC = () => {
  const { customers, sendWhatsAppMessage } = useERP();
  const [activeCustId, setActiveCustId] = useState<string>(customers[0]?.id || "");
  const [newMsgText, setNewMsgText] = useState("");

  const activeCustomer = customers.find((c) => c.id === activeCustId);

  // Message templates list
  const templates = [
    {
      name: "Brochure Dispatch",
      text: "Namaskar! We have dispatched our premium Bhagyalaxmi Lawns brochure along with our Maharaja Hall and Lawn pricing packages. Please check and let us know if you want to book a venue walk.",
    },
    {
      name: "Payment Reminder",
      text: "Dear customer, this is a friendly reminder that the payment balance invoice is pending. Please process the bank transfer to secure the decorator booking date.",
    },
    {
      name: "Wedding Greeting",
      text: "Mangal Karyasya Shubhechha! On behalf of Bhagyalaxmi Lawns team, we wish the bride and groom a wonderful journey ahead. Our operations supervisor is at your disposal.",
    },
  ];

  const handleSendChat = () => {
    if (activeCustomer && newMsgText.trim()) {
      sendWhatsAppMessage(activeCustomer.id, newMsgText);
      setNewMsgText("");
    }
  };

  const handleApplyTemplate = (text: string) => {
    setNewMsgText(text);
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in select-none">
      {/* Title */}
      <div>
        <h2 className="text-3xl font-extrabold text-purple-royal leading-none">
          WhatsApp Messaging Portal
        </h2>
        <p className="text-xs text-charcoal-dark/50 mt-1.5 font-medium uppercase tracking-wide">
          Direct client communications chat stream and quick dispatch templates
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-stretch min-h-[550px]">
        {/* Left column: Chats conversations list */}
        <GlassCard className="p-4 border-white/60 bg-white/40 flex flex-col gap-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-purple-royal border-b border-purple-royal/10 pb-2">
            Conversations
          </h3>

          <div className="space-y-3 flex-1 overflow-y-auto max-h-[450px]">
            {customers.map((c) => {
              const isActive = c.id === activeCustId;
              const lastMsg = c.whatsappHistory[c.whatsappHistory.length - 1];
              return (
                <div
                  key={c.id}
                  onClick={() => setActiveCustId(c.id)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all duration-300 flex items-center gap-3 ${
                    isActive
                      ? "border-gold-luxury bg-white/70 shadow-sm"
                      : "border-purple-royal/5 hover:border-gold-luxury/20 bg-white/20"
                  }`}
                >
                  <div className="w-9 h-9 rounded-full overflow-hidden border border-purple-royal/10 shrink-0 bg-white">
                    <img src={c.photo} alt={c.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="overflow-hidden flex-1">
                    <h4 className="font-extrabold text-xs text-purple-royal leading-none truncate">
                      {c.name}
                    </h4>
                    <p className="text-[10px] text-charcoal-dark/50 truncate mt-1 leading-none">
                      {lastMsg ? lastMsg.text : "No messages yet"}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </GlassCard>

        {/* Middle column: Active conversation thread */}
        <GlassCard className="lg:col-span-2 p-4 border-white/60 bg-white/40 flex flex-col justify-between">
          {activeCustomer ? (
            <>
              {/* Active Header details */}
              <div className="flex items-center justify-between border-b border-purple-royal/10 pb-3 mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden border border-gold-luxury bg-white shadow-sm shrink-0">
                    <img src={activeCustomer.photo} alt={activeCustomer.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm text-purple-royal leading-none">
                      {activeCustomer.name}
                    </h4>
                    <span className="text-[9px] font-bold text-emerald-600 tracking-wide mt-1 block uppercase">
                      WhatsApp Connected
                    </span>
                  </div>
                </div>

                <div className="flex gap-2 text-purple-royal/60">
                  <span className="p-1.5 rounded-lg hover:bg-purple-royal/10 cursor-pointer transition-all">
                    <Phone size={16} />
                  </span>
                  <span className="p-1.5 rounded-lg hover:bg-purple-royal/10 cursor-pointer transition-all">
                    <Video size={16} />
                  </span>
                  <span className="p-1.5 rounded-lg hover:bg-purple-royal/10 cursor-pointer transition-all">
                    <Info size={16} />
                  </span>
                </div>
              </div>

              {/* Chat Message Bubble Stream */}
              <div className="flex-1 overflow-y-auto space-y-3 p-3 max-h-[350px] bg-purple-royal/[0.01] rounded-xl border border-purple-royal/[0.03] mb-4">
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
                            ? "bg-gradient-to-tr from-purple-royal to-purple-dark text-white rounded-tr-none shadow-md shadow-purple-royal/5"
                            : "bg-white border border-purple-royal/10 text-charcoal-dark rounded-tl-none shadow-sm"
                        }`}
                      >
                        <p>{msg.text}</p>
                        <span
                          className={`text-[8px] mt-1.5 block text-right font-medium ${
                            isOwner ? "text-white/50" : "text-charcoal-dark/40"
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

              {/* Chat Input Text Box */}
              <div className="flex items-center gap-2">
                <GlassInput
                  placeholder="Type message here..."
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
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-charcoal-dark/40 text-xs font-semibold">
              Select conversation thread from sidebar.
            </div>
          )}
        </GlassCard>

        {/* Right column: Templates list */}
        <GlassCard className="p-4 border-white/60 bg-white/40 flex flex-col gap-4">
          <div className="border-b border-purple-royal/10 pb-2 flex items-center gap-1.5 text-purple-royal">
            <ClipboardList size={16} className="text-gold-luxury" />
            <h3 className="text-xs font-bold uppercase tracking-wider">
              Quick Templates
            </h3>
          </div>

          <div className="space-y-4 overflow-y-auto max-h-[450px]">
            {templates.map((t, idx) => (
              <div
                key={idx}
                onClick={() => handleApplyTemplate(t.text)}
                className="p-3 rounded-xl border border-purple-royal/5 bg-white/20 hover:border-gold-luxury/35 hover:bg-white/50 cursor-pointer transition-all duration-300 text-xs space-y-1.5"
              >
                <div className="flex justify-between items-center text-[10px] font-bold text-purple-royal border-b border-purple-royal/5 pb-1">
                  <span>{t.name}</span>
                  <ChevronRight size={12} className="text-gold-luxury" />
                </div>
                <p className="text-charcoal-dark/60 leading-normal truncate-3-lines">{t.text}</p>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

export default WhatsAppView;
