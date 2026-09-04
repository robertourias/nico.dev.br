---
title: "TypeScript: truques que uso todo dia"
slug: "typescript-truques-que-uso-sempre"
date: "2026-05-10"
categories: ["prog"]
status: "published"
featured: false
description: "Padrões de TypeScript que parecem avançados mas simplificam o código na prática."
tags: ["typescript", "frontend", "boas-praticas"]
---

TypeScript tem uma curva de aprendizado, mas alguns padrões valem ouro uma vez que você os absorve.

## Discriminated unions para estados

Em vez de múltiplos booleans (`isLoading`, `isError`, `isSuccess`), use uma union discriminada:

```ts
type RequestState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: string };
```

O TypeScript vai te obrigar a tratar cada caso no switch. Sem bugs de estado impossível.

## Satisfies em vez de as

```ts
const config = {
  timeout: 3000,
  retries: 3,
} satisfies Partial<Config>;
```

`satisfies` valida o tipo sem perder a inferência precisa dos valores. `as` é silêncio forçado; `satisfies` é validação real.

## Template literal types

```ts
type EventName = `on${Capitalize<string>}`;
// onCLick, onChange, onSubmit...
```

Útil para sistemas de eventos, chaves de i18n, nomes de rotas.

## Takeaway

TypeScript não é sobre escrever mais — é sobre deixar o compilador trabalhar por você.
