import { useState, useCallback, useEffect } from "react";
import api from "../api/axios";

export const usePatient = (id) => {
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchPatient = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError("");
    try {
      const { data } = await api.get(`/patients/${id}`);
      setPatient(data.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load patient");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchPatient();
    } else {
      setLoading(false);
    }
  }, [id, fetchPatient]);

  const addHistoryEntry = async (payload) => {
    const { data } = await api.post(`/patients/${id}/history`, payload);
    setPatient(data.data);
    return data.data;
  };

  return { patient, loading, error, addHistoryEntry, refetch: fetchPatient };
};
