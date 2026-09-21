---
title: "RAG na prática: assistente de docs internas do time"
slug: "rag-na-pratica-assistente-de-docs-do-time"
date: "2026-09-20"
categories: ["ia", "dev"]
status: "published"
featured: false
description: "O que é RAG, por que ele resolve o problema do LLM que não conhece seus documentos, e um exemplo completo: um assistente que responde perguntas sobre as docs internas de um time."
tags: ["rag", "embeddings", "pgvector", "supabase", "ai-sdk"]
coverImage: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&q=80"
---

Pergunte a um LLM qual é o processo de deploy do seu time e ele vai responder com confiança. Vai estar errado. Não por falta de inteligência: ele nunca viu o seu documento.

RAG (Retrieval-Augmented Generation, ou geração aumentada por recuperação) é a técnica mais direta pra resolver isso. Em vez de esperar que o modelo saiba, você busca os trechos relevantes dos seus documentos e entrega junto com a pergunta. O modelo deixa de "lembrar" e passa a "ler".

Este post explica o mecanismo e monta um exemplo completo: um assistente que responde perguntas sobre as docs internas de um time. O exemplo é ilustrativo — o time, os documentos e as perguntas são inventados só pra mostrar o fluxo.

## O problema que o RAG resolve

Um modelo só conhece o que estava nos dados de treino, e isso tem data de corte. Ele não conhece:

- documentos privados (wiki, ADRs, runbooks);
- o que mudou depois do treino;
- as convenções específicas do seu time.

Você poderia colar tudo no prompt. Mas a janela de contexto tem limite, e mesmo dentro dele, quanto mais texto irrelevante, pior a resposta tende a ficar. RAG é a alternativa: colocar no prompt só o que importa pra pergunta daquele momento.

Existe também o fine-tuning, que ajusta o modelo com seus dados. Ele serve pra mudar comportamento e estilo, mas é uma forma ruim de injetar fatos que mudam: cada atualização de documento pediria novo treino. Pra conhecimento que muda, recuperar em tempo de consulta é mais simples de manter.

## Como funciona: dois fluxos

O RAG tem duas fases separadas. A primeira roda uma vez (e de novo quando os documentos mudam). A segunda roda a cada pergunta.

![Os dois fluxos do RAG: indexação offline (documentos, chunks, embeddings, banco vetorial) e consulta a cada pergunta (embedding da pergunta, busca de chunks similares, prompt com contexto, LLM, resposta)](/images/rag-na-pratica-assistente-de-docs-do-time-fluxo.svg)

Duas ideias sustentam tudo isso.

**Embedding** é a representação de um texto como uma lista de números (um vetor). Textos com significado parecido ficam com vetores próximos. É isso que permite buscar por sentido: "como faço rollback?" fica perto de um trecho que fala em "reverter uma versão", mesmo sem compartilhar palavra nenhuma.

**Chunk** é um pedaço do documento. Você não indexa o documento inteiro, porque um vetor pra um texto longo dilui o significado, e você acabaria mandando páginas inteiras pro prompt. Quebrar em trechos menores deixa a busca mais precisa.

## O exemplo: assistente de docs do time

O cenário: um time tem documentos em Markdown (guia de deploy, convenções de código, decisões de arquitetura) e quer um assistente que responda perguntas sobre eles, citando a fonte.

A stack do exemplo:

- **Supabase com pgvector** como banco vetorial. Se você já usa Postgres, não precisa de serviço novo.
- **Vercel AI SDK** pra gerar embeddings e chamar o modelo.
- **TypeScript**.

Os nomes de modelo abaixo (`openai/text-embedding-3-small`, `openai/gpt-4o`) seguem os exemplos da documentação do AI SDK. Troque pelo modelo que fizer sentido pra você, com uma regra: o modelo de embedding usado na indexação e na consulta precisa ser o mesmo.

### 1. Tabela e função de busca

O modelo `text-embedding-3-small` gera vetores de 1536 dimensões. A tabela precisa do mesmo tamanho:

```sql
create extension if not exists vector with schema extensions;

create table doc_chunks (
  id bigserial primary key,
  source text not null,          -- de qual documento veio
  content text not null,         -- o trecho em si
  embedding extensions.vector(1536)
);

create index on doc_chunks
  using hnsw (embedding vector_cosine_ops);

create or replace function match_doc_chunks (
  query_embedding extensions.vector(1536),
  match_threshold float,
  match_count int
)
returns table (id bigint, source text, content text, similarity float)
language sql stable
as $$
  select
    doc_chunks.id,
    doc_chunks.source,
    doc_chunks.content,
    1 - (doc_chunks.embedding <=> query_embedding) as similarity
  from doc_chunks
  where 1 - (doc_chunks.embedding <=> query_embedding) > match_threshold
  order by doc_chunks.embedding <=> query_embedding asc
  limit match_count;
$$;
```

O operador `<=>` calcula distância de cosseno; `1 - distância` vira a similaridade. O índice HNSW precisa usar o mesmo tipo de operação da consulta (`vector_cosine_ops` combina com `<=>`), senão o Postgres não o utiliza.

### 2. Indexação

Aqui está a decisão que mais pesa na qualidade: como quebrar. Pra Markdown, quebrar por seção (cabeçalho) costuma respeitar a estrutura melhor que cortar a cada N caracteres:

```ts
import { embedMany } from 'ai';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

function chunkBySection(markdown: string): string[] {
  return markdown
    .split(/\n(?=#{1,3} )/) // corta antes de cada cabeçalho
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

export async function indexDocument(source: string, markdown: string) {
  const chunks = chunkBySection(markdown);

  const { embeddings } = await embedMany({
    model: 'openai/text-embedding-3-small',
    values: chunks,
  });

  const rows = chunks.map((content, i) => ({
    source,
    content,
    embedding: embeddings[i],
  }));

  const { error } = await supabase.from('doc_chunks').insert(rows);
  if (error) throw error;
}
```

Esse chunker é propositalmente simples. Seções muito longas continuam gerando chunks grandes, e seções muito curtas perdem contexto. Pra um caso real, vale limitar o tamanho máximo e, se preciso, repetir o título da seção no início de cada chunk.

Em produção, a indexação também precisa lidar com atualização: quando um documento muda, apague os chunks antigos daquele `source` antes de inserir os novos. Senão a resposta pode misturar versão velha e nova.

### 3. Consulta

Com os dados indexados, a pergunta segue o fluxo do diagrama: embedding, busca, prompt, resposta.

```ts
import { embed, generateText } from 'ai';

export async function askDocs(question: string) {
  const { embedding } = await embed({
    model: 'openai/text-embedding-3-small',
    value: question,
  });

  const { data: matches, error } = await supabase.rpc('match_doc_chunks', {
    query_embedding: embedding,
    match_threshold: 0.5,
    match_count: 5,
  });
  if (error) throw error;

  if (!matches?.length) {
    return { answer: 'Não encontrei isso nas docs do time.', sources: [] };
  }

  const context = matches
    .map((m) => `[fonte: ${m.source}]\n${m.content}`)
    .join('\n\n---\n\n');

  const { text } = await generateText({
    model: 'openai/gpt-4o',
    system:
      'Você responde perguntas sobre as docs internas de um time. ' +
      'Use APENAS o contexto fornecido. ' +
      'Se o contexto não tiver a resposta, diga que não encontrou. ' +
      'Cite a fonte de onde tirou a informação.',
    prompt: `Contexto:\n${context}\n\nPergunta: ${question}`,
  });

  return { answer: text, sources: [...new Set(matches.map((m) => m.source))] };
}
```

Três detalhes desse código fazem diferença:

- **O `match_threshold`.** O valor `0.5` é um ponto de partida meu, não uma regra. O certo depende dos seus dados e do modelo de embedding, e só se descobre testando com perguntas reais. Alto demais, o assistente não acha nada. Baixo demais, ele traz lixo.
- **O caminho sem resultado.** Se nada passa do limiar, o código nem chama o modelo. Isso evita a alucinação mais previsível do RAG: o modelo recebe contexto vazio e responde do "conhecimento geral" com a mesma confiança de sempre.
- **A instrução de usar só o contexto.** Sem ela, o modelo mistura o que leu com o que já sabia, e você perde a garantia de que a resposta vem da doc.

## Onde o RAG falha

O RAG não elimina erro, só muda onde ele acontece.

**A busca traz o trecho errado.** É a falha mais comum. Se o chunk certo não vem no top-N, o modelo nunca o vê, e a melhor LLM do mundo não compensa isso. Por isso a qualidade do RAG é, em boa parte, qualidade de recuperação. Vale testar a busca sozinha, com um conjunto de perguntas e o trecho esperado pra cada uma, antes de mexer no prompt.

**O chunk perde contexto.** Um trecho como "Use a flag `--force` nesse caso" não diz qual caso. Quebrar sem cuidado separa a resposta do que a torna compreensível.

**Documento desatualizado.** O assistente responde com fidelidade ao que está escrito. Se a doc está errada, a resposta também está — e agora com a aparência de fonte oficial.

**Pergunta que exige vários documentos.** Perguntas que dependem de cruzar informação de várias fontes ou de agregar (contar, comparar) funcionam mal com "top 5 trechos parecidos". Esse é o ponto onde técnicas mais elaboradas entram, como reescrever a pergunta, buscar em mais de uma etapa ou combinar busca vetorial com busca por palavra-chave.

## Quando não usar RAG

Se seus documentos cabem com folga no contexto do modelo e mudam pouco, colar tudo no prompt é mais simples e elimina a etapa de recuperação inteira. Se a pergunta é sobre dado estruturado (quantos deploys tivemos ontem?), uma consulta SQL responde melhor que uma busca por similaridade. RAG brilha quando o corpo de texto é grande, muda com frequência e a pergunta é aberta.

## O que fica

RAG não é uma tecnologia nova de modelo. É engenharia de recuperação de informação com um LLM no final. A maior parte do trabalho e da qualidade está antes do modelo: como você quebra os documentos, como busca e como decide o que fazer quando não acha nada.

Se for construir um, comece pelo fim inverso: monte um conjunto pequeno de perguntas reais do time com a resposta esperada, e use isso pra medir a busca antes de mexer em qualquer prompt. Sem isso, você ajusta no escuro.

## Referências

- Vercel AI SDK — [Retrieval Augmented Generation (Node.js)](https://ai-sdk.dev/cookbook/node/retrieval-augmented-generation)
- Vercel AI SDK — [RAG Agent Guide](https://ai-sdk.dev/cookbook/guides/rag-chatbot)
- Supabase — [Vector columns e `match_documents`](https://supabase.com/docs/guides/ai/vector-columns)
- Supabase — [Semantic search e índices HNSW](https://supabase.com/docs/guides/ai/semantic-search)
