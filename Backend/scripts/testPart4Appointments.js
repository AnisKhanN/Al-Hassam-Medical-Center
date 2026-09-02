// scripts/testPart4Appointments.js
const BASE_URL = "http://localhost:5000/api";

const runAppointmentTests = async () => {
  console.log("==================================================");
  console.log("TESTING BACKEND APPOINTMENTS INSTRUCTIONS (PART 4)");
  console.log("==================================================\n");

  // --- Auth & Initial Data Setup ---
  console.log("[AUTH SETUP] Logging in Admin, Doctor, and Receptionist...");

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

  // 2. Doctor Login (or create)
  let doctorToken = "";
  let doctorUser = null;
  const docLoginRes = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "amina@clinic.com", password: "Doctor123!" }),
  });
  const docLoginData = await docLoginRes.json();
  if (docLoginData.token) {
    doctorToken = docLoginData.token;
    doctorUser = docLoginData.data;
    console.log(`✔ Doctor logged in (${doctorUser?.name || 'Dr. Amina Khan'}).`);
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
    const docCreateData = await createDoc.json();
    doctorUser = docCreateData.data;

    const docReLogin = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "amina@clinic.com", password: "Doctor123!" }),
    });
    const docReLoginData = await docReLogin.json();
    doctorToken = docReLoginData.token;
    doctorUser = docReLoginData.data;
    console.log("✔ Doctor created & logged in.");
  }

  const doctorId = doctorUser?.id || doctorUser?._id;
  console.log(`Doctor ID: ${doctorId}`);

  // 3. Receptionist Login (or create)
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

  // 4. Ensure an active patient exists
  let patientId = "";
  const patListRes = await fetch(`${BASE_URL}/patients`, {
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  const patListData = await patListRes.json();
  if (patListData.data && patListData.data.length > 0) {
    patientId = patListData.data[0]._id;
    console.log(`✔ Found existing patient: ${patListData.data[0].fullName} (${patListData.data[0].patientId})`);
  } else {
    const createPatRes = await fetch(`${BASE_URL}/patients`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({
        fullName: "Zainab Bibi",
        gender: "Female",
        age: 28,
        phone: "03112233445",
      }),
    });
    const createPatData = await createPatRes.json();
    patientId = createPatData.data._id;
    console.log(`✔ Created test patient: ${createPatData.data.fullName} (${createPatData.data.patientId})`);
  }

  console.log("\n--------------------------------------------------");

  // Set up test dates (Tomorrow at 10:00 AM)
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(10, 0, 0, 0);
  const apptDate1Iso = tomorrow.toISOString();

  // Overlapping date (+15 minutes: 10:15 AM)
  const overlapDate = new Date(tomorrow.getTime() + 15 * 60 * 1000);
  const apptOverlapIso = overlapDate.toISOString();

  // Distinct future date for Appointment 2 (Tomorrow at 2:00 PM)
  const appt2Date = new Date(tomorrow);
  appt2Date.setHours(14, 0, 0, 0);
  const apptDate2Iso = appt2Date.toISOString();

  let appt1Id = "";
  let appt1Code = "";
  let appt2Id = "";

  // ==========================================
  // STEP 1: Book an appointment (30 min default)
  // ==========================================
  console.log("\n[STEP 1] Book an appointment (tomorrow 10:00 AM, 30 min default)...");
  const bookRes1 = await fetch(`${BASE_URL}/appointments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${recepToken}`,
    },
    body: JSON.stringify({
      patient: patientId,
      doctor: doctorId,
      appointmentDate: apptDate1Iso,
      reason: "Follow-up checkup",
    }),
  });
  const bookData1 = await bookRes1.json();
  console.log(`Status: ${bookRes1.status} ${bookRes1.statusText}`);
  console.log("Response:", JSON.stringify(bookData1, null, 2));

  if (bookRes1.status === 201 && bookData1.data) {
    appt1Id = bookData1.data._id;
    appt1Code = bookData1.data.appointmentId;
    console.log(`\n✅ Step 1 SUCCESS: Appointment booked with ID ${appt1Code} (_id: ${appt1Id})`);
  } else {
    throw new Error(`Step 1 failed: ${bookData1.message}`);
  }

  // ==========================================
  // STEP 2: Try booking the SAME doctor at overlapping time (10:15 AM)
  // ==========================================
  console.log("\n[STEP 2] Try booking the SAME doctor at overlapping time (10:15 AM same day)...");
  const bookConflictRes = await fetch(`${BASE_URL}/appointments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${recepToken}`,
    },
    body: JSON.stringify({
      patient: patientId,
      doctor: doctorId,
      appointmentDate: apptOverlapIso,
      reason: "Different patient",
    }),
  });
  const bookConflictData = await bookConflictRes.json();
  console.log(`Status: ${bookConflictRes.status} ${bookConflictRes.statusText}`);
  console.log("Response:", JSON.stringify(bookConflictData, null, 2));

  if (bookConflictRes.status === 409) {
    console.log(`\n✅ Step 2 SUCCESS: 409 Conflict caught correctly! ("${bookConflictData.message}")`);
  } else {
    throw new Error(`Step 2 failed: Expected 409, got ${bookConflictRes.status}`);
  }

  // ==========================================
  // STEP 3: Single day filter (?date=YYYY-MM-DD)
  // ==========================================
  const targetDateStr = tomorrow.toISOString().split("T")[0];
  console.log(`\n[STEP 3] Filter appointments for date: ${targetDateStr}...`);
  const dateFilterRes = await fetch(`${BASE_URL}/appointments?date=${targetDateStr}`, {
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  const dateFilterData = await dateFilterRes.json();
  console.log(`Status: ${dateFilterRes.status} ${dateFilterRes.statusText}`);
  console.log(`Found: ${dateFilterData.count} appointments`);
  const foundAppt1 = dateFilterData.data?.some((a) => a._id === appt1Id);
  console.log(`Is booked appointment (${appt1Code}) in the list? ${foundAppt1}`);

  if (dateFilterRes.status === 200 && foundAppt1) {
    console.log(`\n✅ Step 3 SUCCESS: Single-day filter returned scheduled appointment accurately.`);
  } else {
    throw new Error(`Step 3 failed: Appointment not found in date filter`);
  }

  // ==========================================
  // STEP 4: Calendar range (?dateFrom=...&dateTo=...)
  // ==========================================
  const startOfMonth = new Date(tomorrow.getFullYear(), tomorrow.getMonth(), 1).toISOString();
  const endOfMonth = new Date(tomorrow.getFullYear(), tomorrow.getMonth() + 1, 0, 23, 59, 59).toISOString();
  console.log(`\n[STEP 4] Query calendar range: from ${startOfMonth.split("T")[0]} to ${endOfMonth.split("T")[0]}...`);
  const rangeRes = await fetch(`${BASE_URL}/appointments?dateFrom=${startOfMonth}&dateTo=${endOfMonth}`, {
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  const rangeData = await rangeRes.json();
  console.log(`Status: ${rangeRes.status} ${rangeRes.statusText}`);
  console.log(`Count in range: ${rangeData.count}`);

  if (rangeRes.status === 200 && rangeData.count > 0) {
    console.log(`\n✅ Step 4 SUCCESS: Calendar range filter working properly.`);
  } else {
    throw new Error(`Step 4 failed`);
  }

  // ==========================================
  // STEP 5: Doctor logs in and hits list WITHOUT doctor filter
  // ==========================================
  console.log("\n[STEP 5] Doctor GET /api/appointments (without doctor filter) -> Server-side scoping test...");
  const docListRes = await fetch(`${BASE_URL}/appointments`, {
    headers: { Authorization: `Bearer ${doctorToken}` },
  });
  const docListData = await docListRes.json();
  console.log(`Status: ${docListRes.status} ${docListRes.statusText}`);
  console.log(`Doctor appointments count: ${docListData.count}`);
  const allBelongToDoctor = docListData.data.every(
    (a) => String(a.doctor?._id || a.doctor) === String(doctorId)
  );
  console.log(`All returned appointments belong to this doctor? ${allBelongToDoctor}`);

  if (docListRes.status === 200 && allBelongToDoctor) {
    console.log(`\n✅ Step 5 SUCCESS: Server-side scoping strictly enforced for doctor.`);
  } else {
    throw new Error(`Step 5 failed: Doctor saw appointments of others`);
  }

  // ==========================================
  // STEP 6: Mark completed (Assigned Doctor vs Receptionist 403)
  // ==========================================
  console.log(`\n[STEP 6a] Assigned doctor marks appointment ${appt1Id} as Completed...`);
  const completeRes = await fetch(`${BASE_URL}/appointments/${appt1Id}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${doctorToken}`,
    },
    body: JSON.stringify({
      status: "Completed",
      notes: "Recovering well",
    }),
  });
  const completeData = await completeRes.json();
  console.log(`Status: ${completeRes.status} ${completeRes.statusText}`);
  console.log("Updated Status:", completeData.data?.status, "| Notes:", completeData.data?.notes);

  if (completeRes.status === 200 && completeData.data?.status === "Completed") {
    console.log("✔ Assigned doctor successfully marked appointment as Completed.");
  } else {
    throw new Error(`Step 6a failed: ${completeData.message}`);
  }

  // Create a 2nd appointment to test Receptionist 403 on Complete
  console.log("\n[STEP 6b] Create 2nd appointment to test Receptionist 403 on Complete...");
  const bookRes2 = await fetch(`${BASE_URL}/appointments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${recepToken}`,
    },
    body: JSON.stringify({
      patient: patientId,
      doctor: doctorId,
      appointmentDate: apptDate2Iso,
      reason: "Routine checkup",
    }),
  });
  const bookData2 = await bookRes2.json();
  appt2Id = bookData2.data._id;
  console.log(`✔ Appointment 2 created: ${bookData2.data.appointmentId} (_id: ${appt2Id})`);

  console.log("\n[STEP 6c] Receptionist attempts to mark appointment 2 as Completed -> expect 403...");
  const recepCompleteRes = await fetch(`${BASE_URL}/appointments/${appt2Id}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${recepToken}`,
    },
    body: JSON.stringify({
      status: "Completed",
      notes: "Unauthorized doctor note attempt",
    }),
  });
  const recepCompleteData = await recepCompleteRes.json();
  console.log(`Status: ${recepCompleteRes.status} ${recepCompleteRes.statusText}`);
  console.log("Response:", JSON.stringify(recepCompleteData, null, 2));

  if (recepCompleteRes.status === 403) {
    console.log(`\n✅ Step 6 SUCCESS: Doctor completed with notes; Receptionist received 403 Forbidden!`);
  } else {
    throw new Error(`Step 6 failed: Expected 403 for Receptionist, got ${recepCompleteRes.status}`);
  }

  // ==========================================
  // STEP 7: Cancel — Reason Required Validation
  // ==========================================
  console.log("\n[STEP 7a] Try cancelling appointment 2 WITHOUT a cancelReason -> expect 400...");
  const cancelNoReasonRes = await fetch(`${BASE_URL}/appointments/${appt2Id}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${recepToken}`,
    },
    body: JSON.stringify({
      status: "Cancelled",
    }),
  });
  const cancelNoReasonData = await cancelNoReasonRes.json();
  console.log(`Status: ${cancelNoReasonRes.status} ${cancelNoReasonRes.statusText}`);
  console.log("Response:", JSON.stringify(cancelNoReasonData, null, 2));

  if (cancelNoReasonRes.status === 400) {
    console.log("✔ Validation caught missing cancelReason.");
  } else {
    throw new Error(`Step 7a failed: Expected 400, got ${cancelNoReasonRes.status}`);
  }

  console.log("\n[STEP 7b] Retry cancelling WITH cancelReason: 'Patient unavailable'...");
  const cancelWithReasonRes = await fetch(`${BASE_URL}/appointments/${appt2Id}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${recepToken}`,
    },
    body: JSON.stringify({
      status: "Cancelled",
      cancelReason: "Patient unavailable",
    }),
  });
  const cancelWithReasonData = await cancelWithReasonRes.json();
  console.log(`Status: ${cancelWithReasonRes.status} ${cancelWithReasonRes.statusText}`);
  console.log("Cancelled Status:", cancelWithReasonData.data?.status, "| Reason:", cancelWithReasonData.data?.cancelReason);

  if (cancelWithReasonRes.status === 200 && cancelWithReasonData.data?.status === "Cancelled") {
    console.log(`\n✅ Step 7 SUCCESS: Cancellation with reason validated and saved.`);
  } else {
    throw new Error(`Step 7b failed`);
  }

  // ==========================================
  // STEP 8: Confirm cancelled slot is now free
  // ==========================================
  console.log(`\n[STEP 8] Rebook the SAME doctor at the exact same slot (${apptDate2Iso}) of cancelled appointment...`);
  const rebookRes = await fetch(`${BASE_URL}/appointments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${recepToken}`,
    },
    body: JSON.stringify({
      patient: patientId,
      doctor: doctorId,
      appointmentDate: apptDate2Iso,
      reason: "Rebooking cancelled slot",
    }),
  });
  const rebookData = await rebookRes.json();
  console.log(`Status: ${rebookRes.status} ${rebookRes.statusText}`);
  console.log("Response:", JSON.stringify(rebookData, null, 2));

  if (rebookRes.status === 201 && rebookData.data) {
    console.log(`\n✅ Step 8 SUCCESS: Rebooked successfully (${rebookData.data.appointmentId})! Cancelled slots are freed.`);
  } else {
    throw new Error(`Step 8 failed: ${rebookData.message}`);
  }

  console.log("\n==================================================");
  console.log("ALL PART 4 (APPOINTMENTS) TESTS PASSED 100%!");
  console.log("==================================================");
};

runAppointmentTests().catch((err) => {
  console.error("❌ Test Error:", err);
  process.exit(1);
});
