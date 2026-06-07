import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import {
  Users,
  BookOpen,
  CreditCard,
  ClipboardList,
  TrendingUp,
  Bell,
  UserCheck,
  AlertCircle,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import api from "../../services/api";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { Link } from "react-router-dom";

const StatCard = ({ icon: Icon, label, value, color, link }) => (
  <motion.div whileHover={{ scale: 1.02 }} className="card-hover !p-4">
    <Link to={link || "#"} className="block">
      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0">
          <p className="text-gray-400 text-xs mb-1 truncate">{label}</p>
          <p className="text-2xl font-bold text-white">{value ?? "—"}</p>
        </div>
        <div
          className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center shrink-0`}
        >
          <Icon size={18} className="text-white" />
        </div>
      </div>
    </Link>
  </motion.div>
);

const Dashboard = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["admin-dashboard"],
    queryFn: () => api.get("/dashboard/stats").then((r) => r.data.data),
    refetchInterval: 60000,
  });

  const chartData = [
    { name: "Students", value: data?.stats?.totalStudents || 0 },
    { name: "Classes", value: data?.stats?.totalClasses || 0 },
    { name: "Instructors", value: data?.stats?.totalInstructors || 0 },
    { name: "Pending", value: data?.stats?.pendingEnrollments || 0 },
  ];

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-gray-400 text-sm mt-1">
            Welcome back! Here's what's happening today.
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Users}
          label="Total Students"
          value={data?.stats?.totalStudents}
          color="bg-blue-500/80"
          link="/admin/students"
        />
        <StatCard
          icon={BookOpen}
          label="Active Classes"
          value={data?.stats?.totalClasses}
          color="bg-primary-500/80"
          link="/admin/classes"
        />
        <StatCard
          icon={UserCheck}
          label="Instructors"
          value={data?.stats?.totalInstructors}
          color="bg-green-500/80"
          link="/admin/instructors"
        />
        <StatCard
          icon={AlertCircle}
          label="Pending Enrollments"
          value={data?.stats?.pendingEnrollments}
          color="bg-amber-500/80"
          link="/admin/enrollments"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <StatCard
          icon={CreditCard}
          label="Monthly Revenue"
          value={`₹${data?.stats?.monthlyRevenue?.toLocaleString("en-IN") || 0}`}
          color="bg-emerald-500/80"
          link="/admin/payments"
        />
        <StatCard
          icon={TrendingUp}
          label="Total Revenue"
          value={`₹${data?.stats?.totalRevenue?.toLocaleString("en-IN") || 0}`}
          color="bg-violet-500/80"
          link="/admin/payments"
        />
      </div>

      {/* Chart + Recent */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 card">
          <h2 className="font-semibold text-white mb-5">Overview</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData} barSize={32}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 11, fill: "#9ca3af" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "#9ca3af" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  background: "#1a1a27",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 8,
                }}
                labelStyle={{ color: "#fff" }}
                itemStyle={{ color: "#22c55e" }}
              />
              <Bar
                dataKey="value"
                fill="url(#barGradient)"
                radius={[6, 6, 0, 0]}
              />
              <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#22c55e" />
                  <stop offset="100%" stopColor="#15803d" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pending Enrollments */}
        <div className="lg:col-span-2 card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-white flex items-center gap-2">
              <ClipboardList size={18} className="text-primary-400" />
              Pending Enrollments
            </h2>
            <Link
              to="/admin/enrollments"
              className="text-primary-400 text-xs hover:underline"
            >
              View all
            </Link>
          </div>
          {data?.recentEnrollments?.length === 0 ? (
            <p className="text-gray-500 text-sm py-6 text-center">
              No pending enrollments
            </p>
          ) : (
            <div className="space-y-3">
              {data?.recentEnrollments?.map((e) => (
                <div
                  key={e._id}
                  className="flex items-center gap-3 p-3 bg-white/3 rounded-xl hover:bg-white/5 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-primary-500/20 flex items-center justify-center text-sm font-semibold text-primary-400">
                    {e.student?.name?.[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white truncate">
                      {e.student?.name}
                    </p>
                    <p className="text-xs text-gray-400 truncate">
                      {e.class?.name}
                    </p>
                  </div>
                  <span className="badge bg-amber-500/20 text-amber-400 text-xs">
                    Pending
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent Payments */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-white flex items-center gap-2">
            <CreditCard size={18} className="text-primary-400" />
            Recent Payments
          </h2>
          <Link
            to="/admin/payments"
            className="text-primary-400 text-xs hover:underline"
          >
            View all
          </Link>
        </div>
        {data?.recentPayments?.length === 0 ? (
          <p className="text-gray-500 text-sm py-6 text-center">
            No payments yet
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-2 text-gray-400 font-medium text-xs">
                    Student
                  </th>
                  <th className="text-left py-2 text-gray-400 font-medium text-xs">
                    Class
                  </th>
                  <th className="text-right py-2 text-gray-400 font-medium text-xs">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {data?.recentPayments?.map((p) => (
                  <tr key={p._id}>
                    <td className="py-2.5 text-gray-300">{p.student?.name}</td>
                    <td className="py-2.5 text-gray-400">{p.class?.name}</td>
                    <td className="py-2.5 text-right text-emerald-400 font-medium">
                      ₹{p.amount}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
