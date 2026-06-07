import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Save, Users } from "lucide-react";
import api from "../../services/api";
import toast from "react-hot-toast";
import LoadingSpinner from "../../components/common/LoadingSpinner";

const statusOptions = ["present", "absent", "late", "excused"];
const statusColor = {
  present: "bg-green-500/20 text-green-400",
  absent: "bg-red-500/20 text-red-400",
  late: "bg-amber-500/20 text-amber-400",
  excused: "bg-blue-500/20 text-blue-400",
};

const InstructorAttendance = () => {
  const qc = useQueryClient();
  const [selectedClass, setSelectedClass] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [records, setRecords] = useState([]);

  const { data: classes } = useQuery({
    queryKey: ["instructor-classes"],
    queryFn: () => api.get("/classes/instructor/my").then((r) => r.data.data),
  });

  const { data: students, isLoading: loadingStudents } = useQuery({
    queryKey: ["enrolled-students-instructor", selectedClass],
    queryFn: () =>
      api
        .get(`/attendance/enrolled-students/${selectedClass}`)
        .then((r) => r.data.data),
    enabled: !!selectedClass,
  });

  const { data: existing } = useQuery({
    queryKey: ["existing-attendance-instructor", selectedClass, date],
    queryFn: () =>
      api.get(`/attendance/${selectedClass}/${date}`).then((r) => r.data.data),
    enabled: !!selectedClass && !!date,
  });

  // Reset records when class or date changes
  useEffect(() => {
    setRecords([]);
  }, [selectedClass, date]);

  // Populate records once both students and existing data are available
  useEffect(() => {
    if (!selectedClass || !students) return;
    if (existing?.records?.length) {
      setRecords(
        existing.records.map((r) => ({
          student: r.student._id || r.student,
          status: r.status,
          note: r.note || "",
        })),
      );
    } else if (existing !== undefined) {
      setRecords(
        students.map((s) => ({ student: s._id, status: "present", note: "" })),
      );
    }
  }, [students, existing, selectedClass]);

  const saveMutation = useMutation({
    mutationFn: () =>
      api.post("/attendance", { class: selectedClass, date, records }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["existing-attendance-instructor"] });
      toast.success("Attendance saved!");
    },
    onError: (e) => toast.error(e.response?.data?.message || "Error"),
  });

  const updateRecord = (id, field, value) =>
    setRecords((prev) =>
      prev.map((r) => (r.student === id ? { ...r, [field]: value } : r)),
    );

  const studentsMap = {};
  students?.forEach((s) => {
    studentsMap[s._id] = s;
  });

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold text-white">Mark Attendance</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-xs text-gray-400 mb-1.5 block">
            Select Class
          </label>
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="input-field text-sm"
          >
            <option value="">Choose your class</option>
            {classes?.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs text-gray-400 mb-1.5 block">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="input-field text-sm"
            max={new Date().toISOString().split("T")[0]}
          />
        </div>
      </div>

      {selectedClass && (
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-white flex items-center gap-2">
              <Users size={17} className="text-primary-400" /> Students
            </h2>
            <button
              onClick={() => saveMutation.mutate()}
              className="btn-primary text-sm flex items-center gap-2"
              disabled={records.length === 0 || saveMutation.isPending}
            >
              <Save size={15} /> {saveMutation.isPending ? "Saving..." : "Save"}
            </button>
          </div>

          {loadingStudents ? (
            <LoadingSpinner />
          ) : students?.length === 0 ? (
            <p className="text-gray-500 text-sm py-8 text-center">
              No enrolled students
            </p>
          ) : (
            <div className="space-y-2">
              {records.map((rec) => {
                const s = studentsMap[rec.student];
                if (!s) return null;
                return (
                  <div
                    key={rec.student}
                    className="flex items-center gap-3 p-3 bg-white/3 rounded-xl"
                  >
                    <div className="w-8 h-8 rounded-full bg-primary-500/20 flex items-center justify-center text-sm font-semibold text-primary-400 shrink-0">
                      {s.name?.[0]}
                    </div>
                    <span className="text-white text-sm flex-1">{s.name}</span>
                    <div className="flex gap-1 flex-wrap">
                      {statusOptions.map((opt) => (
                        <button
                          key={opt}
                          onClick={() =>
                            updateRecord(rec.student, "status", opt)
                          }
                          className={`px-2.5 py-1 rounded-lg text-xs capitalize transition-all ${rec.status === opt ? statusColor[opt] + " ring-1 ring-current" : "bg-white/5 text-gray-400 hover:bg-white/10"}`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default InstructorAttendance;
