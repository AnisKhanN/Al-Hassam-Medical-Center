import { useState } from "react";
import { FiPlus, FiSearch, FiPackage, FiAlertTriangle, FiClock, FiShoppingBag, FiTruck } from "react-icons/fi";
import { useAuth } from "../../hooks/useAuth";
import { useMedicines } from "../../hooks/useMedicines";
import { useSuppliers } from "../../hooks/useSuppliers";
import { useSales } from "../../hooks/useSales";
import { useCategories } from "../../hooks/useCategories";
import { useInventoryAlerts } from "../../hooks/useInventoryAlerts";
import MedicineTable from "../../components/pharmacy/MedicineTable";
import MedicineFormModal from "../../components/pharmacy/MedicineFormModal";
import AlertsPanel from "../../components/pharmacy/AlertsPanel";
import SupplierTable from "../../components/pharmacy/SupplierTable";
import SupplierFormModal from "../../components/pharmacy/SupplierFormModal";
import SalesTable from "../../components/pharmacy/SalesTable";
import NewSaleModal from "../../components/pharmacy/NewSaleModal";
import VoidSaleModal from "../../components/pharmacy/VoidSaleModal";
import Pagination from "../../components/common/Pagination";
import StatCard from "../../components/dashboard/StatCard";
import useSEO from "../../hooks/useSEO";

const TABS = ["Inventory", "Sales", "Suppliers"];

const Pharmacy = () => {
  useSEO({
    title: "Pharmacy Inventory & Barcode FEFO POS",
    description: "Pharmacy medicine catalog, batch expiry radar, automated FEFO depletion, and barcode checkout POS.",
  });

  const { user } = useAuth();
  const [tab, setTab] = useState("Inventory");
  const isAdmin = user?.role === "Admin";

  const [medSearch, setMedSearch] = useState("");
  const [medCategory, setMedCategory] = useState("");
  const [medModalOpen, setMedModalOpen] = useState(false);
  const [editingMedicine, setEditingMedicine] = useState(null);
  const [archiveTarget, setArchiveTarget] = useState(null);
  const { categories, refetch: refetchCategories } = useCategories();
  const { lowStock, expiring, refetch: refetchAlerts } = useInventoryAlerts();
  const {
    medicines,
    loading: medLoading,
    error: medError,
    page: medPage,
    setPage: setMedPage,
    pages: medPages,
    total: medTotal,
    createMedicine,
    updateMedicine,
    archiveMedicine,
  } = useMedicines({
    search: medSearch || undefined,
    category: medCategory || undefined,
  });

  const {
    suppliers,
    loading: supLoading,
    error: supError,
    createSupplier,
    updateSupplier,
    deactivateSupplier,
  } = useSuppliers("");

  const openCreateMedicine = () => {
    setEditingMedicine(null);
    setMedModalOpen(true);
  };
  const openEditMedicine = (m) => {
    setEditingMedicine(m);
    setMedModalOpen(true);
  };
  const handleMedSubmit = async (values) => {
    const result = editingMedicine
      ? await updateMedicine(editingMedicine._id, values)
      : await createMedicine(values);
    refetchCategories();
    return result;
  };
  const confirmArchiveMedicine = async () => {
    await archiveMedicine(archiveTarget._id);
    setArchiveTarget(null);
    refetchAlerts();
  };

  const [supplierSearch, setSupplierSearch] = useState("");
  const [supplierModalOpen, setSupplierModalOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);
  const [supplierArchiveTarget, setSupplierArchiveTarget] = useState(null);

  const openCreateSupplier = () => {
    setEditingSupplier(null);
    setSupplierModalOpen(true);
  };
  const openEditSupplier = (s) => {
    setEditingSupplier(s);
    setSupplierModalOpen(true);
  };
  const handleSupplierSubmit = (values) =>
    editingSupplier
      ? updateSupplier(editingSupplier._id, values)
      : createSupplier(values);
  const confirmArchiveSupplier = async () => {
    await deactivateSupplier(supplierArchiveTarget._id);
    setSupplierArchiveTarget(null);
  };
  const visibleSuppliers = supplierSearch
    ? suppliers.filter((s) =>
        s.name.toLowerCase().includes(supplierSearch.toLowerCase()),
      )
    : suppliers;

  const [saleModalOpen, setSaleModalOpen] = useState(false);
  const [voidModalOpen, setVoidModalOpen] = useState(false);
  const [voidTarget, setVoidTarget] = useState(null);
  const [saleStatus, setSaleStatus] = useState("");
  const {
    sales,
    loading: saleLoading,
    error: saleError,
    page: salePage,
    setPage: setSalePage,
    pages: salePages,
    total: saleTotal,
    createSale,
    voidSale,
  } = useSales({ status: saleStatus || undefined });

  const handleNewSale = async (payload) => {
    await createSale(payload);
    refetchAlerts();
  };
  const handleVoid = async (payload) => {
    await voidSale(voidTarget._id, payload);
    refetchAlerts();
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 p-4 sm:p-6 lg:p-8 transition-colors duration-200">
      <div className="mb-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-6 sm:p-7 shadow-xs backdrop-blur-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-600 font-black text-white shadow-md shadow-amber-500/20">
              <FiPackage size={28} />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                  Pharmacy Inventory & FEFO POS Hub
                </h1>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 dark:border-amber-800/60 bg-amber-50 dark:bg-amber-950/60 px-3 py-0.5 text-xs font-bold text-amber-700 dark:text-amber-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
                  FEFO Depletion Active
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                Batch-level expiry radar, automated barcode sales, and supplier procurement ledger.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-start sm:self-center">
            {tab === "Inventory" && (
              <button
                onClick={openCreateMedicine}
                className="flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 text-sm font-semibold shadow-sm shadow-blue-500/25 transition-all hover:shadow-md hover:scale-[1.02]"
              >
                <FiPlus size={16} /> Add Medicine
              </button>
            )}
            {tab === "Sales" && (
              <button
                onClick={() => setSaleModalOpen(true)}
                className="flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 text-sm font-semibold shadow-sm shadow-blue-500/25 transition-all hover:shadow-md hover:scale-[1.02]"
              >
                <FiPlus size={16} /> New Sale
              </button>
            )}
            {tab === "Suppliers" && (
              <button
                onClick={openCreateSupplier}
                className="flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 text-sm font-semibold shadow-sm shadow-blue-500/25 transition-all hover:shadow-md hover:scale-[1.02]"
              >
                <FiPlus size={16} /> Add Supplier
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="mb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Cataloged Medicines"
          value={medTotal}
          subtitle="Registered formulations"
          icon={FiPackage}
          accent="text-blue-600 dark:text-blue-400"
        />
        <StatCard
          label="Low Stock Alerts"
          value={lowStock.length}
          subtitle="Items below threshold"
          icon={FiAlertTriangle}
          accent="text-red-600 dark:text-red-400"
        />
        <StatCard
          label="Expiring Batches"
          value={expiring.length}
          subtitle="Expiry within 90 days"
          icon={FiClock}
          accent="text-amber-600 dark:text-amber-400"
        />
        <StatCard
          label="Total POS Sales"
          value={saleTotal}
          subtitle="Completed sales slips"
          icon={FiShoppingBag}
          accent="text-emerald-600 dark:text-emerald-400"
        />
      </div>

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
            {t}
          </button>
        ))}
      </div>

      {tab === "Inventory" && (
        <>
          <div className="mb-6">
            <AlertsPanel lowStock={lowStock} expiring={expiring} />
          </div>

          <div className="mb-6 flex flex-wrap items-center gap-3">
            <div className="relative flex-1 max-w-sm">
              <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                value={medSearch}
                onChange={(e) => {
                  setMedSearch(e.target.value);
                  setMedPage(1);
                }}
                placeholder="Search name, generic, ID..."
                className="w-full rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 pl-10 pr-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 shadow-xs backdrop-blur-md outline-none focus:border-blue-500 dark:focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
              />
            </div>
            <select
              value={medCategory}
              onChange={(e) => {
                setMedCategory(e.target.value);
                setMedPage(1);
              }}
              className="rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 shadow-xs backdrop-blur-md outline-none focus:border-blue-500 dark:focus:border-blue-500"
            >
              <option value="" className="dark:bg-slate-900 dark:text-white">All Drug Categories</option>
              {categories.map((c) => (
                <option key={c} value={c} className="dark:bg-slate-900 dark:text-white">
                  {c}
                </option>
              ))}
            </select>
          </div>

          {medError && (
            <div className="mb-6 rounded-2xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/40 p-4 text-sm text-red-700 dark:text-red-300">
              {medError}
            </div>
          )}

          <div className="overflow-hidden rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 shadow-xs backdrop-blur-md">
            {medLoading ? (
              <div className="flex h-48 items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-200 dark:border-blue-800 border-t-blue-600" />
              </div>
            ) : (
              <>
                <MedicineTable
                  medicines={medicines}
                  onEdit={openEditMedicine}
                  onArchive={isAdmin ? setArchiveTarget : null}
                />
                <Pagination
                  page={medPage}
                  pages={medPages}
                  total={medTotal}
                  onChange={setMedPage}
                />
              </>
            )}
          </div>
        </>
      )}

      {tab === "Sales" && (
        <>
          <div className="mb-6 flex items-center gap-3">
            <select
              value={saleStatus}
              onChange={(e) => setSaleStatus(e.target.value)}
              className="rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 shadow-xs backdrop-blur-md outline-none focus:border-blue-500 dark:focus:border-blue-500"
            >
              <option value="" className="dark:bg-slate-900 dark:text-white">All Sales Statuses</option>
              <option value="Completed" className="dark:bg-slate-900 dark:text-white">Completed</option>
              <option value="Voided" className="dark:bg-slate-900 dark:text-white">Voided</option>
            </select>
            {saleStatus && (
              <button
                onClick={() => setSaleStatus("")}
                className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
              >
                Clear filter
              </button>
            )}
          </div>

          {saleError && (
            <div className="mb-6 rounded-2xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/40 p-4 text-sm text-red-700 dark:text-red-300">
              {saleError}
            </div>
          )}

          <div className="overflow-hidden rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 shadow-xs backdrop-blur-md">
            {saleLoading ? (
              <div className="flex h-48 items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-200 dark:border-blue-800 border-t-blue-600" />
              </div>
            ) : (
              <>
                <SalesTable
                  sales={sales}
                  onVoid={setVoidTarget}
                  canVoid={isAdmin}
                />
                <Pagination
                  page={salePage}
                  pages={salePages}
                  total={saleTotal}
                  onChange={setSalePage}
                />
              </>
            )}
          </div>
        </>
      )}

      {tab === "Suppliers" && (
        <>
          <div className="mb-6 relative max-w-sm">
            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              value={supplierSearch}
              onChange={(e) => setSupplierSearch(e.target.value)}
              placeholder="Search suppliers by name, phone, email..."
              className="w-full rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 pl-10 pr-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 shadow-xs backdrop-blur-md outline-none focus:border-blue-500 dark:focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
            />
          </div>

          {supError && (
            <div className="mb-6 rounded-2xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/40 p-4 text-sm text-red-700 dark:text-red-300">
              {supError}
            </div>
          )}

          <div className="overflow-hidden rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 shadow-xs backdrop-blur-md">
            {supLoading ? (
              <div className="flex h-48 items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-200 dark:border-blue-800 border-t-blue-600" />
              </div>
            ) : (
              <SupplierTable
                suppliers={visibleSuppliers}
                onEdit={openEditSupplier}
                onArchive={isAdmin ? setSupplierArchiveTarget : null}
              />
            )}
          </div>
        </>
      )}

      <MedicineFormModal
        isOpen={medModalOpen}
        onClose={() => setMedModalOpen(false)}
        onSubmit={handleMedSubmit}
        editingMedicine={editingMedicine}
        categories={categories}
        suppliers={suppliers}
      />

      <SupplierFormModal
        isOpen={supplierModalOpen}
        onClose={() => setSupplierModalOpen(false)}
        onSubmit={handleSupplierSubmit}
        editingSupplier={editingSupplier}
      />

      <NewSaleModal
        isOpen={saleModalOpen}
        onClose={() => setSaleModalOpen(false)}
        onSubmit={handleNewSale}
      />
      <VoidSaleModal
        isOpen={!!voidTarget}
        onClose={() => setVoidTarget(null)}
        onSubmit={handleVoid}
      />

      {archiveTarget && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4"
          onClick={() => setArchiveTarget(null)}
        >
          <div
            className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="mb-2 text-base font-semibold text-slate-800">
              Archive {archiveTarget.name}?
            </h3>
            <p className="mb-5 text-sm text-slate-500">
              It will be hidden from the active catalog. Batch and sale history
              are preserved.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setArchiveTarget(null)}
                className="rounded-lg px-4 py-2 text-sm text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={confirmArchiveMedicine}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
              >
                Archive
              </button>
            </div>
          </div>
        </div>
      )}

      {supplierArchiveTarget && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4"
          onClick={() => setSupplierArchiveTarget(null)}
        >
          <div
            className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="mb-2 text-base font-semibold text-slate-800">
              Archive {supplierArchiveTarget.name}?
            </h3>
            <p className="mb-5 text-sm text-slate-500">
              Existing medicines will keep the reference; this only hides it
              from future selection.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setSupplierArchiveTarget(null)}
                className="rounded-lg px-4 py-2 text-sm text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={confirmArchiveSupplier}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
              >
                Archive
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Pharmacy;
