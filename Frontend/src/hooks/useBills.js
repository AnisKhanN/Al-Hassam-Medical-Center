import { useState, useCallback, useEffect } from "react";
import api from "../api/axios";

export const useBills = (filters = {}) => {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const filterKey = JSON.stringify(filters);

  const fetchBills = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await api.get("/bills", {
        params: { ...filters, page, limit: 15 },
      });
      setBills(data.data || []);
      setPages(data.pages || 1);
      setTotal(data.total || 0);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load bills");
      setBills([]);
      setPages(1);
      setTotal(0);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterKey, page]);

  useEffect(() => {
    fetchBills();
  }, [fetchBills]);

  // Reset to page 1 whenever filters change
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    setPage(1);
  }, [filterKey]);

  const createBill = async (payload) => {
    const { data } = await api.post("/bills", payload);
    await fetchBills();
    return data.data;
  };

  return {
    bills,
    loading,
    error,
    page,
    setPage,
    pages,
    total,
    createBill,
    refetch: fetchBills,
  };
};
