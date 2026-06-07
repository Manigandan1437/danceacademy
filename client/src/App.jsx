import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/common/ProtectedRoute";
import PublicLayout from "./components/layout/PublicLayout";
import DashboardLayout from "./components/layout/DashboardLayout";

// Public Pages
import Home from "./pages/public/Home";
import Classes from "./pages/public/Classes";
import Gallery from "./pages/public/Gallery";
import About from "./pages/public/About";
import Contact from "./pages/public/Contact";

// Auth Pages
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

// Admin Pages
import AdminDashboard from "./pages/admin/Dashboard";
import AdminStudents from "./pages/admin/Students";
import AdminInstructors from "./pages/admin/Instructors";
import AdminClasses from "./pages/admin/Classes";
import AdminEnrollments from "./pages/admin/Enrollments";
import AdminAttendance from "./pages/admin/Attendance";
import AdminSchedule from "./pages/admin/Schedule";
import AdminPayments from "./pages/admin/Payments";
import AdminAnnouncements from "./pages/admin/Announcements";
import AdminGallery from "./pages/admin/GalleryAdmin";
import AdminDanceStyles from "./pages/admin/DanceStyles";

// Student Pages
import StudentDashboard from "./pages/student/Dashboard";
import StudentClasses from "./pages/student/MyClasses";
import StudentAttendance from "./pages/student/Attendance";
import StudentPayments from "./pages/student/Payments";

// Instructor Pages
import InstructorDashboard from "./pages/instructor/Dashboard";
import InstructorClasses from "./pages/instructor/MyClasses";
import InstructorAttendance from "./pages/instructor/Attendance";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/classes" element={<Classes />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
          </Route>

          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Admin Routes */}
          <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
            <Route path="/admin" element={<DashboardLayout role="admin" />}>
              <Route index element={<AdminDashboard />} />
              <Route path="students" element={<AdminStudents />} />
              <Route path="instructors" element={<AdminInstructors />} />
              <Route path="classes" element={<AdminClasses />} />
              <Route path="enrollments" element={<AdminEnrollments />} />
              <Route path="attendance" element={<AdminAttendance />} />
              <Route path="schedule" element={<AdminSchedule />} />
              <Route path="payments" element={<AdminPayments />} />
              <Route path="announcements" element={<AdminAnnouncements />} />
              <Route path="gallery" element={<AdminGallery />} />
              <Route path="dance-styles" element={<AdminDanceStyles />} />
            </Route>
          </Route>

          {/* Student Routes */}
          <Route element={<ProtectedRoute allowedRoles={["student"]} />}>
            <Route path="/student" element={<DashboardLayout role="student" />}>
              <Route index element={<StudentDashboard />} />
              <Route path="classes" element={<StudentClasses />} />
              <Route path="attendance" element={<StudentAttendance />} />
              <Route path="payments" element={<StudentPayments />} />
            </Route>
          </Route>

          {/* Instructor Routes */}
          <Route element={<ProtectedRoute allowedRoles={["instructor"]} />}>
            <Route
              path="/instructor"
              element={<DashboardLayout role="instructor" />}
            >
              <Route index element={<InstructorDashboard />} />
              <Route path="classes" element={<InstructorClasses />} />
              <Route path="attendance" element={<InstructorAttendance />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
