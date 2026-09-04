---
title: "8 padrões de código que separam sênior de júnior"
slug: "padroes-codigo-senior-junior"
date: "2026-06-24"
categories: ["prog"]
status: "published"
featured: false
description: "Oito hábitos de código simples que fazem a diferença entre um sistema que sobrevive a mudança de requisito e um que quebra a cada deploy."
tags: ["codigo-limpo", "boas-praticas", "refatoracao", "engenharia-de-software"]
coverImage: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&q=80"
---

A maioria dos desenvolvedores não melhora porque aprende mais sintaxe. Melhora porque para de tornar o código mais difícil do que precisa ser.

Dev júnior costuma achar que sênior conhece truque que ele não conhece. Na prática, sênior só cria menos problema pra próxima pessoa que vai ler aquele código — que muitas vezes é ele mesmo, seis meses depois, sem nenhuma memória do que estava pensando.

Reuni 8 padrões que aparecem o tempo todo em código de quem já carregou sistema em produção, rollback de madrugada e migração de banco pela metade. Nenhum é exclusivo de uma linguagem ou framework. São decisões de julgamento, não sintaxe.

## 1. Guard clause no lugar de if aninhado

Código júnior tende a empilhar condição dentro de condição até a lógica principal ficar enterrada no meio do método. Sênior resolve as exceções primeiro e sai logo:

```javascript
// Antes
function processarPedido(pedido) {
  if (pedido) {
    if (pedido.itens.length > 0) {
      if (pedido.pagamentoConfirmado) {
        // lógica principal, lá no fundo
      }
    }
  }
}

// Depois
function processarPedido(pedido) {
  if (!pedido) return;
  if (pedido.itens.length === 0) return;
  if (!pedido.pagamentoConfirmado) return;

  // lógica principal, no nível zero de indentação
}
```

O ganho não é estético. É que quem lê não precisa carregar três condições na cabeça pra entender o que o código realmente faz.

## 2. Uma função, uma responsabilidade

Se você precisa escrever "e" pra descrever o que uma função faz — "valida o usuário **e** salva no banco **e** envia o e-mail" — ela faz coisa demais.

Função grande não é sobre número de linhas. É sobre quantos motivos diferentes ela tem para mudar. Separar `validarUsuario`, `salvarUsuario` e `enviarEmailDeBoasVindas` deixa cada uma testável isoladamente e o bug fica óbvio: ele está numa das três, não numa mistura das três.

## 3. Nome bom substitui comentário

```javascript
// ruim
const d = calcularValor(p, t); // d = desconto

// bom
const descontoAplicado = calcularDesconto(preco, tipoCliente);
```

Comentário explica o que o código *deveria* fazer. Nome bom mostra o que ele *faz*. E comentário fica defasado — ninguém atualiza comentário quando muda uma linha de lógica. O nome da variável muda junto, porque é o próprio código.

## 4. Código óbvio é melhor que código inteligente

Aquele one-liner com três operadores ternários encadeados impressiona por cinco segundos e custa cinco minutos pra quem vai debugar isso em produção, sob pressão, às 23h.

Sênior escreve a versão chata de propósito. Mais linhas, mas cada uma se explica sozinha. Performance raramente é o problema real — legibilidade sob estresse é.

## 5. Falhe rápido, falhe explícito

```javascript
function criarUsuario(dados) {
  if (!dados.email) {
    throw new Error("email é obrigatório para criar usuário");
  }
  // resto da função assume que dados.email existe
}
```

Validar na entrada e lançar erro com mensagem específica evita que um dado inválido percorra cinco camadas da aplicação até estourar um erro genérico em algum lugar sem relação nenhuma com a causa real. Cada minuto economizado na validação custa uma hora de investigação depois.

## 6. Não abstraia antes da hora

A abstração elegante que parece "preparar o código pro futuro" geralmente prepara o código pra um futuro que nunca chega — e no caminho, deixa o presente mais difícil de entender.

A regra prática: duplicar uma lógica duas vezes é aceitável. Na terceira repetição, aí sim vale extrair. Abstrair com base numa única ocorrência é apostar que você já sabe qual vai ser a variação — e raramente sabe.

## 7. Uma fonte de verdade

Bug clássico: o mesmo dado guardado em dois lugares (estado local e store global, cache e banco, variável e prop) que dessincronizam silenciosamente. Cada cópia é um lugar a mais onde a verdade pode divergir.

Sênior resolve isso mantendo o dado num único lugar e derivando o resto a partir dele — em vez de manter duas variáveis em sincronia manual, calcula uma a partir da outra sempre que precisa.

## 8. Separe o caminho feliz dos casos de erro

Misturar a lógica principal com tratamento de erro no mesmo bloco torna os dois mais difíceis de ler. A técnica do guard clause (padrão 1) já ajuda aqui, mas vale como princípio à parte: trate erro, log e fallback nas bordas da função, e deixe o miolo só com a lógica de negócio.

Quem lê a função de cima a baixo enxerga primeiro o que ela faz de fato — não o que pode dar errado no meio do caminho.

---

Nenhum desses padrões exige framework novo, biblioteca nova ou curso avançado. Exige reler o próprio código pensando em quem vai herdar ele — e sendo honesto sobre se essa pessoa vai entender em trinta segundos ou em trinta minutos.
