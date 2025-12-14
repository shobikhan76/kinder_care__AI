import { useEffect, useState } from "react";
import {
  listClinicAppointments,
  approveAppointment,
  rescheduleAppointment,
  cancelAppointmentByClinic,
} from "../../api/clinic.api.js";
import Loader from "../../components/Loader.jsx";

// Helper to format date for datetime-local input (YYYY-MM-DDTHH:mm)
const toLocalDateTime = (date) => {
  if (!date) return "";
  const d = new Date(date);
  const local = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 16);
};

// Status badge styling
const getStatusColor = (status) => {
  switch (status) {
    case "REQUESTED": return "bg-yellow-100 text-yellow-800";
    case "CONFIRMED": return "bg-green-100 text-green-800";
    case "RESCHEDULED": return "bg-blue-100 text-blue-800";
    case "CANCELLED": return "bg-red-100 text-red-800";
    case "COMPLETED": return "bg-gray-100 text-gray-800";
    default: return "bg-gray-100 text-gray-800";
  }
};

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
      setErr(e?.response?.data?.message || "Failed to load appointments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [status]);

  const doApprove = async (id) => {
    setErr("");
    try {
      await approveAppointment(id, {
        confirmedSlot: slot ? new Date(slot).toISOString() : null,
        clinicMessage: msg,
      });
      setSlot("");
      setMsg("");
      load();
    } catch (e) {
      setErr(e?.response?.data?.message || "Approval failed");
    }
  };

  const doReschedule = async (id) => {
    setErr("");
    try {
      await rescheduleAppointment(id, {
        confirmedSlot: slot ? new Date(slot).toISOString() : null,
        clinicMessage: msg,
      });
      setSlot("");
      setMsg("");
      load();
    } catch (e) {
      setErr(e?.response?.data?.message || "Rescheduling failed");
    }
  };

  const doCancel = async (id) => {
    setErr("");
    try {
      await cancelAppointmentByClinic(id, { clinicMessage: msg });
      setMsg("");
      load();
    } catch (e) {
      setErr(e?.response?.data?.message || "Cancellation failed");
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="p-4 sm:p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Clinic Appointments</h1>
        <p className="text-gray-600">Manage and respond to appointment requests</p>
      </div>

      {err && (
        <div
          className="mb-6 p-3 rounded-lg bg-red-50 text-red-700 border border-red-200 flex items-start"
          role="alert"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          {err}
        </div>
      )}

      {/* Filters & Actions */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Appointments</option>
              <option value="REQUESTED">Requested</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="RESCHEDULED">Rescheduled</option>
              <option value="CANCELLED">Cancelled</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </div>

          {/* Confirmed Slot */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirmed Slot (for approval/reschedule)
            </label>
            <input
              type="datetime-local"
              value={slot}
              onChange={(e) => setSlot(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Clinic Message */}
          <div className="lg:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Message to Parent (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Please bring vaccination record"
              value={msg}
              onChange={(e) => setMsg(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Appointments List */}
      {items.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl p-8 text-center">
          <p className="text-gray-500">No appointments found.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((a) => (
            <div
              key={a._id}
              className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-4">
                <div>
                  <span className={`inline-block px-2.5 py-0.5 text-xs font-semibold rounded-full ${getStatusColor(a.status)}`}>
                    {a.status}
                  </span>
                  <p className="mt-1 text-sm text-gray-600">
                    <span className="font-medium">Clinic:</span> {a.clinicId}
                  </p>
                </div>
                <div className="text-sm text-gray-700 flex flex-wrap gap-2">
                  {a.preferredSlots?.length > 0 && (
                    <div>
                      <span className="font-medium">Preferred:</span>{" "}
                      {a.preferredSlots.map((s) => new Date(s).toLocaleString()).join(" | ")}
                    </div>
                  )}
                  {a.confirmedSlot && (
                    <div>
                      <span className="font-medium">Confirmed:</span>{" "}
                      {new Date(a.confirmedSlot).toLocaleString()}
                    </div>
                  )}
                </div>
              </div>

              {a.clinicMessage && (
                <div className="mb-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                  <p className="text-sm text-blue-800">
                    <span className="font-medium">Clinic Note:</span> {a.clinicMessage}
                  </p>
                </div>
              )}

              <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-100">
                <button
                  onClick={() => doApprove(a._id)}
                  className="px-3 py-1.5 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                >
                  Approve
                </button>
                <button
                  onClick={() => doReschedule(a._id)}
                  className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Reschedule
                </button>
                <button
                  onClick={() => doCancel(a._id)}
                  className="px-3 py-1.5 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}