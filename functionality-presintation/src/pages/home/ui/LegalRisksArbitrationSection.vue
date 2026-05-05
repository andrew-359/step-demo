<script setup lang="ts">
const arbitrationRows = [
  {
    role: 'Ответчик (всего)',
    cases: '131',
    amount: '33 042 290 366',
  },
  {
    role: 'Ответчик (3 года)',
    cases: '17',
    amount: '16 067 732 305',
  },
  {
    role: 'Ответчик (12 мес.)',
    cases: '3',
    amount: '209 338',
  },
  {
    role: 'Истец (всего)',
    cases: '114',
    amount: '3 378 180 459',
  },
  {
    role: 'Истец (3 года)',
    cases: '43',
    amount: '1 553 216 972',
  },
  {
    role: 'Истец (12 мес.)',
    cases: '9',
    amount: '1 149 508 444',
  },
]

const riskFactors = [
  {
    level: 'КРИТ',
    text: 'Убытки 2 года подряд: −8,8 млрд (2022), −23,4 млрд (2023)',
    tone: 'critical',
  },
  {
    level: 'КРИТ',
    text: 'Обязательства превышают активы на 26,6 млрд руб.',
    tone: 'critical',
  },
  {
    level: 'КРИТ',
    text: 'Бенефициар скрыт по ФЗ-129 (единственный учредитель)',
    tone: 'critical',
  },
  {
    level: '⚠',
    text: 'Высокая частота смены директоров (6 за 3 года в Company Name)',
    tone: 'warning',
  },
  {
    level: '⚠',
    text: 'Иск на 15,57 млрд руб. по недвижимости (статус не определён)',
    tone: 'warning',
  },
  {
    level: 'ОК',
    text: 'Активных ИП 5 дел на ~90 тыс. руб. — несущественно',
    tone: 'ok',
  },
  {
    level: 'ОК',
    text: 'Оценка ГЛОБАС: ликвидность достаточна',
    tone: 'ok',
  },
]
</script>

<template>
  <article class="legal-risks" aria-labelledby="legal-risks-title">
    <header class="section-report-header">
      <h1 id="legal-risks-title">Судебный аспект. Риски, арбитраж</h1>
      <p>Company Name · анализ рисков</p>
    </header>

    <div class="legal-risks__body">
      <section class="legal-risks__panel" aria-label="Арбитражные дела">
        <h2>Арбитражные дела</h2>
        <table class="legal-risks-table">
          <thead>
            <tr>
              <th>Роль</th>
              <th>Дел</th>
              <th>Суммы исков (руб.)</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in arbitrationRows" :key="row.role">
              <td>{{ row.role }}</td>
              <td>{{ row.cases }}</td>
              <td>{{ row.amount }}</td>
            </tr>
          </tbody>
        </table>

        <section class="legal-risks__execution">
          <h3>Исполнительные производства</h3>
          <p>Всего: 7 801 производство · 348 646 502 руб.</p>
          <p>Активных: 5 дел · ~90 000 руб. в взыскании</p>
          <p>Индекс ГЛОБАС: 272/600</p>
          <p>Вероятность дефолта: 1,77% — низкая</p>
          <p>Санкционные флаги: не выявлены</p>
        </section>
      </section>

      <section class="legal-risks__panel" aria-label="Риск-факторы">
        <h2>Риск-факторы</h2>
        <div class="risk-list">
          <article
            v-for="risk in riskFactors"
            :key="risk.text"
            class="risk-item"
            :class="`risk-item--${risk.tone}`"
          >
            <strong>{{ risk.level }}</strong>
            <p>{{ risk.text }}</p>
          </article>
        </div>
      </section>
    </div>

    <p class="legal-risks__source">Источники: ГЛОБАС, kad.arbitr, ФССП</p>
  </article>
</template>
