import { useState, useEffect, useRef, useCallback } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FiMenu,
  FiX,
  FiArrowRight,
  FiActivity,
  FiHelpCircle,
  FiChevronDown,
  FiUsers,
  FiLogOut,
  FiSettings,
  FiCheckCircle,
  FiPhone,
  FiMapPin,
  FiClock,
  FiPackage,
  FiMessageCircle,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import ThemeToggle from "../common/ThemeToggle";
import { useAuth } from "../../hooks/useAuth";
import { useSmoothScroll } from "../../hooks/useSmoothScroll";

// Core Landing Page Navigation Links for Al-Hassam Medical Center
const NAV_LINKS = [
  {
    id: "specialists",
    label: "Specialists",
    href: "#specialists",
    anchor: "#specialists",
    icon: FiUsers,
  },
  {
    id: "facilities",
    label: "Facilities & Pharmacy",
    href: "#facilities",
    anchor: "#facilities",
    icon: FiPackage,
  },
  {
    id: "about",
    label: "About Center",
    href: "#about",
    anchor: "#about",
    icon: FiActivity,
  },
  {
    id: "faq",
    label: "Patient FAQ",
    href: "#faq",
    anchor: "#faq",
    icon: FiHelpCircle,
  },
  {
    id: "contact",
    label: "Contact & Location",
    href: "#contact",
    anchor: "#contact",
    icon: FiMapPin,
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
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const userDropdownRef = useRef(null);
  const userDropdownTimeoutRef = useRef(null);

  const { user, logout } = useAuth();
  const { scrollTo } = useSmoothScroll();
  const location = useLocation();
  const navigate = useNavigate();

  // Scroll detection and active section spy
  const handleScroll = useCallback(() => {
    setIsScrolled(window.scrollY > 20);

    if (location.pathname === "/") {
      if (window.scrollY < 120) {
        setActiveSection("");
        return;
      }

      const sections = ["specialists", "facilities", "about", "contact", "faq"];
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
        setUserDropdownOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Prevent body scroll when mobile menu is open
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

  // Handle smooth navigation
  const handleNavClick = (e, link) => {
    e.preventDefault();
    if (location.pathname !== "/") {
      navigate(`/${link.anchor || link.href}`);
    } else {
      scrollTo(link.anchor || link.href, { offset: -80 });
    }
    setMobileMenuOpen(false);
  };

  const isLinkActive = (link) => {
    return location.pathname === "/" && activeSection === link.id;
  };

  // Hover timers for User dropdown
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
          ? "bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl shadow-xs border-b border-slate-200/90 dark:border-slate-800/90 py-2.5 sm:py-3"
          : "bg-white/80 dark:bg-slate-950/80 backdrop-blur-lg border-b border-slate-200/50 dark:border-slate-800/50 py-3.5 sm:py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-3">
        {/* Brand Logo & Medical Center Info */}
        <Link
          to="/"
          className="flex items-center gap-2.5 sm:gap-3 group shrink-0"
        >
          <div className="relative flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-blue-600 text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 group-hover:shadow-emerald-500/35 transition-all duration-200">
            <FiActivity size={20} className="stroke-[2.5]" />
            <span className="absolute -bottom-0.5 -right-0.5 flex h-2.5 w-2.5 sm:h-3 sm:w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-full w-full bg-emerald-500 border-2 border-white dark:border-slate-950" />
            </span>
          </div>
          <div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="text-base sm:text-lg font-black tracking-tight text-slate-900 dark:text-white">
                Al-Hassam
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 dark:bg-emerald-500/15 border border-emerald-500/20 px-2 py-0.5 text-[9px] sm:text-[10px] font-extrabold text-emerald-600 dark:text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>24/7 Open</span>
              </span>
            </div>
            <p className="text-[10px] sm:text-[11px] font-medium text-slate-500 dark:text-slate-400 hidden xs:block leading-tight">
              Medical Center • Nawabshah Rd, Sanghar
            </p>
          </div>
        </Link>

        {/* Desktop Central Navigation Capsule (Floating Glass Island) */}
        <nav
          className="hidden lg:flex items-center gap-0.5 bg-white/95 dark:bg-slate-900/95 border border-slate-200/90 dark:border-slate-700/80 rounded-full p-1 shadow-xs ring-1 ring-black/[0.04] dark:ring-white/[0.05] relative"
          onMouseLeave={() => setHoveredNav(null)}
        >
          {NAV_LINKS.map((link) => {
            const active = isLinkActive(link);
            const isHovered = hoveredNav === link.id;

            return (
              <a
                key={link.id}
                href={link.href}
                onClick={(e) => handleNavClick(e, link)}
                onMouseEnter={() => setHoveredNav(link.id)}
                className={`relative flex items-center px-3.5 py-1.5 text-xs font-semibold rounded-full transition-colors duration-200 cursor-pointer ${
                  active
                    ? "text-white font-bold"
                    : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <span className="relative z-10">{link.label}</span>

                {active && (
                  <motion.div
                    layoutId="activeNavIndicator"
                    className="absolute inset-0 rounded-full bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600 shadow-sm shadow-emerald-500/25 z-0"
                    transition={{
                      type: "spring",
                      stiffness: 400,
                      damping: 30,
                    }}
                  />
                )}

                {isHovered && !active && (
                  <motion.div
                    layoutId="hoverNavIndicator"
                    className="absolute inset-0 rounded-full bg-slate-100 dark:bg-slate-800 z-0"
                    transition={{ duration: 0.15 }}
                  />
                )}
              </a>
            );
          })}
        </nav>

        {/* Desktop Right Actions */}
        <div className="hidden sm:flex items-center gap-2 sm:gap-2.5">
          {/* Direct Emergency Call Button */}
          <a
            href="tel:+923325136733"
            className="hidden xl:inline-flex items-center gap-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800/80 px-3.5 py-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/80 transition-colors shadow-2xs"
          >
            <FiPhone size={13} className="text-emerald-600 dark:text-emerald-400 animate-pulse" />
            <span>+92 332 5136733</span>
          </a>

          <ThemeToggle />

          <div className="h-5 w-px bg-slate-200/80 dark:bg-slate-800/80" />

          {user ? (
            <div className="flex items-center gap-2">
              <Link
                to="/dashboard"
                className="hidden md:inline-flex items-center gap-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3.5 py-2 shadow-sm shadow-blue-500/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>Dashboard</span>
                <FiArrowRight size={13} />
              </Link>

              <div
                className="relative"
                ref={userDropdownRef}
                onMouseEnter={handleUserMouseEnter}
                onMouseLeave={handleUserMouseLeave}
              >
                <button
                  type="button"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 pl-1.5 pr-2.5 py-1.5 rounded-full border border-slate-200/90 dark:border-slate-700/80 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:border-blue-400 dark:hover:border-blue-500 transition-all shadow-xs cursor-pointer"
                  aria-expanded={userDropdownOpen}
                  aria-haspopup="true"
                >
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white text-[11px] font-black shadow-2xs">
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
                      userDropdownOpen ? "rotate-180 text-blue-500" : ""
                    }`}
                  />
                </button>

                {/* User Dropdown Menu */}
                {userDropdownOpen && (
                  <div
                    className="absolute right-0 top-full mt-2 w-64 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-700/80 p-2 shadow-2xl dark:shadow-2xl dark:shadow-black/80 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                    onMouseEnter={handleUserMouseEnter}
                    onMouseLeave={handleUserMouseLeave}
                  >
                    <div className="px-3 py-2.5 border-b border-slate-100 dark:border-slate-800 mb-1 bg-slate-50/80 dark:bg-slate-950/60 rounded-t-xl">
                      <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {user.name}
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                        {user.email}
                      </p>
                      <div className="mt-1.5 flex items-center gap-1.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                        <FiCheckCircle size={12} />
                        <span>Active Session • {user.role}</span>
                      </div>
                    </div>

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

                      {["Admin", "Receptionist", "Doctor"].includes(
                        user.role
                      ) && (
                        <Link
                          to="/appointments"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-slate-800 hover:text-blue-600 transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            <FiUsers className="text-emerald-500" size={14} />
                            <span>Appointments &amp; Queue</span>
                          </div>
                          <FiArrowRight size={12} className="text-slate-400" />
                        </Link>
                      )}

                      {["Admin", "Pharmacist"].includes(user.role) && (
                        <Link
                          to="/pharmacy"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-slate-800 hover:text-blue-600 transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            <FiPackage className="text-amber-500" size={14} />
                            <span>Pharmacy &amp; POS</span>
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
                          <span>Settings</span>
                        </div>
                        <FiArrowRight size={12} className="text-slate-400" />
                      </Link>
                    </div>

                    <div className="pt-1.5 mt-1 border-t border-slate-100 dark:border-slate-800">
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
            <div className="flex items-center">
              <Link
                to="/login"
                className="inline-flex items-center gap-1.5 rounded-full bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 text-xs font-bold px-4 py-2 shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>Staff Portal</span>
                <FiArrowRight size={13} />
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Button & Theme Toggle */}
        <div className="flex items-center gap-2 lg:hidden">
          <ThemeToggle />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 shadow-2xs transition-colors cursor-pointer"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer (Smooth Animated Overlay) */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 top-full bg-slate-950/60 backdrop-blur-xs z-40 lg:hidden"
            />

            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="fixed left-0 right-0 top-full max-h-[calc(100vh-64px)] overflow-y-auto bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-5 py-6 shadow-2xl z-50 lg:hidden space-y-4"
            >
              {/* Authenticated User Banner (Mobile) */}
              {user && (
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
              )}

              {/* Navigation Items Grid */}
              <div className="space-y-1">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-3 pb-1">
                  Medical Center Navigation
                </p>
                {NAV_LINKS.map((link) => {
                  const Icon = link.icon;
                  const active = isLinkActive(link);

                  return (
                    <a
                      key={link.href}
                      href={link.href}
                      onClick={(e) => handleNavClick(e, link)}
                      className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                        active
                          ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400"
                          : "text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon
                          size={16}
                          className={
                            active
                              ? "text-emerald-600 dark:text-emerald-400"
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

              {/* Hospital Quick Helpline & WhatsApp */}
              <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/70 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <FiPhone className="text-emerald-600 animate-pulse" />
                    <span>24/7 Helpline: +92 332 5136733</span>
                  </span>
                  <span className="text-[10px] font-extrabold text-emerald-600 dark:text-emerald-400 uppercase">
                    Open 24h
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <a
                    href="tel:+923325136733"
                    className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold bg-emerald-600 text-white shadow-xs"
                  >
                    <FiPhone size={13} />
                    <span>Call Center</span>
                  </a>
                  <a
                    href="https://wa.me/923325136733"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 shadow-xs"
                  >
                    <FiMessageCircle size={13} />
                    <span>WhatsApp</span>
                  </a>
                </div>
              </div>

              {/* Facility Address Bar */}
              <div className="flex items-center gap-2 px-3 py-2 text-[11px] text-slate-500 dark:text-slate-400">
                <FiMapPin size={13} className="text-blue-500 shrink-0" />
                <span>Nawabshah Road, City Sanghar</span>
              </div>

              {/* Staff Portal / Sign In Mobile CTA */}
              <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
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
                      className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                    >
                      <FiLogOut size={14} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 shadow-md transition-colors"
                  >
                    <span>Clinic Staff Portal</span>
                    <FiArrowRight size={14} />
                  </Link>
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
