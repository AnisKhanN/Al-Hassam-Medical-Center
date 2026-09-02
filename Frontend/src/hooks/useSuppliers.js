import { useState, useCallback, useEffect } from "react";
import api from "../api/axios";

export const useSuppliers = (search = "") => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchSuppliers = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await api.get("/suppliers", { params: { search: search || undefined } });
      setSuppliers(data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load suppliers");
      setSuppliers([]);
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    fetchSuppliers();
  }, [fetchSuppliers]);

  const createSupplier = async (payload) => {
    const { data } = await api.post("/suppliers", payload);
    await fetchSuppliers();
    return data.data;
  };

  const updateSupplier = async (id, payload) => {
    const { data } = await api.put(`/suppliers/${id}`, payload);
    setSuppliers((prev) => prev.map((s) => (s._id === id ? data.data : s)));
    return data.data;
  };

  const deactivateSupplier = async (id) => {
    await api.delete(`/suppliers/${id}`);
    setSuppliers((prev) => prev.filter((s) => s._id !== id));
  };

  return {
    suppliers,
    loading,
    error,
    createSupplier,
    updateSupplier,
    deactivateSupplier,
    refetch: fetchSuppliers,
  };
};
