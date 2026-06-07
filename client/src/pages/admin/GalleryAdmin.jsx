import { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Upload, Trash2, Image, Video, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../services/api";
import toast from "react-hot-toast";
import LoadingSpinner from "../../components/common/LoadingSpinner";

const GalleryAdmin = () => {
  const qc = useQueryClient();
  const fileRef = useRef();
  const [filter, setFilter] = useState("all");
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(null);

  const { data: items, isLoading } = useQuery({
    queryKey: ["admin-gallery", filter],
    queryFn: () =>
      api
        .get("/gallery", {
          params: { type: filter !== "all" ? filter : undefined, limit: 50 },
        })
        .then((r) => r.data.data.items),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/gallery/${id}`),
    onSuccess: () => {
      qc.invalidateQueries(["admin-gallery"]);
      toast.success("Deleted");
    },
    onError: () => toast.error("Failed to delete"),
  });

  const handleUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setUploading(true);
    try {
      for (const file of files) {
        const fd = new FormData();
        fd.append("file", file);
        fd.append("title", file.name.replace(/\.[^/.]+$/, ""));
        fd.append("type", file.type.startsWith("video") ? "video" : "image");
        fd.append("category", "general");
        await api.post("/gallery/upload", fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }
      qc.invalidateQueries(["admin-gallery"]);
      toast.success(`Uploaded ${files.length} file(s)`);
    } catch {
      toast.error("Some uploads failed");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Gallery</h1>
        <button
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="btn-primary text-sm flex items-center gap-2"
        >
          <Upload size={16} /> {uploading ? "Uploading..." : "Upload"}
        </button>
        <input
          ref={fileRef}
          type="file"
          multiple
          accept="image/*,video/*"
          className="hidden"
          onChange={handleUpload}
        />
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2">
        {["all", "image", "video"].map((t) => (
          <button
            key={t}
            onClick={() => setFilter(t)}
            className={`px-4 py-1.5 rounded-lg text-sm capitalize transition-colors ${filter === t ? "bg-primary-500 text-white" : "glass text-gray-400 hover:text-white"}`}
          >
            {t === "all" ? (
              "All"
            ) : t === "image" ? (
              <span className="flex items-center gap-1.5">
                <Image size={14} />
                Images
              </span>
            ) : (
              <span className="flex items-center gap-1.5">
                <Video size={14} />
                Videos
              </span>
            )}
          </button>
        ))}
      </div>

      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {items?.length === 0 ? (
            <div className="col-span-4 py-16 text-center text-gray-500">
              No items. Upload some!
            </div>
          ) : (
            items?.map((item) => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="relative group rounded-xl overflow-hidden bg-dark-700 aspect-square cursor-pointer"
                onClick={() => setPreview(item)}
              >
                {item.type === "image" ? (
                  <img
                    src={item.url}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    {item.thumbnail ? (
                      <img
                        src={item.thumbnail}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Video size={32} className="text-gray-500" />
                    )}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-10 h-10 rounded-full bg-black/60 flex items-center justify-center">
                        ▶
                      </div>
                    </div>
                  </div>
                )}
                <div className="absolute inset-0 bg-black/50 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (window.confirm("Delete this item?"))
                        deleteMutation.mutate(item._id);
                    }}
                    className="p-2 bg-red-500/80 rounded-full"
                  >
                    <Trash2 size={16} className="text-white" />
                  </button>
                </div>
                <div className="absolute bottom-0 left-0 right-0 px-2 py-1 bg-gradient-to-t from-black/80 text-xs text-white truncate">
                  {item.title}
                </div>
              </motion.div>
            ))
          )}
        </div>
      )}

      {/* Lightbox */}
      <AnimatePresence>
        {preview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            onClick={() => setPreview(null)}
          >
            <button className="absolute top-4 right-4 p-2 glass rounded-full z-10">
              <X size={20} className="text-white" />
            </button>
            {preview.type === "image" ? (
              <img
                src={preview.url}
                alt={preview.title}
                className="max-w-full max-h-[85vh] rounded-xl object-contain"
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <video
                src={preview.url}
                controls
                className="max-w-full max-h-[85vh] rounded-xl"
                onClick={(e) => e.stopPropagation()}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GalleryAdmin;
