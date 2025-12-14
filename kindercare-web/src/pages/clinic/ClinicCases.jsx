import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listClinicCases } from "../../api/clinic.api.js";
import Loader from "../../components/Loader.jsx";

export default function ClinicCases() {
  const [items, setItems] = useState([]);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const [status, setStatus] = useState("");
  const [severity, setSeverity] = useState("");

  const load = async () => {
    setErr("");
    setLoading(true);
    try {
      const params = {};
      if (status) params.status = status;
      if (severity) params.severity = severity;

      const res = await listClinicCases(Object.keys(params).length ? params : undefined);
      setItems(res.data.data || []);
    } catch (e) {
      setErr(e?.response?.data?.message || "Failed to load clinic cases");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [status, severity]);

  if (loading) return <Loader />;

  return (
    <div>
      <h2>Clinic Cases</h2>
      {err && <p style={{ color: "crimson" }}>{err}</p>}

      <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All Status</option>
          <option value="SUBMITTED">SUBMITTED</option>
          <option value="IN_REVIEW">IN_REVIEW</option>
          <option value="FOLLOWUP_NEEDED">FOLLOWUP_NEEDED</option>
          <option value="CLOSED">CLOSED</option>
          <option value="CANCELLED">CANCELLED</option>
        </select>

        <select value={severity} onChange={(e) => setSeverity(e.target.value)}>
          <option value="">All Severity</option>
          <option value="mild">mild</option>
          <option value="moderate">moderate</option>
          <option value="severe">severe</option>
        </select>

        <button onClick={load}>Refresh</button>
      </div>

      {items.length === 0 ? (
        <p>No cases found.</p>
      ) : (
        <div style={{ display: "grid", gap: 12 }}>
          {items.map((c) => (
            <div key={c._id} style={{ border: "1px solid #ddd", padding: 12, borderRadius: 8 }}>
              <div><b>Status:</b> {c.status}</div>
              <div><b>Severity:</b> {c.severity}</div>
              <div><b>Child:</b> {c.childId?.name || c.childId}</div>
              <div><b>Created:</b> {new Date(c.createdAt).toLocaleString()}</div>
              <Link to={`/clinic/cases/${c._id}`}>Open</Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
