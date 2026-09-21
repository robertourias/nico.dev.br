---
title: "Estado no React: useState, Context, Zustand, Redux e Query"
slug: "estado-react-usestate-context-zustand-redux-query"
date: "2026-09-20"
categories: ["dev", "architecture"]
status: "published"
featured: false
description: "useState, Context API, Zustand, Redux e TanStack Query não competem entre si: resolvem tipos diferentes de estado. Diferenças, quando usar cada um e um exemplo com Redux Toolkit em uma tela complexa."
tags: ["react", "redux-toolkit", "zustand", "tanstack-query", "gerenciamento-de-estado"]
coverImage: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=1200&q=80"
---

A pergunta "qual biblioteca de estado eu uso?" já nasce torta. Ela trata `useState`, Context, Zustand, Redux e TanStack Query como concorrentes, e eles não são. Cada um resolve um tipo diferente de estado.

O erro clássico é escolher a ferramenta antes de classificar o estado. Quando você classifica primeiro, metade das opções some sozinha.

## Antes da ferramenta: que tipo de estado é esse?

Quase todo estado de uma aplicação React cai em uma destas categorias:

- **Local:** só um componente (ou meia dúzia perto dele) precisa. Ex: um input, um modal aberto ou fechado.
- **Compartilhado de cliente:** vários pontos distantes da árvore precisam, e o dado nasce no front. Ex: filtros de uma tela, seleção de itens, tema, rascunho de formulário.
- **De servidor:** o dado mora no backend. O front guarda uma cópia que pode ficar velha. Ex: lista de pedidos, perfil do usuário.

A terceira categoria é a que mais gente confunde com a segunda. Estado de servidor tem problemas próprios: cache, revalidação, loading, erro, deduplicação de requisições. Se você o trata como estado de cliente, acaba reescrevendo tudo isso à mão.

![Árvore de decisão: dado do servidor vai para TanStack Query; local para useState; valor que muda pouco para Context API; estado compartilhado que muda muito vai para Redux Toolkit se precisar de padrão rígido, DevTools e time grande, senão Zustand](/images/estado-react-usestate-context-zustand-redux-query-decisao.svg)

Esse fluxo é uma heurística minha, não uma regra. Serve pra começar a conversa, não pra terminá-la.

## Os cinco, um por um

### useState (e useReducer)

É o estado local do React, sem instalar nada. Deve ser o padrão: se dá pra resolver aqui, resolva aqui.

O limite aparece quando você começa a passar o mesmo estado por muitos níveis de props (prop drilling) e os componentes no meio nem usam o dado. Antes de correr pra uma biblioteca, vale tentar subir o estado pro ancestral comum ou reorganizar a composição dos componentes. Muitas vezes o problema some.

`useReducer` é o mesmo mecanismo com transições de estado explícitas. Ajuda quando um estado local tem várias ações relacionadas.

### Context API

Context não é uma ferramenta de gerenciamento de estado. É um mecanismo de **transporte**: leva um valor de um ponto da árvore pra qualquer descendente sem passar por props.

A consequência que importa: quando o valor do Provider muda, todos os componentes que consomem aquele Context re-renderizam. O Context não tem seletor pra dizer "só me avise se este campo mudou". Por isso ele funciona bem pra dado que muda raramente (tema, idioma, usuário autenticado, instância de um serviço) e mal pra estado que muda o tempo todo.

Dá pra mitigar dividindo em vários Contexts pequenos, mas o custo de manter isso organizado cresce rápido.

### Zustand

Uma biblioteca pequena de store global. Você cria a store com `create`, consome com um hook e não precisa de Provider. Os componentes assinam só o pedaço que selecionam, então mudanças em outros campos não os re-renderizam.

```ts
import { create } from 'zustand'

interface BearState {
  bears: number
  increase: (by: number) => void
}

const useBearStore = create<BearState>()((set) => ({
  bears: 0,
  increase: (by) => set((state) => ({ bears: state.bears + by })),
}))
```

O ponto forte é a baixa cerimônia: pouca configuração e pouca estrutura imposta. O ponto de atenção é justamente esse: numa base grande com muita gente, "pouca estrutura imposta" significa que o padrão é o que o time combinar, não o que a biblioteca obriga.

### Redux (Redux Toolkit)

Hoje, quando se fala em Redux, o correto é falar em **Redux Toolkit** (RTK), o conjunto oficial recomendado. Ele elimina boa parte do boilerplate antigo.

A ideia central continua a mesma: um store único, estado só muda por ações despachadas, e reducers que descrevem como cada ação altera o estado. Essa rigidez é o que dá previsibilidade, ferramentas de depuração (DevTools com histórico de ações) e um padrão que qualquer pessoa do time reconhece.

O preço é mais código e mais conceitos (slices, ações, selectors, middleware). Numa tela simples isso é peso demais. Numa aplicação grande, com muita gente mexendo no mesmo estado, esse peso vira estrutura.

### TanStack Query

Cuida do estado de servidor. Você declara *o que* buscar (`queryKey` + `queryFn`) e ele gerencia cache, estados de carregamento e erro, deduplicação e revalidação.

```tsx
const query = useQuery({ queryKey: ['todos'], queryFn: getTodos })

const mutation = useMutation({
  mutationFn: postTodo,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['todos'] })
  },
})
```

Depois de uma mutação, `invalidateQueries` marca as consultas com aquela chave como desatualizadas e dispara nova busca das que estão em uso. É o mecanismo que mantém a tela em sincronia com o servidor sem você copiar dado à mão pra dentro de uma store.

## Comparação rápida

| | Tipo de estado | Ideal para | Custo |
|---|---|---|---|
| `useState` | Local | Inputs, modais, toggles | Nenhum |
| Context | Transporte de valor | Tema, idioma, usuário logado | Re-render de todos os consumidores |
| Zustand | Compartilhado de cliente | Estado global com pouca cerimônia | Estrutura fica por conta do time |
| Redux Toolkit | Compartilhado de cliente | Estado complexo, muito código, muita gente | Mais código e conceitos |
| TanStack Query | Servidor | Dado remoto com cache e revalidação | Uma dependência a mais |

Repare que a última linha não substitui as outras. Uma aplicação real costuma combinar: TanStack Query para o servidor, e uma das opções de cliente para o resto.

## Exemplo em sistema complexo: Redux Toolkit + TanStack Query

Pra sistema complexo, o exemplo é com Redux Toolkit. Não tenho número pra afirmar que ele é o "mais popular" e não vou inventar um. A escolha é técnica: em sistemas grandes, o que mais pesa é padrão explícito, previsibilidade e ferramentas de depuração, e é onde o Redux entrega mais.

O cenário é ilustrativo: uma tela de gestão de pedidos, com filtros, seleção múltipla e ações em lote. O estado se divide em dois:

- **Pedidos** (vêm do servidor) → TanStack Query.
- **Filtros e seleção** (nascem no front, e várias partes da tela precisam) → Redux Toolkit.

### Store

```ts
// app/store.ts
import { configureStore } from '@reduxjs/toolkit'
import ordersUiReducer from '../features/orders/ordersUiSlice'

export const store = configureStore({
  reducer: {
    ordersUi: ordersUiReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
```

```ts
// app/hooks.ts
import { useDispatch, useSelector } from 'react-redux'
import type { RootState, AppDispatch } from './store'

export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<RootState>()
```

Os hooks tipados evitam repetir `RootState` e `AppDispatch` em cada componente.

### Slice de UI

```ts
// features/orders/ordersUiSlice.ts
import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

type OrderStatus = 'pending' | 'paid' | 'shipped'

interface OrdersUiState {
  statusFilter: OrderStatus | 'all'
  search: string
  selectedIds: string[]
}

const initialState: OrdersUiState = {
  statusFilter: 'all',
  search: '',
  selectedIds: [],
}

const ordersUiSlice = createSlice({
  name: 'ordersUi',
  initialState,
  reducers: {
    statusFilterChanged(state, action: PayloadAction<OrdersUiState['statusFilter']>) {
      state.statusFilter = action.payload
      state.selectedIds = [] // trocar o filtro limpa a seleção
    },
    searchChanged(state, action: PayloadAction<string>) {
      state.search = action.payload
    },
    orderToggled(state, action: PayloadAction<string>) {
      const id = action.payload
      state.selectedIds = state.selectedIds.includes(id)
        ? state.selectedIds.filter((x) => x !== id)
        : [...state.selectedIds, id]
    },
    selectionCleared(state) {
      state.selectedIds = []
    },
  },
})

export const {
  statusFilterChanged,
  searchChanged,
  orderToggled,
  selectionCleared,
} = ordersUiSlice.actions

export default ordersUiSlice.reducer
```

Dentro de `createSlice` você "muta" o `state` diretamente. Isso é seguro: o Redux Toolkit usa Immer por baixo e produz o novo estado imutável. Repare na regra de negócio explícita em `statusFilterChanged`: trocar o filtro limpa a seleção. Ela mora num lugar único e rastreável, em vez de espalhada em `useEffect`s.

### Servidor: TanStack Query lendo o filtro do Redux

```tsx
// features/orders/OrdersTable.tsx
import { useQuery } from '@tanstack/react-query'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { orderToggled } from './ordersUiSlice'
import { fetchOrders } from './ordersApi'

export function OrdersTable() {
  const dispatch = useAppDispatch()
  const statusFilter = useAppSelector((s) => s.ordersUi.statusFilter)
  const search = useAppSelector((s) => s.ordersUi.search)
  const selectedIds = useAppSelector((s) => s.ordersUi.selectedIds)

  const { data: orders, isPending, error } = useQuery({
    queryKey: ['orders', { statusFilter, search }],
    queryFn: () => fetchOrders({ statusFilter, search }),
  })

  if (isPending) return <p>Carregando…</p>
  if (error) return <p>Erro: {error.message}</p>

  return (
    <table>
      <tbody>
        {orders.map((order) => (
          <tr key={order.id}>
            <td>
              <input
                type="checkbox"
                checked={selectedIds.includes(order.id)}
                onChange={() => dispatch(orderToggled(order.id))}
              />
            </td>
            <td>{order.customer}</td>
            <td>{order.status}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
```

A chave da consulta inclui os filtros. Quando o filtro no Redux muda, a `queryKey` muda e o TanStack Query busca (ou serve do cache) o resultado daquela combinação. Você não escreve código de sincronização.

### Ação em lote

```tsx
// features/orders/BulkActions.tsx
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { selectionCleared } from './ordersUiSlice'
import { markOrdersAsShipped } from './ordersApi'

export function BulkActions() {
  const dispatch = useAppDispatch()
  const queryClient = useQueryClient()
  const selectedIds = useAppSelector((s) => s.ordersUi.selectedIds)

  const mutation = useMutation({
    mutationFn: markOrdersAsShipped,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] })
      dispatch(selectionCleared())
    },
  })

  return (
    <button
      disabled={selectedIds.length === 0 || mutation.isPending}
      onClick={() => mutation.mutate(selectedIds)}
    >
      Marcar {selectedIds.length} como enviados
    </button>
  )
}
```

Depois da mutação, duas coisas acontecem, cada uma no lugar certo: o dado do servidor é revalidado pelo TanStack Query, e a seleção (estado de cliente) é limpa pelo Redux.

### O que esse desenho mostra

- **Cada dado tem um dono.** Pedidos são do servidor, então ficam no TanStack Query. Filtros e seleção são de cliente, então ficam no Redux. Nada é duplicado nem sincronizado à mão.
- **Regra de negócio rastreável.** Toda mudança de filtro ou seleção passa por uma ação nomeada. No DevTools você vê a sequência e reproduz o que aconteceu.
- **Padrão que escala com gente.** Quando dez pessoas mexem na tela, todas seguem o mesmo formato de slice, ação e selector.

Se esse mesmo exemplo tivesse só uns poucos filtros e nenhuma regra além disso, Zustand faria o trabalho com bem menos código. O Redux compensa quando o volume de regras e de pessoas cresce.

## Erros comuns

**Copiar dado do servidor pra dentro do Redux ou Zustand.** É o erro mais frequente. Você passa a ter duas fontes da verdade e vira o responsável por invalidar a cópia. Se o dado vem do servidor, deixe o TanStack Query cuidar.

**Usar Context como store de estado que muda muito.** O re-render de todos os consumidores aparece cedo em telas com atualização frequente.

**Colocar tudo no estado global "por precaução".** Estado local que virou global sem necessidade só aumenta o acoplamento. Comece local e promova quando precisar.

**Adotar Redux por hábito em app pequeno.** O custo de estrutura não se paga se ninguém usa a estrutura.

## O que fica

A decisão de estado se faz em duas etapas. Primeiro classifique: local, compartilhado de cliente ou de servidor. Depois escolha a ferramenta mais simples que resolve aquela categoria.

Servidor vai para TanStack Query. Local fica em `useState`. Valor que muda pouco e atravessa a árvore cabe em Context. E, quando o estado de cliente é compartilhado e muda muito, a escolha entre Zustand e Redux Toolkit é uma troca entre simplicidade e estrutura imposta. Quanto maior o time e mais regras o estado carrega, mais a estrutura do Redux se paga.

## Referências

- Redux Toolkit — [TypeScript Quick Start](https://redux-toolkit.js.org/tutorials/typescript) e documentação de `createSlice`, `configureStore`
- Zustand — [Guia de TypeScript](https://zustand.docs.pmnd.rs/learn/guides/beginner-typescript)
- TanStack Query — [Quick Start (React)](https://tanstack.com/query/latest/docs/framework/react/quick-start) e [Query Invalidation](https://tanstack.com/query/latest/docs/framework/react/guides/query-invalidation)
- React — [Passing Data Deeply with Context](https://react.dev/learn/passing-data-deeply-with-context)
