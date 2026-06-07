import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Music2, LogIn, UserCircle, ChevronDown } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "Classes", path: "/classes" },
  { name: "Gallery", path: "/gallery" },
  { name: "About", path: "/about" },
  { name: "Contact", path: "/contact" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => setIsOpen(false), [location]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const dashboardPath = {
    admin: "/admin",
    student: "/student",
    instructor: "/instructor",
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "glass-dark shadow-lg shadow-black/20" : "bg-transparent"
      }`}
    >
      <div className="page-container">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center shadow-lg shadow-primary-900/40 group-hover:shadow-primary-700/60 transition-all">
              <Music2 size={20} className="text-white" />
            </div>
            <span className="font-display font-bold text-xl gradient-text">
              Rhythm
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 rounded-lg font-medium transition-all text-sm ${
                  location.pathname === link.path
                    ? "text-primary-400 bg-primary-500/10"
                    : "text-gray-300 hover:text-white hover:bg-white/5"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Auth Section */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 glass px-3 py-2 rounded-xl hover:border-primary-500/40 transition-all touch-manipulation"
                >
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-7 h-7 rounded-full object-cover"
                    />
                  ) : (
                    <UserCircle size={22} className="text-primary-400" />
                  )}
                  <span className="text-sm text-gray-200">
                    {user.name.split(" ")[0]}
                  </span>
                  <ChevronDown
                    size={14}
                    className={`text-gray-400 transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
                  />
                </button>
                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-48 glass-dark rounded-xl shadow-xl overflow-hidden"
                    >
                      <Link
                        to={dashboardPath[user.role] || "/"}
                        className="block px-4 py-3 text-sm text-gray-300 hover:bg-primary-500/10 hover:text-white transition-colors"
                        onClick={() => setDropdownOpen(false)}
                      >
                        Dashboard
                      </Link>
                      <button
                        onClick={() => {
                          handleLogout();
                          setDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                      >
                        Sign Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="btn-ghost text-sm flex items-center gap-1.5"
                >
                  <LogIn size={16} /> Sign In
                </Link>
                <Link to="/register" className="btn-primary text-sm">
                  Join Now
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-3 rounded-xl hover:bg-white/10 transition-colors touch-manipulation"
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? "Close menu" : "Open menu"}
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass-dark border-t border-white/10 overflow-hidden"
          >
            <div className="page-container py-4 flex flex-col gap-1 safe-bottom">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-4 py-3 rounded-xl text-sm font-medium transition-colors touch-manipulation ${
                    location.pathname === link.path
                      ? "bg-primary-500/10 text-primary-400"
                      : "text-gray-300 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <div className="border-t border-white/10 mt-2 pt-3 flex flex-col gap-2">
                {user ? (
                  <>
                    <div className="flex items-center gap-3 px-4 py-2">
                      {user.avatar ? (
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      ) : (
                        <UserCircle size={20} className="text-primary-400" />
                      )}
                      <div>
                        <p className="text-white text-sm font-medium">
                          {user.name}
                        </p>
                        <p className="text-gray-500 text-xs capitalize">
                          {user.role}
                        </p>
                      </div>
                    </div>
                    <Link
                      to={dashboardPath[user.role] || "/"}
                      className="btn-outline w-full text-center text-sm"
                    >
                      Go to Dashboard
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-red-400 text-sm py-3 hover:bg-red-500/10 rounded-xl transition-colors touch-manipulation"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="btn-outline w-full text-center text-sm"
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/register"
                      className="btn-primary w-full text-center text-sm"
                    >
                      Join Now
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
