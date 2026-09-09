// This is the main admin page to view and manage staff users:
import { useState, useMemo } from "react";
import {
  FiPlus,
  FiShield,
  FiUsers,
  FiActivity,
  FiCalendar,
  FiPackage,
  FiSearch,
  FiFilter,
  FiAlertCircle,
} from "react-icons/fi";
import { useUsers } from "../../hooks/useUsers.js";
import { useAuth } from "../../hooks/useAuth.js";
import UserTable from "../../components/users/UserTable.jsx";
import UserFormModal from "../../components/users/UserFormModal.jsx";
import StatCard from "../../components/dashboard/StatCard.jsx";
import useSEO from "../../hooks/useSEO";

const UserManagement = () => {
  useSEO({
    title: "Staff Governance & Role Access",
    description:
      "Administer clinic staff accounts, assign RBAC roles, and regulate system access privileges.",
  });

  const { users, loading, error, createUser, updateUser, deactivateUser } =
    useUsers();
  const { user: currentUser } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [confirmTarget, setConfirmTarget] = useState(null); // user pending deactivation confirmation

  // Filter and Search State
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

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

  // Filtered Users List
  const filteredUsers = useMemo(() => {
    return (users || []).filter((u) => {
      const q = search.trim().toLowerCase();
      const matchesSearch =
        !q ||
        u.name?.toLowerCase().includes(q) ||
        u.email?.toLowerCase().includes(q);
      const matchesRole = roleFilter === "all" || u.role === roleFilter;
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" ? u.isActive : !u.isActive);
      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, search, roleFilter, statusFilter]);

  // Operational Statistics
  const staffStats = useMemo(() => {
    const list = users || [];
    return {
      total: list.length,
      doctors: list.filter((u) => u.role === "Doctor" && u.isActive).length,
      receptionists: list.filter((u) => u.role === "Receptionist" && u.isActive).length,
      pharmacists: list.filter((u) => u.role === "Pharmacist" && u.isActive).length,
    };
  }, [users]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 p-4 sm:p-6 lg:p-8 transition-colors duration-200 space-y-6 pb-12">
      {/* Top Welcome Hero Operations Banner */}
      <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-6 sm:p-7 shadow-xs backdrop-blur-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 font-black text-white shadow-md shadow-purple-500/20">
              <FiShield size={28} />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                  Staff Governance &amp; Role Access
                </h1>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-purple-200 dark:border-purple-800/60 bg-purple-50 dark:bg-purple-950/60 px-3 py-0.5 text-xs font-bold text-purple-700 dark:text-purple-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-purple-500 animate-pulse" />
                  RBAC Directory Active
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                Administer clinical practitioners, desk receptionists, pharmacy personnel, and role-based permissions.
              </p>
            </div>
          </div>

          <button
            onClick={openCreate}
            className="flex items-center gap-2 self-start sm:self-center rounded-xl bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 text-sm font-semibold shadow-sm shadow-blue-500/25 transition-all hover:shadow-md hover:scale-[1.02] active:scale-95"
          >
            <FiPlus size={16} /> Add Staff
          </button>
        </div>
      </div>

      {/* Staff Key Metrics Grid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard
          label="Total Staff"
          value={staffStats.total}
          icon={FiUsers}
          subtitle="Registered Accounts"
        />
        <StatCard
          label="Active Doctors"
          value={staffStats.doctors}
          icon={FiActivity}
          accent="text-blue-600 dark:text-blue-400"
          subtitle="Consulting Physicians"
        />
        <StatCard
          label="Front Desk"
          value={staffStats.receptionists}
          icon={FiCalendar}
          accent="text-emerald-600 dark:text-emerald-400"
          subtitle="Active Receptionists"
        />
        <StatCard
          label="Pharmacy Staff"
          value={staffStats.pharmacists}
          icon={FiPackage}
          accent="text-amber-600 dark:text-amber-400"
          subtitle="Dispensing Personnel"
        />
      </div>

      {/* Search & Filter Command Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-3.5 shadow-xs backdrop-blur-md">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" size={16} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search staff by name or email address..."
            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-950/60 pl-10 pr-4 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-semibold px-1">
            <FiFilter size={14} />
          </div>

          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-950/60 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 focus:border-blue-500 focus:outline-none"
          >
            <option value="all">All Roles</option>
            <option value="Doctor">Doctors</option>
            <option value="Receptionist">Receptionists</option>
            <option value="Pharmacist">Pharmacists</option>
            <option value="Admin">Administrators</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-950/60 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 focus:border-blue-500 focus:outline-none"
          >
            <option value="all">All Status</option>
            <option value="active">Active Only</option>
            <option value="inactive">Inactive Only</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="rounded-2xl border border-red-200/80 dark:border-red-900/50 bg-red-50/80 dark:bg-red-950/40 p-4 text-xs font-semibold text-red-600 dark:text-red-400 flex items-center gap-2">
          <FiAlertCircle size={16} />
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex h-56 flex-col items-center justify-center gap-3 rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 shadow-xs backdrop-blur-md">
          <div className="h-9 w-9 animate-spin rounded-full border-4 border-blue-200 dark:border-blue-900 border-t-blue-600" />
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Loading staff directory...
          </p>
        </div>
      ) : (
        <UserTable
          users={filteredUsers}
          currentUserId={currentUser?._id || currentUser?.id}
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
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm"
          onClick={() => setConfirmTarget(null)}
        >
          <div
            className="w-full max-w-sm rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Deactivate {confirmTarget.name}?
              </h3>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                They will lose system access immediately. This action can be reversed at any time by editing their profile status.
              </p>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setConfirmTarget(null)}
                className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeactivate}
                className="rounded-xl bg-red-600 hover:bg-red-700 px-4 py-2 text-xs font-semibold text-white transition shadow-sm"
              >
                Deactivate Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
