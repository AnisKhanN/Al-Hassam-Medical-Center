import { useState } from "react";
import { Link } from "react-router-dom";
import {
  FiActivity,
  FiArrowRight,
  FiAward,
  FiClock,
  FiCpu,
  FiDatabase,
  FiGlobe,
  FiHeart,
  FiLock,
  FiMail,
  FiMapPin,
  FiPackage,
  FiShield,
  FiTarget,
  FiVideo,
  FiZap,
} from "react-icons/fi";
import { FaGithub, FaLinkedinIn, FaTwitter, FaWhatsapp } from "react-icons/fa";
import LandingNavbar from "../../components/landing/LandingNavbar";
import Footer from "../../components/common/Footer";
import useSEO from "../../hooks/useSEO";
import { useSmoothScroll } from "../../hooks/useSmoothScroll";

const AboutUs = () => {
  useSEO({
    title: "About Us — The Story, Mission & Founder Behind SmartClinic",
    description:
      "Learn about SmartClinic's mission, founder Anis Khan Niazi, and our vision to transform outpatient healthcare and pharmacy management through robust EHR, FEFO automation, and Gemini AI.",
    keywords:
      "About SmartClinic, Anis Khan Niazi, healthcare software engineer, clinic management Pakistan, EHR architecture, pharmacy POS founder, Sanghar Sindh, healthcare SaaS",
    canonical: "http://localhost:5173/about",
  });

  const { scrollTo } = useSmoothScroll();
  const [activeTab, setActiveTab] = useState("mission");

  const VALUES = [
    {
      icon: FiHeart,
      title: "Patient Dignity & Data Privacy",
      desc: "Healthcare data is sacred. We enforce strict role-based access control (RBAC), salted cryptographic hashing, and automated session invalidation to eliminate patient record leaks.",
      badge: "Zero-Leakage Guarantee",
      color:
        "from-rose-500/20 to-pink-500/10 border-rose-300 dark:border-rose-900/60 text-rose-600 dark:text-rose-400",
    },
    {
      icon: FiPackage,
      title: "Zero-Waste Pharmacy Economics",
      desc: "Medication wastage costs community pharmacies thousands. Our strict First-Expiry-First-Out (FEFO) dispensing algorithms and 30/60/90-day expiry radars eliminate discarded medicine.",
      badge: "Automated FEFO",
      color:
        "from-amber-500/20 to-orange-500/10 border-amber-300 dark:border-amber-900/60 text-amber-600 dark:text-amber-400",
    },
    {
      icon: FiGlobe,
      title: "Trilingual Healthcare Equity",
      desc: "Medical instructions should never be lost in translation. SmartClinic produces discharge and prescription instructions in Sindhi, Roman Urdu, and English for inclusive patient care.",
      badge: "Sindhi • Urdu • English",
      color:
        "from-cyan-500/20 to-blue-500/10 border-cyan-300 dark:border-cyan-900/60 text-cyan-600 dark:text-cyan-400",
    },
    {
      icon: FiShield,
      title: "Non-Diagnostic AI Safety Guardrails",
      desc: "Our Google Gemini AI assistant automates administrative briefing, inventory forecasting, and prescription transcription—strictly sandboxed away from autonomous medical diagnoses.",
      badge: "Audited Boundaries",
      color:
        "from-emerald-500/20 to-teal-500/10 border-emerald-300 dark:border-emerald-900/60 text-emerald-600 dark:text-emerald-400",
    },
  ];

  const TARGET_CUSTOMERS = [
    {
      type: "Community Polyclinics",
      role: "Solo Practitioners & Group Practices",
      problem:
        "Paper queue bottlenecks, double-booked appointments, fragmented handwritten files.",
      solution:
        "15-second patient registration, real-time conflict-free calendar booking, longitudinal vitals timeline, and automated WhatsApp appointment reminders.",
      metric: "75% Reduction in Intake Time",
      icon: FiActivity,
    },
    {
      type: "Retail & Community Pharmacies",
      role: "Pharmacy In-charges & Cashiers",
      problem:
        "Manual stock taking, selling near-expiry drugs accidentally, slow checkout queues.",
      solution:
        "Barcode scanner POS, automated FEFO inventory deductions, multi-batch tracking, low-stock reorder triggers, and thermal receipt printing.",
      metric: "100% Expiry Awareness",
      icon: FiPackage,
    },
    {
      type: "Hybrid & Telemedicine Practices",
      role: "Doctors Serving Remote Patients",
      problem:
        "Unsecured WhatsApp video calls, no synchronized medical note-taking during consultations.",
      solution:
        "Integrated WebRTC peer-to-peer encrypted video calls with in-room prescription writing, vital updates, and instant WhatsApp link sharing.",
      metric: "Zero Third-Party Subscriptions",
      icon: FiVideo,
    },
  ];

  const TRUST_METRICS = [
    { value: "15,000+", label: "Simulated Records", sub: "Stress Tested" },
    { value: "45+", label: "REST Endpoints", sub: "Audited & Scoped" },
    { value: "< 50ms", label: "Barcode Lookup", sub: "Indexed Queries" },
    { value: "100%", label: "Conflict Prevention", sub: "Calendar Locks" },
  ];

  const SOCIAL_LINKS = [
    {
      name: "GitHub",
      href: "https://github.com/aniskhan-dev",
      icon: FaGithub,
      handle: "@aniskhan-dev",
      color:
        "hover:bg-slate-900 hover:text-white dark:hover:bg-white dark:hover:text-slate-900",
    },
    {
      name: "LinkedIn",
      href: "https://linkedin.com/in/anis-khan-niazi",
      icon: FaLinkedinIn,
      handle: "Anis Khan Niazi",
      color: "hover:bg-[#0A66C2] hover:text-white",
    },
    {
      name: "Twitter / X",
      href: "https://twitter.com/aniskhan_tech",
      icon: FaTwitter,
      handle: "@aniskhan_tech",
      color: "hover:bg-sky-500 hover:text-white",
    },
    {
      name: "WhatsApp",
      href: "https://wa.me/923000000000",
      icon: FaWhatsapp,
      handle: "Direct Consult",
      color: "hover:bg-emerald-600 hover:text-white",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-blue-600 selection:text-white transition-colors duration-300">
      <LandingNavbar />

      {/* Structured Data: JSON-LD for Search Engines */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "AboutPage",
          name: "About SmartClinic & Founder Mission",
          description:
            "The architectural story, core values, mission, and leadership of SmartClinic healthcare SaaS.",
          url: "http://localhost:5173/about",
          mainEntity: {
            "@type": "Person",
            name: "Anis Khan Niazi",
            jobTitle: "Lead Healthcare Software Engineer & Architect",
            alumniOf: "BS Information Technology",
            worksFor: {
              "@type": "SoftwareApplication",
              name: "SmartClinic SaaS",
            },
            address: {
              "@type": "PostalAddress",
              addressLocality: "Sanghar",
              addressRegion: "Sindh",
              addressCountry: "PK",
            },
          },
        })}
      </script>

      {/* ========================================================================= */}
      {/* 1. HERO SECTION */}
      {/* ========================================================================= */}
      <section className="relative pt-32 pb-20 overflow-hidden border-b border-slate-200/80 dark:border-slate-800/80">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-50/60 via-transparent to-transparent dark:from-blue-950/20 dark:via-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-100 dark:bg-blue-950/80 border border-blue-300 dark:border-blue-800/80 px-3.5 py-1 text-xs font-semibold text-blue-700 dark:text-blue-300 shadow-sm">
              <FiTarget className="text-blue-600 dark:text-blue-400" />
              <span>The Mission Behind The Code</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
              Engineering Trust Into Every{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-cyan-500 to-indigo-600">
                Clinical Workflow.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
              SmartClinic was conceived not inside a remote corporate boardroom,
              but out of the urgent operational realities of community
              healthcare in Pakistan, where patient care shouldn't be derailed
              by misplaced paper files or expired medications.
            </p>

            <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/login"
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-6 py-3 shadow-lg shadow-blue-500/25 transition-all hover:scale-105"
              >
                <FiActivity />
                <span>Explore Live System</span>
                <FiArrowRight />
              </Link>
              <button
                type="button"
                onClick={() => scrollTo("#founder-story", { offset: -80 })}
                className="inline-flex items-center gap-2 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 font-semibold text-sm px-5 py-3 shadow-sm transition-all cursor-pointer"
              >
                <span>Read The Founder Story</span>
              </button>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {TRUST_METRICS.map((m, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-sm text-center shadow-sm"
              >
                <p className="text-2xl sm:text-3xl font-extrabold text-blue-600 dark:text-blue-400 font-mono">
                  {m.value}
                </p>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-1">
                  {m.label}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  {m.sub}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. THE CORE NARRATIVE */}
      {/* ========================================================================= */}
      <section className="py-16 sm:py-24 bg-white dark:bg-slate-900/50 border-b border-slate-200/80 dark:border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                The Core Narrative
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                From Fragmented Chaos to Closed-Loop Healthcare Continuity.
              </h2>
              <div className="space-y-4 text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                <p>
                  Most community clinics operate in isolated silos. The
                  reception desk relies on paper registers; the doctor writes
                  cryptic handwritten prescription notes on loose pads; the
                  pharmacy manages stock by visual inspection; and the patient
                  leaves with slips they cannot read or understand.
                </p>
                <p>
                  <strong className="text-slate-900 dark:text-white font-semibold">
                    SmartClinic bridges this gap completely.
                  </strong>{" "}
                  When a receptionist books an appointment, the doctor’s queue
                  updates instantly. As the physician consults, past medical
                  history and vitals are indexed. Prescriptions flow directly to
                  the pharmacy counter where First-Expiry-First-Out (FEFO) logic
                  automatically deducts exact batches, and Google Gemini AI
                  translates instructions into the patient’s native language
                  (Sindhi, Urdu, or English).
                </p>
              </div>
            </div>

            {/* Visual Narrative Matrix Card */}
            <div className="lg:col-span-6">
              <div className="p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white shadow-2xl border border-slate-800 space-y-6">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md">
                      <FiZap size={20} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold">
                        The SmartClinic Loop
                      </h4>
                      <p className="text-[11px] text-slate-400">
                        Zero-Interruption Clinical Pipeline
                      </p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-mono font-semibold">
                    Synchronized
                  </span>
                </div>

                <div className="space-y-3 font-mono text-xs">
                  {[
                    {
                      step: "01. Reception",
                      desc: "15s intake + conflict-free queue placement",
                    },
                    {
                      step: "02. Doctor Desk",
                      desc: "Longitudinal EHR + digital Rx drafting",
                    },
                    {
                      step: "03. Gemini AI",
                      desc: "Trilingual discharge generation (EN/UR/SD)",
                    },
                    {
                      step: "04. Pharmacy",
                      desc: "Barcode POS + automated FEFO batch deduction",
                    },
                    {
                      step: "05. Invoicing",
                      desc: "Split billing (Cash/Card/EasyPaisa) + slips",
                    },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-center justify-between"
                    >
                      <span className="text-cyan-400 font-bold">
                        {item.step}
                      </span>
                      <span className="text-slate-300 text-right">
                        {item.desc}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. WHY I STARTED (FOUNDER STORY) */}
      {/* ========================================================================= */}
      <section
        id="founder-story"
        className="py-16 sm:py-24 bg-slate-100/60 dark:bg-slate-950 border-b border-slate-200/80 dark:border-slate-800/80"
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              Personal Origin
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
              Why I Started SmartClinic
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              A software engineer’s firsthand encounter with the systemic
              friction in everyday outpatient medicine.
            </p>
          </div>

          <div className="p-8 sm:p-12 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 border-b border-slate-100 dark:border-slate-800 pb-8">
              <div className="h-24 w-24 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-500 text-white flex items-center justify-center font-extrabold text-3xl shadow-lg shrink-0">
                AKN
              </div>
              <div className="text-center sm:text-left space-y-1">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  Anis Khan Niazi
                </h3>
                <p className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                  Lead Software Architect & BSIT Healthcare Researcher
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center justify-center sm:justify-start gap-1">
                  <FiMapPin size={13} />
                  <span>Sanghar, Sindh, Pakistan</span>
                </p>
              </div>
            </div>

            <div className="space-y-4 text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
              <p>
                Growing up and working around outpatient healthcare facilities
                in Sanghar, Sindh, I observed a continuous, frustrating pattern.
                Families would wait two hours in chaotic waiting rooms only to
                find their previous medical folder was misplaced. Doctors were
                forced to rush through consultations while spending precious
                minutes writing manual notes on paper pads.
              </p>
              <p>
                In the pharmacy next door, pharmacists routinely discarded
                thousands of rupees worth of expired medicines simply because
                there was no digital alert system warning them that Batch A was
                expiring before Batch B. Furthermore, elderly patients from
                rural villages would return with complications because they
                couldn’t decipher English medical abbreviations like{" "}
                <em>"TDS pc"</em>.
              </p>
              <p>
                I asked myself:{" "}
                <strong className="text-slate-900 dark:text-white">
                  Why should world-class clinical software be exclusive to
                  billion-dollar private hospitals?
                </strong>{" "}
                Why can't community clinics and neighborhood pharmacies have a
                system that is lightning-fast, trilingual, locally resilient,
                and intuitive enough for staff to operate with zero onboarding?
              </p>
              <p className="font-semibold text-blue-600 dark:text-blue-400">
                SmartClinic was engineered to answer that question. It is my
                commitment to proving that modern software architecture can save
                time, eliminate waste, and elevate human dignity in everyday
                healthcare.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. WHAT I DO (TECHNICAL CAPABILITY MATRIX) */}
      {/* ========================================================================= */}
      <section className="py-16 sm:py-24 bg-white dark:bg-slate-900/40 border-b border-slate-200/80 dark:border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              Technical Capabilities
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
              What I Do & How It's Engineered
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300">
              A comprehensive full-stack healthcare ecosystem engineered for
              reliability, sub-second responses, and compliance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: FiDatabase,
                title: "Electronic Health Records (EHR)",
                desc: "Custom schema indexing longitudinal patient visit histories, vital sign timelines, diagnostic reports, and encrypted patient profiles.",
                tech: "MongoDB Atlas • Mongoose .lean() • Compound Indexing",
              },
              {
                icon: FiPackage,
                title: "FEFO Pharmacy Point-of-Sale",
                desc: "Automated First-Expiry-First-Out dispensing logic, multi-batch tracking, sub-50ms barcode scanning, and low-stock reorder triggers.",
                tech: "Hardware & Camera Barcode • Thermal Print • FEFO Engine",
              },
              {
                icon: FiCpu,
                title: "Google Gemini AI Clinical Intelligence",
                desc: "Integrated natural language query engine, automated daily executive briefs, prescription text transcription, and trilingual discharge slips.",
                tech: "Google Gemini 2.5 • Dual-Engine Heuristics • Non-Diagnostic Guardrails",
              },
              {
                icon: FiVideo,
                title: "WebRTC Telemedicine Video Room",
                desc: "Peer-to-peer real-time virtual consultation with STUN/TURN mesh, in-call clinical note-taking, and automated WhatsApp invite distribution.",
                tech: "WebRTC DataChannel • STUN Mesh • Dynamic EHR Dock",
              },
              {
                icon: FiClock,
                title: "Conflict-Free Appointment Engine",
                desc: "Time-window overlap checking that mathematically guarantees zero double-booking across physician schedules and operating rooms.",
                tech: "Date-Range Locking • Walk-in Queue • Calendar Sync",
              },
              {
                icon: FiLock,
                title: "Role-Based Governance (RBAC)",
                desc: "Strict cryptographic authentication, salted BCrypt password hashing, 256-bit JWT cookies, and endpoint isolation per staff role.",
                tech: "JWT httpOnly • Helmet • Express 5 Security Headers",
              },
            ].map((cap, i) => {
              const Icon = cap.icon;
              return (
                <div
                  key={i}
                  className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4 hover:border-blue-500/50 transition-colors"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
                    <Icon size={22} />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {cap.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {cap.desc}
                  </p>
                  <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800/60">
                    <p className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
                      {cap.tech}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. OUR CORE VALUES & MISSION */}
      {/* ========================================================================= */}
      <section className="py-16 sm:py-24 bg-slate-100/60 dark:bg-slate-950 border-b border-slate-200/80 dark:border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              Guiding Principles
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
              Our Mission &amp; Core Values
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300">
              Every architectural decision in SmartClinic adheres to four
              uncompromising pillars.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {VALUES.map((val, idx) => {
              const Icon = val.icon;
              return (
                <div
                  key={idx}
                  className={`p-8 rounded-3xl bg-white dark:bg-slate-900 border ${val.color} shadow-sm space-y-4 transition-all hover:scale-[1.01]`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800">
                      <Icon size={24} />
                    </div>
                    <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800">
                      {val.badge}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    {val.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {val.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. TARGET CUSTOMER & AUDIENCE */}
      {/* ========================================================================= */}
      <section className="py-16 sm:py-24 bg-white dark:bg-slate-900/40 border-b border-slate-200/80 dark:border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              Audience Alignment
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
              Who SmartClinic Serves
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300">
              Purpose-built for frontline healthcare teams facing high patient
              volumes and paper bottlenecks.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {TARGET_CUSTOMERS.map((tc, idx) => {
              const Icon = tc.icon;
              return (
                <div
                  key={idx}
                  className="rounded-2xl p-7 bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-5 shadow-sm flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
                        <Icon size={20} />
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-slate-900 dark:text-white">
                          {tc.type}
                        </h3>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                          {tc.role}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="p-3 rounded-xl bg-rose-50/60 dark:bg-rose-950/20 border border-rose-200/60 dark:border-rose-900/40">
                        <p className="text-[11px] font-bold text-rose-700 dark:text-rose-300">
                          The Problem:
                        </p>
                        <p className="text-xs text-rose-800 dark:text-rose-200 mt-0.5">
                          {tc.problem}
                        </p>
                      </div>

                      <div className="p-3 rounded-xl bg-blue-50/60 dark:bg-blue-950/20 border border-blue-200/60 dark:border-blue-900/40">
                        <p className="text-[11px] font-bold text-blue-700 dark:text-blue-300">
                          The Solution:
                        </p>
                        <p className="text-xs text-blue-800 dark:text-blue-200 mt-0.5">
                          {tc.solution}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-500 dark:text-slate-400">
                      Measurable Impact:
                    </span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                      {tc.metric}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. TONE OF VOICE & TECHNICAL SEO */}
      {/* ========================================================================= */}
      <section className="py-16 sm:py-24 bg-slate-100/60 dark:bg-slate-950 border-b border-slate-200/80 dark:border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Tone of Voice */}
            <div className="space-y-6">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                Brand Philosophy
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                Tone of Voice
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Healthcare software cannot afford ambiguity. Our tone is
                deliberately crafted around four principles:
              </p>
              <div className="space-y-3">
                {[
                  {
                    title: "Empathetic & Human-Centric",
                    desc: "We understand that our users are doctors under pressure, anxious patients, and rushed pharmacists. Language is simple, compassionate, and supportive.",
                  },
                  {
                    title: "Technically Rigorous & Authoritative",
                    desc: "We back our features with exact algorithmic specifications—FEFO batch math, STUN ICE video negotiation, and salted hash cryptography.",
                  },
                  {
                    title: "Transparent & Accountable",
                    desc: "No hidden subscription traps or locked patient data. We promote transparent clinical ownership and open architectural standards.",
                  },
                  {
                    title: "Action-Oriented",
                    desc: "Every button, notification, and alert in SmartClinic delivers immediate clarity on what next step the user should take.",
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-1"
                  >
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                      {item.title}
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Technical SEO & E-E-A-T */}
            <div className="space-y-6">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                Trust & Authority
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                E-E-A-T & Trust Builders
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                SmartClinic establishes search engine trust and real-world
                reliability through audited technical implementations:
              </p>

              <div className="space-y-3">
                {[
                  {
                    pillar: "Experience (E)",
                    desc: "Real-world development tested directly against outpatient clinic workflows, physical barcode scanners, and local multi-language dynamics.",
                  },
                  {
                    pillar: "Expertise (E)",
                    desc: "Architected by Anis Khan Niazi as a high-distinction BSIT Final Year Project combining Express 5, React 19, Three.js WebGL, and MongoDB Atlas.",
                  },
                  {
                    pillar: "Authoritativeness (A)",
                    desc: "Structured Schema.org JSON-LD data for SoftwareApplication and MedicalBusiness recognized by search engines for accurate indexing.",
                  },
                  {
                    pillar: "Trustworthiness (T)",
                    desc: "Strict data privacy boundaries in robots.txt preventing patient indexing, 256-bit JWT authentication, and automated audit trails.",
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-1"
                  >
                    <div className="flex items-center gap-2">
                      <FiAward className="text-blue-600 dark:text-blue-400 text-sm" />
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                        {item.pillar}
                      </h4>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 8. SOCIAL MEDIA & DEVELOPER CONTACT */}
      {/* ========================================================================= */}
      <section className="py-16 sm:py-24 bg-white dark:bg-slate-900/50 border-b border-slate-200/80 dark:border-slate-800/80">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <div className="space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              Connect Directly
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
              Connect With The Architect
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
              Have questions about the architecture, want to collaborate, or
              interested in implementing SmartClinic in your healthcare
              facility?
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {SOCIAL_LINKS.map((s, idx) => {
              const Icon = s.icon;
              return (
                <a
                  key={idx}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex flex-col items-center justify-center gap-2.5 transition-all hover:scale-105 shadow-sm group ${s.color}`}
                >
                  <Icon
                    size={24}
                    className="transition-transform group-hover:scale-110"
                  />
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-inherit">
                    {s.name}
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 group-hover:text-inherit/80">
                    {s.handle}
                  </span>
                </a>
              );
            })}
          </div>

          {/* Email Direct Note */}
          <div className="pt-4 flex items-center justify-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <FiMail className="text-blue-600" />
            <span>
              Direct Inquiries:{" "}
              <a
                href="mailto:aniskhan.developer@gmail.com"
                className="font-semibold text-blue-600 dark:text-blue-400 hover:underline"
              >
                aniskhan.developer@gmail.com
              </a>
            </span>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 9. CTA BANNER */}
      {/* ========================================================================= */}
      <section className="py-16 bg-gradient-to-tr from-blue-600 via-cyan-600 to-indigo-600 text-white text-center">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Ready to Experience the SmartClinic Difference?
          </h2>
          <p className="text-sm sm:text-base text-blue-50 max-w-xl mx-auto">
            Test the live role-adaptive portal, review EHR workflows, and
            inspect the Google Gemini AI assistant firsthand.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/login"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-white text-blue-700 font-bold text-sm px-7 py-3.5 shadow-xl hover:bg-slate-100 transition-all hover:scale-105"
            >
              <span>Launch Live System</span>
              <FiArrowRight />
            </Link>
            <Link
              to="/"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-blue-700/60 hover:bg-blue-700 text-white font-semibold text-sm px-6 py-3.5 border border-white/20 transition-all"
            >
              <span>Back to Home</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 10. FOOTER */}
      {/* ========================================================================= */}
      <Footer />
    </div>
  );
};

export default AboutUs;
