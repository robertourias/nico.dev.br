---
title: "O mapa dos testes no frontend: Jest, RTL e Playwright"
slug: "mapa-testes-frontend-jest-rtl-playwright"
date: "2026-07-20"
categories: ["prog"]
status: "published"
featured: false
description: "Onde entra cada ferramenta de teste no fluxo do dev e no pipeline de deploy — e por que misturar as camadas custa caro em manutenção."
tags: ["jest", "testing-library", "playwright", "testes-automatizados", "ci-cd"]
coverImage: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=1200&q=80"
---

Todo projeto frontend acumula as três camadas de teste mais cedo ou mais tarde. O problema não é falta de ferramenta — é usar a ferramenta errada pra pergunta errada. Testar clique de botão com teste de unidade, ou testar regra de negócio pura com Playwright, é caro e frágil dos dois lados.

Jest, Testing Library e Playwright não competem entre si. Cada um responde uma pergunta diferente sobre o mesmo sistema.

## Três perguntas, três ferramentas

Jest pergunta: essa função devolve o valor certo? É unidade pura — sem DOM, sem navegador, roda em milissegundos.

Testing Library pergunta: o componente se comporta do jeito que o usuário espera? Ela roda sobre o Jest (ou Vitest), mas simula DOM e interação.

Playwright pergunta: o sistema inteiro funciona num navegador de verdade, com rede, roteamento e todas as peças integradas? É o mais lento e o mais caro de manter — e o único que pega bug de integração real.

## Jest: a base — lógica e mocks

Jest brilha em lógica isolada: cálculo, formatação, transformação de dados. O ganho de "avançado" aqui é dominar mock e controle de tempo.

```javascript
// desconto.test.js
import { calcularDesconto } from './desconto';
import { buscarRegraDoCliente } from './api/regras';

jest.mock('./api/regras');

test('aplica desconto de fidelidade após 2 anos de cliente', async () => {
  buscarRegraDoCliente.mockResolvedValue({ anosDeCliente: 3, percentual: 0.15 });

  const resultado = await calcularDesconto({ clienteId: '42', valor: 200 });

  expect(resultado).toBe(170);
  expect(buscarRegraDoCliente).toHaveBeenCalledWith('42');
});
```

```javascript
// debounce.test.js
test('só dispara a busca depois de 300ms sem digitar', () => {
  jest.useFakeTimers();
  const buscar = jest.fn();
  const buscarComDebounce = debounce(buscar, 300);

  buscarComDebounce('rea');
  buscarComDebounce('reac');
  buscarComDebounce('react');

  jest.advanceTimersByTime(299);
  expect(buscar).not.toHaveBeenCalled();

  jest.advanceTimersByTime(1);
  expect(buscar).toHaveBeenCalledWith('react');
  expect(buscar).toHaveBeenCalledTimes(1);
});
```

`jest.mock` isola a função da rede, e `useFakeTimers` remove a espera real do teste. Sem isso, testar debounce significaria ou esperar 300ms de verdade a cada rodada, ou não testar o debounce de fato.

## Testing Library: testar como o usuário usa

A regra de ouro do Testing Library é: se o teste acessa `state` interno ou nome de método do componente, ele está testando implementação, não comportamento. A biblioteca força isso ao só expor queries por texto, role e label — o que o usuário realmente vê.

```javascript
// FormularioLogin.test.jsx
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { setupServer } from 'msw/node';
import { rest } from 'msw';
import FormularioLogin from './FormularioLogin';

const server = setupServer(
  rest.post('/api/login', (req, res, ctx) => {
    return res(ctx.status(401), ctx.json({ erro: 'Credenciais inválidas' }));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test('mostra erro do servidor sem travar o formulário', async () => {
  const user = userEvent.setup();
  render(<FormularioLogin />);

  await user.type(screen.getByLabelText(/e-mail/i), 'beto@exemplo.com');
  await user.type(screen.getByLabelText(/senha/i), 'senha-errada');
  await user.click(screen.getByRole('button', { name: /entrar/i }));

  expect(await screen.findByText(/credenciais inválidas/i)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /entrar/i })).toBeEnabled();
});
```

O MSW intercepta a chamada de rede no nível do fetch, então o teste exercita o fluxo completo — clique, requisição, resposta, atualização de tela — sem depender de um backend rodando. `findByText` já embute o `waitFor`, então não precisa de `setTimeout` artificial esperando o estado assíncrono resolver.

## Playwright: o navegador de verdade

Playwright entra quando a pergunta é "isso funciona de ponta a ponta, com o build real, no Chrome, Firefox e Safari?". O exemplo abaixo intercepta rede (pra não depender de dado real em produção) e roda em paralelo por navegador:

```javascript
// checkout.spec.ts
import { test, expect } from '@playwright/test';

test('finaliza compra mesmo com API de frete lenta', async ({ page }) => {
  await page.route('**/api/frete', async (route) => {
    await new Promise((r) => setTimeout(r, 2000));
    route.fulfill({ json: { valor: 15.9, prazo: 5 } });
  });

  await page.goto('/carrinho');
  await page.getByRole('button', { name: 'Calcular frete' }).click();

  await expect(page.getByText('Calculando frete...')).toBeVisible();
  await expect(page.getByText('R$ 15,90')).toBeVisible({ timeout: 5000 });

  await page.getByRole('button', { name: 'Finalizar compra' }).click();
  await expect(page).toHaveURL(/\/pedido\/\d+/);
});
```

```javascript
// playwright.config.ts
export default {
  projects: [
    { name: 'chromium', use: { browserName: 'chromium' } },
    { name: 'webkit', use: { browserName: 'webkit' } },
  ],
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
};
```

`page.route` simula latência real de API sem depender de um ambiente instável. `retries` no CI existe porque teste de navegador tem flakiness inerente — timing de rede, animação, carregamento de fonte. Isso é diferente de teste quebrado: é o custo de testar o sistema real em vez de uma simulação.

## Do commit ao deploy

No dia a dia, o dev roda Jest e Testing Library em modo watch — feedback em segundos, direto no editor. Playwright normalmente não roda local o tempo todo, porque sobe um navegador e uma aplicação inteira; roda antes de abrir PR ou fica só no CI.

No pipeline, a ordem importa porque cada camada é uma barreira mais cara que a anterior:

```yaml
# .github/workflows/ci.yml
jobs:
  unit-and-integration:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npm run test -- --coverage   # Jest + Testing Library

  e2e:
    needs: unit-and-integration
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npm run build
      - run: npx playwright test           # contra o build real

  deploy:
    needs: e2e
    runs-on: ubuntu-latest
    steps:
      - run: npm run deploy
```

`e2e` só roda se `unit-and-integration` passar — não faz sentido subir navegador pra testar um build que já falhou num cálculo básico. E `deploy` só acontece depois do Playwright validar o build real, não um mock local.

Times maduros ainda rodam Playwright contra o ambiente de preview (Vercel, Netlify) em vez de contra `localhost`, porque isso pega problema de variável de ambiente e configuração de build que só aparece fora da máquina do dev. É a diferença entre "passou no CI" e "vai funcionar quando o usuário acessar".

A pirâmide clássica — muita unidade, menos integração, pouquíssimo E2E — não é dogma estético. É consequência direta de custo: um teste Jest roda em 5ms, um Playwright em 5 segundos. Multiplique isso por mil testes e a escolha de camada deixa de ser preferência e vira orçamento de tempo de CI.
