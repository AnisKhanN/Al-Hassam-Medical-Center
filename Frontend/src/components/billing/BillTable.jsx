import { Link } from "react-router-dom";
import { format } from "date-fns";
import BillStatusBadge from "./BillStatusBadge";

const BillTable = ({ bills }) => {
  if (bills.length === 0) {
    return (
      <div className="py-16 text-center">
        <p className="text-sm font-medium text-slate-400 dark:text-slate-500">
          No bills found matching your filter criteria.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-200/80 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80 text-left text-xs uppercase tracking-wider font-bold text-slate-500 dark:text-slate-400">
            <th className="px-5 py-3.5">Bill Reference</th>
            <th className="px-5 py-3.5">Patient Details</th>
            <th className="px-5 py-3.5">Billing Date</th>
            <th className="px-5 py-3.5 text-right">Gross Total</th>
            <th className="px-5 py-3.5 text-right">Amount Paid</th>
            <th className="px-5 py-3.5 text-right">Balance Due</th>
            <th className="px-5 py-3.5">Payment Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
          {bills.map((b) => (
            <tr
              key={b._id}
              className="hover:bg-blue-50/40 dark:hover:bg-blue-950/20 transition-colors"
            >
              <td className="px-5 py-4">
                <Link
                  to={`/billing/${b._id}`}
                  className="font-mono text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2.5 py-1 rounded-lg border border-blue-100 dark:border-blue-900/50 hover:underline"
                >
                  {b.billId}
                </Link>
              </td>
              <td className="px-5 py-4">
                <p className="font-semibold text-slate-800 dark:text-slate-200">
                  {b.patient?.fullName}
                </p>
                <p className="text-[11px] text-slate-400 dark:text-slate-500 font-mono mt-0.5">
                  {b.patient?.patientId}
                </p>
              </td>
              <td className="px-5 py-4 text-xs font-mono text-slate-600 dark:text-slate-300">
                {format(new Date(b.createdAt), "dd MMM yyyy, hh:mm a")}
              </td>
              <td className="px-5 py-4 text-right font-medium text-slate-700 dark:text-slate-300">
                Rs. {b.totalAmount.toLocaleString()}
              </td>
              <td className="px-5 py-4 text-right font-medium text-emerald-600 dark:text-emerald-400">
                Rs. {b.amountPaid.toLocaleString()}
              </td>
              <td className="px-5 py-4 text-right font-bold text-slate-900 dark:text-white">
                Rs. {b.balanceDue.toLocaleString()}
              </td>
              <td className="px-5 py-4">
                <BillStatusBadge status={b.status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BillTable;
