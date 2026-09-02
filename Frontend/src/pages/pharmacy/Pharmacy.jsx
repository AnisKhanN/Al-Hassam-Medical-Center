import { useState } from "react";
import { FiPlus, FiSearch } from "react-icons/fi";
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

const TABS = ["Inventory", "Sales", "Suppliers"];

const Pharmacy = () => {
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

  const [saleStatus, setSaleStatus] = useState("");
  const [saleModalOpen, setSaleModalOpen] = useState(false);
  const [voidTarget, setVoidTarget] = useState(null);
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/40 p-6 md:p-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-slate-800">Pharmacy</h1>
          <p className="text-sm text-slate-500">
            Inventory, sales, and suppliers
          </p>
        </div>
        {tab === "Inventory" && (
          <button
            onClick={openCreateMedicine}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700"
          >
            <FiPlus size={16} /> Add Medicine
          </button>
        )}
        {tab === "Sales" && (
          <button
            onClick={() => setSaleModalOpen(true)}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700"
          >
            <FiPlus size={16} /> New Sale
          </button>
        )}
        {tab === "Suppliers" && (
          <button
            onClick={openCreateSupplier}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700"
          >
            <FiPlus size={16} /> Add Supplier
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

      {tab === "Inventory" && (
        <>
          <AlertsPanel lowStock={lowStock} expiring={expiring} />

          <div className="mb-4 flex flex-wrap gap-3">
            <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2">
              <FiSearch className="text-slate-400" size={15} />
              <input
                value={medSearch}
                onChange={(e) => setMedSearch(e.target.value)}
                placeholder="Search name, generic name, ID..."
                className="w-56 bg-transparent text-sm outline-none"
              />
            </div>
            <select
              value={medCategory}
              onChange={(e) => setMedCategory(e.target.value)}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-400"
            >
              <option value="">All Categories</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {medError && (
            <div className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
              {medError}
            </div>
          )}

          <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white/70 shadow-sm backdrop-blur">
            {medLoading ? (
              <div className="flex h-40 items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
              </div>
            ) : (
              <>
                <MedicineTable
                  medicines={medicines}
                  onEdit={openEditMedicine}
                  onArchive={setArchiveTarget}
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
          <div className="mb-4">
            <select
              value={saleStatus}
              onChange={(e) => setSaleStatus(e.target.value)}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-400"
            >
              <option value="">All Statuses</option>
              <option value="Completed">Completed</option>
              <option value="Voided">Voided</option>
            </select>
          </div>

          {saleError && (
            <div className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
              {saleError}
            </div>
          )}

          <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white/70 shadow-sm backdrop-blur">
            {saleLoading ? (
              <div className="flex h-40 items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
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
          <div className="mb-4 flex w-fit items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2">
            <FiSearch className="text-slate-400" size={15} />
            <input
              value={supplierSearch}
              onChange={(e) => setSupplierSearch(e.target.value)}
              placeholder="Search suppliers..."
              className="w-56 bg-transparent text-sm outline-none"
            />
          </div>

          {supError && (
            <div className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
              {supError}
            </div>
          )}

          <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white/70 shadow-sm backdrop-blur">
            {supLoading ? (
              <div className="flex h-40 items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
              </div>
            ) : (
              <SupplierTable
                suppliers={visibleSuppliers}
                onEdit={openEditSupplier}
                onArchive={setSupplierArchiveTarget}
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
