import { useState, useCallback, useEffect } from "react";
import api from "../api/axios";

// The only thing that changes between "Today", "Completed", "Cancelled",
// and a selected calendar day is the filter object — so one hook covers
// all of them instead of four near-identical copies.
export const useAppointments = (filters = {}) => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const filterKey = JSON.stringify(filters);

  const fetchAppointments = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await api.get("/appointments", {
        params: { ...filters, page, limit: 15 },
      });
      setAppointments(data.data || []);
      setPages(data.pages || 1);
      setTotal(data.total || 0);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load appointments");
      setAppointments([]);
      setPages(1);
      setTotal(0);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterKey, page]);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  // Whenever filters change, reset to page 1
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    setPage(1);
  }, [filterKey]);

  const bookAppointment = async (payload) => {
    const { data } = await api.post("/appointments", payload);
    await fetchAppointments();
    return data.data;
  };

  const updateStatus = async (id, payload) => {
    // A status change (Scheduled -> Completed/Cancelled) moves the
    // appointment out of the current tab/list, so a full refetch keeps
    // state synchronized rather than patching local state in place.
    const { data } = await api.patch(`/appointments/${id}/status`, payload);
    await fetchAppointments();
    return data.data;
  };

  return {
    appointments,
    loading,
    error,
    page,
    setPage,
    pages,
    total,
    bookAppointment,
    updateStatus,
    refetch: fetchAppointments,
  };
};
