<script setup lang="ts">
const figures = [
  {
    name: ['Иван', 'Иванович'],
    role: 'Гендир. Company Name',
    inn: 'ИНН: 123456789012',
    period: 'с 20.11.2023',
    note: 'Массовый директор (5+ компаний, признак ФНС)',
    tone: 'warning',
  },
  {
    name: ['Петр', 'Петрович'],
    role: 'Генеральный директор Company Name',
    inn: 'ИНН: 123456789012',
    period: 'с 07.02.2023',
    note: 'Опытный менеджер Ford Russia 2000–2016',
    tone: 'success',
  },
  {
    name: ['Сергей', 'Сергеевич'],
    role: 'Гендир. Company Name',
    inn: 'ИНН: 123456789012',
    period: '2024–2025',
    note: 'Массовый директор (5+ компаний)',
    tone: 'warning',
  },
  {
    name: ['Алексей', 'Алексеевич'],
    role: 'Гендиректор Company Name',
    inn: 'ИНН: 123456789012',
    period: 'с 13.03.2022',
    note: 'Данные учредителей скрыты по ФЗ-129',
    tone: 'danger',
  },
]
</script>

<template>
  <article class="key-figures" aria-labelledby="key-figures-title">
    <header class="section-report-header">
      <h1 id="key-figures-title">Ключевые директора и менеджмент</h1>
      <p>справочная информация</p>
    </header>

    <div class="key-figures__body">
      <section class="key-figures__grid" aria-label="Ключевые фигуры">
        <article
          v-for="figure in figures"
          :key="figure.name.join(' ')"
          class="figure-card"
        >
          <div class="figure-card__top" aria-hidden="true"></div>
          <div class="figure-card__content">
            <h2>
              <span v-for="nameLine in figure.name" :key="nameLine">
                {{ nameLine }}
              </span>
            </h2>
            <div class="figure-card__accent" aria-hidden="true"></div>
            <p class="figure-card__role">{{ figure.role }}</p>
            <p class="figure-card__meta">{{ figure.inn }}</p>
            <p class="figure-card__meta">{{ figure.period }}</p>
            <p class="figure-card__note" :class="`figure-card__note--${figure.tone}`">
              {{ figure.note }}
            </p>
          </div>
        </article>
      </section>

      <p class="key-figures__source">Источники: ГЛОБАС, ЕГРЮЛ, Интерфакс</p>
    </div>
  </article>
</template>
