import { Link } from "react-router-dom";
import { format } from "date-fns";
import { FiCheck, FiXCircle, FiFileText, FiVideo, FiSend } from "react-icons/fi";
import StatusBadge from "./StatusBadge";
import { useAuth } from "../../hooks/useAuth";
import { sendWhatsAppNotification } from "../../api/notificationApi";

const AppointmentTable = ({ appointments, onComplete, onCancel, onOpenSlip }) => {
  const { user } = useAuth();

  const handleSendReminder = async (a) => {
    const patientPhone = a.patient?.phone || "03001234567";
    const dateStr = format(new Date(a.appointmentDate), "dd MMMM yyyy");
    const timeStr = format(new Date(a.appointmentDate), "hh:mm a");
    const meetingLink = a.isTelemedicine && a.meetingRoomId
      ? `${window.location.origin}/telemedicine/${a.meetingRoomId}`
      : null;

    try {
      const res = await sendWhatsAppNotification({
        phone: patientPhone,
        type: "appointment",
        data: {
          patientName: a.patient?.fullName || "Patient",
          doctorName: a.doctor?.name ? `Dr. ${a.doctor.name}` : "Doctor",
          dateStr,
          timeStr,
          meetingLink,
          phone: patientPhone,
        },
      });
      if (res.data?.whatsAppLink) {
        window.open(res.data.whatsAppLink, "_blank");
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to trigger WhatsApp reminder");
    }
  };

  if (appointments.length === 0) {
    return (
      <p className="py-10 text-center text-sm text-slate-400">
        No appointments found.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-200/80 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80 text-left text-xs uppercase tracking-wider font-bold text-slate-500 dark:text-slate-400">
            <th className="px-4 py-3.5">Token</th>
            <th className="px-5 py-3.5">Scheduled Time</th>
            <th className="px-5 py-3.5">Patient Details</th>
            <th className="px-5 py-3.5">Assigned Doctor</th>
            <th className="px-5 py-3.5">Clinical Reason</th>
            <th className="px-5 py-3.5">Consultation Type</th>
            <th className="px-5 py-3.5">Queue Status</th>
            <th className="px-5 py-3.5 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
          {appointments.map((a, idx) => {
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
                className="hover:bg-blue-50/40 dark:hover:bg-blue-950/20 transition-colors"
              >
                <td className="px-4 py-4">
                  <span className="inline-flex items-center justify-center font-mono text-xs font-black px-2.5 py-1 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200/80 dark:border-blue-800">
                    #{String(idx + 1).padStart(2, "0")}
                  </span>
                </td>
                <td className="px-5 py-4 font-mono text-xs font-semibold text-slate-700 dark:text-slate-300">
                  {format(new Date(a.appointmentDate), "dd MMM, h:mm a")}
                </td>
                <td className="px-5 py-4">
                  <Link
                    to={`/patients/${a.patient?._id}`}
                    className="font-semibold text-slate-800 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 transition"
                  >
                    {a.patient?.fullName}
                  </Link>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500 font-mono mt-0.5">
                    {a.patient?.patientId || "ID-Pending"}{a.patient?.phone ? ` • ${a.patient.phone}` : ""}
                  </p>
                </td>
                <td className="px-5 py-4 font-medium text-slate-700 dark:text-slate-300">
                  Dr. {a.doctor?.name}
                </td>
                <td className="px-5 py-4 text-slate-600 dark:text-slate-400">
                  {a.reason}
                </td>
                <td className="px-5 py-4">
                  {a.isTelemedicine ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-purple-50 dark:bg-purple-950/60 px-2.5 py-1 text-xs font-semibold text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800/60">
                      <FiVideo size={12} /> Video Room
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 dark:bg-slate-800 px-2.5 py-1 text-xs font-medium text-slate-600 dark:text-slate-400">
                      In-Person Visit
                    </span>
                  )}
                </td>
                <td className="px-5 py-4">
                  <StatusBadge status={a.status} />
                </td>
              <td className="px-4 py-3">
                <div className="flex justify-end items-center gap-1.5">
                  {a.isTelemedicine && a.meetingRoomId && a.status !== "Cancelled" && (
                    <Link
                      to={`/telemedicine/${a.meetingRoomId}`}
                      className="inline-flex items-center gap-1 rounded-lg bg-purple-600 hover:bg-purple-700 px-2.5 py-1 text-xs font-semibold text-white shadow-sm transition"
                      title="Join Telemedicine Video Consultation"
                    >
                      <FiVideo size={13} /> Join Call
                    </Link>
                  )}
                  <button
                    onClick={() => handleSendReminder(a)}
                    className="rounded-lg p-1.5 text-slate-400 hover:bg-emerald-50 hover:text-emerald-600 transition"
                    title="Send WhatsApp Reminder"
                  >
                    <FiSend size={14} />
                  </button>
                  {onOpenSlip && (
                    <button
                      onClick={() => onOpenSlip(a)}
                      className="rounded-lg p-1.5 text-slate-400 hover:bg-blue-50 hover:text-blue-600"
                      title="AI Bilingual Discharge Slip"
                    >
                      <FiFileText size={15} />
                    </button>
                  )}
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
    </div>
  );
};

export default AppointmentTable;
