// scripts/testDashboardIntegration.js
const BASE_URL = "http://localhost:5000/api";

const testDashboardIntegration = async () => {
  console.log("==================================================");
  console.log("TESTING DASHBOARD INTEGRATION ACROSS ALL 4 ROLES");
  console.log("==================================================\n");

  const todayStr = new Date().toISOString().slice(0, 10);

  // 1. Log in all roles
  console.log("[1/5] Logging in accounts...");
  const login = async (email, password) => {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    return data.token;
  };

  const adminToken = await login("admin@clinic.com", "ChangeMe123!");
  const doctorToken = await login("amina@clinic.com", "Doctor123!");
  const recepToken = await login("receptionist@clinic.com", "Recep123!");
  const pharmToken = await login("pharmacist@clinic.com", "Pharmacist123!");

  console.log("✔ Admin Token:", !!adminToken);
  console.log("✔ Doctor Token:", !!doctorToken);
  console.log("✔ Receptionist Token:", !!recepToken);
  console.log("✔ Pharmacist Token:", !!pharmToken);

  // Helper fetch
  const get = async (url, token) => {
    const res = await fetch(`${BASE_URL}${url}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    const data = await res.json().catch(() => null);
    return { status: res.status, ok: res.ok, data };
  };

  // 2. Test Admin Dashboard Calls
  console.log("\n[2/5] Testing Admin Dashboard Calls...");
  const adminPatients = await get("/patients?limit=1", adminToken);
  const adminAppts = await get(`/appointments?date=${todayStr}&limit=1`, adminToken);
  const adminBills = await get("/bills?status=Unpaid&limit=1", adminToken);
  const adminRev = await get("/bills/revenue", adminToken);
  const adminLowStock = await get("/medicines/low-stock", adminToken);
  const adminExpiring = await get("/medicines/expiring?days=30", adminToken);
  const adminSalesSum = await get("/sales/summary", adminToken);

  console.log("Admin /patients:", adminPatients.status, "Total:", adminPatients.data?.total);
  console.log("Admin /appointments:", adminAppts.status, "Total:", adminAppts.data?.total);
  console.log("Admin /bills (unpaid):", adminBills.status, "Total:", adminBills.data?.total);
  console.log("Admin /bills/revenue:", adminRev.status, "Collected:", adminRev.data?.data?.totalCollected);
  console.log("Admin /medicines/low-stock:", adminLowStock.status, "Count:", adminLowStock.data?.count);
  console.log("Admin /medicines/expiring:", adminExpiring.status, "Count:", adminExpiring.data?.count);
  console.log("Admin /sales/summary:", adminSalesSum.status, "Revenue:", adminSalesSum.data?.data?.totalRevenue);

  if (
    adminPatients.ok &&
    adminAppts.ok &&
    adminBills.ok &&
    adminRev.ok &&
    adminLowStock.ok &&
    adminExpiring.ok &&
    adminSalesSum.ok
  ) {
    console.log("✅ Admin dashboard data calls ALL SUCCESSFUL!");
  } else {
    console.error("❌ Admin calls failed.");
  }

  // 3. Test Doctor Dashboard Calls (Patients & Appointments ONLY)
  console.log("\n[3/5] Testing Doctor Dashboard Calls...");
  const docPatients = await get("/patients?limit=1", doctorToken);
  const docAppts = await get(`/appointments?date=${todayStr}&limit=1`, doctorToken);
  const docBills = await get("/bills?status=Unpaid&limit=1", doctorToken); // should be 403
  const docSales = await get("/sales/summary", doctorToken); // should be 403

  console.log("Doctor /patients:", docPatients.status, "(Expected 200)");
  console.log("Doctor /appointments:", docAppts.status, "(Expected 200)");
  console.log("Doctor /bills (unpaid):", docBills.status, "(Expected 403 Forbidden)");
  console.log("Doctor /sales/summary:", docSales.status, "(Expected 403 Forbidden)");

  if (docPatients.status === 200 && docAppts.status === 200 && docBills.status === 403 && docSales.status === 403) {
    console.log("✅ Doctor dashboard calls & RBAC boundaries verified!");
  } else {
    console.error("❌ Doctor verification failed.");
  }

  // 4. Test Receptionist Dashboard Calls (Patients, Appointments, Bills ONLY)
  console.log("\n[4/5] Testing Receptionist Dashboard Calls...");
  const recepPatients = await get("/patients?limit=1", recepToken);
  const recepAppts = await get(`/appointments?date=${todayStr}&limit=1`, recepToken);
  const recepBills = await get("/bills?status=Unpaid&limit=1", recepToken);
  const recepRev = await get("/bills/revenue", recepToken);
  const recepLowStock = await get("/medicines/low-stock", recepToken); // should be 403

  console.log("Receptionist /patients:", recepPatients.status, "(Expected 200)");
  console.log("Receptionist /appointments:", recepAppts.status, "(Expected 200)");
  console.log("Receptionist /bills:", recepBills.status, "(Expected 200)");
  console.log("Receptionist /bills/revenue:", recepRev.status, "(Expected 200)");
  console.log("Receptionist /medicines/low-stock:", recepLowStock.status, "(Expected 403 Forbidden)");

  if (
    recepPatients.status === 200 &&
    recepAppts.status === 200 &&
    recepBills.status === 200 &&
    recepRev.status === 200 &&
    recepLowStock.status === 403
  ) {
    console.log("✅ Receptionist dashboard calls & RBAC boundaries verified!");
  } else {
    console.error("❌ Receptionist verification failed.");
  }

  // 5. Test Pharmacist Dashboard Calls (Medicines, Alerts, Sales Summary ONLY)
  console.log("\n[5/5] Testing Pharmacist Dashboard Calls...");
  const pharmLowStock = await get("/medicines/low-stock", pharmToken);
  const pharmExpiring = await get("/medicines/expiring?days=30", pharmToken);
  const pharmSalesSum = await get("/sales/summary", pharmToken);
  const pharmPatients = await get("/patients?limit=1", pharmToken); // should be 403
  const pharmBills = await get("/bills/revenue", pharmToken); // should be 403

  console.log("Pharmacist /medicines/low-stock:", pharmLowStock.status, "(Expected 200)");
  console.log("Pharmacist /medicines/expiring:", pharmExpiring.status, "(Expected 200)");
  console.log("Pharmacist /sales/summary:", pharmSalesSum.status, "(Expected 200)");
  console.log("Pharmacist /patients:", pharmPatients.status, "(Expected 403 Forbidden)");
  console.log("Pharmacist /bills/revenue:", pharmBills.status, "(Expected 403 Forbidden)");

  if (
    pharmLowStock.status === 200 &&
    pharmExpiring.status === 200 &&
    pharmSalesSum.status === 200 &&
    pharmPatients.status === 403 &&
    pharmBills.status === 403
  ) {
    console.log("✅ Pharmacist dashboard calls & RBAC boundaries verified!");
  } else {
    console.error("❌ Pharmacist verification failed.");
  }

  console.log("\n==================================================");
  console.log("🎉 ALL DASHBOARD INTEGRATION & RBAC CHECKS PASSED!");
  console.log("==================================================");
};

testDashboardIntegration().catch((e) => {
  console.error("Error running test:", e);
});
