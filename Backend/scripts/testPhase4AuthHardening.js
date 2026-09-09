// scripts/testPhase4AuthHardening.js
const jwt = require("jsonwebtoken");

const BASE_URL = "http://localhost:5000/api";

const testPhase4 = async () => {
  console.log("================================================================");
  console.log("PHASE 4: MULTI-TENANT AUTHENTICATION & ONBOARDING TEST SUITE");
  console.log("================================================================\n");

  let passed = 0;
  let failed = 0;

  const assert = (condition, message) => {
    if (condition) {
      console.log(`  ✅ PASS: ${message}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${message}`);
      failed++;
    }
  };

  try {
    // -------------------------------------------------------------
    // TEST 1: Tenant Registration / Self-Service Clinic Onboarding
    // -------------------------------------------------------------
    console.log("[TEST 1] Registering a New Clinic Tenant via POST /auth/register-clinic...");
    const testSlug = Date.now().toString(36);
    const apexEmail = `apex_admin_${testSlug}@testclinic.com`;
    const apexPayload = {
      clinicName: `Apex Medical Center ${testSlug}`,
      name: "Dr. Apex Lead",
      email: apexEmail,
      password: "StrongPassword123!",
      phone: "0300-1234567",
      city: "Lahore",
    };

    const regRes = await fetch(`${BASE_URL}/auth/register-clinic`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(apexPayload),
    });
    const regData = await regRes.json();

    assert(regRes.status === 201, `Status is 201 Created (got ${regRes.status})`);
    assert(regData.success === true, "Response success is true");
    assert(Boolean(regData.token), "JWT token is returned");
    assert(regData.data?.role === "Admin", "User role is Admin");
    assert(regData.data?.isClinicOwner === true, "User is flagged as clinic owner");
    assert(Boolean(regData.data?.clinicId), `Clinic ID assigned: ${regData.data?.clinicId}`);

    const apexToken = regData.token;
    const apexClinicId = regData.data?.clinicId;

    // -------------------------------------------------------------
    // TEST 2: Verify JWT Claims Contain Tenant Identifiers
    // -------------------------------------------------------------
    console.log("\n[TEST 2] Verifying Decoded JWT Token Structure...");
    const decoded = jwt.decode(apexToken);
    assert(Boolean(decoded.id), `Token contains user id (${decoded.id})`);
    assert(decoded.clinicId === apexClinicId, `Token contains matching clinicId (${decoded.clinicId})`);
    assert(decoded.role === "Admin", `Token contains role (${decoded.role})`);

    // -------------------------------------------------------------
    // TEST 3: Tenant Profile Verification via /auth/clinic and /auth/me
    // -------------------------------------------------------------
    console.log("\n[TEST 3] Fetching Tenant Profile (/auth/clinic & /auth/me)...");
    const clinicRes = await fetch(`${BASE_URL}/auth/clinic`, {
      headers: { Authorization: `Bearer ${apexToken}` },
    });
    const clinicData = await clinicRes.json();
    assert(clinicRes.status === 200, "GET /auth/clinic returned 200 OK");
    assert(clinicData.data?._id === apexClinicId, "Clinic ID matches tenant identity");
    assert(clinicData.data?.subscriptionPlan === "basic", "Initial subscription is 'basic'");

    const meRes = await fetch(`${BASE_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${apexToken}` },
    });
    const meData = await meRes.json();
    assert(meRes.status === 200, "GET /auth/me returned 200 OK");
    assert(meData.data?.email === apexEmail, `Email in /auth/me is ${apexEmail}`);
    assert(meData.data?.clinicId === apexClinicId, "clinicId in /auth/me matches tenant");

    // -------------------------------------------------------------
    // TEST 4: Seeded Admin Login (Primary Tenant)
    // -------------------------------------------------------------
    console.log("\n[TEST 4] Authenticating Existing Default Clinic Admin...");
    let primaryLoginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "admin@clinic.com",
        password: "ChangeMe123",
      }),
    });
    let primaryData = await primaryLoginRes.json();
    assert(primaryLoginRes.status === 200, "Primary admin login succeeded with 200 OK");
    const primaryToken = primaryData.token;
    const primaryClinicId = primaryData.data?.clinicId;
    assert(primaryClinicId !== apexClinicId, `Tenants are distinct (Primary: ${primaryClinicId}, Apex: ${apexClinicId})`);

    // -------------------------------------------------------------
    // TEST 5: Tenant-Scoped User Provisioning by Apex Admin
    // -------------------------------------------------------------
    console.log("\n[TEST 5] Apex Admin creates a Doctor staff account...");
    const doctorEmail = `dr_tariq_${testSlug}@testclinic.com`;
    const createDocRes = await fetch(`${BASE_URL}/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apexToken}`,
      },
      body: JSON.stringify({
        name: "Dr. Tariq Apex",
        email: doctorEmail,
        password: "DoctorPassword123!",
        role: "Doctor",
      }),
    });
    const docData = await createDocRes.json();
    assert(createDocRes.status === 201, `Doctor created with 201 Created (got ${createDocRes.status})`);
    assert(docData.data?.clinicId === apexClinicId, "New Doctor belongs strictly to Apex clinicId");

    // -------------------------------------------------------------
    // TEST 6: Authenticating Newly Created Staff Member
    // -------------------------------------------------------------
    console.log("\n[TEST 6] Newly Created Staff (Doctor) Logs in...");
    const docLoginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: doctorEmail,
        password: "DoctorPassword123!",
      }),
    });
    const docLoginData = await docLoginRes.json();
    assert(docLoginRes.status === 200, "Doctor login succeeded with 200 OK");
    const doctorToken = docLoginData.token;
    assert(docLoginData.data?.clinicId === apexClinicId, "Doctor session inherits Apex clinicId");

    // -------------------------------------------------------------
    // TEST 7: Cross-Tenant User Isolation
    // -------------------------------------------------------------
    console.log("\n[TEST 7] Cross-Tenant User Isolation Check...");
    const primaryUsersRes = await fetch(`${BASE_URL}/users`, {
      headers: { Authorization: `Bearer ${primaryToken}` },
    });
    const primaryUsersData = await primaryUsersRes.json();
    const primaryHasApexDoc = (primaryUsersData.data || []).some(
      (u) => u.email === doctorEmail,
    );
    assert(!primaryHasApexDoc, "Primary tenant CANNOT see Apex Doctor in user listing");

    const apexUsersRes = await fetch(`${BASE_URL}/users`, {
      headers: { Authorization: `Bearer ${apexToken}` },
    });
    const apexUsersData = await apexUsersRes.json();
    const apexHasPrimaryAdmin = (apexUsersData.data || []).some(
      (u) => u.email === "admin@clinic.com",
    );
    assert(!apexHasPrimaryAdmin, "Apex tenant CANNOT see Primary Admin in user listing");
    assert((apexUsersData.data || []).length === 2, `Apex tenant has exactly 2 users (Admin + Doctor, got ${(apexUsersData.data || []).length})`);

    // -------------------------------------------------------------
    // TEST 8: Cross-Tenant Data Isolation (Patient Creation & Listing)
    // -------------------------------------------------------------
    console.log("\n[TEST 8] Cross-Tenant Patient Isolation Check...");
    // Apex admin registers a patient (Admin & Receptionist are authorized)
    const createPatientRes = await fetch(`${BASE_URL}/patients`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apexToken}`,
      },
      body: JSON.stringify({
        fullName: `Apex Patient ${testSlug}`,
        age: 34,
        gender: "male",
        phone: "0333-7778899",
      }),
    });
    const patientData = await createPatientRes.json();
    assert(createPatientRes.status === 201, `Apex admin registered patient (Status ${createPatientRes.status})`);
    const apexPatientId = patientData.data?._id;
    const apexCustomPatientId = patientData.data?.patientId;
    assert(apexCustomPatientId === "PT-000001", `New tenant patient sequence starts at PT-000001 (got ${apexCustomPatientId})`);

    // Primary clinic queries patients
    const primaryPatientsRes = await fetch(`${BASE_URL}/patients`, {
      headers: { Authorization: `Bearer ${primaryToken}` },
    });
    const primaryPatientsData = await primaryPatientsRes.json();
    const primaryHasApexPatient = (primaryPatientsData.data || []).some(
      (p) => p._id === apexPatientId || p.patientId === apexCustomPatientId,
    );
    assert(!primaryHasApexPatient, "Primary clinic patient list DOES NOT leak Apex tenant's patient");

    // Apex clinic queries patients (via Doctor token)
    const apexPatientsRes = await fetch(`${BASE_URL}/patients`, {
      headers: { Authorization: `Bearer ${doctorToken}` },
    });
    const apexPatientsData = await apexPatientsRes.json();
    assert(apexPatientsData.count === 1, `Apex clinic doctor sees exactly 1 patient (got ${apexPatientsData.count})`);

    // Primary clinic attempts to directly fetch Apex patient by ID -> should return 404
    const directFetchRes = await fetch(`${BASE_URL}/patients/${apexPatientId}`, {
      headers: { Authorization: `Bearer ${primaryToken}` },
    });
    assert(directFetchRes.status === 404, `Cross-tenant direct GET /patients/:id returns 404 Not Found (got ${directFetchRes.status})`);

    // -------------------------------------------------------------
    // TEST 9: Duplicate Email Registration Protection
    // -------------------------------------------------------------
    console.log("\n[TEST 9] Duplicate Registration Rejection Check...");
    const dupRes = await fetch(`${BASE_URL}/auth/register-clinic`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(apexPayload),
    });
    assert(dupRes.status === 409, `Duplicate email registration rejected with 409 Conflict (got ${dupRes.status})`);

    // -------------------------------------------------------------
    // TEST 10: Invalid Credentials Rejection
    // -------------------------------------------------------------
    console.log("\n[TEST 10] Invalid Credentials Rejection Check...");
    const badLoginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: apexEmail,
        password: "WrongPassword999!",
      }),
    });
    assert(badLoginRes.status === 401, `Invalid password rejected with 401 Unauthorized (got ${badLoginRes.status})`);

    console.log("\n================================================================");
    console.log(`SUMMARY: ${passed} PASSED, ${failed} FAILED across all Phase 4 checks.`);
    console.log("================================================================\n");

    if (failed > 0) {
      process.exit(1);
    }
  } catch (err) {
    console.error("Test execution encountered an error:", err);
    process.exit(1);
  }
};

testPhase4();
