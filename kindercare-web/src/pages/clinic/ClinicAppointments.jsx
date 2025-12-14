import { useEffect, useState } from "react";
import {
  listClinicAppointments,
  approveAppointment,
  rescheduleAppointment,
  cancelAppointmentByClinic,
} from "../../api/clinic.api.js";
import Loader from "../../components/Loader.jsx";

export default function ClinicAppointments() {
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState("");
  const [slot, setSlot] = useState("");
  const [msg, setMsg] = useState("");

  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setErr("");
    setLoading(true);
    try {
      const res = await listClinicAppointments(status ? { status } : undefined);
      setItems(res.data.data || []);
    } catch (e) {
      setErr(e?.response?.data?.message || "Failed to load clinic appointments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [status]);

  const doApprove = async (id) => {
    setErr("");
    try {
      await approveAppointment(id, {
        confirmedSlot: slot ? new Date(slot).toISOString() : null,
        clinicMessage: msg,
      });
      setSlot(""); setMsg("");
      load();
    } catch (e) {
      setErr(e?.response?.data?.message || "Approve failed");
    }
  };

  const doReschedule = async (id) => {
    setErr("");
    try {
      await rescheduleAppointment(id, {
        confirmedSlot: slot ? new Date(slot).toISOString() : null,
        clinicMessage: msg,
      });
      setSlot(""); setMsg("");
      load();
    } catch (e) {
      setErr(e?.response?.data?.message || "Reschedule failed");
    }
  };

  const doCancel = async (id) => {
    setErr("");
    try {
      await cancelAppointmentByClinic(id, { clinicMessage: msg });
      setMsg("");
      load();
    } catch (e) {
      setErr(e?.response?.data?.message || "Cancel failed");
    }
  };

  if (loading) return <Loader />;

  return (
    <div>
      <h2>Clinic Appointments</h2>
      {err && <p style={{ color: "crimson" }}>{err}</p>}

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 12 }}>
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All</option>
          <option value="REQUESTED">REQUESTED</option>
          <option value="CONFIRMED">CONFIRMED</option>
          <option value="RESCHEDULED">RESCHEDULED</option>
          <option value="CANCELLED">CANCELLED</option>
          <option value="COMPLETED">COMPLETED</option>
        </select>

        <label>
          Slot:
          <input type="datetime-local" value={slot} onChange={(e) => setSlot(e.target.value)} />
        </label>

        <input
          placeholder="Message (optional)"
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          style={{ minWidth: 240 }}
        />
      </div>

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
              {a.clinicMessage && <div><b>Message:</b> {a.clinicMessage}</div>}

              <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
                <button onClick={() => doApprove(a._id)}>Approve</button>
                <button onClick={() => doReschedule(a._id)}>Reschedule</button>
                <button onClick={() => doCancel(a._id)}>Cancel</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
