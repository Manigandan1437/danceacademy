import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Search, UserCheck, UserX, Trash2, Eye, Filter } from "lucide-react";
import { motion } from "framer-motion";
import api from "../../services/api";
import toast from "react-hot-toast";
import LoadingSpinner from "../../components/common/LoadingSpinner";

const Students = () => {
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["admin-students", search, page, statusFilter],
    queryFn: () =>
      api
        .get("/users", {
          params: {
            role: "student",
            search: search || undefined,
            page,
            limit: 15,
          },
        })
        .then((r) => r.data.data),
  });

  const toggleMutation = useMutation({
    mutationFn: (id) => api.put(`/users/${id}/toggle-status`),
    onSuccess: () => {
      qc.invalidateQueries(["admin-students"]);
      toast.success("Status updated");
    },
    onError: () => toast.error("Failed to update status"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/users/${id}`),
    onSuccess: () => {
      qc.invalidateQueries(["admin-students"]);
      toast.success("Student deleted");
    },
    onError: () => toast.error("Failed to delete"),
  });

  const users = data?.users || [];
  const pagination = data?.pagination;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Students</h1>
        <span className="badge bg-primary-500/20 text-primary-400 border border-primary-500/30">
          {pagination?.total || 0} Total
        </span>
      </div>

      {/* Search */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
          />
          <input
            className="input-field pl-9 text-sm"
            placeholder="Search students..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>
      </div>

      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div className="card overflow-hidden p-0">
          <div className="overflow-x-auto -webkit-overflow-scrolling-touch">
            <table className="w-full min-w-[720px] text-sm">
              <thead className="bg-dark-700/50">
                <tr>
                  {[
                    "Student",
                    "Email",
                    "Phone",
                    "Enrollment Status",
                    "Account Status",
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
                {users.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-12 text-gray-500">
                      No students found
                    </td>
                  </tr>
                ) : (
                  users.map((u) => (
                    <motion.tr
                      key={u._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-white/3 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary-500/20 flex items-center justify-center text-sm font-semibold text-primary-400 shrink-0">
                            {u.avatar ? (
                              <img
                                src={u.avatar}
                                className="w-8 h-8 rounded-full object-cover"
                                alt={u.name}
                              />
                            ) : (
                              u.name[0]
                            )}
                          </div>
                          <span className="text-white font-medium">
                            {u.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-400">{u.email}</td>
                      <td className="px-4 py-3 text-gray-400">
                        {u.phone || "—"}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`badge text-xs capitalize ${
                            u.enrollmentStatus === "approved"
                              ? "bg-green-500/20 text-green-400"
                              : u.enrollmentStatus === "pending"
                                ? "bg-amber-500/20 text-amber-400"
                                : u.enrollmentStatus === "rejected"
                                  ? "bg-red-500/20 text-red-400"
                                  : "bg-gray-500/20 text-gray-400"
                          }`}
                        >
                          {u.enrollmentStatus?.replace("_", " ") || "—"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`badge text-xs ${u.isActive ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}
                        >
                          {u.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => toggleMutation.mutate(u._id)}
                            className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
                            title={u.isActive ? "Deactivate" : "Activate"}
                          >
                            {u.isActive ? (
                              <UserX size={15} className="text-amber-400" />
                            ) : (
                              <UserCheck size={15} className="text-green-400" />
                            )}
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm("Delete this student?"))
                                deleteMutation.mutate(u._id);
                            }}
                            className="p-1.5 rounded-lg hover:bg-red-500/10 transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={15} className="text-red-400" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {/* Pagination */}
          {pagination && pagination.pages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-white/5">
              <p className="text-xs text-gray-400">
                Showing {users.length} of {pagination.total}
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

export default Students;
