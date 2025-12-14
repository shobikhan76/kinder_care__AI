import { Link, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./auth/AuthContext";
import ProtectedRoute from "./auth/ProtectedRoute";

import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import ParentIntake from "./pages/ParentIntake.jsx";
import ClinicDashboard from "./pages/ClinicDashboard.jsx";
import CaseDetail from "./pages/CaseDetail.jsx";

export default function App() {
  const { user, logout } = useAuth();

  return (
    <div style={{ fontFamily: "Arial", padding: 16 }}>
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 16,
        }}
      >
        <div style={{ display: "flex", gap: 12 }}>
          <Link to="/">Home</Link>

          {user?.role === "Parent" && <Link to="/parent">Parent Intake</Link>}

          {(user?.role === "Clinic" || user?.role === "Admin") && (
            <Link to="/clinic">Clinic Dashboard</Link>
          )}
        </div>

        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          {user ? (
            <>
              <span>
                {user.email} ({user.role})
              </span>
              <button onClick={logout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
        </div>
      </header>

      {/* Global disclaimer banner (clinic-safe) */}
      {user && (
        <div
          style={{
            background: "#fffbe6",
            border: "1px solid #ffe58f",
            padding: 10,
            borderRadius: 10,
            marginBottom: 14,
            color: "#614700",
          }}
        >
          KinderCare AI provides decision-support only and does not replace
          clinical judgment.
          <b> This is not a diagnosis.</b>
        </div>
      )}

      <Routes>
        <Route path="/" element={<HomeRedirect />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/parent"
          element={
            <ProtectedRoute roles={["Parent", "Admin"]}>
              <ParentIntake />
            </ProtectedRoute>
          }
        />

        <Route
          path="/clinic"
          element={
            <ProtectedRoute roles={["Clinic", "Admin"]}>
              <ClinicDashboard />
            </ProtectedRoute>
          }
        />

        {/* ✅ Clinic + Parent both use this detail route */}
        <Route
          path="/cases/:id"
          element={
            <ProtectedRoute roles={["Parent", "Clinic", "Admin"]}>
              <CaseDetail />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

function HomeRedirect() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;

  if (user.role === "Parent") return <Navigate to="/parent" replace />;
  return <Navigate to="/clinic" replace />;
}
