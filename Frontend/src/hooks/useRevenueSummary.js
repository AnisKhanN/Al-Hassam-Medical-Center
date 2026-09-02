import { useState, useCallback, useEffect } from "react";
import api from "../api/axios";

export const useRevenueSummary = (dateFrom, dateTo) => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchSummary = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await api.get("/bills/revenue", {
        params: { dateFrom, dateTo },
      });
      setSummary(data.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load revenue summary");
    } finally {
      setLoading(false);
    }
  }, [dateFrom, dateTo]);

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  return { summary, loading, error, refetch: fetchSummary };
};
