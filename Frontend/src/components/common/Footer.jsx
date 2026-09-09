import { Link } from "react-router-dom";
import {
  FiActivity,
  FiMail,
  FiPhone,
  FiMapPin,
  FiGithub,
  FiLinkedin,
  FiGlobe,
  FiArrowRight,
  FiArrowUp,
  FiShield,
  FiCpu,
  FiCheckCircle,
} from "react-icons/fi";
import { useSmoothScroll } from "../../hooks/useSmoothScroll";

const Footer = () => {
  const { scrollTo } = useSmoothScroll();

  const handleScrollTo = (target) => {
    if (window.location.pathname !== "/") {
      window.location.href = `/${target}`;
    } else {
      scrollTo(target, { offset: -80 });
    }
  };

  const handleBackToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="w-full bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800/90 text-slate-600 dark:text-slate-400 text-xs pt-12 pb-20 sm:pb-12 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 sm:gap-10 lg:gap-12">
          {/* Column 1 & 2: Brand Profile, Mission, Live Status & Socials */}
          <div className="sm:col-span-2 space-y-4 text-left">
            <Link to="/" className="inline-flex items-center gap-3 group">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 text-white shadow-md shadow-blue-500/25 group-hover:scale-105 transition-transform duration-200">
                <FiActivity size={20} className="stroke-[2.5]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-base font-extrabold tracking-tight text-slate-900 dark:text-white">
                    SmartClinic
                  </span>
                  <span className="rounded-full bg-blue-50 dark:bg-blue-950/70 border border-blue-200 dark:border-blue-800 px-2 py-0.5 text-[10px] font-bold text-blue-700 dark:text-blue-400">
                    SaaS OS
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  BSIT Capstone Project • Lead Architect: Anis Khan Niazi
                </p>
              </div>
            </Link>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed max-w-sm">
              An enterprise-grade, multi-tenant clinical operating system
              unifying Electronic Health Records (EHR), FEFO inventory,
              conflict-free scheduling, and bilingual AI discharge intelligence.
            </p>

            {/* Live Status Badge */}
            <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-3 py-1 text-[11px] font-medium text-slate-700 dark:text-slate-300">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span>All Systems Operational • 99.98% SLA</span>
            </div>

            {/* Social Media & Contact Accounts */}
            <div className="pt-2">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
                Connect With The Founder
              </p>
              <div className="flex items-center gap-2.5">
                <a
                  href="https://linkedin.com/in/aniskhanniazi"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="LinkedIn Profile"
                  className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 dark:hover:text-white transition-all shadow-xs"
                >
                  <FiLinkedin size={15} />
                </a>
                <a
                  href="https://github.com/aniskhanniazi"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="GitHub Repository"
                  className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-slate-900 hover:text-white dark:hover:bg-slate-700 dark:hover:text-white transition-all shadow-xs"
                >
                  <FiGithub size={15} />
                </a>
                <a
                  href="mailto:aniskhan22@gmail.com"
                  aria-label="Email Contact"
                  className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-rose-600 hover:text-white dark:hover:bg-rose-600 dark:hover:text-white transition-all shadow-xs"
                >
                  <FiMail size={15} />
                </a>
                <a
                  href="tel:+923000000000"
                  aria-label="Telephone Support"
                  className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-emerald-600 hover:text-white dark:hover:bg-emerald-600 dark:hover:text-white transition-all shadow-xs"
                >
                  <FiPhone size={15} />
                </a>
              </div>
            </div>
          </div>

          {/* Column 2: Clinical Platform */}
          <div className="space-y-3 text-left">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Clinical Platform
            </p>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => handleScrollTo("#features")}
                  className="hover:text-blue-600 dark:hover:text-blue-400 text-left py-1 transition-colors"
                >
                  Patient EHR &amp; Records
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleScrollTo("#features")}
                  className="hover:text-blue-600 dark:hover:text-blue-400 text-left py-1 transition-colors"
                >
                  Conflict-Free Scheduling
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleScrollTo("#modules")}
                  className="hover:text-blue-600 dark:hover:text-blue-400 text-left py-1 transition-colors"
                >
                  FEFO Pharmacy POS
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleScrollTo("#ai-engine")}
                  className="hover:text-blue-600 dark:hover:text-blue-400 text-left py-1 transition-colors"
                >
                  Dual-Engine Gemini AI
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleScrollTo("#workflows")}
                  className="hover:text-blue-600 dark:hover:text-blue-400 text-left py-1 transition-colors"
                >
                  WebRTC Telemedicine
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleScrollTo("#security")}
                  className="hover:text-blue-600 dark:hover:text-blue-400 text-left py-1 transition-colors"
                >
                  Multi-Gateway Invoicing
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Company & E-E-A-T */}
          <div className="space-y-3 text-left">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Company &amp; Story
            </p>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/about"
                  className="hover:text-blue-600 dark:hover:text-blue-400 block py-1 transition-colors"
                >
                  About Us &amp; Founder
                </Link>
              </li>
              <li>
                <Link
                  to="/about#story"
                  className="hover:text-blue-600 dark:hover:text-blue-400 block py-1 transition-colors"
                >
                  Why I Started SmartClinic
                </Link>
              </li>
              <li>
                <Link
                  to="/about#values"
                  className="hover:text-blue-600 dark:hover:text-blue-400 block py-1 transition-colors"
                >
                  Our Core Values &amp; Mission
                </Link>
              </li>
              <li>
                <button
                  onClick={() => handleScrollTo("#security")}
                  className="hover:text-blue-600 dark:hover:text-blue-400 text-left py-1 transition-colors"
                >
                  E-E-A-T &amp; Trust Architecture
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleScrollTo("#faq")}
                  className="hover:text-blue-600 dark:hover:text-blue-400 text-left py-1 transition-colors"
                >
                  Frequently Asked Questions
                </button>
              </li>
              <li>
                <Link
                  to="/docs"
                  className="hover:text-blue-600 dark:hover:text-blue-400 block py-1 transition-colors text-blue-600 dark:text-blue-400 font-bold"
                >
                  Docs &amp; Reports Center
                </Link>
              </li>
              <li>
                <a
                  href="/PROJECT_REPORT.md"
                  download="SmartClinic_PROJECT_REPORT.md"
                  className="hover:text-blue-600 dark:hover:text-blue-400 block py-1 transition-colors text-[11px]"
                >
                  📥 Download FYP Report (.md)
                </a>
              </li>
              <li>
                <a
                  href="/RBAC_AUDIT_REPORT.md"
                  download="SmartClinic_RBAC_AUDIT_REPORT.md"
                  className="hover:text-blue-600 dark:hover:text-blue-400 block py-1 transition-colors text-[11px]"
                >
                  📥 Download RBAC Audit (.md)
                </a>
              </li>
              <li>
                <a
                  href="/api/health"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-blue-600 dark:hover:text-blue-400 block py-1 transition-colors text-emerald-600 dark:text-emerald-400 font-semibold"
                >
                  API Health Probe
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Location, Support & Staff Login */}
          <div className="space-y-3 text-left">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Deployment &amp; Access
            </p>
            <div className="space-y-2.5 text-xs">
              <div className="flex items-start gap-2 text-slate-600 dark:text-slate-300">
                <FiMapPin className="text-blue-500 mt-0.5 shrink-0" size={14} />
                <span>
                  Sector F-10, Islamabad &amp; Sanghar, Sindh, Pakistan
                </span>
              </div>
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                <FiMail className="text-blue-500 shrink-0" size={14} />
                <a
                  href="mailto:aniskhan22@gmail.com"
                  className="hover:underline truncate"
                >
                  aniskhan22@gmail.com
                </a>
              </div>
              <div className="pt-2">
                <Link
                  to="/login"
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 text-white font-bold px-4 py-2.5 shadow-md shadow-blue-500/20 hover:bg-blue-700 transition-all text-xs"
                >
                  <span>Staff Portal Login</span>
                  <FiArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Sub-Footer Bar */}
        <div className="border-t border-slate-200 dark:border-slate-800/80 pt-8 mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="space-y-1">
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              © {new Date().getFullYear()} SmartClinic SaaS. All rights
              reserved.
            </p>
            <p className="text-[10px] text-slate-400 dark:text-slate-500">
              Designed, Engineered &amp; Maintained with pride by{" "}
              <strong className="text-slate-700 dark:text-slate-300 font-semibold">
                Anis Khan Niazi
              </strong>
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] font-medium">
            <span className="text-slate-400 dark:text-slate-600 hidden sm:inline">
              •
            </span>
            <span className="text-slate-500 dark:text-slate-400">
              HIPAA &amp; FHIR Inspired
            </span>
            <span className="text-slate-400 dark:text-slate-600 hidden sm:inline">
              •
            </span>
            <span className="text-slate-500 dark:text-slate-400">
              ISO 27001 Controls
            </span>
            <button
              onClick={handleBackToTop}
              className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline font-semibold cursor-pointer ml-2"
            >
              <span>Back to Top</span>
              <FiArrowUp size={12} />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
