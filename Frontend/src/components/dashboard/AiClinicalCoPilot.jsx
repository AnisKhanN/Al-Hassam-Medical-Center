import { useState } from "react";
import {
  FiCpu,
  FiActivity,
  FiShield,
  FiAlertTriangle,
  FiCheckCircle,
  FiCopy,
  FiCheck,
  FiRefreshCw,
  FiBookOpen,
  FiSend,
  FiGlobe,
} from "react-icons/fi";
import api from "../../api/axios";

export default function AiClinicalCoPilot({ activePatient, activeAppointment, onApplyPrescription }) {
  const [tab, setTab] = useState("symptoms"); // "symptoms" | "safety" | "discharge"
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // 1. Symptoms & Differential State
  const [symptomsInput, setSymptomsInput] = useState("");
  const [differentialResult, setDifferentialResult] = useState(null);

  // 2. Prescription Safety Check State
  const [medsInput, setMedsInput] = useState("");
  const [allergyInput, setAllergyInput] = useState("");
  const [safetyResult, setSafetyResult] = useState(null);

  // 3. Trilingual Discharge State
  const [dischargeLang, setDischargeLang] = useState("trilingual");
  const [dischargeNotes, setDischargeNotes] = useState("");
  const [dischargeResult, setDischargeResult] = useState(null);

  // Run AI Symptoms Differential
  const handleAnalyzeSymptoms = async (e) => {
    e?.preventDefault();
    if (!symptomsInput.trim()) return;
    setLoading(true);
    try {
      const res = await api.post("/ai/query", {
        query: `Clinical Differential Diagnostic Support for Doctor:
Patient Complaint: ${symptomsInput}
Age: ${activePatient?.age || "Adult"}
Gender: ${activePatient?.gender || "Not specified"}
Provide: 1) Top 3 potential differential diagnoses, 2) Recommended immediate bedside tests, 3) Red flags to watch out for.`,
      });
      setDifferentialResult(res.data?.data?.result || res.data?.data);
    } catch (err) {
      console.error("AI Symptoms analysis failed", err);
    } finally {
      setLoading(false);
    }
  };

  // Run AI Prescription Safety Check
  const handleCheckPrescription = async (e) => {
    e?.preventDefault();
    if (!medsInput.trim()) return;
    setLoading(true);
    try {
      const medsArray = medsInput.split(",").map((m) => m.trim()).filter(Boolean);
      const allergiesArray = allergyInput.split(",").map((a) => a.trim()).filter(Boolean);

      const res = await api.post("/ai/prescription-check", {
        medications: medsArray,
        patientAllergies: allergiesArray,
      });
      setSafetyResult(res.data?.data);
    } catch (err) {
      console.error("AI Prescription check failed", err);
    } finally {
      setLoading(false);
    }
  };

  // Run AI Trilingual Discharge Slip Generator
  const handleGenerateDischarge = async (e) => {
    e?.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/ai/visit-summary", {
        patientId: activePatient?._id,
        appointmentId: activeAppointment?._id,
        clinicalNotes: dischargeNotes || "Patient evaluated and treated at outpatient clinic.",
        language: dischargeLang,
      });
      setDischargeResult(res.data?.data);
    } catch (err) {
      console.error("AI Discharge summary failed", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-3xl border border-cyan-200/80 dark:border-cyan-900/50 bg-white/90 dark:bg-slate-900/90 p-6 sm:p-7 shadow-xs backdrop-blur-md space-y-5 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-cyan-600 to-blue-600 text-white shadow-md shadow-cyan-500/20 shrink-0">
            <FiCpu size={22} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-tight">
                AI Clinical Co-Pilot
              </h3>
              <span className="rounded-full bg-cyan-50 dark:bg-cyan-950/70 border border-cyan-200 dark:border-cyan-800 px-2 py-0.5 text-[10px] font-bold text-cyan-700 dark:text-cyan-300">
                Doctor Assistant
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Differential diagnosis, drug contraindication scan, and trilingual discharge summaries.
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-800/80 text-xs self-start sm:self-center">
          <button
            type="button"
            onClick={() => setTab("symptoms")}
            className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
              tab === "symptoms"
                ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs"
                : "text-slate-600 dark:text-slate-400"
            }`}
          >
            Differentials
          </button>
          <button
            type="button"
            onClick={() => setTab("safety")}
            className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
              tab === "safety"
                ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs"
                : "text-slate-600 dark:text-slate-400"
            }`}
          >
            Drug Safety
          </button>
          <button
            type="button"
            onClick={() => setTab("discharge")}
            className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
              tab === "discharge"
                ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs"
                : "text-slate-600 dark:text-slate-400"
            }`}
          >
            Trilingual Slips
          </button>
        </div>
      </div>

      {/* Tab 1: Symptoms & Differential Analysis */}
      {tab === "symptoms" && (
        <div className="space-y-4 pt-2">
          <form onSubmit={handleAnalyzeSymptoms} className="space-y-3">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                <span>Patient Symptoms &amp; Clinical Presentation</span>
                {activePatient && (
                  <span className="text-[10px] text-blue-600 dark:text-blue-400">
                    Active: {activePatient.fullName} ({activePatient.gender}, {activePatient.computedAge || activePatient.age || "N/A"})
                  </span>
                )}
              </label>
              <textarea
                rows={2}
                value={symptomsInput}
                onChange={(e) => setSymptomsInput(e.target.value)}
                placeholder="e.g. 45yo male with burning epigastric pain radiating to retrosternal area for 3 days, aggravated by fatty meals..."
                className="mt-1 w-full p-3 rounded-2xl text-xs bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>
            <button
              type="submit"
              disabled={loading || !symptomsInput.trim()}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-bold text-xs shadow-xs transition disabled:opacity-50 cursor-pointer"
            >
              <FiActivity size={14} className={loading ? "animate-spin" : ""} />
              <span>{loading ? "Analyzing..." : "Generate AI Differential Guidance"}</span>
            </button>
          </form>

          {differentialResult && (
            <div className="p-4 rounded-2xl bg-cyan-50/70 dark:bg-cyan-950/40 border border-cyan-200 dark:border-cyan-800/80 space-y-2 text-xs">
              <div className="flex items-center justify-between font-bold text-cyan-800 dark:text-cyan-200">
                <span className="flex items-center gap-1.5">
                  <FiCheckCircle className="text-cyan-600" />
                  <span>Clinical Diagnostic Recommendations</span>
                </span>
                <button
                  onClick={() => handleCopy(typeof differentialResult === "string" ? differentialResult : JSON.stringify(differentialResult, null, 2))}
                  className="text-[11px] text-slate-500 hover:text-cyan-600 flex items-center gap-1 cursor-pointer"
                >
                  {copied ? <FiCheck size={12} className="text-emerald-500" /> : <FiCopy size={12} />}
                  <span>{copied ? "Copied" : "Copy"}</span>
                </button>
              </div>
              <div className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line text-[11px]">
                {typeof differentialResult === "string"
                  ? differentialResult
                  : differentialResult.summary || JSON.stringify(differentialResult, null, 2)}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Prescription Drug-Interaction Safety */}
      {tab === "safety" && (
        <div className="space-y-4 pt-2">
          <form onSubmit={handleCheckPrescription} className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Prescribed Medications (comma-separated)
                </label>
                <input
                  type="text"
                  value={medsInput}
                  onChange={(e) => setMedsInput(e.target.value)}
                  placeholder="e.g. Aspirin 75mg, Ibuprofen 400mg, Omeprazole 20mg"
                  className="mt-1 w-full p-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Known Patient Allergies
                </label>
                <input
                  type="text"
                  value={allergyInput}
                  onChange={(e) => setAllergyInput(e.target.value)}
                  placeholder="e.g. Penicillin, Sulfa drugs"
                  className="mt-1 w-full p-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !medsInput.trim()}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition disabled:opacity-50 cursor-pointer"
            >
              <FiShield size={14} className={loading ? "animate-spin" : ""} />
              <span>{loading ? "Checking Pharmacology..." : "Run AI Drug Safety Check"}</span>
            </button>
          </form>

          {safetyResult && (
            <div
              className={`p-4 rounded-2xl border space-y-2 text-xs ${
                safetyResult.status === "Safe"
                  ? "bg-emerald-50/70 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/80 text-emerald-900 dark:text-emerald-200"
                  : "bg-amber-50/70 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800/80 text-amber-900 dark:text-amber-200"
              }`}
            >
              <div className="flex items-center justify-between font-bold">
                <span className="flex items-center gap-1.5">
                  {safetyResult.status === "Safe" ? (
                    <FiCheckCircle className="text-emerald-600" />
                  ) : (
                    <FiAlertTriangle className="text-amber-600" />
                  )}
                  <span>Safety Status: {safetyResult.status} (Score: {safetyResult.safetyScore}/100)</span>
                </span>
              </div>
              <p className="text-[11px] leading-relaxed">{safetyResult.clinicalNotes}</p>

              {safetyResult.alerts?.length > 0 && (
                <div className="space-y-1.5 pt-2 border-t border-amber-200/80 dark:border-amber-800/80">
                  {safetyResult.alerts.map((alert, i) => (
                    <div key={i} className="p-2 rounded-xl bg-white/70 dark:bg-slate-900/70 text-[11px]">
                      <span className="font-bold text-rose-600 uppercase tracking-wider">{alert.severity}: </span>
                      <span>{alert.description}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Trilingual Discharge Summary */}
      {tab === "discharge" && (
        <div className="space-y-4 pt-2">
          <form onSubmit={handleGenerateDischarge} className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Physician Instructions &amp; Advice
                </label>
                <input
                  type="text"
                  value={dischargeNotes}
                  onChange={(e) => setDischargeNotes(e.target.value)}
                  placeholder="e.g. Bed rest for 3 days, drink plenty of fluids, avoid heavy exertion, follow up in 1 week."
                  className="mt-1 w-full p-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Output Language
                </label>
                <select
                  value={dischargeLang}
                  onChange={(e) => setDischargeLang(e.target.value)}
                  className="mt-1 w-full p-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="trilingual">Trilingual (Sindhi سنڌي + Urdu + Eng)</option>
                  <option value="sindhi">Sindhi سنڌي (Arabic &amp; Roman)</option>
                  <option value="urdu">Roman Urdu</option>
                  <option value="english">English Only</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition disabled:opacity-50 cursor-pointer"
            >
              <FiGlobe size={14} className={loading ? "animate-spin" : ""} />
              <span>{loading ? "Generating Slip..." : "Generate Trilingual Discharge Instructions"}</span>
            </button>
          </form>

          {dischargeResult && (
            <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 space-y-3 text-xs">
              <div className="flex items-center justify-between font-bold text-emerald-800 dark:text-emerald-200">
                <span className="flex items-center gap-1.5">
                  <FiCheckCircle className="text-emerald-600" />
                  <span>Trilingual Clinical Advice Formulated</span>
                </span>
                <button
                  onClick={() => handleCopy(JSON.stringify(dischargeResult, null, 2))}
                  className="text-[11px] text-slate-500 hover:text-emerald-600 flex items-center gap-1 cursor-pointer"
                >
                  {copied ? <FiCheck size={12} className="text-emerald-500" /> : <FiCopy size={12} />}
                  <span>{copied ? "Copied" : "Copy Slip"}</span>
                </button>
              </div>

              {/* Multilingual Pills */}
              <div className="space-y-2 text-[11px]">
                {dischargeResult.sindhiInstructions && (
                  <div className="p-2.5 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-emerald-200/60 dark:border-emerald-800/60">
                    <p className="font-bold text-emerald-700 dark:text-emerald-300">Sindhi سنڌي هدايتون:</p>
                    <p className="font-serif text-right text-sm leading-relaxed mt-1" dir="rtl">
                      {dischargeResult.sindhiInstructions}
                    </p>
                  </div>
                )}
                {dischargeResult.romanUrduInstructions && (
                  <div className="p-2.5 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-emerald-200/60 dark:border-emerald-800/60">
                    <p className="font-bold text-blue-700 dark:text-blue-300">Roman Urdu Hidayat:</p>
                    <p className="mt-1 leading-relaxed">{dischargeResult.romanUrduInstructions}</p>
                  </div>
                )}
                {dischargeResult.englishSummary && (
                  <div className="p-2.5 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-emerald-200/60 dark:border-emerald-800/60">
                    <p className="font-bold text-slate-800 dark:text-slate-200">English Summary:</p>
                    <p className="mt-1 leading-relaxed">{dischargeResult.englishSummary}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
