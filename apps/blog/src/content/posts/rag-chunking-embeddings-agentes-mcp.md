---
title: "RAG: chunking, embeddings, agentes e MCP"
slug: "rag-chunking-embeddings-agentes-mcp"
date: "2026-09-24"
categories: ["ia", "dev"]
status: "published"
featured: false
description: "As etapas do RAG com foco em chunking e embeddings, a diferença entre RAG clássico e RAG com agente, e um exemplo de servidor MCP que expõe a busca nas docs como ferramenta."
tags: ["rag", "embeddings", "chunking", "mcp", "agentes"]
---

RAG dá errado quase sempre antes do modelo. O LLM recebe o que a busca entregou, e se a busca entregou o trecho errado, nenhum prompt conserta. Por isso quase toda a qualidade de um RAG mora em duas decisões: como você quebra os documentos e como transforma os trechos em vetores.

Este post é o complemento de [RAG na prática: assistente de docs internas do time](/posts/rag-na-pratica-assistente-de-docs-do-time), que monta um assistente completo com Supabase e pgvector. Aqui o foco muda: as etapas do pipeline, chunking e embeddings em mais detalhe, o que muda quando um agente entra no meio, e como expor a busca por MCP. O exemplo também é outro: um servidor MCP de busca em docs.

## RAG em uma frase

RAG (Retrieval-Augmented Generation) é buscar os trechos relevantes dos seus documentos na hora da pergunta e entregá-los ao modelo junto com ela. O modelo deixa de depender do que memorizou no treino e passa a responder com base no que acabou de ler. Serve pra conteúdo privado, que muda com frequência ou que simplesmente não estava nos dados de treino.

## As etapas

O pipeline tem duas fases: indexação, que roda quando os documentos mudam, e consulta, que roda a cada pergunta.

![Pipeline do RAG em duas fases: indexação (carregar e limpar, chunking, embeddings, índice) e consulta (pergunta, embedding da pergunta, busca top-k, LLM), com o ponto de ajuste de cada etapa](/images/rag-chunking-embeddings-agentes-mcp-etapas.svg)

1. **Carregar e limpar.** Converter a fonte (Markdown, PDF, HTML) em texto e remover ruído: menus, rodapés, cabeçalhos repetidos de página. Ruído indexado vira ruído recuperado.
2. **Chunking.** Quebrar o texto em trechos que possam ser buscados individualmente.
3. **Embeddings.** Transformar cada trecho em um vetor.
4. **Índice.** Guardar vetores junto com o texto e metadados (fonte, título, data) pra filtrar e citar depois.
5. **Consulta.** Gerar o embedding da pergunta, buscar os vetores mais próximos (top-k), montar o prompt com esses trechos e chamar o modelo.

Um detalhe que passa despercebido: as duas fases compartilham o índice e o modelo de embedding. Se você trocar o modelo, precisa reindexar tudo.

## Chunking

Um vetor representa o texto inteiro que você deu a ele. Se o chunk é um capítulo, o vetor vira uma média vaga de vários assuntos e a busca perde precisão. Se o chunk é uma frase, o vetor é preciso, mas o trecho recuperado não tem contexto suficiente pra responder nada.

Chunking é esse equilíbrio: **pequeno o bastante pra ser específico, grande o bastante pra fazer sentido sozinho.**

![Duas estratégias de chunking aplicadas ao mesmo documento: tamanho fixo com overlap, que pode cortar no meio de uma ideia, e divisão por estrutura, que respeita cabeçalhos e parágrafos mas gera chunks de tamanhos desiguais](/images/rag-chunking-embeddings-agentes-mcp-chunking.svg)

As estratégias mais comuns:

| Estratégia | Como corta | Ponto forte | Ponto fraco |
|---|---|---|---|
| Tamanho fixo | A cada N caracteres ou tokens | Trivial de implementar, tamanho previsível | Corta no meio de frase e de ideia |
| Tamanho fixo com overlap | Igual, repetindo o fim de um chunk no começo do próximo | Reduz o dano do corte | Índice maior, trechos parcialmente duplicados |
| Recursiva | Tenta separadores em ordem (seção, parágrafo, frase) até caber no limite | Respeita a estrutura quando dá | Ainda depende do limite de tamanho |
| Por estrutura | Usa a marcação do documento (cabeçalhos, itens de lista, funções de código) | Cada chunk é uma unidade lógica | Tamanhos desiguais; exige um formato consistente |
| Semântica | Corta onde o assunto muda, medido por embeddings entre frases vizinhas | Segue o sentido, não o layout | Mais cara e mais difícil de depurar |

Não existe tamanho universal ideal. O que existe é um ponto de partida e uma forma de medir. Um ponto de partida comum é chunks na casa de algumas centenas de palavras, com um overlap pequeno (na faixa de 10% a 20% é uma regra de bolso frequente, não uma lei). Depois disso, o que decide é testar com perguntas reais.

Três práticas que pesam mais que o número exato:

- **Guardar metadados no chunk.** Fonte, título da seção, data. Servem pra citar, pra filtrar (só docs do time X) e pra depurar quando a busca traz algo estranho.
- **Repetir o título no início do chunk.** "Use a flag `--force` nesse caso" não diz qual caso. Com o título da seção na frente, o trecho carrega o próprio contexto.
- **Tratar cada tipo de conteúdo do seu jeito.** Documentação em Markdown quebra bem por cabeçalho. Código quebra por função ou classe. FAQ quebra por pergunta e resposta. Um chunker único pra tudo raramente é o melhor pra nada.

## Embeddings

Um embedding é a representação de um texto como uma lista de números. O modelo de embedding é treinado pra que textos com significado parecido gerem vetores próximos. É isso que permite buscar por sentido: "como reverto uma versão?" chega a um trecho sobre rollback sem compartilhar nenhuma palavra com ele.

A proximidade costuma ser medida por **similaridade de cosseno**: quanto mais alinhados dois vetores, mais parecidos os textos. A busca é "me dê os k vetores mais próximos do vetor da pergunta".

O que importa na prática:

- **Mesmo modelo na indexação e na consulta.** Vetores de modelos diferentes vivem em espaços diferentes e não são comparáveis.
- **Idioma.** Se seus documentos e perguntas estão em português, confirme que o modelo trata bem o idioma. Modelo treinado majoritariamente em inglês tende a dar resultado pior.
- **Limite de entrada.** Cada modelo aceita um tamanho máximo de texto. Chunk acima do limite pode ser truncado ou rejeitado, dependendo do provedor.
- **Prefixos de consulta.** Alguns modelos esperam instruções diferentes para o texto da consulta e o dos documentos. Está na documentação de cada um.
- **Trocar o modelo é reindexar.** Guarde o nome do modelo junto do índice pra não misturar vetores.

Busca vetorial tem um ponto cego conhecido: **termos exatos**. Um código de erro (`ERR_4021`), um nome de flag ou uma sigla interna não têm "significado" que o embedding capture bem. A resposta comum é a **busca híbrida**, que combina a busca vetorial com uma busca por palavra-chave (como BM25) e junta os resultados. Outra técnica é o **reranking**: buscar mais candidatos do que precisa (digamos, 20) e usar um segundo modelo, mais preciso e mais lento, pra reordenar e ficar só com os melhores.

## RAG + Agent

No RAG clássico, o fluxo é fixo: toda pergunta passa pela busca, uma vez, e o resultado vai pro modelo. O código decide quando buscar; o modelo só responde.

Quando um agente entra, a busca vira uma **ferramenta**. O modelo decide se precisa buscar, o que buscar e quantas vezes.

| | RAG clássico | RAG com agente |
|---|---|---|
| Quem decide buscar | O código, sempre | O modelo, caso a caso |
| Número de buscas | 1 | 0, 1 ou várias |
| Consulta | A pergunta do usuário, como veio | Pode ser reescrita pelo modelo |
| Fontes | Um índice | Vários (docs, banco, web), cada uma como ferramenta |
| Custo e latência | Previsíveis | Variam com o número de passos |
| Comportamento | Determinístico | Menos previsível |

Na prática, o agente resolve casos em que o RAG clássico é fraco. Uma pergunta como "compare o processo de deploy do time A com o do B" exige duas buscas. Uma pergunta que chega vaga ("como faz aquilo do rollback?") pode ser reformulada antes de buscar. Uma pergunta de conversa ("valeu!") não precisa buscar nada.

O preço é previsibilidade. Cada chamada de ferramenta é uma ida ao modelo, então custo e tempo de resposta variam. Algumas defesas simples: limitar o número de passos, registrar cada chamada de busca (com a consulta que o agente escolheu), e avaliar não só a resposta final, mas se a busca trouxe o trecho certo. Se a busca falha, o agente só falha com mais confiança.

Uma regra que me parece razoável: comece pelo RAG clássico. Passe pro agente quando você tiver perguntas reais que o fluxo fixo não resolve.

## RAG + MCP

**MCP (Model Context Protocol)** é um protocolo aberto pra conectar aplicações de IA a ferramentas e fontes de dados. Um **servidor MCP** expõe ferramentas, recursos e prompts; um **cliente MCP** (Claude Code, Claude Desktop e vários outros) descobre e chama essas ferramentas.

Aplicado ao RAG, a ideia é transformar a busca em uma ferramenta do servidor: `search_docs(query)`. Qualquer cliente MCP pode usá-la sem que você escreva integração específica pra cada um.

![Arquitetura de RAG com agente e MCP: o agente, como cliente MCP, chama a ferramenta search_docs no servidor MCP, que consulta o índice de chunks e embeddings construído a partir dos documentos e devolve os trechos com a fonte](/images/rag-chunking-embeddings-agentes-mcp-arquitetura.svg)

O que essa separação dá:

- **A base de conhecimento fica desacoplada do agente.** Você troca o cliente, ou usa vários ao mesmo tempo, sem mexer no índice.
- **Um ponto só pra controle de acesso.** Quem pode buscar o quê é decidido no servidor, não espalhado em cada aplicação.
- **A descrição da ferramenta vira parte do design.** O agente decide quando chamar `search_docs` lendo a descrição dela, então vale escrevê-la com o mesmo cuidado de uma `description` de skill: o que faz e quando usar.

E dois cuidados:

**O conteúdo recuperado é entrada não confiável.** Se alguém consegue editar um documento indexado, consegue escrever ali uma instrução que o agente pode tentar seguir. Trate o resultado da busca como dado a ser citado, não como ordem, e limite o que o agente pode fazer depois de ler.

**O MCP não melhora a busca.** Ele padroniza como a ferramenta é descrita e chamada. Se o chunking está ruim, o servidor MCP só entrega trechos ruins de um jeito mais elegante.

## Exemplo: servidor MCP de busca em docs

O cenário: um time tem uma pasta `docs/` com Markdown (guia de deploy, convenções, decisões) e quer que o agente consulte isso por uma ferramenta. Os documentos e as perguntas são hipotéticos, só pra mostrar o fluxo.

Para manter o exemplo autocontido, o índice fica em memória e é montado quando o servidor sobe. Isso funciona pra uma base pequena. Numa base grande, o índice vai pra um banco vetorial, como no [post anterior](/posts/rag-na-pratica-assistente-de-docs-do-time).

Setup:

```bash
npm install @modelcontextprotocol/sdk zod ai
npm install -D tsx typescript
```

O projeto precisa ser ESM (`"type": "module"` no `package.json`), porque o servidor usa `await` no nível do módulo. Os nomes de modelo seguem a convenção `provedor/modelo` do AI SDK, que por padrão passa pelo AI Gateway da Vercel e lê a chave de `AI_GATEWAY_API_KEY`. Se preferir, use o pacote do provedor direto.

`src/server.ts`:

```ts
import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { embed, embedMany, cosineSimilarity } from 'ai';
import { z } from 'zod';

const DOCS_DIR = process.env.DOCS_DIR ?? './docs';
const EMBEDDING_MODEL = 'openai/text-embedding-3-small';
const MAX_CHARS = 1200; // ponto de partida, ajuste medindo
const MIN_SCORE = 0.3;  // ponto de partida, ajuste medindo

type Piece = { source: string; heading: string; content: string };
type Chunk = Piece & { embedding: number[] };

// Chunking por estrutura: corta nos cabeçalhos e, se a seção passar do
// limite, divide por parágrafo repetindo o título no chunk seguinte.
function chunkMarkdown(markdown: string): { heading: string; content: string }[] {
  const sections = markdown
    .split(/\n(?=#{1,3} )/)
    .map((s) => s.trim())
    .filter(Boolean);

  const chunks: { heading: string; content: string }[] = [];

  for (const section of sections) {
    const heading = section.split('\n')[0].replace(/^#+\s*/, '');

    if (section.length <= MAX_CHARS) {
      chunks.push({ heading, content: section });
      continue;
    }

    let current = '';
    for (const paragraph of section.split(/\n{2,}/)) {
      if (current && current.length + paragraph.length > MAX_CHARS) {
        chunks.push({ heading, content: current });
        current = `${heading}\n\n${paragraph}`;
      } else {
        current = current ? `${current}\n\n${paragraph}` : paragraph;
      }
    }
    if (current) chunks.push({ heading, content: current });
  }

  return chunks;
}

async function buildIndex(): Promise<Chunk[]> {
  const files = (await readdir(DOCS_DIR)).filter((f) => f.endsWith('.md'));
  const pieces: Piece[] = [];

  for (const file of files) {
    const markdown = await readFile(join(DOCS_DIR, file), 'utf8');
    for (const chunk of chunkMarkdown(markdown)) {
      pieces.push({ source: file, ...chunk });
    }
  }

  const { embeddings } = await embedMany({
    model: EMBEDDING_MODEL,
    values: pieces.map((p) => p.content),
  });

  return pieces.map((p, i) => ({ ...p, embedding: embeddings[i] }));
}

const index = await buildIndex();
// stdout é o canal do protocolo: log só em stderr.
console.error(`índice pronto: ${index.length} chunks`);

const server = new McpServer({ name: 'docs-search', version: '1.0.0' });

server.registerTool(
  'search_docs',
  {
    description:
      'Busca trechos nas docs internas do time por significado. ' +
      'Use para perguntas sobre processos, convenções e decisões do time. ' +
      'Retorna os trechos mais relevantes, cada um com a fonte.',
    inputSchema: {
      query: z.string().describe('Pergunta ou termos a buscar, em linguagem natural'),
      limit: z.number().int().min(1).max(8).default(4).describe('Máximo de trechos'),
    },
  },
  async ({ query, limit }) => {
    const { embedding } = await embed({ model: EMBEDDING_MODEL, value: query });

    const top = index
      .map((chunk) => ({ chunk, score: cosineSimilarity(embedding, chunk.embedding) }))
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .filter(({ score }) => score >= MIN_SCORE);

    if (top.length === 0) {
      return { content: [{ type: 'text', text: 'Nenhum trecho relevante encontrado nas docs.' }] };
    }

    const text = top
      .map(
        ({ chunk, score }) =>
          `[fonte: ${chunk.source} · ${chunk.heading} · score ${score.toFixed(2)}]\n${chunk.content}`,
      )
      .join('\n\n---\n\n');

    return { content: [{ type: 'text', text }] };
  },
);

await server.connect(new StdioServerTransport());
```

Dois pontos desse código merecem atenção.

**O chunker é o do post anterior com duas melhorias.** Ele corta por cabeçalho, mas agora respeita um tamanho máximo e repete o título quando precisa dividir uma seção longa. É a mesma ideia da tabela lá em cima: estrutura primeiro, limite de tamanho como rede de segurança, título em cada chunk.

**O caminho sem resultado devolve um texto explícito.** "Nenhum trecho relevante" é uma resposta útil pro agente: ele sabe que a busca falhou e pode reformular a consulta ou dizer ao usuário que não achou. Devolver os 4 trechos menos ruins sempre, mesmo com score baixo, empurra o modelo a responder com base em lixo.

### Registrando no cliente

No Claude Code, um `.mcp.json` na raiz do projeto registra o servidor:

```json
{
  "mcpServers": {
    "docs-search": {
      "command": "npx",
      "args": ["tsx", "src/server.ts"],
      "env": {
        "DOCS_DIR": "./docs",
        "AI_GATEWAY_API_KEY": "${AI_GATEWAY_API_KEY}"
      }
    }
  }
}
```

Também dá pra registrar pela linha de comando com `claude mcp add`; confira `claude mcp add --help` na sua versão pra ver as opções de escopo e de variáveis de ambiente.

### Testando

Teste a busca sozinha antes de ligar o agente. O MCP Inspector permite chamar a ferramenta manualmente:

```bash
npx @modelcontextprotocol/inspector npx tsx src/server.ts
```

Monte uma lista pequena de perguntas reais do time, cada uma com o documento onde a resposta deveria estar, e confira se ele aparece no topo. Se a busca não traz o trecho certo, o problema está no chunking, no modelo de embedding ou no `MIN_SCORE`, e o agente não vai compensar.

Só depois disso vale conectar o agente e perguntar algo como "qual é o processo de rollback do time?". O comportamento esperado é o agente chamar `search_docs`, ler os trechos e responder citando a fonte. Numa pergunta mais vaga, ele pode reformular a consulta e buscar de novo. Observe as chamadas que ele faz: a consulta que o agente escolhe diz muito sobre o que a descrição da ferramenta comunica.

## O que fica

RAG é um pipeline de recuperação com um LLM no fim, e as decisões que mais pesam vêm antes do modelo: como quebrar, como representar, como buscar. Chunking e embeddings são onde se ganha ou se perde qualidade.

Agente e MCP mudam quem chama a busca e como ela é exposta, não o que ela entrega. O agente ganha flexibilidade e perde previsibilidade. O MCP ganha reuso e perde nada além de um pouco de configuração. Nenhum dos dois compensa uma busca ruim.

O caminho que funciona é o mesmo de qualquer sistema de busca: monte perguntas reais, meça se o trecho certo aparece, e só depois refine o resto.

## Referências

- Model Context Protocol. [Documentação e especificação](https://modelcontextprotocol.io/) — servidores, clientes, ferramentas, recursos e prompts.
- Model Context Protocol. [TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk) — `McpServer`, `registerTool` e `StdioServerTransport`, usados no exemplo.
- Vercel AI SDK. [Embeddings](https://ai-sdk.dev/docs/ai-sdk-core/embeddings) — `embed`, `embedMany` e `cosineSimilarity`.
- Anthropic. [Claude Code: MCP](https://code.claude.com/docs/en/mcp) — como registrar servidores MCP no Claude Code.
- No blog: [RAG na prática: assistente de docs internas do time](/posts/rag-na-pratica-assistente-de-docs-do-time) — versão com Supabase e pgvector.
