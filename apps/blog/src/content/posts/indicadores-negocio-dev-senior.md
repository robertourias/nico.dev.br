---
title: "Indicadores de negócio que todo dev sênior deveria entender"
slug: "indicadores-negocio-dev-senior"
date: "2026-07-20"
categories: ["business"]
status: "published"
featured: false
description: "CAC, LTV, churn, MRR: um guia rápido dos indicadores que movem uma empresa — e por que entender negócio (e gente) separa o dev sênior do dev só tecnicamente bom."
tags: ["carreira-dev", "kpis", "soft-skills", "senior", "comunicacao"]
coverImage: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&q=80"
---

Peguei uma tabela de indicadores de negócio outro dia e percebi que sabia explicar bem uns três. Os outros eu reconhecia de reunião, mas não saberia dizer com precisão o que significam nem por que alguém do financeiro liga tanto pra eles.

Isso é comum entre devs. A gente domina complexidade de algoritmo, trade-off de arquitetura, latência de banco — e trata "métrica de negócio" como assunto de outro departamento. Só que toda linha de código que você escreve mexe em algum desses números, quer você acompanhe ou não.

Aqui vai o mapa completo, com o porquê de cada um importar pra quem programa.

| Indicador | O que mede | Por que importa pra um dev |
|---|---|---|
| Receita (Revenue) | Quanto a empresa vende | Toda funcionalidade deveria impactar receita direta ou indiretamente |
| Lucro (Profit) | Receita − custos | Código eficiente reduz custos |
| Margem Bruta | % da receita que sobra após custos diretos | Ajuda a entender sustentabilidade |
| EBITDA | Resultado operacional | Muito usado por investidores |
| CAC | Custo para adquirir um cliente | Um bug no onboarding pode aumentar muito esse custo |
| LTV | Valor que um cliente gera durante toda sua vida | Produtos melhores aumentam retenção |
| LTV/CAC | Retorno sobre aquisição | Empresas SaaS buscam > 3 |
| Churn | Clientes perdidos | Talvez o KPI mais importante para SaaS |
| Retenção | Clientes que permanecem | Melhor indicador de qualidade do produto |
| NPS | Satisfação dos clientes | Reflete experiência do usuário |
| MRR / ARR | Receita recorrente mensal/anual | Base de avaliação de empresas SaaS |
| Conversão | % que completa uma ação | Login, compra, cadastro etc. |
| ARPU | Receita média por usuário | Ajuda a avaliar monetização |
| Ticket Médio | Valor médio das compras | Importante para e-commerce |
| ROI | Retorno sobre investimento | Justifica projetos |

## O fio que conecta todos eles

Não precisa decorar fórmula. Precisa entender a cadeia de causa e efeito.

Um formulário de cadastro confuso aumenta o CAC, porque mais gente desiste antes de virar cliente pago — o marketing gastou o mesmo tanto pra atrair menos gente que converte. Uma tela de checkout lenta derruba a conversão. Um bug recorrente que ninguém prioriza porque "não é crítico" alimenta o churn mês após mês, e churn alto é o jeito mais silencioso de matar uma empresa SaaS, porque a receita nova nunca alcança a que está vazando.

LTV/CAC é onde tudo isso converge: se custa mais pra adquirir um cliente do que ele vai gerar de valor, a empresa está literalmente pagando pra existir. E o produto — a parte que você constrói — é a alavanca mais direta que existe pra melhorar esse número, seja reduzindo atrito na aquisição, seja aumentando retenção.

## Por que isso deveria importar pra você, especificamente

Dev júnior otimiza para "o código funciona". Dev sênior otimiza para "o código resolve o problema certo, do jeito certo, no momento certo" — e essa priorização exige saber o que move a agulha do negócio.

Isso não é sobre virar gestor. É sobre argumento. Quando você propõe refatorar um módulo, "o código está feio" convence pouca gente com orçamento. "Esse módulo tem X bugs por trimestre que impactam retenção" convence. Quando você discute prioridade de sprint, entender que aquela feature de onboarding mexe direto em CAC muda a conversa de "gosto/não gosto" para "isso vale dinheiro real".

E o raciocínio vale pra qualquer setor além de tecnologia. Entender como uma clínica pensa margem, como um e-commerce pensa ticket médio, como uma fintech pensa churn regulatório — isso é o que permite construir sistema que serve o negócio, não só o requisito escrito no ticket. Requisito mal escrito é regra; entendimento de negócio é contexto. E contexto é o que falta na maioria dos bugs de produto que tecnicamente "funcionam conforme especificado".

## O outro lado que ninguém ensina: influenciar gente

Saber os números não adianta se você não consegue fazer alguém agir a partir deles. E aí entra uma parte que engenharia raramente ensina: como conversar, convencer e construir relação com quem não é dev.

"Como Fazer Amigos e Influenciar Pessoas", de Dale Carnegie, é datado — foi escrito nos anos 1930 — mas o núcleo dele envelheceu bem melhor que a maioria dos livros de gestão modernos. Um dos princípios centrais resume o problema de quem só chega numa reunião com dados técnicos:

> "A única forma existente na Terra para influenciar uma pessoa é falar sobre o que ela quer e mostrar a ela como realizar o seu intento."

Isso é exatamente a diferença entre "refatorei o serviço de pagamento" e "reduzi o tempo de checkout, o que deve puxar a conversão pra cima". Mesmo trabalho, discurso adaptado pra quem está do outro lado da mesa.

Carnegie cita o filósofo John Dewey pra reforçar outro ponto que todo dev que já discutiu arquitetura em reunião deveria gravar:

> "A mais profunda necessidade da natureza humana é o desejo de ser importante."

PM, designer, stakeholder de negócio — todo mundo numa reunião técnica quer sentir que a opinião dele teve peso, mesmo quando a decisão final é técnica. Ignorar isso é o motivo de tanto dev tecnicamente certo perder a discussão, ou pior, ganhar a discussão e perder a confiança do time pra próxima vez.

E tem uma ressalva do próprio autor que vale mais que qualquer técnica do livro:

> "Os princípios ensinados neste livro só funcionam quando são de coração. Não estou defendendo um conjunto de truques."

Isso separa influência genuína de manipulação. Não é sobre aprender frase pronta pra convencer alguém de algo que você não acredita — é sobre se importar de verdade com o que a outra pessoa precisa, e comunicar sua solução técnica nesses termos.

Sênior de verdade não é quem sabe mais sintaxe nem quem decora mais KPI. É quem consegue transitar entre o código, o número que aquele código move, e a pessoa que precisa entender por que isso importa. As três coisas juntas — não uma delas isolada — são o que faz alguém confiável o suficiente pra decidir coisa grande.
