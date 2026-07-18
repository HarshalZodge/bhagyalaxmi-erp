"use client";

import React from "react";
import { Printer, MapPin, Phone, Mail, QrCode } from "lucide-react";

interface InvoicePrintViewProps {
  request: {
    id?: string;
    customerName: string;
    phoneNumber: string;
    email: string;
    venue: string;
    eventType: string;
    eventDate: string;
    eventSession: string;
    guests: number;
    packageSelected: string;
    vendors: Record<string, { name?: string; type: string; phone?: string; status?: string }>;
    additionalServices: string[];
    pricingBreakdown: {
      venue: number;
      package: number;
      vendors: number;
      services: number;
      generatorHours: number;
      electricityUnits: number;
      discount: number;
      gst: number;
      grandTotal: number;
      advance: number;
    };
  };
}

export const InvoicePrintView: React.FC<InvoicePrintViewProps> = ({ request }) => {
  const handlePrint = () => {
    window.print();
  };

  const formatINR = (val: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const taxAmt = request.pricingBreakdown.gst;
  const taxableVal = request.pricingBreakdown.grandTotal - taxAmt;

  return (
    <div className="bg-[#f9f6f0] p-6 max-w-3xl mx-auto rounded-2xl shadow-xl border border-purple-royal/10 print:border-none print:shadow-none print:bg-white print:p-0 select-none">
      {/* Action Header - Hidden during print */}
      <div className="flex justify-between items-center mb-6 pb-4 border-b border-purple-royal/10 print:hidden">
        <span className="text-xs font-extrabold uppercase tracking-wider text-purple-royal">
          Printable GST Invoice Draft
        </span>
        <GlassButton onClick={handlePrint} variant="gold" className="py-2 px-4 text-xs font-bold uppercase">
          <Printer size={14} /> Print / Save PDF
        </GlassButton>
      </div>

      {/* Invoice Content */}
      <div id="invoice-sheet" className="bg-[#f9f6f0] print:bg-white p-8 space-y-8 relative overflow-hidden font-sans border border-purple-royal/5 print:border-none">
        
        {/* Luxury Corner Watermark */}
        <div className="absolute -top-12 -right-12 w-48 h-48 opacity-[0.03] text-gold-luxury pointer-events-none">
          <svg viewBox="0 0 100 100" fill="currentColor">
            <circle cx="50" cy="50" r="40" />
          </svg>
        </div>

        {/* Branding Header */}
        <div className="flex justify-between items-start gap-4 border-b-2 border-gold-luxury pb-6">
          <div className="flex gap-4 items-center">
            <div className="w-16 h-16 rounded-2xl overflow-hidden border border-gold-luxury bg-white shadow-md">
              <img src="/logo.jpg" alt="Bhagyalaxmi lawns logo" className="w-full h-full object-cover" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-purple-royal leading-none tracking-tight uppercase">
                Bhagyalaxmi Lawns
              </h1>
              <span className="text-[10px] font-black text-gold-luxury tracking-widest uppercase block mt-1">
                Pure Vegetarian Grand Venue
              </span>
            </div>
          </div>

          <div className="text-right text-[10px] font-bold text-charcoal-dark/50 space-y-1 uppercase tracking-wide">
            <p className="text-purple-royal font-extrabold text-xs">INVOICE DRAFT</p>
            <p>Invoice No: BL-2026-TEMP</p>
            <p>Date: {new Date().toLocaleDateString("en-IN")}</p>
          </div>
        </div>

        {/* Billing Metadata */}
        <div className="grid grid-cols-2 gap-8 text-xs border-b border-purple-royal/10 pb-6">
          <div className="space-y-1.5">
            <h4 className="font-extrabold text-purple-royal text-[10px] uppercase tracking-wider">
              Customer Information
            </h4>
            <p className="font-extrabold text-charcoal-dark text-sm leading-tight">
              {request.customerName}
            </p>
            <p className="flex items-center gap-1 text-charcoal-dark/70 font-semibold">
              <Phone size={12} className="text-gold-luxury" /> {request.phoneNumber}
            </p>
            <p className="flex items-center gap-1 text-charcoal-dark/70 font-semibold truncate">
              <Mail size={12} className="text-gold-luxury" /> {request.email}
            </p>
          </div>

          <div className="space-y-1.5 text-right md:text-left md:pl-12">
            <h4 className="font-extrabold text-purple-royal text-[10px] uppercase tracking-wider">
              Event Itinerary
            </h4>
            <p className="font-semibold text-charcoal-dark/80">
              Venue: <strong className="font-bold text-purple-royal">{request.venue}</strong>
            </p>
            <p className="font-semibold text-charcoal-dark/80">
              Date: <strong className="font-bold text-purple-royal">{request.eventDate} ({request.eventSession} Session)</strong>
            </p>
            <p className="font-semibold text-charcoal-dark/80">
              Event Type: <strong className="font-bold text-purple-royal">{request.eventType}</strong>
            </p>
            <p className="font-semibold text-charcoal-dark/80">
              Estimated Attendance: <strong className="font-bold text-purple-royal">{request.guests} Guests</strong>
            </p>
          </div>
        </div>

        {/* Invoice Itemized Table */}
        <div className="space-y-3">
          <h4 className="font-extrabold text-purple-royal text-[10px] uppercase tracking-wider mb-2">
            GST Itemized Breakdown
          </h4>
          <div className="border border-purple-royal/10 rounded-xl overflow-hidden bg-white/40">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-purple-royal/5 text-purple-royal border-b border-purple-royal/10 font-bold">
                  <th className="p-3">Description</th>
                  <th className="p-3 text-center">Unit / Rate</th>
                  <th className="p-3 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-purple-royal/5 font-semibold text-charcoal-dark/85">
                {/* Venue Charge */}
                <tr>
                  <td className="p-3">
                    <p className="font-bold text-purple-royal">Base Venue Hire</p>
                    <span className="text-[9px] text-charcoal-dark/40 font-medium">Rental charge for Maharaja Complex</span>
                  </td>
                  <td className="p-3 text-center">Flat Rent</td>
                  <td className="p-3 text-right font-bold">{formatINR(request.pricingBreakdown.venue)}</td>
                </tr>

                {/* Catering Plate Charge */}
                <tr>
                  <td className="p-3">
                    <p className="font-bold text-purple-royal">Catering Service (Pure Veg)</p>
                    <span className="text-[9px] text-charcoal-dark/40 font-medium">{request.packageSelected} package dining menu</span>
                  </td>
                  <td className="p-3 text-center">{request.guests} Plates</td>
                  <td className="p-3 text-right font-bold">{formatINR(request.pricingBreakdown.package)}</td>
                </tr>

                {/* Vendors Selected */}
                {request.pricingBreakdown.vendors > 0 && (
                  <tr>
                    <td className="p-3">
                      <p className="font-bold text-purple-royal">Marketplace Selected Vendors</p>
                      <span className="text-[9px] text-charcoal-dark/40 font-medium">Decoration, sound, photography partner charges</span>
                    </td>
                    <td className="p-3 text-center">Partner rates</td>
                    <td className="p-3 text-right font-bold">{formatINR(request.pricingBreakdown.vendors)}</td>
                  </tr>
                )}

                {/* Utilities / Generator rent */}
                {request.pricingBreakdown.services > 0 && (
                  <tr>
                    <td className="p-3">
                      <p className="font-bold text-purple-royal">Additional Services & Utilities</p>
                      <span className="text-[9px] text-charcoal-dark/40 font-medium">Guest rooms, LED walls, valet, special setups</span>
                    </td>
                    <td className="p-3 text-center">Itemized</td>
                    <td className="p-3 text-right font-bold">{formatINR(request.pricingBreakdown.services)}</td>
                  </tr>
                )}

                {/* Generator flat charges */}
                {!request.additionalServices.includes("Bring Own Generator") && (
                  <tr>
                    <td className="p-3">
                      <p className="font-bold text-purple-royal">Backup Power Generator Rental</p>
                      <span className="text-[9px] text-charcoal-dark/40 font-medium">Session generator fuel & backup operations</span>
                    </td>
                    <td className="p-3 text-center">Session standard</td>
                    <td className="p-3 text-right font-bold">
                      {formatINR(request.eventSession === "Night" ? 15000 : 7000)}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pricing Total summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end pt-4">
          {/* QR Codes and Payment info */}
          <div className="flex gap-4 items-center bg-white/50 p-4 rounded-xl border border-purple-royal/5">
            <div className="space-y-1.5 flex-1">
              <h5 className="font-extrabold text-[9px] uppercase tracking-wider text-purple-royal leading-none">
                Scan Secure Payments
              </h5>
              <p className="text-[8px] text-charcoal-dark/50 leading-normal font-medium">
                Scan QR using any BHIM UPI app. Scan Google Maps for site directions.
              </p>
              <div className="flex gap-3 pt-1">
                <div className="flex flex-col items-center gap-1 text-[8px] font-bold text-purple-royal">
                  <QrCode size={40} className="text-purple-royal border border-purple-royal/10 p-0.5 rounded bg-white" />
                  <span>PAY UPI</span>
                </div>
                <div className="flex flex-col items-center gap-1 text-[8px] font-bold text-purple-royal">
                  <QrCode size={40} className="text-purple-royal border border-purple-royal/10 p-0.5 rounded bg-white" />
                  <span>LOCATION</span>
                </div>
              </div>
            </div>
          </div>

          {/* Totals table */}
          <div className="space-y-2 text-xs font-semibold text-charcoal-dark/75 bg-white/40 p-4 rounded-xl border border-purple-royal/5">
            <div className="flex justify-between">
              <span className="text-charcoal-dark/50">Taxable Value:</span>
              <span>{formatINR(taxableVal)}</span>
            </div>
            {request.pricingBreakdown.discount > 0 && (
              <div className="flex justify-between text-emerald-600 font-bold">
                <span>Discount applied:</span>
                <span>- {formatINR(request.pricingBreakdown.discount)}</span>
              </div>
            )}
            <div className="flex justify-between font-extrabold text-purple-royal text-sm border-t border-purple-royal/10 pt-2 bg-purple-royal/5 p-2 rounded">
              <span>Grand Total (GST Included):</span>
              <span>{formatINR(request.pricingBreakdown.grandTotal)}</span>
            </div>
            <div className="flex justify-between text-[10px] font-bold text-gold-dark border-t border-dashed border-gold-luxury/35 pt-1.5">
              <span>Advance Paid (20%):</span>
              <span>{formatINR(request.pricingBreakdown.advance)}</span>
            </div>
          </div>
        </div>

        {/* Terms and Conditions */}
        <div className="p-4 bg-white/20 border border-purple-royal/5 rounded-xl text-[9px] text-charcoal-dark/55 leading-relaxed">
          <h5 className="font-bold text-purple-royal uppercase tracking-wider mb-1 leading-none">
            Terms & Conditions
          </h5>
          <ol className="list-decimal pl-3.5 space-y-0.5">
            <li>GST charges (18%) are calculated as per central and state tax parameters.</li>
            <li>Token advance deposit (20%) is non-refundable upon slot cancellation.</li>
            <li>Estimated guest count can be adjusted later before the event date up to 48 hours.</li>
            <li>No non-vegetarian food or alcoholic beverages are permitted inside the lawns venue.</li>
          </ol>
        </div>

        {/* Footer branding */}
        <div className="border-t border-purple-royal/10 pt-6 text-center space-y-2 text-[9px] font-bold text-charcoal-dark/50 uppercase tracking-wider">
          <p className="text-purple-royal font-extrabold text-xs">Bhagyalaxmi Lawns & Banquet Hall</p>
          <p className="flex justify-center items-center gap-1.5 flex-wrap">
            <span className="flex items-center gap-0.5"><MapPin size={10} className="text-gold-luxury" /> Keshav Nagar, Pumping Station Road, Bhingar, Ahilyanagar - 414002</span>
          </p>
          <p className="flex justify-center items-center gap-4 flex-wrap text-gold-dark mt-1 font-extrabold">
            <span>📞 9890907454</span>
            <span>📞 9422238066</span>
            <span>📞 9960281292</span>
            <span>✉ bhagyalaxmilawns414002@gmail.com</span>
          </p>
        </div>
      </div>

      {/* Print Styles stylesheet */}
      <style jsx global>{`
        @media print {
          body {
            background-color: white !important;
            color: black !important;
          }
          #invoice-sheet {
            border: none !important;
            box-shadow: none !important;
            padding: 0 !important;
            margin: 0 !important;
            background-color: white !important;
          }
          aside, nav, header, button, .print-hidden {
            display: none !important;
          }
          main {
            margin-left: 0 !important;
            padding-top: 0 !important;
            padding-right: 0 !important;
            padding-bottom: 0 !important;
          }
        }
      `}</style>
    </div>
  );
};

export default InvoicePrintView;

// Quick helper button mockup for nested views
const GlassButton: React.FC<{
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  variant?: "default" | "gold" | "secondary";
}> = ({ children, className = "", onClick, variant = "default" }) => {
  const variantClasses = {
    default: "glass-button",
    gold: "glass-button-gold",
    secondary: "glass-button-secondary",
  };
  const btnClass = variantClasses[variant] || variantClasses.default;
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-all duration-300 ${btnClass} ${className}`}
    >
      {children}
    </button>
  );
};
