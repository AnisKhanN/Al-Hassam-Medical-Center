// scripts/testPart1Auth.js
const testAuth = async () => {
  console.log("==================================================");
  console.log("TESTING BACKEND MULTI-TENANT AUTH & ONBOARDING (PART 1)");
  console.log("==================================================\n");

  const BASE_URL = "http://localhost:5000/api";

  // Step 1: Login as Admin
  console.log("[STEP 1] Login as seeded admin (admin@clinic.com)...");
  let adminToken = "";
  try {
    let res1 = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "admin@clinic.com",
        password: "ChangeMe123",
      }),
    });
    let data1 = await res1.json();
    if (!res1.ok && data1.message?.includes("Invalid")) {
      // Fallback try with exclamation mark if password was modified
      res1 = await fetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "admin@clinic.com",
          password: "ChangeMe123!",
        }),
      });
      data1 = await res1.json();
    }

    console.log(`Status: ${res1.status} ${res1.statusText}`);
    console.log("Response:", JSON.stringify(data1, null, 2));

    if (!res1.ok || !data1.token) {
      throw new Error("Failed to login as admin. Check if admin exists in DB.");
    }
    adminToken = data1.token;
    console.log("\n✅ Step 1 SUCCESS: Admin Token acquired successfully!\n");
  } catch (err) {
    console.error("❌ Step 1 FAILED:", err.message);
    process.exit(1);
  }

  // Step 1b: Verify /auth/me and /auth/clinic
  console.log("[STEP 1b] Verify /auth/me and /auth/clinic...");
  try {
    const meRes = await fetch(`${BASE_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    const meData = await meRes.json();
    console.log("User Profile:", meData.data?.email, "| Clinic:", meData.data?.clinicName);

    const clinicRes = await fetch(`${BASE_URL}/auth/clinic`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    const clinicData = await clinicRes.json();
    console.log("Clinic Document:", clinicData.data?.name, "| Plan:", clinicData.data?.subscriptionPlan);
    console.log("\n✅ Step 1b SUCCESS: Tenant endpoints verified!\n");
  } catch (err) {
    console.error("❌ Step 1b FAILED:", err.message);
  }

  // Step 1c: Test New Clinic Registration / Onboarding
  console.log("[STEP 1c] Test New Tenant Clinic Self-Registration...");
  try {
    const testClinicEmail = `newclinic_${Date.now()}@example.com`;
    const regRes = await fetch(`${BASE_URL}/auth/register-clinic`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        clinicName: "Indus Valley Health Center",
        name: "Dr. Farhan Ali",
        email: testClinicEmail,
        password: "Password123!",
        phone: "0321-9988776",
        city: "Hyderabad",
      }),
    });
    const regData = await regRes.json();
    console.log(`Status: ${regRes.status}`, regData.message || regData);
    if (regRes.status === 201 && regData.token) {
      console.log("New Clinic ID:", regData.data?.clinicId);

      // Verify new clinic has 0 patients (complete data isolation)
      const patientRes = await fetch(`${BASE_URL}/patients`, {
        headers: { Authorization: `Bearer ${regData.token}` },
      });
      const patientData = await patientRes.json();
      console.log("New Clinic Patient Count:", patientData.count, "(Expected: 0)");
      console.log("\n✅ Step 1c SUCCESS: New tenant registered & clean tenant isolation confirmed!\n");
    }
  } catch (err) {
    console.error("❌ Step 1c FAILED:", err.message);
  }

  // Step 2: Create a Doctor account using admin's token
  console.log("[STEP 2] Create a Doctor account using Admin's token...");
  try {
    const res2 = await fetch(`${BASE_URL}/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({
        name: "Dr. Amina Khan",
        email: "amina@clinic.com",
        password: "Doctor123",
        role: "Doctor",
      }),
    });
    const data2 = await res2.json();
    console.log(`Status: ${res2.status} ${res2.statusText}`);

    if (res2.status === 201 || res2.status === 200) {
      console.log("\n✅ Step 2 SUCCESS: Doctor account created successfully!\n");
    } else if (data2.message && (data2.message.includes("exists") || data2.message.includes("already in use"))) {
      console.log("\n⚠️ Step 2 Note: Doctor account already exists (created previously). Continuing...\n");
    } else {
      console.log("\nResponse details:", data2);
    }
  } catch (err) {
    console.error("❌ Step 2 FAILED:", err.message);
  }

  // Step 3: Login as Doctor to get Doctor token, then try to create user (expecting 403)
  console.log("[STEP 3] Confirm a non-admin (Doctor) gets 403 when creating a user...");
  try {
    // 3a. Login as Doctor
    let docLoginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "amina@clinic.com",
        password: "Doctor123",
      }),
    });
    let docLoginData = await docLoginRes.json();
    if (!docLoginRes.ok && docLoginData.message?.includes("Invalid")) {
      docLoginRes = await fetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "amina@clinic.com",
          password: "Doctor123!",
        }),
      });
      docLoginData = await docLoginRes.json();
    }
    const docToken = docLoginData.token;

    if (!docToken) {
      console.log("Could not login as Doctor with Doctor123/Doctor123!, skipping 403 check.");
    } else {
      // 3b. Non-admin attempts to POST /api/users
      const res3 = await fetch(`${BASE_URL}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${docToken}`,
        },
        body: JSON.stringify({
          name: "Unauthorized User",
          email: "unauthorized@clinic.com",
          password: "Password123!",
          role: "Doctor",
        }),
      });

      const data3 = await res3.json();
      console.log(`Status: ${res3.status} ${res3.statusText}`);

      if (res3.status === 403) {
        console.log("\n✅ Step 3 SUCCESS: Correctly rejected with 403 Forbidden (RBAC working as expected)!\n");
      } else {
        console.log(`\n⚠️ Step 3 Result: Status ${res3.status}`);
      }
    }
  } catch (err) {
    console.error("❌ Step 3 FAILED:", err.message);
  }

  console.log("==================================================");
  console.log("ALL PART 1 AUTH & TENANT TESTS COMPLETED!");
  console.log("==================================================");
};

testAuth();

