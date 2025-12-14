import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { createCase, listCases, listChildren } from "../../api/parent.api.js";
import Loader from "../../components/Loader.jsx";

export default function Cases() {
  const [children, setChildren] = useState([]);
  const [items, setItems] = useState([]);

  const [childId, setChildId] = useState("");
  const [clinicId, setClinicId] = useState("");
  const [symptoms, setSymptoms] = useState("");
  const [severity, setSeverity] = useState("mild");
  const [duration, setDuration] = useState("");

  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setErr("");
    setLoading(true);
    try {
      const [c, ch] = await Promise.all([listCases(), listChildren()]);
      setItems(c.data.data || []);
      setChildren(ch.data.data || []);
    } catch (e) {
      setErr(e?.response?.data?.message || "Failed to load cases");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const submit = async (e) => {
    e.preventDefault();
    setErr("");

    if (!childId || !clinicId || !symptoms.trim() || !duration.trim()) {
      setErr("childId, clinicId, symptoms, duration are required");
      return;
    }

    try {
      await createCase({
        childId,
        clinicId,
        symptoms: symptoms.split(",").map((s) => s.trim()).filter(Boolean),
        severity,
        duration,
        inputType: "text",
      });
      setSymptoms(""); setDuration("");
      load();
    } catch (e2) {
      setErr(e2?.response?.data?.message || "Create case failed");
    }
  };

  if (loading) return <Loader />;

  return (
    <div>
      <h2>Cases</h2>
      {err && <p style={{ color: "crimson" }}>{err}</p>}

      <h3>Create Case</h3>
      <form onSubmit={submit} style={{ display: "grid", gap: 8, maxWidth: 450 }}>
        <select value={childId} onChange={(e) => setChildId(e.target.value)}>
          <option value="">Select child</option>
          {children.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name} ({c.ageMonths}m)
            </option>
          ))}
        </select>

        <input placeholder="Clinic ID (e.g clinic_001)" value={clinicId} onChange={(e) => setClinicId(e.target.value)} />
        <input placeholder="Symptoms (comma separated)" value={symptoms} onChange={(e) => setSymptoms(e.target.value)} />
        <input placeholder="Duration (e.g 2 days)" value={duration} onChange={(e) => setDuration(e.target.value)} />

        <select value={severity} onChange={(e) => setSeverity(e.target.value)}>
          <option value="mild">mild</option>
          <option value="moderate">moderate</option>
          <option value="severe">severe</option>
        </select>

        <button>Create</button>
      </form>

      <hr style={{ margin: "20px 0" }} />

      <h3>My Cases</h3>
      {items.length === 0 ? (
        <p>No cases yet.</p>
      ) : (
        <div style={{ display: "grid", gap: 12 }}>
          {items.map((c) => (
            <div key={c._id} style={{ border: "1px solid #ddd", padding: 12, borderRadius: 8 }}>
              <div><b>Status:</b> {c.status}</div>
              <div><b>Severity:</b> {c.severity}</div>
              <div><b>Clinic:</b> {c.clinicId}</div>
              <div><b>Created:</b> {new Date(c.createdAt).toLocaleString()}</div>
              <Link to={`/parent/cases/${c._id}`}>Open</Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
