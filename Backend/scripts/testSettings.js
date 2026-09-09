// scripts/testSettings.js
const BASE_URL = "http://localhost:5000/api";

const testSettings = async () => {
  console.log("==================================================");
  console.log("TESTING SETTINGS & CHANGE PASSWORD ENDPOINTS");
  console.log("==================================================\n");

  let adminToken = "";
  let doctorToken = "";

  // 1. Log in Admin
  console.log("[1/9] Logging in as Admin...");
  const adminLoginRes = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "admin@clinic.com", password: "ChangeMe123" }),
  });
  const adminData = await adminLoginRes.json();
  if (!adminData.token) {
    throw new Error(`Admin login failed: ${adminData.message || "No token"}`);
  }
  adminToken = adminData.token;
  console.log("✔ Admin logged in successfully.\n");

  // 2. Ensure Doctor user exists & log in as Doctor
  console.log("[2/9] Logging in as Doctor (non-Admin role)...");
  let docLoginRes = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "amina@clinic.com", password: "Doctor123" }),
  });
  let docData = await docLoginRes.json();

  if (!docData.token) {
    // Create doctor if not already seeded
    await fetch(`${BASE_URL}/users`, {
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

    docLoginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "amina@clinic.com", password: "Doctor123" }),
    });
    docData = await docLoginRes.json();
  }

  if (!docData.token) {
    throw new Error("Could not acquire Doctor token for RBAC testing.");
  }
  doctorToken = docData.token;
  console.log("✔ Doctor logged in successfully.\n");

  // 3. Non-Admin can READ clinic settings
  console.log("[3/9] GET /api/settings/clinic as Doctor (Any authenticated role)...");
  const docGetRes = await fetch(`${BASE_URL}/settings/clinic`, {
    headers: { Authorization: `Bearer ${doctorToken}` },
  });
  const docGetData = await docGetRes.json();
  console.log(`Status: ${docGetRes.status} (Expected 200)`);
  console.log("Current Clinic Name:", docGetData.data?.clinicName);
  if (docGetRes.status !== 200) {
    throw new Error("Doctor should be allowed to view clinic settings");
  }
  console.log("✔ Doctor read clinic settings successfully.\n");

  // 4. Non-Admin (Doctor) tries PUT /api/settings/clinic -> Expect 403 Forbidden
  console.log("[4/9] PUT /api/settings/clinic as Doctor (Expect 403 Forbidden)...");
  const forbiddenRes = await fetch(`${BASE_URL}/settings/clinic`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${doctorToken}`,
    },
    body: JSON.stringify({
      clinicName: "Hacked Clinic Name",
    }),
  });
  const forbiddenData = await forbiddenRes.json();
  console.log(`Status: ${forbiddenRes.status} (Expected 403)`);
  console.log("Response:", forbiddenData);
  if (forbiddenRes.status !== 403) {
    throw new Error(`Expected 403 Forbidden for non-Admin PUT, got ${forbiddenRes.status}`);
  }
  console.log("✔ Non-Admin update blocked with 403 as expected.\n");

  // 5. Admin updates Clinic Profile -> Expect 200 & Persisted
  console.log("[5/9] PUT /api/settings/clinic as Admin...");
  const updatePayload = {
    clinicName: "Smart Clinic Main Complex",
    address: "Suite 404, Health City, Islamabad",
    phone: "051-9200000",
    email: "contact@smartclinic.pk",
  };
  const updateRes = await fetch(`${BASE_URL}/settings/clinic`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${adminToken}`,
    },
    body: JSON.stringify(updatePayload),
  });
  const updateData = await updateRes.json();
  console.log(`Status: ${updateRes.status} (Expected 200)`);
  console.log("Updated Clinic Settings:", updateData.data);
  if (updateRes.status !== 200 || updateData.data?.clinicName !== updatePayload.clinicName) {
    throw new Error("Admin clinic settings update failed");
  }
  console.log("✔ Admin updated clinic settings successfully.\n");

  // 6. Verify persistence via GET /api/settings/clinic
  console.log("[6/9] GET /api/settings/clinic to verify persistence...");
  const verifyRes = await fetch(`${BASE_URL}/settings/clinic`, {
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  const verifyData = await verifyRes.json();
  console.log(`Status: ${verifyRes.status}`);
  console.log("Persisted Clinic Name:", verifyData.data?.clinicName);
  console.log("Persisted Phone:", verifyData.data?.phone);
  if (verifyData.data?.clinicName !== updatePayload.clinicName) {
    throw new Error("Persisted clinic name does not match updated value");
  }
  console.log("✔ Values persisted successfully in database.\n");

  // 7. Password change validation: Wrong current password -> Expect 401
  console.log("[7/9] PUT /api/settings/change-password with wrong current password (Expect 401)...");
  const wrongPassRes = await fetch(`${BASE_URL}/settings/change-password`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${doctorToken}`,
    },
    body: JSON.stringify({
      currentPassword: "IncorrectPassword123!",
      newPassword: "NewDoctorPassword123!",
    }),
  });
  const wrongPassData = await wrongPassRes.json();
  console.log(`Status: ${wrongPassRes.status} (Expected 401)`);
  console.log("Response:", wrongPassData);
  if (wrongPassRes.status !== 401) {
    throw new Error(`Expected 401 Unauthorized for wrong password, got ${wrongPassRes.status}`);
  }
  console.log("✔ Wrong current password rejected with 401.\n");

  // 8. Password change validation: Password < 6 chars -> Expect 400
  console.log("[8/9] PUT /api/settings/change-password with short password (< 6 chars) (Expect 400)...");
  const shortPassRes = await fetch(`${BASE_URL}/settings/change-password`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${doctorToken}`,
    },
    body: JSON.stringify({
      currentPassword: "Doctor123",
      newPassword: "123",
    }),
  });
  const shortPassData = await shortPassRes.json();
  console.log(`Status: ${shortPassRes.status} (Expected 400)`);
  console.log("Response:", shortPassData);
  if (shortPassRes.status !== 400) {
    throw new Error(`Expected 400 for short password, got ${shortPassRes.status}`);
  }
  console.log("✔ Short password rejected with 400.\n");

  // 9. Successful password change & login verification lifecycle
  console.log("[9/9] Full Password Change Lifecycle (Change -> Old login fails -> New login works -> Reset back)...");
  
  // 9a. Change password to NewDoctor123
  const changeRes = await fetch(`${BASE_URL}/settings/change-password`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${doctorToken}`,
    },
    body: JSON.stringify({
      currentPassword: "Doctor123",
      newPassword: "NewDoctor123",
    }),
  });
  const changeData = await changeRes.json();
  console.log("Password change response:", changeData);
  if (changeRes.status !== 200) {
    throw new Error("Password change failed");
  }

  // 9b. Verify old password fails to login
  const oldLoginRes = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "amina@clinic.com", password: "Doctor123" }),
  });
  console.log(`Old password login status: ${oldLoginRes.status} (Expected 401)`);
  if (oldLoginRes.status !== 401) {
    throw new Error("Old password should no longer work after change");
  }

  // 9c. Verify new password logs in successfully
  const newLoginRes = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "amina@clinic.com", password: "NewDoctor123" }),
  });
  const newLoginData = await newLoginRes.json();
  console.log(`New password login status: ${newLoginRes.status} (Expected 200)`);
  if (newLoginRes.status !== 200 || !newLoginData.token) {
    throw new Error("New password failed to authenticate");
  }
  console.log("✔ New password verified and authenticated successfully.");

  // 9d. Reset password back to Doctor123 so future tests remain idempotent
  const resetRes = await fetch(`${BASE_URL}/settings/change-password`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${newLoginData.token}`,
    },
    body: JSON.stringify({
      currentPassword: "NewDoctor123",
      newPassword: "Doctor123",
    }),
  });
  if (resetRes.status === 200) {
    console.log("✔ Password restored back to Doctor123 for test idempotency.");
  }

  console.log("\n==================================================");
  console.log("🎉 ALL 9 SETTINGS TESTING INSTRUCTIONS VERIFIED & PASSED!");
  console.log("==================================================");
};

testSettings().catch((err) => {
  console.error("❌ Test failed:", err);
  process.exit(1);
});

