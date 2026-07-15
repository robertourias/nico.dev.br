import { g as getCollection } from '../../../chunks/_astro_content_J4_-eXIA.mjs';
import { a as getClapsTotals, C as ClapsApiError } from '../../../chunks/claps_Cde9ELZZ.mjs';
export { renderers } from '../../../renderers.mjs';

const prerender = false;
const GET = async ({ url }) => {
  const raw = url.searchParams.get("slugs");
  if (!raw) {
    return new Response(JSON.stringify({}), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  }
  const requested = [...new Set(raw.split(",").map((slug) => slug.trim()).filter(Boolean))];
  const posts = await getCollection("posts");
  const validSlugs = new Set(posts.map((post) => post.data.slug));
  const slugs = requested.filter((slug) => validSlugs.has(slug));
  if (slugs.length === 0) {
    return new Response(JSON.stringify({}), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  }
  try {
    const totals = await getClapsTotals(slugs);
    return new Response(JSON.stringify(totals), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
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
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
