<script setup lang="ts">
const preparationMetrics = [
  {
    value: '14',
    label: 'компаний в холдинге',
  },
  {
    value: '31 млрд',
    label: 'выручка 2024, руб.',
  },
  {
    value: '1999',
    label: 'год основания',
  },
  {
    value: '~5 000',
    label: 'сотрудников (оценка)',
  },
]
</script>

<template>
  <article class="preparation-board" aria-labelledby="preparation-title">
    <div class="preparation-board__content">
      <p class="preparation-board__brand">Company Name</p>

      <header class="preparation-board__header">
        <h1 id="preparation-title">Подготовка к проекту</h1>
        <div class="preparation-board__summary">
          <p>Строительство цеха сварки</p>
          <p>Производственный корпус · Шушары, Санкт-Петербург</p>
        </div>
        <div class="preparation-board__divider" aria-hidden="true">
          <span></span>
        </div>
        <dl class="preparation-board__meta">
          <div>
            <dt>Подготовлено</dt>
            <dd>Company Name</dd>
          </div>
          <div>
            <dt>Дата</dt>
            <dd>апрель 2026</dd>
          </div>
        </dl>
      </header>

      <dl class="preparation-metrics">
        <div
          v-for="metric in preparationMetrics"
          :key="metric.label"
          class="preparation-metric"
        >
          <dt>{{ metric.label }}</dt>
          <dd>{{ metric.value }}</dd>
        </div>
      </dl>

      <p class="preparation-board__source">
        Источники данных: ГЛОБАС, Credinform, ЕГРЮЛ, открытые источники
      </p>
    </div>
  </article>
</template>
