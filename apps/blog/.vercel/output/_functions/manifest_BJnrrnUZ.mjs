import { ag as decodeKey } from './chunks/astro/server_D7O-e-38.mjs';
import { N as NOOP_MIDDLEWARE_FN } from './chunks/astro-designed-error-pages_BocQv2au.mjs';

function sanitizeParams(params) {
  return Object.fromEntries(
    Object.entries(params).map(([key, value]) => {
      if (typeof value === "string") {
        return [key, value.normalize().replace(/#/g, "%23").replace(/\?/g, "%3F")];
      }
      return [key, value];
    })
  );
}
function getParameter(part, params) {
  if (part.spread) {
    return params[part.content.slice(3)] || "";
  }
  if (part.dynamic) {
    if (!params[part.content]) {
      throw new TypeError(`Missing parameter: ${part.content}`);
    }
    return params[part.content];
  }
  return part.content.normalize().replace(/\?/g, "%3F").replace(/#/g, "%23").replace(/%5B/g, "[").replace(/%5D/g, "]");
}
function getSegment(segment, params) {
  const segmentPath = segment.map((part) => getParameter(part, params)).join("");
  return segmentPath ? "/" + segmentPath : "";
}
function getRouteGenerator(segments, addTrailingSlash) {
  return (params) => {
    const sanitizedParams = sanitizeParams(params);
    let trailing = "";
    if (addTrailingSlash === "always" && segments.length) {
      trailing = "/";
    }
    const path = segments.map((segment) => getSegment(segment, sanitizedParams)).join("") + trailing;
    return path || "/";
  };
}

function deserializeRouteData(rawRouteData) {
  return {
    route: rawRouteData.route,
    type: rawRouteData.type,
    pattern: new RegExp(rawRouteData.pattern),
    params: rawRouteData.params,
    component: rawRouteData.component,
    generate: getRouteGenerator(rawRouteData.segments, rawRouteData._meta.trailingSlash),
    pathname: rawRouteData.pathname || void 0,
    segments: rawRouteData.segments,
    prerender: rawRouteData.prerender,
    redirect: rawRouteData.redirect,
    redirectRoute: rawRouteData.redirectRoute ? deserializeRouteData(rawRouteData.redirectRoute) : void 0,
    fallbackRoutes: rawRouteData.fallbackRoutes.map((fallback) => {
      return deserializeRouteData(fallback);
    }),
    isIndex: rawRouteData.isIndex,
    origin: rawRouteData.origin
  };
}

function deserializeManifest(serializedManifest) {
  const routes = [];
  for (const serializedRoute of serializedManifest.routes) {
    routes.push({
      ...serializedRoute,
      routeData: deserializeRouteData(serializedRoute.routeData)
    });
    const route = serializedRoute;
    route.routeData = deserializeRouteData(serializedRoute.routeData);
  }
  const assets = new Set(serializedManifest.assets);
  const componentMetadata = new Map(serializedManifest.componentMetadata);
  const inlinedScripts = new Map(serializedManifest.inlinedScripts);
  const clientDirectives = new Map(serializedManifest.clientDirectives);
  const serverIslandNameMap = new Map(serializedManifest.serverIslandNameMap);
  const key = decodeKey(serializedManifest.key);
  return {
    // in case user middleware exists, this no-op middleware will be reassigned (see plugin-ssr.ts)
    middleware() {
      return { onRequest: NOOP_MIDDLEWARE_FN };
    },
    ...serializedManifest,
    assets,
    componentMetadata,
    inlinedScripts,
    clientDirectives,
    routes,
    serverIslandNameMap,
    key
  };
}

const manifest = deserializeManifest({"hrefRoot":"file:///C:/Users/Rober/projetos/nico.dev.br/apps/blog/","cacheDir":"file:///C:/Users/Rober/projetos/nico.dev.br/apps/blog/node_modules/.astro/","outDir":"file:///C:/Users/Rober/projetos/nico.dev.br/apps/blog/dist/","srcDir":"file:///C:/Users/Rober/projetos/nico.dev.br/apps/blog/src/","publicDir":"file:///C:/Users/Rober/projetos/nico.dev.br/apps/blog/public/","buildClientDir":"file:///C:/Users/Rober/projetos/nico.dev.br/apps/blog/dist/client/","buildServerDir":"file:///C:/Users/Rober/projetos/nico.dev.br/apps/blog/dist/server/","adapterName":"@astrojs/vercel","routes":[{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"page","component":"_server-islands.astro","params":["name"],"segments":[[{"content":"_server-islands","dynamic":false,"spread":false}],[{"content":"name","dynamic":true,"spread":false}]],"pattern":"^\\/_server-islands\\/([^/]+?)\\/?$","prerender":false,"isIndex":false,"fallbackRoutes":[],"route":"/_server-islands/[name]","origin":"internal","_meta":{"trailingSlash":"ignore"}}},{"file":"index.html","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/_slug_.DaH8FAp1.css"}],"routeData":{"route":"/","isIndex":true,"type":"page","pattern":"^\\/$","segments":[],"params":[],"component":"src/pages/index.astro","pathname":"/","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_image","pattern":"^\\/_image\\/?$","segments":[[{"content":"_image","dynamic":false,"spread":false}]],"params":[],"component":"../../node_modules/.pnpm/astro@5.18.2_@types+node@20_549c0dd4afb8ab0e38181543abdbf874/node_modules/astro/dist/assets/endpoint/generic.js","pathname":"/_image","prerender":false,"fallbackRoutes":[],"origin":"internal","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/claps/totals","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/claps\\/totals\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"claps","dynamic":false,"spread":false}],[{"content":"totals","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/claps/totals.ts","pathname":"/api/claps/totals","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/claps/[slug]","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/claps\\/([^/]+?)\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"claps","dynamic":false,"spread":false}],[{"content":"slug","dynamic":true,"spread":false}]],"params":["slug"],"component":"src/pages/api/claps/[slug].ts","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}}],"site":"https://blog.nico.dev.br","base":"/","trailingSlash":"ignore","compressHTML":true,"componentMetadata":[["C:/Users/Rober/projetos/nico.dev.br/apps/blog/src/pages/posts/[slug].astro",{"propagation":"in-tree","containsHead":true}],["C:/Users/Rober/projetos/nico.dev.br/apps/blog/src/pages/index.astro",{"propagation":"in-tree","containsHead":true}],["\u0000astro:content",{"propagation":"in-tree","containsHead":false}],["C:/Users/Rober/projetos/nico.dev.br/apps/blog/src/pages/api/claps/[slug].ts",{"propagation":"in-tree","containsHead":false}],["\u0000@astro-page:src/pages/api/claps/[slug]@_@ts",{"propagation":"in-tree","containsHead":false}],["\u0000@astrojs-ssr-virtual-entry",{"propagation":"in-tree","containsHead":false}],["C:/Users/Rober/projetos/nico.dev.br/apps/blog/src/pages/api/claps/totals.ts",{"propagation":"in-tree","containsHead":false}],["\u0000@astro-page:src/pages/api/claps/totals@_@ts",{"propagation":"in-tree","containsHead":false}],["\u0000@astro-page:src/pages/index@_@astro",{"propagation":"in-tree","containsHead":false}],["\u0000@astro-page:src/pages/posts/[slug]@_@astro",{"propagation":"in-tree","containsHead":false}]],"renderers":[],"clientDirectives":[["idle","(()=>{var l=(n,t)=>{let i=async()=>{await(await n())()},e=typeof t.value==\"object\"?t.value:void 0,s={timeout:e==null?void 0:e.timeout};\"requestIdleCallback\"in window?window.requestIdleCallback(i,s):setTimeout(i,s.timeout||200)};(self.Astro||(self.Astro={})).idle=l;window.dispatchEvent(new Event(\"astro:idle\"));})();"],["load","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).load=e;window.dispatchEvent(new Event(\"astro:load\"));})();"],["media","(()=>{var n=(a,t)=>{let i=async()=>{await(await a())()};if(t.value){let e=matchMedia(t.value);e.matches?i():e.addEventListener(\"change\",i,{once:!0})}};(self.Astro||(self.Astro={})).media=n;window.dispatchEvent(new Event(\"astro:media\"));})();"],["only","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).only=e;window.dispatchEvent(new Event(\"astro:only\"));})();"],["visible","(()=>{var a=(s,i,o)=>{let r=async()=>{await(await s())()},t=typeof i.value==\"object\"?i.value:void 0,c={rootMargin:t==null?void 0:t.rootMargin},n=new IntersectionObserver(e=>{for(let l of e)if(l.isIntersecting){n.disconnect(),r();break}},c);for(let e of o.children)n.observe(e)};(self.Astro||(self.Astro={})).visible=a;window.dispatchEvent(new Event(\"astro:visible\"));})();"]],"entryModules":{"\u0000noop-middleware":"_noop-middleware.mjs","\u0000virtual:astro:actions/noop-entrypoint":"noop-entrypoint.mjs","\u0000@astro-page:../../node_modules/.pnpm/astro@5.18.2_@types+node@20_549c0dd4afb8ab0e38181543abdbf874/node_modules/astro/dist/assets/endpoint/generic@_@js":"pages/_image.astro.mjs","\u0000@astro-page:src/pages/api/claps/totals@_@ts":"pages/api/claps/totals.astro.mjs","\u0000@astro-page:src/pages/api/claps/[slug]@_@ts":"pages/api/claps/_slug_.astro.mjs","\u0000@astro-page:src/pages/posts/[slug]@_@astro":"pages/posts/_slug_.astro.mjs","\u0000@astro-page:src/pages/index@_@astro":"pages/index.astro.mjs","\u0000@astrojs-ssr-virtual-entry":"entry.mjs","\u0000@astro-renderers":"renderers.mjs","\u0000@astrojs-ssr-adapter":"_@astrojs-ssr-adapter.mjs","\u0000@astrojs-manifest":"manifest_BJnrrnUZ.mjs","C:/Users/Rober/projetos/nico.dev.br/node_modules/.pnpm/astro@5.18.2_@types+node@20_549c0dd4afb8ab0e38181543abdbf874/node_modules/astro/dist/assets/services/sharp.js":"chunks/sharp_BmlkEb8H.mjs","C:\\Users\\Rober\\projetos\\nico.dev.br\\apps\\blog\\.astro\\content-assets.mjs":"chunks/content-assets_DleWbedO.mjs","C:\\Users\\Rober\\projetos\\nico.dev.br\\apps\\blog\\.astro\\content-modules.mjs":"chunks/content-modules_BX5XmRz2.mjs","\u0000astro:data-layer-content":"chunks/_astro_data-layer-content_DfBknrSG.mjs","C:/Users/Rober/projetos/nico.dev.br/apps/blog/src/content/posts/exemplo-imersivo.mdx?astroPropagatedAssets":"chunks/exemplo-imersivo_DCmznv4A.mjs","C:/Users/Rober/projetos/nico.dev.br/apps/blog/src/content/posts/historia-da-ia.mdx?astroPropagatedAssets":"chunks/historia-da-ia_DVlj_pp0.mjs","C:/Users/Rober/projetos/nico.dev.br/apps/blog/src/content/posts/shadcn-ui-componentes-projetos-react.mdx?astroPropagatedAssets":"chunks/shadcn-ui-componentes-projetos-react_BIREq6nk.mjs","C:/Users/Rober/projetos/nico.dev.br/apps/blog/src/content/posts/superpowers-disciplina-dev-ia.mdx?astroPropagatedAssets":"chunks/superpowers-disciplina-dev-ia_7J6mgV1u.mjs","C:/Users/Rober/projetos/nico.dev.br/apps/blog/src/content/posts/exemplo-imersivo.mdx":"chunks/exemplo-imersivo_vkH_w0PP.mjs","C:/Users/Rober/projetos/nico.dev.br/apps/blog/src/content/posts/historia-da-ia.mdx":"chunks/historia-da-ia_CUVCWJVM.mjs","C:/Users/Rober/projetos/nico.dev.br/apps/blog/src/content/posts/shadcn-ui-componentes-projetos-react.mdx":"chunks/shadcn-ui-componentes-projetos-react_DhoIVKtw.mjs","C:/Users/Rober/projetos/nico.dev.br/apps/blog/src/content/posts/superpowers-disciplina-dev-ia.mdx":"chunks/superpowers-disciplina-dev-ia_CEET4VL0.mjs","@/components/PostSidebar":"_astro/PostSidebar.DAqR9JIJ.js","@/components/ClapButton":"_astro/ClapButton.Dw3TC9GY.js","@/components/BlogHome":"_astro/BlogHome.BMQKAIRf.js","@astrojs/react/client.js":"_astro/client.OHxh-wV8.js","@/components/BlogHeader":"_astro/BlogHeader.ByXss5t-.js","@/components/ShareButton":"_astro/ShareButton.CcesFU6n.js","astro:scripts/before-hydration.js":""},"inlinedScripts":[],"assets":["/_astro/_slug_.DaH8FAp1.css","/images/claude-code-vs-codex.svg","/images/historia-ia-hero.jpg","/images/historia-ia-hero.svg","/_astro/BlogHeader.ByXss5t-.js","/_astro/BlogHome.BMQKAIRf.js","/_astro/CategorySidebar.CLMvZmYd.js","/_astro/check.BAsUpkXg.js","/_astro/ClapButton.Dw3TC9GY.js","/_astro/client.OHxh-wV8.js","/_astro/config.DgRclAuu.js","/_astro/createLucideIcon.CjW3Uh-t.js","/_astro/hand-metal.DUCSkJGH.js","/_astro/index.B04Pf2oS.js","/_astro/index.BIIuLtGZ.js","/_astro/PostSidebar.DAqR9JIJ.js","/_astro/ShareButton.CcesFU6n.js","/_astro/x.CEu6-vhc.js","/index.html"],"buildFormat":"directory","checkOrigin":true,"allowedDomains":[],"actionBodySizeLimit":1048576,"serverIslandNameMap":[],"key":"d8K04kKXLiIKz1VFMgaIv0tiGYPZPhMX5vgip3cxE2Y="});
if (manifest.sessionConfig) manifest.sessionConfig.driverModule = null;

export { manifest };
