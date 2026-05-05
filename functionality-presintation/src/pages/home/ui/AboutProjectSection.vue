<script setup lang="ts">
const projectDetails = [
  {
    title: 'Локация',
    lines: ['Шушары, Санкт-Петербург', 'ул. Автозаводская, 2'],
  },
  {
    title: 'Объект',
    lines: ['Company Name'],
  },
  {
    title: 'Инвестор',
    lines: ['Company Name', 'Иван Иванович'],
  },
  {
    title: 'Заказчик',
    lines: ['Company Name', 'Петр Петрович'],
  },
]
</script>

<template>
  <article class="about-project" aria-labelledby="about-project-title">
    <header class="about-project__header">
      <h1 id="about-project-title">О проекте</h1>
      <p>предпосылки и описание</p>
    </header>

    <div class="about-project__body">
      <section class="about-project__description" aria-label="Описание проекта">
        <h2>Описание проекта</h2>
        <div class="about-project__text">
          <p>
            Строительство производственного корпуса (цех сварки) на территории
            завода Company Name в Шушарах, Санкт-Петербург.
          </p>
          <p>
            Тендер разбит на 2 лота:<br />
            • Лот 1 — Земляные работы, сваи, ростверки<br />
            • Лот 2 — Возведение здания (до технологии)
          </p>
          <p>
            Завод Company Name — бывшая производственная площадка (Шушары). Ныне площадка для
            производства автомобилей Company Name.
          </p>
        </div>
      </section>

      <aside class="about-project__details" aria-label="Карточки проекта">
        <section
          v-for="detail in projectDetails"
          :key="detail.title"
          class="about-project-card"
        >
          <h2>{{ detail.title }}</h2>
          <p v-for="line in detail.lines" :key="line">{{ line }}</p>
        </section>
      </aside>
    </div>
  </article>
</template>
