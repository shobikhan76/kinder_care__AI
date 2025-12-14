import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext.jsx";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const onLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div style={{ padding: 12, borderBottom: "1px solid #ddd", display: "flex", gap: 12 }}>
      <Link to="/">Home</Link>

      {!user ? (
        <>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </>
      ) : (
        <>
          {user.role === "PARENT" && <Link to="/parent">Parent</Link>}
          {user.role === "CLINIC" && <Link to="/clinic">Clinic</Link>}
          {user.role === "ADMIN" && <Link to="/admin">Admin</Link>}

          <span style={{ marginLeft: "auto" }}>
            {user.role} {user.clinicId ? `(${user.clinicId})` : ""}{" "}
            <button onClick={onLogout} style={{ marginLeft: 10 }}>
              Logout
            </button>
          </span>
        </>
      )}
    </div>
  );
}
