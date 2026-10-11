export async function getHealth() {
  const res = await fetch("/api/health");
  if (!res.ok) throw new Error("Backend is not running.");
  return res.json();
}

export async function generateMission(payload) {
  const res = await fetch("/api/mission", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.detail || "Could not generate a mission.");
  }
  return data;
}
