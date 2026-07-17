"use client";

import React, { useState } from "react";
import {
  Store,
  Users,
  Plus,
  Edit,
  Trash,
  Phone,
  Mail,
  Filter,
  DollarSign,
  TrendingUp,
  Award,
} from "lucide-react";
import { useERP, Vendor } from "@/context/ERPContext";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlassButton } from "@/components/ui/GlassButton";

const Instagram: React.FC<any> = ({ size = 24, className = "" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);
import { GlassInput } from "@/components/ui/GlassInput";
import { GlassSelect } from "@/components/ui/GlassSelect";
import { GlassModal } from "@/components/ui/GlassModal";

export const VendorManagementView: React.FC = () => {
  const { vendors, addVendor, updateVendor, configSettings } = useERP();

  const [activeCategoryFilter, setActiveCategoryFilter] = useState("all");
  const [editingVendor, setEditingVendor] = useState<Vendor | null>(null);
  const [isAddingVendor, setIsAddingVendor] = useState(false);

  // Form Fields
  const [formName, setFormName] = useState("");
  const [formCategory, setFormCategory] = useState("Decoration");
  const [formLogo, setFormLogo] = useState("");
  const [formCover, setFormCover] = useState("");
  const [formPrice, setFormPrice] = useState(0);
  const [formLocation, setFormLocation] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formInsta, setFormInsta] = useState("");
  const [formWhatsApp, setFormWhatsApp] = useState("");
  const [formCommission, setFormCommission] = useState(10);
  const [formFeatured, setFormFeatured] = useState(false);

  const filteredVendors = vendors.filter((v) => {
    return activeCategoryFilter === "all" || v.category === activeCategoryFilter;
  });

  const getCategoryOptions = () => {
    return configSettings.vendorCategories.map((cat) => ({
      value: cat,
      label: cat,
    }));
  };

  const handleOpenAdd = () => {
    setFormName("");
    setFormCategory("Decoration");
    setFormLogo("https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&q=80&w=200");
    setFormCover("https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=600");
    setFormPrice(15000);
    setFormLocation("Ahilyanagar, Maharashtra");
    setFormPhone("");
    setFormEmail("");
    setFormInsta("");
    setFormWhatsApp("");
    setFormCommission(10);
    setFormFeatured(false);
    setIsAddingVendor(true);
  };

  const handleOpenEdit = (v: Vendor) => {
    setEditingVendor(v);
    setFormName(v.name);
    setFormCategory(v.category);
    setFormLogo(v.logo);
    setFormCover(v.coverImage);
    setFormPrice(v.price);
    setFormLocation(v.location);
    setFormPhone(v.phone);
    setFormEmail(v.email);
    setFormInsta(v.instagram || "");
    setFormWhatsApp(v.whatsapp || "");
    setFormCommission(v.commissionPercentage);
    setFormFeatured(v.featured);
  };

  const handleSaveAdd = (e: React.FormEvent) => {
    e.preventDefault();

    addVendor({
      name: formName,
      category: formCategory,
      logo: formLogo,
      coverImage: formCover,
      price: formPrice,
      location: formLocation,
      phone: formPhone,
      email: formEmail,
      instagram: formInsta,
      whatsapp: formWhatsApp,
      commissionPercentage: formCommission,
      featured: formFeatured,
      rating: 4.8,
      completedWeddings: 0,
      availability: [],
      gallery: [
        "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=600",
        "https://images.unsplash.com/photo-1519225495810-7512c696505a?auto=format&fit=crop&q=80&w=600"
      ]
    });

    setIsAddingVendor(false);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingVendor) return;

    updateVendor(editingVendor.id, {
      name: formName,
      category: formCategory,
      logo: formLogo,
      coverImage: formCover,
      price: formPrice,
      location: formLocation,
      phone: formPhone,
      email: formEmail,
      instagram: formInsta,
      whatsapp: formWhatsApp,
      commissionPercentage: formCommission,
      featured: formFeatured,
    });

    setEditingVendor(null);
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in select-none">
      {/* Title & Filters */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-purple-royal leading-none">
            Vendor Directory
          </h2>
          <p className="text-xs text-charcoal-dark/50 mt-1.5 font-medium uppercase tracking-wide">
            Manage partner vendor commissions, details, and marketplace items
          </p>
        </div>

        <div className="flex items-center gap-3">
          <GlassButton variant="gold" onClick={handleOpenAdd} className="py-2.5">
            <Plus size={16} /> Add Partner Vendor
          </GlassButton>
        </div>
      </div>

      {/* Category filters */}
      <div className="flex gap-2 overflow-x-auto pb-1 max-w-full">
        <button
          onClick={() => setActiveCategoryFilter("all")}
          className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase border transition-all ${
            activeCategoryFilter === "all"
              ? "bg-purple-royal text-ivory-soft border-purple-royal"
              : "bg-white/40 border-purple-royal/10 text-charcoal-dark/60 hover:bg-white/70"
          }`}
        >
          All Categories
        </button>
        {configSettings.vendorCategories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategoryFilter(cat)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase border transition-all shrink-0 ${
              activeCategoryFilter === cat
                ? "bg-purple-royal text-ivory-soft border-purple-royal"
                : "bg-white/40 border-purple-royal/10 text-charcoal-dark/60 hover:bg-white/70"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Vendors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVendors.length === 0 ? (
          <GlassCard className="col-span-full text-center py-16">
            <p className="text-sm font-bold text-charcoal-dark/40">No partner vendors found in this category.</p>
          </GlassCard>
        ) : (
          filteredVendors.map((vdr) => (
            <GlassCard
              key={vdr.id}
              className="flex flex-col justify-between h-[360px] relative border-white/60 bg-white/40 hover:border-gold-luxury/30"
            >
              <div>
                {/* Header info */}
                <div className="flex gap-4 items-start">
                  <div className="w-16 h-16 rounded-2xl border border-purple-royal/10 overflow-hidden bg-white shrink-0 shadow-sm">
                    <img src={vdr.logo} alt={vdr.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="space-y-1 overflow-hidden">
                    <span className="px-2 py-0.5 rounded text-[8px] font-extrabold uppercase border bg-purple-royal/10 text-purple-royal border-purple-royal/20">
                      {vdr.category}
                    </span>
                    {vdr.featured && (
                      <span className="ml-1.5 px-2 py-0.5 rounded text-[8px] font-extrabold uppercase border bg-gold-luxury/10 text-gold-dark border-gold-luxury/20">
                        Featured
                      </span>
                    )}
                    <h3 className="font-extrabold text-sm text-purple-royal leading-tight truncate pr-2 mt-1">
                      {vdr.name}
                    </h3>
                    <p className="text-[10px] text-charcoal-dark/40 font-semibold uppercase tracking-wider">
                      📍 {vdr.location}
                    </p>
                  </div>
                </div>

                {/* Details list */}
                <div className="my-4 pt-3 border-t border-purple-royal/5 space-y-2 text-xs">
                  <div className="flex justify-between font-semibold">
                    <span className="text-charcoal-dark/50">Base Packages:</span>
                    <span className="text-purple-royal font-bold">Start ₹{vdr.price.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between font-semibold">
                    <span className="text-charcoal-dark/50">Commission Rate:</span>
                    <span className="text-gold-dark font-extrabold">{vdr.commissionPercentage}% Paid</span>
                  </div>
                  <div className="flex justify-between font-semibold">
                    <span className="text-charcoal-dark/50">Completed Weddings:</span>
                    <span className="font-bold">{vdr.completedWeddings} Events</span>
                  </div>
                </div>
              </div>

              {/* Social and contacts footer */}
              <div className="border-t border-purple-royal/5 pt-3 flex flex-col gap-3">
                <div className="flex items-center gap-4 text-xs font-semibold text-charcoal-dark/60">
                  <div className="flex items-center gap-1"><Phone size={14} className="text-gold-luxury" /> {vdr.phone}</div>
                  <div className="flex items-center gap-1"><Instagram size={14} className="text-gold-luxury" /> {vdr.instagram ? "@handle" : "No link"}</div>
                </div>

                <div className="flex gap-2">
                  <GlassButton
                    variant="secondary"
                    className="flex-1 py-2 text-xs"
                    onClick={() => handleOpenEdit(vdr)}
                  >
                    <Edit size={14} /> Edit Partner
                  </GlassButton>
                </div>
              </div>
            </GlassCard>
          ))
        )}
      </div>

      {/* --- ADD / EDIT VENDOR MODAL --- */}
      {(isAddingVendor || !!editingVendor) && (
        <GlassModal
          isOpen={isAddingVendor || !!editingVendor}
          onClose={() => {
            setIsAddingVendor(false);
            setEditingVendor(null);
          }}
          title={isAddingVendor ? "Add Partner Vendor" : "Edit Partner Vendor"}
        >
          <form onSubmit={isAddingVendor ? handleSaveAdd : handleSaveEdit} className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <GlassInput
                label="Vendor Company Name"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                required
              />
              <GlassSelect
                label="Vendor Category"
                options={getCategoryOptions()}
                value={formCategory}
                onChange={(e) => setFormCategory(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <GlassInput
                label="Company Logo URL"
                value={formLogo}
                onChange={(e) => setFormLogo(e.target.value)}
                required
              />
              <GlassInput
                label="Cover Image URL"
                value={formCover}
                onChange={(e) => setFormCover(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <GlassInput
                label="Starting Price (₹)"
                type="number"
                value={formPrice}
                onChange={(e) => setFormPrice(Number(e.target.value))}
                required
              />
              <GlassInput
                label="Location Address"
                value={formLocation}
                onChange={(e) => setFormLocation(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <GlassInput
                label="WhatsApp / Phone"
                value={formPhone}
                onChange={(e) => setFormPhone(e.target.value)}
                required
              />
              <GlassInput
                label="Email"
                type="email"
                value={formEmail}
                onChange={(e) => setFormEmail(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <GlassInput
                label="Instagram URL (Optional)"
                value={formInsta}
                onChange={(e) => setFormInsta(e.target.value)}
              />
              <GlassInput
                label="WhatsApp URL (Optional)"
                value={formWhatsApp}
                onChange={(e) => setFormWhatsApp(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-3 items-end">
              <GlassInput
                label="Commission Percentage (%)"
                type="number"
                value={formCommission}
                onChange={(e) => setFormCommission(Number(e.target.value))}
                required
              />
              <label className="flex items-center gap-2 cursor-pointer font-bold text-purple-royal uppercase text-[10px] pb-3 select-none">
                <input
                  type="checkbox"
                  checked={formFeatured}
                  onChange={(e) => setFormFeatured(e.target.checked)}
                  className="accent-purple-royal"
                />
                Feature in Marketplace
              </label>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-purple-royal/5 mt-4">
              <GlassButton
                type="button"
                variant="secondary"
                onClick={() => {
                  setIsAddingVendor(false);
                  setEditingVendor(null);
                }}
              >
                Cancel
              </GlassButton>
              <GlassButton type="submit" variant="gold">
                Save Partner
              </GlassButton>
            </div>
          </form>
        </GlassModal>
      )}
    </div>
  );
};

export default VendorManagementView;
