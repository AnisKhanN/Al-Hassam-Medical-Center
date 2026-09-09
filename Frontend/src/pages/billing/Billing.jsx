import { useState, useMemo } from "react";
import { FiPlus, FiSearch, FiCheckCircle, FiAlertCircle, FiTrendingUp } from "react-icons/fi";
import { useBills } from "../../hooks/useBills";
import BillTable from "../../components/billing/BillTable";
import CreateBillModal from "../../components/billing/CreateBillModal";
import RevenueDashboard from "../../components/billing/RevenueDashboard";
import Pagination from "../../components/common/Pagination";
import StatCard from "../../components/dashboard/StatCard";
import RupeeIcon from "../../components/common/RupeeIcon";
import useSEO from "../../hooks/useSEO";

const TABS = ["Bills", "Revenue"];
const STATUSES = ["", "Unpaid", "Partially Paid", "Paid", "Cancelled"];

const Billing = () => {
  useSEO({
    title: "Billing & Invoicing Desk",
    description: "Itemized billing, split payment handling (Cash/Card/EasyPaisa), and thermal receipt printing.",
  });

  const [tab, setTab] = useState("Bills");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  const filters = useMemo(
    () => ({ search: search || undefined, status: status || undefined }),
    [search, status],
  );
  const { bills, loading, error, page, setPage, pages, total, createBill } =
    useBills(filters);

  const totalAmountSum = bills.reduce((acc, b) => acc + (b.totalAmount || 0), 0);
  const paidAmountSum = bills.reduce((acc, b) => acc + (b.amountPaid || 0), 0);
  const balanceDueSum = bills.reduce((acc, b) => acc + (b.balanceDue || 0), 0);
  const unpaidCount = bills.filter((b) => b.status === "Unpaid" || b.status === "Partially Paid").length;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 p-4 sm:p-6 lg:p-8 transition-colors duration-200">
      {/* Top Welcome Hero Banner */}
      <div className="mb-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-6 sm:p-7 shadow-xs backdrop-blur-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-600 font-black text-white shadow-md shadow-emerald-500/20">
              <RupeeIcon size={28} />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                  Billing, Invoicing & Financial Desk
                </h1>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 dark:border-emerald-800/60 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-0.5 text-xs font-bold text-emerald-700 dark:text-emerald-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Split Payment Active
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                Itemized bills, multi-tender receipts (Cash / Card / EasyPaisa), and revenue tracking.
              </p>
            </div>
          </div>

          {tab === "Bills" && (
            <button
              onClick={() => setModalOpen(true)}
              className="flex items-center gap-2 self-start sm:self-center rounded-xl bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 text-sm font-semibold shadow-sm shadow-blue-500/25 transition-all hover:shadow-md hover:scale-[1.02]"
            >
              <FiPlus size={16} /> Generate Bill
            </button>
          )}
        </div>
      </div>

      {/* KPI Quick-Stats Row */}
      <div className="mb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Invoices"
          value={total}
          subtitle={`Page total: ${bills.length}`}
          icon={RupeeIcon}
          accent="text-blue-600 dark:text-blue-400"
        />
        <StatCard
          label="Gross Invoiced"
          value={`Rs. ${totalAmountSum.toLocaleString()}`}
          subtitle="Current view value"
          icon={FiTrendingUp}
          accent="text-purple-600 dark:text-purple-400"
        />
        <StatCard
          label="Total Collected"
          value={`Rs. ${paidAmountSum.toLocaleString()}`}
          subtitle="Realized revenue"
          icon={FiCheckCircle}
          accent="text-emerald-600 dark:text-emerald-400"
        />
        <StatCard
          label="Outstanding Due"
          value={`Rs. ${balanceDueSum.toLocaleString()}`}
          subtitle={`${unpaidCount} unpaid/partial bills`}
          icon={FiAlertCircle}
          accent="text-amber-600 dark:text-amber-400"
        />
      </div>

      {/* Segmented Tab Navigation Bar */}
      <div className="mb-6 flex flex-wrap items-center gap-1.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 p-1.5 backdrop-blur-md w-fit">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
              tab === t
                ? "bg-blue-600 text-white shadow-sm shadow-blue-500/30"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-slate-800/60"
            }`}
          >
            {t === "Bills" ? "Bills & Invoices" : "Revenue Analytics"}
          </button>
        ))}
      </div>

      {tab === "Bills" ? (
        <>
          <div className="mb-6 flex flex-wrap items-center gap-3">
            <div className="relative flex-1 max-w-sm">
              <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search Bill ID..."
                className="w-full rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 pl-10 pr-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 shadow-xs backdrop-blur-md outline-none focus:border-blue-500 dark:focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
              />
            </div>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 shadow-xs backdrop-blur-md outline-none focus:border-blue-500 dark:focus:border-blue-500"
            >
              {STATUSES.map((s) => (
                <option key={s} value={s} className="dark:bg-slate-900 dark:text-white">
                  {s || "All Payment Statuses"}
                </option>
              ))}
            </select>
            {(search || status) && (
              <button
                onClick={() => {
                  setSearch("");
                  setStatus("");
                }}
                className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
              >
                Clear filters
              </button>
            )}
          </div>

          {error && (
            <div className="mb-6 rounded-2xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/40 p-4 text-sm text-red-700 dark:text-red-300">
              {error}
            </div>
          )}

          <div className="overflow-hidden rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 shadow-xs backdrop-blur-md">
            {loading ? (
              <div className="flex h-48 items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-200 dark:border-blue-800 border-t-blue-600" />
              </div>
            ) : (
              <>
                <BillTable bills={bills} />
                <Pagination
                  page={page}
                  pages={pages}
                  total={total}
                  onChange={setPage}
                />
              </>
            )}
          </div>
        </>
      ) : (
        <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-6 shadow-xs backdrop-blur-md">
          <RevenueDashboard />
        </div>
      )}

      <CreateBillModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={createBill}
      />
    </div>
  );
};

export default Billing;
