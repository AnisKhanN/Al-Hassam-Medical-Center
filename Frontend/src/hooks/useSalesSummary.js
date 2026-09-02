import { useState, useCallback, useEffect } from "react";
import api from "../api/axios";

export const useSalesSummary = (dateFrom, dateTo) => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchSummary = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await api.get("/sales/summary", {
        params: { dateFrom, dateTo },
      });
      setSummary(data.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load sales summary");
    } finally {
      setLoading(false);
    }
  }, [dateFrom, dateTo]);

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  return { summary, loading, error, refetch: fetchSummary };
};
