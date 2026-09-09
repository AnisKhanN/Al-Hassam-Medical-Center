import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate, Link } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import DashboardLayout from "./components/layout/DashboardLayout.jsx";
import LoadingSpinner from "./components/common/LoadingSpinner.jsx";
import { SmoothScrollProvider } from "./hooks/useSmoothScroll.jsx";
import ScrollProgressBar from "./components/common/ScrollProgressBar.jsx";
import useSEO from "./hooks/useSEO";

// Lazy-loaded routes for ultra-fast initial page delivery & optimal FCP
const LandingPage = lazy(() => import("./pages/landing/LandingPage.jsx"));
const AboutUs = lazy(() => import("./pages/about/AboutUs.jsx"));
const Login = lazy(() => import("./pages/auth/Login.jsx"));
const UserManagement = lazy(() => import("./pages/admin/UserManagement.jsx"));
const PatientList = lazy(() => import("./pages/patients/PatientList"));
const PatientDetail = lazy(() => import("./pages/patients/PatientDetail"));
const Appointments = lazy(() => import("./pages/appointments/Appointments"));
const Billing = lazy(() => import("./pages/billing/Billing"));
const BillDetail = lazy(() => import("./pages/billing/BillDetail"));
const Pharmacy = lazy(() => import("./pages/pharmacy/Pharmacy"));
const MedicineDetail = lazy(() => import("./pages/pharmacy/MedicineDetail"));
const Dashboard = lazy(() => import("./pages/dashboard/Dashboard.jsx"));
const Settings = lazy(() => import("./pages/setting/Settings.jsx"));
const Reports = lazy(() => import("./pages/report/Reports.jsx"));
const AiAssistant = lazy(() => import("./pages/ai/AiAssistant.jsx"));
const TelemedicineRoom = lazy(
  () => import("./pages/telemedicine/TelemedicineRoom.jsx"),
);
const ProjectDocs = lazy(() => import("./pages/docs/ProjectDocs.jsx"));

const Unauthorized = () => {
  useSEO({
    title: "Unauthorized Access",
    description:
      "You do not have the required permissions to access this page.",
  });

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 p-8 text-center bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200">
      <p className="text-slate-600 dark:text-slate-400">
        You don't have access to this page.
      </p>
      <Link
        to="/dashboard"
        className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
      >
        Back to Dashboard
      </Link>
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <SmoothScrollProvider>
            <ScrollProgressBar />
            <Suspense fallback={<LoadingSpinner />}>
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/about" element={<AboutUs />} />
                <Route path="/docs" element={<ProjectDocs />} />
                <Route path="/project-report" element={<ProjectDocs />} />
                <Route path="/rbac-report" element={<ProjectDocs />} />
                <Route path="/login" element={<Login />} />
                <Route path="/unauthorized" element={<Unauthorized />} />

                {/* Authenticated workspace with sidebar layout */}
                <Route element={<ProtectedRoute />}>
                  <Route element={<DashboardLayout />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/reports" element={<Reports />} />
                    <Route path="/ai-assistant" element={<AiAssistant />} />

                    {/* User management */}
                    <Route
                      element={<ProtectedRoute allowedRoles={["Admin"]} />}
                    >
                      <Route path="/admin/users" element={<UserManagement />} />
                    </Route>

                    {/* Patients */}
                    <Route
                      element={
                        <ProtectedRoute
                          allowedRoles={["Admin", "Doctor", "Receptionist"]}
                        />
                      }
                    >
                      <Route path="/patients" element={<PatientList />} />
                      <Route path="/patients/:id" element={<PatientDetail />} />
                    </Route>

                    {/* Appointments */}
                    <Route
                      element={
                        <ProtectedRoute
                          allowedRoles={["Admin", "Doctor", "Receptionist"]}
                        />
                      }
                    >
                      <Route path="/appointments" element={<Appointments />} />
                    </Route>

                    {/* Billing */}
                    <Route
                      element={
                        <ProtectedRoute
                          allowedRoles={["Admin", "Receptionist"]}
                        />
                      }
                    >
                      <Route path="/billing" element={<Billing />} />
                      <Route path="/billing/:id" element={<BillDetail />} />
                    </Route>

                    {/* Pharmacy */}
                    <Route
                      element={
                        <ProtectedRoute
                          allowedRoles={["Admin", "Pharmacist"]}
                        />
                      }
                    >
                      <Route path="/pharmacy" element={<Pharmacy />} />
                      <Route
                        path="/pharmacy/medicines/:id"
                        element={<MedicineDetail />}
                      />
                      <Route
                        path="/pharmacy/:id"
                        element={<MedicineDetail />}
                      />
                    </Route>
                  </Route>
                </Route>

                {/* Fullscreen Telemedicine WebRTC Video Consultation (Accessible to Doctor & Patient) */}
                <Route
                  path="/telemedicine/:roomId"
                  element={<TelemedicineRoom />}
                />

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Suspense>
          </SmoothScrollProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
