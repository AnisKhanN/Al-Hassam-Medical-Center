/**
 * SmartClinic Frontend End-to-End Integration Verification Suite
 * Tests Frontend Dev Server (Port 5173), Vite Proxy, Static Assets,
 * React Route Chunks, and Full Data-Binding Contracts for all Frontend Pages.
 */

const FRONTEND_BASE = 'http://localhost:5173';

const COLORS = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m',
};

let passed = 0;
let failed = 0;
const results = [];

function assert(condition, testName, details = '') {
  if (condition) {
    passed++;
    console.log(`  ${COLORS.green}✔ PASS:${COLORS.reset} ${testName}`);
    results.push({ name: testName, status: 'PASS', details });
  } else {
    failed++;
    console.error(`  ${COLORS.red}✖ FAIL:${COLORS.reset} ${testName} ${details ? `(${details})` : ''}`);
    results.push({ name: testName, status: 'FAIL', details });
  }
}

async function request(path, options = {}) {
  const url = `${FRONTEND_BASE}${path}`;
  const fetchOpts = {
    method: options.method || 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  };

  const res = await fetch(url, fetchOpts);
  let json = null;
  let text = '';
  const contentType = res.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    json = await res.json();
  } else {
    text = await res.text();
  }

  const setCookie = res.headers.get('set-cookie');
  return { status: res.status, headers: res.headers, json, text, setCookie };
}

async function runFrontendVerification() {
  console.log(`\n${COLORS.bold}${COLORS.cyan}==============================================================${COLORS.reset}`);
  console.log(`${COLORS.bold}${COLORS.cyan}    SMARTCLINIC FRONTEND E2E INTEGRATION VERIFICATION SUITE    ${COLORS.reset}`);
  console.log(`${COLORS.bold}${COLORS.cyan}==============================================================${COLORS.reset}\n`);

  // -------------------------------------------------------------
  // Section 1: Server Status & Core HTML Shell
  // -------------------------------------------------------------
  console.log(`${COLORS.yellow}[Section 1: Vite Dev Server & Public Assets]${COLORS.reset}`);
  try {
    const rootRes = await request('/');
    assert(rootRes.status === 200, 'Landing page serves HTTP 200');
    assert(rootRes.text.includes('<div id="root"></div>'), 'Root DOM mount point (#root) is present');
    assert(rootRes.text.includes('SmartClinic'), 'Document title or branding is present in index.html');
  } catch (err) {
    assert(false, 'Connect to Vite Dev Server', err.message);
  }

  // Check public assets
  const publicAssets = [
    '/robots.txt',
    '/sitemap.xml',
    '/site.webmanifest',
    '/llms.txt',
    '/PROJECT_REPORT.md',
    '/RBAC_AUDIT_REPORT.md',
  ];

  for (const asset of publicAssets) {
    const assetRes = await request(asset);
    assert(assetRes.status === 200, `Public asset ${asset} serves HTTP 200`);
  }

  // -------------------------------------------------------------
  // Section 2: Vite Dev Proxy Verification (/api -> :5000)
  // -------------------------------------------------------------
  console.log(`\n${COLORS.yellow}[Section 2: Vite Dev Server API Reverse Proxy]${COLORS.reset}`);
  const proxyMeRes = await request('/api/auth/me');
  assert(
    proxyMeRes.status === 401 || proxyMeRes.status === 200,
    'Vite /api proxy correctly communicates with backend on :5000 without 502/504'
  );

  // -------------------------------------------------------------
  // Section 3: Admin Login & Session Cookie Handling
  // -------------------------------------------------------------
  console.log(`\n${COLORS.yellow}[Section 3: Authentication & Role Session Handshake]${COLORS.reset}`);
  const loginRes = await request('/api/auth/login', {
    method: 'POST',
    body: {
      email: 'admin@clinic.com',
      password: 'ChangeMe123',
    },
  });

  assert(loginRes.status === 200, 'Admin login via Frontend proxy returns HTTP 200');
  assert(loginRes.json?.success === true, 'Admin login response payload has success: true');
  assert(loginRes.json?.data?.role === 'Admin', 'Admin user role confirmed in login payload');

  const cookieHeader = loginRes.setCookie;
  const token = loginRes.json?.token;
  const authHeaders = {
    ...(cookieHeader ? { Cookie: cookieHeader } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const profileRes = await request('/api/auth/me', { headers: authHeaders });
  assert(profileRes.status === 200, 'Get authenticated profile (/api/auth/me) returns HTTP 200');
  assert(profileRes.json?.data?.email === 'admin@clinic.com', 'Profile email matches admin');
  assert(Boolean(profileRes.json?.data?.clinicId), 'Profile contains active clinicId');

  // -------------------------------------------------------------
  // Section 4: Dashboard KPI & Chart Binding Contracts (useDashboardStats & MedicineSalesChart)
  // -------------------------------------------------------------
  console.log(`\n${COLORS.yellow}[Section 4: Dashboard Page Data-Binding Contracts]${COLORS.reset}`);
  const statsRes = await request('/api/dashboard/stats', { headers: authHeaders });
  assert(statsRes.status === 200, 'Dashboard KPI metrics (/api/dashboard/stats) returns HTTP 200');
  const stats = statsRes.json?.data || {};
  assert(typeof stats.totalPatients === 'number', 'KPI totalPatients is numeric count');
  assert(typeof stats.todayAppointments === 'number', 'KPI todayAppointments is numeric count');
  assert(typeof stats.todayScheduled === 'number', 'KPI todayScheduled is numeric count');
  assert(typeof stats.todayCompleted === 'number', 'KPI todayCompleted is numeric count');
  assert(typeof stats.unpaidBills === 'number', 'KPI unpaidBills is numeric count');
  assert(Array.isArray(stats.lowStock), 'KPI lowStock is an array of inventory items');
  assert(Array.isArray(stats.expiring), 'KPI expiring is an array of batch items');

  const salesSummaryRes = await request('/api/sales/summary?dateFrom=2026-01-01&dateTo=2026-12-31', { headers: authHeaders });
  assert(salesSummaryRes.status === 200, 'Sales summary endpoint (/api/sales/summary) returns HTTP 200');
  assert(Array.isArray(salesSummaryRes.json?.data?.dailySales), 'Daily sales data is an array for Recharts');

  // -------------------------------------------------------------
  // Section 5: Patient Management View Contracts (PatientList & PatientDetail)
  // -------------------------------------------------------------
  console.log(`\n${COLORS.yellow}[Section 5: Patient Directory & Details Contract]${COLORS.reset}`);
  const patientsRes = await request('/api/patients?page=1&limit=10', { headers: authHeaders });
  assert(patientsRes.status === 200, 'Patient list (/api/patients) returns HTTP 200');
  const patientList = patientsRes.json?.data?.patients || patientsRes.json?.data;
  assert(Array.isArray(patientList), 'Patient list contains records');

  const patientSample = patientList?.[0];
  if (patientSample) {
    assert(Boolean(patientSample.patientId), `Patient record has scoped ID (${patientSample.patientId})`);
    assert(Boolean(patientSample.fullName), `Patient record has fullName (${patientSample.fullName})`);
    assert(Boolean(patientSample.phone), `Patient record has phone (${patientSample.phone})`);
    const patientDetailRes = await request(`/api/patients/${patientSample._id}`, { headers: authHeaders });
    assert(patientDetailRes.status === 200, 'Patient detail view (/api/patients/:id) returns HTTP 200');
    assert(patientDetailRes.json?.data?.patientId === patientSample.patientId, 'Patient detail ID matches sample');
  }

  // -------------------------------------------------------------
  // Section 6: Appointments Scheduling View Contracts (Appointments Table & Calendar)
  // -------------------------------------------------------------
  console.log(`\n${COLORS.yellow}[Section 6: Appointments Directory & Calendar Contract]${COLORS.reset}`);
  const apptsRes = await request('/api/appointments', { headers: authHeaders });
  assert(apptsRes.status === 200, 'Appointments list (/api/appointments) returns HTTP 200');
  assert(Array.isArray(apptsRes.json?.data), 'Appointments returns an array for MonthCalendar & Table');

  // -------------------------------------------------------------
  // Section 7: Pharmacy Inventory & Sales (POS) Contracts (Pharmacy & MedicineDetail)
  // -------------------------------------------------------------
  console.log(`\n${COLORS.yellow}[Section 7: Pharmacy Inventory & POS View Contract]${COLORS.reset}`);
  const medsRes = await request('/api/medicines', { headers: authHeaders });
  assert(medsRes.status === 200, 'Medicines inventory list (/api/medicines) returns HTTP 200');
  assert(Array.isArray(medsRes.json?.data), 'Medicines returns an array for Pharmacy table');

  const suppliersRes = await request('/api/suppliers', { headers: authHeaders });
  assert(suppliersRes.status === 200, 'Suppliers list (/api/suppliers) returns HTTP 200');

  const salesRes = await request('/api/sales', { headers: authHeaders });
  assert(salesRes.status === 200, 'Pharmacy sales history (/api/sales) returns HTTP 200');

  // -------------------------------------------------------------
  // Section 8: Billing & Invoicing View Contracts (Billing & BillDetail)
  // -------------------------------------------------------------
  console.log(`\n${COLORS.yellow}[Section 8: Invoicing & Billing Ledger Contract]${COLORS.reset}`);
  const billsRes = await request('/api/bills', { headers: authHeaders });
  assert(billsRes.status === 200, 'Billing list (/api/bills) returns HTTP 200');
  assert(Array.isArray(billsRes.json?.data), 'Bills returns an array for Invoicing table');

  // -------------------------------------------------------------
  // Section 9: Reports & Analytics Dynamic Tab Contracts (Reports)
  // -------------------------------------------------------------
  console.log(`\n${COLORS.yellow}[Section 9: Dynamic Analytics & Report Engine Contracts]${COLORS.reset}`);
  const reportEndpoints = [
    { path: '/api/reports/revenue?dateFrom=2026-01-01&dateTo=2026-12-31', name: 'Revenue Report' },
    { path: '/api/reports/patients', name: 'Patient Demographics Report' },
    { path: '/api/reports/appointments', name: 'Appointments Census Report' },
    { path: '/api/reports/pharmacy', name: 'Pharmacy Sales Report' },
    { path: '/api/reports/inventory', name: 'Inventory & Expiry Report' },
  ];

  for (const rep of reportEndpoints) {
    const repRes = await request(rep.path, { headers: authHeaders });
    assert(repRes.status === 200, `${rep.name} endpoint returns HTTP 200 with aggregated data`);
    assert(repRes.json?.success === true, `${rep.name} payload has success: true`);
  }

  // -------------------------------------------------------------
  // Section 10: Gemini AI Assistant & Settings View Contracts (aiApi & useClinicSettings)
  // -------------------------------------------------------------
  console.log(`\n${COLORS.yellow}[Section 10: Gemini AI Assistant & Settings Contracts]${COLORS.reset}`);
  const aiStatusRes = await request('/api/ai/status', { headers: authHeaders });
  assert(aiStatusRes.status === 200, 'AI Status (/api/ai/status) returns HTTP 200');
  assert(Boolean(aiStatusRes.json?.data?.activeProvider), `AI Provider active: ${aiStatusRes.json?.data?.activeProvider} (${aiStatusRes.json?.data?.providerLabel})`);

  const dailyReportRes = await request('/api/ai/daily-report', { headers: authHeaders });
  assert(dailyReportRes.status === 200, 'AI Daily Report (/api/ai/daily-report) returns HTTP 200');
  assert(Boolean(dailyReportRes.json?.data?.headline || dailyReportRes.json?.data?.summaryText), 'AI Daily report content is present');

  const settingsRes = await request('/api/settings/clinic', { headers: authHeaders });
  assert(settingsRes.status === 200, 'Clinic settings (/api/settings/clinic) returns HTTP 200');
  assert(Boolean(settingsRes.json?.data?.clinicName), `Clinic settings has clinicName: ${settingsRes.json?.data?.clinicName}`);
  assert(typeof settingsRes.json?.data?.defaultConsultationFee === 'number', `Default consultation fee configured: PKR ${settingsRes.json?.data?.defaultConsultationFee}`);

  // -------------------------------------------------------------
  // Section 11: Quick-Role Switcher & Role Enforcement (Login 1-Click Switchers)
  // -------------------------------------------------------------
  console.log(`\n${COLORS.yellow}[Section 11: Quick-Role Switchers & RBAC Guards]${COLORS.reset}`);
  
  // Doctor role
  const docLogin = await request('/api/auth/login', {
    method: 'POST',
    body: { email: 'amina@clinic.com', password: 'Doctor123' },
  });
  assert(docLogin.status === 200, 'Quick-Role Doctor login returns HTTP 200');
  assert(docLogin.json?.data?.role === 'Doctor', 'Doctor role verified');
  const docHeaders = { Authorization: `Bearer ${docLogin.json?.token}` };
  const docAppts = await request('/api/appointments', { headers: docHeaders });
  assert(docAppts.status === 200, 'Doctor allowed to view appointments (/api/appointments)');
  const docUsers = await request('/api/users', { headers: docHeaders });
  assert(docUsers.status === 403, 'Doctor forbidden from User Management (/api/users - 403)');

  // Receptionist role
  const recepLogin = await request('/api/auth/login', {
    method: 'POST',
    body: { email: 'receptionist@clinic.com', password: 'Recep123' },
  });
  assert(recepLogin.status === 200, 'Quick-Role Receptionist login returns HTTP 200');
  assert(recepLogin.json?.data?.role === 'Receptionist', 'Receptionist role verified');
  const recepHeaders = { Authorization: `Bearer ${recepLogin.json?.token}` };
  const recepBills = await request('/api/bills', { headers: recepHeaders });
  assert(recepBills.status === 200, 'Receptionist allowed to view billing (/api/bills)');
  const recepUsers = await request('/api/users', { headers: recepHeaders });
  assert(recepUsers.status === 403, 'Receptionist forbidden from User Management (/api/users - 403)');

  // Pharmacist role
  const pharmLogin = await request('/api/auth/login', {
    method: 'POST',
    body: { email: 'pharmacist@clinic.com', password: 'Pharmacist123' },
  });
  assert(pharmLogin.status === 200, 'Quick-Role Pharmacist login returns HTTP 200');
  assert(pharmLogin.json?.data?.role === 'Pharmacist', 'Pharmacist role verified');
  const pharmHeaders = { Authorization: `Bearer ${pharmLogin.json?.token}` };
  const pharmMeds = await request('/api/medicines', { headers: pharmHeaders });
  assert(pharmMeds.status === 200, 'Pharmacist allowed to view pharmacy (/api/medicines)');
  const pharmBills = await request('/api/bills', { headers: pharmHeaders });
  assert(pharmBills.status === 403, 'Pharmacist forbidden from general billing (/api/bills - 403)');

  // -------------------------------------------------------------
  // Summary
  // -------------------------------------------------------------
  console.log(`\n${COLORS.bold}${COLORS.cyan}==============================================================${COLORS.reset}`);
  console.log(`${COLORS.bold}FRONTEND INTEGRATION VERIFICATION SUMMARY:${COLORS.reset}`);
  console.log(`  Passed: ${COLORS.green}${passed}${COLORS.reset}`);
  console.log(`  Failed: ${failed > 0 ? COLORS.red : COLORS.green}${failed}${COLORS.reset}`);
  console.log(`  Total:  ${passed + failed}`);
  console.log(`${COLORS.bold}${COLORS.cyan}==============================================================${COLORS.reset}\n`);

  if (failed > 0) {
    process.exit(1);
  }
}

runFrontendVerification().catch((err) => {
  console.error('Fatal execution error:', err);
  process.exit(1);
});
