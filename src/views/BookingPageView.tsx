"use client";

import React, { useState, useEffect } from "react";
import {
  MapPin,
  Calendar,
  Users,
  Utensils,
  Store,
  Camera,
  Check,
  CheckCircle,
  Plus,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Clock,
  Music,
  IndianRupee,
  Tv,
  Heart,
  Smile,
  Compass,
  Trash2,
  Phone,
  Mail,
  User,
  ShieldCheck,
  CheckSquare,
} from "lucide-react";
import { useERP, BookingRequest, Vendor } from "@/context/ERPContext";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlassButton } from "@/components/ui/GlassButton";
import { GlassInput } from "@/components/ui/GlassInput";
import { GlassSelect } from "@/components/ui/GlassSelect";
import { GlassModal } from "@/components/ui/GlassModal";
import confetti from "canvas-confetti";

export const BookingPageView: React.FC = () => {
  const {
    addBookingRequest,
    setActiveView,
    configSettings,
    vendors: contextVendors,
    bookings,
    bookingRequests,
  } = useERP();

  const [step, setStep] = useState(1);

  // --- FORM STATES ---
  const [selectedVenue, setSelectedVenue] = useState<"Wedding Hall" | "Hall + Lawn">("Wedding Hall");
  const [eventType, setEventType] = useState("Wedding");
  const [eventDate, setEventDate] = useState("");
  const [eventSession, setEventSession] = useState<"Day" | "Night">("Day");
  const [guestCount, setGuestCount] = useState(500);

  // Package Choice
  const [selectedPackage, setSelectedPackage] = useState<string>("Gold");

  // Selected Vendors per category
  // Key: Category Name, Value: Vendor ID or "own"
  const [selectedVendors, setSelectedVendors] = useState<Record<string, string>>({});
  // User's own vendor details
  const [ownVendorsDetails, setOwnVendorsDetails] = useState<Record<string, {
    name: string;
    phone: string;
    email: string;
    gst: string;
    notes: string;
  }>>({});

  // Additional Services (Checkboxes)
  const [additionalServices, setAdditionalServices] = useState<string[]>([]);
  // Generator choices
  const [ownGenerator, setOwnGenerator] = useState(false);
  const [selectedGenType, setSelectedGenType] = useState<"25 kVA" | "75 kVA">("25 kVA");

  // --- UI STATES ---
  const [activeCategory, setActiveCategory] = useState("Decoration");
  const [viewingVendor, setViewingVendor] = useState<Vendor | null>(null);
  const [decorPreviewTheme, setDecorPreviewTheme] = useState<{ name: string; image: string; description: string } | null>(null);

  // Auto-default generator based on session choice
  useEffect(() => {
    if (eventSession === "Night") {
      setSelectedGenType("75 kVA");
    } else {
      setSelectedGenType("25 kVA");
    }
  }, [eventSession]);

  // Venue options
  const venueOptions = [
    {
      id: "wedding-hall",
      name: "Wedding Hall",
      capacity: "1200 Guests",
      price: configSettings.hallPrice,
      image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=600",
      amenities: ["Bridal Room", "Ample Parking", "Basic Stage", "Ambient Indoor Lights"],
    },
    {
      id: "hall-lawn",
      name: "Hall + Lawn",
      capacity: "3700 Guests",
      price: configSettings.hallLawnPrice,
      image: "https://images.unsplash.com/photo-1545232979-8bf34eb9757b?auto=format&fit=crop&q=80&w=600",
      amenities: ["Wedding Hall", "Premium Open-Air Lawn", "Bridal Room", "Exclusive Parking Zone", "Premium Lighting Setup"],
    },
  ];

  // Event type configurations
  const eventTypes = [
    { name: "Wedding", icon: Heart },
    { name: "Reception", icon: Sparkles },
    { name: "Engagement", icon: Smile },
    { name: "Haldi", icon: Compass },
    { name: "Birthday", icon: Music },
    { name: "Corporate", icon: ShieldCheck },
    { name: "Other", icon: StarIcon },
  ];

  function StarIcon(props: any) {
    return (
      <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    );
  }

  // --- CALENDAR & DATE CHECKS ---
  const checkDateStatus = (dateStr: string) => {
    if (!dateStr) return "Available";
    
    // Check confirmed bookings
    const isBooked = bookings.some(
      (b) => b.bookingDate === dateStr && b.status !== "Cancelled"
    );
    if (isBooked) return "Booked";

    // Check pending requests
    const isPending = bookingRequests.some(
      (r) => r.eventDate === dateStr && r.status === "Pending"
    );
    if (isPending) return "Pending";

    return "Available";
  };

  // Pricing math helper
  const venuePrice = selectedVenue === "Hall + Lawn" ? configSettings.hallLawnPrice : configSettings.hallPrice;
  
  const packageDetail = configSettings.packageTemplates.find((p) => p.name === selectedPackage);
  const packagePricePerGuest = packageDetail ? packageDetail.pricePerGuest : 0;
  const packageTotal = packagePricePerGuest * guestCount;

  // Vendors Cost
  let vendorsTotal = 0;
  Object.entries(selectedVendors).forEach(([cat, val]) => {
    if (val !== "own") {
      const vdr = contextVendors.find((v) => v.id === val);
      if (vdr) {
        vendorsTotal += vdr.price;
      }
    }
  });

  // Services Cost
  let servicesTotal = 0;
  additionalServices.forEach((srv) => {
    // Add mock flat cost for additional services
    if (srv === "Guest Rooms") servicesTotal += 25000;
    else if (srv === "LED Wall") servicesTotal += 15000;
    else if (srv === "Fireworks") servicesTotal += 12000;
    else if (srv === "Valet Parking") servicesTotal += 8000;
    else if (srv === "Dance Floor") servicesTotal += 10000;
    else servicesTotal += 3000; // default flat cost
  });

  // Generator cost
  let generatorCost = 0;
  if (!ownGenerator) {
    // night event requires 75kVA (costlier), day sufficient with 25kVA
    generatorCost = selectedGenType === "75 kVA" ? 15000 : 7000;
  }

  const subTotal = venuePrice + packageTotal + vendorsTotal + servicesTotal + generatorCost;
  const discountAmount = configSettings.discountDefault;
  const taxableAmount = Math.max(0, subTotal - discountAmount);
  
  // GST 18% (CGST 9% + SGST 9%)
  const cgstAmount = Math.round(taxableAmount * 0.09);
  const sgstAmount = Math.round(taxableAmount * 0.09);
  const totalAmount = taxableAmount + cgstAmount + sgstAmount;
  
  // 20% advance required
  const advanceRequired = Math.round(totalAmount * 0.2);

  // --- ACTIONS ---
  const handleSelectVendor = (category: string, vendorId: string) => {
    setSelectedVendors((prev) => ({
      ...prev,
      [category]: vendorId,
    }));
  };

  const handleUseOwnVendor = (category: string, details: any) => {
    setSelectedVendors((prev) => ({
      ...prev,
      [category]: "own",
    }));
    setOwnVendorsDetails((prev) => ({
      ...prev,
      [category]: details,
    }));
  };

  const handleRemoveVendor = (category: string) => {
    const updated = { ...selectedVendors };
    delete updated[category];
    setSelectedVendors(updated);
  };

  const toggleAdditionalService = (srv: string) => {
    if (additionalServices.includes(srv)) {
      setAdditionalServices(additionalServices.filter((s) => s !== srv));
    } else {
      setAdditionalServices([...additionalServices, srv]);
    }
  };

  const handleNext = () => {
    if (step === 1 && !selectedVenue) return;
    if (step === 3 && (!eventDate || checkDateStatus(eventDate) === "Booked")) return;
    if (step === 4 && !guestCount) return;

    if (step === 9) {
      // Build final request object
      const requestVendorsObj: Record<string, any> = {};
      Object.entries(selectedVendors).forEach(([cat, val]) => {
        if (val === "own") {
          const details = ownVendorsDetails[cat];
          requestVendorsObj[cat] = {
            type: "own",
            name: details?.name || "",
            phone: details?.phone || "",
            email: details?.email || "",
            gst: details?.gst || "",
            notes: details?.notes || "",
            status: "Pending Approval",
          };
        } else {
          const vdrObj = contextVendors.find((v) => v.id === val);
          requestVendorsObj[cat] = {
            type: "system",
            vendorId: val,
            name: vdrObj?.name || "",
            status: "Approved",
          };
        }
      });

      const newRequest = addBookingRequest({
        customerName: `Wedding Ceremony of Karan & Priya`, // default mockup client name
        phoneNumber: "+91 99602 81292",
        email: "customer.deshmukh@gmail.com",
        venue: selectedVenue,
        eventType,
        eventDate,
        eventSession,
        guests: guestCount,
        packageSelected: selectedPackage,
        vendors: requestVendorsObj,
        additionalServices: [
          ...additionalServices,
          ownGenerator ? "Bring Own Generator" : `${selectedGenType} Generator Rental`,
        ],
        pricingBreakdown: {
          venue: venuePrice,
          package: packageTotal,
          vendors: vendorsTotal,
          services: servicesTotal,
          generatorHours: ownGenerator ? 0 : 8,
          electricityUnits: 0,
          discount: discountAmount,
          gst: cgstAmount + sgstAmount,
          grandTotal: totalAmount,
          advance: advanceRequired,
        },
      });

      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
        colors: ["#4c1d95", "#d4af37", "#f9f6f0"],
      });

      setStep(10);
    } else {
      setStep(step + 1);
    }
  };

  const handlePrev = () => {
    setStep(step - 1);
  };

  const stepsList = [
    { id: 1, label: "Venue" },
    { id: 2, label: "Event Type" },
    { id: 3, label: "Schedule" },
    { id: 4, label: "Guests" },
    { id: 5, label: "Packages" },
    { id: 6, label: "Marketplace" },
    { id: 7, label: "Services" },
    { id: 8, label: "Quote Builder" },
    { id: 9, label: "Review" },
  ];

  return (
    <div className="space-y-6 pb-12 animate-fade-in select-none">
      {/* Title Header */}
      <div>
        <h2 className="text-3xl font-extrabold text-purple-royal leading-none">
          Client Booking Wizard
        </h2>
        <p className="text-xs text-charcoal-dark/50 mt-1.5 font-medium uppercase tracking-wide">
          Design your dream wedding event at Bhagyalaxmi Lawns
        </p>
      </div>

      {/* Steps Progress */}
      {step < 10 && (
        <div className="flex justify-between items-center max-w-4xl mx-auto py-2">
          {stepsList.map((s, idx) => {
            const isDone = step > s.id;
            const isCurrent = step === s.id;
            return (
              <React.Fragment key={s.id}>
                <div className="flex flex-col items-center gap-1">
                  <div
                    onClick={() => { if (s.id < step) setStep(s.id); }}
                    className={`w-8 h-8 rounded-full flex items-center justify-center border text-[11px] font-extrabold transition-all duration-300 ${
                      isDone
                        ? "bg-purple-royal text-ivory-soft border-purple-royal cursor-pointer"
                        : isCurrent
                        ? "bg-gold-luxury border-gold-luxury text-charcoal-dark shadow-md scale-105"
                        : "bg-white/40 border-purple-royal/10 text-charcoal-dark/40"
                    }`}
                  >
                    {s.id}
                  </div>
                  <span
                    className={`text-[8px] font-bold uppercase tracking-wider ${
                      isCurrent ? "text-purple-royal" : "text-charcoal-dark/30"
                    }`}
                  >
                    {s.label}
                  </span>
                </div>
                {idx < stepsList.length - 1 && (
                  <div
                    className={`flex-1 h-[1.5px] mx-1 rounded-full transition-all duration-300 ${
                      step > s.id ? "bg-purple-royal" : "bg-purple-royal/10"
                    }`}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>
      )}

      {/* Two Column Layout: Main step form and sticky quote builder */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2 space-y-6">
          <GlassCard className="p-8 border-white/60 bg-white/45 min-h-[460px] flex flex-col justify-between">
            {/* STEP 1: CHOOSE VENUE */}
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold uppercase tracking-wider text-purple-royal">
                    Choose Event Venue
                  </h3>
                  <p className="text-[10px] text-charcoal-dark/40 font-semibold uppercase">
                    Select a setup corresponding to your guest capacity
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {venueOptions.map((v) => (
                    <div
                      key={v.id}
                      onClick={() => setSelectedVenue(v.name as any)}
                      className={`rounded-2xl border overflow-hidden cursor-pointer transition-all duration-300 bg-white/60 hover:shadow-xl ${
                        selectedVenue === v.name
                          ? "border-gold-luxury shadow-lg scale-[1.01]"
                          : "border-purple-royal/5"
                      }`}
                    >
                      <div className="h-44 w-full relative">
                        <img src={v.image} alt={v.name} className="w-full h-full object-cover" />
                        <div className="absolute top-3 right-3 bg-purple-royal/80 backdrop-blur-sm text-ivory-soft px-3 py-1 rounded-full text-[10px] font-bold">
                          Cap: {v.capacity}
                        </div>
                      </div>
                      <div className="p-5 space-y-3">
                        <div className="flex justify-between items-center">
                          <h4 className="font-extrabold text-md text-purple-royal">{v.name}</h4>
                          <span className="text-sm font-extrabold text-gold-dark">
                            ₹{v.price.toLocaleString("en-IN")}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {v.amenities.map((am, i) => (
                            <span
                              key={i}
                              className="text-[9px] font-bold bg-purple-royal/5 text-purple-royal px-2 py-0.5 rounded border border-purple-royal/10"
                            >
                              ✓ {am}
                            </span>
                          ))}
                        </div>
                        <button
                          className={`w-full py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all ${
                            selectedVenue === v.name
                              ? "bg-gold-luxury text-charcoal-dark"
                              : "bg-purple-royal/5 text-purple-royal hover:bg-purple-royal/10"
                          }`}
                        >
                          {selectedVenue === v.name ? "Selected" : `Select ${v.name}`}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 2: SELECT EVENT TYPE */}
            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold uppercase tracking-wider text-purple-royal">
                    Select Event Type
                  </h3>
                  <p className="text-[10px] text-charcoal-dark/40 font-semibold uppercase">
                    Choose the ceremony type for tailored decorations and checklists
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {eventTypes.map((et) => {
                    const Icon = et.icon;
                    return (
                      <div
                        key={et.name}
                        onClick={() => setEventType(et.name)}
                        className={`p-6 rounded-2xl border cursor-pointer transition-all duration-300 text-center space-y-3 bg-white/50 ${
                          eventType === et.name
                            ? "border-gold-luxury bg-gold-luxury/10 shadow-md scale-105 text-gold-dark"
                            : "border-purple-royal/5 text-purple-royal hover:bg-purple-royal/5"
                        }`}
                      >
                        <div className="w-12 h-12 rounded-full bg-purple-royal/5 text-purple-royal flex items-center justify-center mx-auto border border-purple-royal/10">
                          <Icon size={20} className={eventType === et.name ? "text-gold-luxury" : ""} />
                        </div>
                        <span className="text-xs font-extrabold uppercase tracking-wide block">
                          {et.name}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* STEP 3: CHOOSE DATE & SESSION */}
            {step === 3 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold uppercase tracking-wider text-purple-royal">
                    Choose Event Schedule
                  </h3>
                  <p className="text-[10px] text-charcoal-dark/40 font-semibold uppercase">
                    Configure dates and daily event slot sessions
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                  <div className="space-y-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold text-purple-royal uppercase tracking-wider">
                        Select Date
                      </label>
                      <input
                        type="date"
                        value={eventDate}
                        min="2026-07-17"
                        onChange={(e) => setEventDate(e.target.value)}
                        className="glass-input px-4 py-3 rounded-xl text-sm border focus:outline-none bg-white/40 border-purple-royal/10 w-full"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold text-purple-royal uppercase tracking-wider">
                        Event Session
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() => setEventSession("Day")}
                          className={`py-3 rounded-xl text-xs font-bold uppercase border transition-all ${
                            eventSession === "Day"
                              ? "bg-purple-royal text-ivory-soft border-purple-royal"
                              : "bg-white/40 border-purple-royal/10 text-charcoal-dark/70 hover:bg-white/60"
                          }`}
                        >
                          <SunIcon size={14} className="inline mr-1" /> Day Session
                        </button>
                        <button
                          type="button"
                          onClick={() => setEventSession("Night")}
                          className={`py-3 rounded-xl text-xs font-bold uppercase border transition-all ${
                            eventSession === "Night"
                              ? "bg-purple-royal text-ivory-soft border-purple-royal"
                              : "bg-white/40 border-purple-royal/10 text-charcoal-dark/70 hover:bg-white/60"
                          }`}
                        >
                          <MoonIcon size={14} className="inline mr-1" /> Night Session
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 bg-white/50 border border-purple-royal/10 rounded-2xl space-y-4">
                    <h4 className="text-xs font-bold text-purple-royal uppercase tracking-wider border-b border-purple-royal/5 pb-2">
                      Live Availability Status
                    </h4>
                    {eventDate ? (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-xs">
                          <span>Status:</span>
                          <span
                            className={`px-3 py-1 rounded font-bold uppercase text-[10px] border ${
                              checkDateStatus(eventDate) === "Available"
                                ? "bg-emerald-500/10 text-emerald-700 border-emerald-500/20"
                                : checkDateStatus(eventDate) === "Pending"
                                ? "bg-amber-500/10 text-amber-700 border-amber-500/20"
                                : "bg-rose-500/10 text-rose-700 border-rose-500/20"
                            }`}
                          >
                            {checkDateStatus(eventDate)}
                          </span>
                        </div>
                        {checkDateStatus(eventDate) === "Booked" && (
                          <p className="text-[10px] text-rose-600 font-semibold leading-relaxed">
                            ⚠️ This date is already booked. Please choose an alternative date.
                          </p>
                        )}
                        {checkDateStatus(eventDate) === "Available" && (
                          <p className="text-[10px] text-emerald-600 font-semibold leading-relaxed">
                            ✓ Great choice! This date is available for booking.
                          </p>
                        )}
                      </div>
                    ) : (
                      <p className="text-xs text-charcoal-dark/40 font-medium">
                        Please select a date to verify availability.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 4: ESTIMATED GUESTS */}
            {step === 4 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold uppercase tracking-wider text-purple-royal">
                    Estimated Guests
                  </h3>
                  <p className="text-[10px] text-charcoal-dark/40 font-semibold uppercase">
                    Provide the expected attendance count
                  </p>
                </div>

                <div className="max-w-md space-y-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-bold text-purple-royal uppercase tracking-wider">
                      Guest Count ({guestCount} Guests)
                    </label>
                    <input
                      type="range"
                      min="100"
                      max={selectedVenue === "Hall + Lawn" ? 3700 : 1200}
                      step="50"
                      value={guestCount}
                      onChange={(e) => setGuestCount(Number(e.target.value))}
                      className="w-full accent-purple-royal cursor-pointer"
                    />
                    <div className="flex justify-between text-[9px] font-bold text-charcoal-dark/40">
                      <span>100 MIN</span>
                      <span>{selectedVenue === "Hall + Lawn" ? "3700 MAX" : "1200 MAX"}</span>
                    </div>
                  </div>

                  <div className="p-4 bg-purple-royal/5 border border-purple-royal/10 rounded-xl">
                    <p className="text-xs font-semibold text-purple-royal flex items-center gap-1.5">
                      ℹ️ Note on Guest Count
                    </p>
                    <p className="text-[10px] text-charcoal-dark/60 leading-relaxed mt-1">
                      This number is an estimate for initial catering and seating preparations. You can update this count later as invitations are finalized, up until 48 hours before the event.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 5: CHOOSE PACKAGE */}
            {step === 5 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold uppercase tracking-wider text-purple-royal">
                    Choose Catering Package (Pure Veg Only)
                  </h3>
                  <p className="text-[10px] text-charcoal-dark/40 font-semibold uppercase">
                    High-end pure vegetarian dining options for your guests
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {configSettings.packageTemplates.map((pkg) => (
                    <div
                      key={pkg.name}
                      onClick={() => setSelectedPackage(pkg.name)}
                      className={`p-5 rounded-2xl border cursor-pointer bg-white/40 transition-all duration-300 flex flex-col justify-between hover:shadow-xl ${
                        selectedPackage === pkg.name
                          ? "border-gold-luxury bg-gold-luxury/[0.03] shadow-md scale-[1.01]"
                          : "border-purple-royal/5"
                      }`}
                    >
                      <div className="space-y-3">
                        <div className="flex justify-between items-start border-b border-purple-royal/5 pb-2">
                          <div>
                            <h4 className="font-extrabold text-sm text-purple-royal uppercase tracking-wide">
                              {pkg.name} Package
                            </h4>
                            <p className="text-[10px] text-charcoal-dark/50 font-medium italic mt-0.5">
                              {pkg.description}
                            </p>
                          </div>
                          <span className="text-xs font-extrabold text-gold-dark bg-gold-luxury/10 border border-gold-luxury/20 px-2 py-1 rounded">
                            ₹{pkg.pricePerGuest} / Plate
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-[10px] font-semibold text-charcoal-dark/70">
                          <div>Stage: <strong className="font-bold text-purple-royal">{pkg.stage}</strong></div>
                          <div>Flowers: <strong className="font-bold text-purple-royal">{pkg.flowerWork}</strong></div>
                          <div>Decor: <strong className="font-bold text-purple-royal">{pkg.decorationLevel}</strong></div>
                          <div>Bridal Suite: <strong className="font-bold text-purple-royal">{pkg.bridalRoom}</strong></div>
                        </div>
                      </div>

                      {selectedPackage === pkg.name && (
                        <div className="text-center bg-gold-luxury text-charcoal-dark font-extrabold text-[9px] uppercase tracking-widest py-1.5 rounded-lg mt-4">
                          Selected Package
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 6: VENDOR MARKETPLACE */}
            {step === 6 && (
              <div className="space-y-6">
                <div className="flex justify-between items-end border-b border-purple-royal/10 pb-3">
                  <div>
                    <h3 className="text-lg font-bold uppercase tracking-wider text-purple-royal">
                      Vendor Marketplace
                    </h3>
                    <p className="text-[10px] text-charcoal-dark/40 font-semibold uppercase">
                      Select premium local vendors or register your own
                    </p>
                  </div>

                  <div className="flex gap-1.5 overflow-x-auto max-w-sm pb-1">
                    {["Decoration", "Food Catering", "Photography"].map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setActiveCategory(cat)}
                        className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase border transition-all ${
                          activeCategory === cat
                            ? "bg-purple-royal text-ivory-soft border-purple-royal"
                            : "bg-white/40 border-purple-royal/10 text-charcoal-dark/60 hover:bg-white/70"
                        }`}
                      >
                        {cat === "Food Catering" ? "Catering" : cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Vendor Category Content */}
                <div className="space-y-4">
                  {/* Pinterest-style theme gallery inside Decoration */}
                  {activeCategory === "Decoration" && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {/* Render ahilya decor themes directly */}
                        {contextVendors
                          .find((v) => v.category === "Decoration")
                          ?.themes?.map((t) => (
                            <div
                              key={t.name}
                              onClick={() => {
                                const decorVdr = contextVendors.find((v) => v.category === "Decoration");
                                if (decorVdr) {
                                  handleSelectVendor("Decoration", decorVdr.id);
                                  setDecorPreviewTheme(t);
                                }
                              }}
                              className={`rounded-xl overflow-hidden border cursor-pointer bg-white/40 transition-all hover:shadow-lg ${
                                selectedVendors["Decoration"] === contextVendors.find((v) => v.category === "Decoration")?.id &&
                                decorPreviewTheme?.name === t.name
                                  ? "border-gold-luxury scale-[1.01]"
                                  : "border-purple-royal/5"
                              }`}
                            >
                              <div className="h-32 w-full relative">
                                <img src={t.image} alt={t.name} className="w-full h-full object-cover" />
                              </div>
                              <div className="p-3">
                                <h4 className="font-extrabold text-[11px] text-purple-royal truncate">{t.name}</h4>
                                <p className="text-[9px] text-charcoal-dark/50 leading-relaxed truncate mt-0.5">
                                  {t.description}
                                </p>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}

                  {/* Vendors Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {contextVendors
                      .filter((v) => v.category === activeCategory)
                      .map((vdr) => (
                        <div
                          key={vdr.id}
                          className={`p-4 rounded-xl border bg-white/50 flex gap-3 transition-all hover:shadow-md ${
                            selectedVendors[activeCategory] === vdr.id
                              ? "border-gold-luxury shadow-md"
                              : "border-purple-royal/5"
                          }`}
                        >
                          <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-purple-royal/5 bg-white">
                            <img src={vdr.logo} alt={vdr.name} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1 space-y-1.5">
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-extrabold text-xs text-purple-royal">{vdr.name}</h4>
                                <span className="text-[9px] font-bold text-gold-dark uppercase tracking-widest">
                                  {"★".repeat(Math.round(vdr.rating))} ({vdr.completedWeddings} Events)
                                </span>
                              </div>
                              <span className="text-[10px] font-extrabold text-purple-royal bg-purple-royal/5 px-2 py-0.5 rounded border border-purple-royal/10">
                                Start: ₹{vdr.price.toLocaleString("en-IN")}
                              </span>
                            </div>
                            <p className="text-[9px] text-charcoal-dark/50 font-medium">
                              📍 {vdr.location}
                            </p>
                            <div className="flex gap-2 pt-1">
                              <GlassButton
                                type="button"
                                variant="secondary"
                                className="py-1 px-3 text-[9px]"
                                onClick={() => setViewingVendor(vdr)}
                              >
                                View Profile
                              </GlassButton>
                              <button
                                type="button"
                                onClick={() => handleSelectVendor(activeCategory, vdr.id)}
                                className={`py-1 px-3.5 rounded-lg text-[9px] font-bold uppercase transition-all ${
                                  selectedVendors[activeCategory] === vdr.id
                                    ? "bg-gold-luxury text-charcoal-dark"
                                    : "bg-purple-royal/5 text-purple-royal hover:bg-purple-royal/10"
                                }`}
                              >
                                {selectedVendors[activeCategory] === vdr.id ? "Selected" : "Select Vendor"}
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}

                    {/* Use Own Vendor card */}
                    <OwnVendorForm
                      category={activeCategory}
                      selected={selectedVendors[activeCategory] === "own"}
                      onSubmit={(details: any) => handleUseOwnVendor(activeCategory, details)}
                      onClear={() => handleRemoveVendor(activeCategory)}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 7: ADDITIONAL SERVICES */}
            {step === 7 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold uppercase tracking-wider text-purple-royal">
                    Power Backup Generator Setup
                  </h3>
                  <p className="text-[10px] text-charcoal-dark/40 font-semibold uppercase">
                    Configure power backup options for your event session
                  </p>
                </div>

                <div className="max-w-xl mx-auto w-full">
                  {/* Generator Selector */}
                  <div className="p-6 bg-white/50 border border-purple-royal/10 rounded-2xl space-y-4 shadow-sm">
                    <h4 className="text-xs font-bold text-purple-royal uppercase tracking-wider border-b border-purple-royal/5 pb-2">
                      Power Backup Setup
                    </h4>
                    <div className="space-y-4 text-xs">
                      <label className="flex items-center gap-2 cursor-pointer font-bold text-purple-royal uppercase text-[10px]">
                        <input
                          type="checkbox"
                          checked={ownGenerator}
                          onChange={(e) => setOwnGenerator(e.target.checked)}
                          className="accent-purple-royal"
                        />
                        I will bring my own Generator Set
                      </label>

                      {!ownGenerator ? (
                        <div className="space-y-3">
                          <p className="text-[10px] text-charcoal-dark/50 leading-relaxed">
                            Bhagyalaxmi Lawns provides premium generator rentals.
                            <br />
                            - **Day Event**: 25 kVA is recommended.
                            <br />
                            - **Night Event**: 75 kVA is required for heavy lighting loads.
                          </p>

                          <div className="grid grid-cols-2 gap-3">
                            <button
                              type="button"
                              onClick={() => setSelectedGenType("25 kVA")}
                              className={`py-3 rounded-xl text-xs font-bold border transition-all ${
                                selectedGenType === "25 kVA"
                                  ? "bg-purple-royal text-ivory-soft border-purple-royal"
                                  : "bg-white/40 border-purple-royal/10 text-charcoal-dark/70 hover:bg-white/60"
                              }`}
                            >
                              25 kVA Generator
                              <span className="block text-[8px] font-bold text-gold-luxury mt-0.5">₹7,000 Flat</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => setSelectedGenType("75 kVA")}
                              className={`py-3 rounded-xl text-xs font-bold border transition-all ${
                                selectedGenType === "75 kVA"
                                  ? "bg-purple-royal text-ivory-soft border-purple-royal"
                                  : "bg-white/40 border-purple-royal/10 text-charcoal-dark/70 hover:bg-white/60"
                              }`}
                            >
                              75 kVA Generator
                              <span className="block text-[8px] font-bold text-gold-luxury mt-0.5">₹15,000 Flat</span>
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="p-3 bg-gold-luxury/10 border border-gold-luxury/20 rounded-xl text-[10px] text-gold-dark font-bold">
                          ✓ Own Generator declared. Venue generator rental fee waived.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 8: LIVE QUOTE BUILDER VIEW FOR MOBILE / INLINE */}
            {step === 8 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold uppercase tracking-wider text-purple-royal">
                    Live Quotation Builder
                  </h3>
                  <p className="text-[10px] text-charcoal-dark/40 font-semibold uppercase">
                    Review pricing logs and breakdown before sending request
                  </p>
                </div>

                <div className="space-y-3 text-xs max-w-xl">
                  <div className="flex justify-between border-b border-purple-royal/5 pb-2 text-charcoal-dark/70">
                    <span className="font-semibold">Venue Base Booking ({selectedVenue})</span>
                    <span className="font-bold text-purple-royal">₹{venuePrice.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between border-b border-purple-royal/5 pb-2 text-charcoal-dark/70">
                    <span className="font-semibold">Catering Package ({selectedPackage} Package for {guestCount} Guests)</span>
                    <span className="font-bold text-purple-royal">₹{packageTotal.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between border-b border-purple-royal/5 pb-2 text-charcoal-dark/70">
                    <span className="font-semibold">Marketplace Vendor Services Total</span>
                    <span className="font-bold text-purple-royal">₹{vendorsTotal.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between border-b border-purple-royal/5 pb-2 text-charcoal-dark/70">
                    <span className="font-semibold">Additional Setup & Services</span>
                    <span className="font-bold text-purple-royal">₹{servicesTotal.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between border-b border-purple-royal/5 pb-2 text-charcoal-dark/70">
                    <span className="font-semibold">Generator Rental Backup ({ownGenerator ? "Own Generator" : `${selectedGenType}`})</span>
                    <span className="font-bold text-purple-royal">₹{generatorCost.toLocaleString("en-IN")}</span>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 9: FINAL REVIEW */}
            {step === 9 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold uppercase tracking-wider text-purple-royal border-b border-purple-royal/10 pb-2">
                    Review Wedding Itinerary
                  </h3>
                  <p className="text-[10px] text-charcoal-dark/40 font-semibold uppercase mt-1">
                    Finalize information and sign request
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs leading-relaxed">
                  <div className="space-y-3 bg-white/30 p-4 rounded-xl border border-purple-royal/5">
                    <h4 className="font-extrabold text-purple-royal text-xs uppercase">Event Details</h4>
                    <p>Venue: <strong className="font-bold text-purple-royal">{selectedVenue}</strong></p>
                    <p>Date: <strong className="font-bold text-purple-royal">{eventDate} ({eventSession} Session)</strong></p>
                    <p>Estimated Guests: <strong className="font-bold text-purple-royal">{guestCount} Guests</strong></p>
                    <p>Event Type: <strong className="font-bold text-purple-royal">{eventType} Ceremony</strong></p>
                    <p>Catering Menu: <strong className="font-bold text-purple-royal">{selectedPackage} Package (Pure Veg)</strong></p>
                  </div>

                  <div className="space-y-3 bg-white/30 p-4 rounded-xl border border-purple-royal/5">
                    <h4 className="font-extrabold text-purple-royal text-xs uppercase">Vendors Selection</h4>
                    <p>Decoration: <strong className="font-bold text-purple-royal">
                      {selectedVendors["Decoration"] === "own" ? "Own Florist (Pending Approval)" : selectedVendors["Decoration"] ? "Ahilya Florists & Decorators" : "Not Chosen"}
                    </strong></p>
                    <p>Catering: <strong className="font-bold text-purple-royal">
                      {selectedVendors["Food Catering"] === "own" ? "Own Chef (Pending Approval)" : selectedVendors["Food Catering"] ? "Bhagyalaxmi Pure Veg Caterers" : "Not Chosen"}
                    </strong></p>
                    <p>Photography: <strong className="font-bold text-purple-royal">
                      {selectedVendors["Photography"] === "own" ? "Own Studio (Pending Approval)" : selectedVendors["Photography"] ? "Ahilya Wedding Studio" : "Not Chosen"}
                    </strong></p>
                    <p>Power Backup: <strong className="font-bold text-purple-royal">{ownGenerator ? "Client Own Genset" : `${selectedGenType} Generator Rental`}</strong></p>
                  </div>
                </div>

                <div className="pt-2">
                  <label className="flex items-start gap-2.5 cursor-pointer text-[10px] text-charcoal-dark/60 font-semibold select-none">
                    <input type="checkbox" defaultChecked className="mt-0.5 accent-purple-royal" required />
                    <span>I verify the pricing breakdown and understand that own vendors require administrative approval prior to gate entry confirmation.</span>
                  </label>
                </div>
              </div>
            )}

            {/* STEP 10: SUCCESS SCREEN */}
            {step === 10 && (
              <div className="text-center py-12 space-y-6">
                <div className="w-20 h-20 rounded-full bg-emerald-500/10 border-2 border-emerald-500 text-emerald-600 flex items-center justify-center mx-auto text-4xl shadow-xl animate-bounce">
                  ✓
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-extrabold text-purple-royal tracking-tight">Booking Request Submitted!</h3>
                  <p className="text-xs text-charcoal-dark/50 max-w-md mx-auto leading-relaxed">
                    Namaskar! Your luxury event proposal has been received. Our site coordinator is verifying date slots and custom vendor approvals.
                  </p>
                </div>
                <div className="flex justify-center gap-3">
                  <GlassButton variant="gold" onClick={() => setActiveView("dashboard")}>
                    Go to Client Dashboard
                  </GlassButton>
                </div>
              </div>
            )}

            {/* Step Navigation buttons */}
            {step < 10 && (
              <div className="flex justify-between mt-8 border-t border-purple-royal/10 pt-4">
                {step > 1 ? (
                  <GlassButton type="button" variant="secondary" onClick={handlePrev}>
                    <ChevronLeft size={16} /> Back
                  </GlassButton>
                ) : (
                  <div />
                )}
                <GlassButton type="button" variant="gold" onClick={handleNext}>
                  {step === 9 ? "Submit Request" : "Continue"} <ChevronRight size={16} />
                </GlassButton>
              </div>
            )}
          </GlassCard>
        </div>

        {/* STEP 8: LIVE STICKY QUOTE BUILDER */}
        {step < 10 && (
          <GlassCard className="sticky top-32 p-6 border-white/60 bg-white/45 shadow-xl space-y-5">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-purple-royal border-b border-purple-royal/10 pb-2 flex items-center gap-1.5">
              <Sparkles className="text-gold-luxury w-4.5 h-4.5 animate-pulse" /> Live Quote Summary
            </h4>

            <div className="space-y-3.5 text-xs">
              <div className="flex justify-between">
                <span className="text-charcoal-dark/50 font-bold">Venue:</span>
                <span className="font-extrabold text-purple-royal truncate max-w-[140px]">
                  {selectedVenue}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-charcoal-dark/50 font-bold">Date:</span>
                <span className="font-extrabold text-purple-royal">
                  {eventDate ? eventDate : "Select date"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-charcoal-dark/50 font-bold">Guests:</span>
                <span className="font-extrabold text-purple-royal">{guestCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-charcoal-dark/50 font-bold">Menu:</span>
                <span className="font-extrabold text-purple-royal">{selectedPackage} (Veg)</span>
              </div>

              <div className="border-t border-purple-royal/10 pt-4 mt-2 space-y-2.5">
                <div className="flex justify-between text-[11px] font-semibold">
                  <span className="text-charcoal-dark/50 uppercase">Venue Charge</span>
                  <span className="font-bold text-purple-royal">₹{venuePrice.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between text-[11px] font-semibold">
                  <span className="text-charcoal-dark/50 uppercase">Catering ({guestCount} plates)</span>
                  <span className="font-bold text-purple-royal">₹{packageTotal.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between text-[11px] font-semibold">
                  <span className="text-charcoal-dark/50 uppercase">Vendors</span>
                  <span className="font-bold text-purple-royal">₹{vendorsTotal.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between text-[11px] font-semibold">
                  <span className="text-charcoal-dark/50 uppercase">Amenities & Services</span>
                  <span className="font-bold text-purple-royal">₹{servicesTotal.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between text-[11px] font-semibold">
                  <span className="text-charcoal-dark/50 uppercase">Backup Power Generator</span>
                  <span className="font-bold text-purple-royal">₹{generatorCost.toLocaleString("en-IN")}</span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-[11px] font-bold text-emerald-600">
                    <span>DISCOUNT</span>
                    <span>- ₹{discountAmount.toLocaleString("en-IN")}</span>
                  </div>
                )}

                <div className="flex justify-between text-[11px] font-semibold text-charcoal-dark/45 border-t border-dashed border-purple-royal/10 pt-2">
                  <span>CGST (9%)</span>
                  <span>₹{cgstAmount.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between text-[11px] font-semibold text-charcoal-dark/45">
                  <span>SGST (9%)</span>
                  <span>₹{sgstAmount.toLocaleString("en-IN")}</span>
                </div>

                <div className="flex justify-between border-t border-purple-royal/15 pt-3 text-sm">
                  <span className="font-extrabold text-gold-dark uppercase tracking-wide">Grand Total</span>
                  <span className="font-black text-gold-dark text-base">₹{totalAmount.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between text-[10px] font-bold text-purple-royal uppercase bg-purple-royal/5 p-2 rounded border border-purple-royal/10">
                  <span>Advance (20%)</span>
                  <span>₹{advanceRequired.toLocaleString("en-IN")}</span>
                </div>
              </div>
            </div>
          </GlassCard>
        )}
      </div>

      {/* --- VENDOR DETAIL PROFILE MODAL --- */}
      {viewingVendor && (
        <GlassModal
          isOpen={!!viewingVendor}
          onClose={() => setViewingVendor(null)}
          title={`${viewingVendor.name} - Profile`}
        >
          <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2 text-xs">
            <div className="h-48 w-full rounded-xl overflow-hidden border border-purple-royal/10 relative">
              <img src={viewingVendor.coverImage} alt={viewingVendor.name} className="w-full h-full object-cover" />
              <div className="absolute bottom-4 left-4 flex gap-3 items-end">
                <div className="w-16 h-16 rounded-xl border border-white overflow-hidden bg-white shadow-md">
                  <img src={viewingVendor.logo} alt={viewingVendor.name} className="w-full h-full object-cover" />
                </div>
                <div className="text-white text-shadow-md pb-1 space-y-0.5">
                  <h4 className="font-bold text-sm leading-none">{viewingVendor.name}</h4>
                  <p className="text-[10px] font-medium opacity-90">{viewingVendor.category} • {viewingVendor.location}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h5 className="font-bold text-purple-royal uppercase tracking-wider mb-1.5">Gallery & Portfolio</h5>
                <div className="grid grid-cols-3 gap-2">
                  {viewingVendor.gallery.map((img, i) => (
                    <div key={i} className="h-20 rounded-lg overflow-hidden border border-purple-royal/5">
                      <img src={img} alt="portfolio" className="w-full h-full object-cover hover:scale-105 transition animate-pulse-slow" />
                    </div>
                  ))}
                </div>
              </div>

              {viewingVendor.category === "Food Catering" && viewingVendor.menuItems && (
                <div>
                  <h5 className="font-bold text-purple-royal uppercase tracking-wider mb-1.5">Pure Vegetarian Specialty Menu</h5>
                  <div className="grid grid-cols-2 gap-2 bg-purple-royal/5 p-3 rounded-xl border border-purple-royal/10">
                    {viewingVendor.menuItems.map((item, i) => (
                      <div key={i} className="space-y-0.5">
                        <p className="font-bold text-purple-royal text-[10px]">{item.name}</p>
                        <p className="text-[9px] text-charcoal-dark/50 font-medium">{item.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {viewingVendor.category === "Photography" && viewingVendor.photographyPortfolio && (
                <div>
                  <h5 className="font-bold text-purple-royal uppercase tracking-wider mb-1.5">Recent Albums</h5>
                  <div className="grid grid-cols-2 gap-2">
                    {viewingVendor.photographyPortfolio.map((item, i) => (
                      <div key={i} className="rounded-lg overflow-hidden border border-purple-royal/5 relative h-24">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/75 to-transparent flex items-end p-2">
                          <span className="text-white font-bold text-[9px] truncate">{item.name}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-between items-center bg-purple-royal/5 p-4 rounded-xl border border-purple-royal/10 mt-6">
                <div>
                  <p className="text-[10px] text-charcoal-dark/50">Starting package price:</p>
                  <p className="font-extrabold text-gold-dark text-sm">₹{viewingVendor.price.toLocaleString("en-IN")}</p>
                </div>
                <div className="flex gap-2">
                  {viewingVendor.whatsapp && (
                    <a
                      href={viewingVendor.whatsapp}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-2 border border-emerald-500/30 bg-emerald-500/10 text-emerald-700 font-extrabold rounded-lg hover:bg-emerald-500/20 text-[10px] uppercase flex items-center gap-1 cursor-pointer"
                    >
                      <SunIcon size={12} /> WhatsApp
                    </a>
                  )}
                  <GlassButton
                    variant="gold"
                    className="py-2 text-[10px] uppercase"
                    onClick={() => {
                      handleSelectVendor(viewingVendor.category, viewingVendor.id);
                      setViewingVendor(null);
                    }}
                  >
                    Book This Vendor
                  </GlassButton>
                </div>
              </div>
            </div>
          </div>
        </GlassModal>
      )}
    </div>
  );
};

// --- SUB-COMPONENT: OWN VENDOR FORM ---
interface OwnVendorFormProps {
  category: string;
  selected: boolean;
  onSubmit: (details: any) => void;
  onClear: () => void;
}

const OwnVendorForm: React.FC<OwnVendorFormProps> = ({
  category,
  selected,
  onSubmit,
  onClear,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [gst, setGst] = useState("");
  const [notes, setNotes] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ name, phone, email, gst, notes });
    setIsOpen(false);
  };

  return (
    <>
      <div
        onClick={() => {
          if (selected) {
            onClear();
          } else {
            setIsOpen(true);
          }
        }}
        className={`p-4 rounded-xl border bg-white/40 flex items-center justify-center text-center cursor-pointer transition-all hover:shadow-md h-32 ${
          selected
            ? "border-amber-500 bg-amber-500/10 text-amber-700"
            : "border-dashed border-purple-royal/20 text-purple-royal/60 hover:border-gold-luxury"
        }`}
      >
        <div className="space-y-1">
          {selected ? (
            <>
              <CheckCircle className="mx-auto w-7 h-7 text-amber-600 mb-1" />
              <p className="font-extrabold text-[11px] uppercase">Using Custom Vendor</p>
              <p className="text-[9px] font-bold text-amber-700/80">Click to Clear Selection</p>
            </>
          ) : (
            <>
              <Plus className="mx-auto w-7 h-7 text-purple-royal/50 mb-1" />
              <p className="font-extrabold text-[11px] uppercase">Use My Own Vendor</p>
              <p className="text-[9px] font-bold text-charcoal-dark/30">External vendor registration</p>
            </>
          )}
        </div>
      </div>

      {isOpen && (
        <GlassModal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          title={`Register Custom ${category} Vendor`}
        >
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <p className="text-[10px] text-amber-700 bg-amber-500/10 border border-amber-500/25 p-3 rounded-lg leading-normal font-bold uppercase">
              ⚠️ Custom external vendors are subject to site administrative safety audit and approval.
            </p>

            <GlassInput
              label="Vendor Company Name"
              placeholder="e.g. Pune Sounds & Lights"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <div className="grid grid-cols-2 gap-3">
              <GlassInput
                label="WhatsApp / Phone"
                placeholder="+91 XXXXX XXXXX"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
              <GlassInput
                label="Email"
                type="email"
                placeholder="vendor@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <GlassInput
              label="Vendor GSTIN (Optional)"
              placeholder="27AAAAA1111A1Z1"
              value={gst}
              onChange={(e) => setGst(e.target.value)}
            />
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-purple-royal uppercase tracking-wider">
                Special Delivery Notes
              </label>
              <textarea
                placeholder="Enter power requirements or unloading instructions..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="glass-input px-3.5 py-2.5 rounded-xl border focus:outline-none bg-white/40 border-purple-royal/10 h-20 text-[11px]"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-purple-royal/5">
              <GlassButton type="button" variant="secondary" onClick={() => setIsOpen(false)}>
                Cancel
              </GlassButton>
              <GlassButton type="submit" variant="gold">
                Save Vendor
              </GlassButton>
            </div>
          </form>
        </GlassModal>
      )}
    </>
  );
};

// Helper simple icon wrappers
function SunIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2" />
      <path d="M12 20v2" />
      <path d="m4.93 4.93 1.41 1.41" />
      <path d="m17.66 17.66 1.41 1.41" />
      <path d="M2 12h2" />
      <path d="M20 12h2" />
      <path d="m6.34 17.66-1.41 1.41" />
      <path d="m19.07 4.93-1.41 1.41" />
    </svg>
  );
}

function MoonIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
    </svg>
  );
}

export default BookingPageView;
