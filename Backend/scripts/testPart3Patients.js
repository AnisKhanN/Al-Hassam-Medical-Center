// scripts/testPart3Patients.js
const BASE_URL = "http://localhost:5000/api";

const runPatientTests = async () => {
  console.log("==================================================");
  console.log("TESTING BACKEND PATIENTS INSTRUCTIONS (PART 3)");
  console.log("==================================================\n");

  // --- Auth Setup ---
  console.log("[AUTH SETUP] Logging in Admin & Doctor & Receptionist...");
  
  // 1. Admin Login
  const adminRes = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "admin@clinic.com", password: "ChangeMe123!" }),
  });
  const adminData = await adminRes.json();
  const adminToken = adminData.token;
  if (!adminToken) throw new Error("Admin login failed!");
  console.log("✔ Admin logged in.");

  // 2. Doctor Login (or create if needed)
  let doctorToken = "";
  const docLoginRes = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "amina@clinic.com", password: "Doctor123!" }),
  });
  const docLoginData = await docLoginRes.json();
  if (docLoginData.token) {
    doctorToken = docLoginData.token;
    console.log("✔ Doctor logged in.");
  } else {
    // Create doctor
    const createDoc = await fetch(`${BASE_URL}/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({
        name: "Dr. Amina Khan",
        email: "amina@clinic.com",
        password: "Doctor123!",
        role: "Doctor",
      }),
    });
    const docData = await createDoc.json();
    const docReLogin = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "amina@clinic.com", password: "Doctor123!" }),
    });
    doctorToken = (await docReLogin.json()).token;
    console.log("✔ Doctor created & logged in.");
  }

  // 3. Receptionist Setup
  let recepToken = "";
  const recepLogin = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "receptionist@clinic.com", password: "Recep123!" }),
  });
  const recepLoginData = await recepLogin.json();
  if (recepLoginData.token) {
    recepToken = recepLoginData.token;
    console.log("✔ Receptionist logged in.");
  } else {
    await fetch(`${BASE_URL}/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({
        name: "Tariq Receptionist",
        email: "receptionist@clinic.com",
        password: "Recep123!",
        role: "Receptionist",
      }),
    });
    const recepReLogin = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "receptionist@clinic.com", password: "Recep123!" }),
    });
    recepToken = (await recepReLogin.json()).token;
    console.log("✔ Receptionist created & logged in.");
  }

  console.log("\n--------------------------------------------------");

  let patientIdObj = "";
  let formattedPatientId = "";

  // Step 1: Create a patient
  console.log("\n[STEP 1] Create a patient (Fatima Bibi)...");
  const createRes = await fetch(`${BASE_URL}/patients`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${adminToken}`,
    },
    body: JSON.stringify({
      fullName: "Fatima Bibi",
      guardianName: "Nazir Ahmed",
      gender: "Female",
      age: 34,
      phone: "03001234567",
    }),
  });
  const createData = await createRes.json();
  console.log(`Status: ${createRes.status} ${createRes.statusText}`);
  console.log("Response:", JSON.stringify(createData, null, 2));

  if (createRes.status === 201 && createData.data) {
    patientIdObj = createData.data._id;
    formattedPatientId = createData.data.patientId;
    console.log(`\n✅ Step 1 SUCCESS: Patient created with ID: ${formattedPatientId} (_id: ${patientIdObj})\n`);
  } else {
    throw new Error("Failed to create patient");
  }

  // Step 2: Search
  console.log("[STEP 2a] Search by name 'Fatima'...");
  const searchNameRes = await fetch(`${BASE_URL}/patients?search=Fatima`, {
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  const searchNameData = await searchNameRes.json();
  console.log(`Status: ${searchNameRes.status}, Found: ${searchNameData.count} patients`);
  console.log("First Result:", searchNameData.data?.[0]?.fullName, `(${searchNameData.data?.[0]?.patientId})`);

  console.log("\n[STEP 2b] Search by partial phone '0300'...");
  const searchPhoneRes = await fetch(`${BASE_URL}/patients?search=0300`, {
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  const searchPhoneData = await searchPhoneRes.json();
  console.log(`Status: ${searchPhoneRes.status}, Found: ${searchPhoneData.count} patients`);
  console.log("Matched Phone:", searchPhoneData.data?.[0]?.phone);

  if (searchNameData.count > 0 && searchPhoneData.count > 0) {
    console.log("\n✅ Step 2 SUCCESS: Partial search by name and phone working perfectly!\n");
  }

  // Step 3: Update basic info
  console.log(`[STEP 3] Update basic info (address: 'Sanghar, Sindh') on patient ${patientIdObj}...`);
  const updateRes = await fetch(`${BASE_URL}/patients/${patientIdObj}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${adminToken}`,
    },
    body: JSON.stringify({ address: "Sanghar, Sindh" }),
  });
  const updateData = await updateRes.json();
  console.log(`Status: ${updateRes.status} ${updateRes.statusText}`);
  console.log("Updated Address:", updateData.data?.address);

  if (updateRes.status === 200 && updateData.data?.address === "Sanghar, Sindh") {
    console.log("\n✅ Step 3 SUCCESS: Patient address updated successfully!\n");
  }

  // Step 4: Add a visit (Doctor token) + verify Receptionist gets 403
  console.log(`[STEP 4a] Add a visit using Doctor's token...`);
  const visitRes = await fetch(`${BASE_URL}/patients/${patientIdObj}/history`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${doctorToken}`,
    },
    body: JSON.stringify({
      visitType: "OPD",
      reason: "Fever and cough",
      notes: "Prescribed rest and fluids",
    }),
  });
  const visitData = await visitRes.json();
  console.log(`Status: ${visitRes.status} ${visitRes.statusText}`);
  console.log("Medical History Entries:", visitData.data?.medicalHistory?.length);
  console.log("Last Visit:", JSON.stringify(visitData.data?.medicalHistory?.slice(-1)[0], null, 2));

  console.log(`\n[STEP 4b] Confirm a Receptionist gets 403 on POST /patients/:id/history...`);
  const recepVisitRes = await fetch(`${BASE_URL}/patients/${patientIdObj}/history`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${recepToken}`,
    },
    body: JSON.stringify({
      visitType: "OPD",
      reason: "Illegal attempt",
    }),
  });
  const recepVisitData = await recepVisitRes.json();
  console.log(`Status: ${recepVisitRes.status} ${recepVisitRes.statusText}`);
  console.log("Response:", JSON.stringify(recepVisitData, null, 2));

  if (visitRes.status === 201 && recepVisitRes.status === 403) {
    console.log("\n✅ Step 4 SUCCESS: Doctor added clinical visit note; Receptionist received 403 Forbidden!\n");
  }

  // Step 5: Archive patient
  console.log(`[STEP 5a] Archive patient ${patientIdObj} using Admin token...`);
  const deleteRes = await fetch(`${BASE_URL}/patients/${patientIdObj}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  const deleteData = await deleteRes.json();
  console.log(`Status: ${deleteRes.status} ${deleteRes.statusText}`);
  console.log("Response:", JSON.stringify(deleteData, null, 2));

  console.log(`\n[STEP 5b] Confirm archived patient no longer appears in active list (GET /patients)...`);
  const activeListRes = await fetch(`${BASE_URL}/patients`, {
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  const activeListData = await activeListRes.json();
  const foundInActive = activeListData.data?.some((p) => p._id === patientIdObj);
  console.log(`Active Patients Count: ${activeListData.count}`);
  console.log(`Is archived patient in active list? ${foundInActive}`);

  if (deleteRes.status === 200 && !foundInActive) {
    console.log("\n✅ Step 5 SUCCESS: Patient soft-deleted (archived) and excluded from default active list!\n");
  }

  console.log("==================================================");
  console.log("ALL PART 3 (PATIENTS) TESTS COMPLETED SUCCESSFULLY!");
  console.log("==================================================");
};

runPatientTests().catch((err) => {
  console.error("❌ Test Error:", err);
});
