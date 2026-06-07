import { useState } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Search, Filter, Music2, Users, Clock } from "lucide-react";
import api from "../../services/api";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { Link } from "react-router-dom";

const Classes = () => {
  const [search, setSearch] = useState("");
  const [level, setLevel] = useState("");
  const [ageGroup, setAgeGroup] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["public-classes", level, ageGroup],
    queryFn: () =>
      api
        .get("/classes", {
          params: {
            isActive: true,
            limit: 50,
            level: level || undefined,
            ageGroup: ageGroup || undefined,
          },
        })
        .then((r) => r.data.data),
  });

  const { data: stylesData } = useQuery({
    queryKey: ["dance-styles"],
    queryFn: () => api.get("/dance-styles").then((r) => r.data.data),
  });

  const classes = (data?.classes || []).filter(
    (c) => !search || c.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="pt-20 min-h-screen">
      {/* Header */}
      <section className="py-16 bg-dark-800/30 border-b border-white/5">
        <div className="page-container text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display text-4xl md:text-5xl font-bold text-white mb-4"
          >
            Our <span className="gradient-text">Classes</span>
          </motion.h1>
          <p className="text-gray-400 max-w-xl mx-auto">
            Find your perfect dance class from our wide range of styles and
            levels
          </p>
        </div>
      </section>

      <div className="page-container py-10">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <div className="relative flex-1">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
            />
            <input
              className="input-field pl-9 text-sm"
              placeholder="Search classes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select
            className="input-field text-sm sm:max-w-[180px]"
            value={level}
            onChange={(e) => setLevel(e.target.value)}
          >
            <option value="">All Levels</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
          <select
            className="input-field text-sm sm:max-w-[180px]"
            value={ageGroup}
            onChange={(e) => setAgeGroup(e.target.value)}
          >
            <option value="">All Ages</option>
            <option value="kids">Kids</option>
            <option value="teens">Teens</option>
            <option value="adults">Adults</option>
            <option value="seniors">Seniors</option>
          </select>
        </div>

        {/* Dance Styles Tags */}
        {stylesData && (
          <div className="flex gap-2 flex-wrap mb-8">
            {stylesData.map((style) => (
              <span
                key={style._id}
                className="badge bg-dark-700 border border-white/10 text-gray-300 cursor-pointer hover:border-primary-500/40 hover:text-primary-400 transition-colors"
              >
                {style.name}
              </span>
            ))}
          </div>
        )}

        {/* Classes Grid */}
        {isLoading ? (
          <LoadingSpinner />
        ) : classes.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            No classes found
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {classes.map((cls, i) => (
              <motion.div
                key={cls._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="card-hover group"
              >
                <div className="h-48 rounded-xl overflow-hidden bg-gradient-to-br from-primary-900/30 to-dark-700 mb-4 relative">
                  {cls.thumbnail ? (
                    <img
                      src={cls.thumbnail}
                      alt={cls.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <Music2 size={48} className="text-primary-500/30" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-dark-900/70 to-transparent" />
                  <div className="absolute bottom-3 left-3 flex gap-2">
                    <span className="badge bg-primary-500/20 text-primary-300 border border-primary-500/20 capitalize text-xs">
                      {cls.level}
                    </span>
                    <span className="badge bg-black/40 text-gray-300 text-xs capitalize">
                      {cls.ageGroup}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="font-semibold text-white group-hover:text-primary-400 transition-colors">
                    {cls.name}
                  </h3>
                  {cls.danceStyle && (
                    <span className="badge bg-dark-700 border border-white/10 text-gray-400 text-xs">
                      {cls.danceStyle.name}
                    </span>
                  )}
                  <p className="text-gray-400 text-sm line-clamp-2">
                    {cls.description}
                  </p>

                  <div className="flex items-center gap-4 text-xs text-gray-500 pt-1">
                    <span className="flex items-center gap-1">
                      <Clock size={12} /> {cls.duration} min
                    </span>
                    <span className="flex items-center gap-1">
                      <Users size={12} /> Max {cls.maxStudents}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-white/5">
                    <div>
                      <span className="text-primary-400 font-bold">
                        ₹{cls.fees?.monthly}
                      </span>
                      <span className="text-gray-500 text-xs">/month</span>
                    </div>
                    <Link
                      to="/register"
                      className="btn-primary text-xs px-4 py-2"
                    >
                      Enroll Now
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Classes;
