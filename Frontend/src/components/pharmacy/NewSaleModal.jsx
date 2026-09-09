import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiPlus, FiTrash2, FiCamera, FiCheckCircle, FiAlertCircle } from "react-icons/fi";
import { RiBarcodeLine } from "react-icons/ri";
import MedicineSearchSelect from "../common/MedicineSearchSelect";
import { getMedicineByBarcode } from "../../api/medicineApi";

const emptyRow = () => ({ medicine: null, quantity: 1, unitPrice: "" });

// Sound synthesizer using Web Audio API (zero external files required)
const playBeep = (isSuccess = true) => {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(isSuccess ? 880 : 260, ctx.currentTime);
    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.15);
  } catch (e) {
    // AudioContext blocked or not supported
  }
};

const NewSaleModal = ({ isOpen, onClose, onSubmit }) => {
  const [rows, setRows] = useState([emptyRow()]);
  const [barcodeQuery, setBarcodeQuery] = useState("");
  const [scanFeedback, setScanFeedback] = useState(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState(null);

  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const barcodeInputRef = useRef(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    setError,
  } = useForm();

  // Clean up camera stream
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
    setCameraError(null);
  };

  const close = () => {
    stopCamera();
    setRows([emptyRow()]);
    setBarcodeQuery("");
    setScanFeedback(null);
    reset();
    onClose();
  };

  // Process a detected barcode (from hardware scanner, input, or camera)
  const processBarcodeScan = async (rawCode) => {
    if (!rawCode || !rawCode.trim()) return;
    const code = rawCode.trim();

    try {
      const res = await getMedicineByBarcode(code);
      const medicine = res.data;

      if (!medicine) {
        throw new Error("Medicine not found");
      }

      playBeep(true);
      setScanFeedback({
        type: "success",
        text: `Scanned: ${medicine.name} (${medicine.medicineId || code})`,
      });

      // Add to rows: If already present, increment quantity
      setRows((prev) => {
        const existingIndex = prev.findIndex(
          (r) => r.medicine && r.medicine._id === medicine._id,
        );

        if (existingIndex >= 0) {
          const updated = [...prev];
          const currentQty = Number(updated[existingIndex].quantity) || 1;
          updated[existingIndex] = {
            ...updated[existingIndex],
            quantity: currentQty + 1,
          };
          return updated;
        }

        // If the first row is empty, replace it
        if (prev.length === 1 && !prev[0].medicine) {
          return [{ medicine, quantity: 1, unitPrice: medicine.unitPrice }];
        }

        // Otherwise append new row
        return [...prev, { medicine, quantity: 1, unitPrice: medicine.unitPrice }];
      });

      setBarcodeQuery("");
    } catch (err) {
      playBeep(false);
      setScanFeedback({
        type: "error",
        text: err.response?.data?.message || `No medicine found for barcode "${code}"`,
      });
    }
  };

  // 1. Global Hardware USB/Bluetooth Barcode Scanner Wedge Listener
  useEffect(() => {
    if (!isOpen) return;

    let buffer = "";
    let lastKeyTime = Date.now();

    const handleKeyDown = (e) => {
      // Ignore key events when user is typing in standard text inputs (except the barcode input)
      const target = e.target;
      const isInput =
        target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.tagName === "SELECT";
      const isBarcodeInput = target === barcodeInputRef.current;

      const now = Date.now();
      const diff = now - lastKeyTime;
      lastKeyTime = now;

      // Scanners type fast: typical delay between chars is < 50ms
      if (diff > 80) {
        buffer = "";
      }

      if (e.key === "Enter") {
        if (buffer.length >= 3 && (!isInput || isBarcodeInput)) {
          e.preventDefault();
          processBarcodeScan(buffer);
          buffer = "";
        }
      } else if (e.key.length === 1) {
        buffer += e.key;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  // 2. Camera Barcode / QR Scanner Feed
  const startCamera = async () => {
    setCameraError(null);
    setIsCameraActive(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", width: { ideal: 640 }, height: { ideal: 480 } },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }

      // If browser supports native BarcodeDetector API (Chrome / Edge)
      if ("BarcodeDetector" in window) {
        const barcodeDetector = new window.BarcodeDetector({
          formats: ["qr_code", "ean_13", "ean_8", "code_128", "code_39", "upc_a", "upc_e"],
        });

        const scanFrame = async () => {
          if (!streamRef.current || !videoRef.current) return;
          try {
            const barcodes = await barcodeDetector.detect(videoRef.current);
            if (barcodes.length > 0) {
              const detected = barcodes[0].rawValue;
              stopCamera();
              processBarcodeScan(detected);
              return;
            }
          } catch (e) {
            // frame detect skipped
          }
          if (streamRef.current) {
            requestAnimationFrame(scanFrame);
          }
        };

        requestAnimationFrame(scanFrame);
      }
    } catch (err) {
      setCameraError("Unable to access camera. Please allow camera permissions or use USB scanner.");
      stopCamera();
    }
  };

  const updateRow = (index, patch) => {
    setRows((prev) =>
      prev.map((row, i) => (i === index ? { ...row, ...patch } : row)),
    );
  };

  const selectMedicine = (index, medicine) => {
    updateRow(index, {
      medicine,
      unitPrice: medicine ? medicine.unitPrice : "",
    });
  };

  const addRow = () => setRows((prev) => [...prev, emptyRow()]);
  const removeRow = (index) =>
    setRows((prev) => prev.filter((_, i) => i !== index));

  const subtotal = rows.reduce(
    (sum, r) => sum + (Number(r.quantity) || 0) * (Number(r.unitPrice) || 0),
    0,
  );

  const submit = async (values) => {
    const incomplete = rows.some(
      (r) => !r.medicine || !r.quantity || r.quantity <= 0,
    );
    if (incomplete) {
      setError("root", {
        message: "Select a medicine and a valid quantity for every row",
      });
      return;
    }
    try {
      await onSubmit({
        items: rows.map((r) => ({
          medicine: r.medicine._id,
          quantity: Number(r.quantity),
          unitPrice: r.unitPrice !== "" ? Number(r.unitPrice) : undefined,
        })),
        customerName: values.customerName || undefined,
        customerPhone: values.customerPhone || undefined,
      });
      close();
    } catch (err) {
      // surfaces the backend's 409 "insufficient stock" message directly
      setError("root", {
        message: err.response?.data?.message || "Something went wrong",
      });
    }
  };

  const inputClass =
    "w-full rounded-xl border border-slate-200/80 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 outline-none focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 transition-all";

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 px-4 py-6 backdrop-blur-sm"
          onClick={close}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            onClick={(e) => e.stopPropagation()}
            className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-2xl"
          >
            {/* Modal Header */}
            <div className="mb-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/40">
                  <RiBarcodeLine size={22} />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900 dark:text-white">Pharmacy POS Checkout</h2>
                  <p className="text-xs text-slate-400 dark:text-slate-500">
                    Supports USB/Bluetooth barcode guns &amp; live camera reading
                  </p>
                </div>
              </div>
              <button
                onClick={close}
                className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-600 dark:hover:text-slate-200 transition"
              >
                <FiX size={18} />
              </button>
            </div>

            {/* Barcode Quick-Scanner Bar */}
            <div className="mb-4 rounded-2xl border border-indigo-100 dark:border-indigo-900/50 bg-gradient-to-r from-blue-50/70 dark:from-blue-950/40 to-indigo-50/50 dark:to-indigo-950/30 p-3.5">
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="flex items-center gap-1.5 text-xs font-bold text-indigo-900 dark:text-indigo-200">
                  <RiBarcodeLine size={16} className="text-indigo-600 dark:text-indigo-400" />
                  Instant Barcode Scanner
                </span>
                <div className="flex items-center gap-2">
                  {!isCameraActive ? (
                    <button
                      type="button"
                      onClick={startCamera}
                      className="flex items-center gap-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 px-2.5 py-1 text-[11px] font-semibold text-white shadow-sm transition"
                    >
                      <FiCamera size={13} /> Camera Scan
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={stopCamera}
                      className="rounded-lg bg-red-500 hover:bg-red-600 px-2.5 py-1 text-[11px] font-semibold text-white shadow-sm transition"
                    >
                      Stop Camera
                    </button>
                  )}
                  <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-medium text-emerald-800">
                    USB Wedge Active
                  </span>
                </div>
              </div>

              {/* Camera Live Preview (when active) */}
              {isCameraActive && (
                <div className="relative mb-3 overflow-hidden rounded-xl bg-black aspect-video max-h-48 flex items-center justify-center">
                  <video ref={videoRef} className="h-full w-full object-cover" playsInline muted />
                  <div className="pointer-events-none absolute inset-x-12 inset-y-8 border-2 border-dashed border-emerald-400 rounded-lg animate-pulse" />
                  <span className="absolute bottom-2 rounded bg-black/60 px-2 py-0.5 text-[10px] text-white">
                    Point camera at medicine barcode or QR code
                  </span>
                </div>
              )}

              {/* Manual Barcode Input / Scanner target */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  processBarcodeScan(barcodeQuery);
                }}
                className="flex items-center gap-2"
              >
                <div className="relative flex-1">
                  <input
                    ref={barcodeInputRef}
                    type="text"
                    value={barcodeQuery}
                    onChange={(e) => setBarcodeQuery(e.target.value)}
                    placeholder="Scan barcode with gun or enter code/ID and hit Enter..."
                    className="w-full rounded-xl border border-indigo-200 dark:border-indigo-800 bg-white dark:bg-slate-800 px-3 py-1.5 pl-8 text-xs font-mono text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  />
                  <RiBarcodeLine
                    size={16}
                    className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                </div>
                <button
                  type="submit"
                  className="rounded-xl bg-indigo-600 hover:bg-indigo-700 px-3 py-1.5 text-xs font-semibold text-white transition shadow-sm"
                >
                  Lookup
                </button>
              </form>

              {/* Scan Toast Feedback */}
              {scanFeedback && (
                <div
                  className={`mt-2 flex items-center justify-between rounded-xl px-2.5 py-1.5 text-xs font-medium ${
                    scanFeedback.type === "success"
                      ? "bg-emerald-100 dark:bg-emerald-950/80 text-emerald-900 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-800"
                      : "bg-red-100 dark:bg-red-950/80 text-red-900 dark:text-red-200 border border-red-300 dark:border-red-800"
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    {scanFeedback.type === "success" ? (
                      <FiCheckCircle size={14} className="text-emerald-600 dark:text-emerald-400" />
                    ) : (
                      <FiAlertCircle size={14} className="text-red-600 dark:text-red-400" />
                    )}
                    <span>{scanFeedback.text}</span>
                  </div>
                  <button
                    onClick={() => setScanFeedback(null)}
                    className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    <FiX size={13} />
                  </button>
                </div>
              )}

              {cameraError && (
                <p className="mt-2 text-xs text-red-600 dark:text-red-400">{cameraError}</p>
              )}
            </div>

            {errors.root && (
              <div className="mb-4 rounded-xl bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800 px-3 py-2 text-sm text-red-600 dark:text-red-300">
                {errors.root.message}
              </div>
            )}

            <form
              onSubmit={handleSubmit(submit)}
              noValidate
              className="space-y-4"
            >
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-400">
                    Customer Name (optional)
                  </label>
                  <input className={inputClass} {...register("customerName")} placeholder="Walk-in customer" />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-400">
                    Customer Phone (optional)
                  </label>
                  <input
                    className={inputClass}
                    {...register("customerPhone")}
                    placeholder="0300-XXXXXXX"
                  />
                </div>
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                    Medicine Items ({rows.filter((r) => r.medicine).length})
                  </label>
                  <button
                    type="button"
                    onClick={addRow}
                    className="flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                  >
                    <FiPlus size={13} /> Add Manual Row
                  </button>
                </div>

                <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                  {rows.map((row, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-12 items-center gap-2 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 p-2.5"
                    >
                      <div className="col-span-6">
                        <MedicineSearchSelect
                          value={row.medicine}
                          onChange={(m) => selectMedicine(index, m)}
                        />
                      </div>
                      <div className="col-span-2">
                        <input
                          type="number"
                          min="1"
                          max={row.medicine?.totalStock || undefined}
                          placeholder="Qty"
                          value={row.quantity}
                          onChange={(e) =>
                            updateRow(index, { quantity: e.target.value })
                          }
                          className={inputClass}
                        />
                      </div>
                      <div className="col-span-3">
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          placeholder="Price"
                          value={row.unitPrice}
                          onChange={(e) =>
                            updateRow(index, { unitPrice: e.target.value })
                          }
                          className={inputClass}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeRow(index)}
                        disabled={rows.length === 1}
                        className="col-span-1 flex items-center justify-center rounded-xl p-1.5 text-slate-400 hover:bg-red-50 dark:hover:bg-red-950/60 hover:text-red-600 dark:hover:text-red-400 disabled:cursor-not-allowed disabled:opacity-30 transition"
                        title="Remove item"
                      >
                        <FiTrash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="mt-3 flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-3">
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    FEFO automatic batch allocation active
                  </span>
                  <div className="text-right text-sm font-semibold text-slate-800 dark:text-slate-200">
                    Total Amount:{" "}
                    <span className="text-lg font-black text-blue-600 dark:text-blue-400 ml-1">
                      Rs. {subtotal.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-2xl bg-blue-600 py-3 text-sm font-bold text-white transition hover:bg-blue-700 shadow-md shadow-blue-500/25 disabled:opacity-60 cursor-pointer"
              >
                {isSubmitting ? "Processing Transaction..." : "Complete Sale & Issue Receipt"}
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NewSaleModal;
