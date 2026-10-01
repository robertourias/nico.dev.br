---
title: "Documentação automática no Fastify com Swagger: Exemplo prático"
slug: "fastify-documentacao-exemplo-pratico"
date: "2026-09-30"
categories: ["dev", "tech"]
status: "published"
featured: false
description: "Aprenda a gerar documentação Swagger automaticamente no Fastify a partir dos schemas de validação da sua API."
tags: ["fastify", "nodejs", "swagger", "api"]
coverImage: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&q=80"
---

Escrever documentação de API manualmente é um trabalho que já nasce desatualizado. No momento em que você altera um campo no código e esquece de atualizar o README ou o arquivo YAML do Swagger, a confiança do time de frontend ou dos clientes externos naquela documentação desaparece para sempre. Documentação defasada é pior do que nenhuma documentação, pois induz ao erro.

O Fastify, um dos frameworks web mais rápidos e eficientes do ecossistema Node.js, resolve esse problema invertendo a ordem das coisas: a validação dos seus dados gera a documentação da API, literalmente de graça.

Neste post, vou mostrar como utilizar o ecossistema do Fastify, combinando os plugins oficiais `@fastify/swagger` e `@fastify/swagger-ui` com o poderoso `TypeBox`, para construir uma API tipada de ponta a ponta que se documenta sozinha.

## O problema da documentação isolada do código

Em abordagens tradicionais com frameworks mais antigos como o Express, é muito comum termos o código da rota que processa a requisição de um lado, e um arquivo `swagger.yaml` ou `openapi.json` gigantesco de outro. O desenvolvedor precisa lembrar de manter ambos sincronizados. Esse processo repetitivo gera muito atrito cognitivo e invariavelmente leva a esquecimentos durante os prazos curtos de entrega.

A arquitetura do Fastify é fundamentalmente diferente. Ele foi construído desde o seu núcleo com foco no uso de JSON Schema. O framework utiliza esses schemas estruturados não apenas para documentar, mas para validar e serializar de forma extremamente rápida tudo o que entra (body, querystring, headers, params) e o que sai (response) de cada uma das rotas. 

Essa validação em tempo de execução protege o sistema. E a melhor parte de toda essa estrutura é que, como um JSON Schema já descreve detalhadamente o formato exato dos dados esperados, nós podemos simplesmente expor esses mesmos schemas e deixar uma ferramenta ler todos eles para gerar a interface gráfica do Swagger interativo, sem esforço adicional.

## O setup: Fastify, Swagger e TypeBox

Para evitar a escrita manual de objetos verbosos em JSON Schema nativo, a comunidade Node adota bibliotecas que facilitam isso. Vamos usar o `@sinclair/typebox`. Essa ferramenta nos permite escrever schemas complexos usando uma sintaxe amigável de JavaScript/TypeScript, enquanto extrai toda a tipagem estática do TypeScript no processo.

Para começar, instale as dependências essenciais:

```bash
npm i fastify @fastify/swagger @fastify/swagger-ui @sinclair/typebox @fastify/type-provider-typebox
```

Agora, vamos inicializar o servidor e registrar os plugins geradores. Veja como o TypeBox é integrado como o provedor de tipos padrão da nossa instância:

```typescript
import Fastify from 'fastify';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';

const server = Fastify().withTypeProvider<TypeBoxTypeProvider>();

// 1. Registramos o gerador e definimos as informações base da OpenAPI
await server.register(swagger, {
  openapi: {
    info: {
      title: 'Minha API Veloz',
      description: 'Documentação da API gerada automaticamente a partir de Schemas',
      version: '1.0.0'
    },
    servers: [{ url: 'http://localhost:3000' }]
  }
});

// 2. Registramos a interface gráfica para visualizar os dados
await server.register(swaggerUi, {
  routePrefix: '/docs', // Rota onde a interface ficará acessível
  uiConfig: {
    docExpansion: 'list',
    deepLinking: false
  }
});
```

Até este ponto, o motor que converte JSON para a especificação do Swagger já está rodando perfeitamente. Contudo, ele ainda não possui nenhuma rota de fato registrada para poder documentar.

## Criando rotas com TypeBox e Schemas

Vamos ao cenário real: a criação de uma rota de cadastro de usuário. Utilizaremos o TypeBox para estipular rigidamente o formato esperado no corpo da requisição (payload), além de prever os formatos exatos de retorno tanto em caso de sucesso quanto para falhas de requisição.

```typescript
import { Type, Static } from '@sinclair/typebox';

// Definindo o schema do payload recebido
const UserBody = Type.Object({
  name: Type.String({ description: 'Nome completo do usuário' }),
  email: Type.String({ format: 'email', description: 'E-mail em formato válido' }),
  age: Type.Optional(Type.Number({ minimum: 18, description: 'Maioridade necessária' }))
}, { $id: 'UserBody' });

// Caso necessário, você pode inferir o tipo estático para funções internas
type UserPayload = Static<typeof UserBody>;

// Definindo o schema da resposta de sucesso
const UserResponse = Type.Object({
  id: Type.String(),
  status: Type.String()
});

// Registrando a nossa rota de cadastro
server.post('/users', {
  schema: {
    description: 'Criação de um novo registro de usuário no sistema',
    tags: ['Users', 'Cadastro'],
    body: UserBody,
    response: {
      201: UserResponse,
      400: Type.Object({ 
        error: Type.String(),
        message: Type.String() 
      }, { description: 'Erro de validação ou de negócio' })
    }
  }
}, async (request, reply) => {
  // Neste ponto, request.body já está perfeitamente tipado graças ao TypeProvider!
  // O autocomplete do seu editor vai exibir: name, email e age.
  const { name, email, age } = request.body;
  
  // Aqui entraria a regra de negócio e persistência no banco de dados
  // const user = await database.createUser({ name, email, age });
  
  // Retornamos os dados respeitando o contrato estipulado para o status 201
  return reply.status(201).send({ 
    id: 'usr_1234567890', 
    status: 'created' 
  });
});
```

A verdadeira genialidade arquitetural desse padrão mora no bloco `schema` de configuração da rota. O Fastify vai utilizar de forma otimizada os objetos gerados pelo TypeBox para realizar simultaneamente três coisas cruciais para a API:

1. **Validação na Borda:** Ele vai verificar milissegundos antes se a requisição que chegou da rede possui o formato estruturado correto. Se um cliente esquecer o campo `name`, por exemplo, o próprio core do framework retorna um erro HTTP 400 antes sequer da sua função assíncrona ser invocada.
2. **Tipagem Estática Dinâmica:** Prover a inferência do TypeScript (autocompletar) perfeita para `request.body` e `reply.send`, garantindo que o seu código interno trate os tipos corretamente.
3. **Mapeamento OpenAPI:** Por debaixo dos panos, extrair essas definições paramétricas que alimentam o motor em tempo real do Swagger.

## Reutilizando definições para escalar o projeto

Conforme a aplicação cresce, definir a estrutura de objetos repetidamente em todas as rotas vira um problema de manutenção em escala. O Fastify nos oferece uma excelente API para gerenciar esquemas reutilizáveis de forma elegante. 

Em vez de repetir a formatação clássica do JSON de erros de sistema em todo endpoint criado, podemos adicioná-los a uma biblioteca central da instância do framework:

```typescript
// Registramos na memória global da instância
server.addSchema(Type.Object({
  code: Type.String(),
  message: Type.String()
}, { $id: 'GenericError' }));

// E apenas referenciamos nas rotas que precisarem usando o utilitário $ref
server.get('/users/:id', {
  schema: {
    response: {
      404: Type.Ref('GenericError')
    }
  }
}, async (request, reply) => {
  /* ... */
});
```

Esse padrão de referência (`$ref`) reflete diretamente e fielmente na saída interpretada pelo Swagger. Ao invés de apresentar uma saída monolítica onde cada rota documentada repete e detalha massivamente cada erro isolado da API, o Swagger vai organizar as informações criando componentes reutilizáveis, simplificando imensamente a leitura da estrutura final.

## O resultado na prática

Para testar o formato e o ganho real, ao finalizar a implementação básica da rota e inicializar o projeto usando uma chamada simples com `await server.listen({ port: 3000 })`, basta abrir o seu navegador preferido no endereço `http://localhost:3000/docs`. Você será apresentado instantaneamente à clássica interface verde e muito bem desenhada da UI oficial do Swagger.

A rota recém-criada de `POST /users` já vai aparecer exposta ali com todos os testes possíveis, perfeitamente categorizada sob a aba ou tag limpa `Users` que escrevemos no objeto. O framework descreverá milimetricamente ao cliente da API quais campos do payload devem ser textuais, inteiros e demonstrar os limites ou formatações, além de injetar exemplos predefinidos reais para testes das falhas (400) e também exibir os retornos garantidos (201). Tudo construído, checado, validado e gerado ao vivo com o servidor. Nenhuma linha arcaica de sintaxe YAML foi editada. 

## O que fica

O ponto-chave absoluto para extrair o real valor pragmático dessa arquitetura de infraestrutura é compreender que a **documentação se tornou, na prática, um subproduto direto e gratuito de um código robusto, escalável, funcional e altamente protegido**.

Ao adotar esse fluxo de forma completa com Fastify para produção, a sua equipe inteira não estará perdendo tempo documentando rotas tediosas para mostrar uma documentação em reuniões; vocês estarão, na verdade, focando 100% dos esforços para implementar schemas superprotetivos e barreiras inquebráveis em nível de borda, defendendo a lógica sensível do seu banco contra requisições indesejáveis, injetáveis ou mal formadas. O fato de que toda essa rigidez programática e defensiva acaba refletindo na criação automática, de bandeja, do seu painel interativo do Swagger é só uma excelente e pragmática consequência disso.

Daqui em diante, quando o líder de Produto solicitar subitamente que a rota passe a aceitar e validar um campo estrito com um formato de e-mail corporativo ou que tenha travas, você irá mudar o objeto e apenas ele. E de forma atômica e elegante: a porta de entrada valida os novos caracteres, o TypeScript se autocompleta no VSCode na linha abaixo e a página Web do Swagger reflete a novidade ao vivo no reload, sem a menor chance ou tempo para desatualização humana.
