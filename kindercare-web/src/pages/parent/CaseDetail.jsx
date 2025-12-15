import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getCase, cancelCase, listClinics } from "../../api/parent.api.js";
import Loader from "../../components/Loader.jsx";

// Status badge styling – consistent across app
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
    case "low": return "bg-green-100 text-green-800";
    case "medium": return "bg-yellow-100 text-yellow-800";
    case "high": return "bg-red-100 text-red-800";
    default: return "bg-gray-100 text-gray-800";
  }
};

const getClinicName = (clinicId, clinics) => {
  const match = clinics.find((c) => c.clinicId === clinicId);
  return match?.clinicName || clinicId || "-";
};

export default function CaseDetail() {
  const { caseId } = useParams();
  const [data, setData] = useState(null);
  const [clinics, setClinics] = useState([]);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setErr("");
    setLoading(true);
    try {
      const [caseRes, clinicRes] = await Promise.all([getCase(caseId), listClinics()]);
      setData(caseRes.data.data);
      setClinics(clinicRes.data.data || []);
    } catch (e) {
      setErr(e?.response?.data?.message || "Failed to load case details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (caseId) load();
  }, [caseId]);

  const doCancel = async () => {
    if (!confirm("Are you sure you want to cancel this case? This action cannot be undone.")) return;
    setErr("");
    try {
      await cancelCase(caseId);
      load(); // Refresh to show updated status
    } catch (e) {
      setErr(e?.response?.data?.message || "Failed to cancel case");
    }
  };

  if (loading) return <Loader />;
  if (err) {
    return (
      <div className="max-w-2xl mx-auto p-4">
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
          {err}
        </div>
      </div>
    );
  }
  if (!data) {
    return (
      <div className="max-w-2xl mx-auto p-4">
        <div className="bg-white border border-gray-200 rounded-xl p-6 text-center">
          <p className="text-gray-500">Case not found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Case Details</h1>
        <p className="text-gray-600">Review AI-assisted triage summary and clinic updates</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        {/* Header Bar */}
        <div className="bg-gray-50 px-5 py-4 border-b border-gray-200">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <span className={`inline-block px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(data.status)}`}>
                {data.status.replace(/_/g, " ")}
              </span>
            </div>
            {data.severity && (
              <span className={`inline-block px-3 py-1 text-sm font-semibold rounded-full ${getSeverityColor(data.severity)}`}>
                Severity: {data.severity}
              </span>
            )}
          </div>
        </div>

        {/* Case Info */}
        <div className="p-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5 text-sm">
            <div>
              <span className="font-medium text-gray-700">Case ID:</span>{" "}
              <span className="text-gray-900 ml-1">#{caseId}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Clinic:</span>{" "}
              <span className="text-gray-900 ml-1">{getClinicName(data.clinicId, clinics)}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Created:</span>{" "}
              <span className="text-gray-900 ml-1">
                {new Date(data.createdAt).toLocaleString()}
              </span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Duration:</span>{" "}
              <span className="text-gray-900 ml-1">{data.duration || "-"}</span>
            </div>
          </div>

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

          {/* Child Info */}
          {data.childId && (
            <div className="border-t border-gray-100 pt-4 mb-5">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Child Information</h3>
              <p className="text-gray-900">
                <span className="font-medium">{data.childId.name}</span>{" "}
                {Math.floor(data.childId.ageMonths / 12)}y {data.childId.ageMonths % 12}m{" "}
                {data.childId.gender}
              </p>
            </div>
          )}

          {/* Clinic Notes */}
          {Array.isArray(data.clinicNotes) && data.clinicNotes.length > 0 && (
            <div className="border-t border-gray-100 pt-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Clinic Updates</h3>
              <div className="space-y-3">
                {data.clinicNotes.map((note, idx) => (
                  <div
                    key={idx}
                    className="bg-gray-50 p-3 rounded-lg border border-gray-200"
                  >
                    <div className="text-xs text-gray-500 mb-1">
                      {new Date(note.createdAt).toLocaleString()}
                    </div>
                    <div className="text-gray-800">{note.note}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Button */}
          {!["CLOSED", "CANCELLED"].includes(data.status) && (
            <div className="mt-6 pt-4 border-t border-gray-100">
              <button
                onClick={doCancel}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm font-medium"
              >
                Cancel Case
              </button>
              <p className="text-xs text-gray-500 mt-2">
                Cancelling will stop further processing of this case.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Safety Disclaimer (aligned with Section 7) */}
      <div className="mt-6 text-center">
        <p className="text-xs text-gray-500">
          <em>KinderCare AI provides decision-support only. It does not diagnose or prescribe treatment.</em>
        </p>
      </div>
    </div>
  );
}
