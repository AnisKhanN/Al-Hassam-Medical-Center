// This table displays staff users with basic CRUD actions:
import { FiEdit2, FiUserX, FiUser, FiUserCheck } from "react-icons/fi";
import RoleBadge from "./RoleBadge";

const getProfilePicUrl = (pic) => {
  if (!pic) return "";
  if (pic.startsWith("http://") || pic.startsWith("https://")) return pic;
  const baseUrl = (
    import.meta.env.VITE_API_URL || "http://localhost:5000"
  ).replace(/\/+$/, "");
  const cleanPath = pic.startsWith("/") ? pic : `/${pic}`;
  return `${baseUrl}${cleanPath}`;
};

const UserTable = ({ users, currentUserId, onEdit, onDeactivate }) => {
  if (users.length === 0) {
    return (
      <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-12 text-center text-sm text-slate-400 dark:text-slate-500 shadow-xs backdrop-blur-md">
        No staff members found matching criteria.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 shadow-xs backdrop-blur-md">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200/80 dark:border-slate-800 bg-slate-100/80 dark:bg-slate-800/80 text-left text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300 font-bold">
              <th className="px-5 py-3.5">Profile</th>
              <th className="px-5 py-3.5">Name</th>
              <th className="px-5 py-3.5">Email</th>
              <th className="px-5 py-3.5">Role</th>
              <th className="px-5 py-3.5">Status</th>
              <th className="px-5 py-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
            {users.map((u) => (
              <tr
                key={u._id}
                className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors"
              >
                <td className="px-5 py-3.5">
                  {u.profilePic ? (
                    <img
                      src={getProfilePicUrl(u.profilePic)}
                      alt="Profile"
                      className="h-9 w-9 rounded-full object-cover border border-slate-200 dark:border-slate-700 shadow-xs"
                      onError={(e) => {
                        e.target.src = "/assets/profile-placeholder.png";
                      }}
                    />
                  ) : (
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 border border-slate-200/60 dark:border-slate-700">
                      <FiUser size={16} />
                    </div>
                  )}
                </td>
                <td className="px-5 py-3.5 font-bold text-slate-900 dark:text-white">
                  {u.name}
                </td>
                <td className="px-5 py-3.5 text-slate-500 dark:text-slate-400 font-medium">
                  {u.email}
                </td>
                <td className="px-5 py-3.5">
                  <RoleBadge role={u.role} />
                </td>
                <td className="px-5 py-3.5">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
                      u.isActive
                        ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700"
                    }`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        u.isActive ? "bg-emerald-500 animate-pulse" : "bg-slate-400"
                      }`}
                    />
                    {u.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-5 py-3.5 text-right">
                  <div className="flex justify-end gap-1.5">
                    <button
                      onClick={() => onEdit(u)}
                      className="rounded-xl p-2 text-slate-400 dark:text-slate-500 hover:bg-blue-50 dark:hover:bg-blue-950/60 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      title="Edit Account"
                    >
                      <FiEdit2 size={15} />
                    </button>
                    {u._id !== currentUserId && u.isActive && (
                      <button
                        onClick={() => onDeactivate(u)}
                        className="rounded-xl p-2 text-slate-400 dark:text-slate-500 hover:bg-red-50 dark:hover:bg-red-950/60 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                        title="Deactivate Account"
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
    </div>
  );
};

export default UserTable;
