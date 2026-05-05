# Карта связей — Исследование: граф и алгоритмы поиска пути
## Как это делают в продакшне

> Источник: глубокое исследование по реальным production системам
> Релевантно для: Graph Layer, weighted path, выбор БД

---

## Главный вывод

**Выбор алгоритма и БД важен гораздо меньше чем дизайн функции весов.**

На масштабе 5–10к нод PostgreSQL с recursive CTE или pgRouting справляется отлично. NetworkX в Python — для application-level логики с кастомными весами. Настоящая инженерная задача — построить формулу которая точно отражает силу связи из сырых данных.

---

## Алгоритмы — что реально используют в продакшне

### Bidirectional BFS/Dijkstra — стандарт для социальных графов
LinkedIn использует именно это для "степеней связи". Поиск одновременно от источника и цели, встречаются посередине. Сложность O(b^(d/2)) вместо O(b^d). На практике: вместо 15M нод обходится ~50K.

### Widest Path (Maximum Bottleneck) — идеально для рукопожатий
Вместо минимизации суммарного веса — максимизация минимального веса на пути. Самое слабое звено определяет силу цепочки. **Это семантически правильнее для нашей задачи** — цепочка рукопожатий настолько сильна насколько сильна её слабейшая связь.

Реализация: для ненаправленного графа — это просто путь в максимальном остовном дереве. Строится один раз, запрашивается за O(длина пути).

### Yen's K-Shortest Paths — несколько альтернатив
Возвращает K путей в порядке возрастания стоимости. Нужен потому что теоретически оптимальный путь может быть недоступен (посредник отказывается представить). В NetworkX: `nx.shortest_simple_paths()`.

### Product-based strength — когда каждый решает сам
Если каждый человек независимо решает "передать ли" — сила пути = произведение весов рёбер. Для использования стандартного Dijkstra: `cost(e) = -log(w(e))`, минимизация суммы log-стоимостей = максимизация произведения весов.

---

## PostgreSQL — лучше чем кажется на нашем масштабе

### Recursive CTE
```sql
WITH RECURSIVE paths AS (
  SELECT source AS node, 0 AS cost, ARRAY[source] AS path
  FROM (VALUES (1)) AS start(source)
  UNION ALL
  SELECT e.target, p.cost + e.weight, p.path || e.target
  FROM paths p
  JOIN edges e ON e.source = p.node
  WHERE e.target != ALL(p.path)
)
SELECT * FROM paths WHERE node = @destination
ORDER BY cost ASC LIMIT 1;
```

Работает как brute-force — обходит все пути. Но с ограничением глубины (≤5 хопов) на 10к нод: **меньше 10ms для глубины 2, меньше 100ms для глубины 4**.

Alibaba Cloud benchmark: даже на 10 миллиардов нод с глубиной 3 — ответ за 7.9ms.

**Ограничение:** настоящий Dijkstra через CTE не реализуется — CTE append-only, нельзя держать priority queue.

### pgRouting — лучший вариант для weighted path в PostgreSQL
Оборачивает C++ реализацию Dijkstra из Boost.Graph. **Не требует геоданных** — работает для любых графов. Кастомные веса через SQL выражение:

```sql
SELECT * FROM pgr_dijkstra(
  'SELECT id, person_a AS source, person_b AS target,
          1.0 / relationship_strength AS cost
   FROM relationships',
  42, 999, false
);
```

На 10к нод и 100к рёбер: **единицы миллисекунд**. Единственный минус — зависимость от PostGIS.

### Apache AGE — пока не для продакшна
Добавляет Cypher запросы в PostgreSQL. Но **нет нативного weighted shortest path** — только hop-count. Для взвешенного пути придётся комбинировать с pgRouting. Загрузка данных через Cypher в 1000x медленнее чем через SQL INSERT.

---

## NetworkX — прагматичный выбор для нашего уровня

На 5–10к нод: **меньше 10ms Dijkstra**, ~10–50MB памяти.

### Кастомная функция весов — главное преимущество
```python
def relationship_cost(u, v, d):
    type_weights = {
        'friends': 0.5,
        'ex_colleagues': 0.8,
        'partners': 1.0,
        'colleagues': 2.0,
        'works_at': 5.0
    }
    type_factor = type_weights.get(d.get('rel_type'), 2.0)

    # Затухание по времени
    days_ago = (datetime.now() - d.get('last_interaction', datetime.now())).days
    recency_factor = math.exp(days_ago / 365.0)

    return type_factor * recency_factor

path = nx.dijkstra_path(G, source_id, target_id, weight=relationship_cost)
```

**Важно:** Dijkstra минимизирует стоимость — сильные связи должны иметь низкий вес. Сила связи инвертируется: `cost = 1/strength`.

### Паттерн для веб-сервиса
Граф загружается в память на старте, хранится как singleton, перестраивается по таймеру или webhook при изменении данных. С Gunicorn `--preload` граф строится один раз и шарится между воркерами через copy-on-write.

### Если NetworkX не справляется
- **igraph** — в 8–30x быстрее, похожий API
- **rustworkx** — Rust производительность с NetworkX совместимостью

---

## Дизайн функции весов — самая сложная часть

### RFM Framework — стандарт в продакшне
**40% Recency (свежесть) + 30% Frequency (частота) + 30% Depth/Intensity (глубина)**

### Экспоненциальное затухание — стандарт для свежести
```
W(t) = e^(-λt)
```
Практические значения λ:
- `1/30` — для быстрых продажных циклов (21-дневный полупериод)
- `1/90` — для длинных отношений (62-дневный полупериод)

Формула Box (production): `score = Σ wᵢ · e^(-λ(t - tᵢ))` где каждое взаимодействие вносит свой взвешенный вклад с учётом возраста.

### Рекомендуемая схема БД
```sql
-- Связи с предвычисленными весами
CREATE TABLE relationships (
  id SERIAL PRIMARY KEY,
  source_id INTEGER REFERENCES persons(id),
  target_id INTEGER REFERENCES persons(id),
  rel_type VARCHAR(50),
  weight DECIMAL(5,4),          -- предвычисленный составной вес
  created_at TIMESTAMP
);

-- История взаимодействий для пересчёта весов
CREATE TABLE interactions (
  id SERIAL PRIMARY KEY,
  relationship_id INTEGER REFERENCES relationships(id),
  interaction_type VARCHAR(50), -- 'email', 'meeting', 'call'
  occurred_at TIMESTAMP,
  metadata JSONB
);

-- Конфиг весов — не хардкодить!
CREATE TABLE weight_config (
  config_key VARCHAR(100) PRIMARY KEY,
  config_value DECIMAL(10,6),
  description TEXT,
  updated_at TIMESTAMP
);
```

### Конфиг весов — таблица в БД или YAML?
- **Таблица в БД** — когда веса нужно настраивать per-tenant или часто менять
- **YAML конфиг** — когда веса стабильны между деплоями

**Лучшая практика** (HubSpot, 4Degrees): квартальный ревью — сравниваем "сильные" связи по скорингу с реальными конверсиями, корректируем веса.

### Критический инсайт от production систем
**Простой частотный скоринг ошибочно идентифицирует ассистентов руководителей как сильные связи.** Production системы используют 20+ сигналов включая взаимность (двусторонняя vs односторонняя коммуникация), должность, тип встречи. У нас этой проблемы нет — данные вводятся вручную менеджером, не из email.

---

## PostgreSQL vs Neo4j — на нашем масштабе

### Реальные бенчмарки

**Tropology (222к страниц, 11.5М связей) мигрировал с Neo4j на PostgreSQL:**
- Импорт в 8x быстрее
- Запросы которые занимали 6+ секунд в Neo4j — меньше 300ms в PostgreSQL

**Разработчик knowledge graph <10к нод:** глубина-2 обходы меньше 10ms на recursive CTE. Вывод: "аргумент производительности для graph engine просто не существует на этом масштабе".

**University of Washington benchmark:** PostgreSQL выиграл у Neo4j в большинстве категорий. Преимущество Neo4j появляется **только на больших датасетах с глубокими джойнами более 5 таблиц**.

### Когда Neo4j оправдан
- Variable-length unbounded path queries (Cypher `[*1..10]`)
- Встроенные граф-алгоритмы (GDS: 65+ алгоритмов — PageRank, Louvain, Node2Vec)
- Граф вырастет больше 100к нод с требованиями глубокого обхода

### Стоимость
- PostgreSQL граф-фичи: **$0**
- Neo4j AuraDB Professional: **$65–85/месяц**
- Neo4j Enterprise (self-managed): **$15,000–25,000/год**
- Плюс операционная сложность: две БД для бэкапа, мониторинга, патчинга

### Альтернативы если захочется graph DB синтаксиса
- **ArangoDB** — мультимодельная (граф + документ + ключ-значение), Cycode выбрали её
- **Memgraph** — Cypher совместимость, in-memory C++ производительность

---

## Как это делают LinkedIn, Affinity, The Swarm

### LinkedIn (270 миллиардов рёбер)
Собственная БД LIquid, 4-е поколение. 20–40 серверов по 1TB+ RAM каждый, 2 миллиона запросов в секунду. Второстепенные сети (~50к entity на пользователя) кэшируются. Для выбора партиций — greedy set cover алгоритм, срезает latency у 50%+ запросов.

### Affinity (CRM для private capital)
1 миллиард+ data points, 30М людей, 7М организаций. Email + calendar + 40+ источников обогащения. Патентованный анализ силы связей. Находит "лучший путь для знакомства" через исторические паттерны взаимодействия.

### The Swarm (HubSpot Ventures)
Начинался как internal tool в Sequoia Capital для маппинга сетей портфельных компаний. AI детектирует пересечения по работе и образованию, база 500М профилей.

### Общий паттерн всех систем
```
Ingestion (email/calendar/LinkedIn)
  ↓
Entity Resolution (дедупликация контактов)
  ↓
Graph Construction (явные + инферированные связи)
  ↓
Relationship Scoring (20+ взвешенных сигналов)
  ↓
Bidirectional Path Search
```

---

## Выводы для нашей архитектуры

### Что меняем

**1. Widest Path вместо (или вместе с) Dijkstra**
Для рукопожатий семантически правильнее максимизировать минимальный вес пути. Реализация через максимальное остовное дерево — проще и быстрее.

**2. pgRouting для weighted path в PostgreSQL**
Вместо самописного CTE-Dijkstra. Правильный алгоритм, C++ производительность, кастомные веса через SQL.

**3. NetworkX в Extraction Service для сложных запросов**
Граф загружается в память, кастомная функция весов через callable. Перестройка по таймеру или при изменении данных.

**4. weight_config таблица в БД**
Веса типов связей — не хардкод в коде и не в concept.md, а конфигурируемая таблица. Позволяет менять без деплоя.

**5. interactions таблица**
Для хранения истории взаимодействий — основа для freshness_score. У нас `last_interaction_at` на relationship — достаточно для MVP.

### Что подтверждает наши решения

PostgreSQL без Neo4j — правильно на нашем масштабе. Confirmed by multiple production benchmarks.

Формула `type_score × strength × direction_penalty × freshness_score` — стандартный RFM подход, правильная основа.

Конфиг весов в таблице — industry best practice, не изобретаем велосипед.

NetworkX в Python микросервисе — именно так делают production системы этого класса.

---

*Исследование проведено перед началом разработки Graph Layer.*
