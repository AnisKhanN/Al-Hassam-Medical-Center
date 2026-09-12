import { useState, useEffect, useCallback, useMemo } from "react";
import {
  FiUsers,
  FiActivity,
  FiHeart,
  FiShield,
  FiCheckCircle,
  FiEye,
  FiClock,
  FiMapPin,
  FiPhone,
  FiCalendar,
  FiToggleLeft,
  FiToggleRight,
  FiRefreshCw,
  FiSearch,
  FiAward,
} from "react-icons/fi";
import api from "../../api/axios";
import RupeeIcon from "../common/RupeeIcon";
import { useAuth } from "../../hooks/useAuth";

export const MEDICAL_SPECIALTIES = [
  {
    id: "all",
    name: "All Disciplines",
    shortName: "All",
    icon: FiUsers,
    color: "from-blue-600 to-indigo-600",
    badgeColor: "bg-blue-50 text-blue-700 dark:bg-blue-950/70 dark:text-blue-300 border-blue-200 dark:border-blue-800",
  },
  {
    id: "Child Care & Pediatrics",
    name: "Child Care & Pediatrics",
    shortName: "Pediatrics",
    icon: FiUsers,
    color: "from-amber-500 to-orange-500",
    badgeColor: "bg-amber-50 text-amber-700 dark:bg-amber-950/70 dark:text-amber-300 border-amber-200 dark:border-amber-800",
  },
  {
    id: "General Medicine",
    name: "General Medicine",
    shortName: "Medicine",
    icon: FiActivity,
    color: "from-blue-600 to-indigo-600",
    badgeColor: "bg-blue-50 text-blue-700 dark:bg-blue-950/70 dark:text-blue-300 border-blue-200 dark:border-blue-800",
  },
  {
    id: "Cardiology",
    name: "Cardiology",
    shortName: "Cardiology",
    icon: FiHeart,
    color: "from-rose-600 to-pink-600",
    badgeColor: "bg-rose-50 text-rose-700 dark:bg-rose-950/70 dark:text-rose-300 border-rose-200 dark:border-rose-800",
  },
  {
    id: "Gastroenterology",
    name: "Gastroenterology",
    shortName: "Gastro",
    icon: FiShield,
    color: "from-emerald-600 to-teal-600",
    badgeColor: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800",
  },
  {
    id: "General Surgery",
    name: "General Surgery",
    shortName: "Surgery",
    icon: FiCheckCircle,
    color: "from-purple-600 to-violet-600",
    badgeColor: "bg-purple-50 text-purple-700 dark:text-purple-950/70 dark:text-purple-300 border-purple-200 dark:border-purple-800",
  },
  {
    id: "Gynecology & Obstetrics",
    name: "Gynecology & Obstetrics",
    shortName: "Gynecology",
    icon: FiUsers,
    color: "from-pink-600 to-rose-500",
    badgeColor: "bg-pink-50 text-pink-700 dark:bg-pink-950/70 dark:text-pink-300 border-pink-200 dark:border-pink-800",
  },
  {
    id: "Ophthalmology",
    name: "Ophthalmology",
    shortName: "Eye Care",
    icon: FiEye,
    color: "from-cyan-600 to-blue-600",
    badgeColor: "bg-cyan-50 text-cyan-700 dark:bg-cyan-950/70 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800",
  },
];

export default function SpecialistDoctorsRoster({ onSelectDoctorForBooking }) {
  const { user } = useAuth();
  const isAdmin = user?.role === "Admin";
  const isReceptionist = user?.role === "Receptionist";

  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSpecialty, setSelectedSpecialty] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [togglingId, setTogglingId] = useState(null);
  const [dutySuccessMsg, setDutySuccessMsg] = useState("");

  const fetchDoctors = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/users/doctors");
      setDoctors(res.data?.data || []);
    } catch (err) {
      console.error("Failed to fetch doctors roster", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDoctors();
  }, [fetchDoctors]);

  const handleToggleDuty = async (doctorId, currentDuty) => {
    setTogglingId(doctorId);
    setDutySuccessMsg("");
    try {
      const res = await api.patch(`/users/${doctorId}/duty`, {
        onDuty: !currentDuty,
      });
      const updated = res.data?.data;
      setDoctors((prev) =>
        prev.map((d) => (d._id === doctorId ? { ...d, onDuty: updated.onDuty } : d))
      );
      setDutySuccessMsg(
        `${updated.name} is now ${updated.onDuty ? "On Duty" : "Off Duty"}`
      );
      setTimeout(() => setDutySuccessMsg(""), 3500);
    } catch (err) {
      console.error("Failed to toggle duty", err);
    } finally {
      setTogglingId(null);
    }
  };

  const filteredDoctors = useMemo(() => {
    return doctors.filter((doc) => {
      const matchesSpecialty =
        selectedSpecialty === "all" || doc.specialty === selectedSpecialty;
      const matchesSearch =
        !searchQuery.trim() ||
        doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.specialty?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.roomNumber?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSpecialty && matchesSearch;
    });
  }, [doctors, selectedSpecialty, searchQuery]);

  const stats = useMemo(() => {
    const total = doctors.length;
    const onDuty = doctors.filter((d) => d.onDuty).length;
    const uniqueSpecialties = new Set(doctors.map((d) => d.specialty).filter(Boolean)).size;
    return { total, onDuty, uniqueSpecialties };
  }, [doctors]);

  return (
    <div className="space-y-6">
      {/* Header & Quick Summary Banner */}
      <div className="rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 p-6 sm:p-7 shadow-xs backdrop-blur-md">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="flex items-center gap-3.5">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-blue-600 text-white shadow-md shadow-emerald-500/20 shrink-0">
              <FiAward size={24} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                  Specialist Doctors Roster
                </h2>
                <span className="rounded-full bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800 px-2.5 py-0.5 text-xs font-bold text-emerald-700 dark:text-emerald-300">
                  7 Disciplines
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                Al-Hassam Medical Center clinical faculty schedules, OPD consultation suites, and live duty status.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Quick Live Stats Pills */}
            <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-950/70 border border-slate-200/80 dark:border-slate-800 px-3.5 py-2 rounded-xl text-xs">
              <span className="font-bold text-slate-900 dark:text-white">
                {stats.onDuty} / {stats.total}
              </span>
              <span className="text-slate-500 dark:text-slate-400">On Duty Now</span>
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>

            <button
              type="button"
              onClick={fetchDoctors}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 px-3.5 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition cursor-pointer shadow-2xs"
            >
              <FiRefreshCw size={13} className={loading ? "animate-spin" : ""} />
              <span>Refresh Roster</span>
            </button>
          </div>
        </div>

        {/* Feedback alert on duty toggle */}
        {dutySuccessMsg && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-xs font-bold text-emerald-700 dark:text-emerald-300 animate-in fade-in duration-200">
            ✔ {dutySuccessMsg}
          </div>
        )}

        {/* Search Bar & 7 Specialties Tabs */}
        <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800/80 space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search specialist by doctor name, room number, or discipline..."
                className="w-full pl-9 pr-4 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* 7 Specialties Horizontal Capsule Filter */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
            {MEDICAL_SPECIALTIES.map((spec) => {
              const Icon = spec.icon;
              const isActive = selectedSpecialty === spec.id;
              return (
                <button
                  key={spec.id}
                  type="button"
                  onClick={() => setSelectedSpecialty(spec.id)}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer shrink-0 ${
                    isActive
                      ? "bg-blue-600 text-white shadow-sm shadow-blue-500/25 scale-[1.02]"
                      : "bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800"
                  }`}
                >
                  <Icon size={14} />
                  <span>{spec.shortName}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Specialist Doctors Grid */}
      {loading ? (
        <div className="flex h-56 flex-col items-center justify-center gap-3 rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-200 dark:border-blue-950 border-t-blue-600" />
          <p className="text-xs font-semibold text-slate-500">Loading specialist doctors roster...</p>
        </div>
      ) : filteredDoctors.length === 0 ? (
        <div className="p-8 text-center rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 text-slate-500 text-xs">
          No specialist doctors found matching the current filter.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredDoctors.map((doctor) => {
            const specConfig =
              MEDICAL_SPECIALTIES.find((s) => s.id === doctor.specialty) ||
              MEDICAL_SPECIALTIES[1];
            const Icon = specConfig.icon;

            return (
              <div
                key={doctor._id}
                className="rounded-3xl border border-slate-200/90 dark:border-slate-800/90 bg-white dark:bg-slate-900/90 p-5 shadow-2xs hover:shadow-lg transition-all duration-200 flex flex-col justify-between group text-left"
              >
                <div className="space-y-4">
                  {/* Doctor Card Top Bar */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-black text-base shadow-sm">
                        {doctor.name?.slice(0, 2).toUpperCase() || "DR"}
                        {doctor.onDuty && (
                          <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900 animate-pulse" />
                        )}
                      </div>
                      <div>
                        <h3 className="text-base font-black text-slate-900 dark:text-white leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {doctor.name}
                        </h3>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                          {doctor.email}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full border ${specConfig.badgeColor}`}
                    >
                      {doctor.specialty || "General Medicine"}
                    </span>
                  </div>

                  {/* Practice Details Pills */}
                  <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                    <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                      <FiMapPin size={13} className="text-blue-500 shrink-0" />
                      <span className="font-semibold">{doctor.roomNumber || "OPD Suite 101"}</span>
                    </div>

                    <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                      <FiClock size={13} className="text-emerald-500 shrink-0" />
                      <span className="truncate">{doctor.visitingDays || "Monday - Sunday"}</span>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <div className="flex items-center gap-1.5 text-slate-900 dark:text-white font-bold">
                        <RupeeIcon size={14} className="text-emerald-600 dark:text-emerald-400" />
                        <span>PKR {(doctor.consultationFee || 1500).toLocaleString()}</span>
                        <span className="text-[10px] text-slate-400 font-normal">/ consult</span>
                      </div>

                      <span
                        className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          doctor.onDuty
                            ? "bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300"
                            : "bg-slate-100 dark:bg-slate-800 text-slate-500"
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            doctor.onDuty ? "bg-emerald-500 animate-pulse" : "bg-slate-400"
                          }`}
                        />
                        <span>{doctor.onDuty ? "On Duty" : "Off Duty"}</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions Footer */}
                <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                  {/* Admin or Doctor can toggle Duty */}
                  {(isAdmin || user?._id === doctor._id) && (
                    <button
                      type="button"
                      disabled={togglingId === doctor._id}
                      onClick={() => handleToggleDuty(doctor._id, doctor.onDuty)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                    >
                      {doctor.onDuty ? (
                        <>
                          <FiToggleRight size={16} className="text-emerald-500" />
                          <span>Set Off Duty</span>
                        </>
                      ) : (
                        <>
                          <FiToggleLeft size={16} className="text-slate-400" />
                          <span>Set On Duty</span>
                        </>
                      )}
                    </button>
                  )}

                  {/* Receptionist or Admin can route appointment directly */}
                  {(isReceptionist || isAdmin) && onSelectDoctorForBooking && (
                    <button
                      type="button"
                      onClick={() => onSelectDoctorForBooking(doctor)}
                      className="ml-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold shadow-xs transition cursor-pointer"
                    >
                      <FiCalendar size={12} />
                      <span>Book OPD</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
