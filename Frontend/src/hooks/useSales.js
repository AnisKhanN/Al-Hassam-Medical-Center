import { useState, useCallback, useEffect } from "react";
import api from "../api/axios";

export const useSales = (filters = {}) => {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const filterKey = JSON.stringify(filters);

  const fetchSales = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await api.get("/sales", {
        params: { ...filters, page, limit: 15 },
      });
      setSales(data.data || []);
      setPages(data.pages || 1);
      setTotal(data.total || 0);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load sales");
      setSales([]);
      setPages(1);
      setTotal(0);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterKey, page]);

  useEffect(() => {
    fetchSales();
  }, [fetchSales]);

  // Reset to page 1 whenever filters change
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    setPage(1);
  }, [filterKey]);

  const createSale = async (payload) => {
    const { data } = await api.post("/sales", payload);
    await fetchSales();
    return data.data;
  };

  const voidSale = async (id, payload) => {
    const { data } = await api.patch(`/sales/${id}/void`, payload);
    setSales((prev) => prev.map((s) => (s._id === id ? data.data : s)));
    return data.data;
  };

  return {
    sales,
    loading,
    error,
    page,
    setPage,
    pages,
    total,
    createSale,
    voidSale,
    refetch: fetchSales,
  };
};
