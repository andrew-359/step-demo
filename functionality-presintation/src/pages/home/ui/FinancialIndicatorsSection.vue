<script setup lang="ts">
const indicators = [
  {
    value: '354 млрд',
    title: 'Выручка 2021',
    description: 'пиковое значение',
    tone: 'blue',
  },
  {
    value: '25,4 млрд',
    title: 'Выручка 2023',
    description: '−93% к 2021',
    tone: 'red',
  },
  {
    value: '31 млрд',
    title: 'Выручка холдинга 2024',
    description: 'восстановление',
    tone: 'green',
  },
  {
    value: '−23,4 млрд',
    title: 'Убыток 2023',
    description: 'критический показатель',
    tone: 'red',
  },
]

const financialRows = [
  {
    indicator: 'Выручка (руб.)',
    year2021: '354 791 318 000',
    year2022: '99 976 228 000',
    year2023: '25 438 515 000',
    trend: '▼ −93%',
    trendTone: 'negative',
  },
  {
    indicator: 'Чистая прибыль/убыток (руб.)',
    year2021: '44 793 046 000',
    year2022: '−8 902 708 000',
    year2023: '−23 412 768 000',
    trend: '▼ убыток',
    trendTone: 'negative',
  },
  {
    indicator: 'Активы (руб.)',
    year2021: '—',
    year2022: '—',
    year2023: '47 261 284 000',
    trend: '—',
  },
  {
    indicator: 'Обязательства (руб.)',
    year2021: '—',
    year2022: '—',
    year2023: '73 887 247 000',
    trend: '▲ > Активов',
    trendTone: 'warning',
  },
  {
    indicator: 'Кредиторская задолженность',
    year2021: '—',
    year2022: '—',
    year2023: '44 601 524 000',
    trend: '⚠ Высокая',
    trendTone: 'warning',
  },
  {
    indicator: 'Нераспределенная прибыль',
    year2021: '19 643 207 000',
    year2022: '32 477 932 000',
    year2023: '9 065 164 000',
    trend: '▼',
    trendTone: 'negative',
  },
]
</script>

<template>
  <article class="financials" aria-labelledby="financials-title">
    <header class="section-report-header">
      <h1 id="financials-title">Финансовые показатели</h1>
      <p>Company Name · 2021–2024</p>
    </header>

    <div class="financials__body">
      <section class="financials__cards" aria-label="Ключевые показатели">
        <article
          v-for="indicator in indicators"
          :key="indicator.title"
          class="financial-card"
          :class="`financial-card--${indicator.tone}`"
        >
          <strong>{{ indicator.value }}</strong>
          <h2>{{ indicator.title }}</h2>
          <p>{{ indicator.description }}</p>
        </article>
      </section>

      <div class="financials__table-wrap">
        <table class="financials-table">
          <thead>
            <tr>
              <th>Показатель</th>
              <th>2021</th>
              <th>2022</th>
              <th>2023</th>
              <th>Тренд</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in financialRows" :key="row.indicator">
              <td>{{ row.indicator }}</td>
              <td>{{ row.year2021 }}</td>
              <td>{{ row.year2022 }}</td>
              <td>{{ row.year2023 }}</td>
              <td :class="row.trendTone ? `financials-table__trend--${row.trendTone}` : undefined">
                {{ row.trend }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <p class="financials__source">Источники: ГЛОБАС, Audit-it, TAdviser</p>
    </div>
  </article>
</template>
