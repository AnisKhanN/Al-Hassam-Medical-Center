/**
 * Comprehensive Automated Verification Suite for New SmartClinic Features:
 * 1. Barcode & QR Lookup at Pharmacy POS
 * 2. SMS & WhatsApp Healthcare Alerts Engine
 * 3. Telemedicine WebRTC Video Consultation Suite
 */

const BASE_URL = "http://localhost:5000/api";

async function runNewFeaturesSuite() {
  console.log("===============================================================");
  console.log("TESTING SMARTCLINIC NEW FEATURES (SMS/WHATSAPP, BARCODE, TELEMEDICINE)");
  console.log("===============================================================\n");

  // Helper login
  const login = async (email, password) => {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    return data.token;
  };

  const adminToken = await login("admin@clinic.com", "ChangeMe123");
  if (!adminToken) {
    throw new Error("Failed to authenticate as Admin for tests");
  }
  console.log("✔ Admin authenticated successfully with Bearer token.\n");

  // ===============================================================
  // 1. TEST BARCODE SCANNER & LOOKUP API
  // ===============================================================
  console.log("---------------------------------------------------------------");
  console.log("[1/3] Testing Pharmacy Barcode Scanner Lookup (/api/medicines/barcode)");
  console.log("---------------------------------------------------------------");

  const testBarcode = "896" + Date.now().toString().slice(-9);

  // 1a. Create medicine with specific barcode
  const createMedRes = await fetch(`${BASE_URL}/medicines`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${adminToken}`,
    },
    body: JSON.stringify({
      name: `Augmentin 625mg (${Date.now().toString().slice(-4)})`,
      barcode: testBarcode,
      genericName: "Amoxicillin + Clavulanic Acid",
      category: "Antibiotic",
      unit: "Tablet",
      unitPrice: 45.5,
      reorderLevel: 25,
      batches: [
        {
          batchNumber: `AUG-${Date.now().toString().slice(-4)}`,
          quantity: 150,
          costPrice: 32,
          expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
        },
      ],
    }),
  });

  const createMedData = await createMedRes.json();
  if (!createMedRes.ok) {
    throw new Error(`Failed to create medicine with barcode: ${createMedData.message}`);
  }
  console.log(`✔ Medicine created: "${createMedData.data.name}" with barcode "${testBarcode}"`);

  // 1b. Test Barcode Lookup endpoint
  const lookupRes = await fetch(`${BASE_URL}/medicines/barcode/${testBarcode}`, {
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  const lookupData = await lookupRes.json();

  if (!lookupRes.ok || lookupData.data.barcode !== testBarcode) {
    throw new Error(`Barcode lookup failed for code ${testBarcode}: ${lookupData.message}`);
  }
  console.log(`✔ Barcode Lookup Verified: Retrieved "${lookupData.data.name}" (Stock: ${lookupData.data.totalStock} units, Price: Rs. ${lookupData.data.unitPrice})`);

  // 1c. Test Non-existent Barcode (should return 404)
  const failLookupRes = await fetch(`${BASE_URL}/medicines/barcode/INVALID_BARCODE_XYZ_999`, {
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  if (failLookupRes.status !== 404) {
    throw new Error(`Expected 404 for invalid barcode, received ${failLookupRes.status}`);
  }
  console.log("✔ Non-existent Barcode correctly rejected with HTTP 404 Not Found.");

  // ===============================================================
  // 2. TEST SMS & WHATSAPP ALERTS ENGINE
  // ===============================================================
  console.log("\n---------------------------------------------------------------");
  console.log("[2/3] Testing SMS & WhatsApp Notification Engine (/api/notifications)");
  console.log("---------------------------------------------------------------");

  // 2a. Send WhatsApp Appointment Alert
  const waRes = await fetch(`${BASE_URL}/notifications/send-whatsapp`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${adminToken}`,
    },
    body: JSON.stringify({
      phone: "03017654321",
      type: "appointment",
      data: {
        patientName: "Tariq Baloch",
        doctorName: "Dr. Amina Khan",
        dateStr: "15 September 2026",
        timeStr: "11:30 AM",
        clinicName: "SmartClinic Sanghar",
      },
    }),
  });

  const waData = await waRes.json();
  if (!waRes.ok || !waData.data?.whatsAppLink) {
    throw new Error(`WhatsApp alert test failed: ${waData.message}`);
  }
  console.log("✔ WhatsApp Alert Dispatched successfully:");
  console.log("   Channel:", waData.data.channel);
  console.log("   Recipient:", waData.data.recipient);
  console.log("   Deep Link Generated:", waData.data.whatsAppLink.slice(0, 75) + "...");

  // 2b. Send SMS Alert
  const smsRes = await fetch(`${BASE_URL}/notifications/send-sms`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${adminToken}`,
    },
    body: JSON.stringify({
      phone: "03017654321",
      message: "SmartClinic Sanghar: Your digital discharge slip is ready. Helpline: 0235-542100",
      type: "discharge_sms",
    }),
  });

  const smsData = await smsRes.json();
  if (!smsRes.ok || !smsData.data?.externalId) {
    throw new Error(`SMS alert test failed: ${smsData.message}`);
  }
  console.log("✔ SMS Alert Dispatched via Simulator/Gateway:");
  console.log("   Channel:", smsData.data.channel);
  console.log("   Status:", smsData.data.status);
  console.log("   Tracking ID:", smsData.data.externalId);

  // 2c. Inspect Notification Logs Audit
  const logsRes = await fetch(`${BASE_URL}/notifications/logs?limit=5`, {
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  const logsData = await logsRes.json();
  if (!logsRes.ok || logsData.count === 0) {
    throw new Error("Failed to retrieve notification audit logs");
  }
  console.log(`✔ Notification Audit Logs verified (${logsData.count} recent records in memory buffer).`);

  // ===============================================================
  // 3. TEST TELEMEDICINE WEBRTC VIDEO CONSULTATION SUITE
  // ===============================================================
  console.log("\n---------------------------------------------------------------");
  console.log("[3/3] Testing Telemedicine WebRTC Suite (/api/telemedicine)");
  console.log("---------------------------------------------------------------");

  const testRoomId = `tele-test-${Date.now().toString(36)}`;

  // 3a. Create Telemedicine Room
  const createRoomRes = await fetch(`${BASE_URL}/telemedicine/create-room`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${adminToken}`,
    },
    body: JSON.stringify({
      customRoomId: testRoomId,
    }),
  });

  const createRoomData = await createRoomRes.json();
  if (!createRoomRes.ok || createRoomData.data?.roomId !== testRoomId) {
    throw new Error(`Failed to create Telemedicine room: ${createRoomData.message}`);
  }
  console.log(`✔ Telemedicine Video Consultation Room Created: "${testRoomId}"`);
  console.log("   Meeting URL:", createRoomData.data.meetingUrl);

  // 3b. Fetch Room Status
  const getRoomRes = await fetch(`${BASE_URL}/telemedicine/room/${testRoomId}`, {
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  const getRoomData = await getRoomRes.json();
  if (!getRoomRes.ok) {
    throw new Error(`Failed to fetch room status: ${getRoomData.message}`);
  }
  console.log("✔ Room Status Verified:", getRoomData.data.status);

  // 3c. Send WebRTC Signaling Payload (Offer / Answer / ICE)
  const signalRes = await fetch(`${BASE_URL}/telemedicine/room/${testRoomId}/signal`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${adminToken}`,
    },
    body: JSON.stringify({
      signalType: "offer",
      payload: { type: "offer", sdp: "v=0\r\no=- 42 2 IN IP4 127.0.0.1\r\ns=-\r\nt=0 0\r\n" },
    }),
  });

  const signalData = await signalRes.json();
  if (!signalRes.ok || !signalData.success) {
    throw new Error(`WebRTC signaling relay failed: ${signalData.message}`);
  }
  console.log("✔ WebRTC Peer-to-Peer SDP Signal broadcast successfully through server.");

  // 3d. Conclude Telemedicine Consultation with EHR Notes
  const endRoomRes = await fetch(`${BASE_URL}/telemedicine/room/${testRoomId}/end`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${adminToken}`,
    },
    body: JSON.stringify({
      clinicalNotes: "Patient evaluated remotely via WebRTC video call. Prescribed oral rehydration and rest.",
      vitals: { bp: "120/80", pulse: "74", temp: "98.4" },
    }),
  });

  const endRoomData = await endRoomRes.json();
  if (!endRoomRes.ok || !endRoomData.success) {
    throw new Error(`Failed to conclude consultation: ${endRoomData.message}`);
  }
  console.log("✔ Telemedicine Consultation Concluded & Recorded to EHR successfully.");

  console.log("\n===============================================================");
  console.log("🎉 ALL 3 NEW FEATURE MODULES PASSED VERIFICATION 100%!");
  console.log("===============================================================");
}

runNewFeaturesSuite().catch((err) => {
  console.error("\n❌ TEST SUITE FAILED:", err.message);
  process.exit(1);
});
