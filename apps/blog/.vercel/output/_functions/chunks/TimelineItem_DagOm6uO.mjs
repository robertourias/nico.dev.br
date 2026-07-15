import { ab as createComponent, ao as maybeRenderHead, ay as renderSlot, aA as renderTemplate, aa as createAstro } from './astro/server_D7O-e-38.mjs';

const $$Timeline = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<div class="my-8 relative pl-6" style="border-left: 2px solid var(--color-border);"> ${renderSlot($$result, $$slots["default"])} </div>`;
}, "C:/Users/Rober/projetos/nico.dev.br/apps/blog/src/components/mdx/Timeline.astro", void 0);

const $$Astro = createAstro("https://blog.nico.dev.br");
const $$TimelineItem = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$TimelineItem;
  const { date, title } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<div class="mb-8 relative"> <!-- Dot na linha vertical --> <div class="absolute rounded-full border-2" style="width: 14px; height: 14px; left: -32px; top: 4px; background-color: var(--background); border-color: var(--primary);"></div> <span class="text-xs font-mono block mb-1" style="color: var(--color-text-highlight);"> ${date} </span> <h3 class="font-heading font-semibold mb-2" style="font-size: 1.125rem; color: var(--color-text-heading); margin-top: 0;"> ${title} </h3> <div style="color: var(--color-text-body);"> ${renderSlot($$result, $$slots["default"])} </div> </div>`;
}, "C:/Users/Rober/projetos/nico.dev.br/apps/blog/src/components/mdx/TimelineItem.astro", void 0);

export { $$Timeline as $, $$TimelineItem as a };
