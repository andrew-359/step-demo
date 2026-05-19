<script setup lang="ts">
import type { GraphEntity } from '@/pages/control-panel/model/connections'

defineProps<{
  entity: GraphEntity
}>()

const emit = defineEmits<{
  close: []
}>()

const kindLabels = {
  person: 'Персоналия',
  company: 'Компания',
  project: 'Проект',
} as const
</script>

<template>
  <div class="entity-preview-backdrop" @click.self="emit('close')">
    <article
      class="entity-preview"
      role="dialog"
      aria-modal="true"
      :aria-labelledby="`entity-${entity.id}`"
    >
      <header class="entity-preview__header">
        <span class="entity-preview__kind">{{ kindLabels[entity.kind] }}</span>
        <button
          class="entity-preview__close"
          type="button"
          aria-label="Закрыть"
          @click="emit('close')"
        >
          ×
        </button>
      </header>

      <h3 :id="`entity-${entity.id}`" class="entity-preview__title">
        {{ entity.title }}
      </h3>
      <p class="entity-preview__subtitle">{{ entity.subtitle }}</p>

      <dl class="entity-preview__meta">
        <div
          v-for="row in entity.meta"
          :key="row.label"
          class="entity-preview__row"
        >
          <dt>{{ row.label }}</dt>
          <dd>{{ row.value }}</dd>
        </div>
      </dl>
    </article>
  </div>
</template>
