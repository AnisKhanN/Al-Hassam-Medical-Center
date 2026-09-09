// scripts/runCompleteTestSuite.js
const { spawn } = require("child_process");
const path = require("path");

const suites = [
  { name: "Syntax Verification", file: "checkSyntax.js", desc: "Verifies ES/Node syntax across all 63 backend files" },
  { name: "Multi-Tenant Auth & Onboarding", file: "testPhase4AuthHardening.js", desc: "Clinic onboarding, JWT claims, cross-tenant isolation" },
  { name: "RBAC Security Matrix", file: "verifyRbacMatrix.js", desc: "Verifies 96 role-based permission endpoints" },
  { name: "Postman End-to-End Suite", file: "testPostmanRunner.js", desc: "Executes 51 requests across all 14 API collection folders" },
  { name: "Clinical & Financial Reports", file: "testReportsSuite.js", desc: "Aggregations for revenue, patients, appointments, inventory" },
  { name: "Operations Dashboard", file: "testDashboardFullSuite.js", desc: "Steps 1-9 role dashboards & live data mutations" },
  { name: "Bilingual Gemini AI Engine", file: "testAiSuite.js", desc: "NLP clinical queries, briefings, non-blocking audit logging" },
  { name: "New SaaS Features Engine", file: "testNewFeaturesSuite.js", desc: "Barcode scanner, SMS/WhatsApp engine, WebRTC telemedicine" },
  { name: "Appointments Lifecycle", file: "testPart4Appointments.js", desc: "Booking, conflict prevention, calendar filtering, completion" },
  { name: "Billing & Reconciliation", file: "testPart5Billing.js", desc: "Invoicing, split payments, ledger balance, cancellations" },
  { name: "Pharmacy & FEFO Inventory", file: "testPart6Pharmacy.js", desc: "Suppliers, FEFO batching, oversell guards, void restore" },
];

const runSuite = (suite) => {
  return new Promise((resolve) => {
    const startTime = Date.now();
    const filePath = path.join(__dirname, suite.file);
    const proc = spawn(process.execPath, [filePath], {
      cwd: path.join(__dirname, ".."),
      stdio: "inherit",
      env: process.env,
    });

    proc.on("close", (code) => {
      const duration = ((Date.now() - startTime) / 1000).toFixed(2);
      resolve({
        ...suite,
        passed: code === 0,
        exitCode: code,
        duration: `${duration}s`,
      });
    });

    proc.on("error", (err) => {
      const duration = ((Date.now() - startTime) / 1000).toFixed(2);
      resolve({
        ...suite,
        passed: false,
        exitCode: 1,
        duration: `${duration}s`,
        error: err.message,
      });
    });
  });
};

const runAllSuites = async () => {
  console.log("================================================================================");
  console.log("🏥 SMARTCLINIC SAAS — COMPREHENSIVE ARCHITECTURE & API VERIFICATION RUNNER");
  console.log("================================================================================\n");
  console.log(`Starting execution of ${suites.length} test suites...\n`);

  const results = [];
  const globalStart = Date.now();

  for (let i = 0; i < suites.length; i++) {
    const s = suites[i];
    console.log(`\n>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>`);
    console.log(`[SUITE ${i + 1}/${suites.length}] RUNNING: ${s.name} (${s.file})`);
    console.log(`Description: ${s.desc}`);
    console.log(`<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<\n`);

    const res = await runSuite(s);
    results.push(res);
  }

  const globalDuration = ((Date.now() - globalStart) / 1000).toFixed(2);

  console.log("\n\n================================================================================");
  console.log("🏁 COMPREHENSIVE TEST SUITE EXECUTION SCORECARD");
  console.log("================================================================================\n");

  let allPassed = true;

  console.table(
    results.map((r, idx) => {
      if (!r.passed) allPassed = false;
      return {
        "#": idx + 1,
        Suite: r.name,
        Status: r.passed ? "✅ PASS" : "❌ FAIL",
        Duration: r.duration,
        Script: r.file,
      };
    }),
  );

  const passedCount = results.filter((r) => r.passed).length;
  const failedCount = results.filter((r) => !r.passed).length;

  console.log(`\nOverall Summary: ${passedCount}/${suites.length} suites passed (${failedCount} failed) in ${globalDuration}s.`);

  if (allPassed) {
    console.log("\n🎉 ALL 11 TEST SUITES PASSED! Multi-tenant SaaS architecture is 100% verified.");
    process.exit(0);
  } else {
    console.error("\n❌ Some test suites failed. Please inspect logs above.");
    process.exit(1);
  }
};

runAllSuites();
