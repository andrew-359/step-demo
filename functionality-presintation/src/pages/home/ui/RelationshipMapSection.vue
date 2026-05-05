<script setup lang="ts">
const relationshipGroups = [
  {
    title: 'Company Name — Заказчик',
    rows: [
      {
        position: 'Ген. директор Company Name',
        contact: 'Иван Иванович',
        curator: '—',
        note: '',
      },
      {
        position: 'Ген. директор Company Name',
        contact: 'Петр Петрович',
        curator: 'Сергей Сергеевич / Алексей Алексеевич',
        note: '',
      },
      {
        position: 'Гл. специалист отдела закупок',
        contact: 'Дмитрий Дмитриевич',
        curator: 'Сергей Сергеевич',
        note: '',
      },
      {
        position: 'Нач. отдела закупок',
        contact: 'Николай Николаевич',
        curator: 'Сергей Сергеевич',
        note: '',
      },
      {
        position: 'Нач. отдела закупок пр. мат.',
        contact: 'Михаил Михайлович',
        curator: 'Сергей Сергеевич',
        note: '',
      },
    ],
  },
  {
    title: 'Company Name — Технический заказчик',
    rows: [
      {
        position: 'Генеральный директор',
        contact: 'Алексей Алексеевич',
        curator: '—',
        note: 'Ранее — AECOM',
      },
      {
        position: 'Руководитель строительства',
        contact: 'Владимир Владимирович',
        curator: '—',
        note: '',
      },
      {
        position: 'Менеджер по строительству',
        contact: 'Андрей Андреевич',
        curator: 'Сергей Сергеевич',
        note: '',
      },
    ],
  },
  {
    title: 'Company Name — Проектировщик (Стадии П+РД)',
    rows: [
      {
        position: 'Генеральный директор',
        contact: 'Павел Павлович',
        curator: '—',
        note: 'АЛМК, Северсталь, Слава, Интегра, ТМК',
      },
    ],
  },
]
</script>

<template>
  <article class="relationship-map" aria-labelledby="relationship-map-title">
    <header class="section-report-header">
      <h1 id="relationship-map-title">Матрица взаимодействия</h1>
      <p>кто взаимодействует со стороны проектной команды</p>
    </header>

    <div class="relationship-map__body">
      <table class="relationship-table">
        <thead>
          <tr>
            <th>Организация / должность</th>
            <th>Контактное лицо</th>
            <th>Куратор</th>
            <th>Примечание</th>
          </tr>
        </thead>
        <tbody>
          <template v-for="group in relationshipGroups" :key="group.title">
            <tr class="relationship-table__group">
              <td colspan="4">{{ group.title }}</td>
            </tr>
            <tr v-for="row in group.rows" :key="`${group.title}-${row.position}`">
              <td>{{ row.position }}</td>
              <td>{{ row.contact }}</td>
              <td>{{ row.curator }}</td>
              <td>{{ row.note }}</td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>
  </article>
</template>
