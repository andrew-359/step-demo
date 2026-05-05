# RIP — Tech Spec
## Схема БД, Job Pipeline, Pseudonymization, API Контракты

> Статус: черновик v0.1
> Это документ для разработчиков — не для заказчика

---

## 1. Схема БД

### Принципы
- Всё версионируется через `valid_from` / `valid_to`. Текущая запись: `valid_to IS NULL`
- Ничего не удаляется — только закрывается версия
- Raw данные хранятся всегда — для возможного переобучения без повторного скрапинга
- Идемпотентность через hash-ключи на Observation и Signal

---

### Таблицы

#### persons
```sql
id              UUID PRIMARY KEY
canonical_id    UUID REFERENCES persons(id)  -- ссылка на canonical после merge
full_name       TEXT NOT NULL
aliases         TEXT[]                        -- все варианты имени
is_lpr          BOOLEAN DEFAULT FALSE
is_lvr          BOOLEAN DEFAULT FALSE
notes           TEXT                          -- свободный текст менеджера
valid_from      TIMESTAMPTZ NOT NULL DEFAULT now()
valid_to        TIMESTAMPTZ                   -- NULL = текущая версия
created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
```

#### companies
```sql
id              UUID PRIMARY KEY
canonical_id    UUID REFERENCES companies(id)
inn             VARCHAR(12)                   -- anchor для entity resolution
canonical_name  TEXT NOT NULL
aliases         TEXT[]
status          TEXT                          -- active | liquidated | reorganized
valid_from      TIMESTAMPTZ NOT NULL DEFAULT now()
valid_to        TIMESTAMPTZ
created_at      TIMESTAMPTZ NOT NULL DEFAULT now()

INDEX idx_companies_inn ON companies(inn) WHERE valid_to IS NULL
```

#### users
```sql
id               UUID PRIMARY KEY
name             TEXT NOT NULL
telegram_chat_id TEXT                -- для push уведомлений
role             TEXT NOT NULL       -- manager | admin
created_at       TIMESTAMPTZ NOT NULL DEFAULT now()
```

#### projects
```sql
id                   UUID PRIMARY KEY
name                 TEXT NOT NULL
status               TEXT DEFAULT 'active'         -- active | archived
assigned_manager_id  UUID REFERENCES users(id)     -- для Telegram уведомлений
signals_hash         TEXT
created_at           TIMESTAMPTZ NOT NULL DEFAULT now()
valid_from           TIMESTAMPTZ NOT NULL DEFAULT now()
valid_to             TIMESTAMPTZ
```

#### relationships
```sql
id                  UUID PRIMARY KEY
from_id             UUID NOT NULL                 -- person или company
from_type           TEXT NOT NULL                 -- 'person' | 'company'
to_id               UUID NOT NULL
to_type             TEXT NOT NULL
type                TEXT NOT NULL
                    -- works_at | worked_at | knows | friends |
                    -- ex_colleagues | colleagues | partners | affiliated_with
strength            FLOAT DEFAULT 0.5             -- 0..1
confidence          FLOAT DEFAULT 0.5             -- 0..1
context             TEXT                          -- "совместный проект 2019",
                                                  -- "конференция СтройЭкспо"
                                                  -- то что менеджер знает из головы
last_interaction_at TIMESTAMPTZ                   -- когда последний раз контактировали
                                                  -- влияет на weight: >1 года = пониженный вес
source              TEXT NOT NULL
                    -- manual | report | dadata | ai
source_url          TEXT                          -- ссылка на источник обязательна
valid_from          TIMESTAMPTZ NOT NULL DEFAULT now()
valid_to            TIMESTAMPTZ
created_at          TIMESTAMPTZ NOT NULL DEFAULT now()

INDEX idx_relationships_from ON relationships(from_id) WHERE valid_to IS NULL
INDEX idx_relationships_to   ON relationships(to_id)   WHERE valid_to IS NULL
```

#### observations
```sql
id              UUID PRIMARY KEY
entity_id       UUID NOT NULL                 -- person или company
entity_type     TEXT NOT NULL
source_id       TEXT NOT NULL                 -- 'dadata' | 'pdf' | ...
raw_data        JSONB NOT NULL                -- полный raw ответ источника
source_url      TEXT                          -- ссылка на источник
observation_hash TEXT NOT NULL
created_at      TIMESTAMPTZ NOT NULL DEFAULT now()

UNIQUE(source_id, entity_id, observation_hash)  -- идемпотентность
```

> raw_data хранит полный JSON ответа от источника без обработки.
> Нужен для возможного переобучения системы без повторного скрапинга.

#### signals
```sql
id              UUID PRIMARY KEY
entity_id       UUID NOT NULL
entity_type     TEXT NOT NULL
project_id      UUID REFERENCES projects(id)
signal_type     TEXT NOT NULL
                -- director_changed | status_changed | new_contract | ...
signal_key      TEXT NOT NULL                 -- уникальный ключ события
payload         JSONB                         -- детали сигнала
confidence      FLOAT DEFAULT 0.5
source_url      TEXT
created_at      TIMESTAMPTZ NOT NULL DEFAULT now()

UNIQUE(entity_id, signal_type, signal_key)    -- идемпотентность
```

#### facts
```sql
id              UUID PRIMARY KEY
entity_id       UUID NOT NULL
entity_type     TEXT NOT NULL
fact_type       TEXT NOT NULL
                -- director | address | founder | license | ...
value           JSONB NOT NULL
source_url      TEXT
valid_from      TIMESTAMPTZ NOT NULL DEFAULT now()
valid_to        TIMESTAMPTZ                   -- SCD2 версионирование
created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
```

#### entity_attributes
```sql
id            UUID PRIMARY KEY
entity_id     UUID NOT NULL
entity_type   TEXT NOT NULL        -- 'person' | 'company' | 'relationship'
key           TEXT NOT NULL        -- 'approach_via' | 'contact_preference' |
                                   -- 'decision_speed' | 'influence_scope' | ...
value         TEXT NOT NULL        -- любое значение
confidence    FLOAT DEFAULT 0.5    -- 0..1
source        TEXT NOT NULL        -- 'manual' | 'ai_extracted' | 'inferred'
valid_from    TIMESTAMPTZ NOT NULL DEFAULT now()
valid_to      TIMESTAMPTZ          -- NULL = актуальный атрибут
created_at    TIMESTAMPTZ NOT NULL DEFAULT now()

INDEX idx_entity_attributes_lookup
  ON entity_attributes(entity_id, entity_type, key)
  WHERE valid_to IS NULL
```

**Примеры атрибутов:**
```
person, approach_via:     'finance' | 'technical' | 'personal'
person, contact_pref:     'in_person' | 'phone' | 'email'
person, decision_speed:   'fast' | 'slow' | 'committee'
person, influence_scope:  'budget' | 'technical' | 'political'
relationship, warmth:     'cold' | 'warm' | 'close'
relationship, channel:    'linkedin' | 'phone' | 'in_person'
```

**Жизненный цикл атрибута:**
```
MVP:  менеджер вводит notes в свободном тексте
      AI читает notes при генерации стратегий (неструктурированно)

V1:   AI extraction из notes → структурированные атрибуты
      "заходить через финблок" → approach_via: finance, confidence: 0.7, source: ai_extracted

V2:   Система анализирует успешные проекты
      Какие атрибуты коррелируют с утверждёнными стратегиями?
      Эти атрибуты получают больший вес

V3:   Полноценный feedback loop
      результат проекта → веса атрибутов обновляются автоматически
```

> EAV паттерн — позволяет добавлять новые атрибуты без изменения схемы БД.
> Минус: сложнее запрашивать. Решается через materialized views для частых атрибутов.
```sql
source_id       TEXT NOT NULL    -- 'dadata' | 'manual' | 'ai' | 'report'
fact_type       TEXT             -- 'phone' | 'address' | 'director' |
                                 -- 'founder' | 'email' | 'name' | NULL (дефолт для источника)
confidence      FLOAT NOT NULL   -- дефолтный confidence для этой комбинации
description     TEXT
updated_at      TIMESTAMPTZ DEFAULT now()

PRIMARY KEY (source_id, COALESCE(fact_type, ''))
```

**Дефолтные значения при инициализации:**
```sql
-- DaData — разная надёжность по типу факта
INSERT INTO weight_config VALUES ('dadata', NULL,       0.70, 'дефолт DaData');
INSERT INTO weight_config VALUES ('dadata', 'name',     0.99, 'юридическое название из ЕГРЮЛ');
INSERT INTO weight_config VALUES ('dadata', 'director', 0.85, 'директор из ЕГРЮЛ');
INSERT INTO weight_config VALUES ('dadata', 'address',  0.80, 'юридический адрес ≠ фактический');
INSERT INTO weight_config VALUES ('dadata', 'phone',    0.40, 'часто устаревший');
INSERT INTO weight_config VALUES ('dadata', 'email',    0.30, 'редко актуален');

-- Manual — высокий confidence
INSERT INTO weight_config VALUES ('manual', NULL,       0.90, 'дефолт ручного ввода');
INSERT INTO weight_config VALUES ('manual', 'lpr_tag',  0.95, 'менеджер знает ЛПР');
INSERT INTO weight_config VALUES ('manual', 'rel_type', 0.90, 'менеджер знает тип связи');

-- AI extraction из PDF
INSERT INTO weight_config VALUES ('ai', NULL,           0.60, 'дефолт AI extraction');
INSERT INTO weight_config VALUES ('ai', 'name',         0.70, 'NER обычно точен');
INSERT INTO weight_config VALUES ('ai', 'position',     0.60, 'формулировки разные');
INSERT INTO weight_config VALUES ('ai', 'rel_type',     0.45, 'интерпретация контекста');
```

**Как используется при создании Fact:**
```sql
-- Берём confidence по (source, fact_type), fallback на (source, NULL)
SELECT confidence FROM weight_config
WHERE source_id = $source
  AND (fact_type = $fact_type OR fact_type IS NULL)
ORDER BY fact_type NULLS LAST
LIMIT 1;
```

#### interactions
```sql
id                  UUID PRIMARY KEY
relationship_id     UUID NOT NULL REFERENCES relationships(id)
interaction_type    TEXT NOT NULL    -- 'email' | 'meeting' | 'call' | 'intro'
occurred_at         TIMESTAMPTZ NOT NULL
metadata            JSONB            -- доп. контекст
created_at          TIMESTAMPTZ DEFAULT now()
```

> Используется для пересчёта `last_interaction_at` и `freshness_score`.
> В MVP заполняется вручную менеджером. В v2 — автоматически из внешних источников.
```sql
id              UUID PRIMARY KEY
project_id      UUID NOT NULL REFERENCES projects(id)
signals_hash    TEXT NOT NULL                 -- если совпадает с projects.signals_hash
                                              -- новый snapshot не создаётся
content         JSONB NOT NULL                -- заполненный шаблон отчёта
pdf_path        TEXT                          -- путь к сгенерированному PDF
status          TEXT DEFAULT 'draft'          -- draft | approved
created_at      TIMESTAMPTZ NOT NULL DEFAULT now()

UNIQUE(project_id, signals_hash)              -- идемпотентность
```

#### feedback_events
```sql
id              UUID PRIMARY KEY
user_id         UUID NOT NULL
entity_id       UUID
signal_id       UUID
reaction        TEXT NOT NULL                 -- thumbs_up | thumbs_down | suspicious
created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
```

#### jobs
```sql
id              UUID PRIMARY KEY
type            TEXT NOT NULL
                -- fetch | extract | snapshot | refresh
payload         JSONB NOT NULL
status          TEXT DEFAULT 'pending'
                -- pending | running | done | failed
attempts        INT DEFAULT 0
max_attempts    INT DEFAULT 3
error           TEXT
idempotency_key TEXT UNIQUE                   -- предотвращает дубли
scheduled_at    TIMESTAMPTZ DEFAULT now()
started_at      TIMESTAMPTZ
completed_at    TIMESTAMPTZ
created_at      TIMESTAMPTZ NOT NULL DEFAULT now()

INDEX idx_jobs_status_scheduled ON jobs(status, scheduled_at)
  WHERE status = 'pending'
```

#### pseudonym_mappings
```sql
id              UUID PRIMARY KEY
project_id      UUID NOT NULL REFERENCES projects(id)
token           TEXT NOT NULL                 -- PERSON_001, COMPANY_047
real_id         UUID NOT NULL
entity_type     TEXT NOT NULL                 -- person | company
created_at      TIMESTAMPTZ NOT NULL DEFAULT now()

UNIQUE(project_id, token)
UNIQUE(project_id, real_id, entity_type)
```

---

## 2. Job Pipeline

### Статусы джоба
```
pending → running → done
                 ↘ failed (после max_attempts)
```

### Жизненный цикл

```
1. Создание джоба
   INSERT INTO jobs (type, payload, idempotency_key)
   ON CONFLICT (idempotency_key) DO NOTHING
   → если conflict — джоб уже существует, пропускаем

2. Polling (каждые 5 сек)
   SELECT * FROM jobs
   WHERE status = 'pending'
     AND scheduled_at <= now()
   ORDER BY scheduled_at
   LIMIT 1
   FOR UPDATE SKIP LOCKED    ← не захватываем джобы которые уже берёт другой воркер

3. Захват джоба
   UPDATE jobs SET status = 'running', started_at = now(), attempts = attempts + 1
   WHERE id = $1

4. Выполнение
   Worker выполняет работу

5a. Успех
    UPDATE jobs SET status = 'done', completed_at = now()

5b. Ошибка, есть попытки
    UPDATE jobs
    SET status = 'pending',
        scheduled_at = now() + (attempts ^ 2) * interval '1 minute',
        error = $error
    WHERE id = $1
    → экспоненциальная задержка: 1 мин, 4 мин, 9 мин

5c. Ошибка, попытки исчерпаны
    UPDATE jobs SET status = 'failed', error = $error
    → алерт в Telegram администратору
```

### Идемпотентность
Каждый джоб создаётся с `idempotency_key`:
```
fetch:    {source_id}:{entity_id}:{date}
extract:  {observation_id}
snapshot: {project_id}:{signals_hash}
refresh:  {date}   ← один refresh в сутки
```

`ON CONFLICT DO NOTHING` гарантирует что один и тот же джоб не будет создан дважды.

### Цепочка джобов (Orchestrator — чистая архитектура)
Воркеры не триггерят следующий джоб напрямую.
Orchestrator polling сам решает что запустить следующим на основе статусов:

```
Fetch done → создаёт Extract джоб для каждого нового Observation
Extract done → создаёт Snapshot джоб если signals_hash изменился
Refresh done → создаёт Fetch джобы для изменившихся компаний
```

---

## 3. Pseudonymization Layer

### Режим: per-project mapping (Вариант Б)
Токены фиксированы на уровне проекта. PERSON_001 всегда один и тот же человек в рамках одного проекта. Маппинг хранится в таблице `pseudonym_mappings`.

### Алгоритм

**Перед отправкой в LLM:**
```python
def pseudonymize(text: str, project_id: str, db) -> tuple[str, dict]:
    # 1. Найти все известные сущности проекта
    mappings = db.query(
        "SELECT token, real_id, entity_type FROM pseudonym_mappings
         WHERE project_id = $1", project_id
    )

    # 2. Для новых сущностей — создать токены
    # (NER pre-pass для выявления имён в тексте)
    new_entities = extract_entities_fast(text)  # быстрый локальный NER
    for entity in new_entities:
        if entity not in mappings:
            token = generate_token(entity.type)  # PERSON_001, COMPANY_047
            db.insert(pseudonym_mappings, project_id, token, entity)
            mappings[entity] = token

    # 3. Заменить все вхождения в тексте
    pseudonymized_text = replace_all(text, mappings)
    return pseudonymized_text, mappings
```

**После получения ответа от LLM:**
```python
def depseudonymize(text: str, mappings: dict) -> str:
    # Обратная замена всех токенов на реальные значения
    for token, real_value in mappings.items():
        text = text.replace(token, real_value)
    return text
```

### Что заменяется
```
Person.full_name    → PERSON_001, PERSON_002, ...
Company.name        → COMPANY_001, COMPANY_002, ...
Phone numbers       → PHONE_001, ...
Email addresses     → EMAIL_001, ...
INN                 → INN_001, ...
```

### Где хранится маппинг
Таблица `pseudonym_mappings` в PostgreSQL. Маппинг живёт столько сколько живёт проект.

### Ограничение
LLM не может использовать внешние знания о конкретных людях и компаниях — он видит только токены. Это осознанный trade-off в пользу безопасности данных.

---

## 4. API Контракты

### 4.1 Extraction Service (Python FastAPI)

**POST /extract/pdf**
```
Request:
  multipart/form-data
  file: PDF binary
  project_id: string
  mode: "entities" | "report"   -- извлечь сущности или заполнить шаблон отчёта

Response 200:
{
  "persons": [
    {
      "name": "string",
      "role": "string",        -- должность
      "company": "string",     -- название компании
      "is_lpr": boolean,
      "is_lvr": boolean,
      "notes": "string"        -- комментарии из текста
    }
  ],
  "companies": [
    {
      "name": "string",
      "inn": "string | null"
    }
  ],
  "relationships": [
    {
      "from": "string",        -- имя человека или компании
      "to": "string",
      "type": "works_at | knows | participates_in | affiliated_with",
      "notes": "string"
    }
  ],
  "confidence": float,         -- общая оценка качества extraction
  "warnings": ["string"]       -- что AI не смог определить точно
}
```

**POST /extract/text**
```
Request:
{
  "text": "string",
  "project_id": "string",
  "mode": "entities" | "report"
}

Response: аналогично /extract/pdf
```

**POST /chat/complete**
```
Request:
{
  "project_id": "string",
  "messages": [
    {"role": "user" | "assistant", "content": "string"}
  ],
  "context": {              -- данные графа для контекста
    "persons": [...],
    "companies": [...],
    "relationships": [...]
  }
}

Response 200:
{
  "content": "string",
  "tokens_used": int
}
```

---

### 4.2 API Gateway → внутренние модули

**POST /api/projects**
```
Request:  { "name": string }
Response: { "id": uuid, "name": string, "status": string, "created_at": timestamp }
```

**POST /api/projects/:id/entities**
```
Request:
{
  "type": "company" | "person",
  "inn": "string",             -- для company
  "name": "string",            -- для person
  "role": "string"             -- роль в проекте
}
Response:
{
  "entity_id": uuid,
  "type": string,
  "enriched": boolean,         -- обогащено ли через DaData
  "data": { ... }
}
```

**GET /api/projects/:id/graph**
```
Response:
{
  "nodes": [
    { "id": uuid, "type": "person|company", "label": string, "tags": [...] }
  ],
  "edges": [
    { "from": uuid, "to": uuid, "type": string, "confidence": float }
  ]
}
```

**GET /api/graph/path?from=:id&to=:id**
```
Response:
{
  "shortest_path": {
    "path": [
      { "id": uuid, "type": string, "label": string, "relationship": string }
    ],
    "hops": int,
    "found": boolean
  },
  "weighted_path": {
    "path": [
      { "id": uuid, "type": string, "label": string, "relationship": string }
    ],
    "hops": int,
    "weight": float,      ← суммарный вес пути
    "found": boolean
  }
}
```

**POST /api/projects/:id/strategy**
```
Request:
{
  "target_company_id": uuid    -- компания к которой ищем вход
}

Response 200:
{
  "strategies": [
    {
      "rank": 1,
      "risk_level": "low" | "medium" | "high",
      "path": [
        {
          "id": uuid,
          "label": string,
          "type": "person" | "company",
          "relationship_to_next": string,
          "confidence": float,
          "source_url": string
        }
      ],
      "reasoning": string,      -- объяснение от LLM почему эта стратегия
      "hops": int
    }
  ],
  "generated_at": timestamp,
  "data_quality": float         -- средний confidence данных в графе
}
```
```
Response:
{
  "snapshot_id": uuid,
  "status": "created" | "skipped",  -- skipped если signals_hash не изменился
  "pdf_url": "string | null"
}
```

---

### 4.3 Telegram Bot команды → API Gateway

| Команда бота | API вызов |
|-------------|-----------|
| Создай проект X | POST /api/projects |
| Добавь компанию ИНН в проект X | POST /api/projects/:id/entities |
| Найди точку входа для X | GET /api/graph/path?from=our_network&to=:company_id |
| Кто ЛПР в проекте X | GET /api/projects/:id/entities?tag=lpr |
| Покажи связи по проекту X | GET /api/projects/:id/graph |
| Покажи отчёт по проекту X | POST /api/projects/:id/snapshot |
| Обнови данные по компании X | POST /api/jobs {type: "fetch", payload: {entity_id}} |

---

*Документ живой. Обновляется по ходу разработки.*
