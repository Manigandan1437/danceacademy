import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Calendar, TrendingUp } from "lucide-react";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import LoadingSpinner from "../../components/common/LoadingSpinner";

const statusColor = {
  present: "bg-green-500/80",
  absent: "bg-red-500/80",
  late: "bg-amber-500/80",
  excused: "bg-blue-500/80",
};

const StudentAttendance = () => {
  const { user } = useAuth();

  const { data, isLoading } = useQuery({
    queryKey: ["my-attendance"],
    queryFn: () =>
      api.get(`/attendance/student/${user._id}`).then((r) => r.data.data),
  });

  const records = data?.records || [];
  const total = records.length;
  const present = records.filter(
    (r) => r.status === "present" || r.status === "late",
  ).length;
  const percentage = total > 0 ? Math.round((present / total) * 100) : 0;

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold text-white">My Attendance</h1>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="card text-center px-2">
          <p className="text-2xl sm:text-3xl font-bold text-white">{total}</p>
          <p className="text-xs text-gray-400 mt-1">Total</p>
        </div>
        <div className="card text-center px-2">
          <p className="text-2xl sm:text-3xl font-bold text-green-400">
            {present}
          </p>
          <p className="text-xs text-gray-400 mt-1">Attended</p>
        </div>
        <div className="card text-center px-2">
          <p
            className={`text-2xl sm:text-3xl font-bold ${percentage >= 75 ? "text-green-400" : percentage >= 50 ? "text-amber-400" : "text-red-400"}`}
          >
            {percentage}%
          </p>
          <p className="text-xs text-gray-400 mt-1">Rate</p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="card">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-white flex items-center gap-2">
            <TrendingUp size={15} className="text-primary-400" /> Attendance
            Rate
          </span>
          <span className="text-sm font-medium text-white">{percentage}%</span>
        </div>
        <div className="h-2 bg-dark-600 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-700 ${percentage >= 75 ? "bg-green-500" : percentage >= 50 ? "bg-amber-500" : "bg-red-500"}`}
            style={{ width: `${percentage}%` }}
          />
        </div>
        {percentage < 75 && (
          <p className="text-xs text-amber-400 mt-2">
            ⚠️ Attendance below 75% may affect progress reports.
          </p>
        )}
      </div>

      {/* Records list */}
      {isLoading ? (
        <LoadingSpinner />
      ) : records.length === 0 ? (
        <div className="card py-12 text-center text-gray-500">
          No attendance records yet
        </div>
      ) : (
        <div className="card overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[450px] text-sm">
              <thead className="bg-dark-700/50">
                <tr>
                  {["Date", "Class", "Status", "Note"].map((h) => (
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
                {records.map((r, i) => (
                  <tr key={i} className="hover:bg-white/3 transition-colors">
                    <td className="px-4 py-3 text-gray-300 text-xs">
                      {new Date(r.date).toLocaleDateString("en-IN", {
                        weekday: "short",
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-4 py-3 text-white">
                      {r.class?.name || "—"}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`badge text-xs capitalize ${statusColor[r.status]} text-white`}
                      >
                        {r.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-400 text-xs">
                      {r.note || "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentAttendance;
