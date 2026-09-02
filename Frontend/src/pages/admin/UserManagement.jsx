// This is the main admin page to view and manage staff users:
import { useState } from "react";
import { FiPlus } from "react-icons/fi";
import { useUsers } from "../../hooks/useUsers.js";
import { useAuth } from "../../hooks/useAuth.js";
import UserTable from "../../components/users/UserTable.jsx";
import UserFormModal from "../../components/users/UserFormModal.jsx";

const UserManagement = () => {
  const { users, loading, error, createUser, updateUser, deactivateUser } =
    useUsers();
  const { user: currentUser } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [confirmTarget, setConfirmTarget] = useState(null); // user pending deactivation confirmation

  const openCreate = () => {
    setEditingUser(null);
    setModalOpen(true);
  };
  const openEdit = (u) => {
    setEditingUser(u);
    setModalOpen(true);
  };

  const handleSubmit = (values) =>
    editingUser ? updateUser(editingUser._id, values) : createUser(values);

  const confirmDeactivate = async () => {
    await deactivateUser(confirmTarget._id);
    setConfirmTarget(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/40 p-6 md:p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-800">
            Staff Management
          </h1>
          <p className="text-sm text-slate-500">
            Create and manage Doctor, Receptionist, and Pharmacist accounts.
          </p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700"
        >
          <FiPlus size={16} /> Add Staff
        </button>
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex h-40 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
        </div>
      ) : (
        <UserTable
          users={users}
          currentUserId={currentUser?._id}
          onEdit={openEdit}
          onDeactivate={setConfirmTarget}
        />
      )}

      <UserFormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        editingUser={editingUser}
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
              Deactivate {confirmTarget.name}?
            </h3>
            <p className="mb-5 text-sm text-slate-500">
              They'll lose access immediately. This can be reversed later by
              editing their status.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setConfirmTarget(null)}
                className="rounded-lg px-4 py-2 text-sm text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeactivate}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
              >
                Deactivate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
