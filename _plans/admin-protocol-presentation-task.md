# Task: Turn Static Presentation UI Into Admin Protocol Demo

## Context

Current UI in `functionality-presintation` is a high-fidelity static Vue presentation. It already has the right restrained enterprise/report style, but it reads more like a company dossier than a working admin protocol for finding project entry points.

The goal is to add light pseudo-functionality while keeping the interface simple and presentation-oriented.

This is not a production app task. Do not introduce complex architecture, backend integration, Pinia, routing, API clients, or layered domain modeling.

## Goal

Create the feeling of a working admin protocol:

```text
ИНН / project input
  -> company/project is selected from prepared mock data
  -> search appears in history
  -> key figures and LPR/LVR candidates are highlighted
  -> admin confirms/rejects simple items
  -> relationship paths / entry strategies become available
  -> selected strategy transfers into next steps
```

The demo should make the product idea clearer:

- corporate memory of relationships;
- finding a point of entry into a project;
- LPR/LVR identification;
- confidence/source visibility;
- system suggests, admin confirms;
- selected strategy turns into concrete next actions.

## Confirmed Decisions

- Add simple interactive controls such as confirm/reject/select where they make demo sense.
- Do not use Pinia.
- State can be a simple nested TypeScript object/composable.
- No real finite-state-machine library is needed.
- Keep financial/legal sections as supporting context, not the main product value.
- Preserve the existing visual style.
- No graph visualization is required at this stage.

## Non-Goals

- No backend.
- No real search.
- No real enrichment.
- No auth.
- No persistence beyond local component/store state, except existing local theme behavior.
- No PDF export.
- No complex reusable component system unless it removes obvious duplication.
- No major redesign.

## Suggested Decomposition

Best decomposition: 4 parts.

This is enough to keep work reviewable while avoiding artificial architecture.

### Part 1: Presentation Data And Simple State

Create one small mock/state module, for example:

```text
src/pages/home/model/demoProtocol.ts
```

It should contain:

- prepared companies/projects;
- current search input;
- selected project/company;
- search history;
- protocol status;
- key figures with LPR/LVR flags;
- relationship paths;
- entry strategies;
- next steps.

Keep the shape explicit and readable. Prefer one nested object over many abstractions.

Expected result:

- UI still renders from prepared data;
- there is one obvious place where demo state lives;
- no Pinia or backend assumptions.

### Part 2: New Search And History Flow

Make `Новый поиск` feel functional:

- user enters an INN;
- submit selects a prepared company/project;
- entered INN appears in `История поисков`;
- active project data is used by report sections;
- if input does not match a prepared INN, fall back to the main mock company with a soft "demo data" status.

Expected result:

- user sees that the input affects later screens;
- history is not static;
- no real lookup is implied.

### Part 3: Admin Review Signals

Add simple admin protocol interactions:

- key figures show badges: `ЛПР`, `ЛВР`, `кандидат`, `подтверждено`, `требует проверки`;
- show confidence and source next to important facts;
- add lightweight confirm/reject/select actions;
- actions only mutate local demo state.

Priority sections:

- `Ключевые фигуры в компании`;
- `Участники проекта`;
- `Структура компании заказчика` where source/confidence helps.

Expected result:

- the UI communicates "system suggests, admin confirms";
- LPR/LVR becomes visible as the central product concept.

### Part 4: Entry Strategies And Next Steps Transfer

Rework the value-delivery part of the demo:

- `Карта связей` remains table-based, but becomes relationship/entry-path oriented;
- show 2-3 prepared paths like:

```text
Наша команда -> контакт -> ЛВР -> ЛПР
```

- each path has risk, confidence, source, and suggested action;
- `Выводы. Рекомендации` includes selectable entry strategies;
- selected strategy transfers into `Дальнейшие шаги`.

Expected result:

- the interface answers "через кого заходить";
- the final screen reflects earlier admin choices;
- no graph rendering is needed.

## Acceptance Criteria

- The app still looks like the current expensive/report-style presentation.
- A user can run one coherent demo scenario from `Новый поиск` to `Дальнейшие шаги`.
- At least one input or selection visibly changes downstream sections.
- LPR/LVR and entry strategy are visible without needing to explain them verbally.
- Existing static sections are not removed unless they are replaced by clearer protocol equivalents.
- The implementation remains small and easy to read.

## Recommended Demo Scenario

1. Open `Новый поиск`.
2. Enter prepared INN.
3. See the search added to history.
4. Open `Подготовка к проекту` and see selected project/company.
5. Open `Ключевые фигуры` and confirm one LPR/LVR candidate.
6. Open `Карта связей` and select a recommended path.
7. Open `Выводы. Рекомендации` and choose strategy.
8. Open `Дальнейшие шаги` and see next actions generated from the selected strategy.

## Implementation Notes

- Keep changes scoped to `functionality-presintation/src/pages/home`.
- Prefer explicit arrays/objects over generic abstractions.
- Use existing CSS classes and section style where possible.
- Add only minimal new styling for badges, inline actions, and protocol statuses.
- Do not turn this into a production architecture.

