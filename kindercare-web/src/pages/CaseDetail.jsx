import React, { useEffect, useMemo, useState } from "react";
import { apiGet, apiPatch } from "../api";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

const STATUS_OPTIONS = [
  "Submitted",
  "Under Review",
  "Clinic Contacted",
  "Appointment Booked",
  "Closed",
];

function statusLabel(status) {
  switch (status) {
    case "Submitted":
      return { text: "Submitted", cls: "bg-gray-100 text-gray-800" };
    case "Under Review":
      return { text: "Under Review", cls: "bg-yellow-100 text-yellow-800" };
    case "Clinic Contacted":
      return { text: "Clinic Contacted", cls: "bg-blue-100 text-blue-800" };
    case "Appointment Booked":
      return { text: "Appointment Booked", cls: "bg-indigo-100 text-indigo-800" };
    case "Closed":
      return { text: "Closed", cls: "bg-green-100 text-green-800" };
    default:
      return { text: status || "—", cls: "bg-gray-100 text-gray-800" };
  }
}

function parentGuidance(status, triageResult) {
  // Non-diagnostic, safety-aligned text
  if (triageResult === "Emergency Care") {
    return "If your child is getting worse or you are worried, seek emergency care immediately. This is not a diagnosis.";
  }

  switch (status) {
    case "Submitted":
    case "Under Review":
      return "A clinic may contact you. Please keep your phone available and continue monitoring symptoms. This is not a diagnosis.";
    case "Clinic Contacted":
      return "The clinic has contacted you. Please follow the clinician’s instructions. This is not a diagnosis.";
    case "Appointment Booked":
      return "An appointment has been arranged. Please follow the appointment instructions and attend on time. This is not a diagnosis.";
    case "Closed":
      return "This case has been closed. If symptoms persist or worsen, submit a new case or seek medical advice. This is not a diagnosis.";
    default:
      return "Please continue monitoring symptoms and seek medical care if you are concerned. This is not a diagnosis.";
  }
}

export default function CaseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [caseData, setCaseData] = useState(null);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);

  // clinic follow-up state
  const [status, setStatus] = useState("Submitted");
  const [clinicNotes, setClinicNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");

  const isClinicUser = user?.role === "Clinic" || user?.role === "Admin";

  useEffect(() => {
    (async () => {
      try {
        const data = await apiGet(`/cases/${id}`);
        setCaseData(data);

        // init follow-up fields
        setStatus(data.status || "Submitted");
        setClinicNotes(data.clinicNotes || "");
      } catch (e) {
        setErr(e.message || "Failed to load case details");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const statusChip = useMemo(() => statusLabel(caseData?.status || status), [caseData?.status, status]);

  async function handleSaveFollowUp() {
    setSaving(true);
    setSaveMsg("");
    setErr("");

    try {
      const updated = await apiPatch(`/cases/${id}/status`, {
        status,
        clinicNotes,
      });

      setCaseData(updated);
      setStatus(updated.status || status);
      setClinicNotes(updated.clinicNotes || clinicNotes);
      setSaveMsg("✅ Follow-up saved.");
    } catch (e) {
      setErr(e.message || "Failed to save follow-up");
    } finally {
      setSaving(false);
      setTimeout(() => setSaveMsg(""), 2500);
    }
  }

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  if (err) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="text-red-600">{err}</div>
      </div>
    );
  }

  if (!caseData) return null;

  const guidanceText = parentGuidance(caseData.status || status, caseData.triageResult);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 text-indigo-600 hover:text-indigo-800 font-medium flex items-center"
      >
        ← Back
      </button>

      <h1 className="text-2xl font-bold text-gray-900 mb-1">Case Detail</h1>
      <p className="text-sm text-gray-600 mt-0">
        Decision-support only. This is not a diagnosis.
      </p>

      {/* Follow-up Status (visible to parents + clinic) */}
      <div className="bg-white border border-gray-200 rounded-lg p-5 mb-6 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-gray-900">Clinic Follow-up Status</h2>
          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${statusChip.cls}`}>
            {statusChip.text}
          </span>
        </div>

        <p className="text-gray-700 mt-3">{guidanceText}</p>

        {caseData.reviewedAt && (
          <p className="text-xs text-gray-500 mt-2">
            Reviewed: {new Date(caseData.reviewedAt).toLocaleString()}
            {caseData.reviewedBy ? ` • By: ${caseData.reviewedBy}` : ""}
          </p>
        )}

        {/* Show clinic notes to parent only if you want.
            MVP option: show notes to all roles (simple). */}
        {caseData.clinicNotes ? (
          <div className="mt-4">
            <div className="text-sm font-semibold text-gray-900">Clinic Notes</div>
            <div className="text-sm text-gray-800 whitespace-pre-wrap mt-1">
              {caseData.clinicNotes}
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Notes are informational only and do not replace medical advice.
            </p>
          </div>
        ) : (
          <p className="text-sm text-gray-500 mt-3">
            No clinic notes yet.
          </p>
        )}
      </div>

      {/* Triage Result */}
      <div className="bg-white border border-gray-200 rounded-lg p-5 mb-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Triage Result</h2>
        <div className="text-xl font-bold text-gray-900">{caseData.triageResult}</div>
        <div className="text-sm text-gray-600 mt-2">
          Submitted: {new Date(caseData.createdAt).toLocaleString()}
        </div>
      </div>

      {/* AI Summary */}
      <div className="bg-white border border-gray-200 rounded-lg p-5 mb-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">AI Summary</h2>
        <p className="text-gray-800 mb-0">{caseData.summary || "—"}</p>
      </div>

      {/* Red Flags */}
      <div className="bg-white border border-gray-200 rounded-lg p-5 mb-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Red Flags</h2>
        {caseData.redFlags?.length ? (
          <ul className="list-disc list-inside space-y-1 mt-2 text-gray-800">
            {caseData.redFlags.map((flag, idx) => (
              <li key={idx}>{flag}</li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600 mt-2">No red flags recorded.</p>
        )}
      </div>

      {/* Clinic Follow-up Panel (Clinic/Admin only) */}
      {isClinicUser && (
        <div className="bg-white border border-gray-200 rounded-lg p-5 mb-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Clinic Follow-up (Clinic/Admin)</h2>
          <p className="text-sm text-gray-600 mt-0">
            Update follow-up status and notes. Do not enter diagnoses or prescriptions.
          </p>

          <div className="mt-4">
            <label className="text-sm font-medium text-gray-900">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="mt-2 w-full border border-gray-300 rounded-md px-3 py-2"
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div className="mt-4">
            <label className="text-sm font-medium text-gray-900">Clinic Notes</label>
            <textarea
              value={clinicNotes}
              onChange={(e) => setClinicNotes(e.target.value)}
              rows={4}
              className="mt-2 w-full border border-gray-300 rounded-md px-3 py-2"
              placeholder="Example: Called parent, advised urgent clinic visit today. Appointment booked at 3 PM."
            />
            <p className="text-xs text-gray-500 mt-2">
              Keep notes brief and non-diagnostic.
            </p>
          </div>

          <div className="mt-4 flex items-center gap-3">
            <button
              onClick={handleSaveFollowUp}
              disabled={saving}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save Follow-up"}
            </button>
            {saveMsg && <span className="text-sm text-green-700">{saveMsg}</span>}
          </div>
        </div>
      )}

      {/* Parent Input */}
      <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Parent Input (Read-only)</h2>
        <div className="space-y-2 text-gray-800">
          <div><span className="font-medium">Age:</span> {caseData.childAge}</div>
          <div><span className="font-medium">Severity:</span> {caseData.severity}</div>
          <div><span className="font-medium">Duration:</span> {caseData.duration}</div>
          <div className="mt-3">
            <span className="font-medium">Symptoms:</span>
          </div>
          <div className="whitespace-pre-wrap text-gray-800 mt-1">
            {caseData.symptoms || "—"}
          </div>
        </div>
      </div>
    </div>
  );
}
