import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FiActivity,
  FiCpu,
  FiPackage,
  FiCreditCard,
  FiUsers,
  FiShield,
  FiArrowRight,
  FiCheckCircle,
  FiZap,
  FiLock,
  FiChevronDown,
  FiCheck,
  FiVideo,
} from "react-icons/fi";
import LandingNavbar from "../../components/landing/LandingNavbar";
import Footer from "../../components/common/Footer";
import useSEO from "../../hooks/useSEO";
import { useSmoothScroll } from "../../hooks/useSmoothScroll";

const LandingPage = () => {
  useSEO({
    title: "The Intelligent Operating System for Modern Clinics",
    description:
      "Enterprise healthcare SaaS engineered for outpatient clinics and pharmacies. Features EHR records, FEFO inventory POS, WebRTC telemedicine, and Google Gemini AI trilingual discharge slips.",
    keywords:
      "SmartClinic, clinic management software, pharmacy management SaaS, electronic health records, EHR Pakistan, FEFO inventory, telemedicine WebRTC, Sanghar healthcare, Anis Khan Niazi",
    canonical: "https://smartclinic.health/",
    ogImage: "/images/hero_doctor_patient.jpg",
  });

  const location = useLocation();
  const { scrollTo } = useSmoothScroll();
  const [activePreviewTab, setActivePreviewTab] = useState("ai");
  const [openFaq, setOpenFaq] = useState(0);
  const [activeEcosystemIndex, setActiveEcosystemIndex] = useState(0);

  // Smooth scroll to anchor hash when arriving from another page
  useEffect(() => {
    if (location.hash) {
      const targetHash = location.hash;
      const timer = setTimeout(() => {
        scrollTo(targetHash, { offset: -80 });
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [location.hash, scrollTo]);

  const STATS = [
    { value: "15,000+", label: "Patient Records", sub: "Safely Managed" },
    { value: "0.4s", label: "AI Digitization", sub: "Prescription OCR" },
    {
      value: "99.98%",
      label: "Uptime Reliability",
      sub: "Cloud Infrastructure",
    },
    {
      value: "4 Roles",
      label: "RBAC Access",
      sub: "Admin, Doctor, Recep, Pharm",
    },
  ];

  const MODULES = [
    {
      ecosystemIndex: 0,
      icon: FiUsers,
      title: "Electronic Health Records (EHR)",
      desc: "Centralized patient demographics, longitudinal timeline history, automated age/gender clustering, consultation notes, and baseline vital signs.",
      badge: "Clinical Core",
      color: "from-blue-600 to-indigo-500",
    },
    {
      ecosystemIndex: 1,
      icon: FiActivity,
      title: "Doctor Consultation & Queue",
      desc: "Multi-doctor appointment scheduling with smart conflict prevention, clinical vital signs entry, diagnosis logging, and digital prescriptions.",
      badge: "Fast Queue",
      color: "from-emerald-600 to-teal-500",
    },
    {
      ecosystemIndex: 2,
      icon: FiCpu,
      title: "Google Gemini AI & Trilingual Slips",
      desc: "Natural language financial queries, automated daily executive briefs, inventory risk warnings, and authentic Sindhi سنڌي + Roman Urdu discharge slips.",
      badge: "AI Powered",
      color: "from-cyan-600 to-sky-500",
    },
    {
      ecosystemIndex: 3,
      icon: FiPackage,
      title: "Smart Pharmacy & FEFO POS",
      desc: "Hardware/camera barcode scanner, real-time stock deduction, batch expiry alert radar (30/60/90 days), and automated FEFO batch depletion.",
      badge: "Zero Stockouts",
      color: "from-purple-600 to-violet-500",
    },
    {
      ecosystemIndex: 4,
      icon: FiCreditCard,
      title: "Multi-Gateway Billing & Invoicing",
      desc: "Split-payment support for Cash, Cards, JazzCash, and EasyPaisa with auto remaining balances and instant printable thermal receipts.",
      badge: "Instant POS",
      color: "from-amber-500 to-orange-500",
    },
    {
      ecosystemIndex: 5,
      icon: FiVideo,
      title: "Telemedicine & WhatsApp Alerts",
      desc: "WebRTC peer-to-peer video consultations with in-call EHR notes drawer, 1-click WhatsApp alerts & discharge slips, and institutional RBAC.",
      badge: "Connected Care",
      color: "from-rose-600 to-pink-500",
    },
  ];

  const PREVIEWS = {
    ai: {
      title: "Natural Language AI Query Engine",
      subtitle:
        "Ask high-level financial or clinical questions in plain English without writing complex database queries.",
      query: "What was our total clinic revenue and pharmacy sales?",
      response: {
        summary:
          "Clinic operations generated PKR 8,525 across OPD consultations and counter pharmacy sales.",
        stats: [
          { label: "OPD Consultation Total", val: "PKR 8,395" },
          { label: "Pharmacy Sales Counter", val: "PKR 130" },
          { label: "Avg Consultation Value", val: "PKR 1,250" },
        ],
        badge: "Query latency: 240ms • Heuristic Engine Verified",
      },
    },
    doctor: {
      title: "Doctor Consultation & Clinical Documentation",
      subtitle:
        "Rapid prescription writer, patient vitals monitoring, and automated past medical history lookup.",
      patient:
        "Muhammad Bilal (Age 28, Male) — BP 120/80 • HR 72 bpm • Temp 98.6°F",
      response: {
        diagnosis: "Acute Bronchitis with Mild Pyrexia",
        rx: [
          "Tab Ciproxin 500mg — 1 tab BD x 5 days",
          "Tab Panadol Extra — 1 tab TDS PRN",
          "Syp Hydryllin DM — 2 tsp TDS x 7 days",
        ],
        badge: "Integrated with Pharmacy inventory auto-check",
      },
    },
    pharmacy: {
      title: "Pharmacy Dispensing & Batch Expiry Matrix",
      subtitle:
        "Automated shelf inventory management, batch number tracking, and counter POS invoicing.",
      response: {
        medicines: [
          {
            name: "Augmentin 625mg",
            stock: 120,
            status: "In Stock",
            exp: "2027-04",
          },
          {
            name: "Panadol 500mg",
            stock: 450,
            status: "In Stock",
            exp: "2026-11",
          },
          {
            name: "Brufen 400mg",
            stock: 18,
            status: "Low Stock Alert",
            exp: "2026-10",
          },
        ],
        badge: "Live counter sync with OPD prescriptions",
      },
    },
    billing: {
      title: "Multi-Channel Billing & Invoicing",
      subtitle:
        "Instant thermal invoice generation with multi-channel payment reconciliation.",
      response: {
        billNo: "INV-2026-0042",
        items: [
          { desc: "General Consultation (Dr. Amina)", amt: "PKR 1,500" },
          { desc: "Blood Glucose Test", amt: "PKR 300" },
          { desc: "Pharmacy Items (Prescription)", amt: "PKR 650" },
        ],
        total: "PKR 2,450",
        method: "Paid via EasyPaisa (Ref: #98321)",
        badge: "Receipt printed in standard 80mm thermal POS format",
      },
    },
  };

  const FAQS = [
    {
      q: "Can SmartClinic be used in both single-doctor clinics and multi-specialty hospitals?",
      a: "Yes. SmartClinic is built from the ground up with multi-role RBAC. Whether you are a solo practitioner managing appointments and billing or a multi-department healthcare facility with separate doctors, reception desks, and an attached pharmacy, SmartClinic adapts seamlessly.",
    },
    {
      q: "How does the AI Assistant work without constant external internet connectivity?",
      a: "SmartClinic features an innovative Dual-Engine AI Architecture. While it can connect to modern OpenAI LLMs when internet and API keys are available, it includes a built-in deterministic Heuristic Analytics Engine that answers queries, parses prescription text, and audits records completely offline.",
    },
    {
      q: "How are roles and medical records secured?",
      a: "Security is strictly enforced via cryptographically signed JWT tokens, BCrypt password hashing, and role middleware. Non-admin users cannot access administrative financials, and non-clinical users cannot view sensitive diagnostic notes.",
    },
    {
      q: "What payment methods are supported for clinic and pharmacy billing?",
      a: "The billing system supports direct Cash, Credit/Debit Cards, Bank Transfers, and local mobile wallets like JazzCash and EasyPaisa, with real-time balance tracking and payment receipt printing.",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200 selection:bg-blue-600 selection:text-white">
      <LandingNavbar />

      {/* ========================================================================= */}
      {/* 1. HERO SECTION: PERSONALIZED HEALTHCARE FOR SMARTER WELLNESS (DRIBBBLE CONCEPT) */}
      {/* ========================================================================= */}
      <section className="relative pt-28 pb-16 md:pt-36 md:pb-24 overflow-hidden">
        {/* Soft Organic Ambient Glowing Backgrounds */}
        <div className="absolute -top-12 -right-12 w-[600px] h-[600px] bg-gradient-to-bl from-orange-400/15 via-rose-300/10 to-transparent dark:from-orange-500/10 dark:via-rose-500/5 rounded-full blur-3xl -z-10 pointer-events-none" />
        <div className="absolute -bottom-16 -left-12 w-[650px] h-[650px] bg-gradient-to-tr from-purple-600/15 via-indigo-400/10 to-transparent dark:from-purple-900/20 dark:via-indigo-900/15 rounded-full blur-3xl -z-10 pointer-events-none" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-blue-500/10 dark:bg-indigo-500/10 rounded-full blur-3xl -z-10 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Centered Typography & Floating 3D Organ Badges */}
          <div className="max-w-4xl mx-auto text-center relative">
            {/* Left 3D Organ Floater: Heart */}
            <div className="hidden md:flex absolute -left-12 lg:-left-20 top-2 items-center justify-center animate-bounce duration-1000">
              <div className="relative group cursor-pointer">
                <div className="h-16 w-16 lg:h-20 lg:w-20 rounded-full bg-white/95 dark:bg-slate-900/95 ring-8 ring-rose-500/10 dark:ring-rose-500/20 shadow-xl p-2.5 backdrop-blur-md border border-rose-100 dark:border-rose-900/40 transition-transform duration-300 group-hover:scale-105">
                  <img
                    src="/images/badge_heart_3d.jpg"
                    alt="Cardiovascular Care"
                    className="h-full w-full object-contain rounded-full"
                  />
                </div>
                <span className="absolute -bottom-1 right-1 h-3.5 w-3.5 rounded-full bg-rose-500 border-2 border-white dark:border-slate-950 animate-pulse" />
              </div>
            </div>

            {/* Right 3D Organ Floater: Lungs */}
            <div className="hidden md:flex absolute -right-12 lg:-right-20 top-2 items-center justify-center animate-bounce duration-1000 delay-300">
              <div className="relative group cursor-pointer">
                <div className="h-16 w-16 lg:h-20 lg:w-20 rounded-full bg-white/95 dark:bg-slate-900/95 ring-8 ring-purple-500/10 dark:ring-purple-500/20 shadow-xl p-2.5 backdrop-blur-md border border-purple-100 dark:border-purple-900/40 transition-transform duration-300 group-hover:scale-105">
                  <img
                    src="/images/badge_lungs_3d.jpg"
                    alt="Respiratory Diagnostics"
                    className="h-full w-full object-contain rounded-full"
                  />
                </div>
                <span className="absolute -bottom-1 right-1 h-3.5 w-3.5 rounded-full bg-purple-500 border-2 border-white dark:border-slate-950 animate-pulse" />
              </div>
            </div>

            {/* Micro Pill Badge */}
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 dark:bg-blue-950/70 border border-blue-200 dark:border-blue-800/80 px-4 py-1.5 text-xs font-bold text-blue-700 dark:text-blue-300 shadow-xs mb-4">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Personalized Healthcare</span>
              <span className="text-blue-400">•</span>
              <span className="font-normal text-slate-600 dark:text-slate-300">
                Smarter Wellness &amp; Outpatient OS
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.12]">
              Personalized{" "}
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Healthcare
              </span>{" "}
              for
              <br className="hidden sm:block" /> Smarter Modern Clinics
            </h1>

            {/* Subtitle */}
            <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal">
              We combine clinical medical expertise with intelligent technology
              to deliver patient care that&apos;s personalized, preventive, and
              efficient across OPD, Pharmacy, and Telemedicine.
            </p>

            {/* Action Row with Flanking Real Doctor Avatars */}
            <div className="mt-7 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
              {/* Doctor Avatar Left */}
              <div className="relative group cursor-pointer hidden sm:block">
                <div className="h-12 w-12 rounded-full ring-2 ring-emerald-500/30 p-0.5 overflow-hidden shadow-md bg-white dark:bg-slate-800">
                  <img
                    src="/images/doctor_avatar_female.jpg"
                    alt="Dr. Amina - Senior Consultant"
                    className="h-full w-full object-cover rounded-full group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-950 animate-pulse" />
              </div>

              {/* Primary Call to Action */}
              <Link
                to="/login"
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold text-xs sm:text-sm px-6 py-3.5 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <FiActivity size={17} />
                <span>Book Appointment / Launch Demo</span>
                <FiArrowRight size={15} />
              </Link>

              {/* Secondary Call to Action */}
              <button
                type="button"
                onClick={() => scrollTo("#ai-engine", { offset: -80 })}
                className="inline-flex items-center gap-2 rounded-full bg-white/90 dark:bg-slate-900/90 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200/90 dark:border-slate-800 font-bold text-xs sm:text-sm px-5 py-3.5 shadow-xs backdrop-blur-md transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              >
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 text-xs font-black">
                  ▶
                </span>
                <span>Explore AI Engine</span>
                <FiArrowRight size={13} className="text-slate-400" />
              </button>

              {/* Doctor Avatar Right */}
              <div className="relative group cursor-pointer hidden sm:block">
                <div className="h-12 w-12 rounded-full ring-2 ring-blue-500/30 p-0.5 overflow-hidden shadow-md bg-white dark:bg-slate-800">
                  <img
                    src="/images/doctor_avatar_male.jpg"
                    alt="Dr. Thorne - Clinical Lead"
                    className="h-full w-full object-cover rounded-full group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-950 animate-pulse" />
              </div>
            </div>

            {/* Demo Credentials Note */}
            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <FiCheckCircle className="text-emerald-500 shrink-0" />
              <span>
                Demo Admin:{" "}
                <strong className="font-semibold text-slate-700 dark:text-slate-200">
                  admin@clinic.com
                </strong>{" "}
                /{" "}
                <code className="bg-slate-200/60 dark:bg-slate-800/80 px-1.5 py-0.5 rounded text-[11px] font-mono">
                  ChangeMe123
                </code>
              </span>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* REAL HUMAN HEALTHCARE PHOTOGRAPHY SHOWCASE WITH FLOATING GLASS CARDS */}
          {/* ========================================================================= */}
          <div className="max-w-4xl mx-auto mt-10 sm:mt-14 relative">
            {/* Central Photography Frame */}
            <div className="rounded-3xl overflow-hidden shadow-2xl border border-slate-200/90 dark:border-slate-800/90 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm relative group">
              <img
                src="/images/hero_doctor_patient.jpg"
                alt="Doctor compassionately consulting and smiling with patient"
                className="w-full h-auto max-h-[460px] object-cover object-center transform group-hover:scale-[1.01] transition-transform duration-700"
              />
              {/* Subtle gradient vignette at bottom */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
            </div>

            {/* Overlaid Floating Glass Card: Health Score (Bottom Left) */}
            <div className="absolute -bottom-6 -left-3 sm:left-6 sm:bottom-8 bg-white/95 dark:bg-slate-900/95 border border-slate-200/90 dark:border-slate-800 p-3.5 sm:p-4 rounded-2xl shadow-2xl backdrop-blur-xl max-w-[190px] sm:max-w-[220px] z-20 animate-in fade-in slide-in-from-left duration-300">
              <div className="flex items-center gap-2 mb-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400">
                  <FiActivity size={15} />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    Health Score
                  </p>
                </div>
              </div>
              <div className="flex items-baseline gap-1.5 mb-1.5">
                <span className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                  98.4%
                </span>
                <span className="text-[10px] font-extrabold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.2 rounded border border-emerald-200 dark:border-emerald-800">
                  Optimal
                </span>
              </div>
              {/* Mini vertical rounded bar chart */}
              <div className="flex items-end gap-1.5 h-10 pt-1">
                <div className="w-3 rounded-full bg-indigo-200 dark:bg-indigo-900/50 h-[45%]" />
                <div className="w-3 rounded-full bg-indigo-300 dark:bg-indigo-800/60 h-[65%]" />
                <div className="w-3 rounded-full bg-indigo-400 dark:bg-indigo-700/70 h-[50%]" />
                <div className="w-3 rounded-full bg-indigo-500 dark:bg-indigo-600/80 h-[80%]" />
                <div className="w-3 rounded-full bg-indigo-400 dark:bg-indigo-700/70 h-[60%]" />
                <div className="w-3 rounded-full bg-indigo-600 dark:bg-indigo-500 h-[95%]" />
                <div className="w-3 rounded-full bg-purple-600 dark:bg-purple-500 h-[85%]" />
              </div>
            </div>

            {/* Overlaid Floating Glass Card: Improvement (Top Right) */}
            <div className="absolute -top-6 -right-3 sm:right-6 sm:top-8 bg-white/95 dark:bg-slate-900/95 border border-slate-200/90 dark:border-slate-800 p-3.5 sm:p-4 rounded-2xl shadow-2xl backdrop-blur-xl max-w-[190px] sm:max-w-[220px] z-20 animate-in fade-in slide-in-from-right duration-300">
              <div className="flex items-center gap-2 mb-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-orange-100 dark:bg-orange-950/80 text-orange-600 dark:text-orange-400">
                  <FiZap size={15} />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    Clinic Efficiency
                  </p>
                </div>
              </div>
              <div className="flex items-baseline gap-1.5 mb-1.5">
                <span className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                  +42%
                </span>
                <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">
                  vs Manual OPD
                </span>
              </div>
              {/* Mini smooth trend curve */}
              <div className="w-full h-10 pt-1">
                <svg
                  className="w-full h-full overflow-visible"
                  viewBox="0 0 100 36"
                >
                  <defs>
                    <linearGradient id="curveGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#f97316" stopOpacity="0.4" />
                      <stop
                        offset="100%"
                        stopColor="#f97316"
                        stopOpacity="0.0"
                      />
                    </linearGradient>
                  </defs>
                  <path
                    d="M0,32 Q25,28 40,20 T75,12 T100,4 L100,36 L0,36 Z"
                    fill="url(#curveGrad)"
                  />
                  <path
                    d="M0,32 Q25,28 40,20 T75,12 T100,4"
                    fill="none"
                    stroke="#f97316"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* BOTTOM FLOATING FEATURE CAPSULE ISLAND (4 PILLARS) */}
          {/* ========================================================================= */}
          <div className="mt-12 sm:mt-16 max-w-5xl mx-auto">
            <div className="bg-white/90 dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800 rounded-2xl sm:rounded-full p-3 sm:py-3.5 sm:px-6 shadow-xl backdrop-blur-xl grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6 divide-y sm:divide-y-0 sm:divide-x divide-slate-200/60 dark:divide-slate-800/60">
              {/* Feature 1 */}
              <div className="flex items-center gap-3 pt-2 sm:pt-0 sm:px-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 shrink-0">
                  <FiUsers size={18} />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                    Personalized Care Plans
                  </p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">
                    EHR &amp; longitudinal notes
                  </p>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="flex items-center gap-3 pt-2 sm:pt-0 sm:px-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 shrink-0">
                  <FiShield size={18} />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                    Secure &amp; Private Data
                  </p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">
                    HIPAA &amp; RBAC encrypted
                  </p>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="flex items-center gap-3 pt-2 sm:pt-0 sm:px-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 shrink-0">
                  <FiCpu size={18} />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                    Real-time Health AI
                  </p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">
                    0.4s OCR &amp; query briefs
                  </p>
                </div>
              </div>

              {/* Feature 4 */}
              <div className="flex items-center gap-3 pt-2 sm:pt-0 sm:px-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 shrink-0">
                  <FiVideo size={18} />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                    24/7 Expert Telemedicine
                  </p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">
                    WebRTC video &amp; WhatsApp
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Ticker */}
          <div className="mt-12 pt-8 border-t border-slate-200/80 dark:border-slate-800/80 grid grid-cols-2 md:grid-cols-4 gap-6">
            {STATS.map((stat, i) => (
              <div key={i} className="text-center sm:text-left">
                <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  {stat.value}
                </p>
                <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  {stat.label}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  {stat.sub}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. INTERACTIVE "CLINIC IN ACTION" LIVE PREVIEW (TABBED UI MOCKUP) */}
      {/* ========================================================================= */}
      <section
        id="features"
        className="py-16 sm:py-20 bg-white dark:bg-slate-900/50 border-y border-slate-200/80 dark:border-slate-800/80"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              Interactive Preview
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
              Experience the Unified Clinic Workspace
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300">
              Switch between tabs below to see how SmartClinic coordinates
              clinic stakeholders in real time.
            </p>
          </div>

          {/* Tab Selector */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
            {[
              { id: "ai", label: "AI Analytics Engine", icon: FiCpu },
              {
                id: "doctor",
                label: "Doctor EHR Consultation",
                icon: FiActivity,
              },
              { id: "pharmacy", label: "Smart Pharmacy POS", icon: FiPackage },
              {
                id: "billing",
                label: "Multi-Gateway Invoicing",
                icon: FiCreditCard,
              },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activePreviewTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActivePreviewTab(tab.id)}
                  className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-blue-600 text-white shadow-md shadow-blue-500/30 scale-[1.02]"
                      : "bg-slate-100 dark:bg-slate-800/70 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800"
                  }`}
                >
                  <Icon size={16} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Interactive Screen Container */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/90 shadow-2xl overflow-hidden max-w-5xl mx-auto">
            {/* Window Top bar */}
            <div className="flex items-center justify-between px-4 py-3 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500/80" />
                <span className="w-3 h-3 rounded-full bg-amber-500/80" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
                <span className="ml-2 text-xs font-medium text-slate-500 dark:text-slate-400">
                  SmartClinic Application • {PREVIEWS[activePreviewTab].title}
                </span>
              </div>
              <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                API Connected
              </span>
            </div>

            {/* Screen Content Body */}
            <div className="p-6 sm:p-8">
              {activePreviewTab === "ai" && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                      {PREVIEWS.ai.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                      {PREVIEWS.ai.subtitle}
                    </p>
                  </div>

                  {/* Query Box */}
                  <div className="flex items-center gap-3 p-3.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-sm">
                    <FiCpu className="text-blue-500 shrink-0" size={20} />
                    <span className="text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-200">
                      "{PREVIEWS.ai.query}"
                    </span>
                  </div>

                  {/* AI Response Card */}
                  <div className="rounded-xl border border-blue-200 dark:border-blue-900/50 bg-blue-50/50 dark:bg-blue-950/20 p-5 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 dark:text-blue-300">
                        <FiZap size={14} /> AI Executive Summary
                      </span>
                      <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                        {PREVIEWS.ai.response.badge}
                      </span>
                    </div>

                    <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                      {PREVIEWS.ai.response.summary}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                      {PREVIEWS.ai.response.stats.map((st, i) => (
                        <div
                          key={i}
                          className="p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800"
                        >
                          <p className="text-[11px] text-slate-500 dark:text-slate-400">
                            {st.label}
                          </p>
                          <p className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                            {st.val}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activePreviewTab === "doctor" && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                      {PREVIEWS.doctor.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                      {PREVIEWS.doctor.subtitle}
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/50 text-xs font-semibold text-blue-800 dark:text-blue-300">
                    Active Patient: {PREVIEWS.doctor.patient}
                  </div>

                  <div className="p-5 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Diagnosis
                    </p>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">
                      {PREVIEWS.doctor.response.diagnosis}
                    </p>
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400 pt-2">
                      Prescribed Regimen
                    </p>
                    <div className="space-y-1.5">
                      {PREVIEWS.doctor.response.rx.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 font-mono"
                        >
                          <FiCheck className="text-emerald-500" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activePreviewTab === "pharmacy" && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                      {PREVIEWS.pharmacy.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                      {PREVIEWS.pharmacy.subtitle}
                    </p>
                  </div>

                  <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
                    <table className="w-full text-left text-xs">
                      <thead className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-400 uppercase">
                        <tr>
                          <th className="p-3">Medicine Name</th>
                          <th className="p-3">Units in Stock</th>
                          <th className="p-3">Status</th>
                          <th className="p-3">Batch Expiry</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                        {PREVIEWS.pharmacy.response.medicines.map((m, idx) => (
                          <tr key={idx} className="font-medium">
                            <td className="p-3 text-slate-900 dark:text-white font-semibold">
                              {m.name}
                            </td>
                            <td className="p-3">{m.stock}</td>
                            <td className="p-3">
                              <span
                                className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                  m.status.includes("Low")
                                    ? "bg-amber-100 dark:bg-amber-950/70 text-amber-700 dark:text-amber-400 border border-amber-300 dark:border-amber-800"
                                    : "bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800"
                                }`}
                              >
                                {m.status}
                              </span>
                            </td>
                            <td className="p-3 font-mono">{m.exp}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activePreviewTab === "billing" && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                      {PREVIEWS.billing.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                      {PREVIEWS.billing.subtitle}
                    </p>
                  </div>

                  <div className="p-5 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3">
                    <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
                      <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400">
                        {PREVIEWS.billing.response.billNo}
                      </span>
                      <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                        {PREVIEWS.billing.response.method}
                      </span>
                    </div>

                    <div className="space-y-2 py-2">
                      {PREVIEWS.billing.response.items.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex justify-between text-xs text-slate-700 dark:text-slate-300"
                        >
                          <span>{item.desc}</span>
                          <span className="font-mono font-medium">
                            {item.amt}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-between items-center pt-3 border-t border-slate-200 dark:border-slate-800 text-sm font-bold text-slate-900 dark:text-white">
                      <span>Total Paid</span>
                      <span className="text-blue-600 dark:text-blue-400 font-mono text-base">
                        {PREVIEWS.billing.response.total}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. AI ENGINE DEEP DIVE SECTION */}
      {/* ========================================================================= */}
      <section
        id="ai-engine"
        className="py-16 sm:py-24 relative overflow-hidden"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-cyan-100 dark:bg-cyan-950/80 border border-cyan-300 dark:border-cyan-800 text-cyan-700 dark:text-cyan-300 px-3 py-1 text-xs font-bold">
                <FiZap /> Built-In Healthcare AI
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Clinical Intelligence Without The Cloud Complexity.
              </h2>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                SmartClinic integrates an administrative & operational AI
                assistant engineered specifically for clinic environments. It
                runs smoothly on local hospital networks with zero downtime and
                strict non-diagnostic safety guardrails.
              </p>

              <div className="space-y-3.5">
                {[
                  {
                    title: "Dual Engine (LLM + Local Heuristics)",
                    desc: "Seamlessly switches between OpenAI GPT and local heuristic statistical processors. Never fails if external internet is down.",
                  },
                  {
                    title: "Prescription & Text OCR Digitizer",
                    desc: "Converts doctor handwritten/typed notes into structured medication items, dosages, frequencies, and durations.",
                  },
                  {
                    title: "Automated Daily Executive Briefs",
                    desc: "Generates high-level summaries of patient flow, doctor consultation stats, top dispensed medicines, and peak queue hours.",
                  },
                  {
                    title: "Inventory & Expiry Forecasting",
                    desc: "Analyzes seasonal demand shifts and flags inventory batches expiring within 30, 60, and 90 days.",
                  },
                ].map((f, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5">
                      <FiCheck size={14} />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                        {f.title}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {f.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Interactive AI Visual Card */}
            <div className="lg:col-span-6">
              <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-slate-900 to-blue-950 text-white shadow-2xl border border-slate-800 space-y-6">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/20 text-cyan-400 border border-cyan-500/30">
                      <FiCpu size={22} />
                    </div>
                    <div>
                      <p className="text-sm font-bold">AI Assistant Status</p>
                      <p className="text-[11px] text-emerald-400 font-mono">
                        Engine: ONLINE • Dual Mode Ready
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                    v2.4
                  </span>
                </div>

                <div className="space-y-3">
                  <p className="text-xs font-mono uppercase text-slate-400 tracking-wider">
                    Recent Safety Audit Stream
                  </p>
                  <div className="space-y-2 font-mono text-xs">
                    <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80 flex items-center justify-between">
                      <span className="text-cyan-300">
                        GET /api/ai/daily-report
                      </span>
                      <span className="text-emerald-400">200 OK (142ms)</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80 flex items-center justify-between">
                      <span className="text-cyan-300">
                        POST /api/ai/parse-text
                      </span>
                      <span className="text-emerald-400">200 OK (288ms)</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80 flex items-center justify-between">
                      <span className="text-cyan-300">
                        GET /api/ai/inventory-insights
                      </span>
                      <span className="text-emerald-400">200 OK (110ms)</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-blue-600/20 border border-blue-500/30">
                  <p className="text-xs font-semibold text-cyan-200">
                    🔒 Healthcare Safety Guarantee
                  </p>
                  <p className="text-[11px] text-slate-300 mt-1">
                    Strict prompt isolation and non-diagnostic constraints
                    prevent unauthorized medical advice while automating
                    administrative intelligence.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. CORE CLINIC MODULES GRID */}
      {/* ========================================================================= */}
      <section
        id="modules"
        className="py-16 sm:py-24 bg-white dark:bg-slate-900/40 border-t border-slate-200/80 dark:border-slate-800/80"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-8">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              Complete Clinic Ecosystem
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
              Everything Your Healthcare Team Needs
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300">
              Engineered as a cohesive, end-to-end SaaS architecture replacing
              fragmented paper systems.
            </p>
          </div>

          {/* Core Modules Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {MODULES.map((m, i) => {
              const Icon = m.icon;
              const isSelected = activeEcosystemIndex === m.ecosystemIndex;
              return (
                <div
                  key={i}
                  onMouseEnter={() => setActiveEcosystemIndex(m.ecosystemIndex)}
                  onClick={() => setActiveEcosystemIndex(m.ecosystemIndex)}
                  className={`cursor-pointer rounded-2xl p-6 bg-slate-50 dark:bg-slate-900 border transition-all duration-200 group flex flex-col justify-between ${
                    isSelected
                      ? "border-blue-500 ring-2 ring-blue-500/20 shadow-xl bg-blue-50/30 dark:bg-blue-950/30 -translate-y-1"
                      : "border-slate-200/80 dark:border-slate-800/80 hover:border-blue-500/50 dark:hover:border-blue-500/50 shadow-sm hover:shadow-md"
                  }`}
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-tr ${m.color} text-white shadow-md group-hover:scale-105 transition-transform`}
                      >
                        <Icon size={24} />
                      </div>
                      <div className="flex items-center gap-1.5">
                        {isSelected && (
                          <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 border border-blue-300 dark:border-blue-700 animate-pulse">
                            Step 0{m.ecosystemIndex + 1} Active Operational
                            Module
                          </span>
                        )}
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300">
                          {m.badge}
                        </span>
                      </div>
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                      {m.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      {m.desc}
                    </p>
                  </div>

                  <div className="pt-5 mt-4 border-t border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between text-xs font-semibold text-blue-600 dark:text-blue-400">
                    <span className="flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      <span>Operational Feature</span>
                    </span>
                    <FiCheckCircle size={15} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. ROLE-TAILORED WORKFLOWS */}
      {/* ========================================================================= */}
      <section
        id="workflows"
        className="py-16 sm:py-24 bg-slate-100/60 dark:bg-slate-950"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              Role-Based Experience
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
              Built Specifically for Each Team Member
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300">
              Strictly scoped interfaces guarantee doctors, pharmacists,
              receptionists, and owners focus only on what matters.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                role: "For Doctors",
                desc: "Focused consultation dashboard, rapid digital prescriptions, patient vitals timeline, and automated past medical history.",
                highlight: "Zero Administrative Clutter",
                color: "border-blue-500",
              },
              {
                role: "For Pharmacists",
                desc: "Batch expiry tracking, low-stock reorder matrix, rapid counter POS dispensing, and category-wise inventory valuation.",
                highlight: "Zero Expired Stock Waste",
                color: "border-amber-500",
              },
              {
                role: "For Receptionists",
                desc: "15-second patient intake, smart queue prioritization, calendar appointment booking, and multi-gateway billing checkout.",
                highlight: "Fast Patient Onboarding",
                color: "border-emerald-500",
              },
              {
                role: "For Clinic Owners",
                desc: "High-level daily revenue velocity, consultation volumes, AI administrative briefs, staff management, and system safety audit logs.",
                highlight: "Total Financial Visibility",
                color: "border-purple-500",
              },
            ].map((card, i) => (
              <div
                key={i}
                className={`rounded-2xl p-6 bg-white dark:bg-slate-900 border-t-4 ${card.color} border-x border-b border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3`}
              >
                <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                  {card.highlight}
                </span>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {card.role}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {card.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. SECURITY & COMPLIANCE */}
      {/* ========================================================================= */}
      <section
        id="security"
        className="py-16 sm:py-20 bg-white dark:bg-slate-900/60 border-t border-slate-200/80 dark:border-slate-800/80"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white p-8 sm:p-12 border border-slate-800 shadow-2xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-4">
                <div className="inline-flex items-center gap-2 rounded-full bg-emerald-950/80 border border-emerald-700/60 px-3 py-1 text-xs font-semibold text-emerald-400">
                  <FiLock /> Enterprise Security & Data Governance
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                  Protecting Sensitive Healthcare Information
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  SmartClinic incorporates modern cryptographic security, salted
                  BCrypt hashing, JWT token expiry, and role-scoped endpoint
                  middleware preventing cross-tenant data leakage.
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                  <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/60">
                    <p className="text-xs font-bold text-white">256-bit JWT</p>
                    <p className="text-[10px] text-slate-400">
                      Encrypted tokens
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/60">
                    <p className="text-xs font-bold text-white">RBAC Guarded</p>
                    <p className="text-[10px] text-slate-400">
                      Strict authorization
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/60">
                    <p className="text-xs font-bold text-white">Audit Trail</p>
                    <p className="text-[10px] text-slate-400">
                      Tamper-evident logs
                    </p>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5 flex flex-col items-center justify-center text-center space-y-4 p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-500 to-cyan-400 text-white shadow-lg">
                  <FiShield size={32} />
                </div>
                <h4 className="text-base font-bold text-white">
                  Ready for Production
                </h4>
                <p className="text-xs text-slate-300">
                  Engineered with Node.js 22, Express, MongoDB Atlas, and React
                  19 for maximum reliability.
                </p>
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 rounded-xl bg-white text-slate-900 font-bold text-xs px-5 py-2.5 shadow-md hover:bg-slate-100 transition-colors"
                >
                  Enter Clinic Portal
                  <FiArrowRight />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. FREQUENTLY ASKED QUESTIONS */}
      {/* ========================================================================= */}
      <section
        id="faq"
        className="py-16 sm:py-24 bg-slate-50 dark:bg-slate-950"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              Clear Answers
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-3">
            {FAQS.map((faq, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? -1 : idx)}
                  className="w-full flex items-center justify-between p-5 text-left text-sm font-bold text-slate-900 dark:text-white focus:outline-none"
                >
                  <span>{faq.q}</span>
                  <FiChevronDown
                    className={`transition-transform duration-200 text-slate-400 ${
                      openFaq === idx ? "rotate-180 text-blue-600" : ""
                    }`}
                  />
                </button>
                {openFaq === idx && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800/80 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 8. HIGH-CONVERSION CTA FOOTER BANNER */}
      {/* ========================================================================= */}
      <section className="py-16 bg-gradient-to-tr from-blue-600 to-cyan-600 text-white text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Ready to Upgrade Your Healthcare Facility?
          </h2>
          <p className="text-sm sm:text-base text-blue-50 max-w-xl mx-auto">
            Experience real-time AI assistance, zero stockouts, rapid patient
            check-in, and clear financial oversight today.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/login"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-white text-blue-700 font-bold text-sm px-7 py-3.5 shadow-xl hover:bg-slate-100 transition-all hover:scale-105"
            >
              <span>Get Started Now</span>
              <FiArrowRight />
            </Link>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 9. FOOTER */}
      {/* ========================================================================= */}
      <Footer />
    </div>
  );
};

export default LandingPage;
