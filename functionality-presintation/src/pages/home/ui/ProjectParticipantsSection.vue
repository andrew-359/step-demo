<script setup lang="ts">
const participants = [
  {
    company: ['Company Name'],
    role: 'Заказчик',
    contact: ['Иван Иванович', 'Генеральный директор'],
    inn: '123456789012',
    status: 'Действует',
  },
  {
    company: ['Company Name'],
    role: 'Инвестор',
    contact: ['Петр Петрович', 'Генеральный директор'],
    inn: '123456789012',
    status: 'Действует',
  },
  {
    company: ['Company Name', 'company.example'],
    role: 'Проектировщик (Стадии ПД и РД)',
    contact: ['Данные уточняются'],
    inn: '—',
    status: 'Действует',
  },
  {
    company: ['Company Name', 'company.example'],
    role: 'Технический заказчик',
    contact: ['Данные уточняются'],
    inn: '—',
    status: 'Действует',
  },
  {
    company: ['Company Name'],
    role: 'Генподрядчик (тендер)',
    contact: ['Команда проекта'],
    inn: '—',
    status: 'Участвует в тендере',
    statusTone: 'accent',
  },
]
</script>

<template>
  <article class="participants" aria-labelledby="participants-title">
    <header class="section-report-header">
      <h1 id="participants-title">Участники проекта</h1>
      <p>карта окружения проекта</p>
    </header>

    <div class="participants__body">
      <table class="participants-table">
        <thead>
          <tr>
            <th>Компания</th>
            <th>Роль</th>
            <th>Контактное лицо</th>
            <th>ИНН</th>
            <th>Статус</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="participant in participants" :key="participant.company[0]">
            <td>
              <p v-for="line in participant.company" :key="line">{{ line }}</p>
            </td>
            <td>{{ participant.role }}</td>
            <td>
              <p v-for="line in participant.contact" :key="line">{{ line }}</p>
            </td>
            <td>{{ participant.inn }}</td>
            <td :class="{ 'participants-table__status--accent': participant.statusTone === 'accent' }">
              {{ participant.status }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </article>
</template>
