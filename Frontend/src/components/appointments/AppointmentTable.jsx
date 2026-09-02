import { Link } from "react-router-dom";
import { format } from "date-fns";
import { FiCheck, FiXCircle } from "react-icons/fi";
import StatusBadge from "./StatusBadge";
import { useAuth } from "../../hooks/useAuth";

const AppointmentTable = ({ appointments, onComplete, onCancel }) => {
  const { user } = useAuth();

  if (appointments.length === 0) {
    return (
      <p className="py-10 text-center text-sm text-slate-400">
        No appointments found.
      </p>
    );
  }

  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b border-slate-100 bg-slate-50/60 text-left text-xs uppercase tracking-wide text-slate-500">
          <th className="px-4 py-3">Time</th>
          <th className="px-4 py-3">Patient</th>
          <th className="px-4 py-3">Doctor</th>
          <th className="px-4 py-3">Reason</th>
          <th className="px-4 py-3">Status</th>
          <th className="px-4 py-3 text-right">Actions</th>
        </tr>
      </thead>
      <tbody>
        {appointments.map((a) => {
          // Mirrors backend rules exactly: only the assigned doctor completes,
          // only front-desk roles cancel — real enforcement stays server-side.
          const canComplete =
            a.status === "Scheduled" &&
            user?.role === "Doctor" &&
            a.doctor?._id === user._id;
          const canCancel =
            a.status === "Scheduled" &&
            (user?.role === "Admin" || user?.role === "Receptionist");
          return (
            <tr
              key={a._id}
              className="border-b border-slate-50 last:border-0 hover:bg-slate-50/60"
            >
              <td className="px-4 py-3 text-slate-600">
                {format(new Date(a.appointmentDate), "dd MMM, h:mm a")}
              </td>
              <td className="px-4 py-3">
                <Link
                  to={`/patients/${a.patient?._id}`}
                  className="font-medium text-slate-700 hover:text-blue-600"
                >
                  {a.patient?.fullName}
                </Link>
                <p className="text-xs text-slate-400">{a.patient?.patientId}</p>
              </td>
              <td className="px-4 py-3 text-slate-500">Dr. {a.doctor?.name}</td>
              <td className="px-4 py-3 text-slate-500">{a.reason}</td>
              <td className="px-4 py-3">
                <StatusBadge status={a.status} />
              </td>
              <td className="px-4 py-3">
                <div className="flex justify-end gap-2">
                  {canComplete && (
                    <button
                      onClick={() => onComplete(a)}
                      className="rounded-lg p-1.5 text-slate-400 hover:bg-green-50 hover:text-green-600"
                      title="Mark Completed"
                    >
                      <FiCheck size={15} />
                    </button>
                  )}
                  {canCancel && (
                    <button
                      onClick={() => onCancel(a)}
                      className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600"
                      title="Cancel"
                    >
                      <FiXCircle size={15} />
                    </button>
                  )}
                </div>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default AppointmentTable;
