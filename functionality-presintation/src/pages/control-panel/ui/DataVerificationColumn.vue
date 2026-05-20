<script setup lang="ts">
import { computed, watch } from 'vue'

import type { GraphCategoryId } from '@/pages/control-panel/model/connections'
import { graphEntities } from '@/pages/control-panel/model/graphMockData'
import {
  categoryLabelColor,
  getCategoryVerificationSummary,
  initVerificationForEntities,
  openVerificationCategory,
} from '@/pages/control-panel/model/verificationStore'

const verificationGroups: { id: GraphCategoryId; title: string }[] = [
  { id: 'persons', title: 'Люди' },
  { id: 'companies', title: 'Компании' },
  { id: 'projects', title: 'Проекты' },
]

const allGraphEntities = computed(() => Object.values(graphEntities))

watch(
  allGraphEntities,
  (entities) => {
    initVerificationForEntities(entities)
  },
  { immediate: true },
)

function labelColorForCategory(categoryId: GraphCategoryId) {
  return categoryLabelColor(getCategoryVerificationSummary(categoryId))
}
</script>

<template>
  <section class="meetings-board" aria-labelledby="verification-board-title">
    <header class="meetings-board__header">
      <h2 id="verification-board-title" class="meetings-board__title">
        Верификация данных
      </h2>
      <button
        class="meetings-board__menu"
        type="button"
        aria-label="Меню верификации"
      >
        ···
      </button>
    </header>

    <div class="meetings-board__cards">
      <button
        v-for="group in verificationGroups"
        :key="group.id"
        type="button"
        class="meetings-board__card"
        @click="openVerificationCategory(group.id)"
      >
        <span
          v-if="labelColorForCategory(group.id)"
          class="meetings-board__card-labels"
        >
          <span
            class="meetings-board__card-label"
            :class="`meetings-board__card-label--${labelColorForCategory(group.id)}`"
            :title="group.title"
          />
        </span>
        <span class="meetings-board__card-title">{{ group.title }}</span>
      </button>
    </div>
  </section>
</template>
