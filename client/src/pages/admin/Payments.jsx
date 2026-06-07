import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Filter, Download } from "lucide-react";
import api from "../../services/api";
import LoadingSpinner from "../../components/common/LoadingSpinner";

const statusColor = {
  completed: "bg-green-500/20 text-green-400",
  pending: "bg-amber-500/20 text-amber-400",
  failed: "bg-red-500/20 text-red-400",
  refunded: "bg-blue-500/20 text-blue-400",
};

const Payments = () => {
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-payments", status, page],
    queryFn: () =>
      api
        .get("/payments", {
          params: { status: status || undefined, page, limit: 20 },
        })
        .then((r) => r.data.data),
  });

  const payments = data?.payments || [];
  const pagination = data?.pagination;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-white">Payments</h1>
        <div className="flex items-center gap-2">
          <Filter size={15} className="text-gray-400" />
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="input-field text-sm py-1.5 w-40"
          >
            <option value="">All Status</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
            <option value="refunded">Refunded</option>
          </select>
        </div>
      </div>

      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div className="card overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[680px] text-sm">
              <thead className="bg-dark-700/50">
                <tr>
                  {[
                    "Receipt #",
                    "Student",
                    "Class",
                    "Amount",
                    "Method",
                    "Status",
                    "Date",
                  ].map((h) => (
                    <th
                      key={h}
                      className="text-left px-4 py-3 text-xs text-gray-400 font-medium"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {payments.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-12 text-gray-500">
                      No payments found
                    </td>
                  </tr>
                ) : (
                  payments.map((p) => (
                    <tr
                      key={p._id}
                      className="hover:bg-white/3 transition-colors"
                    >
                      <td className="px-4 py-3 text-gray-500 font-mono text-xs">
                        {p.receiptNumber}
                      </td>
                      <td className="px-4 py-3 text-white">
                        {p.student?.name}
                      </td>
                      <td className="px-4 py-3 text-gray-400">
                        {p.class?.name}
                      </td>
                      <td className="px-4 py-3 font-medium text-emerald-400">
                        ₹{p.amount}
                      </td>
                      <td className="px-4 py-3 text-gray-400 capitalize">
                        {p.paymentMethod?.replace("_", " ")}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`badge text-xs capitalize ${statusColor[p.status]}`}
                        >
                          {p.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-400 text-xs">
                        {p.paidAt
                          ? new Date(p.paidAt).toLocaleDateString("en-IN")
                          : "—"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {pagination && pagination.pages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-white/5">
              <p className="text-xs text-gray-400">
                Showing {payments.length} of {pagination.total}
              </p>
              <div className="flex gap-2">
                <button
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="px-3 py-1 glass rounded-lg text-xs disabled:opacity-40"
                >
                  Prev
                </button>
                <span className="px-3 py-1 glass rounded-lg text-xs text-primary-400">
                  {page} / {pagination.pages}
                </span>
                <button
                  disabled={page === pagination.pages}
                  onClick={() => setPage((p) => p + 1)}
                  className="px-3 py-1 glass rounded-lg text-xs disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Payments;
