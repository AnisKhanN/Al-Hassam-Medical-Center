import { useState, useEffect, useCallback, useRef } from "react";
import api from "../api/axios";

export const useReports = (reportType, dateRange) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const activeFetchId = useRef(0);

  const fetchReport = useCallback(async () => {
    if (!reportType) return;
    const fetchId = ++activeFetchId.current;
    setLoading(true);
    setError(null);

    try {
      const params = {};
      if (dateRange?.dateFrom) params.dateFrom = dateRange.dateFrom;
      if (dateRange?.dateTo) params.dateTo = dateRange.dateTo;
      if (dateRange?.doctor) params.doctor = dateRange.doctor;

      const res = await api.get(`/reports/${reportType}`, { params });
      if (fetchId === activeFetchId.current) {
        setData(res.data.data);
      }
    } catch (err) {
      if (fetchId === activeFetchId.current) {
        setError(err.response?.data?.message || "Failed to load report data");
      }
    } finally {
      if (fetchId === activeFetchId.current) {
        setLoading(false);
      }
    }
  }, [reportType, dateRange?.dateFrom, dateRange?.dateTo, dateRange?.doctor]);

  useEffect(() => {
    fetchReport();
  }, [fetchReport]);

  return { data, loading, error, refetch: fetchReport };
};
