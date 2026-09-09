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
  FiUsers,
  FiCreditCard,
  FiLogOut,
  FiSettings,
  FiExternalLink,
  FiClock,
  FiGrid,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import ThemeToggle from "../common/ThemeToggle";
import { useAuth } from "../../hooks/useAuth";
import { useSmoothScroll } from "../../hooks/useSmoothScroll";

// 8 Clean Core Landing Page Links
const NAV_LINKS = [
  {
    id: "features",
    label: "Features",
    href: "#features",
    anchor: "#features",
    icon: FiZap,
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
    id: "security",
    label: "Security",
    href: "#security",
    anchor: "#security",
    icon: FiShield,
  },
  {
    id: "faq",
    label: "FAQ",
    href: "#faq",
    anchor: "#faq",
    icon: FiHelpCircle,
  },
  {
    id: "docs",
    label: "Docs & Reports",
    href: "/docs",
    isRoute: true,
    icon: FiFileText,
    badge: "FYP",
    hasDropdown: true,
  },
  {
    id: "about",
    label: "About",
    href: "/about",
    isRoute: true,
    icon: FiActivity,
  },
];

// Rich Role Configurations for Admin, Doctor, Pharmacist, Receptionist
const ROLE_CONFIGS = {
  Admin: {
    stationTitle: "Admin Center",
    badgeLabel: "Admin",
    badgeClass:
      "bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800",
    avatarGradient: "from-purple-600 via-indigo-600 to-purple-700",
    ringClass: "ring-purple-500/30",
    statusText: "System Admin • Full Access",
    quickLinks: [
      {
        label: "Admin Center",
        path: "/dashboard",
        icon: FiActivity,
        color: "text-purple-500",
      },
      {
        label: "Patient Directory",
        path: "/patients",
        icon: FiUsers,
        color: "text-blue-500",
      },
      {
        label: "Appointment Desk",
        path: "/appointments",
        icon: FiClock,
        color: "text-emerald-500",
      },
      {
        label: "Billing & Revenue",
        path: "/billing",
        icon: FiCreditCard,
        color: "text-amber-500",
      },
      {
        label: "Pharmacy Inventory",
        path: "/pharmacy",
        icon: FiPackage,
        color: "text-rose-500",
      },
    ],
  },
  Doctor: {
    stationTitle: "Doctor OPD",
    badgeLabel: "Doctor",
    badgeClass:
      "bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800",
    avatarGradient: "from-emerald-600 via-teal-600 to-blue-600",
    ringClass: "ring-emerald-500/30",
    statusText: "OPD Consultation • Ready",
    quickLinks: [
      {
        label: "OPD Dashboard",
        path: "/dashboard",
        icon: FiActivity,
        color: "text-emerald-500",
      },
      {
        label: "Patient Queue",
        path: "/appointments",
        icon: FiClock,
        color: "text-blue-500",
      },
      {
        label: "Electronic Records",
        path: "/patients",
        icon: FiUsers,
        color: "text-teal-500",
      },
      {
        label: "Telemedicine Suite",
        path: "#workflows",
        isAnchor: true,
        icon: FiVideo,
        color: "text-purple-500",
      },
    ],
  },
  Receptionist: {
    stationTitle: "Reception Desk",
    badgeLabel: "Receptionist",
    badgeClass:
      "bg-cyan-100 dark:bg-cyan-950/80 text-cyan-700 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800",
    avatarGradient: "from-cyan-600 via-blue-600 to-teal-600",
    ringClass: "ring-cyan-500/30",
    statusText: "Front Desk • Check-in Active",
    quickLinks: [
      {
        label: "Reception Desk",
        path: "/dashboard",
        icon: FiActivity,
        color: "text-cyan-500",
      },
      {
        label: "Appointments & Queue",
        path: "/appointments",
        icon: FiClock,
        color: "text-blue-500",
      },
      {
        label: "Register New Patient",
        path: "/patients",
        icon: FiUsers,
        color: "text-emerald-500",
      },
      {
        label: "Cashier & Billing",
        path: "/billing",
        icon: FiCreditCard,
        color: "text-amber-500",
      },
    ],
  },
  Pharmacist: {
    stationTitle: "Pharmacy POS",
    badgeLabel: "Pharmacist",
    badgeClass:
      "bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800",
    avatarGradient: "from-amber-500 via-orange-500 to-amber-600",
    ringClass: "ring-amber-500/30",
    statusText: "Dispensary POS • Stock Active",
    quickLinks: [
      {
        label: "Pharmacy Dashboard",
        path: "/dashboard",
        icon: FiActivity,
        color: "text-amber-500",
      },
      {
        label: "POS & Dispensing",
        path: "/pharmacy",
        icon: FiPackage,
        color: "text-orange-500",
      },
      {
        label: "Medicine Inventory",
        path: "/pharmacy",
        icon: FiGrid,
        color: "text-blue-500",
      },
      {
        label: "Pharmacy Invoicing",
        path: "/billing",
        icon: FiCreditCard,
        color: "text-emerald-500",
      },
    ],
  },
};

const DEFAULT_ROLE_CONFIG = {
  stationTitle: "Clinic Station",
  badgeLabel: "Staff",
  badgeClass:
    "bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800",
  avatarGradient: "from-blue-600 via-indigo-600 to-cyan-600",
  ringClass: "ring-blue-500/30",
  statusText: "Clinic Staff • Active",
  quickLinks: [
    {
      label: "Dashboard",
      path: "/dashboard",
      icon: FiActivity,
      color: "text-blue-500",
    },
    {
      label: "Patients",
      path: "/patients",
      icon: FiUsers,
      color: "text-emerald-500",
    },
    {
      label: "Appointments",
      path: "/appointments",
      icon: FiClock,
      color: "text-amber-500",
    },
  ],
};

const LandingNavbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [hoveredNav, setHoveredNav] = useState(null);
  const [docsDropdownOpen, setDocsDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const docsDropdownRef = useRef(null);
  const userDropdownRef = useRef(null);
  const docsTimeoutRef = useRef(null);
  const userDropdownTimeoutRef = useRef(null);

  const { user, logout } = useAuth();
  const { scrollTo } = useSmoothScroll();
  const location = useLocation();
  const navigate = useNavigate();

  const roleConfig = user
    ? ROLE_CONFIGS[user.role] || DEFAULT_ROLE_CONFIG
    : null;

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
    setDocsDropdownOpen(true);
  };

  const handleDocsMouseLeave = () => {
    docsTimeoutRef.current = setTimeout(() => {
      setDocsDropdownOpen(false);
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

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/85 dark:bg-slate-950/85 backdrop-blur-xl shadow-xs border-b border-slate-200/80 dark:border-slate-800/80 py-2.5 sm:py-3"
          : "bg-white/40 dark:bg-slate-950/40 backdrop-blur-xs py-4 sm:py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-3">
        {/* Brand Logo & SaaS Tag */}
        <Link to="/" className="flex items-center gap-3 group shrink-0">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 text-white shadow-md shadow-blue-500/20 group-hover:scale-105 group-hover:shadow-blue-500/35 transition-all duration-200">
            <FiActivity size={22} className="stroke-[2.5]" />
            <span className="absolute -bottom-0.5 -right-0.5 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border-2 border-white dark:border-slate-950" />
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-black tracking-tight text-slate-900 dark:text-white">
                SmartClinic
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/10 dark:bg-blue-500/15 border border-blue-500/20 px-2 py-0.5 text-[10px] font-extrabold text-blue-600 dark:text-blue-400">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />
                <span>SaaS OS</span>
              </span>
            </div>
            <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 hidden sm:block leading-tight">
              Outpatient EHR &amp; Pharmacy
            </p>
          </div>
        </Link>

        {/* Desktop Central Navigation Capsule (Floating Glass Island) */}
        <nav
          className="hidden lg:flex items-center gap-0.5 bg-white/75 dark:bg-slate-900/75 border border-slate-200/80 dark:border-slate-800/80 rounded-full p-1.5 backdrop-blur-xl shadow-xs ring-1 ring-black/[0.03] dark:ring-white/[0.04] relative"
          onMouseLeave={() => setHoveredNav(null)}
        >
          {NAV_LINKS.map((link) => {
            const active = isLinkActive(link);
            const isHovered = hoveredNav === link.id;

            // Route items (Docs & Reports, About)
            if (link.isRoute) {
              return (
                <div
                  key={link.href}
                  className="relative"
                  ref={link.hasDropdown ? docsDropdownRef : null}
                  onMouseEnter={
                    link.hasDropdown
                      ? handleDocsMouseEnter
                      : () => setHoveredNav(link.id)
                  }
                  onMouseLeave={
                    link.hasDropdown ? handleDocsMouseLeave : undefined
                  }
                >
                  {link.hasDropdown ? (
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
                          className={`text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded-full font-mono tracking-wider ${
                            active
                              ? "bg-white/25 text-white"
                              : "bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-500/25"
                          }`}
                        >
                          {link.badge}
                        </span>
                      )}
                      <FiChevronDown
                        size={12}
                        className={`transition-transform duration-200 ${
                          docsDropdownOpen ? "rotate-180 text-blue-500" : ""
                        }`}
                      />
                    </button>
                  ) : (
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
                  )}

                  {/* Active sliding indicator */}
                  {active && (
                    <motion.div
                      layoutId="activeNavPill"
                      className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full shadow-sm shadow-blue-500/30 z-0"
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
                      className="absolute inset-0 bg-slate-100 dark:bg-slate-800/80 rounded-full z-0"
                      transition={{
                        type: "spring",
                        stiffness: 450,
                        damping: 35,
                      }}
                    />
                  )}

                  {/* Docs Quick Downloads Dropdown */}
                  {link.hasDropdown && docsDropdownOpen && (
                    <div
                      className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-80 rounded-2xl bg-white/95 dark:bg-slate-900/95 border border-slate-200/80 dark:border-slate-800/80 p-2.5 shadow-2xl backdrop-blur-xl z-50 animate-in fade-in slide-in-from-top-2 duration-150"
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

            // On-Page Anchor items (Features, AI Hub, Modules, Telemedicine, Security, FAQ)
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
                    className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full shadow-sm shadow-blue-500/30 z-0"
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
                    className="absolute inset-0 bg-slate-100 dark:bg-slate-800/80 rounded-full z-0"
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

        {/* Desktop Right Actions: Polished Design System */}
        <div className="hidden sm:flex items-center gap-2.5">
          <ThemeToggle />

          <div className="h-5 w-px bg-slate-200/80 dark:bg-slate-800/80" />

          {user ? (
            <div className="flex items-center gap-2">
              {/* Dashboard Action Button with Subtle Gradient Shine */}
              <Link
                to="/dashboard"
                className="hidden md:inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold px-3.5 py-2 shadow-sm shadow-blue-500/25 hover:shadow-blue-500/35 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <span>Dashboard</span>
                <FiArrowRight size={13} />
              </Link>

              {/* Elevated User Profile Capsule for Admin, Doctor, Pharmacist, Receptionist */}
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
                  className={`flex items-center gap-2 pl-1.5 pr-2.5 py-1.5 rounded-xl border border-slate-200/90 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 text-slate-700 dark:text-slate-200 hover:border-blue-400/60 dark:hover:border-blue-600/60 transition-all shadow-2xs cursor-pointer ${
                    userDropdownOpen
                      ? "ring-2 ring-blue-500/20 border-blue-400"
                      : ""
                  }`}
                  aria-expanded={userDropdownOpen}
                  aria-haspopup="true"
                >
                  {/* Role Avatar with Gradient and Pulse Indicator */}
                  <div className="relative">
                    <div
                      className={`flex h-6 w-6 items-center justify-center rounded-lg bg-gradient-to-tr ${
                        roleConfig?.avatarGradient ||
                        "from-blue-600 to-indigo-600"
                      } text-white text-[11px] font-black shadow-2xs`}
                    >
                      {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                    </div>
                    <span className="absolute -bottom-0.5 -right-0.5 flex h-2 w-2">
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 border border-white dark:border-slate-900" />
                    </span>
                  </div>

                  {/* User Name */}
                  <div className="text-left hidden md:block">
                    <p className="text-[11px] font-bold leading-tight truncate max-w-[100px] text-slate-900 dark:text-white">
                      {user.name}
                    </p>
                  </div>

                  {/* Role Badge Chip */}
                  <span
                    className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded-md border ${
                      roleConfig?.badgeClass ||
                      "bg-blue-50 text-blue-700 border-blue-200"
                    }`}
                  >
                    {user.role}
                  </span>

                  <FiChevronDown
                    size={12}
                    className={`text-slate-400 transition-transform duration-200 ${
                      userDropdownOpen ? "rotate-180 text-blue-500" : ""
                    }`}
                  />
                </button>

                {/* Role-Enhanced Executive Dropdown Card */}
                {userDropdownOpen && (
                  <div
                    className="absolute right-0 top-full mt-2 w-72 rounded-2xl bg-white/95 dark:bg-slate-900/95 border border-slate-200/80 dark:border-slate-800/80 p-2.5 shadow-2xl backdrop-blur-xl z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                    onMouseEnter={handleUserMouseEnter}
                    onMouseLeave={handleUserMouseLeave}
                  >
                    {/* User Profile Header with Role Station */}
                    <div className="p-3 rounded-xl bg-slate-50/80 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800/80 mb-2">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr ${
                            roleConfig?.avatarGradient ||
                            "from-blue-600 to-indigo-600"
                          } text-white text-xs font-black shadow-sm`}
                        >
                          {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                              {user.name}
                            </p>
                            <span
                              className={`text-[9px] font-black uppercase px-1.5 py-0.2 rounded border ${
                                roleConfig?.badgeClass || ""
                              }`}
                            >
                              {user.role}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                            {user.email}
                          </p>
                        </div>
                      </div>
                      <div className="mt-2 pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-[10px]">
                        <span className="font-semibold text-slate-500 dark:text-slate-400">
                          {roleConfig?.statusText || "Active Session"}
                        </span>
                        <span className="flex items-center gap-1 font-bold text-emerald-600 dark:text-emerald-400">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          Online
                        </span>
                      </div>
                    </div>

                    {/* Role-Tailored Quick Launch Grid */}
                    <div className="space-y-1 mb-2">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-2.5 py-0.5">
                        {roleConfig?.stationTitle || "Quick Access"}
                      </p>
                      {roleConfig?.quickLinks?.map((qLink) => {
                        const Icon = qLink.icon;
                        if (qLink.isAnchor) {
                          return (
                            <a
                              key={qLink.label}
                              href={qLink.path}
                              onClick={(e) => {
                                handleNavClick(e, {
                                  anchor: qLink.path,
                                  href: qLink.path,
                                });
                                setUserDropdownOpen(false);
                              }}
                              className="flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-slate-800 hover:text-blue-600 transition-colors cursor-pointer"
                            >
                              <div className="flex items-center gap-2">
                                <Icon className={qLink.color} size={14} />
                                <span>{qLink.label}</span>
                              </div>
                              <FiArrowRight
                                size={11}
                                className="text-slate-400"
                              />
                            </a>
                          );
                        }
                        return (
                          <Link
                            key={qLink.label}
                            to={qLink.path}
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-slate-800 hover:text-blue-600 transition-colors"
                          >
                            <div className="flex items-center gap-2">
                              <Icon className={qLink.color} size={14} />
                              <span>{qLink.label}</span>
                            </div>
                            <FiArrowRight
                              size={11}
                              className="text-slate-400"
                            />
                          </Link>
                        );
                      })}
                    </div>

                    {/* System Links */}
                    <div className="pt-1.5 border-t border-slate-100 dark:border-slate-800 space-y-0.5">
                      <Link
                        to="/settings"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <FiSettings
                            className="text-slate-400 dark:text-slate-500"
                            size={14}
                          />
                          <span>Settings</span>
                        </div>
                        <FiArrowRight size={11} className="text-slate-400" />
                      </Link>
                      <Link
                        to="/docs"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <FiFileText className="text-emerald-500" size={14} />
                          <span>Docs &amp; Reports</span>
                        </div>
                        <FiExternalLink size={11} className="text-slate-400" />
                      </Link>
                    </div>

                    {/* Sign Out Button */}
                    <div className="pt-1.5 mt-1 border-t border-slate-100 dark:border-slate-800">
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
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
            /* Visitor / Guest CTA Buttons (Harmonious rounded-xl design system) */
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="inline-flex items-center justify-center text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 px-4 py-2 rounded-xl border border-slate-200/90 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 hover:bg-slate-100/90 dark:hover:bg-slate-800/90 shadow-2xs transition-all"
              >
                Sign In
              </Link>
              <Link
                to="/login"
                className="group inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white text-xs font-bold px-4 py-2 shadow-md shadow-blue-500/25 hover:shadow-blue-500/35 hover:scale-[1.02] active:scale-[0.98] transition-all"
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

        {/* Mobile Hamburger Button */}
        <div className="flex items-center gap-2 lg:hidden">
          <ThemeToggle />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 shadow-2xs transition-colors cursor-pointer"
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
              className="fixed left-0 right-0 top-[60px] max-h-[85vh] overflow-y-auto bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 px-5 py-6 shadow-2xl z-50 lg:hidden space-y-4"
            >
              {/* Authenticated User Banner (Mobile) */}
              {user && (
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr ${
                        roleConfig?.avatarGradient || "from-blue-600 to-indigo-600"
                      } text-white font-bold text-xs shadow-sm`}
                    >
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
                      roleConfig?.badgeClass ||
                      "bg-blue-100 text-blue-700 border-blue-200"
                    }`}
                  >
                    {user.role}
                  </span>
                </div>
              )}

              {/* Navigation Items */}
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
                      key={link.href}
                      href={link.href}
                      onClick={(e) => handleNavClick(e, link)}
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
                            active
                              ? "text-blue-600 dark:text-blue-400"
                              : "text-slate-400"
                          }
                        />
                        <span>{link.label}</span>
                      </div>
                      <span className="text-slate-400 text-[10px]">#</span>
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
                      className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/25"
                    >
                      <span>Enter {roleConfig?.stationTitle || "Dashboard"}</span>
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
                      className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 text-white shadow-md shadow-blue-500/25"
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
