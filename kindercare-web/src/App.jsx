import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./auth/AuthContext.jsx";
import ProtectedRoute from "./auth/ProtectedRoute.jsx";
import RoleRoute from "./auth/RoleRoute.jsx";
import Navbar from "./components/Navbar.jsx";

// auth
import Login from "./pages/auth/Login.jsx";
import Register from "./pages/auth/Register.jsx";

// parent
import ParentDashboard from "./pages/parent/ParentDashboard.jsx";
import Children from "./pages/parent/Children.jsx";
import Cases from "./pages/parent/Cases.jsx";
import CaseDetail from "./pages/parent/CaseDetail.jsx";
import Appointments from "./pages/parent/Appointments.jsx";

// clinic
import ClinicDashboard from "./pages/clinic/ClinicDashboard.jsx";
import ClinicCases from "./pages/clinic/ClinicCases.jsx";
import ClinicCaseDetail from "./pages/clinic/ClinicCaseDetail.jsx";
import ClinicAppointments from "./pages/clinic/ClinicAppointments.jsx";

// admin
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";

function HomeRedirect() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;

  if (user.role === "PARENT") return <Navigate to="/parent" replace />;
  if (user.role === "CLINIC") return <Navigate to="/clinic" replace />;
  if (user.role === "ADMIN") return <Navigate to="/admin" replace />;
  return <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<HomeRedirect />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Parent nested */}
        <Route
          path="/parent"
          element={
            <ProtectedRoute>
              <RoleRoute allow={["PARENT"]}>
                <ParentDashboard />
              </RoleRoute>
            </ProtectedRoute>
          }
        >
          <Route index element={<div style={{ padding: 10 }}>Parent Dashboard</div>} />
          <Route path="children" element={<Children />} />
          <Route path="cases" element={<Cases />} />
          <Route path="cases/:caseId" element={<CaseDetail />} />
          <Route path="appointments" element={<Appointments />} />
        </Route>

        {/* Clinic nested */}
        <Route
          path="/clinic"
          element={
            <ProtectedRoute>
              <RoleRoute allow={["CLINIC"]}>
                <ClinicDashboard />
              </RoleRoute>
            </ProtectedRoute>
          }
        >
          <Route index element={<div style={{ padding: 10 }}>Clinic Dashboard</div>} />
          <Route path="cases" element={<ClinicCases />} />
          <Route path="cases/:caseId" element={<ClinicCaseDetail />} />
          <Route path="appointments" element={<ClinicAppointments />} />
        </Route>

        {/* Admin */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <RoleRoute allow={["ADMIN"]}>
                <AdminDashboard />
              </RoleRoute>
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
