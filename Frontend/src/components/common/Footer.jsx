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
              Al-Hassam Medical Center is a dedicated 24-hour healthcare facility
              providing around-the-clock emergency medical care, outpatient
              clinics, on-site pharmacy, and visiting specialist doctor
              consultations in Sanghar, Sindh.
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

        {/* Bottom Bar: Copyright, Location & Scroll to Top */}
        <div className="mt-12 pt-6 border-t border-slate-200/80 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500 dark:text-slate-400">
          <p className="text-center sm:text-left">
            © {new Date().getFullYear()} Al-Hassam Medical Center. Nawabshah
            Road, City Sanghar. All Rights Reserved.
          </p>

          <div className="flex items-center gap-4">
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
