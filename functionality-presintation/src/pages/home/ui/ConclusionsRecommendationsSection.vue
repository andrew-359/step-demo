<script setup lang="ts">
import {
  demoProtocol,
  selectStrategy,
  selectedStrategy,
} from "@/pages/home/model/demoProtocol";

const conclusions = [
  {
    title: "КРИТ Финансовое состояние — критическое",
    text: "Накопленные убытки 32+ млрд руб. за 2022–2023 гг. Выручка упала с 355 до 25 млрд руб. (−93%). Обязательства превышают активы на 26,6 млрд руб.",
    tone: "critical",
  },
  {
    title: "КРИТ Бенефициар не раскрыт",
    text: "Единственный учредитель скрыт по ФЗ-129. Предположительно: Company Name через Company Name или Company Name (94,9%).",
    tone: "critical",
  },
  {
    title: "⚠ Управленческая нестабильность",
    text: "6 директоров за 3 года в Company Name. Иван Иванович — массовый директор (5+ компаний, признак ФНС).",
    tone: "warning",
  },
  {
    title: "OK Производство восстановлено",
    text: "Company Name (Шушары), Company Name (Калуга), Company Name (Каменка). Выручка холдинга 31 млрд руб. (2024).",
    tone: "ok",
  },
];

function getStrategyPath(pathId: string) {
  return demoProtocol.relationshipPaths.find((path) => path.id === pathId);
}
</script>

<template>
  <article class="recommendations" aria-labelledby="recommendations-title">
    <header class="section-report-header">
      <h1 id="recommendations-title">Выводы и рекомендации</h1>
      <p>оценка рисков заказчика — Company Name</p>
    </header>

    <div class="recommendations__body">
      <section class="recommendations__grid" aria-label="Ключевые выводы">
        <article
          v-for="conclusion in conclusions"
          :key="conclusion.title"
          class="recommendation-card"
          :class="`recommendation-card--${conclusion.tone}`"
        >
          <h2>{{ conclusion.title }}</h2>
          <p>{{ conclusion.text }}</p>
        </article>
      </section>

      <p class="recommendations__ok">
        OK&nbsp; Платёжеспособность удовлетворительная: Индекс ГЛОБАС 272/600 ·
        Дефолт 1,77% · Санкции — нет
      </p>

      <section class="entry-decision" aria-labelledby="entry-decision-title">
        <header class="entry-decision__header">
          <div>
            <p>выбор администратора</p>
            <h2 id="entry-decision-title">Стратегия входа</h2>
          </div>
          <span
            >Система предлагает маршруты. Администратор выбирает рабочий
            сценарий.</span
          >
        </header>

        <div class="entry-strategies" aria-label="Стратегии входа">
          <article
            v-for="strategy in demoProtocol.entryStrategies"
            :key="strategy.id"
            class="entry-strategy"
            :class="{ 'entry-strategy--selected': strategy.selected }"
          >
            <header class="entry-strategy__top">
              <div>
                <span>{{
                  strategy.selected ? "Рекомендовано" : `${strategy.risk} риск`
                }}</span>
                <h3>{{ strategy.title }}</h3>
              </div>
              <button type="button" @click="selectStrategy(strategy.id)">
                {{
                  strategy.selected ? "Текущая стратегия" : "Сделать рабочей"
                }}
              </button>
            </header>

            <p class="entry-strategy__description">
              {{ strategy.description }}
            </p>

            <dl
              v-if="getStrategyPath(strategy.pathId)"
              class="entry-strategy__facts"
            >
              <div>
                <dt>Путь</dt>
                <dd>
                  {{ getStrategyPath(strategy.pathId)?.path.join(" → ") }}
                </dd>
              </div>
              <div>
                <dt>Уверенность</dt>
                <dd>{{ getStrategyPath(strategy.pathId)?.confidence }}%</dd>
              </div>
              <div>
                <dt>Следующее действие</dt>
                <dd>{{ getStrategyPath(strategy.pathId)?.action }}</dd>
              </div>
            </dl>
          </article>
        </div>

        <p v-if="selectedStrategy" class="entry-decision__handoff">
          В дальнейшие шаги передан сценарий: {{ selectedStrategy?.title }}
        </p>
        <p v-else class="entry-decision__handoff entry-decision__handoff--pending">
          Выберите стратегию, чтобы сформировать дальнейшие шаги.
        </p>
      </section>

      <p class="recommendations__final">
        Рекомендация:
        {{ selectedStrategy?.description ?? 'стратегия входа пока не выбрана.' }}
        Предоплата и авансирование — не рекомендуются. Требовать банковскую
        гарантию.
      </p>
    </div>
  </article>
</template>
