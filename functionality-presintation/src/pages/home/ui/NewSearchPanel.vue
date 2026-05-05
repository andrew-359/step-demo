<script setup lang="ts">
import {
  demoProtocol,
  runDemoSearch,
  searchFlowSteps,
} from '@/pages/home/model/demoProtocol'

const emit = defineEmits<{
  openProtocol: []
}>()

function submitSearch() {
  runDemoSearch(demoProtocol.search.input)
}
</script>

<template>
  <section class="new-search-panel" aria-label="Новый поиск">
    <form class="new-search" role="search" @submit.prevent="submitSearch">
      <div class="new-search__control">
        <input
          id="inn-search"
          v-model="demoProtocol.search.input"
          class="new-search__input"
          type="search"
          placeholder="Поиск по ИНН"
          autocomplete="off"
          :disabled="demoProtocol.search.status === 'searching'"
        />
        <button
          class="new-search__button"
          type="submit"
          aria-label="Искать"
          :disabled="demoProtocol.search.status === 'searching'"
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            width="22"
            height="22"
            fill="none"
          >
            <path
              d="m20 20-4.2-4.2m2.2-5.3a7.5 7.5 0 1 1-15 0 7.5 7.5 0 0 1 15 0Z"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
            />
          </svg>
        </button>
      </div>
      <p class="new-search__status">
        {{ demoProtocol.search.lastNote }}
      </p>

      <div
        v-if="demoProtocol.search.status === 'searching'"
        class="search-progress"
        aria-live="polite"
      >
        <div
          v-for="(step, index) in searchFlowSteps"
          :key="step"
          class="search-progress__step"
          :class="{
            'search-progress__step--active': index === demoProtocol.search.activeStep,
            'search-progress__step--done': index < demoProtocol.search.activeStep,
          }"
        >
          <span>{{ index + 1 }}</span>
          <p>{{ step }}</p>
        </div>
      </div>

      <section
        v-if="demoProtocol.search.status === 'found' || demoProtocol.search.status === 'fallback'"
        class="search-result"
        aria-label="Результат поиска"
      >
        <div>
          <span>{{ demoProtocol.search.status === 'found' ? 'Найдено' : 'Демо-режим' }}</span>
          <h2>{{ demoProtocol.search.resultTitle }}</h2>
          <p>{{ demoProtocol.search.resultDescription }}</p>
        </div>
        <dl>
          <div
            v-for="stat in demoProtocol.search.resultStats"
            :key="stat"
          >
            <dd>{{ stat }}</dd>
          </div>
        </dl>
        <button type="button" @click="emit('openProtocol')">
          Открыть протокол
        </button>
      </section>
    </form>
  </section>
</template>
