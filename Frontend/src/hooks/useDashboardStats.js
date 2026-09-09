import { useState, useEffect, useCallback } from "react";
import api from "../api/axios";
import { useAuth } from "./useAuth";

const todayStr = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const useDashboardStats = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const role = user.role;
    const next = {};

    // 1. First attempt: High-performance unified aggregator endpoint
    try {
      const res = await api.get("/dashboard/stats");
      if (res.data?.success && res.data?.data) {
        const d = res.data.data;
        next.totalPatients = d.totalPatients ?? 0;
        next.todayAppointments = d.todayAppointments ?? 0;
        next.todayScheduled = d.todayScheduled ?? 0;
        next.todayCompleted = d.todayCompleted ?? 0;
        next.unpaidBills = d.unpaidBills ?? 0;
        next.lowStock = d.lowStock ?? [];
        next.expiring = d.expiring ?? [];
        setStats(next);
        setLoading(false);
        return;
      }
    } catch {
      // Graceful fallback to legacy multi-endpoint querying
    }

    // 2. Fallback: Role-scoped granular queries
    try {
      if (["Admin", "Doctor", "Receptionist"].includes(role)) {
        const [patients, todayAll, todayScheduled, todayCompleted] =
          await Promise.all([
            api.get("/patients", { params: { limit: 1 } }),
            api.get("/appointments", {
              params: { date: todayStr(), limit: 1 },
            }),
            api.get("/appointments", {
              params: { date: todayStr(), status: "Scheduled", limit: 1 },
            }),
            api.get("/appointments", {
              params: { date: todayStr(), status: "Completed", limit: 1 },
            }),
          ]);
        next.totalPatients = patients.data.total;
        next.todayAppointments = todayAll.data.total;
        next.todayScheduled = todayScheduled.data.total;
        next.todayCompleted = todayCompleted.data.total;
      }

      if (["Admin", "Receptionist"].includes(role)) {
        const unpaid = await api.get("/bills", {
          params: { status: "Unpaid", limit: 1 },
        });
        next.unpaidBills = unpaid.data.total;
      }

      if (["Admin", "Pharmacist"].includes(role)) {
        const [lowStock, expiring] = await Promise.all([
          api.get("/medicines/low-stock"),
          api.get("/medicines/expiring", { params: { days: 30 } }),
        ]);
        next.lowStock = lowStock.data.data;
        next.expiring = expiring.data.data;
      }

      setStats(next);
    } catch {
      setStats(next);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return { stats, loading, refetch: fetchStats };
};
