import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { BookOpen, Calendar, CreditCard } from "lucide-react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import LoadingSpinner from "../../components/common/LoadingSpinner";

const StudentDashboard = () => {
  const { user } = useAuth();

  const { data: enrollments, isLoading: loadingEnroll } = useQuery({
    queryKey: ["my-enrollments"],
    queryFn: () => api.get("/enrollments/my").then((r) => r.data.data),
  });

  const { data: paymentsData } = useQuery({
    queryKey: ["my-payments"],
    queryFn: () => api.get("/payments/my").then((r) => r.data.data),
  });

  const approved = enrollments?.filter((e) => e.status === "approved") || [];
  const completedPayments = Array.isArray(paymentsData)
    ? paymentsData.filter((p) => p.status === "completed").length
    : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">
          Welcome, {user?.name?.split(" ")[0]}! 👋
        </h1>
        <p className="text-gray-400 text-sm mt-1">
          Here's your learning journey at a glance.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            icon: BookOpen,
            label: "Enrolled Classes",
            value: approved.length,
            color: "bg-primary-500/80",
            link: "/student/classes",
          },
          {
            icon: Calendar,
            label: "Pending Enrollments",
            value:
              enrollments?.filter((e) => e.status === "pending").length || 0,
            color: "bg-amber-500/80",
            link: "/student/classes",
          },
          {
            icon: CreditCard,
            label: "Payments",
            value: completedPayments,
            color: "bg-emerald-500/80",
            link: "/student/payments",
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

      {/* Active Classes */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-white">My Classes</h2>
          <Link
            to="/student/classes"
            className="text-primary-400 text-xs hover:underline"
          >
            View all
          </Link>
        </div>
        {loadingEnroll ? (
          <LoadingSpinner />
        ) : approved.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-400 text-sm mb-3">
              You're not enrolled in any class yet.
            </p>
            <Link to="/classes" className="btn-primary text-sm">
              Browse Classes
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {approved.slice(0, 4).map((e) => (
              <div
                key={e._id}
                className="p-3 bg-white/3 rounded-xl hover:bg-white/5 transition-colors"
              >
                <h3 className="text-white text-sm font-medium">
                  {e.class?.name}
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  {e.class?.instructor?.name || "Instructor TBD"}
                </p>
                <div className="flex gap-2 mt-2">
                  <span className="badge text-xs bg-green-500/20 text-green-400">
                    Active
                  </span>
                  <span className="badge text-xs bg-dark-600 text-gray-300 capitalize">
                    {e.feePlan}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default StudentDashboard;
