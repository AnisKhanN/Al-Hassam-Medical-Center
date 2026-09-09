import api from "./axios";

export const getAiStatus = async () => {
  const res = await api.get("/ai/status");
  return res.data;
};

export const generateVisitSummary = async (payload) => {
  const res = await api.post("/ai/visit-summary", payload);
  return res.data;
};

export const getDailyReport = async (date) => {
  const params = date ? { date } : {};
  const res = await api.get("/ai/daily-report", { params });
  return res.data;
};

export const getInventoryInsights = async () => {
  const res = await api.get("/ai/inventory-insights");
  return res.data;
};

export const getSalesAnalysis = async (timeframe = "30d") => {
  const res = await api.get("/ai/sales-analysis", { params: { timeframe } });
  return res.data;
};

export const queryAi = async (query) => {
  const res = await api.post("/ai/query", { query });
  return res.data;
};

export const getRecommendations = async () => {
  const res = await api.get("/ai/recommendations");
  return res.data;
};

export const parsePrescriptionText = async (rawText) => {
  const res = await api.post("/ai/parse-text", { rawText });
  return res.data;
};

export const getAuditLogs = async (page = 1, limit = 20) => {
  const res = await api.get("/ai/audit-logs", { params: { page, limit } });
  return res.data;
};
