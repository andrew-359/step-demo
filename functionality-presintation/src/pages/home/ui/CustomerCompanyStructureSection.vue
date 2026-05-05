<script setup lang="ts">
const subsidiaries = [
  {
    name: 'Company Name',
    type: 'Капитал',
    inn: 'ИНН 123456789012',
    person: 'Иван Иванович',
    note: 'Торговля а/м',
  },
  {
    name: 'Company Name',
    type: 'Капитал',
    inn: 'ИНН 123456789012',
    person: 'Петр Петрович',
    note: 'Производство',
  },
  {
    name: 'Company Name',
    type: 'СПб, Каменка',
    inn: 'ИНН 123456789012',
    person: 'Сергей Сергеевич',
    note: 'Company Name',
  },
  {
    name: 'Company Name',
    type: 'СПб, Шушары',
    inn: 'ИНН 123456789012',
    person: 'Алексей Алексеевич',
    note: 'Производство',
    selected: true,
  },
  {
    name: 'Company Name',
    type: 'СПб',
    inn: 'ИНН 123456789012',
    person: 'Дмитрий Дмитриевич',
    note: 'Сервис/склад',
  },
  {
    name: 'Company Name',
    type: 'Капитал',
    inn: 'ИНН 123456789012',
    person: 'Николай Николаевич',
    note: 'Компоненты',
  },
]
</script>

<template>
  <article class="company-structure" aria-labelledby="company-structure-title">
    <header class="section-report-header">
      <h1 id="company-structure-title">Структура холдинга Company Name</h1>
      <p>корпоративная схема</p>
    </header>

    <div class="company-structure__body">
      <section class="company-structure__tree" aria-label="Корпоративная схема">
        <div class="company-structure__parent">
          <div class="company-structure__node company-structure__node--top">
            Company Name (материнская)<br />
            ИНН 123456789012 · Гендир.: Иван Иванович
          </div>
          <div class="company-structure__node company-structure__node--holding">
            Company Name (управляющая)<br />
            ИНН 123456789012 · Гендир.: Петр Петрович
          </div>
        </div>

        <div class="company-structure__connector" aria-hidden="true"></div>

        <div class="company-structure__children">
          <section
            v-for="company in subsidiaries"
            :key="company.name"
            class="company-card"
            :class="{ 'company-card--selected': company.selected }"
          >
            <h2>{{ company.name }}</h2>
            <div class="company-card__rule" aria-hidden="true"></div>
            <p>{{ company.type }}</p>
            <p>{{ company.inn }}</p>
            <strong>{{ company.person }}</strong>
            <p>{{ company.note }}</p>
          </section>
        </div>
      </section>

      <footer class="company-structure__footer">
        <div class="company-structure__legend">
          <span aria-hidden="true"></span>
          заказчик проекта
        </div>
        <p>
          Также в холдинге: Company Name (ИНН 123456789012) · Company Name
          ИТ-структура (ИНН 123456789012) · Итого компаний: 14
        </p>
        <p>Источники: ГЛОБАС (Credinform), ЕГРЮЛ / Rusprofile</p>
      </footer>
    </div>
  </article>
</template>
