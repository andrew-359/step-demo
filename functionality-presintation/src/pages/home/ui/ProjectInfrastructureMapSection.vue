<script setup lang="ts">
const infrastructureItems = [
  {
    name: 'Company Name',
    role: 'Управляющая компания',
    site: 'company.example',
    contact: 'Иван Иванович',
  },
  {
    name: 'Company Name',
    role: 'Заказчик',
    site: '—',
    contact: 'Петр Петрович',
  },
  {
    name: 'Company Name',
    role: 'Проектирование (П+РД)',
    site: 'company.example',
    contact: 'Сергей Сергеевич',
  },
  {
    name: 'Company Name',
    role: 'Технический заказчик',
    site: 'company.example',
    contact: 'Алексей Алексеевич',
  },
]
</script>

<template>
  <article class="infrastructure-map" aria-labelledby="infrastructure-map-title">
    <header class="section-report-header">
      <h1 id="infrastructure-map-title">Карта окружения проекта</h1>
      <p>участники и контакты</p>
    </header>

    <div class="infrastructure-map__body">
      <section class="infrastructure-map__grid" aria-label="Участники и контакты">
        <article
          v-for="item in infrastructureItems"
          :key="item.name"
          class="infrastructure-card"
        >
          <header class="infrastructure-card__header">
            <h2>{{ item.name }}</h2>
            <p>{{ item.role }}</p>
          </header>

          <dl class="infrastructure-card__details">
            <div>
              <dt>Сайт</dt>
              <dd>{{ item.site }}</dd>
            </div>
          </dl>

          <div class="infrastructure-card__contact">
            <p>Контактное лицо</p>
            <strong>{{ item.contact }}</strong>
          </div>
        </article>
      </section>
    </div>
  </article>
</template>
