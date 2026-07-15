import { aa as createAstro, ab as createComponent, ao as maybeRenderHead, a4 as addAttribute, ay as renderSlot, aA as renderTemplate } from './astro/server_D7O-e-38.mjs';

const $$Astro = createAstro("https://blog.nico.dev.br");
const $$Callout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Callout;
  const { type = "info" } = Astro2.props;
  const config = {
    info: { color: "var(--primary)", icon: "\u2139", label: "Info" },
    tip: { color: "var(--color-text-highlight)", icon: "\u{1F4A1}", label: "Dica" },
    warning: { color: "#c96d00", icon: "\u26A0", label: "Aten\xE7\xE3o" },
    note: { color: "var(--color-text-body)", icon: "\u{1F4DD}", label: "Nota" }
  };
  const { color, icon, label } = config[type];
  return renderTemplate`${maybeRenderHead()}<aside class="my-6 rounded-lg p-4 pl-5"${addAttribute(`border-left: 3px solid ${color}; background-color: var(--color-bg-card);`, "style")} role="note"${addAttribute(label, "aria-label")}> <div class="flex items-start gap-3"> <span aria-hidden="true" class="text-lg leading-none mt-0.5 shrink-0">${icon}</span> <div class="post-content min-w-0" style="font-size: 0.9375rem;"> ${renderSlot($$result, $$slots["default"])} </div> </div> </aside>`;
}, "C:/Users/Rober/projetos/nico.dev.br/apps/blog/src/components/mdx/Callout.astro", void 0);

export { $$Callout as $ };
