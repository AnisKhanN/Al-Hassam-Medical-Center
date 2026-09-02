import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { format } from "date-fns";
import {
  FiArrowLeft,
  FiDollarSign,
  FiPrinter,
  FiXCircle,
} from "react-icons/fi";
import { useBill } from "../../hooks/useBill";
import { useAuth } from "../../hooks/useAuth";
import BillStatusBadge from "../../components/billing/BillStatusBadge";
import RecordPaymentModal from "../../components/billing/RecordPaymentModal";

const BillDetail = () => {
  const { id } = useParams();
  const { bill, loading, error, recordPayment, cancelBill } = useBill(id);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/40 p-6 md:p-8 print:bg-white print:p-0">
      <div className="mb-4 flex items-center justify-between print:hidden">
        <Link
          to="/billing"
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700"
        >
          <FiArrowLeft size={14} /> Back to Billing
        </Link>
        <div className="flex gap-2">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
          >
            <FiPrinter size={14} /> Print
          </button>
          {canPay && (
            <button
              onClick={() => setPaymentOpen(true)}
              className="flex items-center gap-1.5 rounded-lg bg-green-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-green-700"
            >
              <FiDollarSign size={14} /> Record Payment
            </button>
          )}
          {canCancel && (
            <button
              onClick={() => setConfirmCancel(true)}
              className="flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
            >
              <FiXCircle size={14} /> Cancel Bill
            </button>
          )}
        </div>
      </div>

      <div className="rounded-2xl border border-slate-100 bg-white/70 p-6 shadow-sm backdrop-blur print:border-0 print:bg-white print:shadow-none">
        <div className="mb-6 flex items-start justify-between">
          <div>
            <p className="font-mono text-xs text-slate-400">{bill.billId}</p>
            <h1 className="text-lg font-semibold text-slate-800">
              {bill.patient?.fullName}
            </h1>
            <p className="text-sm text-slate-500">
              {bill.patient?.patientId} · {bill.patient?.phone}
            </p>
            {bill.patient?.address && (
              <p className="text-sm text-slate-500">{bill.patient.address}</p>
            )}
          </div>
          <div className="text-right">
            <BillStatusBadge status={bill.status} />
            <p className="mt-1 text-xs text-slate-400">
              {format(new Date(bill.createdAt), "dd MMM yyyy, h:mm a")}
            </p>
            {bill.appointment && (
              <p className="text-xs text-slate-400">
                Linked: {bill.appointment.appointmentId}
              </p>
            )}
          </div>
        </div>

        <table className="mb-4 w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 text-left text-xs uppercase tracking-wide text-slate-500">
              <th className="py-2">Description</th>
              <th className="py-2">Category</th>
              <th className="py-2 text-right">Qty</th>
              <th className="py-2 text-right">Unit Price</th>
              <th className="py-2 text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {bill.items.map((item, i) => (
              <tr key={i} className="border-b border-slate-50 last:border-0">
                <td className="py-2 text-slate-700">{item.description}</td>
                <td className="py-2 text-slate-500">{item.category}</td>
                <td className="py-2 text-right text-slate-500">
                  {item.quantity}
                </td>
                <td className="py-2 text-right text-slate-500">
                  Rs. {item.unitPrice.toLocaleString()}
                </td>
                <td className="py-2 text-right font-medium text-slate-700">
                  Rs. {(item.quantity * item.unitPrice).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="ml-auto w-full max-w-xs space-y-1.5 text-sm">
          <div className="flex justify-between text-slate-500">
            <span>Subtotal</span>
            <span>Rs. {bill.subtotal.toLocaleString()}</span>
          </div>
          {bill.discount > 0 && (
            <div className="flex justify-between text-slate-500">
              <span>Discount</span>
              <span>- Rs. {bill.discount.toLocaleString()}</span>
            </div>
          )}
          <div className="flex justify-between border-t border-slate-100 pt-1.5 font-medium text-slate-800">
            <span>Total</span>
            <span>Rs. {bill.totalAmount.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-green-600">
            <span>Paid</span>
            <span>Rs. {bill.amountPaid.toLocaleString()}</span>
          </div>
          <div className="flex justify-between font-semibold text-slate-800">
            <span>Balance Due</span>
            <span>Rs. {bill.balanceDue.toLocaleString()}</span>
          </div>
        </div>

        {bill.notes && (
          <p className="mt-4 text-sm text-slate-500">Note: {bill.notes}</p>
        )}

        <div className="mt-6 border-t border-slate-100 pt-4">
          <h3 className="mb-3 text-sm font-semibold text-slate-700">
            Payment History
          </h3>
          {bill.payments.length === 0 ? (
            <p className="text-sm text-slate-400">No payments recorded yet.</p>
          ) : (
            <div className="space-y-2">
              {bill.payments.map((p, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-lg bg-slate-50/60 px-3 py-2 text-sm"
                >
                  <div>
                    <span className="font-medium text-slate-700">
                      Rs. {p.amount.toLocaleString()}
                    </span>
                    <span className="ml-2 text-slate-500">
                      via {p.method}
                      {p.reference ? ` (${p.reference})` : ""}
                    </span>
                  </div>
                  <div className="text-right text-xs text-slate-400">
                    {format(new Date(p.date), "dd MMM yyyy, h:mm a")}
                    {p.receivedBy?.name && <span> · {p.receivedBy.name}</span>}
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
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4 print:hidden"
          onClick={() => setConfirmCancel(false)}
        >
          <div
            className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="mb-2 text-base font-semibold text-slate-800">
              Cancel {bill.billId}?
            </h3>
            <p className="mb-5 text-sm text-slate-500">
              No payments have been recorded, so this is safe to cancel. This
              cannot be undone.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setConfirmCancel(false)}
                className="rounded-lg px-4 py-2 text-sm text-slate-600 hover:bg-slate-100"
              >
                Keep Bill
              </button>
              <button
                onClick={handleCancel}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
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
