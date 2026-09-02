import { useState, useCallback, useEffect } from "react";
import api from "../api/axios";

export const useMedicines = (filters = {}) => {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const filterKey = JSON.stringify(filters);

  const fetchMedicines = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await api.get("/medicines", {
        params: { ...filters, page, limit: 15 },
      });
      setMedicines(data.data || []);
      setPages(data.pages || 1);
      setTotal(data.total || 0);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load medicines");
      setMedicines([]);
      setPages(1);
      setTotal(0);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterKey, page]);

  useEffect(() => {
    fetchMedicines();
  }, [fetchMedicines]);

  // Reset to page 1 whenever filters change
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    setPage(1);
  }, [filterKey]);

  const createMedicine = async (payload) => {
    const { data } = await api.post("/medicines", payload);
    await fetchMedicines();
    return data.data;
  };

  const updateMedicine = async (id, payload) => {
    const { data } = await api.put(`/medicines/${id}`, payload);
    setMedicines((prev) => prev.map((m) => (m._id === id ? data.data : m)));
    return data.data;
  };

  const archiveMedicine = async (id) => {
    await api.delete(`/medicines/${id}`);
    setMedicines((prev) => prev.filter((m) => m._id !== id));
  };

  return {
    medicines,
    loading,
    error,
    page,
    setPage,
    pages,
    total,
    createMedicine,
    updateMedicine,
    archiveMedicine,
    refetch: fetchMedicines,
  };
};
