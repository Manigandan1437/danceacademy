import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Clock, Send } from "lucide-react";
import toast from "react-hot-toast";

const Contact = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate submission — backend contact form can be added later
    await new Promise((r) => setTimeout(r, 1200));
    toast.success("Message sent! We'll get back to you within 24 hours.");
    setForm({ name: "", email: "", phone: "", message: "" });
    setLoading(false);
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
            Get In <span className="gradient-text">Touch</span>
          </motion.h1>
          <p className="text-gray-400 max-w-xl mx-auto">
            We'd love to hear from you. Reach out to us anytime!
          </p>
        </div>
      </section>

      <div className="page-container py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="space-y-6">
            <h2 className="font-display text-2xl font-bold text-white">
              Contact Information
            </h2>
            {[
              {
                Icon: MapPin,
                title: "Visit Us",
                text: "123 Dance Street, T. Nagar\nChennai, Tamil Nadu 600017",
              },
              {
                Icon: Phone,
                title: "Call Us",
                text: "+91 98765 43210\n+91 87654 32109",
              },
              {
                Icon: Mail,
                title: "Email Us",
                text: "info@rhythmdance.in\nadmissions@rhythmdance.in",
              },
              {
                Icon: Clock,
                title: "Working Hours",
                text: "Mon–Sat: 6:00 AM – 9:00 PM\nSun: 8:00 AM – 6:00 PM",
              },
            ].map(({ Icon, title, text }) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="flex gap-4 card"
              >
                <div className="w-10 h-10 bg-primary-500/10 border border-primary-500/20 rounded-lg flex items-center justify-center shrink-0">
                  <Icon size={18} className="text-primary-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white text-sm mb-1">
                    {title}
                  </h3>
                  <p className="text-gray-400 text-sm whitespace-pre-line">
                    {text}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="card"
          >
            <h2 className="font-display text-2xl font-bold text-white mb-6">
              Send a Message
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-400 mb-1.5 block">
                    Your Name
                  </label>
                  <input
                    className="input-field text-sm"
                    placeholder="John Doe"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1.5 block">
                    Phone
                  </label>
                  <input
                    className="input-field text-sm"
                    placeholder="9876543210"
                    value={form.phone}
                    onChange={(e) =>
                      setForm({ ...form, phone: e.target.value })
                    }
                  />
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1.5 block">
                  Email
                </label>
                <input
                  type="email"
                  className="input-field text-sm"
                  placeholder="john@example.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1.5 block">
                  Message
                </label>
                <textarea
                  className="input-field text-sm resize-none h-32"
                  placeholder="Tell us what you're looking for..."
                  value={form.message}
                  onChange={(e) =>
                    setForm({ ...form, message: e.target.value })
                  }
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full flex items-center justify-center gap-2"
              >
                {loading ? (
                  "Sending..."
                ) : (
                  <>
                    <Send size={16} /> Send Message
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
