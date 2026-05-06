<script setup lang="ts">
import {
  demoProtocol,
  nextSteps,
  selectedStrategy,
} from '@/pages/home/model/demoProtocol'
import {
  companyReferenceItems,
  type SidebarItem,
} from '@/pages/home/model/navigation'

const emit = defineEmits<{
  openReference: [section: SidebarItem]
}>()

function publicAsset(path: string) {
  return `${import.meta.env.BASE_URL}${path}`
}
</script>

<template>
  <article class="next-steps" aria-labelledby="next-steps-title">
    <div class="next-steps__content">
      <header class="next-steps__header">
        <h1 id="next-steps-title">Дальнейшие шаги</h1>
        <p>план действия · {{ demoProtocol.activeProject.company.name }}</p>
        <span v-if="selectedStrategy">
          {{ selectedStrategy.title }} · {{ nextSteps.length }} шага
        </span>
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

      <aside class="next-steps-reference" aria-label="Справка по компании">
        <div>
          <h2>Справка по компании</h2>
          <p>
            Перед контактом можно быстро проверить финансовое состояние,
            судебные риски и инфраструктуру проекта.
          </p>
        </div>
        <nav aria-label="Дополнительные разделы">
          <button
            v-for="item in companyReferenceItems"
            :key="item.section"
            type="button"
            @click="emit('openReference', item.section)"
          >
            {{ item.label }}
          </button>
        </nav>
      </aside>

      <aside class="next-steps-downloads" aria-label="Материалы по проекту">
        <div>
          <h2>Материалы</h2>
          <p>
            Готовые файлы для внутренней подготовки: короткий брифинг и письмо
            для запроса интро.
          </p>
        </div>
        <nav aria-label="Скачать материалы">
          <a :href="publicAsset('downloads/project-briefing.txt')" download>
            Скачать брифинг
          </a>
          <a :href="publicAsset('downloads/intro-letter.txt')" download>
            Скачать письмо
          </a>
        </nav>
      </aside>

      <p class="next-steps__footer">
        {{ demoProtocol.activeProject.company.name }} · Подготовлено:
        {{ demoProtocol.activeProject.preparedAt }}
      </p>
    </div>
  </article>
</template>
