import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, X, BookOpen } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import api from "../../services/api";
import toast from "react-hot-toast";
import LoadingSpinner from "../../components/common/LoadingSpinner";

const statusColor = {
  pending: "bg-amber-500/20 text-amber-400",
  approved: "bg-green-500/20 text-green-400",
  rejected: "bg-red-500/20 text-red-400",
  cancelled: "bg-gray-500/20 text-gray-400",
};

const MyClasses = () => {
  const qc = useQueryClient();
  const [applyModal, setApplyModal] = useState(false);
  const [selectedClass, setSelectedClass] = useState("");
  const [feePlan, setFeePlan] = useState("monthly");

  const { data: enrollments, isLoading } = useQuery({
    queryKey: ["my-enrollments"],
    queryFn: () => api.get("/enrollments/my").then((r) => r.data.data),
  });
  const { data: classes } = useQuery({
    queryKey: ["public-classes"],
    queryFn: () =>
      api.get("/classes?limit=100").then((r) => r.data.data.classes),
  });

  const applyMutation = useMutation({
    mutationFn: () =>
      api.post("/enrollments", { class: selectedClass, feePlan }),
    onSuccess: () => {
      qc.invalidateQueries(["my-enrollments"]);
      toast.success("Application submitted!");
      setApplyModal(false);
    },
    onError: (e) => toast.error(e.response?.data?.message || "Failed to apply"),
  });

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">My Classes</h1>
        <button
          onClick={() => setApplyModal(true)}
          className="btn-primary text-sm flex items-center gap-2"
        >
          <Plus size={16} /> Apply for Class
        </button>
      </div>

      {enrollments?.length === 0 ? (
        <div className="card py-16 text-center">
          <BookOpen size={40} className="text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400 mb-4">
            You haven't applied for any class yet.
          </p>
          <button
            onClick={() => setApplyModal(true)}
            className="btn-primary text-sm"
          >
            Browse & Apply
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {enrollments.map((e) => (
            <motion.div
              key={e._id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="card flex items-center gap-4"
            >
              <div className="w-12 h-12 bg-primary-500/10 border border-primary-500/20 rounded-xl flex items-center justify-center text-xl shrink-0">
                💃
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-white font-medium">{e.class?.name}</h3>
                <p className="text-xs text-gray-400">
                  {e.class?.instructor?.name || "—"} ·{" "}
                  {e.class?.danceStyle?.name}
                </p>
                <div className="flex gap-2 mt-1.5 flex-wrap">
                  <span
                    className={`badge text-xs capitalize ${statusColor[e.status]}`}
                  >
                    {e.status}
                  </span>
                  <span className="badge text-xs bg-dark-600 text-gray-300 capitalize">
                    {e.feePlan}
                  </span>
                </div>
                {e.status === "rejected" && e.rejectionReason && (
                  <p className="text-xs text-red-400 mt-1">
                    Reason: {e.rejectionReason}
                  </p>
                )}
              </div>
              <div className="text-right shrink-0">
                <p className="text-sm font-medium text-emerald-400">
                  ₹{e.class?.fees?.[e.feePlan] || "—"}
                </p>
                <p className="text-xs text-gray-500">
                  per {e.feePlan?.replace("ly", "")}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {applyModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="card w-full max-w-md"
            >
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-semibold text-white">Apply for a Class</h2>
                <button
                  onClick={() => setApplyModal(false)}
                  className="p-1.5 hover:bg-white/10 rounded-lg"
                >
                  <X size={16} className="text-gray-400" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-gray-400 mb-1.5 block">
                    Select Class
                  </label>
                  <select
                    value={selectedClass}
                    onChange={(e) => setSelectedClass(e.target.value)}
                    className="input-field text-sm"
                  >
                    <option value="">Choose a class...</option>
                    {classes?.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.name} – {c.danceStyle?.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1.5 block">
                    Fee Plan
                  </label>
                  <select
                    value={feePlan}
                    onChange={(e) => setFeePlan(e.target.value)}
                    className="input-field text-sm"
                  >
                    <option value="monthly">Monthly</option>
                    <option value="quarterly">Quarterly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                </div>
                {selectedClass && (
                  <div className="p-3 bg-primary-500/10 border border-primary-500/20 rounded-xl text-xs text-gray-300">
                    {(() => {
                      const cls = classes?.find((c) => c._id === selectedClass);
                      return cls
                        ? `Fee: ₹${cls.fees?.[feePlan] || 0} · ${cls.level} · Max ${cls.maxStudents} students`
                        : "";
                    })()}
                  </div>
                )}
                <div className="flex gap-3 justify-end">
                  <button
                    onClick={() => setApplyModal(false)}
                    className="btn-ghost text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => applyMutation.mutate()}
                    disabled={!selectedClass || applyMutation.isPending}
                    className="btn-primary text-sm"
                  >
                    Submit Application
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MyClasses;
