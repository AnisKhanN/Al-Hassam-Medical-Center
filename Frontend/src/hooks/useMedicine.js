import { useState, useCallback, useEffect } from "react";
import api from "../api/axios";

export const useMedicine = (id) => {
  const [medicine, setMedicine] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchMedicine = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError("");
    try {
      const { data } = await api.get(`/medicines/${id}`);
      setMedicine(data.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load medicine");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchMedicine();
    } else {
      setLoading(false);
    }
  }, [id, fetchMedicine]);

  const addBatch = async (payload) => {
    const { data } = await api.post(`/medicines/${id}/batches`, payload);
    setMedicine(data.data);
    return data.data;
  };

  return { medicine, loading, error, addBatch, refetch: fetchMedicine };
};
