import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { format } from "date-fns";
import {
  FiArrowLeft,
  FiPrinter,
  FiXCircle,
  FiSend,
} from "react-icons/fi";
import { useBill } from "../../hooks/useBill";
import { useAuth } from "../../hooks/useAuth";
import BillStatusBadge from "../../components/billing/BillStatusBadge";
import RecordPaymentModal from "../../components/billing/RecordPaymentModal";
import RupeeIcon from "../../components/common/RupeeIcon";
import { sendWhatsAppNotification } from "../../api/notificationApi";
import useSEO from "../../hooks/useSEO";

const BillDetail = () => {
  const { id } = useParams();
  const { bill, loading, error, recordPayment, cancelBill } = useBill(id);

  useSEO({
    title: bill ? `Invoice ${bill.billId || id} — Billing Detail` : "Invoice & Billing Detail",
    description: "Detailed breakdown of items, payments, balance due, and printable thermal receipt.",
  });

  const { user } = useAuth();
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [confirmCancel, setConfirmCancel] = useState(false);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
      </div>
    );
  }
  if (error || !bill)
    return (
      <div className="p-8 text-sm text-red-600">
        {error || "Bill not found"}
      </div>
    );

  const canCancel =
    user?.role === "Admin" &&
    bill.amountPaid === 0 &&
    bill.status !== "Cancelled";
  const canPay = bill.balanceDue > 0 && bill.status !== "Cancelled";

  const handleCancel = async () => {
    await cancelBill();
    setConfirmCancel(false);
  };

  const handleSendWhatsAppReceipt = async () => {
    const patientPhone = bill.patient?.phone || "03001234567";
    try {
      const res = await sendWhatsAppNotification({
        phone: patientPhone,
        type: "bill",
        data: {
          patientName: bill.patient?.fullName,
          billId: bill.billId,
          totalAmount: bill.totalAmount,
          amountPaid: bill.amountPaid,
          balanceDue: bill.balanceDue,
          phone: patientPhone,
        },
      });
      if (res.data?.whatsAppLink) {
        window.open(res.data.whatsAppLink, "_blank");
      }
    } catch (err) {
      alert("Failed to generate WhatsApp receipt: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/40 p-6 md:p-8 print:bg-white print:p-0 dark:from-slate-950 dark:to-slate-900">
      <div className="mb-4 flex items-center justify-between print:hidden">
        <Link
          to="/billing"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
        >
          <FiArrowLeft size={14} /> Back to Billing
        </Link>
        <div className="flex gap-2">
          <button
            onClick={handleSendWhatsAppReceipt}
            className="flex items-center gap-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm transition"
            title="Send payment receipt via WhatsApp"
          >
            <FiSend size={13} /> Send WhatsApp
          </button>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 shadow-sm transition"
          >
            <FiPrinter size={14} /> Print
          </button>
          {canPay && (
            <button
              onClick={() => setPaymentOpen(true)}
              className="flex items-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 px-3.5 py-2 text-xs font-semibold text-white shadow-sm shadow-emerald-500/20 transition"
            >
              <RupeeIcon size={14} /> Record Payment
            </button>
          )}
          {canCancel && (
            <button
              onClick={() => setConfirmCancel(true)}
              className="flex items-center gap-1.5 rounded-xl border border-red-200 bg-red-50/50 px-3.5 py-2 text-xs font-medium text-red-600 hover:bg-red-100 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400 dark:hover:bg-red-950/60 shadow-sm transition"
            >
              <FiXCircle size={14} /> Cancel Bill
            </button>
          )}
        </div>
      </div>

      <div className="rounded-3xl border border-slate-100 bg-white/80 p-6 md:p-8 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/80 print:border-0 print:bg-white print:shadow-none">
        <div className="mb-6 flex items-start justify-between border-b border-slate-100 pb-6 dark:border-slate-800">
          <div>
            <p className="font-mono text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">{bill.billId}</p>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              {bill.patient?.fullName}
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {bill.patient?.patientId} · {bill.patient?.phone}
            </p>
            {bill.patient?.address && (
              <p className="text-sm text-slate-500 dark:text-slate-400">{bill.patient.address}</p>
            )}
          </div>
          <div className="text-right">
            <BillStatusBadge status={bill.status} />
            <p className="mt-2 text-xs text-slate-400 dark:text-slate-500">
              {format(new Date(bill.createdAt), "dd MMM yyyy, h:mm a")}
            </p>
            {bill.appointment && (
              <p className="text-xs text-slate-400 dark:text-slate-500">
                Linked: {bill.appointment.appointmentId}
              </p>
            )}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="mb-6 w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-left text-xs uppercase tracking-wide text-slate-400 dark:border-slate-800 dark:text-slate-400">
                <th className="py-2.5">Description</th>
                <th className="py-2.5">Category</th>
                <th className="py-2.5 text-right">Qty</th>
                <th className="py-2.5 text-right">Unit Price</th>
                <th className="py-2.5 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {bill.items.map((item, i) => (
                <tr key={i} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="py-3 font-medium text-slate-800 dark:text-slate-200">{item.description}</td>
                  <td className="py-3 text-slate-500 dark:text-slate-400">{item.category}</td>
                  <td className="py-3 text-right text-slate-600 dark:text-slate-300">
                    {item.quantity}
                  </td>
                  <td className="py-3 text-right text-slate-600 dark:text-slate-300">
                    Rs. {item.unitPrice.toLocaleString()}
                  </td>
                  <td className="py-3 text-right font-semibold text-slate-900 dark:text-white">
                    Rs. {(item.quantity * item.unitPrice).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="ml-auto w-full max-w-xs space-y-2 rounded-2xl border border-slate-100 bg-slate-50/60 p-4 text-sm dark:border-slate-800 dark:bg-slate-950/40">
          <div className="flex justify-between text-slate-500 dark:text-slate-400">
            <span>Subtotal</span>
            <span className="font-medium text-slate-700 dark:text-slate-300">Rs. {bill.subtotal.toLocaleString()}</span>
          </div>
          {bill.discount > 0 && (
            <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
              <span>Discount</span>
              <span className="font-medium">- Rs. {bill.discount.toLocaleString()}</span>
            </div>
          )}
          <div className="flex justify-between border-t border-slate-200/60 pt-2 font-semibold text-slate-900 dark:border-slate-800 dark:text-white">
            <span>Total</span>
            <span className="text-base">Rs. {bill.totalAmount.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
            <span>Paid</span>
            <span className="font-medium">Rs. {bill.amountPaid.toLocaleString()}</span>
          </div>
          <div className="flex justify-between border-t border-dashed border-slate-200/80 pt-2 font-bold text-slate-900 dark:border-slate-800 dark:text-white">
            <span>Balance Due</span>
            <span className="text-lg text-rose-600 dark:text-rose-400">Rs. {bill.balanceDue.toLocaleString()}</span>
          </div>
        </div>

        {bill.notes && (
          <p className="mt-4 rounded-xl bg-slate-50 p-3 text-sm text-slate-600 dark:bg-slate-800/40 dark:text-slate-300">
            <span className="font-semibold text-slate-700 dark:text-slate-200">Note: </span>
            {bill.notes}
          </p>
        )}

        <div className="mt-8 border-t border-slate-100 pt-6 dark:border-slate-800">
          <h3 className="mb-3 text-base font-bold text-slate-900 dark:text-white">
            Payment History
          </h3>
          {bill.payments.length === 0 ? (
            <p className="text-sm text-slate-400 dark:text-slate-500">No payments recorded yet.</p>
          ) : (
            <div className="space-y-2">
              {bill.payments.map((p, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/70 p-3 text-sm dark:border-slate-800 dark:bg-slate-800/40"
                >
                  <div>
                    <span className="font-semibold text-slate-900 dark:text-white">
                      Rs. {p.amount.toLocaleString()}
                    </span>
                    <span className="ml-2 text-slate-500 dark:text-slate-400">
                      via <span className="font-medium text-slate-700 dark:text-slate-300">{p.method}</span>
                      {p.reference ? ` (${p.reference})` : ""}
                    </span>
                  </div>
                  <div className="text-right text-xs text-slate-400 dark:text-slate-500">
                    {format(new Date(p.date), "dd MMM yyyy, h:mm a")}
                    {p.receivedBy?.name && <span className="text-slate-600 dark:text-slate-400"> · {p.receivedBy.name}</span>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <RecordPaymentModal
        isOpen={paymentOpen}
        onClose={() => setPaymentOpen(false)}
        onSubmit={recordPayment}
        balanceDue={bill.balanceDue}
      />

      {confirmCancel && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 px-4 backdrop-blur-md print:hidden"
          onClick={() => setConfirmCancel(false)}
        >
          <div
            className="w-full max-w-sm rounded-3xl border border-slate-100 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="mb-2 text-lg font-bold text-slate-900 dark:text-white">
              Cancel {bill.billId}?
            </h3>
            <p className="mb-5 text-sm text-slate-500 dark:text-slate-400">
              No payments have been recorded, so this is safe to cancel. This
              cannot be undone.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setConfirmCancel(false)}
                className="rounded-xl px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
              >
                Keep Bill
              </button>
              <button
                onClick={handleCancel}
                className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 shadow-md shadow-red-500/20 transition-all"
              >
                Cancel Bill
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BillDetail;
