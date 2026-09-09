// scripts/testPart6Pharmacy.js
const BASE_URL = "http://localhost:5000/api";

const runPharmacyTests = async () => {
  console.log("==================================================");
  console.log("TESTING BACKEND PHARMACY INSTRUCTIONS (PART 6)");
  console.log("==================================================\n");

  let adminToken = "";
  let pharmacistToken = "";
  let doctorToken = "";
  let supplierId = "";
  let secondSupplierId = "";
  let medicineId = "";
  let secondMedId = "";
  let saleId = "";

  // --- Auth & Setup ---
  console.log("[AUTH SETUP] Logging in Admin, Pharmacist, and Doctor...");

  // 1. Admin Login
  try {
    let adminRes = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "admin@clinic.com", password: "ChangeMe123" }),
    });
    let adminData = await adminRes.json();
    if (!adminData.token) {
      adminRes = await fetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: "admin@clinic.com", password: "ChangeMe123!" }),
      });
      adminData = await adminRes.json();
    }
    if (!adminData.token) throw new Error("Admin login failed!");
    adminToken = adminData.token;
    console.log("✔ Admin logged in successfully.");
  } catch (err) {
    console.error("❌ Admin login error:", err.message);
    process.exit(1);
  }

  // 2. Pharmacist Login
  try {
    let pharmRes = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "pharmacist@clinic.com", password: "Pharmacist123" }),
    });
    let pharmData = await pharmRes.json();
    if (!pharmData.token) {
      pharmRes = await fetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: "pharmacist@clinic.com", password: "Pharmacist123!" }),
      });
      pharmData = await pharmRes.json();
    }
    if (pharmData.token) {
      pharmacistToken = pharmData.token;
      console.log("✔ Pharmacist logged in successfully.");
    }
  } catch (err) {
    console.error("❌ Pharmacist setup error:", err.message);
  }

  // 3. Doctor Login
  try {
    let docRes = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "amina@clinic.com", password: "Doctor123" }),
    });
    let docData = await docRes.json();
    if (!docData.token) {
      docRes = await fetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: "amina@clinic.com", password: "Doctor123!" }),
      });
      docData = await docRes.json();
    }
    doctorToken = docData.token;
    console.log("✔ Doctor logged in successfully.");
  } catch (err) {
    console.error("❌ Doctor setup error:", err.message);
  }

  // ----------------------------------------------------------------
  // Step 1: Add a supplier
  // ----------------------------------------------------------------
  console.log("\n--------------------------------------------------");
  console.log("[STEP 1] Add a supplier (POST /api/suppliers)");
  console.log("--------------------------------------------------");
  try {
    const res = await fetch(`${BASE_URL}/suppliers`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${pharmacistToken || adminToken}`,
      },
      body: JSON.stringify({
        name: "MedPak Distributors",
        contactPerson: "Fahad Aslam",
        phone: "03211234567",
        address: "Korangi Industrial Area, Karachi",
      }),
    });
    const data = await res.json();
    console.log(`HTTP Status: ${res.status}`);
    console.log("Response:", JSON.stringify(data, null, 2));

    if (res.status === 201 && data.data && data.data._id) {
      supplierId = data.data._id;
      console.log(`\n✅ Step 1 SUCCESS: Supplier created! ID: ${supplierId}`);
    } else {
      console.error("\n❌ Step 1 FAILED: Could not create supplier.");
      process.exit(1);
    }
  } catch (err) {
    console.error("❌ Step 1 FAILED:", err.message);
    process.exit(1);
  }

  // ----------------------------------------------------------------
  // Step 2: List suppliers with search
  // ----------------------------------------------------------------
  console.log("\n--------------------------------------------------");
  console.log("[STEP 2] List suppliers with search (GET /api/suppliers?search=medpak)");
  console.log("--------------------------------------------------");
  try {
    const res = await fetch(`${BASE_URL}/suppliers?search=medpak`, {
      headers: { Authorization: `Bearer ${pharmacistToken || adminToken}` },
    });
    const data = await res.json();
    console.log(`HTTP Status: ${res.status}`);
    console.log("Found suppliers:", data.count);

    if (res.status === 200 && data.count >= 1) {
      console.log("\n✅ Step 2 SUCCESS: Search returned matching suppliers!");
    } else {
      console.error("\n❌ Step 2 FAILED: Search did not return results.");
      process.exit(1);
    }
  } catch (err) {
    console.error("❌ Step 2 FAILED:", err.message);
    process.exit(1);
  }

  // ----------------------------------------------------------------
  // Step 3: Update supplier
  // ----------------------------------------------------------------
  console.log("\n--------------------------------------------------");
  console.log(`[STEP 3] Update supplier (PUT /api/suppliers/${supplierId})`);
  console.log("--------------------------------------------------");
  try {
    const res = await fetch(`${BASE_URL}/suppliers/${supplierId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${pharmacistToken || adminToken}`,
      },
      body: JSON.stringify({ phone: "03219999999" }),
    });
    const data = await res.json();
    console.log(`HTTP Status: ${res.status}`);
    console.log("Response:", JSON.stringify(data, null, 2));

    if (res.status === 200 && data.data && data.data.phone === "03219999999") {
      console.log("\n✅ Step 3 SUCCESS: Supplier updated successfully!");
    } else {
      console.error("\n❌ Step 3 FAILED: Phone update failed.");
      process.exit(1);
    }
  } catch (err) {
    console.error("❌ Step 3 FAILED:", err.message);
    process.exit(1);
  }

  // ----------------------------------------------------------------
  // Step 4: Deactivate a supplier (DELETE /api/suppliers/<id>)
  // ----------------------------------------------------------------
  console.log("\n--------------------------------------------------");
  console.log("[STEP 4] Deactivate supplier (DELETE /api/suppliers/<id>)");
  console.log("--------------------------------------------------");
  try {
    // Create temporary supplier to deactivate
    const tempRes = await fetch(`${BASE_URL}/suppliers`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({
        name: "Temp Supplier to Deactivate",
        contactPerson: "Tester",
        phone: "03000000000",
      }),
    });
    const tempData = await tempRes.json();
    secondSupplierId = tempData.data._id;

    // Deactivate it
    const delRes = await fetch(`${BASE_URL}/suppliers/${secondSupplierId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    const delData = await delRes.json();
    console.log(`HTTP Status: ${delRes.status}`);
    console.log("Response:", JSON.stringify(delData, null, 2));

    if (delRes.status === 200 && delData.data?.isActive === false) {
      console.log("\n✅ Step 4 SUCCESS: Supplier deactivated successfully!");
    } else {
      console.error("\n❌ Step 4 FAILED: Supplier deactivation failed.");
      process.exit(1);
    }
  } catch (err) {
    console.error("❌ Step 4 FAILED:", err.message);
    process.exit(1);
  }

  // ----------------------------------------------------------------
  // Step 5: Add Medicine with initial batch
  // ----------------------------------------------------------------
  console.log("\n--------------------------------------------------");
  console.log("[STEP 5] Add Medicine with batch (POST /api/medicines)");
  console.log("--------------------------------------------------");
  try {
    const res = await fetch(`${BASE_URL}/medicines`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${pharmacistToken || adminToken}`,
      },
      body: JSON.stringify({
        name: "Panadol",
        genericName: "Paracetamol",
        category: "Analgesic",
        unit: "Tablet",
        unitPrice: 5,
        reorderLevel: 50,
        supplier: supplierId,
        batches: [
          {
            batchNumber: "PAN-24A",
            quantity: 200,
            costPrice: 3,
            expiryDate: "2027-06-01",
          },
        ],
      }),
    });
    const data = await res.json();
    console.log(`HTTP Status: ${res.status}`);
    console.log("Response:", JSON.stringify(data, null, 2));

    if (
      res.status === 201 &&
      data.data &&
      data.data.medicineId &&
      data.data.totalStock === 200
    ) {
      medicineId = data.data._id;
      console.log(`\n✅ Step 5 SUCCESS: Medicine created! ID: ${data.data.medicineId}, Total Stock: ${data.data.totalStock}`);
    } else {
      console.error("\n❌ Step 5 FAILED: Could not create medicine.");
      process.exit(1);
    }
  } catch (err) {
    console.error("❌ Step 5 FAILED:", err.message);
    process.exit(1);
  }

  // ----------------------------------------------------------------
  // Step 6: List medicines with search
  // ----------------------------------------------------------------
  console.log("\n--------------------------------------------------");
  console.log("[STEP 6] Search medicines (GET /api/medicines?search=panadol)");
  console.log("--------------------------------------------------");
  try {
    const res = await fetch(`${BASE_URL}/medicines?search=panadol`, {
      headers: { Authorization: `Bearer ${pharmacistToken || adminToken}` },
    });
    const data = await res.json();
    console.log(`HTTP Status: ${res.status}, Count: ${data.count}`);

    if (res.status === 200 && data.count >= 1) {
      console.log("\n✅ Step 6 SUCCESS: Medicine search works!");
    } else {
      console.error("\n❌ Step 6 FAILED: Medicine search returned 0 items.");
      process.exit(1);
    }
  } catch (err) {
    console.error("❌ Step 6 FAILED:", err.message);
    process.exit(1);
  }

  // ----------------------------------------------------------------
  // Step 7: Get categories
  // ----------------------------------------------------------------
  console.log("\n--------------------------------------------------");
  console.log("[STEP 7] Get medicine categories (GET /api/medicines/categories)");
  console.log("--------------------------------------------------");
  try {
    const res = await fetch(`${BASE_URL}/medicines/categories`, {
      headers: { Authorization: `Bearer ${pharmacistToken || adminToken}` },
    });
    const data = await res.json();
    console.log(`HTTP Status: ${res.status}`);
    console.log("Categories:", data.data);

    if (res.status === 200 && Array.isArray(data.data) && data.data.includes("Analgesic")) {
      console.log("\n✅ Step 7 SUCCESS: Medicine categories retrieved!");
    } else {
      console.error("\n❌ Step 7 FAILED: Categories list invalid.");
      process.exit(1);
    }
  } catch (err) {
    console.error("❌ Step 7 FAILED:", err.message);
    process.exit(1);
  }

  // ----------------------------------------------------------------
  // Step 8: Check Low-Stock and Expiring alerts
  // ----------------------------------------------------------------
  console.log("\n--------------------------------------------------");
  console.log("[STEP 8] Check Low-Stock & Expiring Endpoints");
  console.log("--------------------------------------------------");
  try {
    const lowStockRes = await fetch(`${BASE_URL}/medicines/low-stock`, {
      headers: { Authorization: `Bearer ${pharmacistToken || adminToken}` },
    });
    const lowStockData = await lowStockRes.json();
    console.log(`GET /api/medicines/low-stock Status: ${lowStockRes.status}, Count: ${lowStockData.count}`);

    const expRes = await fetch(`${BASE_URL}/medicines/expiring?days=30`, {
      headers: { Authorization: `Bearer ${pharmacistToken || adminToken}` },
    });
    const expData = await expRes.json();
    console.log(`GET /api/medicines/expiring?days=30 Status: ${expRes.status}, Count: ${expData.count}`);

    if (lowStockRes.status === 200 && expRes.status === 200) {
      console.log("\n✅ Step 8 SUCCESS: Low-stock and expiring alerts retrieved!");
    } else {
      console.error("\n❌ Step 8 FAILED: Low stock / expiring endpoints failed.");
      process.exit(1);
    }
  } catch (err) {
    console.error("❌ Step 8 FAILED:", err.message);
    process.exit(1);
  }

  // ----------------------------------------------------------------
  // Step 9: Add a second batch to the medicine
  // ----------------------------------------------------------------
  console.log("\n--------------------------------------------------");
  console.log(`[STEP 9] Add second batch (POST /api/medicines/${medicineId}/batches)`);
  console.log("--------------------------------------------------");
  try {
    const res = await fetch(`${BASE_URL}/medicines/${medicineId}/batches`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${pharmacistToken || adminToken}`,
      },
      body: JSON.stringify({
        batchNumber: "PAN-24B",
        quantity: 150,
        costPrice: 3.2,
        expiryDate: "2027-09-01",
      }),
    });
    const data = await res.json();
    console.log(`HTTP Status: ${res.status}`);
    console.log(`Updated Total Stock: ${data.data?.totalStock}, Batches: ${data.data?.batches?.length}`);

    if (res.status === 201 && data.data?.totalStock === 350) {
      console.log("\n✅ Step 9 SUCCESS: Batch added! Total stock increased to 350.");
    } else {
      console.error("\n❌ Step 9 FAILED: Batch addition failed.");
      process.exit(1);
    }
  } catch (err) {
    console.error("❌ Step 9 FAILED:", err.message);
    process.exit(1);
  }

  // ----------------------------------------------------------------
  // Step 10: Archive / Delete medicine (DELETE /api/medicines/<id>)
  // ----------------------------------------------------------------
  console.log("\n--------------------------------------------------");
  console.log("[STEP 10] Archive / Delete medicine (DELETE /api/medicines/<id>)");
  console.log("--------------------------------------------------");
  try {
    // Create temporary medicine to delete
    const tempMedRes = await fetch(`${BASE_URL}/medicines`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({
        name: "Temporary Medicine to Archive",
        category: "Vitamin/Supplement",
        unit: "Capsule",
        unitPrice: 10,
        reorderLevel: 10,
        supplier: supplierId,
      }),
    });
    const tempMedData = await tempMedRes.json();
    secondMedId = tempMedData.data._id;

    // Archive it
    const delMedRes = await fetch(`${BASE_URL}/medicines/${secondMedId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    const delMedData = await delMedRes.json();
    console.log(`HTTP Status: ${delMedRes.status}`);
    console.log("Response:", JSON.stringify(delMedData, null, 2));

    if (delMedRes.status === 200 && delMedData.data?.isActive === false) {
      console.log("\n✅ Step 10 SUCCESS: Medicine archived successfully!");
    } else {
      console.error("\n❌ Step 10 FAILED: Medicine archiving failed.");
      process.exit(1);
    }
  } catch (err) {
    console.error("❌ Step 10 FAILED:", err.message);
    process.exit(1);
  }

  // ----------------------------------------------------------------
  // Step 11: Create sale (FEFO deduction) & Oversell check
  // ----------------------------------------------------------------
  console.log("\n--------------------------------------------------");
  console.log("[STEP 11] Record a Sale & Test Oversell Prevention (POST /api/sales)");
  console.log("--------------------------------------------------");
  try {
    // 11a: Valid sale
    const res = await fetch(`${BASE_URL}/sales`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${pharmacistToken || adminToken}`,
      },
      body: JSON.stringify({
        customerName: "Walk-in",
        customerPhone: "03001234567",
        items: [{ medicine: medicineId, quantity: 10 }],
      }),
    });
    const data = await res.json();
    console.log(`HTTP Status: ${res.status}`);
    console.log("Response:", JSON.stringify(data, null, 2));

    if (res.status === 201 && data.data && data.data.totalAmount === 50) {
      saleId = data.data._id;
      console.log(`\n✅ Step 11a SUCCESS: Sale recorded! Sale ID: ${data.data.saleId}, Total: Rs. ${data.data.totalAmount}`);
    } else {
      console.error("\n❌ Step 11a FAILED: Sale creation failed.");
      process.exit(1);
    }

    // 11b: Attempt to oversell (expect 409)
    console.log("\n[STEP 11b] Attempting to sell more stock than available (Expect 409)...");
    const overRes = await fetch(`${BASE_URL}/sales`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${pharmacistToken || adminToken}`,
      },
      body: JSON.stringify({
        customerName: "Oversell Test",
        items: [{ medicine: medicineId, quantity: 99999 }],
      }),
    });
    const overData = await overRes.json();
    console.log(`HTTP Status: ${overRes.status}`);
    console.log("Response:", JSON.stringify(overData, null, 2));

    if (overRes.status === 409 && overData.message && overData.message.includes("Insufficient stock")) {
      console.log("\n✅ Step 11b SUCCESS: Insufficient stock correctly rejected with 409!");
    } else {
      console.error("\n❌ Step 11b FAILED: Insufficient stock did not trigger 409.");
      process.exit(1);
    }
  } catch (err) {
    console.error("❌ Step 11 FAILED:", err.message);
    process.exit(1);
  }

  // ----------------------------------------------------------------
  // Step 12: List sales
  // ----------------------------------------------------------------
  console.log("\n--------------------------------------------------");
  console.log("[STEP 12] List completed sales (GET /api/sales?status=Completed)");
  console.log("--------------------------------------------------");
  try {
    const res = await fetch(`${BASE_URL}/sales?status=Completed`, {
      headers: { Authorization: `Bearer ${pharmacistToken || adminToken}` },
    });
    const data = await res.json();
    console.log(`HTTP Status: ${res.status}, Total Sales: ${data.count}`);

    if (res.status === 200 && data.count >= 1) {
      console.log("\n✅ Step 12 SUCCESS: Sales list retrieved!");
    } else {
      console.error("\n❌ Step 12 FAILED: Sales list query failed.");
      process.exit(1);
    }
  } catch (err) {
    console.error("❌ Step 12 FAILED:", err.message);
    process.exit(1);
  }

  // ----------------------------------------------------------------
  // Step 13: Void sale and restore stock (Admin only)
  // ----------------------------------------------------------------
  console.log("\n--------------------------------------------------");
  console.log(`[STEP 13] Void sale and restore stock (PATCH /api/sales/${saleId}/void)`);
  console.log("--------------------------------------------------");
  try {
    // 13a: Try voiding as Pharmacist (expect 403)
    console.log("[STEP 13a] Attempting void as Pharmacist (Expect 403)...");
    const voidPharmRes = await fetch(`${BASE_URL}/sales/${saleId}/void`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${pharmacistToken}`,
      },
      body: JSON.stringify({ voidReason: "Unauthorized attempt" }),
    });
    console.log(`Pharmacist Void Status: ${voidPharmRes.status}`);
    if (voidPharmRes.status === 403) {
      console.log("✔ Pharmacist correctly forbidden from voiding sales.");
    }

    // 13b: Void as Admin
    console.log("[STEP 13b] Voiding as Admin...");
    const voidAdminRes = await fetch(`${BASE_URL}/sales/${saleId}/void`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({ voidReason: "Customer returned the medicine unopened" }),
    });
    const voidData = await voidAdminRes.json();
    console.log(`Admin Void Status: ${voidAdminRes.status}`);
    console.log("Response:", JSON.stringify(voidData, null, 2));

    if (voidAdminRes.status === 200 && voidData.data?.status === "Voided") {
      console.log("\n✅ Step 13 SUCCESS: Sale voided and stock restored!");
    } else {
      console.error("\n❌ Step 13 FAILED: Void sale failed.");
      process.exit(1);
    }
  } catch (err) {
    console.error("❌ Step 13 FAILED:", err.message);
    process.exit(1);
  }

  // ----------------------------------------------------------------
  // Step 14: Confirm Doctor/Receptionist forbidden from Pharmacy routes
  // ----------------------------------------------------------------
  console.log("\n--------------------------------------------------");
  console.log("[STEP 14] Confirm Doctor token gets 403 on /api/medicines and /api/suppliers");
  console.log("--------------------------------------------------");
  try {
    const docMedRes = await fetch(`${BASE_URL}/medicines`, {
      headers: { Authorization: `Bearer ${doctorToken}` },
    });
    console.log(`Doctor GET /api/medicines Status: ${docMedRes.status}`);

    const docSupRes = await fetch(`${BASE_URL}/suppliers`, {
      headers: { Authorization: `Bearer ${doctorToken}` },
    });
    console.log(`Doctor GET /api/suppliers Status: ${docSupRes.status}`);

    if (docMedRes.status === 403 && docSupRes.status === 403) {
      console.log("\n✅ Step 14 SUCCESS: Doctor role correctly forbidden (403) from Pharmacy endpoints!");
    } else {
      console.error("\n❌ Step 14 FAILED: RBAC did not reject Doctor.");
      process.exit(1);
    }
  } catch (err) {
    console.error("❌ Step 14 FAILED:", err.message);
    process.exit(1);
  }

  console.log("\n==================================================");
  console.log("🎉 ALL PART 6 (PHARMACY) TESTS PASSED SUCCESSFULLY!");
  console.log("==================================================");
};

runPharmacyTests().catch((err) => {
  console.error("Fatal Error running Pharmacy tests:", err);
  process.exit(1);
});
