import { useQuery } from "@tanstack/react-query";
import { Award } from "lucide-react";
import { motion } from "framer-motion";
import api from "../../services/api";
import LoadingSpinner from "../../components/common/LoadingSpinner";

const badgeColors = {
  bronze: "from-amber-700 to-amber-500",
  silver: "from-gray-400 to-gray-300",
  gold: "from-yellow-500 to-yellow-300",
  platinum: "from-cyan-400 to-teal-300",
  diamond: "from-blue-400 to-indigo-300",
};
const badgeBorder = {
  bronze: "border-amber-600/40",
  silver: "border-gray-400/40",
  gold: "border-yellow-400/40",
  platinum: "border-cyan-400/40",
  diamond: "border-blue-400/40",
};

const StudentAchievements = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["my-achievements"],
    queryFn: () =>
      api.get("/achievements/my").then((r) => r.data.data.achievements),
  });

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold text-white">My Achievements</h1>
      {data?.length === 0 ? (
        <div className="card py-16 text-center">
          <Award size={48} className="text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400 mb-1">No achievements yet</p>
          <p className="text-gray-500 text-sm">
            Keep dancing — awards are on their way!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {data?.map((a, i) => (
            <motion.div
              key={a._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`card border ${badgeBorder[a.badge] || "border-white/10"} relative overflow-hidden`}
            >
              <div
                className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl ${badgeColors[a.badge] || badgeColors.gold} opacity-10 rounded-bl-full`}
              />
              <div
                className={`w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-br ${badgeColors[a.badge] || badgeColors.gold} flex items-center justify-center`}
              >
                <Award size={24} className="text-white" />
              </div>
              <h3 className="font-bold text-white text-center">{a.title}</h3>
              <span
                className={`block text-center text-xs capitalize font-medium mt-1 bg-gradient-to-r ${badgeColors[a.badge]} bg-clip-text text-transparent`}
              >
                {a.badge} badge
              </span>
              {a.description && (
                <p className="text-xs text-gray-400 text-center mt-2">
                  {a.description}
                </p>
              )}
              <div className="flex justify-center gap-2 mt-3 flex-wrap">
                <span className="badge text-xs bg-dark-600 text-gray-300 capitalize">
                  {a.type}
                </span>
                <span className="badge text-xs bg-dark-600 text-gray-400">
                  {new Date(a.achievedDate).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentAchievements;
