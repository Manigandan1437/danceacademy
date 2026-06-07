import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

const Contact = () => {

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
        <div className="space-y-6 w-full">
          {/* Contact Info */}
          <div>
            <h2 className="font-display text-2xl font-bold text-white">
              Contact Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  Icon: MapPin,
                  title: "Visit Us",
                  text: "First Floor, Pandian Complex, 6th Cross Rd, Prakash Nagar, Hosur, Tamil Nadu 635109",
                },
                {
                  Icon: Phone,
                  title: "Call Us",
                  text: "+91 99943 59501",
                },
                {
                  Icon: Mail,
                  title: "Email Us",
                  text: "unitedrhythmofficial@gmail.com",
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
