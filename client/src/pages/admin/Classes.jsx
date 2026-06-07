import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, X, Upload } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import api from "../../services/api";
import toast from "react-hot-toast";
import LoadingSpinner from "../../components/common/LoadingSpinner";

const emptyClass = {
  name: "",
  description: "",
  level: "beginner",
  ageGroup: "",
  maxStudents: 20,
  duration: 60,
  danceStyle: "",
  instructor: "",
  fees: { monthly: 0, quarterly: 0, yearly: 0 },
};

const Classes = () => {
  const qc = useQueryClient();
  const [modal, setModal] = useState(null); // null | 'create' | class-object
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { isSubmitting },
  } = useForm();

  const { data: classes, isLoading } = useQuery({
    queryKey: ["admin-classes"],
    queryFn: () =>
      api.get("/classes?limit=100").then((r) => r.data.data.classes),
  });
  const { data: stylesData } = useQuery({
    queryKey: ["dance-styles"],
    queryFn: () => api.get("/dance-styles").then((r) => r.data.data),
  });
  const { data: instructorsData } = useQuery({
    queryKey: ["instructors-list"],
    queryFn: () =>
      api
        .get("/users?role=instructor&limit=100")
        .then((r) => r.data.data.users),
  });

  const createMutation = useMutation({
    mutationFn: (d) => api.post("/classes", d),
    onSuccess: () => {
      qc.invalidateQueries(["admin-classes"]);
      toast.success("Class created");
      setModal(null);
      reset();
    },
    onError: (e) => toast.error(e.response?.data?.message || "Error"),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => api.put(`/classes/${id}`, data),
    onSuccess: () => {
      qc.invalidateQueries(["admin-classes"]);
      toast.success("Class updated");
      setModal(null);
      reset();
    },
    onError: (e) => toast.error(e.response?.data?.message || "Error"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/classes/${id}`),
    onSuccess: () => {
      qc.invalidateQueries(["admin-classes"]);
      toast.success("Class deleted");
    },
    onError: () => toast.error("Failed to delete"),
  });

  const openEdit = (cls) => {
    setModal(cls);
    setTimeout(() => {
      Object.entries(cls).forEach(([k, v]) => {
        if (k === "fees") {
          setValue("fees.monthly", v.monthly);
          setValue("fees.quarterly", v.quarterly);
          setValue("fees.yearly", v.yearly);
        } else if (k === "danceStyle") setValue("danceStyle", v?._id || v);
        else if (k === "instructor") setValue("instructor", v?._id || v);
        else setValue(k, v);
      });
    }, 50);
  };

  const onSubmit = (data) => {
    const payload = {
      ...data,
      fees: {
        monthly: +data.fees?.monthly,
        quarterly: +data.fees?.quarterly,
        yearly: +data.fees?.yearly,
      },
      maxStudents: +data.maxStudents,
      duration: +data.duration,
    };
    if (modal === "create") createMutation.mutate(payload);
    else updateMutation.mutate({ id: modal._id, data: payload });
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Classes</h1>
        <button
          onClick={() => {
            setModal("create");
            reset();
          }}
          className="btn-primary flex items-center gap-2 text-sm"
        >
          <Plus size={16} /> Add Class
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {classes?.map((cls) => (
          <motion.div
            key={cls._id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="card-hover group relative"
          >
            <div className="h-32 bg-gradient-to-br from-primary-900/40 to-dark-700 rounded-lg mb-3 flex items-center justify-center text-4xl overflow-hidden">
              {cls.thumbnail ? (
                <img
                  src={cls.thumbnail}
                  className="w-full h-full object-cover"
                  alt={cls.name}
                />
              ) : (
                "💃"
              )}
            </div>
            <h3 className="font-semibold text-white text-sm">{cls.name}</h3>
            <p className="text-xs text-gray-400 mt-1">
              {cls.danceStyle?.name || "—"} ·{" "}
              {cls.instructor?.name || "No instructor"}
            </p>
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <span className="badge text-xs bg-primary-500/20 text-primary-400 capitalize">
                {cls.level}
              </span>
              <span className="badge text-xs bg-dark-600 text-gray-300">
                {cls.enrolledCount}/{cls.maxStudents} students
              </span>
            </div>
            <p className="text-sm text-emerald-400 mt-2 font-medium">
              ₹{cls.fees?.monthly}/mo
            </p>
            <div className="absolute top-3 right-3 flex gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => openEdit(cls)}
                className="p-1.5 glass rounded-lg"
              >
                <Pencil size={14} className="text-primary-400" />
              </button>
              <button
                onClick={() => {
                  if (window.confirm("Delete this class?"))
                    deleteMutation.mutate(cls._id);
                }}
                className="p-1.5 glass rounded-lg"
              >
                <Trash2 size={14} className="text-red-400" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Modal */}
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
              className="card w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-semibold text-white">
                  {modal === "create" ? "New Class" : "Edit Class"}
                </h2>
                <button
                  onClick={() => setModal(null)}
                  className="p-1.5 hover:bg-white/10 rounded-lg"
                >
                  <X size={16} className="text-gray-400" />
                </button>
              </div>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="text-xs text-gray-400 mb-1 block">
                      Class Name
                    </label>
                    <input
                      {...register("name", { required: true })}
                      className="input-field text-sm"
                      placeholder="e.g. Beginner Bharatanatyam"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 mb-1 block">
                      Dance Style
                    </label>
                    <select
                      {...register("danceStyle")}
                      className="input-field text-sm"
                    >
                      <option value="">Select style</option>
                      {stylesData?.map((s) => (
                        <option key={s._id} value={s._id}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 mb-1 block">
                      Instructor
                    </label>
                    <select
                      {...register("instructor")}
                      className="input-field text-sm"
                    >
                      <option value="">Select instructor</option>
                      {instructorsData?.map((i) => (
                        <option key={i._id} value={i._id}>
                          {i.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 mb-1 block">
                      Level
                    </label>
                    <select
                      {...register("level")}
                      className="input-field text-sm"
                    >
                      {[
                        "beginner",
                        "intermediate",
                        "advanced",
                        "all-levels",
                      ].map((l) => (
                        <option key={l} value={l} className="capitalize">
                          {l}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 mb-1 block">
                      Age Group
                    </label>
                    <input
                      {...register("ageGroup")}
                      className="input-field text-sm"
                      placeholder="e.g. 6-12 years"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 mb-1 block">
                      Max Students
                    </label>
                    <input
                      {...register("maxStudents")}
                      type="number"
                      className="input-field text-sm"
                      min={1}
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 mb-1 block">
                      Duration (mins)
                    </label>
                    <input
                      {...register("duration")}
                      type="number"
                      className="input-field text-sm"
                      min={15}
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 mb-1 block">
                      Monthly Fee (₹)
                    </label>
                    <input
                      {...register("fees.monthly")}
                      type="number"
                      className="input-field text-sm"
                      min={0}
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 mb-1 block">
                      Quarterly Fee (₹)
                    </label>
                    <input
                      {...register("fees.quarterly")}
                      type="number"
                      className="input-field text-sm"
                      min={0}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-xs text-gray-400 mb-1 block">
                      Yearly Fee (₹)
                    </label>
                    <input
                      {...register("fees.yearly")}
                      type="number"
                      className="input-field text-sm"
                      min={0}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-xs text-gray-400 mb-1 block">
                      Description
                    </label>
                    <textarea
                      {...register("description")}
                      className="input-field text-sm resize-none h-20"
                      placeholder="Brief description"
                    />
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
                    {modal === "create" ? "Create" : "Save Changes"}
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

export default Classes;
