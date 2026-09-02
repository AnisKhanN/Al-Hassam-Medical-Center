import { useState, useCallback, useEffect } from "react";
import api from "../api/axios";

export const usePatients = (search = "") => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchPatients = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await api.get("/patients", {
        params: { search: search || undefined, page, limit: 15 },
      });
      setPatients(data.data || []);
      setPages(data.pages || 1);
      setTotal(data.total || 0);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load patients");
      setPatients([]);
      setPages(1);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [search, page]);

  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  // Whenever search changes, reset back to page 1
  useEffect(() => {
    setPage(1);
  }, [search]);

  const createPatient = async (payload) => {
    const { data } = await api.post("/patients", payload);
    await fetchPatients();
    return data.data;
  };

  const updatePatient = async (id, payload) => {
    const { data } = await api.put(`/patients/${id}`, payload);
    setPatients((prev) => prev.map((p) => (p._id === id ? data.data : p)));
    return data.data;
  };

  const archivePatient = async (id) => {
    await api.delete(`/patients/${id}`);
    setPatients((prev) => prev.filter((p) => p._id !== id));
  };

  return {
    patients,
    loading,
    error,
    page,
    setPage,
    pages,
    total,
    createPatient,
    updatePatient,
    archivePatient,
    refetch: fetchPatients,
  };
};