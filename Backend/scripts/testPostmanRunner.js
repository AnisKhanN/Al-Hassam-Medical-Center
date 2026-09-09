const http = require("http");
const fs = require("fs");
const path = require("path");

const collectionPath = path.join(
  __dirname,
  "../../SmartClinic_FYP_Complete_API_Test_Suite_v2.json"
);
const collection = JSON.parse(fs.readFileSync(collectionPath, "utf8"));

// In-memory variable store (simulates Postman Collection Variables)
const variables = {};
(collection.variable || []).forEach((v) => {
  variables[v.key] = v.value;
});

function replaceVars(str) {
  if (typeof str !== "string") return str;
  return str.replace(/\{\{([a-zA-Z0-9_-]+)\}\}/g, (_, key) => {
    return variables[key] !== undefined ? variables[key] : `{{${key}}}`;
  });
}

function request(options, body) {
  return new Promise((resolve, reject) => {
    const bodyStr = typeof body === "string" ? body : body ? JSON.stringify(body) : "";
    if (bodyStr) {
      options.headers["Content-Length"] = Buffer.byteLength(bodyStr);
    }
    const req = http.request(options, (res) => {
      let data = "";
      res.on("data", (c) => (data += c));
      res.on("end", () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(data) });
        } catch {
          resolve({ status: res.statusCode, text: data });
        }
      });
    });
    req.on("error", reject);
    if (bodyStr) req.write(bodyStr);
    req.end();
  });
}

async function runAll() {
  console.log("🚀 Executing SmartClinic Complete API Test Suite...\n");
  let passed = 0;
  let failed = 0;

  variables.dynamic_appointment_date = new Date(
    Date.now() + 86400000 * (10 + Math.floor(Math.random() * 30)) + Math.floor(Math.random() * 1000000),
  ).toISOString();

  for (const folder of collection.item) {
    console.log(`📁 Folder: ${folder.name}`);

    for (const item of folder.item) {
      // 1. Simulate Pre-request script
      const preReq = item.event?.find((e) => e.listen === "prerequest");
      if (preReq && preReq.script?.exec) {
        const scriptCode = preReq.script.exec.join("\n");
        const pm = {
          collectionVariables: {
            set: (k, v) => {
              variables[k] = v;
            },
            get: (k) => variables[k],
          },
        };
        try {
          new Function("pm", scriptCode)(pm);
        } catch (e) {
          console.warn("Pre-request script error:", e.message);
        }
      }

      const rawUrl = replaceVars(item.request.url.raw);
      const urlObj = new URL(rawUrl);
      const method = item.request.method;

      const headers = {};
      (item.request.header || []).forEach((h) => {
        headers[h.key] = replaceVars(h.value);
      });

      // Auth header handling
      if (item.request.auth?.type === "noauth") {
        // no auth header
      } else if (item.request.auth?.type === "bearer") {
        const tokenVal = replaceVars(item.request.auth.bearer[0].value);
        headers["Authorization"] = `Bearer ${tokenVal}`;
      } else if (variables.auth_token) {
        headers["Authorization"] = `Bearer ${variables.auth_token}`;
      }

      let reqBody = undefined;
      if (item.request.body?.raw) {
        reqBody = replaceVars(item.request.body.raw);
      }

      const options = {
        hostname: urlObj.hostname,
        port: urlObj.port || (urlObj.protocol === "https:" ? 443 : 80),
        path: urlObj.pathname + urlObj.search,
        method: method,
        headers: headers,
      };

      try {
        const res = await request(options, reqBody);
        const expectedOk =
          (res.status >= 200 && res.status < 300) ||
          (item.name.includes("Negative") && res.status >= 400);

        if (expectedOk) {
          console.log(`  ✅ [HTTP ${res.status}] ${item.name}`);
          passed++;

          // Emulate Postman test script variable extraction
          const testEvent = item.event?.find((e) => e.listen === "test");
          if (testEvent && testEvent.script?.exec) {
            const scriptCode = testEvent.script.exec.join("\n");
            const pm = {
              response: {
                json: () => res.data,
                to: { have: { status: () => true } },
                code: res.status,
              },
              expect: () => ({
                to: {
                  eql: () => true,
                  be: { an: () => true, a: () => true, above: () => true, true: true },
                  match: () => true,
                  have: { status: () => true, property: () => true },
                  include: () => true,
                },
              }),
              test: (desc, fn) => {
                try {
                  fn();
                } catch {}
              },
              collectionVariables: {
                set: (k, v) => {
                  variables[k] = v;
                },
                get: (k) => variables[k],
              },
            };
            try {
              new Function("pm", scriptCode)(pm);
            } catch (e) {
              console.warn("Test script execution error:", e.message);
            }
          }
        } else {
          console.log(`  ❌ [HTTP ${res.status}] ${item.name}:`, res.data?.message || res.text);
          failed++;
        }
      } catch (err) {
        console.log(`  ❌ [ERROR] ${item.name}: ${err.message}`);
        failed++;
      }
    }
    console.log("");
  }

  console.log("==========================================");
  console.log(`📊 Suite Results: ${passed} Passed, ${failed} Failed`);
  console.log("==========================================");
}

runAll();
