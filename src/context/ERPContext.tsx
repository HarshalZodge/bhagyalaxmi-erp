"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { createClient, isSupabaseConfigured } from "@/utils/supabase/client";

// --- TYPES ---

export type BookingType = "Wedding" | "Reception" | "Corporate" | "Birthday" | "Maintenance";
export type BookingStatus = "Confirmed" | "Pending Payment" | "Completed" | "Cancelled";
export type UserRole = "Super Admin" | "Owner" | "Manager" | "Accountant" | "Staff" | "Client";

export interface Booking {
  id: string;
  customerName: string;
  customerPhoto: string;
  venueName: string;
  bookingType: BookingType;
  bookingDate: string; // YYYY-MM-DD
  guestCount: number;
  amount: number;
  status: BookingStatus;
  progress: number; // 0-100% completion of checklist
  packageSelected: string;
  phoneNumber: string;
  email: string;
}

export type BookingRequestStatus = "Pending" | "Reviewing" | "Needs Changes" | "Approved" | "Rejected";

export interface BookingRequest {
  id: string;
  customerName: string;
  phoneNumber: string;
  email: string;
  venue: "Wedding Hall" | "Hall + Lawn";
  eventType: string;
  eventDate: string;
  eventSession: "Day" | "Night";
  guests: number; // single field: Estimated Guest Count
  packageSelected: string;
  vendors: Record<string, {
    type: "system" | "own";
    vendorId?: string;
    name?: string;
    phone?: string;
    email?: string;
    gst?: string;
    notes?: string;
    status?: "Pending Approval" | "Approved" | "Rejected";
  }>;
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
  status: BookingRequestStatus;
  createdAt: string;
}

export interface Vendor {
  id: string;
  name: string;
  logo: string;
  coverImage: string;
  gallery: string[];
  videos?: string[];
  category: string;
  price: number; // Starting price
  packages?: { name: string; price: number; description: string }[];
  reviews?: { reviewer: string; rating: number; comment: string; date: string }[];
  rating: number; // e.g. 4.8
  completedWeddings: number;
  location: string;
  instagram?: string;
  whatsapp?: string;
  phone: string;
  email: string;
  commissionPercentage: number;
  featured: boolean;
  availability: string[]; // YYYY-MM-DD that are booked
  themes?: { name: string; image: string; description: string }[]; // For Decoration
  menuItems?: { name: string; category: string; description: string }[]; // For Catering
  photographyPortfolio?: { name: string; image: string }[]; // For Photography
}

export interface ERPConfig {
  hallPrice: number;
  hallLawnPrice: number;
  generatorCostPerHour: number;
  electricityCostPerUnit: number;
  gstPercentage: number;
  discountDefault: number;
  invoiceTemplate: string;
  vendorCategories: string[];
  packageTemplates: { name: string; pricePerGuest: number; decorationLevel: string; lighting: string; stage: string; flowerWork: string; bridalRoom: string; description: string }[];
}

export interface CustomerNote {
  id: string;
  date: string;
  text: string;
}

export interface WhatsAppMessage {
  id: string;
  sender: "owner" | "customer";
  text: string;
  timestamp: string;
  mediaUrl?: string;
}

export interface Customer {
  id: string;
  name: string;
  photo: string;
  phone: string;
  email: string;
  address: string;
  totalSpent: number;
  bookingCount: number;
  notes: CustomerNote[];
  whatsappHistory: WhatsAppMessage[];
}

export interface Invoice {
  id: string;
  invoiceNo: string;
  clientName: string;
  date: string;
  bookingId?: string;
  bookingType: BookingType;
  taxableAmount: number;
  cgst: number; // 9%
  sgst: number; // 9%
  totalAmount: number;
  status: "Paid" | "Unpaid" | "Overdue";
}

export interface Expense {
  id: string;
  category: string;
  amount: number;
  description: string;
  date: string;
  payee: string;
}

export interface GeneratorLog {
  id: string;
  date: string;
  dieselAddedLitres: number;
  costPerLitre: number;
  totalCost: number;
  runHoursAdded: number;
  fuelLevelAfter: number; // %
  loggedBy: string;
}

export type TaskStatus = "Todo" | "In Progress" | "Completed";
export type TaskPriority = "Low" | "Medium" | "High";

export interface KanbanTask {
  id: string;
  title: string;
  category: string;
  description: string;
  assignee: string;
  status: TaskStatus;
  priority: TaskPriority;
  date: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  ipAddress: string;
  status: "Success" | "Failed";
}

export interface SystemHealth {
  cpu: number;
  memory: number;
  disk: number;
  apiLatency: number;
}

export interface UserSession {
  email: string;
  name: string;
  avatar: string;
  role: UserRole;
}

// Weather Module Interfaces
export interface CurrentWeather {
  temp: number;
  humidity: number;
  windSpeed: number;
  cloudCover: number;
  uvIndex: number;
  sunrise: string;
  sunset: string;
  rainProb: number;
  condition: string;
  weatherCode: number;
}

export interface ForecastDay {
  date: string;
  tempMax: number;
  tempMin: number;
  weatherCode: number;
  rainProb: number;
  condition: string;
}

export interface WeatherData {
  current: CurrentWeather;
  forecast: ForecastDay[];
}

interface ERPContextType {
  bookings: Booking[];
  customers: Customer[];
  invoices: Invoice[];
  expenses: Expense[];
  generatorLogs: GeneratorLog[];
  generatorFuelLevel: number;
  generatorRuntimeHours: number;
  kanbanTasks: KanbanTask[];
  auditLogs: AuditLog[];
  systemHealth: SystemHealth;
  dbSyncInProgress: boolean;
  lastSyncTime: string;
  
  // New States
  bookingRequests: BookingRequest[];
  vendors: Vendor[];
  configSettings: ERPConfig;
  
  // Auth State
  user: UserSession | null;
  authLoading: boolean;
  loginWithGoogle: (portal: "client" | "admin") => Promise<void>;
  sendOTP: (email: string, portal: "client" | "admin") => Promise<{ success: boolean; code?: string; message?: string }>;
  verifyOTP: (email: string, code: string, portal: "client" | "admin") => Promise<boolean>;
  logout: () => void;
  hasPermission: (action: string) => boolean;

  // Weather State
  weatherData: WeatherData | null;
  weatherLoading: boolean;
  refreshWeather: () => void;

  // Methods
  addBooking: (booking: Omit<Booking, "id" | "progress">) => Booking;
  updateBookingStatus: (id: string, status: BookingStatus) => void;
  updateBookingDate: (id: string, date: string) => void;
  addCustomerNote: (customerId: string, noteText: string) => void;
  sendWhatsAppMessage: (customerId: string, text: string) => void;
  addGeneratorLog: (dieselLitres: number, costPerLitre: number, runHours: number) => void;
  updateTaskStatus: (taskId: string, status: TaskStatus) => void;
  addNewTask: (task: Omit<KanbanTask, "id" | "date">) => void;
  addExpense: (expense: Omit<Expense, "id" | "date">) => void;
  syncDatabase: () => void;
  activeView: string;
  setActiveView: (view: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  
  // New Methods
  addBookingRequest: (request: Omit<BookingRequest, "id" | "createdAt" | "status">) => BookingRequest;
  updateBookingRequestStatus: (id: string, status: BookingRequestStatus) => void;
  updateBookingRequest: (id: string, request: Partial<BookingRequest>) => void;
  convertRequestToBooking: (id: string) => void;
  addVendor: (vendor: Omit<Vendor, "id">) => void;
  updateVendor: (id: string, vendor: Partial<Vendor>) => void;
  updateConfigSettings: (settings: Partial<ERPConfig>) => void;
  clearAllDatabaseData: () => Promise<void>;
  dbError: string | null;
}

const ERPContext = createContext<ERPContextType | undefined>(undefined);

export const ERPProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeView, setActiveView] = useState("dashboard");
  const [searchQuery, setSearchQuery] = useState("");
  const [dbSyncInProgress, setDbSyncInProgress] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState("Just Now");
  
  // Auth state
  const [user, setUser] = useState<UserSession | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Weather state
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [weatherLoading, setWeatherLoading] = useState(true);

  // State variables for core entities
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [generatorLogs, setGeneratorLogs] = useState<GeneratorLog[]>([]);
  const [generatorFuelLevel, setGeneratorFuelLevel] = useState(72);
  const [generatorRuntimeHours, setGeneratorRuntimeHours] = useState(482.5);
  const [kanbanTasks, setKanbanTasks] = useState<KanbanTask[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [bookingRequests, setBookingRequests] = useState<BookingRequest[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [configSettings, setConfigSettings] = useState<ERPConfig>({
    hallPrice: 90000,
    hallLawnPrice: 130000,
    generatorCostPerHour: 2500,
    electricityCostPerUnit: 12,
    gstPercentage: 18,
    discountDefault: 0,
    invoiceTemplate: "Luxury Royal Theme",
    vendorCategories: [
      "Decoration", "Food Catering", "Photography", "Videography", "DJ", 
      "Lighting", "Security", "Generator", "Cleaning", "Welcome Band", 
      "Pandit", "Luxury Cars", "Horse Entry", "Makeup Artist", 
      "Invitation Cards", "Live Counter", "Cake"
    ],
    packageTemplates: [
      { name: "Silver", pricePerGuest: 180, decorationLevel: "Basic", lighting: "Standard", stage: "Basic Layout", flowerWork: "Minimal Marigold", bridalRoom: "Non-AC Standard", description: "Essential package for intimate gatherings" },
      { name: "Gold", pricePerGuest: 300, decorationLevel: "Premium", lighting: "Ambiance LED", stage: "Grand Backdrop", flowerWork: "Marigold Arches + Roses", bridalRoom: "Centrally AC", description: "Elegant features with enhanced decorations" },
      { name: "Royal", pricePerGuest: 450, decorationLevel: "Luxury Theme", lighting: "Intelligent moving heads", stage: "Maharajah Theme Stage", flowerWork: "Exotic Orchids & Lilies", bridalRoom: "AC Suite with Lounge", description: "Royal theme setting for grand Indian weddings" },
      { name: "Luxury", pricePerGuest: 650, decorationLevel: "Ultra Luxury Custom", lighting: "Laser and spotlight grids", stage: "Royal Palace Replica", flowerWork: "Imported Carnations & Orchids", bridalRoom: "VIP Suite + Extra Guest Rooms", description: "The ultimate luxury statement with custom layouts" }
    ]
  });
  const [systemHealth, setSystemHealth] = useState<SystemHealth>({
    cpu: 18,
    memory: 42,
    disk: 55,
    apiLatency: 12,
  });

  const supabase = createClient();
  const [dbError, setDbError] = useState<string | null>(null);

  const setAuthCookies = (email: string, role: string) => {
    document.cookie = `bl_auth_email=${email}; path=/; max-age=86400; SameSite=Lax`;
    document.cookie = `bl_auth_role=${role}; path=/; max-age=86400; SameSite=Lax`;
  };

  const clearAuthCookies = () => {
    document.cookie = "bl_auth_email=; path=/; max-age=0; SameSite=Lax";
    document.cookie = "bl_auth_role=; path=/; max-age=0; SameSite=Lax";
  };

  // Weather WMO Code parser
  const getWeatherCondition = (code: number): string => {
    if (code === 0) return "Clear Sky";
    if ([1, 2, 3].includes(code)) return "Partly Cloudy";
    if ([45, 48].includes(code)) return "Foggy Weather";
    if ([51, 53, 55].includes(code)) return "Light Drizzle";
    if ([61, 63, 65].includes(code)) return "Monsoon Rain";
    if ([80, 81, 82].includes(code)) return "Rain Showers";
    if ([95, 96, 99].includes(code)) return "Thunderstorm";
    return "Overcast";
  };

  // Weather Intelligence Live Fetching (Open-Meteo API)
  const fetchWeather = async () => {
    setWeatherLoading(true);
    try {
      // Coordinates for Bhingar, Ahilyanagar (Ahmednagar)
      const lat = 19.11;
      const lon = 74.76;
      
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code,cloud_cover,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max,precipitation_probability_max&timezone=Asia%2FKolkata`
      );
      
      if (!response.ok) throw new Error("Weather API failed");
      const data = await response.json();

      const formatTime = (isoStr: string) => {
        return new Date(isoStr).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      };

      const parsedCurrent: CurrentWeather = {
        temp: Math.round(data.current.temperature_2m),
        humidity: Math.round(data.current.relative_humidity_2m),
        windSpeed: Math.round(data.current.wind_speed_10m),
        cloudCover: Math.round(data.current.cloud_cover),
        uvIndex: Math.round(data.daily.uv_index_max[0] || 5),
        sunrise: formatTime(data.daily.sunrise[0]),
        sunset: formatTime(data.daily.sunset[0]),
        rainProb: Math.round(data.daily.precipitation_probability_max[0] || 0),
        condition: getWeatherCondition(data.current.weather_code),
        weatherCode: data.current.weather_code,
      };

      const parsedForecast: ForecastDay[] = data.daily.time.map((timeStr: string, idx: number) => ({
        date: timeStr,
        tempMax: Math.round(data.daily.temperature_2m_max[idx]),
        tempMin: Math.round(data.daily.temperature_2m_min[idx]),
        weatherCode: data.daily.weather_code[idx],
        rainProb: Math.round(data.daily.precipitation_probability_max[idx] || 0),
        condition: getWeatherCondition(data.daily.weather_code[idx]),
      }));

      setWeatherData({
        current: parsedCurrent,
        forecast: parsedForecast,
      });
    } catch {
      // Fallback peak monsoon data for Ahilyanagar (July average values)
      const mockCurrent: CurrentWeather = {
        temp: 27,
        humidity: 84,
        windSpeed: 16,
        cloudCover: 88,
        uvIndex: 4,
        sunrise: "06:06 AM",
        sunset: "07:11 PM",
        rainProb: 75,
        condition: "Monsoon Rain",
        weatherCode: 63,
      };

      const mockForecast: ForecastDay[] = Array.from({ length: 7 }).map((_, idx) => {
        const d = new Date();
        d.setDate(d.getDate() + idx);
        const code = idx % 3 === 0 ? 95 : idx % 2 === 0 ? 63 : 3; // Thunderstorm, Rain, Cloudy
        return {
          date: d.toISOString().split("T")[0],
          tempMax: 29 - (idx % 3),
          tempMin: 22 + (idx % 2),
          weatherCode: code,
          rainProb: code === 95 ? 85 : code === 63 ? 70 : 15,
          condition: getWeatherCondition(code),
        };
      });

      setWeatherData({
        current: mockCurrent,
        forecast: mockForecast,
      });
    } finally {
      setWeatherLoading(false);
    }
  };

  // Auth restore & trigger weather load on mount
  useEffect(() => {
    fetchWeather();

    const restoreSession = async () => {
      setAuthLoading(true);

      if (isSupabaseConfigured) {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          const { data: profile, error: pErr } = await supabase
            .from("profiles")
            .select("role, name, avatar_url")
            .eq("id", session.user.id)
            .single();

          if (pErr) {
            setDbError(JSON.stringify(pErr));
            console.error("ERP Auth error:", pErr);
          } else {
            setDbError(null);
          }

          const role = (profile?.role || "Client") as UserRole;
          const userSession: UserSession = {
            email: session.user.email!,
            name: profile?.name || session.user.user_metadata.full_name || session.user.email!.split("@")[0],
            avatar: profile?.avatar_url || session.user.user_metadata.avatar_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
            role,
          };
          setUser(userSession);
          setAuthCookies(userSession.email, role);
        }
      } else {
        const cachedUser = localStorage.getItem("bl_auth_session");
        if (cachedUser) {
          const parsed = JSON.parse(cachedUser) as UserSession;
          setUser(parsed);
          setAuthCookies(parsed.email, parsed.role);
        }
      }
      setAuthLoading(false);
    };

    restoreSession();

    if (isSupabaseConfigured) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (event === "SIGNED_IN" && session) {
          const { data: profile, error: pErr } = await supabase
            .from("profiles")
            .select("role, name, avatar_url")
            .eq("id", session.user.id)
            .single();

          if (pErr) {
            setDbError(JSON.stringify(pErr));
            console.error("ERP Auth onAuthStateChange error:", pErr);
          } else {
            setDbError(null);
          }

          const role = (profile?.role || "Client") as UserRole;
          const userSession: UserSession = {
            email: session.user.email!,
            name: profile?.name || session.user.user_metadata.full_name || session.user.email!.split("@")[0],
            avatar: profile?.avatar_url || session.user.user_metadata.avatar_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
            role,
          };
          setUser(userSession);
          setAuthCookies(userSession.email, role);
        } else if (event === "SIGNED_OUT") {
          setUser(null);
          clearAuthCookies();
          setDbError(null);
        }
      });
      return () => subscription.unsubscribe();
    }
  }, []);

  // --- MOCK DATABASE LOAD ---
  useEffect(() => {
    if (isSupabaseConfigured) {
      const loadCloudData = async () => {
        try {
          const { data: bData } = await supabase.from("bookings").select("*");
          if (bData && bData.length > 0) {
            setBookings(bData.map(b => ({
              id: b.id,
              customerName: b.customer_name,
              customerPhoto: b.customer_photo,
              email: b.email,
              phoneNumber: b.phone_number,
              venueName: b.venue_name,
              bookingType: "Wedding",
              bookingDate: b.booking_date,
              guestCount: b.guest_count,
              amount: b.amount,
              status: b.status,
              progress: b.progress,
              packageSelected: b.package_selected,
            })));
          }

          const { data: rData } = await supabase.from("booking_requests").select("*");
          if (rData && rData.length > 0) {
            setBookingRequests(rData.map(r => ({
              id: r.id,
              customerName: r.customer_name,
              phoneNumber: r.phone_number,
              email: r.email,
              venue: r.venue,
              eventType: r.event_type,
              eventDate: r.event_date,
              eventSession: r.event_session,
              guests: r.guests,
              packageSelected: r.package_selected,
              vendors: r.vendors,
              additionalServices: r.additional_services,
              pricingBreakdown: r.pricing_breakdown,
              status: r.status,
              createdAt: r.created_at,
            })));
          }

          const { data: vData } = await supabase.from("vendors").select("*");
          if (vData && vData.length > 0) {
            setVendors(vData.map(v => ({
              id: v.id,
              name: v.name,
              category: v.category,
              logo: v.logo || "",
              coverImage: v.cover_image || "",
              price: v.price,
              location: v.location,
              phone: v.phone,
              email: v.email,
              instagram: v.instagram || "",
              whatsapp: v.whatsapp || "",
              commissionPercentage: v.commission_percentage,
              rating: Number(v.rating),
              completedWeddings: v.completed_weddings,
              featured: v.featured,
              gallery: v.gallery || [],
              menuItems: v.menu_items || [],
              photographyPortfolio: v.photography_portfolio || [],
              availability: v.availability || []
            })));
          }

          const { data: iData } = await supabase.from("invoices").select("*");
          if (iData && iData.length > 0) {
            setInvoices(iData.map(i => ({
              id: i.id,
              invoiceNo: i.invoice_no || `BL-2026-${i.id}`,
              clientName: i.client_name,
              date: i.date,
              bookingId: i.booking_id,
              bookingType: "Wedding",
              taxableAmount: Math.round(i.amount / 1.18),
              cgst: Math.round((i.amount / 1.18) * 0.09),
              sgst: Math.round((i.amount / 1.18) * 0.09),
              totalAmount: i.amount,
              status: i.status,
            })));
          }

          const { data: eData } = await supabase.from("expenses").select("*");
          if (eData && eData.length > 0) {
            setExpenses(eData.map(e => ({
              id: e.id,
              category: e.category,
              amount: e.amount,
              date: e.date,
              description: e.description || "",
              payee: e.payee || "Vendor",
            })));
          }

          const { data: glData } = await supabase.from("generator_logs").select("*");
          if (glData && glData.length > 0) {
            setGeneratorLogs(glData.map(g => ({
              id: g.id,
              date: g.date,
              dieselAddedLitres: g.fuel_added,
              costPerLitre: 98.5,
              totalCost: g.fuel_added * 98.5,
              runHoursAdded: g.runtime_hours,
              fuelLevelAfter: 90,
              loggedBy: g.operator_name || "Staff",
            })));
          }

          const { data: tData } = await supabase.from("kanban_tasks").select("*");
          if (tData && tData.length > 0) {
            setKanbanTasks(tData.map(t => ({
              id: t.id,
              title: t.title,
              assignee: t.assignee,
              status: t.status,
              priority: t.priority,
              category: "General",
              description: "",
              date: t.due_date,
            })));
          }

          const { data: auditData } = await supabase.from("audit_logs").select("*");
          if (auditData && auditData.length > 0) {
            setAuditLogs(auditData.map(a => ({
              id: a.id,
              timestamp: a.timestamp,
              user: a.user,
              action: a.action,
              ipAddress: a.ip_address,
              status: a.status,
            })));
          }

          const { data: cData } = await supabase.from("customers").select("*");
          if (cData && cData.length > 0) {
            setCustomers(cData.map(c => ({
              id: c.id,
              name: c.name,
              photo: c.photo || "https://images.unsplash.com/photo-1621574539437-4b7cb63120b8?auto=format&fit=crop&q=80&w=200",
              phone: c.phone,
              email: c.email,
              address: c.address || "",
              totalSpent: c.total_spent || 0,
              bookingCount: c.booking_count || 0,
              notes: c.notes || [],
              whatsappHistory: c.whatsapp_history || [],
            })));
          }

          const { data: configData } = await supabase.from("erp_config").select("*").eq("id", "default").maybeSingle();
          if (configData) {
            setConfigSettings({
              hallPrice: configData.hall_price,
              hallLawnPrice: configData.hall_lawn_price,
              generatorCostPerHour: configData.generator_cost_per_hour,
              electricityCostPerUnit: configData.electricity_cost_per_unit,
              gstPercentage: configData.gst_percentage,
              discountDefault: configData.discount_default,
              invoiceTemplate: configData.invoice_template,
              vendorCategories: configData.vendor_categories,
              packageTemplates: configData.package_templates,
            });
          }
        } catch (err) {
          console.error("Bhagyalaxmi ERP: Error loading Supabase tables:", err);
        }
      };

      loadCloudData();
      return;
    }

    const cachedBookings = localStorage.getItem("bl_bookings");
    const cachedCustomers = localStorage.getItem("bl_customers");
    const cachedInvoices = localStorage.getItem("bl_invoices");
    const cachedExpenses = localStorage.getItem("bl_expenses");
    const cachedGenLogs = localStorage.getItem("bl_genLogs");
    const cachedTasks = localStorage.getItem("bl_tasks");
    const cachedAudits = localStorage.getItem("bl_audits");
    const cachedRequests = localStorage.getItem("bl_booking_requests");
    const cachedVendors = localStorage.getItem("bl_vendors");
    const cachedConfig = localStorage.getItem("bl_config");

    if (cachedBookings && cachedCustomers && cachedInvoices && cachedExpenses && cachedGenLogs && cachedTasks && cachedAudits && cachedRequests && cachedVendors && cachedConfig) {
      setBookings(JSON.parse(cachedBookings));
      setCustomers(JSON.parse(cachedCustomers));
      setInvoices(JSON.parse(cachedInvoices));
      setExpenses(JSON.parse(cachedExpenses));
      setGeneratorLogs(JSON.parse(cachedGenLogs));
      setKanbanTasks(JSON.parse(cachedTasks));
      setAuditLogs(JSON.parse(cachedAudits));
      setBookingRequests(JSON.parse(cachedRequests));
      setVendors(JSON.parse(cachedVendors));
      setConfigSettings(JSON.parse(cachedConfig));
    } else {
      const seedBookings: Booking[] = [];
      const seedCustomers: Customer[] = [];
      const seedInvoices: Invoice[] = [];
      const seedExpenses: Expense[] = [];
      const seedGenLogs: GeneratorLog[] = [];
      const seedTasks: KanbanTask[] = [];
      const seedAudits: AuditLog[] = [];
      const seedRequests: BookingRequest[] = [];

      const seedVendors: Vendor[] = [
        {
          id: "v-decor-1",
          name: "Ahilya Florists & Decorators",
          logo: "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&q=80&w=200",
          coverImage: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=600",
          gallery: [
            "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=600",
            "https://images.unsplash.com/photo-1519225495810-7512c696505a?auto=format&fit=crop&q=80&w=600",
            "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=600"
          ],
          category: "Decoration",
          price: 25000,
          rating: 4.9,
          completedWeddings: 128,
          location: "Bhingar, Ahilyanagar",
          instagram: "https://instagram.com/ahilya_decor",
          whatsapp: "https://wa.me/919890907454",
          phone: "9890907454",
          email: "ahilyadecor@gmail.com",
          commissionPercentage: 10,
          featured: true,
          availability: ["2026-07-20", "2026-07-24"],
          themes: [
            { name: "Royal Purple Theme", image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=300", description: "Vibrant royal purple draping, golden lights, crystal chandeliers, floral wall." },
            { name: "Classic Maharashtrian Theme", image: "https://images.unsplash.com/photo-1519225495810-7512c696505a?auto=format&fit=crop&q=80&w=300", description: "Traditional yellow-orange marigold strings, brass diyas, mango leaf garlands, shehnai stage." },
            { name: "Floral Theme", image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=300", description: "A garden oasis styled with premium orchids, pink roses, and suspended foliage." },
            { name: "White Luxury Theme", image: "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&q=80&w=300", description: "Clean aesthetics with all-white roses, crystal spheres, silver candelabras, mirror stage aisle." },
            { name: "Crystal Theme", image: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=300", description: "Ultra-modern reflective panels, fairy light curtain, hanging crystal drop elements." }
          ]
        },
        {
          id: "v-catering-1",
          name: "Bhagyalaxmi Pure Veg Caterers",
          logo: "https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&q=80&w=200",
          coverImage: "https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&q=80&w=600",
          gallery: [
            "https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&q=80&w=600",
            "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&q=80&w=600"
          ],
          category: "Food Catering",
          price: 350,
          rating: 4.8,
          completedWeddings: 142,
          location: "Bhingar, Ahilyanagar",
          whatsapp: "https://wa.me/919422238066",
          phone: "9422238066",
          email: "bhagyalaxmicaterers@gmail.com",
          commissionPercentage: 10,
          featured: true,
          availability: ["2026-07-20"],
          menuItems: [
            { name: "Amrakhand & Shrikhand", category: "Sweets", description: "Rich, smooth, flavored hung curd dessert" },
            { name: "Puran Poli with Sajuk Tup", category: "Traditional Sweets", description: "Sweet flatbread made of lentils and jaggery, served with ghee" },
            { name: "Paneer Butter Masala", category: "Main Course", description: "Rich paneer cubes in tomato gravy" },
            { name: "Basundi with Poori", category: "Sweets & Breads", description: "Thickened sweetened milk with cardamoms" },
            { name: "Masala Bhaat", category: "Rice", description: "Traditional spiced Maharashtrian rice" },
            { name: "Dosa & Chaat Counters", category: "Live Counters", description: "Crisp dosas and savory street food chaat" }
          ]
        },
        {
          id: "v-photo-1",
          name: "Ahilya Wedding Studio",
          logo: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=200",
          coverImage: "https://images.unsplash.com/photo-1520854221256-17451cc35953?auto=format&fit=crop&q=80&w=600",
          gallery: [
            "https://images.unsplash.com/photo-1520854221256-17451cc35953?auto=format&fit=crop&q=80&w=600",
            "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=600"
          ],
          category: "Photography",
          price: 40000,
          rating: 4.8,
          completedWeddings: 98,
          location: "Ahilyanagar Center",
          instagram: "https://instagram.com/ahilya_studio",
          whatsapp: "https://wa.me/919960281292",
          phone: "9960281292",
          email: "ahilyaphotography@gmail.com",
          commissionPercentage: 15,
          featured: true,
          availability: ["2026-07-20", "2026-07-21"],
          photographyPortfolio: [
            { name: "Prasad & Shraddha Pre-wedding", image: "https://images.unsplash.com/photo-1520854221256-17451cc35953?auto=format&fit=crop&q=80&w=300" },
            { name: "Kadam Family Sangeet Highlights", image: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=300" }
          ]
        }
      ];

      const seedConfig: ERPConfig = {
        hallPrice: 90000,
        hallLawnPrice: 130000,
        generatorCostPerHour: 2500,
        electricityCostPerUnit: 12,
        gstPercentage: 18,
        discountDefault: 0,
        invoiceTemplate: "Luxury Royal Theme",
        vendorCategories: [
          "Decoration", "Food Catering", "Photography", "Videography", "DJ", 
          "Lighting", "Security", "Generator", "Cleaning", "Welcome Band", 
          "Pandit", "Luxury Cars", "Horse Entry", "Makeup Artist", 
          "Invitation Cards", "Live Counter", "Cake"
        ],
        packageTemplates: [
          { name: "Silver", pricePerGuest: 180, decorationLevel: "Basic", lighting: "Standard", stage: "Basic Layout", flowerWork: "Minimal Marigold", bridalRoom: "Non-AC Standard", description: "Essential package for intimate gatherings" },
          { name: "Gold", pricePerGuest: 300, decorationLevel: "Premium", lighting: "Ambiance LED", stage: "Grand Backdrop", flowerWork: "Marigold Arches + Roses", bridalRoom: "Centrally AC", description: "Elegant features with enhanced decorations" },
          { name: "Royal", pricePerGuest: 450, decorationLevel: "Luxury Theme", lighting: "Intelligent moving heads", stage: "Maharajah Theme Stage", flowerWork: "Exotic Orchids & Lilies", bridalRoom: "AC Suite with Lounge", description: "Royal theme setting for grand Indian weddings" },
          { name: "Luxury", pricePerGuest: 650, decorationLevel: "Ultra Luxury Custom", lighting: "Laser and spotlight grids", stage: "Royal Palace Replica", flowerWork: "Imported Carnations & Orchids", bridalRoom: "VIP Suite + Extra Guest Rooms", description: "The ultimate luxury statement with custom layouts" }
        ]
      };

      setBookings(seedBookings);
      setCustomers(seedCustomers);
      setInvoices(seedInvoices);
      setExpenses(seedExpenses);
      setGeneratorLogs(seedGenLogs);
      setKanbanTasks(seedTasks);
      setAuditLogs(seedAudits);
      setBookingRequests(seedRequests);
      setVendors(seedVendors);
      setConfigSettings(seedConfig);

      localStorage.setItem("bl_bookings", JSON.stringify(seedBookings));
      localStorage.setItem("bl_customers", JSON.stringify(seedCustomers));
      localStorage.setItem("bl_invoices", JSON.stringify(seedInvoices));
      localStorage.setItem("bl_expenses", JSON.stringify(seedExpenses));
      localStorage.setItem("bl_genLogs", JSON.stringify(seedGenLogs));
      localStorage.setItem("bl_tasks", JSON.stringify(seedTasks));
      localStorage.setItem("bl_audits", JSON.stringify(seedAudits));
      localStorage.setItem("bl_booking_requests", JSON.stringify(seedRequests));
      localStorage.setItem("bl_vendors", JSON.stringify(seedVendors));
      localStorage.setItem("bl_config", JSON.stringify(seedConfig));
    }
  }, []);

  const saveToStorage = (
    updatedBookings: Booking[],
    updatedCustomers: Customer[],
    updatedInvoices: Invoice[],
    updatedExpenses: Expense[],
    updatedGenLogs: GeneratorLog[],
    updatedTasks: KanbanTask[],
    updatedAudits: AuditLog[],
    updatedRequests?: BookingRequest[],
    updatedVendors?: Vendor[],
    updatedConfig?: ERPConfig
  ) => {
    localStorage.setItem("bl_bookings", JSON.stringify(updatedBookings));
    localStorage.setItem("bl_customers", JSON.stringify(updatedCustomers));
    localStorage.setItem("bl_invoices", JSON.stringify(updatedInvoices));
    localStorage.setItem("bl_expenses", JSON.stringify(updatedExpenses));
    localStorage.setItem("bl_genLogs", JSON.stringify(updatedGenLogs));
    localStorage.setItem("bl_tasks", JSON.stringify(updatedTasks));
    localStorage.setItem("bl_audits", JSON.stringify(updatedAudits));
    localStorage.setItem("bl_booking_requests", JSON.stringify(updatedRequests || bookingRequests));
    localStorage.setItem("bl_vendors", JSON.stringify(updatedVendors || vendors));
    localStorage.setItem("bl_config", JSON.stringify(updatedConfig || configSettings));
  };

  const hasPermission = (action: string): boolean => {
    if (!user) return false;
    const role = user.role;

    if (role === "Super Admin" || role === "Owner") {
      return true;
    }

    switch (action) {
      case "view:dashboard":
      case "view:calendar":
        return ["Manager", "Accountant", "Staff"].includes(role);
      case "view:bookings":
      case "view:crm":
        return ["Manager", "Accountant"].includes(role);
      case "view:new-booking":
      case "view:whatsapp":
        return role === "Manager";
      case "view:finance":
        return role === "Accountant";
      case "view:operations":
      case "view:generator":
        return ["Manager", "Staff"].includes(role);
      case "view:booking-requests":
      case "view:vendor-management":
        return ["Manager", "Accountant"].includes(role);
      case "view:owner-panel":
        return false;
      case "action:confirm-payment":
      case "action:mark-complete":
        return ["Manager", "Accountant"].includes(role);
      case "action:log-expense":
        return role === "Accountant";
      case "action:add-task":
      case "action:log-generator":
        return ["Manager", "Staff"].includes(role);
      default:
        return false;
    }
  };

  // --- AUTH ACTIONS ---

  const loginWithGoogle = async (portal: "client" | "admin") => {
    if (isSupabaseConfigured) {
      await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=${portal === "admin" ? "/admin" : "/client"}`,
        },
      });
    } else {
      const mockRole = portal === "admin" ? "Owner" : "Client";
      const mockEmail = portal === "admin" ? "owner@bhagyalaxmi.com" : "customer.deshmukh@gmail.com";
      const mockUser: UserSession = {
        email: mockEmail,
        name: portal === "admin" ? "Deepak Zodge" : "Rahul Deshmukh",
        avatar: portal === "admin" 
          ? "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200"
          : "https://images.unsplash.com/photo-1621574539437-4b7cb63120b8?auto=format&fit=crop&q=80&w=200",
        role: mockRole,
      };

      setUser(mockUser);
      setAuthCookies(mockUser.email, mockUser.role);
      localStorage.setItem("bl_auth_session", JSON.stringify(mockUser));
      
      const newAudit: AuditLog = {
        id: `l-${Date.now()}`,
        timestamp: new Date().toISOString(),
        user: mockUser.name,
        action: `Logged in via Google (Sandbox - ${mockUser.role})`,
        ipAddress: "192.168.1.42",
        status: "Success"
      };
      setAuditLogs(prev => [newAudit, ...prev]);
    }
  };

  const sendOTP = async (email: string, portal: "client" | "admin") => {
    if (isSupabaseConfigured) {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/${portal === "admin" ? "admin" : "client"}`,
        },
      });
      if (error) {
        return { success: false, message: error.message };
      }
      return { success: true };
    } else {
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      console.log(`[SANDBOX OTP CODE for ${email}]: ${code}`);
      return { success: true, code, message: "Sandbox Code generated. See console log or enter code below." };
    }
  };

  const verifyOTP = async (email: string, code: string, portal: "client" | "admin"): Promise<boolean> => {
    if (isSupabaseConfigured) {
      const { error } = await supabase.auth.verifyOtp({
        email,
        token: code,
        type: "signup",
      });
      return !error;
    } else {
      let mockRole: UserRole = "Client";
      let mockName = "Rahul Deshmukh";
      
      if (portal === "admin") {
        if (email.startsWith("super")) {
          mockRole = "Super Admin";
          mockName = "Vikram Patil (SysAdmin)";
        } else if (email.startsWith("owner")) {
          mockRole = "Owner";
          if (email.includes("kiran")) {
            mockName = "Kiran Zodge";
          } else if (email.includes("harshal")) {
            mockName = "Harshal Zodge";
          } else {
            mockName = "Deepak Zodge";
          }
        } else if (email.startsWith("manager")) {
          mockRole = "Manager";
          mockName = "Sanjay Shinde";
        } else if (email.startsWith("accountant")) {
          mockRole = "Accountant";
          mockName = "Ramesh Shah (CA)";
        } else if (email.startsWith("staff")) {
          mockRole = "Staff";
          mockName = "Amol Patil";
        } else {
          mockRole = "Owner";
          mockName = "Deepak Zodge";
        }
      }

      const mockUser: UserSession = {
        email,
        name: mockName,
        avatar: portal === "admin"
          ? "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200"
          : "https://images.unsplash.com/photo-1621574539437-4b7cb63120b8?auto=format&fit=crop&q=80&w=200",
        role: mockRole,
      };

      setUser(mockUser);
      setAuthCookies(mockUser.email, mockUser.role);
      localStorage.setItem("bl_auth_session", JSON.stringify(mockUser));

      const newAudit: AuditLog = {
        id: `l-${Date.now()}`,
        timestamp: new Date().toISOString(),
        user: mockUser.name,
        action: `Logged in via Email OTP (Sandbox - ${mockUser.role})`,
        ipAddress: "192.168.1.42",
        status: "Success"
      };
      setAuditLogs(prev => [newAudit, ...prev]);

      return true;
    }
  };

  const logout = async () => {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    }
    setUser(null);
    clearAuthCookies();
    localStorage.removeItem("bl_auth_session");
  };

  // --- CRM & DATABASE OPERATIONS ---

  const addBooking = (bookingData: Omit<Booking, "id" | "progress">) => {
    const newId = `b-${Date.now()}`;
    const newBooking: Booking = {
      ...bookingData,
      id: newId,
      progress: 10,
    };
    
    const updatedBookings = [newBooking, ...bookings];
    setBookings(updatedBookings);

    let updatedCustomers = [...customers];
    const existingCust = customers.find(c => c.name.toLowerCase() === bookingData.customerName.toLowerCase() || c.phone === bookingData.phoneNumber);
    
    let targetCust: Customer;
    if (!existingCust) {
      const newCustId = `c-${Date.now()}`;
      targetCust = {
        id: newCustId,
        name: bookingData.customerName.split("'s")[0].split(" & ")[0] || bookingData.customerName,
        photo: bookingData.customerPhoto,
        phone: bookingData.phoneNumber,
        email: bookingData.email,
        address: "Ahilyanagar, Maharashtra",
        totalSpent: bookingData.amount,
        bookingCount: 1,
        notes: [{ id: `n-${Date.now()}`, date: new Date().toISOString().split("T")[0], text: `Initial booking created: ${bookingData.bookingType}` }],
        whatsappHistory: [
          { id: `w-${Date.now()}`, sender: "owner", text: `Welcome to Bhagyalaxmi Lawns! Your booking for ${bookingData.bookingType} has been requested.`, timestamp: new Date().toISOString() }
        ]
      };
      updatedCustomers = [targetCust, ...customers];
      setCustomers(updatedCustomers);
    } else {
      updatedCustomers = customers.map(c => {
        if (c.id === existingCust.id) {
          targetCust = {
            ...c,
            bookingCount: c.bookingCount + 1,
            totalSpent: c.totalSpent + bookingData.amount,
          };
          return targetCust;
        }
        return c;
      });
      setCustomers(updatedCustomers);
      targetCust = updatedCustomers.find(c => c.id === existingCust.id)!;
    }

    const newInvoiceId = `inv-${Date.now()}`;
    const taxableVal = Math.round(bookingData.amount / 1.18);
    const taxAmt = Math.round(taxableVal * 0.09);
    const newInvoice: Invoice = {
      id: newInvoiceId,
      invoiceNo: `BL-2026-${Math.floor(Math.random() * 900) + 100}`,
      clientName: bookingData.customerName.split("'s")[0],
      date: new Date().toISOString().split("T")[0],
      bookingId: newId,
      bookingType: bookingData.bookingType,
      taxableAmount: taxableVal,
      cgst: taxAmt,
      sgst: taxAmt,
      totalAmount: bookingData.amount,
      status: bookingData.status === "Confirmed" ? "Paid" : "Unpaid",
    };
    const updatedInvoices = [newInvoice, ...invoices];
    setInvoices(updatedInvoices);

    const newAudit: AuditLog = {
      id: `l-${Date.now()}`,
      timestamp: new Date().toISOString(),
      user: user?.name || "Owner (admin)",
      action: `Created new booking: ${bookingData.customerName} (${bookingData.bookingType})`,
      ipAddress: "192.168.1.42",
      status: "Success"
    };
    const updatedAudits = [newAudit, ...auditLogs];
    setAuditLogs(updatedAudits);

    saveToStorage(updatedBookings, updatedCustomers, updatedInvoices, expenses, generatorLogs, kanbanTasks, updatedAudits);

    if (isSupabaseConfigured) {
      supabase.from("bookings").insert({
        id: newId,
        customer_name: newBooking.customerName,
        customer_photo: newBooking.customerPhoto,
        email: newBooking.email,
        phone_number: newBooking.phoneNumber,
        venue_name: newBooking.venueName,
        booking_date: newBooking.bookingDate,
        guest_count: newBooking.guestCount,
        amount: newBooking.amount,
        advance_paid: 0,
        status: newBooking.status,
        progress: newBooking.progress,
        package_selected: newBooking.packageSelected,
      }).then(({ error }) => { if (error) console.error("Supabase insert booking error:", error); });

      if (targetCust) {
        supabase.from("customers").upsert({
          id: targetCust.id,
          name: targetCust.name,
          photo: targetCust.photo,
          phone: targetCust.phone,
          email: targetCust.email,
          address: targetCust.address,
          total_spent: targetCust.totalSpent,
          booking_count: targetCust.bookingCount,
          notes: targetCust.notes,
          whatsapp_history: targetCust.whatsappHistory,
        }).then(({ error }) => { if (error) console.error("Supabase upsert customer error:", error); });
      }

      supabase.from("invoices").insert({
        id: newInvoiceId,
        booking_id: newId,
        client_name: newInvoice.clientName,
        date: newInvoice.date,
        amount: newInvoice.totalAmount,
        status: newInvoice.status,
        gst_number: ""
      }).then(({ error }) => { if (error) console.error("Supabase insert invoice error:", error); });

      supabase.from("audit_logs").insert({
        id: newAudit.id,
        timestamp: newAudit.timestamp,
        "user": newAudit.user,
        action: newAudit.action,
        ip_address: newAudit.ipAddress,
        status: newAudit.status,
      }).then(({ error }) => { if (error) console.error("Supabase insert audit_log error:", error); });
    }

    return newBooking;
  };

  const updateBookingStatus = (id: string, status: BookingStatus) => {
    const updatedBookings = bookings.map(b => (b.id === id ? { ...b, status } : b));
    setBookings(updatedBookings);

    const booking = bookings.find(b => b.id === id);
    let updatedInvoices = [...invoices];
    if (booking) {
      updatedInvoices = invoices.map(inv => {
        if (inv.bookingId === id) {
          return { ...inv, status: status === "Confirmed" ? "Paid" : status === "Completed" ? "Paid" : "Unpaid" as const };
        }
        return inv;
      });
      setInvoices(updatedInvoices);
    }

    const newAudit: AuditLog = {
      id: `l-${Date.now()}`,
      timestamp: new Date().toISOString(),
      user: user?.name || "Owner (admin)",
      action: `Updated booking status of ${booking?.customerName || id} to ${status}`,
      ipAddress: "192.168.1.42",
      status: "Success"
    };
    const updatedAudits = [newAudit, ...auditLogs];
    setAuditLogs(updatedAudits);

    saveToStorage(updatedBookings, customers, updatedInvoices, expenses, generatorLogs, kanbanTasks, updatedAudits);

    if (isSupabaseConfigured) {
      supabase.from("bookings").update({ status }).eq("id", id)
        .then(({ error }) => { if (error) console.error("Supabase update booking status error:", error); });

      if (booking) {
        const invStatus = status === "Confirmed" ? "Paid" : status === "Completed" ? "Paid" : "Unpaid";
        supabase.from("invoices").update({ status: invStatus }).eq("booking_id", id)
          .then(({ error }) => { if (error) console.error("Supabase update invoice status error:", error); });
      }

      supabase.from("audit_logs").insert({
        id: newAudit.id,
        timestamp: newAudit.timestamp,
        "user": newAudit.user,
        action: newAudit.action,
        ip_address: newAudit.ipAddress,
        status: newAudit.status,
      }).then(({ error }) => { if (error) console.error("Supabase insert audit_log error:", error); });
    }
  };

  const updateBookingDate = (id: string, date: string) => {
    const updatedBookings = bookings.map(b => (b.id === id ? { ...b, bookingDate: date } : b));
    setBookings(updatedBookings);

    const booking = bookings.find(b => b.id === id);
    const newAudit: AuditLog = {
      id: `l-${Date.now()}`,
      timestamp: new Date().toISOString(),
      user: user?.name || "Owner (admin)",
      action: `Rescheduled ${booking?.customerName || id} to ${date}`,
      ipAddress: "192.168.1.42",
      status: "Success"
    };
    const updatedAudits = [newAudit, ...auditLogs];
    setAuditLogs(updatedAudits);

    saveToStorage(updatedBookings, customers, invoices, expenses, generatorLogs, kanbanTasks, updatedAudits);

    if (isSupabaseConfigured) {
      supabase.from("bookings").update({ booking_date: date }).eq("id", id)
        .then(({ error }) => { if (error) console.error("Supabase update booking date error:", error); });

      supabase.from("audit_logs").insert({
        id: newAudit.id,
        timestamp: newAudit.timestamp,
        "user": newAudit.user,
        action: newAudit.action,
        ip_address: newAudit.ipAddress,
        status: newAudit.status,
      }).then(({ error }) => { if (error) console.error("Supabase insert audit_log error:", error); });
    }
  };

  const addCustomerNote = (customerId: string, noteText: string) => {
    const noteId = `n-${Date.now()}`;
    const newNote: CustomerNote = {
      id: noteId,
      date: new Date().toISOString().split("T")[0],
      text: noteText
    };

    let targetCust: Customer | undefined;
    const updatedCustomers = customers.map(c => {
      if (c.id === customerId) {
        targetCust = {
          ...c,
          notes: [newNote, ...c.notes]
        };
        return targetCust;
      }
      return c;
    });
    setCustomers(updatedCustomers);
    saveToStorage(bookings, updatedCustomers, invoices, expenses, generatorLogs, kanbanTasks, auditLogs);

    if (isSupabaseConfigured && targetCust) {
      supabase.from("customers").update({ notes: targetCust.notes }).eq("id", customerId)
        .then(({ error }) => { if (error) console.error("Supabase update customer notes error:", error); });
    }
  };

  const sendWhatsAppMessage = (customerId: string, text: string) => {
    const msgId = `w-${Date.now()}`;
    const newMsg: WhatsAppMessage = {
      id: msgId,
      sender: "owner",
      text,
      timestamp: new Date().toISOString()
    };

    let targetCust: Customer | undefined;
    const updatedCustomers = customers.map(c => {
      if (c.id === customerId) {
        targetCust = {
          ...c,
          whatsappHistory: [...c.whatsappHistory, newMsg]
        };
        return targetCust;
      }
      return c;
    });
    setCustomers(updatedCustomers);
    saveToStorage(bookings, updatedCustomers, invoices, expenses, generatorLogs, kanbanTasks, auditLogs);

    if (isSupabaseConfigured && targetCust) {
      supabase.from("customers").update({ whatsapp_history: targetCust.whatsappHistory }).eq("id", customerId)
        .then(({ error }) => { if (error) console.error("Supabase update whatsapp_history error:", error); });
    }

    setTimeout(() => {
      const responseMsgId = `w-${Date.now() + 1}`;
      const responseMsg: WhatsAppMessage = {
        id: responseMsgId,
        sender: "customer",
        text: "Dhanyawad! I received your message. I am currently busy, will check and reply shortly.",
        timestamp: new Date().toISOString()
      };

      setCustomers(currentCust => {
        const updated = currentCust.map(c => {
          if (c.id === customerId) {
            const updatedCust = {
              ...c,
              whatsappHistory: [...c.whatsappHistory, responseMsg]
            };
            if (isSupabaseConfigured) {
              supabase.from("customers").update({ whatsapp_history: updatedCust.whatsappHistory }).eq("id", customerId)
                .then(({ error }) => { if (error) console.error("Supabase update whatsapp_history auto-reply error:", error); });
            }
            return updatedCust;
          }
          return c;
        });
        localStorage.setItem("bl_customers", JSON.stringify(updated));
        return updated;
      });
    }, 1500);
  };

  const addGeneratorLog = (dieselLitres: number, costPerLitre: number, runHours: number) => {
    const logId = `g-${Date.now()}`;
    const totalCost = dieselLitres * costPerLitre;
    
    let additionalFuelPercent = Math.round((dieselLitres / 500) * 100);
    let fuelBurned = runHours * 15;
    let burnedFuelPercent = Math.round((fuelBurned / 500) * 100);

    const newFuelLevel = Math.max(0, Math.min(100, generatorFuelLevel + additionalFuelPercent - burnedFuelPercent));
    setGeneratorFuelLevel(newFuelLevel);
    
    const newRuntime = generatorRuntimeHours + runHours;
    setGeneratorRuntimeHours(newRuntime);

    const newLog: GeneratorLog = {
      id: logId,
      date: new Date().toISOString().split("T")[0],
      dieselAddedLitres: dieselLitres,
      costPerLitre,
      totalCost,
      runHoursAdded: runHours,
      fuelLevelAfter: newFuelLevel,
      loggedBy: user?.name || "Owner (admin)",
    };

    const updatedGenLogs = [newLog, ...generatorLogs];
    setGeneratorLogs(updatedGenLogs);

    let updatedExpenses = [...expenses];
    let newExpense: Expense | null = null;
    if (totalCost > 0) {
      newExpense = {
        id: `exp-${Date.now()}`,
        category: "Generator Diesel",
        amount: totalCost,
        description: `${dieselLitres}L Diesel log generator refill`,
        date: new Date().toISOString().split("T")[0],
        payee: "Petrol Pump Refill"
      };
      updatedExpenses = [newExpense, ...expenses];
      setExpenses(updatedExpenses);
    }

    const newAudit: AuditLog = {
      id: `l-${Date.now()}`,
      timestamp: new Date().toISOString(),
      user: user?.name || "Owner (admin)",
      action: `Logged generator operations: +${dieselLitres}L, +${runHours}Hrs run. Fuel level: ${newFuelLevel}%`,
      ipAddress: "192.168.1.42",
      status: "Success"
    };
    const updatedAudits = [newAudit, ...auditLogs];
    setAuditLogs(updatedAudits);

    saveToStorage(bookings, customers, invoices, updatedExpenses, updatedGenLogs, kanbanTasks, updatedAudits);

    if (isSupabaseConfigured) {
      supabase.from("generator_logs").insert({
        id: logId,
        date: newLog.date,
        generator_name: "Maharaja Generator Set",
        fuel_added: dieselLitres,
        runtime_hours: runHours,
        operator_name: newLog.loggedBy,
        notes: `Refill level: ${newFuelLevel}%, Cost/Litre: ${costPerLitre}`
      }).then(({ error }) => { if (error) console.error("Supabase insert generator log error:", error); });

      if (newExpense) {
        supabase.from("expenses").insert({
          id: newExpense.id,
          category: newExpense.category,
          amount: newExpense.amount,
          date: newExpense.date,
          description: newExpense.description,
          logged_by: newExpense.payee
        }).then(({ error }) => { if (error) console.error("Supabase insert generator expense error:", error); });
      }

      supabase.from("audit_logs").insert({
        id: newAudit.id,
        timestamp: newAudit.timestamp,
        "user": newAudit.user,
        action: newAudit.action,
        ip_address: newAudit.ipAddress,
        status: newAudit.status,
      }).then(({ error }) => { if (error) console.error("Supabase insert audit_log error:", error); });
    }
  };

  const updateTaskStatus = (taskId: string, status: TaskStatus) => {
    const updatedTasks = kanbanTasks.map(t => (t.id === taskId ? { ...t, status } : t));
    setKanbanTasks(updatedTasks);
    saveToStorage(bookings, customers, invoices, expenses, generatorLogs, updatedTasks, auditLogs);

    if (isSupabaseConfigured) {
      supabase.from("kanban_tasks").update({ status }).eq("id", taskId)
        .then(({ error }) => { if (error) console.error("Supabase update task status error:", error); });
    }
  };

  const addNewTask = (taskData: Omit<KanbanTask, "id" | "date">) => {
    const newTask: KanbanTask = {
      ...taskData,
      id: `t-${Date.now()}`,
      date: new Date().toISOString().split("T")[0],
    };
    const updatedTasks = [newTask, ...kanbanTasks];
    setKanbanTasks(updatedTasks);
    saveToStorage(bookings, customers, invoices, expenses, generatorLogs, updatedTasks, auditLogs);

    if (isSupabaseConfigured) {
      supabase.from("kanban_tasks").insert({
        id: newTask.id,
        title: newTask.title,
        assignee: newTask.assignee,
        due_date: newTask.date,
        status: newTask.status,
        priority: newTask.priority
      }).then(({ error }) => { if (error) console.error("Supabase insert task error:", error); });
    }
  };

  const addExpense = (expenseData: Omit<Expense, "id" | "date">) => {
    const newExpense: Expense = {
      ...expenseData,
      id: `exp-${Date.now()}`,
      date: new Date().toISOString().split("T")[0],
    };
    const updatedExpenses = [newExpense, ...expenses];
    setExpenses(updatedExpenses);
    saveToStorage(bookings, customers, invoices, updatedExpenses, generatorLogs, kanbanTasks, auditLogs);

    if (isSupabaseConfigured) {
      supabase.from("expenses").insert({
        id: newExpense.id,
        category: newExpense.category,
        amount: newExpense.amount,
        date: newExpense.date,
        description: newExpense.description || "",
        logged_by: newExpense.payee || "Staff"
      }).then(({ error }) => { if (error) console.error("Supabase insert expense error:", error); });
    }
  };

  const addBookingRequest = (reqData: Omit<BookingRequest, "id" | "createdAt" | "status">) => {
    const newId = `req-${Date.now()}`;
    const newRequest: BookingRequest = {
      ...reqData,
      id: newId,
      status: "Pending",
      createdAt: new Date().toISOString(),
    };
    const updatedRequests = [newRequest, ...bookingRequests];
    setBookingRequests(updatedRequests);

    const newAudit: AuditLog = {
      id: `l-${Date.now()}`,
      timestamp: new Date().toISOString(),
      user: user?.name || "Client Guest",
      action: `Submitted new booking request: ${reqData.customerName} (${reqData.eventType})`,
      ipAddress: "192.168.1.42",
      status: "Success"
    };
    const updatedAudits = [newAudit, ...auditLogs];
    setAuditLogs(updatedAudits);

    saveToStorage(bookings, customers, invoices, expenses, generatorLogs, kanbanTasks, updatedAudits, updatedRequests);

    if (isSupabaseConfigured) {
      supabase.from("booking_requests").insert({
        id: newId,
        customer_name: newRequest.customerName,
        phone_number: newRequest.phoneNumber,
        email: newRequest.email,
        venue: newRequest.venue,
        event_type: newRequest.eventType,
        event_date: newRequest.eventDate,
        event_session: newRequest.eventSession,
        guests: newRequest.guests,
        package_selected: newRequest.packageSelected,
        vendors: newRequest.vendors,
        additional_services: newRequest.additionalServices,
        pricing_breakdown: newRequest.pricingBreakdown,
        status: newRequest.status
      }).then(({ error }) => { if (error) console.error("Supabase insert booking_request error:", error); });

      supabase.from("audit_logs").insert({
        id: newAudit.id,
        timestamp: newAudit.timestamp,
        "user": newAudit.user,
        action: newAudit.action,
        ip_address: newAudit.ipAddress,
        status: newAudit.status,
      }).then(({ error }) => { if (error) console.error("Supabase insert audit_log error:", error); });
    }

    return newRequest;
  };

  const updateBookingRequestStatus = (id: string, status: BookingRequestStatus) => {
    const updatedRequests = bookingRequests.map(r => r.id === id ? { ...r, status } : r);
    setBookingRequests(updatedRequests);

    const req = bookingRequests.find(r => r.id === id);
    const newAudit: AuditLog = {
      id: `l-${Date.now()}`,
      timestamp: new Date().toISOString(),
      user: user?.name || "Owner (admin)",
      action: `Updated booking request ${req?.customerName || id} status to ${status}`,
      ipAddress: "192.168.1.42",
      status: "Success"
    };
    const updatedAudits = [newAudit, ...auditLogs];
    setAuditLogs(updatedAudits);

    saveToStorage(bookings, customers, invoices, expenses, generatorLogs, kanbanTasks, updatedAudits, updatedRequests);

    if (isSupabaseConfigured) {
      supabase.from("booking_requests").update({ status }).eq("id", id)
        .then(({ error }) => { if (error) console.error("Supabase update request status error:", error); });

      supabase.from("audit_logs").insert({
        id: newAudit.id,
        timestamp: newAudit.timestamp,
        "user": newAudit.user,
        action: newAudit.action,
        ip_address: newAudit.ipAddress,
        status: newAudit.status,
      }).then(({ error }) => { if (error) console.error("Supabase insert audit_log error:", error); });
    }
  };

  const updateBookingRequest = (id: string, requestDetails: Partial<BookingRequest>) => {
    const updatedRequests = bookingRequests.map(r => r.id === id ? { ...r, ...requestDetails } : r);
    setBookingRequests(updatedRequests);

    const req = bookingRequests.find(r => r.id === id);
    const newAudit: AuditLog = {
      id: `l-${Date.now()}`,
      timestamp: new Date().toISOString(),
      user: user?.name || "Owner (admin)",
      action: `Modified booking request details for ${req?.customerName || id}`,
      ipAddress: "192.168.1.42",
      status: "Success"
    };
    const updatedAudits = [newAudit, ...auditLogs];
    setAuditLogs(updatedAudits);

    saveToStorage(bookings, customers, invoices, expenses, generatorLogs, kanbanTasks, updatedAudits, updatedRequests);

    if (isSupabaseConfigured) {
      supabase.from("booking_requests").update(requestDetails).eq("id", id)
        .then(({ error }) => { if (error) console.error("Supabase update request details error:", error); });

      supabase.from("audit_logs").insert({
        id: newAudit.id,
        timestamp: newAudit.timestamp,
        "user": newAudit.user,
        action: newAudit.action,
        ip_address: newAudit.ipAddress,
        status: newAudit.status,
      }).then(({ error }) => { if (error) console.error("Supabase insert audit_log error:", error); });
    }
  };

  const convertRequestToBooking = (id: string) => {
    const req = bookingRequests.find(r => r.id === id);
    if (!req) return;

    const bookingAmt = req.pricingBreakdown.grandTotal;
    
    const newId = `b-${Date.now()}`;
    const newBooking: Booking = {
      id: newId,
      customerName: req.customerName,
      customerPhoto: "https://images.unsplash.com/photo-1621574539437-4b7cb63120b8?auto=format&fit=crop&q=80&w=200",
      venueName: req.venue === "Hall + Lawn" ? "Maharaja Grand Hall + Royal Lawns" : "Maharaja Grand Hall",
      bookingType: req.eventType as BookingType,
      bookingDate: req.eventDate,
      guestCount: req.guests,
      amount: bookingAmt,
      status: "Confirmed",
      progress: 10,
      packageSelected: `${req.packageSelected} Package`,
      phoneNumber: req.phoneNumber,
      email: req.email,
    };
    
    const updatedBookings = [newBooking, ...bookings];
    setBookings(updatedBookings);

    const updatedRequests = bookingRequests.map(r => r.id === id ? { ...r, status: "Approved" as const } : r);
    setBookingRequests(updatedRequests);

    const newInvoiceId = `inv-${Date.now()}`;
    const taxableVal = Math.round(bookingAmt / 1.18);
    const taxAmt = Math.round(taxableVal * 0.09);
    const newInvoice: Invoice = {
      id: newInvoiceId,
      invoiceNo: `BL-2026-${Math.floor(Math.random() * 900) + 100}`,
      clientName: req.customerName.split("'s")[0],
      date: new Date().toISOString().split("T")[0],
      bookingId: newId,
      bookingType: req.eventType as BookingType,
      taxableAmount: taxableVal,
      cgst: taxAmt,
      sgst: taxAmt,
      totalAmount: bookingAmt,
      status: "Paid",
    };
    const updatedInvoices = [newInvoice, ...invoices];
    setInvoices(updatedInvoices);

    let updatedCustomers = [...customers];
    const existingCust = customers.find(c => c.name.toLowerCase() === req.customerName.toLowerCase() || c.phone === req.phoneNumber);
    let targetCust: Customer;
    if (!existingCust) {
      const newCustId = `c-${Date.now()}`;
      targetCust = {
        id: newCustId,
        name: req.customerName.split("'s")[0].split(" & ")[0] || req.customerName,
        photo: "https://images.unsplash.com/photo-1621574539437-4b7cb63120b8?auto=format&fit=crop&q=80&w=200",
        phone: req.phoneNumber,
        email: req.email,
        address: "Ahilyanagar, Maharashtra",
        totalSpent: bookingAmt,
        bookingCount: 1,
        notes: [{ id: `n-${Date.now()}`, date: new Date().toISOString().split("T")[0], text: `Converted from booking request: ${req.eventType}` }],
        whatsappHistory: [
          { id: `w-${Date.now()}`, sender: "owner", text: `Your booking request has been converted to a confirmed booking!`, timestamp: new Date().toISOString() }
        ]
      };
      updatedCustomers = [targetCust, ...customers];
      setCustomers(updatedCustomers);
    } else {
      updatedCustomers = customers.map(c => {
        if (c.id === existingCust.id) {
          targetCust = {
            ...c,
            bookingCount: c.bookingCount + 1,
            totalSpent: c.totalSpent + bookingAmt,
          };
          return targetCust;
        }
        return c;
      });
      setCustomers(updatedCustomers);
      targetCust = updatedCustomers.find(c => c.id === existingCust.id)!;
    }

    const newTasks = [
      {
        id: `t-${Date.now()}`,
        title: `Setup seating layout for ${req.customerName}`,
        category: "Operations",
        description: `Configure seating for ${req.guests} guests.`,
        assignee: "Sanjay Shinde",
        status: "Todo" as const,
        priority: "Medium" as const,
        date: new Date().toISOString().split("T")[0]
      },
      {
        id: `t-${Date.now() + 1}`,
        title: `Clean suites for ${req.customerName}`,
        category: "Housekeeping",
        description: `Prepare bridal suite and guest rooms.`,
        assignee: "Suman Bai",
        status: "Todo" as const,
        priority: "High" as const,
        date: new Date().toISOString().split("T")[0]
      }
    ];
    const updatedTasks = [...newTasks, ...kanbanTasks];
    setKanbanTasks(updatedTasks);

    const newAudit: AuditLog = {
      id: `l-${Date.now()}`,
      timestamp: new Date().toISOString(),
      user: user?.name || "Owner (admin)",
      action: `Converted Booking Request ${req.customerName} to Confirmed Booking ${newId}`,
      ipAddress: "192.168.1.42",
      status: "Success"
    };
    const updatedAudits = [newAudit, ...auditLogs];
    setAuditLogs(updatedAudits);

    saveToStorage(updatedBookings, updatedCustomers, updatedInvoices, expenses, generatorLogs, updatedTasks, updatedAudits, updatedRequests);

    if (isSupabaseConfigured) {
      supabase.from("bookings").insert({
        id: newId,
        customer_name: newBooking.customerName,
        customer_photo: newBooking.customerPhoto,
        email: newBooking.email,
        phone_number: newBooking.phoneNumber,
        venue_name: newBooking.venueName,
        booking_date: newBooking.bookingDate,
        guest_count: newBooking.guestCount,
        amount: newBooking.amount,
        advance_paid: 0,
        status: newBooking.status,
        progress: newBooking.progress,
        package_selected: newBooking.packageSelected,
      }).then(({ error }) => { if (error) console.error("Supabase insert booking (convert) error:", error); });

      supabase.from("booking_requests").update({ status: "Approved" }).eq("id", id)
        .then(({ error }) => { if (error) console.error("Supabase update request status (convert) error:", error); });

      supabase.from("invoices").insert({
        id: newInvoiceId,
        booking_id: newId,
        client_name: newInvoice.clientName,
        date: newInvoice.date,
        amount: newInvoice.totalAmount,
        status: newInvoice.status,
        gst_number: ""
      }).then(({ error }) => { if (error) console.error("Supabase insert invoice (convert) error:", error); });

      if (targetCust) {
        supabase.from("customers").upsert({
          id: targetCust.id,
          name: targetCust.name,
          photo: targetCust.photo,
          phone: targetCust.phone,
          email: targetCust.email,
          address: targetCust.address,
          total_spent: targetCust.totalSpent,
          booking_count: targetCust.bookingCount,
          notes: targetCust.notes,
          whatsapp_history: targetCust.whatsappHistory,
        }).then(({ error }) => { if (error) console.error("Supabase upsert customer (convert) error:", error); });
      }

      supabase.from("kanban_tasks").insert(newTasks.map(t => ({
        id: t.id,
        title: t.title,
        assignee: t.assignee,
        due_date: t.date,
        status: t.status,
        priority: t.priority
      }))).then(({ error }) => { if (error) console.error("Supabase insert tasks (convert) error:", error); });

      supabase.from("audit_logs").insert({
        id: newAudit.id,
        timestamp: newAudit.timestamp,
        "user": newAudit.user,
        action: newAudit.action,
        ip_address: newAudit.ipAddress,
        status: newAudit.status,
      }).then(({ error }) => { if (error) console.error("Supabase insert audit_log (convert) error:", error); });
    }
  };

  const addVendor = (vendorData: Omit<Vendor, "id">) => {
    const newId = `v-${Date.now()}`;
    const newVendor: Vendor = {
      ...vendorData,
      id: newId,
    };
    const updatedVendors = [newVendor, ...vendors];
    setVendors(updatedVendors);

    const newAudit: AuditLog = {
      id: `l-${Date.now()}`,
      timestamp: new Date().toISOString(),
      user: user?.name || "Owner (admin)",
      action: `Created new marketplace vendor: ${vendorData.name}`,
      ipAddress: "192.168.1.42",
      status: "Success"
    };
    const updatedAudits = [newAudit, ...auditLogs];
    setAuditLogs(updatedAudits);

    saveToStorage(bookings, customers, invoices, expenses, generatorLogs, kanbanTasks, updatedAudits, bookingRequests, updatedVendors);

    if (isSupabaseConfigured) {
      supabase.from("vendors").insert({
        id: newId,
        name: newVendor.name,
        category: newVendor.category,
        logo: newVendor.logo,
        cover_image: newVendor.coverImage,
        price: newVendor.price,
        location: newVendor.location,
        phone: newVendor.phone,
        email: newVendor.email,
        instagram: newVendor.instagram,
        whatsapp: newVendor.whatsapp,
        commission_percentage: newVendor.commissionPercentage,
        rating: newVendor.rating,
        completed_weddings: newVendor.completedWeddings,
        featured: newVendor.featured,
        gallery: newVendor.gallery,
        menu_items: newVendor.menuItems,
        photography_portfolio: newVendor.photographyPortfolio
      }).then(({ error }) => { if (error) console.error("Supabase insert vendor error:", error); });

      supabase.from("audit_logs").insert({
        id: newAudit.id,
        timestamp: newAudit.timestamp,
        "user": newAudit.user,
        action: newAudit.action,
        ip_address: newAudit.ipAddress,
        status: newAudit.status,
      }).then(({ error }) => { if (error) console.error("Supabase insert audit_log error:", error); });
    }
  };

  const updateVendor = (id: string, vendorDetails: Partial<Vendor>) => {
    const updatedVendors = vendors.map(v => v.id === id ? { ...v, ...vendorDetails } : v);
    setVendors(updatedVendors);

    const vdr = vendors.find(v => v.id === id);
    const newAudit: AuditLog = {
      id: `l-${Date.now()}`,
      timestamp: new Date().toISOString(),
      user: user?.name || "Owner (admin)",
      action: `Updated marketplace vendor details for ${vdr?.name || id}`,
      ipAddress: "192.168.1.42",
      status: "Success"
    };
    const updatedAudits = [newAudit, ...auditLogs];
    setAuditLogs(updatedAudits);

    saveToStorage(bookings, customers, invoices, expenses, generatorLogs, kanbanTasks, updatedAudits, bookingRequests, updatedVendors);

    if (isSupabaseConfigured) {
      supabase.from("vendors").update({
        name: vendorDetails.name,
        category: vendorDetails.category,
        logo: vendorDetails.logo,
        cover_image: vendorDetails.coverImage,
        price: vendorDetails.price,
        location: vendorDetails.location,
        phone: vendorDetails.phone,
        email: vendorDetails.email,
        instagram: vendorDetails.instagram,
        whatsapp: vendorDetails.whatsapp,
        commission_percentage: vendorDetails.commissionPercentage,
        rating: vendorDetails.rating,
        completed_weddings: vendorDetails.completedWeddings,
        featured: vendorDetails.featured,
        gallery: vendorDetails.gallery,
        menu_items: vendorDetails.menuItems,
        photography_portfolio: vendorDetails.photographyPortfolio
      }).eq("id", id).then(({ error }) => { if (error) console.error("Supabase update vendor error:", error); });

      supabase.from("audit_logs").insert({
        id: newAudit.id,
        timestamp: newAudit.timestamp,
        "user": newAudit.user,
        action: newAudit.action,
        ip_address: newAudit.ipAddress,
        status: newAudit.status,
      }).then(({ error }) => { if (error) console.error("Supabase insert audit_log error:", error); });
    }
  };

  const updateConfigSettings = (newConfig: Partial<ERPConfig>) => {
    const updatedConfig = {
      ...configSettings,
      ...newConfig,
    };
    setConfigSettings(updatedConfig);

    const newAudit: AuditLog = {
      id: `l-${Date.now()}`,
      timestamp: new Date().toISOString(),
      user: user?.name || "Owner (admin)",
      action: `Modified ERP system cost settings`,
      ipAddress: "192.168.1.42",
      status: "Success"
    };
    const updatedAudits = [newAudit, ...auditLogs];
    setAuditLogs(updatedAudits);

    saveToStorage(bookings, customers, invoices, expenses, generatorLogs, kanbanTasks, updatedAudits, bookingRequests, vendors, updatedConfig);

    if (isSupabaseConfigured) {
      supabase.from("erp_config").upsert({
        id: "default",
        hall_price: updatedConfig.hallPrice,
        hall_lawn_price: updatedConfig.hallLawnPrice,
        generator_cost_per_hour: updatedConfig.generatorCostPerHour,
        electricity_cost_per_unit: updatedConfig.electricityCostPerUnit,
        gst_percentage: updatedConfig.gstPercentage,
        discount_default: updatedConfig.discountDefault,
        invoice_template: updatedConfig.invoiceTemplate,
        vendor_categories: updatedConfig.vendorCategories,
        package_templates: updatedConfig.packageTemplates
      }).then(({ error }) => { if (error) console.error("Supabase upsert erp_config error:", error); });

      supabase.from("audit_logs").insert({
        id: newAudit.id,
        timestamp: newAudit.timestamp,
        "user": newAudit.user,
        action: newAudit.action,
        ip_address: newAudit.ipAddress,
        status: newAudit.status,
      }).then(({ error }) => { if (error) console.error("Supabase insert audit_log error:", error); });
    }
  };

  const clearAllDatabaseData = async () => {
    setBookings([]);
    setCustomers([]);
    setInvoices([]);
    setExpenses([]);
    setGeneratorLogs([]);
    setKanbanTasks([]);
    setAuditLogs([]);
    setBookingRequests([]);

    localStorage.removeItem("bl_bookings");
    localStorage.removeItem("bl_customers");
    localStorage.removeItem("bl_invoices");
    localStorage.removeItem("bl_expenses");
    localStorage.removeItem("bl_genLogs");
    localStorage.removeItem("bl_tasks");
    localStorage.removeItem("bl_audits");
    localStorage.removeItem("bl_booking_requests");

    if (isSupabaseConfigured) {
      try {
        await Promise.all([
          supabase.from("bookings").delete().neq("id", ""),
          supabase.from("booking_requests").delete().neq("id", ""),
          supabase.from("customers").delete().neq("id", ""),
          supabase.from("invoices").delete().neq("id", ""),
          supabase.from("expenses").delete().neq("id", ""),
          supabase.from("generator_logs").delete().neq("id", ""),
          supabase.from("kanban_tasks").delete().neq("id", ""),
          supabase.from("audit_logs").delete().neq("id", ""),
        ]);
        console.log("Bhagyalaxmi ERP: Supabase tables cleared of client and booking data.");
      } catch (err) {
        console.error("Bhagyalaxmi ERP: Error clearing Supabase tables:", err);
      }
    }
  };

  const syncDatabase = () => {
    setDbSyncInProgress(true);
    setTimeout(() => {
      setDbSyncInProgress(false);
      const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      setLastSyncTime(`Synced at ${now}`);
      
      setSystemHealth({
        cpu: Math.floor(Math.random() * 20) + 10,
        memory: Math.floor(Math.random() * 15) + 35,
        disk: 55,
        apiLatency: Math.floor(Math.random() * 8) + 8,
      });

      const newAudit: AuditLog = {
        id: `l-${Date.now()}`,
        timestamp: new Date().toISOString(),
        user: user?.name || "Owner (admin)",
        action: "Synchronized local cache database with Ahilyanagar cloud server",
        ipAddress: "192.168.1.42",
        status: "Success"
      };
      setAuditLogs(prev => {
        const updated = [newAudit, ...prev];
        localStorage.setItem("bl_audits", JSON.stringify(updated));
        return updated;
      });
    }, 2000);
  };

  return (
    <ERPContext.Provider
      value={{
        bookings,
        customers,
        invoices,
        expenses,
        generatorLogs,
        generatorFuelLevel,
        generatorRuntimeHours,
        kanbanTasks,
        auditLogs,
        systemHealth,
        dbSyncInProgress,
        lastSyncTime,
        bookingRequests,
        vendors,
        configSettings,
        user,
        authLoading,
        loginWithGoogle,
        sendOTP,
        verifyOTP,
        logout,
        hasPermission,
        weatherData,
        weatherLoading,
        refreshWeather: fetchWeather,
        addBooking,
        updateBookingStatus,
        updateBookingDate,
        addCustomerNote,
        sendWhatsAppMessage,
        addGeneratorLog,
        updateTaskStatus,
        addNewTask,
        addExpense,
        syncDatabase,
        activeView,
        setActiveView,
        searchQuery,
        setSearchQuery,
        addBookingRequest,
        updateBookingRequestStatus,
        updateBookingRequest,
        convertRequestToBooking,
        addVendor,
        updateVendor,
        updateConfigSettings,
        clearAllDatabaseData,
        dbError,
      }}
    >
      {children}
    </ERPContext.Provider>
  );
};

export const useERP = () => {
  const context = useContext(ERPContext);
  if (context === undefined) {
    throw new Error("useERP must be used within an ERPProvider");
  }
  return context;
};
