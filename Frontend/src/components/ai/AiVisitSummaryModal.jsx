import { useState } from "react";
import {
  FiX,
  FiPrinter,
  FiCpu,
  FiClock,
  FiGlobe,
  FiAlertCircle,
  FiActivity,
  FiUserCheck,
  FiSend,
  FiCheckCircle,
  FiMessageSquare,
} from "react-icons/fi";
import { generateVisitSummary } from "../../api/aiApi";
import { sendWhatsAppNotification, sendSmsNotification } from "../../api/notificationApi";

const AiVisitSummaryModal = ({
  isOpen,
  onClose,
  patient,
  initialNotes = "",
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [notificationMsg, setNotificationMsg] = useState(null);
  const [sendingNotif, setSendingNotif] = useState(false);
  // Language view modes: trilingual, bilingual-urdu, bilingual-sindhi, sindhi, romanUrdu, english
  const [activeTab, setActiveTab] = useState("trilingual");
  const [summaryData, setSummaryData] = useState(null);

  // Find latest recorded vitals from patient EHR history
  const latestVitals = patient?.medicalHistory?.length
    ? [...patient.medicalHistory]
        .reverse()
        .find(
          (h) =>
            h.vitals &&
            (h.vitals.bp || h.vitals.pulse || h.vitals.temp || h.vitals.weight),
        )?.vitals
    : null;

  // Form Inputs
  const [notes, setNotes] = useState(initialNotes);
  const [bp, setBp] = useState(latestVitals?.bp || "120/80");
  const [pulse, setPulse] = useState(latestVitals?.pulse || "76");
  const [temp, setTemp] = useState(latestVitals?.temp || "98.6");
  const [weight, setWeight] = useState(latestVitals?.weight || "68 kg");
  const [disposition, setDisposition] = useState(
    "Discharged in Stable Condition (گهر روانگي)",
  );
  const [nextFollowUp, setNextFollowUp] = useState("");
  const [medsInput, setMedsInput] = useState(
    "Panadol 500mg - 1 tab TDS after meals for 5 days\nAmoxicillin 500mg - 1 cap BD with water for 5 days\nORS Sachet - 1 sachet in 1 liter water daily",
  );

  if (!isOpen) return null;

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    try {
      const medsArray = medsInput
        .split("\n")
        .map((l) => l.trim())
        .filter(Boolean)
        .map((line) => {
          const parts = line.split("-").map((p) => p.trim());
          return {
            name: parts[0] || line,
            dosage: parts[1] || "1 unit",
            frequency: parts[1] || "As advised",
            timing: "After meals with plain water",
          };
        });

      const res = await generateVisitSummary({
        patientId: patient?._id,
        clinicalNotes: notes,
        vitals: {
          bp,
          pulse: pulse.includes("bpm") ? pulse : `${pulse} bpm`,
          temp: temp.includes("°F") ? temp : `${temp} °F`,
          weight,
        },
        medications: medsArray,
        nextFollowUp: nextFollowUp || null,
        language: activeTab,
      });

      setSummaryData(res.data);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to generate AI discharge summary.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSendWhatsApp = async () => {
    if (!summaryData) return;
    setSendingNotif(true);
    setNotificationMsg(null);
    try {
      const patientPhone = patient?.phone || summaryData.patientInfo?.phone || "03001234567";
      const res = await sendWhatsAppNotification({
        phone: patientPhone,
        type: "discharge",
        data: {
          patientName: summaryData.patientInfo?.name || patient?.fullName,
          doctorName: summaryData.visitDetails?.doctor || "Attending Physician",
          diagnosis: summaryData.visitDetails?.reason || notes || "Clinical Consultation",
          medications: summaryData.medicationSchedule || [],
          followUpDate: nextFollowUp || summaryData.followUp || "As directed",
          phone: patientPhone,
        },
      });

      setNotificationMsg({
        type: "success",
        text: `WhatsApp alert generated for ${patientPhone}! Opening WhatsApp...`,
      });

      if (res.data?.whatsAppLink) {
        window.open(res.data.whatsAppLink, "_blank");
      }
    } catch (err) {
      setNotificationMsg({
        type: "error",
        text: err.response?.data?.message || "Failed to dispatch WhatsApp alert.",
      });
    } finally {
      setSendingNotif(false);
    }
  };

  const handleSendSms = async () => {
    if (!summaryData) return;
    setSendingNotif(true);
    setNotificationMsg(null);
    try {
      const patientPhone = patient?.phone || summaryData.patientInfo?.phone || "03001234567";
      const message = `SmartClinic Sanghar: Digital discharge slip ready for ${summaryData.patientInfo?.name || patient?.fullName}. Follow-up: ${nextFollowUp || "SOS"}. Helpline: 0235-542100`;
      await sendSmsNotification({
        phone: patientPhone,
        message,
        type: "discharge_sms",
      });
      setNotificationMsg({
        type: "success",
        text: `SMS dispatched successfully to ${patientPhone}!`,
      });
    } catch (err) {
      setNotificationMsg({
        type: "error",
        text: err.response?.data?.message || "Failed to send SMS.",
      });
    } finally {
      setSendingNotif(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-3 md:p-4 backdrop-blur-md print:p-0 print:bg-white print:fixed print:inset-0">
      <div className="flex max-h-[94vh] w-full max-w-4xl flex-col rounded-3xl border border-slate-100 bg-white shadow-2xl overflow-hidden print:max-h-none print:shadow-none print:w-full print:rounded-none dark:border-slate-800 dark:bg-slate-900">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-100 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 px-6 py-4 text-white print:hidden dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur shadow-inner">
              <FiCpu size={22} className="text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold tracking-tight">
                  AI Bilingual Discharge Slip
                </h2>
                <span className="rounded-full bg-emerald-400/30 px-2 py-0.5 text-[10px] font-semibold text-emerald-100 uppercase tracking-wide">
                  Sanghar Regional
                </span>
              </div>
              <p className="text-xs text-blue-100">
                English + Roman Urdu + Sindhi (سنڌي) compliance instructions for
                local patients
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {summaryData && (
              <>
                <button
                  onClick={handleSendWhatsApp}
                  disabled={sendingNotif}
                  className="flex items-center gap-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition disabled:opacity-50"
                  title="Share digital slip via WhatsApp"
                >
                  <FiSend size={13} /> WhatsApp
                </button>
                <button
                  onClick={handleSendSms}
                  disabled={sendingNotif}
                  className="flex items-center gap-1.5 rounded-lg bg-blue-500/80 hover:bg-blue-500 px-2.5 py-1.5 text-xs font-semibold text-white shadow-sm transition disabled:opacity-50"
                  title="Send SMS notification"
                >
                  <FiMessageSquare size={13} /> SMS
                </button>
                <button
                  onClick={handlePrint}
                  className="flex items-center gap-1.5 rounded-lg bg-white/20 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-white/30 transition"
                >
                  <FiPrinter size={14} /> Print Slip
                </button>
              </>
            )}
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-white/80 hover:bg-white/20 hover:text-white transition"
            >
              <FiX size={20} />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 print:p-0 print:overflow-visible">
          {notificationMsg && (
            <div
              className={`flex items-center justify-between rounded-xl p-3 text-xs font-medium print:hidden ${
                notificationMsg.type === "success"
                  ? "bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-emerald-950/40 dark:border-emerald-900/50 dark:text-emerald-300"
                  : "bg-red-50 text-red-800 border border-red-200 dark:bg-red-950/40 dark:border-red-900/50 dark:text-red-300"
              }`}
            >
              <div className="flex items-center gap-2">
                <FiCheckCircle size={15} />
                <span>{notificationMsg.text}</span>
              </div>
              <button
                onClick={() => setNotificationMsg(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <FiX size={14} />
              </button>
            </div>
          )}
          {error && (
            <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300 print:hidden">
              <FiAlertCircle size={18} className="text-red-500 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {!summaryData ? (
            /* Input & Configuration Form */
            <div className="space-y-4">
              <div className="rounded-2xl border border-blue-100 bg-gradient-to-r from-blue-50/70 to-indigo-50/40 p-4 dark:border-blue-900/40 dark:from-blue-950/40 dark:to-indigo-950/30">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="text-sm font-bold text-blue-950 dark:text-blue-200">
                      Patient: {patient?.fullName || "Walk-In Patient"} (
                      {patient?.patientId || "P-N/A"})
                    </p>
                    <p className="text-xs text-blue-700 dark:text-blue-300 mt-0.5">
                      Age: {patient?.computedAge || patient?.age || "N/A"} yrs |
                      Gender: {patient?.gender || "N/A"} | Blood Group:{" "}
                      {patient?.bloodGroup || "Unknown"} | Phone:{" "}
                      {patient?.phone || "N/A"}
                    </p>
                  </div>
                  <span className="rounded-lg bg-blue-600/10 px-2.5 py-1 text-xs font-semibold text-blue-800 dark:bg-blue-500/20 dark:text-blue-300">
                    Sanghar Healthcare District
                  </span>
                </div>
              </div>

              {/* Vitals Grid */}
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5 block">
                  Patient Recorded Vitals
                </label>
                <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4">
                  <div>
                    <label className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                      Blood Pressure
                    </label>
                    <input
                      type="text"
                      value={bp}
                      onChange={(e) => setBp(e.target.value)}
                      placeholder="e.g. 120/80"
                      className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                      Pulse Rate (bpm)
                    </label>
                    <input
                      type="text"
                      value={pulse}
                      onChange={(e) => setPulse(e.target.value)}
                      placeholder="e.g. 76"
                      className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                      Temperature (°F)
                    </label>
                    <input
                      type="text"
                      value={temp}
                      onChange={(e) => setTemp(e.target.value)}
                      placeholder="e.g. 98.6"
                      className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                      Weight
                    </label>
                    <input
                      type="text"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      placeholder="e.g. 68 kg"
                      className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500"
                    />
                  </div>
                </div>
              </div>

              {/* Consultation Notes & Discharge Status */}
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1 block">
                    Doctor Consultation / Clinical Notes
                  </label>
                  <textarea
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Chief symptoms, clinical observations, or examination findings..."
                    className="w-full rounded-xl border border-slate-200 bg-white p-3 text-xs text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1 block">
                    Discharge Disposition &amp; Follow-Up Date
                  </label>
                  <select
                    value={disposition}
                    onChange={(e) => setDisposition(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 mb-2 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                  >
                    <option className="dark:bg-slate-900 dark:text-white">Discharged in Stable Condition (گهر روانگي)</option>
                    <option className="dark:bg-slate-900 dark:text-white">Follow-up Consultation Required (ٻيهر چڪاس)</option>
                    <option className="dark:bg-slate-900 dark:text-white">Referred to District Hospital Sanghar</option>
                    <option className="dark:bg-slate-900 dark:text-white">Routine OPD Consultation Completed</option>
                  </select>
                  <label className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                    Follow-Up Date (Optional)
                  </label>
                  <input
                    type="date"
                    value={nextFollowUp}
                    onChange={(e) => setNextFollowUp(e.target.value)}
                    className="mt-0.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                  />
                </div>
              </div>

              {/* Medications */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Prescribed Medication Regimen (One per line)
                  </label>
                  <span className="text-[11px] text-slate-400 dark:text-slate-500">
                    Format: Medicine Name - Dosage &amp; Frequency
                  </span>
                </div>
                <textarea
                  rows={3}
                  value={medsInput}
                  onChange={(e) => setMedsInput(e.target.value)}
                  placeholder="e.g. Panadol 500mg - 1 tab TDS for 5 days"
                  className="w-full rounded-xl border border-slate-200 bg-white p-3 text-xs font-mono text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500"
                />
              </div>

              {/* Language Default & Submit Button */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
                  <FiGlobe size={15} className="text-indigo-600 dark:text-indigo-400" />
                  <span className="font-medium">Output Languages:</span>
                  <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                    English + Roman Urdu + Sindhi سنڌي
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleGenerate}
                  disabled={loading}
                  className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-500/20 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 transition"
                >
                  <FiCpu size={15} />
                  {loading
                    ? "Generating Multilingual Slip..."
                    : "Generate AI Discharge Slip"}
                </button>
              </div>
            </div>
          ) : (
            /* Printable Multilingual Discharge Slip */
            <div id="printable-slip" className="space-y-5">
              {/* Fallback Banner if Heuristic Viva Mode is Active */}
              {summaryData.isFallback && (
                <div className="rounded-xl border border-amber-200 bg-amber-50 px-3.5 py-2 text-xs text-amber-800 flex items-center justify-between print:hidden dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-300">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
                    <span>
                      Operating in Fail-Safe Heuristic Mode (FYP Viva / Offline
                      failover active)
                    </span>
                  </div>
                  <span className="text-[11px] font-semibold text-amber-700 dark:text-amber-400">
                    100% Deterministic
                  </span>
                </div>
              )}

              {/* Language Filter Tabs (Hidden during print) */}
              <div className="flex flex-wrap items-center gap-1.5 border-b border-slate-200 pb-3 print:hidden dark:border-slate-800">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 mr-1 flex items-center gap-1">
                  <FiGlobe size={13} /> View:
                </span>
                <button
                  onClick={() => setActiveTab("trilingual")}
                  className={`rounded-xl px-2.5 py-1 text-xs font-semibold transition ${
                    activeTab === "trilingual"
                      ? "bg-blue-600 text-white shadow-sm"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                  }`}
                >
                  Trilingual (All 3)
                </button>
                <button
                  onClick={() => setActiveTab("bilingual-sindhi")}
                  className={`rounded-xl px-2.5 py-1 text-xs font-semibold transition ${
                    activeTab === "bilingual-sindhi"
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                  }`}
                >
                  English + Sindhi (سنڌي)
                </button>
                <button
                  onClick={() => setActiveTab("bilingual-urdu")}
                  className={`rounded-xl px-2.5 py-1 text-xs font-semibold transition ${
                    activeTab === "bilingual-urdu"
                      ? "bg-emerald-600 text-white shadow-sm"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                  }`}
                >
                  English + Roman Urdu
                </button>
                <button
                  onClick={() => setActiveTab("sindhi")}
                  className={`rounded-xl px-2.5 py-1 text-xs font-semibold transition ${
                    activeTab === "sindhi"
                      ? "bg-purple-600 text-white shadow-sm"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                  }`}
                >
                  Sindhi سنڌي Only
                </button>
                <button
                  onClick={() => setActiveTab("romanUrdu")}
                  className={`rounded-xl px-2.5 py-1 text-xs font-semibold transition ${
                    activeTab === "romanUrdu"
                      ? "bg-emerald-600 text-white shadow-sm"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                  }`}
                >
                  Roman Urdu Only
                </button>
                <button
                  onClick={() => setActiveTab("english")}
                  className={`rounded-xl px-2.5 py-1 text-xs font-semibold transition ${
                    activeTab === "english"
                      ? "bg-slate-700 text-white shadow-sm"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                  }`}
                >
                  English Only
                </button>
                <button
                  onClick={() => setSummaryData(null)}
                  className="ml-auto text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                >
                  ✏️ Edit Form
                </button>
              </div>

              {/* The Actual Printable Slip Document */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900/90 print:border-0 print:p-2 print:shadow-none">
                {/* Official Healthcare Facility Header */}
                <div className="border-b-2 border-blue-600 pb-4 text-center">
                  <h1 className="text-xl font-black tracking-wide text-slate-900 dark:text-white uppercase">
                    SMART CLINIC &amp; HEALTHCARE CENTER
                  </h1>
                  <p className="text-xs font-medium text-slate-600 dark:text-slate-300 mt-0.5">
                    Sanghar, Sindh, Pakistan | Tel: 0235-542100 | Emergency:
                    0300-1234567
                  </p>
                  <div className="mt-2 inline-block rounded-md bg-blue-50 px-3 py-1 border border-blue-200 dark:border-blue-900/50 dark:bg-blue-950/40">
                    <p className="font-mono text-xs font-bold text-blue-800 dark:text-blue-300 tracking-wider">
                      PATIENT VISIT SUMMARY &amp; MULTILINGUAL DISCHARGE SLIP
                    </p>
                  </div>
                </div>

                {/* Patient & Visit Meta Grid */}
                <div className="mt-4 grid grid-cols-2 gap-4 border-b border-slate-200 pb-4 text-xs dark:border-slate-800">
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                      PATIENT DETAILS
                    </p>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">
                      {summaryData.patientInfo?.name}
                    </p>
                    <p className="text-slate-600 dark:text-slate-400">
                      MRN / ID:{" "}
                      <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">
                        {summaryData.patientInfo?.patientId}
                      </span>
                    </p>
                    <p className="text-slate-600 dark:text-slate-400">
                      Age/Gender:{" "}
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        {summaryData.patientInfo?.age} yrs,{" "}
                        {summaryData.patientInfo?.gender}
                      </span>{" "}
                      | Blood:{" "}
                      <span className="font-semibold text-red-600 dark:text-red-400">
                        {summaryData.patientInfo?.bloodGroup}
                      </span>
                    </p>
                  </div>
                  <div className="text-right space-y-1">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                      VISIT &amp; CLINICIAN
                    </p>
                    <p className="font-semibold text-slate-800 dark:text-slate-200">
                      Date: {summaryData.visitDetails?.date}
                    </p>
                    <p className="text-slate-600 dark:text-slate-400">
                      Physician:{" "}
                      <span className="font-bold text-blue-700 dark:text-blue-400">
                        Dr. {summaryData.visitDetails?.doctor || "Consultant"}
                      </span>
                    </p>
                    <p className="text-slate-600 dark:text-slate-400">
                      Reason: {summaryData.visitDetails?.reason}
                    </p>
                  </div>
                </div>

                {/* Recorded Vitals & Discharge Disposition */}
                <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="rounded-xl bg-slate-50 border border-slate-200/80 p-3 dark:border-slate-800 dark:bg-slate-800/40">
                    <p className="font-bold text-slate-700 dark:text-slate-200 mb-1.5 flex items-center gap-1.5">
                      <FiActivity size={14} className="text-blue-600 dark:text-blue-400" />{" "}
                      Recorded Vital Signs
                    </p>
                    <div className="grid grid-cols-3 gap-2 text-slate-700 dark:text-slate-300 text-xs">
                      <div>
                        BP:{" "}
                        <span className="font-bold text-slate-900 dark:text-white">
                          {summaryData.visitDetails?.vitals?.bp || bp}
                        </span>
                      </div>
                      <div>
                        Pulse:{" "}
                        <span className="font-bold text-slate-900 dark:text-white">
                          {summaryData.visitDetails?.vitals?.pulse || pulse}
                        </span>
                      </div>
                      <div>
                        Temp:{" "}
                        <span className="font-bold text-slate-900 dark:text-white">
                          {summaryData.visitDetails?.vitals?.temp || temp}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-xl bg-blue-50/60 border border-blue-100 p-3 dark:border-blue-900/40 dark:bg-blue-950/30">
                    <p className="font-bold text-blue-900 dark:text-blue-300 mb-1 flex items-center gap-1.5">
                      <FiUserCheck size={14} className="text-blue-600 dark:text-blue-400" />{" "}
                      Discharge Disposition
                    </p>
                    <p className="text-xs font-semibold text-blue-950 dark:text-blue-200">
                      {summaryData.dischargeDetails?.disposition || disposition}
                    </p>
                    {summaryData.dischargeDetails?.activityPrecautions && (
                      <p className="text-[11px] text-blue-800 dark:text-blue-300 mt-1">
                        {summaryData.dischargeDetails.activityPrecautions}
                      </p>
                    )}
                  </div>
                </div>

                {/* Prescribed Medication Schedule */}
                <div className="mt-5">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                      Prescribed Medication Schedule &amp; Timings
                    </p>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 print:hidden">
                      Take strictly with plain water
                    </span>
                  </div>
                  <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-100/80 text-slate-600 font-semibold dark:bg-slate-800/80 dark:text-slate-300">
                        <tr>
                          <th className="p-2.5 w-8">#</th>
                          <th className="p-2.5">Medicine Name</th>
                          <th className="p-2.5">Dosage</th>
                          <th className="p-2.5">Frequency</th>
                          <th className="p-2.5">Duration</th>
                          <th className="p-2.5">
                            Instructions &amp; Regional Timings
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                        {(summaryData.medicationSchedule || []).map(
                          (med, idx) => (
                            <tr key={idx} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors">
                              <td className="p-2.5 font-mono text-slate-400 dark:text-slate-500">
                                {med.index || idx + 1}
                              </td>
                              <td className="p-2.5 font-bold text-slate-900 dark:text-white">
                                {med.name}
                              </td>
                              <td className="p-2.5 font-medium">
                                {med.dosage}
                              </td>
                              <td className="p-2.5 font-semibold text-blue-700 dark:text-blue-400">
                                {med.frequency}
                              </td>
                              <td className="p-2.5">{med.duration}</td>
                              <td className="p-2.5 space-y-0.5">
                                <p className="text-slate-700 dark:text-slate-300">{med.timing}</p>
                                {med.timingSindhi &&
                                  (activeTab.includes("sindhi") ||
                                    activeTab === "trilingual") && (
                                    <p
                                      className="font-semibold text-purple-900 dark:text-purple-300 text-right text-[11px]"
                                      dir="rtl"
                                    >
                                      {med.timingSindhi}
                                    </p>
                                  )}
                                {med.timingUrdu &&
                                  (activeTab.includes("urdu") ||
                                    activeTab === "trilingual") && (
                                    <p className="text-emerald-800 dark:text-emerald-300 text-[11px] font-medium">
                                      {med.timingUrdu}
                                    </p>
                                  )}
                              </td>
                            </tr>
                          ),
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Multilingual Patient Instructions Section */}
                <div className="mt-5 space-y-3">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                    Patient Compliance Instructions (ھدايتون / ہدایات)
                  </p>

                  <div className="grid gap-3 md:grid-cols-1">
                    {/* SINDHI (سنڌي) CARD */}
                    {(activeTab === "sindhi" ||
                      activeTab === "bilingual-sindhi" ||
                      activeTab === "trilingual") && (
                      <div
                        className="rounded-xl border border-purple-200 bg-purple-50/40 p-3.5 text-right dark:border-purple-900/40 dark:bg-purple-950/20"
                        dir="rtl"
                      >
                        <div className="flex items-center justify-between border-b border-purple-200/60 pb-1.5 mb-2 dark:border-purple-900/50">
                          <p className="text-xs font-bold text-purple-950 dark:text-purple-200 font-serif">
                            🌙 مريض لاءِ سنڌي ھدايتون (Sindhi Patient
                            Instructions)
                          </p>
                          <span
                            className="rounded bg-purple-200/70 px-2 py-0.5 text-[10px] font-bold text-purple-900 dark:bg-purple-900/50 dark:text-purple-200 font-sans"
                            dir="ltr"
                          >
                            سنڌي ٻولي
                          </span>
                        </div>
                        <ul className="space-y-1.5 text-xs text-slate-800 dark:text-slate-200 font-medium leading-relaxed">
                          {(summaryData.patientInstructions?.sindhi || []).map(
                            (inst, i) => (
                              <li
                                key={i}
                                className="flex items-start gap-2 justify-start"
                              >
                                <span className="text-purple-600 dark:text-purple-400 font-bold">
                                  •
                                </span>
                                <span>{inst}</span>
                              </li>
                            ),
                          )}
                        </ul>
                        {/* Roman Sindhi Subtext */}
                        {summaryData.patientInstructions?.romanSindhi && (
                          <div
                            className="mt-2.5 pt-2 border-t border-purple-200/40 dark:border-purple-900/40 text-left"
                            dir="ltr"
                          >
                            <p className="text-[10px] font-bold text-purple-800 dark:text-purple-300 uppercase tracking-wider mb-1">
                              Roman Sindhi Guidance:
                            </p>
                            <p className="text-[11px] text-slate-700 dark:text-slate-300 italic leading-snug">
                              {summaryData.patientInstructions.romanSindhi.join(
                                " | ",
                              )}
                            </p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* ROMAN URDU CARD */}
                    {(activeTab === "romanUrdu" ||
                      activeTab === "bilingual-urdu" ||
                      activeTab === "trilingual") && (
                      <div className="rounded-xl border border-emerald-200 bg-emerald-50/40 p-3.5 dark:border-emerald-900/40 dark:bg-emerald-950/20">
                        <div className="flex items-center justify-between border-b border-emerald-200/60 pb-1.5 mb-2 dark:border-emerald-900/50">
                          <p className="text-xs font-bold text-emerald-950 dark:text-emerald-200">
                            🌿 Roman Urdu Hidayat (ہدایات برائے مریض)
                          </p>
                          <span className="rounded bg-emerald-200/70 px-2 py-0.5 text-[10px] font-bold text-emerald-900 dark:bg-emerald-900/50 dark:text-emerald-200">
                            Roman Urdu
                          </span>
                        </div>
                        <ul className="space-y-1 text-xs text-slate-800 dark:text-slate-200 leading-snug">
                          {(
                            summaryData.patientInstructions?.romanUrdu || []
                          ).map((inst, i) => (
                            <li key={i} className="flex items-start gap-1.5">
                              <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                                •
                              </span>
                              <span>{inst}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* ENGLISH CARD */}
                    {(activeTab === "english" ||
                      activeTab === "bilingual-sindhi" ||
                      activeTab === "bilingual-urdu" ||
                      activeTab === "trilingual") && (
                      <div className="rounded-xl border border-blue-200 bg-blue-50/40 p-3.5 dark:border-blue-900/40 dark:bg-blue-950/20">
                        <div className="flex items-center justify-between border-b border-blue-200/60 pb-1.5 mb-2 dark:border-blue-900/50">
                          <p className="text-xs font-bold text-blue-950 dark:text-blue-200">
                            📋 English Clinical Instructions
                          </p>
                          <span className="rounded bg-blue-200/70 px-2 py-0.5 text-[10px] font-bold text-blue-900 dark:bg-blue-900/50 dark:text-blue-200">
                            English
                          </span>
                        </div>
                        <ul className="space-y-1 text-xs text-slate-800 dark:text-slate-200 leading-snug">
                          {(summaryData.patientInstructions?.english || []).map(
                            (inst, i) => (
                              <li key={i} className="flex items-start gap-1.5">
                                <span className="text-blue-500 dark:text-blue-400 font-bold">
                                  •
                                </span>
                                <span>{inst}</span>
                              </li>
                            ),
                          )}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>

                {/* Follow-up & Clinic Emergency Notice */}
                <div className="mt-4 flex flex-wrap items-center justify-between gap-2 rounded-xl bg-slate-100 p-3 text-xs dark:border dark:border-slate-800 dark:bg-slate-800/50">
                  <div className="flex items-center gap-2">
                    <FiClock size={16} className="text-blue-600 dark:text-blue-400" />
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      Next Follow-Up Appointment:
                    </span>
                    <span className="font-bold text-blue-800 dark:text-blue-300">
                      {summaryData.followUp || "As needed / SOS"}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                    Sanghar Helpline:{" "}
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      0235-542100
                    </span>
                  </div>
                </div>

                {/* Signatures & Official Validation Block */}
                <div className="mt-8 pt-4 border-t border-slate-200 dark:border-slate-800 grid grid-cols-2 gap-8 text-xs text-slate-600 dark:text-slate-400">
                  <div>
                    <div className="h-10 border-b border-dashed border-slate-400 dark:border-slate-600 w-48 mb-1" />
                    <p className="font-bold text-slate-800 dark:text-slate-200">
                      Attending Physician Signature &amp; Stamp
                    </p>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500">
                      Dr. {summaryData.visitDetails?.doctor || "Consultant"}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="h-10 border-b border-dashed border-slate-400 dark:border-slate-600 w-48 ml-auto mb-1" />
                    <p className="font-bold text-slate-800 dark:text-slate-200">
                      Pharmacy Dispensing Verification
                    </p>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500">
                      SmartClinic Regional Center, Sanghar
                    </p>
                  </div>
                </div>

                {/* Administrative Disclaimer */}
                <div className="mt-4 text-center text-[10px] text-slate-400 dark:text-slate-500 border-t border-slate-100 dark:border-slate-800 pt-2">
                  {summaryData.administrativeNotice ||
                    "This document is an administrative visit summary, compliance guide, and discharge slip for Sanghar regional healthcare facilities. It does NOT alter direct medical orders."}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AiVisitSummaryModal;
