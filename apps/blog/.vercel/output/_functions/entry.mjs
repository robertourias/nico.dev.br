import { renderers } from './renderers.mjs';
import { c as createExports, s as serverEntrypointModule } from './chunks/_@astrojs-ssr-adapter_Cly9Ojm4.mjs';
import { manifest } from './manifest_HoXNGlGO.mjs';

const serverIslandMap = new Map();;

const _page0 = () => import('./pages/_image.astro.mjs');
const _page1 = () => import('./pages/api/claps/totals.astro.mjs');
const _page2 = () => import('./pages/api/claps/_slug_.astro.mjs');
const _page3 = () => import('./pages/posts/_slug_.astro.mjs');
const _page4 = () => import('./pages/index.astro.mjs');
const pageMap = new Map([
    ["../../node_modules/.pnpm/astro@5.18.2_@types+node@20_549c0dd4afb8ab0e38181543abdbf874/node_modules/astro/dist/assets/endpoint/generic.js", _page0],
    ["src/pages/api/claps/totals.ts", _page1],
    ["src/pages/api/claps/[slug].ts", _page2],
    ["src/pages/posts/[slug].astro", _page3],
    ["src/pages/index.astro", _page4]
]);

const _manifest = Object.assign(manifest, {
    pageMap,
    serverIslandMap,
    renderers,
    actions: () => import('./noop-entrypoint.mjs'),
    middleware: () => import('./_noop-middleware.mjs')
});
const _args = {
    "middlewareSecret": "d55d36f4-001c-410e-af17-cf9502617dcd",
    "skewProtection": false
};
const _exports = createExports(_manifest, _args);
const __astrojsSsrVirtualEntry = _exports.default;
const _start = 'start';
if (Object.prototype.hasOwnProperty.call(serverEntrypointModule, _start)) ;

export { __astrojsSsrVirtualEntry as default, pageMap };
