import { Link } from "react-router-dom";
import {
  Music2,
  Mail,
  Phone,
  MapPin,
  Instagram,
  Youtube,
  Facebook,
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-dark-800 border-t border-white/5 mt-20">
      <div className="page-container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center">
                <Music2 size={20} className="text-white" />
              </div>
              <span className="font-display font-bold text-xl gradient-text">
                Rhythm Dance Academy
              </span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              Where passion meets rhythm. Join us on an extraordinary journey of
              dance, expression, and artistry.
            </p>
            <div className="flex gap-4 mt-5">
              {[Instagram, Youtube, Facebook].map((Icon, i) => (
                <button
                  key={i}
                  className="w-9 h-9 glass rounded-lg flex items-center justify-center text-gray-400 hover:text-primary-400 hover:border-primary-500/40 transition-all"
                >
                  <Icon size={16} />
                </button>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {[
                ["Home", "/"],
                ["Classes", "/classes"],
                ["Gallery", "/gallery"],
                ["About", "/about"],
                ["Contact", "/contact"],
              ].map(([name, path]) => (
                <li key={path}>
                  <Link
                    to={path}
                    className="text-gray-400 hover:text-primary-400 text-sm transition-colors"
                  >
                    {name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-white mb-4">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-gray-400 text-sm">
                <MapPin
                  size={15}
                  className="text-primary-500 mt-0.5 shrink-0"
                />
                <span>
                  123 Dance Street,
                  <br />
                  Chennai, Tamil Nadu 600001
                </span>
              </li>
              <li className="flex items-center gap-2 text-gray-400 text-sm">
                <Phone size={15} className="text-primary-500 shrink-0" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center gap-2 text-gray-400 text-sm">
                <Mail size={15} className="text-primary-500 shrink-0" />
                <span>info@rhythmdance.in</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} Rhythm Dance Academy. All rights
            reserved.
          </p>
          <div className="flex gap-4 text-xs text-gray-500">
            <a href="#" className="hover:text-gray-300 transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-gray-300 transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
