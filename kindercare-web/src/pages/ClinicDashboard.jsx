import React, { useEffect, useState } from "react";
import { apiGet } from "../api";
import { useNavigate } from "react-router-dom";

// Helper function to return Tailwind classes based on triage result
function getBadgeClass(triageResult) {
  if (triageResult === "Emergency Care") return "bg-red-100 text-red-800";
  if (triageResult && triageResult.includes("GP Visit")) return "bg-yellow-100 text-yellow-800";
  return "bg-green-100 text-green-800";
}

export default function ClinicDashboard() {
  const [cases, setCases] = useState([]);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const data = await apiGet("/cases/clinic");
        setCases(Array.isArray(data) ? data : data?.cases || []);
      } catch (e) {
        setErr(e?.response?.data?.error || e?.message || "Failed to load cases");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-2">
        <h2 className="text-2xl font-bold text-gray-900">Clinic Dashboard</h2>
        <p className="text-sm text-gray-600 mt-1">
          Decision-support only. This is not a diagnosis.
        </p>
      </div>

      {loading && (
        <div className="text-center py-6 text-gray-500">Loading cases...</div>
      )}

      {err && (
        <div className="rounded-md bg-red-50 p-4 mb-6">
          <p className="text-sm text-red-800">{err}</p>
        </div>
      )}

      {!loading && !err && (
        <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Age
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Symptoms
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Severity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Triage
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Red Flags
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Submitted
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {cases.length > 0 ? (
                cases.map((c) => (
                  <tr
                    key={c._id}
                    onClick={() => navigate(`/cases/${c._id}`)}
                    className="hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {c.childAge}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700 max-w-xs">
                      <div className="truncate" title={c.symptoms || ""}>
                        {c.symptoms?.slice(0, 60) || "—"}
                        {c.symptoms?.length > 60 && "..."}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {c.severity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${getBadgeClass(c.triageResult)}`}
                      >
                        {c.triageResult}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {c.redFlags?.length ? `${c.redFlags.length} flag(s)` : "—"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(c.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-8 text-center text-sm text-gray-500"
                  >
                    No cases yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}