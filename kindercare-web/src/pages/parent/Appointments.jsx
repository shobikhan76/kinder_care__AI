import { useEffect, useState } from "react";
import {
  listAppointments,
  requestAppointment,
  cancelAppointment,
  listChildren,
} from "../../api/parent.api.js";
import Loader from "../../components/Loader.jsx";

// Helper: format datetime for input
const toLocalDateTime = (date) => {
  if (!date) return "";
  const d = new Date(date);
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
};

// Status badge colors
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
      if (c.data.data.length > 0 && !childId) {
        setChildId(c.data.data[0]._id); // auto-select first child
      }
    } catch (e) {
      setErr(e?.response?.data?.message || "Failed to load your data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    setErr("");

    if (!childId || !clinicId || !slot1) {
      setErr("Please select a child, enter a clinic ID, and choose at least one time slot.");
      return;
    }

    try {
      const preferredSlots = [slot1, slot2]
        .filter(Boolean)
        .map((s) => new Date(s).toISOString());

      await requestAppointment({ childId, clinicId, preferredSlots });
      setChildId(children.length > 0 ? children[0]._id : "");
      setClinicId("");
      setSlot1("");
      setSlot2("");
      load();
    } catch (e2) {
      setErr(e2?.response?.data?.message || "Appointment request failed. Please try again.");
    }
  };

  const onCancel = async (id) => {
    if (!confirm("Are you sure you want to cancel this appointment request?")) return;
    setErr("");
    try {
      await cancelAppointment(id);
      load();
    } catch (e2) {
      setErr(e2?.response?.data?.message || "Cancellation failed");
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">My Appointments</h1>
        <p className="text-gray-600">Request and manage pediatric consultation appointments</p>
      </div>

      {/* Error Banner */}
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

      {/* Request Appointment Section */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Request New Appointment</h2>
        <form onSubmit={submit} className="space-y-4">
          {/* Child Selection */}
          <div>
            <label htmlFor="child" className="block text-sm font-medium text-gray-700 mb-1">
              Select Child
            </label>
            {children.length === 0 ? (
              <p className="text-sm text-gray-500 italic">No children registered. Please add a child profile first.</p>
            ) : (
              <select
                id="child"
                value={childId}
                onChange={(e) => setChildId(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Choose a child</option>
                {children.map((ch) => (
                  <option key={ch._id} value={ch._id}>
                    {ch.name} ({Math.floor(ch.ageMonths / 12)}y {ch.ageMonths % 12}m)
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Clinic ID */}
          <div>
            <label htmlFor="clinicId" className="block text-sm font-medium text-gray-700 mb-1">
              Clinic ID
            </label>
            <input
              id="clinicId"
              type="text"
              placeholder="e.g. clinic_karachi_01"
              value={clinicId}
              onChange={(e) => setClinicId(e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
            <p className="mt-1 text-xs text-gray-500">
              Provided by your clinic or found in their KinderCare AI profile
            </p>
          </div>

          {/* Time Slots */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="slot1" className="block text-sm font-medium text-gray-700 mb-1">
                Preferred Time (1)
              </label>
              <input
                id="slot1"
                type="datetime-local"
                value={slot1}
                onChange={(e) => setSlot1(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label htmlFor="slot2" className="block text-sm font-medium text-gray-700 mb-1">
                Alternate Time (Optional)
              </label>
              <input
                id="slot2"
                type="datetime-local"
                value={slot2}
                onChange={(e) => setSlot2(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={children.length === 0}
            className={`w-full py-2.5 px-4 rounded-lg font-medium text-white transition ${
              children.length === 0
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md hover:shadow"
            }`}
          >
            Request Appointment
          </button>
        </form>
      </div>

      {/* My Appointments List */}
      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">My Appointment Requests</h2>

        {items.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-xl p-8 text-center">
            <p className="text-gray-500">You haven’t requested any appointments yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((a) => (
              <div
                key={a._id}
                className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow transition-shadow"
              >
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-3">
                  <span
                    className={`inline-block px-2.5 py-0.5 text-xs font-semibold rounded-full ${getStatusColor(a.status)}`}
                  >
                    {a.status}
                  </span>
                  <span className="text-sm text-gray-600">
                    <span className="font-medium">Clinic:</span> {a.clinicId}
                  </span>
                </div>

                <div className="text-sm text-gray-700 space-y-1">
                  {a.preferredSlots?.length > 0 && (
                    <div>
                      <span className="font-medium">Preferred Times:</span>{" "}
                      {a.preferredSlots.map((s) => new Date(s).toLocaleString()).join(" | ")}
                    </div>
                  )}
                  {a.confirmedSlot && (
                    <div>
                      <span className="font-medium">Confirmed Time:</span>{" "}
                      {new Date(a.confirmedSlot).toLocaleString()}
                    </div>
                  )}
                </div>

                {/* Cancel Button (only if actionable) */}
                {a.status !== "CANCELLED" && a.status !== "COMPLETED" && (
                  <button
                    onClick={() => onCancel(a._id)}
                    className="mt-3 px-3 py-1.5 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                  >
                    Cancel Request
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}