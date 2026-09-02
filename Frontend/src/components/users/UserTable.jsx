// This table displays staff users with basic CRUD actions:
import { FiEdit2, FiUserX, FiUser, FiUserCheck } from "react-icons/fi";
import RoleBadge from "./RoleBadge";

const UserTable = ({ users, currentUserId, onEdit, onDeactivate }) => {
  if (users.length === 0) {
    return (
      <p className="py-10 text-center text-sm text-slate-400">
        No staff members yet.
      </p>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white/70 shadow-sm backdrop-blur">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-100 bg-slate-50/60 text-left text-xs uppercase tracking-wide text-slate-500">
            <th className="px-4 py-3">Profile</th>
            <th className="px-4 py-3">Name</th>
            <th className="px-4 py-3">Email</th>
            <th className="px-4 py-3">Role</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr
              key={u._id}
              className="border-b border-slate-50 last:border-0 hover:bg-slate-50/60"
            >
              <td className="px-4 py-3">
                {u.profilePic ? (
                  <img
                    src={`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/${u.profilePic}`}
                    alt="Profile"
                    className="h-8 w-8 rounded-full object-cover"
                    onError={(e) => {
                      e.target.src = "/assets/profile-placeholder.png";
                    }}
                  />
                ) : (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                    <FiUser size={16} />
                  </div>
                )}
              </td>
              <td className="px-4 py-3 font-medium text-slate-700">{u.name}</td>
              <td className="px-4 py-3 text-slate-500">{u.email}</td>
              <td className="px-4 py-3">
                <RoleBadge role={u.role} />
              </td>
              <td className="px-4 py-3">
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${u.isActive ? "bg-green-50 text-green-700" : "bg-slate-100 text-slate-500"}`}
                >
                  {u.isActive ? "Active" : "Inactive"}
                </span>
              </td>
              <td className="px-4 py-3">
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => onEdit(u)}
                    className="rounded-lg p-1.5 text-slate-400 hover:bg-blue-50 hover:text-blue-600"
                    title="Edit"
                  >
                    <FiEdit2 size={15} />
                  </button>
                  {u._id !== currentUserId && u.isActive && (
                    <button
                      onClick={() => onDeactivate(u)}
                      className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600"
                      title="Deactivate"
                    >
                      <FiUserX size={15} />
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
