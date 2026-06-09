# Status do Projeto

> Memória de trabalho persistente. Atualizado pelo `/checkpoint`, lido pelo `/retomar`.
> Não edite manualmente durante uma sessão ativa — use `/checkpoint` antes de fechar.

**Última atualização:** 2026-06-08
**Resumo da última sessão:** Melhorias significativas no metrônomo (sons, PiP, toggles, layout) e atualização dos footers em `web-nico.dev.br` e `apps/tools`.

---

## Feature em andamento

**Spec ativo:** (nenhum — ajustes visuais e novos features pontuais, sem spec formal)
**Plano ativo:** (nenhum)

---

## Tasks

### ✅ Concluídas

**apps/metronome — melhorias de UI e features:**
- Botões (-)(+) do Beats centralizados e aumentados 20% (`w-[34px] h-[34px]`)
- BPM presets aumentados 30% (`h-9 px-3.5 text-sm`)
- 2 novos sons: Wood (noise burst + bandpass) e Beep (square wave); `SoundPicker` com preview ao clicar
- Beat ativo e Start button usam o mesmo `bg-primary` (consistência confirmada)
- Checkbox → Switch (Toggle) em `StressFirstBeat` e `TimerControl`
- Timer presets migrados para grid `grid-cols-5 gap-2 h-10` (mesmo layout das subdivisions)
- Botão Document PiP fixo (desktop `hidden md:flex`); janela flutuante com BPM ±5, presets, beat dots, sound picker, timer, Start/Stop
- Bug de hydration corrigido: `isSupported` agora inicializa via `useEffect`
- PiP window expandida com Sound buttons e Beat indicators
- Commit: `43bbb11 feat(metronome): add sounds, PiP window, and UI polish`

**apps/web-nico.dev.br — Footer:**
- Footer reestruturado: 3 colunas (Navegação / Ferramentas em 2 sub-colunas / Redes Sociais)
- Links de navegação = links do header (about, skills, projects, contact, resume, blog)
- Ferramentas: todas as ferramentas ativas de `tools.nico.dev.br/[slug]` + Metrônomo externo
- Traduções adicionadas em pt.json, en.json, es.json (`sectionNav`, `sectionTools`, `sectionSocial`)
- Commit: `3eeb464 feat(web-nico.dev.br): update links footer`

**apps/tools — Footer:**
- `SiteFooter` criado em `src/components/site-footer.tsx`
- Seções: Utilidades (6 tools + Metrônomo) | Para devs (3 tools) | Outros sites (Portfólio, Blog, Challenges)
- Inserido no root `layout.tsx` — aparece em todas as páginas automaticamente
- Commit: `140bca5 feat(tools): Creation Footer`

### 🔄 Em progresso
- (nenhum — todas as tasks concluídas)

### ⏭ Próximos passos
1. Testar autenticação Yahoo Finance (crumb) em produção — verificar se `fc.yahoo.com` responde corretamente no Vercel
2. Gerar nova GEMINI_API_KEY válida e atualizar `apps/tools/.env.local` (chave atual sem quota free tier)
3. Deploy do blog no Vercel (`blog.nico.dev.br`) e testar visual em produção
4. Implementar compartilhamento social (botões Share na página do post do blog)
5. Remover arquivo morto `apps/tools/src/lib/mercado/brapi.ts`

---

## Decisões desta sessão

- Sons do metrônomo implementados via Web Audio API puro (sine/noise/square) — sem dependências externas
- PiP window usa `createPortal` + cópia de stylesheets do documento principal para preservar Tailwind e tokens CSS
- Footer do tools app inserido no root layout (não por página) — elimina necessidade de adicionar em cada ferramenta nova
- Ferramentas no footer do web-nico.dev.br ocupam 2 colunas (`sm:col-span-2` + `grid-cols-2` interno) para melhor aproveitamento do espaço

---

## Bloqueadores / Perguntas abertas

- Crumb Yahoo Finance precisa de validação em ambiente de produção (IP de servidor pode ser bloqueado)
- Chave GEMINI_API_KEY atual tem `limit: 0` em todos os modelos free tier — precisa nova chave do AI Studio
- Deploy do blog não configurado no Vercel ainda
- `brapi.ts` em `apps/tools/src/lib/mercado/` — arquivo morto, remover
