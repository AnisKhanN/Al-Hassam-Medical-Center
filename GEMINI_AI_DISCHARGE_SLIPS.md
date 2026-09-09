# Implementation Plan: Google Gemini AI & Bilingual Discharge Slips (English + Roman Urdu + Sindhi)

This plan integrates **Google Gemini** as the primary AI provider (leveraging generous quotas and paid Google AI Pro capabilities) with OpenAI as an optional secondary provider and local fail-safe heuristic mode for FYP viva defense. It also implements **Bilingual & Trilingual Discharge Slips** supporting English, Roman Urdu, and Sindhi (سنڌي script + Roman Sindhi) specifically tailored for patients in Sanghar, Sindh.

---

## User Review Required

> [!IMPORTANT]
> **LLM Provider Configuration:**
> - **Google Gemini** will be set as the **preferred primary provider** (`PREFERRED_AI_PROVIDER=gemini`). It will use `GEMINI_MODEL=gemini-1.5-flash` (or `gemini-2.0-flash`), connecting to Google AI Studio with your Google AI Pro key.
> - **OpenAI** remains supported as an automatic secondary failover adapter if an OpenAI key is present.
> - **Fail-Safe Heuristic Mode** is permanently available for offline viva defense so your final presentation never stumbles on network or quota drops.
> - You will be able to supply your `GEMINI_API_KEY` directly in `Backend/.env`.

> [!NOTE]
> **Bilingual & Trilingual Discharge Slips for Sanghar:**
> - Supports **English**, **Roman Urdu** (e.g., *"Dawai subah sham taaza pani ke sath lein"*), and **Sindhi** in both Nastaliq/Naskh Arabic script (سنڌي: *"دوا هميشه ڊاڪٽر جي ٻڌايل وقت تي پاڻيءَ سان کائو"*) and Roman Sindhi (*"Dawa hamesha doctor je budhayal waqt te khao"*).
> - Features printable clinic letterhead formatting with medication timings, discharge condition, follow-up dates, precautions, and doctor's signature block.

---

## Proposed Changes

### Backend: AI Service & Provider Layer

#### [MODIFY] [Backend/.env](file:///d:/FYP%20Work/SmartClinic%20By%20Anis/Backend/.env)
- Add `GEMINI_API_KEY`, `GEMINI_MODEL=gemini-1.5-flash`, and `PREFERRED_AI_PROVIDER=gemini`.
- Add documentation comments for Google AI Pro configuration.

#### [MODIFY] [Backend/.env.example](file:///d:/FYP%20Work/SmartClinic%20By%20Anis/Backend/.env.example)
- Add matching example entries for `GEMINI_API_KEY`, `GEMINI_MODEL`, and `PREFERRED_AI_PROVIDER`.

#### [MODIFY] [Backend/src/services/aiProvider.js](file:///d:/FYP%20Work/SmartClinic%20By%20Anis/Backend/src/services/aiProvider.js)
- Prioritize Google Gemini according to `PREFERRED_AI_PROVIDER` (default `"gemini"`).
- Improve `callGemini` with Google Generative AI v1beta `system_instruction` support and JSON markdown fence cleaner.
- Enhance `getProviderStatus()` to return provider name, active model, and quota readiness.

#### [MODIFY] [Backend/src/services/aiService.js](file:///d:/FYP%20Work/SmartClinic%20By%20Anis/Backend/src/services/aiService.js)
- Update `generateVisitSummary` system prompt to mandate structured outputs for:
  - `english`
  - `romanUrdu`
  - `sindhi` (سنڌي script)
  - `romanSindhi`
  - Discharge disposition & precautions
- Add robust JSON sanitization so LLM responses wrapped in ````json ... ```` never cause JSON parse errors.

#### [MODIFY] [Backend/src/services/aiFallbackService.js](file:///d:/FYP%20Work/SmartClinic%20By%20Anis/Backend/src/services/aiFallbackService.js)
- Extend `generateFallbackVisitSummary` with rich, culturally authentic Sindhi instructions (both in Arabic script سنڌي and Roman Sindhi), alongside Roman Urdu and English.
- Add discharge disposition, dietary precautions, and Sanghar healthcare clinic contact details.

---

### Frontend: UI & Discharge Slip Components

#### [MODIFY] [Frontend/src/components/ai/AiVisitSummaryModal.jsx](file:///d:/FYP%20Work/SmartClinic%20By%20Anis/Frontend/src/components/ai/AiVisitSummaryModal.jsx)
- Add language view selector buttons:
  - **Trilingual (English + Roman Urdu + Sindhi سنڌي)**
  - **Bilingual (English + Sindhi سنڌي)**
  - **Bilingual (English + Roman Urdu)**
  - **Sindhi سنڌي Only**
  - **Roman Urdu Only**
  - **English Only**
- Render right-to-left (RTL) typography for Sindhi script alongside English and Roman Urdu cards.
- Add Discharge Summary header, vital signs grid, medication schedule with Urdu/Sindhi dose indicators, follow-up alert, and official printable slip layout.

#### [MODIFY] [Frontend/src/pages/ai/AiAssistant.jsx](file:///d:/FYP%20Work/SmartClinic%20By%20Anis/Frontend/src/pages/ai/AiAssistant.jsx)
- Add a new dedicated **"Bilingual Discharge Slips"** tab to the central AI Assistant Hub.
- Include a quick patient picker from the database or freeform patient input to generate and print slips directly from the AI Hub.
- Show clear provider status pill ("Google Gemini Live" with model badge, or "OpenAI Live", or "FYP Demo Mode").

#### [MODIFY] [Frontend/src/components/appointments/AppointmentTable.jsx](file:///d:/FYP%20Work/SmartClinic%20By%20Anis/Frontend/src/components/appointments/AppointmentTable.jsx)
- Add a quick action button on appointments to launch the Bilingual Discharge Slip modal for that patient.

---

### Project Architecture Documentation

#### [MODIFY] [UI Interface Concepts Work/AI Module Scope & Architecture — Smart Clinic & Pharmacy Management SaaS](file:///d:/FYP%20Work/UI%20Interface%20Concepts%20Work/AI%20Module%20Scope%20&%20Architecture%20%E2%80%94%20Smart%20Clinic%20&%20Pharmacy%20Management%20SaaS)
- Record the user's resolution on Question 1 (Google Gemini preferred, Google AI Pro support, unified fallback) and Question 2 (Confirmed Bilingual/Trilingual Discharge Slips with English + Roman Urdu + Sindhi for Sanghar patients).

---

## Verification Plan

### Automated & API Tests
1. Test `/api/ai/status` returns active provider status (`gemini`, `gemini-1.5-flash`, fallback ready).
2. Test `/api/ai/visit-summary` endpoint with test payload:
   - Verify returned JSON contains `patientInstructions.english`, `patientInstructions.romanUrdu`, `patientInstructions.sindhi`, and `patientInstructions.romanSindhi`.
   - Test with and without API key to verify seamless fail-safe heuristic mode.

### Manual Verification
1. Open **AI Assistant Hub** in browser -> verify the new "Bilingual Discharge Slips" tab appears and active provider status is displayed.
2. Generate a visit summary for a patient -> switch between **Trilingual**, **Sindhi سنڌي**, **Roman Urdu**, and **English** views.
3. Verify Sindhi font rendering (RTL alignment and clear readability).
4. Click **Print Slip** and inspect print layout preview.
