# Al-Hassam Medical Center & SmartClinic Healthcare SaaS

<div align="center">

![SmartClinic Banner](Frontend/public/images/hero_doctor_patient.jpg)

# The Intelligent Operating System for Modern Clinics, Pharmacies & Regional Healthcare Centers

[![Status](https://img.shields.io/badge/Status-100%25%20Production%20Ready-emerald?style=for-the-badge&logo=checkmarx)](https://github.com/AnisKhanN/Al-Hassam-Medical-Center)
[![Node.js](https://img.shields.io/badge/Node.js-%3E%3D22.0.0-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.3-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Express](https://img.shields.io/badge/Express-5.2-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB Atlas](https://img.shields.io/badge/MongoDB_Atlas-v9.8-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/atlas)
[![Postman](https://img.shields.io/badge/Postman-51%20Requests%20%7C%20100%25%20Passing-FF6C37?style=for-the-badge&logo=postman&logoColor=white)](https://www.postman.com/)
[![Visibility](https://img.shields.io/badge/Repository-Public-emerald?style=for-the-badge&logo=github)](https://github.com/AnisKhanN/Al-Hassam-Medical-Center)

</div>

---

## 📌 Executive Overview

**Al-Hassam Medical Center** is an enterprise-grade, full-stack, multi-tenant healthcare software-as-a-service (SaaS) platform engineered to modernize outpatient clinics, rural medical centers, emergency units, and community pharmacies in Pakistan. Specifically tailored to bridge the digital healthcare divide in regional facilities—anchored at **Nawabshah Road, City Sanghar, Sindh**—the platform replaces disjointed paper slips, manual prescription registers, and disorganized spreadsheets with a unified, high-integrity digital operating system.

Engineered and developed by **Anis Khan Niazi** as a **BSIT Final Year Project**, the platform combines institutional reliability, mathematical double-booking prevention, automated First-Expiry-First-Out (FEFO) pharmacy inventory protection, cultural language accessibility (English, Roman Urdu, authentic Sindhi سنڌي), and real-time Google Gemini AI clinical intelligence.

---

## 🏥 Clinical Disciplines & Specialist Faculty

Al-Hassam Medical Center provides around-the-clock emergency medical response alongside scheduled consultations across **7 core specialist disciplines**:

| Specialty | Clinical Scope | Equipment & Diagnostics |
| :--- | :--- | :--- |
| **🩺 General & Internal Medicine** | Chronic disease management (hypertension, type-2 diabetes), acute infectious diseases, adult health screenings. | Digital ECG, diagnostic vitals monitor, glucometers, nebulizers. |
| **👶 Pediatrics & Child Health** | Neonatal assessment, developmental milestones, pediatric vaccinations, acute childhood infections. | Pediatric scale, length board, non-contact pyrometers, pulse oximetry. |
| **🌸 Gynecology & Obstetrics** | Antenatal care, post-natal recovery, maternal vitals, ultrasound review, family wellness. | Fetal Doppler, high-resolution ultrasound, examination suite. |
| **🦴 Orthopedics & Trauma** | Fracture stabilization, joint & back pain therapy, sports injury triage, post-surgical rehabilitation. | Digital X-ray link, cast application facility, splints & braces store. |
| **❤️ Cardiology & Heart Health** | Arrhythmia evaluation, post-infarction care, lipid management, preventive cardiac screenings. | Multi-lead 12-channel ECG, Holter review workstation, cardiac enzyme assays. |
| **✨ Dermatology & Skin Health** | Eczema, psoriasis, acne therapy, allergic dermatitis, fungal skin conditions, dermoscopy. | High-resolution dermatoscope, cryotherapy equipment, skin biopsy suite. |
| **👁️ Ophthalmology & Eye Care** | Refraction checks, cataract assessment, diabetic retinopathy screening, conjunctivitis treatment. | Auto-refractometer, slit lamp biomicroscope, Snellen chart station. |

---

## 🌟 Key Subsystems & Architecture

### 1. 🏢 Multi-Tenant Data Isolation
- **Compound Index Partitioning:** Every database collection enforces compound indexes prefixed by `clinicId` (e.g., `{ clinicId: 1, mrn: 1 }`).
- **Scoped Atomic Sequence Counters:** Auto-incrementing human-readable identifiers (`PT-000001`, `MD-000001`, `BL-000001`, `RX-000001`) partitioned per clinic tenant without collision.
- **Self-Service Facility Registration:** Automated onboarding endpoint `POST /api/auth/register-clinic` for rapid provisioning of independent clinical environments.

### 2. 📋 Electronic Health Records (EHR) & Demographics
- Standardized medical records tracking patient MRN, CNIC formatting, emergency contacts, blood group, allergies, and chronic medical history.
- Longitudinal clinical timelines logging vital signs (Systolic/Diastolic BP, Pulse, Temperature, Respiratory Rate, Weight, BMI) with color-coded triage indicators.
- Visit documentation with differential diagnosis, prescribed drug regimens, laboratory test orders, and dietary/follow-up directives.

### 3. 📅 Conflict-Free Appointment Scheduling
- Conflict-detection engine preventing double-booking across 30-minute consultation windows for each doctor.
- Immediate `409 Conflict` HTTP exception handling with suggested available time slots.
- Multi-status appointment lifecycle: `Pending` ➔ `Confirmed` ➔ `Completed` ➔ `Cancelled`.

### 4. 💊 Smart Pharmacy POS & FEFO Inventory Control
- **First-Expiry-First-Out (FEFO) Engine:** Automated algorithmic stock deduction that prioritizes batches nearing expiration, preventing stock obsolescence and pharmaceutical waste.
- **Multi-Tier Expiry Radar:** Color-coded inventory dashboard highlighting batches expiring within 30 days (critical red), 60 days (warning amber), and 90 days (notice blue).
- **Dual Barcode Input:** Built-in hardware listener for standard USB/Bluetooth handheld barcode scanners and HTML5 device camera video stream scanner with Web Audio acoustic feedback.
- **Transaction Safety & Reversals:** Supervisor-gated invoice voiding with automatic stock replenishment back to original batch IDs.

### 5. 💳 Multi-Channel POS Billing & Invoicing
- Comprehensive invoicing covering doctor consultation fees, diagnostic procedures, laboratory charges, and pharmacy sales.
- Split-payment options supporting **Cash**, **Credit/Debit Cards**, **EasyPaisa**, and **JazzCash**.
- Instant printing formats for 80mm thermal receipt printers and standard A4 formal invoice statements.

### 6. 🤖 Google Gemini AI Co-Pilot & Trilingual Care Slips
- **3-Tier Resilient AI Gateway:** Primary integration with Google Gemini 1.5/2.0 REST API, fallback to OpenAI endpoints, and an offline deterministic heuristic viva engine.
- **Trilingual Discharge Slips:** Instant generation of patient-friendly medication schedules and cautionary advice in:
  - 🇬🇧 **English** (Standard Clinical Documentation)
  - 🇵🇰 **Roman Urdu** (Accessible Phonetic Urdu for Local Staff & Patients)
  - 🇵🇰 **Sindhi (سنڌي)** (Authentic Arabic script with native RTL formatting + Roman Sindhi phonetics for rural interior Sindh)
- Daily executive clinic summaries, automated revenue digests, and prescription OCR extraction.

### 7. 📹 WebRTC Telemedicine Suite
- Zero-plugin browser-to-browser encrypted video and audio consultations via WebRTC utilizing Google public STUN infrastructure (`stun.l.google.com:19302`).
- Server-Sent Events (SSE) for low-latency call signaling and connection state management.
- Integrated EHR consultation notes drawer allowing doctors to log findings during video calls.
- 1-click WhatsApp appointment link sharing (`wa.me`).

### 8. 🛡️ 4-Tier Institutional Role-Based Access Control (RBAC)
- 4 dedicated, workflow-specific portals: **Admin**, **Doctor**, **Receptionist**, and **Pharmacist**.
- JWT-based authorization stored in secure, HttpOnly cookies to mitigate Cross-Site Scripting (XSS) and token theft.
- Role-scoped backend data filtering preventing medical and administrative personnel from accessing unauthorized financial metrics.

### 9. 🔍 SEO, AEO & GEO Search Engine Optimization
- Schema.org JSON-LD structured data `@graph` (`SoftwareApplication`, `MedicalClinic`, `MedicalBusiness`, `WebSite`, `FAQPage`).
- Answer Engine Optimization (AEO) tailored for AI engines (ChatGPT, Google SGE, Perplexity, Claude).
- Geocoded local metadata targeting Sanghar, Sindh (`PK-SD`, latitude `26.0464`, longitude `68.9482`).
- Machine-readable knowledge manifests [`/llms.txt`](Frontend/public/llms.txt) and [`/robots.txt`](Frontend/public/robots.txt).

---

## 💻 Technology Stack & Architectural Specifications

| Layer | Technology | Purpose / Role |
| :--- | :--- | :--- |
| **Frontend Framework** | React 19.2.7 | Component architecture with modern React Hooks & concurrent rendering |
| **Build & Bundler** | Vite 8.1.5 | Instant Hot Module Replacement (HMR) and optimized rollup production bundling |
| **Styling & UI Design** | Tailwind CSS v4.3.3 | Glassmorphism, tailored HSL medical palettes, dark/light adaptive modes |
| **Routing & Navigation** | React Router DOM v7.18.2 | Protected role-based route guards and client-side page navigation |
| **Animations & UI UX** | Framer Motion v12.43.0 | Smooth card entrances, page transitions, and interactive micro-animations |
| **Data Visualization** | Recharts v3.10.1 | Real-time clinical trends, revenue breakdowns, and patient volume charts |
| **Backend Runtime** | Node.js v22.0.0+ | Server-side JavaScript runtime with native fetch and async performance |
| **Web Server Framework**| Express 5.2.1 | High-throughput REST API routing with unified error-handling middlewares |
| **Database & ODM** | MongoDB Atlas / Mongoose v9.8.1 | Cloud-hosted NoSQL cluster with compound index-level multi-tenancy |
| **Authentication** | JSON Web Tokens (`jsonwebtoken`) | Stateless authentication with signed, HttpOnly session cookies |
| **Password Hashing** | `bcryptjs` (salt rounds: 10) | Cryptographic protection for all institutional user accounts |
| **Real-time Signaling** | Server-Sent Events (SSE) & WebRTC | Real-time signaling for P2P video consultations and telemedicine |
| **AI Integration** | Google Gemini REST API | Generative clinical instructions, multilingual summaries, and OCR |
| **API Quality Suite** | Postman Cloud (51 Requests) | 100% automated assertion coverage across 14 modules |

---

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js**: v22.0.0 or higher
- **npm**: v10.0.0 or higher
- **MongoDB**: Active MongoDB Atlas URI (or local MongoDB community instance)

### 1. Clone the Repository
```bash
git clone https://github.com/AnisKhanN/Al-Hassam-Medical-Center.git
cd Al-Hassam-Medical-Center
```

### 2. Backend Setup
```bash
cd Backend
npm install

# Create your .env file in Backend/.env
# PORT=5000
# MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/smartclinic?retryWrites=true&w=majority
# JWT_SECRET=your_super_secret_jwt_key
# GEMINI_API_KEY=your_google_gemini_api_key
# CLIENT_URL=http://localhost:5173

# Seed the database with the default clinic and accounts
npm run seed

# Launch the backend server
npm run dev
# Backend runs at http://localhost:5000
```

### 3. Frontend Setup
```bash
cd ../Frontend
npm install

# Create your .env file in Frontend/.env (optional for local defaults)
# VITE_API_URL=http://localhost:5000/api

# Launch the frontend development server
npm run dev
# Frontend runs at http://localhost:5173
```

### 4. Verify Production Build
```bash
cd Frontend
npm run build
# Compiles smoothly in ~1.5 seconds with zero build or lint warnings
```

---

## 🔑 Default Seeded Accounts for Testing

The seeder script (`npm run seed` in `Backend/`) provisions a sample facility with full data and accounts:

| Role | Email | Password | Primary Accessible Modules |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@clinic.com` | `ChangeMe123` | Institutional metrics, clinic settings, staff accounts, financial analytics, void approvals |
| **Doctor** | `amina@clinic.com` | `Doctor123` | Patient queue, EHR history, specialist clinical drawer, visit notes, telemedicine calls |
| **Receptionist** | `receptionist@clinic.com` | `Recep123` | Patient registration, scheduling appointments, outpatient desk, initial billing invoices |
| **Pharmacist** | `pharmacist@clinic.com` | `Pharmacist123` | Pharmacy POS register, barcode scanning, FEFO batch selection, inventory radar |

---

## 🧪 Postman Cloud Automated Test Suite

The entire backend API is validated via an automated Postman test suite:
- **Collection Name:** `Al-Hassam Medical Center - Complete API Test Suite`
- **Cloud Collection UID:** `55354836-56de28c5-6ff1-4f3e-b657-0c32fc001432`
- **Pass Rate:** 100% (51 automated requests across 14 functional folders)
- **Local File:** [Al_Hassam_Medical_Center_API_Test_Suite.json](Al_Hassam_Medical_Center_API_Test_Suite.json)

```bash
# Execute tests with Newman CLI (optional)
npx newman run Al_Hassam_Medical_Center_API_Test_Suite.json
```

---

## 📂 Codebase Directory Organization

```
Al-Hassam-Medical-Center/
├── Backend/
│   ├── src/
│   │   ├── config/             # MongoDB Atlas connection & environment setup
│   │   ├── controllers/        # 14 REST API controllers (Auth, EHR, POS, Billing, AI)
│   │   ├── middlewares/        # JWT auth, 4-tier RBAC guards, rate limiters
│   │   ├── models/             # 11 Mongoose multi-tenant data models
│   │   ├── routes/             # 15 Express route files
│   │   ├── services/           # Gemini AI gateway, notification engine, fallback heuristics
│   │   └── utils/              # Atomic tenant sequence counters, error handlers
│   ├── scripts/
│   │   └── seedAdmin.js        # Comprehensive clinic & staff database seeder
│   └── server.js               # Express application entry point
├── Frontend/
│   ├── public/
│   │   ├── images/             # Photorealistic clinical assets & facility hero imagery
│   │   ├── llms.txt            # Machine-readable AI knowledge manifest
│   │   ├── robots.txt          # Modern AI search bot directives
│   │   ├── sitemap.xml         # Canonical XML sitemap
│   │   ├── PROJECT_REPORT.md   # In-app technical evaluation report
│   │   └── RBAC_AUDIT_REPORT.md# In-app RBAC security audit report
│   ├── src/
│   │   ├── components/         # Reusable UI modules (Navbar, Footer, POS, EHR, AI)
│   │   ├── context/            # AuthContext, ThemeContext, Socket/SSE
│   │   ├── hooks/              # useSEO, useAuth, useSmoothScroll
│   │   ├── pages/              # 14 lazy-loaded page views (Landing, Dashboard, POS, Docs)
│   │   └── App.jsx             # React router configuration & application providers
│   ├── index.html              # Schema.org @graph JSON-LD & meta tags
│   └── package.json
├── PROJECT_REPORT.md           # 10-section academic & technical evaluation document
├── RBAC_AUDIT_REPORT.md        # Comprehensive multi-tenant RBAC security audit
├── docker-compose.yml          # Container configuration for local deployment
└── README.md                   # Primary repository documentation
```

---

## 📚 Technical Documentation & Reports

- 📄 **[Comprehensive Technical Project Report](PROJECT_REPORT.md)**: Full 10-section document detailing system architecture, database modeling, schema design, quantitative benchmarks, and viva defense talking points.
- 🛡️ **[RBAC & Security Audit Report](RBAC_AUDIT_REPORT.md)**: Exhaustive security audit confirming zero cross-role authorization leaks, complete multi-tenant compound index isolation, and financial data protections.
- 🌐 **In-App Documentation Viewer**: Run the web application and navigate to `http://localhost:5173/docs` to view the searchable, print-ready, interactive documentation directly in the browser.

---

## 👨‍💻 Author & Project Attribution

- **Lead Software Architect & Developer:** [Anis Khan Niazi](https://github.com/AnisKhanN)
- **Academic Degree:** Bachelor of Science in Information Technology (BSIT)
- **Project Classification:** Final Year Project (FYP)
- **Location:** Sanghar, Sindh, Pakistan
- **GitHub Profile:** [@AnisKhanN](https://github.com/AnisKhanN)
- **Repository:** [https://github.com/AnisKhanN/Al-Hassam-Medical-Center](https://github.com/AnisKhanN/Al-Hassam-Medical-Center)

---

<div align="center">
  <b>Al-Hassam Medical Center • SmartClinic Healthcare SaaS</b><br />
  <i>Engineered with excellence to revolutionize healthcare delivery in Pakistan.</i>
</div>
