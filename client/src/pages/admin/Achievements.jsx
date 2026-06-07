import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, X, Award } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import api from "../../services/api";
import toast from "react-hot-toast";
import LoadingSpinner from "../../components/common/LoadingSpinner";

const badgeColor = {
  bronze: "text-amber-600",
  silver: "text-gray-300",
  gold: "text-gold-400",
  platinum: "text-cyan-300",
  diamond: "text-blue-300",
};

const Achievements = () => {
  const qc = useQueryClient();
  const [modal, setModal] = useState(null);
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { isSubmitting },
  } = useForm();

  const { data: achievements, isLoading } = useQuery({
    queryKey: ["admin-achievements"],
    queryFn: () =>
      api.get("/achievements?limit=50").then((r) => r.data.data.achievements),
  });
  const { data: studentsData } = useQuery({
    queryKey: ["students-list"],
    queryFn: () =>
      api.get("/users?role=student&limit=100").then((r) => r.data.data.users),
  });

  const createMutation = useMutation({
    mutationFn: (d) => api.post("/achievements", d),
    onSuccess: () => {
      qc.invalidateQueries(["admin-achievements"]);
      toast.success("Achievement awarded!");
      setModal(null);
      reset();
    },
    onError: (e) => toast.error(e.response?.data?.message || "Error"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/achievements/${id}`),
    onSuccess: () => {
      qc.invalidateQueries(["admin-achievements"]);
      toast.success("Deleted");
    },
  });

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Achievements</h1>
        <button
          onClick={() => {
            setModal("create");
            reset();
          }}
          className="btn-primary text-sm flex items-center gap-2"
        >
          <Plus size={16} /> Award
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {achievements?.length === 0 ? (
          <div className="col-span-3 card py-12 text-center text-gray-500">
            No achievements yet
          </div>
        ) : (
          achievements?.map((a) => (
            <motion.div
              key={a._id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="card group relative"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-gold-400/10 border border-gold-400/20 rounded-xl flex items-center justify-center shrink-0">
                  <Award
                    size={20}
                    className={badgeColor[a.badge] || "text-gold-400"}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-white text-sm">
                    {a.title}
                  </h3>
                  <p className="text-xs text-primary-400 mt-0.5">
                    {a.student?.name}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">{a.description}</p>
                  <div className="flex gap-2 mt-2 flex-wrap">
                    <span className="badge text-xs bg-dark-600 text-gray-300 capitalize">
                      {a.type}
                    </span>
                    <span
                      className={`badge text-xs capitalize ${badgeColor[a.badge]}`}
                    >
                      {a.badge}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => {
                  if (window.confirm("Delete achievement?"))
                    deleteMutation.mutate(a._id);
                }}
                className="absolute top-3 right-3 p-1.5 hover:bg-red-500/10 rounded-lg opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity"
              >
                <Trash2 size={14} className="text-red-400" />
              </button>
            </motion.div>
          ))
        )}
      </div>

      <AnimatePresence>
        {modal && (
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
              className="card w-full max-w-lg"
            >
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-semibold text-white">Award Achievement</h2>
                <button
                  onClick={() => setModal(null)}
                  className="p-1.5 hover:bg-white/10 rounded-lg"
                >
                  <X size={16} className="text-gray-400" />
                </button>
              </div>
              <form
                onSubmit={handleSubmit((d) => createMutation.mutate(d))}
                className="space-y-4"
              >
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">
                    Student
                  </label>
                  <select
                    {...register("student", { required: true })}
                    className="input-field text-sm"
                  >
                    <option value="">Select student</option>
                    {studentsData?.map((s) => (
                      <option key={s._id} value={s._id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">
                    Title
                  </label>
                  <input
                    {...register("title", { required: true })}
                    className="input-field text-sm"
                    placeholder="e.g. Best Performer"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">
                    Description
                  </label>
                  <textarea
                    {...register("description")}
                    className="input-field text-sm resize-none h-20"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-gray-400 mb-1 block">
                      Type
                    </label>
                    <select
                      {...register("type")}
                      className="input-field text-sm"
                    >
                      {[
                        "milestone",
                        "award",
                        "competition",
                        "certificate",
                        "recognition",
                      ].map((t) => (
                        <option key={t} value={t} className="capitalize">
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 mb-1 block">
                      Badge
                    </label>
                    <select
                      {...register("badge")}
                      className="input-field text-sm"
                    >
                      {["bronze", "silver", "gold", "platinum", "diamond"].map(
                        (b) => (
                          <option key={b} value={b} className="capitalize">
                            {b}
                          </option>
                        ),
                      )}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">
                    Date
                  </label>
                  <input
                    {...register("achievedDate")}
                    type="date"
                    className="input-field text-sm"
                    defaultValue={new Date().toISOString().split("T")[0]}
                  />
                </div>
                <div className="flex gap-3 justify-end">
                  <button
                    type="button"
                    onClick={() => setModal(null)}
                    className="btn-ghost text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-primary text-sm"
                  >
                    Award
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Achievements;
