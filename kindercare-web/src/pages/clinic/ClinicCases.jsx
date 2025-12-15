import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  listClinicCases,
  updateClinicCaseStatus,
} from "../../api/clinic.api.js";
import Loader from "../../components/Loader.jsx";

// Status badge colors
const getStatusColor = (status) => {
  switch (status) {
    case "SUBMITTED":
      return "bg-yellow-100 text-yellow-800";
    case "IN_REVIEW":
      return "bg-blue-100 text-blue-800";
    case "FOLLOWUP_NEEDED":
      return "bg-purple-100 text-purple-800";
    case "CLOSED":
      return "bg-green-100 text-green-800";
    case "CANCELLED":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

// Severity badge
const getSeverityColor = (severity) => {
  if (!severity) return "bg-gray-100 text-gray-800";
  const s = severity.toLowerCase();
  if (s === "mild") return "bg-green-100 text-green-800";
  if (s === "moderate") return "bg-yellow-100 text-yellow-800";
  if (s === "severe") return "bg-red-100 text-red-800";
  return "bg-gray-100 text-gray-800";
};

export default function ClinicCases() {
  const [items, setItems] = useState([]);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [severity, setSeverity] = useState("");
  const [savingId, setSavingId] = useState(null);

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

  useEffect(() => {
    load();
  }, [status, severity]);

  const quickUpdateStatus = async (caseId, nextStatus) => {
    setErr("");
    setSavingId(caseId);
    try {
      await updateClinicCaseStatus(caseId, { status: nextStatus });
      load(); // Refresh to reflect updated status
    } catch (e) {
      setErr(e?.response?.data?.message || "Failed to update status");
    } finally {
      setSavingId(null);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="p-4 sm:p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Clinic Cases</h1>
        <p className="text-gray-600">Review and manage incoming pediatric triage cases</p>
      </div>

      {/* Error Banner */}
      {err && (
        <div
          className="mb-6 p-3 rounded-lg bg-red-50 text-red-700 border border-red-200"
          role="alert"
        >
          {err}
        </div>
      )}

      {/* Filters */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Statuses</option>
              <option value="SUBMITTED">Submitted</option>
              <option value="IN_REVIEW">In Review</option>
              <option value="FOLLOWUP_NEEDED">Follow-up Needed</option>
              <option value="CLOSED">Closed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>

          {/* Severity Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Severity
            </label>
            <select
              value={severity}
              onChange={(e) => setSeverity(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Severities</option>
              <option value="mild">Mild</option>
              <option value="moderate">Moderate</option>
              <option value="severe">Severe</option>
            </select>
          </div>

          {/* Refresh Button */}
          <div className="flex items-end">
            <button
              onClick={load}
              className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium"
            >
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Cases List */}
      {items.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl p-8 text-center">
          <p className="text-gray-500">No cases found.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((c) => {
            const lastNote =
              Array.isArray(c.clinicNotes) && c.clinicNotes.length > 0
                ? c.clinicNotes[c.clinicNotes.length - 1]
                : null;

            return (
              <div
                key={c._id}
                className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow transition-shadow"
              >
                <div className="flex flex-col lg:flex-row justify-between gap-4">
                  {/* Case Info */}
                  <div className="flex-1">
                    <div className="flex flex-wrap gap-2 mb-2">
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

                    <p className="text-sm">
                      <span className="font-medium">Child:</span>{" "}
                      {c.childId?.name || c.childId || "—"}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Created:</span>{" "}
                      {c.createdAt ? new Date(c.createdAt).toLocaleString() : "—"}
                    </p>

                    {/* Last Note Preview */}
                    <div className="mt-3">
                      <p className="text-xs font-medium text-gray-700 mb-1">Last Note</p>
                      {lastNote ? (
                        <p className="text-sm text-gray-800">
                          {lastNote.note.length > 100
                            ? lastNote.note.slice(0, 100) + "..."
                            : lastNote.note}
                          <span className="block text-xs text-gray-500 mt-1">
                            {lastNote.createdAt
                              ? new Date(lastNote.createdAt).toLocaleString()
                              : ""}
                          </span>
                        </p>
                      ) : (
                        <p className="text-sm text-gray-500 italic">No notes yet</p>
                      )}
                    </div>
                  </div>

                  {/* Quick Status & Action */}
                  <div className="w-full lg:w-64 flex flex-col gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Quick Status Update
                      </label>
                      <select
                        value={c.status}
                        disabled={savingId === c._id}
                        onChange={(e) => quickUpdateStatus(c._id, e.target.value)}
                        className="w-full text-sm px-2.5 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="SUBMITTED">Submitted</option>
                        <option value="IN_REVIEW">In Review</option>
                        <option value="FOLLOWUP_NEEDED">Follow-up Needed</option>
                        <option value="CLOSED">Closed</option>
                        <option value="CANCELLED">Cancelled</option>
                      </select>
                      {savingId === c._id && (
                        <p className="text-xs text-blue-600 mt-1">Saving...</p>
                      )}
                    </div>

                    <Link
                      to={`/clinic/cases/${c._id}`}
                      className="text-center text-sm font-medium text-blue-600 hover:text-blue-800 transition"
                    >
                      View Full Details →
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Safety Reminder */}
      <div className="mt-8 text-center">
        <p className="text-xs text-gray-500">
          <em>
            KinderCare AI provides decision-support only. Final clinical judgment rests with the healthcare provider.
          </em>
        </p>
      </div>
    </div>
  );
}