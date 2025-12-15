import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  createCase,
  listCases,
  listChildren,
  listClinics,
} from "../../api/parent.api.js";
import Loader from "../../components/Loader.jsx";

// Status badge colors — consistent across app
const getStatusColor = (status) => {
  switch (status) {
    case "OPEN": return "bg-green-100 text-green-800";
    case "PENDING_TRIAGE": return "bg-yellow-100 text-yellow-800";
    case "TRIAGED": return "bg-blue-100 text-blue-800";
    case "REFERRED": return "bg-purple-100 text-purple-800";
    case "CLOSED": return "bg-gray-100 text-gray-800";
    case "CANCELLED": return "bg-red-100 text-red-800";
    default: return "bg-gray-100 text-gray-800";
  }
};

// Severity badge
const getSeverityColor = (severity) => {
  if (!severity) return "bg-gray-100 text-gray-800";
  switch (severity.toLowerCase()) {
    case "mild": return "bg-green-100 text-green-800";
    case "moderate": return "bg-yellow-100 text-yellow-800";
    case "severe": return "bg-red-100 text-red-800";
    default: return "bg-gray-100 text-gray-800";
  }
};

const getClinicName = (clinicId, clinics) => {
  const match = clinics.find((c) => c.clinicId === clinicId);
  return match?.clinicName || clinicId;
};

export default function Cases() {
  const [children, setChildren] = useState([]);
  const [items, setItems] = useState([]);
  const [clinics, setClinics] = useState([]);

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
      const [c, ch, cl] = await Promise.all([listCases(), listChildren(), listClinics()]);
      setItems(c.data.data || []);
      setChildren(ch.data.data || []);
      setClinics(cl.data.data || []);
      if (ch.data.data.length > 0 && !childId) {
        setChildId(ch.data.data[0]._id); // auto-select first child
      }
      if ((cl.data.data || []).length > 0 && !clinicId) {
        setClinicId(cl.data.data[0].clinicId);
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

    const cleanSymptoms = symptoms
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    if (!childId || !clinicId || cleanSymptoms.length === 0 || !duration.trim()) {
      setErr("Please select a child, choose a clinic, describe at least one symptom, and specify duration.");
      return;
    }

    try {
      await createCase({
        childId,
        clinicId,
        symptoms: cleanSymptoms,
        severity,
        duration: duration.trim(),
        inputType: "text",
      });
      setSymptoms("");
      setDuration("");
      load();
    } catch (e2) {
      setErr(e2?.response?.data?.message || "Failed to create case. Please try again.");
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">My Cases</h1>
        <p className="text-gray-600">
          Report symptoms for AI-assisted pediatric triage support
        </p>
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

      {/* Create Case Form */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Create New Case</h2>
        <form onSubmit={submit} className="space-y-4">
          {/* Child Selection */}
          <div>
            <label htmlFor="child" className="block text-sm font-medium text-gray-700 mb-1">
              Select Child
            </label>
            {children.length === 0 ? (
              <p className="text-sm text-gray-500 italic">
                No children registered. Please add a child profile first.
              </p>
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

          {/* Clinic Selection */}
          <div>
            <label htmlFor="clinicId" className="block text-sm font-medium text-gray-700 mb-1">
              Choose Clinic
            </label>
            {clinics.length === 0 ? (
              <p className="text-sm text-gray-500 italic">
                No clinics available right now.
              </p>
            ) : (
              <select
                id="clinicId"
                value={clinicId}
                onChange={(e) => setClinicId(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Select a clinic</option>
                {clinics.map((cl) => (
                  <option key={cl.clinicId} value={cl.clinicId}>
                    {cl.clinicName}
                  </option>
                ))}
              </select>
            )}
            <p className="mt-1 text-xs text-gray-500">
              Choose the clinic to send this case to (clinic ID is handled automatically).
            </p>
          </div>

          {/* Symptoms */}
          <div>
            <label htmlFor="symptoms" className="block text-sm font-medium text-gray-700 mb-1">
              Symptoms (comma-separated)
            </label>
            <input
              id="symptoms"
              type="text"
              placeholder="e.g. fever, cough, rash"
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
            <p className="mt-1 text-xs text-gray-500">
              List all symptoms you’ve observed (e.g. “fever, vomiting, lethargy”)
            </p>
          </div>

          {/* Duration */}
          <div>
            <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">
              How long has this been going on?
            </label>
            <input
              id="duration"
              type="text"
              placeholder="e.g. 2 days, 6 hours"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          {/* Severity */}
          <div>
            <label htmlFor="severity" className="block text-sm font-medium text-gray-700 mb-1">
              Estimated Severity
            </label>
            <select
              id="severity"
              value={severity}
              onChange={(e) => setSeverity(e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="mild">Mild (child is active, eating/drinking)</option>
              <option value="moderate">Moderate (some discomfort, reduced activity)</option>
              <option value="severe">Severe (lethargic, not eating, distressed)</option>
            </select>
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
            Submit for Triage
          </button>
        </form>
      </div>

      {/* Safety Note */}
      <div className="mb-8 text-center">
        <p className="text-xs text-gray-500">
          <em>
            KinderCare AI provides decision-support only. It does not diagnose or prescribe treatment.
            In emergencies, contact your local health services immediately.
          </em>
        </p>
      </div>

      {/* My Cases List */}
      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">My Cases</h2>

        {items.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-xl p-8 text-center">
            <p className="text-gray-500">You haven’t created any cases yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((c) => (
              <div
                key={c._id}
                className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow transition-shadow"
              >
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-3">
                  <span
                    className={`inline-block px-2.5 py-0.5 text-xs font-semibold rounded-full ${getStatusColor(c.status)}`}
                  >
                    {c.status.replace(/_/g, " ")}
                  </span>
                  <span
                    className={`inline-block px-2.5 py-0.5 text-xs font-semibold rounded-full ${getSeverityColor(c.severity)}`}
                  >
                    {c.severity}
                  </span>
                </div>

                <div className="text-sm text-gray-700 space-y-1 mb-3">
                  <div>
                    <span className="font-medium">Clinic:</span> {getClinicName(c.clinicId, clinics)}
                  </div>
                  <div>
                    <span className="font-medium">Created:</span> {new Date(c.createdAt).toLocaleString()}
                  </div>
                </div>

                <Link
                  to={`/parent/cases/${c._id}`}
                  className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                >
                  View Details →
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
