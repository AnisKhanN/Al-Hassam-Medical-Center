import { useState } from "react";
import { format } from "date-fns";
import {
  FiXCircle,
  FiFileText,
  FiShoppingBag,
  FiPrinter,
  FiX,
  FiCheckCircle,
  FiUser,
  FiPhone,
  FiCalendar,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

const STATUS_BADGES = {
  Completed:
    "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/80",
  Voided:
    "bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800/80",
};

const SalesTable = ({ sales = [], onVoid, canVoid = false }) => {
  const [selectedReceipt, setSelectedReceipt] = useState(null);

  if (sales.length === 0) {
    return (
      <div className="py-16 text-center">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400">
          <FiShoppingBag size={24} />
        </div>
        <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
          No POS sales records found
        </p>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
          Completed checkout transactions will appear here.
        </p>
      </div>
    );
  }

  const printReceipt = () => {
    window.print();
  };

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200/80 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80 text-xs uppercase tracking-wider font-bold text-slate-500 dark:text-slate-400">
              <th className="px-5 py-3.5">Sale ID / Time</th>
              <th className="px-5 py-3.5">Customer</th>
              <th className="px-5 py-3.5">Items Summary</th>
              <th className="px-5 py-3.5 text-right">Total Amount</th>
              <th className="px-5 py-3.5">Staff / Cashier</th>
              <th className="px-5 py-3.5 text-center">Status</th>
              <th className="px-5 py-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
            {sales.map((s) => {
              const isCompleted = s.status === "Completed";
              const itemCount = s.items?.reduce((sum, it) => sum + (it.quantity || 1), 0) || 0;

              return (
                <tr
                  key={s._id}
                  className="hover:bg-blue-50/40 dark:hover:bg-blue-950/20 transition-colors"
                >
                  {/* Sale ID and Date */}
                  <td className="px-5 py-4">
                    <span className="font-mono font-bold text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md text-xs">
                      {s.saleId}
                    </span>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 flex items-center gap-1">
                      <FiCalendar size={11} />
                      {format(new Date(s.createdAt), "dd MMM yyyy, h:mm a")}
                    </p>
                  </td>

                  {/* Customer Info */}
                  <td className="px-5 py-4">
                    <p className="font-semibold text-slate-800 dark:text-slate-200">
                      {s.customerName || "Walk-in Customer"}
                    </p>
                    {s.customerPhone ? (
                      <p className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1 mt-0.5">
                        <FiPhone size={11} /> {s.customerPhone}
                      </p>
                    ) : (
                      <span className="text-[11px] text-slate-400">Direct OTC</span>
                    )}
                  </td>

                  {/* Items Sold */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center rounded-md bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 text-xs font-bold text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/60">
                        {itemCount} units
                      </span>
                      <div className="max-w-[200px] truncate text-xs text-slate-600 dark:text-slate-400" title={s.items?.map(it => `${it.medicineName} (x${it.quantity})`).join(", ")}>
                        {s.items?.map((it, idx) => (
                          <span key={idx}>
                            {it.medicineName} <span className="text-slate-400 font-mono">x{it.quantity}</span>
                            {idx < (s.items?.length || 0) - 1 ? ", " : ""}
                          </span>
                        ))}
                      </div>
                    </div>
                  </td>

                  {/* Total Amount */}
                  <td className="px-5 py-4 text-right font-bold text-slate-900 dark:text-white text-base">
                    Rs. {(s.totalAmount || 0).toLocaleString()}
                  </td>

                  {/* Cashier */}
                  <td className="px-5 py-4 text-xs text-slate-600 dark:text-slate-400">
                    <div className="flex items-center gap-1.5">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-bold">
                        {(s.soldBy?.name || "S")[0]}
                      </div>
                      <span>{s.soldBy?.name || "Staff"}</span>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="px-5 py-4 text-center">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-bold ${
                        STATUS_BADGES[s.status] ||
                        "border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                      }`}
                    >
                      {s.status === "Completed" && <FiCheckCircle size={12} />}
                      {s.status === "Voided" && <FiXCircle size={12} />}
                      {s.status}
                    </span>
                    {s.status === "Voided" && s.voidReason && (
                      <p
                        className="mt-1 text-[11px] text-rose-500 dark:text-rose-400 italic truncate max-w-[140px] mx-auto"
                        title={s.voidReason}
                      >
                        {s.voidReason}
                      </p>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setSelectedReceipt(s)}
                        className="inline-flex items-center gap-1 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 px-2.5 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition shadow-xs"
                        title="View Thermal POS Receipt"
                      >
                        <FiFileText size={13} />
                        <span className="hidden sm:inline">Receipt</span>
                      </button>

                      {canVoid && isCompleted && onVoid && (
                        <button
                          onClick={() => onVoid(s)}
                          className="inline-flex items-center gap-1 rounded-xl border border-rose-200 dark:border-rose-900/50 bg-rose-50/50 dark:bg-rose-950/40 px-2.5 py-1.5 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/60 transition shadow-xs"
                          title="Void this Transaction"
                        >
                          <FiXCircle size={13} />
                          <span className="hidden sm:inline">Void</span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* POS Receipt Preview Modal */}
      <AnimatePresence>
        {selectedReceipt && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm"
            onClick={() => setSelectedReceipt(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-2xl"
            >
              {/* Receipt Header */}
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
                    <FiShoppingBag size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white">
                      Pharmacy Sales Slip
                    </h3>
                    <p className="font-mono text-xs text-slate-400">
                      {selectedReceipt.saleId}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedReceipt(null)}
                  className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
                >
                  <FiX size={18} />
                </button>
              </div>

              {/* Receipt Body */}
              <div className="my-4 space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-2 rounded-2xl bg-slate-50 dark:bg-slate-800/60 p-3 border border-slate-100 dark:border-slate-800">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400">Date & Time</span>
                    <p className="font-medium text-slate-800 dark:text-slate-200">
                      {format(new Date(selectedReceipt.createdAt), "dd MMM yyyy, h:mm a")}
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400">Cashier</span>
                    <p className="font-medium text-slate-800 dark:text-slate-200">
                      {selectedReceipt.soldBy?.name || "Staff"}
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400">Customer</span>
                    <p className="font-medium text-slate-800 dark:text-slate-200">
                      {selectedReceipt.customerName || "Walk-in OTC"}
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400">Phone</span>
                    <p className="font-medium text-slate-800 dark:text-slate-200">
                      {selectedReceipt.customerPhone || "—"}
                    </p>
                  </div>
                </div>

                {/* Items List */}
                <div className="rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden">
                  <div className="bg-slate-50/80 dark:bg-slate-800/80 px-3 py-2 text-[11px] font-bold text-slate-500 uppercase flex justify-between">
                    <span>Item & Dosage</span>
                    <span>Total (Rs.)</span>
                  </div>
                  <div className="divide-y divide-slate-100 dark:divide-slate-800/60 max-h-48 overflow-y-auto">
                    {selectedReceipt.items?.map((it, idx) => (
                      <div key={idx} className="p-3 flex items-center justify-between text-xs">
                        <div>
                          <p className="font-semibold text-slate-800 dark:text-slate-200">
                            {it.medicineName}
                          </p>
                          <p className="text-[11px] text-slate-400 font-mono">
                            Qty: {it.quantity} × Rs. {it.unitPrice}
                          </p>
                        </div>
                        <span className="font-bold text-slate-900 dark:text-white">
                          Rs. {((it.quantity || 1) * (it.unitPrice || 0)).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Totals */}
                <div className="flex items-center justify-between rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 p-4 text-white shadow-md shadow-blue-500/20">
                  <span className="text-sm font-semibold">Net Total Paid</span>
                  <span className="text-xl font-black">
                    Rs. {(selectedReceipt.totalAmount || 0).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Receipt Actions */}
              <div className="flex gap-2">
                <button
                  onClick={printReceipt}
                  className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 py-2.5 text-xs font-bold transition hover:opacity-90 shadow-sm"
                >
                  <FiPrinter size={15} /> Print Sales Slip
                </button>
                <button
                  onClick={() => setSelectedReceipt(null)}
                  className="rounded-xl border border-slate-200 dark:border-slate-800 px-4 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default SalesTable;
