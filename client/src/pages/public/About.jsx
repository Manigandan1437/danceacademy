import { motion } from "framer-motion";
import { Heart, Star, Target, Eye } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import api from "../../services/api";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6 },
  }),
};

const About = () => {
  const { data: instructors = [], isLoading: instructorsLoading } = useQuery({
    queryKey: ["public-instructors"],
    queryFn: async () => {
      const { data } = await api.get("/users/public/instructors");
      return data.data;
    },
    staleTime: 5 * 60 * 1000,
  });

  return (
    <div className="pt-20 min-h-screen">
      {/* Hero */}
      <section className="py-20 bg-dark-800/30 border-b border-white/5">
        <div className="page-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
            >
              <p className="text-primary-400 font-semibold uppercase tracking-widest text-sm mb-3">
                About Us
              </p>
              <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                A Legacy of{" "}
                <span className="gradient-text">Dance & Passion</span>
              </h1>
              <p className="text-gray-400 leading-relaxed mb-4">
                Founded over a decade ago, Rhythm Dance Academy has been the
                cornerstone of dance education in our community. We believe that
                dance is not just an art form — it's a language that transcends
                barriers and connects souls.
              </p>
              <p className="text-gray-400 leading-relaxed">
                From toddlers taking their first steps in ballet to adults
                discovering the joy of Bollywood, we welcome every dancer with
                open arms and an unwavering commitment to excellence.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="relative"
            >
              <div className="h-80 bg-gradient-to-br from-primary-900/40 to-dark-700 rounded-2xl flex items-center justify-center border border-white/10">
                <span className="text-8xl">💃</span>
              </div>
              <div className="absolute -bottom-4 -right-4 glass px-4 py-3 rounded-xl">
                <p className="text-2xl font-bold gradient-text">10+</p>
                <p className="text-xs text-gray-400">Years of Excellence</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-20">
        <div className="page-container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: Eye,
                title: "Our Vision",
                text: "To be the most celebrated center of dance excellence, nurturing world-class performers and spreading the joy of movement to every corner of society.",
              },
              {
                icon: Target,
                title: "Our Mission",
                text: "To provide professional, inclusive, and inspiring dance education that develops not just technical skill but character, confidence, and artistic expression.",
              },
              {
                icon: Heart,
                title: "Our Values",
                text: "Passion, discipline, inclusivity, creativity, and respect form the foundation of everything we do at Rhythm Dance Academy.",
              },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  variants={fadeUp}
                  custom={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="card-hover text-center"
                >
                  <div className="w-12 h-12 mx-auto mb-4 bg-primary-500/10 border border-primary-500/20 rounded-xl flex items-center justify-center">
                    <Icon size={22} className="text-primary-400" />
                  </div>
                  <h3 className="font-semibold text-white mb-3">
                    {item.title}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {item.text}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team */}
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
              Meet Our <span className="gradient-text">Master Instructors</span>
            </h2>
          </motion.div>

          {instructorsLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="card animate-pulse">
                  <div className="w-20 h-20 mx-auto mb-4 bg-dark-600 rounded-2xl" />
                  <div className="h-4 bg-dark-600 rounded w-3/4 mx-auto mb-2" />
                  <div className="h-3 bg-dark-600 rounded w-1/2 mx-auto" />
                </div>
              ))}
            </div>
          ) : instructors.length === 0 ? (
            <p className="text-center text-gray-500">
              No instructors available at the moment.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {instructors.map((instructor, i) => (
                <motion.div
                  key={instructor._id}
                  variants={fadeUp}
                  custom={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="card text-center group"
                >
                  {instructor.avatar ? (
                    <img
                      src={instructor.avatar}
                      alt={instructor.name}
                      className="w-20 h-20 mx-auto mb-4 rounded-2xl object-cover border border-white/10 group-hover:border-primary-500/30 transition-colors"
                    />
                  ) : (
                    <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-primary-900/50 to-dark-700 rounded-2xl flex items-center justify-center text-4xl border border-white/10 group-hover:border-primary-500/30 transition-colors">
                      💃
                    </div>
                  )}
                  <h3 className="font-semibold text-white">{instructor.name}</h3>
                  {instructor.specializations?.length > 0 && (
                    <p className="text-primary-400 text-sm mt-1">
                      {instructor.specializations.map((s) => s.name).join(" · ")}
                    </p>
                  )}
                  {instructor.experience > 0 && (
                    <p className="text-gray-500 text-xs mt-1">
                      {instructor.experience} yr{instructor.experience !== 1 ? "s" : ""} experience
                    </p>
                  )}
                  {instructor.bio && (
                    <p className="text-gray-400 text-xs mt-2 leading-relaxed line-clamp-2">
                      {instructor.bio}
                    </p>
                  )}
                  <div className="flex justify-center gap-1 mt-3">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <Star
                        key={j}
                        size={12}
                        className="text-gold-400 fill-gold-400"
                      />
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default About;
