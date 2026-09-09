import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  FiCalendar,
  FiUsers,
  FiShoppingBag,
  FiPackage,
  FiPrinter,
  FiActivity,
  FiBookOpen,
} from "react-icons/fi";
import RupeeIcon from "../../components/common/RupeeIcon";
import { useAuth } from "../../hooks/useAuth";
import { useReports } from "../../hooks/useReports";
import { useClinicSettings } from "../../hooks/useClinicSettings";
import { printReport } from "../../utils/exportUtils";
import ReportDateFilter from "../../components/reports/ReportDateFilter";
import RevenueReportView from "../../components/reports/RevenueReportView";
import AppointmentReportView from "../../components/reports/AppointmentReportView";
import PatientReportView from "../../components/reports/PatientReportView";
import PharmacyReportView from "../../components/reports/PharmacyReportView";
import InventoryReportView from "../../components/reports/InventoryReportView";
import useSEO from "../../hooks/useSEO";

const formatYMD = (d) => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const Reports = () => {
  const { user } = useAuth();
  const { settings } = useClinicSettings();
  const role = user?.role;

  useSEO({
    title: "Clinical & Financial Analytics Reports",
    description:
      "Detailed analytics on clinic revenue, doctor consultations, patient demographics, and pharmacy inventory valuation.",
  });

  // Available tabs based on user role
  const availableTabs = useMemo(() => {
    const tabs = [];
    if (["Admin", "Receptionist"].includes(role)) {
      tabs.push({
        id: "revenue",
        label: "Revenue & Billing",
        icon: RupeeIcon,
      });
    }
    if (["Admin", "Doctor", "Receptionist"].includes(role)) {
      tabs.push({
        id: "appointments",
        label: "Appointments",
        icon: FiCalendar,
      });
      tabs.push({
        id: "patients",
        label: "Patient Demographics",
        icon: FiUsers,
      });
    }
    if (["Admin", "Pharmacist"].includes(role)) {
      tabs.push({
        id: "pharmacy",
        label: "Pharmacy Sales",
        icon: FiShoppingBag,
      });
      tabs.push({
        id: "inventory",
        label: "Inventory & Stock",
        icon: FiPackage,
      });
    }
    return tabs;
  }, [role]);

  const [activeTab, setActiveTab] = useState(availableTabs[0]?.id || "revenue");

  // Keep activeTab valid if availableTabs changes
  useEffect(() => {
    if (!availableTabs.some((t) => t.id === activeTab)) {
      setActiveTab(availableTabs[0]?.id || "revenue");
    }
  }, [availableTabs, activeTab]);

  // Global Date Range State (defaults to Current Month)
  const [dateRange, setDateRange] = useState(() => {
    const now = new Date();
    const from = new Date(now.getFullYear(), now.getMonth(), 1);
    return {
      dateFrom: formatYMD(from),
      dateTo: formatYMD(now),
    };
  });

  const { data, loading, error, refetch } = useReports(activeTab, dateRange);

  const activeTabMeta = availableTabs.find((t) => t.id === activeTab);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 p-4 sm:p-6 lg:p-8 transition-colors duration-200 space-y-6 pb-12">
      {/* Printable Clinic Letterhead */}
      <div className="hidden print:block border-b-2 border-gray-800 pb-4 mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {settings?.clinicName || "Smart Clinic"}
            </h1>
            <p className="text-xs text-gray-600 mt-1">
              {settings?.address || "Main Healthcare Avenue"}
            </p>
            <p className="text-xs text-gray-600">
              Phone: {settings?.phone || "042-35555555"} | Email:{" "}
              {settings?.email || "info@smartclinic.com"}
            </p>
          </div>
          <div className="text-right">
            <span className="text-lg font-bold text-blue-700 uppercase tracking-wide">
              {activeTabMeta?.label || "Report"}
            </span>
            <p className="text-xs text-gray-500 mt-1">
              Period: {dateRange.dateFrom} to {dateRange.dateTo}
            </p>
            <p className="text-[10px] text-gray-400 mt-0.5">
              Generated: {new Date().toLocaleString()} by {user?.name} ({role})
            </p>
          </div>
        </div>
      </div>

      {/* Screen Header & Actions */}
      <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-6 sm:p-7 shadow-xs backdrop-blur-md print:hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 font-black text-white shadow-md shadow-purple-500/20">
              <FiActivity size={28} />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                  Executive Clinical & Financial Analytics
                </h1>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-purple-200 dark:border-purple-800/60 bg-purple-50 dark:bg-purple-950/60 px-3 py-0.5 text-xs font-bold text-purple-700 dark:text-purple-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-purple-500 animate-pulse" />
                  Analytics Engine Active
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                Operational summaries, financial statements, clinical trends, and exportable statements.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 self-start sm:self-center">
            <Link
              to="/docs"
              className="flex items-center gap-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 px-3.5 py-2.5 text-xs font-semibold border border-slate-300 dark:border-slate-700 transition-all shadow-xs"
            >
              <FiBookOpen size={15} className="text-blue-500" />
              <span>FYP &amp; RBAC Docs</span>
            </Link>

            <button
              onClick={printReport}
              className="flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 text-sm font-semibold shadow-sm shadow-blue-500/25 transition-all hover:shadow-md hover:scale-[1.02]"
            >
              <FiPrinter size={16} /> Print / Save as PDF
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs Bar */}
      <div className="flex flex-wrap items-center gap-1.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 p-1.5 backdrop-blur-md w-fit print:hidden">
        {availableTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                isActive
                  ? "bg-blue-600 text-white shadow-sm shadow-blue-500/30"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-slate-800/60"
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Global Date Filter Component */}
      <ReportDateFilter
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
        onRefresh={refetch}
        loading={loading}
      />

      {/* Dynamic Report Content State */}
      {loading ? (
        <div className="bg-white rounded-xl border border-gray-100 p-12 text-center shadow-xs">
          <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs text-gray-500 font-medium">
            Aggregating {activeTabMeta?.label} data...
          </p>
        </div>
      ) : error ? (
        <div className="bg-rose-50 rounded-xl border border-rose-200 p-6 text-center text-rose-700 text-xs">
          <p className="font-bold">Error loading report</p>
          <p className="mt-1">{error}</p>
        </div>
      ) : (
        <div>
          {activeTab === "revenue" && <RevenueReportView data={data} />}
          {activeTab === "appointments" && (
            <AppointmentReportView data={data} />
          )}
          {activeTab === "patients" && <PatientReportView data={data} />}
          {activeTab === "pharmacy" && <PharmacyReportView data={data} />}
          {activeTab === "inventory" && <InventoryReportView data={data} />}
        </div>
      )}
    </div>
  );
};

export default Reports;
