import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Search, UserCheck, UserX, Trash2, Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import api from "../../services/api";
import toast from "react-hot-toast";
import LoadingSpinner from "../../components/common/LoadingSpinner";

const Instructors = () => {
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const { data, isLoading } = useQuery({
    queryKey: ["admin-instructors", search, page],
    queryFn: () =>
      api
        .get("/users", {
          params: {
            role: "instructor",
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
      qc.invalidateQueries(["admin-instructors"]);
      toast.success("Status updated");
    },
    onError: () => toast.error("Failed to update"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/users/${id}`),
    onSuccess: () => {
      qc.invalidateQueries(["admin-instructors"]);
      toast.success("Instructor deleted");
    },
    onError: () => toast.error("Failed to delete"),
  });

  const createMutation = useMutation({
    mutationFn: (body) =>
      api.post("/auth/register", { ...body, role: "instructor" }),
    onSuccess: () => {
      qc.invalidateQueries(["admin-instructors"]);
      toast.success("Instructor created");
      reset();
      setShowForm(false);
    },
    onError: (e) =>
      toast.error(e.response?.data?.message || "Error creating instructor"),
  });

  const users = data?.users || [];
  const pagination = data?.pagination;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Instructors</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn-primary flex items-center gap-2 text-sm"
        >
          <Plus size={16} /> Add Instructor
        </button>
      </div>

      {/* Add form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="card"
          >
            <h2 className="font-semibold text-white mb-4">New Instructor</h2>
            <form
              onSubmit={handleSubmit((d) => createMutation.mutate(d))}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4"
            >
              <div>
                <label className="text-xs text-gray-400 mb-1 block">
                  Full Name
                </label>
                <input
                  {...register("name", { required: true })}
                  className="input-field text-sm"
                  placeholder="Name"
                />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">
                  Email
                </label>
                <input
                  {...register("email", { required: true })}
                  type="email"
                  className="input-field text-sm"
                  placeholder="Email"
                />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">
                  Phone
                </label>
                <input
                  {...register("phone")}
                  className="input-field text-sm"
                  placeholder="Phone"
                />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">
                  Password
                </label>
                <input
                  {...register("password", { required: true, minLength: 6 })}
                  type="password"
                  className="input-field text-sm"
                  placeholder="Min 6 chars"
                />
              </div>
              <div className="sm:col-span-2 flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    reset();
                  }}
                  className="btn-ghost text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary text-sm"
                >
                  Create Instructor
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
        />
        <input
          className="input-field pl-9 text-sm"
          placeholder="Search instructors..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
      </div>

      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div className="card overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[680px] text-sm">
              <thead>
                <tr>
                  {[
                    "Name",
                    "Email",
                    "Phone",
                    "Specializations",
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
                {users.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-12 text-gray-500">
                      No instructors found
                    </td>
                  </tr>
                ) : (
                  users.map((u) => (
                    <tr
                      key={u._id}
                      className="hover:bg-white/3 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary-500/20 flex items-center justify-center text-sm font-semibold text-primary-400 shrink-0">
                            {u.name[0]}
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
                      <td className="px-4 py-3 text-gray-400">
                        {u.specializations
                          ?.map((s) => s.name || s)
                          .join(", ") || "—"}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`badge text-xs ${u.isActive ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}
                        >
                          {u.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
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
                              if (window.confirm("Delete this instructor?"))
                                deleteMutation.mutate(u._id);
                            }}
                            className="p-1.5 rounded-lg hover:bg-red-500/10 transition-colors"
                          >
                            <Trash2 size={15} className="text-red-400" />
                          </button>
                        </div>
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

export default Instructors;
