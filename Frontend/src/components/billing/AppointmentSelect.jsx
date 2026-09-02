import { useState, useEffect } from "react";
import { format } from "date-fns";
import api from "../../api/axios";

// Optional link — a bill doesn't have to originate from an appointment
// (e.g. a walk-in pharmacy sale), so "None" is always a valid choice.
const AppointmentSelect = ({ patientId, value, onChange }) => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!patientId) {
      setAppointments([]);
      return;
    }
    setLoading(true);
    api
      .get("/appointments", { params: { patient: patientId, limit: 20 } })
      .then(({ data }) => setAppointments(data.data))
      .catch(() => setAppointments([]))
      .finally(() => setLoading(false));
  }, [patientId]);

  if (!patientId) return null;

  return (
    <select
      value={value || ""}
      onChange={(e) => onChange(e.target.value || null)}
      disabled={loading}
      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
    >
      <option value="">
        {loading ? "Loading appointments..." : "No linked appointment"}
      </option>
      {appointments.map((a) => (
        <option key={a._id} value={a._id}>
          {format(new Date(a.appointmentDate), "dd MMM, h:mm a")} — {a.reason} (
          {a.status})
        </option>
      ))}
    </select>
  );
};

export default AppointmentSelect;
