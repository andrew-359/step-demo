<script setup lang="ts">
import { demoProtocol } from '@/pages/home/model/demoProtocol'
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
          <p
            v-for="paragraph in demoProtocol.activeProject.description"
            :key="paragraph"
          >
            {{ paragraph }}
          </p>
        </div>
      </section>

      <aside class="about-project__details" aria-label="Карточки проекта">
        <section
          v-for="detail in demoProtocol.activeProject.details"
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
