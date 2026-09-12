# SmartClinic SaaS, Multi-Tenant Architecture & Security Specification

**System:** Smart Clinic & Pharmacy Management SaaS for Local Healthcare Facilities
**Author:** Anis Khan Niazi (BSIT Final Year Project)
**Technology Stack:** Node.js, Express 5, MongoDB Atlas, Mongoose 9, React + Vite, JWT + HttpOnly Cookies

---

## 1. Executive Architectural Overview

SmartClinic SaaS adopts a **Shared-Database, Tenant-Partitioned Architecture** powered by a mandatory `clinicId` discriminator on all tenant-specific documents. This model was selected over a database-per-tenant pattern because:

1. **Operational Simplicity & Cost Efficiency:** Hundreds of small to medium healthcare facilities (local clinics, outpatient clinics, standalone pharmacies) can be hosted on a managed MongoDB Atlas cluster without cluster provisioning overhead or connection pool exhaustion.
2. **Aggregated Cross-Facility SaaS Insights:** Allows platform administrators to perform anonymized public health analysis, platform benchmarking, and resource optimization across facilities.
3. **Guaranteed Data Boundary Enforcement:** Isolation is verified at three distinct boundaries:
   - **Schema Boundary:** Mongoose schema-level validations reject missing `clinicId` fields.
   - **Database Index Boundary:** MongoDB Atlas compound unique indexes `{ clinicId: 1, ... }` partition unique namespaces per tenant.
   - **Application Middleware Boundary:** Express middleware (`protect`, `authorize`, `req.clinicId`) strictly constrains every read, write, update, and aggregation pipeline.

```mermaid
graph TD
    Client[Web SPA / Mobile Client] -->|Bearer JWT or HttpOnly Cookie| AuthMiddleware[Auth Middleware: protect]
    AuthMiddleware -->|Verify JWT & Check Clinic Status| Context[Set req.user & req.clinicId]
    Context --> RBAC[Role Middleware: authorize]
    RBAC --> Controller[Feature Controller]
    Controller -->|Query Predicate: { clinicId: req.user.clinicId }| Atlas[(MongoDB Atlas Cluster)]
```

---

## 2. Tenant Onboarding & Authentication Architecture

### 2.1 Self-Service Clinic Onboarding

- **Route:** `POST /api/auth/register-clinic` (also aliased to `POST /api/auth/register`)
- **Access:** Public
- **Provisioning Steps:**
  1. Validates unique clinic name and administrator email.
  2. Generates a URL-safe unique `slug` (e.g., `al-shifa-clinic`).
  3. Creates the `Clinic` tenant document (`status: 'active'`, `subscriptionPlan: 'basic'`).
  4. Bootstraps default `ClinicSettings` (timings, contact info, prescription header).
  5. Provisions the primary tenant administrator (`role: 'Admin'`, `isClinicOwner: true`, `clinicId: clinic._id`).
  6. Links administrator back to `clinic.owner`.
  7. Signs and issues JWT token and secure cookie.

### 2.2 JWT Payload Structure

The JWT token issued upon login or clinic creation encapsulates tenant context:

```json
{
  "id": "6aa170ed562fde854d97dc4a",
  "clinicId": "6aa170ed562fde854d97dc48",
  "role": "Admin",
  "iat": 1788965000,
  "exp": 1789569800
}
```

### 2.3 Middleware Tenant Enforcement

Every authenticated request passes through `protect` in `src/middlewares/authMiddleware.js`:

- Verifies JWT signature and expiry.
- Fetches active user and verifies `user.isActive === true`.
- **Tenant Status Guard:** If `user.clinicStatus === 'suspended'` or `user.clinicStatus === 'inactive'`, the request is blocked with `403 Forbidden`.
- Injects `req.user` and `req.clinicId = user.clinicId`.

---

## 3. Role-Based Access Control (RBAC) Matrix

SmartClinic defines four distinct clinical operational roles:

| Module / Endpoint Group                                      |         Admin         |      Doctor       |  Receptionist   |     Pharmacist     | Tenant Scoping Rule                                     |
| :----------------------------------------------------------- | :-------------------: | :---------------: | :-------------: | :----------------: | :------------------------------------------------------ |
| **Clinic Settings** (`/settings`)                            |     ✅ Read/Write     |        ❌         |       ❌        |         ❌         | Scoped to `clinicId`                                    |
| **Staff Management** (`/users`)                              |     ✅ Full CRUD      |        ❌         |       ❌        |         ❌         | Only lists staff in same `clinicId`                     |
| **Doctor List** (`/users/doctors`)                           |        ✅ Read        |      ✅ Read      |     ✅ Read     |         ❌         | Active doctors within `clinicId`                        |
| **Patient Demographics** (`/patients`)                       |     ✅ Full CRUD      |      ✅ Read      |  ✅ Full CRUD   |         ❌         | Scoped to `clinicId`                                    |
| **Clinical EHR Notes** (`/patients/:id/history`)             |          ❌           |     ✅ Write      |       ❌        |         ❌         | Doctor must belong to same `clinicId`                   |
| **Appointments** (`/appointments`)                           |     ✅ Full CRUD      | ✅ Doctor Scoped  |  ✅ Full CRUD   |         ❌         | Scoped to `clinicId`; Doctors view their assigned slots |
| **Appointment Completion**                                   |          ❌           | ✅ Assigned Only  |       ❌        |         ❌         | Only assigned doctor can mark Completed                 |
| **Billing & Payments** (`/bills`)                            |     ✅ Full CRUD      |        ❌         |  ✅ Full CRUD   |         ❌         | Scoped to `clinicId`                                    |
| **Revenue Analytics** (`/bills/revenue`, `/reports/revenue`) |        ✅ Read        |        ❌         |       ❌        |         ❌         | Strictly Admin; grouped by `clinicId`                   |
| **Pharmacy Suppliers** (`/suppliers`)                        |     ✅ Full CRUD      |        ❌         |       ❌        |    ✅ Full CRUD    | Scoped to `clinicId`                                    |
| **Medicine Inventory** (`/medicines`)                        |     ✅ Full CRUD      |        ❌         |       ❌        |    ✅ Full CRUD    | Scoped to `clinicId`                                    |
| **POS Medicine Sales** (`/sales`)                            |     ✅ Full CRUD      |        ❌         |       ❌        |   ✅ Create/Read   | Scoped to `clinicId`; FEFO auto-deduction               |
| **Void Sale & Restock** (`/sales/:id/void`)                  |       ✅ Write        |        ❌         |       ❌        |         ❌         | Admin authorization required to reverse transaction     |
| **Operations Dashboard** (`/dashboard`)                      | ✅ Overview/Rev/Pharm |   ✅ 'Your Day'   | ✅ Overview/Rev | ✅ Inventory/Sales | Zero 403s: Frontend views align with RBAC permissions   |
| **Bilingual Gemini AI** (`/ai`)                              |        ✅ Full        | ✅ Clinical Notes | ✅ Daily Report | ✅ Stock Insights  | Multi-tenant audit trail with non-blocking logging      |
| **Telemedicine** (`/telemedicine`)                           |     ✅ Read/Write     |   ✅ Read/Write   |       ❌        |         ❌         | WebRTC room generation; EHR masked for unauthenticated  |

---

## 4. Multi-Tenant Sequence Generator Architecture

To avoid cross-tenant sequential number leakage while keeping human-friendly IDs, the ID generator uses atomic MongoDB counters keyed by `${type}_${clinicId}`:

- Patient: `PT-000001`, `PT-000002`, ...
- Appointment: `APT-000001`, `APT-000002`, ...
- Bill: `BIL-000001`, `BIL-000002`, ...
- Medicine: `MED-000001`, `MED-000002`, ...
- Sale: `SALE-000001`, `SALE-000002`, ...

Each clinic starts counting from `1`, and existing clinics maintain continuous unbroken sequences without interference.

---

## 5. MongoDB Atlas Index Optimization & Partial Filters

Legacy single-field unique indexes that previously collided across tenants were dropped and migrated to compound indexes:

```javascript
// Patient Model Compound Indexes
patientSchema.index({ clinicId: 1, patientId: 1 }, { unique: true });
patientSchema.index(
  { clinicId: 1, cnic: 1 },
  {
    unique: true,
    partialFilterExpression: { cnic: { $type: "string" } },
  },
);
patientSchema.index({ clinicId: 1, phone: 1 });
patientSchema.index({ clinicId: 1, createdAt: -1 });

// Billing Model Compound Indexes
billSchema.index({ clinicId: 1, billId: 1 }, { unique: true });
billSchema.index({ clinicId: 1, patient: 1 });
billSchema.index({ clinicId: 1, status: 1 });
billSchema.index({ clinicId: 1, createdAt: -1 });

// Medicine & Inventory Compound Indexes
medicineSchema.index({ clinicId: 1, medicineId: 1 }, { unique: true });
medicineSchema.index({ clinicId: 1, barcode: 1 }, { sparse: true });
medicineSchema.index({ clinicId: 1, category: 1 });

// POS Sales Compound Indexes
saleSchema.index({ clinicId: 1, saleId: 1 }, { unique: true });
saleSchema.index({ clinicId: 1, createdAt: -1 });

// Appointments Compound Indexes
appointmentSchema.index({ clinicId: 1, appointmentId: 1 }, { unique: true });
appointmentSchema.index({ clinicId: 1, doctor: 1, appointmentDate: 1 });
appointmentSchema.index({ clinicId: 1, appointmentDate: 1 });
```

---

## 6. Security Guarantees & Defensive Measures

1. **CORS & Cookie Security:**
   - SameSite: `lax` in development, `none` with `secure: true` (HTTPS) in production.
   - Origin whitelisting supporting localhost, production client URL, and preview deployments.
2. **Rate Limiting:**
   - Login rate limiter: Max 10 requests per 15 minutes in production (200 in development).
   - API rate limiter: Max 1000 requests per 15 minutes per IP.
3. **NoSQL Injection Prevention:**
   - Recursive object sanitizer (`src/middlewares/mongoSanitize.js`) strips prohibited MongoDB query operators (`$where`, `$regex`, `$gt`, etc.) from user input payloads.
4. **Non-Blocking Audit Logging:**
   - Background telemetry and audit logs (such as `AiAuditLog`) log asynchronously using `catch()` blocks to prevent user-facing API degradation.
5. **FEFO Inventory Allocation:**
   - Automated batch deductions in medicine sales sort batches by `expiryDate: 1`, guaranteeing that older inventory is dispensed first.

---

## 7. Automated Test Verification Suite

Run all verification test suites locally with:

```bash
npm test
```

Or run individual sub-suites:

```bash
npm run test:auth       # Multi-tenant onboarding & JWT tests
npm run test:rbac       # 96-endpoint RBAC security matrix
npm run test:e2e        # Complete 51-request Postman test suite
npm run test:reports    # Clinical & financial report aggregations
npm run test:dashboard  # Role dashboard rendering & mutations
npm run test:features   # Barcode, SMS/WhatsApp & Telemedicine
npm run test:ai         # Bilingual Gemini assistant & audit logs
```
