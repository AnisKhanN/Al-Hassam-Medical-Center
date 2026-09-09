const http = require("http");

async function runRbacMatrix() {
  const BASE_URL = "http://localhost:5000/api";
  const roles = [
    { role: "Admin", email: "admin@clinic.com", pass: "ChangeMe123" },
    { role: "Doctor", email: "amina@clinic.com", pass: "Doctor123" },
    {
      role: "Receptionist",
      email: "receptionist@clinic.com",
      pass: "Recep123",
    },
    {
      role: "Pharmacist",
      email: "pharmacist@clinic.com",
      pass: "Pharmacist123",
    },
  ];

  const tokens = {};
  for (const r of roles) {
    const res = await fetch(BASE_URL + "/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: r.email, password: r.pass }),
    });
    const d = await res.json();
    tokens[r.role] = d.token;
  }

  const endpoints = [
    {
      name: "GET /dashboard/stats",
      method: "GET",
      url: "/dashboard/stats",
      expected: ["Admin", "Doctor", "Receptionist", "Pharmacist"],
    },
    { name: "GET /users", method: "GET", url: "/users", expected: ["Admin"] },
    {
      name: "GET /users/doctors",
      method: "GET",
      url: "/users/doctors",
      expected: ["Admin", "Receptionist"],
    },
    {
      name: "GET /patients",
      method: "GET",
      url: "/patients",
      expected: ["Admin", "Doctor", "Receptionist"],
    },
    {
      name: "POST /patients (dummy)",
      method: "POST",
      url: "/patients",
      body: {},
      expected: ["Admin", "Receptionist"],
    },
    {
      name: "GET /appointments",
      method: "GET",
      url: "/appointments",
      expected: ["Admin", "Doctor", "Receptionist"],
    },
    {
      name: "POST /appointments (dummy)",
      method: "POST",
      url: "/appointments",
      body: {},
      expected: ["Admin", "Receptionist"],
    },
    {
      name: "GET /bills",
      method: "GET",
      url: "/bills",
      expected: ["Admin", "Receptionist"],
    },
    {
      name: "GET /medicines",
      method: "GET",
      url: "/medicines",
      expected: ["Admin", "Pharmacist"],
    },
    {
      name: "GET /sales",
      method: "GET",
      url: "/sales",
      expected: ["Admin", "Pharmacist"],
    },
    {
      name: "GET /suppliers",
      method: "GET",
      url: "/suppliers",
      expected: ["Admin", "Pharmacist"],
    },
    {
      name: "GET /reports/revenue",
      method: "GET",
      url: "/reports/revenue",
      expected: ["Admin", "Receptionist"],
    },
    {
      name: "GET /reports/patients",
      method: "GET",
      url: "/reports/patients",
      expected: ["Admin", "Doctor", "Receptionist"],
    },
    {
      name: "GET /reports/appointments",
      method: "GET",
      url: "/reports/appointments",
      expected: ["Admin", "Doctor", "Receptionist"],
    },
    {
      name: "GET /reports/pharmacy",
      method: "GET",
      url: "/reports/pharmacy",
      expected: ["Admin", "Pharmacist"],
    },
    {
      name: "GET /reports/inventory",
      method: "GET",
      url: "/reports/inventory",
      expected: ["Admin", "Pharmacist"],
    },
    {
      name: "GET /ai/status",
      method: "GET",
      url: "/ai/status",
      expected: ["Admin", "Doctor", "Receptionist", "Pharmacist"],
    },
    {
      name: "GET /ai/sales-analysis",
      method: "GET",
      url: "/ai/sales-analysis",
      expected: ["Admin"],
    },
    {
      name: "GET /ai/recommendations",
      method: "GET",
      url: "/ai/recommendations",
      expected: ["Admin"],
    },
    {
      name: "GET /ai/audit-logs",
      method: "GET",
      url: "/ai/audit-logs",
      expected: ["Admin"],
    },
    {
      name: "GET /ai/inventory-insights",
      method: "GET",
      url: "/ai/inventory-insights",
      expected: ["Admin", "Pharmacist"],
    },
    {
      name: "GET /notifications",
      method: "GET",
      url: "/notifications",
      expected: ["Admin", "Doctor", "Receptionist"],
    },
    {
      name: "GET /settings/clinic",
      method: "GET",
      url: "/settings/clinic",
      expected: ["Admin", "Doctor", "Receptionist", "Pharmacist"],
    },
    {
      name: "PUT /settings/clinic (dummy)",
      method: "PUT",
      url: "/settings/clinic",
      body: {},
      expected: ["Admin"],
    },
  ];

  console.log("=== RBAC BACKEND VERIFICATION MATRIX ===");
  let issues = 0;
  let passed = 0;

  for (const ep of endpoints) {
    process.stdout.write(`Testing ${ep.name}... `);
    let epPassed = true;
    for (const r of roles) {
      const isExpectedAllowed = ep.expected.includes(r.role);
      const res = await fetch(BASE_URL + ep.url, {
        method: ep.method,
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + tokens[r.role],
        },
        body: ep.body ? JSON.stringify(ep.body) : undefined,
      });

      // 401/403 means forbidden/rejected by auth
      // Any other status (200, 201, 400, 404) means user passed authentication & authorization gates
      const isAllowed = res.status !== 401 && res.status !== 403;
      const rbacMatch = isExpectedAllowed === isAllowed;

      if (!rbacMatch) {
        console.log(
          `\n  ❌ [MISMATCH] ${ep.name} | Role: ${r.role} | Status: ${res.status} | Expected: ${isExpectedAllowed ? "ALLOWED" : "FORBIDDEN (403)"}`,
        );
        issues++;
        epPassed = false;
      } else {
        passed++;
      }
    }
    if (epPassed) {
      console.log(`✅ OK`);
    }
  }

  console.log(
    `\nResults: ${passed} passed, ${issues} issues found across ${endpoints.length * roles.length} role checks.`,
  );
}

runRbacMatrix();
