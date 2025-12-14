import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getClinicCase, addClinicNote, updateClinicCaseStatus } from "../../api/clinic.api.js";
import Loader from "../../components/Loader.jsx";

export default function ClinicCaseDetail() {
  const { caseId } = useParams();
  const [data, setData] = useState(null);
  const [note, setNote] = useState("");
  const [newStatus, setNewStatus] = useState("IN_REVIEW");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setErr("");
    setLoading(true);
    try {
      const res = await getClinicCase(caseId);
      setData(res.data.data);
      if (res.data.data?.status) setNewStatus(res.data.data.status);
    } catch (e) {
      setErr(e?.response?.data?.message || "Failed to load case");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [caseId]);

  const submitNote = async (e) => {
    e.preventDefault();
    setErr("");
    if (!note.trim()) return setErr("Note required");
    try {
      await addClinicNote(caseId, { note });
      setNote("");
      load();
    } catch (e2) {
      setErr(e2?.response?.data?.message || "Add note failed");
    }
  };

  const updateStatus = async () => {
    setErr("");
    try {
      await updateClinicCaseStatus(caseId, { status: newStatus });
      load();
    } catch (e2) {
      setErr(e2?.response?.data?.message || "Update status failed");
    }
  };

  if (loading) return <Loader />;
  if (err) return <p style={{ color: "crimson", padding: 10 }}>{err}</p>;
  if (!data) return <p style={{ padding: 10 }}>No data</p>;

  return (
    <div>
      <h2>Clinic Case Detail</h2>

      <div style={{ border: "1px solid #ddd", padding: 12, borderRadius: 8 }}>
        <div><b>Status:</b> {data.status}</div>
        <div><b>Severity:</b> {data.severity}</div>
        <div><b>Duration:</b> {data.duration}</div>
        <div><b>Symptoms:</b> {(data.symptoms || []).join(", ")}</div>

        <hr />
        <h4>Child</h4>
        <div>{data.childId?.name} — {data.childId?.ageMonths}m — {data.childId?.gender}</div>

        {Array.isArray(data.attachments) && data.attachments.length > 0 && (
          <>
            <hr />
            <h4>Attachments</h4>
            <ul>
              {data.attachments.map((a, idx) => (
                <li key={idx}>
                  {a.type} — <a href={a.url} target="_blank" rel="noreferrer">open</a>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>

      <hr style={{ margin: "20px 0" }} />

      <h3>Update Status</h3>
      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
        <select value={newStatus} onChange={(e) => setNewStatus(e.target.value)}>
          <option value="IN_REVIEW">IN_REVIEW</option>
          <option value="FOLLOWUP_NEEDED">FOLLOWUP_NEEDED</option>
          <option value="CLOSED">CLOSED</option>
        </select>
        <button onClick={updateStatus}>Save</button>
      </div>

      <hr style={{ margin: "20px 0" }} />

      <h3>Add Note</h3>
      <form onSubmit={submitNote} style={{ display: "grid", gap: 10, maxWidth: 600 }}>
        <textarea rows={4} value={note} onChange={(e) => setNote(e.target.value)} />
        <button>Add Note</button>
      </form>

      <hr style={{ margin: "20px 0" }} />

      <h3>Notes</h3>
      {(!data.clinicNotes || data.clinicNotes.length === 0) ? (
        <p>No notes yet.</p>
      ) : (
        <div style={{ display: "grid", gap: 10 }}>
          {data.clinicNotes.map((n, idx) => (
            <div key={idx} style={{ border: "1px solid #eee", padding: 10, borderRadius: 8 }}>
              <div style={{ fontSize: 12, opacity: 0.7 }}>{new Date(n.createdAt).toLocaleString()}</div>
              <div>{n.note}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
