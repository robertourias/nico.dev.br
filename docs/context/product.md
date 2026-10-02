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

## Business Rules

> Critical business logic that AI agents must never violate. These are non-negotiable constraints.

- **Design system obrigatório:** Todo app frontend criado em `apps/` deve usar `packages/ui` como biblioteca de componentes. Nunca instale uma biblioteca de componentes alternativa (MUI, Chakra, shadcn standalone, etc.) dentro de um app — a extensão do design system deve acontecer em `packages/ui`, não nos apps.
- **Sem regras de negócio críticas adicionais definidas neste momento.**

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
