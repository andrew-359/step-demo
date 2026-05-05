<script setup lang="ts">
const nextSteps = [
  {
    number: '01',
    status: 'Активно',
    text: 'Участвуем в тендере на земляные работы (сваи, ростверки)',
  },
  {
    number: '02',
    status: 'Ожидаем',
    text: 'Старт тендера на Генеральный подряд',
  },
  {
    number: '03',
    status: 'Требуется',
    text: 'Встреча на уровне Генерального директора Company Name',
  },
  {
    number: '04',
    status: 'В процессе',
    text: 'Встреча с генеральным директором Company Name',
  },
]
</script>

<template>
  <article class="next-steps" aria-labelledby="next-steps-title">
    <div class="next-steps__content">
      <header class="next-steps__header">
        <h1 id="next-steps-title">Дальнейшие шаги</h1>
        <p>план действия · Company Name</p>
      </header>

      <section class="next-steps__grid" aria-label="План действий">
        <article
          v-for="step in nextSteps"
          :key="step.number"
          class="next-step-card"
        >
          <strong>{{ step.number }}</strong>
          <span>{{ step.status }}</span>
          <p>{{ step.text }}</p>
        </article>
      </section>

      <p class="next-steps__footer">Company Name · Подготовлено: апрель 2026</p>
    </div>
  </article>
</template>
