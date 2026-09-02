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

// Reuses existing paginated/list endpoints purely for their `total` (limit=1
// keeps the payload tiny) instead of adding new backend aggregation
// endpoints for numbers that already exist elsewhere. Only calls endpoints
// the current role is actually authorized for, so a dashboard load never
// trips a 403 — a Pharmacist never calls /patients, a Doctor never calls /bills.
export const useDashboardStats = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const role = user.role;
    const next = {};

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
    let mounted = true;
    const load = async () => {
      if (!user) return;
      setLoading(true);
      const role = user.role;
      const next = {};
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

        if (mounted) setStats(next);
      } catch {
        if (mounted) setStats(next);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, [user]);

  return { stats, loading, refetch: fetchStats };
};
