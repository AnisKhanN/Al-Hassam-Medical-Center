import { useState, useEffect, useRef, useCallback } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FiMenu,
  FiX,
  FiArrowRight,
  FiActivity,
  FiFileText,
  FiDownload,
  FiShield,
  FiCpu,
  FiPackage,
  FiVideo,
  FiZap,
  FiHelpCircle,
  FiChevronDown,
  FiUser,
  FiUsers,
  FiCreditCard,
  FiLogOut,
  FiSettings,
  FiExternalLink,
  FiCheckCircle,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import ThemeToggle from "../common/ThemeToggle";
import { useAuth } from "../../hooks/useAuth";
import { useSmoothScroll } from "../../hooks/useSmoothScroll";

const NAV_LINKS = [
  {
    id: "features",
    label: "Features",
    href: "#features",
    anchor: "#features",
    icon: FiZap,
  },
  {
    id: "reception",
    label: "Reception Desk",
    href: "#features",
    anchor: "#features",
    icon: FiUsers,
    badge: "Queue",
    isDropdown: "reception",
  },
  {
    id: "pharmacy",
    label: "Pharmacy Store",
    href: "#features",
    anchor: "#features",
    icon: FiPackage,
    badge: "POS",
    isDropdown: "pharmacy",
  },
  {
    id: "ai-engine",
    label: "AI Hub",
    href: "#ai-engine",
    anchor: "#ai-engine",
    icon: FiCpu,
  },
  {
    id: "modules",
    label: "Modules",
    href: "#modules",
    anchor: "#modules",
    icon: FiActivity,
  },
  {
    id: "workflows",
    label: "Telemedicine",
    href: "#workflows",
    anchor: "#workflows",
    icon: FiVideo,
  },
  {
    id: "docs",
    label: "Docs & Reports",
    href: "/docs",
    isRoute: true,
    icon: FiFileText,
    badge: "FYP",
    isDropdown: "docs",
  },
  {
    id: "about",
    label: "About",
    href: "/about",
    isRoute: true,
    icon: FiActivity,
  },
];

const ROLE_BADGE_COLORS = {
  Admin:
    "bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800",
  Doctor:
    "bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800",
  Receptionist:
    "bg-cyan-100 dark:bg-cyan-950/80 text-cyan-700 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800",
  Pharmacist:
    "bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800",
};

const LandingNavbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [hoveredNav, setHoveredNav] = useState(null);

  // Dropdown states
  const [docsDropdownOpen, setDocsDropdownOpen] = useState(false);
  const [receptionDropdownOpen, setReceptionDropdownOpen] = useState(false);
  const [pharmacyDropdownOpen, setPharmacyDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  // Refs for outside click and hover handling
  const docsDropdownRef = useRef(null);
  const receptionDropdownRef = useRef(null);
  const pharmacyDropdownRef = useRef(null);
  const userDropdownRef = useRef(null);

  const docsTimeoutRef = useRef(null);
  const receptionTimeoutRef = useRef(null);
  const pharmacyTimeoutRef = useRef(null);
  const userDropdownTimeoutRef = useRef(null);

  const { user, logout } = useAuth();
  const { scrollTo } = useSmoothScroll();
  const location = useLocation();
  const navigate = useNavigate();

  // Handle scroll detection and active section spy
  const handleScroll = useCallback(() => {
    setIsScrolled(window.scrollY > 20);

    // ScrollSpy logic for section highlighting on landing page
    if (location.pathname === "/") {
      if (window.scrollY < 120) {
        setActiveSection("");
        return;
      }

      const sections = [
        "features",
        "ai-engine",
        "modules",
        "workflows",
        "security",
        "faq",
      ];
      const scrollPosition = window.scrollY + 220;

      let current = "";
      for (const secId of sections) {
        const el = document.getElementById(secId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            current = secId;
            break;
          }
        }
      }
      setActiveSection(current);
    } else if (
      location.pathname.startsWith("/docs") ||
      location.pathname.startsWith("/project-report") ||
      location.pathname.startsWith("/rbac-report")
    ) {
      setActiveSection("docs");
    } else if (location.pathname === "/about") {
      setActiveSection("about");
    }
  }, [location.pathname]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        docsDropdownRef.current &&
        !docsDropdownRef.current.contains(e.target)
      ) {
        setDocsDropdownOpen(false);
      }
      if (
        receptionDropdownRef.current &&
        !receptionDropdownRef.current.contains(e.target)
      ) {
        setReceptionDropdownOpen(false);
      }
      if (
        pharmacyDropdownRef.current &&
        !pharmacyDropdownRef.current.contains(e.target)
      ) {
        setPharmacyDropdownOpen(false);
      }
      if (
        userDropdownRef.current &&
        !userDropdownRef.current.contains(e.target)
      ) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close menus on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setMobileMenuOpen(false);
        setDocsDropdownOpen(false);
        setReceptionDropdownOpen(false);
        setPharmacyDropdownOpen(false);
        setUserDropdownOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Prevent background body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  // Handle smooth navigation to sections or external pages
  const handleNavClick = (e, link) => {
    if (link.isRoute) {
      setMobileMenuOpen(false);
      return;
    }
    e.preventDefault();
    if (location.pathname !== "/") {
      navigate(`/${link.anchor || link.href}`);
    } else {
      scrollTo(link.anchor || link.href, { offset: -80 });
    }
    setMobileMenuOpen(false);
  };

  const isLinkActive = (link) => {
    if (link.isRoute) {
      if (link.href === "/docs") {
        return (
          location.pathname.startsWith("/docs") ||
          location.pathname.startsWith("/project-report") ||
          location.pathname.startsWith("/rbac-report")
        );
      }
      return location.pathname === link.href;
    }
    return location.pathname === "/" && activeSection === link.id;
  };

  // Graceful hover timers for Docs dropdown
  const handleDocsMouseEnter = () => {
    if (docsTimeoutRef.current) clearTimeout(docsTimeoutRef.current);
    setReceptionDropdownOpen(false);
    setPharmacyDropdownOpen(false);
    setDocsDropdownOpen(true);
  };

  const handleDocsMouseLeave = () => {
    docsTimeoutRef.current = setTimeout(() => {
      setDocsDropdownOpen(false);
    }, 200);
  };

  // Graceful hover timers for Reception dropdown
  const handleReceptionMouseEnter = () => {
    if (receptionTimeoutRef.current) clearTimeout(receptionTimeoutRef.current);
    setDocsDropdownOpen(false);
    setPharmacyDropdownOpen(false);
    setReceptionDropdownOpen(true);
  };

  const handleReceptionMouseLeave = () => {
    receptionTimeoutRef.current = setTimeout(() => {
      setReceptionDropdownOpen(false);
    }, 200);
  };

  // Graceful hover timers for Pharmacy dropdown
  const handlePharmacyMouseEnter = () => {
    if (pharmacyTimeoutRef.current) clearTimeout(pharmacyTimeoutRef.current);
    setDocsDropdownOpen(false);
    setReceptionDropdownOpen(false);
    setPharmacyDropdownOpen(true);
  };

  const handlePharmacyMouseLeave = () => {
    pharmacyTimeoutRef.current = setTimeout(() => {
      setPharmacyDropdownOpen(false);
    }, 200);
  };

  // Graceful hover timers for User dropdown
  const handleUserMouseEnter = () => {
    if (userDropdownTimeoutRef.current)
      clearTimeout(userDropdownTimeoutRef.current);
    setUserDropdownOpen(true);
  };

  const handleUserMouseLeave = () => {
    userDropdownTimeoutRef.current = setTimeout(() => {
      setUserDropdownOpen(false);
    }, 200);
  };

  const handleLogout = async () => {
    setUserDropdownOpen(false);
    setMobileMenuOpen(false);
    await logout();
    navigate("/login");
  };

  // Jump to specific interactive preview tab on landing page
  const jumpToLandingPreview = (tabId) => {
    setReceptionDropdownOpen(false);
    setPharmacyDropdownOpen(false);
    setDocsDropdownOpen(false);
    setMobileMenuOpen(false);

    if (location.pathname !== "/") {
      navigate(`/#${tabId}`);
    } else {
      scrollTo("#features", { offset: -80 });
      window.dispatchEvent(
        new CustomEvent("smartclinic-set-preview-tab", { detail: tabId })
      );
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 dark:bg-slate-950/95 backdrop-blur-md shadow-xs border-b border-slate-200/80 dark:border-slate-800/80 py-2.5 sm:py-3"
          : "bg-transparent py-4 sm:py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-3">
        {/* Brand Logo & SaaS Tag */}
        <Link to="/" className="flex items-center gap-3 group shrink-0">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 via-blue-600 to-cyan-500 text-white shadow-md shadow-blue-500/25 group-hover:scale-105 group-hover:shadow-blue-500/40 transition-all duration-200">
            <FiActivity size={22} className="stroke-[2.5]" />
            <span className="absolute -bottom-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border-2 border-white dark:border-slate-950" />
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-black tracking-tight text-slate-900 dark:text-white">
                SmartClinic
              </span>
              <span className="inline-flex items-center rounded-full bg-blue-50 dark:bg-blue-950/70 border border-blue-200 dark:border-blue-800/80 px-2 py-0.5 text-[10px] font-extrabold text-blue-700 dark:text-blue-300">
                SaaS OS
              </span>
            </div>
            <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 hidden sm:block">
              Outpatient EHR &amp; Pharmacy
            </p>
          </div>
        </Link>

        {/* Desktop Navigation with Animated Pill Indicator & Mega Dropdowns */}
        <nav
          className="hidden lg:flex items-center gap-0.5 bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 rounded-full p-1.5 backdrop-blur-md shadow-xs relative"
          onMouseLeave={() => setHoveredNav(null)}
        >
          {NAV_LINKS.map((link) => {
            const active = isLinkActive(link);
            const isHovered = hoveredNav === link.id;

            // 1. RECEPTION DESK MEGA DROPDOWN
            if (link.isDropdown === "reception") {
              return (
                <div
                  key={link.id}
                  className="relative"
                  ref={receptionDropdownRef}
                  onMouseEnter={handleReceptionMouseEnter}
                  onMouseLeave={handleReceptionMouseLeave}
                >
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      setReceptionDropdownOpen(!receptionDropdownOpen);
                    }}
                    className={`relative flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full transition-colors duration-200 z-10 cursor-pointer ${
                      active
                        ? "text-white"
                        : "text-slate-700 dark:text-slate-200 hover:text-emerald-600 dark:hover:text-emerald-400"
                    }`}
                    aria-expanded={receptionDropdownOpen}
                    aria-haspopup="true"
                  >
                    <FiUsers
                      size={13}
                      className={
                        active
                          ? "text-white"
                          : "text-emerald-600 dark:text-emerald-400"
                      }
                    />
                    <span>{link.label}</span>
                    <span
                      className={`text-[9px] font-black px-1.5 py-0.2 rounded-full uppercase tracking-wider ${
                        active
                          ? "bg-white/25 text-white"
                          : "bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                      }`}
                    >
                      {link.badge}
                    </span>
                    <FiChevronDown
                      size={12}
                      className={`transition-transform duration-200 ${
                        receptionDropdownOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {/* Active / Hover Background Pill */}
                  {active && (
                    <motion.div
                      layoutId="activeNavPill"
                      className="absolute inset-0 bg-blue-600 rounded-full shadow-sm shadow-blue-500/30 z-0"
                      transition={{
                        type: "spring",
                        stiffness: 380,
                        damping: 30,
                      }}
                    />
                  )}
                  {!active && isHovered && (
                    <motion.div
                      layoutId="hoverNavPill"
                      className="absolute inset-0 bg-slate-100 dark:bg-slate-800 rounded-full z-0"
                      transition={{
                        type: "spring",
                        stiffness: 450,
                        damping: 35,
                      }}
                    />
                  )}

                  {/* Reception Mega-Flyout Panel */}
                  {receptionDropdownOpen && (
                    <div
                      className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-96 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 shadow-2xl backdrop-blur-md z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                      onMouseEnter={handleReceptionMouseEnter}
                      onMouseLeave={handleReceptionMouseLeave}
                    >
                      {/* Header & Census Banner */}
                      <div className="px-3 py-2.5 bg-gradient-to-r from-emerald-500/10 via-teal-500/5 to-cyan-500/10 rounded-xl border border-emerald-200/60 dark:border-emerald-800/60 mb-2">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <div className="p-1.5 rounded-lg bg-emerald-600 text-white shadow-xs">
                              <FiUsers size={14} />
                            </div>
                            <div>
                              <p className="text-xs font-bold text-slate-900 dark:text-white">
                                Reception Desk &amp; OPD Triage
                              </p>
                              <p className="text-[10px] text-slate-500 dark:text-slate-400">
                                Front-Desk Queue &amp; Intake
                              </p>
                            </div>
                          </div>
                          <span className="flex items-center gap-1 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            Live Queue
                          </span>
                        </div>
                        <div className="grid grid-cols-3 gap-1.5 mt-2 pt-2 border-t border-emerald-200/50 dark:border-emerald-800/50 text-center">
                          <div>
                            <p className="text-[9px] text-slate-500 dark:text-slate-400">
                              Today's Tokens
                            </p>
                            <p className="text-xs font-black text-emerald-600 dark:text-emerald-400">
                              48 Issued
                            </p>
                          </div>
                          <div>
                            <p className="text-[9px] text-slate-500 dark:text-slate-400">
                              Lobby Waiting
                            </p>
                            <p className="text-xs font-black text-amber-600 dark:text-amber-400">
                              4 Patients
                            </p>
                          </div>
                          <div>
                            <p className="text-[9px] text-slate-500 dark:text-slate-400">
                              Intake Speed
                            </p>
                            <p className="text-xs font-black text-blue-600 dark:text-blue-400">
                              ~15s Fast
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Direct Launchers */}
                      <div className="space-y-1">
                        <Link
                          to="/appointments"
                          onClick={() => setReceptionDropdownOpen(false)}
                          className="flex items-start gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors group"
                        >
                          <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5 group-hover:scale-105 transition-transform">
                            <FiActivity size={15} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                                Reception Desk Hub
                              </span>
                              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                                Open Hub →
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-normal truncate mt-0.5">
                              Token caller (#01, #02), doctor roster &amp; WhatsApp
                              alerts
                            </p>
                          </div>
                        </Link>

                        <Link
                          to="/patients"
                          onClick={() => setReceptionDropdownOpen(false)}
                          className="flex items-start gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-blue-950/40 hover:text-blue-700 dark:hover:text-blue-300 transition-colors group"
                        >
                          <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-950/70 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5 group-hover:scale-105 transition-transform">
                            <FiUsers size={15} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                                Patient EHR Directory
                              </span>
                              <span className="text-[10px] text-blue-600 dark:text-blue-400 font-bold">
                                Register →
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-normal truncate mt-0.5">
                              Instant phone/CNIC search, check-in, baseline vitals &amp;
                              history
                            </p>
                          </div>
                        </Link>

                        <Link
                          to="/billing"
                          onClick={() => setReceptionDropdownOpen(false)}
                          className="flex items-start gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-purple-50 dark:hover:bg-purple-950/40 hover:text-purple-700 dark:hover:text-purple-300 transition-colors group"
                        >
                          <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-950/70 text-purple-600 dark:text-purple-400 shrink-0 mt-0.5 group-hover:scale-105 transition-transform">
                            <FiCreditCard size={15} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400">
                                Counter Billing POS
                              </span>
                              <span className="text-[10px] text-purple-600 dark:text-purple-400 font-bold">
                                Invoices →
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-normal truncate mt-0.5">
                              Cash, card, JazzCash &amp; EasyPaisa split receipts
                            </p>
                          </div>
                        </Link>
                      </div>

                      {/* Interactive Demo Shortcut */}
                      <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                        <button
                          type="button"
                          onClick={() => jumpToLandingPreview("reception")}
                          className="w-full flex items-center justify-between px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800/80 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 text-[11px] font-bold text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer"
                        >
                          <span className="flex items-center gap-1.5">
                            <FiZap size={12} className="text-emerald-500" />
                            <span>Interactive Reception Queue Demo on Landing</span>
                          </span>
                          <FiArrowRight size={12} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            }

            // 2. PHARMACY STORE MEGA DROPDOWN
            if (link.isDropdown === "pharmacy") {
              return (
                <div
                  key={link.id}
                  className="relative"
                  ref={pharmacyDropdownRef}
                  onMouseEnter={handlePharmacyMouseEnter}
                  onMouseLeave={handlePharmacyMouseLeave}
                >
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      setPharmacyDropdownOpen(!pharmacyDropdownOpen);
                    }}
                    className={`relative flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full transition-colors duration-200 z-10 cursor-pointer ${
                      active
                        ? "text-white"
                        : "text-slate-700 dark:text-slate-200 hover:text-amber-600 dark:hover:text-amber-400"
                    }`}
                    aria-expanded={pharmacyDropdownOpen}
                    aria-haspopup="true"
                  >
                    <FiPackage
                      size={13}
                      className={
                        active
                          ? "text-white"
                          : "text-amber-600 dark:text-amber-400"
                      }
                    />
                    <span>{link.label}</span>
                    <span
                      className={`text-[9px] font-black px-1.5 py-0.2 rounded-full uppercase tracking-wider ${
                        active
                          ? "bg-white/25 text-white"
                          : "bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800"
                      }`}
                    >
                      {link.badge}
                    </span>
                    <FiChevronDown
                      size={12}
                      className={`transition-transform duration-200 ${
                        pharmacyDropdownOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {/* Active / Hover Background Pill */}
                  {active && (
                    <motion.div
                      layoutId="activeNavPill"
                      className="absolute inset-0 bg-blue-600 rounded-full shadow-sm shadow-blue-500/30 z-0"
                      transition={{
                        type: "spring",
                        stiffness: 380,
                        damping: 30,
                      }}
                    />
                  )}
                  {!active && isHovered && (
                    <motion.div
                      layoutId="hoverNavPill"
                      className="absolute inset-0 bg-slate-100 dark:bg-slate-800 rounded-full z-0"
                      transition={{
                        type: "spring",
                        stiffness: 450,
                        damping: 35,
                      }}
                    />
                  )}

                  {/* Pharmacy Mega-Flyout Panel */}
                  {pharmacyDropdownOpen && (
                    <div
                      className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-96 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 shadow-2xl backdrop-blur-md z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                      onMouseEnter={handlePharmacyMouseEnter}
                      onMouseLeave={handlePharmacyMouseLeave}
                    >
                      {/* Header & Stats Banner */}
                      <div className="px-3 py-2.5 bg-gradient-to-r from-amber-500/10 via-orange-500/5 to-yellow-500/10 rounded-xl border border-amber-200/60 dark:border-amber-800/60 mb-2">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <div className="p-1.5 rounded-lg bg-amber-600 text-white shadow-xs">
                              <FiPackage size={14} />
                            </div>
                            <div>
                              <p className="text-xs font-bold text-slate-900 dark:text-white">
                                Pharmacy Store &amp; Barcode POS
                              </p>
                              <p className="text-[10px] text-slate-500 dark:text-slate-400">
                                Hardware Scanner &amp; FEFO Inventory
                              </p>
                            </div>
                          </div>
                          <span className="flex items-center gap-1 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                            <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
                            POS Active
                          </span>
                        </div>
                        <div className="grid grid-cols-3 gap-1.5 mt-2 pt-2 border-t border-amber-200/50 dark:border-amber-800/50 text-center">
                          <div>
                            <p className="text-[9px] text-slate-500 dark:text-slate-400">
                              Barcode Scan
                            </p>
                            <p className="text-xs font-black text-amber-600 dark:text-amber-400">
                              0.4s USB/Cam
                            </p>
                          </div>
                          <div>
                            <p className="text-[9px] text-slate-500 dark:text-slate-400">
                              FEFO Expiry
                            </p>
                            <p className="text-xs font-black text-emerald-600 dark:text-emerald-400">
                              30/60/90d
                            </p>
                          </div>
                          <div>
                            <p className="text-[9px] text-slate-500 dark:text-slate-400">
                              Cashier Change
                            </p>
                            <p className="text-xs font-black text-blue-600 dark:text-blue-400">
                              Auto Calc
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Direct Launchers */}
                      <div className="space-y-1">
                        <Link
                          to="/pharmacy"
                          onClick={() => setPharmacyDropdownOpen(false)}
                          className="flex items-start gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-amber-50 dark:hover:bg-amber-950/40 hover:text-amber-700 dark:hover:text-amber-300 transition-colors group"
                        >
                          <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-950/70 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5 group-hover:scale-105 transition-transform">
                            <FiPackage size={15} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400">
                                Pharmacy Store POS Terminal
                              </span>
                              <span className="text-[10px] text-amber-600 dark:text-amber-400 font-bold">
                                Open POS →
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-normal truncate mt-0.5">
                              Instant barcode checkout, stock deduction &amp; change
                              calculator
                            </p>
                          </div>
                        </Link>

                        <Link
                          to="/pharmacy"
                          onClick={() => setPharmacyDropdownOpen(false)}
                          className="flex items-start gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-blue-950/40 hover:text-blue-700 dark:hover:text-blue-300 transition-colors group"
                        >
                          <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-950/70 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5 group-hover:scale-105 transition-transform">
                            <FiActivity size={15} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                                Inventory &amp; Batch Manager
                              </span>
                              <span className="text-[10px] text-blue-600 dark:text-blue-400 font-bold">
                                Stock →
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-normal truncate mt-0.5">
                              Auto low-stock alerts, replenishment &amp; distributor
                              records
                            </p>
                          </div>
                        </Link>

                        <Link
                          to="/pharmacy"
                          onClick={() => setPharmacyDropdownOpen(false)}
                          className="flex items-start gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-rose-50 dark:hover:bg-rose-950/40 hover:text-rose-700 dark:hover:text-rose-300 transition-colors group"
                        >
                          <div className="p-2 rounded-lg bg-rose-100 dark:bg-rose-950/70 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5 group-hover:scale-105 transition-transform">
                            <FiShield size={15} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-slate-900 dark:text-white group-hover:text-rose-600 dark:group-hover:text-rose-400">
                                FEFO Expiry Alert Radar
                              </span>
                              <span className="text-[10px] text-rose-600 dark:text-rose-400 font-bold">
                                Radar →
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-normal truncate mt-0.5">
                              Near-expiry batch quarantine &amp; early clearance
                              protocols
                            </p>
                          </div>
                        </Link>
                      </div>

                      {/* Interactive Demo Shortcut */}
                      <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                        <button
                          type="button"
                          onClick={() => jumpToLandingPreview("pharmacy")}
                          className="w-full flex items-center justify-between px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800/80 hover:bg-amber-50 dark:hover:bg-amber-950/50 text-[11px] font-bold text-slate-600 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400 transition-colors cursor-pointer"
                        >
                          <span className="flex items-center gap-1.5">
                            <FiZap size={12} className="text-amber-500" />
                            <span>Interactive Barcode POS Demo on Landing</span>
                          </span>
                          <FiArrowRight size={12} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            }

            // 3. DOCS & REPORTS DROPDOWN
            if (link.isDropdown === "docs") {
              return (
                <div
                  key={link.id}
                  className="relative"
                  ref={docsDropdownRef}
                  onMouseEnter={handleDocsMouseEnter}
                  onMouseLeave={handleDocsMouseLeave}
                >
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      setDocsDropdownOpen(!docsDropdownOpen);
                    }}
                    className={`relative flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full transition-colors duration-200 z-10 cursor-pointer ${
                      active
                        ? "text-white"
                        : "text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400"
                    }`}
                    aria-expanded={docsDropdownOpen}
                    aria-haspopup="true"
                  >
                    <span>{link.label}</span>
                    {link.badge && (
                      <span
                        className={`text-[9px] font-black px-1.5 py-0.2 rounded-full uppercase tracking-wider ${
                          active
                            ? "bg-white/25 text-white"
                            : "bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800"
                        }`}
                      >
                        {link.badge}
                      </span>
                    )}
                    <FiChevronDown
                      size={12}
                      className={`transition-transform duration-200 ${
                        docsDropdownOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {/* Active sliding indicator */}
                  {active && (
                    <motion.div
                      layoutId="activeNavPill"
                      className="absolute inset-0 bg-blue-600 rounded-full shadow-sm shadow-blue-500/30 z-0"
                      transition={{
                        type: "spring",
                        stiffness: 380,
                        damping: 30,
                      }}
                    />
                  )}

                  {/* Hover background for non-active */}
                  {!active && isHovered && (
                    <motion.div
                      layoutId="hoverNavPill"
                      className="absolute inset-0 bg-slate-100 dark:bg-slate-800 rounded-full z-0"
                      transition={{
                        type: "spring",
                        stiffness: 450,
                        damping: 35,
                      }}
                    />
                  )}

                  {/* Docs Quick Downloads Dropdown */}
                  {docsDropdownOpen && (
                    <div
                      className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-80 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-2.5 shadow-2xl backdrop-blur-md z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                      onMouseEnter={handleDocsMouseEnter}
                      onMouseLeave={handleDocsMouseLeave}
                    >
                      <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800 mb-1.5 flex items-center justify-between">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                          FYP Reports &amp; Documentation
                        </p>
                        <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          Ready
                        </span>
                      </div>

                      <Link
                        to="/docs"
                        onClick={() => setDocsDropdownOpen(false)}
                        className="flex items-start gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-slate-800/80 hover:text-blue-600 transition-colors group"
                      >
                        <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5 group-hover:scale-105 transition-transform">
                          <FiFileText size={15} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-slate-900 dark:text-white group-hover:text-blue-600">
                              Interactive Docs Hub
                            </span>
                            <span className="text-[10px] text-blue-600 dark:text-blue-400 font-bold">
                              Open →
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 font-normal truncate mt-0.5">
                            Searchable specs, architecture &amp; print to PDF
                          </p>
                        </div>
                      </Link>

                      <a
                        href="/PROJECT_REPORT.md"
                        download="SmartClinic_PROJECT_REPORT.md"
                        onClick={() => setDocsDropdownOpen(false)}
                        className="flex items-start gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-emerald-50 dark:hover:bg-slate-800/80 hover:text-emerald-600 transition-colors group"
                      >
                        <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5 group-hover:scale-105 transition-transform">
                          <FiDownload size={15} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-slate-900 dark:text-white group-hover:text-emerald-600">
                              FYP Project Report
                            </span>
                            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono font-bold bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                              38 KB
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 font-normal truncate mt-0.5">
                            Full capstone report with all 12 modules &amp; test
                            suites
                          </p>
                        </div>
                      </a>

                      <a
                        href="/RBAC_AUDIT_REPORT.md"
                        download="SmartClinic_RBAC_AUDIT_REPORT.md"
                        onClick={() => setDocsDropdownOpen(false)}
                        className="flex items-start gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-purple-50 dark:hover:bg-slate-800/80 hover:text-purple-600 transition-colors group"
                      >
                        <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 shrink-0 mt-0.5 group-hover:scale-105 transition-transform">
                          <FiShield size={15} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-slate-900 dark:text-white group-hover:text-purple-600">
                              RBAC Audit Report
                            </span>
                            <span className="text-[10px] text-purple-600 dark:text-purple-400 font-mono font-bold bg-purple-50 dark:bg-purple-950/60 px-1.5 py-0.5 rounded border border-purple-200 dark:border-purple-800">
                              14 KB
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 font-normal truncate mt-0.5">
                            Formal verification of 4 distinct user roles
                          </p>
                        </div>
                      </a>
                    </div>
                  )}
                </div>
              );
            }

            // 4. ROUTE LINKS (e.g. About)
            if (link.isRoute) {
              return (
                <div
                  key={link.href}
                  className="relative"
                  onMouseEnter={() => setHoveredNav(link.id)}
                >
                  <Link
                    to={link.href}
                    className={`relative flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full transition-colors duration-200 z-10 ${
                      active
                        ? "text-white"
                        : "text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400"
                    }`}
                  >
                    <span>{link.label}</span>
                  </Link>

                  {active && (
                    <motion.div
                      layoutId="activeNavPill"
                      className="absolute inset-0 bg-blue-600 rounded-full shadow-sm shadow-blue-500/30 z-0"
                      transition={{
                        type: "spring",
                        stiffness: 380,
                        damping: 30,
                      }}
                    />
                  )}

                  {!active && isHovered && (
                    <motion.div
                      layoutId="hoverNavPill"
                      className="absolute inset-0 bg-slate-100 dark:bg-slate-800 rounded-full z-0"
                      transition={{
                        type: "spring",
                        stiffness: 450,
                        damping: 35,
                      }}
                    />
                  )}
                </div>
              );
            }

            // 5. STANDARD ON-PAGE ANCHOR LINKS (Features, AI Hub, Modules, Telemedicine)
            return (
              <div
                key={link.href}
                className="relative"
                onMouseEnter={() => setHoveredNav(link.id)}
              >
                <a
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link)}
                  className={`relative block px-3 py-1.5 text-xs font-semibold rounded-full transition-colors duration-200 cursor-pointer z-10 ${
                    active
                      ? "text-white"
                      : "text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400"
                  }`}
                >
                  {link.label}
                </a>

                {/* Active sliding indicator */}
                {active && (
                  <motion.div
                    layoutId="activeNavPill"
                    className="absolute inset-0 bg-blue-600 rounded-full shadow-sm shadow-blue-500/30 z-0"
                    transition={{
                      type: "spring",
                      stiffness: 380,
                      damping: 30,
                    }}
                  />
                )}

                {/* Hover background for non-active */}
                {!active && isHovered && (
                  <motion.div
                    layoutId="hoverNavPill"
                    className="absolute inset-0 bg-slate-100 dark:bg-slate-800 rounded-full z-0"
                    transition={{
                      type: "spring",
                      stiffness: 450,
                      damping: 35,
                    }}
                  />
                )}
              </div>
            );
          })}
        </nav>

        {/* Desktop Right Actions: Direct Role Launchers, Theme & Auth */}
        <div className="hidden sm:flex items-center gap-2.5">
          <ThemeToggle />

          <div className="h-5 w-px bg-slate-200 dark:bg-slate-800" />

          {user ? (
            <div className="flex items-center gap-2">
              {/* PHARMACIST: High-Visibility Glowing Pharmacy POS Launcher Button */}
              {user.role === "Pharmacist" && (
                <Link
                  to="/pharmacy"
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-500 via-amber-600 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white px-4 py-1.5 text-xs font-bold shadow-md shadow-amber-500/30 transition-all hover:scale-[1.03] active:scale-95 border border-amber-400/30"
                  title="Open Pharmacy Store POS Cash Register"
                >
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
                  </span>
                  <FiPackage size={14} className="stroke-[2.5]" />
                  <span>Pharmacy POS</span>
                  <FiArrowRight size={12} className="opacity-80" />
                </Link>
              )}

              {/* RECEPTIONIST: High-Visibility Glowing Reception Queue Launcher Button */}
              {user.role === "Receptionist" && (
                <Link
                  to="/appointments"
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-500 via-teal-600 to-emerald-700 hover:from-emerald-600 hover:to-teal-700 text-white px-4 py-1.5 text-xs font-bold shadow-md shadow-emerald-500/30 transition-all hover:scale-[1.03] active:scale-95 border border-emerald-400/30"
                  title="Open Reception Desk & Queue"
                >
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
                  </span>
                  <FiUsers size={14} className="stroke-[2.5]" />
                  <span>Reception Queue</span>
                  <FiArrowRight size={12} className="opacity-80" />
                </Link>
              )}

              {/* DOCTOR: OPD Consultation Direct Launcher */}
              {user.role === "Doctor" && (
                <Link
                  to="/appointments"
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white px-3.5 py-1.5 text-xs font-bold shadow-md shadow-blue-500/25 transition-all hover:scale-[1.03] active:scale-95 border border-blue-400/30"
                  title="Open Doctor OPD Consultations"
                >
                  <FiActivity size={14} className="stroke-[2.5]" />
                  <span>Doctor OPD</span>
                  <FiArrowRight size={12} className="opacity-80" />
                </Link>
              )}

              {/* ADMIN: Dual Station Launchers */}
              {user.role === "Admin" && (
                <div className="hidden xl:flex items-center gap-1.5">
                  <Link
                    to="/appointments"
                    className="inline-flex items-center gap-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 px-2.5 py-1 text-[11px] font-bold transition shadow-2xs"
                    title="Reception Desk Hub"
                  >
                    <FiUsers size={12} className="text-emerald-600" />
                    <span>Reception</span>
                  </Link>
                  <Link
                    to="/pharmacy"
                    className="inline-flex items-center gap-1 rounded-full bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/60 px-2.5 py-1 text-[11px] font-bold transition shadow-2xs"
                    title="Pharmacy Store POS"
                  >
                    <FiPackage size={12} className="text-amber-600" />
                    <span>Pharmacy</span>
                  </Link>
                </div>
              )}

              {/* User Avatar & Dropdown */}
              <div
                className="relative"
                ref={userDropdownRef}
                onMouseEnter={handleUserMouseEnter}
                onMouseLeave={handleUserMouseLeave}
              >
                {/* User Pill Button */}
                <button
                  type="button"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 text-slate-700 dark:text-slate-200 hover:border-blue-300 dark:hover:border-blue-700 transition-all shadow-xs cursor-pointer"
                  aria-expanded={userDropdownOpen}
                  aria-haspopup="true"
                >
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-tr from-blue-600 to-cyan-500 text-white text-[11px] font-black shadow-xs">
                    {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                  </div>
                  <div className="text-left hidden md:block">
                    <p className="text-[11px] font-bold leading-tight truncate max-w-[90px] text-slate-900 dark:text-white">
                      {user.name}
                    </p>
                  </div>
                  <span
                    className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded-full border ${
                      ROLE_BADGE_COLORS[user.role] ||
                      "bg-blue-50 text-blue-700 border-blue-200"
                    }`}
                  >
                    {user.role}
                  </span>
                  <FiChevronDown
                    size={12}
                    className={`text-slate-400 transition-transform duration-200 ${
                      userDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* User Dropdown Menu */}
                {userDropdownOpen && (
                  <div
                    className="absolute right-0 top-full mt-2 w-72 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-2.5 shadow-2xl backdrop-blur-md z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                    onMouseEnter={handleUserMouseEnter}
                    onMouseLeave={handleUserMouseLeave}
                  >
                    {/* User Profile Card */}
                    <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800 mb-2">
                      <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {user.name}
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                        {user.email}
                      </p>
                      <div className="mt-1 flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                        <FiCheckCircle size={12} />
                        <span>Active Session • {user.role} Role</span>
                      </div>
                    </div>

                    {/* Role-Specific Active Station Hero Banner */}
                    {user.role === "Pharmacist" && (
                      <div className="p-3 rounded-xl bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-amber-500/15 border border-amber-200 dark:border-amber-800/80 mb-2">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] font-black uppercase tracking-wider text-amber-700 dark:text-amber-300 flex items-center gap-1.5">
                            <FiPackage
                              size={13}
                              className="text-amber-600 dark:text-amber-400"
                            />
                            <span>Pharmacy Store Station</span>
                          </span>
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                            Ready
                          </span>
                        </div>
                        <Link
                          to="/pharmacy"
                          onClick={() => setUserDropdownOpen(false)}
                          className="mt-2 w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-xs shadow-xs transition-transform hover:scale-[1.02]"
                        >
                          <span>Open POS Cash Register</span>
                          <FiArrowRight size={13} />
                        </Link>
                      </div>
                    )}

                    {user.role === "Receptionist" && (
                      <div className="p-3 rounded-xl bg-gradient-to-r from-emerald-500/15 via-teal-500/10 to-emerald-500/15 border border-emerald-200 dark:border-emerald-800/80 mb-2">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 dark:text-emerald-300 flex items-center gap-1.5">
                            <FiUsers
                              size={13}
                              className="text-emerald-600 dark:text-emerald-400"
                            />
                            <span>Reception Desk Station</span>
                          </span>
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                            Queue Active
                          </span>
                        </div>
                        <Link
                          to="/appointments"
                          onClick={() => setUserDropdownOpen(false)}
                          className="mt-2 w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold text-xs shadow-xs transition-transform hover:scale-[1.02]"
                        >
                          <span>Open Reception Desk Queue</span>
                          <FiArrowRight size={13} />
                        </Link>
                      </div>
                    )}

                    {/* Navigation Links */}
                    <div className="space-y-0.5">
                      <Link
                        to="/dashboard"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-slate-800 hover:text-blue-600 transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <FiActivity className="text-blue-500" size={14} />
                          <span>Clinic Dashboard</span>
                        </div>
                        <FiArrowRight size={12} className="text-slate-400" />
                      </Link>

                      {["Admin", "Receptionist"].includes(user.role) && (
                        <Link
                          to="/appointments"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-emerald-700 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            <FiUsers className="text-emerald-500" size={14} />
                            <span>Reception Desk &amp; Queue</span>
                          </div>
                          <FiArrowRight
                            size={12}
                            className="text-emerald-400"
                          />
                        </Link>
                      )}

                      {["Admin", "Pharmacist"].includes(user.role) && (
                        <Link
                          to="/pharmacy"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-amber-700 dark:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-950/50 transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            <FiPackage className="text-amber-500" size={14} />
                            <span>Pharmacy Store &amp; POS</span>
                          </div>
                          <FiArrowRight size={12} className="text-amber-400" />
                        </Link>
                      )}

                      {["Admin", "Doctor", "Receptionist"].includes(
                        user.role
                      ) && (
                        <Link
                          to="/patients"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-slate-800 hover:text-blue-600 transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            <FiUsers className="text-blue-500" size={14} />
                            <span>Patient EHR Directory</span>
                          </div>
                          <FiArrowRight size={12} className="text-slate-400" />
                        </Link>
                      )}

                      {["Admin", "Receptionist"].includes(user.role) && (
                        <Link
                          to="/billing"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-slate-800 hover:text-blue-600 transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            <FiCreditCard
                              className="text-purple-500"
                              size={14}
                            />
                            <span>Billing &amp; Invoices</span>
                          </div>
                          <FiArrowRight size={12} className="text-slate-400" />
                        </Link>
                      )}

                      <Link
                        to="/settings"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-slate-800 hover:text-blue-600 transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <FiSettings className="text-slate-500" size={14} />
                          <span>Clinic Settings</span>
                        </div>
                        <FiArrowRight size={12} className="text-slate-400" />
                      </Link>

                      <Link
                        to="/docs"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-slate-800 hover:text-blue-600 transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <FiFileText className="text-emerald-500" size={14} />
                          <span>Docs &amp; FYP Reports</span>
                        </div>
                        <FiExternalLink size={12} className="text-slate-400" />
                      </Link>
                    </div>

                    {/* Sign Out Button */}
                    <div className="pt-1.5 mt-1.5 border-t border-slate-100 dark:border-slate-800">
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                      >
                        <FiLogOut size={14} />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="inline-flex items-center justify-center text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 px-3.5 py-2 rounded-xl border border-slate-200/90 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 hover:bg-slate-100 dark:hover:bg-slate-800 shadow-xs transition-all"
              >
                Sign In
              </Link>
              <Link
                to="/login"
                className="group inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-blue-600 via-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white text-xs font-bold px-4 py-2 shadow-md shadow-blue-500/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>Launch Demo</span>
                <FiArrowRight
                  size={13}
                  className="group-hover:translate-x-0.5 transition-transform"
                />
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger & Theme Switcher */}
        <div className="flex items-center gap-2 lg:hidden">
          <ThemeToggle />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 shadow-xs transition-colors cursor-pointer"
            aria-label={
              mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"
            }
          >
            {mobileMenuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer (Smooth Animated Overlay) */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop Dimmer */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 top-[60px] bg-slate-950/60 backdrop-blur-xs z-40 lg:hidden"
            />

            {/* Slide Down Sheet */}
            <motion.div
              initial={{ opacity: 0, y: -15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
              className="fixed left-0 right-0 top-[60px] max-h-[85vh] overflow-y-auto bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 px-5 py-6 shadow-2xl z-50 lg:hidden space-y-4"
            >
              {/* Authenticated User Banner & Direct Role Launchers (Mobile) */}
              {user && (
                <div className="space-y-2">
                  <div className="p-3 rounded-2xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-600 text-white font-bold text-xs">
                        {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                          {user.name}
                        </p>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400">
                          {user.email}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${
                        ROLE_BADGE_COLORS[user.role] ||
                        "bg-blue-100 text-blue-700 border-blue-200"
                      }`}
                    >
                      {user.role}
                    </span>
                  </div>

                  {/* High-Visibility Mobile Role Launcher */}
                  {user.role === "Pharmacist" && (
                    <Link
                      to="/pharmacy"
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-500 via-amber-600 to-orange-600 text-white shadow-md shadow-amber-500/25 border border-amber-400/30"
                    >
                      <FiPackage size={15} />
                      <span>Launch Pharmacy Store POS Terminal</span>
                      <FiArrowRight size={13} />
                    </Link>
                  )}

                  {user.role === "Receptionist" && (
                    <Link
                      to="/appointments"
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-500 via-teal-600 to-emerald-700 text-white shadow-md shadow-emerald-500/25 border border-emerald-400/30"
                    >
                      <FiUsers size={15} />
                      <span>Launch Reception Desk &amp; Queue</span>
                      <FiArrowRight size={13} />
                    </Link>
                  )}

                  {user.role === "Doctor" && (
                    <Link
                      to="/appointments"
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md shadow-blue-500/25 border border-blue-400/30"
                    >
                      <FiActivity size={15} />
                      <span>Launch Doctor OPD Consultations</span>
                      <FiArrowRight size={13} />
                    </Link>
                  )}

                  {user.role === "Admin" && (
                    <div className="grid grid-cols-2 gap-2">
                      <Link
                        to="/appointments"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                      >
                        <FiUsers size={13} />
                        <span>Reception Desk</span>
                      </Link>
                      <Link
                        to="/pharmacy"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800"
                      >
                        <FiPackage size={13} />
                        <span>Pharmacy POS</span>
                      </Link>
                    </div>
                  )}
                </div>
              )}

              {/* Dedicated Reception & Pharmacy Quick Mobile Stations */}
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-2">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Key Healthcare Hubs
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    to="/appointments"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex flex-col gap-1 p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-emerald-200 dark:border-emerald-800/60 shadow-2xs hover:border-emerald-400 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <FiUsers size={16} className="text-emerald-500" />
                      <span className="text-[9px] font-black px-1.5 py-0.2 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                        Queue
                      </span>
                    </div>
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      Reception Desk
                    </span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">
                      Intake &amp; tokens
                    </span>
                  </Link>

                  <Link
                    to="/pharmacy"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex flex-col gap-1 p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-amber-200 dark:border-amber-800/60 shadow-2xs hover:border-amber-400 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <FiPackage size={16} className="text-amber-500" />
                      <span className="text-[9px] font-black px-1.5 py-0.2 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300">
                        POS
                      </span>
                    </div>
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      Pharmacy Store
                    </span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">
                      Barcode &amp; FEFO
                    </span>
                  </Link>
                </div>
              </div>

              {/* Navigation Items Grid */}
              <div className="space-y-1">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-3 pb-1">
                  On-Page Navigation
                </p>
                {NAV_LINKS.map((link) => {
                  const Icon = link.icon;
                  const active = isLinkActive(link);

                  if (link.isRoute) {
                    return (
                      <Link
                        key={link.href}
                        to={link.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors ${
                          active
                            ? "bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400"
                            : "text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Icon
                            size={16}
                            className={
                              active
                                ? "text-blue-600 dark:text-blue-400"
                                : "text-slate-400"
                            }
                          />
                          <span>{link.label}</span>
                        </div>
                        {link.badge && (
                          <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                            {link.badge}
                          </span>
                        )}
                      </Link>
                    );
                  }

                  return (
                    <a
                      key={link.id}
                      href={link.href}
                      onClick={(e) => {
                        if (link.id === "reception") {
                          e.preventDefault();
                          jumpToLandingPreview("reception");
                        } else if (link.id === "pharmacy") {
                          e.preventDefault();
                          jumpToLandingPreview("pharmacy");
                        } else {
                          handleNavClick(e, link);
                        }
                      }}
                      className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                        active
                          ? "bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400"
                          : "text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon
                          size={16}
                          className={
                            link.id === "reception"
                              ? "text-emerald-500"
                              : link.id === "pharmacy"
                              ? "text-amber-500"
                              : active
                              ? "text-blue-600 dark:text-blue-400"
                              : "text-slate-400"
                          }
                        />
                        <span>{link.label}</span>
                      </div>
                      {link.badge ? (
                        <span
                          className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${
                            link.id === "reception"
                              ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800"
                              : "bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800"
                          }`}
                        >
                          {link.badge}
                        </span>
                      ) : (
                        <span className="text-slate-400 text-[10px]">#</span>
                      )}
                    </a>
                  );
                })}
              </div>

              {/* Direct Report Downloads for Any Device */}
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <FiDownload className="text-blue-500" />
                    <span>Download Project Reports (.md)</span>
                  </span>
                  <Link
                    to="/docs"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-[10px] font-bold text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    View All →
                  </Link>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <a
                    href="/PROJECT_REPORT.md"
                    download="SmartClinic_PROJECT_REPORT.md"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl text-[11px] font-bold bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-xs"
                  >
                    <FiFileText size={13} className="text-blue-500 shrink-0" />
                    <span className="truncate">FYP Report</span>
                  </a>
                  <a
                    href="/RBAC_AUDIT_REPORT.md"
                    download="SmartClinic_RBAC_AUDIT_REPORT.md"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl text-[11px] font-bold bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-xs"
                  >
                    <FiShield size={13} className="text-purple-500 shrink-0" />
                    <span className="truncate">RBAC Audit</span>
                  </a>
                </div>
              </div>

              {/* Auth Buttons in Mobile Menu */}
              <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-2">
                {user ? (
                  <div className="space-y-2">
                    <Link
                      to="/dashboard"
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold bg-blue-600 text-white shadow-md shadow-blue-500/25"
                    >
                      <span>Enter {user.role} Dashboard</span>
                      <FiArrowRight size={14} />
                    </Link>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 cursor-pointer"
                    >
                      <FiLogOut size={14} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                ) : (
                  <>
                    <Link
                      to="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-full text-center py-2.5 rounded-xl text-xs font-bold border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 block shadow-xs"
                    >
                      Sign In to Clinic
                    </Link>
                    <Link
                      to="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md shadow-blue-500/25"
                    >
                      <span>Launch Live Demo</span>
                      <FiArrowRight size={14} />
                    </Link>
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
};

export default LandingNavbar;
