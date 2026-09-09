# SmartClinic & Pharmacy Management SaaS

<div align="center">

![SmartClinic Banner](Frontend/public/images/hero_doctor_patient.jpg)

# The Intelligent Operating System for Modern Clinics & Pharmacies

[![Status](https://img.shields.io/badge/Status-100%25%20Production%20Ready-emerald?style=for-the-badge&logo=checkmarx)](https://github.com/AnisKhanN/SmartClinic-SaaS)
[![Node.js](https://img.shields.io/badge/Node.js-%3E%3D22.0.0-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.3-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Express](https://img.shields.io/badge/Express-5.2-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB Atlas](https://img.shields.io/badge/MongoDB_Atlas-v9.8-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/atlas)
[![Postman](https://img.shields.io/badge/Postman-51%20Requests%20%7C%20100%25%20Passing-FF6C37?style=for-the-badge&logo=postman&logoColor=white)](https://www.postman.com/)
[![Visibility](https://img.shields.io/badge/Repository-Private-rose?style=for-the-badge&logo=github)](https://github.com/AnisKhanN/SmartClinic-SaaS)

</div>

---

## 📌 Project Overview

**SmartClinic** is an enterprise-grade, full-stack, multi-tenant healthcare software-as-a-service (SaaS) platform engineered to modernize outpatient clinics, rural medical centers, and community pharmacies in Pakistan. Developed to bridge the digital divide in regional healthcare facilities (with a specialized focus on Sanghar, Sindh), SmartClinic replaces paper-based patient slips, disjointed spreadsheets, and manual prescription notes with a unified, role-based operating system.

Developed by **Anis Khan Niazi** as a **BSIT Final Year Project**, SmartClinic delivers institutional reliability, mathematical double-booking prevention, automated inventory expiration protection, cultural language accessibility, and real-time clinical AI intelligence.

---

## 🌟 Key Subsystems & Core Features

### 1. 🏢 True Multi-Tenant Architecture
- Shared-database, logical-partitioning model with compound unique indexes scoped to `clinicId`.
- Tenant-isolated atomic sequence counters for clinical identifiers (`PT-000001`, `BL-000001`, `MD-000001`).
- Self-service clinic onboarding via `POST /api/auth/register-clinic`.

### 2. 📋 Electronic Health Records (EHR) & Longitudinal Demographics
- Centralized patient registry with CNIC formatting and duplicate checks per clinic.
- Longitudinal clinical timelines, vitals monitoring (BP, pulse, temp, weight, BMI), and diagnostic visit notes.

### 3. 📅 Conflict-Free Appointment Scheduling
- Doctor calendar synchronization with mathematical double-booking prevention within 30-minute consultation slots.
- Explicit HTTP 409 Conflict rejection on overlapping schedules.
- Real-time status lifecycle: `Pending` ➔ `Confirmed` ➔ `Completed` ➔ `Cancelled`.

### 4. 💊 Smart Pharmacy POS & FEFO Inventory Control
- **First-Expiry-First-Out (FEFO)** automated batch deduction logic pulling units from batches with earliest expiry dates first.
- Multi-tier expiration radar alerting at 30, 60, and 90 days.
- Hardware USB/Bluetooth barcode gun listener and HTML5 device camera scanner with Web Audio API feedback beeps.
- Admin-controlled sale voiding with automatic stock restoration back to original batch IDs.

### 5. 💳 Multi-Gateway POS & Split Billing
- Itemized invoicing for doctor consultations, laboratory procedures, and pharmacy items.
- Split-payment support across **Cash**, **Credit/Debit Cards**, **JazzCash**, and **EasyPaisa**.
- 80mm standard thermal receipt generation and printable A4 statements.

### 6. 🤖 Google Gemini AI Assistant & Trilingual Care Slips
- Resilient 3-tier AI gateway: Google Gemini v1beta REST API + OpenAI failover + Deterministic Offline Heuristic Viva Engine.
- **Trilingual Slips:** Generates structured patient care instructions in **English**, **Roman Urdu**, and authentic **Sindhi (سنڌي script with RTL alignment + Roman Sindhi)**.
- Natural language clinical/financial queries, automated daily executive briefs, and prescription OCR text parser.

### 7. 📹 WebRTC Telemedicine Suite
- Peer-to-peer audio/video consultations utilizing Google public STUN infrastructure (`stun.l.google.com:19302`).
- Server-Sent Events (SSE) real-time signaling stream.
- In-call clinical EHR notes drawer persisting directly to the patient's record upon call conclusion.
- 1-click WhatsApp meeting invitations (`wa.me`).

### 8. 🛡️ 4-Tier Institutional Role-Based Access Control (RBAC)
- 4 isolated workstation roles: **Admin**, **Doctor**, **Receptionist**, **Pharmacist**.
- JWT HttpOnly session cookies preventing Cross-Site Scripting (XSS) token theft.
- Role-scoped database slicing on `/api/dashboard/stats` preventing financial data leakage to medical staff.

### 9. 🔍 Advanced SEO, AEO & GEO Search Architecture
- Schema.org JSON-LD `@graph` (`SoftwareApplication`, `MedicalBusiness` / `MedicalClinic`, `WebSite`, `FAQPage`).
- Direct Q&A answers formatted for AI answer engines (ChatGPT, Perplexity, Claude, Google SGE).
- Regional geocoded targeting for Sanghar & Interior Sindh (`PK-SD`, coordinates `26.0464; 68.9482`, `ICBM`).
- Standardized [`/llms.txt`](Frontend/public/llms.txt) knowledge manifest for LLM crawlers.

---

## 💻 Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend Framework** | React 19.2.7, React DOM, Vite 8.1.5 (Hot Module Replacement) |
| **Styling & Aesthetics** | Tailwind CSS v4.3.3, CSS Variables, Glassmorphism, Dark/Light Mode |
| **Routing & State** | React Router DOM v7.18.2, React Context API, Custom Hooks |
| **Animations & Charts** | Framer Motion v12.43.0, Recharts v3.10.1 |
| **Backend Runtime** | Node.js v22+, Express 5.2.1 |
| **Database & ODM** | MongoDB Atlas, Mongoose v9.8.1 (Compound Index Partitioning) |
| **Authentication** | JSON Web Tokens (`jsonwebtoken`), `bcryptjs`, `cookie-parser` (HttpOnly) |
| **Real-time & Media** | WebRTC, Server-Sent Events (SSE), Multer, ImageKit SDK |
| **AI Engine** | Google Gemini 1.5/2.0 REST API, OpenAI fallback, Local Heuristic Engine |
| **Testing & API Spec** | Postman Cloud Suite (14 Folders, 51 Requests), ESLint 10 |

---

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js**: v22.0.0 or higher
- **npm**: v10.0.0 or higher
- **MongoDB**: MongoDB Atlas URI or local MongoDB instance

### 1. Clone the Repository
```bash
git clone https://github.com/AnisKhanN/SmartClinic-SaaS.git
cd SmartClinic-SaaS
```

### 2. Backend Setup
```bash
cd Backend
npm install
# Configure your .env file with MONGODB_URI and JWT_SECRET
npm run seed     # Initialize demo clinic and 4 staff accounts
npm run dev      # Server starts on http://localhost:5000
```

### 3. Frontend Setup
```bash
cd ../Frontend
npm install
npm run dev      # Client starts on http://localhost:5173
```

### 4. Production Build Verification
```bash
cd Frontend
npm run build    # Compiles in ~1.5s with zero errors
```

---

## 🔑 Default Seeded Credentials

| Role | Email | Password | Primary Access |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@clinic.com` | `ChangeMe123` | Full facility overview, user management, reports, settings, bill cancellations |
| **Doctor** | `amina@clinic.com` | `Doctor123` | Assigned patients, EHR history, consultation drawer, telemedicine |
| **Receptionist** | `receptionist@clinic.com` | `Recep123` | Patient registration, appointments scheduling, billing invoices, POS cash counter |
| **Pharmacist** | `pharmacist@clinic.com` | `Pharmacist123` | FEFO pharmacy POS, barcode scanner, medicine catalog, batch expiry radar |

---

## 📂 Project Structure

```
SmartClinic By Anis/
├── Backend/
│   ├── src/
│   │   ├── config/             # DB & Cloud configurations
│   │   ├── controllers/        # 14 REST API controllers
│   │   ├── middlewares/        # JWT auth, RBAC guards, rate limiters
│   │   ├── models/             # 11 Mongoose multi-tenant schemas
│   │   ├── routes/             # 15 Express route files
│   │   ├── services/           # Gemini AI, notification, fallback services
│   │   └── utils/              # Atomic ID generators, error handlers
│   ├── scripts/
│   │   └── seedAdmin.js        # Production database seeder
│   └── server.js               # Application entry point
├── Frontend/
│   ├── public/
│   │   ├── images/             # High-DPI photorealistic clinical assets
│   │   ├── llms.txt            # Machine-readable AI knowledge manifest
│   │   ├── robots.txt          # Modern AI search bot directives
│   │   ├── sitemap.xml         # Canonical HTTPS sitemap
│   │   ├── PROJECT_REPORT.md   # In-app technical specification
│   │   └── RBAC_AUDIT_REPORT.md# In-app RBAC audit report
│   ├── src/
│   │   ├── components/         # Modular UI components (Dashboard, POS, EHR)
│   │   ├── context/            # AuthContext, ThemeContext
│   │   ├── hooks/              # useSEO, useAuth, useSmoothScroll
│   │   ├── pages/              # 14 lazy-loaded page modules
│   │   └── App.jsx             # Application router & providers
│   ├── index.html              # Schema.org @graph & meta tags
│   └── package.json
├── PROJECT_REPORT.md           # 10-section technical evaluation report
├── RBAC_AUDIT_REPORT.md        # Comprehensive security audit report
└── README.md                   # Repository documentation
```

---

## 📚 Technical Documentation

- **[FYP Technical Report](PROJECT_REPORT.md)**: 10-section comprehensive specification covering system design, database schemas, quantitative metrics, and viva defense talking points.
- **[RBAC Security Audit Report](RBAC_AUDIT_REPORT.md)**: Full security audit verifying 0 cross-role authorization leaks, 0 cross-tenant collisions, and role-scoped database slicing.
- **[LLM Knowledge Manifest](Frontend/public/llms.txt)**: Structured manifest for Generative AI and Answer Engine Optimization (AEO / GEO).
- **In-App Docs Viewer**: Run the app and visit `http://localhost:5173/docs` for live Markdown navigation, search filtering, and Print-to-PDF formatting.

---

## 👨‍💻 Author & Academic Credits

- **Developer:** Anis Khan Niazi
- **Degree:** Bachelor of Science in Information Technology (BSIT)
- **Specialization:** Full-Stack Web Architecture & Healthcare Systems
- **Project Type:** BSIT Final Year Project (FYP)
- **Target District:** Sanghar & Interior Sindh, Pakistan
- **GitHub:** [@AnisKhanN](https://github.com/AnisKhanN)

---

<div align="center">
  <b>SmartClinic By Anis — Transforming Healthcare Delivery Through Intelligent Software</b>
</div>
