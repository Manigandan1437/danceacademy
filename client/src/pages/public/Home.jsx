import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import {
  ArrowRight,
  Star,
  Users,
  Award,
  Music2,
  ChevronDown,
  Play,
  Sparkles,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import api from "../../services/api";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: "easeOut" },
  }),
};

const stats = [
  { icon: Users, value: "500+", label: "Students Trained" },
  { icon: Award, value: "50+", label: "Awards Won" },
  { icon: Music2, value: "15+", label: "Dance Styles" },
  { icon: Star, value: "10+", label: "Years of Excellence" },
];

const DanceParticle = ({ style }) => (
  <motion.div
    className="absolute w-2 h-2 bg-primary-500 rounded-full opacity-30"
    style={style}
    animate={{ y: [0, -100, 0], opacity: [0.3, 0.8, 0.3], scale: [1, 1.5, 1] }}
    transition={{
      duration: 4 + Math.random() * 4,
      repeat: Infinity,
      delay: Math.random() * 3,
    }}
  />
);

const Home = () => {
  const { data: classesData } = useQuery({
    queryKey: ["classes-preview"],
    queryFn: () =>
      api.get("/classes?isActive=true&limit=6").then((r) => r.data.data),
  });

  const { data: announcementsData } = useQuery({
    queryKey: ["public-announcements"],
    queryFn: () => api.get("/announcements").then((r) => r.data.data),
  });

  const statsRef = useRef(null);
  const statsInView = useInView(statsRef, { once: true });

  const particles = Array.from({ length: 12 }, (_, i) => ({
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
  }));

  return (
    <div className="overflow-hidden">
      {/* ─── Hero ─── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900" />
        <div className="absolute inset-0 bg-radial-purple" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary-700/20 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-20 right-10 w-96 h-96 bg-primary-900/30 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />

        {/* Floating particles */}
        {particles.map((p, i) => (
          <DanceParticle key={i} style={p} />
        ))}

        <div className="relative z-10 page-container text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full text-sm text-primary-300 mb-8 border-primary-500/30"
          >
            <Sparkles size={14} className="text-primary-400" />
            Where Passion Meets Rhythm
            <Sparkles size={14} className="text-primary-400" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-tight mb-6"
          >
            <span className="text-white">Dance Your</span>
            <br />
            <span className="gradient-text">Story</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Discover the art of movement at Rhythm Dance Academy. From classical
            forms to contemporary fusion, unlock your potential under
            world-class instructors.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              to="/register"
              className="btn-primary flex items-center gap-2 text-base px-8 py-3 animate-glow"
            >
              Start Your Journey <ArrowRight size={18} />
            </Link>
            <Link
              to="/classes"
              className="btn-outline flex items-center gap-2 text-base px-8 py-3"
            >
              <Play size={18} /> Explore Classes
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="absolute bottom-6 left-1/2 -translate-x-1/2 hidden sm:block"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-gray-500"
            >
              <ChevronDown size={24} />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ─── Stats ─── */}
      <section
        ref={statsRef}
        className="py-16 bg-dark-800/50 border-y border-white/5"
      >
        <div className="page-container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={statsInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  className="text-center"
                >
                  <div className="w-12 h-12 mx-auto mb-3 bg-primary-500/10 border border-primary-500/20 rounded-xl flex items-center justify-center">
                    <Icon size={22} className="text-primary-400" />
                  </div>
                  <p className="font-display text-3xl font-bold gradient-text">
                    {stat.value}
                  </p>
                  <p className="text-gray-400 text-sm mt-1">{stat.label}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── Featured Classes ─── */}
      <section className="py-20">
        <div className="page-container">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <p className="text-primary-400 text-sm font-semibold uppercase tracking-widest mb-3">
              What We Offer
            </p>
            <h2 className="section-title text-white mb-4">
              Explore Our <span className="gradient-text">Classes</span>
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto">
              From beginners to advanced dancers, we have a program perfectly
              tailored for every level and age group.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {(classesData?.classes || dummyClasses).map((cls, i) => (
              <motion.div
                key={cls._id || i}
                variants={fadeUp}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="card-hover group cursor-pointer"
              >
                <div className="h-44 rounded-xl overflow-hidden bg-gradient-to-br from-primary-900/40 to-dark-700 mb-4 relative">
                  {cls.thumbnail ? (
                    <img
                      src={cls.thumbnail}
                      alt={cls.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Music2 size={40} className="text-primary-500/50" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-dark-900/80 to-transparent" />
                  <span className="absolute bottom-3 left-3 badge bg-primary-500/20 text-primary-300 border border-primary-500/30 capitalize">
                    {cls.level || "All Levels"}
                  </span>
                </div>
                <h3 className="font-semibold text-white mb-1 group-hover:text-primary-400 transition-colors">
                  {cls.name}
                </h3>
                <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                  {cls.description || "Experience the joy of dance."}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-primary-400 font-bold">
                    ₹{cls.fees?.monthly || "---"}
                    <span className="text-gray-500 font-normal text-xs">
                      /month
                    </span>
                  </span>
                  <span className="text-gray-500 text-xs">
                    {cls.instructor?.name || "Expert Instructor"}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              to="/classes"
              className="btn-outline inline-flex items-center gap-2"
            >
              View All Classes <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Why Choose Us ─── */}
      <section className="py-20 bg-dark-800/30">
        <div className="page-container">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2 className="section-title text-white mb-4">
              Why Choose <span className="gradient-text">Rhythm?</span>
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: "Expert Instructors",
                desc: "Learn from nationally certified dancers with 10+ years of teaching experience.",
                icon: "🎭",
              },
              {
                title: "All Age Groups",
                desc: "Classes for kids, teens, adults, and seniors. Dance knows no age limit.",
                icon: "👨‍👩‍👧‍👦",
              },
              {
                title: "Flexible Batches",
                desc: "Morning, evening, and weekend batches to fit your busy schedule.",
                icon: "⏰",
              },
              {
                title: "State-of-Art Studio",
                desc: "Spacious, air-conditioned studios with professional sound systems and mirrors.",
                icon: "🏛️",
              },
              {
                title: "Performance Opportunities",
                desc: "Regular recitals, competitions, and cultural events to showcase your talent.",
                icon: "🏆",
              },
              {
                title: "Online Tracking",
                desc: "Monitor your progress, attendance, and achievements through our portal.",
                icon: "📱",
              },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                variants={fadeUp}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="card-hover"
              >
                <span className="text-3xl block mb-3">{item.icon}</span>
                <h3 className="font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="py-20">
        <div className="page-container">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="relative glass rounded-3xl p-6 sm:p-10 md:p-16 text-center overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary-900/30 to-transparent rounded-3xl" />
            <div className="absolute top-0 right-0 w-72 h-72 bg-primary-600/10 rounded-full blur-3xl" />
            <div className="relative z-10">
              <p className="text-primary-400 font-semibold mb-3 uppercase tracking-widest text-sm">
                Limited Seats Available
              </p>
              <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
                Begin Your Dance Journey{" "}
                <span className="gradient-text">Today</span>
              </h2>
              <p className="text-gray-400 max-w-lg mx-auto mb-8">
                Register now and get a free trial class. No experience needed —
                just bring your enthusiasm!
              </p>
              <Link
                to="/register"
                className="btn-primary inline-flex items-center gap-2 text-base px-10 py-3"
              >
                Register for Free Trial <ArrowRight size={18} />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

const dummyClasses = [
  {
    _id: "1",
    name: "Bharatanatyam",
    description:
      "Ancient Indian classical dance form from Tamil Nadu with expressive gestures.",
    level: "beginner",
    fees: { monthly: 1500 },
  },
  {
    _id: "2",
    name: "Hip-Hop Fusion",
    description:
      "High-energy street dance style blending hip-hop with contemporary moves.",
    level: "intermediate",
    fees: { monthly: 1200 },
  },
  {
    _id: "3",
    name: "Bollywood Dance",
    description:
      "Fun and energetic Bollywood dance incorporating various styles.",
    level: "all",
    fees: { monthly: 1000 },
  },
  {
    _id: "4",
    name: "Contemporary",
    description:
      "Expressive dance form combining elements of jazz, modern, and lyrical dance.",
    level: "advanced",
    fees: { monthly: 1800 },
  },
  {
    _id: "5",
    name: "Kathak",
    description:
      "Classical Indian dance from North India known for its intricate footwork.",
    level: "beginner",
    fees: { monthly: 1500 },
  },
  {
    _id: "6",
    name: "Ballet",
    description:
      "Elegant classical dance form emphasizing grace, poise, and technique.",
    level: "all",
    fees: { monthly: 2000 },
  },
];

export default Home;
