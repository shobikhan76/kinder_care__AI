import { useEffect, useState } from "react";
import {
  createChild,
  listChildren,
  deleteChild,
} from "../../api/parent.api.js";
import Loader from "../../components/Loader.jsx";

export default function Children() {
  const [items, setItems] = useState([]);
  const [name, setName] = useState("");
  const [ageMonths, setAgeMonths] = useState("");
  const [gender, setGender] = useState("male");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setErr("");
    setLoading(true);
    try {
      const res = await listChildren();
      setItems(res.data.data || []);
    } catch (e) {
      setErr(e?.response?.data?.message || "Failed to load children");
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

    const ageNum = Number(ageMonths);
    if (!name.trim() || isNaN(ageNum) || ageNum < 0 || ageNum > 240) {
      setErr("Please enter a valid name and age (0–240 months).");
      return;
    }

    try {
      await createChild({ name: name.trim(), ageMonths: ageNum, gender });
      setName("");
      setAgeMonths("");
      load();
    } catch (e2) {
      setErr(e2?.response?.data?.message || "Failed to add child");
    }
  };

  const remove = async (id, name) => {
    if (!confirm(`Are you sure you want to remove ${name} from your profile? This cannot be undone.`)) return;
    setErr("");
    try {
      await deleteChild(id);
      load();
    } catch (e2) {
      setErr(e2?.response?.data?.message || "Failed to delete child");
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="p-4 sm:p-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">My Children</h1>
        <p className="text-gray-600">
          Manage your children's profiles for personalized AI triage support
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

      {/* Add Child Form */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 mb-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Add a Child</h2>
        <form onSubmit={submit} className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <div className="sm:col-span-2">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              id="name"
              type="text"
              placeholder="e.g. Ali Ahmed"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">
              Age (months)
            </label>
            <input
              id="age"
              type="number"
              min="0"
              max="240"
              placeholder="e.g. 18"
              value={ageMonths}
              onChange={(e) => setAgeMonths(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
            <p className="mt-1 text-xs text-gray-500">0–240 months (0–20 years)</p>
          </div>

          <div>
            <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
              Gender
            </label>
            <select
              id="gender"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>

          <div className="sm:col-span-4 pt-2">
            <button
              type="submit"
              className="w-full sm:w-auto px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-indigo-700 shadow transition"
            >
              Add Child
            </button>
          </div>
        </form>
      </div>

      {/* Children List */}
      <div>
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Your Children</h2>

        {items.length === 0 ? (
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-8 text-center">
            <p className="text-gray-500">
              You haven’t added any children yet. Add a child to start using KinderCare AI triage.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((child) => (
              <div
                key={child._id}
                className="flex items-center justify-between bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow"
              >
                <div>
                  <h3 className="font-medium text-gray-800">{child.name}</h3>
                  <p className="text-sm text-gray-600">
                    {Math.floor(child.ageMonths / 12)} years {child.ageMonths % 12} months •{" "}
                    {child.gender === "male" ? "Male" : "Female"}
                  </p>
                </div>
                <button
                  onClick={() => remove(child._id, child.name)}
                  className="text-red-600 hover:text-red-800 text-sm font-medium px-3 py-1.5 rounded hover:bg-red-50 transition"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Privacy Note */}
      <div className="mt-8 text-center">
        <p className="text-xs text-gray-500">
          <em>
            Child profiles are stored securely and used only for personalized triage support.
            Data is encrypted and never shared without consent.
          </em>
        </p>
      </div>
    </div>
  );
}