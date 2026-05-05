<script setup lang="ts">
import { computed } from 'vue'

import { demoProtocol } from '@/pages/home/model/demoProtocol'

const preparationMetrics = computed(() => [
  {
    value: demoProtocol.activeProject.company.holdingCompanies,
    label: 'компаний в холдинге',
  },
  {
    value: demoProtocol.activeProject.company.revenue,
    label: 'выручка 2024, руб.',
  },
  {
    value: demoProtocol.activeProject.company.founded,
    label: 'год основания',
  },
  {
    value: demoProtocol.activeProject.company.employees,
    label: 'сотрудников (оценка)',
  },
])
</script>

<template>
  <article class="preparation-board" aria-labelledby="preparation-title">
    <div class="preparation-board__content">
      <p class="preparation-board__brand">
        {{ demoProtocol.activeProject.company.name }}
      </p>

      <header class="preparation-board__header">
        <h1 id="preparation-title">Подготовка к проекту</h1>
        <div class="preparation-board__summary">
          <p>{{ demoProtocol.activeProject.title }}</p>
          <p>{{ demoProtocol.activeProject.subtitle }}</p>
        </div>
        <div class="preparation-board__divider" aria-hidden="true">
          <span></span>
        </div>
        <dl class="preparation-board__meta">
          <div>
            <dt>Подготовлено</dt>
            <dd>{{ demoProtocol.activeProject.preparedBy }}</dd>
          </div>
          <div>
            <dt>Дата</dt>
            <dd>{{ demoProtocol.activeProject.preparedAt }}</dd>
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
