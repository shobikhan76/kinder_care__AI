import { useEffect, useState } from "react";
import { createChild, listChildren, deleteChild } from "../../api/parent.api.js";
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

  useEffect(() => { load(); }, []);

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    try {
      await createChild({ name, ageMonths: Number(ageMonths), gender });
      setName(""); setAgeMonths("");
      load();
    } catch (e2) {
      setErr(e2?.response?.data?.message || "Create child failed");
    }
  };

  const remove = async (id) => {
    setErr("");
    try {
      await deleteChild(id);
      load();
    } catch (e2) {
      setErr(e2?.response?.data?.message || "Delete failed");
    }
  };

  if (loading) return <Loader />;

  return (
    <div>
      <h2>Children</h2>
      {err && <p style={{ color: "crimson" }}>{err}</p>}

      <form onSubmit={submit} style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
        <input placeholder="Age (months)" value={ageMonths} onChange={(e) => setAgeMonths(e.target.value)} />
        <select value={gender} onChange={(e) => setGender(e.target.value)}>
          <option value="male">male</option>
          <option value="female">female</option>
        </select>
        <button>Add</button>
      </form>

      {items.length === 0 ? (
        <p>No children yet.</p>
      ) : (
        <ul>
          {items.map((c) => (
            <li key={c._id} style={{ marginBottom: 6 }}>
              {c.name} — {c.ageMonths} months — {c.gender}
              <button onClick={() => remove(c._id)} style={{ marginLeft: 10 }}>
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
