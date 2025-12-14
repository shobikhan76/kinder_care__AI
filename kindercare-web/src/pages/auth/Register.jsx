import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../../api/auth.api.js";
import { useAuth } from "../../auth/AuthContext.jsx";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("PARENT");
  const [clinicId, setClinicId] = useState("");
  const [err, setErr] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    try {
      const payload = { name, email, password, role, clinicId: role === "CLINIC" ? clinicId : null };
      const res = await registerUser(payload);
      login(res.data.data.token);
      navigate("/", { replace: true });
    } catch (e2) {
      setErr(e2?.response?.data?.message || "Register failed");
    }
  };

  return (
    <div style={{ maxWidth: 420, margin: "40px auto" }}>
      <h2>Register</h2>
      {err && <p style={{ color: "crimson" }}>{err}</p>}
      <form onSubmit={submit}>
        <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
        <br /><br />
        <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <br /><br />
        <input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <br /><br />

        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="PARENT">PARENT</option>
          <option value="CLINIC">CLINIC</option>
          <option value="ADMIN">ADMIN</option>
        </select>

        {role === "CLINIC" && (
          <>
            <br /><br />
            <input placeholder="Clinic ID (e.g clinic_001)" value={clinicId} onChange={(e) => setClinicId(e.target.value)} />
          </>
        )}

        <br /><br />
        <button type="submit">Register</button>
      </form>
    </div>
  );
}
