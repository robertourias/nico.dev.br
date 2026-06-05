# Spec: Gerador de Paleta de Cores

**Status:** approved
**Data:** 2026-06-05
**Autor:** Planner (via /spec)

---

## Problema

Devs e designers precisam gerar paletas de cores harmônicas rapidamente para prototipagem e design systems. Ferramentas existentes (como Coolors) requerem navegação externa. Integrar gerador na plataforma `nico.dev.br/tools` oferece fluxo mais ágil com exportação imediata para múltiplos formatos.

---

## Cenários de Usuário

- **P1 (crítico):** Como dev, quero gerar paleta harmônica partir de uma cor base, para usar no design de interface.
- **P2 (importante):** Como designer, quero escolher tipo de harmonia (análoga, tríade, dividida, mono, UI app), para explorar diferentes combinações.
- **P2 (importante):** Como dev, quero exportar paleta em CSS, SCSS, JSON ou Tailwind, para integrar no projeto.

---

## Requisitos Funcionais

- **FR-001:** Entrada: input de cor (hex, RGB ou HSL) com preview visual em tempo real.
- **FR-002:** Seleção de tipo de harmonia: análoga, tríade, dividida, mono, UI app.
- **FR-003:** Seleção de quantidade: seletor fixo (3, 5, 7 ou 10 cores).
- **FR-004:** Gemini API gera paleta estruturada (formato: lista de cores em hex/RGB/HSL com nomes descritivos).
- **FR-005:** Exibição visual: grid de cores com swatch, hexadecimal, RGB, HSL visíveis para cada cor.
- **FR-006:** Exportação em 4 formatos: CSS (variáveis), SCSS (mapa), JSON, Tailwind config.
- **FR-007:** Integra como card na página `/tools` (sem persistência — geração única por sessão).
- **FR-008:** Validação: rejeita entrada inválida de cor com mensagem clara ao usuário.

---

## Critérios de Sucesso

- [ ] Input aceita hex (#FFF, #FFFFFF), RGB (rgb(255, 255, 255)) e HSL (hsl(0, 0%, 100%)).
- [ ] Gemini API retorna paleta válida em < 3s para qualquer harmonia e quantidade.
- [ ] 5 tipos de harmonia funcionam e geram cores visualmente harmônicas.
- [ ] Exportação CSS produz variáveis CSS nomeadas; SCSS produz mapa; JSON é importável; Tailwind é syntax válido.
- [ ] Card aparece em `/tools` com mesmo design dos cards existentes (Conversor, Analisador, etc).
- [ ] Nenhuma persistência — refresco de página limpa os resultados.

---

## Fora do Escopo

- Histórico ou salvamento de paletas (geração única).
- Edição/refinamento de cores pós-geração.
- Sincronização com conta do usuário.
- Sugestão de nomes automáticos para cores (Gemini pode nomear, mas não será um requisito separado).

---

## Riscos e Premissas

- **Premissa:** Gemini API está configurada e acessível no projeto (verificar `NEXT_PUBLIC_GEMINI_API_KEY`).
- **Premissa:** Biblioteca para conversão de cores (hex ↔ RGB ↔ HSL) já está disponível ou será instalada.
- **Risco:** Gemini pode retornar cores inválidas ou não harmônicas → Mitigação: prompt estruturado com JSON schema e validação client-side antes de renderizar.
- **Risco:** Usuário fornece cor inválida → Mitigação: validar formato e mostrar erro antes de chamar API.
- **Risco:** Tempo de geração > 3s impacta UX → Mitigação: loading state com spinner, timeout de 5s com retry.
