import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, X, Bell } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import api from "../../services/api";
import toast from "react-hot-toast";
import LoadingSpinner from "../../components/common/LoadingSpinner";

const priorityColor = {
  low: "bg-gray-500/20 text-gray-400",
  medium: "bg-blue-500/20 text-blue-400",
  high: "bg-amber-500/20 text-amber-400",
  urgent: "bg-red-500/20 text-red-400",
};

const Announcements = () => {
  const qc = useQueryClient();
  const [modal, setModal] = useState(null);
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { isSubmitting },
  } = useForm();

  const { data: announcements, isLoading } = useQuery({
    queryKey: ["admin-announcements"],
    queryFn: () =>
      api.get("/announcements?limit=50").then((r) => r.data.data.announcements),
  });

  const createMutation = useMutation({
    mutationFn: (d) => api.post("/announcements", d),
    onSuccess: () => {
      qc.invalidateQueries(["admin-announcements"]);
      toast.success("Announcement created");
      setModal(null);
      reset();
    },
    onError: (e) => toast.error(e.response?.data?.message || "Error"),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => api.put(`/announcements/${id}`, data),
    onSuccess: () => {
      qc.invalidateQueries(["admin-announcements"]);
      toast.success("Updated");
      setModal(null);
      reset();
    },
    onError: (e) => toast.error(e.response?.data?.message || "Error"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/announcements/${id}`),
    onSuccess: () => {
      qc.invalidateQueries(["admin-announcements"]);
      toast.success("Deleted");
    },
  });

  const openEdit = (a) => {
    setModal(a);
    setTimeout(() => {
      setValue("title", a.title);
      setValue("content", a.content);
      setValue("priority", a.priority);
      setValue("isPublic", a.isPublic);
      setValue("targetAudience", a.targetAudience);
    }, 50);
  };

  const onSubmit = (data) => {
    const audience = Array.isArray(data.targetAudience)
      ? data.targetAudience
      : [data.targetAudience].filter(Boolean);
    const payload = { ...data, targetAudience: audience };
    if (modal === "create") createMutation.mutate(payload);
    else updateMutation.mutate({ id: modal._id, data: payload });
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Announcements</h1>
        <button
          onClick={() => {
            setModal("create");
            reset();
          }}
          className="btn-primary text-sm flex items-center gap-2"
        >
          <Plus size={16} /> New
        </button>
      </div>

      <div className="space-y-3">
        {announcements?.length === 0 ? (
          <div className="card text-center py-12 text-gray-500">
            No announcements yet
          </div>
        ) : (
          announcements?.map((a) => (
            <motion.div
              key={a._id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="card flex gap-4 items-start group"
            >
              <div className="w-9 h-9 bg-primary-500/10 border border-primary-500/20 rounded-lg flex items-center justify-center shrink-0">
                <Bell size={17} className="text-primary-400" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start gap-2 flex-wrap">
                  <h3 className="font-semibold text-white text-sm">
                    {a.title}
                  </h3>
                  <span
                    className={`badge text-xs capitalize ${priorityColor[a.priority]}`}
                  >
                    {a.priority}
                  </span>
                  {a.isPublic && (
                    <span className="badge text-xs bg-green-500/20 text-green-400">
                      Public
                    </span>
                  )}
                </div>
                <p className="text-gray-400 text-xs mt-1 line-clamp-2">
                  {a.content}
                </p>
                <p className="text-gray-500 text-xs mt-1">
                  For: {a.targetAudience?.join(", ") || "all"} ·{" "}
                  {new Date(a.createdAt).toLocaleDateString("en-IN")}
                </p>
              </div>
              <div className="flex gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity shrink-0">
                <button
                  onClick={() => openEdit(a)}
                  className="p-1.5 hover:bg-white/10 rounded-lg"
                >
                  <Pencil size={14} className="text-primary-400" />
                </button>
                <button
                  onClick={() => {
                    if (window.confirm("Delete?")) deleteMutation.mutate(a._id);
                  }}
                  className="p-1.5 hover:bg-red-500/10 rounded-lg"
                >
                  <Trash2 size={14} className="text-red-400" />
                </button>
              </div>
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
                <h2 className="font-semibold text-white">
                  {modal === "create"
                    ? "New Announcement"
                    : "Edit Announcement"}
                </h2>
                <button
                  onClick={() => setModal(null)}
                  className="p-1.5 hover:bg-white/10 rounded-lg"
                >
                  <X size={16} className="text-gray-400" />
                </button>
              </div>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">
                    Title
                  </label>
                  <input
                    {...register("title", { required: true })}
                    className="input-field text-sm"
                    placeholder="Announcement title"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">
                    Content
                  </label>
                  <textarea
                    {...register("content", { required: true })}
                    className="input-field text-sm resize-none h-24"
                    placeholder="Announcement details..."
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-gray-400 mb-1 block">
                      Priority
                    </label>
                    <select
                      {...register("priority")}
                      className="input-field text-sm"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 mb-3 block">
                      Public?
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        {...register("isPublic")}
                        className="accent-primary-500"
                      />
                      <span className="text-sm text-gray-300">
                        Visible to visitors
                      </span>
                    </label>
                  </div>
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-2 block">
                    Target Audience
                  </label>
                  <div className="flex flex-wrap gap-3">
                    {["student", "instructor", "admin", "visitor"].map(
                      (role) => (
                        <label
                          key={role}
                          className="flex items-center gap-1.5 text-xs text-gray-300 cursor-pointer capitalize"
                        >
                          <input
                            type="checkbox"
                            value={role}
                            {...register("targetAudience")}
                            className="accent-primary-500"
                          />
                          {role}
                        </label>
                      ),
                    )}
                  </div>
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
                    {modal === "create" ? "Publish" : "Save"}
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

export default Announcements;
