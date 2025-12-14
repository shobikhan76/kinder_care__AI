import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/http";

export default function ParentIntake() {
  const [childAge, setChildAge] = useState("");
  const [symptoms, setSymptoms] = useState("");
  const [severity, setSeverity] = useState("Low");
  const [duration, setDuration] = useState("");

  const [data, setData] = useState(null);
  const [err, setErr] = useState("");

  const [cases, setCases] = useState([]);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [loadingCases, setLoadingCases] = useState(true);

  const loadMyCases = async () => {
    try {
      setLoadingCases(true);
      const res = await api.get("/cases/mine");
      setCases(res.data.cases || []);
    } catch (e) {
      setErr(e?.response?.data?.error || "Failed to load your cases");
    } finally {
      setLoadingCases(false);
    }
  };

  useEffect(() => {
    loadMyCases();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    setData(null);
    setLoadingSubmit(true);

    try {
      const res = await api.post("/cases/create", {
        childAge: Number(childAge),
        symptoms,
        severity,
        duration,
        inputType: "text",
      });

      setData(res.data.case);
      await loadMyCases();

      // Reset form
      setChildAge("");
      setSymptoms("");
      setSeverity("Low");
      setDuration("");
    } catch (e) {
      const errorMsg =
        e?.response?.data?.error ||
        (Array.isArray(e?.response?.data?.details)
          ? e.response.data.details.join(", ")
          : "") ||
        "Submission failed";
      setErr(errorMsg);
    } finally {
      setLoadingSubmit(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Parent Intake</h1>

      {/* Intake Form */}
      <form onSubmit={submit} className="space-y-4 mb-8 max-w-2xl">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Child Age (years)
          </label>
          <input
            type="number"
            min="0"
            placeholder="e.g. 5"
            value={childAge}
            onChange={(e) => setChildAge(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Symptoms
          </label>
          <textarea
            rows={4}
            placeholder="Describe symptoms (e.g. fever, cough, rash...)"
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Severity
          </label>
          <select
            value={severity}
            onChange={(e) => setSeverity(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Duration
          </label>
          <input
            type="text"
            placeholder="e.g. 2 days"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <button
          type="submit"
          disabled={loadingSubmit}
          className={`w-full py-2 px-4 rounded-md text-white font-medium ${
            loadingSubmit
              ? "bg-indigo-400 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-700"
          } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
        >
          {loadingSubmit ? "Submitting..." : "Submit Case"}
        </button>
      </form>

      <p className="text-xs text-gray-500 mb-6">
        ⚠️ Decision-support only. Not a diagnosis or prescription.
      </p>

      {err && (
        <div className="mb-6 p-3 bg-red-50 text-red-700 rounded-md border border-red-200">
          {err}
        </div>
      )}

      {/* Triage Result Preview */}
      {data && (
        <div className="mb-10 max-w-2xl p-5 border border-gray-200 rounded-lg bg-blue-50">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            Triage Result: <span className="text-blue-800">{data.triageResult}</span>
          </h2>

          {data.redFlags?.length > 0 && (
            <div className="mb-3">
              <p className="font-medium text-red-700">Red Flags:</p>
              <ul className="list-disc list-inside mt-1 space-y-1">
                {data.redFlags.map((flag, i) => (
                  <li key={i} className="text-red-600">
                    {flag}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="bg-white p-3 rounded border whitespace-pre-wrap text-gray-800">
            {data.aiSummary || "No summary available."}
          </div>
        </div>
      )}

      {/* My Cases Section */}
      <div className="border-t pt-8 mt-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">My Submitted Cases</h2>
          <button
            onClick={loadMyCases}
            disabled={loadingCases}
            className={`px-4 py-2 text-sm rounded-md ${
              loadingCases
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
            }`}
          >
            {loadingCases ? "Refreshing..." : "Refresh List"}
          </button>
        </div>

        {loadingCases ? (
          <p className="text-gray-500">Loading your cases...</p>
        ) : cases.length > 0 ? (
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Age</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Severity</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Triage</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Symptoms</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {cases.map((c) => (
                  <tr key={c._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">
                      {new Date(c.createdAt).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">{c.childAge}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{c.severity}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{c.triageResult}</td>
                    <td className="px-4 py-3 text-sm text-gray-700 max-w-xs truncate" title={c.symptoms}>
                      {c.symptoms}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <Link
                        to={`/cases/${c._id}`}
                        className="text-indigo-600 hover:text-indigo-800 font-medium"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-6 text-gray-500 border border-dashed border-gray-300 rounded-lg">
            No cases submitted yet.
          </div>
        )}
      </div>
    </div>
  );
}