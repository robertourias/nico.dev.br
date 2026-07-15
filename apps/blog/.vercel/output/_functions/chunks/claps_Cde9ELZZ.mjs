const API_URL = process.env.CLAPS_API_URL;
const API_SECRET = process.env.CLAPS_API_SECRET;
class ClapsApiError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
    this.name = "ClapsApiError";
  }
}
function authHeaders(extra) {
  return { "X-Internal-Secret": API_SECRET, ...extra };
}
async function getClaps(slug, uid) {
  const url = new URL(`${API_URL}/claps/${slug}`);
  if (uid) url.searchParams.set("uid", uid);
  const res = await fetch(url, { headers: authHeaders() });
  if (!res.ok) throw new ClapsApiError(res.status, `claps api ${res.status} (GET ${slug})`);
  return res.json();
}
async function getClapsTotals(slugs) {
  const url = new URL(`${API_URL}/claps`);
  url.searchParams.set("slugs", slugs.join(","));
  const res = await fetch(url, { headers: authHeaders() });
  if (!res.ok) throw new ClapsApiError(res.status, `claps api ${res.status} (GET totals)`);
  return res.json();
}
async function incrementClaps(slug, uid, amount) {
  const res = await fetch(`${API_URL}/claps/${slug}`, {
    method: "POST",
    headers: authHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify({ uid, amount })
  });
  if (!res.ok) throw new ClapsApiError(res.status, `claps api ${res.status} (POST ${slug})`);
  return res.json();
}

export { ClapsApiError as C, getClapsTotals as a, getClaps as g, incrementClaps as i };
