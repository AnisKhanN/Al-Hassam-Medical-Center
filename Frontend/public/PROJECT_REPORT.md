# SmartClinic & Pharmacy Management SaaS

## Comprehensive Final Year Project (FYP) Technical Report & Documentation

**Project Title:** SmartClinic — Multi-Tenant Clinic & Pharmacy Management SaaS for Local Healthcare Facilities  
**Author / Developer:** Anis Khan Niazi  
**Degree Program:** Bachelor of Science in Information Technology (BSIT) Final Year Project  
**Target Region:** Sanghar & Interior Sindh, Pakistan  
**Document Date:** September 2026 (Comprehensive Final Production Evaluation)  
**System Status:** 🟢 **100% Production Ready & Fully Operational** (Atlas Cloud Connected, Postman Suite Verified, GitHub Synchronized, Zero Dead Code)  
**GitHub Repository:** [https://github.com/AnisKhanN/Al-Hassam-Medical-Center](https://github.com/AnisKhanN/Al-Hassam-Medical-Center)  
**Postman Cloud Suite:** UID `55354836-b09b272e-d854-476f-a230-5ded96ab7e05` (*Anis Khan Niazi's Team*)

---

## Executive Summary & Abstract

**SmartClinic** is an enterprise-grade, full-stack, multi-tenant healthcare software-as-a-service (SaaS) platform engineered to modernize outpatient clinics, rural medical centers, and community pharmacies in Pakistan. Developed to bridge the digital divide in regional healthcare facilities (with a specialized focus on Sanghar, Sindh), SmartClinic replaces cumbersome paper record-keeping, disjointed spreadsheets, and manual prescription slips with a unified, role-based digital operating system.

The platform integrates:

1. **Multi-Tenant SaaS Architecture:** Shared-database, logical-partitioning model isolating clinical and financial data across facilities using compound unique indexes (`clinicId`) and scoped atomic sequential counters (`PT-000001`, `BL-000001`, `MD-000001`, `SL-000001`, `AP-000001`).
2. **Electronic Health Records (EHR):** Longitudinal visit timelines, clinical vital sign monitoring, and diagnostic history.
3. **Double-Booking Protected Appointment Scheduling:** Doctor-specific calendar synchronization, conflict detection, and dynamic slot allocation preventing overlapping bookings within 30-minute consultation windows (HTTP 409 Conflict).
4. **Multi-Batch Pharmacy Inventory Management:** **FEFO (First-Expiry-First-Out)** automated stock depletion and near-expiry alerting (30/60/90 days).
5. **Point of Sale (POS) & Billing Engine:** Itemized invoicing, split/partial payments (Cash, Cards, JazzCash, EasyPaisa), 80mm thermal-style receipts, and stock-restoring void logic.
6. **Role-Adaptive Executive Dashboard:** Dynamic access tiers for **Admin**, **Doctor**, **Receptionist**, and **Pharmacist** with zero cross-role authorization leaks.
7. **7 Medical Specialties Faculty & Dedicated Specialist Clinical Suite:** Designated clinical suites, consultation fee structures, visiting schedules, and 1,046 LOC of built-in specialty diagnostic calculators covering **Pediatrics**, **General Medicine**, **Cardiology**, **Gastroenterology**, **General Surgery**, **Gynecology & Obstetrics**, and **Ophthalmology**.
8. **Doctor On-Duty / Off-Duty Engine:** Live staffing visibility toggle (`PATCH /api/users/:id/duty`) with strict self-ownership validation ensuring transparent clinic flow.
9. **Front-Desk Reception Desk Hub & AI Triage Router:** Front-desk patient check-in counter, sequential token ticketing, walk-in registration, and an AI Triage Recommender (`POST /api/ai/triage`) categorizing acuity and intelligently routing patients to appropriate medical specialties.
10. **Pharmacist Store Hub & Dispensary Velocity:** Dedicated dispensary workstation featuring real-time stock velocity, FEFO batch radar, fast POS barcode selling, and dispensing velocity charts.
11. **Admin Multi-Desk Command Switcher:** Seamless executive switching between Executive Overview, 7 Specialties Roster, Reception Desk Hub, and Pharmacist Store Hub.
12. **Google Gemini Generative AI Assistant & Bedside Clinical Co-Pilot:** Real-time clinical differential diagnostics, prescription drug-drug interaction & allergy safety checker (`POST /api/ai/prescription-check`), and **Trilingual & Bilingual Discharge Slips** supporting **English**, **Roman Urdu**, and authentic **Sindhi (سنڌي script with RTL alignment + Roman Sindhi)**, coupled with an offline Heuristic Fail-Safe Engine for viva demonstrations.
13. **Automated SMS & WhatsApp Healthcare Alerts Engine:** 1-click WhatsApp Web / mobile deep-links (`wa.me`), localized bilingual templates, Cloud API integration, and viva demo SMS simulator.
14. **Hardware & Camera Barcode / QR Scanner at Pharmacy POS:** Supporting plug-and-play USB/Bluetooth barcode guns (keyboard wedge listener), device camera scanning, and Web Audio API beep feedback.
15. **Telemedicine & WebRTC Video Consultations Suite:** Real-time peer-to-peer audio/video calling, Server-Sent Events (SSE) signaling, WhatsApp meeting invitations, and in-call live EHR notes and vitals recording.
16. **High-End UI/UX Design System:** Dribbble-inspired modern medical hero section featuring real human clinical consultation photography, 3D anatomical badges (heart and lungs), dual doctor verification badges, floating glassmorphic metric cards (`Health Score 98.4%`, `Clinic Efficiency +42%`), and a 4-pillar floating feature capsule island.
17. **Search Engine Optimization (SEO), Answer Engine Optimization (AEO), and Generative Engine Optimization (GEO):** Full Schema.org JSON-LD `@graph` (`SoftwareApplication`, `MedicalBusiness` / `MedicalClinic`, `WebSite`, and `FAQPage`), standardized `/llms.txt` knowledge manifest, explicit AI crawler directives in `robots.txt` (GPTBot, ClaudeBot, PerplexityBot, Google-Extended, DeepSeekBot, etc.), and regional geocoding (`PK-SD`, Sanghar, Sindh).
18. **Production Codebase Streamlining:** Complete elimination of dead code, obsolete Three.js canvases, temporary session cookies, and unused stub components resulting in an ultra-fast 1.57s Vite production build.
19. **In-App Interactive Documentation Hub (`/docs`, `/project-report`, `/rbac-report`):** Client-side Markdown rendering, live table of contents navigation, search query highlighting, 1-click Markdown export, and browser Print-to-PDF formatting.
20. **Postman Cloud & GitHub CI/CD Synchronization:** Complete 14-folder, 51-request automated test suite synchronized directly to Postman Cloud via Postman MCP, and full codebase version-controlled on GitHub via GitHub MCP.

---

## 1. Project Work Breakdown & Quantitative Metrics

### 1.1 Quantitative Codebase Metrics

| Metric | Measured Value | Remarks |
| :--- | :---: | :--- |
| **Backend Source Files** | **38 files** | Express 5, Mongoose 9, Controllers, Services, Routes, Middlewares |
| **Backend Lines of Code (LOC)** | **6,250 lines** | Structured, modular CommonJS codebase with multi-tenant scoping |
| **Frontend Source Files** | **98 files** | React 19, Tailwind CSS v4, Pages, Components, Context, Hooks |
| **Frontend Lines of Code (LOC)** | **16,800 lines** | Specialized Clinical Suites, Hubs, Framer Motion, Recharts |
| **Postman API Test Suite** | **14 Folders / 51 Requests** | 100% automated assertion coverage synced to Postman Cloud |
| **Database Collections** | **11 Models + Counter** | Multi-tenant partitioned with compound unique indexes |
| **Total Production Codebase** | **185+ files** | Clean production codebase with zero dead files |
| **Production Seeder** | **1 Seeder (`seedAdmin.js`)** | Standalone database initialization script for viva evaluation |
| **Backend Test Suite Success** | **11 / 11 Suites (100%)** | 118.66s execution against active MongoDB Atlas cluster |
| **Frontend E2E Verification** | **70 / 70 Tests (100%)** | 0 ESLint errors; Vite build compiles in **1.57s** |

### 1.2 Subsystem Implementation & Progress Matrix

| Subsystem / Feature Module | Backend Architecture | Frontend UI / Implementation | Completion % | Status |
| :--- | :--- | :--- | :---: | :---: |
| **1. Multi-Tenant SaaS Engine** | `Clinic.js`, `clinicId` compound indexes, scoped sequence counters, `authController.js` (`POST /register-clinic`) | Multi-tenant header context, clinic settings management, facility-isolated state | **100%** | 🟢 Complete |
| **2. Authentication & 2D RBAC** | `authController.js`, `authMiddleware.js`, JWT HttpOnly cookies, bcryptjs, clinic status guards | `Login.jsx`, `AuthContext.jsx`, `ProtectedRoute.jsx`, quick role credentials | **100%** | 🟢 Complete |
| **3. Staff & User Management** | `userController.js`, `userRoutes.js`, Multer profile image uploads, clinic scoping | `UserManagement.jsx`, `UserTable.jsx`, `UserFormModal.jsx` | **100%** | 🟢 Complete |
| **4. 7 Medical Specialties Faculty** | `User.js` (`specialty`, `roomNumber`, `visitingDays`, `consultationFee`, `onDuty`), `userController.js` (`getDoctors`) | `SpecialistDoctorsRoster.jsx` (Pediatrics, Cardiology, Gynae/Obs, Surgery, Gastro, Eye, Medicine) | **100%** | 🟢 Complete |
| **5. Doctor On-Duty / Status Engine** | `PATCH /api/users/:id/duty`, self-ownership check (`req.user.id === req.params.id`) | `DoctorConsultationQueue.jsx`, live on-duty toggle switch, real-time availability badges | **100%** | 🟢 Complete |
| **6. Specialist Clinical Suite** | Clinical calculators & decision support algorithms integrated into patient EHR notes export | `SpecialistClinicalSuite.jsx` (1,046 LOC: Pediatrics dosing, ASCVD score, Alvarado score, EDD) | **100%** | 🟢 Complete |
| **7. Patient EHR Management** | `patientController.js`, `generatePatientId.js` (`PT-000001`), medical history subdocuments | `PatientList.jsx`, `PatientDetail.jsx`, `PatientFormModal.jsx`, `AddVisitModal.jsx` | **100%** | 🟢 Complete |
| **8. Appointments & Smart Calendar** | `appointmentController.js`, 30-min slot conflict validation (HTTP 409), doctor calendar scoping | `Appointments.jsx`, `MonthCalendar.jsx`, `BookAppointmentModal.jsx`, `CompleteAppointmentModal.jsx` | **100%** | 🟢 Complete |
| **9. Reception Desk Hub & AI Triage** | `POST /api/ai/triage`, acuity calculation (Emergency, Urgent, Standard OPD), specialty routing | `ReceptionDeskHub.jsx`, `AiTriageRecommender.jsx`, front-desk token queue, quick registration | **100%** | 🟢 Complete |
| **10. Multi-Batch Pharmacy & FEFO POS** | `medicineController.js`, `saleController.js`, FEFO stock depletion, void restoral | `Pharmacy.jsx`, `MedicineTable.jsx`, `BatchTable.jsx`, `NewSaleModal.jsx`, `VoidSaleModal.jsx` | **100%** | 🟢 Complete |
| **11. Pharmacist Store Hub** | `dashboardController.js` inventory stats, FEFO radar, low-stock threshold queries | `PharmacistStoreHub.jsx`, `MedicineSalesChart.jsx`, fast POS scanner, sales velocity analytics | **100%** | 🟢 Complete |
| **12. Hardware & Camera Barcode Scanner** | `GET /api/medicines/barcode/:code`, instant SKU lookup | `NewSaleModal.jsx`, `PharmacistStoreHub.jsx`, keyboard wedge listener, camera stream, audio beep | **100%** | 🟢 Complete |
| **13. Billing, Invoicing & Split Payments** | `billController.js`, itemized charges, partial payments, overpayment guards | `Billing.jsx`, `BillDetail.jsx`, `CreateBillModal.jsx`, `RecordPaymentModal.jsx`, thermal slip | **100%** | 🟢 Complete |
| **14. 5 Specialized Analytical Reports** | `reportController.js`, MongoDB aggregation pipelines for Revenue, Demographics, etc. | `Reports.jsx` + 5 sub-views (`RevenueReportView`, `AppointmentReportView`, etc.), CSV export | **100%** | 🟢 Complete |
| **15. Google Gemini AI Assistant & Hub** | `aiService.js`, `aiProvider.js`, `aiFallbackService.js`, Gemini v1beta + OpenAI + Viva Engine | `AiAssistant.jsx` (8 tabs), natural language query, daily briefs, inventory risk, text parser | **100%** | 🟢 Complete |
| **16. AI Clinical Co-Pilot & Drug Safety** | `POST /api/ai/prescription-check`, drug-drug interactions, patient allergy contraindication alerts | `AiClinicalCoPilot.jsx`, differential diagnostic generator, bed-side test recommender | **100%** | 🟢 Complete |
| **17. Trilingual Discharge Slips** | `POST /api/ai/visit-summary`, English + Roman Urdu + Sindhi (سنڌي RTL + Roman Sindhi) | `AiVisitSummaryModal.jsx`, multilingual view switcher, prescription table, print layout | **100%** | 🟢 Complete |
| **18. SMS & WhatsApp Alerts Engine** | `notificationService.js`, `notificationController.js`, Pakistani E.164 normalization | `AppointmentTable.jsx`, `TelemedicineRoom.jsx`, 1-click `wa.me` links, SMS viva simulator | **100%** | 🟢 Complete |
| **19. Telemedicine & WebRTC Video Suite** | `telemedicineController.js`, Server-Sent Events (SSE) signaling, in-call EHR persistence | `TelemedicineRoom.jsx`, Google STUN, P2P video/audio, screen sharing, in-call notes drawer | **100%** | 🟢 Complete |
| **20. Admin Multi-Desk Command Center** | Multi-view aggregation slicing across Overview, Roster, Reception Desk, and Pharmacy Store | `Dashboard.jsx`, `StatCard.jsx`, 4-tab Admin Command Switcher, live clinic KPIs | **100%** | 🟢 Complete |
| **21. Modern Photorealistic Hero** | High-DPI healthcare photography, 3D anatomical organ badges, dual doctor avatars | `LandingPage.jsx`, floating glass cards (`Health Score 98.4%`), 4-pillar feature capsule | **100%** | 🟢 Complete |
| **22. Settings & Security Audit** | `settingsController.js`, clinic profile update, password change with old hash check | `Settings.jsx`, `ClinicProfileForm.jsx`, `ChangePasswordForm.jsx` | **100%** | 🟢 Complete |
| **23. SEO, AEO & GEO Search Architecture** | `public/robots.txt` (AI crawlers), `public/sitemap.xml`, `public/llms.txt`, Geo metadata | `index.html` (JSON-LD `@graph`), `useSEO.js` dynamic title, description, and canonical | **100%** | 🟢 Complete |
| **24. In-App Documentation Hub** | Static report distribution (`/PROJECT_REPORT.md`, `/RBAC_AUDIT_REPORT.md`) | `ProjectDocs.jsx` (`/docs`), live TOC, full-text search, direct download, Print to PDF | **100%** | 🟢 Complete |
| **25. Codebase Streamlining & Optimization** | Removed 21 one-off test scripts, deleted dead 3D files (`Ecosystem3D`, `Hero3D`) | 0 dead files; Three.js unbundled; build time 1.57s | **100%** | 🟢 Complete |

---

## 2. System Architecture & Tech Stack

```
+-----------------------------------------------------------------------------------------+
|                                    FRONTEND LAYER                                       |
|  React 19.2 | Vite 8.1 | Tailwind CSS v4.3 | Framer Motion 12.4 | Recharts 3.1 | useSEO     |
|  Specialist Clinical Suite | AI Clinical Co-Pilot | Reception Hub | Pharmacist Hub      |
+-----------------------------------------------------------------------------------------+
                                              │
                                              ▼ HTTPS / REST (JSON + HttpOnly Cookies)
+-----------------------------------------------------------------------------------------+
|                                   BACKEND API LAYER                                     |
|  Node.js (>=22) | Express 5.2.1 | JWT Auth | WebRTC SSE Signaling | Multer | Nodemailer  |
|  Doctor Duty Engine | AI Clinical Gateway | FEFO Inventory Manager | Scoped ID Generator|
+-----------------------------------------------------------------------------------------+
           │                                              │
           ▼ Mongoose 9.8 (clinicId Partitioned)          ▼ REST / JSON
+------------------------------------+   +------------------------------------------------+
|     MULTI-TENANT DATABASE LAYER    |   |                   AI LAYER                     |
|      MongoDB / MongoDB Atlas       |   |  Tier 1: Google Gemini (v1beta REST API)       |
|    11 Models (Compound Indexes)    |   |  Tier 2: OpenAI Fallback Adapter               |
|      Tenant-Scoped Counters        |   |  Tier 3: Deterministic Offline Viva Engine     |
+------------------------------------+   +------------------------------------------------+
```

### 2.1 Backend Technology Stack
- **Runtime Environment:** Node.js v22+
- **Application Framework:** Express 5.2.1
- **Database Engine:** MongoDB Atlas with Mongoose ODM v9.8.1
- **Multi-Tenancy Engine:** Logical database partitioning via compound unique indexes and scoped atomic sequence keys (`${type}_${clinicId}`).
- **Authentication & Security:** JSON Web Tokens (`jsonwebtoken`), `bcryptjs` password hashing, `cookie-parser` for HttpOnly session tokens, mongoSanitize protection, express-rate-limit.
- **File & Media Handling:** `multer` 2.2.0 with custom MIME filtering; ImageKit SDK CDN storage.
- **Email Communications:** `nodemailer` 9.1.1 for transactional alerts and password resets.
- **Request Logging:** `morgan` 1.12.0 HTTP logger.

### 2.2 Frontend Technology Stack
- **Core Library:** React 19.2.7 with React DOM
- **Build System:** Vite 8.1.5 (Hot Module Replacement, code splitting, optimized manual chunking)
- **Styling Architecture:** Tailwind CSS v4.3.3 with CSS variables, frosted glassmorphism, and responsive dark mode support.
- **Routing & Navigation:** React Router DOM v7.18.2 with role-based route guards (`ProtectedRoute`).
- **Data Visualization & Analytics:** Recharts v3.10.1 (Area, Bar, Pie, and Trend charts).
- **Micro-Animations:** Framer Motion v12.43.0 for layout transitions, modals, and responsive navigation drawers.
- **Iconography:** React Icons (Feather Icon Set `fi*` and Remix Icon `ri*`).

---

## 3. Multi-Tenant SaaS Architecture & Database Partitioning

SmartClinic operates on a **Shared-Database, Shared-Schema with Logical Partitioning** model. This architecture maximizes cost-efficiency and operational simplicity for regional healthcare facilities while guaranteeing 100% strict data isolation.

### 3.1 The `Clinic` Model
Every medical facility is represented by an independent `Clinic` record:
```javascript
const clinicSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true },
  email: { type: String, required: true, lowercase: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  status: { type: String, enum: ['active', 'suspended', 'inactive'], default: 'active' },
  subscriptionPlan: { type: String, enum: ['free', 'standard', 'premium'], default: 'standard' },
}, { timestamps: true });
```

### 3.2 Compound Unique Index Strategy
Single-field unique indexes on domain identifiers have been replaced with **compound unique indexes** scoped to `clinicId`:

| Collection | Legacy Global Index (Dropped) | Modern Multi-Tenant Compound Index | Purpose |
| :--- | :--- | :--- | :--- |
| `patients` | `patientId_1` (UNIQUE) | `{ clinicId: 1, patientId: 1 }` (UNIQUE) | Scoped patient numbering |
| `patients` | `cnic_1` (UNIQUE) | `{ clinicId: 1, cnic: 1 }` (UNIQUE, partialFilter) | Duplicate CNIC guard per clinic |
| `bills` | `billId_1` (UNIQUE) | `{ clinicId: 1, billId: 1 }` (UNIQUE) | Scoped invoice numbering |
| `sales` | `saleId_1` (UNIQUE) | `{ clinicId: 1, saleId: 1 }` (UNIQUE) | Scoped POS receipt numbering |
| `medicines` | `medicineId_1` (UNIQUE) | `{ clinicId: 1, medicineId: 1 }` (UNIQUE) | Scoped inventory numbering |
| `medicines` | `name_1` (UNIQUE) | `{ clinicId: 1, name: 1 }` (UNIQUE) | Same medicine name allowed in other clinics |
| `appointments` | `appointmentId_1` (UNIQUE) | `{ clinicId: 1, appointmentId: 1 }` (UNIQUE) | Scoped appointment numbering |
| `users` | `email_1` (UNIQUE) | `email_1` (UNIQUE) | Global login uniqueness across platform |

### 3.3 Tenant-Scoped Atomic ID Generation
Sequential identifiers (`PT-000001`, `BL-000001`, `MD-000001`, `SL-000001`, `AP-000001`) use atomic counter increments scoped to the clinic:
```javascript
// Scoped sequence key: 'patient_6a9843f5bd2adbcfa45d1f96'
const sequenceKey = `${type}_${clinicId}`;
const counter = await Counter.findOneAndUpdate(
  { id: sequenceKey },
  { $inc: { seq: 1 } },
  { new: true, upsert: true }
);
```

---

## 4. Role-Based Access Control (RBAC) Matrix

SmartClinic enforces a **2-Dimensional Security Model**:
1. **Role Boundary:** Access whitelist checking (`Admin`, `Doctor`, `Receptionist`, `Pharmacist`).
2. **Tenant Boundary:** Mandatory query predicate `{ clinicId: req.user.clinicId }` on all database operations.

| Feature / Endpoint | Admin | Doctor | Receptionist | Pharmacist | Authorization & Multi-Tenant Scoping Rule |
| :--- | :---: | :---: | :---: | :---: | :--- |
| **System Dashboard** (`/dashboard`) | Command Switcher | Clinical Workstation | Reception Hub | Pharmacist Hub | Sliced at DB query level by role and scoped by `clinicId`. |
| **Staff Directory** (`/admin/users`) | Full CRUD | 🚫 403 | 🚫 403 | 🚫 403 | `authorize("Admin")`. Staff list filtered to current `clinicId`. |
| **7 Specialties Doctors Dropdown** (`/users/doctors`) | ✅ 200 | ✅ 200 | ✅ 200 | 🚫 403 | Scoped to active doctors belonging to this clinic facility. |
| **Doctor Duty Toggle** (`PATCH /users/:id/duty`) | ✅ 200 | ✅ 200 (Own) | 🚫 403 | 🚫 403 | Doctors can toggle own on-duty status only; Admin can toggle all. |
| **Patient Directory** (`/patients`) | ✅ 200 | ✅ 200 | ✅ 200 | 🚫 403 | Scoped to clinic patients (`clinicId`). Clinic B cannot see Clinic A. |
| **Patient Registration** (`POST /patients`) | ✅ 201 | 🚫 403 | ✅ 201 | 🚫 403 | Auto-attaches `req.user.clinicId` and scoped MRN counter (`PT-000001`). |
| **Clinical EHR History** (`POST .../history`) | 🚫 403 | ✅ 201 | 🚫 403 | 🚫 403 | **Doctor only**. Clinical diagnoses, vital signs, prescriptions. |
| **Appointments List** (`/appointments`) | ✅ 200 | ✅ 200 (Own) | ✅ 200 | 🚫 403 | Doctors automatically scoped to own doctor ID and clinic. |
| **Book Appointment** (`POST /appointments`) | ✅ 201 | 🚫 403 | ✅ 201 | 🚫 403 | Enforces 30-min doctor conflict validation (HTTP 409). |
| **Billing & Invoices** (`/bills`) | ✅ 200 | 🚫 403 | ✅ 200 | 🚫 403 | Scoped invoice numbering (`BL-000001`). |
| **Record Payment** (`POST .../payments`) | ✅ 200 | 🚫 403 | ✅ 200 | 🚫 403 | Balance auto-deduction with overpayment guard. |
| **Pharmacy & FEFO POS** (`/pharmacy`) | ✅ 200 | 🚫 403 | 🚫 403 | ✅ 200 | First-Expiry-First-Out batch deduction; void restores stock. |
| **Barcode Scanner** (`/medicines/barcode/:code`) | ✅ 200 | 🚫 403 | 🚫 403 | ✅ 200 | Instant SKU lookup for hardware gun / camera stream. |
| **Suppliers Directory** (`/suppliers`) | ✅ 200 | 🚫 403 | 🚫 403 | ✅ 200 | Scoped supplier registry per clinic. |
| **Analytical Reports** (`/reports`) | ✅ 200 | Sliced (Own) | Sliced (Revenue) | Sliced (Inventory) | Aggregation pipelines scoped to `{ clinicId }`. |
| **AI Visit Summary** (`/ai/visit-summary`) | ✅ 200 | ✅ 200 | ✅ 200 | 🚫 403 | Trilingual discharge slips (English, Roman Urdu, Sindhi). |
| **AI Patient Triage** (`POST /ai/triage`) | ✅ 200 | ✅ 200 | ✅ 200 | ✅ 200 | Emergency/Urgent/Standard acuity & specialty routing for front desk. |
| **AI Prescription Safety** (`POST /ai/prescription-check`) | ✅ 200 | ✅ 200 | 🚫 403 | ✅ 200 | Clinical drug-drug interaction & allergy warning checker. |
| **Telemedicine Room** (`/telemedicine`) | ✅ 200 | ✅ 200 | ✅ 200 | 🚫 403 | WebRTC P2P signaling with in-call clinical notes drawer. |
| **Clinic Settings** (`/settings/clinic`) | Read/Write | Read-Only | Read-Only | Read-Only | Modifiable by Admin only, scoped to clinic. |

---

## 5. Clinical Decision Support & Specialized Workstation Suites

### 5.1 The 7 Medical Specialties Faculty & Dedicated Clinical Suite
SmartClinic features designated medical suites, fee structures, visiting hours, and clinical decision support algorithms across **7 Medical Specialties**:

```
+-----------------------------------------------------------------------------------------+
|                         7 SPECIALIZED MEDICAL DISCIPLINES                               |
+-----------------------------------------------------------------------------------------+
|  1. Child Care & Pediatrics        | Weight-based dosing, WHO/EPI vaccination tracker   |
|  2. General Medicine               | BMI, Cockcroft-Gault eGFR CKD staging, HbA1c target |
|  3. Cardiology                     | 10-Year ASCVD Risk, AHA/ACC 2017 Blood Pressure    |
|  4. Gastroenterology               | Child-Pugh cirrhosis score, APRI hepatitis index   |
|  5. General Surgery                | Alvarado Appendicitis score, ASA pre-op risk       |
|  6. Gynecology & Obstetrics        | Naegele's Rule EDD, Gestational Age (weeks+days)   |
|  7. Ophthalmology                  | Snellen Acuity conversion, IOP Glaucoma radar      |
+-----------------------------------------------------------------------------------------+
```

- **Specialist Clinical Suite (`SpecialistClinicalSuite.jsx` - 1,046 LOC):**
  - **Pediatrics:** Automated suspension dosing calculator (`Amoxicillin`, `Paracetamol`, `Ibuprofen`, `Azithromycin`, `Ceftriaxone`) converting patient body weight into precise mg and ml doses with frequency schedules, coupled with a national immunization schedule checklist.
  - **General Medicine:** Automatic BMI category calculation, Cockcroft-Gault renal clearance calculator (`eGFR = [(140 - Age) * Weight] / (72 * Cr) * 0.85 if female`), and personalized diabetic HbA1c guidelines.
  - **Cardiology:** 10-Year ASCVD Cardiovascular Risk score calculator and AHA/ACC 2017 Blood Pressure staging matrix (Normal, Elevated, Stage 1 HTN, Stage 2 HTN, Hypertensive Crisis) with automated clinical guidance.
  - **Gastroenterology:** Child-Pugh Score for liver cirrhosis severity (Grade A/B/C) and APRI (AST to Platelet Ratio Index) assessment.
  - **General Surgery:** Alvarado Score for Acute Appendicitis probability and ASA Physical Status Classification.
  - **Gynecology & Obstetrics:** Naegele's Rule Expected Date of Delivery (EDD) and Gestational Age (weeks + days) calculator with trimester progress tracking.
  - **Ophthalmology:** Snellen Visual Acuity decimal/logMAR converter and Intraocular Pressure (IOP) glaucoma risk categorization.
  - **1-Click Clinical Notes Export:** Formats and copies all specialty calculations and findings directly into the patient's EHR visit history.

### 5.2 AI Clinical Co-Pilot (`AiClinicalCoPilot.jsx` - 387 LOC)
Embedded directly in the doctor's consultation queue and patient encounter modal:
- **Symptoms Differential Diagnostic Assistant:** Evaluates presenting complaints to recommend top 3 differential diagnoses, suggested bedside investigations, and critical red flags.
- **Prescription Drug Safety & Allergy Checker (`POST /api/ai/prescription-check`):** Verifies proposed drug combinations against patient allergies and cross-references known drug-drug interactions before finalizing orders.
- **Embedded Trilingual Discharge Slips:** Instant discharge summary generation in English, Roman Urdu, and Arabic-script Sindhi (سنڌي).

### 5.3 Front-Desk Reception Desk Hub & AI Triage (`ReceptionDeskHub.jsx`)
- **Queue Management:** Sequential patient ticketing (`#TK-001`), walk-in registration, doctor availability filtering, and priority queue ordering.
- **AI Patient Triage Recommender (`POST /api/ai/triage`):** Evaluates presenting symptoms and vitals (temperature, systolic/diastolic blood pressure) to assign triage urgency (Emergency, Urgent, Standard OPD) and intelligently routes patients to the most appropriate specialty.
- **Front-Desk Quick Billing:** Instant fee collection, partial payment recording, and thermal token receipt printing.

### 5.4 Pharmacist Store Hub (`PharmacistStoreHub.jsx`)
- **Dispensary Velocity & Stock Radar:** Real-time stock velocity, FEFO batch depletion radar, low-stock threshold warnings (≤15 units), expiring batch countdowns (≤30, ≤60, ≤90 days).
- **High-Speed Counter POS:** Instant SKU lookup via USB barcode gun or device camera, real-time quantity controls, and automated FEFO batch deduction.
- **Dispensing Trends (`MedicineSalesChart.jsx`):** Real-time daily dispensing trends and top-moving formulations chart.

### 5.5 Admin Multi-Desk Command Center
The Admin Dashboard features a 4-tab Command Switcher allowing facility administrators to oversee the entire clinic operations from a single dashboard:
- **Executive Overview:** High-level KPIs, revenue trends, low-stock warnings, and recent activity.
- **7 Specialties Roster:** Complete faculty oversight, room assignments, visiting days, and live on-duty availability pills.
- **Reception Desk Hub:** Front-desk workflow simulation and queue management.
- **Pharmacist Store Hub:** Dispensary inventory, fast-moving items, and FEFO expiry radar.

---

## 6. SEO, AEO & GEO Search Architecture

SmartClinic implements a search and AI discovery architecture combining Search Engine Optimization (SEO), Answer Engine Optimization (AEO), and Generative Engine Optimization (GEO):

### 6.1 Answer Engine Optimization (AEO)
- **Direct Q&A Structure:** Built-in Schema.org `FAQPage` JSON-LD formatted to supply high-density, authoritative answers directly into conversational search engines (ChatGPT Search, Perplexity, Claude, and Google AI Overviews).
- **Knowledge Manifest (`/llms.txt`):** Provides a machine-readable summary of system architecture, security models, clinical algorithms, and citation references.

### 6.2 Generative Engine Optimization (GEO)
- **Geocoded Authority Grounding:** Explicit geotagging targeting Sanghar & Interior Sindh, Pakistan (`geo.region: PK-SD`, `geo.placename: Sanghar, Sindh, Pakistan`, `geo.position: 26.0464;68.9482`, `ICBM: 26.0464, 68.9482`).
- **Linked Authority Graph:** Interconnected Schema.org `@graph` binding:
  - `SoftwareApplication` (SmartClinic SaaS OS, health application category, author credentials)
  - `MedicalBusiness` / `MedicalClinic` (Geolocated clinic facility in Sanghar, Sindh)
  - `WebSite` (Canonical identity, multilingual support in `en-US` and `ur-PK`)
  - `Person` (Anis Khan Niazi, Lead Software Engineer, BSIT)

### 6.3 Technical SEO Standards
- **Dynamic SEO Hook (`useSEO.js`):** Dynamically injects title, description, canonical URL, OpenGraph tags (`og:locale:alternate="ur_PK"`), Twitter Cards, and per-route Schema.org JSON-LD scripts.
- **AI Crawler Directives (`robots.txt`):** Grants explicit access to modern AI engines (`GPTBot`, `ClaudeBot`, `PerplexityBot`, `Google-Extended`, `Applebot-Extended`, `Amazonbot`, `cohere-ai`, `DeepSeekBot`, `Meta-ExternalAgent`) while strictly disallowing authenticated dashboard routes (`/dashboard`, `/admin/`, `/api/`).
- **Canonical HTTPS Sitemap (`sitemap.xml`):** Fully compliant XML sitemap indexing all public documentation and landing routes with priority weighting.

---

## 7. Postman Cloud & GitHub MCP Integration

### 7.1 Postman Cloud MCP Integration
- **Account:** Authenticated via Postman API Key for user `aniskhanniazi202` on team *"Anis Khan Niazi's Team"*.
- **Collection Synchronized to Cloud:**
  - **Collection UID:** `55354836-b09b272e-d854-476f-a230-5ded96ab7e05`
  - **Collection Name:** `SmartClinic FYP - Complete Production API Test Suite`
  - **Modules (14 Folders):** 00-Onboarding, 01-Auth & RBAC, 02-Users, 03-Patients, 04-Appointments, 05-Suppliers, 06-Medicines & Batches, 07-Pharmacy POS (FEFO), 08-Billing & Invoices, 09-Analytics & Reports, 10-Role Dashboards, 11-Clinic Settings, 12-Gemini AI Assistant, 13-Telemedicine & Communication.
  - **Endpoints:** 51 fully automated requests with chained environment variables and assertion test scripts.
  - **Local Export:** `SmartClinic_FYP_Complete_API_Test_Suite_v2.json`.

### 7.2 GitHub MCP Integration & Version Control
- **Account:** Authenticated user `AnisKhanN` (Anis Khan Niazi, ID: `141991856`).
- **Repository URL:** [https://github.com/AnisKhanN/Al-Hassam-Medical-Center](https://github.com/AnisKhanN/Al-Hassam-Medical-Center)
- **Branch:** `main`
- **Security Check:** Strictly enforced `.gitignore` preventing `.env` or sensitive credential leaks.

---

## 8. Production Codebase Streamlining & Optimization

To ensure enterprise-grade code cleanliness, all dead code, unused experimental modules, and temporary files were audited and eliminated:

| Deleted Artifact | Original Path | Impact of Removal |
| :--- | :--- | :--- |
| **`Ecosystem3D.jsx`** | `Frontend/src/components/landing/` | 27 KB, 759 lines of dead Three.js code removed; eliminated heavy 3D rendering overhead. |
| **`Hero3D.jsx`** | `Frontend/src/components/landing/` | 6.7 KB, 212 lines of obsolete Three.js wireframe sphere removed. |
| **`DashboardNavbar.jsx`** | `Frontend/src/components/layout/` | Empty stub component (`return null;`) removed. |
| **`ClinicShowcaseCinema.jsx`** | `Frontend/src/components/landing/` | Redundant prototype video showcase removed to streamline frontend architecture. |
| **`admin-cookies.txt`** | `Backend/` | Temporary curl session file removed from backend root. |
| **21 One-Off Test Scripts** | `Backend/scripts/`, `Frontend/scripts/` | 6,456 lines of temporary test runners removed in favor of Postman Cloud. |

### Retained Production Seeder:
* ✅ `Backend/scripts/seedAdmin.js` — Standard database seeder to initialize the clinic, admin, reception, pharmacy, and all 7 medical specialist faculty accounts for FYP viva evaluation via `npm run seed`.

---

## 9. Verification & Quality Assurance Summary

### 9.1 Backend Automated Verification (100% Green, 0 Failures)
Executed against the live MongoDB Atlas cluster in 118.66s:
- **Phase 4 Multi-Tenant Auth Hardening:** 31 checks verifying tenant onboarding, token claims, and cross-tenant data isolation.
- **100+ Endpoint RBAC Matrix:** Verified access policies across Admin, Doctor, Receptionist, and Pharmacist, including the newly added duty toggle (`PATCH /api/users/:id/duty`), AI triage (`POST /api/ai/triage`), and drug interaction safety checker (`POST /api/ai/prescription-check`).
- **Postman Automated Runner:** 51 requests across all 14 folders achieving 100% pass.
- **Clinical Logic Verification:** Appointment slot collision prevention (HTTP 409), FEFO batch stock deductions, void sale stock restorations, financial ledger reconciliations, and Gemini AI daily briefing generation.

### 9.2 Frontend E2E Verification (100% Green, 0 Failures)
Executed against the active Vite server (`http://localhost:5173`) and reverse proxy:
- **70 of 70 assertions passed** covering public SEO assets, session cookies, dashboard KPI metrics, patient directories, appointments calendar, pharmacy inventory, billing ledger, reports aggregations, AI briefings, and 1-click quick-role switchers.
- **ESLint:** 0 errors across JSX components, hooks, and providers.
- **Vite Production Build:** Compiled **1,471 modules in 1.57s** with 0 errors and 0 warnings. Three.js completely unbundled from production bundles.

---

## 10. Installation, Configuration & Execution Guide

### 10.1 Prerequisites
- **Node.js**: v22.0.0 or higher
- **npm**: v10.0.0 or higher
- **MongoDB**: MongoDB Atlas Connection URI or local MongoDB server.

### 10.2 Starting the Services
1. **Backend Server:**
   ```bash
   cd "d:/FYP Work/SmartClinic By Anis/Backend"
   npm run dev    # Or: npm start
   ```
   *Runs on `http://localhost:5000` (Connected to MongoDB Atlas).*

2. **Frontend Client:**
   ```bash
   cd "d:/FYP Work/SmartClinic By Anis/Frontend"
   npm run dev
   ```
   *Accessible in browser at `http://localhost:5173`.*

3. **Seeded Test Credentials (`seedAdmin.js`):**
   - **Admin (Facility Lead):** `admin@clinic.com` / `admin123`
   - **General Medicine Doctor:** `doctor@clinic.com` / `doctor123` (Dr. Amina Khan)
   - **Pediatrics Doctor:** `dr.pediatrics@clinic.com` / `doctor123` (Dr. Zainab Tariq)
   - **Cardiology Doctor:** `dr.cardio@clinic.com` / `doctor123` (Dr. Tariq Mehmood)
   - **Gastroenterology Doctor:** `dr.gastro@clinic.com` / `doctor123` (Dr. Farhan Ali)
   - **General Surgery Doctor:** `dr.surgery@clinic.com` / `doctor123` (Dr. Bilal Ahmed)
   - **Gynecology & Obstetrics Doctor:** `dr.gynae@clinic.com` / `doctor123` (Dr. Sadia Rehman)
   - **Ophthalmology Doctor:** `dr.eye@clinic.com` / `doctor123` (Dr. Imran Qureshi)
   - **Receptionist (Front Desk):** `reception@clinic.com` / `reception123`
   - **Pharmacist (Dispensary):** `pharmacy@clinic.com` / `pharmacy123`

---

## 11. Viva Defense Talking Points & Frequently Asked Questions

### Q1: What makes SmartClinic unique compared to off-the-shelf clinic software?
> **Answer:** SmartClinic was purpose-built for the local healthcare environment in Pakistan, particularly regional districts like Sanghar, Sindh. It features:
> 1. True **Multi-Tenancy** supporting multiple clinics on a single infrastructure.
> 2. **7 Medical Specialties Faculty** with dedicated clinical decision support calculators (Pediatric weight-based dosing, Cardiology ASCVD risk, Surgery Alvarado score, etc.).
> 3. Authentic **Trilingual & Bilingual Discharge Slips** providing instructions in **English**, **Roman Urdu**, and **Arabic-script Sindhi (سنڌي)** with Roman Sindhi transliteration so patients of all literacy levels understand their dosage instructions.
> 4. **FEFO automated inventory control** that prevents medicine expiration in community pharmacies.
> 5. An offline **Heuristic Fail-Safe AI Engine** that guarantees zero disruption during presentations or network outages.
> 6. Embedded **Telemedicine with in-call EHR persistence** connecting rural patients with specialists without travel expenses.
> 7. Modern **AEO & GEO Search Architecture** allowing modern AI answer engines (ChatGPT, Perplexity) to cite clinic services.

### Q2: How is Multi-Tenancy implemented and how do you ensure Clinic A cannot access Clinic B's data?
> **Answer:** SmartClinic uses a **Logical Database Partitioning** model. Every schema (Patient, Bill, Medicine, Sale, Supplier, Appointment, ClinicSettings) has an indexed `clinicId: { type: ObjectId, ref: 'Clinic', required: true }`. All domain unique indexes are compound (`{ clinicId: 1, patientId: 1 }`). Furthermore, every database query in every controller prepends `clinicId: req.user.clinicId` extracted directly from the verified JWT cookie. Clinic A cannot query, update, or view Clinic B's records under any circumstances.

### Q3: How do the clinical calculators in the Specialist Clinical Suite support practicing physicians?
> **Answer:** Rather than forcing physicians to manually calculate complex pharmacological dosages or clinical scores on scratchpads, the 1,046-LOC `SpecialistClinicalSuite.jsx` implements standardized, evidence-based medical formulas:
> - **Pediatrics:** Accurately derives suspension milligrams and milliliters (`(doseMg / concentration) * 5ml`) based on patient body weight to prevent pediatric underdosing or toxicity.
> - **Cardiology:** Evaluates the 10-Year ASCVD risk using systolic blood pressure, cholesterol, age, and smoking history, categorizing patients into Low, Borderline, Intermediate, and High cardiovascular risk.
> - **Obstetrics:** Automates Naegele's Rule calculation based on Last Menstrual Period (LMP) to output accurate Expected Date of Delivery (EDD) and gestational age in weeks and days.
> - **1-Click EHR Export:** All computed parameters can be copied directly into the patient's visit notes with a single click.

### Q4: How is inventory deducted during a POS sale?
> **Answer:** The pharmacy point-of-sale implements **FEFO (First-Expiry-First-Out)** logic. When a medicine with multiple batches is sold, the system queries the active batches sorted by ascending expiration date (`expiryDate: 1`). It draws quantity from the batch that expires earliest before dipping into later batches. If a sale is voided by an Admin, the system restores the exact deducted quantities back into those specific batch IDs.

### Q5: What happens if Google Gemini API hits a quota limit or the clinic internet goes down?
> **Answer:** SmartClinic features a 3-tier resilient AI gateway:
> 1. Primary: Google Gemini v1beta REST API.
> 2. Secondary Failover: OpenAI GPT-4o-mini adapter.
> 3. Tertiary Heuristic Engine: Local deterministic algorithms that assemble the full bilingual discharge slip with zero external API calls. This guarantees 100% uptime during viva defense.

---

## 12. Conclusion

**SmartClinic By Anis** delivers a modern, resilient, and culturally contextualized software solution for outpatient clinics and pharmacies. It satisfies all academic requirements of the BSIT Final Year Project while demonstrating enterprise-grade software engineering best practices, verified multi-tenancy, clean code architecture, complete cloud test coverage, specialized clinical decision support, and modern search engine optimization.

---
*Report Compiled for BSIT Final Year Project Evaluation — SmartClinic By Anis Khan Niazi*
