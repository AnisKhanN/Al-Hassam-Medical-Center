import { useState, useCallback, useEffect } from "react";
import api from "../api/axios.js";

export const useUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await api.get("/users");
      setUsers(data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load users");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const createUser = async (payload) => {
    const { data } = await api.post("/users", payload);
    await fetchUsers();
    return data.data;
  };

  const updateUser = async (id, payload) => {
    const { data } = await api.put(`/users/${id}`, payload);
    setUsers((prev) => prev.map((u) => (u._id === id ? data.data : u)));
    return data.data;
  };

  const deactivateUser = async (id) => {
    const { data } = await api.delete(`/users/${id}`);
    setUsers((prev) => prev.map((u) => (u._id === id ? data.data : u)));
    return data.data;
  };

  return {
    users,
    loading,
    error,
    createUser,
    updateUser,
    deactivateUser,
    refetch: fetchUsers,
  };
};
