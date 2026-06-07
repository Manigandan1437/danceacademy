import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import api from "../../services/api";
import toast from "react-hot-toast";
import LoadingSpinner from "../../components/common/LoadingSpinner";

const days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const Schedule = () => {
  const qc = useQueryClient();
  const [modal, setModal] = useState(null);
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { isSubmitting },
  } = useForm();

  const { data: schedules, isLoading } = useQuery({
    queryKey: ["admin-schedules"],
    queryFn: () => api.get("/schedules").then((r) => r.data.data),
  });
  const { data: classes } = useQuery({
    queryKey: ["admin-classes-list2"],
    queryFn: () =>
      api.get("/classes?limit=100").then((r) => r.data.data.classes),
  });

  const createMutation = useMutation({
    mutationFn: (d) => api.post("/schedules", d),
    onSuccess: () => {
      qc.invalidateQueries(["admin-schedules"]);
      toast.success("Schedule created");
      setModal(null);
      reset();
    },
    onError: (e) => toast.error(e.response?.data?.message || "Error"),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => api.put(`/schedules/${id}`, data),
    onSuccess: () => {
      qc.invalidateQueries(["admin-schedules"]);
      toast.success("Updated");
      setModal(null);
      reset();
    },
    onError: (e) => toast.error(e.response?.data?.message || "Error"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/schedules/${id}`),
    onSuccess: () => {
      qc.invalidateQueries(["admin-schedules"]);
      toast.success("Deleted");
    },
  });

  const openEdit = (s) => {
    setModal(s);
    setTimeout(() => {
      setValue("class", s.class?._id || s.class);
      setValue("startTime", s.startTime);
      setValue("endTime", s.endTime);
      setValue("room", s.room || "");
      s.dayOfWeek?.forEach((d, i) => setValue(`dayOfWeek[${i}]`, d));
    }, 50);
  };

  const onSubmit = (data) => {
    const days = Array.isArray(data.dayOfWeek)
      ? data.dayOfWeek.filter(Boolean)
      : [data.dayOfWeek].filter(Boolean);
    const payload = { ...data, dayOfWeek: days };
    if (modal === "create") createMutation.mutate(payload);
    else updateMutation.mutate({ id: modal._id, data: payload });
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Schedules</h1>
        <button
          onClick={() => {
            setModal("create");
            reset();
          }}
          className="btn-primary text-sm flex items-center gap-2"
        >
          <Plus size={16} /> Add Schedule
        </button>
      </div>

      <div className="card overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] text-sm">
            <thead className="bg-dark-700/50">
              <tr>
                {["Class", "Days", "Time", "Room", "Active", "Actions"].map(
                  (h) => (
                    <th
                      key={h}
                      className="text-left px-4 py-3 text-xs text-gray-400 font-medium"
                    >
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {schedules?.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-gray-500">
                    No schedules found
                  </td>
                </tr>
              ) : (
                schedules?.map((s) => (
                  <tr
                    key={s._id}
                    className="hover:bg-white/3 transition-colors"
                  >
                    <td className="px-4 py-3 text-white font-medium">
                      {s.class?.name || "—"}
                    </td>
                    <td className="px-4 py-3 text-gray-400 text-xs">
                      {s.dayOfWeek?.join(", ")}
                    </td>
                    <td className="px-4 py-3 text-gray-300">
                      {s.startTime} – {s.endTime}
                    </td>
                    <td className="px-4 py-3 text-gray-400">{s.room || "—"}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`badge text-xs ${s.isActive ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}
                      >
                        {s.isActive ? "Yes" : "No"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => openEdit(s)}
                          className="p-1.5 hover:bg-white/10 rounded-lg"
                        >
                          <Pencil size={14} className="text-primary-400" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm("Delete schedule?"))
                              deleteMutation.mutate(s._id);
                          }}
                          className="p-1.5 hover:bg-red-500/10 rounded-lg"
                        >
                          <Trash2 size={14} className="text-red-400" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
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
                  {modal === "create" ? "New Schedule" : "Edit Schedule"}
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
                    Class
                  </label>
                  <select
                    {...register("class", { required: true })}
                    className="input-field text-sm"
                  >
                    <option value="">Select class</option>
                    {classes?.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-2 block">
                    Days
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {days.map((d, i) => (
                      <label
                        key={d}
                        className="flex items-center gap-1.5 text-xs text-gray-300 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          value={d}
                          {...register("dayOfWeek")}
                          className="accent-primary-500"
                        />
                        {d.slice(0, 3)}
                      </label>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-gray-400 mb-1 block">
                      Start Time
                    </label>
                    <input
                      {...register("startTime", { required: true })}
                      type="time"
                      className="input-field text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 mb-1 block">
                      End Time
                    </label>
                    <input
                      {...register("endTime", { required: true })}
                      type="time"
                      className="input-field text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">
                    Room
                  </label>
                  <input
                    {...register("room")}
                    className="input-field text-sm"
                    placeholder="e.g. Studio A"
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

export default Schedule;
