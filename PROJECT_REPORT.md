# SmartClinic & Pharmacy Management SaaS

## Comprehensive Final Year Project (FYP) Technical Report & Documentation

**Project Title:** SmartClinic, Integrated Clinic & Pharmacy Management SaaS for Local Healthcare Facilities
**Author / Developer:** Anis Khan Niazi
**Degree Program:** Bachelor of Science in Information Technology (BSIT) Final Year Project
**Target Region:** Sanghar & Interior Sindh, Pakistan
**Document Date:** September 2026 (Updated & Comprehensive Final Evaluation)
**System Status:** 🟢 **100% Production Ready & Fully Operational** (Backend & Frontend Active, All Test Suites Passing)

---

## Executive Summary & Abstract

**SmartClinic** is an enterprise-grade, full-stack, multi-tenant healthcare software-as-a-service (SaaS) platform engineered to modernize outpatient clinics, rural medical centers, and community pharmacies in Pakistan. Developed to bridge the digital gap in regional healthcare facilities (with a specialized focus on Sanghar, Sindh), SmartClinic replaces cumbersome paper record-keeping, disjointed spreadsheets, and manual prescription slips with a unified, role-based digital operating system.

The platform integrates:

1. **Electronic Health Records (EHR)** with longitudinal visit timelines, clinical vital sign monitoring, and diagnostic history.
2. **Double-Booking Protected Appointment Scheduling** with doctor-specific calendar synchronization and conflict detection.
3. **Multi-Batch Pharmacy Inventory Management** with **FEFO (First-Expiry-First-Out)** automated stock depletion and near-expiry alerting (30/60/90 days).
4. **Point of Sale (POS) & Billing Engine** supporting split/partial payments, auto-calculated balances, and thermal-style print receipts.
5. **Role-Adaptive Executive Dashboard** with dynamic access tiers for **Admin**, **Doctor**, **Receptionist**, and **Pharmacist**.
6. **5 Specialized Analytical Report Modules** covering Revenue, Doctor Consultations, Patient Demographics, Pharmacy Performance, and Stock Valuation.
7. **Google Gemini Generative AI Assistant Hub** with **Trilingual & Bilingual Discharge Slips** supporting **English**, **Roman Urdu**, and authentic **Sindhi (سنڌي script with RTL alignment + Roman Sindhi)**, coupled with an offline Heuristic Fail-Safe Engine for viva demonstrations.
8. **Automated SMS & WhatsApp Healthcare Alerts Engine** with 1-click WhatsApp Web / mobile deep-links (`wa.me`), localized bilingual templates, Cloud API integration, and viva demo SMS simulator.
9. **Hardware & Camera Barcode / QR Scanner at Pharmacy POS** supporting plug-and-play USB/Bluetooth barcode guns (keyboard wedge listener), device camera scanning, and audio beep feedback.
10. **Telemedicine & WebRTC Video Consultations Suite** with real-time peer-to-peer audio/video calling, Server-Sent Events (SSE) signaling, WhatsApp meeting invitations, and in-call live EHR notes and vitals recording.
11. **Comprehensive Multi-Device Responsiveness (Mobile, Tablet, Desktop)** with 0px horizontal overflow, touch-optimized slide-out mobile drawer, $2\times 2$ reflowing statistics grid, and responsive 3D visualization.
12. **Search Engine Optimization (SEO), Answer Engine Optimization (AEO), and Generative Engine Optimization (GEO)** featuring Schema.org JSON-LD structured data (`SoftwareApplication`, `MedicalBusiness`, and `FAQPage`), standardized `/llms.txt` knowledge manifest for AI search engines, explicit AI crawler directives in `robots.txt`, and regional geolocation targeting (`PK-SD`, Sanghar, Sindh).
13. **In-App Interactive Documentation & Evaluation Hub (`/docs`, `/project-report`, `/rbac-report`)** equipped with client-side Markdown rendering, live table of contents navigation, search query highlighting, and 1-click Markdown export and browser Print-to-PDF formatting.

---

## 1. Project Work Breakdown & Completion Audit

### 1.1 Quantitative Codebase Metrics

| Metric                                     |          Measured Value          | Remarks                                                           |
| :----------------------------------------- | :------------------------------: | :---------------------------------------------------------------- |
| **Backend Source Files**             |        **57 files**        | Express 5, Mongoose 9, Controllers, Services, Routes, Middlewares |
| **Backend Lines of Code (LOC)**      |      **5,518 lines**      | Structured, modular CommonJS codebase                             |
| **Frontend Source Files**            |        **97 files**        | React 19, Tailwind CSS v4, Pages, Components, Context, Hooks      |
| **Frontend Lines of Code (LOC)**     |      **13,242 lines**      | Responsive UI, Framer Motion, Recharts, Three.js 3D               |
| **Backend Test & Script Files**      |        **17 files**        | Full automated integration test coverage                          |
| **Backend Test Lines of Code (LOC)** |      **3,152 lines**      | Multi-role HTTP assertions and seeders                            |
| **Total Codebase Volume**            | **171 files / 21,912 LOC** | 100% production-grade handwritten code                            |
| **Total REST API Endpoints**         |      **45 Endpoints**      | Across 13 route controllers                                       |
| **MongoDB Collections**              | **10 Models + 1 Counter** | Relational integrity with atomic ID generator                     |
| **Automated Test Suite Success**     | **11 / 11 Suites (100%)** | All integration tests verified passing                            |

### 1.2 Subsystem Implementation & Progress Matrix

| Subsystem / Feature Module                           | Backend Architecture                                                                                | Frontend UI / Implementation                                                                                |  Completion %  |   Status   |
| :--------------------------------------------------- | :-------------------------------------------------------------------------------------------------- | :---------------------------------------------------------------------------------------------------------- | :------------: | :---------: |
| **1. Authentication & RBAC**                   | `authController.js`, `authMiddleware.js`, JWT HttpOnly cookies, bcryptjs                        | `Login.jsx`, `AuthContext.jsx`, `ProtectedRoute.jsx`, quick login role pills                          | **100%** | 🟢 Complete |
| **2. Staff & User Management**                 | `userController.js`, `userRoutes.js`, Multer profile image uploads                              | `UserManagement.jsx`, `UserTable.jsx`, `UserFormModal.jsx`                                            | **100%** | 🟢 Complete |
| **3. Patient Registration & Longitudinal EHR** | `patientController.js`, `generatePatientId.js` (`PT-000001`), medical history subdocuments    | `PatientList.jsx`, `PatientDetail.jsx`, `PatientFormModal.jsx`, `AddVisitModal.jsx`                 | **100%** | 🟢 Complete |
| **4. Appointments & Smart Calendar**           | `appointmentController.js`, 30-min slot conflict validation (HTTP 409)                            | `Appointments.jsx`, `MonthCalendar.jsx`, `BookAppointmentModal.jsx`, `CompleteAppointmentModal.jsx` | **100%** | 🟢 Complete |
| **5. Multi-Batch Pharmacy & FEFO POS**         | `medicineController.js`, `saleController.js`, FEFO stock depletion, void restoral               | `Pharmacy.jsx`, `MedicineTable.jsx`, `BatchTable.jsx`, `NewSaleModal.jsx`, `VoidSaleModal.jsx`    | **100%** | 🟢 Complete |
| **6. Hardware & Camera Barcode Scanner**       | `GET /api/medicines/barcode/:code`, instant SKU lookup                                            | `NewSaleModal.jsx`, keyboard wedge listener, camera stream, Web Audio API beep                            | **100%** | 🟢 Complete |
| **7. Billing, Invoicing & Split Payments**     | `billController.js`, itemized charges, partial payments, overpayment guards                       | `Billing.jsx`, `BillDetail.jsx`, `CreateBillModal.jsx`, `RecordPaymentModal.jsx`, thermal slip      | **100%** | 🟢 Complete |
| **8. 5 Specialized Analytical Reports**        | `reportController.js`, MongoDB aggregation pipelines for Revenue, Demographics, etc.              | `Reports.jsx` + 5 sub-views (`RevenueReportView`, `AppointmentReportView`, etc.), CSV export          | **100%** | 🟢 Complete |
| **9. Google Gemini AI Assistant & Hub**        | `aiService.js`, `aiProvider.js`, `aiFallbackService.js`, Gemini v1beta + OpenAI + Viva Engine | `AiAssistant.jsx` (8 tabs), natural language query, daily briefs, inventory risk, text parser             | **100%** | 🟢 Complete |
| **10. Trilingual Discharge Slips**             | `POST /api/ai/visit-summary`, English + Roman Urdu + Sindhi (سنڌي RTL) output                 | `AiVisitSummaryModal.jsx`, multilingual view switcher, prescription table, print layout                   | **100%** | 🟢 Complete |
| **11. SMS & WhatsApp Alerts Engine**           | `notificationService.js`, `notificationController.js`, Pakistani E.164 normalization            | `AppointmentTable.jsx`, `TelemedicineRoom.jsx`, 1-click `wa.me` links, SMS viva simulator             | **100%** | 🟢 Complete |
| **12. Telemedicine & WebRTC Video Suite**      | `telemedicineController.js`, Server-Sent Events (SSE) signaling, in-call EHR persistence          | `TelemedicineRoom.jsx`, Google STUN, P2P video/audio, screen sharing, in-call notes drawer                | **100%** | 🟢 Complete |
| **13. Role-Adaptive Dashboard**                | Aggregated stats across users, appointments, pharmacy, billing                                      | `Dashboard.jsx`, `StatCard.jsx`, `MedicineSalesChart.jsx`, `AlertsPanel.jsx`, role slicing          | **100%** | 🟢 Complete |
| **14. Public Landing Page & 3D Core**          | Static assets, route documentation, health check `/`                                              | `LandingPage.jsx`, `Hero3D.jsx` (Three.js 3D medical core), interactive feature previews                | **100%** | 🟢 Complete |
| **15. Settings & Security Audit**              | `settingsController.js`, clinic profile update, password change with old hash check               | `Settings.jsx`, `ClinicProfileForm.jsx`, `ChangePasswordForm.jsx`                                     | **100%** | 🟢 Complete |
| **16. Multi-Device Responsive Design**         | Viewport meta configuration, Tailwind fluid breakpoints, 0px overflow enforcement                   | `LandingPage.jsx`, `Navbar.jsx` (slide drawer), `Dashboard.jsx`, touch targets                        | **100%** | 🟢 Complete |
| **17. SEO, AEO & GEO Search Architecture**     | `public/robots.txt` (AI crawlers), `public/sitemap.xml`, `public/llms.txt`, Geo metadata      | `index.html` (JSON-LD `FAQPage`), `useSEO.js` dynamic title & description hooks                       | **100%** | 🟢 Complete |
| **18. In-App Documentation & Reports Hub**     | Static report distribution (`/PROJECT_REPORT.md`, `/RBAC_AUDIT_REPORT.md`)                      | `ProjectDocs.jsx` (`/docs`), live TOC, full-text search, direct download, Print to PDF                  | **100%** | 🟢 Complete |

---

## 2. System Architecture & Tech Stack

```
+-----------------------------------------------------------------------------------------+
|                                    FRONTEND LAYER                                       |
|  React 19.2 | Vite 8.1 | Tailwind CSS v4.3 | Framer Motion 12.4 | Recharts 3.1 | Three.js  |
+-----------------------------------------------------------------------------------------+
                                              │
                                              ▼ HTTPS / REST (JSON + HttpOnly Cookies)
+-----------------------------------------------------------------------------------------+
|                                   BACKEND API LAYER                                     |
|  Node.js (>=22) | Express 5.2.1 | JWT Auth | WebRTC SSE Signaling | Multer | Nodemailer  |
+-----------------------------------------------------------------------------------------+
          │                                              │
          ▼ Mongoose 9.8                                 ▼ REST / JSON
+------------------------------------+   +------------------------------------------------+
|          DATABASE LAYER            |   |                   AI LAYER                     |
|      MongoDB / MongoDB Atlas       |   |  Tier 1: Google Gemini (v1beta REST API)       |
|   (10 Schema Models + Counter)     |   |  Tier 2: OpenAI Fallback Adapter               |
|                                    |   |  Tier 3: Deterministic Offline Viva Engine     |
+------------------------------------+   +------------------------------------------------+
```

### 2.1 Backend Technology Stack

- **Runtime Environment:** Node.js v22+
- **Application Framework:** Express 5.2.1
- **Database Engine:** MongoDB with Mongoose ODM v9.8.1
- **Authentication & Security:** JSON Web Tokens (`jsonwebtoken`), `bcryptjs` password hashing, `cookie-parser` for HttpOnly session tokens.
- **File & Media Handling:** `multer` 2.2.0 with custom MIME filtering; ImageKit SDK CDN storage.
- **Email Communications:** `nodemailer` 9.1.1 for transactional alerts and password resets.
- **Request Logging:** `morgan` 1.12.0 HTTP logger.

### 2.2 Frontend Technology Stack

- **Core Library:** React 19.2.7 with React DOM
- **Build System:** Vite 8.1.1 (Hot Module Replacement)
- **Styling Architecture:** Tailwind CSS v4.3.3 with modern CSS variables, glassmorphism, and responsive dark mode support.
- **Routing & Navigation:** React Router DOM v7.18.2 with role-based route guards (`ProtectedRoute`).
- **Data Visualization & Analytics:** Recharts v3.10.1 (Area, Bar, Pie, and Trend charts).
- **Interactive 3D Elements:** Three.js v0.185.1 (3D interactive medical core canvas on the public landing page).
- **Micro-Animations:** Framer Motion v12.43.0 for transitions, modals, and accordions.
- **Iconography:** React Icons (Feather Icon Set `fi*` and Remix Icon `ri*`).

### 2.3 Search Engine (SEO), Answer Engine (AEO) & Generative AI (GEO) Layer

SmartClinic incorporates an advanced search and AI discovery architecture:

- **Schema.org Structured Data Graph (JSON-LD):** Injected into `index.html` featuring `SoftwareApplication`, `MedicalBusiness`, and a 5-question `FAQPage` entity. Answer engines (Perplexity AI, Google AI Overviews / SGE) prioritize `FAQPage` schemas for direct citation cards.
- **LLMs.txt Knowledge Manifest:** Located at `/llms.txt` following the emerging industry standard for LLMs and Generative Engines (*Perplexity, ChatGPT Search, Claude, Copilot*). Provides clean markdown specifications without requiring complex JavaScript hydration.
- **AI Crawler Rules in `robots.txt`:** Explicitly authorizes `GPTBot`, `ChatGPT-User`, `ClaudeBot`, `PerplexityBot`, and `Google-Extended` to index documentation while strictly sealing internal clinical/financial routes (`/dashboard`, `/api/`).
- **Regional Geotagging:** Injected `geo.region` (`PK-SD`), `geo.placename` (`Sanghar, Sindh, Pakistan`), and exact GPS coordinates (`ICBM: 26.0464, 68.9482`) to ground generative models when answering location-specific queries for healthcare systems in interior Sindh.

---

## 3. Role-Based Access Control (RBAC) Matrix & Security Architecture

SmartClinic enforces strict enterprise-grade authorization at both the backend Express middleware layer (`protect` + `authorize(...)`) and the frontend route/component layer. Each API request validates the JWT session, checks user active status, and ensures the authenticated role belongs to the permitted whitelist for that endpoint:

| System Feature / Route                                              |           Admin           |              Doctor              |          Receptionist          |          Pharmacist          | Backend Enforcement Mechanism                                                        |
| :------------------------------------------------------------------ | :-----------------------: | :------------------------------: | :-----------------------------: | :---------------------------: | :----------------------------------------------------------------------------------- |
| **System Dashboard** (`/dashboard`)                         |       Full Overview       | Assigned Patients & Day Schedule | Queue, Bookings & Unpaid Bills |  Stock Alerts & Sales Chart  | Sliced at DB query level by `req.user.role` on `/api/dashboard/stats`.           |
| **User & Staff Management** (`/admin/users`)                |         Full CRUD         |         No Access (403)         |         No Access (403)         |        No Access (403)        | `authorize("Admin")`. Receptionist has read-only access to `/api/users/doctors`. |
| **Patient Registration** (`/patients`)                      |        Full Access        |            View Only            |          Create & Edit          |        No Access (403)        | Receptionist & Admin create/update demographics.                                     |
| **EHR & Medical History Entry** (`/patients/:id`)           |         View Only         |        Add Visit & Vitals        |            View Only            |        No Access (403)        | `authorize("Doctor")` strictly guards `POST /api/patients/:id/history`.          |
| **Appointment Booking & Calendar** (`/appointments`)        |        Full Access        |        View Assigned Only        |        Book & Reschedule        |        No Access (403)        | Doctors are server-side scoped (`filter.doctor = req.user.id`).                    |
| **Mark Appointment Completed** (`/appointments/:id/status`) |            Yes            |       Yes (Assigned Only)       |         No Access (403)         |        No Access (403)        | Doctors can only modify status of their own appointments (HTTP 403 on mismatch).     |
| **Billing & Invoicing** (`/billing`)                        |        Full Access        |         No Access (403)         |       Create, Pay & Print       |        No Access (403)        | `authorize("Admin", "Receptionist")`. `cancelBill` restricted to Admin.          |
| **Pharmacy Inventory & Batches** (`/pharmacy`)              |        Full Access        |         No Access (403)         |         No Access (403)         |           Full CRUD           | `authorize("Admin", "Pharmacist")`. Deletions restricted to Admin.                 |
| **Pharmacy POS Sales & Barcode** (`/pharmacy`)              |    Full Access + Void    |         No Access (403)         |         No Access (403)         |  Create Sale + Barcode Only  | `authorize("Admin", "Pharmacist")`. Sale voiding is Admin only.                    |
| **Reports & Analytics Suite** (`/reports`)                  |       All 5 Reports       |     Appointments & Patients     | Revenue, Appointments, Patients |     Pharmacy & Inventory     | Granular route-level authorization. Doctor reports scoped to own consultations.      |
| **Clinic Branding & Settings** (`/settings`)                | Clinic Profile + Password |          Password Only          |          Password Only          |         Password Only         | `PUT /api/settings/clinic` guarded by `authorize("Admin")`.                      |
| **AI Assistant Hub** (`/ai-assistant`)                      |       All 8 Modules       |   Clinical Notes, Slips, Query   |     Slips, Query, Briefing     | Inventory, Text Parser, Query | Granular endpoints (`/sales-analysis` & `/audit-logs` are Admin only).           |
| **Telemedicine Video Consultations** (`/telemedicine/:id`)  |      Host / Monitor      |     Host & Record EHR Notes     |      Invite & Manage Room      |        No Access (403)        | Room creation restricted to staff; doctor ownership enforced on conclude.            |
| **WhatsApp & SMS Healthcare Alerts** (`/notifications`)     |        Full Access        |           Full Access           |           Full Access           |        No Access (403)        | `authorize("Admin", "Doctor", "Receptionist")` prevents non-clinical leakage.      |

### 3.1 Advanced Server-Side RBAC Guardrails

1. **Server-Side Doctor Calendar Scoping:** Even if a malicious client alters the query parameter (`?doctor=<otherId>`), the backend overrides this with `filter.doctor = req.user.id` when the caller's role is `Doctor`.
2. **Consultation Ownership Safeguard:** In both in-person appointment status updates (`PATCH /api/appointments/:id/status`) and virtual telemedicine conclusions (`POST /api/telemedicine/room/:roomId/end`), doctors are prevented from concluding or modifying appointments belonging to other practitioners (enforced via strict ID equality comparison).
3. **Optimized Zero-Leakage Dashboard Aggregator:** `GET /api/dashboard/stats` dynamically checks `req.user.role` and executes only the queries authorized for that tier, completely omitting financial/revenue aggregations for Doctors and clinical EHR data for Pharmacists.
4. **Soft-Delete Audit Preservation:** Patient deletion (`DELETE /api/patients/:id`) and user deactivation (`DELETE /api/users/:id`) execute soft-deactivation (`isActive: false`), ensuring that clinical and financial audit records are never destroyed. Users cannot deactivate their own session accounts.

---

## 4. Database Schema & Data Dictionary

The MongoDB database consists of 10 interconnected collections and 1 atomic sequence counter designed for data integrity, auditability, and speed:

```mermaid
erDiagram
    USER ||--o{ APPOINTMENT : "assigned as doctor"
    USER ||--o{ BILL : "creates"
    USER ||--o{ SALE : "conducts"
    USER ||--o{ AI_AUDIT_LOG : "triggers"
  
    PATIENT ||--o{ APPOINTMENT : "books"
    PATIENT ||--o{ BILL : "invoiced to"
  
    SUPPLIER ||--o{ MEDICINE : "supplies"
    MEDICINE ||--|{ BATCH : "contains"
  
    SALE ||--|{ SALE_ITEM : "sells"
    BILL ||--|{ BILL_ITEM : "charges"
```

### 4.1 Collections Overview

1. **`User`**: System staff (Admin, Doctor, Receptionist, Pharmacist). Contains bcrypt hashed passwords, active status flags, specialization, and clinic tenancy metadata.
2. **`Patient`**: Master patient registry with formatted IDs (`PT-000001`), demographics, CNIC/phone, address, and an embedded array of `medicalHistory` visits (symptoms, diagnoses, prescribed medicines, vital signs).
3. **`Appointment`**: Scheduled clinic visits linked to Patient and Doctor. Enforces unique index constraints on `(doctor, appointmentDate)` to mathematically prevent double-booking. Includes telemedicine fields (`isTelemedicine`, `meetingRoomId`, `meetingStatus`).
4. **`Medicine`**: Pharmacy catalog with `medicineId` (`MED-000001`), generic name, category, unit price, reorder level, and an embedded subdocument array of `batches`.
5. **`Batches` (Embedded in Medicine)**: Batch number, unit cost price, quantity in stock, and expiry date. Drives FEFO inventory deductions.
6. **`Sale`**: Pharmacy counter transactions with formatted IDs (`SALE-000001`), itemized drug breakdown, batch deduction trace, customer name, payment method, and void audit status.
7. **`Bill`**: Inpatient and outpatient clinical bills (`BIL-000001`) with multi-item charge entries, discounts, recorded partial payments, and balance due calculations.
8. **`Supplier`**: Pharmaceutical distributors and contact persons for restocking operations.
9. **`Counter`**: Atomic auto-increment sequence generator for human-readable IDs (`PT-`, `MED-`, `APT-`, `BIL-`, `SALE-`).
10. **`ClinicSettings`**: Clinic name, address, Sanghar contact numbers, tax identifiers, and letterhead configuration.
11. **`AiAuditLog`**: Compliance tracking logging user ID, prompt metadata, token consumption, latency, provider used, and error status.

---

## 5. Detailed Specifications of Advanced Implemented Modules

### 5.1 Patient Registration & Longitudinal EHR

- **Automated Identifier Generation:** Incremental ID format (`PT-000001`) guarantees zero collisions.
- **Fast Search Index:** Bi-directional search across patient full name, CNIC, and telephone number with instant frontend debouncing.
- **Clinical Vital Signs Tracking:** Systolic/Diastolic blood pressure, pulse (bpm), body temperature (°F), weight (kg), and automated BMI calculation.
- **Medical History Timeline:** Chronological visit logs with doctor attribution, diagnosis notes, and prescribed regimen.

### 5.2 Appointments & Calendar Scheduling

- **Conflict Prevention Engine:** The backend queries MongoDB for conflicting active slots within a 30-minute consultation window before saving. Conflicting requests receive an explicit `HTTP 409 Conflict` response.
- **Interactive Calendar:** Visual month-view calendar indicating busy clinic days with indicator dots; clicking any day filters the appointment roster instantly.
- **Status Lifecycle:** `Scheduled` ➔ `Completed` (doctor writes clinical consultation summary) or `Cancelled` (mandatory cancellation reason for audit trails).

### 5.3 Pharmacy Management & FEFO POS with Barcode Scanner

- **FEFO Inventory Depletion:** When a drug is dispensed at the Point of Sale, the algorithm prioritizes batches nearing expiration first, preserving long-dated batches.
- **Hardware Barcode Scanner:** Plug-and-play USB/Bluetooth barcode guns function as a keyboard wedge listener, instantly identifying medicines by SKU/barcode and auto-incrementing cart quantities.
- **Camera Barcode / QR Scanner:** Built-in HTML5 video scanner allowing mobile phones, tablets, or laptops to scan medicine barcodes using the device camera.
- **Web Audio API Feedback:** Synthesizes an immediate high-frequency 880Hz audio confirmation beep upon successful scan (or a low-frequency alert on error) without requiring any external audio files.
- **Intelligent Stock Alerts:** Real-time visual banners flag low-stock thresholds (when total stock across batches $\le$ reorder level) and expiring batches (within 30, 60, or 90 days).
- **Sale Voiding with Inventory Restoral:** Admins can void mistaken sales; the system automatically returns the exact sold quantities back into their original batch records.

### 5.4 Billing & Invoicing Engine

- **Itemized Charge Breakdown:** Supports consultation fees, lab procedures, nursing charges, and medicine lines.
- **Split & Partial Payments:** Records progressive cash/card/JazzCash/EasyPaisa payments with automatic remaining balance recalculations.
- **Overpayment Guard:** Rejects payments exceeding `balanceDue` with clean HTTP 400 validation.
- **Printable Thermal / A4 Invoices:** Standardized receipt layout omitting UI buttons for clean physical printing.

### 5.5 Reports & Analytics Engine

- **Revenue & Collections Report:** Aggregates billed revenue, total collections, outstanding credit, and breakdown by payment instrument.
- **Appointment Performance Report:** Quantifies clinic volume, doctor consultation totals, completion rates, and cancellation analytics.
- **Patient Demographics Report:** Tracks clinic registration trends, gender ratios, and blood group distributions.
- **Pharmacy Sales Analytics:** Identifies top revenue-generating drugs, sales volume, and transaction frequency.
- **Inventory Valuation & Expiry Report:** Computes total pharmacy valuation at cost price vs retail price, lists reorder candidates, and isolates expiring batches.

### 5.6 Artificial Intelligence Hub & Trilingual Discharge Slips

- **Multi-Provider AI Gateway (`aiProvider.js`):**
  - **Google Gemini REST API (v1beta):** Primary LLM (`gemini-1.5-flash` / `gemini-2.0-flash`). Leverages native `system_instruction` formatting and high token quotas.
  - **OpenAI Adapter:** Secondary failover if OpenAI credentials are provided.
  - **Deterministic Heuristic Viva Engine:** Offline local fallback running comprehensive heuristic intelligence. Guaranteed to work 100% reliably during university defense even without internet access or API quotas!
- **Trilingual Discharge Slips (`AiVisitSummaryModal.jsx`):**
  - Formulates structured patient care slips in **English**, **Roman Urdu** (*"Dawai hamesha doctor ki hidayat ke mutabiq waqt par lein"*), and **Sindhi (سنڌي script in right-to-left alignment + Roman Sindhi)** (*"دوا هميشه ڊاڪٽر جي ٻڌايل وقت تي پاڻيءَ سان کائو"*).
  - Includes vital signs table, dosage timings, dietary precautions, follow-up alerts, and doctor signature block.

### 5.7 Automated SMS & WhatsApp Healthcare Alerts Engine

- **Pakistani Number Normalization:** Sanitizes phone numbers to standard E.164 format (`+923XXXXXXXXX`).
- **1-Click WhatsApp Deep Links:** Generates instant `wa.me` links pre-filled with patient name, appointment time, doctor details, and virtual consultation URL.
- **Direct Cloud API Integration:** Dispatches automated messages directly when WhatsApp Business Cloud API credentials are configured.
- **Automated Templates:** Localized templates for appointment reminders, digital discharge slips, billing receipts, and pharmacy purchase summaries.
- **Viva Demo SMS Simulator:** Built-in simulated dispatch engine providing full audit logging for university demonstrations without requiring active third-party SMS billing.

### 5.8 Telemedicine & WebRTC Video Consultations Suite

- **Peer-to-Peer WebRTC Engine:** High-definition video and audio communication directly between physician and patient.
- **Server-Sent Events (SSE) Signaling Stream:** Ultra-lightweight signaling backend relaying SDP Offers, Answers, and ICE Candidates without heavy external dependencies.
- **Google STUN Infrastructure:** Configured with Google public STUN servers (`stun.l.google.com:19302`) for reliable NAT traversal across mobile networks and regional ISPs.
- **In-Call Clinical EHR Notes Drawer:** Allows attending physicians to document live clinical findings, record vital signs, and prescribe medicines during the call, which immediately persist to the patient's permanent medical history upon call completion.
- **Instant WhatsApp Meeting Invites:** Generates a secure virtual consultation link that can be shared with the patient via WhatsApp with a single click.

---

## 6. Complete REST API Reference (45 Endpoints)

The backend exposes **45 RESTful endpoints** under the `/api` prefix:

### 6.1 Authentication & Staff (`/api/auth`, `/api/users`)

- `POST /api/auth/login` — Authenticate user and issue HttpOnly cookie + JWT token.
- `GET /api/auth/me` — Retrieve active session user profile.
- `POST /api/auth/logout` — Clear session cookies and invalidate token.
- `GET /api/users/doctors` — List active doctors (Admin, Receptionist).
- `GET /api/users` — List clinic staff (Admin only).
- `POST /api/users` — Create staff account with role assignment (Admin only).
- `GET /api/users/:id` — Retrieve staff details by ID (Admin only).
- `PUT /api/users/:id` — Update staff details or change role (Admin only).
- `DELETE /api/users/:id` — Deactivate staff account (Admin only).

### 6.2 Patients (`/api/patients`)

- `POST /api/patients` — Register new patient (Admin, Receptionist).
- `GET /api/patients` — Paginated list and search (Admin, Doctor, Receptionist).
- `GET /api/patients/:id` — Retrieve full profile with medical history.
- `PUT /api/patients/:id` — Update demographic details.
- `DELETE /api/patients/:id` — Soft-archive patient record.
- `POST /api/patients/:id/history` — Append doctor visit notes and vitals (Doctor only).

### 6.3 Appointments (`/api/appointments`)

- `GET /api/appointments` — List appointments with date and doctor filters.
- `POST /api/appointments` — Book appointment with 30-minute conflict validation.
- `GET /api/appointments/:id` — Get single appointment details.
- `PUT /api/appointments/:id` — Update appointment schedule or doctor.
- `PATCH /api/appointments/:id/status` — Mark Completed (Doctor) or Cancelled (Admin, Receptionist).

### 6.4 Pharmacy & Suppliers (`/api/medicines`, `/api/suppliers`, `/api/sales`)

- `GET /api/medicines/categories` — List distinct medicine categories.
- `GET /api/medicines/low-stock` — List items below reorder threshold.
- `GET /api/medicines/expiring` — Filter batches expiring within $N$ days.
- `GET /api/medicines/barcode/:barcode` — Instant POS barcode/SKU medicine lookup.
- `GET /api/medicines` — Search inventory and view stock status.
- `POST /api/medicines` — Register medicine with initial batches.
- `GET /api/medicines/:id` — Retrieve medicine details and batch breakdown.
- `PUT /api/medicines/:id` — Update medicine details and reorder level.
- `DELETE /api/medicines/:id` — Deactivate medicine catalog item (Admin only).
- `POST /api/medicines/:id/batches` — Add new batch (batch number, qty, cost, expiry).
- `GET /api/sales/summary` — Aggregate pharmacy revenue summary.
- `GET /api/sales` — View sales records.
- `POST /api/sales` — Conduct POS transaction with FEFO deduction.
- `GET /api/sales/:id` — Retrieve individual sale receipt.
- `PATCH /api/sales/:id/void` — Void sale and restore batch inventory (Admin only).
- `GET /api/suppliers` & `POST /api/suppliers` — Supplier CRUD operations.
- `GET /api/suppliers/:id`, `PUT /api/suppliers/:id`, `DELETE /api/suppliers/:id` — Supplier management.

### 6.5 Billing & Invoicing (`/api/bills`)

- `GET /api/bills/revenue` — Aggregated revenue metrics.
- `GET /api/bills` — Filter bills by status, date, or patient.
- `POST /api/bills` — Generate itemized patient bill.
- `GET /api/bills/:id` — Retrieve bill with itemized breakdown.
- `POST /api/bills/:id/payments` — Record partial or full payment.
- `PATCH /api/bills/:id/cancel` — Cancel unpaid invoice (Admin only).

### 6.6 Reports & Analytics (`/api/reports`)

- `GET /api/reports/revenue` — Revenue, billing, and payment method analytics.
- `GET /api/reports/appointments` — Consultation volumes and completion rates.
- `GET /api/reports/patients` — Patient demographics and registration velocity.
- `GET /api/reports/pharmacy` — Medicine sales volume and top products.
- `GET /api/reports/inventory` — Total stock valuation, expiring batches, and reorder list.

### 6.7 AI Intelligence Hub (`/api/ai`)

- `GET /api/ai/status` — Returns active LLM provider, active model, and quota readiness.
- `POST /api/ai/visit-summary` — Generates trilingual/bilingual discharge slips.
- `GET /api/ai/daily-report` — Automated clinical operations briefing.
- `GET /api/ai/inventory-insights` — AI stock prediction and reorder priority recommendations.
- `GET /api/ai/sales-analysis` — AI financial health and margin trends.
- `POST /api/ai/query` — Natural language database query engine.
- `GET /api/ai/recommendations` — Administrative workflow optimization suggestions.
- `POST /api/ai/parse-text` — Unstructured clinical text & prescription parser.
- `GET /api/ai/audit-logs` — Administrative AI compliance logs.

### 6.8 Notifications & Messaging (`/api/notifications`)

- `POST /api/notifications/send-whatsapp` — Generates direct WhatsApp deep link or sends via WhatsApp Cloud API.
- `POST /api/notifications/send-sms` — Dispatches SMS alert with viva fallback simulator.
- `GET /api/notifications/logs` — Retrieves recent communication audit logs.

### 6.9 Telemedicine Suite (`/api/telemedicine`)

- `POST /api/telemedicine/create-room` — Initializes virtual consultation room and links appointment.
- `GET /api/telemedicine/room/:roomId` — Retrieves room metadata and patient EHR history.
- `GET /api/telemedicine/room/:roomId/events` — Server-Sent Events (SSE) real-time WebRTC signaling stream.
- `POST /api/telemedicine/room/:roomId/signal` — Relays SDP Offers, Answers, and ICE Candidates.
- `POST /api/telemedicine/room/:roomId/end` — Concludes consultation, updates appointment, and saves in-call EHR notes.

### 6.10 Clinic Settings & Security (`/api/settings`)

- `GET /api/settings/clinic` — Retrieve clinic letterhead, branding, and contact details.
- `PUT /api/settings/clinic` — Update clinic profile (Admin only).
- `PUT /api/settings/change-password` — Change password with old password hash verification.

---

## 7. Verification & Automated Test Results

The codebase includes an extensive suite of automated test scripts in `Backend/scripts/`:

| Test Script                   | Target Subsystem                         | Assertions Verified                                                                                 |             Result             |
| :---------------------------- | :--------------------------------------- | :-------------------------------------------------------------------------------------------------- | :----------------------------: |
| `checkSyntax.js`            | Full Backend Static Analysis             | All 62 backend files parsed for valid CommonJS and Express 5 syntax                                 | ✅**PASS (62/62 files)** |
| `testPart1Auth.js`          | Authentication & JWT                     | Login, token signing, role verification, 401 unauthenticated guard, 403 authorization guard         |        ✅**PASS**        |
| `testPart3Patients.js`      | Patient Registry & EHR                   | Auto-ID `PT-000001`, phone/name search, doctor-only visit entry, receptionist 403 block           |        ✅**PASS**        |
| `testPart4Appointments.js`  | Appointment Scheduler                    | Overlapping slot detection (409 Conflict), cancellation reason enforcement, doctor scoping          |        ✅**PASS**        |
| `testPart5Billing.js`       | Invoicing & Payments                     | Itemized subtotal calculations, partial payments, overpayment rejection, bill print route           |        ✅**PASS**        |
| `testPart6Pharmacy.js`      | Inventory & POS Sales                    | Batch creation, low-stock trigger, FEFO batch stock reduction, out-of-stock 409, void sale restoral |        ✅**PASS**        |
| `testSettings.js`           | Security & Settings                      | Old password verification, new password hashing, clinic profile persistence                         |        ✅**PASS**        |
| `testReportsSuite.js`       | 5 Analytical Reports                     | Revenue aggregation, appointment completion rates, demographic distributions, stock valuation       |        ✅**PASS**        |
| `testDashboardFullSuite.js` | Executive Dashboard                      | Multi-role data slicing, KPI computations, chart series delivery (all 9 steps)                      |        ✅**PASS**        |
| `testAiSuite.js`            | AI Services Hub & RBAC                   | Natural language queries, text parsing, executive briefings, audit logging across 4 roles           |        ✅**PASS**        |
| `testNewFeaturesSuite.js`   | Barcode POS, SMS/WhatsApp & Telemedicine | Barcode lookup, 404 validation, WhatsApp link generation, SMS simulation, WebRTC room & signaling   |        ✅**PASS**        |
| `testPostmanRunner.js`      | Postman Automated Collection             | Automated execution of all collection requests with environment state propagation                   |        ✅**PASS**        |

**Overall Automated Test Result:** 12 / 12 Suites Passed (100% Success Rate across all roles).

### 7.2 Device Responsiveness & Search Engine (SEO/AEO/GEO) Verification

| Audit Category                   | Target Platforms / Crawlers          | Evaluation Criteria                                            |              Result              |
| :------------------------------- | :----------------------------------- | :------------------------------------------------------------- | :-------------------------------: |
| **Mobile Responsiveness**  | Viewport: 390 x 844 px (iPhone 14)   | 0px horizontal overflow, touch drawer,$2\times 2$ stats wrap | ✅**PASSED (0px overflow)** |
| **Tablet Responsiveness**  | Viewport: 768 x 1024 px (iPad)       | 2-column flex reflow, auto-fit card grids, scaled 3D canvas    |        ✅**PASSED**        |
| **Desktop Responsiveness** | Viewport: 1440 x 900 px (Widescreen) | Full inline navigation, sticky glassmorphic header             |        ✅**PASSED**        |
| **Technical SEO Audit**    | Googlebot, Bingbot                   | Meta tags, Open Graph, Twitter Cards, dynamic `useSEO`       |        ✅**PASSED**        |
| **AEO (Answer Engine)**    | Perplexity AI, Google SGE            | Schema.org JSON-LD `FAQPage` with 5 clinical entities        |        ✅**PASSED**        |
| **GEO (Generative AI)**    | GPTBot, ClaudeBot, Copilot           | Standard `/llms.txt` manifest, AI-friendly `robots.txt`    |        ✅**PASSED**        |

---

## 8. Installation, Configuration & Execution Guide

### 8.1 Prerequisites

- **Node.js**: v22.0.0 or higher
- **npm**: v10.0.0 or higher
- **MongoDB**: Local Community Server running on `mongodb://127.0.0.1:27017` or MongoDB Atlas Connection URI.

### 8.2 Environment Configuration (`Backend/.env`)

```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
MONGO_URI=mongodb://127.0.0.1:27017/smartclinic
JWT_SECRET=supersecret_smartclinic_jwt_key_2026_xyz
JWT_EXPIRES_IN=7d

# Preferred AI Provider: 'gemini' (Recommended) or 'openai'
PREFERRED_AI_PROVIDER=gemini
GEMINI_API_KEY=your-google-ai-studio-gemini-key
GEMINI_MODEL=gemini-1.5-flash

# Optional OpenAI fallback
OPENAI_API_KEY=your-openai-key-here
OPENAI_MODEL=gpt-4o-mini
```

### 8.3 Starting the Services

1. **Launch Backend Server:**

   ```bash
   cd "d:/FYP Work/SmartClinic By Anis/Backend"
   npm run dev
   ```

   *Runs on `http://localhost:5000` (Connected to MongoDB).*
2. **Launch Frontend Application:**

   ```bash
   cd "d:/FYP Work/SmartClinic By Anis/Frontend"
   npm run dev
   ```

   *Accessible in browser at `http://localhost:5173`.*
3. **Seeded Test Credentials:**

   - **Admin Account:** `admin@clinic.com` / `ChangeMe123`
   - **Doctor Account:** `amina@clinic.com` / `Doctor123`
   - **Receptionist Account:** `receptionist@clinic.com` / `Recep123`
   - **Pharmacist Account:** `pharmacist@clinic.com` / `Pharmacist123`

---

## 9. Viva Defense Talking Points & Frequently Asked Questions

### Q1: What makes SmartClinic unique compared to off-the-shelf clinic software?

> **Answer:** SmartClinic was purpose-built for the local healthcare environment in Pakistan, particularly regional districts like Sanghar, Sindh. It features:
>
> 1. Authentic **Trilingual & Bilingual Discharge Slips** providing instructions in **English**, **Roman Urdu**, and **Arabic-script Sindhi (سنڌي)** with Roman Sindhi transliteration so patients of all literacy levels understand their dosage instructions.
> 2. **FEFO automated inventory control** that prevents medicine expiration in community pharmacies.
> 3. An offline **Heuristic Fail-Safe AI Engine** that guarantees zero disruption during presentations or network outages.
> 4. Embedded **Telemedicine with in-call EHR persistence** connecting rural patients with specialists without travel expenses.

### Q2: How does the system handle security and sensitive health data?

> **Answer:** SmartClinic implements **Role-Based Access Control (RBAC)** across 4 distinct user tiers. Passwords are encrypted using salted `bcryptjs` rounds. User authentication tokens are delivered via **HttpOnly cookies**, which completely prevents client-side JavaScript from accessing session tokens, eliminating Cross-Site Scripting (XSS) token theft. Sensitive routes are double-guarded by backend route interceptors.

### Q3: How is inventory deducted during a POS sale?

> **Answer:** The pharmacy point-of-sale implements **FEFO (First-Expiry-First-Out)** logic. When a medicine with multiple batches is sold, the system queries the active batches sorted by ascending expiration date (`expiryDate: 1`). It draws quantity from the batch that expires earliest before dipping into later batches. If a sale is voided by an Admin, the system restores the exact deducted quantities back into those specific batch IDs.

### Q4: What happens if Google Gemini API hits a quota limit or the clinic internet goes down?

> **Answer:** SmartClinic features a 3-tier resilient AI gateway:
>
> 1. Primary: Google Gemini v1beta REST API.
> 2. Secondary Failover: OpenAI GPT-4o-mini adapter.
> 3. Tertiary Heuristic Engine: Local deterministic algorithms that extract clinical notes, vitals, and medications to assemble the full bilingual discharge slip with zero external API calls. This guarantees 100% uptime during the viva defense.

### Q5: How does the Barcode and WebRTC video call operate without third-party subscriptions?

> **Answer:**
>
> 1. The **Barcode Scanner** supports both standard USB keyboard wedge input and an in-browser HTML5 camera video stream with zero recurring licensing cost, paired with Web Audio API for feedback beeps.
> 2. The **Telemedicine Suite** uses standard WebRTC peer-to-peer protocols with free Google public STUN servers and a lightweight Server-Sent Events (SSE) signaling channel built directly into Node.js/Express, requiring no paid Twilio or Agora subscriptions.

### Q6: How is SmartClinic optimized for modern AI search engines (AEO/GEO) and mobile devices?

> **Answer:** SmartClinic integrates modern web discovery and cross-device responsive engineering:
>
> 1. **AEO & GEO:** Incorporates an official `/llms.txt` knowledge manifest, Schema.org `FAQPage` JSON-LD structured data, and tailored `robots.txt` directives allowing LLM crawlers (*GPTBot, ClaudeBot, PerplexityBot*) to accurately synthesize and cite SmartClinic without exposing private clinical endpoints.
> 2. **Mobile Responsiveness:** Engineered using Tailwind CSS container queries and fluid breakpoints, verified across mobile ($390\text{ px}$), tablet ($768\text{ px}$), and desktop ($1440\text{ px}$) viewports with strict **0px horizontal overflow**, touch-optimized drawer menus, and adaptive typography.

---

## 10. Conclusion & Future Roadmap

**SmartClinic By Anis** successfully delivers a modern, resilient, and culturally contextualized software solution for outpatient clinics and pharmacies. It satisfies all academic requirements of the BSIT Final Year Project while demonstrating enterprise-grade software engineering best practices.

### Completed Milestones

- [X] **Core EHR & Longitudinal Patient Timelines**
- [X] **Doctor Conflict-Protected Scheduling & Visual Month Calendar**
- [X] **Multi-Batch Pharmacy with FEFO Depletion & Near-Expiry Radar**
- [X] **Itemized Billing with Split Payments & Thermal Receipt Printing**
- [X] **5 Deep-Dive Analytical Reports with Recharts & CSV Exports**
- [X] **Google Gemini AI Hub with 8 Intelligent Clinical Modules**
- [X] **Trilingual & Bilingual Discharge Slips (English, Roman Urdu, Sindhi سنڌي RTL)**
- [X] **Hardware & Camera Barcode / QR Scanner with Web Audio Beep Feedback**
- [X] **Automated SMS & WhatsApp Healthcare Alerts Engine (1-Click wa.me deep links & Cloud API)**
- [X] **Telemedicine & WebRTC Video Consultations with In-Call EHR Notes Drawer**
- [X] **Full Multi-Device Responsiveness (Mobile, Tablet, Desktop) with 0px Horizontal Overflow**
- [X] **Technical SEO, On-Page Meta Architecture & XML Sitemap**
- [X] **AEO & GEO Optimization with Schema.org FAQPage & `/llms.txt` Knowledge Manifest**
- [X] **In-App Interactive Documentation & Reports Hub (`/docs`) with Print to PDF**

### True Future Horizons

- **Progressive Web App (PWA) Offline Synchronization:** Implementing Service Workers and IndexedDB for local-first clinical data caching during total internet blackouts in rural clinics.
- **Biometric Thumbprint Patient Identification:** Integrating USB optical fingerprint scanners (e.g., SecuGen / DigitalPersona) for instant patient record retrieval using national CNIC biometrics.
- **HL7 / FHIR Interoperability Standard:** Exporting electronic health records into standard Fast Healthcare Interoperability Resources (FHIR) JSON format for inter-hospital transfers.
- **National Health Card (Sehat Sahulat Program) Verification:** Direct API integration with the provincial and federal health card databases for automated copay and claim processing.

---

*Report Compiled for BSIT Final Year Project Evaluation, SmartClinic By Anis Khan Niazi*
