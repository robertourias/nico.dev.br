---
title: "Acessibilidade avançada: WCAG 2.2 e Core Web Vitals"
slug: "acessibilidade-avancada-wcag-core-web-vitals"
date: "2026-07-20"
category: "tech"
status: "published"
featured: false
description: "Como WCAG 2.2 e Core Web Vitals resolvem o mesmo problema por ângulos diferentes — e como integrar os dois no fluxo de dev sem virar checklist de fim de sprint."
tags: ["wcag", "core-web-vitals", "acessibilidade", "performance-web", "inp"]
coverImage: "https://images.unsplash.com/photo-1508921912186-1d1a45ebb3c1?w=1200&q=80"
---

Acessibilidade e performance costumam viver em times diferentes, com métricas diferentes, e isso é um erro de organização. As duas medem a mesma coisa: se a interface responde no tempo e da forma que o usuário real — com o dispositivo, a rede e as capacidades que ele tem — consegue usar. Um botão com INP alto é tão inacessível pra quem usa mouse quanto um botão sem foco visível é pra quem usa teclado.

Esse post cobre o que mudou em WCAG 2.2, os três Core Web Vitals com os limiares atuais, e como colocar os dois num pipeline de CI em vez de depender de auditoria manual antes do deploy.

## WCAG 2.2: os nove critérios novos que interessam

WCAG 2.2 virou recomendação do W3C em outubro de 2023 e chegou a 87 critérios de sucesso, contra 78 da versão 2.1. Removeu um (parsing, que já era coberto por HTML moderno) e adicionou nove. A maioria dos novos critérios ataca exatamente os pontos que times de frontend mais erram na prática: foco visível, área de toque e autenticação.

| Critério | Nível | O que exige na prática |
|---|---|---|
| 2.4.11 Focus Not Obscured (Minimum) | AA | Elemento focado não pode ficar total ou parcialmente escondido atrás de header fixo, banner ou modal |
| 2.4.13 Focus Appearance | AAA | Indicador de foco precisa ter contraste e espessura mínimos, não só uma borda de 1px |
| 2.5.7 Dragging Movements | A | Toda ação de arrastar precisa ter alternativa por clique/toque simples |
| 2.5.8 Target Size (Minimum) | AA | Alvo de toque mínimo de 24×24px CSS, com exceções para texto inline e espaçamento suficiente |
| 3.3.8 Accessible Authentication (Minimum) | AA | Login não pode depender só de teste cognitivo (resolver puzzle, lembrar senha de memória) sem alternativa |

O critério que mais gera retrabalho é o 2.4.11. Header fixo é padrão em praticamente todo produto, e ele frequentemente cobre o primeiro item da lista quando o usuário navega por Tab.

```css
/* Corrige elemento focado escondido atrás de header fixo */
:target,
:focus {
  scroll-margin-top: calc(var(--header-height) + 16px);
}

/* Foco visível de verdade — não apenas outline: none removido */
:focus-visible {
  outline: 3px solid var(--color-focus);
  outline-offset: 2px;
}

/* Target Size: garante 24x24 mesmo em ícones pequenos */
.icon-button {
  min-width: 24px;
  min-height: 24px;
  padding: 10px; /* área de toque real fica maior que o ícone visual */
}
```

`scroll-margin-top` resolve o 2.4.11 sem JavaScript: o navegador já calcula o offset ao rolar até o elemento focado. E `:focus-visible` em vez de `:focus` evita o erro clássico de mostrar o anel de foco em todo clique de mouse — ele só aparece em navegação por teclado, que é quando realmente importa.

## Foco gerenciado em SPA: o exemplo que ninguém testa

Troca de rota em SPA quebra o modelo mental de navegação do leitor de tela, porque o DOM muda mas o foco continua onde estava. A correção manual é simples e quase sempre esquecida:

```javascript
// useFocusOnRouteChange.js
import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

export function useFocusOnRouteChange() {
  const location = useLocation();
  const headingRef = useRef(null);

  useEffect(() => {
    // Move o foco pro heading da nova página e anuncia via leitor de tela
    headingRef.current?.focus();
  }, [location.pathname]);

  return headingRef;
}

// Página
function ProdutoPage() {
  const headingRef = useFocusOnRouteChange();
  return <h1 ref={headingRef} tabIndex={-1}>Detalhes do produto</h1>;
}
```

`tabIndex={-1}` permite focar o `<h1>` programaticamente sem colocá-lo na ordem de Tab. Sem isso, o usuário de leitor de tela continua ouvindo o conteúdo da página anterior até rolar manualmente — na prática, ele nem sabe que a navegação aconteceu.

## Core Web Vitals: os três números e o que cada um mede

Desde março de 2024 o INP (Interaction to Next Paint) substituiu o FID como métrica oficial de responsividade — mudança relevante porque FID só media o atraso do *primeiro* clique, e INP mede a pior interação da visita inteira. Os limiares atuais, avaliados no percentil 75 de visitas reais:

- **LCP (Largest Contentful Paint):** bom até 2,5s, ruim acima de 4s. Mede quando o maior elemento visível termina de renderizar.
- **INP (Interaction to Next Paint):** bom até 200ms, ruim acima de 500ms. Mede o tempo entre a interação do usuário e o próximo frame pintado na tela.
- **CLS (Cumulative Layout Shift):** bom até 0,1, ruim acima de 0,25. Mede o quanto o layout se move sem o usuário pedir.

INP é hoje o vital mais reprovado — a maioria dos sites em produção ainda passa de 200ms em pelo menos uma interação, geralmente por causa de long tasks bloqueando a main thread durante clique ou digitação.

## Otimizando INP: quebrando long tasks de verdade

O erro comum é otimizar só o tempo de carregamento e ignorar o que acontece depois — cliques em filtro, abrir modal, digitar em busca com autocomplete. Se o handler roda uma tarefa síncrona pesada, o navegador não consegue pintar o próximo frame até ela terminar.

```javascript
// Sem otimização: processa 5000 itens e trava a main thread
function aplicarFiltro(itens, termo) {
  return itens
    .filter(item => item.nome.includes(termo))
    .map(item => enriquecerComMetadados(item)); // caro
}

// Com yield: devolve o controle ao navegador entre lotes
async function aplicarFiltroComYield(itens, termo) {
  const resultado = [];
  for (let i = 0; i < itens.length; i++) {
    if (itens[i].nome.includes(termo)) {
      resultado.push(enriquecerComMetadados(itens[i]));
    }
    // a cada 200 itens, cede a vez pro navegador pintar/responder input
    if (i % 200 === 0) {
      await new Promise(resolve => setTimeout(resolve, 0));
    }
  }
  return resultado;
}
```

`setTimeout(resolve, 0)` força o event loop a processar a fila de renderização e input antes de continuar o loop — é a versão que funciona em qualquer navegador hoje. Onde `scheduler.yield()` já está disponível, ele faz o mesmo com prioridade mais correta, mas ainda não tem suporte universal.

## Otimizando LCP e CLS junto com a UX

```html
<!-- LCP: prioriza a imagem principal antes de qualquer outra coisa -->
<link rel="preload" as="image" href="/hero.webp" fetchpriority="high" />
<img src="/hero.webp" alt="Painel do produto mostrando o dashboard principal" fetchpriority="high" />

<!-- CLS: reserva o espaço antes da imagem carregar -->
<img
  src="/thumb.webp"
  alt="Miniatura do artigo"
  width="400"
  height="225"
  style="aspect-ratio: 16/9;"
  loading="lazy"
/>
```

O `alt` descritivo não é só requisito de WCAG 1.1.1 — ele também é o que aparece enquanto a imagem carrega ou falha, então uma imagem sem `alt` bom prejudica tanto o leitor de tela quanto a experiência de carregamento lento. `width`/`height` (ou `aspect-ratio`) evitam que o layout pule quando a imagem chega, que é a causa mais comum de CLS alto em páginas de conteúdo.

## Fluxo de trabalho: dos dois lados no mesmo CI

Auditoria manual não escala. O ganho real vem de rodar os dois checks automaticamente, antes do merge:

```yaml
# .github/workflows/quality.yml
jobs:
  accessibility-and-performance:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npm run build

      - name: Testes de acessibilidade com axe
        run: npx playwright test a11y.spec.ts

      - name: Lighthouse CI com orçamento de performance
        uses: treosh/lighthouse-ci-action@v11
        with:
          urls: |
            http://localhost:3000/
            http://localhost:3000/produto
          budgetPath: ./lighthouse-budget.json
          uploadArtifacts: true
```

```javascript
// a11y.spec.ts — Playwright + axe-core, direto no fluxo de E2E existente
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('página de produto não tem violações WCAG 2.2 AA', async ({ page }) => {
  await page.goto('/produto');

  const resultados = await new AxeBuilder({ page })
    .withTags(['wcag22aa'])
    .analyze();

  expect(resultados.violations).toEqual([]);
});
```

Isso transforma acessibilidade e performance em barreira de build, igual teste unitário quebrado — não em item de checklist que alguém preenche de memória na sexta-feira antes do release. Em produção, complementa com a biblioteca `web-vitals` mandando dados reais (não sintéticos) pro seu analytics, porque o Lighthouse roda em ambiente controlado e não pega a rede 3G do usuário real no interior.

```javascript
import { onLCP, onINP, onCLS } from 'web-vitals';

onLCP(metric => enviarParaAnalytics('LCP', metric.value));
onINP(metric => enviarParaAnalytics('INP', metric.value));
onCLS(metric => enviarParaAnalytics('CLS', metric.value));
```

## O ponto em comum

WCAG e Core Web Vitals nasceram de comunidades diferentes com vocabulário diferente, mas resolvem o mesmo problema visto de dois ângulos: será que a interface funciona pra quem não tem as condições ideais — o dispositivo mais rápido, a conexão mais estável, a visão mais aguçada, o controle motor mais preciso? Otimizar INP quebrando long tasks ajuda o usuário com CPU fraca e ajuda quem usa switch device pra navegar. Focus visível ajuda quem usa teclado e ajuda quem está numa reunião olhando de relance pra tela.

Tratar os dois como times, métricas e sprints separados garante que cada um otimize só a própria métrica — e que a experiência real, que é a soma dos dois, continue quebrada nas bordas onde ninguém está olhando.
