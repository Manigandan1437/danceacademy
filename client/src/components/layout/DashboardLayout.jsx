import { useState } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  ClipboardList,
  CalendarDays,
  CreditCard,
  Megaphone,
  Image,
  Music2,
  LogOut,
  Menu,
  X,
  ChevronLeft,
  Bell,
  GraduationCap,
  ClipboardCheck,
  UserCircle,
  ChevronRight,
} from "lucide-react";

const menuConfig = {
  admin: [
    { name: "Dashboard", path: "/admin", icon: LayoutDashboard },
    { name: "Students", path: "/admin/students", icon: GraduationCap },
    { name: "Instructors", path: "/admin/instructors", icon: Users },
    { name: "Classes", path: "/admin/classes", icon: BookOpen },
    { name: "Enrollments", path: "/admin/enrollments", icon: ClipboardList },
    { name: "Attendance", path: "/admin/attendance", icon: ClipboardCheck },
    { name: "Schedule", path: "/admin/schedule", icon: CalendarDays },
    { name: "Payments", path: "/admin/payments", icon: CreditCard },
    { name: "Announcements", path: "/admin/announcements", icon: Megaphone },
    { name: "Gallery", path: "/admin/gallery", icon: Image },
    { name: "Dance Styles", path: "/admin/dance-styles", icon: Music2 },
  ],
  student: [
    { name: "Dashboard", path: "/student", icon: LayoutDashboard },
    { name: "My Classes", path: "/student/classes", icon: BookOpen },
    { name: "Attendance", path: "/student/attendance", icon: ClipboardCheck },
    { name: "Payments", path: "/student/payments", icon: CreditCard },
  ],
  instructor: [
    { name: "Dashboard", path: "/instructor", icon: LayoutDashboard },
    { name: "My Classes", path: "/instructor/classes", icon: BookOpen },
    {
      name: "Attendance",
      path: "/instructor/attendance",
      icon: ClipboardCheck,
    },
  ],
};

const DashboardLayout = ({ role }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const menu = menuConfig[role] || [];

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const SidebarContent = () => (
    <div className="h-full flex flex-col">
      {/* Logo */}
      <div
        className={`flex items-center gap-3 p-5 border-b border-white/10 ${collapsed ? "justify-center" : ""}`}
      >
        <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center shadow-lg shadow-primary-900/50 shrink-0">
          <Music2 size={18} className="text-white" />
        </div>
        {!collapsed && (
          <div>
            <p className="font-display font-bold text-sm gradient-text">
              Rhythm
            </p>
            <p className="text-xs text-gray-500 capitalize">{role} Panel</p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 overflow-y-auto space-y-1">
        {menu.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group
                ${
                  isActive
                    ? "bg-primary-500/15 text-primary-400 border border-primary-500/30"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }
                ${collapsed ? "justify-center" : ""}
              `}
              title={collapsed ? item.name : ""}
            >
              <Icon
                size={18}
                className={`shrink-0 ${isActive ? "text-primary-400" : "group-hover:text-primary-400 transition-colors"}`}
              />
              {!collapsed && (
                <span className="text-sm font-medium">{item.name}</span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User & Logout */}
      <div className="p-3 border-t border-white/10 space-y-1">
        <Link
          to="/"
          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all ${collapsed ? "justify-center" : ""}`}
        >
          <UserCircle size={18} className="shrink-0" />
          {!collapsed && <span className="text-sm">Visit Site</span>}
        </Link>
        <button
          onClick={handleLogout}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all ${collapsed ? "justify-center" : ""}`}
        >
          <LogOut size={18} className="shrink-0" />
          {!collapsed && <span className="text-sm">Sign Out</span>}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex bg-dark-900">
      {/* Desktop Sidebar */}
      <motion.aside
        animate={{ width: collapsed ? 64 : 240 }}
        transition={{ duration: 0.2 }}
        className="hidden md:flex flex-col bg-dark-800 border-r border-white/10 fixed left-0 top-0 h-full z-30"
      >
        <SidebarContent />
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-20 w-6 h-6 glass rounded-full flex items-center justify-center text-gray-400 hover:text-white border border-white/20 transition-colors"
        >
          {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
        </button>
      </motion.aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="md:hidden fixed inset-0 bg-black/60 z-40"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: -240 }}
              animate={{ x: 0 }}
              exit={{ x: -240 }}
              className="md:hidden fixed left-0 top-0 h-full w-60 bg-dark-800 border-r border-white/10 z-50"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main */}
      <div
        className={`flex-1 flex flex-col transition-all duration-200 ${collapsed ? "md:ml-16" : "md:ml-60"}`}
      >
        {/* Top Bar */}
        <header className="sticky top-0 z-20 glass-dark border-b border-white/10 h-14 flex items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-3">
            <button
              className="md:hidden p-2.5 rounded-xl hover:bg-white/10 transition-colors touch-manipulation"
              onClick={() => setMobileOpen(true)}
              aria-label="Open navigation"
            >
              <Menu size={20} />
            </button>
            <h1 className="text-sm font-semibold text-gray-300 capitalize">
              {menu.find((m) => m.path === location.pathname)?.name ||
                "Dashboard"}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative p-2.5 rounded-xl hover:bg-white/10 transition-colors touch-manipulation">
              <Bell size={18} className="text-gray-400" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary-500 rounded-full" />
            </button>
            <div className="flex items-center gap-2 glass px-3 py-1.5 rounded-lg">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-6 h-6 rounded-full object-cover"
                />
              ) : (
                <UserCircle size={18} className="text-primary-400" />
              )}
              <span className="text-xs text-gray-300 hidden sm:block">
                {user?.name?.split(" ")[0]}
              </span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-6 overflow-y-auto pb-20 md:pb-6">
          <Outlet />
        </main>

        {/* Mobile Bottom Navigation */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 glass-dark border-t border-white/10 safe-bottom">
          <div className="flex items-center justify-around px-2 py-1">
            {menu.slice(0, 5).map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl transition-colors touch-manipulation min-w-[52px] ${
                    isActive
                      ? "text-primary-400"
                      : "text-gray-500 hover:text-gray-300"
                  }`}
                >
                  <Icon
                    size={20}
                    className={isActive ? "text-primary-400" : ""}
                  />
                  <span className="text-[10px] font-medium leading-tight">
                    {item.name.split(" ")[0]}
                  </span>
                </Link>
              );
            })}
            {/* More button if menu has more than 5 items */}
            {menu.length > 5 && (
              <button
                onClick={() => setMobileOpen(true)}
                className="flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl text-gray-500 hover:text-gray-300 transition-colors touch-manipulation min-w-[52px]"
              >
                <Menu size={20} />
                <span className="text-[10px] font-medium leading-tight">
                  More
                </span>
              </button>
            )}
          </div>
        </nav>
      </div>
    </div>
  );
};

export default DashboardLayout;
