import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Image, Video, X, Play, ChevronLeft, ChevronRight } from "lucide-react";
import api from "../../services/api";
import LoadingSpinner from "../../components/common/LoadingSpinner";

const Gallery = () => {
  const [activeType, setActiveType] = useState("");
  const [activeCategory, setActiveCategory] = useState("");
  const [lightboxItem, setLightboxItem] = useState(null);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const { data, isLoading } = useQuery({
    queryKey: ["gallery", activeType, activeCategory],
    queryFn: () =>
      api
        .get("/gallery", {
          params: {
            limit: 48,
            type: activeType || undefined,
            category: activeCategory || undefined,
          },
        })
        .then((r) => r.data.data),
  });

  const items = data?.items || [];

  const openLightbox = (item, index) => {
    setLightboxItem(item);
    setLightboxIndex(index);
  };

  const navigate = (dir) => {
    const next = lightboxIndex + dir;
    if (next >= 0 && next < items.length) {
      setLightboxItem(items[next]);
      setLightboxIndex(next);
    }
  };

  return (
    <div className="pt-20 min-h-screen">
      <section className="py-16 bg-dark-800/30 border-b border-white/5">
        <div className="page-container text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display text-4xl md:text-5xl font-bold text-white mb-4"
          >
            Our <span className="gradient-text">Gallery</span>
          </motion.h1>
          <p className="text-gray-400 max-w-xl mx-auto">
            Moments of grace, passion, and artistic brilliance captured forever
          </p>
        </div>
      </section>

      <div className="page-container py-10">
        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-8 justify-center">
          {[
            { label: "All", value: "" },
            { label: "Images", value: "image" },
            { label: "Videos", value: "video" },
          ].map((f) => (
            <button
              key={f.value}
              onClick={() => setActiveType(f.value)}
              className={`badge px-4 py-2 cursor-pointer transition-all ${activeType === f.value ? "bg-primary-500/20 text-primary-400 border border-primary-500/40" : "bg-dark-700 text-gray-400 border border-white/10 hover:border-primary-500/30"}`}
            >
              {f.label}
            </button>
          ))}
          {["performance", "class", "event", "students", "facility"].map(
            (cat) => (
              <button
                key={cat}
                onClick={() =>
                  setActiveCategory(activeCategory === cat ? "" : cat)
                }
                className={`badge px-4 py-2 cursor-pointer capitalize transition-all ${activeCategory === cat ? "bg-primary-500/20 text-primary-400 border border-primary-500/40" : "bg-dark-700 text-gray-400 border border-white/10 hover:border-primary-500/30"}`}
              >
                {cat}
              </button>
            ),
          )}
        </div>

        {isLoading ? (
          <LoadingSpinner />
        ) : items.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <Image size={48} className="mx-auto mb-4 opacity-30" />
            <p>No gallery items yet</p>
          </div>
        ) : (
          <motion.div className="columns-2 sm:columns-3 lg:columns-4 gap-2 sm:gap-3 space-y-2 sm:space-y-3">
            {items.map((item, i) => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.02 }}
                className="break-inside-avoid relative group cursor-pointer overflow-hidden rounded-xl"
                onClick={() => openLightbox(item, i)}
              >
                {item.type === "image" ? (
                  <img
                    src={item.url}
                    alt={item.title}
                    className="w-full object-cover group-hover:scale-105 transition-transform duration-500 rounded-xl"
                  />
                ) : (
                  <div className="relative bg-dark-700 aspect-video rounded-xl flex items-center justify-center">
                    {item.thumbnail ? (
                      <img
                        src={item.thumbnail}
                        alt={item.title}
                        className="w-full h-full object-cover rounded-xl"
                      />
                    ) : (
                      <Video size={32} className="text-primary-500/50" />
                    )}
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                      <Play size={28} className="text-white" />
                    </div>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity rounded-xl flex items-end p-3">
                  <p className="text-white text-xs font-medium line-clamp-1">
                    {item.title || item.category}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-2 sm:p-4"
            onClick={() => setLightboxItem(null)}
          >
            <button
              className="absolute top-3 right-3 p-3 glass rounded-full text-white hover:text-primary-400 transition-colors touch-manipulation z-10"
              onClick={() => setLightboxItem(null)}
            >
              <X size={22} />
            </button>
            {lightboxIndex > 0 && (
              <button
                className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 p-3 glass rounded-full text-white hover:text-primary-400 transition-colors touch-manipulation z-10"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(-1);
                }}
              >
                <ChevronLeft size={22} />
              </button>
            )}
            {lightboxIndex < items.length - 1 && (
              <button
                className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 p-3 glass rounded-full text-white hover:text-primary-400 transition-colors touch-manipulation z-10"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(1);
                }}
              >
                <ChevronRight size={22} />
              </button>
            )}
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="max-w-4xl max-h-[90vh] w-full"
              onClick={(e) => e.stopPropagation()}
            >
              {lightboxItem.type === "image" ? (
                <img
                  src={lightboxItem.url}
                  alt={lightboxItem.title}
                  className="w-full h-full max-h-[80vh] object-contain rounded-xl"
                />
              ) : (
                <video
                  src={lightboxItem.url}
                  controls
                  autoPlay
                  className="w-full rounded-xl max-h-[80vh]"
                />
              )}
              {lightboxItem.title && (
                <p className="text-center text-gray-300 mt-3 text-sm">
                  {lightboxItem.title}
                </p>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Gallery;
