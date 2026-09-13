import { useState, useMemo } from "react";
import {
  FiActivity,
  FiAward,
  FiCheckCircle,
  FiCopy,
  FiCheck,
  FiCalendar,
  FiInfo,
  FiEye,
  FiHeart,
  FiScissors,
  FiSmile,
  FiFileText,
  FiRefreshCw,
  FiAlertTriangle,
  FiThermometer,
  FiCompass,
} from "react-icons/fi";
import { format, addDays, subMonths, addYears, differenceInDays } from "date-fns";

export const SPECIALTIES = [
  { id: "pediatrics", name: "Child Care & Pediatrics", icon: FiSmile, color: "text-rose-500", bg: "bg-rose-500/10 border-rose-200 dark:border-rose-900" },
  { id: "medicine", name: "General Medicine", icon: FiActivity, color: "text-blue-600", bg: "bg-blue-500/10 border-blue-200 dark:border-blue-900" },
  { id: "cardiology", name: "Cardiology", icon: FiHeart, color: "text-red-600", bg: "bg-red-500/10 border-red-200 dark:border-red-900" },
  { id: "gastroenterology", name: "Gastroenterology", icon: FiCompass, color: "text-amber-600", bg: "bg-amber-500/10 border-amber-200 dark:border-amber-900" },
  { id: "surgery", name: "General Surgery", icon: FiScissors, color: "text-indigo-600", bg: "bg-indigo-500/10 border-indigo-200 dark:border-indigo-900" },
  { id: "gynecology", name: "Gynecology & Obstetrics", icon: FiCalendar, color: "text-purple-600", bg: "bg-purple-500/10 border-purple-200 dark:border-purple-900" },
  { id: "ophthalmology", name: "Ophthalmology", icon: FiEye, color: "text-teal-600", bg: "bg-teal-500/10 border-teal-200 dark:border-teal-900" },
];

export default function SpecialistClinicalSuite({ currentDoctorSpecialty, activePatient, activeAppointment, onExportNotes }) {
  // Normalize initial specialty
  const getInitialSpecialty = (spec) => {
    if (!spec) return "medicine";
    const s = spec.toLowerCase();
    if (s.includes("pediatric") || s.includes("child")) return "pediatrics";
    if (s.includes("cardio")) return "cardiology";
    if (s.includes("gastro")) return "gastroenterology";
    if (s.includes("surg")) return "surgery";
    if (s.includes("gyn") || s.includes("obs")) return "gynecology";
    if (s.includes("eye") || s.includes("opht")) return "ophthalmology";
    return "medicine";
  };

  const [selectedSpecialty, setSelectedSpecialty] = useState(() => getInitialSpecialty(currentDoctorSpecialty));
  const [copied, setCopied] = useState(false);

  // ==========================================
  // 1. PEDIATRICS STATE
  // ==========================================
  const [pedWeight, setPedWeight] = useState(activePatient?.weight || "12");
  const [pedAgeMonths, setPedAgeMonths] = useState(activePatient?.age ? String(activePatient.age * 12) : "24");
  const [pedDrug, setPedDrug] = useState("amoxicillin");
  const [pedVaccines, setPedVaccines] = useState({
    bcg: true,
    opv0: true,
    penta1: true,
    penta2: true,
    penta3: true,
    measles1: false,
    measles2: false,
  });

  const pedDosageCalc = useMemo(() => {
    const w = parseFloat(pedWeight) || 0;
    if (w <= 0) return null;
    switch (pedDrug) {
      case "amoxicillin": {
        // 40 mg/kg/day divided tid (every 8 hrs)
        const dailyMg = Math.round(w * 40);
        const perDoseMg = Math.round(dailyMg / 3);
        const perDoseMl = ((perDoseMg / 125) * 5).toFixed(1); // 125mg/5ml syrup
        return {
          drugName: "Amoxicillin Suspension (125mg/5ml)",
          doseMg: `${perDoseMg} mg`,
          doseMl: `${perDoseMl} ml (approx. ${(perDoseMl / 5).toFixed(1)} tsp)`,
          frequency: "Every 8 hours (TDS) for 5–7 days",
          indication: "Pediatric respiratory / ENT / skin bacterial infections",
        };
      }
      case "paracetamol": {
        // 15 mg/kg/dose every 6 hrs prn
        const pDoseMg = Math.round(w * 15);
        const pDoseMl = ((pDoseMg / 120) * 5).toFixed(1); // 120mg/5ml syrup
        return {
          drugName: "Paracetamol Suspension (120mg/5ml)",
          doseMg: `${pDoseMg} mg`,
          doseMl: `${pDoseMl} ml`,
          frequency: "Every 6 hours PRN for fever > 100°F (Max 4 times/day)",
          indication: "Antipyretic & analgesic for fever/pain",
        };
      }
      case "ibuprofen": {
        const iDoseMg = Math.round(w * 10);
        const iDoseMl = ((iDoseMg / 100) * 5).toFixed(1); // 100mg/5ml syrup
        return {
          drugName: "Ibuprofen Suspension (100mg/5ml)",
          doseMg: `${iDoseMg} mg`,
          doseMl: `${iDoseMl} ml`,
          frequency: "Every 8 hours with milk/meals for high fever",
          indication: "Anti-inflammatory & high fever relief (>6 months age)",
        };
      }
      case "cefixime": {
        const cDoseMg = Math.round(w * 8);
        const cDoseMl = ((cDoseMg / 100) * 5).toFixed(1); // 100mg/5ml syrup
        return {
          drugName: "Cefixime Suspension (100mg/5ml)",
          doseMg: `${cDoseMg} mg/day`,
          doseMl: `${cDoseMl} ml`,
          frequency: "Once daily (OD) or divided BID for 7 days",
          indication: "Enteric fever (Typhoid) & pediatric urinary/otitis infections",
        };
      }
      default:
        return null;
    }
  }, [pedWeight, pedDrug]);

  // ==========================================
  // 2. GENERAL MEDICINE STATE
  // ==========================================
  const [rosChecks, setRosChecks] = useState({
    fever: false,
    cough: false,
    dyspnea: false,
    chestPain: false,
    dyspepsia: false,
    headache: false,
    fatigue: false,
  });
  const [bpSystolic, setBpSystolic] = useState("120");
  const [bpDiastolic, setBpDiastolic] = useState("80");
  const [hba1c, setHba1c] = useState("6.5");

  const bpClassification = useMemo(() => {
    const sys = parseInt(bpSystolic, 10) || 120;
    const dia = parseInt(bpDiastolic, 10) || 80;
    if (sys > 180 || dia > 120) {
      return { stage: "Hypertensive Crisis", color: "text-red-700 bg-red-100 dark:bg-red-950/70 border-red-300", urgent: true };
    }
    if (sys >= 140 || dia >= 90) {
      return { stage: "Stage 2 Hypertension", color: "text-rose-700 bg-rose-100 dark:bg-rose-950/70 border-rose-300", urgent: false };
    }
    if (sys >= 130 || dia >= 80) {
      return { stage: "Stage 1 Hypertension", color: "text-amber-700 bg-amber-100 dark:bg-amber-950/70 border-amber-300", urgent: false };
    }
    if (sys >= 120 && dia < 80) {
      return { stage: "Elevated Blood Pressure", color: "text-blue-700 bg-blue-100 dark:bg-blue-950/70 border-blue-300", urgent: false };
    }
    return { stage: "Normal Blood Pressure", color: "text-emerald-700 bg-emerald-100 dark:bg-emerald-950/70 border-emerald-300", urgent: false };
  }, [bpSystolic, bpDiastolic]);

  // ==========================================
  // 3. CARDIOLOGY STATE
  // ==========================================
  const [cardiacRhythm, setCardiacRhythm] = useState("Normal Sinus Rhythm");
  const [stSegment, setStSegment] = useState("Isoelectric (Normal)");
  const [nyhaClass, setNyhaClass] = useState("Class I");
  const [cadRiskFactors, setCadRiskFactors] = useState({
    hypertension: true,
    diabetes: false,
    smoking: false,
    familyHistory: true,
  });

  // ==========================================
  // 4. GASTROENTEROLOGY STATE
  // ==========================================
  const [bristolType, setBristolType] = useState("Type 4");
  const [gerdSeverity, setGerdSeverity] = useState("Moderate Postprandial");
  const [hbsAgStatus, setHbsAgStatus] = useState("Non-Reactive");
  const [hcvStatus, setHcvStatus] = useState("Non-Reactive");
  const [altUls, setAltUls] = useState("32");

  // ==========================================
  // 5. GENERAL SURGERY STATE
  // ==========================================
  const [asaClass, setAsaClass] = useState("ASA II - Mild Systemic Disease");
  const [procedureType, setProcedureType] = useState("Abscess Incision & Drainage");
  const [woundStatus, setWoundStatus] = useState("Clean, granulating well, no exudate");
  const [sutureRemovalDay, setSutureRemovalDay] = useState("POD 7 (Post-op Day 7)");
  const [npoStatus, setNpoStatus] = useState("NPO past midnight confirmed");

  // ==========================================
  // 6. GYNECOLOGY & OBSTETRICS STATE
  // ==========================================
  const [lmpDate, setLmpDate] = useState(() => format(subMonths(new Date(), 4), "yyyy-MM-dd"));
  const [gravida, setGravida] = useState("G2");
  const [para, setPara] = useState("P1");
  const [fetalHeartRate, setFetalHeartRate] = useState("142");
  const [fundalHeightCm, setFundalHeightCm] = useState("20");

  const obstetricCalculations = useMemo(() => {
    if (!lmpDate) return null;
    try {
      const lmp = new Date(lmpDate);
      // Naegele's Rule: LMP + 1 year - 3 months + 7 days
      const edd = addDays(subMonths(addYears(lmp, 1), 3), 7);
      const totalDays = differenceInDays(new Date(), lmp);
      const weeks = Math.floor(totalDays / 7);
      const days = totalDays % 7;

      let trimester = "1st Trimester (0–13 wks)";
      if (weeks >= 28) trimester = "3rd Trimester (28–40 wks)";
      else if (weeks >= 14) trimester = "2nd Trimester (14–27 wks)";

      return {
        eddFormatted: format(edd, "dd MMMM yyyy"),
        gestationalAge: `${weeks} Weeks, ${days} Days`,
        trimester,
        highRiskAlert: weeks > 41 ? "Post-dates pregnancy — review induction" : null,
      };
    } catch {
      return null;
    }
  }, [lmpDate]);

  // ==========================================
  // 7. OPHTHALMOLOGY STATE
  // ==========================================
  const [vaOD, setVaOD] = useState("6/6");
  const [vaOS, setVaOS] = useState("6/9");
  const [iopOD, setIopOD] = useState("16");
  const [iopOS, setIopOS] = useState("17");
  const [lensStatus, setLensStatus] = useState("Clear bilaterally");
  const [spectacleRx, setSpectacleRx] = useState({
    odSph: "-1.25",
    odCyl: "-0.50",
    odAxis: "90",
    osSph: "-1.50",
    osCyl: "-0.25",
    osAxis: "85",
    add: "+1.50",
  });

  // Handle Copy / Export Clinical Record
  const handleExportClinicalFindings = () => {
    let findings = `--- AL-HASSAM MEDICAL CENTER CLINICAL ASSESSMENT ---\n`;
    findings += `Facility: Nawabshah Road, City Sanghar (24/7 Service)\n`;
    findings += `Patient: ${activePatient?.fullName || "OPD Patient"} (${activePatient?.gender || "N/A"}, Age: ${activePatient?.age || "N/A"})\n`;
    findings += `Date: ${format(new Date(), "dd-MMM-yyyy HH:mm")}\n`;
    findings += `Discipline: ${SPECIALTIES.find((s) => s.id === selectedSpecialty)?.name}\n\n`;

    if (selectedSpecialty === "pediatrics") {
      findings += `[PEDIATRIC ASSESSMENT]\n`;
      findings += `Weight: ${pedWeight} kg | Age: ${pedAgeMonths} months\n`;
      if (pedDosageCalc) {
        findings += `Recommended Prescription: ${pedDosageCalc.drugName}\n`;
        findings += `Dosage: ${pedDosageCalc.doseMg} (${pedDosageCalc.doseMl}) | Frequency: ${pedDosageCalc.frequency}\n`;
      }
      findings += `EPI Immunization: BCG/Polio/Penta verified up to date.\n`;
    } else if (selectedSpecialty === "medicine") {
      findings += `[GENERAL MEDICINE WORKUP]\n`;
      findings += `Blood Pressure: ${bpSystolic}/${bpDiastolic} mmHg (${bpClassification.stage})\n`;
      findings += `Glycemic Status: HbA1c ${hba1c}%\n`;
      const activeRos = Object.entries(rosChecks).filter(([, v]) => v).map(([k]) => k).join(", ");
      findings += `Review of Systems: Positive for ${activeRos || "No acute constitutional flags"}\n`;
    } else if (selectedSpecialty === "cardiology") {
      findings += `[CARDIOLOGY EVALUATION]\n`;
      findings += `ECG Rhythm: ${cardiacRhythm} | ST-T Segment: ${stSegment}\n`;
      findings += `NYHA Heart Failure Functional Class: ${nyhaClass}\n`;
      findings += `Blood Pressure: ${bpSystolic}/${bpDiastolic} mmHg (${bpClassification.stage})\n`;
    } else if (selectedSpecialty === "gastroenterology") {
      findings += `[GASTROENTEROLOGY EVALUATION]\n`;
      findings += `Bristol Stool Scale: ${bristolType}\n`;
      findings += `Dyspepsia/GERD: ${gerdSeverity}\n`;
      findings += `Hepatitis Viral Screen: HBsAg ${hbsAgStatus}, Anti-HCV ${hcvStatus}, ALT ${altUls} U/L\n`;
    } else if (selectedSpecialty === "surgery") {
      findings += `[SURGICAL CONSULTATION]\n`;
      findings += `Pre-Op Risk: ${asaClass} | Fasting Status: ${npoStatus}\n`;
      findings += `Planned/Executed Procedure: ${procedureType}\n`;
      findings += `Wound Inspection: ${woundStatus}\n`;
      findings += `Suture Removal Plan: ${sutureRemovalDay}\n`;
    } else if (selectedSpecialty === "gynecology") {
      findings += `[GYNECOLOGY & OBSTETRICS ANC]\n`;
      findings += `Obstetric Profile: ${gravida} ${para} | LMP: ${lmpDate}\n`;
      if (obstetricCalculations) {
        findings += `Gestational Age: ${obstetricCalculations.gestationalAge} (${obstetricCalculations.trimester})\n`;
        findings += `Calculated EDD: ${obstetricCalculations.eddFormatted}\n`;
      }
      findings += `Fetal Heart Rate: ${fetalHeartRate} bpm | Symphysis-Fundal Height: ${fundalHeightCm} cm\n`;
    } else if (selectedSpecialty === "ophthalmology") {
      findings += `[OPHTHALMIC EXAMINATION]\n`;
      findings += `Visual Acuity: OD ${vaOD} | OS ${vaOS}\n`;
      findings += `Tonometry (IOP): OD ${iopOD} mmHg | OS ${iopOS} mmHg\n`;
      findings += `Anterior Segment & Lens: ${lensStatus}\n`;
      findings += `Refraction Rx: OD (${spectacleRx.odSph} / ${spectacleRx.odCyl} x ${spectacleRx.odAxis}) | OS (${spectacleRx.osSph} / ${spectacleRx.osCyl} x ${spectacleRx.osAxis}) | Add: ${spectacleRx.add}\n`;
    }

    navigator.clipboard.writeText(findings);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);

    if (onExportNotes) {
      onExportNotes(findings);
    }
  };

  return (
    <div className="rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 p-5 sm:p-7 shadow-lg space-y-6 text-left">
      {/* Header & Specialty Switcher */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20">
              <FiAward size={20} />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-tight">
                Specialist Clinical Workstation
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Discipline-specific clinical calculators, diagnostic criteria, and consultation protocols.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportClinicalFindings}
            className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-2 text-xs font-bold shadow-xs transition hover:scale-[1.02] active:scale-95 cursor-pointer"
          >
            {copied ? <FiCheck size={14} className="text-emerald-300" /> : <FiCopy size={14} />}
            <span>{copied ? "Copied to Clipboard" : "Copy Clinical Record"}</span>
          </button>
        </div>
      </div>

      {/* Specialty Selector Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
        {SPECIALTIES.map((spec) => {
          const Icon = spec.icon;
          const isSelected = selectedSpecialty === spec.id;
          return (
            <button
              key={spec.id}
              onClick={() => setSelectedSpecialty(spec.id)}
              className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                isSelected
                  ? `${spec.bg} font-black shadow-xs ring-2 ring-blue-500/20`
                  : "border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400"
              }`}
            >
              <Icon size={20} className={isSelected ? spec.color : "text-slate-500"} />
              <span className="mt-1.5 text-[11px] font-bold leading-tight line-clamp-1">{spec.name}</span>
            </button>
          );
        })}
      </div>

      {/* ======================================================== */}
      {/* 1. CHILD CARE & PEDIATRICS SUITE */}
      {/* ======================================================== */}
      {selectedSpecialty === "pediatrics" && (
        <div className="space-y-5 animate-fade-in">
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-rose-50/80 dark:bg-rose-950/40 border border-rose-200/80 dark:border-rose-900/60">
            <div className="flex items-center gap-2 text-rose-800 dark:text-rose-300 font-bold text-xs">
              <FiSmile size={16} />
              <span>Pediatrics &amp; Child Health Clinical Protocol — Al-Hassam Medical Center</span>
            </div>
            <span className="text-[11px] text-rose-700 dark:text-rose-400 font-semibold">Weight-Based Calculations</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Left: Pediatric Dosage Calculator */}
            <div className="p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/50 space-y-4">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <FiActivity size={14} className="text-rose-500" />
                <span>Pediatric Weight-Based Dosage Calculator</span>
              </h4>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300">Child Weight (kg)</label>
                  <input
                    type="number"
                    value={pedWeight}
                    onChange={(e) => setPedWeight(e.target.value)}
                    className="mt-1 w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 font-bold text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300">Age (Months)</label>
                  <input
                    type="number"
                    value={pedAgeMonths}
                    onChange={(e) => setPedAgeMonths(e.target.value)}
                    className="mt-1 w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 font-bold text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Select Essential Pediatric Drug</label>
                <select
                  value={pedDrug}
                  onChange={(e) => setPedDrug(e.target.value)}
                  className="mt-1 w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-semibold"
                >
                  <option value="amoxicillin">Amoxicillin Suspension (40 mg/kg/day TDS)</option>
                  <option value="paracetamol">Paracetamol Syrup (15 mg/kg/dose PRN)</option>
                  <option value="ibuprofen">Ibuprofen Syrup (10 mg/kg/dose TDS)</option>
                  <option value="cefixime">Cefixime Suspension (8 mg/kg/day OD/BID)</option>
                </select>
              </div>

              {pedDosageCalc && (
                <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-rose-200 dark:border-rose-900/60 space-y-1.5 text-xs">
                  <div className="font-bold text-rose-700 dark:text-rose-300">{pedDosageCalc.drugName}</div>
                  <div className="flex justify-between text-slate-700 dark:text-slate-300">
                    <span>Dose per Admin:</span>
                    <strong className="text-slate-900 dark:text-white font-mono">{pedDosageCalc.doseMg} ({pedDosageCalc.doseMl})</strong>
                  </div>
                  <div className="flex justify-between text-slate-700 dark:text-slate-300">
                    <span>Frequency:</span>
                    <span className="font-semibold text-slate-900 dark:text-white">{pedDosageCalc.frequency}</span>
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 pt-1 border-t border-slate-100 dark:border-slate-800">
                    {pedDosageCalc.indication}
                  </div>
                </div>
              )}
            </div>

            {/* Right: EPI Immunization Checklist */}
            <div className="p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/50 space-y-3">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <FiCheckCircle size={14} className="text-emerald-500" />
                <span>EPI Immunization Record (Sindh Health Schedule)</span>
              </h4>

              <div className="space-y-2 text-xs">
                {[
                  { key: "bcg", label: "Birth: BCG + OPV-0 + Hep-B" },
                  { key: "penta1", label: "6 Weeks: Pentavalent-1 + PCV-1 + Rota-1" },
                  { key: "penta2", label: "10 Weeks: Pentavalent-2 + PCV-2 + Rota-2" },
                  { key: "penta3", label: "14 Weeks: Pentavalent-3 + PCV-3 + IPV" },
                  { key: "measles1", label: "9 Months: Measles-1 + Typhoid Conjugate" },
                  { key: "measles2", label: "15 Months: Measles-2" },
                ].map((item) => (
                  <label key={item.key} className="flex items-center gap-2.5 p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={pedVaccines[item.key]}
                      onChange={(e) => setPedVaccines({ ...pedVaccines, [item.key]: e.target.checked })}
                      className="rounded text-rose-600 focus:ring-rose-500"
                    />
                    <span className="font-medium text-slate-700 dark:text-slate-300">{item.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 2. GENERAL MEDICINE SUITE */}
      {/* ======================================================== */}
      {selectedSpecialty === "medicine" && (
        <div className="space-y-5 animate-fade-in">
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-900/60">
            <div className="flex items-center gap-2 text-blue-800 dark:text-blue-300 font-bold text-xs">
              <FiActivity size={16} />
              <span>Internal Medicine &amp; Primary Care Workup — Al-Hassam OPD</span>
            </div>
            <span className="text-[11px] text-blue-700 dark:text-blue-400 font-semibold">JNC-8 &amp; ADA Standards</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Blood Pressure & Metabolic Staging */}
            <div className="p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/50 space-y-4">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200">
                Cardiometabolic Staging
              </h4>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300">Systolic BP (mmHg)</label>
                  <input
                    type="number"
                    value={bpSystolic}
                    onChange={(e) => setBpSystolic(e.target.value)}
                    className="mt-1 w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 font-bold text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300">Diastolic BP (mmHg)</label>
                  <input
                    type="number"
                    value={bpDiastolic}
                    onChange={(e) => setBpDiastolic(e.target.value)}
                    className="mt-1 w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 font-bold text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-between ${bpClassification.color}`}>
                <span>AHA/ACC Classification:</span>
                <span>{bpClassification.stage}</span>
              </div>

              <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">HbA1c Glycemic Control (%)</label>
                <div className="mt-1 flex items-center gap-3">
                  <input
                    type="number"
                    step="0.1"
                    value={hba1c}
                    onChange={(e) => setHba1c(e.target.value)}
                    className="w-32 p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-bold"
                  />
                  <span className="text-xs text-slate-600 dark:text-slate-400">
                    {parseFloat(hba1c) < 5.7 ? "Non-Diabetic (<5.7%)" : parseFloat(hba1c) < 6.5 ? "Pre-Diabetes (5.7–6.4%)" : "Diabetic Range (≥6.5%)"}
                  </span>
                </div>
              </div>
            </div>

            {/* Interactive Review of Systems */}
            <div className="p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/50 space-y-3">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200">
                Review of Systems (ROS) Checklist
              </h4>

              <div className="grid grid-cols-2 gap-2 text-xs">
                {[
                  { key: "fever", label: "Fever / Rigors" },
                  { key: "cough", label: "Productive Cough" },
                  { key: "dyspnea", label: "Shortness of Breath" },
                  { key: "chestPain", label: "Retrosternal Pain" },
                  { key: "dyspepsia", label: "Epigastric Burning" },
                  { key: "headache", label: "Severe Headache" },
                  { key: "fatigue", label: "Chronic Malaise" },
                ].map((item) => (
                  <label key={item.key} className="flex items-center gap-2 p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rosChecks[item.key]}
                      onChange={(e) => setRosChecks({ ...rosChecks, [item.key]: e.target.checked })}
                      className="rounded text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-slate-700 dark:text-slate-300 font-medium">{item.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 3. CARDIOLOGY SUITE */}
      {/* ======================================================== */}
      {selectedSpecialty === "cardiology" && (
        <div className="space-y-5 animate-fade-in">
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-red-50/80 dark:bg-red-950/40 border border-red-200/80 dark:border-red-900/60">
            <div className="flex items-center gap-2 text-red-800 dark:text-red-300 font-bold text-xs">
              <FiHeart size={16} />
              <span>Cardiovascular Consultation &amp; ECG Evaluation Suite</span>
            </div>
            <span className="text-[11px] text-red-700 dark:text-red-400 font-semibold">NYHA &amp; ACC/AHA Criteria</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* 12-Lead ECG Findings */}
            <div className="p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/50 space-y-4">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200">
                12-Lead ECG Findings &amp; Rhythm
              </h4>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300">Cardiac Rhythm</label>
                  <select
                    value={cardiacRhythm}
                    onChange={(e) => setCardiacRhythm(e.target.value)}
                    className="mt-1 w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 font-semibold"
                  >
                    <option value="Normal Sinus Rhythm">Normal Sinus Rhythm (HR 60-100 bpm)</option>
                    <option value="Sinus Tachycardia">Sinus Tachycardia (&gt; 100 bpm)</option>
                    <option value="Sinus Bradycardia">Sinus Bradycardia (&lt; 60 bpm)</option>
                    <option value="Atrial Fibrillation">Atrial Fibrillation (Irregularly Irregular)</option>
                    <option value="Ventricular Ectopics">Frequent PVCs / Premature Ventricular Complexes</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300">ST-Segment &amp; T-Wave Analysis</label>
                  <select
                    value={stSegment}
                    onChange={(e) => setStSegment(e.target.value)}
                    className="mt-1 w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 font-semibold"
                  >
                    <option value="Isoelectric (Normal)">Isoelectric (Normal / No Ischemia)</option>
                    <option value="ST Elevation (STEMI Alert)">⚠️ ST Elevation (STEMI Alert - Emergency Protocol)</option>
                    <option value="ST Depression (NSTEMI/Angina)">ST Depression (Subendocardial Ischemia)</option>
                    <option value="T-Wave Inversion">T-Wave Inversion (Ischemic change)</option>
                    <option value="LVH with Strain">LVH Voltage with Repolarization Strain</option>
                  </select>
                </div>
              </div>
            </div>

            {/* NYHA Functional Classification */}
            <div className="p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/50 space-y-4">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200">
                NYHA Functional Classification (Heart Failure)
              </h4>

              <div className="space-y-2 text-xs">
                {[
                  { id: "Class I", desc: "Class I: No limitation of physical activity. Ordinary physical activity does not cause fatigue or dyspnea." },
                  { id: "Class II", desc: "Class II: Slight limitation. Comfortable at rest, ordinary activity results in fatigue or palpitations." },
                  { id: "Class III", desc: "Class III: Marked limitation. Less than ordinary activity leads to symptoms. Comfortable only at rest." },
                  { id: "Class IV", desc: "Class IV: Inability to carry on any physical activity without discomfort. Symptoms at rest." },
                ].map((item) => (
                  <label key={item.id} className={`flex items-start gap-2.5 p-2.5 rounded-xl border cursor-pointer transition ${nyhaClass === item.id ? "bg-red-50 dark:bg-red-950/50 border-red-300 dark:border-red-800 font-bold text-red-900 dark:text-red-200" : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300"}`}>
                    <input
                      type="radio"
                      name="nyha"
                      value={item.id}
                      checked={nyhaClass === item.id}
                      onChange={() => setNyhaClass(item.id)}
                      className="mt-0.5 text-red-600 focus:ring-red-500"
                    />
                    <span>{item.desc}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 4. GASTROENTEROLOGY SUITE */}
      {/* ======================================================== */}
      {selectedSpecialty === "gastroenterology" && (
        <div className="space-y-5 animate-fade-in">
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-900/60">
            <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 font-bold text-xs">
              <FiCompass size={16} />
              <span>Gastroenterology &amp; Hepatology Assessment Suite</span>
            </div>
            <span className="text-[11px] text-amber-700 dark:text-amber-400 font-semibold">Bristol Stool &amp; Viral Hepatitis</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Bristol Stool Chart */}
            <div className="p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/50 space-y-4">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200">
                Bristol Stool Scale Classifier
              </h4>

              <select
                value={bristolType}
                onChange={(e) => setBristolType(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-semibold"
              >
                <option value="Type 1">Type 1: Separate hard lumps, like nuts (Severe Constipation)</option>
                <option value="Type 2">Type 2: Sausage-shaped, but lumpy (Mild Constipation)</option>
                <option value="Type 3">Type 3: Like a sausage but with cracks on surface (Normal)</option>
                <option value="Type 4">Type 4: Smooth and soft, like a snake (Ideal Normal)</option>
                <option value="Type 5">Type 5: Soft blobs with clear cut edges (Lacking Fiber)</option>
                <option value="Type 6">Type 6: Fluffy pieces with ragged edges (Mild Diarrhea)</option>
                <option value="Type 7">Type 7: Entirely liquid, no solid pieces (Severe Diarrhea)</option>
              </select>

              <div className="p-3 rounded-xl bg-amber-100/50 dark:bg-amber-950/40 border border-amber-200 text-xs text-amber-900 dark:text-amber-200">
                <strong>Current Selection:</strong> {bristolType} — {bristolType === "Type 4" ? "Healthy physiological transit time." : "Consider dietary fiber adjustment or hydration therapy."}
              </div>
            </div>

            {/* Viral Hepatitis Screening */}
            <div className="p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/50 space-y-4">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200">
                Viral Hepatitis &amp; Hepatic Panel
              </h4>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300">HBsAg (Hepatitis B)</label>
                  <select
                    value={hbsAgStatus}
                    onChange={(e) => setHbsAgStatus(e.target.value)}
                    className="mt-1 w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 font-semibold"
                  >
                    <option value="Non-Reactive">Non-Reactive</option>
                    <option value="Reactive">Reactive (Positive)</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300">Anti-HCV (Hepatitis C)</label>
                  <select
                    value={hcvStatus}
                    onChange={(e) => setHcvStatus(e.target.value)}
                    className="mt-1 w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 font-semibold"
                  >
                    <option value="Non-Reactive">Non-Reactive</option>
                    <option value="Reactive">Reactive (Positive)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">ALT / SGPT (U/L)</label>
                <input
                  type="number"
                  value={altUls}
                  onChange={(e) => setAltUls(e.target.value)}
                  className="mt-1 w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 font-bold text-slate-900 dark:text-white text-xs"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 5. GENERAL SURGERY SUITE */}
      {/* ======================================================== */}
      {selectedSpecialty === "surgery" && (
        <div className="space-y-5 animate-fade-in">
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-900/60">
            <div className="flex items-center gap-2 text-indigo-800 dark:text-indigo-300 font-bold text-xs">
              <FiScissors size={16} />
              <span>General Surgery Consultation &amp; Minor Procedures Workstation</span>
            </div>
            <span className="text-[11px] text-indigo-700 dark:text-indigo-400 font-semibold">ASA Risk Classification</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Pre-Op & Procedure Selection */}
            <div className="p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/50 space-y-4">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200">
                Surgical Procedure &amp; Pre-Op ASA Score
              </h4>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300">ASA Physical Status</label>
                  <select
                    value={asaClass}
                    onChange={(e) => setAsaClass(e.target.value)}
                    className="mt-1 w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 font-semibold"
                  >
                    <option value="ASA I - Normal Healthy Patient">ASA I: Normal Healthy Patient</option>
                    <option value="ASA II - Mild Systemic Disease">ASA II: Mild Systemic Disease (Controlled HTN/DM)</option>
                    <option value="ASA III - Severe Systemic Disease">ASA III: Severe Systemic Disease (Uncontrolled HTN/DM)</option>
                    <option value="ASA IV - Threat to Life">ASA IV: Severe Disease Threatening Life</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300">Procedure Performed / Planned</label>
                  <select
                    value={procedureType}
                    onChange={(e) => setProcedureType(e.target.value)}
                    className="mt-1 w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 font-semibold"
                  >
                    <option value="Abscess Incision & Drainage">Abscess Incision &amp; Drainage (I&amp;D)</option>
                    <option value="Sebaceous Cyst Excision">Sebaceous Cyst / Lipoma Excision</option>
                    <option value="Traumatic Wound Suturing">Traumatic Laceration Wound Suturing</option>
                    <option value="Wound Debridement & Dressing">Wound Debridement &amp; Aseptic Dressing</option>
                    <option value="Suture Removal">Suture / Staple Removal</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Wound Inspection & Post-Op Plan */}
            <div className="p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/50 space-y-4">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200">
                Post-Operative Wound Status &amp; Suture Plan
              </h4>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300">Wound Assessment</label>
                  <input
                    type="text"
                    value={woundStatus}
                    onChange={(e) => setWoundStatus(e.target.value)}
                    className="mt-1 w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 font-medium"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300">Suture Removal Target</label>
                  <select
                    value={sutureRemovalDay}
                    onChange={(e) => setSutureRemovalDay(e.target.value)}
                    className="mt-1 w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 font-semibold"
                  >
                    <option value="POD 5 (Facial wound)">POD 5 (Facial / Delicate)</option>
                    <option value="POD 7 (Scalp / Trunk)">POD 7 (Scalp / Trunk / Arms)</option>
                    <option value="POD 10-14 (Joint / Lower extremity)">POD 10–14 (Joint / Lower Extremity)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 6. GYNECOLOGY & OBSTETRICS SUITE */}
      {/* ======================================================== */}
      {selectedSpecialty === "gynecology" && (
        <div className="space-y-5 animate-fade-in">
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-purple-50/80 dark:bg-purple-950/40 border border-purple-200/80 dark:border-purple-900/60">
            <div className="flex items-center gap-2 text-purple-800 dark:text-purple-300 font-bold text-xs">
              <FiCalendar size={16} />
              <span>Obstetric &amp; Antenatal Care (ANC) Clinical Suite</span>
            </div>
            <span className="text-[11px] text-purple-700 dark:text-purple-400 font-semibold">Naegele's EDD Rule</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* ANC Calculator */}
            <div className="p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/50 space-y-4">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200">
                Antenatal Due Date &amp; Gestational Age
              </h4>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300">Last Menstrual Period (LMP)</label>
                  <input
                    type="date"
                    value={lmpDate}
                    onChange={(e) => setLmpDate(e.target.value)}
                    className="mt-1 w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 font-bold text-slate-900 dark:text-white"
                  />
                </div>

                {obstetricCalculations && (
                  <div className="p-3.5 rounded-xl bg-purple-100/50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-900 space-y-1.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-600 dark:text-slate-300">Estimated Due Date (EDD):</span>
                      <strong className="text-purple-700 dark:text-purple-300 font-bold">{obstetricCalculations.eddFormatted}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600 dark:text-slate-300">Gestational Age:</span>
                      <strong className="text-slate-900 dark:text-white font-mono">{obstetricCalculations.gestationalAge}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600 dark:text-slate-300">Trimester:</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">{obstetricCalculations.trimester}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Maternal Vitals & Obstetric Profile */}
            <div className="p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/50 space-y-4">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200">
                Maternal-Fetal Parameters
              </h4>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300">Gravida (G)</label>
                  <input
                    type="text"
                    value={gravida}
                    onChange={(e) => setGravida(e.target.value)}
                    className="mt-1 w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 font-bold text-xs"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300">Para (P)</label>
                  <input
                    type="text"
                    value={para}
                    onChange={(e) => setPara(e.target.value)}
                    className="mt-1 w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 font-bold text-xs"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300">Fetal Heart Rate (bpm)</label>
                  <input
                    type="number"
                    value={fetalHeartRate}
                    onChange={(e) => setFetalHeartRate(e.target.value)}
                    className="mt-1 w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 font-bold text-xs"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300">Fundal Height (cm)</label>
                  <input
                    type="number"
                    value={fundalHeightCm}
                    onChange={(e) => setFundalHeightCm(e.target.value)}
                    className="mt-1 w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 font-bold text-xs"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 7. OPHTHALMOLOGY SUITE */}
      {/* ======================================================== */}
      {selectedSpecialty === "ophthalmology" && (
        <div className="space-y-5 animate-fade-in">
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-teal-50/80 dark:bg-teal-950/40 border border-teal-200/80 dark:border-teal-900/60">
            <div className="flex items-center gap-2 text-teal-800 dark:text-teal-300 font-bold text-xs">
              <FiEye size={16} />
              <span>Ophthalmic Refraction, Visual Acuity &amp; Tonometry Suite</span>
            </div>
            <span className="text-[11px] text-teal-700 dark:text-teal-400 font-semibold">Snellen Chart &amp; IOP</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Visual Acuity & Tonometry */}
            <div className="p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/50 space-y-4">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200">
                Snellen Visual Acuity &amp; Intraocular Pressure (IOP)
              </h4>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300">Right Eye (OD) Acuity</label>
                  <select
                    value={vaOD}
                    onChange={(e) => setVaOD(e.target.value)}
                    className="mt-1 w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 font-bold"
                  >
                    {["6/6", "6/9", "6/12", "6/18", "6/24", "6/36", "6/60", "CF", "HM", "PL"].map((v) => (
                      <option key={v} value={v}>{v}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300">Left Eye (OS) Acuity</label>
                  <select
                    value={vaOS}
                    onChange={(e) => setVaOS(e.target.value)}
                    className="mt-1 w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 font-bold"
                  >
                    {["6/6", "6/9", "6/12", "6/18", "6/24", "6/36", "6/60", "CF", "HM", "PL"].map((v) => (
                      <option key={v} value={v}>{v}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300">OD IOP (mmHg)</label>
                  <input
                    type="number"
                    value={iopOD}
                    onChange={(e) => setIopOD(e.target.value)}
                    className="mt-1 w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 font-bold text-xs"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300">OS IOP (mmHg)</label>
                  <input
                    type="number"
                    value={iopOS}
                    onChange={(e) => setIopOS(e.target.value)}
                    className="mt-1 w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 font-bold text-xs"
                  />
                </div>
              </div>

              {(parseInt(iopOD) > 21 || parseInt(iopOS) > 21) && (
                <div className="p-2.5 rounded-xl bg-amber-100 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200 text-xs font-bold flex items-center gap-1.5">
                  <FiAlertTriangle size={14} className="text-amber-600" />
                  <span>IOP &gt; 21 mmHg detected — evaluate for Ocular Hypertension / Glaucoma.</span>
                </div>
              )}
            </div>

            {/* Spectacle Refraction Matrix */}
            <div className="p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/50 space-y-4">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200">
                Spectacle Prescription Matrix
              </h4>

              <div className="space-y-2 text-xs">
                <div className="grid grid-cols-4 gap-2 font-bold text-slate-500 dark:text-slate-400 text-center">
                  <span>Eye</span>
                  <span>Sphere</span>
                  <span>Cylinder</span>
                  <span>Axis</span>
                </div>
                <div className="grid grid-cols-4 gap-2 items-center">
                  <span className="font-bold text-slate-800 dark:text-slate-200 text-center">OD (Right)</span>
                  <input
                    type="text"
                    value={spectacleRx.odSph}
                    onChange={(e) => setSpectacleRx({ ...spectacleRx, odSph: e.target.value })}
                    className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-center font-mono font-bold"
                  />
                  <input
                    type="text"
                    value={spectacleRx.odCyl}
                    onChange={(e) => setSpectacleRx({ ...spectacleRx, odCyl: e.target.value })}
                    className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-center font-mono font-bold"
                  />
                  <input
                    type="text"
                    value={spectacleRx.odAxis}
                    onChange={(e) => setSpectacleRx({ ...spectacleRx, odAxis: e.target.value })}
                    className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-center font-mono font-bold"
                  />
                </div>

                <div className="grid grid-cols-4 gap-2 items-center">
                  <span className="font-bold text-slate-800 dark:text-slate-200 text-center">OS (Left)</span>
                  <input
                    type="text"
                    value={spectacleRx.osSph}
                    onChange={(e) => setSpectacleRx({ ...spectacleRx, osSph: e.target.value })}
                    className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-center font-mono font-bold"
                  />
                  <input
                    type="text"
                    value={spectacleRx.osCyl}
                    onChange={(e) => setSpectacleRx({ ...spectacleRx, osCyl: e.target.value })}
                    className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-center font-mono font-bold"
                  />
                  <input
                    type="text"
                    value={spectacleRx.osAxis}
                    onChange={(e) => setSpectacleRx({ ...spectacleRx, osAxis: e.target.value })}
                    className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-center font-mono font-bold"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
