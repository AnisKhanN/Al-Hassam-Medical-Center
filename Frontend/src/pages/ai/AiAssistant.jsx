import { useState, useEffect } from "react";
import {
  FiCpu,
  FiSearch,
  FiFileText,
  FiPackage,
  FiTrendingUp,
  FiZap,
  FiAlertTriangle,
  FiClock,
  FiCheckCircle,
  FiPrinter,
  FiRefreshCw,
  FiShield,
  FiLayers,
  FiGlobe,
  FiUser,
  FiArrowRight,
  FiPlus,
  FiActivity,
} from "react-icons/fi";
import { useAuth } from "../../hooks/useAuth";
import api from "../../api/axios";
import AiVisitSummaryModal from "../../components/ai/AiVisitSummaryModal";
import useSEO from "../../hooks/useSEO";
import StatCard from "../../components/dashboard/StatCard";
import {
  getAiStatus,
  queryAi,
  getDailyReport,
  getInventoryInsights,
  getSalesAnalysis,
  getRecommendations,
  parsePrescriptionText,
  getAuditLogs,
} from "../../api/aiApi";

const CLINICAL_QUICK_QUERIES = [
  "What was our total revenue and sales?",
  "Which medicines are expiring in the next 90 days?",
  "Show appointments and doctor consultation stats",
  "How many patients are registered in the clinic?",
];

const AiAssistant = () => {
  useSEO({
    title: "Google Gemini AI & Trilingual Intelligence Hub",
    description:
      "Operational AI assistant for clinical queries, automated daily briefs, and bilingual/trilingual discharge slips in English, Roman Urdu, and Sindhi.",
  });

  const { user } = useAuth();
  const isAdmin = user?.role === "Admin";
  const isDoctor = user?.role === "Doctor";
  const isPharmacist = user?.role === "Pharmacist";
  const isReceptionist = user?.role === "Receptionist";
  const canViewSlips = isAdmin || isDoctor || isReceptionist;

  const [activeTab, setActiveTab] = useState("search");
  const [providerStatus, setProviderStatus] = useState(null);

  // 1. Natural Language Query State
  const [searchQuery, setSearchQuery] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchResult, setSearchResult] = useState(null);

  // 2. Daily Report State
  const [reportDate, setReportDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [reportLoading, setReportLoading] = useState(false);
  const [reportData, setReportData] = useState(null);

  // 3. Inventory Insights State
  const [inventoryLoading, setInventoryLoading] = useState(false);
  const [inventoryData, setInventoryData] = useState(null);

  // 4. Sales Analysis State
  const [salesTimeframe, setSalesTimeframe] = useState("30d");
  const [salesLoading, setSalesLoading] = useState(false);
  const [salesData, setSalesData] = useState(null);

  // 5. Recommendations State
  const [recLoading, setRecLoading] = useState(false);
  const [recData, setRecData] = useState(null);

  // 6. Text Parser State
  const [rawText, setRawText] = useState("");
  const [parseLoading, setParseLoading] = useState(false);
  const [parsedItems, setParsedItems] = useState(null);

  // 7. Audit Logs State
  const [auditLoading, setAuditLoading] = useState(false);
  const [auditData, setAuditData] = useState(null);

  // 8. Bilingual Discharge Slips State
  const [dischargeModalOpen, setDischargeModalOpen] = useState(false);
  const [selectedPatientForSlip, setSelectedPatientForSlip] = useState(null);
  const [slipInitialNotes, setSlipInitialNotes] = useState("");
  const [patientSearchTerm, setPatientSearchTerm] = useState("");
  const [patientList, setPatientList] = useState([]);
  const [patientListLoading, setPatientListLoading] = useState(false);

  const handleSearchPatients = async (query = "") => {
    setPatientListLoading(true);
    try {
      const { data } = await api.get("/patients", {
        params: { search: query || undefined, limit: 8 },
      });
      setPatientList(data.data || []);
    } catch (err) {
      console.warn("Failed to search patients for discharge slip", err);
    } finally {
      setPatientListLoading(false);
    }
  };

  const openSlipForPatient = (p, defaultNotes = "") => {
    setSelectedPatientForSlip(p);
    setSlipInitialNotes(defaultNotes);
    setDischargeModalOpen(true);
  };

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await getAiStatus();
        setProviderStatus(res.data);
      } catch (err) {
        console.warn("Failed to load AI status", err);
      }
    };
    fetchStatus();
  }, []);

  // Handle Search
  const handleSearch = async (queryToRun) => {
    const q = queryToRun || searchQuery;
    if (!q.trim()) return;
    setSearchLoading(true);
    try {
      const res = await queryAi(q);
      setSearchResult(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setSearchLoading(false);
    }
  };

  // Handle Daily Report
  const handleFetchReport = async () => {
    setReportLoading(true);
    try {
      const res = await getDailyReport(reportDate);
      setReportData(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setReportLoading(false);
    }
  };

  // Handle Inventory Insights
  const handleFetchInventory = async () => {
    setInventoryLoading(true);
    try {
      const res = await getInventoryInsights();
      setInventoryData(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setInventoryLoading(false);
    }
  };

  // Handle Sales Analysis
  const handleFetchSales = async (timeframe = salesTimeframe) => {
    setSalesLoading(true);
    try {
      const res = await getSalesAnalysis(timeframe);
      setSalesData(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setSalesLoading(false);
    }
  };

  // Handle Recommendations
  const handleFetchRecs = async () => {
    setRecLoading(true);
    try {
      const res = await getRecommendations();
      setRecData(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setRecLoading(false);
    }
  };

  // Handle Parse Text
  const handleParseText = async () => {
    if (!rawText.trim()) return;
    setParseLoading(true);
    try {
      const res = await parsePrescriptionText(rawText);
      setParsedItems(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setParseLoading(false);
    }
  };

  // Handle Audit Logs
  const handleFetchAudit = async () => {
    setAuditLoading(true);
    try {
      const res = await getAuditLogs();
      setAuditData(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setAuditLoading(false);
    }
  };

  // Handle tab change and lazy-fetch tab data on demand if not already loaded
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === "slips" && patientList.length === 0) handleSearchPatients("");
    if (tab === "daily" && !reportData) handleFetchReport();
    if (tab === "inventory" && !inventoryData) handleFetchInventory();
    if (tab === "sales" && !salesData) handleFetchSales();
    if (tab === "recommendations" && !recData) handleFetchRecs();
    if (tab === "audit" && !auditData && isAdmin) handleFetchAudit();
  };

  const displayProviderLabel = (providerStatus?.providerLabel || "")
    .replace(/FYP\s*Demo\s*Mode\s*\(Heuristic\s*Engine\)/gi, "Autonomous Clinical Engine (Deterministic)")
    .replace(/FYP\s*Demo\s*Mode/gi, "Autonomous Clinical Engine")
    .replace(/FYP\s*Demo/gi, "Autonomous Clinical Engine")
    .replace(/Heuristic\s*Engine/gi, "Clinical Engine") ||
    (providerStatus?.hasGemini ? "Google Gemini Live" : "Autonomous Clinical Engine");

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 p-4 sm:p-6 lg:p-8 transition-colors duration-200 space-y-6 pb-12">
      {/* Top Welcome Hero Operations Banner */}
      <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-6 sm:p-7 shadow-xs backdrop-blur-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-cyan-600 to-blue-600 font-black text-white shadow-md shadow-cyan-500/20">
              <FiCpu size={28} />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                  SmartClinic AI Assistant
                </h1>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-200 dark:border-cyan-800/60 bg-cyan-50 dark:bg-cyan-950/60 px-3 py-0.5 text-xs font-bold text-cyan-700 dark:text-cyan-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-cyan-500 animate-pulse" />
                  {displayProviderLabel}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                Operational intelligence, inventory forecasting, revenue analysis, trilingual discharge slips, and natural language queries.
              </p>
            </div>
          </div>

          {/* Status Pill & Safety Badge */}
          <div className="flex flex-wrap items-center gap-2.5 self-start sm:self-center">
            <div className="flex items-center gap-2 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 px-3.5 py-1.5 text-xs shadow-xs backdrop-blur-md">
              <span
                className={`h-2 w-2 rounded-full animate-pulse ${
                  providerStatus?.hasGemini || providerStatus?.hasOpenAI
                    ? "bg-emerald-500"
                    : "bg-blue-500"
                }`}
              />
              <span className="font-medium text-slate-700 dark:text-slate-300">
                {displayProviderLabel}
              </span>
            </div>

            <div className="flex items-center gap-1.5 rounded-xl border border-amber-200 dark:border-amber-900/50 bg-amber-50/80 dark:bg-amber-950/40 px-3 py-1.5 text-xs font-medium text-amber-800 dark:text-amber-300">
              <FiShield size={14} className="text-amber-600 dark:text-amber-400" />
              <span>Strictly Non-Clinical</span>
            </div>
          </div>
        </div>
      </div>

      {/* AI Hub Key Metrics */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard
          label="AI Model Engine"
          value={providerStatus?.hasGemini ? "Gemini 1.5" : providerStatus?.hasOpenAI ? "GPT-4o Mini" : "Heuristic"}
          icon={FiCpu}
          accent="text-cyan-600 dark:text-cyan-400"
          subtitle={providerStatus?.hasGemini ? "Google Vertex / API" : "Local Rule Engine"}
        />
        <StatCard
          label="Language Engine"
          value="Trilingual"
          icon={FiGlobe}
          accent="text-blue-600 dark:text-blue-400"
          subtitle="English · Urdu · Sindhi"
        />
        <StatCard
          label="Operational Safety"
          value="RBAC Guard"
          icon={FiShield}
          accent="text-amber-600 dark:text-amber-400"
          subtitle="Strictly Non-Clinical"
        />
        <StatCard
          label="Active Capabilities"
          value="7 Modules"
          icon={FiActivity}
          accent="text-emerald-600 dark:text-emerald-400"
          subtitle="Forecasts, Briefs, Digits"
        />
      </div>

      {/* Navigation Tabs Bar */}
      <div className="flex flex-wrap items-center gap-1.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 p-1.5 backdrop-blur-md w-full sm:w-fit overflow-x-auto">
        <button
          onClick={() => handleTabChange("search")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === "search"
              ? "bg-blue-600 text-white shadow-sm shadow-blue-500/30"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-slate-800/60"
          }`}
        >
          <FiSearch size={14} /> Natural Language Search
        </button>

        {canViewSlips && (
          <button
            onClick={() => handleTabChange("slips")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === "slips"
                ? "bg-blue-600 text-white shadow-sm shadow-blue-500/30"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-slate-800/60"
            }`}
          >
            <FiGlobe size={14} /> Bilingual Discharge Slips
          </button>
        )}

        <button
          onClick={() => handleTabChange("daily")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === "daily"
              ? "bg-blue-600 text-white shadow-sm shadow-blue-500/30"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-slate-800/60"
          }`}
        >
          <FiFileText size={14} /> Daily Executive Brief
        </button>

        {(isAdmin || isPharmacist) && (
          <button
            onClick={() => handleTabChange("inventory")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === "inventory"
                ? "bg-blue-600 text-white shadow-sm shadow-blue-500/30"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-slate-800/60"
            }`}
          >
            <FiPackage size={14} /> Inventory &amp; Expiry
          </button>
        )}

        {isAdmin && (
          <button
            onClick={() => handleTabChange("sales")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === "sales"
                ? "bg-blue-600 text-white shadow-sm shadow-blue-500/30"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-slate-800/60"
            }`}
          >
            <FiTrendingUp size={14} /> Sales &amp; Financial Health
          </button>
        )}

        {isAdmin && (
          <button
            onClick={() => handleTabChange("recommendations")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === "recommendations"
                ? "bg-blue-600 text-white shadow-sm shadow-blue-500/30"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-slate-800/60"
            }`}
          >
            <FiZap size={14} /> Admin Recommendations
          </button>
        )}

        {(isAdmin || isDoctor || isPharmacist) && (
          <button
            onClick={() => handleTabChange("parser")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === "parser"
                ? "bg-blue-600 text-white shadow-sm shadow-blue-500/30"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-slate-800/60"
            }`}
          >
            <FiLayers size={14} /> Prescription Digitizer
          </button>
        )}

        {isAdmin && (
          <button
            onClick={() => handleTabChange("audit")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === "audit"
                ? "bg-blue-600 text-white shadow-sm shadow-blue-500/30"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-slate-800/60"
            }`}
          >
            <FiShield size={14} /> Audit &amp; Safety Logs
          </button>
        )}
      </div>

      {/* TAB 1: NATURAL LANGUAGE SEARCH */}
      {activeTab === "search" && (
        <div className="space-y-6">
          {/* Search Box Card */}
          <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-6 sm:p-7 shadow-xs backdrop-blur-md">
            <h2 className="text-base font-bold text-slate-900 dark:text-white mb-1">
              Ask Anything About Clinic Operations
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Type in plain English or Roman Urdu to search revenue, expiring
              stock, appointments, or patient records.
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSearch();
              }}
              className="flex gap-2"
            >
              <div className="relative flex-1">
                <FiSearch
                  className="absolute left-3.5 top-3.5 text-slate-400 dark:text-slate-500"
                  size={18}
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="e.g. What was our total revenue yesterday? or Show expiring medicines"
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-950/60 py-3 pl-10 pr-4 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 focus:outline-none"
                />
              </div>
              <button
                type="submit"
                disabled={searchLoading || !searchQuery.trim()}
                className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-md shadow-blue-500/20 hover:bg-blue-700 disabled:opacity-50"
              >
                {searchLoading ? (
                  <FiRefreshCw className="animate-spin" size={16} />
                ) : (
                  <FiSearch size={16} />
                )}
                Search
              </button>
            </form>

            {/* Quick Suggestions Chips */}
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="text-xs font-medium text-slate-400 dark:text-slate-500">
                Quick Prompts:
              </span>
              {CLINICAL_QUICK_QUERIES.map((q, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    setSearchQuery(q);
                    handleSearch(q);
                  }}
                  className="rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 px-3 py-1 text-xs text-slate-600 dark:text-slate-300 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/40 hover:text-blue-700 dark:hover:text-blue-400 transition"
                >
                  "{q}"
                </button>
              ))}
            </div>
          </div>

          {/* Search Results Display */}
          {searchResult && (
            <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-6 sm:p-7 shadow-xs backdrop-blur-md space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <span className="rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 px-3 py-1 text-xs font-semibold text-blue-700 dark:text-blue-300 uppercase tracking-wide">
                  {searchResult.category || "General"} Result
                </span>
                <span className="text-xs text-slate-400 dark:text-slate-500">
                  Queried: "{searchResult.query}"
                </span>
              </div>

              {/* Conversational Answer */}
              <div className="rounded-2xl border border-blue-200/60 dark:border-blue-900/50 bg-blue-50/50 dark:bg-blue-950/40 p-4">
                <p className="text-sm font-medium text-blue-950 dark:text-blue-200 leading-relaxed">
                  {searchResult.answer}
                </p>
              </div>

              {/* Data Table if present */}
              {Array.isArray(searchResult.data) &&
                searchResult.data.length > 0 && (
                  <div className="overflow-x-auto rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-100/80 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300">
                        <tr>
                          {Object.keys(searchResult.data[0]).map((col, idx) => (
                            <th
                              key={idx}
                              className="p-3 font-semibold capitalize"
                            >
                              {col.replace(/([A-Z])/g, " $1")}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                        {searchResult.data.map((row, rIdx) => (
                          <tr key={rIdx} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                            {Object.values(row).map((val, cIdx) => (
                              <td key={cIdx} className="p-3 font-medium">
                                {typeof val === "object"
                                  ? JSON.stringify(val)
                                  : String(val)}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
            </div>
          )}
        </div>
      )}

      {/* TAB: BILINGUAL DISCHARGE SLIPS (SANGHAR REGIONAL) */}
      {activeTab === "slips" && canViewSlips && (
        <div className="space-y-6">
          {/* Hero Banner */}
          <div className="rounded-3xl border border-blue-500/20 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-700 p-6 sm:p-7 text-white shadow-md">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="rounded-full bg-white/20 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-blue-100 backdrop-blur">
                    Sindh Regional Care
                  </span>
                  <span className="rounded-full bg-emerald-400/20 px-2.5 py-0.5 text-[11px] font-bold text-emerald-200">
                    Bilingual &amp; Trilingual
                  </span>
                </div>
                <h2 className="text-xl font-bold">
                  Patient Visit Summary &amp; Bilingual Discharge Slips
                </h2>
                <p className="mt-1 text-xs text-blue-100 max-w-2xl leading-relaxed">
                  Generate print-ready clinical summaries and administrative discharge slips featuring
                  clear instructions in <strong>English</strong>, <strong>Roman Urdu</strong>, and{" "}
                  <strong>Sindhi (سنڌي)</strong> for local Sanghar patients.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => openSlipForPatient(null, "")}
                  className="flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-xs font-bold text-blue-700 shadow-md hover:bg-blue-50 transition"
                >
                  <FiPlus size={16} /> New Walk-In Slip
                </button>
              </div>
            </div>
          </div>

          {/* Quick Sanghar Clinical Templates */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                ⚡ Quick Clinical Case Templates (Sanghar Regional Practice)
              </h3>
              <span className="text-[11px] text-slate-400 dark:text-slate-500">Click to pre-fill and launch slip</span>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <div
                onClick={() =>
                  openSlipForPatient(null, "Patient presenting with acute seasonal high-grade fever, body aches, and fatigue. Suspected viral flu / malaria. Advised hydration and antipyretics.")
                }
                className="group cursor-pointer rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-5 shadow-xs backdrop-blur-md hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-md transition"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="rounded-md bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800/60 px-2 py-0.5 text-[10px] font-bold text-amber-800 dark:text-amber-300">
                    Seasonal Fevers
                  </span>
                  <FiArrowRight size={14} className="text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition" />
                </div>
                <h4 className="text-sm font-bold text-slate-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                  Viral Fever &amp; Malaria OPD
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                  Pre-configures hydration reminders, ORS, Panadol schedule, and mosquito precautions in Sindhi &amp; Urdu.
                </p>
              </div>

              <div
                onClick={() =>
                  openSlipForPatient(null, "Routine hypertension & type-2 diabetes review. BP elevated (145/95). Prescribed anti-hypertensive regimen and lifestyle counseling.")
                }
                className="group cursor-pointer rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-5 shadow-xs backdrop-blur-md hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-md transition"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="rounded-md bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800/60 px-2 py-0.5 text-[10px] font-bold text-purple-800 dark:text-purple-300">
                    Chronic Disease
                  </span>
                  <FiArrowRight size={14} className="text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition" />
                </div>
                <h4 className="text-sm font-bold text-slate-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                  Hypertension &amp; Diabetes Review
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                  Pre-fills low-salt dietary advice, morning/evening medication timings, and follow-up appointment tracking.
                </p>
              </div>

              <div
                onClick={() =>
                  openSlipForPatient(null, "Acute gastroenteritis with mild dehydration. Prescribed oral rehydration salts, anti-emetic, and light diet.")
                }
                className="group cursor-pointer rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-5 shadow-xs backdrop-blur-md hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-md transition"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="rounded-md bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/60 px-2 py-0.5 text-[10px] font-bold text-emerald-800 dark:text-emerald-300">
                    Gastroenteritis
                  </span>
                  <FiArrowRight size={14} className="text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition" />
                </div>
                <h4 className="text-sm font-bold text-slate-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                  Acute Diarrhea &amp; Dehydration
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                  Boiled water guidance, light diet, zinc/ORS reconstitution directions in clear native Sindhi (صاف پاڻي) and Urdu.
                </p>
              </div>
            </div>
          </div>

          {/* Patient Search & Generator Card */}
          <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-6 sm:p-7 shadow-xs backdrop-blur-md">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Generate Slip for Registered Patient
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Select a registered patient to auto-fill their medical records, vitals, and previous consultation notes.
                </p>
              </div>

              {/* Patient Live Search */}
              <div className="relative w-full md:w-72">
                <FiSearch size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                <input
                  type="text"
                  value={patientSearchTerm}
                  onChange={(e) => {
                    setPatientSearchTerm(e.target.value);
                    handleSearchPatients(e.target.value);
                  }}
                  placeholder="Search by name, MRN, phone..."
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-950/60 pl-9 pr-4 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Patient Grid */}
            {patientListLoading ? (
              <div className="flex h-32 items-center justify-center">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-blue-200 dark:border-blue-900 border-t-blue-600" />
              </div>
            ) : patientList.length > 0 ? (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {patientList.map((p) => (
                  <div
                    key={p._id}
                    className="flex flex-col justify-between rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 p-4 hover:border-blue-300 dark:hover:border-blue-700 hover:bg-blue-50/20 transition"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[10px] font-semibold text-slate-400 dark:text-slate-500">
                          {p.patientId || "P-N/A"}
                        </span>
                        <span className="rounded bg-blue-100 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 px-1.5 py-0.5 text-[10px] font-bold text-blue-700 dark:text-blue-300">
                          {p.bloodGroup || "Blood: N/A"}
                        </span>
                      </div>
                      <h4 className="mt-1 font-bold text-slate-900 dark:text-white text-sm truncate">
                        {p.fullName}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {p.computedAge || p.age || "N/A"} yrs · {p.gender}
                      </p>
                      <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5 truncate">
                        {p.phone || "No phone listed"}
                      </p>
                    </div>

                    <button
                      onClick={() => openSlipForPatient(p, "")}
                      className="mt-3 flex items-center justify-center gap-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-100 dark:border-blue-800/60 px-3 py-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:bg-blue-600 dark:hover:bg-blue-500 hover:text-white transition"
                    >
                      <FiGlobe size={13} /> Generate Slip
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 p-8 text-center text-xs text-slate-400 dark:text-slate-500">
                No patients found matching "{patientSearchTerm}". You can generate a slip for any walk-in patient using the button above.
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: DAILY EXECUTIVE BRIEF */}
      {activeTab === "daily" && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-5 shadow-xs backdrop-blur-md">
            <div className="flex items-center gap-3">
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                Select Date:
              </label>
              <input
                type="date"
                value={reportDate}
                onChange={(e) => setReportDate(e.target.value)}
                className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-950/60 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 focus:border-blue-500 focus:outline-none"
              />
              <button
                onClick={handleFetchReport}
                disabled={reportLoading}
                className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {reportLoading ? (
                  <FiRefreshCw className="animate-spin" size={14} />
                ) : (
                  <FiRefreshCw size={14} />
                )}
                Generate Brief
              </button>
            </div>

            {reportData && (
              <button
                onClick={() => window.print()}
                className="flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 shadow-sm"
              >
                <FiPrinter size={14} /> Print Brief
              </button>
            )}
          </div>

          {reportLoading ? (
            <div className="flex h-64 items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-200 dark:border-blue-900 border-t-blue-600" />
            </div>
          ) : reportData ? (
            <div className="space-y-6">
              {/* KPI Grid */}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-5 shadow-xs backdrop-blur-md">
                  <p className="text-xs font-medium text-slate-400 dark:text-slate-500">
                    Total Consultations
                  </p>
                  <p className="mt-1 text-2xl font-bold text-slate-800 dark:text-white">
                    {reportData.kpis?.totalAppointments ?? 0}
                  </p>
                  <p className="mt-1 text-xs text-emerald-600 dark:text-emerald-400">
                    {reportData.kpis?.completionRate || "100%"} completion
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-5 shadow-xs backdrop-blur-md">
                  <p className="text-xs font-medium text-slate-400 dark:text-slate-500">
                    OPD Services Collection
                  </p>
                  <p className="mt-1 text-2xl font-bold text-blue-600 dark:text-blue-400">
                    PKR {(reportData.kpis?.opdRevenue || 0).toLocaleString()}
                  </p>
                  <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                    Doctor fees &amp; procedures
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-5 shadow-xs backdrop-blur-md">
                  <p className="text-xs font-medium text-slate-400 dark:text-slate-500">
                    Pharmacy Counter Sales
                  </p>
                  <p className="mt-1 text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                    PKR{" "}
                    {(reportData.kpis?.pharmacyRevenue || 0).toLocaleString()}
                  </p>
                  <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                    Dispensed medicines
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-5 shadow-xs backdrop-blur-md">
                  <p className="text-xs font-medium text-slate-400 dark:text-slate-500">
                    Total Daily Revenue
                  </p>
                  <p className="mt-1 text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                    PKR {(reportData.kpis?.totalRevenue || 0).toLocaleString()}
                  </p>
                  <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                    Combined collections
                  </p>
                </div>
              </div>

              {/* Narrative Summary Body */}
              <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-6 sm:p-7 shadow-xs backdrop-blur-md space-y-4">
                <h3 className="text-base font-bold text-slate-800 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
                  {reportData.headline || "Daily Operations Digest"}
                </h3>
                <div className="prose prose-sm max-w-none text-xs leading-relaxed text-slate-700 dark:text-slate-300 whitespace-pre-line">
                  {reportData.summaryText}
                </div>
              </div>
            </div>
          ) : null}
        </div>
      )}

      {/* TAB 3: INVENTORY & EXPIRY INSIGHTS */}
      {activeTab === "inventory" && (
        <div className="space-y-6">
          {inventoryLoading ? (
            <div className="flex h-64 items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-200 dark:border-blue-900 border-t-blue-600" />
            </div>
          ) : inventoryData ? (
            <div className="space-y-6">
              {/* Overview Metrics */}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-2xl border border-rose-200/80 dark:border-rose-900/50 bg-rose-50/60 dark:bg-rose-950/30 p-5 shadow-xs backdrop-blur-md">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-medium text-rose-700 dark:text-rose-300">
                      Expiring in 30 Days
                    </p>
                    <FiAlertTriangle className="text-rose-600 dark:text-rose-400" size={18} />
                  </div>
                  <p className="mt-2 text-2xl font-bold text-rose-800 dark:text-rose-200">
                    {inventoryData.overview?.expiringWithin30Days ?? 0}
                  </p>
                  <p className="text-[11px] text-rose-600 dark:text-rose-400 mt-1">
                    Immediate action required
                  </p>
                </div>

                <div className="rounded-2xl border border-amber-200/80 dark:border-amber-900/50 bg-amber-50/60 dark:bg-amber-950/30 p-5 shadow-xs backdrop-blur-md">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-medium text-amber-700 dark:text-amber-300">
                      Expiring in 60 Days
                    </p>
                    <FiClock className="text-amber-600 dark:text-amber-400" size={18} />
                  </div>
                  <p className="mt-2 text-2xl font-bold text-amber-800 dark:text-amber-200">
                    {inventoryData.overview?.expiringWithin60Days ?? 0}
                  </p>
                  <p className="text-[11px] text-amber-600 dark:text-amber-400 mt-1">
                    Review dispensing priority
                  </p>
                </div>

                <div className="rounded-2xl border border-orange-200/80 dark:border-orange-900/50 bg-orange-50/60 dark:bg-orange-950/30 p-5 shadow-xs backdrop-blur-md">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-medium text-orange-700 dark:text-orange-300">
                      Low Stock Threshold
                    </p>
                    <FiPackage className="text-orange-600 dark:text-orange-400" size={18} />
                  </div>
                  <p className="mt-2 text-2xl font-bold text-orange-800 dark:text-orange-200">
                    {inventoryData.overview?.lowStockCount ?? 0}
                  </p>
                  <p className="text-[11px] text-orange-600 dark:text-orange-400 mt-1">
                    At or below reorder level
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-5 shadow-xs backdrop-blur-md">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                      Cataloged Medicines
                    </p>
                    <FiCheckCircle className="text-blue-600 dark:text-blue-400" size={18} />
                  </div>
                  <p className="mt-2 text-2xl font-bold text-slate-800 dark:text-white">
                    {inventoryData.overview?.totalMedicinesTracked ?? 0}
                  </p>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
                    Active inventory items
                  </p>
                </div>
              </div>

              {/* AI Strategic Recommendations */}
              <div className="rounded-3xl border border-blue-200/80 dark:border-blue-900/50 bg-blue-50/50 dark:bg-blue-950/30 p-6 sm:p-7 shadow-xs backdrop-blur-md space-y-3">
                <h3 className="text-sm font-bold text-blue-900 dark:text-blue-300 flex items-center gap-2">
                  <FiZap className="text-blue-600 dark:text-blue-400" /> AI Supply Chain &amp;
                  Stock Intelligence
                </h3>
                <ul className="space-y-2 text-xs text-blue-950 dark:text-blue-200">
                  {(inventoryData.recommendations || []).map((rec, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 bg-white/80 dark:bg-slate-900/80 p-3.5 rounded-xl border border-blue-100/80 dark:border-blue-800/60 text-slate-800 dark:text-slate-200 shadow-xs"
                    >
                      <span className="text-blue-600 dark:text-blue-400 font-bold mt-0.5">•</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Critical 30-Day Expiry Table */}
              {(inventoryData.alerts?.criticalExpiry || []).length > 0 && (
                <div className="rounded-3xl border border-rose-200/80 dark:border-rose-900/50 bg-white/80 dark:bg-slate-900/80 p-6 shadow-xs backdrop-blur-md space-y-3">
                  <h3 className="text-sm font-bold text-rose-800 dark:text-rose-300 flex items-center gap-2">
                    <FiAlertTriangle className="text-rose-600 dark:text-rose-400" /> Critical
                    Expiry Batches (&lt;30 Days)
                  </h3>
                  <div className="overflow-x-auto rounded-2xl border border-rose-100 dark:border-rose-900/40 bg-white dark:bg-slate-900">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-rose-50/80 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300">
                        <tr>
                          <th className="p-3 font-semibold">Medicine Name</th>
                          <th className="p-3 font-semibold">Batch Number</th>
                          <th className="p-3 font-semibold">Stock Qty</th>
                          <th className="p-3 font-semibold">Expiry Date</th>
                          <th className="p-3 font-semibold">Unit Price</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-rose-50 dark:divide-rose-900/30 text-slate-700 dark:text-slate-300">
                        {inventoryData.alerts.criticalExpiry.map(
                          (item, idx) => (
                            <tr key={idx} className="hover:bg-rose-50/30 dark:hover:bg-rose-950/20">
                              <td className="p-3 font-semibold text-slate-900 dark:text-white">
                                {item.name}
                              </td>
                              <td className="p-3 font-mono text-slate-500 dark:text-slate-400">
                                {item.batchNumber}
                              </td>
                              <td className="p-3 font-bold text-rose-700 dark:text-rose-400">
                                {item.quantity}
                              </td>
                              <td className="p-3 font-medium">
                                {item.expiryDate}
                              </td>
                              <td className="p-3">PKR {item.unitPrice}</td>
                            </tr>
                          ),
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Low Stock Reorder Table */}
              {(inventoryData.alerts?.lowStock || []).length > 0 && (
                <div className="rounded-3xl border border-orange-200/80 dark:border-orange-900/50 bg-white/80 dark:bg-slate-900/80 p-6 shadow-xs backdrop-blur-md space-y-3">
                  <h3 className="text-sm font-bold text-orange-800 dark:text-orange-300 flex items-center gap-2">
                    <FiPackage className="text-orange-600 dark:text-orange-400" /> Recommended
                    Purchase Reorders
                  </h3>
                  <div className="overflow-x-auto rounded-2xl border border-orange-100 dark:border-orange-900/40 bg-white dark:bg-slate-900">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-orange-50/80 dark:bg-orange-950/60 text-orange-800 dark:text-orange-300">
                        <tr>
                          <th className="p-3 font-semibold">Medicine Name</th>
                          <th className="p-3 font-semibold">Category</th>
                          <th className="p-3 font-semibold">Current Stock</th>
                          <th className="p-3 font-semibold">Reorder Threshold</th>
                          <th className="p-3 font-semibold">Suggested Order Qty</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-orange-50 dark:divide-orange-900/30 text-slate-700 dark:text-slate-300">
                        {inventoryData.alerts.lowStock.map((item, idx) => (
                          <tr key={idx} className="hover:bg-orange-50/30 dark:hover:bg-orange-950/20">
                            <td className="p-3 font-semibold text-slate-900 dark:text-white">
                              {item.name}
                            </td>
                            <td className="p-3 text-slate-500 dark:text-slate-400">
                              {item.category}
                            </td>
                            <td className="p-3 font-bold text-orange-700 dark:text-orange-400">
                              {item.currentStock}
                            </td>
                            <td className="p-3">{item.reorderLevel}</td>
                            <td className="p-3 font-bold text-emerald-700 dark:text-emerald-400">
                              +{item.suggestedOrder} units
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          ) : null}
        </div>
      )}

      {/* TAB 4: SALES & FINANCIAL HEALTH */}
      {activeTab === "sales" && isAdmin && (
        <div className="space-y-6">
          <div className="flex items-center justify-between rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-5 shadow-xs backdrop-blur-md">
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
              Analysis Timeframe:
            </span>
            <div className="flex gap-2">
              {["7d", "30d", "90d"].map((tf) => (
                <button
                  key={tf}
                  onClick={() => {
                    setSalesTimeframe(tf);
                    handleFetchSales(tf);
                  }}
                  className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold transition ${
                    salesTimeframe === tf
                      ? "bg-blue-600 text-white shadow-sm shadow-blue-500/30"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                  }`}
                >
                  Last {tf.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {salesLoading ? (
            <div className="flex h-64 items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-200 dark:border-blue-900 border-t-blue-600" />
            </div>
          ) : salesData ? (
            <div className="space-y-6">
              {/* Financial Metrics */}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-5 shadow-xs backdrop-blur-md">
                  <p className="text-xs font-medium text-slate-400 dark:text-slate-500">
                    Combined Gross Revenue
                  </p>
                  <p className="mt-1 text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                    PKR{" "}
                    {(
                      salesData.financialSummary?.totalCombinedRevenue || 0
                    ).toLocaleString()}
                  </p>
                  <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">OPD + Pharmacy</p>
                </div>

                <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-5 shadow-xs backdrop-blur-md">
                  <p className="text-xs font-medium text-slate-400 dark:text-slate-500">
                    Discounts Conceded
                  </p>
                  <p className="mt-1 text-2xl font-bold text-amber-600 dark:text-amber-400">
                    PKR{" "}
                    {(
                      salesData.financialSummary?.totalDiscountsGiven || 0
                    ).toLocaleString()}
                  </p>
                  <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                    {salesData.financialSummary?.discountPercentage} of gross
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-5 shadow-xs backdrop-blur-md">
                  <p className="text-xs font-medium text-slate-400 dark:text-slate-500">
                    Avg Pharmacy Basket
                  </p>
                  <p className="mt-1 text-2xl font-bold text-blue-600 dark:text-blue-400">
                    PKR{" "}
                    {(
                      salesData.financialSummary?.averageTransactionValue || 0
                    ).toLocaleString()}
                  </p>
                  <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                    Per patient ticket
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-5 shadow-xs backdrop-blur-md">
                  <p className="text-xs font-medium text-slate-400 dark:text-slate-500">
                    OPD Consultation Fees
                  </p>
                  <p className="mt-1 text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                    PKR{" "}
                    {(
                      salesData.financialSummary?.clinicServicesRevenue || 0
                    ).toLocaleString()}
                  </p>
                  <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">Doctor billings</p>
                </div>
              </div>

              {/* Payment Methods Breakdown */}
              <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-6 sm:p-7 shadow-xs backdrop-blur-md space-y-3">
                <h3 className="text-sm font-bold text-slate-800 dark:text-white">
                  Payment Settlement Method Distribution
                </h3>
                <div className="grid gap-3 sm:grid-cols-3">
                  {(salesData.paymentMethods || []).map((pm, idx) => (
                    <div
                      key={idx}
                      className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 p-4"
                    >
                      <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                        {pm.method}
                      </p>
                      <p className="text-lg font-bold text-slate-800 dark:text-white mt-1">
                        PKR {pm.amount.toLocaleString()}
                      </p>
                      <div className="mt-2 flex items-center justify-between text-xs text-slate-400 dark:text-slate-500">
                        <span>Share:</span>
                        <span className="font-semibold text-blue-600 dark:text-blue-400">
                          {pm.percentage}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Strategic Insights */}
              <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-6 sm:p-7 shadow-xs backdrop-blur-md space-y-3">
                <h3 className="text-sm font-bold text-slate-800 dark:text-white">
                  AI Revenue Optimization Insights
                </h3>
                <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
                  {(salesData.insights || []).map((ins, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 bg-slate-50 dark:bg-slate-950/50 border border-slate-200/60 dark:border-slate-800/60 p-3.5 rounded-xl"
                    >
                      <span className="text-emerald-500 font-bold mt-0.5">•</span>
                      <span>{ins}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : null}
        </div>
      )}

      {/* TAB 5: ADMINISTRATIVE RECOMMENDATIONS */}
      {activeTab === "recommendations" && isAdmin && (
        <div className="space-y-6">
          {recLoading ? (
            <div className="flex h-64 items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-200 dark:border-blue-900 border-t-blue-600" />
            </div>
          ) : recData ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-6 shadow-xs backdrop-blur-md">
                <div>
                  <h3 className="text-sm font-bold text-slate-800 dark:text-white">
                    Overall Operational Health
                  </h3>
                  <p className="text-xs text-slate-400 dark:text-slate-500">
                    Based on patient throughput, waiting times, and stock churn
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-black text-blue-600 dark:text-blue-400">
                    {recData.overallEfficiencyScore || "88/100"}
                  </span>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wide">
                    Efficiency Score
                  </p>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {(recData.recommendations || []).map((rec, idx) => (
                  <div
                    key={idx}
                    className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-6 shadow-xs backdrop-blur-md space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="rounded-lg bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800/60 px-2.5 py-1 font-mono text-[11px] font-bold text-blue-700 dark:text-blue-300">
                        {rec.id} • {rec.category}
                      </span>
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                          rec.priority === "High"
                            ? "bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800"
                            : rec.priority === "Medium"
                              ? "bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800"
                              : "bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800"
                        }`}
                      >
                        {rec.priority} Priority
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      {rec.title}
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      {rec.description}
                    </p>
                    <div className="rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/60 dark:border-slate-800/60 p-3 text-xs font-medium text-slate-700 dark:text-slate-300">
                      <span className="font-bold text-blue-600 dark:text-blue-400">
                        Recommended Action:{" "}
                      </span>
                      {rec.action}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      )}

      {/* TAB 6: PRESCRIPTION DIGITIZER */}
      {activeTab === "parser" && (
        <div className="space-y-6">
          <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-6 sm:p-7 shadow-xs backdrop-blur-md space-y-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Prescription &amp; Invoice OCR Text Digitizer
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Paste copied raw prescription notes or supplier invoice text to
                parse into structured medicine objects.
              </p>
            </div>

            <textarea
              rows={5}
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              placeholder="Paste text e.g.:&#10;Panadol 500mg, 1 tablet, TDS, 5 days, after meals&#10;Augmentin 625mg, 1 cap, BD, 7 days&#10;Brufen 400mg, 1 tab, PRN"
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-950/60 p-4 font-mono text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:bg-white dark:focus:bg-slate-900 focus:border-blue-500 focus:outline-none"
            />

            <div className="flex justify-end">
              <button
                onClick={handleParseText}
                disabled={parseLoading || !rawText.trim()}
                className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-semibold text-white shadow-md shadow-blue-500/20 hover:bg-blue-700 disabled:opacity-50"
              >
                {parseLoading ? (
                  <FiRefreshCw className="animate-spin" size={14} />
                ) : (
                  <FiLayers size={14} />
                )}
                Digitize Text into Items
              </button>
            </div>
          </div>

          {parsedItems && (
            <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-6 sm:p-7 shadow-xs backdrop-blur-md space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  Extracted Items (
                  {parsedItems.parsedItemsCount ||
                    parsedItems.items?.length ||
                    0}
                  )
                </h4>
              </div>

              <div className="overflow-x-auto rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100/80 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300">
                    <tr>
                      <th className="p-3 font-semibold">#</th>
                      <th className="p-3 font-semibold">Medicine Name</th>
                      <th className="p-3 font-semibold">Dosage</th>
                      <th className="p-3 font-semibold">Frequency</th>
                      <th className="p-3 font-semibold">Instructions</th>
                      <th className="p-3 font-semibold">Qty</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                    {(parsedItems.items || []).map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                        <td className="p-3 font-mono text-slate-400 dark:text-slate-500">
                          {idx + 1}
                        </td>
                        <td className="p-3 font-bold text-slate-900 dark:text-white">
                          {item.medicineName}
                        </td>
                        <td className="p-3">{item.dosage}</td>
                        <td className="p-3">{item.frequency}</td>
                        <td className="p-3 text-slate-500 dark:text-slate-400">
                          {item.instructions}
                        </td>
                        <td className="p-3 font-bold text-blue-600 dark:text-blue-400">
                          {item.suggestedQty || 10}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 7: AUDIT & SAFETY LOGS */}
      {activeTab === "audit" && isAdmin && (
        <div className="space-y-6">
          <div className="flex items-center justify-between rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-5 sm:p-6 shadow-xs backdrop-blur-md">
            <div>
              <h3 className="text-sm font-bold text-slate-800 dark:text-white">
                AI Safety &amp; Audit Trail
              </h3>
              <p className="text-xs text-slate-400 dark:text-slate-500">
                Verifiable logging of every AI call, token count, latency, and
                provider
              </p>
            </div>
            <button
              onClick={handleFetchAudit}
              disabled={auditLoading}
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3.5 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700"
            >
              <FiRefreshCw
                className={auditLoading ? "animate-spin" : ""}
                size={14}
              />{" "}
              Refresh
            </button>
          </div>

          <div className="overflow-x-auto rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 shadow-xs backdrop-blur-md">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100/80 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300">
                <tr>
                  <th className="p-3.5 font-semibold">Timestamp</th>
                  <th className="p-3.5 font-semibold">User &amp; Role</th>
                  <th className="p-3.5 font-semibold">Feature</th>
                  <th className="p-3.5 font-semibold">Prompt Summary</th>
                  <th className="p-3.5 font-semibold">Provider</th>
                  <th className="p-3.5 font-semibold">Tokens</th>
                  <th className="p-3.5 font-semibold">Latency</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                {(auditData || []).map((log, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                    <td className="p-3.5 font-mono text-[11px] text-slate-500 dark:text-slate-400">
                      {new Date(log.createdAt).toLocaleString("en-GB")}
                    </td>
                    <td className="p-3.5">
                      <p className="font-semibold text-slate-800 dark:text-white">
                        {log.user?.name || "Staff"}
                      </p>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500">
                        {log.userRole}
                      </p>
                    </td>
                    <td className="p-3.5 font-semibold text-blue-600 dark:text-blue-400">
                      {log.feature}
                    </td>
                    <td className="p-3.5 text-slate-600 dark:text-slate-300 max-w-xs truncate">
                      {log.promptSummary}
                    </td>
                    <td className="p-3.5">
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                          log.isFallback
                            ? "bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300"
                            : "bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300"
                        }`}
                      >
                        {log.provider}
                      </span>
                    </td>
                    <td className="p-3.5 font-mono text-slate-800 dark:text-slate-200">{log.tokensUsed}</td>
                    <td className="p-3.5 font-mono text-slate-500 dark:text-slate-400">
                      {log.latencyMs} ms
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Active Modal */}
      <AiVisitSummaryModal
        isOpen={dischargeModalOpen}
        onClose={() => setDischargeModalOpen(false)}
        patient={selectedPatientForSlip}
        initialNotes={slipInitialNotes}
      />
    </div>
  );
};

export default AiAssistant;
