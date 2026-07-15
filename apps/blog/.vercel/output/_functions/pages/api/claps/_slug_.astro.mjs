import { g as getCollection } from '../../../chunks/_astro_content_J4_-eXIA.mjs';
import { g as getClaps, C as ClapsApiError, i as incrementClaps } from '../../../chunks/claps_Cde9ELZZ.mjs';
export { renderers } from '../../../renderers.mjs';

const prerender = false;
const UID_COOKIE = "nico_uid";
const UID_MAX_AGE = 60 * 60 * 24 * 365;
async function slugExists(slug) {
  const posts = await getCollection("posts");
  return posts.some((post) => post.data.slug === slug);
}
const GET = async ({ params, cookies }) => {
  const slug = params.slug;
  if (!slug || !await slugExists(slug)) {
    return new Response(null, { status: 404 });
  }
  const uid = cookies.get(UID_COOKIE)?.value;
  try {
    const data = await getClaps(slug, uid);
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("[claps] GET falhou", error);
    const status = error instanceof ClapsApiError && error.status === 429 ? 429 : 502;
    return new Response(JSON.stringify({ error: "claps_api_unavailable" }), {
      status,
      headers: { "Content-Type": "application/json" }
    });
  }
};
const POST = async ({ params, cookies, request }) => {
  const slug = params.slug;
  if (!slug || !await slugExists(slug)) {
    return new Response(null, { status: 404 });
  }
  let body;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: "invalid_body" }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }
  const amount = Math.max(1, Math.min(5, Math.trunc(Number(body.amount) || 1)));
  let uid = cookies.get(UID_COOKIE)?.value;
  if (!uid) {
    uid = crypto.randomUUID();
    cookies.set(UID_COOKIE, uid, {
      path: "/",
      maxAge: UID_MAX_AGE,
      sameSite: "lax"
    });
  }
  try {
    const data = await incrementClaps(slug, uid, amount);
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("[claps] POST falhou", error);
    const status = error instanceof ClapsApiError && error.status === 429 ? 429 : 502;
    return new Response(JSON.stringify({ error: "claps_api_unavailable" }), {
      status,
      headers: { "Content-Type": "application/json" }
    });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
