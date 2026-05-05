<script setup lang="ts">
import { demoProtocol } from '@/pages/home/model/demoProtocol'
</script>

<template>
  <article class="relationship-map" aria-labelledby="relationship-map-title">
    <header class="section-report-header">
      <h1 id="relationship-map-title">Карта связей</h1>
      <p>цепочки входа к ЛПР/ЛВР без графовой визуализации</p>
    </header>

    <div class="relationship-map__body">
      <table class="relationship-table">
        <thead>
          <tr>
            <th>Путь</th>
            <th>Риск</th>
            <th>Уверенность</th>
            <th>Источник</th>
            <th>Действие</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="path in demoProtocol.relationshipPaths"
            :key="path.id"
          >
            <td>
              <strong>{{ path.title }}</strong>
              <span>{{ path.path.join(' → ') }}</span>
            </td>
            <td>{{ path.risk }}</td>
            <td>{{ path.confidence }}%</td>
            <td>{{ path.source }}</td>
            <td>{{ path.action }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </article>
</template>
