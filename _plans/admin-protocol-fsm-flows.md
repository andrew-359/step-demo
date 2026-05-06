# Admin Protocol Demo: FSM-Oriented Flow Spec

## Purpose

This document replaces vague user stories with explicit state-transition specs for the presentation UI.

The goal is not to introduce a real FSM library. The goal is to define a clear behavior contract:

```text
Trigger -> State Change -> Data Change -> UI Effect
```

Implementation should remain simple:

- one small nested TypeScript state object;
- enum-like string statuses;
- lookup arrays/objects for steps and labels;
- no Pinia;
- no XState;
- no event bus unless it becomes obviously necessary.

## Important Constraint

There is no graph visualization at this stage.

All relationship behavior is represented as a table-based entry chain:

```text
Наша команда -> контакт -> ЛВР -> ЛПР
```

Use the term **Entry Chain Flow** instead of Relationship Path Flow to avoid implying graph rendering.

## State Vocabulary

```ts
SearchState = 'idle' | 'typing' | 'searching' | 'found' | 'fallback'
ReviewState = 'pending' | 'confirmed' | 'rejected'
EntryChainState = 'none' | 'selected'
StrategyState = 'none' | 'selected'
ProtocolState =
  | 'empty'
  | 'searching'
  | 'enriched'
  | 'reviewed'
  | 'chain_selected'
  | 'strategy_selected'
  | 'next_steps_ready'
```

These are presentation states, not production domain states.

## Flow 1: Search Flow

| Current State | Trigger | Next State | Data Change | UI Effect |
|---|---|---|---|---|
| `Search:idle` | input focus | `Search:typing` | none | input receives active focus styling |
| `Search:typing` | submit with empty input | `Search:idle` | `lastSearchNote = "Введите ИНН..."` | inline status message appears |
| `Search:typing` | submit with any non-empty input | `Search:searching` | `searchInput = input`, reset active search step | input disabled, progress panel appears |
| `Search:searching` | timer step | `Search:searching` | `activeSearchStep += 1` | next progress row becomes active/done |
| `Search:searching` | final timer with prepared INN | `Search:found` | add history item, set active demo project | result block says company found |
| `Search:searching` | final timer with any other input | `Search:fallback` | add history item with typed value, keep demo project | result block says demo project opened for typed query |
| `Search:found/fallback` | click `Открыть протокол` | `Protocol:enriched` | active sidebar section may become preparation | user can continue through report sections |

Suggested progress steps:

```text
1. Проверяем ИНН
2. Ищем компанию в реестрах
3. Сопоставляем с проектной памятью
4. Формируем протокол
```

## Flow 2: Figure Review Flow

| Current State | Trigger | Next State | Data Change | UI Effect |
|---|---|---|---|---|
| `Figure:pending` | click `Подтвердить` | `Figure:confirmed` | `figure.reviewStatus = confirmed` | badge becomes confirmed |
| `Figure:pending` | click `Отклонить` | `Figure:rejected` | `figure.reviewStatus = rejected` | badge becomes rejected |
| `Figure:confirmed/rejected` | click opposite action | opposite state | update `reviewStatus` | badge updates in place |
| any figure reviewed | review action complete | `Protocol:reviewed` | protocol status updates | optional inline protocol note |

Rules:

- LPR/LVR badges should stay visible even before confirmation.
- Confirmation changes trust status, not the person's role marker.
- No backend persistence.

## Flow 3: Entry Chain Flow

This is table-based. No graph is required.

| Current State | Trigger | Next State | Data Change | UI Effect |
|---|---|---|---|---|
| `EntryChain:none` | click entry chain row | `EntryChain:selected` | `selectedEntryChainId = chain.id` | selected row is highlighted |
| `EntryChain:selected` | click another row | `EntryChain:selected` | `selectedEntryChainId = nextChain.id` | highlight moves to selected row |
| `EntryChain:selected` | open recommendations | `Strategy:none/selected` | strategies can reference selected chain | related strategy may be visually emphasized |

Entry chain row should show:

- chain title;
- textual path: `Наша команда -> контакт -> ЛВР -> ЛПР`;
- risk;
- confidence;
- source;
- suggested action.

## Flow 4: Strategy Selection Flow

| Current State | Trigger | Next State | Data Change | UI Effect |
|---|---|---|---|---|
| `Strategy:none` | click `Выбрать` on strategy | `Strategy:selected` | `selectedStrategyId = strategy.id` | strategy card receives selected style |
| `Strategy:selected` | click another strategy | `Strategy:selected` | selected strategy switches | selected style moves |
| `Strategy:selected` | state updated | `Protocol:strategy_selected` | next steps recomputed from selected strategy | recommendation summary updates |
| `Protocol:strategy_selected` | open next steps | `Protocol:next_steps_ready` | no extra data needed | selected strategy appears as concrete next action |

Rules:

- Strategy selection should feel like the admin choosing the route into the project.
- It should update `Дальнейшие шаги`.
- It should not imply real AI generation.

## Flow 5: History Flow

| Current State | Trigger | Next State | Data Change | UI Effect |
|---|---|---|---|---|
| any | search completes | unchanged | prepend history item | history counter increases |
| history has items | click delete | unchanged | remove history item | row disappears, counter updates |

Rules:

- History stores the typed query exactly as entered.
- For unmatched input, company name can remain the demo company, but UI must be honest that this is demo fallback behavior.

## Implementation Priority

1. Search Flow with progress imitation.
2. Entry Chain Flow row selection.
3. Strategy Selection Flow tied to selected chain.
4. Figure Review polish.
5. History polish.

## Non-Goals

- No real graph.
- No real external lookup.
- No AI agent UI.
- No sound effects unless explicitly requested later.
- No production-grade FSM runtime.

