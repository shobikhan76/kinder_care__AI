import { useEffect, useState } from "react";
import { listAppointments, requestAppointment, cancelAppointment, listChildren } from "../../api/parent.api.js";
import Loader from "../../components/Loader.jsx";

export default function Appointments() {
  const [items, setItems] = useState([]);
  const [children, setChildren] = useState([]);

  const [childId, setChildId] = useState("");
  const [clinicId, setClinicId] = useState("");
  const [slot1, setSlot1] = useState("");
  const [slot2, setSlot2] = useState("");

  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setErr("");
    setLoading(true);
    try {
      const [a, c] = await Promise.all([listAppointments(), listChildren()]);
      setItems(a.data.data || []);
      setChildren(c.data.data || []);
    } catch (e) {
      setErr(e?.response?.data?.message || "Failed to load appointments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const submit = async (e) => {
    e.preventDefault();
    setErr("");

    if (!childId || !clinicId || !slot1) {
      setErr("childId, clinicId and slot1 are required");
      return;
    }

    try {
      const preferredSlots = [slot1, slot2].filter(Boolean).map((s) => new Date(s).toISOString());
      await requestAppointment({ childId, clinicId, preferredSlots });
      setChildId(""); setClinicId(""); setSlot1(""); setSlot2("");
      load();
    } catch (e2) {
      setErr(e2?.response?.data?.message || "Request failed");
    }
  };

  const onCancel = async (id) => {
    setErr("");
    try {
      await cancelAppointment(id);
      load();
    } catch (e2) {
      setErr(e2?.response?.data?.message || "Cancel failed");
    }
  };

  if (loading) return <Loader />;

  return (
    <div>
      <h2>Appointments</h2>
      {err && <p style={{ color: "crimson" }}>{err}</p>}

      <h3>Request Appointment</h3>
      <form onSubmit={submit} style={{ display: "grid", gap: 8, maxWidth: 520 }}>
        <select value={childId} onChange={(e) => setChildId(e.target.value)}>
          <option value="">Select child</option>
          {children.map((ch) => (
            <option key={ch._id} value={ch._id}>{ch.name} ({ch.ageMonths}m)</option>
          ))}
        </select>

        <input placeholder="Clinic ID (e.g clinic_001)" value={clinicId} onChange={(e) => setClinicId(e.target.value)} />

        <label>
          Slot 1:
          <input type="datetime-local" value={slot1} onChange={(e) => setSlot1(e.target.value)} />
        </label>

        <label>
          Slot 2 (optional):
          <input type="datetime-local" value={slot2} onChange={(e) => setSlot2(e.target.value)} />
        </label>

        <button>Request</button>
      </form>

      <hr style={{ margin: "20px 0" }} />

      <h3>My Requests</h3>
      {items.length === 0 ? (
        <p>No appointments.</p>
      ) : (
        <div style={{ display: "grid", gap: 12 }}>
          {items.map((a) => (
            <div key={a._id} style={{ border: "1px solid #ddd", padding: 12, borderRadius: 8 }}>
              <div><b>Status:</b> {a.status}</div>
              <div><b>Clinic:</b> {a.clinicId}</div>
              <div><b>Preferred:</b> {(a.preferredSlots || []).map(s => new Date(s).toLocaleString()).join(" | ")}</div>
              {a.confirmedSlot && <div><b>Confirmed:</b> {new Date(a.confirmedSlot).toLocaleString()}</div>}

              {a.status !== "CANCELLED" && a.status !== "COMPLETED" && (
                <button onClick={() => onCancel(a._id)} style={{ marginTop: 10 }}>
                  Cancel
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
