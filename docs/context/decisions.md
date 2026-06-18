# Decisões do Projeto

Escolhas técnicas que substituem padrões gerais. Separadas por domínio.
Registradas aqui para que agentes não inventem convenções não acordadas.

## Backend

### Arquitetura

- Clean Architecture com limites de camada estritos
- Feature-first, organizado por módulo (não por camada técnica)
- DI baseado em tokens: `{ provide: IUsersRepository, useClass: PrismaUsersRepository }`
- Entidades de domínio: classes TypeScript puras — zero imports NestJS
- Módulos comunicam-se apenas via services públicos (sem acesso cross-module a repositories)

```
src/
  modules/
  common/
  infra/
  config/

module/
  controllers/
  services/
  repositories/
  domain/
  dto/
```

### ORM e banco

- Prisma ORM com PostgreSQL
- `synchronize: false` em produção — migrations obrigatórias para toda mudança de schema
- Sem concatenação de SQL raw

### API

- REST com Swagger (`@nestjs/swagger`)
- Versionamento via prefixo: `/api/v1/`
- Paginação cursor-based preferida sobre offset em tabelas grandes

### Autenticação

- NextAuth / Auth.js
- HTTP-only cookies para sessão
- Guards obrigatórios em todas as rotas privadas

### Cache

- Redis via NestJS CacheModule

### Erros e logs

- Todos os erros estendem `AppException`
- Filtro global de exceções — shape consistente de resposta, sem stacktrace exposto
- Pino logger, logs JSON estruturados
- `requestId` obrigatório em todos os logs
- Proibido `console.log` e nunca logar dados sensíveis

### Fila

- Nenhuma por enquanto — jobs pesados devem usar filas quando implementados (não bloqueiam HTTP)

### Segurança

- Validação com Zod obrigatória em todas as entradas (`ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true })` global)
- `class-validator` em todos os DTOs de entrada
- Apenas queries parametrizadas — sem interpolação de string em SQL
- Senhas com bcrypt (cost ≥ 12)
- Helmet habilitado, rate limiting habilitado

### Testes backend

- Unit: Jest para services (use-cases), mockar todas as dependências via injeção de interface
- Integration: Supertest contra app NestJS real com banco de teste
- Cobertura mínima: use cases 90%, controllers 80%, repos 60%

---

## Frontend

### Renderização

- App Router (Next.js) — sem Pages Router
- Server Components por padrão; `'use client'` apenas para interatividade ou browser APIs
- Server Actions para mutações internas — não API routes
- Dados em Server Components sempre que possível — evitar `useEffect` para fetch

### Estilização

- Tailwind CSS — sem CSS Modules, sem styled-components

### Componentes

- Todos os componentes UI devem vir de `@nico.dev/ui` (packages/ui/)
- Nenhum componente deve ser criado diretamente em `apps/web` ou subprojetos sem antes existir (ou ser adicionado) ao design system
- Radix UI para primitivas de acessibilidade (Checkbox, Select, Tabs, Avatar, etc.)
- shadcn/ui como referência de padrão — sem MUI, sem Chakra

### Estado global

- Zustand — sem Redux, sem Jotai

### Formulários

- React Hook Form + Zod — sem Formik

### Data fetching no cliente

- TanStack Query — sem SWR, sem fetch hooks manuais

### Ícones

- Lucide React — sem Heroicons, sem Phosphor

### Tokens de cor

- Sempre via variáveis CSS semânticas (classes Tailwind como `bg-primary`) — nunca hex direto

### Testes frontend

- React Testing Library + Jest — sem Enzyme
- MSW para mock de rede — sem mocks manuais de fetch
- Playwright para E2E
- Cobertura mínima: componentes 70%, hooks e utils 90%, fluxos P0 (E2E) 100%

---

## Blog (blog.nico.dev.br)

> Decisões completas em `apps/blog/docs/context/decisions.md`

---

## Criativo (criativo.nico.dev.br)

- App dedicado a landing pages de campanhas e estruturas de portfólio, com tema e componentes independentes por página.
- Cada landing define seu próprio `theme.css`, escopado por classe wrapper (nunca `:root` nem `globals.css` do app) — permite identidades visuais distintas por campanha.
- Landing pages renderizam fora do route group `(site)`, sem header/footer/nav do app — foco total em conversão.
- Captura de e-mail em mutações usa Server Actions com Zod; primeira landing (`/landing-newsletter-premium`) usa mock em memória, sem ESP real ainda.
- Spec completa: `docs/specs/2026-06-17-app-criativo.md`
- Segunda landing (`/desafio-30-dias-habitos`): mesmo padrão de mock + tema escopado (`theme-habitos30`, fixo em modo claro). Captura nome + e-mail + consentimento LGPD.
- Conteúdo fictício (depoimentos, contador de participantes) só é usado quando explicitamente solicitado pelo usuário — atribuição sempre genérica, nunca nomes/fotos inventados, para não fabricar identidades reais.
- Spec completa: `docs/specs/2026-06-17-landing-desafio-30-dias-habitos.md`
