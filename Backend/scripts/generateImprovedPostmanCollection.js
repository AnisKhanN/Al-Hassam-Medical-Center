const fs = require("fs");
const path = require("path");

const collection = {
  info: {
    _postman_id: "2ef00003-905a-4410-af5f-c966507e05f9",
    name: "SmartClinic FYP - Complete Production API Test Suite",
    description:
      "Enterprise-grade, fully automated Postman test suite for the SmartClinic & Pharmacy Management SaaS FYP. Cross-referenced with 100% of backend Express routes. Features role-scoped token routing (Admin, Doctor, Receptionist, Pharmacist), automated dynamic variable chaining, realistic Pakistani clinical datasets, idempotent pre-request randomizers, and comprehensive assertions.",
    schema:
      "https://schema.getpostman.com/json/collection/v2.1.0/collection.json",
  },
  auth: {
    type: "bearer",
    bearer: [
      {
        key: "token",
        value: "{{auth_token}}",
        type: "string",
      },
    ],
  },
  variable: [
    { key: "base_url", value: "http://localhost:5000/api" },
    { key: "admin_email", value: "admin@clinic.com" },
    { key: "admin_password", value: "ChangeMe123" },
    { key: "doctor_email", value: "amina@clinic.com" },
    { key: "doctor_password", value: "Doctor123" },
    { key: "receptionist_email", value: "receptionist@clinic.com" },
    { key: "receptionist_password", value: "Recep123" },
    { key: "pharmacist_email", value: "pharmacist@clinic.com" },
    { key: "pharmacist_password", value: "Pharmacist123" },
    { key: "auth_token", value: "" },
    { key: "admin_token", value: "" },
    { key: "doctor_token", value: "" },
    { key: "receptionist_token", value: "" },
    { key: "pharmacist_token", value: "" },
    { key: "user_id", value: "" },
    { key: "patient_id", value: "" },
    { key: "doctor_id", value: "" },
    { key: "appointment_id", value: "" },
    { key: "bill_id", value: "" },
    { key: "supplier_id", value: "" },
    { key: "medicine_id", value: "" },
    { key: "sale_id", value: "" },
    { key: "telemedicine_room_id", value: "" },
  ],
  item: [
    // 00 - Health & Discovery
    {
      name: "00 - System Health & Discovery",
      item: [
        {
          name: "System Root Status & Service Discovery",
          event: [
            {
              listen: "test",
              script: {
                exec: [
                  "pm.test('Status is 200 OK', () => pm.response.to.have.status(200));",
                  "pm.test('Service reports online', () => pm.expect(pm.response.json().status).to.eql('online'));",
                  "pm.test('API routes dictionary returned', () => pm.expect(pm.response.json()).to.have.property('apiRoutes'));",
                ],
                type: "text/javascript",
              },
            },
          ],
          request: {
            auth: { type: "noauth" },
            method: "GET",
            header: [],
            url: {
              raw: "http://localhost:5000/",
              protocol: "http",
              host: ["localhost"],
              port: "5000",
              path: [""],
            },
            description:
              "Pings root server to verify Express lifecycle and active modules.",
          },
        },
        {
          name: "Dedicated Health Probe - /api/health",
          event: [
            {
              listen: "test",
              script: {
                exec: [
                  "pm.test('Status is 200 OK', () => pm.response.to.have.status(200));",
                  "pm.test('Status is healthy', () => pm.expect(pm.response.json().status).to.eql('healthy'));",
                  "pm.test('Uptime reported', () => pm.expect(pm.response.json().uptime).to.be.above(0));",
                ],
                type: "text/javascript",
              },
            },
          ],
          request: {
            auth: { type: "noauth" },
            method: "GET",
            header: [],
            url: {
              raw: "{{base_url}}/health",
              host: ["{{base_url}}"],
              path: ["health"],
            },
            description: "High-frequency container health check probe.",
          },
        },
      ],
      description: "Root discovery and health verification.",
    },

    // 01 - Authentication
    {
      name: "01 - Authentication & RBAC Handshake",
      item: [
        {
          name: "Login - Admin (Anis Khan Niazi)",
          event: [
            {
              listen: "test",
              script: {
                exec: [
                  "pm.test('Status is 200 OK', () => pm.response.to.have.status(200));",
                  "const res = pm.response.json();",
                  "pm.test('Login successful', () => pm.expect(res.success).to.eql(true));",
                  "pm.test('Role is Admin', () => pm.expect(res.data.role).to.eql('Admin'));",
                  "pm.collectionVariables.set('admin_token', res.token);",
                  "pm.collectionVariables.set('auth_token', res.token);",
                ],
                type: "text/javascript",
              },
            },
          ],
          request: {
            auth: { type: "noauth" },
            method: "POST",
            header: [{ key: "Content-Type", value: "application/json" }],
            body: {
              mode: "raw",
              raw: JSON.stringify(
                { email: "{{admin_email}}", password: "{{admin_password}}" },
                null,
                2,
              ),
            },
            url: {
              raw: "{{base_url}}/auth/login",
              host: ["{{base_url}}"],
              path: ["auth", "login"],
            },
          },
        },
        {
          name: "Get Current User Profile - /auth/me",
          event: [
            {
              listen: "test",
              script: {
                exec: [
                  "pm.test('Status is 200 OK', () => pm.response.to.have.status(200));",
                  "pm.test('Profile returned', () => pm.expect(pm.response.json().data).to.have.property('email'));",
                ],
                type: "text/javascript",
              },
            },
          ],
          request: {
            auth: {
              type: "bearer",
              bearer: [{ key: "token", value: "{{admin_token}}" }],
            },
            method: "GET",
            header: [],
            url: {
              raw: "{{base_url}}/auth/me",
              host: ["{{base_url}}"],
              path: ["auth", "me"],
            },
          },
        },
        {
          name: "Login - Doctor (Dr. Amina)",
          event: [
            {
              listen: "test",
              script: {
                exec: [
                  "pm.test('Status is 200 OK', () => pm.response.to.have.status(200));",
                  "const res = pm.response.json();",
                  "pm.test('Role is Doctor', () => pm.expect(res.data.role).to.eql('Doctor'));",
                  "pm.collectionVariables.set('doctor_token', res.token);",
                ],
                type: "text/javascript",
              },
            },
          ],
          request: {
            auth: { type: "noauth" },
            method: "POST",
            header: [{ key: "Content-Type", value: "application/json" }],
            body: {
              mode: "raw",
              raw: JSON.stringify(
                { email: "{{doctor_email}}", password: "{{doctor_password}}" },
                null,
                2,
              ),
            },
            url: {
              raw: "{{base_url}}/auth/login",
              host: ["{{base_url}}"],
              path: ["auth", "login"],
            },
          },
        },
        {
          name: "Login - Receptionist (Reception Desk)",
          event: [
            {
              listen: "test",
              script: {
                exec: [
                  "pm.test('Status is 200 OK', () => pm.response.to.have.status(200));",
                  "const res = pm.response.json();",
                  "pm.test('Role is Receptionist', () => pm.expect(res.data.role).to.eql('Receptionist'));",
                  "pm.collectionVariables.set('receptionist_token', res.token);",
                ],
                type: "text/javascript",
              },
            },
          ],
          request: {
            auth: { type: "noauth" },
            method: "POST",
            header: [{ key: "Content-Type", value: "application/json" }],
            body: {
              mode: "raw",
              raw: JSON.stringify(
                {
                  email: "{{receptionist_email}}",
                  password: "{{receptionist_password}}",
                },
                null,
                2,
              ),
            },
            url: {
              raw: "{{base_url}}/auth/login",
              host: ["{{base_url}}"],
              path: ["auth", "login"],
            },
          },
        },
        {
          name: "Login - Pharmacist (Pharmacy Store)",
          event: [
            {
              listen: "test",
              script: {
                exec: [
                  "pm.test('Status is 200 OK', () => pm.response.to.have.status(200));",
                  "const res = pm.response.json();",
                  "pm.test('Role is Pharmacist', () => pm.expect(res.data.role).to.eql('Pharmacist'));",
                  "pm.collectionVariables.set('pharmacist_token', res.token);",
                ],
                type: "text/javascript",
              },
            },
          ],
          request: {
            auth: { type: "noauth" },
            method: "POST",
            header: [{ key: "Content-Type", value: "application/json" }],
            body: {
              mode: "raw",
              raw: JSON.stringify(
                {
                  email: "{{pharmacist_email}}",
                  password: "{{pharmacist_password}}",
                },
                null,
                2,
              ),
            },
            url: {
              raw: "{{base_url}}/auth/login",
              host: ["{{base_url}}"],
              path: ["auth", "login"],
            },
          },
        },
        {
          name: "Negative: Invalid Credentials",
          event: [
            {
              listen: "test",
              script: {
                exec: [
                  "pm.test('Status is 401 Unauthorized', () => pm.response.to.have.status(401));",
                ],
                type: "text/javascript",
              },
            },
          ],
          request: {
            auth: { type: "noauth" },
            method: "POST",
            header: [{ key: "Content-Type", value: "application/json" }],
            body: {
              mode: "raw",
              raw: JSON.stringify(
                {
                  email: "fake.account@clinic.com",
                  password: "BadPassword123!",
                },
                null,
                2,
              ),
            },
            url: {
              raw: "{{base_url}}/auth/login",
              host: ["{{base_url}}"],
              path: ["auth", "login"],
            },
          },
        },
        {
          name: "Negative: Missing Credentials",
          event: [
            {
              listen: "test",
              script: {
                exec: [
                  "pm.test('Status is 400 Bad Request', () => pm.response.to.have.status(400));",
                ],
                type: "text/javascript",
              },
            },
          ],
          request: {
            auth: { type: "noauth" },
            method: "POST",
            header: [{ key: "Content-Type", value: "application/json" }],
            body: {
              mode: "raw",
              raw: JSON.stringify({ email: "", password: "" }, null, 2),
            },
            url: {
              raw: "{{base_url}}/auth/login",
              host: ["{{base_url}}"],
              path: ["auth", "login"],
            },
          },
        },
        {
          name: "Logout Session",
          event: [
            {
              listen: "test",
              script: {
                exec: [
                  "pm.test('Status is 200 OK', () => pm.response.to.have.status(200));",
                ],
                type: "text/javascript",
              },
            },
          ],
          request: {
            auth: {
              type: "bearer",
              bearer: [{ key: "token", value: "{{admin_token}}" }],
            },
            method: "POST",
            header: [],
            url: {
              raw: "{{base_url}}/auth/logout",
              host: ["{{base_url}}"],
              path: ["auth", "logout"],
            },
          },
        },
      ],
      description:
        "Multi-role login, credential validation, and session teardown.",
    },

    // 02 - Staff Management (Admin)
    {
      name: "02 - Staff User Management (Admin)",
      item: [
        {
          name: "List All Staff Members",
          event: [
            {
              listen: "test",
              script: {
                exec: [
                  "pm.test('Status is 200 OK', () => pm.response.to.have.status(200));",
                  "pm.test('Users list populated', () => pm.expect(pm.response.json().data).to.be.an('array'));",
                ],
                type: "text/javascript",
              },
            },
          ],
          request: {
            auth: {
              type: "bearer",
              bearer: [{ key: "token", value: "{{admin_token}}" }],
            },
            method: "GET",
            header: [],
            url: {
              raw: "{{base_url}}/users",
              host: ["{{base_url}}"],
              path: ["users"],
            },
          },
        },
        {
          name: "Filter Users - Doctors (Capture doctor_id)",
          event: [
            {
              listen: "test",
              script: {
                exec: [
                  "pm.test('Status is 200 OK', () => pm.response.to.have.status(200));",
                  "const docs = pm.response.json().data || [];",
                  "pm.test('At least one doctor exists', () => pm.expect(docs.length).to.be.above(0));",
                  "const assignedDoc = docs.find(d => d.email === pm.collectionVariables.get('doctor_email')) || docs[0];",
                  "if (assignedDoc) {",
                  "  pm.collectionVariables.set('doctor_id', assignedDoc._id || assignedDoc.id);",
                  "}",
                ],
                type: "text/javascript",
              },
            },
          ],
          request: {
            auth: {
              type: "bearer",
              bearer: [{ key: "token", value: "{{admin_token}}" }],
            },
            method: "GET",
            header: [],
            url: {
              raw: "{{base_url}}/users?role=Doctor",
              host: ["{{base_url}}"],
              path: ["users"],
              query: [{ key: "role", value: "Doctor" }],
            },
          },
        },
        {
          name: "Create New Staff Member",
          event: [
            {
              listen: "prerequest",
              script: {
                exec: [
                  "const rand = Math.floor(1000 + Math.random() * 9000);",
                  "pm.collectionVariables.set('dynamic_staff_email', `staff.${rand}@clinic.com`);",
                ],
                type: "text/javascript",
              },
            },
            {
              listen: "test",
              script: {
                exec: [
                  "pm.test('Status is 201 Created', () => pm.response.to.have.status(201));",
                  "const user = pm.response.json().data;",
                  "pm.collectionVariables.set('user_id', user._id || user.id);",
                ],
                type: "text/javascript",
              },
            },
          ],
          request: {
            auth: {
              type: "bearer",
              bearer: [{ key: "token", value: "{{admin_token}}" }],
            },
            method: "POST",
            header: [{ key: "Content-Type", value: "application/json" }],
            body: {
              mode: "raw",
              raw: JSON.stringify(
                {
                  name: "Sobia Tariq",
                  email: "{{dynamic_staff_email}}",
                  password: "StaffPassword123!",
                  role: "Receptionist",
                },
                null,
                2,
              ),
            },
            url: {
              raw: "{{base_url}}/users",
              host: ["{{base_url}}"],
              path: ["users"],
            },
          },
        },
        {
          name: "Get Staff Member By ID",
          event: [
            {
              listen: "test",
              script: {
                exec: [
                  "pm.test('Status is 200 OK', () => pm.response.to.have.status(200));",
                  "pm.test('User ID matches', () => pm.expect(pm.response.json().data._id).to.eql(pm.collectionVariables.get('user_id')));",
                ],
                type: "text/javascript",
              },
            },
          ],
          request: {
            auth: {
              type: "bearer",
              bearer: [{ key: "token", value: "{{admin_token}}" }],
            },
            method: "GET",
            header: [],
            url: {
              raw: "{{base_url}}/users/{{user_id}}",
              host: ["{{base_url}}"],
              path: ["users", "{{user_id}}"],
            },
          },
        },
        {
          name: "Update Staff Member Details",
          event: [
            {
              listen: "test",
              script: {
                exec: [
                  "pm.test('Status is 200 OK', () => pm.response.to.have.status(200));",
                  "pm.test('Updated name confirmed', () => pm.expect(pm.response.json().data.name).to.eql('Sobia Tariq Senior'));",
                ],
                type: "text/javascript",
              },
            },
          ],
          request: {
            auth: {
              type: "bearer",
              bearer: [{ key: "token", value: "{{admin_token}}" }],
            },
            method: "PUT",
            header: [{ key: "Content-Type", value: "application/json" }],
            body: {
              mode: "raw",
              raw: JSON.stringify(
                {
                  name: "Sobia Tariq Senior",
                  role: "Receptionist",
                  isActive: true,
                },
                null,
                2,
              ),
            },
            url: {
              raw: "{{base_url}}/users/{{user_id}}",
              host: ["{{base_url}}"],
              path: ["users", "{{user_id}}"],
            },
          },
        },
      ],
      description: "RBAC governance for clinic staff and credentials.",
    },

    // 03 - Patients & Longitudinal EHR
    {
      name: "03 - Patients & Longitudinal History",
      item: [
        {
          name: "Create Patient (Pakistani Clinical Profile)",
          event: [
            {
              listen: "prerequest",
              script: {
                exec: [
                  "const rand = Math.floor(1000000 + Math.random() * 9000000);",
                  "pm.collectionVariables.set('dynamic_cnic', `37405-${rand}-1`);",
                  "pm.collectionVariables.set('dynamic_phone', `0333${Math.floor(1000000 + Math.random() * 9000000)}`);",
                ],
                type: "text/javascript",
              },
            },
            {
              listen: "test",
              script: {
                exec: [
                  "pm.test('Status is 201 Created', () => pm.response.to.have.status(201));",
                  "const p = pm.response.json().data;",
                  "pm.collectionVariables.set('patient_id', p._id);",
                  "pm.test('Patient MR ID formatted', () => pm.expect(p.patientId).to.match(/^PT-/));",
                ],
                type: "text/javascript",
              },
            },
          ],
          request: {
            auth: {
              type: "bearer",
              bearer: [{ key: "token", value: "{{receptionist_token}}" }],
            },
            method: "POST",
            header: [{ key: "Content-Type", value: "application/json" }],
            body: {
              mode: "raw",
              raw: JSON.stringify(
                {
                  fullName: "Muhammad Bilal Khan",
                  guardianName: "Khan Muhammad",
                  cnic: "{{dynamic_cnic}}",
                  age: 42,
                  gender: "Male",
                  phone: "{{dynamic_phone}}",
                  alternatePhone: "03455123456",
                  address: "House 14, Street 22, F-10/2, Islamabad",
                  bloodGroup: "B+",
                  allergies: ["Penicillin", "NSAIDs"],
                  emergencyContact: {
                    name: "Zainab Bibi",
                    phone: "03215556789",
                    relation: "Spouse",
                  },
                },
                null,
                2,
              ),
            },
            url: {
              raw: "{{base_url}}/patients",
              host: ["{{base_url}}"],
              path: ["patients"],
            },
          },
        },
        {
          name: "List Patients (Paginated)",
          event: [
            {
              listen: "test",
              script: {
                exec: [
                  "pm.test('Status is 200 OK', () => pm.response.to.have.status(200));",
                  "pm.test('Patients array returned', () => pm.expect(pm.response.json().data).to.be.an('array'));",
                ],
                type: "text/javascript",
              },
            },
          ],
          request: {
            auth: {
              type: "bearer",
              bearer: [{ key: "token", value: "{{receptionist_token}}" }],
            },
            method: "GET",
            header: [],
            url: {
              raw: "{{base_url}}/patients?page=1&limit=10",
              host: ["{{base_url}}"],
              path: ["patients"],
              query: [
                { key: "page", value: "1" },
                { key: "limit", value: "10" },
              ],
            },
          },
        },
        {
          name: "Search Patients By Query",
          event: [
            {
              listen: "test",
              script: {
                exec: [
                  "pm.test('Status is 200 OK', () => pm.response.to.have.status(200));",
                ],
                type: "text/javascript",
              },
            },
          ],
          request: {
            auth: {
              type: "bearer",
              bearer: [{ key: "token", value: "{{receptionist_token}}" }],
            },
            method: "GET",
            header: [],
            url: {
              raw: "{{base_url}}/patients?search=Bilal",
              host: ["{{base_url}}"],
              path: ["patients"],
              query: [{ key: "search", value: "Bilal" }],
            },
          },
        },
        {
          name: "Get Patient By ID (Full EHR & History)",
          event: [
            {
              listen: "test",
              script: {
                exec: [
                  "pm.test('Status is 200 OK', () => pm.response.to.have.status(200));",
                  "pm.test('Correct patient record', () => pm.expect(pm.response.json().data._id).to.eql(pm.collectionVariables.get('patient_id')));",
                ],
                type: "text/javascript",
              },
            },
          ],
          request: {
            auth: {
              type: "bearer",
              bearer: [{ key: "token", value: "{{receptionist_token}}" }],
            },
            method: "GET",
            header: [],
            url: {
              raw: "{{base_url}}/patients/{{patient_id}}",
              host: ["{{base_url}}"],
              path: ["patients", "{{patient_id}}"],
            },
          },
        },
        {
          name: "Add Clinical Visit History (Doctor)",
          event: [
            {
              listen: "test",
              script: {
                exec: [
                  "pm.test('Status is 201 Created', () => pm.response.to.have.status(201));",
                  "pm.test('Clinical visit appended', () => pm.expect(pm.response.json().data).to.be.an('array'));",
                ],
                type: "text/javascript",
              },
            },
          ],
          request: {
            auth: {
              type: "bearer",
              bearer: [{ key: "token", value: "{{doctor_token}}" }],
            },
            method: "POST",
            header: [{ key: "Content-Type", value: "application/json" }],
            body: {
              mode: "raw",
              raw: JSON.stringify(
                {
                  visitType: "OPD",
                  reason: "Hypertension follow-up & chronic headache",
                  diagnosis: "Essential Hypertension (Stage 1)",
                  notes:
                    "BP recorded 140/90 mmHg. Advised low-sodium diet and prescribed Amlodipine 5mg once daily.",
                  vitals: {
                    bp: "140/90",
                    pulse: "78",
                    temp: "98.6",
                    weight: "82",
                  },
                },
                null,
                2,
              ),
            },
            url: {
              raw: "{{base_url}}/patients/{{patient_id}}/history",
              host: ["{{base_url}}"],
              path: ["patients", "{{patient_id}}", "history"],
            },
          },
        },
      ],
      description:
        "Longitudinal Electronic Health Records (EHR) and clinical consultations.",
    },

    // 04 - Appointments
    {
      name: "04 - Appointments & Scheduling",
      item: [
        {
          name: "Create In-Person Appointment",
          event: [
            {
              listen: "test",
              script: {
                exec: [
                  "pm.test('Status is 201 Created', () => pm.response.to.have.status(201));",
                  "const appt = pm.response.json().data;",
                  "pm.collectionVariables.set('appointment_id', appt._id);",
                  "pm.test('Appointment ID generated', () => pm.expect(appt.appointmentId).to.match(/^APT-/));",
                ],
                type: "text/javascript",
              },
            },
          ],
          request: {
            auth: {
              type: "bearer",
              bearer: [{ key: "token", value: "{{receptionist_token}}" }],
            },
            method: "POST",
            header: [{ key: "Content-Type", value: "application/json" }],
            body: {
              mode: "raw",
              raw: JSON.stringify(
                {
                  patient: "{{patient_id}}",
                  doctor: "{{doctor_id}}",
                  appointmentDate: "{{dynamic_appointment_date}}",
                  duration: 20,
                  type: "In-Person",
                  reason: "Routine cardiovascular consultation",
                },
                null,
                2,
              ),
            },
            url: {
              raw: "{{base_url}}/appointments",
              host: ["{{base_url}}"],
              path: ["appointments"],
            },
          },
        },
        {
          name: "List Appointments",
          event: [
            {
              listen: "test",
              script: {
                exec: [
                  "pm.test('Status is 200 OK', () => pm.response.to.have.status(200));",
                ],
                type: "text/javascript",
              },
            },
          ],
          request: {
            auth: {
              type: "bearer",
              bearer: [{ key: "token", value: "{{receptionist_token}}" }],
            },
            method: "GET",
            header: [],
            url: {
              raw: "{{base_url}}/appointments",
              host: ["{{base_url}}"],
              path: ["appointments"],
            },
          },
        },
        {
          name: "Get Appointment By ID",
          event: [
            {
              listen: "test",
              script: {
                exec: [
                  "pm.test('Status is 200 OK', () => pm.response.to.have.status(200));",
                  "pm.test('Appointment ID matches', () => pm.expect(pm.response.json().data._id).to.eql(pm.collectionVariables.get('appointment_id')));",
                ],
                type: "text/javascript",
              },
            },
          ],
          request: {
            auth: {
              type: "bearer",
              bearer: [{ key: "token", value: "{{receptionist_token}}" }],
            },
            method: "GET",
            header: [],
            url: {
              raw: "{{base_url}}/appointments/{{appointment_id}}",
              host: ["{{base_url}}"],
              path: ["appointments", "{{appointment_id}}"],
            },
          },
        },
        {
          name: "Update Status - Completed",
          event: [
            {
              listen: "test",
              script: {
                exec: [
                  "pm.test('Status is 200 OK', () => pm.response.to.have.status(200));",
                  "pm.test('Status set to Completed', () => pm.expect(pm.response.json().data.status).to.eql('Completed'));",
                ],
                type: "text/javascript",
              },
            },
          ],
          request: {
            auth: {
              type: "bearer",
              bearer: [{ key: "token", value: "{{doctor_token}}" }],
            },
            method: "PATCH",
            header: [{ key: "Content-Type", value: "application/json" }],
            body: {
              mode: "raw",
              raw: JSON.stringify({ status: "Completed" }, null, 2),
            },
            url: {
              raw: "{{base_url}}/appointments/{{appointment_id}}/status",
              host: ["{{base_url}}"],
              path: ["appointments", "{{appointment_id}}", "status"],
            },
          },
        },
      ],
      description: "Queue management and slot scheduling.",
    },

    // 05 - Billing & Revenue Analytics
    {
      name: "05 - Billing & Financial Management",
      item: [
        {
          name: "Create Comprehensive Bill",
          event: [
            {
              listen: "test",
              script: {
                exec: [
                  "pm.test('Status is 201 Created', () => pm.response.to.have.status(201));",
                  "const bill = pm.response.json().data;",
                  "pm.collectionVariables.set('bill_id', bill._id);",
                  "pm.test('Bill ID formatted', () => pm.expect(bill.billId).to.match(/^BILL-/));",
                ],
                type: "text/javascript",
              },
            },
          ],
          request: {
            auth: {
              type: "bearer",
              bearer: [{ key: "token", value: "{{receptionist_token}}" }],
            },
            method: "POST",
            header: [{ key: "Content-Type", value: "application/json" }],
            body: {
              mode: "raw",
              raw: JSON.stringify(
                {
                  patient: "{{patient_id}}",
                  appointment: "{{appointment_id}}",
                  items: [
                    {
                      description: "Specialist OPD Consultation",
                      category: "Consultation",
                      quantity: 1,
                      unitPrice: 2000,
                    },
                    {
                      description: "ECG Diagnostics",
                      category: "Procedure",
                      quantity: 1,
                      unitPrice: 1000,
                    },
                  ],
                  discount: 200,
                  notes: "Includes clinical assessment and diagnostic report",
                },
                null,
                2,
              ),
            },
            url: {
              raw: "{{base_url}}/bills",
              host: ["{{base_url}}"],
              path: ["bills"],
            },
          },
        },
        {
          name: "List Bills (Paginated & Filtered)",
          event: [
            {
              listen: "test",
              script: {
                exec: [
                  "pm.test('Status is 200 OK', () => pm.response.to.have.status(200));",
                ],
                type: "text/javascript",
              },
            },
          ],
          request: {
            auth: {
              type: "bearer",
              bearer: [{ key: "token", value: "{{receptionist_token}}" }],
            },
            method: "GET",
            header: [],
            url: {
              raw: "{{base_url}}/bills?page=1&limit=20",
              host: ["{{base_url}}"],
              path: ["bills"],
              query: [
                { key: "page", value: "1" },
                { key: "limit", value: "20" },
              ],
            },
          },
        },
        {
          name: "Record Partial / Full Payment",
          event: [
            {
              listen: "test",
              script: {
                exec: [
                  "pm.test('Status is 201 Created', () => pm.response.to.have.status(201));",
                  "pm.test('Payment recorded', () => pm.expect(pm.response.json().data.paidAmount).to.be.above(0));",
                ],
                type: "text/javascript",
              },
            },
          ],
          request: {
            auth: {
              type: "bearer",
              bearer: [{ key: "token", value: "{{receptionist_token}}" }],
            },
            method: "POST",
            header: [{ key: "Content-Type", value: "application/json" }],
            body: {
              mode: "raw",
              raw: JSON.stringify(
                {
                  amount: 2800,
                  method: "Card",
                  reference: "POS-MEEZAN-98421",
                },
                null,
                2,
              ),
            },
            url: {
              raw: "{{base_url}}/bills/{{bill_id}}/payments",
              host: ["{{base_url}}"],
              path: ["bills", "{{bill_id}}", "payments"],
            },
          },
        },
        {
          name: "Get Billing Revenue Summary",
          event: [
            {
              listen: "test",
              script: {
                exec: [
                  "pm.test('Status is 200 OK', () => pm.response.to.have.status(200));",
                  "const res = pm.response.json();",
                  "pm.test('Revenue totals calculated', () => pm.expect(res.data).to.have.property('totalCollected'));",
                ],
                type: "text/javascript",
              },
            },
          ],
          request: {
            auth: {
              type: "bearer",
              bearer: [{ key: "token", value: "{{admin_token}}" }],
            },
            method: "GET",
            header: [],
            url: {
              raw: "{{base_url}}/bills/revenue?dateFrom=2026-01-01&dateTo=2026-12-31",
              host: ["{{base_url}}"],
              path: ["bills", "revenue"],
              query: [
                { key: "dateFrom", value: "2026-01-01" },
                { key: "dateTo", value: "2026-12-31" },
              ],
            },
          },
        },
      ],
      description:
        "Multi-line billing, POS payments, discounts, and revenue summaries.",
    },

    // 06 - Pharmacy & FEFO Batches
    {
      name: "06 - Pharmacy & FEFO Inventory",
      item: [
        {
          name: "Create Medicine Supplier",
          event: [
            {
              listen: "prerequest",
              script: {
                exec: [
                  "const rand = Math.floor(100 + Math.random() * 900);",
                  "pm.collectionVariables.set('dynamic_supplier_name', `Getz Pharma Dist ${rand}`);",
                ],
                type: "text/javascript",
              },
            },
            {
              listen: "test",
              script: {
                exec: [
                  "pm.test('Status is 201 Created', () => pm.response.to.have.status(201));",
                  "pm.collectionVariables.set('supplier_id', pm.response.json().data._id);",
                ],
                type: "text/javascript",
              },
            },
          ],
          request: {
            auth: {
              type: "bearer",
              bearer: [{ key: "token", value: "{{pharmacist_token}}" }],
            },
            method: "POST",
            header: [{ key: "Content-Type", value: "application/json" }],
            body: {
              mode: "raw",
              raw: JSON.stringify(
                {
                  name: "{{dynamic_supplier_name}}",
                  contactPerson: "Muhammad Usman",
                  phone: "03009876543",
                  email: "orders@getzpharma-dist.pk",
                  address: "Korangi Industrial Area, Karachi",
                },
                null,
                2,
              ),
            },
            url: {
              raw: "{{base_url}}/suppliers",
              host: ["{{base_url}}"],
              path: ["suppliers"],
            },
          },
        },
        {
          name: "Create Medicine With FEFO Batches",
          event: [
            {
              listen: "prerequest",
              script: {
                exec: [
                  "const rand = Math.floor(100 + Math.random() * 900);",
                  "pm.collectionVariables.set('batch_early', `AUG-${rand}-EARLY`);",
                  "pm.collectionVariables.set('batch_later', `AUG-${rand}-LATER`);",
                ],
                type: "text/javascript",
              },
            },
            {
              listen: "test",
              script: {
                exec: [
                  "pm.test('Status is 201 Created', () => pm.response.to.have.status(201));",
                  "const med = pm.response.json().data;",
                  "pm.collectionVariables.set('medicine_id', med._id);",
                  "pm.test('Medicine ID assigned', () => pm.expect(med.medicineId).to.match(/^MED-/));",
                ],
                type: "text/javascript",
              },
            },
          ],
          request: {
            auth: {
              type: "bearer",
              bearer: [{ key: "token", value: "{{pharmacist_token}}" }],
            },
            method: "POST",
            header: [{ key: "Content-Type", value: "application/json" }],
            body: {
              mode: "raw",
              raw: JSON.stringify(
                {
                  name: "Augmentin 1g",
                  genericName: "Amoxicillin + Clavulanic Acid",
                  category: "Antibiotic",
                  unit: "Tablet",
                  supplier: "{{supplier_id}}",
                  unitPrice: 120,
                  reorderLevel: 30,
                  batches: [
                    {
                      batchNumber: "{{batch_early}}",
                      quantity: 50,
                      costPrice: 85,
                      expiryDate: "2026-11-30",
                      receivedDate: "2026-08-15",
                    },
                    {
                      batchNumber: "{{batch_later}}",
                      quantity: 150,
                      costPrice: 88,
                      expiryDate: "2027-10-31",
                      receivedDate: "2026-08-15",
                    },
                  ],
                },
                null,
                2,
              ),
            },
            url: {
              raw: "{{base_url}}/medicines",
              host: ["{{base_url}}"],
              path: ["medicines"],
            },
          },
        },
        {
          name: "Get Medicine Categories",
          event: [
            {
              listen: "test",
              script: {
                exec: [
                  "pm.test('Status is 200 OK', () => pm.response.to.have.status(200));",
                  "pm.test('Categories array returned', () => pm.expect(pm.response.json().data).to.be.an('array'));",
                ],
                type: "text/javascript",
              },
            },
          ],
          request: {
            auth: {
              type: "bearer",
              bearer: [{ key: "token", value: "{{pharmacist_token}}" }],
            },
            method: "GET",
            header: [],
            url: {
              raw: "{{base_url}}/medicines/categories",
              host: ["{{base_url}}"],
              path: ["medicines", "categories"],
            },
          },
        },
        {
          name: "Get Low Stock Medicines",
          event: [
            {
              listen: "test",
              script: {
                exec: [
                  "pm.test('Status is 200 OK', () => pm.response.to.have.status(200));",
                ],
                type: "text/javascript",
              },
            },
          ],
          request: {
            auth: {
              type: "bearer",
              bearer: [{ key: "token", value: "{{pharmacist_token}}" }],
            },
            method: "GET",
            header: [],
            url: {
              raw: "{{base_url}}/medicines/low-stock",
              host: ["{{base_url}}"],
              path: ["medicines", "low-stock"],
            },
          },
        },
        {
          name: "Get Expiring Batches (Radar)",
          event: [
            {
              listen: "test",
              script: {
                exec: [
                  "pm.test('Status is 200 OK', () => pm.response.to.have.status(200));",
                ],
                type: "text/javascript",
              },
            },
          ],
          request: {
            auth: {
              type: "bearer",
              bearer: [{ key: "token", value: "{{pharmacist_token}}" }],
            },
            method: "GET",
            header: [],
            url: {
              raw: "{{base_url}}/medicines/expiring?days=180",
              host: ["{{base_url}}"],
              path: ["medicines", "expiring"],
              query: [{ key: "days", value: "180" }],
            },
          },
        },
      ],
      description:
        "Pharmaceutical inventory, FEFO batch tracking, and expiry alerts.",
    },

    // 07 - Inventory & Sales POS
    {
      name: "07 - POS Sales & FEFO Dispensing",
      item: [
        {
          name: "Dispense Medicine Sale (FEFO Automated)",
          event: [
            {
              listen: "test",
              script: {
                exec: [
                  "pm.test('Status is 201 Created', () => pm.response.to.have.status(201));",
                  "const sale = pm.response.json().data;",
                  "pm.collectionVariables.set('sale_id', sale._id);",
                  "pm.test('Sale invoice number generated', () => pm.expect(sale.saleId).to.match(/^SALE-/));",
                ],
                type: "text/javascript",
              },
            },
          ],
          request: {
            auth: {
              type: "bearer",
              bearer: [{ key: "token", value: "{{pharmacist_token}}" }],
            },
            method: "POST",
            header: [{ key: "Content-Type", value: "application/json" }],
            body: {
              mode: "raw",
              raw: JSON.stringify(
                {
                  items: [{ medicine: "{{medicine_id}}", quantity: 30 }],
                  customerName: "Kamran Akmal",
                  customerPhone: "03021234567",
                },
                null,
                2,
              ),
            },
            url: {
              raw: "{{base_url}}/sales",
              host: ["{{base_url}}"],
              path: ["sales"],
            },
          },
        },
        {
          name: "Get Sale Invoice By ID",
          event: [
            {
              listen: "test",
              script: {
                exec: [
                  "pm.test('Status is 200 OK', () => pm.response.to.have.status(200));",
                ],
                type: "text/javascript",
              },
            },
          ],
          request: {
            auth: {
              type: "bearer",
              bearer: [{ key: "token", value: "{{pharmacist_token}}" }],
            },
            method: "GET",
            header: [],
            url: {
              raw: "{{base_url}}/sales/{{sale_id}}",
              host: ["{{base_url}}"],
              path: ["sales", "{{sale_id}}"],
            },
          },
        },
        {
          name: "Void Sale & Restore Stock (Admin)",
          event: [
            {
              listen: "test",
              script: {
                exec: [
                  "pm.test('Status is 200 OK', () => pm.response.to.have.status(200));",
                  "pm.test('Restoration confirmed', () => pm.expect(pm.response.json().message).to.include('stock restored'));",
                ],
                type: "text/javascript",
              },
            },
          ],
          request: {
            auth: {
              type: "bearer",
              bearer: [{ key: "token", value: "{{admin_token}}" }],
            },
            method: "PATCH",
            header: [{ key: "Content-Type", value: "application/json" }],
            body: {
              mode: "raw",
              raw: JSON.stringify(
                {
                  voidReason:
                    "Customer returned sealed packaging within 15 mins",
                },
                null,
                2,
              ),
            },
            url: {
              raw: "{{base_url}}/sales/{{sale_id}}/void",
              host: ["{{base_url}}"],
              path: ["sales", "{{sale_id}}", "void"],
            },
          },
        },
      ],
      description:
        "Counter point-of-sale, automated FEFO deductions, and stock-restoring voids.",
    },

    // 08 - Executive Dashboard
    {
      name: "08 - Operations Dashboard Aggregator",
      item: [
        {
          name: "Get Real-time Dashboard KPI Stats",
          event: [
            {
              listen: "test",
              script: {
                exec: [
                  "pm.test('Status is 200 OK', () => pm.response.to.have.status(200));",
                  "const d = pm.response.json().data;",
                  "pm.test('Total patients reported', () => pm.expect(d.totalPatients).to.be.a('number'));",
                  "pm.test('Today appointments counted', () => pm.expect(d.todayAppointments).to.be.a('number'));",
                  "pm.test('Low stock inventory list returned', () => pm.expect(d.lowStock).to.be.an('array'));",
                ],
                type: "text/javascript",
              },
            },
          ],
          request: {
            auth: {
              type: "bearer",
              bearer: [{ key: "token", value: "{{admin_token}}" }],
            },
            method: "GET",
            header: [],
            url: {
              raw: "{{base_url}}/dashboard/stats",
              host: ["{{base_url}}"],
              path: ["dashboard", "stats"],
            },
            description:
              "High-performance aggregator returning real-time clinic overview KPIs.",
          },
        },
      ],
      description: "Unified KPI data pipeline.",
    },

    // 09 - Reports
    {
      name: "09 - Clinical & Financial Reports",
      item: [
        {
          name: "Revenue Report",
          event: [
            {
              listen: "test",
              script: {
                exec: [
                  "pm.test('Status is 200 OK', () => pm.response.to.have.status(200));",
                ],
                type: "text/javascript",
              },
            },
          ],
          request: {
            auth: {
              type: "bearer",
              bearer: [{ key: "token", value: "{{admin_token}}" }],
            },
            method: "GET",
            header: [],
            url: {
              raw: "{{base_url}}/reports/revenue?dateFrom=2026-01-01&dateTo=2026-12-31",
              host: ["{{base_url}}"],
              path: ["reports", "revenue"],
              query: [
                { key: "dateFrom", value: "2026-01-01" },
                { key: "dateTo", value: "2026-12-31" },
              ],
            },
          },
        },
        {
          name: "Appointments Analytics Report",
          event: [
            {
              listen: "test",
              script: {
                exec: [
                  "pm.test('Status is 200 OK', () => pm.response.to.have.status(200));",
                ],
                type: "text/javascript",
              },
            },
          ],
          request: {
            auth: {
              type: "bearer",
              bearer: [{ key: "token", value: "{{admin_token}}" }],
            },
            method: "GET",
            header: [],
            url: {
              raw: "{{base_url}}/reports/appointments",
              host: ["{{base_url}}"],
              path: ["reports", "appointments"],
            },
          },
        },
        {
          name: "Patients Demographics Report",
          event: [
            {
              listen: "test",
              script: {
                exec: [
                  "pm.test('Status is 200 OK', () => pm.response.to.have.status(200));",
                ],
                type: "text/javascript",
              },
            },
          ],
          request: {
            auth: {
              type: "bearer",
              bearer: [{ key: "token", value: "{{admin_token}}" }],
            },
            method: "GET",
            header: [],
            url: {
              raw: "{{base_url}}/reports/patients",
              host: ["{{base_url}}"],
              path: ["reports", "patients"],
            },
          },
        },
        {
          name: "Pharmacy Inventory Report",
          event: [
            {
              listen: "test",
              script: {
                exec: [
                  "pm.test('Status is 200 OK', () => pm.response.to.have.status(200));",
                ],
                type: "text/javascript",
              },
            },
          ],
          request: {
            auth: {
              type: "bearer",
              bearer: [{ key: "token", value: "{{pharmacist_token}}" }],
            },
            method: "GET",
            header: [],
            url: {
              raw: "{{base_url}}/reports/inventory",
              host: ["{{base_url}}"],
              path: ["reports", "inventory"],
            },
          },
        },
      ],
      description:
        "Aggregated reporting modules for administration and audit compliance.",
    },

    // 10 - Gemini AI
    {
      name: "10 - Bilingual Gemini AI Assistant",
      item: [
        {
          name: "AI Engine Status Check",
          event: [
            {
              listen: "test",
              script: {
                exec: [
                  "pm.test('Status is 200 OK', () => pm.response.to.have.status(200));",
                  "pm.test('Provider is configured', () => pm.expect(pm.response.json().data).to.have.property('provider'));",
                ],
                type: "text/javascript",
              },
            },
          ],
          request: {
            auth: {
              type: "bearer",
              bearer: [{ key: "token", value: "{{admin_token}}" }],
            },
            method: "GET",
            header: [],
            url: {
              raw: "{{base_url}}/ai/status",
              host: ["{{base_url}}"],
              path: ["ai", "status"],
            },
          },
        },
        {
          name: "Natural Language Clinic Inquiry (Urdu / English)",
          event: [
            {
              listen: "test",
              script: {
                exec: [
                  "pm.test('Status is 200 OK', () => pm.response.to.have.status(200));",
                  "pm.test('AI response returned', () => pm.expect(pm.response.json().data).to.have.property('reply'));",
                ],
                type: "text/javascript",
              },
            },
          ],
          request: {
            auth: {
              type: "bearer",
              bearer: [{ key: "token", value: "{{admin_token}}" }],
            },
            method: "POST",
            header: [{ key: "Content-Type", value: "application/json" }],
            body: {
              mode: "raw",
              raw: JSON.stringify(
                {
                  query:
                    "How many appointments were completed today and what is our stock status for Augmentin?",
                },
                null,
                2,
              ),
            },
            url: {
              raw: "{{base_url}}/ai/query",
              host: ["{{base_url}}"],
              path: ["ai", "query"],
            },
          },
        },
        {
          name: "Generate Executive Daily Briefing",
          event: [
            {
              listen: "test",
              script: {
                exec: [
                  "pm.test('Status is 200 OK', () => pm.response.to.have.status(200));",
                ],
                type: "text/javascript",
              },
            },
          ],
          request: {
            auth: {
              type: "bearer",
              bearer: [{ key: "token", value: "{{admin_token}}" }],
            },
            method: "GET",
            header: [],
            url: {
              raw: "{{base_url}}/ai/daily-report",
              host: ["{{base_url}}"],
              path: ["ai", "daily-report"],
            },
          },
        },
      ],
      description: "Generative AI capabilities with clinical auditing.",
    },

    // 11 - Telemedicine
    {
      name: "11 - Telemedicine Virtual Rooms",
      item: [
        {
          name: "Create Telemedicine Video Room",
          event: [
            {
              listen: "test",
              script: {
                exec: [
                  "pm.test('Status is 200 or 201', () => pm.expect([200, 201]).to.include(pm.response.code));",
                  "const room = pm.response.json().data || pm.response.json();",
                  "if (room.roomId || room.roomUrl) pm.collectionVariables.set('telemedicine_room_id', room.roomId || 'room-demo');",
                ],
                type: "text/javascript",
              },
            },
          ],
          request: {
            auth: {
              type: "bearer",
              bearer: [{ key: "token", value: "{{doctor_token}}" }],
            },
            method: "POST",
            header: [{ key: "Content-Type", value: "application/json" }],
            body: {
              mode: "raw",
              raw: JSON.stringify(
                {
                  patientId: "{{patient_id}}",
                  doctorId: "{{doctor_id}}",
                  appointmentId: "{{appointment_id}}",
                },
                null,
                2,
              ),
            },
            url: {
              raw: "{{base_url}}/telemedicine/create-room",
              host: ["{{base_url}}"],
              path: ["telemedicine", "create-room"],
            },
          },
        },
      ],
      description: "Encrypted WebRTC virtual consultation rooms.",
    },

    // 12 - Settings & Security
    {
      name: "12 - Clinic Settings & Security",
      item: [
        {
          name: "Get Clinic Settings Profile",
          event: [
            {
              listen: "test",
              script: {
                exec: [
                  "pm.test('Status is 200 OK', () => pm.response.to.have.status(200));",
                  "pm.test('Clinic profile populated', () => pm.expect(pm.response.json().data).to.have.property('name'));",
                ],
                type: "text/javascript",
              },
            },
          ],
          request: {
            auth: {
              type: "bearer",
              bearer: [{ key: "token", value: "{{admin_token}}" }],
            },
            method: "GET",
            header: [],
            url: {
              raw: "{{base_url}}/settings/clinic",
              host: ["{{base_url}}"],
              path: ["settings", "clinic"],
            },
          },
        },
        {
          name: "Update Clinic Settings Profile",
          event: [
            {
              listen: "test",
              script: {
                exec: [
                  "pm.test('Status is 200 OK', () => pm.response.to.have.status(200));",
                ],
                type: "text/javascript",
              },
            },
          ],
          request: {
            auth: {
              type: "bearer",
              bearer: [{ key: "token", value: "{{admin_token}}" }],
            },
            method: "PUT",
            header: [{ key: "Content-Type", value: "application/json" }],
            body: {
              mode: "raw",
              raw: JSON.stringify(
                {
                  clinicName: "SmartClinic Healthcare Center",
                  phone: "+92 51 2851234",
                  email: "contact@smartclinic.pk",
                  address: "Sector F-8 Markaz, Islamabad, Pakistan",
                },
                null,
                2,
              ),
            },
            url: {
              raw: "{{base_url}}/settings/clinic",
              host: ["{{base_url}}"],
              path: ["settings", "clinic"],
            },
          },
        },
      ],
      description:
        "Clinic brand customization, currency, and address configurations.",
    },

    // 13 - Destructive Tests & Cleanup (Manual Run Only)
    {
      name: "13 - Destructive Tests & Cleanup (Manual Run Only)",
      item: [
        {
          name: "Deactivate Captured Staff Member",
          event: [
            {
              listen: "test",
              script: {
                exec: [
                  "pm.test('Status is 200 OK', () => pm.response.to.have.status(200));",
                ],
                type: "text/javascript",
              },
            },
          ],
          request: {
            auth: {
              type: "bearer",
              bearer: [{ key: "token", value: "{{admin_token}}" }],
            },
            method: "DELETE",
            header: [],
            url: {
              raw: "{{base_url}}/users/{{user_id}}",
              host: ["{{base_url}}"],
              path: ["users", "{{user_id}}"],
            },
            description:
              "Soft-deactivates the user captured during the test suite.",
          },
        },
        {
          name: "Archive Medicine",
          event: [
            {
              listen: "test",
              script: {
                exec: [
                  "pm.test('Status is 200 OK', () => pm.response.to.have.status(200));",
                ],
                type: "text/javascript",
              },
            },
          ],
          request: {
            auth: {
              type: "bearer",
              bearer: [{ key: "token", value: "{{admin_token}}" }],
            },
            method: "DELETE",
            header: [],
            url: {
              raw: "{{base_url}}/medicines/{{medicine_id}}",
              host: ["{{base_url}}"],
              path: ["medicines", "{{medicine_id}}"],
            },
            description: "Soft-deletes or archives test medicine.",
          },
        },
        {
          name: "Deactivate Supplier",
          event: [
            {
              listen: "test",
              script: {
                exec: [
                  "pm.test('Status is 200 OK', () => pm.response.to.have.status(200));",
                ],
                type: "text/javascript",
              },
            },
          ],
          request: {
            auth: {
              type: "bearer",
              bearer: [{ key: "token", value: "{{admin_token}}" }],
            },
            method: "DELETE",
            header: [],
            url: {
              raw: "{{base_url}}/suppliers/{{supplier_id}}",
              host: ["{{base_url}}"],
              path: ["suppliers", "{{supplier_id}}"],
            },
            description: "Deactivates test supplier record.",
          },
        },
        {
          name: "Archive Patient",
          event: [
            {
              listen: "test",
              script: {
                exec: [
                  "pm.test('Status is 200 OK', () => pm.response.to.have.status(200));",
                ],
                type: "text/javascript",
              },
            },
          ],
          request: {
            auth: {
              type: "bearer",
              bearer: [{ key: "token", value: "{{admin_token}}" }],
            },
            method: "DELETE",
            header: [],
            url: {
              raw: "{{base_url}}/patients/{{patient_id}}",
              host: ["{{base_url}}"],
              path: ["patients", "{{patient_id}}"],
            },
            description: "Archives test patient record.",
          },
        },
      ],
      description: "Manual teardown requests to clean up created entities.",
    },
  ],
};

const outputPath = path.join(
  __dirname,
  "../../SmartClinic_FYP_Complete_API_Test_Suite_v2.json",
);

fs.writeFileSync(outputPath, JSON.stringify(collection, null, 2), "utf8");
console.log(
  "✅ Successfully updated enhanced Postman collection at:",
  outputPath,
);
