# RIP — Модули и архитектура
## Зоны ответственности, стек, связи

---

## Обзор стека

| Слой | Технологии |
|------|------------|
| Backend основной | NestJS + Fastify, TypeScript |
| ORM | Prisma |
| БД | PostgreSQL |
| Очереди (MVP) | PostgreSQL jobs (polling) |
| Очереди (v2) | Redis + BullMQ |
| Auth | Keycloak |
| AI микросервис | Python, FastAPI |
| LLM | Ollama (self-hosted) / GigaChat |
| Admin UI | AdminJS (@adminjs/nestjs) |
| Чатбот | Telegraf (NestJS модуль) |
| PDF | Puppeteer / @react-pdf/renderer |
| Cron | @nestjs/schedule |

---

## Модули

---

### 1. API Gateway
**Стек:** NestJS + Fastify

**Зона ответственности:**
- Единая точка входа для всех клиентов
- JWT validation через Keycloak
- Роутинг запросов к нужным модулям
- REST для AdminJS и каталога отчётов
- WebSocket / SSE для real-time уведомлений в UI

**Правило:** никакой бизнес-логики. Только auth + роутинг.

**Связи:** ← Telegram Bot, AdminJS | → все внутренние модули

---

### 2. Auth — Keycloak
**Стек:** Keycloak, стандартный деплой

**Зона ответственности:**
- Identity management
- Роли: `manager`, `admin`
- JWT токены

**Правило:** только API Gateway общается с Keycloak напрямую. Остальные модули получают уже валидированный JWT.

---

### 3. Entity Module
**Стек:** NestJS модуль, Prisma

**Зона ответственности:**
- CRUD для всех сущностей: Person, Company, Project, Relationship
- Temporal tables — все запросы через `valid_to IS NULL` для текущего состояния
- Merge logic — слияние дублирующихся нод
- Очередь верификации дублей (предлагает менеджеру потенциальные merge)
- Версионирование: при изменении закрывает старую запись (`valid_to = now()`), создаёт новую

**Модель данных ключевых сущностей:**
```
Person:
  id, canonical_id, full_name, aliases[]
  is_lpr, is_lvr, notes
  valid_from, valid_to

Company:
  id, inn, canonical_name, aliases[]
  status, valid_from, valid_to

Project:
  id, name, status, signals_hash
  created_at, valid_from, valid_to

Relationship (edge):
  id, from_id, to_id, type
  strength, confidence, source, source_url
  valid_from, valid_to
```

**Связи:** ← API Gateway, Orchestrator | → PostgreSQL

---

### 4. Graph Layer
**Стек:** NestJS модуль (внутри основного приложения), PostgreSQL recursive CTE

**Зона ответственности:**
- Graph queries поверх реляционной БД
- Не отдельный сервис — модуль с чистым интерфейсом

**Основные операции:**
```
shortest_path(from_id, to_id) → path[]
weighted_path(from_id, to_id) → path[]  ← оптимальный по качеству связей
subgraph(project_id) → nodes[], edges[]
multi_hop(entity_id, depth) → nodes[]
centrality(project_id) → scored_nodes[]
```

**Weighted path — почему важно:**
`shortest_path` недостаточен. Три рукопожатия через друзей лучше чем два через формальную иерархию. Сотрудник не будет продвигать тебя к своему директору.

Вес связи: `relationship_type_score × strength × direction_penalty`. Друзья и партнёры — высокий вес. Формальная иерархия снизу вверх — низкий вес.

Система показывает оба варианта: кратчайший путь и качественный путь. Менеджер выбирает стратегию.

**Когда переходить на Neo4j:** если graph queries начинают занимать более 500ms на типичном запросе shortest_path. На масштабе 5к контактов / 100 проектов — PostgreSQL достаточно.

**Связи:** ← Entity Module, Telegram Bot, Snapshot Worker

---

### 5. Orchestrator
**Стек:** NestJS модуль, PostgreSQL таблица `jobs`

**Зона ответственности:**
- Создание и управление job pipeline
- Идемпотентность через уникальные ключи
- Отслеживание статусов джобов
- Locking — не запускать один job дважды параллельно

**Job types:**
```
fetch        → Fetch Worker
extract      → Extraction Service
rank         → Rank Worker (v2)
snapshot     → Snapshot Worker
refresh      → Refresh Worker
```

**MVP реализация:** polling таблицы `jobs` каждые 5 секунд. Статусы: `pending → running → done | failed`. При ошибке: retry 3 раза с экспоненциальной задержкой, потом `failed`.
**V2:** замена на Redis + BullMQ без изменения интерфейса выше.

**Связи:** ← Entity Module, API Gateway | → все Workers

---

### 6. Source Connectors
**Стек:** NestJS модуль, TypeScript интерфейс

**Зона ответственности:**
- Абстракция над внешними источниками данных
- MVP: одна реализация — DaData

**Интерфейс:**
```typescript
interface SourceConnector {
  fetch(entityId: string, params: FetchParams): Promise<Observation[]>
  capabilities(): string[]
  rateLimit(): RateLimitConfig
}
```

**DaData коннектор:**
- HTTP клиент к api.dadata.ru
- Поиск по ИНН: возвращает название, руководители, учредители, адрес, статус
- До 10 000 запросов/день бесплатно
- Решает entity resolution для компаний через ИНН как anchor

**Добавление нового коннектора в v2:**
Новый класс, реализующий `SourceConnector`. Нулевые изменения в бизнес-логике.

**Связи:** ← Fetch Worker, Refresh Worker | → внешние API

---

### 7. Fetch Worker
**Стек:** NestJS worker

**Зона ответственности:**
- Подписан на джобы типа `fetch`
- Вызывает нужный Source Connector
- Сохраняет результат как `Observation` в БД
- Идемпотентность: `UNIQUE(source_id, entity_id, observation_hash)`

**Observation:**
```
entity_id, source_id
raw_data, source_url   ← ссылка на источник обязательна
observation_hash
created_at
```

**Связи:** ← Orchestrator | → Source Connectors, PostgreSQL

---

### 8. Extraction Service
**Стек:** Python, FastAPI, LangChain или прямой HTTP к LLM

**Зона ответственности:**
- Отдельный микросервис
- Принимает: PDF файл или текст
- Отдаёт: структурированный JSON с сущностями и связями
- **Pseudonymization layer живёт здесь:**
  ```
  вход: реальный текст
    ↓
  замена PII на токены (PERSON_001, COMPANY_047)
    ↓
  LLM Connector
    ↓
  обратная замена токенов на реальные данные
    ↓
  выход: структурированный результат с реальными именами
  ```

**Общается с основным приложением через REST.**

**Связи:** ← Orchestrator (через HTTP) | → LLM Connector

---

### 9. LLM Connector
**Стек:** Python модуль внутри Extraction Service

**Зона ответственности:**
- Абстракция LLM провайдера
- Интерфейс: `complete(prompt, options) → str`

**Реализации:**
```
OllamaConnector   → HTTP к локальному Ollama (self-hosted)
GigaChatConnector → HTTP + OAuth к api.gigachat.ru
OpenAIConnector   → OpenAI-compatible API (опционально)
```

**Переключение:** через конфиг (`LLM_PROVIDER=ollama|gigachat`), без изменения кода.

**Приоритет для MVP:** Ollama — данные не покидают периметр вообще. GigaChatr — данные в РФ, юридически чисто.

---

### 10. Snapshot Worker
**Стек:** NestJS worker

**Зона ответственности:**
- Подписан на джобы типа `snapshot`
- Собирает данные проекта из БД (ноды, edges, signals, facts)
- Проверяет `signals_hash` — если не изменился, пропускает
- Формирует промпт по шаблону Project Report
- Отправляет в Extraction Service
- Сохраняет результат как `Snapshot`
- Триггерит PDF Export если нужно

**Связи:** ← Orchestrator | → Entity Module, Graph Layer, Extraction Service, PDF Export

---

### 11. Refresh Worker
**Стек:** NestJS cron job (@nestjs/schedule)

**Зона ответственности:**
- Запускается каждую ночь
- Берёт все Company с активными проектами
- Дёргает DaData через Source Connector
- Сравнивает с последним Observation по hash
- Если изменилось → создаёт Signal → триггерит Telegram уведомление

**Что отслеживает:**
- Смена директора / учредителей
- Изменение статуса (ликвидация, реорганизация)
- Смена адреса

**Формат уведомления:**
```
⚡ Сигнал по проекту "Альфа"
Компания: ООО Стройгрупп
Событие: сменился генеральный директор
Было: Иванов И.И. → Стало: Петров П.П.
Источник: ЕГРЮЛ / DaData [ссылка]
```

**Связи:** ← cron | → Source Connectors, PostgreSQL, Telegram Bot

---

### 12. Telegram Bot
**Стек:** NestJS модуль, библиотека `telegraf`

**Два режима:**

**Outbound (push):**
Получает триггер от Refresh Worker → отправляет уведомление нужному менеджеру.

**Inbound (7 команд):**
Intent matching — простой if/switch на ключевые слова. Никакого NLP в MVP.

| Команда | Транслируется в |
|---------|----------------|
| "Создай проект [название]" | Entity Module: INSERT project |
| "Добавь компанию [ИНН] в проект X" | Source Connector → Entity Module |
| "Найди точку входа для [компания]" | Graph Layer: shortest_path |
| "Кто ЛПР/ЛВР в [проект/компания]" | Entity Module: query by tags |
| "Покажи связи по проекту X" | Graph Layer: subgraph |
| "Покажи отчёт по проекту X" | Snapshot Worker → PDF Export |
| "Обнови данные по компании X" | Orchestrator: enqueue fetch job |

**Связи:** ← Refresh Worker | → API Gateway → все модули

---

### 13. AdminJS
**Стек:** `@adminjs/nestjs`, `@adminjs/prisma`

**Зона ответственности:**
- Авто-генерированный CRUD UI из Prisma схемы
- Основной инструмент для верификации и управления данными

**Кастомные страницы:**
- **Верификация extraction** — список предложенных сущностей из PDF с кнопками: подтвердить / отклонить / исправить
- **Очередь merge** — потенциальные дубли с кнопкой "это один человек"
- **Каталог отчётов** — список Snapshots по проектам, статус (черновик/утверждён), кнопка экспорта PDF
- **Relationship Map** — простой рендер графа по проекту (vis.js или d3 embedded)

**Связи:** ← API Gateway | → Entity Module, Graph Layer, PDF Export

---

### 14. PDF Export
**Стек:** NestJS модуль, `puppeteer` или `@react-pdf/renderer`

**Зона ответственности:**
- Принимает данные Snapshot
- Рендерит по HTML/JSX шаблону Project Report
- Отдаёт PDF буфер

**Вызывается из:**
- Snapshot Worker (автоматически после генерации)
- Команда чатбота "покажи отчёт"
- Кнопка в AdminJS каталоге отчётов

**Связи:** ← Snapshot Worker, Telegram Bot, AdminJS

---

## Схема связей

```
┌─────────────────────────────────────┐
│  Клиенты                            │
│  Telegram Bot    AdminJS            │
└────────┬─────────────┬──────────────┘
         ↓             ↓
    [API Gateway + Keycloak Auth]
         ↓
    ┌────┴──────────────────────┐
    ↓                           ↓
Entity Module              Graph Layer
(CRUD + merge)         (shortest_path,
    ↓                    subgraph, etc)
    ↓
Orchestrator
(job queue, PostgreSQL)
    ↓
┌───────────────────────────────┐
│  Workers                      │
│  Fetch    Snapshot  Refresh   │
│  Worker   Worker    Worker    │
└───┬───────────┬──────────┬───┘
    ↓           ↓          ↓
Source      Extraction  DaData +
Connectors  Service     Telegram
(DaData)    (Python)    notify
    ↓           ↓
Observations  Snapshots
    ↓
PostgreSQL
(entities, relationships,
 observations, signals,
 facts, snapshots,
 feedback, jobs)
```

---

## Границы микросервисов

| Сервис | Язык | Почему отдельно |
|--------|------|-----------------|
| Основное приложение | TypeScript / NestJS | Весь backend, workers, bot |
| Extraction Service | Python / FastAPI | LangChain, ML библиотеки, pseudonymization |
| Keycloak | Java (готовый деплой) | Auth изолирован |
| Ollama | Go (готовый деплой) | LLM изолирован, данные не покидают периметр |

---

## Что решается позже (v2+)

| Модуль | Изменение |
|--------|-----------|
| Orchestrator | PostgreSQL jobs → Redis + BullMQ (смена реализации, интерфейс тот же) |
| Source Connectors | Новые реализации: тендеры, новости, соцсети |
| Graph Layer | PostgreSQL → Neo4j если recursive CTE станут узким местом |
| Rank Worker | Новый worker: пересчёт confidence и centrality |
| Strategy Engine | Source registry + refresh policy + planner + budget manager |
| LLM Connector | Новые провайдеры через тот же интерфейс |

---

*Документ живой. Обновляется по ходу разработки.*
