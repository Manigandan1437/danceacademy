import { useQuery } from "@tanstack/react-query";
import { BookOpen, Users, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import LoadingSpinner from "../../components/common/LoadingSpinner";

const InstructorDashboard = () => {
  const { user } = useAuth();

  const { data: classes, isLoading } = useQuery({
    queryKey: ["instructor-classes"],
    queryFn: () => api.get("/classes/instructor/my").then((r) => r.data.data),
  });

  const { data: schedules } = useQuery({
    queryKey: ["instructor-schedules"],
    queryFn: () => api.get("/schedules").then((r) => r.data.data),
  });

  const totalStudents =
    classes?.reduce((s, c) => s + (c.enrolledCount || 0), 0) || 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">
          Welcome, {user?.name?.split(" ")[0]}! 👋
        </h1>
        <p className="text-gray-400 text-sm mt-1">
          Here's your teaching overview.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          {
            icon: BookOpen,
            label: "My Classes",
            value: classes?.length || 0,
            color: "bg-primary-500/80",
            link: "/instructor/classes",
          },
          {
            icon: Users,
            label: "Total Students",
            value: totalStudents,
            color: "bg-blue-500/80",
            link: "/instructor/attendance",
          },
          {
            icon: Calendar,
            label: "Active Schedules",
            value: schedules?.filter((s) => s.isActive)?.length || 0,
            color: "bg-green-500/80",
            link: "/instructor/attendance",
          },
        ].map(({ icon: Icon, label, value, color, link }) => (
          <motion.div
            key={label}
            whileHover={{ scale: 1.02 }}
            className="card-hover"
          >
            <Link to={link} className="block">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-xs mb-1">{label}</p>
                  <p className="text-2xl font-bold text-white">{value}</p>
                </div>
                <div
                  className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center`}
                >
                  <Icon size={18} className="text-white" />
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-white">My Classes</h2>
            <Link
              to="/instructor/classes"
              className="text-primary-400 text-xs hover:underline"
            >
              View all
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {classes?.slice(0, 4).map((c) => (
              <div
                key={c._id}
                className="p-3 bg-white/3 rounded-xl hover:bg-white/5 transition-colors"
              >
                <h3 className="text-white text-sm font-medium">{c.name}</h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  {c.danceStyle?.name} · {c.level}
                </p>
                <p className="text-xs text-primary-400 mt-1">
                  {c.enrolledCount}/{c.maxStudents} students
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default InstructorDashboard;
