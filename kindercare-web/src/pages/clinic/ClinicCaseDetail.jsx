import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getClinicCase,
  addClinicNote,
  updateClinicCaseStatus,
} from "../../api/clinic.api.js";

// Status badge colors
const getStatusColor = (status) => {
  switch (status) {
    case "OPEN":
    case "PENDING_TRIAGE":
      return "bg-yellow-100 text-yellow-800";
    case "TRIAGED":
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
  if (s === "mild" || s === "low") return "bg-green-100 text-green-800";
  if (s === "moderate" || s === "medium") return "bg-yellow-100 text-yellow-800";
  if (s === "severe" || s === "high") return "bg-red-100 text-red-800";
  return "bg-gray-100 text-gray-800";
};

export default function ClinicCaseDetail() {
  const { caseId } = useParams();
  const [data, setData] = useState(null);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [note, setNote] = useState("");
  const [status, setStatus] = useState("IN_REVIEW");

  const load = async () => {
    setErr("");
    setLoading(true);
    try {
      const res = await getClinicCase(caseId);
      const c = res.data.data;
      setData(c);
      if (c?.status) setStatus(c.status);
    } catch (e) {
      setErr(e?.response?.data?.message || "Failed to load case details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (caseId) load();
  }, [caseId]);

  const saveStatus = async () => {
    setErr("");
    try {
      await updateClinicCaseStatus(caseId, { status });
      load();
    } catch (e) {
      setErr(e?.response?.data?.message || "Failed to update status");
    }
  };

  const submitNote = async (e) => {
    e.preventDefault();
    setErr("");
    if (!note.trim()) return setErr("Please enter a note before submitting.");

    try {
      await addClinicNote(caseId, { note: note.trim() });
      setNote("");
      load();
    } catch (e) {
      setErr(e?.response?.data?.message || "Failed to add note");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="text-center">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-3 animate-pulse">
            <span className="text-white font-bold">K</span>
          </div>
          <p className="text-gray-600">Loading case details...</p>
        </div>
      </div>
    );
  }

  if (err) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
          {err}
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="bg-white border border-gray-200 rounded-xl p-8 text-center">
          <p className="text-gray-500">Case not found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Case Review</h1>
        <p className="text-gray-600">Review AI-assisted triage and provide clinical input</p>
      </div>

      {/* Error Banner */}
      {err && (
        <div className="mb-6 p-3 rounded-lg bg-red-50 text-red-700 border border-red-200">
          {err}
        </div>
      )}

      {/* Case Summary Card */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm mb-8">
        <div className="bg-gray-50 px-5 py-4 border-b border-gray-200">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span
              className={`inline-block px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(data.status)}`}
            >
              {data.status.replace(/_/g, " ")}
            </span>
            {data.severity && (
              <span
                className={`inline-block px-3 py-1 text-sm font-semibold rounded-full ${getSeverityColor(data.severity)}`}
              >
                Severity: {data.severity}
              </span>
            )}
          </div>
        </div>

        <div className="p-5">
          {/* Symptoms */}
          <div className="mb-5">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Reported Symptoms</h3>
            {data.symptoms && data.symptoms.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {data.symptoms.map((symptom, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 bg-blue-50 text-blue-800 text-xs rounded-full"
                  >
                    {symptom}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No symptoms recorded.</p>
            )}
          </div>

          {/* Metadata */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5 text-sm">
            <div>
              <span className="font-medium text-gray-700">Duration:</span>{" "}
              <span className="text-gray-900 ml-1">{data.duration || "—"}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Created:</span>{" "}
              <span className="text-gray-900 ml-1">
                {data.createdAt ? new Date(data.createdAt).toLocaleString() : "—"}
              </span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Case ID:</span>{" "}
              <span className="text-gray-900 ml-1">#{caseId}</span>
            </div>
          </div>

          {/* Child Info */}
          <div className="border-t border-gray-100 pt-4 mb-5">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Child Information</h3>
            <div className="space-y-1 text-sm">
              <div>
                <span className="font-medium">Name:</span>{" "}
                <span>{data.childId?.name || "—"}</span>
              </div>
              <div>
                <span className="font-medium">Age:</span>{" "}
                <span>
                  {data.childId?.ageMonths !== undefined
                    ? `${Math.floor(data.childId.ageMonths / 12)}y ${data.childId.ageMonths % 12}m`
                    : "—"}
                </span>
              </div>
              <div>
                <span className="font-medium">Gender:</span>{" "}
                <span>{data.childId?.gender || "—"}</span>
              </div>
            </div>
          </div>

          {/* Attachments */}
          {Array.isArray(data.attachments) && data.attachments.length > 0 && (
            <div className="border-t border-gray-100 pt-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Attachments</h3>
              <ul className="space-y-2">
                {data.attachments.map((a, idx) => (
                  <li key={idx} className="text-sm">
                    <span className="font-medium text-gray-700">{a.type}:</span>{" "}
                    <a
                      href={a.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 underline ml-1"
                    >
                      View
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Update Status */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 mb-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Update Case Status</h2>
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-end">
          <div className="w-full sm:w-64">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              New Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="IN_REVIEW">In Review</option>
              <option value="FOLLOWUP_NEEDED">Follow-up Needed</option>
              <option value="CLOSED">Closed</option>
            </select>
          </div>
          <button
            onClick={saveStatus}
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition shadow"
          >
            Save Status
          </button>
        </div>
      </div>

      {/* Add Note */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 mb-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Add Clinical Note</h2>
        <form onSubmit={submitNote}>
          <textarea
            rows={4}
            placeholder="Add your clinical observations, recommendations, or parent guidance..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <button
            type="submit"
            className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium"
          >
            Add Note
          </button>
        </form>
      </div>

      {/* Clinic Notes */}
      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Clinical Notes</h2>
        {(!data.clinicNotes || data.clinicNotes.length === 0) ? (
          <p className="text-gray-500">No notes added yet.</p>
        ) : (
          <div className="space-y-4">
            {data.clinicNotes.map((n, idx) => (
              <div key={idx} className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                <div className="text-xs text-gray-500 mb-1">
                  {n.createdAt ? new Date(n.createdAt).toLocaleString() : "-"}
                </div>
                <div className="text-gray-800">{n.note}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Safety Disclaimer */}
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