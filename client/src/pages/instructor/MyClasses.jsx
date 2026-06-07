import { useQuery } from "@tanstack/react-query";
import { BookOpen } from "lucide-react";
import { motion } from "framer-motion";
import api from "../../services/api";
import LoadingSpinner from "../../components/common/LoadingSpinner";

const InstructorMyClasses = () => {
  const { data: classes, isLoading } = useQuery({
    queryKey: ["instructor-classes"],
    queryFn: () => api.get("/classes/instructor/my").then((r) => r.data.data),
  });

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold text-white">My Classes</h1>
      {classes?.length === 0 ? (
        <div className="card py-16 text-center">
          <BookOpen size={40} className="text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400">
            No classes assigned yet. Contact admin.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {classes?.map((c, i) => (
            <motion.div
              key={c._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="card-hover group"
            >
              <div className="h-28 bg-gradient-to-br from-primary-900/40 to-dark-700 rounded-lg mb-3 flex items-center justify-center text-3xl overflow-hidden">
                {c.thumbnail ? (
                  <img
                    src={c.thumbnail}
                    className="w-full h-full object-cover"
                    alt={c.name}
                  />
                ) : (
                  "💃"
                )}
              </div>
              <h3 className="font-semibold text-white text-sm">{c.name}</h3>
              <p className="text-xs text-gray-400 mt-1">
                {c.danceStyle?.name} ·{" "}
                <span className="capitalize">{c.level}</span>
              </p>
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-primary-400">
                  {c.enrolledCount}/{c.maxStudents} students
                </span>
                <span className="text-xs text-gray-500">{c.duration} mins</span>
              </div>
              <p className="text-xs text-emerald-400 mt-1">
                ₹{c.fees?.monthly}/mo
              </p>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InstructorMyClasses;
