---
title: "Feature flags no frontend e mobile: passo a passo"
slug: "feature-flags-frontend-mobile-passo-a-passo"
date: "2026-10-09"
categories: ["dev", "architecture"]
status: "published"
featured: false
description: "Como usar feature flags no frontend e no mobile: tipos, rollout gradual, kill switch e um passo a passo com React e OpenFeature."
tags: ["feature-flags", "openfeature", "react", "mobile", "rollout-gradual"]
---

Você terminou o novo fluxo de checkout. Está testado, revisado e pronto. Publicar para todos de uma vez é arriscado; segurar o merge por duas semanas até "ter certeza" trava o resto do time. Num app mobile, o risco é maior: depois que a versão chega à loja, você não consegue desfazer o deploy, porque cada usuário atualiza quando quer.

**Feature flags** (também chamadas de feature toggles) resolvem os dois problemas. Elas separam o **deploy** do código da **liberação** da funcionalidade: o código novo vai para produção desligado, e você o liga depois, para quem quiser, sem publicar nada.

Este post explica os tipos de flag, o que muda entre web e mobile, e monta um exemplo passo a passo com React e OpenFeature, um padrão aberto para avaliar flags independentemente do fornecedor.

## O que é uma feature flag

Uma flag é, na essência, um `if` cujo valor vem de fora do código:

```tsx
return checkoutNovo ? <CheckoutNovo /> : <CheckoutAtual />;
```

O valor de `checkoutNovo` não está no código. Ele é decidido por uma configuração que você altera sem novo deploy, e pode variar por usuário, plano, país ou versão do app. Isso é o que torna possíveis o rollout gradual, o teste A/B e o desligamento de emergência.

Nem toda flag serve ao mesmo propósito, e misturar os usos leva a flags que nunca morrem. Uma classificação comum, descrita por Pete Hodgson no artigo "Feature Toggles", separa quatro tipos:

- **Release**: esconde uma funcionalidade inacabada ou em liberação gradual. Vive dias ou semanas e deve ser removida depois.
- **Experimento**: divide usuários em grupos para comparar versões. Vive o tempo do teste.
- **Operacional** (kill switch): desliga uma funcionalidade que está causando problema. Pode viver bastante, porque é um controle de emergência.
- **Permissão**: libera algo para um grupo, como um plano pago ou um beta fechado. Tende a ser de longa duração.

O exemplo deste post é uma flag de release, o caso mais comum.

## O que muda entre web e mobile

A lógica é a mesma, mas as restrições diferem, e elas definem como você usa a flag.

Na **web**, uma correção vai ao ar no próximo carregamento da página. A flag é útil para liberar aos poucos, mas, se algo der errado, o deploy de correção é rápido.

No **mobile**, o código que está no aparelho só muda quando o usuário atualiza o app, e existem várias versões em circulação ao mesmo tempo. A flag vira a principal alavanca de controle depois da publicação, o jeito de desligar uma funcionalidade defeituosa sem esperar a loja aprovar e o usuário atualizar. Isso traz três cuidados:

1. **Versão no contexto.** Uma flag nunca deve ligar um recurso numa versão do app que ainda não tem o código. Envie a versão do app na avaliação e use-a nas regras.
2. **Valor padrão para quando não há rede.** O app abre sem conexão ou com o provedor de flags fora do ar. O valor padrão no código precisa ser o comportamento antigo e seguro.
3. **Consistência durante a sessão.** Mudar o valor de uma flag no meio de um fluxo pode confundir o usuário. Avalie no início da sessão ou da tela, não a cada renderização.

Um aviso que vale para os dois: flag no cliente **não é segurança**. O valor chega ao aparelho, e quem inspeciona a rede pode ler e até alterar. Para controle de acesso de verdade, valide no servidor.

![Ciclo de vida de uma feature flag: criar desligada, publicar o código atrás da flag, liberar aos poucos, consolidar em 100% e remover a flag e o caminho antigo; o kill switch volta a liberação a 0% sem novo deploy](/images/feature-flags-frontend-mobile-passo-a-passo-ciclo.svg)

O diagrama mostra o ciclo completo. Os passos 1 a 4 costumam receber atenção; o 5, a remoção, é o que mais se esquece.

## Passo a passo com React e OpenFeature

O **OpenFeature** é uma especificação aberta com uma API única para avaliar flags, que evita o acoplamento do código a um fornecedor específico. Você escreve contra a API do OpenFeature e pluga um **provider**, a peça que de fato busca os valores. Trocar de fornecedor depois significa trocar o provider, não reescrever os componentes.

### Passo 1: instalar o SDK

```shell
npm install --save @openfeature/react-sdk
```

### Passo 2: configurar o provider

Comece com o provider em memória, que mantém as flags num objeto no código. Ele serve para desenvolver e testar sem depender de serviço externo. Registre o provider **uma vez**, fora de qualquer componente:

```tsx
import {
  EvaluationContext,
  OpenFeature,
  TypedInMemoryProvider,
} from '@openfeature/react-sdk';

const flags = {
  'checkout-novo': {
    disabled: false,
    variants: { on: true, off: false },
    defaultVariant: 'off',
    contextEvaluator: (contexto: EvaluationContext) =>
      contexto.plano === 'pro' ? 'on' : 'off',
  },
} as const;

OpenFeature.setProvider(new TypedInMemoryProvider(flags));
```

A flag `checkout-novo` tem duas variantes e, pela regra do `contextEvaluator`, fica ligada só para usuários do plano `pro`. É um primeiro grupo de liberação.

### Passo 3: envolver o app com o OpenFeatureProvider

O `OpenFeatureProvider` define o escopo em que as avaliações acontecem e liga os hooks do SDK a um client:

```tsx
import { OpenFeatureProvider } from '@openfeature/react-sdk';

export function App() {
  return (
    <OpenFeatureProvider>
      <Checkout />
    </OpenFeatureProvider>
  );
}
```

Não é preciso esperar a inicialização do provider: o SDK cuida do novo render quando os valores chegam.

### Passo 4: usar a flag no componente

O hook `useFlag` recebe a chave da flag e um valor padrão. O padrão é o comportamento antigo, que vale quando a flag não existe ou o provider falha:

```tsx
import { useFlag } from '@openfeature/react-sdk';

export function Checkout() {
  const { value: checkoutNovo } = useFlag('checkout-novo', false);

  return checkoutNovo ? <CheckoutNovo /> : <CheckoutAtual />;
}
```

Mantenha o `if` num ponto só, perto da entrada da funcionalidade. Flags espalhadas por dez componentes viram um problema na hora de remover.

### Passo 5: informar o contexto do usuário

Para a regra por plano funcionar, o SDK precisa saber quem é o usuário. Isso é o **contexto de avaliação**: um conjunto de atributos, com uma chave de segmentação (`targetingKey`) que identifica o usuário de forma estável:

```tsx
await OpenFeature.setContext({
  targetingKey: usuario.id,
  plano: usuario.plano,
  appVersion: '3.2.0',
});
```

Chame isso quando o usuário fizer login e ao trocar de conta. O `targetingKey` é o que permite um rollout percentual coerente: o mesmo usuário cai sempre no mesmo grupo, em vez de ver a funcionalidade aparecer e sumir.

### Passo 6: testar os dois caminhos

Uma flag dobra o número de caminhos do código, então os dois precisam de teste. O SDK traz o `OpenFeatureTestProvider`, que recebe um provider simples escrito por você:

```tsx
import { OpenFeatureTestProvider } from '@openfeature/react-sdk';
import type { Provider, ResolutionDetails } from '@openfeature/react-sdk';

class ProviderLigado implements Partial<Provider> {
  resolveBooleanEvaluation(): ResolutionDetails<boolean> {
    return { value: true, variant: 'on', reason: 'TESTE' };
  }
}

render(
  <OpenFeatureTestProvider provider={new ProviderLigado()}>
    <Checkout />
  </OpenFeatureTestProvider>,
);
```

Escreva um teste com o provider ligado e outro com ele desligado (`value: false`), conferindo qual checkout aparece. Para a organização dos testes de frontend, veja o [mapa de testes com Jest, RTL e Playwright](/posts/mapa-testes-frontend-jest-rtl-playwright).

### Passo 7: trocar para um provider de verdade

Com o provider em memória, a mudança de uma flag exige novo deploy, o que anula o objetivo. O passo final é substituir a linha do `setProvider` pelo provider de um serviço de flags que permita alterar regras sem publicar. Os componentes dos passos 3 e 4 não mudam.

É nesse serviço que você configura o rollout gradual (um percentual de usuários, ampliado aos poucos), as regras por atributo e o kill switch. A lista de providers disponíveis está na documentação do OpenFeature.

## E no mobile

O conceito se mantém: um client, um contexto de avaliação, um provider. O OpenFeature publica SDKs para plataformas nativas, como o Swift para iOS, e a lista completa está na documentação. No Swift, o contexto com o usuário e o produto fica assim:

```swift
let ctx = ImmutableContext(
    targetingKey: userId,
    structure: ImmutableStructure(attributes: ["product": Value.string(productId)]))
OpenFeatureAPI.shared.setEvaluationContext(evaluationContext: ctx)
```

Para apps em React Native, o raciocínio dos passos acima se aplica ao lado JavaScript, mas confirme na documentação do SDK a compatibilidade da versão que você vai usar. Em qualquer plataforma, mantenha os três cuidados da seção anterior: versão no contexto, valor padrão seguro e avaliação estável durante a sessão.

## Remover a flag

Terminado o rollout e estável em 100%, apague a flag, o `if` e o caminho antigo, e remova a chave do serviço. Uma flag esquecida continua cobrando: dobra os caminhos que você testa e deixa código morto que ninguém tem coragem de apagar.

Uma prática simples ajuda: ao criar a flag de release, crie junto a tarefa de removê-la, com uma data. Para as flags operacionais (kill switch), o raciocínio é inverso: elas ficam, mas devem ser testadas de vez em quando, porque um controle de emergência que nunca foi exercitado pode não funcionar na emergência. Sobre esse papel de proteção, veja também os [padrões defensivos de engenharia de software](/posts/padroes-defensivos-engenharia-de-software).

## O que fica

Feature flag muda a pergunta de "posso publicar isto?" para "posso publicar isto desligado e ligar quando eu estiver pronto?". No mobile, onde o deploy é irreversível, essa mudança vale ainda mais.

Para começar, escolha uma funcionalidade de risco moderado, crie uma flag de release com valor padrão seguro, envolva um único ponto de entrada e marque no calendário o dia de removê-la. Se o ciclo inteiro funcionar uma vez, você terá o hábito, e o provider pode ser trocado quando o time precisar de mais.

## Referências

- Pete Hodgson. [Feature Toggles (aka Feature Flags)](https://martinfowler.com/articles/feature-toggles.html), martinfowler.com.
- OpenFeature. [Documentação oficial](https://openfeature.dev/docs/reference/intro), especificação e SDKs.
- OpenFeature. [React SDK](https://openfeature.dev/docs/reference/sdks/client/web/react), documentação do SDK para React.
- OpenFeature. [SDK para Swift](https://openfeature.dev/docs/reference/sdks/client/swift), documentação do SDK para iOS.
