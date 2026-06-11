---
title: "Um banco de dados central para não perder nada no Notion"
slug: "banco-de-dados-central-notion"
date: "2026-06-10"
category: "organizacao"
status: "published"
featured: false
description: "Como usar uma página DATABASES como única fonte da verdade e deixar seus dashboards só com views filtradas — sem duplicar dado nenhum."
tags: ["notion", "organizacao", "estudos"]
coverImage: "https://images.unsplash.com/photo-1606223226350-4cf4cd93a221?w=1200&q=80"
---

Você cria uma tabela de estudos na página de Estudos. Uma tabela de projetos na página de Projetos. Uma tabela de finanças na página de Finanças. Depois de seis meses, você tem oito tabelas sem relação entre si, dados duplicados e zero visibilidade do quadro geral.

O problema não é falta de disciplina — é arquitetura errada.

## A ideia: DATABASES como fonte única da verdade

Crie uma página chamada `DATABASES` no seu workspace. Ela não é uma dashboard, não tem visual bonito, não é pra você visitar todo dia. É o **depósito** — onde ficam todas as suas tabelas reais.

```
📦 DATABASES
   ├── 📋 Estudos
   ├── 📋 Projetos
   ├── 📋 Metas
   ├── 📋 Finanças
   ├── 📋 Documentos
   ├── 📋 Consultas Médicas
   └── 📋 Viagens
```

Cada tabela dessa existe **uma única vez**. Em nenhum outro lugar.

Os seus dashboards temáticos — Estudos, Vida Financeira, Saúde, Planejamento de Viagens — não têm tabelas próprias. Eles têm **linked views** das tabelas do DATABASES, com os filtros certos para o contexto.

## Por que isso muda o jogo

Quando você adiciona um novo livro pra estudar, ele entra na tabela `Estudos` do DATABASES. Automaticamente aparece no dashboard de Estudos (filtrado por status "A Fazer"), no dashboard de Metas (se estiver vinculado a uma meta) e em qualquer outro lugar que tenha uma view dessa tabela.

Nada de atualizar em dois lugares. Nada de dados desincronizados.

## Montando o banco de Estudos

A tabela `Estudos` no DATABASES tem estas colunas:

| Coluna | Tipo | Uso |
|---|---|---|
| Nome | Título | Nome do tópico, curso, livro ou material |
| Área | Select | Programação, IA, Finanças, Idiomas, etc. |
| Tipo | Select | Curso, Livro, Artigo, Vídeo, Projeto Prático |
| Status | Select | A Fazer → Em Progresso → Concluído → Pausado |
| Prioridade | Select | Alta, Média, Baixa |
| Prazo | Data | Quando precisa estar concluído |
| Horas estimadas | Número | Quanto tempo você acha que vai levar |
| Horas gastas | Número | Quanto você já dedicou |
| Meta vinculada | Relação | Liga com a tabela `Metas` |
| Notas | Texto | Link pro arquivo de notas ou resumo rápido |

Com essa estrutura, você tem tudo em um lugar. Agora é só filtrar.

## Os dashboards de Estudos na prática

Na sua página principal de Estudos, você não cria nada do zero — você insere linked views da tabela `Estudos` do DATABASES com filtros diferentes:

**Vista "Agora"** — o que está em andamento hoje:
- Filtro: Status = Em Progresso
- Ordenação: Prioridade (Alta → Baixa)
- Layout: Lista ou Board

**Vista "Fila"** — o que entra a seguir:
- Filtro: Status = A Fazer, Prioridade = Alta
- Ordenação: Prazo (mais próximo primeiro)
- Layout: Tabela

**Vista "Concluídos"** — histórico do que você já fez:
- Filtro: Status = Concluído
- Ordenação: Data de conclusão (mais recente)
- Layout: Galeria ou Lista

**Vista por Área** — quando você quer ver só o que está estudando de IA, por exemplo:
- Filtro: Área = IA
- Sem restrição de status — mostra o mapa completo daquela área

Todas essas views leem o mesmo dado. Você não duplicou nenhuma linha.

## Relacionando Estudos com Metas

A coluna "Meta vinculada" é onde a coisa fica interessante. A tabela `Metas` no DATABASES tem campos como Objetivo, Prazo, Área e Status. Quando você vincula um item de Estudos a uma Meta, consegue criar views na dashboard de Metas que mostram automaticamente quais estudos estão progredindo para cada objetivo.

Exemplo prático: você tem uma meta chamada "Conseguir certificação AWS até dezembro". Na tabela Estudos, você marca os cursos e documentações relacionados com essa meta. Na dashboard de Metas, uma linked view mostra o progresso de cada item vinculado — sem redigitar nada.

## O mesmo princípio para tudo mais

**Consultas Médicas**: tabela única com data, especialidade, médico, resultado e próximos passos. Na página de Saúde, uma view filtra por data futura pra lembrar de consultas marcadas. Outra filtra por especialidade pra ver histórico de cardiologia separado de dermatologia.

**Documentos**: tabela com nome, tipo (RG, CPF, IPVA, Contrato), data de validade e arquivo anexado. A dashboard mostra uma view filtrada por "Vence em 30 dias" — você nunca deixa o seguro do carro vencer de novo.

**Viagens**: tabela com destino, data, status (Sonho, Planejando, Confirmado, Realizado), orçamento estimado e links de pesquisa. Na página de Planejamento de Viagens, uma view mostra só as viagens em planejamento ativo; outra mostra o histórico de viagens realizadas.

## O que não vai na tabela

Conteúdo. Notas longas. O arquivo de estudos do curso de Python fica numa página separada — a tabela só guarda o ponteiro pra ela na coluna "Notas". A tabela organiza, não armazena tudo.

Se você começar a colocar texto longo dentro da tabela, vai ficar lento, feio e difícil de navegar. Use a relação como índice, não como repositório.

## Começando sem refazer tudo

Você não precisa migrar seu workspace inteiro hoje. Crie a página DATABASES. Crie a tabela `Estudos` do zero com as colunas acima. Popule ela com o que você está estudando agora.

Aí, na sua página de Estudos atual, delete as tabelas que estavam lá e substitua por linked views da nova tabela centralizada. Quinze minutos de trabalho.

Quando funcionar bem por duas semanas, você vai querer fazer o mesmo pra projetos. Depois pra finanças. O sistema cresce naturalmente — porque ele resolve um problema real cada vez que você expande.

---

A beleza dessa arquitetura é que ela não exige disciplina extra. Você registra um lugar só porque não existe outro. Os dashboards são consequência, não esforço.