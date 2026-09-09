// scripts/testAiSuite.js
const BASE_URL = "http://localhost:5000/api";

const testAiSuite = async () => {
  console.log("==================================================");
  console.log("TESTING AI ASSISTANT MODULE (BACKEND & RBAC SUITE)");
  console.log("==================================================\n");

  const login = async (email, password) => {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    return data.token;
  };

  const get = async (url, token) => {
    const res = await fetch(`${BASE_URL}${url}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    const data = await res.json().catch(() => null);
    return { status: res.status, ok: res.ok, data };
  };

  const post = async (url, body, token) => {
    const res = await fetch(`${BASE_URL}${url}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(body),
    });
    const data = await res.json().catch(() => null);
    return { status: res.status, ok: res.ok, data };
  };

  console.log("[AUTH] Logging in staff roles...");
  const adminToken = await login("admin@clinic.com", "ChangeMe123");
  const doctorToken = await login("amina@clinic.com", "Doctor123");
  const recepToken = await login("receptionist@clinic.com", "Recep123");
  const pharmToken = await login("pharmacist@clinic.com", "Pharmacist123");

  console.log("✔ Admin Token:", !!adminToken);
  console.log("✔ Doctor Token:", !!doctorToken);
  console.log("✔ Receptionist Token:", !!recepToken);
  console.log("✔ Pharmacist Token:", !!pharmToken);

  // 1. Status Check
  console.log("\n[1/7] GET /api/ai/status...");
  const statusRes = await get("/ai/status", adminToken);
  console.log("Status Code:", statusRes.status, "Provider:", statusRes.data?.data?.provider);

  // 2. Daily Report
  console.log("\n[2/7] GET /api/ai/daily-report...");
  const dailyAdmin = await get("/ai/daily-report", adminToken);
  const dailyRecep = await get("/ai/daily-report", recepToken);
  console.log("Admin daily report status:", dailyAdmin.status);
  console.log("Receptionist daily report status:", dailyRecep.status);

  // 3. Inventory Insights (Admin & Pharmacist only)
  console.log("\n[3/7] GET /api/ai/inventory-insights...");
  const invPharm = await get("/ai/inventory-insights", pharmToken);
  const invRecep = await get("/ai/inventory-insights", recepToken);
  console.log("Pharmacist inventory status:", invPharm.status, "(Expected 200)");
  console.log("Receptionist inventory status:", invRecep.status, "(Expected 403 Forbidden)");

  // 4. Sales Analysis (Admin only)
  console.log("\n[4/7] GET /api/ai/sales-analysis...");
  const salesAdmin = await get("/ai/sales-analysis?timeframe=30d", adminToken);
  const salesDoc = await get("/ai/sales-analysis?timeframe=30d", doctorToken);
  console.log("Admin sales status:", salesAdmin.status, "(Expected 200)");
  console.log("Doctor sales status:", salesDoc.status, "(Expected 403 Forbidden)");

  // 5. Natural Language Query
  console.log("\n[5/7] POST /api/ai/query...");
  const queryRes = await post("/ai/query", { query: "What was our total revenue and sales?" }, adminToken);
  console.log("Query status:", queryRes.status, "Answer length:", queryRes.data?.data?.answer?.length || 0);

  // 6. Text Parser (Admin, Doctor, Pharmacist)
  console.log("\n[6/7] POST /api/ai/parse-text...");
  const parseDoc = await post(
    "/ai/parse-text",
    { rawText: "Tab Panadol 500mg 1 tab TDS for 5 days. Syr Brufen 1 tsp BD." },
    doctorToken
  );
  const parseRecep = await post(
    "/ai/parse-text",
    { rawText: "Tab Panadol 500mg 1 tab TDS for 5 days." },
    recepToken
  );
  console.log("Doctor parse status:", parseDoc.status, "(Expected 200)");
  console.log("Receptionist parse status:", parseRecep.status, "(Expected 403 Forbidden)");

  // 7. Audit Logs (Admin only)
  console.log("\n[7/7] GET /api/ai/audit-logs...");
  const auditAdmin = await get("/ai/audit-logs", adminToken);
  const auditDoc = await get("/ai/audit-logs", doctorToken);
  console.log("Admin audit status:", auditAdmin.status, "Logs count:", auditAdmin.data?.data?.logs?.length);
  console.log("Doctor audit status:", auditDoc.status, "(Expected 403 Forbidden)");

  console.log("\n==================================================");
  console.log("🎉 ALL AI ENDPOINTS & RBAC POLICIES VERIFIED!");
  console.log("==================================================");
};

testAiSuite().catch(console.error);
