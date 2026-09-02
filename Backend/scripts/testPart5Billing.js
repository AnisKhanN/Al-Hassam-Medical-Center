// scripts/testPart5Billing.js
const BASE_URL = "http://localhost:5000/api";

const runBillingTests = async () => {
  console.log("==================================================");
  console.log("TESTING BACKEND BILLING INSTRUCTIONS (PART 5)");
  console.log("==================================================\n");

  let adminToken = "";
  let doctorToken = "";
  let patientId = "";
  let billId1 = "";
  let billDocId1 = "";
  let billDocId2 = "";

  // --- Auth & Setup ---
  console.log("[AUTH SETUP] Logging in Admin & Doctor...");

  // 1. Admin Login
  try {
    const adminRes = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "admin@clinic.com", password: "ChangeMe123!" }),
    });
    const adminData = await adminRes.json();
    if (!adminData.token) throw new Error("Admin login failed!");
    adminToken = adminData.token;
    console.log("✔ Admin logged in successfully.");
  } catch (err) {
    console.error("❌ Admin login error:", err.message);
    process.exit(1);
  }

  // 2. Doctor Login or Create
  try {
    const docRes = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "amina@clinic.com", password: "Doctor123!" }),
    });
    const docData = await docRes.json();
    if (docData.token) {
      doctorToken = docData.token;
      console.log("✔ Doctor logged in successfully.");
    } else {
      await fetch(`${BASE_URL}/users`, {
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
      const docReLogin = await fetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: "amina@clinic.com", password: "Doctor123!" }),
      });
      const docReLoginData = await docReLogin.json();
      doctorToken = docReLoginData.token;
      console.log("✔ Doctor created and logged in.");
    }
  } catch (err) {
    console.error("❌ Doctor setup error:", err.message);
  }

  // 3. Ensure a test patient exists
  console.log("\n[SETUP] Finding or creating active patient for billing...");
  try {
    const patientsRes = await fetch(`${BASE_URL}/patients?limit=1`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    const patientsData = await patientsRes.json();
    if (patientsData.data && patientsData.data.length > 0) {
      patientId = patientsData.data[0]._id;
      console.log(`✔ Using existing patient: ${patientsData.data[0].fullName} (${patientId})`);
    } else {
      const createPatRes = await fetch(`${BASE_URL}/patients`, {
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
      const createPatData = await createPatRes.json();
      patientId = createPatData.data._id;
      console.log(`✔ Created test patient: ${createPatData.data.fullName} (${patientId})`);
    }
  } catch (err) {
    console.error("❌ Patient setup failed:", err.message);
    process.exit(1);
  }

  // ----------------------------------------------------------------
  // Step 1: Create a bill (no appointment link, walk-in consultation)
  // ----------------------------------------------------------------
  console.log("\n--------------------------------------------------");
  console.log("[STEP 1] Create a bill (walk-in consultation)");
  console.log("--------------------------------------------------");
  try {
    const billPayload = {
      patient: patientId,
      items: [
        {
          description: "Consultation - Dr. Khan",
          category: "Consultation",
          unitPrice: 1500,
        },
        {
          description: "Paracetamol x10",
          category: "Medicine",
          quantity: 10,
          unitPrice: 15,
        },
      ],
    };

    const res = await fetch(`${BASE_URL}/bills`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify(billPayload),
    });
    const data = await res.json();
    console.log(`HTTP Status: ${res.status}`);
    console.log("Response:", JSON.stringify(data, null, 2));

    if (
      res.status === 201 &&
      data.data &&
      data.data.subtotal === 1650 &&
      data.data.totalAmount === 1650 &&
      data.data.status === "Unpaid"
    ) {
      billDocId1 = data.data._id;
      billId1 = data.data.billId;
      console.log(`\n✅ Step 1 SUCCESS: Bill created! Bill ID: ${billId1}, Subtotal: ${data.data.subtotal}, Status: ${data.data.status}`);
    } else {
      console.error("\n❌ Step 1 FAILED: Unexpected response structure or values.");
      process.exit(1);
    }
  } catch (err) {
    console.error("❌ Step 1 FAILED:", err.message);
    process.exit(1);
  }

  // ----------------------------------------------------------------
  // Step 2: Record a partial payment (Rs. 1000 Cash)
  // ----------------------------------------------------------------
  console.log("\n--------------------------------------------------");
  console.log("[STEP 2] Record a partial payment (Rs. 1000 Cash)");
  console.log("--------------------------------------------------");
  try {
    const res = await fetch(`${BASE_URL}/bills/${billDocId1}/payments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({ amount: 1000, method: "Cash" }),
    });
    const data = await res.json();
    console.log(`HTTP Status: ${res.status}`);
    console.log("Response:", JSON.stringify(data, null, 2));

    if (
      res.status === 201 &&
      data.data &&
      data.data.balanceDue === 650 &&
      data.data.amountPaid === 1000 &&
      data.data.status === "Partially Paid"
    ) {
      console.log(`\n✅ Step 2 SUCCESS: Partial payment recorded! Balance Due: ${data.data.balanceDue}, Status: ${data.data.status}`);
    } else {
      console.error("\n❌ Step 2 FAILED: Balance due or status not updated as expected.");
      process.exit(1);
    }
  } catch (err) {
    console.error("❌ Step 2 FAILED:", err.message);
    process.exit(1);
  }

  // ----------------------------------------------------------------
  // Step 3: Try to overpay (Rs. 9999 Cash -> Expect 400)
  // ----------------------------------------------------------------
  console.log("\n--------------------------------------------------");
  console.log("[STEP 3] Try to overpay (Rs. 9999 Cash) -> Expect 400");
  console.log("--------------------------------------------------");
  try {
    const res = await fetch(`${BASE_URL}/bills/${billDocId1}/payments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({ amount: 9999, method: "Cash" }),
    });
    const data = await res.json();
    console.log(`HTTP Status: ${res.status}`);
    console.log("Response:", JSON.stringify(data, null, 2));

    if (res.status === 400 && data.message && data.message.includes("Payment exceeds balance due")) {
      console.log(`\n✅ Step 3 SUCCESS: Correctly rejected overpayment with error: "${data.message}"`);
    } else {
      console.error("\n❌ Step 3 FAILED: Overpayment was not rejected properly.");
      process.exit(1);
    }
  } catch (err) {
    console.error("❌ Step 3 FAILED:", err.message);
    process.exit(1);
  }

  // ----------------------------------------------------------------
  // Step 4: Pay the remainder (Rs. 650 Card)
  // ----------------------------------------------------------------
  console.log("\n--------------------------------------------------");
  console.log("[STEP 4] Pay the remainder (Rs. 650 Card with reference TXN-4521)");
  console.log("--------------------------------------------------");
  try {
    const res = await fetch(`${BASE_URL}/bills/${billDocId1}/payments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({
        amount: 650,
        method: "Card",
        reference: "TXN-4521",
      }),
    });
    const data = await res.json();
    console.log(`HTTP Status: ${res.status}`);
    console.log("Response:", JSON.stringify(data, null, 2));

    if (
      res.status === 201 &&
      data.data &&
      data.data.balanceDue === 0 &&
      data.data.amountPaid === 1650 &&
      data.data.status === "Paid"
    ) {
      console.log(`\n✅ Step 4 SUCCESS: Bill fully paid! Balance Due: 0, Status: ${data.data.status}`);
    } else {
      console.error("\n❌ Step 4 FAILED: Bill did not update to Paid with 0 balance.");
      process.exit(1);
    }
  } catch (err) {
    console.error("❌ Step 4 FAILED:", err.message);
    process.exit(1);
  }

  // ----------------------------------------------------------------
  // Step 5: Try cancelling a paid bill -> Expect 400
  // ----------------------------------------------------------------
  console.log("\n--------------------------------------------------");
  console.log("[STEP 5] Try cancelling a paid bill -> Expect 400");
  console.log("--------------------------------------------------");
  try {
    const res = await fetch(`${BASE_URL}/bills/${billDocId1}/cancel`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${adminToken}`,
      },
    });
    const data = await res.json();
    console.log(`HTTP Status: ${res.status}`);
    console.log("Response:", JSON.stringify(data, null, 2));

    if (
      res.status === 400 &&
      data.message &&
      data.message.includes("Cannot cancel a bill with recorded payments")
    ) {
      console.log(`\n✅ Step 5 SUCCESS: Paid bill cancellation correctly blocked: "${data.message}"`);
    } else {
      console.error("\n❌ Step 5 FAILED: Did not block cancellation of paid bill.");
      process.exit(1);
    }
  } catch (err) {
    console.error("❌ Step 5 FAILED:", err.message);
    process.exit(1);
  }

  // ----------------------------------------------------------------
  // Step 6: Create a second, unpaid bill and cancel it
  // ----------------------------------------------------------------
  console.log("\n--------------------------------------------------");
  console.log("[STEP 6] Create a second unpaid bill and cancel it");
  console.log("--------------------------------------------------");
  try {
    // 6a: Create second bill
    const createRes = await fetch(`${BASE_URL}/bills`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({
        patient: patientId,
        items: [
          {
            description: "General Followup",
            category: "Consultation",
            unitPrice: 500,
          },
        ],
      }),
    });
    const createData = await createRes.json();
    console.log(`Create Status: ${createRes.status}`);
    console.log("Create Response:", JSON.stringify(createData, null, 2));
    if (!createData.data) {
      throw new Error(`Failed to create bill: ${JSON.stringify(createData)}`);
    }
    billDocId2 = createData.data._id;
    console.log(`Created second bill: ${createData.data.billId} (${billDocId2})`);

    // 6b: Cancel second bill
    const cancelRes = await fetch(`${BASE_URL}/bills/${billDocId2}/cancel`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${adminToken}`,
      },
    });
    const cancelData = await cancelRes.json();
    console.log(`Cancel Status: ${cancelRes.status}`);
    console.log("Response:", JSON.stringify(cancelData, null, 2));

    if (
      cancelRes.status === 200 &&
      cancelData.data &&
      cancelData.data.status === "Cancelled"
    ) {
      console.log("\n✅ Step 6 SUCCESS: Unpaid bill successfully cancelled!");
    } else {
      console.error("\n❌ Step 6 FAILED: Failed to cancel unpaid bill.");
      process.exit(1);
    }
  } catch (err) {
    console.error("❌ Step 6 FAILED:", err.message);
    process.exit(1);
  }

  // ----------------------------------------------------------------
  // Step 7: Search + filters
  // ----------------------------------------------------------------
  console.log("\n--------------------------------------------------");
  console.log("[STEP 7] Search and filters (status=Unpaid, patient=<PATIENT_ID>)");
  console.log("--------------------------------------------------");
  try {
    // Filter by status=Unpaid
    const filterStatusRes = await fetch(`${BASE_URL}/bills?status=Unpaid`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    const filterStatusData = await filterStatusRes.json();
    console.log(`GET /api/bills?status=Unpaid -> Status: ${filterStatusRes.status}, Found: ${filterStatusData.count}`);

    // Filter by patient
    const filterPatRes = await fetch(`${BASE_URL}/bills?patient=${patientId}`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    const filterPatData = await filterPatRes.json();
    console.log(`GET /api/bills?patient=${patientId} -> Status: ${filterPatRes.status}, Found: ${filterPatData.count}`);

    if (filterStatusRes.ok && filterPatRes.ok) {
      console.log("\n✅ Step 7 SUCCESS: Search and filters working correctly!");
    } else {
      console.error("\n❌ Step 7 FAILED: Filter requests did not return 200 OK.");
      process.exit(1);
    }
  } catch (err) {
    console.error("❌ Step 7 FAILED:", err.message);
    process.exit(1);
  }

  // ----------------------------------------------------------------
  // Step 8: Revenue dashboard (defaults to current month)
  // ----------------------------------------------------------------
  console.log("\n--------------------------------------------------");
  console.log("[STEP 8] Revenue dashboard (GET /api/bills/revenue)");
  console.log("--------------------------------------------------");
  try {
    const revRes = await fetch(`${BASE_URL}/bills/revenue`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    const revData = await revRes.json();
    console.log(`HTTP Status: ${revRes.status}`);
    console.log("Revenue Summary:", JSON.stringify(revData, null, 2));

    if (revRes.status === 200 && revData.data && revData.data.totalCollected !== undefined) {
      console.log(`\n✅ Step 8 SUCCESS: Revenue dashboard returned totalCollected: Rs. ${revData.data.totalCollected}`);
    } else {
      console.error("\n❌ Step 8 FAILED: Revenue response invalid.");
      process.exit(1);
    }
  } catch (err) {
    console.error("❌ Step 8 FAILED:", err.message);
    process.exit(1);
  }

  // ----------------------------------------------------------------
  // Step 9: Confirm Doctor token gets 403 on /api/bills
  // ----------------------------------------------------------------
  console.log("\n--------------------------------------------------");
  console.log("[STEP 9] Confirm Doctor token gets 403 on /api/bills");
  console.log("--------------------------------------------------");
  try {
    const docBillRes = await fetch(`${BASE_URL}/bills`, {
      headers: { Authorization: `Bearer ${doctorToken}` },
    });
    const docBillData = await docBillRes.json();
    console.log(`HTTP Status: ${docBillRes.status}`);
    console.log("Response:", JSON.stringify(docBillData, null, 2));

    if (docBillRes.status === 403) {
      console.log("\n✅ Step 9 SUCCESS: Doctor token is forbidden (403) on billing route as expected!");
    } else {
      console.error("\n❌ Step 9 FAILED: Doctor was not denied with 403.");
      process.exit(1);
    }
  } catch (err) {
    console.error("❌ Step 9 FAILED:", err.message);
    process.exit(1);
  }

  console.log("\n==================================================");
  console.log("🎉 ALL PART 5 (BILLING) TESTS PASSED SUCCESSFULLY!");
  console.log("==================================================");
};

runBillingTests().catch((err) => {
  console.error("Fatal Error running test suite:", err);
  process.exit(1);
});
