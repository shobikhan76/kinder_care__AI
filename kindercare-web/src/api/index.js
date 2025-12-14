import { api } from "./http";

export async function apiGet(path) {
  const res = await api.get(path);
  return res.data;
}
export async function apiPatch(path, body) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json?.message || "Request failed");
  return json.data ?? json;
}

export async function apiPost(path, body) {
  const res = await api.post(path, body);
  return res.data;
}

export async function apiDelete(path) {
  const res = await api.delete(path);
  return res.data;
}

export default api;
