---
title: "Scaffold IA-Projetos: orquestrando specs com agentes"
slug: "scaffold-ia-projetos-orquestrando-specs-com-agentes"
date: "2026-07-20"
category: "ia"
status: "published"
featured: false
description: "Como uso o scaffold-ia-projetos pra dar contexto persistente aos agentes e orquestrar o planejamento e a implementação de features do início ao fim."
tags: ["ia", "claude-code", "spec-driven-development", "produtividade-dev"]
coverImage: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&q=80"
---

Toda vez que você abre uma sessão nova de agente num projeto, ele começa do zero. Não sabe que vocês decidiram Tailwind em vez de styled-components, não sabe que pedido acima de R$ 500 precisa de aprovação, não sabe a convenção de nome de branch. Sem esse contexto, ele inventa padrão, repete pergunta que já foi respondida semana passada e diverge do que foi combinado.

Foi pra resolver isso que criei o [scaffold-ia-projetos](https://github.com/robertourias/scaffold-ia-projetos): uma estrutura de arquivos markdown que funciona como memória persistente do projeto, agnóstica de ferramenta — funciona em Claude Code, Cursor, Codex, Copilot Workspace ou qualquer coisa que leia arquivo de contexto.

O princípio central é simples: coloque no contexto só o que o agente não consegue inferir sozinho. Ele já sabe Next.js, NestJS, Clean Architecture — não precisa de tutorial disso. O que ele não sabe é a decisão que vocês tomaram terça-feira, a regra de negócio específica do seu domínio, o motivo de terem descartado uma lib.

## A estrutura

O `docs/` se divide em blocos com responsabilidade clara:

| Pasta | Para quê |
|---|---|
| `skills/` | Papéis (planner, backend, frontend, quality) e padrões reutilizáveis |
| `specs/` | Specs aprovados de cada feature, de draft até approved |
| `context/` | O que é único do seu produto — regras de negócio, convenções, decisões |
| `architecture/` | Visão técnica de backend, frontend, infra |
| `workflows/` | Processos, incluindo o playbook de modos econômico/rigor/emergência |
| `commands/` | Prompts de ativação de cada papel |
| `prompts/` | Prompts avulsos de bootstrap e auditoria, fora do fluxo do dia a dia |

Cada arquivo só é carregado quando é relevante pra tarefa em curso. Um agente atuando como backend lê `skills/backend.md` + `conventions.md` + `decisions.md` — nada além disso. Isso mantém o contexto pequeno mesmo em projetos grandes.

## O fluxo de orquestração

O scaffold organiza o trabalho em um fluxo spec-driven com um gate no meio:

```
/init-project   → entrevista inicial, preenche docs/context/
/backlog        → gera TASK01..TASKNN a partir do product.md
/spec TASK01    → gera spec + plano técnico (Status: review)

  ⛔ GATE: você lê, edita, aprova → Status: approved

/back tarefa1, tarefa2   → agente backend implementa
/front tela1, tela2      → agente frontend implementa
/review [diff]           → revisão em dois estágios: funcional → qualidade
/checkpoint               → salva estado, gera changelog
```

O gate é o ponto que faz diferença. Sem aprovação explícita da spec, o agente assume escopo — e você só percebe o desalinhamento quando já tem código escrito. Forçar a leitura e aprovação da spec antes de qualquer implementação custa dois minutos e evita retrabalho de horas.

## Bootstrap retroativo: quando o projeto já existe há meses

Esse fluxo todo pressupõe que `docs/context/` já está preenchido. Mas um projeto com seis meses de código, zero de documentação e ninguém lembrando por que a lib X foi trocada pela Y não tem por onde entrar — `/init-project` é uma entrevista pra projeto novo, não uma varredura de projeto existente. Até aqui a única saída era preencher tudo na mão.

Pra isso adicionei `docs/prompts/retroactive-documentation.md`. A diferença em relação ao resto do scaffold é que ele não reorganiza arquivo genérico — ele lê `package.json`, configs, estrutura de pastas e `git log`, e gera o conteúdo de `context/product.md`, `context/decisions.md`, `architecture/overview.md` etc. a partir do que existe no código. O que não dá pra inferir com confiança — motivo de uma decisão, regra de negócio que só existe na cabeça de alguém — fica marcado como `[INFERIDO — confirmar]` em vez de inventado.

Uso:

```
cat docs/prompts/retroactive-documentation.md
# cole no Claude Code, na raiz do projeto existente
```

O resultado prático: em vez de um `architecture/overview.md` com "Status: —" desatualizado há meses, o projeto sai da sessão com documentação refletindo o estado real do código, e cada ponto incerto sinalizado pra revisão humana em vez de silenciosamente errado.

## Exemplo: campo de busca com autocomplete e subfiltros

Vamos aplicar o fluxo numa feature real: um campo de pesquisa com autocomplete, que sugere subfiltros (categoria, status, data) enquanto o usuário digita, com a consulta otimizada pra não sobrecarregar o banco.

**1. Groom + spec.** Como é uma feature isolada, pulo o backlog e vou direto:

```
/groom campo de busca com autocomplete e subfiltros na listagem de pedidos
/spec TASK-busca-autocomplete
```

O planner lê `product.md` e `architecture/overview.md`, faz perguntas — a busca é full-text ou prefixo? Subfiltros aparecem como sugestão ou o usuário digita `status:pendente` direto no campo? Quantos resultados no dropdown? — e gera a spec com o plano técnico:

- Endpoint `GET /orders/search?q=&filters=` com paginação por cursor
- Índice composto no banco para os campos filtráveis mais usados (status, categoria, data)
- Debounce de 300ms no frontend antes de disparar a request
- Cache de resultados recentes por chave de busca, TTL curto

Eu leio, ajusto o TTL do cache e mudo `Status: review` para `Status: approved`.

**2. Implementação backend.**

```
/back implementar endpoint de busca com filtros e índice composto
```

O agente lê só `skills/backend.md` + `conventions.md` + `decisions.md` — sem reensino de NestJS — e entrega algo como:

```ts
@Get('search')
async search(@Query() query: SearchOrdersDto) {
  const { q, status, category, dateFrom, dateTo, cursor } = query;

  return this.ordersService.search({
    term: q,
    filters: { status, category, dateFrom, dateTo },
    cursor,
    limit: 20,
  });
}
```

Do lado do banco, a spec já apontou o índice composto — `CREATE INDEX idx_orders_search ON orders (status, category, created_at)` — pensado pros filtros mais comuns, evitando full scan em tabela grande.

**3. Implementação frontend.**

```
/front criar campo de busca com autocomplete e chips de subfiltro
```

O agente frontend lê `ui-guidelines.md` pra usar os componentes certos do design system, e implementa o debounce combinado com cancelamento de request anterior:

```ts
const [term, setTerm] = useState('');
const debounced = useDebouncedValue(term, 300);

useEffect(() => {
  const controller = new AbortController();
  if (debounced) searchOrders(debounced, filters, controller.signal);
  return () => controller.abort();
}, [debounced, filters]);
```

Cancelar a request anterior evita que uma resposta atrasada de uma busca antiga sobrescreva o resultado de uma busca mais recente — problema clássico de autocomplete mal implementado.

**4. Revisão.**

```
/review [diff do backend]
/review [diff do frontend]
```

Primeiro estágio checa se bate com o plano da spec — índice foi criado, debounce está nos 300ms combinados. Segundo estágio checa qualidade: nomes, tratamento de erro, se o cursor de paginação está sendo validado.

**5. Fechamento.**

```
/checkpoint
git commit -m "feat: busca com autocomplete e subfiltros"
mv docs/specs/TASK-busca-autocomplete.md docs/archive/
```

O `current-state.md` fica com uma linha resumida — feature entregue, índice em produção — em vez de acumular histórico granular que ninguém vai reler.

O ganho não é a feature em si — é que cada decisão (por que 300ms de debounce, por que aquele índice específico) ficou registrada na spec, em vez de existir só na cabeça de quem implementou. Da próxima vez que um agente novo tocar nesse código, ele lê a spec arquivada e entende o porquê, não só o quê.
