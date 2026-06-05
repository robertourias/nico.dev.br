# Spec: Conversor de Moedas (tools.nico.dev)

**Status:** approved
**Data:** 2026-06-05
**Autor:** planner

---

## Problema

O tools.nico.dev ainda não tem ferramenta financeira. Usuários que precisam converter moedas ou acompanhar câmbio precisam sair do site para outros serviços. Uma ferramenta de conversão de moedas integrada agrega valor imediato à coleção de tools, atinge tanto devs quanto usuários comuns e demonstra integração com APIs externas de forma limpa.

---

## Cenários de Usuário

- **P1 (crítico):** Como usuário, quero selecionar um par de moedas (ex: BRL → USD), digitar um valor e ver o resultado convertido em tempo real, para tomar decisões financeiras rápidas.
- **P1 (crítico):** Como usuário, quero ver uma tabela com a cotação atual das principais moedas fiat e criptomoedas em BRL, para ter uma visão geral do mercado sem precisar acessar múltiplos sites.
- **P2 (importante):** Como usuário, quero ver um gráfico com a variação histórica da taxa de câmbio do par selecionado nos últimos 12 meses, para entender a tendência do câmbio.
- **P3 (nice-to-have):** Como usuário, quero inverter o par com um clique (ex: BRL → USD vira USD → BRL), para converter nos dois sentidos sem reselecionar.

---

## Requisitos Funcionais

### Conversor
- **FR-001:** Seletor de moeda origem com as moedas fiat suportadas (USD, EUR, BRL, JPY, GBP) + criptos (BTC, ETH, BNB, SOL, XRP, USDT). CRC removido — não suportado no Frankfurter.
- **FR-002:** Seletor de moeda destino com as mesmas opções.
- **FR-003:** Campo de entrada numérico para o valor a converter.
- **FR-004:** Resultado da conversão exibido em tempo real (ao digitar ou ao mudar o par).
- **FR-005:** Botão/ícone para inverter o par (swap origem ↔ destino).
- **FR-006:** Exibir a taxa de câmbio atual do par (ex: "1 BRL = 0.1923 USD").

### Gráfico histórico
- **FR-007:** Gráfico de linha com a taxa de câmbio diária do par selecionado nos últimos 12 meses.
- **FR-008:** O gráfico atualiza automaticamente ao mudar o par selecionado no conversor.
- **FR-009:** Tooltip ao passar o mouse mostrando data e taxa do dia.
- **FR-010:** Dados fiat: Frankfurter API (`/api/{start_date}..{end_date}?from={base}&to={target}`). Dados cripto: CoinGecko API (`/coins/{id}/market_chart?vs_currency={target}&days=365`).

### Tabela de cotações
- **FR-011:** Tabela com cotação atual de USD, EUR, BRL, JPY, GBP, BTC, ETH, BNB, SOL, XRP, USDT — todas em BRL. (CRC removido — não suportado no Frankfurter.)
- **FR-012:** Colunas: Moeda (símbolo + nome), Valor em BRL, Variação 24h (%).
- **FR-013:** Variação 24h positiva em verde, negativa em vermelho.
- **FR-014:** Dados fiat via Frankfurter; dados cripto via CoinGecko (`/simple/price?ids=...&vs_currencies=brl&include_24hr_change=true`).

### Cache e performance
- **FR-015:** Cotações da tabela e taxa atual do conversor: cache de 5 minutos via `fetch` com `revalidate: 300` (Next.js Route Handler ou Server Component).
- **FR-016:** Dados históricos do gráfico: cache de 1 hora (`revalidate: 3600`).

---

## Critérios de Sucesso

- [ ] Usuário seleciona par, digita valor e vê resultado convertido sem recarregar a página.
- [ ] Gráfico renderiza os últimos 12 meses do par selecionado e atualiza ao trocar o par.
- [ ] Tabela exibe as 12 moedas com valor em BRL e variação 24h.
- [ ] Erros de API (timeout, rate limit) são tratados com mensagem amigável — sem quebrar a UI.
- [ ] Nenhuma chave de API necessária (Frankfurter é open, CoinGecko free tier sem auth).
- [ ] Ferramenta acessível via tools.nico.dev/conversor-moedas (ou rota definida pelo dev).

---

## Fora do Escopo

- Conversão de múltiplas moedas destino simultaneamente (só par a par).
- Alertas de câmbio ou notificações push.
- Histórico de conversões do usuário (sem auth, sem banco).
- Suporte a mais criptomoedas além das 6 listadas.
- Moeda base da tabela configurável pelo usuário (fixo em BRL).

---

## Riscos e Premissas

- **Premissa:** Frankfurter cobre todas as moedas fiat listadas (USD, EUR, BRL, JPY, GBP, CRC). CRC (Costa Rican Colón) precisa ser validado na API antes da implementação.
- **Premissa:** CoinGecko free tier suporta as chamadas necessárias sem API key nas requests do servidor.
- **Risco:** CoinGecko rate limit no free tier (30 req/min) pode ser atingido se o cache falhar → Mitigação: cache server-side obrigatório, nunca chamar a API diretamente do cliente.
- **Risco:** Par cripto/fiat (ex: BTC → BRL) precisa de lógica de roteamento — Frankfurter não cobre cripto → Mitigação: detectar se origem ou destino é cripto e rotear para CoinGecko.
- **Risco:** Dados históricos de pares mistos (fiat ↔ cripto) requerem conversão intermediária → Mitigação: usar BRL ou USD como pivot se necessário.

---

<!-- 
GATE DE APROVAÇÃO
Para desbloquear a criação do plano técnico, altere o Status acima de "draft" para "approved".
O agente planner NÃO deve criar tasks de implementação enquanto Status for "draft".
-->
