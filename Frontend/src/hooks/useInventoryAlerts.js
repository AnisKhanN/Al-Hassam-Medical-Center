import { useState, useCallback, useEffect } from "react";
import api from "../api/axios";

// Two lightweight, unpaginated fetches — refreshed together whenever
// something in inventory changes (a sale, a void, an archive).
export const useInventoryAlerts = () => {
  const [lowStock, setLowStock] = useState([]);
  const [expiring, setExpiring] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAlerts = useCallback(async () => {
    setLoading(true);
    try {
      const [lowStockRes, expiringRes] = await Promise.all([
        api.get("/medicines/low-stock"),
        api.get("/medicines/expiring", { params: { days: 30 } }),
      ]);
      setLowStock(lowStockRes.data.data || []);
      setExpiring(expiringRes.data.data || []);
    } catch {
      setLowStock([]);
      setExpiring([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAlerts();
  }, [fetchAlerts]);

  return { lowStock, expiring, loading, refetch: fetchAlerts };
};
