import { useState, useMemo } from "react";
import { FiPlus, FiSearch } from "react-icons/fi";
import { useBills } from "../../hooks/useBills";
import BillTable from "../../components/billing/BillTable";
import CreateBillModal from "../../components/billing/CreateBillModal";
import RevenueDashboard from "../../components/billing/RevenueDashboard";
import Pagination from "../../components/common/Pagination";

const TABS = ["Bills", "Revenue"];
const STATUSES = ["", "Unpaid", "Partially Paid", "Paid", "Cancelled"];

const Billing = () => {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/40 p-6 md:p-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-slate-800">Billing</h1>
          <p className="text-sm text-slate-500">
            {tab === "Bills"
              ? `${total} bill${total !== 1 ? "s" : ""}`
              : "Revenue overview"}
          </p>
        </div>
        {tab === "Bills" && (
          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700"
          >
            <FiPlus size={16} /> Generate Bill
          </button>
        )}
      </div>

      <div className="mb-5 flex w-fit gap-1 rounded-lg border border-slate-100 bg-white/70 p-1">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`rounded-md px-4 py-1.5 text-sm font-medium transition ${tab === t ? "bg-blue-600 text-white" : "text-slate-500 hover:bg-slate-50"}`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "Bills" ? (
        <>
          <div className="mb-4 flex flex-wrap gap-3">
            <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2">
              <FiSearch className="text-slate-400" size={15} />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search Bill ID..."
                className="w-48 bg-transparent text-sm outline-none"
              />
            </div>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-400"
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s || "All Statuses"}
                </option>
              ))}
            </select>
          </div>

          {error && (
            <div className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
              {error}
            </div>
          )}

          <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white/70 shadow-sm backdrop-blur">
            {loading ? (
              <div className="flex h-40 items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
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
        <RevenueDashboard />
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
