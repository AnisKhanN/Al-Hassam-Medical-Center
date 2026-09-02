import { BrowserRouter, Routes, Route, Navigate, Link } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import DashboardLayout from "./components/layout/DashboardLayout.jsx";
import Login from "./pages/auth/Login.jsx";
import UserManagement from "./pages/admin/UserManagement.jsx";
import PatientList from "./pages/patients/PatientList";
import PatientDetail from "./pages/patients/PatientDetail";
import Appointments from "./pages/appointments/Appointments";
import Billing from "./pages/billing/Billing";
import BillDetail from "./pages/billing/BillDetail";
import Pharmacy from "./pages/pharmacy/Pharmacy";
import MedicineDetail from "./pages/pharmacy/MedicineDetail";
import Dashboard from "./pages/Dashboard.jsx";
import Settings from "./pages/Settings.jsx";

const Unauthorized = () => (
  <div className="flex min-h-screen flex-col items-center justify-center gap-3 p-8 text-center">
    <p className="text-slate-600">You don't have access to this page.</p>
    <Link
      to="/dashboard"
      className="text-sm font-medium text-blue-600 hover:underline"
    >
      Back to Dashboard
    </Link>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Everything below requires a valid session and gets the sidebar layout */}
          <Route element={<ProtectedRoute />}>
            <Route element={<DashboardLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/settings" element={<Settings />} />

              {/* User management */}
              <Route element={<ProtectedRoute allowedRoles={["Admin"]} />}>
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
                  <ProtectedRoute allowedRoles={["Admin", "Receptionist"]} />
                }
              >
                <Route path="/billing" element={<Billing />} />
                <Route path="/billing/:id" element={<BillDetail />} />
              </Route>

              {/* Pharmacy */}
              <Route
                element={
                  <ProtectedRoute allowedRoles={["Admin", "Pharmacist"]} />
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

          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
