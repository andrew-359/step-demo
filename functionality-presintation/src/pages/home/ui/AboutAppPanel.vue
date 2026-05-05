<script setup lang="ts">
const appSections = [
  {
    title: 'Функционал приложения',
    text: 'Приложение собирает, анализирует и формирует информацию о партнёрах: компаниях и персоналиях в них',
  },
  {
    title: 'Используемый стек технологий',
    text: 'Для поиска используются большие языковые модели и бизнес-алгоритмы, распределенные по модулям - для поиска, для сбора и для анализа информации',
  },
  {
    title: 'Конфиденциальность',
    text: 'Хранение информации реализовано при использовании современных защищенных протоколов безопасности баз данных, использующих разные виды и способы шифрования.\n\nИспользование информации внешними AI-сервисами реализовано через маскировку чувствительных данных специальными алгоритмами маскировки из внутреннего контура приложения (недоступны извне)',
  },
  {
    title: 'Контакты',
    text: 'По вопросам работы приложения и доступа к аналитическим материалам обратитесь к администратору внутреннего контура: app-support@example.local',
  },
]
</script>

<template>
  <section class="about-app" aria-labelledby="about-app-title">
    <header class="about-app__header">
      <p>информация о продукте</p>
      <h1 id="about-app-title">О приложении</h1>
    </header>

    <div class="about-app__content">
      <details
        v-for="(section, index) in appSections"
        :key="section.title"
        class="about-app-section"
        :open="index === 0"
      >
        <summary>
          <span>{{ section.title }}</span>
          <span aria-hidden="true"></span>
        </summary>
        <p>{{ section.text }}</p>
      </details>
    </div>
  </section>
</template>
