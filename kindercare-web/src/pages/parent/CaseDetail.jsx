import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getCase, cancelCase } from "../../api/parent.api.js";
import Loader from "../../components/Loader.jsx";

export default function CaseDetail() {
  const { caseId } = useParams();
  const [data, setData] = useState(null);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setErr("");
    setLoading(true);
    try {
      const res = await getCase(caseId);
      setData(res.data.data);
    } catch (e) {
      setErr(e?.response?.data?.message || "Failed to load case");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [caseId]);

  const doCancel = async () => {
    setErr("");
    try {
      await cancelCase(caseId);
      load();
    } catch (e) {
      setErr(e?.response?.data?.message || "Cancel failed");
    }
  };

  if (loading) return <Loader />;
  if (err) return <p style={{ color: "crimson", padding: 10 }}>{err}</p>;
  if (!data) return <p style={{ padding: 10 }}>No data</p>;

  return (
    <div>
      <h2>Case Detail</h2>
      <div style={{ border: "1px solid #ddd", padding: 12, borderRadius: 8 }}>
        <div><b>Status:</b> {data.status}</div>
        <div><b>Clinic:</b> {data.clinicId}</div>
        <div><b>Severity:</b> {data.severity}</div>
        <div><b>Duration:</b> {data.duration}</div>
        <div><b>Symptoms:</b> {(data.symptoms || []).join(", ")}</div>
        <div><b>Created:</b> {new Date(data.createdAt).toLocaleString()}</div>

        {data.childId && (
          <>
            <hr />
            <div><b>Child:</b> {data.childId.name} — {data.childId.ageMonths}m — {data.childId.gender}</div>
          </>
        )}

        {Array.isArray(data.clinicNotes) && data.clinicNotes.length > 0 && (
          <>
            <hr />
            <h4>Clinic Notes</h4>
            {data.clinicNotes.map((n, idx) => (
              <div key={idx} style={{ border: "1px solid #eee", padding: 10, borderRadius: 8, marginBottom: 8 }}>
                <div style={{ fontSize: 12, opacity: 0.7 }}>
                  {new Date(n.createdAt).toLocaleString()}
                </div>
                <div>{n.note}</div>
              </div>
            ))}
          </>
        )}

        {!["CLOSED", "CANCELLED"].includes(data.status) && (
          <button onClick={doCancel} style={{ marginTop: 12 }}>
            Cancel Case
          </button>
        )}
      </div>
    </div>
  );
}
