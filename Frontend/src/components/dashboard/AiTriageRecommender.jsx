import { useState } from "react";
import {
  FiCpu,
  FiActivity,
  FiAlertCircle,
  FiCheckCircle,
  FiArrowRight,
  FiCalendar,
  FiClock,
  FiRefreshCw,
} from "react-icons/fi";
import api from "../../api/axios";

export default function AiTriageRecommender({ onRouteToSpecialty }) {
  const [symptoms, setSymptoms] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("Male");
  const [temp, setTemp] = useState("");
  const [bp, setBp] = useState("");
  const [loading, setLoading] = useState(false);
  const [triageResult, setTriageResult] = useState(null);

  const handleTriage = async (e) => {
    e.preventDefault();
    if (!symptoms.trim()) return;
    setLoading(true);
    try {
      const res = await api.post("/ai/triage", {
        symptoms: symptoms.trim(),
        age: age ? Number(age) : undefined,
        gender,
        vitals: {
          temperature: temp ? Number(temp) : undefined,
          bloodPressure: bp || undefined,
        },
      });
      setTriageResult(res.data?.data);
    } catch (err) {
      console.error("AI Triage failed", err);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = () => {
    if (triageResult?.recommendedSpecialty && onRouteToSpecialty) {
      onRouteToSpecialty(triageResult.recommendedSpecialty);
    }
  };

  return (
    <div className="rounded-3xl border border-emerald-200/80 dark:border-emerald-900/50 bg-white/90 dark:bg-slate-900/90 p-5 sm:p-6 shadow-xs backdrop-blur-md space-y-4 text-left">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-500/20 shrink-0">
            <FiCpu size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white tracking-tight">
                AI Patient Triage Assistant
              </h3>
              <span className="rounded-full bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:text-emerald-300">
                Front Desk Co-Pilot
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Matches patient symptoms to the correct specialist among our 7 Medical Specialties.
            </p>
          </div>
        </div>
      </div>

      {/* Triage Form */}
      <form onSubmit={handleTriage} className="space-y-3 pt-1">
        <div>
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
            Reported Complaint / Symptoms
          </label>
          <input
            type="text"
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
            placeholder="e.g. 5yo child with high fever and earache, or adult with chest tightness and sweating..."
            className="mt-1 w-full p-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <div>
            <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">Age</label>
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="e.g. 28"
              className="mt-0.5 w-full p-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">Gender</label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="mt-0.5 w-full p-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">Temp (°F)</label>
            <input
              type="text"
              value={temp}
              onChange={(e) => setTemp(e.target.value)}
              placeholder="98.6"
              className="mt-0.5 w-full p-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">Blood Pressure</label>
            <input
              type="text"
              value={bp}
              onChange={(e) => setBp(e.target.value)}
              placeholder="120/80"
              className="mt-0.5 w-full p-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || !symptoms.trim()}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs shadow-xs transition disabled:opacity-50 cursor-pointer"
        >
          <FiActivity size={14} className={loading ? "animate-spin" : ""} />
          <span>{loading ? "Evaluating Triage..." : "Run AI Triage Recommendation"}</span>
        </button>
      </form>

      {/* Triage Output Card */}
      {triageResult && (
        <div
          className={`p-4 rounded-2xl border space-y-3 text-xs animate-in fade-in duration-200 ${
            triageResult.urgency === "Emergency"
              ? "bg-rose-50/80 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800 text-rose-950 dark:text-rose-200"
              : triageResult.urgency === "Urgent"
              ? "bg-amber-50/80 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800 text-amber-950 dark:text-amber-200"
              : "bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-950 dark:text-emerald-200"
          }`}
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Recommended Specialist:
              </span>
              <span className="font-black text-sm text-slate-900 dark:text-white bg-white/80 dark:bg-slate-900/80 px-2.5 py-1 rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xs">
                {triageResult.recommendedSpecialty}
              </span>
            </div>

            <span
              className={`inline-flex items-center gap-1 text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                triageResult.urgency === "Emergency"
                  ? "bg-rose-600 text-white"
                  : triageResult.urgency === "Urgent"
                  ? "bg-amber-500 text-white"
                  : "bg-emerald-600 text-white"
              }`}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
              <span>{triageResult.urgency}</span>
            </span>
          </div>

          <p className="text-[11px] leading-relaxed">
            <span className="font-bold">Rationale: </span>
            {triageResult.clinicalRationale}
          </p>

          {triageResult.suggestedVitals?.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 text-[10px]">
              <span className="font-bold">Suggested Immediate Checks:</span>
              {triageResult.suggestedVitals.map((v, i) => (
                <span key={i} className="bg-white/70 dark:bg-slate-900/70 px-2 py-0.5 rounded-md border border-slate-200/60 dark:border-slate-700/60 font-medium">
                  {v}
                </span>
              ))}
            </div>
          )}

          {/* 1-Click Routing Action */}
          {onRouteToSpecialty && (
            <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between">
              <span className="text-[10px] text-slate-500 dark:text-slate-400">
                Route patient queue directly to {triageResult.recommendedSpecialty}
              </span>
              <button
                type="button"
                onClick={handleApply}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 text-xs font-bold shadow-xs transition cursor-pointer"
              >
                <span>Select this Specialist</span>
                <FiArrowRight size={13} />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
