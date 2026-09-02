import { useState, useCallback, useEffect } from "react";
import api from "../api/axios";

export const useBill = (id) => {
  const [bill, setBill] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchBill = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError("");
    try {
      const { data } = await api.get(`/bills/${id}`);
      setBill(data.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load bill");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchBill();
    } else {
      setLoading(false);
    }
  }, [id, fetchBill]);

  const recordPayment = async (payload) => {
    const { data } = await api.post(`/bills/${id}/payments`, payload);
    setBill(data.data);
    return data.data;
  };

  const cancelBill = async () => {
    const { data } = await api.patch(`/bills/${id}/cancel`);
    setBill(data.data);
    return data.data;
  };

  return {
    bill,
    loading,
    error,
    recordPayment,
    cancelBill,
    refetch: fetchBill,
  };
};
