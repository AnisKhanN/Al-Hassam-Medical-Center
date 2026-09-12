import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FiActivity,
  FiUsers,
  FiPhone,
  FiClock,
  FiMapPin,
  FiMessageCircle,
  FiHeart,
  FiEye,
  FiCheckCircle,
  FiCheck,
  FiChevronDown,
  FiArrowRight,
  FiShield,
  FiPackage,
  FiCalendar,
  FiAward,
  FiCompass,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import LandingNavbar from "../../components/landing/LandingNavbar";
import Footer from "../../components/common/Footer";
import useSEO from "../../hooks/useSEO";
import { useSmoothScroll } from "../../hooks/useSmoothScroll";

// Real Human Pictures & Clinical Facilities Showcase Slides for Al-Hassam Medical Center
const HERO_FACILITY_SLIDES = [
  {
    id: "consultation",
    title: "Doctor Consultation Suite",
    subtitle: "General OPD & Specialist Care",
    badge: "Daily OPD Clinics",
    badgeColor: "bg-blue-600/90 text-white",
    desc: "Compassionate clinical consultations, physical exams, and personalized healthcare for your family.",
    image: "/images/al_hassam_doctor.jpg",
    alt: "Doctor consulting a patient at Al-Hassam Medical Center",
  },
  {
    id: "emergency",
    title: "24/7 Emergency & Triage",
    subtitle: "Immediate Acute Medical Care",
    badge: "Open 24/7 Mon–Sun",
    badgeColor: "bg-rose-600/90 text-white",
    desc: "Around-the-clock emergency response, oxygen therapy, vital stabilization, and urgent medical attention.",
    image: "/images/al_hassam_emergency.jpg",
    alt: "Emergency clinical doctors and nurses treating patient at Al-Hassam Medical Center",
  },
  {
    id: "pharmacy",
    title: "On-Site 24-Hour Pharmacy",
    subtitle: "Verified Authentic Medicines",
    badge: "100% Genuine Stock",
    badgeColor: "bg-emerald-600/90 text-white",
    desc: "Cold-chain pharmaceutical storage, FEFO safety protocols, pediatric dosages, and 24/7 counter dispensing.",
    image: "/images/al_hassam_pharmacy.jpg",
    alt: "Pharmacist dispensing medication to patient at Al-Hassam Medical Center",
  },
  {
    id: "pediatrics",
    title: "Child Care & Pediatrics Suite",
    subtitle: "Infant & Adolescent Health",
    badge: "Visiting Pediatrician",
    badgeColor: "bg-amber-600/90 text-white",
    desc: "Dedicated child checkups, routine immunization schedules, childhood fevers, and gentle pediatric care.",
    image: "/images/al_hassam_pediatrics.jpg",
    alt: "Pediatrician examining a child patient at Al-Hassam Medical Center",
  },
];

// 7 Visiting & Consulting Specialists at Al-Hassam Medical Center
const SPECIALISTS = [
  {
    id: "child-care",
    title: "Child Care & Pediatrics",
    subtitle: "Infant, Child & Adolescent Healthcare",
    desc: "Specialized pediatric consultations, newborn & infant health checks, routine vaccination schedules, childhood fevers, respiratory infections, and developmental monitoring.",
    badge: "Visiting & Consulting",
    tagColor:
      "bg-amber-50 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800",
    gradient: "from-amber-500 to-orange-500",
    icon: FiUsers,
    services: [
      "Vaccinations & Immunizations",
      "Infant Growth & Nutrition",
      "Childhood Fevers & Infections",
      "Pediatric Emergency Triage",
    ],
  },
  {
    id: "general-medicine",
    title: "General Medicine",
    subtitle: "Internal Medicine & Adult Health",
    desc: "Comprehensive diagnostic evaluations, management of chronic diabetes, hypertension, cardiovascular risks, seasonal fevers, infectious diseases, and preventive checkups.",
    badge: "24/7 Daily OPD",
    tagColor:
      "bg-blue-50 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800",
    gradient: "from-blue-600 to-indigo-600",
    icon: FiActivity,
    services: [
      "Diabetes & Blood Pressure",
      "Acute Infections & Fevers",
      "Diagnostic Bloodwork Review",
      "Preventive Health Examinations",
    ],
  },
  {
    id: "cardiology",
    title: "Cardiology",
    subtitle: "Heart & Vascular Care",
    desc: "Cardiovascular health assessments, 12-lead ECG review, hypertension regulation, preventive heart disease screening, chest pain evaluation, and cardiac consultations.",
    badge: "Visiting Consultant",
    tagColor:
      "bg-rose-50 dark:bg-rose-950/70 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800",
    gradient: "from-rose-600 to-pink-600",
    icon: FiHeart,
    services: [
      "12-Lead ECG Diagnostics",
      "Hypertension & Lipid Checks",
      "Chest Pain Risk Assessment",
      "Cardiac Health Counseling",
    ],
  },
  {
    id: "gastroenterology",
    title: "Gastroenterology",
    subtitle: "Digestive & Liver Health",
    desc: "Expert care for digestive tract disorders, stomach ulcers, acid reflux (GERD), hepatitis screening & management, irritable bowel syndrome, and hepatic guidance.",
    badge: "Visiting Specialist",
    tagColor:
      "bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800",
    gradient: "from-emerald-600 to-teal-600",
    icon: FiShield,
    services: [
      "Liver & Hepatitis Management",
      "Gastritis & Acid Reflux Relief",
      "Digestive Tract Screening",
      "Abdominal Pain Evaluation",
    ],
  },
  {
    id: "general-surgery",
    title: "General Surgery",
    subtitle: "Surgical Consultations & Minor Care",
    desc: "Surgical clinical examinations, minor surgical interventions, wound suturing, trauma care, abscess incision & drainage, pre-operative guidance, and post-op dressing.",
    badge: "Visiting Surgeon",
    tagColor:
      "bg-purple-50 dark:bg-purple-950/70 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800",
    gradient: "from-purple-600 to-violet-600",
    icon: FiCheckCircle,
    services: [
      "Surgical Consultations",
      "Minor Trauma & Suturing",
      "Wound Care & Dressing",
      "Post-Operative Recovery",
    ],
  },
  {
    id: "gynecology",
    title: "Gynecology & Obstetrics",
    subtitle: "Women's & Maternal Health",
    desc: "Dedicated female clinical consultations, antenatal pregnancy visits, postnatal recovery oversight, maternal health counseling, and ultrasound referral coordination.",
    badge: "Specialist Lady Doctor",
    tagColor:
      "bg-pink-50 dark:bg-pink-950/70 text-pink-700 dark:text-pink-300 border-pink-200 dark:border-pink-800",
    gradient: "from-pink-600 to-rose-500",
    icon: FiUsers,
    services: [
      "Antenatal & Postnatal Checks",
      "Maternal Health Monitoring",
      "Female Wellness Consultation",
      "Ultrasound Coordination",
    ],
  },
  {
    id: "ophthalmology",
    title: "Ophthalmology",
    subtitle: "Comprehensive Eye & Vision Care",
    desc: "Eye health evaluations, visual acuity testing, management of allergic and bacterial eye infections, cataract screening, glaucoma checks, and optical prescriptions.",
    badge: "Visiting Eye Specialist",
    tagColor:
      "bg-cyan-50 dark:bg-cyan-950/70 text-cyan-700 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800",
    gradient: "from-cyan-600 to-blue-600",
    icon: FiEye,
    services: [
      "Vision & Acuity Testing",
      "Cataract & Glaucoma Screen",
      "Ocular Infection Treatments",
      "Corrective Optical Guidance",
    ],
  },
];

// Physical clinical facilities at Al-Hassam Medical Center
const CLINICAL_FACILITIES = [
  {
    icon: FiActivity,
    title: "24/7 Emergency & Triage",
    desc: "Equipped for urgent first-response medical evaluation, acute stabilization, oxygen support, and rapid triage by experienced medical officers.",
    badge: "Always Open",
    color: "from-rose-500 to-red-600",
  },
  {
    icon: FiPackage,
    title: "On-Site 24-Hour Pharmacy",
    desc: "Fully stocked with genuine pharmaceuticals, essential emergency medications, pediatric dosages, and temperature-monitored storage.",
    badge: "FEFO Certified",
    color: "from-emerald-500 to-teal-600",
  },
  {
    icon: FiUsers,
    title: "Outpatient Consultation Suites",
    desc: "Private, air-conditioned consultation chambers designed for dignified doctor-patient consultations, clinical exams, and follow-up care.",
    badge: "Daily OPD",
    color: "from-blue-500 to-indigo-600",
  },
  {
    icon: FiHeart,
    title: "Diagnostic ECG & Vital Station",
    desc: "Instant 12-lead ECG recording, multi-parameter vital signs screening, blood glucose testing, and clinical pre-assessment for cardiac risks.",
    badge: "Rapid Diagnostic",
    color: "from-purple-500 to-pink-600",
  },
  {
    icon: FiAward,
    title: "Maternal & Child Health Room",
    desc: "Dedicated clinical consultation space for expectant mothers, infant growth monitoring, nutritional guidance, and pediatric health checks.",
    badge: "Specialized Suite",
    color: "from-pink-500 to-rose-600",
  },
  {
    icon: FiCheckCircle,
    title: "Minor Procedure & Dressing Suite",
    desc: "Sterile clinical environment for minor surgical suturing, clean wound dressings, burn care, and superficial trauma management.",
    badge: "Sterile Unit",
    color: "from-amber-500 to-orange-600",
  },
];

// Real Hospital & Patient FAQs
const HOSPITAL_FAQS = [
  {
    q: "Where is Al-Hassam Medical Center located in Sanghar?",
    a: "Al-Hassam Medical Center is located at Nawabshah Road, City Sanghar, Sindh, Pakistan. It is centrally accessible with roadside parking and immediate ambulance and car access.",
  },
  {
    q: "What are the center's operating hours?",
    a: "We are open 24 hours a day, 7 days a week (Monday through Sunday), 365 days a year. Our emergency medical triage, on-site pharmacy, and outpatient consultation services are available around the clock.",
  },
  {
    q: "How can I book an appointment with visiting specialist doctors?",
    a: "You can book an appointment or inquire about visiting specialist schedules by calling our direct helpline at +92 332 5136733 or by sending a message on WhatsApp. Walk-in patients are also received continuously at our reception desk.",
  },
  {
    q: "Which specialist doctor disciplines are available at Al-Hassam Medical Center?",
    a: "Our visiting and consulting faculty covers 7 key specialties: Child Care & Pediatrics, General Medicine, Cardiology, Gastroenterology, General Surgery, Gynecology & Obstetrics (Specialist Lady Doctor), and Ophthalmology (Eye Care).",
  },
  {
    q: "Is the on-site pharmacy open during the night?",
    a: "Yes, our on-site pharmacy operates 24/7 alongside the emergency center. Patients can obtain verified, authentic prescription medicines and surgical supplies at any hour of the day or night.",
  },
  {
    q: "Can I receive medication instructions in Sindhi or Urdu?",
    a: "Yes. Our doctors and clinical pharmacy provide clear verbal counseling and written instructions in Sindhi سنڌي, Roman Urdu, and English to ensure patients and family members clearly understand their treatment plan.",
  },
];

const LandingPage = () => {
  useSEO({
    title: "Al-Hassam Medical Center | 24/7 Healthcare Facility Sanghar",
    description:
      "Al-Hassam Medical Center is a premier 24-hour healthcare facility located on Nawabshah Road, City Sanghar. Emergency care, 24/7 pharmacy, outpatient clinic, and visiting specialists in child care, general medicine, cardiology, gastroenterology, general surgery, gynecology, and ophthalmology. Helpline: +92 332 5136733.",
    keywords:
      "Al-Hassam Medical Center, Sanghar healthcare, Nawabshah Road Sanghar, doctors in Sanghar, child care Sanghar, cardiology Sanghar, gynecology Sanghar, 24 hour hospital Sanghar, emergency clinic Sanghar, Anis Khan Niazi",
    canonical: "https://smartclinic.health/",
    ogImage: "/images/al_hassam_doctor.jpg",
  });

  const location = useLocation();
  const { scrollTo } = useSmoothScroll();
  const [openFaq, setOpenFaq] = useState(0);

  // Facility photo slideshow state
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-advance facility photo slideshow every 3.5 seconds
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_FACILITY_SLIDES.length);
    }, 3500);
    return () => clearInterval(timer);
  }, [isPaused]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % HERO_FACILITY_SLIDES.length);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) =>
        (prev - 1 + HERO_FACILITY_SLIDES.length) % HERO_FACILITY_SLIDES.length
    );
  };

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
    {
      value: "24/7",
      label: "Emergency & OPD",
      sub: "Open Mon – Sun (All Day)",
    },
    { value: "7+", label: "Medical Specialties", sub: "Visiting & Consulting" },
    {
      value: "100%",
      label: "On-Site Pharmacy",
      sub: "Authentic Verified Stock",
    },
    { value: "Sindh", label: "Nawabshah Road", sub: "City Sanghar, Sindh" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 selection:bg-blue-500 selection:text-white transition-colors duration-200">
      {/* 1. TOP NAVBAR */}
      <LandingNavbar />

      {/* ========================================================================= */}
      {/* 1. HERO SECTION: LEFT DETAILS & RIGHT REAL HUMAN FACILITY SLIDESHOW */}
      {/* ========================================================================= */}
      <section className="relative pt-28 pb-16 sm:pt-36 sm:pb-20 lg:pt-40 lg:pb-24 overflow-hidden">
        {/* Subtle Ambient Background Gradients */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-tr from-emerald-500/10 via-teal-500/10 to-blue-500/10 blur-3xl -z-10 pointer-events-none rounded-full" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* LEFT COLUMN: Medical Center Info & Actions */}
            <div className="lg:col-span-7 space-y-6 text-left">
              {/* Facility Badge */}
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800/80 px-3.5 py-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-300 shadow-2xs">
                <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Sanghar's Premier 24/7 Healthcare Facility</span>
              </div>

              {/* Main Headline with Correct Spelling of Center */}
              <div className="space-y-2">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.12]">
                  Al-Hassam{" "}
                  <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600 bg-clip-text text-transparent">
                    Medical Center
                  </span>
                </h1>
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-700 dark:text-slate-200 tracking-tight">
                  24/7 Healthcare Facility in Sanghar
                </p>
              </div>

              {/* Subtitle Description */}
              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal max-w-2xl">
                Al-Hassam Medical Center is a modern healthcare facility located
                on Nawabshah Road, City Sanghar, providing around-the-clock
                emergency medical services, general outpatient clinics, an
                on-site 24/7 pharmacy, and visiting consultant specialists for
                your entire family.
              </p>

              {/* Facility Snapshot Card */}
              <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800/90 bg-white/80 dark:bg-slate-900/80 p-4 sm:p-5 shadow-xs backdrop-blur-md">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                  <div className="flex items-start gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950/70 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5">
                      <FiMapPin size={16} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                        Facility Address
                      </p>
                      <p className="font-semibold text-slate-800 dark:text-slate-200 leading-snug">
                        Nawabshah Road, City Sanghar
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5">
                      <FiClock size={16} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                        Operating Hours
                      </p>
                      <p className="font-bold text-emerald-600 dark:text-emerald-400 leading-snug">
                        Open 24 Hours (Monday–Sunday)
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Call to Action Row */}
              <div className="flex flex-wrap items-center gap-3 pt-1">
                {/* Primary Call Hotline */}
                <a
                  href="tel:+923325136733"
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs sm:text-sm px-5 py-3.5 shadow-lg shadow-emerald-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  <FiPhone size={16} className="animate-pulse" />
                  <span>Call +92 332 5136733</span>
                </a>

                {/* WhatsApp Consultation */}
                <a
                  href="https://wa.me/923325136733?text=Hello%20Al-Hassam%20Medical%20Center,%20I%20would%20like%20to%20inquire%20about%20a%20specialist%20doctor%20appointment."
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 font-bold text-xs sm:text-sm px-4 py-3.5 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 shadow-xs transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <FiMessageCircle size={16} />
                  <span>WhatsApp Clinic</span>
                </a>

                {/* Explore Specialists */}
                <button
                  type="button"
                  onClick={() => scrollTo("#specialists", { offset: -80 })}
                  className="inline-flex items-center gap-2 rounded-xl bg-white/90 dark:bg-slate-900/90 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-800 font-bold text-xs sm:text-sm px-4 py-3.5 shadow-xs backdrop-blur-md transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                >
                  <FiUsers size={16} className="text-blue-500" />
                  <span>Visiting Specialists</span>
                </button>

                {/* Staff Login */}
                <Link
                  to="/login"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 transition-colors ml-auto sm:ml-0"
                >
                  <span>Staff Portal</span>
                  <FiArrowRight size={13} />
                </Link>
              </div>

              {/* Highlights Bullet Strip */}
              <div className="pt-3 border-t border-slate-200/80 dark:border-slate-800/80 flex flex-wrap items-center gap-y-2 gap-x-4 text-xs font-medium text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                  <FiCheckCircle size={14} className="text-emerald-500" /> 7+
                  Visiting Specialist Disciplines
                </span>
                <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                  <FiCheckCircle size={14} className="text-emerald-500" />{" "}
                  On-Site 24/7 Pharmacy
                </span>
                <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                  <FiCheckCircle size={14} className="text-emerald-500" />{" "}
                  Trilingual Patient Counseling (سنڌي / اردو / Eng)
                </span>
              </div>
            </div>

            {/* RIGHT COLUMN: Auto-Rotating Real Human Pictures & Clinical Facilities Slideshow */}
            <div
              className="lg:col-span-5 relative flex items-center justify-center"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              {/* Ambient Glowing Orbs */}
              <div className="absolute -top-6 -right-6 w-80 h-80 bg-gradient-to-bl from-emerald-500/20 via-teal-500/20 to-blue-400/20 rounded-full blur-2xl -z-10 pointer-events-none animate-pulse duration-3000" />
              <div className="absolute -bottom-8 -left-8 w-72 h-72 bg-gradient-to-tr from-blue-500/20 via-indigo-500/15 to-purple-500/20 rounded-full blur-2xl -z-10 pointer-events-none" />

              {/* Real Human Photography Slideshow Frame */}
              <div className="relative w-full max-w-lg aspect-[4/3] sm:aspect-[14/11] rounded-3xl overflow-hidden shadow-2xl border-2 border-slate-200/90 dark:border-slate-800/90 bg-slate-900 group">
                {/* Images Stack with Smooth Crossfade */}
                {HERO_FACILITY_SLIDES.map((slide, idx) => {
                  const isActive = idx === currentSlide;
                  return (
                    <div
                      key={slide.id}
                      className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                        isActive
                          ? "opacity-100 z-10"
                          : "opacity-0 z-0 pointer-events-none"
                      }`}
                    >
                      <img
                        src={slide.image}
                        alt={slide.alt}
                        className={`w-full h-full object-cover object-center transform transition-transform duration-1000 ${
                          isActive ? "scale-100" : "scale-105"
                        }`}
                      />
                      {/* Dark Gradient Vignette for Text Contrast */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-black/10 pointer-events-none" />
                    </div>
                  );
                })}

                {/* Top Bar inside image: Department Badge & Slide Counter */}
                <div className="absolute top-3.5 left-3.5 right-3.5 z-20 flex items-center justify-between pointer-events-none">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold shadow-md backdrop-blur-md ${HERO_FACILITY_SLIDES[currentSlide].badgeColor}`}
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
                    <span>{HERO_FACILITY_SLIDES[currentSlide].badge}</span>
                  </span>

                  <span className="inline-flex items-center gap-1 rounded-full bg-black/60 border border-white/20 px-2.5 py-1 text-[10px] font-bold text-white shadow-xs backdrop-blur-md">
                    <span>
                      Facility {currentSlide + 1} of{" "}
                      {HERO_FACILITY_SLIDES.length}
                    </span>
                  </span>
                </div>

                {/* Bottom Caption & Controls Overlay */}
                <div className="absolute bottom-3.5 left-3.5 right-3.5 z-20 text-white space-y-2">
                  <div className="bg-slate-950/75 border border-white/15 p-3.5 rounded-2xl backdrop-blur-md space-y-1 text-left shadow-lg">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="text-sm sm:text-base font-black text-white leading-tight">
                        {HERO_FACILITY_SLIDES[currentSlide].title}
                      </h3>
                      <span className="text-[10px] font-bold text-emerald-300 shrink-0">
                        Sanghar, Sindh
                      </span>
                    </div>
                    <p className="text-[11px] sm:text-xs text-slate-200 leading-snug">
                      {HERO_FACILITY_SLIDES[currentSlide].desc}
                    </p>

                    {/* Progress Dots & Nav Buttons */}
                    <div className="pt-2 mt-2 border-t border-white/10 flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        {HERO_FACILITY_SLIDES.map((_, dotIdx) => (
                          <button
                            key={dotIdx}
                            type="button"
                            onClick={() => setCurrentSlide(dotIdx)}
                            aria-label={`Go to slide ${dotIdx + 1}`}
                            className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                              dotIdx === currentSlide
                                ? "w-6 bg-emerald-400"
                                : "w-2 bg-white/40 hover:bg-white/70"
                            }`}
                          />
                        ))}
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={prevSlide}
                          aria-label="Previous facility"
                          className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/15 hover:bg-white/30 text-white transition-colors cursor-pointer"
                        >
                          <FiChevronLeft size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={nextSlide}
                          aria-label="Next facility"
                          className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/15 hover:bg-white/30 text-white transition-colors cursor-pointer"
                        >
                          <FiChevronRight size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Animated Glass Card 1 (Top Right): 24/7 Status */}
              <div className="absolute -top-4 -right-2 sm:-right-4 bg-white/95 dark:bg-slate-900/95 border border-emerald-200 dark:border-emerald-800/80 p-3 sm:p-3.5 rounded-2xl shadow-xl backdrop-blur-xl z-20 animate-in fade-in slide-in-from-right duration-300">
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0 shadow-2xs">
                    <FiClock size={16} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                      Center Status
                    </p>
                    <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Open 24/7 Now
                    </p>
                  </div>
                </div>
              </div>

              {/* Floating Animated Glass Card 2 (Bottom Left): 7+ Specialists */}
              <div className="absolute -bottom-5 -left-2 sm:-left-4 bg-white/95 dark:bg-slate-900/95 border border-blue-200 dark:border-blue-800/80 p-3 sm:p-3.5 rounded-2xl shadow-xl backdrop-blur-xl z-20 animate-in fade-in slide-in-from-left duration-300">
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-xl bg-blue-100 dark:bg-blue-950/80 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0 shadow-2xs">
                    <FiUsers size={16} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                      Medical Faculty
                    </p>
                    <p className="text-xs font-bold text-slate-900 dark:text-white">
                      7+ Specialists Available
                    </p>
                  </div>
                </div>
              </div>

              {/* Floating Animated Glass Card 3 (Left Middle): Phone Hotline */}
              <div className="absolute top-1/2 -left-4 sm:-left-8 -translate-y-1/2 hidden sm:flex items-center gap-2.5 bg-white/95 dark:bg-slate-900/95 border border-slate-200/90 dark:border-slate-800/90 px-3.5 py-2.5 rounded-2xl shadow-xl backdrop-blur-xl z-20">
                <div className="h-7 w-7 rounded-lg bg-emerald-100 dark:bg-emerald-950/80 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
                  <FiPhone size={14} className="animate-pulse" />
                </div>
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    Emergency Helpline
                  </p>
                  <p className="text-xs font-bold text-slate-900 dark:text-white">
                    +92 332 5136733
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Social Proof Feature Badges under Hero */}
          <div className="mt-14 sm:mt-16 pt-8 sm:pt-10 border-t border-slate-200/80 dark:border-slate-800/80">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/70 dark:border-slate-800/70 shadow-2xs backdrop-blur-sm">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 shrink-0">
                  <FiClock size={18} />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                    24/7 Availability
                  </p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">
                    Monday to Sunday all-day
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/70 dark:border-slate-800/70 shadow-2xs backdrop-blur-sm">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 shrink-0">
                  <FiUsers size={18} />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                    Visiting Specialists
                  </p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">
                    7 specialized disciplines
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/70 dark:border-slate-800/70 shadow-2xs backdrop-blur-sm">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 shrink-0">
                  <FiPackage size={18} />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                    On-Site Pharmacy
                  </p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">
                    24/7 verified medication stock
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/70 dark:border-slate-800/70 shadow-2xs backdrop-blur-sm">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 shrink-0">
                  <FiMapPin size={18} />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                    Nawabshah Road
                  </p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">
                    City Sanghar
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Ticker */}
          <div className="mt-10 sm:mt-12 pt-8 sm:pt-10 border-t border-slate-200/80 dark:border-slate-800/80 grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            {STATS.map((stat, i) => (
              <div key={i} className="text-center sm:text-left">
                <p className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                  {stat.value}
                </p>
                <p className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 mt-1">
                  {stat.label}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  {stat.sub}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. DEDICATED SPECIALISTS & VISITING DOCTORS SHOWCASE */}
      {/* ========================================================================= */}
      <section
        id="specialists"
        className="py-20 sm:py-24 bg-white dark:bg-slate-900/80 border-y border-slate-200/80 dark:border-slate-800/80 transition-colors"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 sm:mb-16">
            <div className="space-y-3 max-w-2xl text-left">
              <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 dark:bg-blue-950/70 border border-blue-200 dark:border-blue-800 px-3.5 py-1 text-xs font-bold text-blue-700 dark:text-blue-300">
                <FiUsers size={13} />
                <span>Specialist Consultation Faculty</span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
                Visiting &amp; Consulting Medical Specialists
              </h2>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                Al-Hassam Medical Center offers access to experienced visiting
                and consulting physicians across 7 major healthcare disciplines
                right here in Sanghar.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <a
                href="tel:+923325136733"
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2.5 shadow-md shadow-emerald-500/20 transition-all"
              >
                <FiPhone size={14} />
                <span>Book Appointment (+92 332 5136733)</span>
              </a>
            </div>
          </div>

          {/* Specialists 7-Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SPECIALISTS.map((spec) => {
              const Icon = spec.icon;
              return (
                <div
                  key={spec.id}
                  className="rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950/50 p-6 flex flex-col justify-between hover:shadow-lg transition-all hover:border-blue-300 dark:hover:border-blue-800/80 group text-left"
                >
                  <div className="space-y-4">
                    {/* Header with Icon & Badge */}
                    <div className="flex items-center justify-between gap-3">
                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr ${spec.gradient} text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform`}
                      >
                        <Icon size={22} />
                      </div>
                      <span
                        className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${spec.tagColor}`}
                      >
                        {spec.badge}
                      </span>
                    </div>

                    {/* Titles */}
                    <div>
                      <h3 className="text-lg font-black text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {spec.title}
                      </h3>
                      <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
                        {spec.subtitle}
                      </p>
                    </div>

                    {/* Description */}
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      {spec.desc}
                    </p>

                    {/* Services Pill List */}
                    <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800/60 space-y-1.5">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                        Consultation Scope:
                      </p>
                      <div className="grid grid-cols-1 gap-1">
                        {spec.services.map((srv, idx) => (
                          <div
                            key={idx}
                            className="flex items-center gap-1.5 text-[11px] text-slate-700 dark:text-slate-300"
                          >
                            <FiCheck
                              className="text-emerald-500 shrink-0"
                              size={12}
                            />
                            <span className="truncate">{srv}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Card Action */}
                  <div className="pt-5 mt-5 border-t border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between">
                    <a
                      href="tel:+923325136733"
                      className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                    >
                      <FiPhone size={12} />
                      <span>Inquire Schedule</span>
                    </a>
                    <a
                      href={`https://wa.me/923325136733?text=Hello%20Al-Hassam%20Medical%20Center,%20I%20want%20to%20consult%20the%20${encodeURIComponent(
                        spec.title
                      )}%20doctor.`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
                    >
                      <FiMessageCircle size={12} />
                      <span>WhatsApp</span>
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. CLINICAL FACILITIES & 24/7 PHARMACY */}
      {/* ========================================================================= */}
      <section
        id="facilities"
        className="py-20 sm:py-24 bg-slate-100/70 dark:bg-slate-950/70 transition-colors"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-12 sm:mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 block">
              Hospital Infrastructure
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
              Clinical Facilities &amp; 24-Hour Services
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              Al-Hassam Medical Center is equipped with modern healthcare units
              engineered to ensure rapid, dependable patient care around the
              clock in Sanghar.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {CLINICAL_FACILITIES.map((facility, idx) => {
              const Icon = facility.icon;
              return (
                <div
                  key={idx}
                  className="rounded-3xl border border-slate-200/90 dark:border-slate-800/90 bg-white dark:bg-slate-900/90 p-6 sm:p-7 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between text-left group"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr ${facility.color} text-white shadow-md group-hover:scale-105 transition-transform`}
                      >
                        <Icon size={22} />
                      </div>
                      <span className="text-[10px] font-bold px-2.5 py-1 rounded-full border bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800">
                        {facility.badge}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                        {facility.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                        {facility.desc}
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 mt-5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
                    <span>Available On-Site</span>
                    <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <FiCheckCircle size={13} /> Active 24/7
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. ABOUT AL-HASSAM MEDICAL CENTER */}
      {/* ========================================================================= */}
      <section
        id="about"
        className="py-20 sm:py-24 bg-white dark:bg-slate-900/80 border-y border-slate-200/80 dark:border-slate-800/80 transition-colors"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Left Column: Visual Pillars */}
            <div className="lg:col-span-5 space-y-4">
              <div className="relative rounded-3xl overflow-hidden border border-slate-200/90 dark:border-slate-800/90 bg-gradient-to-br from-emerald-600 via-teal-700 to-blue-700 text-white p-8 sm:p-10 shadow-2xl space-y-6 text-left">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-md text-white shadow-lg">
                  <FiAward size={28} />
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-200 block">
                    Our Mission
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-black mt-1">
                    Quality Healthcare Close to Home
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-emerald-50 leading-relaxed">
                  Al-Hassam Medical Center was established on Nawabshah Road to
                  ensure that the people of Sanghar have immediate access to
                  top-tier doctors, 24/7 emergency response, and verified
                  pharmaceutical care without requiring long-distance travel.
                </p>

                <div className="pt-4 border-t border-white/20 grid grid-cols-2 gap-4 text-xs font-semibold">
                  <div>
                    <p className="text-lg font-black text-white">24 Hours</p>
                    <p className="text-[11px] text-emerald-100">
                      Every Single Day
                    </p>
                  </div>
                  <div>
                    <p className="text-lg font-black text-white">7 Disciplines</p>
                    <p className="text-[11px] text-emerald-100">
                      Consulting Faculty
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Mission Details & Ethics */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800 px-3.5 py-1 text-xs font-bold text-emerald-700 dark:text-emerald-300">
                <FiCompass size={13} />
                <span>About Our Medical Center</span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
                Compassionate Healthcare Committed to Sanghar
              </h2>

              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                Located prominently on Nawabshah Road, City Sanghar, Al-Hassam Medical
                Center combines modern medical protocols with warm, personal
                attention. Whether you need immediate emergency assistance late
                at night, routine checkups for chronic ailments, or a scheduled
                consultation with visiting specialists, our center is ready to
                serve you.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800/80 space-y-1">
                  <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white text-xs sm:text-sm">
                    <FiCheckCircle className="text-emerald-500 shrink-0" />
                    <span>Patient-First Ethics</span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Transparent medical recommendations and respectful,
                    empathetic treatment for every patient.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800/80 space-y-1">
                  <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white text-xs sm:text-sm">
                    <FiCheckCircle className="text-emerald-500 shrink-0" />
                    <span>24/7 Preparedness</span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Continuous clinical duty ensuring you never face a locked
                    door during medical emergencies.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800/80 space-y-1">
                  <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white text-xs sm:text-sm">
                    <FiCheckCircle className="text-emerald-500 shrink-0" />
                    <span>Genuine Medications</span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Strict batch tracking and quality assurance guaranteeing
                    authentic, safe pharmaceuticals.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800/80 space-y-1">
                  <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white text-xs sm:text-sm">
                    <FiCheckCircle className="text-emerald-500 shrink-0" />
                    <span>Community Rooted</span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Serving Sanghar families with multilingual communication in
                    Sindhi, Urdu, and English.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. LOCATION & 24/7 CONTACT HUB */}
      {/* ========================================================================= */}
      <section
        id="contact"
        className="py-16 sm:py-20 bg-slate-100/70 dark:bg-slate-950/80 transition-colors"
      >
        <div id="location" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-slate-200/90 dark:border-slate-800/90 bg-white/90 dark:bg-slate-900/90 p-6 sm:p-10 shadow-lg backdrop-blur-md text-left">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-5">
                <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800 px-3.5 py-1 text-xs font-bold text-emerald-700 dark:text-emerald-300">
                  <FiMapPin size={13} />
                  <span>Central Healthcare Facility in Sanghar</span>
                </div>
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                  Visit Us on Nawabshah Road
                </h3>
                <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                  Al-Hassam Medical Center is conveniently situated on
                  Nawabshah Road in Sanghar, offering prompt access for
                  outpatients, emergency cases, and families consulting visiting
                  specialists.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/70 dark:border-slate-800/70">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                      Physical Address
                    </p>
                    <p className="text-sm font-bold text-slate-900 dark:text-white mt-1">
                      Nawabshah Road, City Sanghar
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Sindh, Pakistan
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/70 dark:border-slate-800/70">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                      Operating Schedule
                    </p>
                    <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                      Open 24 Hours (Monday–Sunday)
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      365 Days a Year Continuous Care
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-3">
                  <a
                    href="tel:+923325136733"
                    className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-5 py-3 shadow-md shadow-emerald-500/20 transition-all"
                  >
                    <FiPhone size={15} />
                    <span>Call Center (+92 332 5136733)</span>
                  </a>
                  <a
                    href="https://wa.me/923325136733?text=Hello%20Al-Hassam%20Medical%20Center,%20I%20would%20like%20to%20inquire%20about%20visiting%20specialist%20doctors."
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 font-bold text-xs px-4 py-3 hover:bg-emerald-100 transition-colors"
                  >
                    <FiMessageCircle size={15} />
                    <span>Message on WhatsApp</span>
                  </a>
                  <a
                    href="https://maps.google.com/?q=Nawabshah+Road+Sanghar"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs px-4 py-3 transition-colors"
                  >
                    <FiMapPin size={15} className="text-blue-500" />
                    <span>Open in Google Maps</span>
                  </a>
                </div>
              </div>

              <div className="lg:col-span-5 space-y-3">
                <div className="p-6 rounded-3xl bg-gradient-to-br from-emerald-600 via-teal-600 to-blue-600 text-white shadow-xl space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold uppercase tracking-wider bg-white/20 px-2.5 py-0.5 rounded-full">
                      Emergency &amp; Outpatient
                    </span>
                    <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-300 animate-ping" />
                  </div>
                  <h4 className="text-xl font-black">24/7 Care Coordination</h4>
                  <p className="text-xs text-blue-50 leading-relaxed">
                    Immediate first-response clinical triage, doctor
                    appointments, on-site prescription dispensing, and
                    compassionate patient care in Sindhi, Urdu, and English.
                  </p>
                  <div className="pt-3 border-t border-white/20 text-xs font-semibold flex items-center justify-between">
                    <span>Emergency Helpline</span>
                    <a
                      href="tel:+923325136733"
                      className="text-yellow-300 hover:underline font-bold text-sm"
                    >
                      +92 332 5136733
                    </a>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                    <p className="font-bold text-slate-900 dark:text-white">
                      Location
                    </p>
                    <p className="text-slate-500 dark:text-slate-400">
                      Nawabshah Road, City Sanghar
                    </p>
                  </div>
                  <div className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                    <p className="font-bold text-slate-900 dark:text-white">
                      Facility Tier
                    </p>
                    <p className="text-emerald-600 dark:text-emerald-400 font-semibold">
                      Specialist &amp; Emergency
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. FREQUENTLY ASKED QUESTIONS */}
      {/* ========================================================================= */}
      <section
        id="faq"
        className="py-20 sm:py-24 bg-white dark:bg-slate-900/60 border-t border-slate-200/80 dark:border-slate-800/80 transition-colors"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 text-left">
          <div className="text-center space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 block">
              Patient Information
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-xl mx-auto">
              Everything you need to know about visiting Al-Hassam Medical
              Center, timings, appointments, and emergency services.
            </p>
          </div>

          <div className="space-y-4">
            {HOSPITAL_FAQS.map((faq, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900/90 shadow-2xs overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === idx ? -1 : idx)}
                  className="w-full flex items-center justify-between p-5 sm:p-6 text-left text-sm sm:text-base font-bold text-slate-900 dark:text-white focus:outline-none cursor-pointer"
                >
                  <span className="pr-4">{faq.q}</span>
                  <FiChevronDown
                    className={`shrink-0 transition-transform duration-200 text-slate-400 ${
                      openFaq === idx ? "rotate-180 text-emerald-600" : ""
                    }`}
                  />
                </button>
                {openFaq === idx && (
                  <div className="px-5 pb-6 sm:px-6 sm:pb-7 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800/80 pt-4">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. HIGH-IMPACT MEDICAL CENTER EMERGENCY BANNER */}
      {/* ========================================================================= */}
      <section className="py-20 sm:py-24 bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600 text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/15 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 relative z-10">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/20 backdrop-blur-md px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-emerald-100">
            <FiClock size={14} /> Open 24/7 Monday through Sunday
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
            Need Immediate Medical Assistance or Doctor Consultation?
          </h2>
          <p className="text-sm sm:text-base text-emerald-50 max-w-xl mx-auto leading-relaxed">
            Al-Hassam Medical Center is always ready to receive you on
            Nawabshah Road in Sanghar. Call our 24/7 hotline or visit us
            directly.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <a
              href="tel:+923325136733"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-full bg-white text-emerald-700 hover:text-emerald-800 font-extrabold text-sm sm:text-base px-8 py-4 shadow-xl hover:shadow-2xl transition-all hover:scale-105 active:scale-95"
            >
              <FiPhone size={18} className="animate-pulse" />
              <span>Call Helpline: +92 332 5136733</span>
            </a>
            <a
              href="https://wa.me/923325136733?text=Hello%20Al-Hassam%20Medical%20Center,%20I%20need%20assistance."
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-emerald-700/80 hover:bg-emerald-800 text-white font-bold text-sm px-6 py-4 border border-white/20 transition-all hover:scale-105 active:scale-95"
            >
              <FiMessageCircle size={18} />
              <span>WhatsApp Message</span>
            </a>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 8. FOOTER */}
      {/* ========================================================================= */}
      <Footer />
    </div>
  );
};

export default LandingPage;
