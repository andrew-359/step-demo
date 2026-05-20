# Task: Chat-Driven Admin Demo Flows

## Context

В `functionality-presintation` уже есть хороший материал для демо админки:

- правый `AgentChatPanel`;
- формы `PersonCardForm`, `CompanyCardForm`, `ProjectCardForm`;
- выбор связей через `ConnectionsField`;
- граф и pick/browse modal через `ConnectionGraphModal`;
- предпросмотр сущности через `EntityPreviewModal`;
- верификация через `DataVerificationColumn` и `VerificationCategoryModal`;
- встречи через `MeetingsColumn`, `MeetingDetailModal`, `meetingsStore`.

Проблема: сейчас это набор отдельных UI-блоков.
Нужно показать, что AI-чат справа управляет рабочим процессом:

```text
Chat drives.
Existing widgets respond.
Human commits.
Mock data changes.
```

Это demo-mode, не production AI.

---

## Goal

Оживить текущую админку через правый AI-чат.

Чат должен запускать два hardcoded flow:

1. **Data flow** — AI помогает добавить/уточнить человека как точку входа.
2. **Communication flow** — AI помогает подготовить интро/созвон через внутренний контакт.

В обоих flow:

- AI объясняет, что делает;
- AI ходит по существующим виджетам;
- AI подготавливает данные;
- человек сам нажимает финальную кнопку;
- mock-state реально меняется.

---

## Product Principle

```text
AI prepares.
Human commits.
System reflects the change.
```

AI может:

- открыть форму;
- заполнить черновик;
- предложить связь;
- открыть граф;
- подготовить встречу;
- добавить участников;
- написать пояснение;
- подготовить follow-up.

AI не должен без человека:

- подтверждать ЛПР/ЛВР;
- делать merge;
- отправлять сообщение;
- утверждать стратегию;
- менять доверие к графу без HITL.

---

## Demo Commands

В правом чате показываем две заранее заданные команды.

Тексты можно уточнить при реализации, базовый вариант:

```text
делай: заполнить точку входа
делай: подготовить интро и созвон
```

Свободный чат можно оставить как визуальный ввод, но для демо гарантированно работают только эти две команды.

---

## Flow 1 — Data Flow

### Сценарий

AI помогает добавить или уточнить человека как потенциальную точку входа.

### Hardcoded демо-данные

Использовать существующий контекст:

- `Company Name`;
- `Петр Петрович`;
- `Сергей Сергеевич`;
- проект `Строительство цеха сварки`.

Можно добавить нового mock-человека, если это лучше смотрится в UI.

### Ожидаемый ход

1. Пользователь нажимает команду `делай: заполнить точку входа`.
2. Чат пишет шаги:
   - понял задачу;
   - открываю карточку человека;
   - заполняю черновик;
   - предлагаю связь с компанией/проектом;
   - нужна проверка человека.
3. AI заполняет `PersonCardForm`.
4. AI добавляет в форму связь через уже существующий формат `connections`.
5. Пользователь нажимает `Применить` в форме.
6. Сущность появляется/обновляется в `graphEntities`.
7. Верификация видит новую/обновленную сущность.
8. Чат пишет итог:
   - черновик сохранен;
   - нужно подтвердить роль/связь в HITL;
   - граф обновлен.

### Возможные UI-эффекты

- подсветить/показать notice `Карточка добавлена в граф`;
- открыть граф в browse-mode после сохранения;
- открыть категорию `Персоналии` в верификации;
- оставить следующий шаг в чате.

---

## Flow 2 — Communication Flow

### Сценарий

AI помогает подготовить интро/созвон через внутреннего или теплого контакта.

### Hardcoded демо-данные

Основная цепочка:

```text
Наша команда → Сергей Сергеевич → Петр Петрович
```

Контекст:

- Петр Петрович — ЛПР;
- Сергей Сергеевич — ЛВР / подтвержденный контакт;
- проект — `Строительство цеха сварки`;
- цель — запросить интро к Петру.

### Ожидаемый ход

1. Пользователь нажимает команду `делай: подготовить интро и созвон`.
2. Чат пишет шаги:
   - проверяю цепочку входа;
   - найден путь через Сергея;
   - готовлю контекст для пинга;
   - создаю черновик встречи;
   - добавляю участников из графа;
   - нужно подтверждение человека.
3. AI создает или открывает meeting через `meetingsStore`.
4. AI заполняет:
   - title;
   - description;
   - labels;
   - participants;
   - activity/comment.
5. Открывается `MeetingDetailModal`.
6. Пользователь проверяет и подтверждает через существующие действия модалки.
7. Чат пишет итог:
   - созвон подготовлен;
   - участники добавлены;
   - следующий шаг — запросить интро.

### Возможные UI-эффекты

- новая карточка в `MeetingsColumn`;
- открытая модалка встречи;
- участники из `graphEntities`;
- activity event от имени AI/менеджера;
- метка `Подготовка` или `Follow-up`.

---

## Implementation Notes

### Scope

Изменения держать в `functionality-presintation/src/pages/control-panel`.

Не вводить:

- backend;
- Pinia;
- роутинг;
- реальный AI;
- реальную отправку сообщений;
- полноценный flow engine.

Можно добавить небольшой mock-state/composable для demo flows.

### Suggested modules

Возможные новые файлы:

```text
src/pages/control-panel/model/adminDemoFlows.ts
src/pages/control-panel/model/adminFlowRunner.ts
```

Или один файл, если скоуп маленький.

### Suggested data shape

Примерно:

```ts
type AdminDemoFlowId =
  | 'data-entry-point'
  | 'communication-intro-call'

interface AdminDemoFlow {
  id: AdminDemoFlowId
  title: string
  command: string
  steps: AdminDemoFlowStep[]
}

interface AdminDemoFlowStep {
  id: string
  message: string
  delayMs?: number
  action?: () => void
}
```

Для демо достаточно последовательного runner с `setTimeout`.

---

## Existing Code To Reuse

### Chat

- `AgentChatPanel.vue`
  - добавить кнопки demo-команд;
  - печатать сообщения flow;
  - возможно показывать статус активного flow.

### Forms

- `controlPanelForms.ts`
  - заполнить `personCardForm`;
  - возможно заполнить `connections`.

- `PersonCardForm.vue`
  - оставить human commit через текущую кнопку `Применить`.

- `syncGraphCardFromForm.ts`
  - использовать существующий save в граф.

### Graph

- `graphMockData.ts`
  - использовать существующие `graphEntities` и категории.

- `ConnectionGraphModal.vue`
  - можно открыть в browse-mode после сохранения или на этапе объяснения.

### Verification

- `DataVerificationColumn.vue`
- `VerificationCategoryModal.vue`
- `verificationStore.ts`
  - использовать как HITL-поверхность.
  - не обязательно полностью переделывать под decision queue на этом шаге.

### Meetings

- `meetingsStore.ts`
  - добавить helper для создания подготовленной встречи, если текущего `addMeetingCard` мало.

- `MeetingsColumn.vue`
- `MeetingDetailModal.vue`
  - использовать для communication flow.

---

## Acceptance Criteria

- В правом чате есть 2 demo-команды.
- Нажатие команды запускает пошаговую имитацию работы AI.
- Flow 1 заполняет форму Person и после human commit меняет graph mock-state.
- Flow 2 создает/обновляет встречу и открывает meeting modal.
- В flow есть явная граница: AI подготовил, человек подтверждает.
- Используются существующие формы, граф, верификация и встречи.
- Визуальный стиль текущей админки сохраняется.
- Свободный ввод не обязан быть умным, но не должен ломать demo flow.

---

## Open Decisions During Implementation

- Нужно ли автоматически открывать граф после Flow 1 или оставить только notice?
- Нужно ли автоматически открывать `VerificationCategoryModal` после Flow 1?
- Как назвать AI в activity log встречи: `AI-ассистент`, `Менеджер`, или смешанный вариант?
- Делать ли отдельный “active flow” badge в чате?
- Добавлять ли минимальную подсветку полей, заполненных AI, или оставить на следующий шаг?

---

## Non-Goals

- Не строим production flow engine.
- Не делаем настоящий voice input.
- Не делаем настоящий intent parser.
- Не делаем отправку ping/call invite наружу.
- Не переписываем админку в новый layout.
- Не превращаем verification в полноценную decision queue в рамках этой задачи.
