"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import {
  MapPin,
  Calendar,
  Users,
  Utensils,
  Camera,
  Music,
  Heart,
  Sparkles,
  ChevronRight,
  ChevronDown,
  Phone,
  Mail,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Award,
  ShieldCheck,
  Star,
  CheckCircle,
} from "lucide-react";
import { useERP } from "@/context/ERPContext";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlassButton } from "@/components/ui/GlassButton";
import { GlassInput } from "@/components/ui/GlassInput";

interface LuxuryStorytellingViewProps {
  onStartBooking: () => void;
}

export const LuxuryStorytellingView: React.FC<LuxuryStorytellingViewProps> = ({ onStartBooking }) => {
  const { configSettings, vendors } = useERP();

  // Scroll reference for parallax effects
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Sound toggles for video sections
  const [heroMuted, setHeroMuted] = useState(true);
  const [walkthroughPlaying, setWalkthroughPlaying] = useState(false);
  const walkthroughVideoRef = useRef<HTMLVideoElement>(null);

  // Testimonials slider index
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  // Contact Form States
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactMessage, setContactMessage] = useState("");
  const [messageSent, setMessageSent] = useState(false);

  // FAQ Accordion State
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  // Before/After comparison slider states and handlers
  const [sliderPos, setSliderPos] = useState(50);
  const sliderRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (sliderRef.current) {
      const rect = sliderRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
      setSliderPos(percentage);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (sliderRef.current && e.touches[0]) {
      const rect = sliderRef.current.getBoundingClientRect();
      const x = e.touches[0].clientX - rect.left;
      const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
      setSliderPos(percentage);
    }
  };

  const testimonials = [
    {
      quote: "Our wedding was a fairytale. The transition from the massive Royal Lawn to the grand air-conditioned banquet hall felt seamless. The Maharaja Grand Hall is simply unmatched in Ahilyanagar.",
      author: "Snehal & Rahul Deshmukh",
      date: "December 2025",
      type: "Royal Package Wedding",
    },
    {
      quote: "The generator back-up, the luxurious bridal suites, and their on-site operations team handled our 2,500 guests with absolute professionalism. Highly recommend the Hall + Lawn package.",
      author: "Aditi & Vikram Patil",
      date: "January 2026",
      type: "Luxury Package Reception",
    },
    {
      quote: "Bhagyalaxmi Lawns made our family event stress-free. From catering menus featuring Puran Poli to custom decoration themes, everything was top-notch.",
      author: "Meera & Sanjay Shinde",
      date: "March 2026",
      type: "Gold Package Engagement",
    },
  ];

  const faqs = [
    {
      q: "What is the capacity of the venues?",
      a: "The Maharaja Grand Hall comfortably hosts up to 1,200 guests indoors, while our combined Hall + Lawn package can accommodate grand celebrations of up to 3,700 guests.",
    },
    {
      q: "How are session timings managed?",
      a: "We offer full-day sessions (typically 8:00 AM to 5:00 PM for traditional morning ceremonies) and night sessions (6:00 PM onwards). Night sessions automatically include premium high-capacity generator lighting.",
    },
    {
      q: "Can we configure catering and decorations ourselves?",
      a: "Absolutely. You can select premium packages (Silver, Gold, Royal, Luxury) or coordinate directly with external vendors of your choice. We also offer a curated list of trusted marketplace partners.",
    },
    {
      q: "Is there sufficient parking space?",
      a: "Yes. Bhagyalaxmi Lawns features an exclusive, secure multi-zone parking area capable of hosting over 300 vehicles with dedicated security staff.",
    },
  ];

  // Auto-scroll testimonials
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  const toggleWalkthrough = () => {
    if (walkthroughVideoRef.current) {
      if (walkthroughPlaying) {
        walkthroughVideoRef.current.pause();
      } else {
        walkthroughVideoRef.current.play();
      }
      setWalkthroughPlaying(!walkthroughPlaying);
    }
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (contactName && contactEmail && contactMessage) {
      setMessageSent(true);
      setContactName("");
      setContactEmail("");
      setContactMessage("");
      setTimeout(() => setMessageSent(false), 5000);
    }
  };

  const scrollToIntro = () => {
    const aboutSection = document.getElementById("entrance");
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div ref={containerRef} className="relative w-full bg-[#FAF7F2] text-[#2C2520] overflow-hidden select-none">
      
      {/* ==========================================
          SECTION 1: HERO VIDEO & GLASS NAVIGATION
         ========================================== */}
      <section className="relative h-screen w-full flex flex-col justify-between overflow-hidden">
        
        {/* Loop Drone Video Background */}
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            loop
            muted={heroMuted}
            playsInline
            className="w-full h-full object-cover scale-105"
          >
            <source src="/assets/videos/01_hero_drone.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-[#1C1613]/55 via-transparent to-[#1C1613]/70 z-10" />
        </div>

        {/* Floating Glassmorphism Navigation */}
        <header className="relative z-20 w-full px-6 py-4 md:px-12 flex justify-between items-center bg-white/5 backdrop-blur-md border-b border-white/10 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl overflow-hidden border border-white/20 bg-white">
              <img src="/logo.jpg" alt="Bhagyalaxmi Logo" className="w-full h-full object-cover" />
            </div>
            <div>
              <span className="text-sm font-extrabold text-white tracking-widest uppercase">Bhagyalaxmi</span>
              <p className="text-[8px] font-black text-amber-400 tracking-wider uppercase leading-none">Lawns & Banquet Hall</p>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-xs font-bold uppercase tracking-widest text-white/80">
            <a href="#entrance" className="hover:text-white transition-all">Entrance</a>
            <a href="#hall" className="hover:text-white transition-all">Hall</a>
            <a href="#stage" className="hover:text-white transition-all">Stage</a>
            <a href="#event" className="hover:text-white transition-all">Event</a>
            <a href="#transformation" className="hover:text-white transition-all">Before/After</a>
            <a href="#overview" className="hover:text-white transition-all">Overview</a>
            <a href="#gallery" className="hover:text-white transition-all">Gallery</a>
          </nav>

          <GlassButton
            onClick={onStartBooking}
            className="px-6 py-2 border-white/20 text-xs font-bold uppercase tracking-wider bg-white/10 text-white hover:bg-white/20"
          >
            Book Now
          </GlassButton>
        </header>

        {/* Hero Central Headline */}
        <div className="relative z-20 flex-grow flex flex-col justify-center items-center text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2 }}
            className="space-y-4 max-w-3xl"
          >
            <span className="flex items-center justify-center gap-2 text-[10px] md:text-xs font-bold uppercase tracking-[0.25em] text-amber-400">
              <Sparkles size={14} /> Luxury Landmark in Ahilyanagar
            </span>
            <h1 className="text-4xl md:text-7xl font-extrabold text-white tracking-tight uppercase leading-none drop-shadow-sm font-serif">
              Your moments.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200">Our venue.</span>
            </h1>
            <p className="text-sm md:text-lg text-white/70 max-w-xl mx-auto font-medium leading-relaxed font-sans pt-2">
              Embark on a luxury storytelling experience. Explore the majestic spaces of Bhagyalaxmi Lawns & Banquet Hall.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 mt-8"
          >
            <GlassButton
              variant="gold"
              onClick={onStartBooking}
              className="py-3 px-8 text-xs font-extrabold uppercase tracking-widest shadow-xl hover:-translate-y-0.5 transition-all"
            >
              Book Your Event
            </GlassButton>
            <GlassButton
              onClick={scrollToIntro}
              className="py-3 px-8 text-xs font-bold uppercase tracking-widest border-white/20 text-white bg-white/5 hover:bg-white/15"
            >
              Explore Venue
            </GlassButton>
          </motion.div>
        </div>

        {/* Video Audio Control & Scroll Indicator */}
        <div className="relative z-20 px-6 py-6 md:px-12 flex justify-between items-center text-white/60 text-[10px] font-bold tracking-widest uppercase">
          <button
            onClick={() => setHeroMuted(!heroMuted)}
            className="flex items-center gap-2 hover:text-white transition-all bg-black/30 backdrop-blur-md px-3.5 py-2 rounded-full border border-white/10"
          >
            {heroMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
            <span>{heroMuted ? "Sound Off" : "Sound On"}</span>
          </button>
          
          <button
            onClick={scrollToIntro}
            className="flex flex-col items-center gap-1 hover:text-white transition-all animate-bounce"
          >
            <span>Scroll to Discover</span>
            <ChevronDown size={14} />
          </button>
          
          <span className="hidden md:inline bg-black/30 backdrop-blur-md px-3.5 py-2 rounded-full border border-white/10">
            Bhingar, Ahilyanagar
          </span>
        </div>
      </section>

      {/* ==========================================
          SECTION 2: GRAND ENTRANCE
         ========================================== */}
      <section id="entrance" className="py-24 px-6 md:px-12 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="space-y-6"
        >
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#D4AF37] flex items-center gap-1.5">
            <Sparkles size={14} /> First Impression
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-purple-royal tracking-tight uppercase leading-tight font-serif">
            The Grand Entrance
          </h2>
          <div className="h-0.5 w-20 bg-gradient-to-r from-gold-luxury to-purple-royal rounded" />
          <p className="text-sm md:text-base text-charcoal-dark/70 leading-relaxed pt-2">
            As your guests arrive at Bhagyalaxmi Lawns, they are welcomed by a majestic portal of shimmering lights, welcoming warm spotlights, and beautifully landscaped floral pathways.
          </p>
          <p className="text-sm text-charcoal-dark/65 leading-relaxed">
            The entrance zone sets a premium mood of luxury and high hospitality. Paved walkways and vast structural facades allow for stunning arrivals, photography backdrops, and traditional welcoming bands.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="relative rounded-3xl overflow-hidden shadow-2xl h-[400px] border border-purple-royal/10"
        >
          <img
            src="/assets/images/06_main_entrance.jpg"
            alt="Grand Entrance"
            className="w-full h-full object-cover"
          />
        </motion.div>
      </section>

      {/* ==========================================
          SECTION 3: WIDE HALL VIEW
         ========================================== */}
      <section id="hall" className="py-24 bg-purple-royal/[0.01] border-y border-purple-royal/5">
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="relative rounded-3xl overflow-hidden shadow-2xl h-[400px] border border-purple-royal/10 order-2 lg:order-1"
          >
            <img
              src="/assets/images/02_grand_hall_wide.jpg"
              alt="Maharaja Grand Hall Wide View"
              className="w-full h-full object-cover"
            />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="space-y-6 order-1 lg:order-2"
          >
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#D4AF37] flex items-center gap-1.5">
              <Award size={14} /> Opulent Scale
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-purple-royal tracking-tight uppercase leading-tight font-serif">
              Wide Hall View
            </h2>
            <div className="h-0.5 w-20 bg-gradient-to-r from-gold-luxury to-purple-royal rounded" />
            <p className="text-sm md:text-base text-charcoal-dark/70 leading-relaxed pt-2">
              Step inside the Maharaja Grand Hall—a breathtaking, column-free banquet space with central air conditioning, soaring high ceilings, and majestic chandeliers, perfectly designed to host up to 1,200 guests.
            </p>
            <p className="text-sm text-charcoal-dark/65 leading-relaxed">
              Our architecture ensures clean, unobstructed sightlines from every single seat so that your family and guests feel intimately connected to the center stage during every wedding ritual.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ==========================================
          SECTION 4: DECORATED STAGE
         ========================================== */}
      <section id="stage" className="py-24 px-6 md:px-12 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="space-y-6"
        >
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#D4AF37] flex items-center gap-1.5">
            <Heart size={14} /> Custom Setup
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-purple-royal tracking-tight uppercase leading-tight font-serif">
            Decorated Stages
          </h2>
          <div className="h-0.5 w-20 bg-gradient-to-r from-gold-luxury to-purple-royal rounded" />
          <p className="text-sm md:text-base text-charcoal-dark/70 leading-relaxed pt-2">
            Our creative decorators construct custom dream mandaps and stages, using premium materials, structural arches, imported roses, lilies, and intelligent backdrop lighting designs.
          </p>
          <p className="text-sm text-charcoal-dark/65 leading-relaxed">
            From traditional marigold themes to bespoke contemporary setups, we provide the ultimate backdrop for your photographs and life-defining moments.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="relative rounded-3xl overflow-hidden shadow-2xl h-[400px] border border-purple-royal/10"
        >
          <img
            src="/assets/images/03_stage_purple_theme.jpg"
            alt="Decorated Stage"
            className="w-full h-full object-cover"
          />
        </motion.div>
      </section>

      {/* ==========================================
          SECTION 5: REAL WEDDING EVENT
         ========================================== */}
      <section id="event" className="py-32 bg-purple-royal text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover opacity-25 scale-105"
          >
            <source src="/assets/videos/02_wedding_highlights.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-[#1C1613]/80 via-transparent to-[#1C1613]/90 z-10" />
        </div>
        
        <div className="max-w-4xl mx-auto space-y-6 relative z-20 px-6">
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-amber-400">Live Energy</span>
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight font-serif">
            Real Wedding Experiences
          </h2>
          <div className="h-0.5 w-16 bg-amber-400 rounded mx-auto" />
          <p className="text-sm md:text-lg text-white/80 max-w-2xl mx-auto leading-relaxed">
            Experience the grandeur, joy, music, and vibrant atmosphere of a live wedding celebration hosted at Bhagyalaxmi Lawns. Our venues deliver memories that endure for generations.
          </p>
        </div>
      </section>

      {/* ==========================================
          SECTION 6: EMPTY HALL -> DECORATED COMPARISON
         ========================================== */}
      <section id="transformation" className="py-24 bg-[#FAF7F2] border-t border-purple-royal/5">
        <div className="max-w-5xl mx-auto px-6 md:px-12 space-y-12">
          <div className="text-center space-y-3">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#D4AF37]">Visual Metamorphosis</span>
            <h2 className="text-3xl md:text-5xl font-black text-purple-royal tracking-tight uppercase leading-none font-serif">
              Raw Canvas vs Decorated Masterpiece
            </h2>
            <div className="h-0.5 w-16 bg-gradient-to-r from-gold-luxury to-purple-royal rounded mx-auto" />
            <p className="text-xs text-charcoal-dark/50 max-w-md mx-auto leading-normal">
              Hover and slide your cursor/touch across the frame to watch our empty grand hall morph into a decorated, high-energy wedding celebration.
            </p>
          </div>

          <div
            ref={sliderRef}
            onMouseMove={handleMouseMove}
            onTouchMove={handleTouchMove}
            className="relative h-[480px] w-full rounded-3xl overflow-hidden shadow-2xl cursor-ew-resize select-none border border-purple-royal/10"
          >
            {/* Base Image (Empty Hall) */}
            <img
              src="/assets/images/05_empty_hall.jpg"
              alt="Empty Hall"
              className="absolute inset-0 w-full h-full object-cover pointer-events-none"
            />

            {/* Overlapping Image (Decorated Event) */}
            <div
              className="absolute inset-0 overflow-hidden pointer-events-none"
              style={{ width: `${sliderPos}%` }}
            >
              <img
                src="/assets/images/01_hall_event_view.jpg"
                alt="Decorated Hall"
                className="absolute inset-0 w-full h-full object-cover pointer-events-none max-w-none"
                style={{ width: sliderRef.current ? sliderRef.current.getBoundingClientRect().width : "100%" }}
              />
            </div>

            {/* Divider Line */}
            <div
              className="absolute top-0 bottom-0 w-1 bg-amber-400 shadow-xl pointer-events-none"
              style={{ left: `${sliderPos}%` }}
            >
              <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-amber-400 border-2 border-white shadow flex items-center justify-center text-[10px] font-black text-purple-royal">
                ↔
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          SECTION 7: VENUE OVERVIEW (WHATSAPP VIDEO)
         ========================================== */}
      <section id="overview" className="py-24 bg-gradient-to-b from-[#FAF7F2] to-white border-y border-purple-royal/5">
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="space-y-6"
          >
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#D4AF37] flex items-center gap-1.5">
              <Sparkles size={14} /> Immersive Overview
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-purple-royal tracking-tight uppercase leading-tight font-serif">
              Venue Overview
            </h2>
            <div className="h-0.5 w-20 bg-gradient-to-r from-gold-luxury to-purple-royal rounded" />
            <p className="text-sm md:text-base text-charcoal-dark/70 leading-relaxed pt-2">
              Get an intimate look at the visual ambiance and layout of our property. This exclusive overview showcases the flow of the venue, including guest corridors, entry portals, and seating zones.
            </p>
            <p className="text-sm text-charcoal-dark/65 leading-relaxed">
              Press play to watch the cinematic walkthrough showcasing why Bhagyalaxmi Lawns is the most sought-after wedding destination.
            </p>
          </motion.div>

          <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-purple-royal/10 h-[380px]">
            <video
              ref={walkthroughVideoRef}
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
            >
              <source src="/assets/videos/whatsapp_video.mp4" type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-black/35 flex flex-col justify-center items-center text-center p-6 z-10">
              <button
                onClick={toggleWalkthrough}
                className="w-16 h-16 rounded-full bg-white text-purple-royal flex items-center justify-center shadow-2xl hover:scale-110 transition-all text-xl mb-4 border-2 border-amber-400"
              >
                {walkthroughPlaying ? <Pause size={20} className="fill-current" /> : <Play size={20} className="ml-1 fill-current" />}
              </button>
              <h3 className="text-lg font-serif text-white font-extrabold uppercase">Play Overview</h3>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          SECTION 8: GALLERY (INSPIRATION)
         ========================================== */}
      <section id="gallery" className="py-24 max-w-7xl mx-auto px-6 md:px-12 space-y-16">
        <div className="text-center space-y-3">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#D4AF37]">Visual Gallery</span>
          <h2 className="text-3xl md:text-5xl font-black text-purple-royal tracking-tight uppercase leading-none font-serif">
            Wedding Inspiration Gallery
          </h2>
          <div className="h-0.5 w-16 bg-gradient-to-r from-gold-luxury to-purple-royal rounded mx-auto" />
          <p className="text-xs text-charcoal-dark/50 max-w-md mx-auto leading-normal">
            A curated look at actual mandap setups, royal theme stages, and lighting styles designed on-site.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="relative rounded-3xl overflow-hidden group shadow-md h-72">
            <img
              src="/assets/images/03_stage_purple_theme.jpg"
              alt="Purple Theme Mandap"
              className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center p-4 text-center">
              <div className="text-white space-y-1">
                <h4 className="font-bold text-sm uppercase">Royal Purple Theme</h4>
                <p className="text-[10px] text-white/80">Premium marigold and violet floral curtains</p>
              </div>
            </div>
          </div>

          <div className="relative rounded-3xl overflow-hidden group shadow-md h-72">
            <img
              src="/assets/images/04_stage_emerald_theme.jpg"
              alt="Emerald Theme Mandap"
              className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center p-4 text-center">
              <div className="text-white space-y-1">
                <h4 className="font-bold text-sm uppercase">Emerald Green Mandap</h4>
                <p className="text-[10px] text-white/80">Exotic orchids and foliage arches</p>
              </div>
            </div>
          </div>

          <div className="relative rounded-3xl overflow-hidden group shadow-md h-72">
            <img
              src="/assets/images/06_main_entrance.jpg"
              alt="Grand Main Entrance"
              className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center p-4 text-center">
              <div className="text-white space-y-1">
                <h4 className="font-bold text-sm uppercase">Grand Welcoming Entrance</h4>
                <p className="text-[10px] text-white/80">Shimmering fairy light tunnels and warm spotlights</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          SECTION 6: VENDOR MARKETPLACE PREVIEW
         ========================================== */}
      <section id="marketplace" className="py-24 bg-gradient-to-b from-white to-[#FAF7F2]">
        <div className="max-w-7xl mx-auto px-6 md:px-12 space-y-16">
          <div className="text-center space-y-3">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#D4AF37]">Marketplace Preview</span>
            <h2 className="text-3xl md:text-5xl font-black text-purple-royal tracking-tight uppercase leading-none font-serif">
              Trusted Vendor Partners
            </h2>
            <div className="h-0.5 w-16 bg-gradient-to-r from-gold-luxury to-purple-royal rounded mx-auto" />
            <p className="text-xs text-charcoal-dark/50 max-w-md mx-auto leading-normal">
              Book curated photographers, food caterers, and decorators directly through our ERP system for extra benefits.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {vendors.slice(0, 3).map((vendor) => (
              <GlassCard key={vendor.id} className="p-6 border-white/60 bg-white/40 space-y-4 flex flex-col justify-between h-[360px]">
                <div className="space-y-4">
                  <div className="flex gap-3 items-center">
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-white shrink-0 border border-purple-royal/10">
                      <img src={vendor.logo} alt={vendor.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-sm text-purple-royal uppercase leading-tight">{vendor.name}</h4>
                      <span className="text-[9px] uppercase tracking-wider font-bold text-amber-600 bg-amber-500/10 px-2 py-0.5 rounded-lg border border-amber-500/10 inline-block mt-0.5">
                        {vendor.category}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-charcoal-dark/65 leading-relaxed">
                    Offering special rates for Bhagyalaxmi packages, complete with custom configurations.
                  </p>
                </div>

                <div className="space-y-3 pt-4 border-t border-purple-royal/10">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-charcoal-dark/50">Base Price:</span>
                    <span className="text-purple-royal">₹{vendor.price.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-charcoal-dark/50">Rating:</span>
                    <span className="flex items-center gap-0.5 font-bold text-amber-500">
                      <Star size={12} className="fill-current" /> {vendor.rating} ({vendor.completedWeddings} events)
                    </span>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* ==========================================
          SECTION 7: CUSTOMER TESTIMONIALS
         ========================================== */}
      <section className="py-24 px-6 md:px-12 bg-purple-royal text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none opacity-5">
          <div className="absolute top-[20%] left-[20%] w-[500px] h-[500px] rounded-full bg-white blur-[100px]" />
        </div>
        
        <div className="max-w-4xl mx-auto space-y-8 relative z-10">
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-amber-400">Honorable Guests</span>
          
          <div className="h-[220px] md:h-[180px] flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentTestimonial}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.6 }}
                className="space-y-4"
              >
                <p className="text-lg md:text-2xl font-medium font-serif italic leading-relaxed text-white/95">
                  "{testimonials[currentTestimonial].quote}"
                </p>
                <div>
                  <h4 className="font-extrabold text-sm md:text-base uppercase tracking-wider text-amber-300">
                    {testimonials[currentTestimonial].author}
                  </h4>
                  <p className="text-[10px] md:text-xs text-white/60 font-medium uppercase mt-0.5">
                    {testimonials[currentTestimonial].type} • {testimonials[currentTestimonial].date}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-2 pt-4">
            {testimonials.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentTestimonial(idx)}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  currentTestimonial === idx ? "bg-amber-400 scale-110" : "bg-white/20"
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ==========================================
          SECTION 8: FAQ (ACCORDION)
         ========================================== */}
      <section id="faqs" className="py-24 max-w-4xl mx-auto px-6 md:px-12 space-y-16">
        <div className="text-center space-y-3">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#D4AF37]">Got Questions?</span>
          <h2 className="text-3xl md:text-5xl font-black text-purple-royal tracking-tight uppercase leading-none font-serif">
            Frequently Asked Questions
          </h2>
          <div className="h-0.5 w-16 bg-gradient-to-r from-gold-luxury to-purple-royal rounded mx-auto" />
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-purple-royal/5 shadow-sm overflow-hidden"
            >
              <button
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                className="w-full p-6 text-left flex justify-between items-center gap-4 text-sm font-bold text-purple-royal uppercase tracking-wider"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  size={16}
                  className={`shrink-0 transition-transform duration-300 ${
                    activeFaq === idx ? "rotate-180 text-amber-500" : "text-purple-royal/40"
                  }`}
                />
              </button>
              
              <AnimatePresence>
                {activeFaq === idx && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: "auto" }}
                    exit={{ height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <p className="px-6 pb-6 text-xs text-charcoal-dark/70 leading-relaxed border-t border-purple-royal/5 pt-4">
                      {faq.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </section>

      {/* ==========================================
          SECTION 9: CONTACT & LOCATION INFO
         ========================================== */}
      <section id="contact" className="py-24 px-6 md:px-12 bg-gradient-to-b from-white to-[#FAF7F2] border-t border-purple-royal/5">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          
          {/* Location & Details */}
          <div className="space-y-8">
            <div className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#D4AF37]">Connect With Us</span>
              <h2 className="text-3xl md:text-5xl font-black text-purple-royal tracking-tight uppercase leading-none font-serif">
                Location & Booking Desk
              </h2>
              <div className="h-0.5 w-16 bg-gradient-to-r from-gold-luxury to-purple-royal rounded" />
            </div>

            <div className="space-y-4 text-xs font-semibold text-charcoal-dark/80">
              <div className="flex items-center gap-3">
                <span className="p-3 bg-purple-royal/10 text-purple-royal rounded-xl">
                  <MapPin size={16} />
                </span>
                <span>Bhagyalaxmi Lawns, Bhingar-Cantonment, Ahilyanagar, Maharashtra 414002</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="p-3 bg-purple-royal/10 text-purple-royal rounded-xl">
                  <Phone size={16} />
                </span>
                <span>+91 98909 07454 / +91 98500 12345</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="p-3 bg-purple-royal/10 text-purple-royal rounded-xl">
                  <Mail size={16} />
                </span>
                <span>bookings@bhagyalaxmilawns.com</span>
              </div>
            </div>

            {/* Simulated Map placeholder */}
            <div className="relative rounded-3xl overflow-hidden border border-purple-royal/10 h-64 shadow-md bg-white">
              <img
                src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=600"
                alt="Map Placeholder"
                className="w-full h-full object-cover opacity-60 grayscale"
              />
              <div className="absolute inset-0 bg-purple-royal/10 backdrop-blur-[1px] flex flex-col justify-center items-center text-center p-4">
                <MapPin size={32} className="text-purple-royal mb-2 animate-bounce" />
                <h4 className="font-extrabold text-sm uppercase text-purple-royal">Ahilyanagar Junction</h4>
                <p className="text-[10px] text-charcoal-dark/60 mt-1 max-w-xs font-semibold leading-relaxed">
                  Located near Bhingar Cantonment, just 10 minutes drive from Ahilyanagar Central Railway Station.
                </p>
              </div>
            </div>
          </div>

          {/* Quick Contact Form */}
          <GlassCard className="p-8 border-white/60 bg-white/40 space-y-6">
            <div>
              <h3 className="text-lg font-extrabold text-purple-royal uppercase">Schedule a Site Visit</h3>
              <p className="text-[10px] text-charcoal-dark/50 mt-1 font-semibold uppercase">
                Submit details and our site manager will reach back to coordinate
              </p>
            </div>

            <form onSubmit={handleContactSubmit} className="space-y-4">
              <GlassInput
                label="Your Name"
                placeholder="Enter name"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                required
              />
              <GlassInput
                label="Email Address"
                placeholder="email@example.com"
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                required
              />
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-charcoal-dark/50 uppercase tracking-wider block">
                  How can we help you?
                </label>
                <textarea
                  placeholder="Tell us about your event type, date, or specific requests..."
                  rows={4}
                  value={contactMessage}
                  onChange={(e) => setContactMessage(e.target.value)}
                  className="w-full p-3 bg-white/60 border border-purple-royal/10 focus:border-gold-luxury/40 focus:ring-1 focus:ring-gold-luxury/20 rounded-xl text-xs outline-none transition-all placeholder:text-charcoal-dark/30 resize-none font-sans"
                  required
                />
              </div>

              {messageSent && (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 text-xs rounded-xl font-bold flex items-center gap-2">
                  <CheckCircle size={16} /> Thank you! Your site visit request has been sent.
                </div>
              )}

              <GlassButton variant="gold" type="submit" className="w-full py-3 text-xs font-bold uppercase tracking-widest">
                Submit Inquiry
              </GlassButton>
            </form>
          </GlassCard>
        </div>
      </section>

      {/* ==========================================
          SECTION 10: FINAL CALL TO ACTION
         ========================================== */}
      <section className="relative h-[80vh] w-full flex flex-col justify-center items-center text-center overflow-hidden">
        {/* Parallax Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="/assets/images/06_main_entrance.jpg"
            alt="Final Entrance Banner"
            className="w-full h-full object-cover scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1C1613] via-[#1C1613]/70 to-[#1C1613]/90 z-10" />
        </div>

        <div className="relative z-20 space-y-6 max-w-xl px-4">
          <span className="text-[10px] font-black uppercase tracking-[0.25em] text-amber-400">Bhagyalaxmi Lawns</span>
          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight uppercase leading-tight font-serif">
            Let the Journey Begin
          </h2>
          <div className="h-0.5 w-16 bg-amber-400 rounded mx-auto" />
          <p className="text-xs md:text-sm text-white/70 leading-relaxed font-sans max-w-md mx-auto">
            Ready to secure your dates and coordinate catering, generators, and decorators on the cloud? Initiate your online proposal request.
          </p>

          <GlassButton
            variant="gold"
            onClick={onStartBooking}
            className="py-4 px-10 text-xs font-extrabold uppercase tracking-widest shadow-2xl hover:scale-105 transition-all mt-4 border-amber-400 text-purple-royal bg-gradient-to-r from-amber-300 via-amber-400 to-amber-300 hover:from-amber-200 hover:to-amber-200"
          >
            Reserve Your Dates
          </GlassButton>
        </div>

        <div className="absolute bottom-6 z-20 text-[8px] font-bold text-white/35 uppercase tracking-widest flex items-center gap-4">
          <span>© 2026 Bhagyalaxmi Lawns. All rights reserved.</span>
          <span>•</span>
          <a href="/login-admin" className="hover:text-amber-400 transition-all font-black text-amber-300">Staff Portal</a>
        </div>
      </section>

    </div>
  );
};
