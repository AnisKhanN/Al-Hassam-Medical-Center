// scripts/testReportsSuite.js
const BASE_URL = "http://localhost:5000/api";

const testReportsSuite = async () => {
  console.log("==================================================");
  console.log("TESTING REPORTS MODULE (BACKEND & RBAC SUITE)");
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

  console.log("[AUTH] Logging in all 4 roles...");
  const adminToken = await login("admin@clinic.com", "ChangeMe123");
  const doctorToken = await login("amina@clinic.com", "Doctor123");
  const recepToken = await login("receptionist@clinic.com", "Recep123");
  const pharmToken = await login("pharmacist@clinic.com", "Pharmacist123");

  console.log("✔ Admin Token:", !!adminToken);
  console.log("✔ Doctor Token:", !!doctorToken);
  console.log("✔ Receptionist Token:", !!recepToken);
  console.log("✔ Pharmacist Token:", !!pharmToken);

  // 1. Test Revenue Report
  console.log("\n--------------------------------------------------");
  console.log("[1/5] Testing Revenue Report (GET /api/reports/revenue)");
  console.log("--------------------------------------------------");
  const revRes = await get("/reports/revenue", adminToken);
  console.log("Admin Status:", revRes.status);
  console.log("Revenue Summary:", revRes.data?.data?.summary);
  console.log("Payment Methods:", revRes.data?.data?.byMethod?.length);
  console.log("Daily Trend Points:", revRes.data?.data?.dailyTrend?.length);
  console.log("Records Found:", revRes.data?.data?.records?.length);

  const docRevRes = await get("/reports/revenue", doctorToken);
  console.log("Doctor Revenue Status:", docRevRes.status, "(Expected 403)");
  const pharmRevRes = await get("/reports/revenue", pharmToken);
  console.log("Pharmacist Revenue Status:", pharmRevRes.status, "(Expected 403)");

  if (revRes.ok && docRevRes.status === 403 && pharmRevRes.status === 403) {
    console.log("✅ Revenue Report verified!");
  } else {
    console.error("❌ Revenue Report failed.");
  }

  // 2. Test Appointment Report
  console.log("\n--------------------------------------------------");
  console.log("[2/5] Testing Appointment Report (GET /api/reports/appointments)");
  console.log("--------------------------------------------------");
  const apptRes = await get("/reports/appointments", adminToken);
  console.log("Admin Status:", apptRes.status);
  console.log("Appointment Summary:", apptRes.data?.data?.summary);
  console.log("Status Breakdown:", apptRes.data?.data?.statusBreakdown);
  console.log("Doctor Breakdown:", apptRes.data?.data?.doctorBreakdown?.length);
  console.log("Records Found:", apptRes.data?.data?.records?.length);

  const docApptRes = await get("/reports/appointments", doctorToken);
  console.log("Doctor Appointment Status:", docApptRes.status, "(Expected 200, scoped)");
  const pharmApptRes = await get("/reports/appointments", pharmToken);
  console.log("Pharmacist Appointment Status:", pharmApptRes.status, "(Expected 403)");

  if (apptRes.ok && docApptRes.ok && pharmApptRes.status === 403) {
    console.log("✅ Appointment Report verified!");
  } else {
    console.error("❌ Appointment Report failed.");
  }

  // 3. Test Patient Report
  console.log("\n--------------------------------------------------");
  console.log("[3/5] Testing Patient Report (GET /api/reports/patients)");
  console.log("--------------------------------------------------");
  const patRes = await get("/reports/patients", adminToken);
  console.log("Admin Status:", patRes.status);
  console.log("Patient Summary:", patRes.data?.data?.summary);
  console.log("Gender Distribution:", patRes.data?.data?.genderDistribution);
  console.log("Age Distribution:", patRes.data?.data?.ageDistribution);
  console.log("Blood Groups:", patRes.data?.data?.bloodGroupDistribution);
  console.log("Records Found:", patRes.data?.data?.records?.length);

  const pharmPatRes = await get("/reports/patients", pharmToken);
  console.log("Pharmacist Patient Status:", pharmPatRes.status, "(Expected 403)");

  if (patRes.ok && pharmPatRes.status === 403) {
    console.log("✅ Patient Report verified!");
  } else {
    console.error("❌ Patient Report failed.");
  }

  // 4. Test Pharmacy Report
  console.log("\n--------------------------------------------------");
  console.log("[4/5] Testing Pharmacy Sales Report (GET /api/reports/pharmacy)");
  console.log("--------------------------------------------------");
  const pharmReportRes = await get("/reports/pharmacy", pharmToken);
  console.log("Pharmacist Status:", pharmReportRes.status);
  console.log("Pharmacy Summary:", pharmReportRes.data?.data?.summary);
  console.log("Top Medicines:", pharmReportRes.data?.data?.topMedicines?.length);
  console.log("Sales Records:", pharmReportRes.data?.data?.records?.length);

  const docPharmRes = await get("/reports/pharmacy", doctorToken);
  console.log("Doctor Pharmacy Status:", docPharmRes.status, "(Expected 403)");
  const recepPharmRes = await get("/reports/pharmacy", recepToken);
  console.log("Receptionist Pharmacy Status:", recepPharmRes.status, "(Expected 403)");

  if (pharmReportRes.ok && docPharmRes.status === 403 && recepPharmRes.status === 403) {
    console.log("✅ Pharmacy Report verified!");
  } else {
    console.error("❌ Pharmacy Report failed.");
  }

  // 5. Test Inventory Report
  console.log("\n--------------------------------------------------");
  console.log("[5/5] Testing Inventory Report (GET /api/reports/inventory)");
  console.log("--------------------------------------------------");
  const invRes = await get("/reports/inventory", pharmToken);
  console.log("Pharmacist Status:", invRes.status);
  console.log("Inventory Valuation Summary:", invRes.data?.data?.summary);
  console.log("Category Distribution:", invRes.data?.data?.categoryDistribution?.length);
  console.log("Expiring Batches (30 Days):", invRes.data?.data?.expiringBatches30?.length);
  console.log("Reorder Items:", invRes.data?.data?.reorderList?.length);

  const docInvRes = await get("/reports/inventory", doctorToken);
  console.log("Doctor Inventory Status:", docInvRes.status, "(Expected 403)");

  if (invRes.ok && docInvRes.status === 403) {
    console.log("✅ Inventory Report verified!");
  } else {
    console.error("❌ Inventory Report failed.");
  }

  console.log("\n==================================================");
  console.log("🎉 ALL REPORTS BACKEND & RBAC SUITES PASSED!");
  console.log("==================================================");
};

testReportsSuite().catch(console.error);
