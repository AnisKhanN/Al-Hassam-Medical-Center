import { useState } from "react";
import { FiPlus, FiSearch, FiUsers, FiUserCheck, FiActivity } from "react-icons/fi";
import { usePatients } from "../../hooks/usePatients";
import { useAuth } from "../../hooks/useAuth";
import PatientTable from "../../components/patients/PatientTable";
import PatientFormModal from "../../components/patients/PatientFormModal";
import Pagination from "../../components/common/Pagination";
import StatCard from "../../components/dashboard/StatCard";
import useSEO from "../../hooks/useSEO";

const PatientList = () => {
  useSEO({
    title: "Patient Registry & EHR Directory",
    description: "Manage clinic patient profiles, longitudinal medical history timelines, and vital signs.",
  });

  const { user } = useAuth();
  const canRegister = user?.role === "Admin" || user?.role === "Receptionist";
  const canEdit = user?.role === "Admin" || user?.role === "Receptionist";
  const canArchive = user?.role === "Admin";

  const {
    patients,
    loading,
    error,
    search,
    setSearch,
    page,
    setPage,
    pages,
    total,
    createPatient,
    updatePatient,
    archivePatient,
  } = usePatients();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState(null);
  const [confirmTarget, setConfirmTarget] = useState(null);

  const openCreate = () => {
    setEditingPatient(null);
    setModalOpen(true);
  };
  const openEdit = (p) => {
    setEditingPatient(p);
    setModalOpen(true);
  };

  const handleSubmit = (values) =>
    editingPatient
      ? updatePatient(editingPatient._id, values)
      : createPatient(values);

  const confirmArchive = async () => {
    await archivePatient(confirmTarget._id);
    setConfirmTarget(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 p-4 sm:p-6 lg:p-8 transition-colors duration-200">
      {/* Top Welcome Hero Banner */}
      <div className="mb-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-6 sm:p-7 shadow-xs backdrop-blur-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-500 font-black text-white shadow-md shadow-blue-500/20">
              <FiUsers size={28} />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                  Patient Registry & EHR Directory
                </h1>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 dark:border-emerald-800/60 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-0.5 text-xs font-bold text-emerald-700 dark:text-emerald-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  EHR Active
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                Manage longitudinal medical histories, vital signs, and outpatient records.
              </p>
            </div>
          </div>

          {canRegister && (
            <button
              onClick={openCreate}
              className="flex items-center gap-2 self-start sm:self-center rounded-xl bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 text-sm font-semibold shadow-sm shadow-blue-500/25 transition-all hover:shadow-md hover:scale-[1.02]"
            >
              <FiPlus size={16} /> Register Patient
            </button>
          )}
        </div>
      </div>

      {/* KPI Quick-Stats Row */}
      <div className="mb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Registered"
          value={total}
          subtitle="Longitudinal EHR profiles"
          icon={FiUsers}
          accent="text-blue-600 dark:text-blue-400"
        />
        <StatCard
          label="Active In-View"
          value={patients.length}
          subtitle="Current page records"
          icon={FiUserCheck}
          accent="text-emerald-600 dark:text-emerald-400"
        />
        <StatCard
          label="Directory Pages"
          value={`${page} / ${pages || 1}`}
          subtitle="Paginated index"
          icon={FiActivity}
          accent="text-purple-600 dark:text-purple-400"
        />
        <StatCard
          label="Search Filter"
          value={search ? "Filtered" : "All Records"}
          subtitle={search ? `Matching "${search}"` : "Live search ready"}
          icon={FiSearch}
          accent="text-amber-600 dark:text-amber-400"
        />
      </div>

      {/* Search Toolbar */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search name, phone, ID, CNIC..."
            className="w-full rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 pl-10 pr-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 shadow-xs backdrop-blur-md outline-none focus:border-blue-500 dark:focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
          />
        </div>
        {search && (
          <button
            onClick={() => setSearch("")}
            className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
          >
            Reset Search
          </button>
        )}
      </div>

      {error && (
        <div className="mb-6 rounded-2xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/40 p-4 text-sm text-red-700 dark:text-red-300">
          {error}
        </div>
      )}

      {/* Main Table Container */}
      <div className="overflow-hidden rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 shadow-xs backdrop-blur-md">
        {loading ? (
          <div className="flex h-48 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-200 dark:border-blue-800 border-t-blue-600" />
          </div>
        ) : (
          <>
            <PatientTable
              patients={patients}
              onEdit={canEdit ? openEdit : null}
              onArchive={canArchive ? setConfirmTarget : null}
            />
            <Pagination
              page={page}
              pages={pages}
              total={total}
              onChange={setPage}
            />
          </>
        )}
      </div>

      <PatientFormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        editingPatient={editingPatient}
      />

      {confirmTarget && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4 backdrop-blur-sm"
          onClick={() => setConfirmTarget(null)}
        >
          <div
            className="w-full max-w-sm rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="mb-2 text-base font-bold text-slate-900 dark:text-white">
              Archive {confirmTarget.fullName}?
            </h3>
            <p className="mb-5 text-sm text-slate-500 dark:text-slate-400">
              Their clinical record will be archived. Historical medical records, visits,
              and bills remain preserved in audit trails.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setConfirmTarget(null)}
                className="rounded-xl border border-slate-200 dark:border-slate-700 px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmArchive}
                className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-700 transition"
              >
                Archive Record
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientList;
