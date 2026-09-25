# Product Context

> **Purpose**: Help AI agents understand the product domain, user needs, and business rules. Update this as the product evolves.

## Product Overview

**Product name**: Nico.dev
**Tagline**: Engenheiro de software construindo produtos digitais escaláveis
**Stage**: MVP

Site pessoal e portfólio profissional de Roberto Nicoletti. Organizado como um monorepo Turborepo, reúne o site principal e subprojetos independentes com deploy em subdomínios separados. O objetivo é apresentar trabalhos, projetos e experiência para recrutadores e empresas interessadas em contratar um engenheiro de software sênior.

## Target Users

### Primary User
- **Who**: Recrutador ou empresa buscando contratar engenheiro sênior
- **Goal**: Avaliar experiência, projetos e fit técnico de Roberto Nicoletti
- **Pain point**: Dificuldade em encontrar evidências concretas de senioridade e qualidade de entrega em um único lugar
- **Technical level**: Técnico / Semi-técnico

### Secondary User (if any)
- **Who**: Comunidade de desenvolvedores
- **Goal**: Consumir conteúdo técnico via blog e acompanhar projetos open source

## Core Features

| Feature | Description | Status |
|---------|-------------|--------|
| Portfólio de projetos | Galeria de trabalhos e projetos com descrição, tecnologias e links | Live |
| Blog | Artigos técnicos autorais em tech, IA, organização e qualidade de vida — blog.nico.dev.br | Planejado |
| Currículo | Página de CV com experiência, habilidades e histórico profissional | Em andamento |
| Formulário de contato | Canal direto de contato para oportunidades e colaborações | Em andamento |
| Subprojetos no monorepo | Aplicações independentes com deploy em subdomínios (ex: projeto.nico.dev) | Planejado |
| skills.nico.dev.br | Catálogo estático das skills pessoais de agentes — busca, detalhe por skill e comando de instalação com um clique | Planejado |
| tools.nico.dev | Coleção de ferramentas web para devs (clima, debugger IA, OCR, busca semântica, mercado financeiro, CLT vs PJ…) | Em andamento |
| challenges.nico.dev | Portfólio visual de desafios técnicos por empresa — cards com preview, descrição, link de deploy e repositório. Dados carregados automaticamente do GitHub via API. | Planejado |
| metronome.nico.dev | Metrônomo online com marcação de tempo audiovisual para músicos — controle de BPM, beats, timer, stress no primeiro tempo e subdivisões | Planejado |

## Subproject: Blog (blog.nico.dev.br)

> Contexto completo em `apps/blog/docs/context/product.md`

- **Tagline:** Blog com posts da área tech, IA, organização e qualidade de vida
- **Framework:** Astro (build estático)
- **Estágio:** MVP

---

## Subproject: Metronome (metronome.nico.dev)

**Nome:** Metronome
**Tagline:** Metrônomo online com marcação de tempo audiovisual
**Estágio:** Ideia

### Usuário primário
- **Quem:** Músico buscando um metrônomo acessível para qualquer ocasião
- **Objetivo:** Praticar com marcação de tempo precisa, visual e sonora
- **Problema:** Falta de ferramentas gratuitas, rápidas e acessíveis sem instalação

### Features do Metrônomo

| Feature | Descrição | Status |
|---------|-----------|--------|
| Controle de BPM | Define a velocidade do metrônomo em batidas por minuto | Planejado |
| Beats (compassos) | Configura o número de batidas por compasso | Planejado |
| Timer | Define duração da sessão de prática com contagem regressiva | Planejado |
| Stress first beat | Ênfase sonora e visual no primeiro tempo do compasso | Planejado |
| Subdivisions | Subdivisões rítmicas dentro de cada tempo (ex: colcheias, tercinas) | Planejado |
| Feedback audiovisual | Clique sonoro sincronizado com animação visual a cada batida | Planejado |

### Regras de negócio
- Sem regras críticas definidas neste momento.

### Glossário do domínio
- **BPM (Beats Per Minute):** Velocidade do metrônomo em batidas por minuto
- **Beat:** Unidade de tempo fundamental do compasso
- **Compasso:** Agrupamento regular de beats (ex: 4/4, 3/4)
- **Stress first beat:** Acento mais forte no primeiro tempo de cada compasso
- **Subdivision:** Divisão de cada beat em unidades menores (ex: 2 colcheias por beat = subdivisão binária)

---

## Subproject: Skills Catalog (skills.nico.dev.br)

> Spec original: catálogo estático das skills pessoais de agentes. Vive em `apps/skills` neste monorepo (decisão de 2026-09-24), reaproveitando `@nico.dev/ui` e o design system Nocturne.

**Nome:** Nico Skills
**Tagline:** Catálogo curado das minhas skills de agentes, instalável com um comando.
**Estágio:** Ideia

O CLI `skills` já instala a partir de qualquer repositório público do GitHub (`npx skills add <owner/repo>`). O site não reimplementa instalação: é só a vitrine curada do repositório `robertourias/skills`, gerada a partir do frontmatter de cada `SKILL.md`, para que a página nunca divirja da skill.

### Usuário primário
- **Quem:** Desenvolvedor que usa agentes (Claude Code, Cursor, Codex) e quer descobrir e instalar as skills do Roberto
- **Objetivo:** Buscar uma skill, entender o que ela faz e copiar o comando de instalação
- **Problema:** Skills espalhadas, sem página própria com descrição, versão e comando pronto; listagem no skills.sh depende de instalações e pode demorar

### Features

| Feature | Descrição | Status |
|---------|-----------|--------|
| Registry | `build-registry.ts` lê `skills/*/SKILL.md` (gray-matter), valida com Zod e gera `registry.json` | Planejado |
| Home | Hero com banner ASCII, comando geral, contadores, busca (atalho `/`), filtros por categoria/tag/status e lista | Planejado |
| Página da skill (`/s/[slug]`) | Badges, descrição, `<InstallCommand>` em abas, SKILL.md renderizado, árvore de arquivos, links GitHub e skills.sh | Planejado |
| Guia skills.sh | Bloco "Encontre no skills.sh" na home e rota `/skills-sh` com o guia completo | Planejado |
| Packs e tópicos | `/packs`, `/p/[id]`, `/topic/[tag]`, `sitemap.xml` (Fase 2) | Planejado |
| Deploy automático | GitHub Actions → imagem nginx no GHCR → SSH na VPS, Traefik com TLS (Fase 2) | Planejado |

Fases: 1 MVP (registry, home, `/s/[slug]`, bloco skills.sh, deploy manual) → 2 Automação e descoberta → 3 Acabamento (changelog, OG images, filtro por agente, Uptime Kuma).

### Regras de negócio
- Skill com `metadata.visibility: hidden` não aparece no site nem no `registry.json`.
- Comandos de instalação vêm de `installCommands` no `registry.json`; nunca são montados no cliente.
- Markdown das skills é sanitizado (`rehype-sanitize`); site 100% estático, sem backend, banco ou segredos no cliente.
- SKILL.md inválido (sem `description`, `category` fora de `catalog.config.ts`, `name` diferente da pasta) faz o build/CI falhar indicando arquivo e campo.

### Glossário do domínio
- **Skill:** Pasta em `skills/<slug>/` com `SKILL.md` (frontmatter `name` + `description`; campos do catálogo dentro de `metadata`)
- **Slug:** `name` da skill, kebab-case, igual ao nome da pasta
- **Pack:** YAML em `packs/` que agrupa skills para instalar juntas
- **Registry:** `registry.json` gerado no build; fonte única de dados do site (inclui `installCommands`)
- **Tópico:** Página `/topic/[tag]` com skills filtradas por tag
- **`visibility: hidden`:** Skill fora do build, do site e do `registry.json`
- **skills.sh:** Diretório externo; só lista uma skill depois que ela é instalada (telemetria anônima do CLI)

### Decisões em aberto
- [ ] Idioma da `description` (PT, EN ou bilíngue): agentes usam esse campo para acionar a skill
- [ ] Confirmar se o CLI aceita `--skill <slug>`; senão a aba "Esta skill" usa o comando do repositório
- [ ] Confirmar formato da URL do skills.sh para repos pessoais e recursos de [personalização](https://www.skills.sh/docs/customize)
- [ ] Pasta na VPS: `/opt/docker/skills-catalog/` ou `/opt/docker/skills/`

---

## Business Rules

> Critical business logic that AI agents must never violate. These are non-negotiable constraints.

- **Design system obrigatório:** Todo app frontend criado em `apps/` deve usar `packages/ui` como biblioteca de componentes. Nunca instale uma biblioteca de componentes alternativa (MUI, Chakra, shadcn standalone, etc.) dentro de um app — a extensão do design system deve acontecer em `packages/ui`, não nos apps.
- **Sem regras de negócio críticas adicionais definidas neste momento.**
- **Skills Catalog:** ver regras críticas na seção "Subproject: Skills Catalog".

## Domain Glossary

> Use these terms consistently in code, documentation, and conversations.

| Term | Definition |
|------|-----------|
| Subprojeto | Aplicação separada dentro do monorepo Turborepo, com deploy próprio em um subdomínio de nico.dev (ex: `projeto.nico.dev`) |
| Desafio técnico | Teste técnico entregue para uma empresa durante processo seletivo, disponibilizado em `robertourias/testes-tecnicos` com código, README e deploy |
| Link Final | Seção do README de cada desafio técnico que contém a URL do projeto publicado. Padrão: `## Link Final` seguido de uma URL. |
| Monorepo | Repositório único gerenciado com Turborepo contendo o site principal e todos os subprojetos |

## User Journeys

### Journey 1: Recrutador avaliando candidato
```
1. Recrutador acessa nico.dev
2. Navega pelo portfólio de projetos
3. Consulta o currículo para histórico profissional
4. Acessa subprojetos via subdomínios para ver aplicações reais em funcionamento
5. Usa o formulário de contato para iniciar conversa
```

### Journey 2: Desenvolvedor consumindo conteúdo
```
1. Acessa nico.dev via busca orgânica ou link
2. Lê artigos técnicos no blog
3. Explora repositórios linkados nos projetos
```

## Metrics & Success Criteria

- **Primary metric**: Contatos qualificados recebidos via formulário
- **Secondary metrics**: Visitas únicas, tempo na página de portfólio
- **Current targets**: a definir

## Out of Scope

- Autenticação de usuários (site é público e estático)
- E-commerce ou cobrança
- CMS complexo (conteúdo gerenciado via código/markdown)

## Competitive Context

- **Similar products**: Portfólios de outros engenheiros sênior, LinkedIn
- **Our differentiation**: Subprojetos reais acessíveis em subdomínios, mostrando produto funcionando — não apenas screenshots
