import { useState, useCallback, useEffect } from "react";
import api from "../api/axios";

export const useClinicSettings = () => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchSettings = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await api.get("/settings/clinic");
      setSettings(data.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load clinic settings");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const updateSettings = async (payload) => {
    const { data } = await api.put("/settings/clinic", payload);
    setSettings(data.data);
    return data.data;
  };

  return { settings, loading, error, updateSettings, refetch: fetchSettings };
};
