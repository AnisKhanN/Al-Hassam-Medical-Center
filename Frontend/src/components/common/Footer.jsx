import { Link } from "react-router-dom";
import {
  FiActivity,
  FiPhone,
  FiMapPin,
  FiArrowUp,
  FiClock,
  FiUsers,
  FiPackage,
  FiHeart,
  FiMessageCircle,
  FiCheckCircle,
  FiAward,
  FiUser,
  FiFileText,
  FiGithub,
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
    <footer className="w-full bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800/90 text-slate-600 dark:text-slate-400 text-xs pt-14 pb-20 sm:pb-12 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 sm:gap-10 lg:gap-12">
          {/* Column 1 & 2: Brand Profile, Mission, Live Status & Socials */}
          <div className="sm:col-span-2 space-y-4 text-left">
            <Link to="/" className="inline-flex items-center gap-3 group">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-blue-600 text-white shadow-md shadow-emerald-500/25 group-hover:scale-105 transition-transform duration-200">
                <FiActivity size={20} className="stroke-[2.5]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-base font-extrabold tracking-tight text-slate-900 dark:text-white">
                    Al-Hassam Medical Center
                  </span>
                  <span className="rounded-full bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:text-emerald-300">
                    24/7 Open
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Nawabshah Road, City Sanghar
                </p>
              </div>
            </Link>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed max-w-sm">
              Al-Hassam Medical Center is a dedicated 24-hour healthcare
              facility providing around-the-clock emergency medical care,
              outpatient clinics, on-site pharmacy, and visiting specialist
              doctor consultations in Sanghar, Sindh.
            </p>

            {/* Operating Hours & Status */}
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800 px-3 py-1.5 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span>Open 24 Hours • Monday to Sunday (All Day)</span>
            </div>

            {/* Helpline Fast Action */}
            <div className="pt-2 flex flex-wrap items-center gap-2.5">
              <a
                href="tel:+923325136733"
                className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-3.5 py-2 transition-colors shadow-xs"
              >
                <FiPhone size={13} className="animate-pulse" />
                <span>+92 332 5136733</span>
              </a>
              <a
                href="https://wa.me/923325136733?text=Hello%20Al-Hassam%20Medical%20Center,%20I%20need%20assistance."
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs px-3.5 py-2 transition-colors"
              >
                <FiMessageCircle size={13} className="text-emerald-500" />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Column 2: Specialist Disciplines */}
          <div className="space-y-3 text-left">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5">
              <FiUsers className="text-blue-500" />
              <span>Specialist Faculty</span>
            </p>
            <ul className="space-y-2">
              {[
                "Child Care & Pediatrics",
                "General Medicine",
                "Cardiology",
                "Gastroenterology",
                "General Surgery",
                "Gynecology & Obstetrics",
                "Ophthalmology (Eye Care)",
              ].map((specialty, idx) => (
                <li key={idx}>
                  <button
                    onClick={() => handleScrollTo("#specialists")}
                    className="hover:text-blue-600 dark:hover:text-blue-400 text-left py-0.5 transition-colors cursor-pointer"
                  >
                    {specialty}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Clinical Facilities */}
          <div className="space-y-3 text-left">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5">
              <FiPackage className="text-emerald-500" />
              <span>Facilities &amp; Services</span>
            </p>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => handleScrollTo("#facilities")}
                  className="hover:text-emerald-600 dark:hover:text-emerald-400 text-left py-0.5 transition-colors cursor-pointer"
                >
                  24/7 Emergency &amp; Triage
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleScrollTo("#facilities")}
                  className="hover:text-emerald-600 dark:hover:text-emerald-400 text-left py-0.5 transition-colors cursor-pointer"
                >
                  On-Site 24-Hour Pharmacy
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleScrollTo("#facilities")}
                  className="hover:text-emerald-600 dark:hover:text-emerald-400 text-left py-0.5 transition-colors cursor-pointer"
                >
                  Outpatient Consultation Suites
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleScrollTo("#facilities")}
                  className="hover:text-emerald-600 dark:hover:text-emerald-400 text-left py-0.5 transition-colors cursor-pointer"
                >
                  12-Lead Diagnostic ECG
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleScrollTo("#facilities")}
                  className="hover:text-emerald-600 dark:hover:text-emerald-400 text-left py-0.5 transition-colors cursor-pointer"
                >
                  Maternal &amp; Child Health Suite
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleScrollTo("#facilities")}
                  className="hover:text-emerald-600 dark:hover:text-emerald-400 text-left py-0.5 transition-colors cursor-pointer"
                >
                  Minor Surgery &amp; Wound Dressing
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Location, Emergency & Staff Login */}
          <div className="space-y-3 text-left">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5">
              <FiMapPin className="text-teal-500" />
              <span>Location &amp; Access</span>
            </p>
            <div className="space-y-2 text-xs">
              <p className="font-semibold text-slate-900 dark:text-white leading-snug">
                Nawabshah Road, City Sanghar
              </p>
              <p className="text-slate-500 dark:text-slate-400">
                Sindh, Pakistan
              </p>

              <div className="pt-2">
                <a
                  href="https://maps.google.com/?q=Nawabshah+Road+Sanghar"
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                >
                  <FiMapPin size={12} />
                  <span>Google Maps Route</span>
                </a>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Doctor / Staff Portal
                </p>
                <Link
                  to="/login"
                  className="inline-flex items-center gap-1 text-xs font-bold text-slate-800 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 mt-1"
                >
                  <span>Portal Sign In →</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Developer & Architectural Attribution Showcase */}
        <div className="mt-12 p-6 sm:p-7 rounded-3xl border border-slate-200/90 dark:border-slate-800/90 bg-gradient-to-r from-blue-50/70 via-indigo-50/50 to-slate-50/70 dark:from-slate-900/90 dark:via-blue-950/40 dark:to-slate-900/90 shadow-xs backdrop-blur-md">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            {/* Left: Avatar & Developer Bio */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-5 text-center sm:text-left">
              <div className="relative flex h-14 w-14 sm:h-16 sm:w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 font-black text-xl sm:text-2xl text-white shadow-md shadow-blue-500/25">
                AKN
                <span
                  className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-white dark:border-slate-900 bg-emerald-500 animate-pulse"
                  title="Lead Software Engineer"
                />
              </div>

              <div className="space-y-1">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                    Lead Software Architect &amp; Developer
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 dark:bg-blue-950/70 border border-blue-200 dark:border-blue-800 px-2.5 py-0.5 text-[10px] font-bold text-blue-700 dark:text-blue-300">
                    <FiAward size={11} /> BSIT Final Year Project
                  </span>
                </div>
                <h4 className="text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-tight">
                  Engineered &amp; Developed by Anis Khan Niazi
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 max-w-xl leading-relaxed">
                  Full-Stack Multi-Tenant Healthcare SaaS engineered for
                  outpatient clinics, rural medical centers, and community
                  pharmacies in Sanghar &amp; Interior Sindh, Pakistan.
                </p>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1 text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                  <span className="inline-flex items-center gap-1">
                    <FiMapPin size={12} className="text-emerald-500" /> Sanghar,
                    Sindh, Pakistan
                  </span>
                  <span>•</span>
                  <span>Express 5</span>
                  <span>•</span>
                  <span>React 19</span>
                  <span>•</span>
                  <span>MongoDB Atlas</span>
                  <span>•</span>
                  <span>Google Gemini AI</span>
                </div>
              </div>
            </div>

            {/* Right: Quick Links / Profile CTAs */}
            <div className="flex flex-wrap items-center justify-center gap-2.5 shrink-0">
              <Link
                to="/about"
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2.5 transition-all shadow-xs hover:scale-105 active:scale-95 cursor-pointer"
              >
                <FiUser size={14} />
                <span>About Developer</span>
              </Link>
              <Link
                to="/docs"
                className="inline-flex items-center gap-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold px-4 py-2.5 transition-all shadow-xs hover:scale-105 active:scale-95 cursor-pointer"
              >
                <FiFileText size={14} className="text-emerald-500" />
                <span>Technical Report</span>
              </Link>
              <a
                href="https://github.com/AnisKhanN/Al-Hassam-Medical-Center"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white text-xs font-bold px-4 py-2.5 transition-all shadow-xs hover:scale-105 active:scale-95"
              >
                <FiGithub size={14} />
                <span>GitHub</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright, Developer Attribution & Scroll to Top */}
        <div className="mt-8 pt-6 border-t border-slate-200/80 dark:border-slate-800/80 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-slate-500 dark:text-slate-400">
          <div className="text-center md:text-left space-y-1">
            <p>
              © {new Date().getFullYear()} Al-Hassam Medical Center •
              SmartClinic SaaS. Nawabshah Road, City Sanghar, Sindh. All Rights
              Reserved.
            </p>
            <p className="text-slate-600 dark:text-slate-300 font-semibold flex flex-wrap items-center justify-center md:justify-start gap-1.5">
              <span>Designed, Architected &amp; Developed with</span>
              <FiHeart size={12} className="text-red-500 fill-red-500 inline" />
              <span>by</span>
              <Link
                to="/about"
                className="text-blue-600 dark:text-blue-400 font-bold hover:underline"
              >
                Anis Khan Niazi
              </Link>
              <span>(BSIT Final Year Project, Sanghar, Sindh)</span>
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/about"
              className="hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              Developer Profile
            </Link>
            <Link
              to="/docs"
              className="hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              Project Docs
            </Link>
            <button
              onClick={() => handleScrollTo("#faq")}
              className="hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
            >
              Patient FAQs
            </button>
            <button
              onClick={() => handleScrollTo("#contact")}
              className="hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
            >
              Contact Hub
            </button>
            <button
              onClick={handleBackToTop}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold transition-colors cursor-pointer"
              aria-label="Back to top of page"
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
