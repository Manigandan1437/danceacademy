import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import api from "../../services/api";
import toast from "react-hot-toast";
import LoadingSpinner from "../../components/common/LoadingSpinner";

const categories = [
  "classical",
  "western",
  "folk",
  "bollywood",
  "fusion",
  "other",
];

const DanceStyles = () => {
  const qc = useQueryClient();
  const [modal, setModal] = useState(null);
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { isSubmitting },
  } = useForm();

  const { data: styles, isLoading } = useQuery({
    queryKey: ["admin-dance-styles"],
    queryFn: () => api.get("/dance-styles").then((r) => r.data.data),
  });

  const createMutation = useMutation({
    mutationFn: (d) => api.post("/dance-styles", d),
    onSuccess: () => {
      qc.invalidateQueries(["admin-dance-styles"]);
      toast.success("Created");
      setModal(null);
      reset();
    },
    onError: (e) => toast.error(e.response?.data?.message || "Error"),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => api.put(`/dance-styles/${id}`, data),
    onSuccess: () => {
      qc.invalidateQueries(["admin-dance-styles"]);
      toast.success("Updated");
      setModal(null);
      reset();
    },
    onError: (e) => toast.error(e.response?.data?.message || "Error"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/dance-styles/${id}`),
    onSuccess: () => {
      qc.invalidateQueries(["admin-dance-styles"]);
      toast.success("Deleted");
    },
  });

  const openEdit = (s) => {
    setModal(s);
    setTimeout(() => {
      setValue("name", s.name);
      setValue("description", s.description || "");
      setValue("category", s.category);
    }, 50);
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Dance Styles</h1>
        <button
          onClick={() => {
            setModal("create");
            reset();
          }}
          className="btn-primary text-sm flex items-center gap-2"
        >
          <Plus size={16} /> Add Style
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {styles?.length === 0 ? (
          <div className="col-span-3 card py-12 text-center text-gray-500">
            No dance styles yet
          </div>
        ) : (
          styles?.map((s) => (
            <motion.div
              key={s._id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="card group relative"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-primary-500/10 border border-primary-500/20 rounded-xl flex items-center justify-center text-lg shrink-0">
                  {s.category === "classical"
                    ? "🙏"
                    : s.category === "western"
                      ? "🕺"
                      : s.category === "bollywood"
                        ? "🎬"
                        : s.category === "folk"
                          ? "🌾"
                          : "💃"}
                </div>
                <div>
                  <h3 className="font-semibold text-white">{s.name}</h3>
                  <span className="badge text-xs bg-primary-500/20 text-primary-400 capitalize mt-1 inline-block">
                    {s.category}
                  </span>
                  {s.description && (
                    <p className="text-xs text-gray-400 mt-1.5 line-clamp-2">
                      {s.description}
                    </p>
                  )}
                </div>
              </div>
              <div className="absolute top-3 right-3 flex gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => openEdit(s)}
                  className="p-1.5 hover:bg-white/10 rounded-lg"
                >
                  <Pencil size={14} className="text-primary-400" />
                </button>
                <button
                  onClick={() => {
                    if (window.confirm("Delete this style?"))
                      deleteMutation.mutate(s._id);
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
              className="card w-full max-w-md"
            >
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-semibold text-white">
                  {modal === "create" ? "New Dance Style" : "Edit Style"}
                </h2>
                <button
                  onClick={() => setModal(null)}
                  className="p-1.5 hover:bg-white/10 rounded-lg"
                >
                  <X size={16} className="text-gray-400" />
                </button>
              </div>
              <form
                onSubmit={handleSubmit((d) =>
                  modal === "create"
                    ? createMutation.mutate(d)
                    : updateMutation.mutate({ id: modal._id, data: d }),
                )}
                className="space-y-4"
              >
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">
                    Name
                  </label>
                  <input
                    {...register("name", { required: true })}
                    className="input-field text-sm"
                    placeholder="e.g. Bharatanatyam"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">
                    Category
                  </label>
                  <select
                    {...register("category", { required: true })}
                    className="input-field text-sm"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c} className="capitalize">
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">
                    Description
                  </label>
                  <textarea
                    {...register("description")}
                    className="input-field text-sm resize-none h-20"
                    placeholder="Brief description..."
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
                    {modal === "create" ? "Create" : "Save"}
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

export default DanceStyles;
