<script setup lang="ts">
const conclusions = [
  {
    title: 'КРИТ Финансовое состояние — критическое',
    text: 'Накопленные убытки 32+ млрд руб. за 2022–2023 гг. Выручка упала с 355 до 25 млрд руб. (−93%). Обязательства превышают активы на 26,6 млрд руб.',
    tone: 'critical',
  },
  {
    title: 'КРИТ Бенефициар не раскрыт',
    text: 'Единственный учредитель скрыт по ФЗ-129. Предположительно: Company Name через Company Name или Company Name (94,9%).',
    tone: 'critical',
  },
  {
    title: '⚠ Управленческая нестабильность',
    text: '6 директоров за 3 года в Company Name. Иван Иванович — массовый директор (5+ компаний, признак ФНС).',
    tone: 'warning',
  },
  {
    title: 'OK Производство восстановлено',
    text: 'Company Name (Шушары), Company Name (Калуга), Company Name (Каменка). Выручка холдинга 31 млрд руб. (2024).',
    tone: 'ok',
  },
]
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

      <p class="recommendations__final">
        Рекомендация: Предоплата и авансирование — не рекомендуются. Требовать
        банковскую гарантию. Идентифицировать бенефициара дополнительно.
      </p>
    </div>
  </article>
</template>
