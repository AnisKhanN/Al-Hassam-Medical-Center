import { useState } from "react";
import { FiPlus, FiSearch } from "react-icons/fi";
import { usePatients } from "../../hooks/usePatients";
import PatientTable from "../../components/patients/PatientTable";
import PatientFormModal from "../../components/patients/PatientFormModal";
import Pagination from "../../components/common/Pagination";

const PatientList = () => {
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/40 p-6 md:p-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-slate-800">Patients</h1>
          <p className="text-sm text-slate-500">
            {total} registered patient{total !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2">
            <FiSearch className="text-slate-400" size={15} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name, phone, ID, CNIC..."
              className="w-56 bg-transparent text-sm outline-none"
            />
          </div>
          <button
            onClick={openCreate}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700"
          >
            <FiPlus size={16} /> Register Patient
          </button>
        </div>
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
            <PatientTable
              patients={patients}
              onEdit={openEdit}
              onArchive={setConfirmTarget}
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
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4"
          onClick={() => setConfirmTarget(null)}
        >
          <div
            className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="mb-2 text-base font-semibold text-slate-800">
              Archive {confirmTarget.fullName}?
            </h3>
            <p className="mb-5 text-sm text-slate-500">
              They'll be hidden from the active list. Records and history are
              preserved.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setConfirmTarget(null)}
                className="rounded-lg px-4 py-2 text-sm text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={confirmArchive}
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

export default PatientList;
