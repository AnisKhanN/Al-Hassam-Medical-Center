import { Link } from "react-router-dom";
import { format } from "date-fns";
import BillStatusBadge from "./BillStatusBadge";

const BillTable = ({ bills }) => {
  if (bills.length === 0) {
    return (
      <p className="py-10 text-center text-sm text-slate-400">
        No bills found.
      </p>
    );
  }

  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b border-slate-100 bg-slate-50/60 text-left text-xs uppercase tracking-wide text-slate-500">
          <th className="px-4 py-3">Bill ID</th>
          <th className="px-4 py-3">Patient</th>
          <th className="px-4 py-3">Date</th>
          <th className="px-4 py-3 text-right">Total</th>
          <th className="px-4 py-3 text-right">Paid</th>
          <th className="px-4 py-3 text-right">Balance</th>
          <th className="px-4 py-3">Status</th>
        </tr>
      </thead>
      <tbody>
        {bills.map((b) => (
          <tr
            key={b._id}
            className="border-b border-slate-50 last:border-0 hover:bg-slate-50/60"
          >
            <td className="px-4 py-3">
              <Link
                to={`/billing/${b._id}`}
                className="font-mono text-xs font-medium text-blue-600 hover:underline"
              >
                {b.billId}
              </Link>
            </td>
            <td className="px-4 py-3">
              <p className="font-medium text-slate-700">
                {b.patient?.fullName}
              </p>
              <p className="text-xs text-slate-400">{b.patient?.patientId}</p>
            </td>
            <td className="px-4 py-3 text-slate-500">
              {format(new Date(b.createdAt), "dd MMM yyyy")}
            </td>
            <td className="px-4 py-3 text-right text-slate-600">
              Rs. {b.totalAmount.toLocaleString()}
            </td>
            <td className="px-4 py-3 text-right text-slate-500">
              Rs. {b.amountPaid.toLocaleString()}
            </td>
            <td className="px-4 py-3 text-right font-medium text-slate-700">
              Rs. {b.balanceDue.toLocaleString()}
            </td>
            <td className="px-4 py-3">
              <BillStatusBadge status={b.status} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default BillTable;
