import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CheckCircle, XCircle, Filter } from "lucide-react";
import { motion } from "framer-motion";
import api from "../../services/api";
import toast from "react-hot-toast";
import LoadingSpinner from "../../components/common/LoadingSpinner";

const statusColor = {
  pending: "bg-amber-500/20 text-amber-400",
  approved: "bg-green-500/20 text-green-400",
  rejected: "bg-red-500/20 text-red-400",
  cancelled: "bg-gray-500/20 text-gray-400",
};

const Enrollments = () => {
  const qc = useQueryClient();
  const [status, setStatus] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["admin-enrollments", status],
    queryFn: () =>
      api
        .get("/enrollments", {
          params: { status: status || undefined, limit: 50 },
        })
        .then((r) => r.data.data),
  });

  const approveMutation = useMutation({
    mutationFn: ({ id, note }) =>
      api.put(`/enrollments/${id}/approve`, { adminNote: note }),
    onSuccess: () => {
      qc.invalidateQueries(["admin-enrollments"]);
      toast.success("Enrollment approved");
    },
    onError: (e) => toast.error(e.response?.data?.message || "Error"),
  });

  const rejectMutation = useMutation({
    mutationFn: ({ id, reason }) =>
      api.put(`/enrollments/${id}/reject`, { rejectionReason: reason }),
    onSuccess: () => {
      qc.invalidateQueries(["admin-enrollments"]);
      toast.success("Enrollment rejected");
    },
    onError: (e) => toast.error(e.response?.data?.message || "Error"),
  });

  const enrollments = data?.enrollments || [];

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-white">Enrollments</h1>
        <div className="flex items-center gap-2">
          <Filter size={15} className="text-gray-400" />
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="input-field text-sm py-1.5 w-36"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div className="card overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-sm">
              <thead className="bg-dark-700/50">
                <tr>
                  {[
                    "Student",
                    "Class",
                    "Fee Plan",
                    "Applied On",
                    "Status",
                    "Actions",
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
                {enrollments.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-12 text-gray-500">
                      No enrollments found
                    </td>
                  </tr>
                ) : (
                  enrollments.map((e) => (
                    <motion.tr
                      key={e._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-white/3 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <div>
                          <p className="text-white font-medium">
                            {e.student?.name}
                          </p>
                          <p className="text-xs text-gray-400">
                            {e.student?.email}
                          </p>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-300">
                        {e.class?.name}
                      </td>
                      <td className="px-4 py-3 text-gray-400 capitalize">
                        {e.feePlan}
                      </td>
                      <td className="px-4 py-3 text-gray-400">
                        {new Date(e.createdAt).toLocaleDateString("en-IN")}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`badge text-xs capitalize ${statusColor[e.status]}`}
                        >
                          {e.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {e.status === "pending" && (
                          <div className="flex gap-2">
                            <button
                              onClick={() =>
                                approveMutation.mutate({ id: e._id, note: "" })
                              }
                              className="flex items-center gap-1 px-2.5 py-1 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg text-xs transition-colors"
                            >
                              <CheckCircle size={13} /> Approve
                            </button>
                            <button
                              onClick={() => {
                                const reason = window.prompt(
                                  "Rejection reason (optional):",
                                );
                                if (reason !== null)
                                  rejectMutation.mutate({ id: e._id, reason });
                              }}
                              className="flex items-center gap-1 px-2.5 py-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg text-xs transition-colors"
                            >
                              <XCircle size={13} /> Reject
                            </button>
                          </div>
                        )}
                        {e.status !== "pending" && (
                          <span className="text-xs text-gray-500">
                            {e.adminNote || e.rejectionReason || "—"}
                          </span>
                        )}
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Enrollments;
